
/* ---------- obby v3: skyline art ---------- */
const OB_THEMES = [
  {name:'Dusk',      sky:['#1a1d4a','#7a3a6a','#ff9a5a'], haze:'#ff9a5a', bld:'#14121f', fac:['#262234','#0f0d16'], win:'#ffd27a', edge:'#ffb36b', neon:['#ff4b8a','#4be3ff'], sun:{x:.72,y:300,c:'#ffd9a0',r:70}, stars:0},
  {name:'Night',     sky:['#04060f','#0b1836','#1c3a6a'], haze:'#2a4a8a', bld:'#080c16', fac:['#1a2236','#0a0e18'], win:'#ffe6a0', edge:'#8fd0ff', neon:['#4be3ff','#ff4b8a'], sun:{x:.25,y:130,c:'#e8f1ff',r:34}, stars:1, search:1},
  {name:'Neon',      sky:['#0a0620','#3a0f5a','#b01c7a'], haze:'#c0338a', bld:'#0d0716', fac:['#2a1440','#0d0716'], win:'#ff9be8', edge:'#ff5ad0', neon:['#ff3df0','#3dfff0'], sun:{x:.7,y:150,c:'#ffb3f5',r:42}, stars:1, search:1},
  {name:'Dawn',      sky:['#2a3f6a','#e08a9a','#ffd6a0'], haze:'#ffc9a8', bld:'#1c2438', fac:['#2f3a52','#141a2a'], win:'#fff0c0', edge:'#ffd6a0', neon:['#ff8a6a','#6ad0ff'], sun:{x:.35,y:310,c:'#fff3d0',r:60}, stars:0},
  {name:'Storm',     sky:['#080c12','#1c2630','#33424f'], haze:'#4a5b6a', bld:'#0b1016', fac:['#222c38','#0b1016'], win:'#ffd98a', edge:'#9fc6e6', neon:['#6ad0ff','#ffd166'], sun:null, stars:0, rain:1},
  {name:'Sunset',    sky:['#1c0810','#8a1c20','#ff6a2a'], haze:'#ff7a3a', bld:'#14080c', fac:['#2a1218','#0e0608'], win:'#ffcf7a', edge:'#ff9a5a', neon:['#ff3d3d','#ffcf3d'], sun:{x:.6,y:310,c:'#ffd2a0',r:78}, stars:0},
  {name:'Midnight',  sky:['#02080e','#053036','#0a5a5a'], haze:'#0e7a7a', bld:'#04101a', fac:['#0f2a36','#050f16'], win:'#9ff5ff', edge:'#5af0e0', neon:['#2fffd0','#ff6bd0'], sun:{x:.8,y:120,c:'#d6fff8',r:30}, stars:1, search:1},
  {name:'Golden',    sky:['#1a1230','#a0521c','#ffd25a'], haze:'#ffc14a', bld:'#1b1226', fac:['#33243a','#140c1c'], win:'#fff0b0', edge:'#ffe08a', neon:['#ff9a3d','#9a6bff'], sun:{x:.55,y:300,c:'#fff4c8',r:80}, stars:0}
];
const obHash = (x, y, s) => { let h = Math.imul(x|0, 374761393) ^ Math.imul(y|0, 668265263) ^ Math.imul(s|0, 1274126177); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const obRGB = h => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
const obMix = (a, b, k) => { const A = obRGB(a), B = obRGB(b); return 'rgb(' + Math.round(A[0] + (B[0]-A[0])*k) + ',' + Math.round(A[1] + (B[1]-A[1])*k) + ',' + Math.round(A[2] + (B[2]-A[2])*k) + ')'; };
const OB_TW = 1800, OB_TH = 340, OB_RES = 1.4;
function obBakeLayer(th, seed, o){
  const cv = document.createElement('canvas'); cv.width = Math.round(OB_TW*OB_RES); cv.height = Math.round(OB_TH*OB_RES); const g = cv.getContext('2d'); g.scale(OB_RES, OB_RES);
  const r = rng(seed), bodyTop = obMix(th.bld, th.haze, o.k + .12), bodyBot = obMix(th.bld, th.haze, o.k * .5);
  for(let x = -20; x < OB_TW;){
    const w = Math.min(o.w[0] + r()*(o.w[1]-o.w[0]), OB_TW - x + 20), h = o.h[0] + r()*(o.h[1]-o.h[0]), y = OB_TH - h;
    const gr = g.createLinearGradient(0, y, 0, OB_TH); gr.addColorStop(0, bodyTop); gr.addColorStop(1, bodyBot); g.fillStyle = gr; g.fillRect(x, y, w, h);
    const tp = r(); 
    if(tp < .25){ g.fillRect(x + w*.15, y - 12, w*.7, 12); g.fillRect(x + w*.3, y - 22, w*.4, 10); }
    else if(tp < .5){ g.fillStyle = bodyTop; g.fillRect(x + w/2 - 1, y - 30 - r()*20, 2, 50); g.fillStyle = th.edge; g.globalAlpha = .9; g.fillRect(x + w/2 - 2, y - 32, 4, 3); g.globalAlpha = 1; }
    else if(tp < .65 && o.k < .4){ g.fillStyle = bodyTop; g.fillRect(x + w*.2, y - 16, w*.25, 16); g.fillRect(x + w*.2 + 3, y - 26, 2, 10); g.fillRect(x + w*.2 + w*.25 - 5, y - 26, 2, 10); g.fillRect(x + w*.2 - 2, y - 30, w*.25 + 4, 6); }
    g.fillStyle = th.rim || th.edge; g.globalAlpha = .16 + (1 - o.k)*.2; g.fillRect(x, y, 2, h); g.fillRect(x, y, w, 2); g.globalAlpha = 1;
    const cw = o.win[0], ch = o.win[1], gx = o.gap[0], gy = o.gap[1];
    for(let wy = y + 10; wy < OB_TH - 6; wy += gy) for(let wx = x + 7; wx < x + w - cw - 4; wx += gx){
      const q = r(); if(q < o.lit){ g.fillStyle = q < o.lit*.25 ? th.neon[1] : th.win; g.globalAlpha = (.45 + r()*.5)*(1 - o.k*.5); g.fillRect(wx, wy, cw, ch); }
    }
    g.globalAlpha = 1;
    if(o.neon && r() < .35){ const nc = th.neon[Math.floor(r()*2)], nx = x + w - 12, ny = y + 20 + r()*Math.max(10, h - 120), nh = 40 + r()*50; g.save(); g.shadowColor = nc; g.shadowBlur = 14; g.fillStyle = nc; g.fillRect(nx, ny, 5, nh); g.fillRect(nx - 22, ny + 6, 18, 3); g.fillRect(nx - 22, ny + 16, 14, 3); g.restore(); }
    x += w + (o.k > .5 ? 0 : r()*8);
  }
  return {cv, tw:OB_TW, th:OB_TH};
}
function obBakeClouds(th){
  const cv = document.createElement('canvas'); cv.width = OB_TW; cv.height = 220; const g = cv.getContext('2d'), r = rng(77);
  g.fillStyle = obMix(th.sky[1], '#ffffff', .25);
  for(let i = 0; i < 22; i++){ const cx = r()*OB_TW, cy = 30 + r()*150, n = 5 + Math.floor(r()*4); g.globalAlpha = .08 + r()*.1;
    for(let k = 0; k < n; k++) for(const off of [-OB_TW, 0, OB_TW]){ g.beginPath(); g.ellipse(cx + k*26 + off, cy + Math.sin(k*1.7)*8, 46 + r()*30, 14 + r()*10, 0, 0, 7); g.fill(); } }
  return {cv, tw:OB_TW, th:220};
}
function obBuildArt(ch){
  const th = OB_THEMES[ch % 8]; OB.th = th;
  OB.art = {
    far:  obBakeLayer(th, 101 + ch, {k:.78, w:[40,90],  h:[60,210],  win:[3,4],  gap:[8,11],  lit:.22, neon:0}),
    mid:  obBakeLayer(th, 202 + ch, {k:.5,  w:[60,120], h:[100,270], win:[5,7],  gap:[12,16], lit:.3,  neon:0}),
    near: obBakeLayer(th, 303 + ch, {k:.18, w:[90,170], h:[130,330], win:[7,10], gap:[17,24], lit:.34, neon:1}),
    clouds: obBakeClouds(th)
  };
  OB.rainDrops = Array.from({length:110}, (_, i) => [obHash(i,1,5), obHash(i,2,5), .6 + obHash(i,3,5)*.8]);
  const r = rng(ch*31 + 9), W = OB.w;
  W.plats.forEach(o => {
    o.deco = []; if(o.t !== 's' || o.w < 170) return;
    const bad = (x0, x1) => W.spikes.some(s => s.x + s.w > x0 && s.x < x1) || W.gates.some(g => g.tx + 70 > x0 && g.tx - 70 < x1 || (g.bx + 40 > x0 && g.bx - 40 < x1)) || W.springs.some(s => s.x + s.w + 20 > x0 && s.x - 20 < x1) || W.flags.some(f => f.x + 40 > x0 && f.x - 20 < x1) || W.lasers.some(l => l.x + 30 > x0 && l.x - 30 < x1);
    for(let n = 0; n < 2; n++){ const k = ['ac','vent','tank','ant','box'][Math.floor(r()*5)], dx = 20 + r()*(o.w - 70), wd = k === 'tank' ? 34 : 26; if(!bad(o.x + dx - 6, o.x + dx + wd + 6) && !o.deco.some(d => Math.abs(d.dx - dx) < 60)) o.deco.push({k, dx}); }
  });
}
function obDrawProp(g, o, d, T){
  const x = o.x + d.dx, y = o.y; g.fillStyle = '#2b2f3a';
  if(d.k === 'ac'){ g.fillRect(x, y - 14, 28, 14); g.fillStyle = '#1a1d26'; g.beginPath(); g.arc(x + 14, y - 7, 5, 0, 7); g.fill(); g.fillStyle = '#4a5060'; g.fillRect(x, y - 14, 28, 2); }
  else if(d.k === 'vent'){ g.fillRect(x + 4, y - 18, 10, 18); g.fillStyle = '#4a5060'; g.fillRect(x + 1, y - 22, 16, 5); }
  else if(d.k === 'tank'){ g.fillStyle = '#1a1d26'; g.fillRect(x + 4, y - 14, 3, 14); g.fillRect(x + 27, y - 14, 3, 14); g.fillStyle = '#3a2f2a'; g.fillRect(x, y - 36, 34, 22); g.fillStyle = '#54453b'; g.fillRect(x, y - 38, 34, 4); }
  else if(d.k === 'ant'){ g.fillStyle = '#4a5060'; g.fillRect(x + 6, y - 44, 2, 44); g.fillRect(x, y - 30, 14, 2); g.fillStyle = '#ff3b3b'; g.globalAlpha = .4 + .6*Math.abs(Math.sin(T*2 + d.dx)); g.fillRect(x + 4, y - 47, 6, 4); g.globalAlpha = 1; }
  else { g.fillRect(x, y - 16, 22, 16); g.fillStyle = '#4a5060'; g.fillRect(x, y - 16, 22, 2); g.fillStyle = '#1a1d26'; g.fillRect(x + 5, y - 10, 12, 10); }
}
function obDrawPlat(g, o, th, bottom, T){
  const ox = (o.t === 'c' && o.st === 1) ? Math.sin(T*70)*2 : 0, x = o.x + ox, y = o.y;
  if(o.t === 'm'){
    g.strokeStyle = 'rgba(200,200,210,.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x + 8, y); g.lineTo(x + 8, y - 520); g.moveTo(x + o.w - 8, y); g.lineTo(x + o.w - 8, y - 520); g.stroke();
    const mg = g.createLinearGradient(0, y, 0, y + o.h); mg.addColorStop(0, '#5a5f6c'); mg.addColorStop(1, '#2a2d36'); g.fillStyle = mg; g.fillRect(x, y, o.w, o.h);
    g.fillStyle = '#ffc800'; g.fillRect(x, y, o.w, 5); g.fillStyle = '#111'; for(let k = 0; k < o.w; k += 22) g.fillRect(x + k + 6, y, 10, 5);
    g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(x, y, o.w, 1); return;
  }
  if(o.t === 'c'){
    const cg = g.createLinearGradient(0, y, 0, y + o.h); cg.addColorStop(0, '#7a5a3a'); cg.addColorStop(1, '#3a2a1c'); g.fillStyle = cg; g.fillRect(x, y, o.w, o.h);
    g.fillStyle = 'rgba(0,0,0,.35)'; for(let k = 0; k < o.w; k += 22) g.fillRect(x + k, y, 2, o.h); g.fillRect(x, y + o.h/2, o.w, 2);
    g.fillStyle = '#c9b48a'; g.fillRect(x, y, o.w, 4); g.fillStyle = '#9aa'; for(let k = 8; k < o.w; k += 22){ g.fillRect(x + k, y + 8, 3, 3); }
    return;
  }
  const fg = g.createLinearGradient(0, y, 0, bottom); fg.addColorStop(0, th.fac[0]); fg.addColorStop(1, th.fac[1]); g.fillStyle = fg; g.fillRect(x, y, o.w, bottom - y);
  const c0 = Math.floor((x + 8)/22), c1 = Math.floor((x + o.w - 16)/22), cid = OB.ch*7;
  for(let pass = 0; pass < 2; pass++){
    g.fillStyle = pass ? th.win : 'rgba(0,0,0,.4)'; g.globalAlpha = pass ? .8 : 1;
    for(let row = 0; row < 14; row++){ const wy = y + 20 + row*27; if(wy > bottom) break;
      for(let c = c0; c <= c1; c++){ const lit = obHash(c, row + (y|0), cid) < .38; if(lit === !!pass) g.fillRect(c*22 + 4, wy, 12, 15); } }
  }
  g.globalAlpha = 1;
  g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(x, y + 8, 3, bottom - y);
  g.fillStyle = obMix(th.fac[0], '#ffffff', .22); g.fillRect(x - 3, y, o.w + 6, 9);
  g.fillStyle = th.edge; g.fillRect(x - 3, y, o.w + 6, 3); g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(x - 3, y, o.w + 6, 1);
  g.fillStyle = th.edge; g.globalAlpha = .1; g.fillRect(x - 3, y - 12, o.w + 6, 12); g.globalAlpha = 1;
  o.deco && o.deco.forEach(d => obDrawProp(g, o, d, T));
}
function obLayer(g, L, f, yb, vw){
  let x = -((OB.cam*f) % L.tw); if(x > 0) x -= L.tw; const y = yb - L.th - OB.camY*f*.5;
  for(; x < vw; x += L.tw) g.drawImage(L.cv, x, y, L.tw, L.th);
}
function obDraw(){
  const c = OB.cv, g = OB.g, W = OB.w, p = OB.p, dpr = window.devicePixelRatio || 1;
  const cw = c.clientWidth, chh = c.clientHeight; if(!cw || !chh || !OB.art) return;
  if(c.width !== Math.round(cw*dpr) || c.height !== Math.round(chh*dpr)){ c.width = Math.round(cw*dpr); c.height = Math.round(chh*dpr); }
  const VH = 440, sc = chh/VH, vw = cw/sc, T = OB.t, th = OB.th, acc = OB_COL[OB.ch % 8];
  g.setTransform(dpr*sc, 0, 0, dpr*sc, 0, 0);
  const tx = clampN(p.x - vw*.36 + p.vx*.22, -200, W.end - vw + 200); OB.cam += (tx - OB.cam)*.1; const ty = clampN(p.y - 230, 0, 110); OB.camY += (ty - OB.camY)*.08;
  /* sky */
  const sk = g.createLinearGradient(0, 0, 0, VH); sk.addColorStop(0, th.sky[0]); sk.addColorStop(.55, th.sky[1]); sk.addColorStop(1, th.sky[2]); g.fillStyle = sk; g.fillRect(0, 0, vw, VH + 2);
  if(th.stars){ g.fillStyle = '#fff'; for(let i = 0; i < 90; i++){ const sx = ((obHash(i,1,3)*2600 - OB.cam*.03) % vw + vw) % vw, sy = obHash(i,2,3)*260; g.globalAlpha = .25 + .5*Math.abs(Math.sin(T*1.4 + i)); g.fillRect(sx, sy, 1.6, 1.6); } g.globalAlpha = 1; }
  if(th.sun){ const sx = vw*th.sun.x - OB.cam*.02, sy = th.sun.y - OB.camY*.1, r = th.sun.r;
    const gl = g.createRadialGradient(sx, sy, r*.3, sx, sy, r*4.2); gl.addColorStop(0, th.sun.c + 'cc'); gl.addColorStop(.35, th.haze + '55'); gl.addColorStop(1, th.haze + '00'); g.fillStyle = gl; g.fillRect(sx - r*4.2, sy - r*4.2, r*8.4, r*8.4);
    g.fillStyle = th.sun.c; g.beginPath(); g.arc(sx, sy, r*.5, 0, 7); g.fill(); }
  g.globalAlpha = .9; const cl = OB.art.clouds; { let x = -((OB.cam*.05) % cl.tw); if(x > 0) x -= cl.tw; for(; x < vw; x += cl.tw) g.drawImage(cl.cv, x, 40 - OB.camY*.04, cl.tw, cl.th); } g.globalAlpha = 1;
  if(th.search){ g.save(); g.globalCompositeOperation = 'lighter'; for(let i = 0; i < 2; i++){ const bx = vw*(.25 + i*.5) - OB.cam*.1 % 80, ang = -Math.PI/2 + Math.sin(T*.5 + i*2)*.5, len = 420, sp = .09; const bg = g.createLinearGradient(bx, VH - 60, bx + Math.cos(ang)*len, VH - 60 + Math.sin(ang)*len); bg.addColorStop(0, th.edge + '55'); bg.addColorStop(1, th.edge + '00'); g.fillStyle = bg; g.beginPath(); g.moveTo(bx, VH - 60); g.lineTo(bx + Math.cos(ang - sp)*len, VH - 60 + Math.sin(ang - sp)*len); g.lineTo(bx + Math.cos(ang + sp)*len, VH - 60 + Math.sin(ang + sp)*len); g.fill(); } g.restore(); }
  { const hx = ((T*22 + 300) % (vw + 200)) - 100; g.fillStyle = '#ff3b3b'; g.globalAlpha = Math.abs(Math.sin(T*3)) ; g.fillRect(hx, 80, 3, 3); g.fillStyle = '#fff'; g.globalAlpha = Math.abs(Math.sin(T*3 + 1.5)); g.fillRect(hx + 10, 82, 2, 2); g.globalAlpha = 1; }
  obLayer(g, OB.art.far, .1, 410, vw); obLayer(g, OB.art.mid, .22, 440, vw); obLayer(g, OB.art.near, .42, 480, vw);
  const hz = g.createLinearGradient(0, VH*.55, 0, VH); hz.addColorStop(0, th.haze + '00'); hz.addColorStop(1, th.haze + '66'); g.fillStyle = hz; g.fillRect(0, VH*.55, vw, VH*.45 + 2);
  /* world */
  g.save(); const sh = OB.shake > 0 ? OB.shake*14 : 0; g.translate(-OB.cam + (sh ? (Math.random()-.5)*sh : 0), -OB.camY + (sh ? (Math.random()-.5)*sh : 0));
  const bottom = OB.camY + VH + 40;
  W.plats.forEach(o => { if(o.x + o.w < OB.cam - 40 || o.x > OB.cam + vw + 40) return; if(o.t === 'c' && o.st === 2) return; obDrawPlat(g, o, th, bottom, T); });
  W.springs.forEach(sp => { const k = sp.t > 0 ? .5 : 1, h = 22*k; g.fillStyle = '#555'; g.fillRect(sp.x, sp.y - 6, sp.w, 6); g.strokeStyle = '#ddd'; g.lineWidth = 3; g.beginPath(); for(let i=0;i<4;i++){ g.moveTo(sp.x + 10, sp.y - 6 - h*i/4); g.lineTo(sp.x + sp.w - 10, sp.y - 6 - h*(i+.5)/4); g.lineTo(sp.x + 10, sp.y - 6 - h*(i+1)/4); } g.stroke(); g.fillStyle = '#ffc800'; g.fillRect(sp.x - 2, sp.y - 6 - h - 6, sp.w + 4, 7); });
  g.fillStyle = '#e8eaf0'; W.spikes.forEach(sp => { for(let k=0; k<sp.w; k+=18){ g.beginPath(); g.moveTo(sp.x + k, sp.y); g.lineTo(sp.x + k + 9, sp.y - 26); g.lineTo(sp.x + k + 18, sp.y); g.fill(); } g.fillStyle = 'rgba(255,60,60,.35)'; g.fillRect(sp.x, sp.y - 3, sp.w, 3); g.fillStyle = '#e8eaf0'; });
  W.lasers.forEach(l => {
    const ph = (T + l.off) % l.period, on = ph < l.period*.5, warn = !on && ph > l.period - .35;
    g.fillStyle = '#2a2d36'; g.fillRect(l.x - 9, l.y1 - 12, 18, 16); g.fillRect(l.x - 9, l.y2 - 5, 18, 7); g.fillStyle = on ? '#ff3b3b' : '#552'; g.fillRect(l.x - 3, l.y1 + 2, 6, 3);
    if(on){ g.save(); g.shadowColor = '#ff2a2a'; g.shadowBlur = 16; g.fillStyle = '#ff5a5a'; g.fillRect(l.x - 2, l.y1, 4, l.y2 - l.y1); g.restore(); g.fillStyle = 'rgba(255,42,42,.25)'; g.fillRect(l.x - 9, l.y1, 18, l.y2 - l.y1); }
    else { g.fillStyle = warn ? 'rgba(255,200,0,.7)' : 'rgba(255,42,42,.2)'; g.fillRect(l.x - 1, l.y1, 2, l.y2 - l.y1); }
  });
  W.coins.forEach(co => { if(S.obbyCoins[S.path+':'+OB.ch+':'+co.id]) return; const sw = Math.abs(Math.cos(T*4 + co.id)), yy = co.y + Math.sin(T*3 + co.id)*3, gl = g.createRadialGradient(co.x, yy, 2, co.x, yy, 20); gl.addColorStop(0, 'rgba(255,210,60,.55)'); gl.addColorStop(1, 'rgba(255,210,60,0)'); g.fillStyle = gl; g.fillRect(co.x - 20, yy - 20, 40, 40);
    g.fillStyle = '#e8a800'; g.beginPath(); g.ellipse(co.x, yy, 10*Math.max(.25, sw), 10, 0, 0, 7); g.fill(); g.fillStyle = '#ffd84a'; g.beginPath(); g.ellipse(co.x - 1, yy - 1, 8*Math.max(.2, sw), 8, 0, 0, 7); g.fill(); g.fillStyle = '#fff6c0'; g.fillRect(co.x - 3*sw - 1, yy - 5, 2, 8); });
  W.flags.forEach(f => { const on = OB.cp && OB.cp.x === f.x; g.fillStyle = '#c9ccd4'; g.fillRect(f.x, f.y - 60, 4, 60); g.fillStyle = on ? '#4ade80' : '#ff3b3b'; g.beginPath(); g.moveTo(f.x + 4, f.y - 60); g.lineTo(f.x + 36 + Math.sin(T*5)*3, f.y - 49); g.lineTo(f.x + 4, f.y - 38); g.fill(); });
  W.gates.forEach(gt => {
    const near = OB.near === gt, open = gt.open;
    if(near){ const gl = g.createRadialGradient(gt.tx, gt.ty - 34, 5, gt.tx, gt.ty - 34, 70); gl.addColorStop(0, 'rgba(255,210,80,.45)'); gl.addColorStop(1, 'rgba(255,210,80,0)'); g.fillStyle = gl; g.fillRect(gt.tx - 70, gt.ty - 104, 140, 140); }
    g.fillStyle = '#20232c'; g.fillRect(gt.tx - 26, gt.ty - 70, 52, 70); g.fillStyle = '#343846'; g.fillRect(gt.tx - 26, gt.ty - 70, 52, 4); g.fillStyle = '#0a0b10'; g.fillRect(gt.tx - 21, gt.ty - 65, 42, 32);
    g.fillStyle = open ? '#4ade80' : (near ? '#ffc800' : acc); g.globalAlpha = open ? .9 : .6 + .3*Math.sin(T*4); g.fillRect(gt.tx - 19, gt.ty - 63, 38, 28); g.globalAlpha = 1;
    g.fillStyle = '#050505'; g.font = '900 15px Nunito, sans-serif'; g.textAlign = 'center';
    if(open){ g.strokeStyle = '#050505'; g.lineWidth = 4; g.beginPath(); g.moveTo(gt.tx - 8, gt.ty - 50); g.lineTo(gt.tx - 2, gt.ty - 43); g.lineTo(gt.tx + 9, gt.ty - 57); g.stroke(); } else g.fillText(String(gt.s + 1), gt.tx, gt.ty - 44);
    g.fillStyle = '#fff'; g.font = '800 11px Nunito, sans-serif'; g.fillText(open ? 'HACKED' : 'TERMINAL', gt.tx, gt.ty - 76);
    if(near && !open){ const yy = gt.ty - 112 + Math.sin(T*6)*3; g.fillStyle = '#ffc800'; g.fillRect(gt.tx - 14, yy, 28, 24); g.fillStyle = '#050505'; g.font = '900 16px Nunito, sans-serif'; g.fillText('E', gt.tx, yy + 18); }
    const a = 1 - gt.anim;
    if(a > .02){ g.globalAlpha = a; g.fillStyle = 'rgba(255,42,42,.26)'; g.fillRect(gt.bx, gt.ty - 180, 24, 180); g.save(); g.shadowColor = '#ff2a2a'; g.shadowBlur = 12; g.fillStyle = '#ff4b4b'; g.fillRect(gt.bx + 10, gt.ty - 180, 4, 180); g.restore(); g.fillStyle = 'rgba(255,255,255,.5)'; for(let k = 0; k < 180; k += 30) g.fillRect(gt.bx + 8, gt.ty - 180 + ((k + T*60) % 180), 8, 3); g.fillStyle = '#fff'; g.font = '800 11px Nunito, sans-serif'; g.fillText('LOCKED', gt.bx + 12, gt.ty - 188); g.globalAlpha = 1; }
  });
  const po = W.portal; if(po){ const open = chDone(OB.ch);
    g.fillStyle = '#20232c'; g.fillRect(po.x - 70, po.y - 4, 140, 6); g.strokeStyle = open ? '#4ade80' : '#555'; g.lineWidth = 3; g.beginPath(); g.ellipse(po.x, po.y - 2, 54, 7, 0, 0, 7); g.stroke();
    if(open){ const bg = g.createLinearGradient(0, po.y - 340, 0, po.y); bg.addColorStop(0, 'rgba(74,222,128,0)'); bg.addColorStop(1, 'rgba(74,222,128,.5)'); g.fillStyle = bg; g.fillRect(po.x - 44, po.y - 340, 88, 340); g.strokeStyle = '#7dffb0'; g.lineWidth = 2; for(let k = 0; k < 4; k++){ const yy = po.y - ((T*80 + k*60) % 240); g.globalAlpha = .6; g.beginPath(); g.ellipse(po.x, yy, 40, 6, 0, 0, 7); g.stroke(); } g.globalAlpha = 1; }
    g.fillStyle = '#fff'; g.font = '800 12px Nunito, sans-serif'; g.textAlign = 'center'; g.fillText(open ? 'EXTRACTION' : 'EXTRACTION LOCKED', po.x, po.y - 24); }
  if(!(p.dead > 0)){ const gy = p.ride ? p.ride.y : null; if(gy !== null && p.onGround){ g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(p.x + p.w/2, gy + 1, 16, 4, 0, 0, 7); g.fill(); } obChar(g, p); }
  OB.parts.forEach(q => { g.globalAlpha = Math.max(0, q.life/.8); g.fillStyle = q.c; g.fillRect(q.x, q.y, q.s, q.s); }); g.globalAlpha = 1;
  g.restore();
  /* street fog and traffic */
  const fg = g.createLinearGradient(0, VH - 120, 0, VH); fg.addColorStop(0, th.haze + '00'); fg.addColorStop(1, th.haze + 'cc'); g.fillStyle = fg; g.fillRect(0, VH - 120, vw, 122);
  for(let i = 0; i < 14; i++){ const sp = 30 + obHash(i,1,9)*50, x = ((obHash(i,2,9)*vw*2 + T*sp*(i%2 ? 1 : -1) - OB.cam*.5) % (vw + 60) + vw + 60) % (vw + 60) - 30, y = VH - 12 - (i%3)*6; g.fillStyle = i%2 ? '#fff3c0' : '#ff3b3b'; g.globalAlpha = .75; g.fillRect(x, y, 5, 2); g.fillRect(x + 9, y, 5, 2); }
  g.globalAlpha = 1;
  if(th.rain){ g.strokeStyle = 'rgba(200,225,255,.35)'; g.lineWidth = 1; g.beginPath(); OB.rainDrops.forEach(d => { const x = (d[0]*vw*1.3 - T*80*d[2] + vw*2) % (vw*1.3), y = ((d[1]*VH + T*600*d[2]) % VH); g.moveTo(x, y); g.lineTo(x - 5, y + 16); }); g.stroke();
    const lf = Math.sin(T*.7); if(lf > .985){ g.fillStyle = 'rgba(255,255,255,.28)'; g.fillRect(0, 0, vw, VH); } }
  const vg = g.createRadialGradient(vw/2, VH/2, VH*.45, vw/2, VH/2, Math.max(vw, VH)*.75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.45)'); g.fillStyle = vg; g.fillRect(0, 0, vw, VH + 2);
  if(OB.flash > 0){ g.setTransform(dpr, 0, 0, dpr, 0, 0); g.fillStyle = 'rgba(255,42,42,' + (OB.flash*.7) + ')'; g.fillRect(0, 0, cw, chh); }
}
