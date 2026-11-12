/* ---------- quests ---------- */
function viewQuests(){
  ensureQuest();
  const rows = QUESTS.map(q => {
    const v = Math.min(S.q[q.key], q.goal), ready = v >= q.goal, claimed = !!S.q.claimed[q.id];
    const reward = gameOn() ? `${q.coins} coins` : '10 XP';
    return `<div class="card"><div class="row" style="justify-content:space-between"><h3 style="margin:0">${esc(q.name)}</h3><span class="chip gold">${reward}</span></div>
      <div class="bar gold" style="margin:12px 0"><i style="width:${v/q.goal*100}%"></i></div>
      <div class="row" style="justify-content:space-between"><span class="muted">${v} of ${q.goal}</span>
      <button class="btn sm ${ready&&!claimed?'gold':''}" data-act="claim" data-id="${q.id}" ${(!ready||claimed)?'disabled':''}>${claimed?'Claimed':'Claim'}</button></div></div>`;
  }).join('');
  const dd = S.dispatch === today();
  return `<p class="label">Resets every day</p><h1>Daily quests</h1><div class="stack">${rows}
    <div class="card"><div class="row" style="justify-content:space-between"><h3 style="margin:0">Daily Dispatch</h3><span class="chip gold">${gameOn()?'20 coins':'15 XP'}</span></div><p class="muted">Five quick mixed questions against the clock.</p><button class="btn ${dd?'':'gold'}" data-act="dispatch" ${dd?'disabled':''}>${dd?'Done for today':'Start dispatch'}</button></div></div>
    <div class="card" style="margin-top:16px"><div class="row" style="justify-content:space-between"><h3 style="margin:0">Streak</h3><span class="stat fire">${ic('flame',22)}${liveStreak()} days</span></div><p class="muted">Your best is ${S.best} days. ${gameOn()?'Streak Freezes in the shop protect a missed day.':''}</p>${monthCal()}</div>`;
}

/* ---------- squad ---------- */
function squadRows(){
  const rows = RIVALS.map((r,i)=>({name:r[0], color:r[1], xp:r[2], me:false, idx:i}));
  rows.push({name:S.user||'You', color:'#ff2a2a', xp:S.weekXp, me:true, idx:-1});
  return rows.sort((a,b)=>b.xp-a.xp);
}
function viewBoard(){
  const rows = squadRows();
  const myRank = rows.findIndex(r=>r.me)+1;
  const league = S.weekXp >= 300 ? 'Gold League' : (S.weekXp >= 120 ? 'Silver League' : 'Bronze League');
  const list = rows.map((r,i)=>`<div class="brow ${r.me?'me':''}"><span class="rank">${i+1}</span><span class="mini-av" style="background:${r.color};color:#0a0a0a;font-weight:900">${esc(r.name.charAt(0).toUpperCase())}</span>
    <span class="grow"><b>${esc(r.name)}${r.me?' (you)':''}</b><br><span class="muted" style="font-size:13px">${i<3?'Promotion zone':'Holding'}</span></span><b>${r.xp} XP</b>
    ${r.me?'':`<button class="btn sm" data-act="duel" data-r="${r.idx}">Duel</button>`}</div>`).join('');
  return `<p class="label">${league} · resets weekly</p><h1>Squad ranking</h1>
    <div class="card cta" style="margin-bottom:16px"><div class="row" style="justify-content:space-between"><div><span class="label">Your rank</span><h2 style="margin:4px 0 0">#${myRank} of ${rows.length}</h2></div><div><span class="label">Duels won</span><h2 style="margin:4px 0 0">${S.duels}</h2></div></div>
      <p class="muted" style="margin:10px 0 0">Challenge a rival to a 5-question duel. Win to earn bonus XP. The rivals are sample agents in this prototype. Real squads come with accounts.</p></div>
    <div class="board">${list}</div>`;
}

/* ---------- shop ---------- */
function rarity(p){ return p >= 100 ? ['epic','Epic'] : (p >= 50 ? ['rare2','Rare'] : ['common','Common']); }
function viewShop(){
  const tabs = [['outfit','Outfits'],['acc','Gear'],['boost','Boosts']].map(t=>`<button class="optbtn" data-act="shoptab" data-t="${t[0]}" aria-pressed="${S.shopTab===t[0]}">${t[1]}</button>`).join('');
  const items = SHOP.filter(it=>it.kind===S.shopTab).map(it => {
    const rr = rarity(it.price);
    if(it.kind === 'boost'){
      const have = it.id==='boost-freeze' ? S.freezes : (it.id==='boost-hint' ? S.hints : S.armor);
      return `<div class="card shopcard"><div class="avatar" style="width:100%;min-height:120px;color:var(--gold)">${ic(it.id==='boost-freeze'?'flame':(it.id==='boost-hint'?'search':'shield'),64)}</div><h3 style="margin:0">${esc(it.name)}</h3><p class="muted" style="margin:0;font-size:14px">${esc(it.note)}</p><span class="chip">You have ${have}</span><button class="btn sm gold block" data-act="buy" data-id="${it.id}" ${S.coins<it.price?'disabled':''}>${ic('coin',16)} ${it.price}</button></div>`;
    }
    const own = S.owned.includes(it.id), eq = (it.kind==='outfit' ? S.equip.outfit : S.equip.acc) === it.id;
    const btn = own ? `<button class="btn sm ${eq?'':'red'} block" data-act="equip" data-id="${it.id}">${eq?'Equipped':'Equip'}</button>`
      : `<button class="btn sm gold block" data-act="buy" data-id="${it.id}" ${S.coins<it.price?'disabled':''}>${ic('coin',16)} ${it.price}</button>`;
    return `<div class="card shopcard"><div class="avatar" style="width:100%">${itemPreview(it)}</div><span class="rare ${rr[0]}">${rr[1]}</span><h3 style="margin:0">${esc(it.name)}</h3><p class="muted" style="margin:0;font-size:14px">${esc(it.note)}</p>${btn}</div>`;
  }).join('');
  return `<p class="label">Black market</p><h1>Shop</h1><p class="muted">You have <b style="color:var(--gold)">${S.coins} coins</b>. Earn more from missions, quests, supply crates and duels.</p><div class="tabsrow">${tabs}</div><div class="grid2" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr))">${items}</div>`;
}

