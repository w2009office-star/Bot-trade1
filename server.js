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
const path = require('path');
const file = (n) => (req, res) => res.sendFile(path.join(__dirname, n), (e) => e && res.status(404).end());
app.get('/', file('game.html'));
app.get('/music.mp3', file('music.mp3'));
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
