/* ---------- obby v2: obstacle course engine ---------- */
const OBH = 540, GRAV = 2300, JUMPV = 840, SPEED = 330, STEP = 1/120, SPRINGV = 1250;
const OB = {camY:0, active:false, ch:0, w:null, p:null, keys:{}, cam:0, t:0, acc:0, last:0, raf:0, paused:false, done:false, near:null, cp:null, stats:{deaths:0, coins:0, t:0}, msgT:0, bg:[], stars:[], parts:[], shake:0, flash:0};
const clampN = (v,a,b) => Math.max(a, Math.min(b, v));
const hit = (a,b) => a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
BADGES.push({id:'obby', name:'Course Clear', hint:'Finish an obstacle course', icon:'flame'});
const OB_COL = ['#ff2a2a','#ff9d2a','#ffc800','#4ade80','#2fe0d0','#4dabff','#b388ff','#ff6bb5'];

function genCourse(path, ch){
  const r = rng(dseed(path+':'+ch)*13 + 5), L = ch;
  const W = {plats:[], spikes:[], lasers:[], coins:[], gates:[], flags:[], springs:[], spawn:[], portal:null, end:0};
  let cid = 0, x = 0, y = 430;
  const solid = (px, py, pw, t) => { const o = {t:t||'s', x:px, y:py, w:pw, h:(t==='m'?22:46), st:0, tm:0}; W.plats.push(o); return o; };
  const coin = (cx, cy) => W.coins.push({id:cid++, x:cx, y:cy});
  solid(-400, y, 1000); x = 600; W.spawn.push({x:120, y, sec:0});
  for(let s=0; s<10; s++){
    const diff = L + s*0.35, n = 2 + Math.floor(L/3) + (s > 3 ? 1 : 0);
    const avail = ['gap','gap','stairs'];
    if(L > 0 || s >= 2) avail.push('spikes');
    if(L >= 1 && s >= 1) avail.push('mover');
    if(L >= 1 && s >= 1) avail.push('spring');
    if(L >= 2 && s >= 2) avail.push('crumble');
    if(L >= 4 && s >= 2) avail.push('pillars');
    if(L >= 3 && s >= 1) avail.push('laser');
    for(let k=0; k<n; k++){
      let type = avail[Math.floor(r()*avail.length)];
      if(y < 330) type = 'drop'; else if(type === 'spring' && y < 400) type = 'gap';
      if(type === 'gap'){
        let g = 70 + Math.min(100, diff*9); const nw = 150 + r()*110, ny = clampN(y + (r()*130 - 65), 260, 450); if(ny < y) g = Math.min(g, 125);
        const gx = x + g; solid(gx, ny, nw); coin(x + g/2, Math.min(y, ny) - 95); x = gx + nw; y = ny;
      } else if(type === 'drop'){
        const gx = x + 80, ny = Math.min(450, y + 120); solid(gx, ny, 220); coin(gx + 110, ny - 70); x = gx + 220; y = ny;
      } else if(type === 'stairs'){
        const dir = (y > 400) ? -1 : (r() < .5 ? -1 : 1);
        for(let q=0; q<3; q++){ const ny = clampN(y + dir*50, 260, 450), gx = x + 55; solid(gx, ny, 100); coin(gx + 50, ny - 55); x = gx + 100; y = ny; }
      } else if(type === 'spikes'){
        const two = L >= 3, gx = x + 60, w = two ? 660 : 480; solid(gx, y, w);
        W.spikes.push({x:gx + 230, y, w:90}); if(two) W.spikes.push({x:gx + 500, y, w:90});
        coin(gx + 275, y - 125); if(two) coin(gx + 545, y - 125); x = gx + w;
      } else if(type === 'mover'){
        const gapW = 280, mid = x + gapW/2, ax = (gapW - 130 - 30)/2;
        const m = solid(mid - 65, y, 130, 'm'); m.cx = mid; m.ax = ax; m.sp = 0.8 + Math.min(.6, diff*0.06); m.ph = r()*6; m.dx = 0;
        const gx = x + gapW; solid(gx, y, 240); coin(mid, y - 95); x = gx + 240;
      } else if(type === 'crumble'){
        let cx = x;
        for(let q=0; q<3; q++){ const gx = cx + 75; solid(gx, y, 110, 'c'); coin(gx + 55, y - 60); cx = gx + 110; }
        const gx = cx + 75; solid(gx, y, 170); x = gx + 170;
      } else if(type === 'laser'){
        const gx = x + 80, w = 440; solid(gx, y, w);
        W.lasers.push({x:gx + 220, y1:y - 190, y2:y, period:2.4 - Math.min(.8, L*.1), off:r()*2});
        coin(gx + 80, y - 40); coin(gx + w - 80, y - 40); x = gx + w;
      } else if(type === 'pillars'){
        let cx = x, py = y;
        for(let q=0; q<3; q++){ const gx = cx + 100, ny = clampN(py + (q%2 ? 35 : -35), 300, 450); solid(gx, ny, 130); coin(gx + 65, ny - 60); cx = gx + 130; py = ny; }
        const gx = cx + 100; solid(gx, py, 200); x = gx + 200; y = py;
      } else if(type === 'spring'){
        const gx = x + 70, w = 250; solid(gx, y, w); W.springs.push({x:gx + w - 80, y, w:50, t:0});
        const bx = gx + w + 150, ny = y - 190; solid(bx, ny, 230); coin(gx + w + 40, ny - 40); coin(bx + 115, ny - 60); x = bx + 230; y = ny;
      }
      if(k === Math.floor(n/2)){ const lp = W.plats[W.plats.length-1]; W.flags.push({x:lp.x + Math.min(40, lp.w/2), y:lp.y, sec:s}); }
    }
    const gx = x + 90, w = 340; solid(gx, y, w);
    W.gates.push({s, tx:gx + 70, ty:y, bx:gx + w - 60, open:isDone(ch*10 + s), anim:isDone(ch*10 + s) ? 1 : 0});
    W.spawn.push({x:gx + 20, y, sec:s+1}); x = gx + w;
  }
  const px = x + 120; solid(px, y, 320); W.portal = {x:px + 160, y}; W.end = px + 320;
  return W;
}
const openCount = () => { let n = 0; while(n < 10 && isDone(OB.ch*10 + n)) n++; return n; };
function obSpawn(){ const n = openCount(); let sp = OB.w.spawn[n]; if(OB.cp && OB.cp.sec >= n) sp = OB.cp; return sp; }
function obRespawn(){ const sp = obSpawn(); const p = OB.p; p.x = sp.x; p.y = sp.y - p.h; p.vx = 0; p.vy = 0; p.onGround = false; p.ride = null; p.dead = 0;
  OB.w.plats.forEach(o => { if(o.t === 'c'){ o.st = 0; o.tm = 0; } }); OB.cam = p.x - 160; }
