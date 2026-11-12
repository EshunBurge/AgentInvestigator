/* ---------- lesson player ---------- */
let V = {player:null, scrollNext:false};
function openLesson(i){
  const lesson = buildLesson(S.path, i);
  V.player = {lesson, queue:lesson.screens.slice(), total:lesson.screens.length, finished:0, right:0, wrong:0, sel:null, checked:false, ok:false, done:false, rewards:null};
  renderPlayer();
}
function closePlayer(){ V.player = null; V.scrollNext = true; renderPlayer(); renderBase(); }
function initMatch(s, lessonI){
  if(s._m) return;
  const r = rng(lessonI*31+5);
  s._m = {defs: shuffle(s.pairs.map(p=>p[1]), r), terms: s.pairs.map(p=>p[0]), sel:null, matched:{}, matchedDef:{}, no:null};
}
function playerHead(p){
  const pct = Math.round(p.finished/p.total*100);
  return `<div class="phead"><button class="xbtn" data-act="quit" aria-label="Leave lesson">${ic('x',22)}</button>
    <div class="bar grow" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div>
    <span class="chip red">${TYPE_NAME[p.lesson.type]}</span></div>`;
}
function renderDone(p){
  const r = p.rewards, L = p.lesson;
  if(!r.passed){
    return `<div class="phead"><button class="xbtn" data-act="quit" aria-label="Leave lesson">${ic('x',22)}</button><div class="grow"></div></div>
      <div class="pbody"><div class="done-screen">${mascot(150)}<h1>Almost there</h1><p class="muted">You scored ${r.pct}%. You need 70% to pass this chapter test. Review the lessons and try again.</p>
      <div class="row"><button class="btn red" data-act="retry">Try again</button><button class="btn" data-act="quit">Back to map</button></div></div></div>`;
  }
  const next = nextIdx();
  return `<div class="phead"><button class="xbtn" data-act="quit" aria-label="Close">${ic('x',22)}</button><div class="grow"></div></div>
    <div class="pbody"><div class="done-screen">${mascot(150)}<h1>${r.perfect?'Flawless mission!':'Mission complete!'}</h1><p class="muted">${esc(L.topic)}: ${esc(L.title)}</p>
      <div class="score3"><div><span class="label">XP</span><b style="color:var(--red)">+${r.xp}</b></div><div><span class="label">${S.mode==='game'?'Coins':'Accuracy'}</span><b style="color:${S.mode==='game'?'var(--gold)':'var(--ok)'}">${S.mode==='game'?'+'+r.coins:r.pct+'%'}</b></div><div><span class="label">Streak</span><b style="color:#ff9d2a">${S.streak} d</b></div></div>
      ${r.cleared?`<div class="card hot" style="border-color:var(--gold);width:100%;max-width:480px"><h3 style="margin:0;color:var(--gold)">Level cleared!</h3><p class="muted" style="margin:6px 0 0">${S.mode==='game'?'Bonus 25 coins added.':'You finished the chapter.'}</p></div>`:''}
      ${r.pathDone?`<div class="card" style="border-color:var(--gold);width:100%;max-width:480px"><h3 style="margin:0;color:var(--gold)">Track complete!</h3><p class="muted" style="margin:6px 0 0">Your certificate is waiting on the Learn tab.</p></div>`:''}
      <button class="btn red block" style="max-width:480px" data-act="quit">${next === -1 || r.pathDone ? 'Back to map' : 'Continue'}</button></div></div>`;
}
function renderPlayer(){
  const el = document.getElementById('player');
  const p = V.player;
  if(!p){ el.innerHTML = ''; document.body.style.overflow = ''; return; }
  document.body.style.overflow = 'hidden';
  if(p.done){ el.innerHTML = `<div class="player">${renderDone(p)}</div>`; return; }
  const s = p.queue[0];
  let body = '', foot = '';
  if(s.kind === 'read'){
    body = `<span class="tag">${esc(s.tag)}</span><h2>${esc(s.title)}</h2><div class="readcard"><p>${esc(s.text)}</p><p class="muted" style="margin:0;font-size:15px">Why it matters: ${esc(s.extra)}</p></div>`;
    foot = `<div class="pfoot"><div class="pfoot-in"><span></span><button class="btn red" data-act="next">Got it</button></div></div>`;
  } else if(s.kind === 'mcq'){
    const opts = s.opts.map((o,k)=>{
      let cls = '';
      if(p.checked){ if(o === s.ans) cls = 'right'; else if(k === p.sel) cls = 'wrong'; }
      else if(k === p.sel) cls = 'sel';
      return `<button class="opt ${cls}" data-act="choose" data-k="${k}" ${p.checked?'disabled':''}><span class="k">${k+1}</span><span>${esc(o)}</span></button>`;
    }).join('');
    body = `<span class="tag">${esc(s.tag)}</span><h2>${esc(s.q)}</h2><div class="opts">${opts}</div>`;
    if(!p.checked) foot = `<div class="pfoot"><div class="pfoot-in"><span class="muted">Tip: press 1 to ${s.opts.length}, then Enter</span><button class="btn red" data-act="check" ${p.sel===null?'disabled':''}>Check</button></div></div>`;
    else foot = `<div class="pfoot ${p.ok?'good':'bad'}"><div class="pfoot-in"><div class="fb ${p.ok?'good':'bad'}"><strong>${p.ok?'Correct!':'Not quite.'}</strong><span>${p.ok?'':'Answer: '+esc(s.ans)+'. '}${esc(s.why)}</span></div><button class="btn ${p.ok?'ok':'bad'}" data-act="next">Continue</button></div></div>`;
  } else if(s.kind === 'match'){
    initMatch(s, p.lesson.i);
    const m = s._m, all = Object.keys(m.matched).length === s.pairs.length;
    const terms = m.terms.map((t,k)=>`<button class="pair ${m.matched[k]?'ok':''} ${m.sel===k?'sel':''} ${m.no&&m.no.t===k?'no':''}" data-act="pt" data-k="${k}" ${m.matched[k]?'disabled':''}>${esc(t)}</button>`).join('');
    const defs = m.defs.map((d,k)=>`<button class="pair ${m.matchedDef[k]?'ok':''} ${m.no&&m.no.d===k?'no':''}" data-act="pd" data-k="${k}" ${m.matchedDef[k]?'disabled':''}>${esc(d)}</button>`).join('');
    body = `<span class="tag">${esc(s.tag)}</span><h2>${esc(s.title)}</h2><p class="muted">Tap a term, then its meaning.</p><div class="pair-grid"><div class="stack">${terms}</div><div class="stack">${defs}</div></div>`;
    foot = all ? `<div class="pfoot good"><div class="pfoot-in"><div class="fb good"><strong>All matched!</strong></div><button class="btn ok" data-act="next">Continue</button></div></div>` : '';
  }
  el.innerHTML = `<div class="player">${playerHead(p)}<div class="pbody" id="pbody">${body}</div>${foot}</div>`;
}
function playerFinish(p){
  const r = rewardLesson(p.lesson, p.right, p.right + p.wrong, p.wrong);
  p.rewards = r; p.done = true; save();
}
function playerNext(){
  const p = V.player; if(!p) return;
  const s = p.queue[0];
  const retry = s.kind === 'mcq' && p.checked && !p.ok && p.lesson.type !== 'test';
  p.queue.shift();
  if(retry) p.queue.push(s); else p.finished++;
  p.sel = null; p.checked = false; p.ok = false;
  if(!p.queue.length) playerFinish(p);
  renderPlayer();
}
function playerCheck(){
  const p = V.player; if(!p || p.sel === null || p.checked) return;
  const s = p.queue[0];
  p.checked = true; p.ok = s.opts[p.sel] === s.ans;
  if(p.ok) p.right++; else p.wrong++;
  renderPlayer();
}
function playerMatch(kind, k){
  const p = V.player, s = p.queue[0], m = s._m;
  if(kind === 't'){ m.sel = (m.sel === k) ? null : k; renderPlayer(); return; }
  if(m.sel === null) return;
  const ok = s.pairs[m.sel][1] === m.defs[k];
  if(ok){ m.matched[m.sel] = true; m.matchedDef[k] = true; m.sel = null; p.right++; }
  else { p.wrong++; m.no = {t:m.sel, d:k}; m.sel = null; setTimeout(()=>{ m.no = null; if(V.player === p) renderPlayer(); }, 450); }
  renderPlayer();
}
document.addEventListener('keydown', e => {
  const p = V.player; if(!p || p.done) return;
  if(e.key === 'Escape'){ return; }
  const s = p.queue[0]; if(!s) return;
  if(s.kind === 'mcq' && !p.checked && /^[1-4]$/.test(e.key) && s.opts[+e.key-1] !== undefined){ p.sel = +e.key-1; renderPlayer(); }
  else if(e.key === 'Enter'){
    if(s.kind === 'read') playerNext();
    else if(s.kind === 'mcq'){ if(p.checked) playerNext(); else playerCheck(); }
    else if(s.kind === 'match' && Object.keys(s._m.matched).length === s.pairs.length) playerNext();
  }
});

