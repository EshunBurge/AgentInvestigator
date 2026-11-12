/* ---------- shell ---------- */
const NAV = [['learn','Learn','book'],['quests','Quests','scroll'],['board','Squad','board'],['shop','Shop','shop'],['agent','Agent','user']];
const QUESTS = [
  {id:'lesson', name:'Finish 1 lesson', goal:1, key:'lessons', coins:10},
  {id:'xp', name:'Earn 30 XP', goal:30, key:'xp', coins:15},
  {id:'right', name:'Answer 8 questions correctly', goal:8, key:'right', coins:20}
];
const navItems = () => NAV.filter(n => n[0] !== 'shop' || S.mode === 'game');
function sidebar(){
  return `<aside class="side"><div class="brandmark">Agent <b>Investigator</b></div>${navItems().map(n=>`<button class="sidelink" data-act="tab" data-t="${n[0]}" ${S.tab===n[0]?'aria-current="page"':''}>${ic(n[2],26)}<span>${n[1]}</span></button>`).join('')}</aside>`;
}
function tabsBar(){
  return `<nav class="tabs" aria-label="Main">${navItems().map(n=>`<button class="tab" data-act="tab" data-t="${n[0]}" ${S.tab===n[0]?'aria-current="page"':''}>${ic(n[2],24)}<span>${n[1]}</span></button>`).join('')}</nav>`;
}
function topbar(){
  return `<div class="topbar"><div class="brandmark" style="font-family:var(--display);font-weight:700;letter-spacing:.06em;text-transform:uppercase;font-size:15px">Agent <b style="color:var(--red)">Inv.</b></div>
    <div class="row" style="gap:14px"><span class="stat fire">${ic('flame',20)}${S.streak}</span>${S.mode==='game'?`<span class="stat coin">${ic('coin',20)}${S.coins}</span>`:''}<span class="stat xp">${ic('star',20)}${S.xp}</span></div></div>`;
}
function questBar(q){ ensureQuest(); const v = Math.min(S.q[q.key], q.goal); return `<div class="q-row"><div class="qtitle"><span>${esc(q.name)}</span><span class="muted">${v}/${q.goal}</span></div><div class="bar gold"><i style="width:${v/q.goal*100}%"></i></div></div>`; }
function rail(){
  ensureQuest();
  const wk = weekDots().map(d=>`<span class="day ${d.on?'on':''}">${d.d}</span>`).join('');
  return `<aside class="rail">
    <div class="card"><div class="row" style="gap:10px;margin-bottom:12px"><span class="stat fire" style="font-size:26px">${ic('flame',30)}${S.streak}</span><span class="label">day streak</span></div>
      <div class="week">${wk}</div><p class="muted" style="margin:12px 0 0;font-size:14px">${S.last===today()?'Streak safe for today.':'Finish one lesson today to grow your streak.'}</p></div>
    <div class="card"><h3>Daily quests</h3><div class="stack">${QUESTS.map(questBar).join('')}</div><button class="btn sm block" style="margin-top:14px" data-act="tab" data-t="quests">View quests</button></div>
    <div class="card"><div class="row" style="justify-content:space-between"><h3 style="margin:0">Track progress</h3><span class="chip red">${esc(P_().name)}</span></div>
      <div class="bar" style="margin-top:12px"><i style="width:${Math.round(doneCount()/80*100)}%"></i></div><p class="muted" style="margin:8px 0 0;font-size:14px">${doneCount()} of 80 lessons</p></div>
  </aside>`;
}
function shell(content){ return `<div class="shell">${sidebar()}<main class="main" id="main">${topbar()}${content}</main>${rail()}</div>${tabsBar()}`; }