function obBurst(x, y, n, col, sp, up){ for(let i=0; i<n; i++){ const a = Math.random()*6.283, v = (.3 + Math.random())*sp; OB.parts.push({x:x, y:y, vx:Math.cos(a)*v, vy:Math.sin(a)*v - (up||0), life:.5 + Math.random()*.5, max:1, c:col, s:2 + Math.random()*3}); } }
function obDie(){
  const p = OB.p; if(p.dead > 0) return;
  p.dead = .55; OB.stats.deaths++; sfx('bad'); OB.flash = .45; OB.shake = .35; obBurst(p.x + p.w/2, p.y + p.h/2, 26, '#ff4b3a', 380, 120);
}
function obSolids(){
  const out = OB.w.plats.filter(o => !(o.t === 'c' && o.st === 2));
  OB.w.gates.forEach(g => { if(!g.open) out.push({x:g.bx, y:g.ty - 180, w:24, h:180, bar:true}); });
  return out;
}
function startCourse(ch){
  if(!gameOn()) return;
  const ni = nextIdx(); if(!(ni === -1 || ni >= ch*10)) { toast('Finish the earlier levels first'); return; }
  OB.ch = ch; OB.w = genCourse(S.path, ch); OB.cp = null; OB.t = 0; OB.acc = 0; OB.stats = {deaths:0, coins:0, t:0}; OB.done = false; OB.paused = false; OB.keys = {}; OB.flash = 0; OB.shake = 0; OB.parts = [];
  OB.p = {x:0, y:0, w:28, h:52, vx:0, vy:0, onGround:false, coyote:0, buf:0, face:1, ride:null, dead:0, land:0, air:0};
  obRespawn(); OB.camY = clampN(OB.p.y - 230, 0, 110);
  const r = rng(ch*99 + 3); OB.bg = []; for(let bx=-200; bx < OB.w.end*0.4 + 2400;){ const bw = 70 + r()*90, bh = 120 + r()*260; OB.bg.push({x:bx, w:bw, h:bh, win:Array.from({length:14}, () => [r(), r(), r() > .6])}); bx += bw + 10 + r()*30; }
  obBuildArt(ch);
  const M = MISSIONS[P_().chapters[ch]], W = OB.w;
  const ticks = W.gates.map(g => `<i class="tk2" data-s="${g.s}" style="left:${(g.tx/W.end*100).toFixed(1)}%"></i>`).join('');
  const el = document.getElementById('obby');
  el.innerHTML = `<div class="ob"><canvas id="obc"></canvas>
    <div class="ob-hud"><button class="xbtn" data-act="obquit" aria-label="Leave course">${ic('x',22)}</button><span class="ob-chip">${esc(M[0])}</span><span class="ob-chip">Terminal <b id="obs">1</b>/10</span><span class="ob-chip" style="color:var(--gold)">${ic('coin',18)}<b id="obcoin">0</b></span><span class="ob-chip">Falls <b id="obd">0</b></span><span class="ob-chip nxt" id="obg"></span><span class="grow"></span><button class="xbtn" data-act="obpause" aria-label="Pause">${ic('clock',22)}</button></div>
    <div class="ob-prog" aria-hidden="true"><i id="obpi"></i>${ticks}</div>
    <div class="ob-help">Arrows or A/D to move · Space to jump · E at a terminal · R to retry from checkpoint</div><div class="ob-msg" id="obm"></div>
    <div class="ob-ctl"><div class="ob-lr"><button data-hold="left" aria-label="Move left"><span style="display:inline-block;transform:rotate(180deg)">${ic('arrow',32)}</span></button><button data-hold="right" aria-label="Move right">${ic('arrow',32)}</button></div>
    <div class="ob-ar"><button class="act" id="obA" data-act="obact" hidden>HACK</button><button class="jump" data-hold="jump" aria-label="Jump">JUMP</button></div></div>
    <div class="ob-panel" id="obp" hidden></div></div>`;
  el.classList.add('on'); document.body.style.overflow = 'hidden';
  OB.cv = document.getElementById('obc'); OB.g = OB.cv.getContext('2d');
  OB.active = true; OB.last = performance.now(); cancelAnimationFrame(OB.raf); OB.raf = requestAnimationFrame(obLoop);
  obMsg(openCount() === 0 ? 'Run right. Reach the glowing terminal and press E to hack it' : 'Welcome back, agent', 4000);
}
function stopCourse(){ OB.active = false; cancelAnimationFrame(OB.raf); const el = document.getElementById('obby'); el.classList.remove('on'); el.innerHTML = ''; if(!V.player) document.body.style.overflow = ''; save(); }
function quitCourse(){ stopCourse(); render(); }
function obMsg(t, ms){ const m = document.getElementById('obm'); if(!m) return; m.textContent = t; m.style.display = 'block'; OB.msgT = performance.now() + (ms || 2500); }
function obPause(on){
  OB.paused = on; const pn = document.getElementById('obp'); if(!pn) return;
  if(on){ pn.hidden = false; pn.innerHTML = `<div class="card" style="text-align:center;max-width:360px"><h2>Paused</h2><div class="stack"><button class="btn red block" data-act="obresume">Resume</button><button class="btn block" data-act="obquit">Leave course</button></div></div>`; }
  else { pn.hidden = true; OB.last = performance.now(); }
}
function obResume(){
  if(!OB.active) return;
  OB.keys = {}; let opened = false;
  OB.w.gates.forEach(g => { const was = g.open; g.open = isDone(OB.ch*10 + g.s); if(!was && g.open){ opened = true; obBurst(g.tx, g.ty - 40, 30, '#4ade80', 300, 200); } });
  if(opened){ sfx('win'); obMsg(chDone(OB.ch) ? 'Final gate open! Reach the exit portal' : 'Terminal hacked. The gate is open, keep running', 3200); }
  OB.last = performance.now();
}
function obAct(){
  if(!OB.active || V.player || OB.paused || OB.done) return;
  const g = OB.near; if(!g) return;
  openLesson(OB.ch*10 + g.s);
}
function obFinish(){
  if(OB.done) return; OB.done = true;
  const key = S.path+':'+OB.ch, first = !S.courses[key], st = OB.stats;
  const best = S.courses[key];
  if(first){ S.courses[key] = {t:Math.round(st.t), deaths:st.deaths}; S.coins += 20; grant('obby'); }
  else if(st.t < best.t) S.courses[key].t = Math.round(st.t);
  sfx('win'); confetti(); save();
  const nextOk = OB.ch < 7, pn = document.getElementById('obp'); pn.hidden = false;
  pn.innerHTML = `<div class="card" style="text-align:center;max-width:420px"><span class="label">Course complete</span><h1 style="margin:6px 0">${esc(MISSIONS[P_().chapters[OB.ch]][0])}</h1>
    <div class="score3" style="margin:14px auto"><div><span class="label">Time</span><b>${Math.round(st.t)}s</b></div><div><span class="label">Falls</span><b>${st.deaths}</b></div><div><span class="label">Coins</span><b style="color:var(--gold)">${st.coins}</b></div></div>
    ${first ? '<p style="color:var(--gold)">First clear bonus: +20 coins</p>' : ''}<div class="stack">${nextOk ? `<button class="btn red block" data-act="obnext" data-ch="${OB.ch+1}">Next level</button>` : ''}<button class="btn block" data-act="obquit">Back to missions</button></div></div>`;
}
