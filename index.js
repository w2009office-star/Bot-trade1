<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Cockroach Live</title>
<style>
  :root { --bg:#1b1f12; --card:#2a301b; --gold:#e8b84a; --paper:#fff8ee; --red:#b3202a; --ok:#6bbf59; }
  * { box-sizing:border-box; }
  html,body { margin:0; height:100%; background:var(--bg); color:var(--paper); font-family:Georgia,serif; }
  main { max-width:420px; margin:0 auto; padding:max(28px,env(safe-area-inset-top)) 20px 28px; display:flex; flex-direction:column; gap:14px; }
  h1 { font-style:italic; font-weight:400; color:var(--gold); margin:0; font-size:32px; }
  p.sub { margin:0 0 6px; opacity:.8; line-height:1.4; }
  label { display:flex; flex-direction:column; gap:6px; font-size:14px; }
  input { font:inherit; font-size:16px; padding:12px; border-radius:10px; border:1px solid #55603a; background:var(--card); color:var(--paper); }
  input:focus-visible, button:focus-visible { outline:3px solid var(--gold); outline-offset:2px; }
  #sw { margin:18px auto 4px; width:180px; height:180px; border-radius:50%; border:6px solid var(--gold);
        background:var(--red); color:var(--paper); font:inherit; font-size:36px; font-weight:700; }
  #sw.on { background:var(--ok); color:#10230a; }
  #sw:disabled { opacity:.6; }
  #msg { text-align:center; min-height:1.5em; }
  #game { position:fixed; inset:0; width:100%; height:100%; border:0; background:#000; display:none; }
  #pill { position:fixed; right:10px; top:max(10px,env(safe-area-inset-top)); z-index:5; display:none; font:inherit; font-size:15px;
          padding:8px 16px; border:0; border-radius:999px; background:rgba(179,32,42,.92); color:#fff; }
</style>
</head>
<body>
<main>
  <h1>Cockroach Live</h1>
  <p class="sub">Nyalakan untuk menghubungkan live TikTok-mu ke game kecoak.</p>
  <label>Alamat server <input id="server" inputmode="url" autocapitalize="off" placeholder="https://nama-app.up.railway.app"></label>
  <label>Username TikTok <input id="user" autocapitalize="off" placeholder="tanpa @"></label>
  <label>Kunci (kalau server memakai KEY) <input id="key" type="password" autocapitalize="off"></label>
  <button id="sw">OFF</button>
  <div id="msg" role="status"></div>
</main>
<iframe id="game" title="Game"></iframe>
<button id="pill">Matikan</button>
<script>
const $ = id => document.getElementById(id), K = 'cl-settings';
const saved = JSON.parse(localStorage.getItem(K) || '{}');
['server', 'user', 'key'].forEach(k => $(k).value = saved[k] || '');
let on = false, lock = null;
const base = () => { let s = $('server').value.trim().replace(/\/+$/, ''); if (s && !/^https?:\/\//.test(s)) s = 'http://' + s; return s; };
const say = t => $('msg').textContent = t;

async function api(path, body) {
  const r = await fetch(base() + path, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-key': $('key').value },
    body: JSON.stringify(body || {}) });
  if (r.status === 401) throw new Error('Kunci salah');
  if (!r.ok) throw new Error('Server menolak (' + r.status + ')');
}
function show(v) {
  on = v;
  $('sw').textContent = v ? 'ON' : 'OFF'; $('sw').classList.toggle('on', v);