/* ---------- learn ---------- */
function certCard(path){
  const c = S.certs.find(x=>x.path===path) || {date:today()};
  return `<div class="cert" style="margin:16px 0">${ic('trophy',44)}<p class="label" style="color:var(--gold)">Certificate of completion</p><h2>${esc(PATHS[path].name)} Track</h2>
    <p>Awarded to <b>${esc(S.user)}</b> for completing every mission in the ${esc(PATHS[path].name)} track of Agent Investigator.</p><p class="muted">Issued ${esc(c.date)}</p>
    ${path !== 'fieldagent' ? `<button class="btn red" data-act="advance">Advance to ${esc(PATHS[ORDER[ORDER.indexOf(path)+1]].name)}</button>` : '<span class="chip gold">Highest clearance reached</span>'}</div>`;
}
function viewLearn(){
  const p = P_(), ni = nextIdx(), dc = doneCount(), pct = Math.round(dc/80*100);
  let h = `<div class="row" style="justify-content:space-between;margin-bottom:10px"><div><p class="label">${esc(p.name)} track · ${esc(p.who)}</p><h1 style="margin:0">${S.mode==='game'?'Mission map':'Your course'}</h1></div><span class="chip ${S.mode==='game'?'red':''}">${S.mode==='game'?'Game version':'Regular version'}</span></div>
    <div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div>
    <p class="muted" style="margin:8px 0 16px">${dc} of 80 lessons complete</p>`;
  if(ni === -1) h += certCard(S.path);
  const offs = [0,38,62,38,0,-38,-62,-38,0,38];
  p.chapters.forEach((id, ch) => {
    const T = TOPICS[id], cnt = chCount(ch), first = ch*10, cleared = cnt === 10;
    const status = cleared ? 'cleared' : (ni !== -1 && Math.floor(ni/10) === ch ? 'active' : (ni === -1 || ni > first+9 ? 'cleared' : 'locked'));
    if(S.mode === 'game'){
      h += `<div class="banner ${status==='locked'?'locked':(cleared?'cleared':'')}"><div><p class="label">Level ${ch+1} · ${cnt}/10</p><h3>${esc(T.name)}</h3></div>${ic(status==='locked'?'lock':(cleared?'check':'shield'),30)}</div><div class="path">`;
      for(let l=0;l<10;l++){
        const i = ch*10+l, d = isDone(i), nx = i === ni, lk = !unlocked(i);
        const type = TYPES[l];
        h += `<div class="node-wrap" style="transform:translateX(${offs[l]}px)">${nx?'<span class="bubble">START</span>':''}
          <button class="node ${d?'done':''} ${lk?'locked':''} ${nx?'next':''}" ${lk?'disabled':`data-act="open" data-i="${i}"`} aria-label="${TYPE_NAME[type]}: ${esc(T.steps[l][0])}${d?', complete':''}${lk?', locked':''}">${ic(d?'check':(lk?'lock':TYPE_ICON[type]),34)}</button>
          ${nx?`<span class="nodelabel">${TYPE_NAME[type]}: ${esc(T.steps[l][0])}</span>`:''}</div>`;
        if(nx) h += '<div style="height:20px"></div>';
      }
      h += '</div>';
    } else {
      h += `<div class="card" style="margin-bottom:14px"><div class="row" style="justify-content:space-between"><h3 style="margin:0">Chapter ${ch+1}: ${esc(T.name)}</h3><span class="chip ${cleared?'ok':''}">${cnt}/10</span></div><p class="muted" style="margin:6px 0 12px">${esc(T.blurb)}</p><div class="list-ch" style="margin:0">`;
      for(let l=0;l<10;l++){
        const i = ch*10+l, d = isDone(i), nx = i === ni, type = TYPES[l];
        h += `<button class="lrow" data-act="open" data-i="${i}"><span class="ico ${d?'done':(nx?'next':'')}">${ic(d?'check':TYPE_ICON[type],22)}</span><span class="grow"><b>${esc(T.steps[l][0])}</b><br><span class="muted" style="font-size:13px">${TYPE_NAME[type]}</span></span>${nx?'<span class="chip red">Next</span>':''}</button>`;
      }
      h += '</div></div>';
    }
  });
  return h;
}

