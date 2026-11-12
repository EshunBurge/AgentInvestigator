/* ---------- player ---------- */
let V = {player:null, scrollNext:false, timer:null};
const typeLabel = L => L.game ? (GNAME[L.type] || 'Mission') : (TYPE_NAME[L.type] || 'Lesson');
function clearTimer(){ if(V.timer){ clearInterval(V.timer); V.timer = null; } }
function newPlayer(lesson){
  let hearts = 0;
  if(lesson.hearts){ hearts = 3; if(lesson.arena && S.armor > 0){ S.armor--; hearts = 4; toast('Armor plate equipped: 4 hearts'); save(); } }
  return {lesson, queue:lesson.screens.slice(), total:lesson.screens.length, finished:0, right:0, wrong:0, sel:null, checked:false, ok:false, retry:false, done:false, rewards:null,
    hearts, maxHearts:hearts, combo:0, maxCombo:0, hits:0, hidden:[], timeout:false, fb:'', hitAnim:false};
}
function openLesson(i){ V.player = newPlayer(buildLesson(S.path, i)); sfx('click'); renderPlayer(); }
function openDaily(){ if(S.dispatch === today()) return; V.player = newPlayer(buildDaily()); renderPlayer(); }
function openDuel(idx){ V.player = newPlayer(buildDuel(idx)); renderPlayer(); }
function closePlayer(){ clearTimer(); V.player = null; V.scrollNext = true; renderPlayer(); if(OB.active){ obResume(); } else renderBase(); }

function resolve(ok, fb){
  const p = V.player, L = p.lesson;
  clearTimer();
  p.checked = true; p.ok = ok; p.fb = fb || '';
  if(ok){ p.right++; p.combo++; p.maxCombo = Math.max(p.maxCombo, p.combo); if(L.arena) p.hits++; sfx('good'); }
  else { p.wrong++; p.combo = 0; if(L.hearts) p.hearts--; p.hitAnim = true; sfx('bad'); }
  if(L.rival && L.rival && Math.random() < L.rival.acc) L.rival.score++;
  renderPlayer();
}
function startTimer(p){
  clearTimer();
  const s = p.queue[0], L = p.lesson;
  if(!L.arena || !L.tmax || S.noTimer || p.checked || !s || s.kind !== 'mcq') return;
  p.tStart = Date.now();
  V.timer = setInterval(() => {
    const left = 1 - (Date.now() - p.tStart) / (L.tmax * 1000);
    const bar = document.getElementById('tbarI');
    if(bar){ bar.style.width = Math.max(0, left*100) + '%'; bar.classList.toggle('low', left < .3); }
    if(left <= 0){ clearTimer(); if(V.player === p && !p.checked){ p.sel = -1; p.timeout = true; resolve(false, 'Time is up. Answer: ' + s.ans + '. ' + s.why); } }
  }, 100);
}

