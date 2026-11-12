/* ---------- helpers ---------- */
const KEY = 'agent-investigator-v3';
const TYPES = ['lesson','quiz','activity','lesson','lab','quiz','lesson','activity','lab','test'];
const TYPE_NAME = {lesson:'Lesson', quiz:'Quiz', activity:'Activity', lab:'Lab', test:'Test'};
const TYPE_ICON = {lesson:'book', quiz:'quiz', activity:'puzzle', lab:'flask', test:'shield'};
const ICONS = {
  flame:'M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 2-4 3-6 1 2 2 3 3 3 0-3-1-5 0-9z',
  coin:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M9 12h6 M12 8v8',
  book:'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z M8 7h7 M8 11h7',
  quiz:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M9.5 9.5a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1 1-1.1 1.8 M12 17h.01',
  puzzle:'M5 9h4a2 2 0 1 1 4 0h4v4a2 2 0 1 0 0 4v3H5z',
  flask:'M9 3h6 M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3 M8 15h8',
  shield:'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M9 12l2 2 4-4',
  star:'M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z',
  check:'M5 12.5l4.5 4.5L19 7',
  lock:'M7 11V8a5 5 0 0 1 10 0v3 M5 11h14v10H5z',
  trophy:'M8 4h8v5a4 4 0 0 1-8 0z M8 6H4v1a3 3 0 0 0 3 3 M16 6h4v1a3 3 0 0 1-3 3 M12 13v4 M8 21h8 M10 17h4',
  user:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0',
  shop:'M4 7h16l-1 13H5z M8 7a4 4 0 0 1 8 0',
  scroll:'M7 4h11v14a3 3 0 0 1-3 3H6a3 3 0 0 0 3-3V6a2 2 0 0 0-2-2z M10 9h5 M10 13h5',
  x:'M6 6l12 12M18 6L6 18',
  board:'M5 20V10h4v10 M10 20V4h4v16 M15 20v-7h4v7',
  heart:'M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z',
  target:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M12 12h.01',
  eye:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  search:'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M16 16l5 5',
  spark:'M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z',
  skull:'M12 3a8 8 0 0 0-5 14v3h10v-3a8 8 0 0 0-5-14z M9 12h.01 M15 12h.01 M10 17v3 M14 17v3',
  key:'M8 14a4 4 0 1 1 3.9-5H21v3h-3v3h-3v-3h-3.1A4 4 0 0 1 8 14z',
  clock:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7v5l3 2',
  home:'M4 11l8-7 8 7v9H4z M10 20v-6h4v6',
  sound:'M4 9h4l5-4v14l-5-4H4z M16 9a4 4 0 0 1 0 6',
  gift:'M4 10h16v10H4z M3 7h18v3H3z M12 7v13 M12 7c-2-4-6-3-5 0 M12 7c2-4 6-3 5 0',
  folder:'M3 6h6l2 2h10v11H3z',
  arrow:'M5 12h14 M13 6l6 6-6 6'
};
const FILLED = {flame:1, star:1, heart:1};
function ic(n, s){ s = s || 24; return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${FILLED[n]?'currentColor':'none'}" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICONS[n]}"/></svg>`; }
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function fmt(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
const today = () => fmt(new Date());
const daysAgo = n => { const d = new Date(); d.setDate(d.getDate()-n); return fmt(d); };
function rng(seed){ let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function shuffle(arr, r){ const a = arr.slice(); for(let i=a.length-1;i>0;i--){ const j = Math.floor(r()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; } return a; }
function dseed(s){ let h = 7; for(let i=0;i<s.length;i++) h = (h*31 + s.charCodeAt(i)) | 0; return h >>> 0; }

BADGES.push({id:'boss',name:'Villain Down',hint:'Defeat a boss',icon:'skull'},{id:'duel',name:'Duelist',hint:'Win a rival duel',icon:'trophy'},{id:'dispatch',name:'On Call',hint:'Finish a Daily Dispatch',icon:'scroll'},{id:'combo',name:'Hot Streak',hint:'Get a 6-answer combo',icon:'flame'});

/* ---------- state ---------- */
const DEF = {user:null, step:'landing', setup:false, mode:null, path:'recruit', tab:'hq', xp:0, weekXp:0, coins:20, streak:0, best:0, last:null, days:{},
  done:{}, owned:['out-field'], equip:{outfit:'out-field', skin:SKINS[1], hair:'short', hairColor:HAIRC[0], acc:null},
  badges:[], correct:0, total:0, tests:0, bought:0, certs:[], cases:{}, chests:{}, hints:3, freezes:0, armor:0, dispatch:'', duels:0, sound:true, noTimer:false,
  manual:null, courses:{}, obbyCoins:{}, assist:false, topicAcc:{}, shopTab:'outfit', confirmReset:false, q:{date:'',lessons:0,xp:0,right:0,claimed:{}}};
let S = JSON.parse(JSON.stringify(DEF));
try { const raw = JSON.parse(localStorage.getItem(KEY) || '{}'); Object.assign(S, raw); } catch(e) {}
(function fixState(){
  const D = JSON.parse(JSON.stringify(DEF));
  Object.keys(D).forEach(k => { if(S[k] === undefined || S[k] === null && D[k] !== null || (typeof D[k] === 'object' && D[k] !== null && (typeof S[k] !== 'object' || Array.isArray(S[k]) !== Array.isArray(D[k])))) S[k] = D[k]; });
  Object.keys(D.equip).forEach(k => { if(S.equip[k] === undefined) S.equip[k] = D.equip[k]; });
  Object.keys(D.q).forEach(k => { if(S.q[k] === undefined) S.q[k] = D.q[k]; });
  if(!PATHS[S.path]) S.path = 'recruit';
  if(S.mode !== 'game' && S.mode !== 'regular') S.mode = S.setup ? 'game' : null;
  if(!SHOP.find(x => x.id === S.equip.outfit)) S.equip.outfit = 'out-field';
})();
function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e) {} }
function ensureQuest(){ if(S.q.date !== today()) S.q = {date:today(), lessons:0, xp:0, right:0, claimed:{}}; }
function toast(t){ const el = document.getElementById('toast'); if(!el) return; el.textContent = t; el.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(()=>el.classList.remove('show'), 2800); }
function grant(id){ if(S.badges.includes(id)) return; S.badges.push(id); const b = BADGES.find(x=>x.id===id); if(b) toast('Badge earned: '+b.name); }
let AC = null;
function sfx(n){
  if(S.sound === false) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)(); const t = AC.currentTime;
    const seq = {good:[[660,0],[880,.09]], bad:[[200,0],[150,.1]], win:[[523,0],[659,.1],[784,.2],[1047,.3]], lose:[[300,0],[220,.15],[160,.3]], click:[[520,0]], coin:[[988,0],[1319,.07]]}[n] || [];
    seq.forEach(([f,d]) => { const o = AC.createOscillator(), g = AC.createGain(); o.type = (n==='bad'||n==='lose') ? 'sawtooth' : 'square'; o.frequency.value = f; g.gain.setValueAtTime(.05, t+d); g.gain.exponentialRampToValueAtTime(.0001, t+d+.14); o.connect(g); g.connect(AC.destination); o.start(t+d); o.stop(t+d+.15); });
  } catch(e) {}
}
function liveStreak(){ if(S.last === today() || S.last === daysAgo(1)) return S.streak; if(S.last === daysAgo(2) && S.freezes > 0) return S.streak; return 0; }
function bumpStreak(){
  const t = today(); let up = false;
  if(S.last !== t){
    if(S.last === daysAgo(1)) S.streak++;
    else if(S.last === daysAgo(2) && S.freezes > 0){ S.freezes--; S.streak++; toast('Streak Freeze saved your streak'); }
    else S.streak = 1;
    S.last = t; up = true;
  }
  S.days[t] = true; S.best = Math.max(S.best, S.streak);
  if(S.streak >= 3) grant('streak3'); if(S.streak >= 7) grant('streak7'); if(S.streak >= 14) grant('streak14'); if(S.streak >= 30) grant('streak30');
  return up;
}
function addXp(n){ S.xp += n; S.weekXp += n; ensureQuest(); S.q.xp += n; }

/* ---------- progress ---------- */
const P_ = () => PATHS[S.path];
const key = i => S.path+':'+i;
const isDone = i => !!S.done[key(i)];
const doneCount = () => { let n=0; for(let i=0;i<80;i++) if(isDone(i)) n++; return n; };
function nextIdx(){ for(let i=0;i<80;i++) if(!isDone(i)) return i; return -1; }
function chDone(ch){ for(let l=0;l<10;l++) if(!isDone(ch*10+l)) return false; return true; }
function chCount(ch){ let n=0; for(let l=0;l<10;l++) if(isDone(ch*10+l)) n++; return n; }
function unlocked(i){ const n = nextIdx(); return n === -1 || i <= n || S.mode === 'regular'; }
const ltype = l => S.mode === 'game' ? GT[l] : TYPES[l];
const lname = l => S.mode === 'game' ? GNAME[GT[l]] : TYPE_NAME[TYPES[l]];
const licon = l => S.mode === 'game' ? GICON[GT[l]] : TYPE_ICON[TYPES[l]];
function weekDots(){ const out=[]; for(let k=6;k>=0;k--){ const d = new Date(); d.setDate(d.getDate()-k); out.push({d:'SMTWTFS'[d.getDay()], on: !!S.days[fmt(d)]}); } return out; }

/* ---------- lessons ---------- */
function mcqFrom(T, k, nOpt, r, tag){
  const s = T.steps[((k%10)+10)%10];
  return {kind:'mcq', tag:tag||'', q:s[2], opts:shuffle([s[3], ...s[4].slice(0, nOpt-1)], r), ans:s[3], why:s[5]};
}
function buildRegular(path, i){
  const ch = Math.floor(i/10), L = i%10, T = TOPICS[PATHS[path].chapters[ch]], type = TYPES[L];
  const r = rng(i*977 + path.length*31 + 7);
  const mcq = k => mcqFrom(T, k, 4, r);
  const step = T.steps[L];
  let screens = [];
  if(type === 'lesson') screens = [{kind:'read', tag:'Briefing', title:step[0], text:step[1], extra:T.blurb}, mcq(L), mcq(L+3), mcq(L+6)];
  else if(type === 'quiz') screens = [mcq(L), mcq(L+2), mcq(L+4), mcq(L+6), mcq(L+8)];
  else if(type === 'activity') screens = [{kind:'match', tag:'Activity', title:'Match each term to its meaning', pairs:T.terms}, mcq(L), mcq(L+5)];
  else if(type === 'lab'){ const lab = T.labs[L < 5 ? 0 : 1]; screens = [{kind:'mcq', tag:'Lab', q:'Mission: '+lab[0]+' Pick the strongest option.', opts:shuffle(lab[1], r), ans:lab[1][lab[2]], why:lab[3]}, mcq(L), mcq(L+4)]; }
  else { for(let k=0;k<8;k++) screens.push(mcq(L+k)); }
  const tagFor = {lesson:'Check', quiz:'Quiz', activity:'Activity', lab:'Lab', test:'Chapter test'}[type];
  screens.forEach(s => { if(s.kind === 'mcq' && !s.tag) s.tag = tagFor; });
  return {i, ch, L, type, game:false, topicId:PATHS[path].chapters[ch], title:step[0], topic:T.name, screens, arena:false, hearts:false};
}
function buildGame(path, i){
  const ch = Math.floor(i/10), L = i%10, tid = PATHS[path].chapters[ch], T = TOPICS[tid], M = MISSIONS[tid], gt = GT[L];
  const r = rng(i*977 + path.length*31 + 7);
  const nOpt = ch < 2 ? 3 : 4;
  const mcq = (k, tag) => mcqFrom(T, k, nOpt, r, tag);
  const step = T.steps[L];
  const out = {i, ch, L, type:gt, game:true, topicId:tid, topic:T.name, title:step[0], mission:M[0], villain:M[1], screens:[], arena:false, hearts:false, tmax:0, enemy:null};
  if(gt === 'brief'){
    if(L === 0) out.screens.push({kind:'story', tag:'Mission briefing', title:M[0], text:M[3], villain:M[1]});
    out.screens.push({kind:'read', tag:'Field note', title:step[0], text:step[1], extra:T.blurb}, mcq(L,'Intel check'), mcq(L+3,'Intel check'));
  } else if(gt === 'fire' || gt === 'fire2'){
    const ks = gt === 'fire' ? [0,2,4,6,8,1] : [3,5,7,9,1,8];
    out.arena = true; out.hearts = true; out.tmax = gt === 'fire' ? 20 : 15;
    out.enemy = {name: gt === 'fire' ? M[2] : 'Captured informant', max:6};
    ks.forEach(k => out.screens.push(mcq(L+k, gt === 'fire' ? 'Firefight' : 'Interrogation')));
  } else if(gt === 'decrypt'){
    out.screens.push({kind:'match', tag:'Decrypt', title:'Crack the file: match each term to its meaning', pairs:T.terms}, mcq(L,'Intel check'), mcq(L+5,'Intel check'));
  } else if(gt === 'lie'){
    out.hearts = true;
    const claims = [];
    T.terms.forEach((t, k) => {
      const other = T.terms[(k + 1 + Math.floor(r()*3)) % T.terms.length][1];
      claims.push({kind:'tf', tag:'Lie detector', term:t[0], claim:t[1], truth:true, why:'True. '+t[0]+': '+t[1]+'.'});
      claims.push({kind:'tf', tag:'Lie detector', term:t[0], claim:other === t[1] ? T.terms[(k+1)%4][1] : other, truth:false, why:'A lie. '+t[0]+' really means: '+t[1]+'.'});
    });
    out.screens = shuffle(claims, r);
  } else if(gt === 'forge'){
    const lab = T.labs[L < 5 ? 0 : 1], best = lab[1][lab[2]];
    const weak = lab[1].filter((o,k) => k !== lab[2]).sort((a,b)=>a.length-b.length)[0];
    const chips = shuffle([...GOOD_CHIPS.map(t=>({t,good:true})), ...BAD_CHIPS.map(t=>({t,good:false}))], r);
    out.screens.push({kind:'forge', tag:'Prompt Forge', scenario:lab[0], base:weak, chips, best, why:lab[3]}, mcq(L,'Intel check'));
  } else if(gt === 'hunt'){
    const H = HUNTS[tid];
    const lines = shuffle([...H[1].map(t=>({t, fake:false})), {t:H[2], fake:true}], r);
    out.screens.push({kind:'hunt', tag:'Fake hunt', title:H[0], lines, why:H[3]}, mcq(L,'Intel check'));
  } else if(gt === 'code'){
    shuffle(T.terms, r).forEach(t => {
      const word = t[0].replace(/[^A-Za-z]/g,'').toUpperCase();
      let tiles = shuffle(word.split(''), r); if(tiles.join('') === word) tiles = tiles.slice(1).concat(tiles[0]);
      out.screens.push({kind:'code', tag:'Code breaker', clue:t[1], word, label:t[0], tiles});
    });
  } else if(gt === 'boss'){
    out.arena = true; out.hearts = true; out.tmax = 15; out.enemy = {name:M[1], max:8, boss:true};
    for(let k=0;k<8;k++) out.screens.push(mcq(L+k, 'Boss fight'));
  }
  return out;
}
function buildLesson(path, i){ return S.mode === 'game' ? buildGame(path, i) : buildRegular(path, i); }
function mixedMcqs(n, seed, tag){
  const r = rng(seed), ids = PATHS[S.path].chapters, out = [];
  for(let k=0;k<n;k++){ const T = TOPICS[ids[Math.floor(r()*ids.length)]]; out.push(mcqFrom(T, Math.floor(r()*10), 4, r, tag)); }
  return out;
}
function buildDaily(){
  return {i:-1, ch:0, L:0, type:'daily', game:true, topicId:null, topic:'Mixed intel', title:'Daily Dispatch', mission:'Daily Dispatch', villain:'The Courier', screens:mixedMcqs(5, dseed(today()+S.path), 'Dispatch'), arena:true, hearts:false, tmax:20, enemy:{name:'The Courier', max:5}};
}
function buildDuel(idx){
  const rv = RIVALS[idx];
  return {i:-2, ch:0, L:0, type:'duel', game:true, topicId:null, topic:'Duel vs '+rv[0], title:'Duel vs '+rv[0], mission:'Rival Duel', villain:rv[0], screens:mixedMcqs(5, dseed(today()+rv[0]+Math.random()), 'Duel'), arena:true, hearts:false, tmax:15, enemy:null, rival:{name:rv[0], acc:0.5 + rv[2]/410*0.3, score:0}};
}

/* ---------- rewards ---------- */
const XPT = {brief:10, fire:15, decrypt:12, lie:12, forge:15, hunt:12, fire2:15, code:12, boss:30};
function baseOut(p){ const total = p.right + p.wrong; return {xp:0, coins:0, perfect:p.wrong === 0, pct: total ? Math.round(p.right/total*100) : 100, cleared:false, passed:true, failed:false, pathDone:false, streakUp:false, combo:p.maxCombo, bonus:0, debrief:null, villain:null}; }
function rewardLesson(lesson, p){
  ensureQuest();
  const out = baseOut(p);
  const test = lesson.type === 'test' || lesson.type === 'boss';
  if(lesson.type === 'test' && out.pct < 70){ out.passed = false; return out; }
  const first = !isDone(lesson.i);
  out.xp = S.mode === 'game' ? (XPT[lesson.type] || 10) : (test ? 25 : (lesson.type === 'lab' ? 12 : 10));
  if(out.perfect) out.xp += 5;
  if(lesson.arena){ out.bonus = Math.min(6, Math.floor(p.maxCombo/3)*2); out.xp += out.bonus; }
  out.coins = S.mode === 'game' ? Math.round(out.xp*0.8) : 0;
  if(first) S.done[key(lesson.i)] = true; else { out.xp = Math.ceil(out.xp/2); out.coins = Math.ceil(out.coins/2); }
  addXp(out.xp); S.coins += out.coins;
  S.q.lessons += 1; S.q.right += p.right; S.correct += p.right; S.total += p.right + p.wrong;
  if(lesson.topicId){ const ta = S.topicAcc[lesson.topicId] || (S.topicAcc[lesson.topicId] = {r:0,t:0}); ta.r += p.right; ta.t += p.right + p.wrong; }
  out.streakUp = bumpStreak();
  grant('first'); if(S.correct >= 25) grant('sharp'); if(out.perfect) grant('perfect'); if(p.maxCombo >= 6) grant('combo');
  if(test){ S.tests++; grant('test'); }
  if(lesson.type === 'boss'){ grant('boss'); S.cases[lesson.topicId] = true; out.villain = lesson.villain; }
  if(first && chDone(lesson.ch)){ out.cleared = true; grant('level'); if(S.mode === 'game'){ S.coins += 25; out.coins += 25; out.debrief = MISSIONS[lesson.topicId][4]; } }
  if(first && nextIdx() === -1){ out.pathDone = true; grant('track'); if(!S.certs.find(c=>c.path===S.path)) S.certs.push({path:S.path, date:today()}); }
  return out;
}
function rewardDaily(p){
  ensureQuest(); const out = baseOut(p);
  out.xp = 15 + (out.perfect ? 5 : 0); out.coins = S.mode === 'game' ? 20 : 0;
  addXp(out.xp); S.coins += out.coins; S.dispatch = today(); S.q.right += p.right; S.correct += p.right; S.total += p.right + p.wrong;
  out.streakUp = bumpStreak(); grant('dispatch'); return out;
}
function rewardDuel(p){
  ensureQuest(); const out = baseOut(p), me = p.right, rv = p.lesson.rival.score;
  out.duel = me > rv ? 'win' : (me === rv ? 'draw' : 'loss');
  out.xp = out.duel === 'win' ? 20 : (out.duel === 'draw' ? 10 : 5); out.coins = S.mode === 'game' ? (out.duel === 'win' ? 15 : (out.duel === 'draw' ? 8 : 0)) : 0;
  addXp(out.xp); S.coins += out.coins; S.q.right += me; S.correct += me; S.total += me + p.wrong;
  if(out.duel === 'win'){ S.duels++; grant('duel'); }
  out.streakUp = bumpStreak(); out.rv = rv; out.me = me; return out;
}
