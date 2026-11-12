
/* physics */
function obStepPhys(dt){
  const p = OB.p, W = OB.w, K = OB.keys; OB.t += dt; OB.stats.t += dt;
  W.plats.forEach(m => {
    if(m.t === 'm'){ const nx = m.cx + Math.sin(OB.t*m.sp + m.ph)*m.ax - m.w/2; m.dx = nx - m.x; m.x = nx; }
    else if(m.t === 'c'){ if(m.st === 1){ m.tm -= dt; if(m.tm <= 0){ m.st = 2; m.tm = 2.4; } } else if(m.st === 2){ m.tm -= dt; if(m.tm <= 0){ m.st = 0; } } }
  });
  W.springs.forEach(sp => { if(sp.t > 0) sp.t -= dt; });
  W.gates.forEach(g => { const to = g.open ? 1 : 0; g.anim += (to - g.anim)*Math.min(1, dt*6); });
  OB.parts.forEach(q => { q.life -= dt; q.x += q.vx*dt; q.y += q.vy*dt; q.vy += 900*dt; }); OB.parts = OB.parts.filter(q => q.life > 0);
  if(p.dead > 0){ p.dead -= dt; if(p.dead <= 0) obRespawn(); return; }
  if(p.ride && p.ride.dx) p.x += p.ride.dx;
  const dir = (K.right ? 1 : 0) - (K.left ? 1 : 0), target = dir*SPEED, acc = p.onGround ? 3400 : 2400;
  if(p.vx < target) p.vx = Math.min(target, p.vx + acc*dt); else if(p.vx > target) p.vx = Math.max(target, p.vx - acc*dt);
  if(dir) p.face = dir;
  p.coyote = p.onGround ? .12 : p.coyote - dt;
  if(K.jumpPressed){ p.buf = .14; K.jumpPressed = false; }
  p.buf -= dt;
  if(p.buf > 0 && p.coyote > 0){ p.vy = -JUMPV; p.coyote = 0; p.buf = 0; p.onGround = false; sfx('click'); obBurst(p.x + p.w/2, p.y + p.h, 6, '#bbb', 120, 40); }
  if(p.vy >= 0) p.sprung = false; if(!K.jump && !p.sprung && p.vy < -260) p.vy += 3400*dt;
  p.vy = Math.min(1200, p.vy + GRAV*dt);
  const solids = obSolids();
  p.x += p.vx*dt;
  solids.forEach(s => { if(hit(p, s)){ if(p.vx > 0 || (p.vx === 0 && p.x + p.w/2 < s.x + s.w/2)) p.x = s.x - p.w; else p.x = s.x + s.w; p.vx = 0; } });
  p.y += p.vy*dt; const wasGround = p.onGround, fall = p.vy; p.onGround = false; p.ride = null;
  solids.forEach(s => {
    if(hit(p, s)){
      if(p.vy >= 0){ p.y = s.y - p.h; p.vy = 0; p.onGround = true; if(!s.bar) p.ride = s; if(s.t === 'c' && s.st === 0){ s.st = 1; s.tm = .45; } if(!wasGround){ p.land = .14; if(fall > 500) obBurst(p.x + p.w/2, p.y + p.h, 8, '#ccc', 150, 50); } }
      else { p.y = s.y + s.h; p.vy = 0; }
    }
  });
  if(p.land > 0) p.land -= dt;
  if(p.onGround && Math.abs(p.vx) > 200 && Math.random() < dt*14) obBurst(p.x + p.w/2 - p.face*8, p.y + p.h, 1, '#999', 60, 20);
  W.springs.forEach(sp => { if(p.onGround && Math.abs(p.y + p.h - sp.y) < 4 && p.x + p.w > sp.x && p.x < sp.x + sp.w){ p.vy = -SPRINGV; p.sprung = true; p.onGround = false; p.coyote = 0; sp.t = .3; sfx('good'); obBurst(sp.x + sp.w/2, sp.y, 14, '#ffc800', 220, 160); } });
  const body = {x:p.x + 4, y:p.y + 4, w:p.w - 8, h:p.h - 6};
  if(!S.assist){
    W.spikes.forEach(sp => { if(hit(body, {x:sp.x + 5, y:sp.y - 24, w:sp.w - 10, h:24})) obDie(); });
    W.lasers.forEach(l => { const on = ((OB.t + l.off) % l.period) < l.period*.5; if(on && hit(body, {x:l.x - 4, y:l.y1, w:8, h:l.y2 - l.y1})) obDie(); });
  }
  if(p.y > 585) obDie();
  W.coins.forEach(c => { const k = S.path+':'+OB.ch+':'+c.id; if(!S.obbyCoins[k] && hit(p, {x:c.x - 14, y:c.y - 14, w:28, h:28})){ S.obbyCoins[k] = true; S.coins++; OB.stats.coins++; sfx('coin'); obBurst(c.x, c.y, 8, '#ffc800', 160, 80); save(); } });
  W.flags.forEach(f => { if(hit(p, {x:f.x - 10, y:f.y - 70, w:30, h:70}) && !(OB.cp && OB.cp.x === f.x)){ OB.cp = {x:f.x, y:f.y, sec:f.sec}; obMsg('Checkpoint saved. Press R to retry from here', 1800); sfx('good'); obBurst(f.x + 10, f.y - 50, 12, '#4ade80', 200, 100); } });
  OB.near = null;
  W.gates.forEach(g => { if(p.onGround && Math.abs(p.y + p.h - g.ty) < 6 && Math.abs(p.x + p.w/2 - g.tx) < 60) OB.near = g; });
  const po = W.portal; if(po && hit(p, {x:po.x - 30, y:po.y - 100, w:60, h:100})){ if(chDone(OB.ch)) obFinish(); else obMsg('Hack every terminal to open the exit', 2000); }
}

