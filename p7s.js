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
    <section class="section"><h2>Run obstacle courses</h2><div class="grid-auto"><div class="cx-card c-red"><span class="ico-chip">${ic('flame',26)}</span><h3>Jump, dodge, hack</h3><p class="muted">Every level is a course with moving platforms, lasers and spikes. Hack the terminals to open the gates.</p></div><div class="cx-card c-gold"><span class="ico-chip">${ic('coin',26)}</span><h3>Collect coins</h3><p class="muted">Spend them on spy outfits and gear for your agent.</p></div><div class="cx-card c-cyan"><span class="ico-chip">${ic('shield',26)}</span><h3>Real AI skills</h3><p class="muted">Each terminal is a lesson on using AI well and ethically.</p></div></div></section>
    <section class="section"><h2>Nine kinds of missions</h2><p class="muted" style="max-width:60ch">Every level is a story with a villain. You get briefed, fight, decode, forge prompts, hunt fakes and finish with a boss.</p><div class="grid3">${['brief','fire','decrypt','lie','forge','hunt','fire2','code','boss'].map(g=>`<div class="card feat">${ic(GICON[g],32)}<h3>${GNAME[g]}</h3><p class="muted" style="margin:0">${GDESC[g]}</p></div>`).join('')}</div></section>
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