/* ---------- quests, squad, shop, agent ---------- */
function viewQuests(){
  ensureQuest();
  const rows = QUESTS.map(q => {
    const v = Math.min(S.q[q.key], q.goal), ready = v >= q.goal, claimed = !!S.q.claimed[q.id];
    const reward = S.mode === 'game' ? `${q.coins} coins` : '10 XP';
    return `<div class="card"><div class="row" style="justify-content:space-between"><h3 style="margin:0">${esc(q.name)}</h3><span class="chip gold">${reward}</span></div>
      <div class="bar gold" style="margin:12px 0"><i style="width:${v/q.goal*100}%"></i></div>
      <div class="row" style="justify-content:space-between"><span class="muted">${v} of ${q.goal}</span>
      <button class="btn sm ${ready&&!claimed?'gold':''}" data-act="claim" data-id="${q.id}" ${(!ready||claimed)?'disabled':''}>${claimed?'Claimed':'Claim'}</button></div></div>`;
  }).join('');
  return `<p class="label">Resets every day</p><h1>Daily quests</h1><div class="stack">${rows}</div>
    <div class="card" style="margin-top:16px"><h3>Streak</h3><p>${S.streak} day${S.streak===1?'':'s'} in a row. Your best is ${S.best}.</p><div class="week">${weekDots().map(d=>`<span class="day ${d.on?'on':''}">${d.d}</span>`).join('')}</div></div>`;
}
function viewBoard(){
  const me = ['You: '+S.user, '#ff2a2a', S.weekXp, true];
  const all = RIVALS.map(r=>[r[0], r[1], r[2], false]).concat([me]).sort((a,b)=>b[2]-a[2]);
  const rows = all.map((r,i)=>`<div class="brow ${r[3]?'me':''}"><span class="rank">${i+1}</span><span class="mini-av" style="background:${r[1]};color:#0a0a0a;font-weight:900">${esc(r[0].replace('You: ','').charAt(0).toUpperCase())}</span><span class="grow"><b>${esc(r[0])}</b></span><b>${r[2]} XP</b></div>`).join('');
  return `<p class="label">Rookie Ring · this week</p><h1>Squad ranking</h1><p class="muted">Earn XP to climb. These rivals are sample agents for the prototype. Real squads arrive with accounts.</p><div class="board">${rows}</div>`;
}
function viewShop(){
  const cards = SHOP.map(it => {
    const own = S.owned.includes(it.id), eq = (it.kind==='outfit' ? S.equip.outfit : S.equip.acc) === it.id;
    const btn = own ? `<button class="btn sm ${eq?'':'red'} block" data-act="equip" data-id="${it.id}">${eq?'Equipped':'Equip'}</button>`
      : `<button class="btn sm gold block" data-act="buy" data-id="${it.id}" ${S.coins<it.price?'disabled':''}>${ic('coin',16)} ${it.price}</button>`;
    return `<div class="card shopcard"><div class="avatar" style="width:100%">${itemPreview(it)}</div><h3 style="margin:0">${esc(it.name)}</h3><p class="muted" style="margin:0;font-size:14px">${esc(it.note)}</p>${btn}</div>`;
  }).join('');
  return `<p class="label">Black market</p><h1>Shop</h1><p class="muted">You have <b style="color:var(--gold)">${S.coins} coins</b>. Clear lessons and levels to earn more.</p><div class="grid2" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr))">${cards}</div>`;
}
function editorHTML(){
  const e = S.equip;
  const sw = (list,k) => list.map(c=>`<button class="sw" style="background:${c}" data-act="set" data-k="${k}" data-v="${c}" aria-pressed="${e[k]===c}" aria-label="${k==='skin'?'Skin tone':'Hair color'} ${c}"></button>`).join('');
  const hairs = HAIRS.map(h=>`<button class="optbtn" data-act="set" data-k="hair" data-v="${h[0]}" aria-pressed="${e.hair===h[0]}">${h[1]}</button>`).join('');
  const outs = [['out-field','Field Jacket'], ...SHOP.filter(s=>s.kind==='outfit').map(s=>[s.id,s.name])].filter(o=>S.owned.includes(o[0])).map(o=>`<button class="optbtn" data-act="set" data-k="outfit" data-v="${o[0]}" aria-pressed="${e.outfit===o[0]}">${o[1]}</button>`).join('');
  const accs = [['','None'], ...SHOP.filter(s=>s.kind==='acc').map(s=>[s.id,s.name])].filter(o=>o[0]===''||S.owned.includes(o[0])).map(o=>`<button class="optbtn" data-act="set" data-k="acc" data-v="${o[0]}" aria-pressed="${(e.acc||'')===o[0]}">${o[1]}</button>`).join('');
  return `<div class="grid2" style="align-items:start"><div class="avatar">${avatarSVG(e)}</div><div class="stack">
    <div><h3>Skin</h3><div class="row">${sw(SKINS,'skin')}</div></div>
    <div><h3>Hair style</h3><div class="row">${hairs}</div></div>
    <div><h3>Hair color</h3><div class="row">${sw(HAIRC,'hairColor')}</div></div>
    <div><h3>Clothes</h3><div class="row">${outs}</div></div>
    <div><h3>Accessories</h3><div class="row">${accs}</div></div></div></div>`;
}
function viewAgent(){
  const acc = S.total ? Math.round(S.correct/S.total*100) : 0;
  const badges = BADGES.map(b=>{ const on = S.badges.includes(b.id); return `<div class="badge ${on?'':'off'}"><span class="medal">${ic(on?b.icon:'lock',28)}</span><b>${esc(b.name)}</b><span class="muted">${esc(b.hint)}</span></div>`; }).join('');
  return `<p class="label">Agent file</p><h1>${esc(S.user)}</h1>
    <div class="grid2" style="grid-template-columns:repeat(auto-fit,minmax(130px,1fr));margin-bottom:16px">
      <div class="card"><span class="label">Total XP</span><h2 style="margin:4px 0 0">${S.xp}</h2></div>
      <div class="card"><span class="label">Best streak</span><h2 style="margin:4px 0 0">${S.best} d</h2></div>
      <div class="card"><span class="label">Accuracy</span><h2 style="margin:4px 0 0">${acc}%</h2></div>
      <div class="card"><span class="label">Lessons</span><h2 style="margin:4px 0 0">${doneCount()}</h2></div></div>
    ${S.mode==='game' ? `<h2>Your agent</h2>${editorHTML()}` : ''}
    <h2 style="margin-top:22px">Badges <span class="muted" style="font-size:16px">${S.badges.length}/${BADGES.length}</span></h2><div class="badgegrid">${badges}</div>
    ${S.certs.length ? `<h2 style="margin-top:22px">Certificates</h2>${S.certs.map(c=>certCard(c.path).replace(/<button class="btn red" data-act="advance">[^<]*<\/button>/,'')).join('')}` : ''}
    <div class="card" style="margin-top:22px"><h3>Settings</h3><p class="muted">You are on the ${S.mode==='game'?'Game':'Regular'} version and the ${esc(P_().name)} track.</p>
      <div class="row"><button class="btn sm" data-act="switchmode">Switch to ${S.mode==='game'?'Regular':'Game'} version</button><button class="btn sm" data-act="retrack">Change track</button><button class="btn sm ghost" data-act="signout">Sign out</button></div></div>`;
}