function heartsHTML(p){
  let h = ''; for(let k=0;k<p.maxHearts;k++) h += `<span class="${k < p.hearts ? '' : 'off'}">${ic('heart',24)}</span>`;
  return `<div class="hearts" aria-label="${p.hearts} hearts left">${h}</div>`;
}
function hudHTML(p){
  const L = p.lesson, s = p.queue[0];
  let h = '';
  if(L.rival) h += `<div class="duel-hud card"><div><span class="label">You</span><br><b>${p.right}</b></div><span class="label">VS ${esc(L.rival.name)}</span><div><span class="label">Rival</span><br><b>${L.rival.score}</b></div></div>`;
  else if(L.enemy){
    const hp = Math.max(0, L.enemy.max - p.hits) / L.enemy.max * 100;
    h += `<div class="enemy ${L.enemy.boss?'boss':''}"><span class="ehead">${ic(L.enemy.boss?'skull':'target',26)}</span><div class="grow"><div class="row" style="justify-content:space-between"><b>${esc(L.enemy.name)}</b><span class="muted" style="font-size:13px">${Math.round(hp)}%</span></div><div class="ehp"><i style="width:${hp}%"></i></div></div></div>`;
  }
  if(L.hearts || p.combo >= 2) h += `<div class="hud-row">${L.hearts ? heartsHTML(p) : '<span></span>'}${p.combo >= 2 ? `<span class="combo">${ic('flame',20)} Combo x${p.combo}</span>` : ''}</div>`;
  if(L.arena && L.tmax && !S.noTimer && s && s.kind === 'mcq') h += `<div class="tbar" aria-hidden="true"><i id="tbarI" style="width:${p.checked ? 0 : 100}%"></i></div>`;
  return h ? `<div class="hud">${h}</div>` : '';
}
function playerHead(p){
  const pct = Math.round(p.finished / p.total * 100);
  return `<div class="phead"><button class="xbtn" data-act="quit" aria-label="Leave">${ic('x',22)}</button>
    <div class="bar grow" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div><span class="chip c" style="--c:${typeHex(p.lesson.type)}">${esc(typeLabel(p.lesson))}</span></div>`;
}
function feedbackFoot(p, label){
  return `<div class="pfoot ${p.ok?'good':'bad'}"><div class="pfoot-in"><div class="fb ${p.ok?'good':'bad'}"><strong>${p.ok?'Correct!':(p.timeout?'Too slow.':'Not quite.')}</strong><span>${p.fb}</span></div><button class="btn ${p.ok?'ok':'bad'}" data-act="next">${label || 'Continue'}</button></div></div>`;
}
function screenHTML(p){
  const s = p.queue[0], L = p.lesson; let body = '', foot = '';
  if(s.kind === 'story'){
    body = `<div class="story rise"><span class="tag">${esc(s.tag)}</span>${mascot(130)}<h1 style="margin:0">${esc(s.title)}</h1><div class="bubble-talk"><b>Shade:</b> ${esc(s.text)}</div>
      <div class="dossier"><span class="label">Target</span><div style="font-size:20px;font-weight:900">${esc(s.villain)}</div><span class="muted">Ten steps stand between you and the boss. Each one is a different kind of challenge.</span></div></div>`;
    foot = `<div class="pfoot"><div class="pfoot-in"><span></span><button class="btn red" data-act="next">Accept mission</button></div></div>`;
  } else if(s.kind === 'read'){
    body = `<span class="tag">${esc(s.tag)}</span><h2>${esc(s.title)}</h2><div class="readcard rise"><p>${esc(s.text)}</p><p class="muted" style="margin:0;font-size:15px">Why it matters: ${esc(s.extra)}</p></div>`;
    foot = `<div class="pfoot"><div class="pfoot-in"><span></span><button class="btn red" data-act="next">Got it</button></div></div>`;
  } else if(s.kind === 'mcq'){
    const opts = s.opts.map((o,k)=>{
      let cls = ''; const hid = p.hidden.includes(k);
      if(p.checked){ if(o === s.ans) cls = 'right'; else if(k === p.sel) cls = 'wrong'; } else if(k === p.sel) cls = 'sel';
      return `<button class="opt ${cls}" data-act="choose" data-k="${k}" ${(p.checked||hid)?'disabled':''} style="${hid?'opacity:.25':''}"><span class="k">${k+1}</span><span>${esc(o)}</span></button>`;
    }).join('');
    body = `<span class="tag">${esc(s.tag)}</span><h2>${esc(s.q)}</h2><div class="opts">${opts}</div>`;
    if(!p.checked){
      const canHint = L.game && S.hints > 0 && (s.opts.length - p.hidden.length) > 2;
      foot = `<div class="pfoot"><div class="pfoot-in"><span>${L.game?`<button class="btn sm" data-act="hint" ${canHint?'':'disabled'}>${ic('search',16)} Hint (${S.hints})</button>`:`<span class="muted">Press 1 to ${s.opts.length}, then Enter</span>`}</span><button class="btn red" data-act="check" ${p.sel===null||p.sel<0?'disabled':''}>Check</button></div></div>`;
    } else foot = feedbackFoot(p);
  } else if(s.kind === 'tf'){
    body = `<span class="tag">${esc(s.tag)}</span><h2>Is the suspect telling the truth?</h2><div class="tfcard rise"><div class="term">${esc(s.term)}</div><div class="says">"${esc(s.term)}" means: ${esc(s.claim)}</div></div>
      <div class="tfbtns"><button class="btn ok" data-act="tfans" data-v="1" ${p.checked?'disabled':''}>${ic('check',20)} Truth</button><button class="btn bad" data-act="tfans" data-v="0" ${p.checked?'disabled':''}>${ic('x',20)} Lie</button></div>`;
    foot = p.checked ? feedbackFoot(p) : '';
  } else if(s.kind === 'forge'){
    s._f = s._f || {sel:{}};
    const on = s.chips.filter((c,k)=>s._f.sel[k]), good = on.filter(c=>c.good).length, bad = on.filter(c=>!c.good).length, str = Math.max(0, Math.min(100, good*25 - bad*30));
    const chips = s.chips.map((c,k)=>`<button class="fchip ${s._f.sel[k]?'on':''}" data-act="fchip" data-k="${k}" ${p.checked&&p.ok?'disabled':''}>${esc(c.t)}</button>`).join('');
    body = `<span class="tag">${esc(s.tag)}</span><h2>Forge a prompt that gets results</h2><p class="muted">Mission: ${esc(s.scenario)}</p><p class="label">Your starting prompt</p>
      <div class="pbox">${esc(s.base)}${on.map(c=>' '+esc(c.t)).join('')}</div><p class="label" style="margin-top:14px">Prompt strength ${str}%</p><div class="meter ${str>=75?'full':''}"><i style="width:${str}%"></i></div>
      <p class="muted" style="margin:14px 0 0">Tap parts to add them. Strong prompts say who it is for, the format, a limit and the goal. Avoid demands and rule-breaking.</p><div class="chips">${chips}</div>`;
    foot = p.checked ? feedbackFoot(p, p.ok ? 'Continue' : 'Revise') : `<div class="pfoot"><div class="pfoot-in"><span class="muted">${on.length} parts added</span><button class="btn red" data-act="forgesend">Send prompt</button></div></div>`;
  } else if(s.kind === 'hunt'){
    s._h = s._h || {sel:null};
    const lines = s.lines.map((l,k)=>{ let cls = s._h.sel === k ? 'sel' : ''; if(p.checked){ cls = l.fake ? 'fake' : (s._h.sel === k ? 'wrong' : ''); } return `<button class="hline ${cls}" data-act="hline" data-k="${k}" ${p.checked?'disabled':''}>${esc(l.t)}</button>`; }).join('');
    body = `<span class="tag">${esc(s.tag)}</span><h2>One line in this report is forged</h2><div class="report"><span class="label">Intel report</span><h3 style="margin:4px 0 0">${esc(s.title)}</h3></div>${lines}`;
    foot = p.checked ? feedbackFoot(p) : `<div class="pfoot"><div class="pfoot-in"><span class="muted">Tap the forged line</span><button class="btn red" data-act="hcheck" ${s._h.sel===null?'disabled':''}>Accuse</button></div></div>`;
  } else if(s.kind === 'code'){
    s._c = s._c || {ans:[], shake:false};
    const slots = []; let pos = 0;
    s.label.split('').forEach(chr => { if(/[A-Za-z]/.test(chr)){ const idx = s._c.ans[pos]; slots.push(`<span class="slot ${idx!==undefined?'full':''}">${idx!==undefined?s.tiles[idx]:''}</span>`); pos++; } else slots.push('<span class="slot sp"></span>'); });
    const tiles = s.tiles.map((t,k)=>`<button class="tile" data-act="tile" data-k="${k}" ${s._c.ans.includes(k)||p.checked?'disabled':''}>${t}</button>`).join('');
    body = `<span class="tag">${esc(s.tag)}</span><h2>Decode the secret term</h2><div class="clue">${esc(s.clue)}</div><div class="slots ${s._c.shake?'hit':''}">${slots.join('')}</div><div class="tiles">${tiles}</div>
      ${p.checked?'':`<div class="row" style="justify-content:center;margin-top:16px"><button class="btn sm" data-act="cback">Undo letter</button></div>`}`;
    foot = p.checked ? feedbackFoot(p) : '';
  } else if(s.kind === 'match'){
    initMatch(s, L.i);
    const m = s._m, all = Object.keys(m.matched).length === s.pairs.length;
    const terms = m.terms.map((t,k)=>`<button class="pair ${m.matched[k]?'ok':''} ${m.sel===k?'sel':''} ${m.no&&m.no.t===k?'no':''}" data-act="pt" data-k="${k}" ${m.matched[k]?'disabled':''}>${esc(t)}</button>`).join('');
    const defs = m.defs.map((d,k)=>`<button class="pair ${m.matchedDef[k]?'ok':''} ${m.no&&m.no.d===k?'no':''}" data-act="pd" data-k="${k}" ${m.matchedDef[k]?'disabled':''}>${esc(d)}</button>`).join('');
    body = `<span class="tag">${esc(s.tag)}</span><h2>${esc(s.title)}</h2><p class="muted">Tap a term, then its meaning.</p><div class="pair-grid"><div class="stack">${terms}</div><div class="stack">${defs}</div></div>`;
    foot = all ? `<div class="pfoot good"><div class="pfoot-in"><div class="fb good"><strong>All matched!</strong></div><button class="btn ok" data-act="next">Continue</button></div></div>` : '';
  }
  return {body, foot};
}
function initMatch(s, i){ if(s._m) return; const r = rng(i*31+5); s._m = {defs:shuffle(s.pairs.map(p=>p[1]), r), terms:s.pairs.map(p=>p[0]), sel:null, matched:{}, matchedDef:{}, no:null}; }