/* drawing */
function obChar(g, p){
  const e = S.equip, o = OUT[e.outfit] || OUT['out-field'], skin = e.skin, hc = e.hairColor;
  const run = Math.abs(p.vx) > 40 && p.onGround, ph = run ? OB.t*16 : 0, sw = run ? Math.sin(ph) : 0, air = !p.onGround;
  const sq = p.land > 0 ? 1 - p.land*.9 : 1, st = air ? (p.vy < 0 ? 1.12 : .95) : 1;
  g.save(); g.translate(p.x + p.w/2, p.y + p.h); g.scale(p.face*(2-sq)*.5 + p.face*.5, sq*st); g.rotate(clampN(p.vx/SPEED, -1, 1)*.1);
  const limb = (x, y, w, h, ang, col) => { g.save(); g.translate(x, y); g.rotate(ang); g.fillStyle = col; g.fillRect(-w/2, 0, w, h); g.restore(); };
  const bob = run ? Math.abs(Math.sin(ph))*-2 : 0;
  limb(-5, -16 + bob, 8, 17, air ? -.5 : sw*.8, '#1a1a1a'); limb(5, -16 + bob, 8, 17, air ? .4 : -sw*.8, '#111');
  limb(-12, -33 + bob, 6, 17, air ? -2.3 : -sw*.9, skin); 
  g.fillStyle = o[0]; g.beginPath(); g.roundRect ? g.roundRect(-12, -36 + bob, 24, 24, 5) : g.rect(-12, -36 + bob, 24, 24); g.fill();
  g.fillStyle = o[1]; g.fillRect(-2, -36 + bob, 4, 24);
  limb(12, -33 + bob, 6, 17, air ? 2.3 : sw*.9, skin);
  g.fillStyle = skin; g.beginPath(); g.arc(0, -44 + bob, 10, 0, 7); g.fill();
  if(e.hair === 'long'){ g.fillStyle = hc; g.fillRect(-11, -50 + bob, 7, 24); }
  g.fillStyle = hc; g.beginPath(); g.arc(0, -46 + bob, 10.5, Math.PI*1.02, Math.PI*1.98); g.fill();
  if(e.hair === 'curly'){ g.beginPath(); g.arc(-8, -50 + bob, 5, 0, 7); g.arc(0, -55 + bob, 6, 0, 7); g.arc(8, -50 + bob, 5, 0, 7); g.fill(); }
  if(e.hair === 'bun'){ g.beginPath(); g.arc(0, -57 + bob, 5, 0, 7); g.fill(); }
  g.fillStyle = '#000'; g.fillRect(3, -45 + bob, 2.5, 3);
  if(e.acc === 'acc-shades' || e.acc === 'acc-visor'){ g.fillStyle = e.acc === 'acc-visor' ? '#ff2a2a' : '#000'; g.fillRect(-1, -47 + bob, 12, 5); }
  if(e.acc === 'acc-mask'){ g.fillStyle = '#000'; g.fillRect(-9, -47 + bob, 20, 5); }
  if(e.acc === 'acc-hat'){ g.fillStyle = '#222'; g.fillRect(-14, -53 + bob, 28, 4); g.fillRect(-8, -61 + bob, 16, 9); }
  if(e.acc === 'acc-ear'){ g.fillStyle = '#ff2a2a'; g.beginPath(); g.arc(-9, -43 + bob, 2.5, 0, 7); g.fill(); }
  g.restore();
}
function obHud(){
  const s = document.getElementById('obs'); if(!s) return;
  const sec = Math.min(10, openCount() + 1); if(s.textContent !== String(sec)) s.textContent = sec;
  document.getElementById('obcoin').textContent = OB.stats.coins; document.getElementById('obd').textContent = OB.stats.deaths;
  const a = document.getElementById('obA'); if(a) a.hidden = !OB.near;
  const W = OB.w, p = OB.p, pi = document.getElementById('obpi'); if(pi) pi.style.width = clampN(p.x/W.end*100, 0, 100).toFixed(1) + '%';
  document.querySelectorAll('.tk2').forEach(t => t.classList.toggle('on', W.gates[+t.dataset.s].open));
  const nx = W.gates.find(g => !g.open), gi = document.getElementById('obg');
  if(gi){ gi.textContent = nx ? (nx.tx > p.x ? 'Next terminal: ' + Math.max(0, Math.round((nx.tx - p.x)/100)) + ' m →' : 'Terminal behind you ←') : (chDone(OB.ch) ? 'Go to the exit portal →' : 'All gates open'); }
  const m = document.getElementById('obm');
  if(OB.near && !OB.done){ m.style.display = 'block'; m.textContent = 'Press E or tap HACK: ' + lname(OB.near.s) + (OB.near.open ? ' (replay)' : ''); OB.msgT = performance.now() + 200; }
  else if(performance.now() > OB.msgT) m.style.display = 'none';
}
function obLoop(ts){
  if(!OB.active) return;
  OB.raf = requestAnimationFrame(obLoop);
  const dt = Math.min(.05, (ts - OB.last)/1000); OB.last = ts;
  if(!OB.paused && !V.player && !OB.done){ OB.acc += dt; while(OB.acc >= STEP){ obStepPhys(STEP); OB.acc -= STEP; } if(OB.flash > 0) OB.flash -= dt; if(OB.shake > 0) OB.shake -= dt; }
  obDraw(); obHud();
}