/* ---------- landing and setup ---------- */
function stepDots(n){ return `<div class="stepdots" aria-hidden="true">${[1,2,3,4].map(k=>`<i class="${k<=n?'on':''}"></i>`).join('')}</div>`; }
function viewLanding(){
  const tracks = ['recruit','operative','fieldagent'].map(id=>`<div class="card"><span class="chip red">${esc(PATHS[id].name)}</span><h3 style="margin-top:12px">${esc(PATHS[id].who)}</h3><p class="muted">${esc(PATHS[id].blurb)} 8 chapters, 80 lessons.</p></div>`).join('');
  const feats = [['flame','Daily streaks','Do one lesson a day to build a streak and earn streak badges.'],['shield','Real levels','Each level mixes lessons, quizzes, activities, labs and a test, and gets harder as you go.'],['user','Your own agent','Pick skin, hair and spy gear. Buy new looks with coins from cleared levels.'],['trophy','Certificates','Finish a track to earn a certificate, then move up to the next one.']].map(f=>`<div class="card feat">${ic(f[0],34)}<h3>${f[1]}</h3><p class="muted" style="margin:0">${f[2]}</p></div>`).join('');
  const topics = [...new Set(Object.values(PATHS).flatMap(p=>p.chapters))].map(id=>`<span class="chip">${esc(TOPICS[id].name)}</span>`).join('');
  return `<div class="land"><div class="lnav"><div class="brandmark" style="font-family:var(--display);font-weight:700;letter-spacing:.06em;text-transform:uppercase;font-size:20px">Agent <b style="color:var(--red)">Investigator</b></div>
      ${S.user ? '<button class="btn sm red" data-act="enter">Continue</button>' : '<button class="btn sm" data-act="start">Log in</button>'}</div>
    <section class="hero"><div><p class="label">For grades 9 to 12</p><h1>Learn AI like a spy: <em>carefully</em>, ethically, one mission at a time.</h1>
      <p>Short missions teach you to use AI well at school and at work, and to know when not to trust it.</p>
      <div class="row"><button class="btn red" data-act="start">Get started</button><button class="btn" data-act="start">I have an agent file</button></div></div>
      <div style="display:grid;place-items:center">${mascot(230)}</div></section>
    <section class="section"><h2>Pick your clearance</h2><div class="grid3">${tracks}</div></section>
    <section class="section"><h2>Two ways to play</h2><div class="grid3"><div class="card"><span class="chip red">Game version</span><h3 style="margin-top:12px">Clear levels</h3><p class="muted" style="margin:0">Winding mission map, coins, a shop and a character to customize.</p></div>
      <div class="card"><span class="chip">Regular version</span><h3 style="margin-top:12px">Just the learning</h3><p class="muted" style="margin:0">Lessons, activities, quizzes and tests in order. No levels or shop.</p></div></div></section>
    <section class="section"><h2>Built to keep you coming back</h2><div class="grid3">${feats}</div></section>
    <section class="section"><h2>What you will learn</h2><div class="row">${topics}</div></section>
    <section class="section" style="text-align:center"><h2>Ready for your first mission?</h2><button class="btn red" data-act="start">Open my agent file</button></section></div>`;
}
function viewName(){
  return `<div class="setup">${stepDots(1)}<div style="display:grid;place-items:center">${mascot(120)}</div><h1>Pick a codename</h1><p class="muted">This is your agent name. Do not use your real name.</p>
    <form id="nameForm"><label for="codename" class="sr">Codename</label><input type="text" id="codename" maxlength="20" autocomplete="off" placeholder="e.g. Nightjar" value="${esc(S.user||'')}" required>
    <div style="height:14px"></div><button class="btn red block" type="submit">Continue</button></form></div>`;
}
function viewMode(){
  return `<div class="setup">${stepDots(2)}<h1>Choose your version</h1><p class="muted">You can switch later in Agent settings.</p>
    <button class="pick" data-act="mode" data-m="game">${ic('shield',34)}<span><strong>Game version</strong><small>Level map, coins, shop, character and badges. Lessons, quizzes, activities, labs and tests.</small></span></button>
    <button class="pick" data-act="mode" data-m="regular">${ic('book',34)}<span><strong>Regular version</strong><small>Just the lessons, activities, quizzes and tests, in order.</small></span></button></div>`;
}
function viewTrack(){
  return `<div class="setup">${stepDots(3)}<h1>Pick your track</h1><p class="muted">Choose the one that sounds like you. Finish it to move up.</p>
    ${ORDER.map(id=>`<button class="pick" data-act="track" data-p="${id}" aria-pressed="${S.path===id}">${ic(id==='recruit'?'star':(id==='operative'?'shield':'trophy'),34)}<span><strong>${esc(PATHS[id].name)}</strong><small>${esc(PATHS[id].who)}. ${esc(PATHS[id].blurb)}</small></span></button>`).join('')}</div>`;
}
function viewChar(){
  return `<div class="setup">${stepDots(4)}<h1>Build your agent</h1><p class="muted">You can change this any time.</p>${editorHTML()}<button class="btn red block" data-act="finishsetup">Start my first mission</button></div>`;
}