function confetti(){
  const c = document.createElement('div'); c.className = 'confetti';
  const cols = ['#ff2a2a','#ffc800','#ffffff','#4ade80'];
  for(let k=0;k<50;k++){ const i = document.createElement('i'); i.style.left = Math.random()*100+'%'; i.style.background = cols[k%4]; i.style.animationDelay = Math.random()*.6+'s'; i.style.transform = 'rotate('+Math.random()*360+'deg)'; c.appendChild(i); }
  document.body.appendChild(c); setTimeout(()=>c.remove(), 3500);
}
function doneHTML(p){
  const r = p.rewards, L = p.lesson, head = `<div class="phead"><button class="xbtn" data-act="quit" aria-label="Close">${ic('x',22)}</button><div class="grow"></div></div>`;
  if(r.failed) return `${head}<div class="pbody"><div class="done-screen">${mascot(140)}<h1>Mission failed</h1><p class="muted">You ran out of hearts against ${esc(L.enemy?L.enemy.name:(L.villain||'the enemy'))}. Review the Manual and try again.</p><div class="row"><button class="btn red" data-act="retry">Try again</button><button class="btn" data-act="manual-from-fail">Open manual</button><button class="btn ghost" data-act="quit">Back</button></div></div></div>`;
  if(!r.passed) return `${head}<div class="pbody"><div class="done-screen">${mascot(140)}<h1>Almost there</h1><p class="muted">You scored ${r.pct}%. You need 70% to pass this test. Review and try again.</p><div class="row"><button class="btn red" data-act="retry">Try again</button><button class="btn" data-act="quit">Back</button></div></div></div>`;
  let title = r.perfect ? 'Flawless!' : 'Complete!', sub = esc(L.topic) + (L.i >= 0 ? ': ' + esc(L.title) : '');
  if(L.type === 'duel'){ title = r.duel === 'win' ? 'You won the duel!' : (r.duel === 'draw' ? 'Draw!' : 'You lost this duel'); sub = `You ${r.me} · ${esc(L.rival.name)} ${r.rv}`; }
  if(L.type === 'boss') title = esc(L.villain) + ' defeated!';
  const extra = [];
  if(r.bonus) extra.push(`Combo bonus +${r.bonus} XP (best combo x${r.combo})`);
  if(r.debrief) extra.push(`<b style="color:var(--gold)">Level cleared!</b> ${esc(r.debrief)}${gameOn()?' +25 coins.':''}`);
  if(r.pathDone) extra.push('<b style="color:var(--gold)">Track complete!</b> Your certificate is waiting on the Missions page.');
  const cards = extra.map(t=>`<div class="card" style="border-color:var(--gold);width:100%;max-width:480px;text-align:left;padding:12px 16px">${t}</div>`).join('');
  const mid = gameOn() ? ['Coins','+'+r.coins,'var(--gold)'] : ['Accuracy', r.pct+'%','var(--ok)'];
  return `${head}<div class="pbody"><div class="done-screen">${mascot(140)}<h1>${title}</h1><p class="muted">${sub}</p>
    <div class="score3"><div><span class="label">XP</span><b style="color:var(--red)">+${r.xp}</b></div><div><span class="label">${mid[0]}</span><b style="color:${mid[2]}">${mid[1]}</b></div><div><span class="label">Streak</span><b style="color:#ff9d2a">${liveStreak()} d</b></div></div>
    ${cards}<button class="btn red block" style="max-width:480px" data-act="quit">Continue</button></div></div>`;
}
function renderPlayer(){
  const el = document.getElementById('player'), p = V.player;
  clearTimer();
  if(!p){ el.innerHTML = ''; document.body.style.overflow = ''; return; }
  document.body.style.overflow = 'hidden';
  if(p.done){ el.innerHTML = `<div class="player">${doneHTML(p)}</div>`; return; }
  const sc = screenHTML(p);
  el.innerHTML = `<div class="player ${p.hitAnim?'hit':''}">${playerHead(p)}<div class="pbody" id="pbody">${hudHTML(p)}${sc.body}</div>${sc.foot}</div>`;
  p.hitAnim = false;
  startTimer(p);
}