/* input */
const OB_KEYS = {ArrowLeft:'left', KeyA:'left', ArrowRight:'right', KeyD:'right', Space:'jump', ArrowUp:'jump', KeyW:'jump'};
document.addEventListener('keydown', e => {
  if(!OB.active || V.player) return;
  if(e.code === 'Escape' || e.code === 'KeyP'){ if(!OB.done) obPause(!OB.paused); return; }
  if(OB.paused || OB.done) return;
  if(e.code === 'KeyE' || e.code === 'Enter'){ obAct(); e.preventDefault(); return; }
  if(e.code === 'KeyR'){ obDie(); OB.stats.deaths--; return; }
  const k = OB_KEYS[e.code]; if(!k) return; e.preventDefault();
  if(k === 'jump' && !OB.keys.jump) OB.keys.jumpPressed = true;
  OB.keys[k] = true;
});
document.addEventListener('keyup', e => { const k = OB_KEYS[e.code]; if(k && OB.active) OB.keys[k] = false; });
document.addEventListener('pointerdown', e => {
  const b = e.target.closest('[data-hold]'); if(!b || !OB.active) return;
  e.preventDefault(); const k = b.dataset.hold; if(k === 'jump' && !OB.keys.jump) OB.keys.jumpPressed = true; OB.keys[k] = true; b.dataset.down = '1';
});
const obRelease = e => { document.querySelectorAll('[data-hold][data-down]').forEach(b => { OB.keys[b.dataset.hold] = false; delete b.dataset.down; }); };
document.addEventListener('pointerup', obRelease); document.addEventListener('pointercancel', obRelease);
window.addEventListener('blur', () => { if(OB.active){ OB.keys = {}; if(!OB.done && !V.player) obPause(true); } });
