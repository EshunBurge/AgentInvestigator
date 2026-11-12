/* ---------- count-up ---------- */
function countUp(){
  if(window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  if(!document.getElementById('app').classList.contains('enter')) return;
  document.querySelectorAll('#app .big, #app .score b').forEach(el => {
    const n = el.firstChild; if(!n || n.nodeType !== 3) return; const m = n.nodeValue.match(/^(\d+)(.*)$/); if(!m) return;
    const end = +m[1], suf = m[2], t0 = performance.now(), dur = 900; if(end < 2) return;
    (function f(t){ const k = Math.min(1,(t-t0)/dur), e = 1-Math.pow(1-k,3); n.nodeValue = Math.round(end*e) + suf; if(k<1) requestAnimationFrame(f); })(t0);
  });
}
/* ---------- quick jump palette, glow, boot ---------- */
function press(a, data){ const el = document.createElement('button'); el.dataset.act = a; Object.assign(el.dataset, data || {}); document.body.appendChild(el); el.click(); el.remove(); }
function palItems(){
  const it = [['arrow','Continue where I left off','Jump straight to your next step',()=>press('goon')],['scroll','Daily Dispatch','5-question daily quiz',()=>press('dispatch')]];
  navAll().forEach(n => it.push([n[2], n[1], NAV_SUB[n[0]]+' (page)', ()=>press('tab',{t:n[0]})]));
  if(gameOn()) P_().chapters.forEach((id,ch)=>it.push(['flame','Run course: Level '+(ch+1), MISSIONS[id][0], ()=>press('course',{ch:ch})]));
  P_().chapters.forEach(id=>it.push(['book','Manual: '+TOPICS[id].name,'Study guide', ()=>press('manual',{id:id})]));
  return it;
}
function closePal(){ const p = document.getElementById('pal'); if(p) p.remove(); }
function openPal(){
  closePal(); const items = palItems(); let sel = 0, shown = items;
  const d = document.createElement('div'); d.id = 'pal'; d.setAttribute('role','dialog'); d.setAttribute('aria-modal','true'); d.setAttribute('aria-label','Quick jump');
  d.innerHTML = '<div class="palbox"><input id="palq" placeholder="Jump to a page, level or study guide…" autocomplete="off" aria-label="Search"><div class="pallist" id="pall"></div><p class="hint" style="margin:10px 0 0">Up and down to move · Enter to open · Esc to close</p></div>';
  document.body.appendChild(d);
  const list = d.querySelector('#pall'), q = d.querySelector('#palq');
  function draw(){ list.innerHTML = shown.length ? shown.map((x,k)=>'<button class="palit '+(k===sel?'on':'')+'" data-k="'+k+'">'+ic(x[0],20)+'<span class="grow"><b>'+esc(x[1])+'</b><small>'+esc(x[2])+'</small></span></button>').join('') : '<p class="muted" style="padding:12px">Nothing found.</p>'; const on = list.querySelector('.on'); if(on) on.scrollIntoView({block:'nearest'}); }
  function run(k){ const x = shown[k]; if(!x) return; closePal(); x[3](); }
  q.addEventListener('input', () => { const s = q.value.toLowerCase().trim(); shown = items.filter(x => (x[1]+' '+x[2]).toLowerCase().includes(s)); sel = 0; draw(); });
  q.addEventListener('keydown', e => { if(e.key === 'ArrowDown'){ sel = Math.min(shown.length-1, sel+1); draw(); e.preventDefault(); } else if(e.key === 'ArrowUp'){ sel = Math.max(0, sel-1); draw(); e.preventDefault(); } else if(e.key === 'Enter'){ run(sel); } });
  list.addEventListener('click', e => { const b = e.target.closest('.palit'); if(b) run(+b.dataset.k); });
  d.addEventListener('click', e => { if(e.target === d) closePal(); });
  draw(); q.focus();
}
document.addEventListener('keydown', e => {
  if(e.key === 'Escape'){ closePal(); return; }
  const tg = (e.target.tagName || '').toLowerCase(); if(tg === 'input' || tg === 'textarea') return;
  if(V.player || (typeof OB !== 'undefined' && OB.active) || !S.setup || S.step !== 'app') return;
  if(e.key === 'k' || e.key === 'K' || e.key === '/'){ e.preventDefault(); openPal(); }
});
document.addEventListener('pointermove', e => { const c = e.target.closest && e.target.closest('.glass,.card,.crs,.lvl,.cx-card,.hubt,.shopcard,.how>div'); if(!c) return; const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX-r.left)+'px'); c.style.setProperty('--my', (e.clientY-r.top)+'px'); });
function boot(){
  if(V.booted || S.step !== 'app' || (navigator.webdriver && !window.FORCEBOOT) || (window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches)) return; V.booted = true;
  const L = ['AGENT TERMINAL v2.6','Authenticating '+(S.user||'agent')+' ... OK','Loading missions ... OK','Syncing streak and coins ... OK','Welcome back, agent.'];
  const d = document.createElement('div'); d.id = 'boot'; d.innerHTML = '<div class="bootbox">'+L.map((l,k)=>'<div style="animation-delay:'+(k*.28)+'s">'+(k?'&gt; ':'')+esc(l)+'</div>').join('')+'<div class="bootbar"><i></i></div></div>';
  document.body.appendChild(d); const rm = () => { d.classList.add('out'); setTimeout(()=>d.remove(), 450); }; d.addEventListener('click', rm); setTimeout(rm, 1900);
}
/* ---------- typewriter ---------- */
function typeAsk(){
  clearTimeout(window._tw); const el = document.querySelector('#app .ask'); if(!el) return;
  let list; try { list = JSON.parse(el.dataset.p); } catch(e){ return; } const out = el.querySelector('.tw'); if(!out || list.length < 2) return;
  if(window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  let i = 0, n = list[0].length, dir = -1;
  function step(){ if(!document.body.contains(el)) return; const s = list[i];
    out.textContent = s.slice(0, n);
    if(dir === 1){ if(n < s.length){ n++; window._tw = setTimeout(step, 45); } else { dir = -1; window._tw = setTimeout(step, 2200); } }
    else { if(n > 0){ n--; window._tw = setTimeout(step, 22); } else { i = (i+1) % list.length; dir = 1; window._tw = setTimeout(step, 250); } } }
  window._tw = setTimeout(step, 2500);
}
/* ---------- base render ---------- */
function renderBase(){
  const app = document.getElementById('app');
  let h = '';
  if(S.step === 'landing' || (!S.user && S.step !== 'name')) h = viewLanding();
  else if(S.step === 'name') h = viewName();
  else if(S.step === 'mode') h = viewMode();
  else if(S.step === 'track') h = viewTrack();
  else if(S.step === 'char' && gameOn()) h = viewChar();
  else {
    if(S.tab === 'shop' && !gameOn()) S.tab = 'hq';
    const views = {hq:viewHQ, learn:viewLearn, manual:viewManual, quests:viewQuests, board:viewBoard, shop:viewShop, agent:viewAgent};
    h = shell((views[S.tab] || viewHQ)());
  }
  const vk = S.step+'|'+S.tab; app.classList.toggle('enter', V.lastView !== vk); V.lastView = vk;
  app.innerHTML = h;
  countUp();
  if(V.scrollNext){ V.scrollNext = false; const n = app.querySelector('.node.next') || app.querySelector('.lrow .chip.red'); if(n && S.tab === 'learn') n.scrollIntoView({block:'center'}); }
}
function render(){ renderBase(); renderPlayer(); }

/* ---------- events ---------- */
document.addEventListener('submit', e => {
  if(e.target.id !== 'nameForm') return;
  e.preventDefault();
  const v = document.getElementById('codename').value.trim();
  if(!v) return;
  S.user = v.slice(0,20); S.step = S.setup ? 'app' : 'mode'; save(); render(); window.scrollTo(0,0);
});
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]');
  if(!b || b.disabled) return;
  const a = b.dataset.act, d = b.dataset, p = V.player;
  /* player actions return early */
  if(a === 'choose'){ if(p && !p.checked && !p.hidden.includes(+d.k)){ p.sel = +d.k; sfx('click'); renderPlayer(); } return; }
  if(a === 'check'){ playerCheck(); return; }
  if(a === 'next'){ playerNext(); return; }
  if(a === 'pt'){ playerMatch('t', +d.k); return; }
  if(a === 'pd'){ playerMatch('d', +d.k); return; }
  if(a === 'quit'){ closePlayer(); return; }
  if(a === 'retry'){ const L = p.lesson; if(L.type === 'daily') V.player = newPlayer(buildDaily()); else if(L.type === 'duel') V.player = newPlayer(buildDuel(RIVALS.findIndex(r=>r[0]===L.rival.name))); else V.player = newPlayer(buildLesson(S.path, L.i)); renderPlayer(); return; }
  if(a === 'manual-from-fail'){ const id = p.lesson.topicId; closePlayer(); S.tab = 'manual'; S.manual = id; save(); render(); window.scrollTo(0,0); return; }
  if(a === 'tfans'){ if(p && !p.checked){ const s = p.queue[0], v = d.v === '1'; p.sel = +d.v; resolve(v === s.truth, esc(s.why)); } return; }
  if(a === 'fchip'){ const s = p.queue[0]; s._f.sel[+d.k] = !s._f.sel[+d.k]; sfx('click'); renderPlayer(); return; }
  if(a === 'forgesend'){ forgeSend(); return; }
  if(a === 'hline'){ const s = p.queue[0]; s._h.sel = +d.k; sfx('click'); renderPlayer(); return; }
  if(a === 'hcheck'){ const s = p.queue[0]; const ok = s.lines[s._h.sel].fake; resolve(ok, (ok ? '' : 'The forged line is highlighted. ') + esc(s.why)); return; }
  if(a === 'tile'){ codeTile(+d.k); return; }
  if(a === 'cback'){ const s = p.queue[0]; s._c.ans.pop(); renderPlayer(); return; }
  if(a === 'hint'){
    if(p && !p.checked && S.hints > 0){ const s = p.queue[0]; const c = s.opts.map((o,k)=>k).filter(k=>s.opts[k] !== s.ans && !p.hidden.includes(k));
      if(c.length && s.opts.length - p.hidden.length > 2){ p.hidden.push(c[Math.floor(Math.random()*c.length)]); S.hints--; save(); if(p.sel !== null && p.hidden.includes(p.sel)) p.sel = null; renderPlayer(); } }
    return;
  }
  if(a === 'open'){ openLesson(+d.i); return; }
  if(a === 'dispatch'){ openDaily(); return; }
  if(a === 'pal'){ openPal(); return; }
  if(a === 'goon'){ const ni = nextIdx(); if(ni !== -1){ if(gameOn()) startCourse(Math.floor(ni/10)); else openLesson(ni); return; } S.tab = 'learn'; }
  if(a === 'course'){ startCourse(+d.ch); return; }
  if(a === 'obquit'){ quitCourse(); return; }
  if(a === 'obpause'){ obPause(true); return; }
  if(a === 'obresume'){ obPause(false); return; }
  if(a === 'obact'){ obAct(); return; }
  if(a === 'obnext'){ stopCourse(); startCourse(+d.ch); return; }
  if(a === 'duel'){ openDuel(+d.r); return; }
  /* app actions */
  if(a === 'start'){ S.step = S.setup ? 'app' : 'name'; }
  if(a === 'enter'){ S.step = S.setup ? 'app' : 'name'; }
  if(a === 'mode'){ S.mode = d.m; S.step = 'track'; }
  if(a === 'track'){ S.path = d.p; if(S.setup) S.step = 'app'; else if(gameOn()) S.step = 'char'; else { S.setup = true; S.step = 'app'; } S.tab = 'hq'; }
  if(a === 'finishsetup'){ S.setup = true; S.step = 'app'; S.tab = 'hq'; }
  if(a === 'tab'){ S.tab = d.t; if(d.t === 'learn') V.scrollNext = true; window.scrollTo(0,0); }
  if(a === 'manual'){ S.manual = d.id || null; S.tab = 'manual'; window.scrollTo(0,0); }
  if(a === 'shoptab'){ S.shopTab = d.t; }
  if(a === 'set'){ S.equip[d.k] = (d.k === 'acc' && d.v === '') ? null : d.v; sfx('click'); }
  if(a === 'equip'){ const it = SHOP.find(x=>x.id===d.id); if(it.kind === 'outfit') S.equip.outfit = it.id; else S.equip.acc = (S.equip.acc === it.id ? null : it.id); sfx('click'); }
  if(a === 'buy'){
    const it = SHOP.find(x=>x.id===d.id);
    if(it && S.coins >= it.price){
      if(it.kind === 'boost'){ S.coins -= it.price; if(it.id === 'boost-freeze') S.freezes++; else if(it.id === 'boost-hint') S.hints += 3; else S.armor++; sfx('coin'); toast('Bought '+it.name); }
      else if(!S.owned.includes(it.id)){ S.coins -= it.price; S.owned.push(it.id); S.bought++; grant('shopper'); if(it.kind === 'outfit') S.equip.outfit = it.id; else S.equip.acc = it.id; sfx('coin'); toast('Bought '+it.name); }
    }
  }
  if(a === 'chest'){ const ck = S.path+':'+d.ch; if(!S.chests[ck]){ S.chests[ck] = true; S.coins += 20; S.hints++; sfx('coin'); toast('Supply crate: +20 coins and a hint'); confetti(); } }
  if(a === 'claim'){ ensureQuest(); const q = QUESTS.find(x=>x.id===d.id); if(q && S.q[q.key] >= q.goal && !S.q.claimed[q.id]){ S.q.claimed[q.id] = true; if(gameOn()) S.coins += q.coins; else addXp(10); grant('quest'); sfx('coin'); toast('Reward claimed'); } }
  if(a === 'advance'){ const nx = ORDER[ORDER.indexOf(S.path)+1]; if(nx){ S.path = nx; S.tab = 'learn'; V.scrollNext = true; toast('Welcome to the '+PATHS[nx].name+' track'); confetti(); } }
  if(a === 'switchmode'){ S.mode = gameOn() ? 'regular' : 'game'; S.tab = 'hq'; }
  if(a === 'retrack'){ S.step = 'track'; }
  if(a === 'signout'){ S = JSON.parse(JSON.stringify(DEF)); V.player = null; }
  if(a === 'togsound'){ S.sound = S.sound === false; }
  if(a === 'togassist'){ S.assist = !S.assist; }
  if(a === 'togtimer'){ S.noTimer = !S.noTimer; }
  if(a === 'resetask'){ S.confirmReset = true; }
  if(a === 'resetno'){ S.confirmReset = false; }
  if(a === 'reset'){ S = JSON.parse(JSON.stringify(DEF)); V.player = null; }
  save(); render();
});
try { render(); } catch(err){ console.error(err); S = JSON.parse(JSON.stringify(DEF)); try { save(); } catch(x){} V.player = null; render(); }