/* ---------- player actions ---------- */
function finishMission(p, failed){
  clearTimer(); const L = p.lesson;
  if(failed){ p.rewards = {failed:true}; sfx('lose'); }
  else {
    p.rewards = L.type === 'daily' ? rewardDaily(p) : (L.type === 'duel' ? rewardDuel(p) : rewardLesson(L, p));
    if(p.rewards.passed){ sfx('win'); if(L.type === 'boss' || p.rewards.cleared || p.rewards.pathDone || p.rewards.duel === 'win') setTimeout(confetti, 150); } else sfx('lose');
  }
  p.done = true; save(); renderPlayer();
}
function playerNext(){
  const p = V.player; if(!p) return;
  const s = p.queue[0], L = p.lesson;
  sfx('click');
  if(p.retry){ p.retry = false; p.checked = false; p.ok = false; p.fb = ''; renderPlayer(); return; }
  if(L.hearts && p.hearts <= 0){ finishMission(p, true); return; }
  const noRequeue = ['test','duel','daily'].includes(L.type);
  const requeue = s.kind === 'mcq' && p.checked && !p.ok && !noRequeue;
  p.queue.shift();
  if(requeue) p.queue.push(s); else p.finished++;
  p.sel = null; p.checked = false; p.ok = false; p.timeout = false; p.fb = ''; p.hidden = [];
  if(!p.queue.length){ finishMission(p, false); return; }
  renderPlayer();
}
function playerCheck(){
  const p = V.player; if(!p || p.sel === null || p.sel < 0 || p.checked) return;
  const s = p.queue[0], ok = s.opts[p.sel] === s.ans;
  resolve(ok, (ok ? '' : 'Answer: ' + esc(s.ans) + '. ') + esc(s.why));
}
function playerMatch(kind, k){
  const p = V.player, s = p.queue[0], m = s._m;
  if(kind === 't'){ m.sel = (m.sel === k) ? null : k; renderPlayer(); return; }
  if(m.sel === null) return;
  if(s.pairs[m.sel][1] === m.defs[k]){ m.matched[m.sel] = true; m.matchedDef[k] = true; m.sel = null; p.right++; sfx('good'); }
  else { p.wrong++; p.combo = 0; m.no = {t:m.sel, d:k}; m.sel = null; sfx('bad'); setTimeout(()=>{ m.no = null; if(V.player === p) renderPlayer(); }, 450); }
  renderPlayer();
}
function forgeSend(){
  const p = V.player, s = p.queue[0], on = s.chips.filter((c,k)=>s._f.sel[k]), good = on.filter(c=>c.good).length, bad = on.length - good;
  const str = Math.max(0, Math.min(100, good*25 - bad*30));
  if(str >= 75) resolve(true, `Strength ${str}%. The agency's gold standard: "${esc(s.best)}". ${esc(s.why)}`);
  else {
    clearTimer(); p.checked = true; p.ok = false; p.retry = true; p.wrong++; p.combo = 0; sfx('bad');
    p.fb = bad ? `Strength ${str}%. Remove the demands and rule-breaking. They weaken a prompt.` : `Strength ${str}%. Add more of: who it is for, the format, a limit and your goal.`;
    renderPlayer();
  }
}
function codeTile(k){
  const p = V.player, s = p.queue[0], c = s._c; if(p.checked || c.ans.includes(k)) return;
  c.ans.push(k); sfx('click');
  if(c.ans.length === s.word.length){
    const guess = c.ans.map(i=>s.tiles[i]).join('');
    if(guess === s.word) resolve(true, 'Decoded: ' + esc(s.label) + '. ' + esc(s.clue));
    else { p.wrong++; p.combo = 0; c.shake = true; sfx('bad'); renderPlayer(); setTimeout(()=>{ c.ans = []; c.shake = false; if(V.player === p) renderPlayer(); }, 500); return; }
    return;
  }
  renderPlayer();
}
document.addEventListener('keydown', e => {
  const p = V.player; if(!p || p.done) return;
  const s = p.queue[0]; if(!s) return;
  if(s.kind === 'mcq' && !p.checked && /^[1-4]$/.test(e.key) && s.opts[+e.key-1] !== undefined && !p.hidden.includes(+e.key-1)){ p.sel = +e.key-1; renderPlayer(); }
  else if(e.key === 'Enter'){
    if(s.kind === 'read' || s.kind === 'story' || p.checked) playerNext();
    else if(s.kind === 'mcq') playerCheck();
  }
});