/* ---------- base render ---------- */
function renderBase(){
  const app = document.getElementById('app');
  let h = '';
  if(S.step === 'landing' || (!S.user && S.step !== 'name')) h = viewLanding();
  else if(S.step === 'name') h = viewName();
  else if(S.step === 'mode') h = viewMode();
  else if(S.step === 'track') h = viewTrack();
  else if(S.step === 'char' && S.mode === 'game') h = viewChar();
  else {
    if(S.tab === 'shop' && S.mode !== 'game') S.tab = 'learn';
    const c = S.tab === 'quests' ? viewQuests() : S.tab === 'board' ? viewBoard() : S.tab === 'shop' ? viewShop() : S.tab === 'agent' ? viewAgent() : viewLearn();
    h = shell(c);
  }
  app.innerHTML = h;
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
  const a = b.dataset.act, d = b.dataset;
  if(a === 'choose'){ if(V.player && !V.player.checked){ V.player.sel = +d.k; renderPlayer(); } return; }
  if(a === 'check'){ playerCheck(); return; }
  if(a === 'next'){ playerNext(); return; }
  if(a === 'pt'){ playerMatch('t', +d.k); return; }
  if(a === 'pd'){ playerMatch('d', +d.k); return; }
  if(a === 'quit'){ closePlayer(); return; }
  if(a === 'retry'){ openLesson(V.player.lesson.i); return; }
  if(a === 'open'){ openLesson(+d.i); return; }
  if(a === 'start'){ S.step = S.setup ? 'app' : 'name'; if(S.user && !S.setup) S.step = 'name'; }
  if(a === 'enter'){ S.step = S.setup ? 'app' : 'name'; }
  if(a === 'mode'){ S.mode = d.m; S.step = 'track'; }
  if(a === 'track'){ S.path = d.p; if(S.setup) S.step = 'app'; else if(S.mode === 'game') S.step = 'char'; else { S.setup = true; S.step = 'app'; } S.tab = 'learn'; V.scrollNext = true; }
  if(a === 'finishsetup'){ S.setup = true; S.step = 'app'; S.tab = 'learn'; V.scrollNext = true; }
  if(a === 'tab'){ S.tab = d.t; if(d.t === 'learn') V.scrollNext = true; window.scrollTo(0,0); }
  if(a === 'set'){ S.equip[d.k] = (d.k === 'acc' && d.v === '') ? null : d.v; }
  if(a === 'equip'){ const it = SHOP.find(x=>x.id===d.id); if(it.kind === 'outfit') S.equip.outfit = it.id; else S.equip.acc = (S.equip.acc === it.id ? null : it.id); }
  if(a === 'buy'){ const it = SHOP.find(x=>x.id===d.id); if(S.coins >= it.price && !S.owned.includes(it.id)){ S.coins -= it.price; S.owned.push(it.id); S.bought++; grant('shopper'); if(it.kind === 'outfit') S.equip.outfit = it.id; else S.equip.acc = it.id; toast('Bought '+it.name); } }
  if(a === 'claim'){ ensureQuest(); const q = QUESTS.find(x=>x.id===d.id); if(q && S.q[q.key] >= q.goal && !S.q.claimed[q.id]){ S.q.claimed[q.id] = true; if(S.mode === 'game') S.coins += q.coins; else { S.xp += 10; S.weekXp += 10; } grant('quest'); toast('Reward claimed'); } }
  if(a === 'advance'){ const nx = ORDER[ORDER.indexOf(S.path)+1]; if(nx){ S.path = nx; S.tab = 'learn'; V.scrollNext = true; toast('Welcome to the '+PATHS[nx].name+' track'); } }
  if(a === 'switchmode'){ S.mode = S.mode === 'game' ? 'regular' : 'game'; S.tab = 'learn'; V.scrollNext = true; }
  if(a === 'retrack'){ S.step = 'track'; }
  if(a === 'signout'){ S = JSON.parse(JSON.stringify(DEF)); V.player = null; }
  save(); render();
});
render();