/* ---------- agent ---------- */
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
    <div><h3>Gear</h3><div class="row">${accs}</div></div></div></div>`;
}
function viewAgent(){
  const acc = S.total ? Math.round(S.correct/S.total*100) : 0, rk = rankOf(S.xp);
  const badges = BADGES.map(b=>{ const on = S.badges.includes(b.id); return `<div class="badge ${on?'':'off'}"><span class="medal">${ic(on?b.icon:'lock',28)}</span><b>${esc(b.name)}</b><span class="muted">${esc(b.hint)}</span></div>`; }).join('');
  const cases = P_().chapters.map(id=>{ const M = MISSIONS[id], on = !!S.cases[id]; return `<div class="case ${on?'on':''}">${ic(on?'skull':'folder',28)}<div><b>${on?esc(M[1]):'Classified'}</b><br><span class="muted" style="font-size:13px">${esc(M[0])}</span></div>${on?'<span class="stamp">Defeated</span>':''}</div>`; }).join('');
  const tog = (act, label, on) => `<div class="toggle"><span>${label}</span><button class="optbtn" data-act="${act}" aria-pressed="${on}">${on?'On':'Off'}</button></div>`;
  return `<div class="hello" style="margin-bottom:16px">${gameOn()?`<div class="avatar" style="padding:8px"><div style="width:96px">${avatarSVG(S.equip)}</div></div>`:`<div>${mascot(90)}</div>`}
      <div class="grow"><p class="label">Agent file</p><h1 style="margin:0">${esc(S.user)}</h1><p style="margin:4px 0 0"><span class="chip red">${esc(rk.name)}</span> <span class="chip">${esc(P_().name)} track</span></p></div></div>
    <div class="grid2" style="grid-template-columns:repeat(auto-fit,minmax(130px,1fr));margin-bottom:16px">
      <div class="card"><span class="label">Total XP</span><h2 style="margin:4px 0 0">${S.xp}</h2></div>
      <div class="card"><span class="label">Best streak</span><h2 style="margin:4px 0 0">${S.best} d</h2></div>
      <div class="card"><span class="label">Accuracy</span><h2 style="margin:4px 0 0">${acc}%</h2></div>
      <div class="card"><span class="label">Steps done</span><h2 style="margin:4px 0 0">${doneCount()}</h2></div></div>
    ${gameOn() ? `<h2>Case files</h2><div class="stack" style="margin-bottom:22px">${cases}</div><h2>Your agent</h2>${editorHTML()}` : ''}
    <h2 style="margin-top:22px">Badges <span class="muted" style="font-size:16px">${S.badges.length}/${BADGES.length}</span></h2><div class="badgegrid">${badges}</div>
    ${S.certs.length ? `<h2 style="margin-top:22px">Certificates</h2>${S.certs.map(c=>certCard(c.path).replace(/<button class="btn red" data-act="advance">[^<]*<\/button>/,'')).join('')}` : ''}
    <div class="card" style="margin-top:22px"><h3>Settings</h3>
      ${tog('togsound','Sound effects',S.sound!==false)}${tog('togtimer','Timers in fights',!S.noTimer)}${tog('togassist','Assist mode for obstacle courses (no hazards)',!!S.assist)}
      <p class="muted" style="margin:12px 0">You are on the ${gameOn()?'Game':'Regular'} version and the ${esc(P_().name)} track.</p>
      <div class="row"><button class="btn sm" data-act="switchmode">Switch to ${gameOn()?'Regular':'Game'} version</button><button class="btn sm" data-act="retrack">Change track</button><button class="btn sm ghost" data-act="signout">Sign out</button></div>
      <div style="height:12px"></div>${S.confirmReset ? `<p style="color:var(--bad)">This erases all progress on this device.</p><div class="row"><button class="btn sm bad" data-act="reset">Yes, erase it</button><button class="btn sm" data-act="resetno">Cancel</button></div>` : `<button class="btn sm ghost" data-act="resetask">Reset progress</button>`}</div>`;
}
