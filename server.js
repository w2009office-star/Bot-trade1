// Server: dengar event TikTok LIVE -> kirim ke game lewat WebSocket.
// Bisa di-ON/OFF lewat API (dipakai oleh APK) atau langsung: node server.js namatiktok
const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const T = require('tiktok-live-connector');

const PORT = process.env.PORT || 3000;
const KEY = process.env.KEY || ''; // opsional: kunci supaya orang lain tidak bisa ON/OFF
const AUTO = (process.env.TIKTOK_USERNAME || process.argv[2] || '').replace('@', '');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.set({ 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type,x-key',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS' });
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
app.use(express.static('public'));
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const broadcast = (d) => {
  const m = JSON.stringify(d);
  wss.clients.forEach((c) => c.readyState === 1 && c.send(m));
};
const nm = (d) => d.uniqueId || (d.user && d.user.uniqueId) || d.nickname || 'penonton';

/* ---------- koneksi TikTok (ON/OFF) ---------- */
const Conn = T.WebcastPushConnection || T.TikTokLiveConnection;
let live = null, user = '', wanted = false, retry = null, state = 'off'; // off | connecting | on

function drop(c) { c.removeAllListeners(); c.on('error', () => {}); try { c.disconnect(); } catch (e) {} }
function stop() {
  wanted = false; clearTimeout(retry);
  if (live) { drop(live); live = null; }
  state = 'off'; broadcast({ type: 'status', on: false });
  console.log('Siaran interaktif OFF');
}
function start(u) {
  stop(); user = u.replace('@', '').trim(); wanted = true;
  broadcast({ type: 'reset' }); connect();
}
function connect() {
  if (!wanted) return;
  state = 'connecting';
  const c = new Conn(user); live = c;
  const again = (ms) => { if (live !== c || !wanted) return; state = 'connecting'; drop(c); retry = setTimeout(connect, ms); };
  c.connect()
    .then(() => { if (live === c) { state = 'on'; broadcast({ type: 'status', on: true }); console.log(`ON: terhubung ke @${user}`); } })
    .catch((e) => { console.error('Gagal terhubung (apakah sedang LIVE?):', e.message || e); again(15000); });
  c.on('member', (d) => broadcast({ type: 'join', name: nm(d) }));
  c.on('chat', (d) => broadcast({ type: 'join', name: nm(d) })); // jaga-jaga kalau event masuk terlewat
  c.on('gift', (d) => {
    if (d.giftType === 1 && !d.repeatEnd) return; // gift beruntun: proses sekali saat selesai
    broadcast({ type: 'gift', name: nm(d), gift: d.giftName });
  });
  c.on('disconnected', () => again(10000));
  c.on('streamEnd', () => again(10000));
  c.on('error', (e) => console.error('Error:', e && e.message ? e.message : e));
}

/* ---------- API untuk APK ---------- */
const auth = (req, res, next) => (KEY && req.get('x-key') !== KEY ? res.status(401).json({ error: 'key' }) : next());
app.post('/api/start', auth, (req, res) => {
  const u = String((req.body && req.body.user) || '').trim();
  if (!u) return res.status(400).json({ error: 'user' });
  start(u); res.json({ ok: true });
});
app.post('/api/stop', auth, (req, res) => { stop(); res.json({ ok: true }); });
app.get('/api/status', (req, res) => res.json({ state, user }));

server.listen(PORT, () => {
  console.log(`Game: http://localhost:${PORT}  (mode uji: /?demo)`);
  if (AUTO) start(AUTO);
});
