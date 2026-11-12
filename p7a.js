/* ---------- shell ---------- */
const NAV_COL = {hq:'c-red',learn:'c-orange',manual:'c-blue',quests:'c-gold',board:'c-green',shop:'c-pink',agent:'c-purple'};
const NAV_ALL = [['hq','HQ','home'],['learn','Missions','shield'],['manual','Manual','book'],['quests','Quests','scroll'],['board','Squad','board'],['shop','Shop','shop'],['agent','Agent','user']];
const NAV_SUB = {hq:'Overview',learn:'Lessons and levels',manual:'Study guides',quests:'Daily goals',board:'Rankings',shop:'Outfits and gear',agent:'Profile and badges'};
const NAV_MOBILE = ['hq','learn','quests','shop','agent'];
const QUESTS = [
  {id:'lesson', name:'Finish 1 mission step', goal:1, key:'lessons', coins:10},
  {id:'xp', name:'Earn 30 XP', goal:30, key:'xp', coins:15},
  {id:'right', name:'Answer 8 questions correctly', goal:8, key:'right', coins:20}
];
const gameOn = () => S.mode === 'game';
const navAll = () => NAV_ALL.filter(n => n[0] !== 'shop' || gameOn()).map(n => n[0]==='learn' ? [n[0], gameOn()?'Missions':'Course', n[2]] : n);
const navMobile = () => navAll();
function sidebar(){
  return `<aside class="side"><nav class="sidenav" aria-label="Main">${navAll().map(n=>`<button class="sidelink ${NAV_COL[n[0]]}" data-act="tab" data-t="${n[0]}" title="${n[1]}: ${NAV_SUB[n[0]]}" aria-label="${n[1]}" ${S.tab===n[0]?'aria-current="page"':''}>${ic(n[2],24)}<span class="sl"><b>${n[1]}</b><small>${NAV_SUB[n[0]]}</small></span></button>`).join('')}</nav>
    <button class="btn red block sidego" data-act="goon" title="Jump to your next mission">${ic('arrow',20)}<span class="sl">Continue</span></button></aside>`;
}
function tabsBar(){
  return `<nav class="tabs" aria-label="Main">${navMobile().map(n=>`<button class="tab ${NAV_COL[n[0]]}" data-act="tab" data-t="${n[0]}" ${S.tab===n[0]?'aria-current="page"':''}>${ic(n[2],24)}<span>${n[1]}</span></button>`).join('')}</nav>`;
}
function topbar(){
  return `<div class="topbar"><span class="topname">${esc(navAll().find(n=>n[0]===S.tab)?.[1]||'')}</span><div class="row" style="gap:10px"><button class="btn sm jump" data-act="pal" aria-label="Quick jump" title="Quick jump (press K)">${ic('search',16)}<span class="jt">Jump to… <kbd>K</kbd></span></button><span class="stat fire">${ic('flame',20)}${liveStreak()}</span>${gameOn()?`<span class="stat coin">${ic('coin',20)}${S.coins}</span>`:''}<span class="stat xp">${ic('star',20)}${S.xp}</span></div></div>`;
}
function questBar(q){ ensureQuest(); const v = Math.min(S.q[q.key], q.goal); return `<div class="q-row"><div class="qtitle"><span>${esc(q.name)}</span><span class="muted">${v}/${q.goal}</span></div><div class="bar gold"><i style="width:${v/q.goal*100}%"></i></div></div>`; }
function rail(){
  ensureQuest();
  const wk = weekDots().map(d=>`<span class="day ${d.on?'on':''}">${d.d}</span>`).join('');
  const ni = nextIdx(), M = ni >= 0 ? MISSIONS[P_().chapters[Math.floor(ni/10)]] : null;
  return `<aside class="rail">
    <div class="card"><div class="row" style="gap:10px;margin-bottom:12px"><span class="stat fire" style="font-size:26px">${ic('flame',30)}${liveStreak()}</span><span class="label">day streak</span></div>
      <div class="week">${wk}</div><p class="muted" style="margin:12px 0 0;font-size:14px">${S.last===today()?'Streak safe for today.':'Finish one step today to grow your streak.'}</p></div>
    <div class="card"><h3>Daily quests</h3><div class="stack">${QUESTS.map(questBar).join('')}</div><button class="btn sm block" style="margin-top:14px" data-act="tab" data-t="quests">View quests</button></div>
    ${gameOn() && M ? `<div class="card"><span class="label">Current mission</span><h3 style="margin:6px 0">${esc(M[0])}</h3><p class="muted" style="margin:0;font-size:14px">Villain: ${esc(M[1])}</p></div>` : ''}
  </aside>`;
}
const PAGE_INFO = () => ({learn:[gameOn()?'Missions':'Course', gameOn()?'Each level is an obstacle course. Reach the terminals, hack them (a short lesson) and open the gates.':'Your lessons in order. Finish one to unlock the next.'], manual:['Manual','Study guides for every topic. Read them any time, before or after a lesson.'], quests:['Quests','Small daily goals. Finish them to earn rewards.'], board:['Squad','See how your XP (points) compares with other agents.'], shop:['Shop','Spend the coins you collect on outfits and gear for your agent.'], agent:['Agent','Your profile, badges, certificates and settings.']})[S.tab];
const PAGE_COL = {hq:'',learn:'c-orange',manual:'c-blue',quests:'c-gold',board:'c-green',shop:'c-pink',agent:'c-purple'};
function ticker(){
  const ni = nextIdx(), M = ni >= 0 ? MISSIONS[P_().chapters[Math.floor(ni/10)]] : null, tip = TIPS(), rk = rankOf(S.xp);
  const items = ['Rank: '+rk.name, 'XP '+S.xp, 'Streak '+liveStreak()+' days', gameOn() ? 'Coins '+S.coins : 'Tests passed '+S.tests, 'Accuracy '+(S.total?Math.round(S.correct/S.total*100):0)+'%', M ? 'Active op: '+M[0] : 'All ops cleared', M ? 'Threat: '+M[1] : 'No threats detected', 'Intel: '+tip.title, 'Steps cleared '+doneCount()+'/80'];
  const row = items.map(t=>'<span><i></i>'+esc(t)+'</span>').join('');
  return '<div class="ticker" aria-hidden="true"><div class="tk-track">'+row+row+'</div></div>';
}
const tilesRow = arr => '<div class="stat-row" style="margin-bottom:18px">'+arr.map(x=>statTile(x[0],x[1],x[2],x[3])).join('')+'</div>';
function pageStats(){
  const t = S.tab, p = P_(); if(t === 'hq') return '';
  const cl = p.chapters.filter((_,ch)=>chDone(ch)).length; ensureQuest();
  if(t === 'learn') return tilesRow([['c-orange','shield',doneCount()+'/80','Steps cleared'],['c-green','check',cl+'/8',gameOn()?'Levels cleared':'Chapters done'],['c-gold','clock',Object.keys(S.courses).length,'Courses finished'],['c-cyan','target',(S.total?Math.round(S.correct/S.total*100):0)+'%','Answer accuracy']]);
  if(t === 'quests') return tilesRow([['c-gold','scroll',QUESTS.filter(q=>S.q[q.key]>=q.goal).length+'/'+QUESTS.length,'Goals done today'],['c-cyan','star',S.q.xp,'XP earned today'],['c-orange','flame',liveStreak(),'Day streak'],['c-green','check',Object.keys(S.q.claimed||{}).length,'Rewards claimed']]);
  if(t === 'board'){ const rows = squadRows(), pos = rows.findIndex(r=>r.me)+1, up = rows[pos-2]; return tilesRow([['c-green','trophy','#'+pos,'Your rank this week'],['c-gold','star',S.weekXp,'XP this week'],['c-orange','target',up?Math.max(0,up.xp-S.weekXp):0,'XP to pass '+(up?up.name:'the lead')],['c-pink','skull',S.duels,'Duels won']]); }
  if(t === 'shop') return tilesRow([['c-gold','coin',S.coins,'Coins to spend'],['c-pink','shop',S.owned.length+'/'+SHOP.filter(x=>x.kind!=='boost').length,'Items owned'],['c-cyan','search',S.hints,'Hints in stock'],['c-blue','shield',S.freezes+S.armor,'Freezes and armor']]);
  if(t === 'manual') return tilesRow([['c-blue','book',p.chapters.length,'Topics in this track'],['c-cyan','key',p.chapters.reduce((n,id)=>n+(TOPICS[id].terms||[]).length,0),'Key words to learn'],['c-green','target',Math.round(p.chapters.reduce((n,id)=>n+topicPct(id),0)/8)+'%','Average mastery']]);
  if(t === 'agent') return tilesRow([['c-purple','trophy',S.badges.length+'/'+BADGES.length,'Badges earned'],['c-gold','star',S.certs.length,'Certificates'],['c-green','target',(S.total?Math.round(S.correct/S.total*100):0)+'%','Accuracy'],['c-orange','flame',S.best,'Best streak (days)']]);
  return '';
}
function pageHead(){
  const i = PAGE_INFO(); if(!i) return '';
  return `<div class="phead"><div class="crumb"><button class="crumbbtn" data-act="tab" data-t="hq">Home</button><span>/</span><b>${i[0]}</b></div><p class="muted">${i[1]}</p><button class="btn sm red" data-act="goon">Continue ${ic('arrow',16)}</button></div>`;
}
function shell(content){ return `<div class="shell">${sidebar()}<main class="main tab-${S.tab} ${PAGE_COL[S.tab]||''}" id="main">${topbar()}${pageHead()}${pageStats()}${content}</main>${rail()}</div>${tabsBar()}`; }

/* ---------- HQ ---------- */
function monthCal(){
  const now = new Date(), y = now.getFullYear(), m = now.getMonth();
  const first = new Date(y, m, 1).getDay(), dim = new Date(y, m+1, 0).getDate();
  let h = ['S','M','T','W','T','F','S'].map(d=>`<span class="h">${d}</span>`).join('');
  for(let k=0;k<first;k++) h += '<span class="pad"></span>';
  for(let d=1; d<=dim; d++){ const id = y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0'); h += `<span class="${S.days[id]?'on':''} ${id===today()?'tdy':''}">${d}</span>`; }
  return `<div class="cal">${h}</div>`;
}
const TIPS = () => { const ids = Object.keys(TOPICS), r = rng(dseed(today())); const T = TOPICS[ids[Math.floor(r()*ids.length)]]; const s = T.steps[Math.floor(r()*10)]; return {topic:T.name, title:s[0], note:s[1]}; };
const LV_COL = ['c-red','c-orange','c-gold','c-green','c-cyan','c-blue','c-purple','c-pink'];
const LV_HEX = ['#ff2a2a','#ff9d2a','#ffc800','#4ade80','#2fe0d0','#4dabff','#b388ff','#ff6bb5'];
const GCOL = {brief:'#4dabff',fire:'#ff2a2a',decrypt:'#b388ff',lie:'#ff9d2a',forge:'#2fe0d0',hunt:'#ff6bb5',fire2:'#ff9d2a',code:'#4ade80',boss:'#ffc800',daily:'#ffc800',duel:'#ff6bb5'};
const typeHex = L => GCOL[L] || '#ff2a2a';
const topicPct = id => { const a = S.topicAcc[id]; return a && a.t ? Math.round(a.r/a.t*100) : 0; };
const statTile = (cls, icon, val, lab) => `<div class="tile-stat ${cls}"><span class="ico-chip">${ic(icon,28)}</span><div><div class="big">${val}</div><div class="label">${lab}</div></div></div>`;
const sect = (t, cls) => `<h2 class="sect ${cls||'c-red'}"><i></i>${t}</h2>`;
function viewHQ(){
  const rk = rankOf(S.xp), ni = nextIdx(), p = P_();
  const tip = TIPS(), dispatchDone = S.dispatch === today(); ensureQuest();
  let hero = '', mission = '';
  if(ni === -1){
    mission = `<div class="mission-box"><span class="label">Track complete</span><h2>${esc(p.name)} track cleared</h2><p class="muted">Your certificate is waiting.</p></div><div class="row" style="margin-top:14px"><button class="btn red" data-act="tab" data-t="learn">View certificate</button></div>`;
  } else {
    const ch = Math.floor(ni/10), l = ni%10, M = MISSIONS[p.chapters[ch]], T = TOPICS[p.chapters[ch]];
    mission = gameOn()
      ? `<div class="mission-box"><span class="label">Level ${ch+1} of 8 · step ${l+1} of 10</span><h2>${esc(M[0])}</h2><p class="muted" style="margin:0">Villain: <b style="color:var(--fg)">${esc(M[1])}</b>. Next step: <b style="color:var(--fg)">${esc(lname(l))}</b>.</p></div>
        <div class="row" style="margin-top:14px"><button class="btn red" data-act="course" data-ch="${ch}">${ic('flame',20)} Run obstacle course</button><button class="btn" data-act="open" data-i="${ni}">${ic(licon(l),20)} Play next step</button></div>`
      : `<div class="mission-box"><span class="label">Chapter ${ch+1} of 8 · lesson ${l+1} of 10</span><h2>${esc(T.name)}</h2><p class="muted" style="margin:0">${esc(lname(l))}: ${esc(T.steps[l][0])}</p></div>
        <div class="row" style="margin-top:14px"><button class="btn red" data-act="open" data-i="${ni}">Continue course</button><button class="btn" data-act="tab" data-t="learn">Course outline</button></div>`;
  }
  const pct = Math.round(doneCount()/80*100);
  const wk = weekDots();
  const stage = `<section class="stage">${(()=>{const r=rng(11);let h='';for(let k=0;k<16;k++)h+=`<i class="pt" style="left:${Math.round(r()*100)}%;--d:${(6+r()*8).toFixed(1)}s;animation-delay:-${(r()*10).toFixed(1)}s;--s:${(3+r()*5).toFixed(0)}px"></i>`;return h;})()}<span class="sys"><i></i>Agent online</span><p class="label">${esc(rk.name)} · ${esc(p.name)} track</p><h1>Hey, ${esc(S.user)}</h1><div class="ask" data-p='${JSON.stringify(ni===-1?["Track complete.","Claim your certificate."]:["Ready for the next mission?","Hack terminals. Earn coins.","Learn to use AI the smart way.","Beat the Imitator."])}'><span class="tw">${ni===-1?"Track complete.":"Ready for the next mission?"}</span><span class="caret"></span></div>
    ${mission}</section>`;
  const bars = wk.map(d=>`<span class="vb"><i style="height:${d.on?100:14}%"></i><em>${d.d}</em></span>`).join('');
  const chs = p.chapters.map((id,ch)=>chCount(ch));
  let cum = 0, pts = chs.map((c,ch)=>{ cum += c; return [ch, cum]; });
  const lx = v => 10 + v/7*220, ly = v => 70 - v/80*60;
  let path = 'M'+lx(0)+' '+ly(0); pts.forEach(([ch,v],n)=>{ path += ' L'+lx(ch+1)+' '+ly(pts[n-1]?pts[n-1][1]:0)+' L'+lx(ch+1)+' '+ly(v); });
  const accBars = p.chapters.map((id,ch)=>`<span class="hb ${LV_COL[ch%8]}"><i style="height:${Math.max(8,topicPct(id))}%"></i></span>`).join('');
  const acc = S.total?Math.round(S.correct/S.total*100):0;
  let ticks = ''; for(let t=0;t<41;t++){ const ang = Math.PI + t/40*Math.PI, on = t/40*100 <= pct; const x1 = 120+Math.cos(ang)*92, y1 = 120+Math.sin(ang)*92, x2 = 120+Math.cos(ang)*(t%5===0?72:78), y2 = 120+Math.sin(ang)*(t%5===0?72:78); ticks += `<line class="tk" style="animation-delay:${450+t*20}ms" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${on?'#ff4b3a':'rgba(255,255,255,.35)'}" stroke-width="${t%5===0?4:3}" stroke-linecap="round"/>`; }
  const gauge = `<div class="glass tall"><div class="gicons">${['flame','target','star','shield','coin'].map((x,k)=>`<span class="${k===2?'on':''}">${ic(x,18)}</span>`).join('')}</div><svg viewBox="0 0 240 130" role="img" aria-label="${pct} percent of the track complete">${ticks}<text x="120" y="112" text-anchor="middle" fill="#fff" font-size="40" font-weight="900" font-family="Nunito,sans-serif">${pct}%</text></svg><p class="label" style="text-align:center">Track progress</p><h3 style="text-align:center;margin:4px 0 2px">${esc(rk.name)}</h3><p class="muted" style="text-align:center;margin:0;font-size:14px">${rk.next ? rk.need+' XP to '+esc(rk.next) : 'Top rank'}</p><p class="hint">XP = points you earn. Rank = your title.</p></div>`;
  const how = `<div class="how">${(gameOn()?[['1','Run a course','Jump and dodge to reach glowing terminals.'],['2','Hack terminals','Each one is a short lesson or quiz on using AI.'],['3','Earn coins','Open gates, clear the level, buy outfits.']]:[['1','Pick a lesson','Lessons, activities and quizzes in order.'],['2','Pass the test','Score well to unlock the next chapter.'],['3','Earn a certificate','Finish all 8 chapters to graduate the track.']]).map(x=>`<div><span class="hn">${x[0]}</span><div><b>${x[1]}</b><p class="muted">${x[2]}</p></div></div>`).join('')}</div>`;

  /* radar */
  const names = p.chapters.map(id => TOPICS[id].name.replace(/^(Using |AI for |AI )/,'').split(' ').slice(0,2).join(' '));
  const vals = p.chapters.map((id,ch) => Math.max(14, topicPct(id)*Math.min(1, chCount(ch)/4), chCount(ch)*10));
  const CX = 150, CY = 124, R = 84, pt = (i, r) => { const ang = -Math.PI/2 + i/8*2*Math.PI; return [CX + Math.cos(ang)*r, CY + Math.sin(ang)*r]; };
  const rings = [25,50,75,100].map(l => '<polygon points="'+p.chapters.map((_,i)=>pt(i,R*l/100).join(',')).join(' ')+'" fill="none" stroke="rgba(255,255,255,.18)"/>').join('');
  const spokes = p.chapters.map((_,i)=>'<line x1="'+CX+'" y1="'+CY+'" x2="'+pt(i,R)[0].toFixed(1)+'" y2="'+pt(i,R)[1].toFixed(1)+'" stroke="rgba(255,255,255,.14)"/>').join('');
  const poly = vals.map((v,i)=>pt(i,R*v/100).map(n=>n.toFixed(1)).join(',')).join(' ');
  const dots = vals.map((v,i)=>{ const q = pt(i,R*v/100); return '<circle cx="'+q[0].toFixed(1)+'" cy="'+q[1].toFixed(1)+'" r="4" fill="'+LV_HEX[i]+'"/>'; }).join('');
  const labs = names.map((n,i)=>{ const q = pt(i,R+18), c = Math.cos(-Math.PI/2+i/8*2*Math.PI); return '<text x="'+q[0].toFixed(1)+'" y="'+(q[1]+4).toFixed(1)+'" text-anchor="'+(Math.abs(c)<.2?'middle':(c>0?'start':'end'))+'" fill="'+LV_HEX[i]+'" font-size="11" font-weight="800" font-family="Space Grotesk,sans-serif">'+esc(n)+'</text>'; }).join('');
  const radarCard = '<div class="glass c-purple"><div class="gh"><span class="ico-chip">'+ic('target',22)+'</span><b>Skill radar</b><span class="muted">8 topics</span></div><svg class="radar" viewBox="-30 0 360 250" role="img" aria-label="Skill levels across the eight topics">'+rings+spokes+'<polygon class="rpoly" points="'+poly+'" fill="rgba(179,136,255,.28)" stroke="#b388ff" stroke-width="2.5" stroke-linejoin="round"/>'+dots+labs+'</svg><p class="hint">The bigger the shape, the more you have learned. Each corner is one topic.</p></div>';
  /* rings */
  const ringDefs = [['lessons','c-orange','#ff9d2a','Steps today',50],['xp','c-green','#4ade80','XP today',38],['right','c-cyan','#2fe0d0','Correct answers',26]];
  const ringSvg = ringDefs.map((r,k)=>{ const q = QUESTS.find(x=>x.key===r[0]); const v = q ? Math.min(100, Math.round(S.q[q.key]/q.goal*100)) : 0; return '<circle cx="80" cy="80" r="'+r[4]*1+'" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="10"/><circle class="rg" pathLength="100" cx="80" cy="80" r="'+r[4]+'" fill="none" stroke="'+r[2]+'" stroke-width="10" stroke-linecap="round" stroke-dasharray="'+Math.max(v,1)+' 100" transform="rotate(-90 80 80)" style="animation-delay:'+(.4+k*.2)+'s"/>'; }).join('');
  const ringLeg = ringDefs.map(r=>{ const q = QUESTS.find(x=>x.key===r[0]); const v = q ? Math.min(S.q[q.key], q.goal) : 0; return '<div class="rl"><i style="background:'+r[2]+'"></i><span class="grow">'+r[3]+'</span><b>'+v+'/'+(q?q.goal:0)+'</b></div>'; }).join('');
  const ringCard = '<div class="glass c-green"><div class="gh"><span class="ico-chip">'+ic('clock',22)+'</span><b>Daily rings</b><span class="muted">Resets at midnight</span></div><div class="rings"><svg viewBox="0 0 160 160" role="img" aria-label="Daily goal rings">'+ringSvg+'</svg><div class="rleg">'+ringLeg+'</div></div><p class="hint">Close all three rings every day to keep your streak strong.</p></div>';
  /* dossier */
  const outfit = SHOP.find(x=>x.id===S.equip.outfit);
  const inv = [['Hints',S.hints,'Hide a wrong answer','c-cyan','search'],['Streak freezes',S.freezes,'Protects your streak for one missed day','c-blue','shield'],['Armor',S.armor,'Survive one wrong answer in a fight','c-orange','heart'],['Badges',S.badges.length+'/'+BADGES.length,'Earned so far','c-gold','trophy']].map(x=>'<div class="inv '+x[3]+'"><span class="ico-chip" style="width:34px;height:34px;border-radius:11px">'+ic(x[4],18)+'</span><div class="grow"><b>'+x[0]+'</b><small>'+x[2]+'</small></div><span class="big" style="font-size:22px">'+x[1]+'</span></div>').join('');
  const dossier = '<div class="glass c-red"><div class="gh"><span class="ico-chip">'+ic('user',22)+'</span><b>Agent file</b><span class="muted">'+esc(p.name)+' clearance</span></div><div class="dos"><div class="dav">'+avatarSVG(S.equip)+'</div><div><h3 style="margin:0">'+esc(S.user)+'</h3><p class="muted" style="margin:2px 0">'+esc(rk.name)+(outfit?' · '+esc(outfit.name):'')+'</p><span class="chip c" style="--c:#4ade80">Active</span></div></div><div class="invs">'+inv+'</div></div>';
  /* briefing */
  const bch = ni === -1 ? 0 : Math.floor(ni/10), bl = ni === -1 ? 0 : ni%10, BT = TOPICS[p.chapters[bch]], BM = MISSIONS[p.chapters[bch]];
  const learnList = BT.steps.slice(bl, bl+3).map((s,k)=>'<li><span class="hn" style="width:26px;height:26px;font-size:13px;border-radius:8px">'+(k+1)+'</span><div><b>'+esc(s[0])+'</b><small>'+esc(s[1])+'</small></div></li>').join('');
  const terms = (BT.terms||[]).slice(0,4).map(t=>'<div class="term"><b>'+esc(t[0])+'</b><span>'+esc(t[1])+'</span></div>').join('');
  const brief = '<div class="glass c-orange wide-b"><div class="gh"><span class="ico-chip">'+ic('scroll',22)+'</span><b>Mission briefing</b><span class="muted">'+esc(BM[0])+'</span></div><p style="margin:0 0 12px">'+esc(gameOn()?BM[3]:BT.blurb)+'</p><div class="bcols"><div><p class="label">Coming up</p><ol class="learn">'+learnList+'</ol></div><div><p class="label">Key words to know</p><div class="terms">'+terms+'</div></div></div></div>';
  /* activity log */
  const logLines = ['Agent '+S.user+' signed in','Track: '+p.name+' ('+doneCount()+' of 80 steps cleared)','Streak: '+liveStreak()+' day'+(liveStreak()===1?'':'s')+(S.freezes?' · '+S.freezes+' freeze':'')]
    .concat(S.badges.slice(-3).reverse().map(id=>{ const b = BADGES.find(x=>x.id===id); return b ? 'Badge unlocked: '+b.name : ''; }).filter(Boolean))
    .concat([ni===-1?'All missions complete':'Next objective: '+(gameOn()?BM[0]:BT.name)]);
  const logCard = '<div class="glass c-green"><div class="gh"><span class="ico-chip">'+ic('search',22)+'</span><b>Activity log</b><span class="muted">Live</span></div><div class="term-log">'+logLines.map((l,k)=>'<div style="animation-delay:'+(.3+k*.18)+'s"><em>&gt;</em> '+esc(l)+'</div>').join('')+'<div class="cur"><em>&gt;</em> <span class="caret"></span></div></div></div>';

  const hubT = [
    ['c-orange','shield',gameOn()?'Missions':'Course', ni===-1?'Track complete':(gameOn()?'Level '+(Math.floor(ni/10)+1)+' · '+doneCount()+'/80 done':'Lesson '+(doneCount()+1)+' of 80'),'tab','learn'],
    ['c-gold','scroll','Daily Dispatch', dispatchDone?'Done for today':'5-question quiz · ready','dispatch',''],
    ['c-green','target','Quests', QUESTS.filter(q=>S.q[q.key]>=q.goal).length+' of '+QUESTS.length+' goals done','tab','quests'],
    ['c-blue','book','Manual','Study guides and key words','tab','manual'],
    ['c-pink','board','Squad','You are #'+(squadRows().findIndex(r=>r.me)+1)+' this week','tab','board'],
    gameOn()?['c-purple','shop','Shop',S.coins+' coins to spend','tab','shop']:['c-purple','user','Agent',S.badges.length+' badges earned','tab','agent']
  ].map(h=>'<button class="hubt '+h[0]+'" data-act="'+h[4]+'" '+(h[5]?'data-t="'+h[5]+'"':'')+'><span class="ico-chip">'+ic(h[1],26)+'</span><span class="grow"><b>'+h[2]+'</b><small>'+h[3]+'</small></span><span class="go">'+ic('arrow',18)+'</span></button>').join('');
  const hub = '<div class="hub">'+hubT+'</div>';
  const ladder = '<div class="glass c-gold"><div class="gh"><span class="ico-chip">'+ic('trophy',22)+'</span><b>Rank ladder</b><span class="muted">Earn XP to climb</span></div><div class="ladder">'+RANKS.map((r,k)=>'<div class="rung '+(k<rk.i?'done':'')+' '+(k===rk.i?'now':'')+'"><span class="rdot">'+(k<rk.i?ic('check',14):(k+1))+'</span><div class="grow"><b>'+r[1]+'</b><small>'+r[0]+' XP</small></div>'+(k===rk.i?'<span class="chip c" style="--c:#ffc800">You are here</span>':'')+'</div>').join('')+'</div></div>';
  const hunt = '<div class="glass c-pink wide-b"><div class="gh"><span class="ico-chip">'+ic('spark',22)+'</span><b>Badge hunt</b><span class="muted">'+S.badges.length+' of '+BADGES.length+' earned</span></div><div class="hunt2">'+BADGES.filter(b=>!S.badges.includes(b.id)).slice(0,6).map((b,k)=>'<div class="hb2 '+LV_COL[(k+2)%8]+'"><span class="ico-chip" style="width:38px;height:38px;border-radius:12px">'+ic(b.icon,20)+'</span><div><b>'+esc(b.name)+'</b><small>'+esc(b.hint)+'</small></div></div>').join('')+'</div></div>';
  const panels = '<div class="bento2">'+brief+radarCard+dossier+ringCard+logCard+ladder+hunt+'</div>';
  const bento = `<div class="bento">
    <div class="glass c-orange"><div class="gh"><span class="ico-chip">${ic('flame',22)}</span><b>Streak</b><span class="muted">Last 7 days</span></div><div class="gm"><div><div class="big">${liveStreak()}</div><div class="label">days in a row</div></div><div class="vbars">${bars}</div></div></div>
    <div class="glass c-cyan"><div class="gh"><span class="ico-chip">${ic('shield',22)}</span><b>Progress</b><span class="muted">${p.name}</span></div><div class="gm"><div><div class="big">${doneCount()}<small>/80</small></div><div class="label">steps cleared</div></div><svg class="line" viewBox="0 0 240 80" preserveAspectRatio="none"><path pathLength="1" d="${path}" fill="none" stroke="#ffc800" stroke-width="3" stroke-linejoin="round"/></svg></div></div>
    <div class="glass c-green"><div class="gh"><span class="ico-chip">${ic('target',22)}</span><b>Accuracy</b><span class="muted">By topic</span></div><div class="gm"><div><div class="big">${acc}<small>%</small></div><div class="label">answers correct</div></div><div class="hbars">${accBars}</div></div></div>
    ${gauge}
    <div class="glass wide2 c-red"><span class="label">Agent score</span><div class="score"><b>${S.xp}</b><span>XP</span></div><p class="muted" style="text-align:center;margin:0">${esc(rk.name)} rank${S.q.xp?` · +${S.q.xp} today`:''}</p><svg class="wave" viewBox="0 0 400 70" preserveAspectRatio="none"><path pathLength="1" d="M0 35 C50 5 100 65 150 35 S250 5 300 35 S360 60 400 30" fill="none" stroke="#ff9d2a" stroke-width="2"/><path pathLength="1" d="M0 40 C50 65 100 10 150 40 S250 65 300 40 S360 15 400 40" fill="none" stroke="#ff4b3a" stroke-width="2"/></svg><div class="row" style="justify-content:space-between"><span class="muted">${gameOn()?S.coins+' coins':S.tests+' tests'}</span><span class="muted">${gameOn()?Object.keys(S.cases).length+' villains beaten':doneCount()+' lessons'}</span></div></div>
    <div class="glass wide2 c-gold"><span class="label">Today's goals</span><div class="todo c-gold" style="margin:12px 0">${QUESTS.map(q=>{ const v = Math.min(S.q[q.key], q.goal), ok = v >= q.goal; return `<div><span class="ck ${ok?'on':''}">${ok?ic('check',16):''}</span><span class="grow">${esc(q.name)}</span><span class="muted">${v}/${q.goal}</span></div>`; }).join('')}</div><button class="btn sm ${dispatchDone?'':'gold'}" data-act="dispatch" ${dispatchDone?'disabled':''}>${dispatchDone?'Dispatch done':'Daily Dispatch'}</button></div>
  </div>`;
  const qs = QUESTS.map(q => { const v = Math.min(S.q[q.key], q.goal), ok = v >= q.goal; return `<div><span class="ck ${ok?'on':''}">${ok?ic('check',16):''}</span><span class="grow">${esc(q.name)}</span><span class="muted">${v}/${q.goal}</span></div>`; }).join('');
  const tip3 = `<div class="glass c-blue"><div class="gh"><span class="ico-chip">${ic('book',22)}</span><b>${esc(tip.title)}</b></div><p class="muted" style="margin:0">${esc(tip.note)}</p><p class="label" style="margin:8px 0 0">${esc(tip.topic)}</p></div>`;
  const _unused = `<div class="grid-auto">
    <div class="glass cx-card c-gold"><span class="ico-chip">${ic('scroll',26)}</span><h3>Daily Dispatch</h3><p class="muted">5 quick questions. ${gameOn()?'Beat the clock for 20 coins.':'Bonus XP.'}</p><button class="btn ${dispatchDone?'':'gold'}" data-act="dispatch" ${dispatchDone?'disabled':''}>${dispatchDone?'Done for today':'Start dispatch'}</button></div>
    <div class="glass cx-card c-green"><span class="ico-chip">${ic('target',26)}</span><h3>Today's goals</h3><div class="todo c-green">${qs}</div></div>
    <div class="glass cx-card c-blue"><span class="ico-chip">${ic('book',26)}</span><h3>${esc(tip.title)}</h3><p class="muted" style="margin:0">${esc(tip.note)}</p><p class="label" style="margin-top:8px">Field tip · ${esc(tip.topic)}</p></div></div>`;
  let road = '<div class="lvl-grid">' + p.chapters.map((id, ch) => {
    const M = MISSIONS[id], T = TOPICS[id], cnt = chCount(ch), lk = ch > 0 && !chDone(ch-1) && gameOn() && ni !== -1 && Math.floor(ni/10) < ch;
    return `<button class="lvl ${LV_COL[ch%8]}" ${lk?'disabled':(gameOn()?`data-act="course" data-ch="${ch}"`:`data-act="tab" data-t="learn"`)}><span class="row" style="gap:8px"><span class="ico-chip" style="width:36px;height:36px;border-radius:12px">${ic(lk?'lock':(cnt===10?'check':(gameOn()?'flame':'book')),20)}</span><span class="label">${gameOn()?'Level':'Chapter'} ${ch+1}</span></span><b class="name">${esc(gameOn()?M[0]:T.name)}</b><div class="bar" style="height:10px"><i style="width:${cnt*10}%"></i></div><span class="muted" style="font-size:14px">${cnt}/10 steps</span></button>`;
  }).join('') + '</div>';
  const mastery = '<div class="mastery">' + p.chapters.map((id,ch) => `<div class="row2 ${LV_COL[ch%8]}"><div class="row" style="justify-content:space-between"><b>${esc(TOPICS[id].name)}</b><span class="muted">${S.topicAcc[id]?topicPct(id)+'%':'not started'}</span></div><div class="bar" style="height:12px"><i style="width:${topicPct(id)}%"></i></div></div>`).join('') + '</div>';
  const top3 = squadRows().slice(0,3).map((r,i)=>`<div class="mini"><span class="rank">${i+1}</span><span class="mini-av" style="background:${r.color};color:#0a0a0a;font-weight:900">${esc(r.name.charAt(0))}</span><span class="grow"><b>${esc(r.name)}${r.me?' (you)':''}</b></span><b>${r.xp} XP</b></div>`).join('');
  const recent = S.badges.slice(-6).map((id,k)=>{ const b = BADGES.find(x=>x.id===id); return b ? `<span class="chip c ${LV_COL[k%8]}">${ic(b.icon,16)} ${esc(b.name)}</span>` : ''; }).join('') || '<p class="muted" style="margin:0">Finish a step to earn your first badge.</p>';
  return stage + hub + how + bento + sect('Intel','c-purple') + panels
    + sect('Field tip','c-blue') + tip3
    + sect(gameOn()?'Your levels':'Your chapters','c-orange') + road
    + sect('Streak and mastery','c-cyan') + `<div class="grid-auto"><div class="glass cx-card c-orange"><div class="row" style="justify-content:space-between;margin-bottom:12px"><h3 style="margin:0">This month</h3><span class="stat fire">${ic('flame',22)}${liveStreak()}</span></div>${monthCal()}</div><div class="glass cx-card c-cyan"><h3>Topic mastery</h3>${mastery}</div></div>`
    + sect('Squad and badges','c-green') + `<div class="grid-auto"><div class="glass cx-card c-green"><div class="row" style="justify-content:space-between"><h3 style="margin:0">Squad leaders</h3><button class="btn sm" data-act="tab" data-t="board">See all</button></div>${top3}</div><div class="glass cx-card c-purple"><div class="row" style="justify-content:space-between;margin-bottom:10px"><h3 style="margin:0">Latest badges</h3><button class="btn sm" data-act="tab" data-t="agent">All badges</button></div><div class="row">${recent}</div></div></div>`;
}

/* ---------- learn: mission map and course ---------- */
function certCard(path){
  const c = S.certs.find(x=>x.path===path) || {date:today()};
  return `<div class="cert" style="margin:16px 0">${ic('trophy',44)}<p class="label" style="color:var(--gold)">Certificate of completion</p><h2>${esc(PATHS[path].name)} Track</h2>
    <p>Awarded to <b>${esc(S.user)}</b> for completing every mission in the ${esc(PATHS[path].name)} track of Agent Investigator.</p><p class="muted">Issued ${esc(c.date)}</p>
    ${path !== 'fieldagent' ? `<button class="btn red" data-act="advance">Advance to ${esc(PATHS[ORDER[ORDER.indexOf(path)+1]].name)}</button>` : '<span class="chip gold">Highest clearance reached</span>'}</div>`;
}
function viewCourses(){
  const p = P_(), ni = nextIdx(), dc = doneCount(), pct = Math.round(dc/80*100);
  let h = `<div class="row" style="justify-content:space-between;margin-bottom:10px"><div><p class="label">${esc(p.name)} track · ${esc(p.who)}</p><h1 style="margin:0">Obstacle courses</h1></div><span class="chip red">Game version</span></div>
    <p class="muted" style="margin:0 0 12px">Run each course. Hack every terminal on the way to unlock the exit portal.</p><div class="bar" style="height:14px"><i style="width:${pct}%"></i></div><p class="muted" style="margin:8px 0 16px">${dc} of 80 steps complete</p>`;
  if(ni === -1) h += certCard(S.path);
  h += '<div class="grid-auto">';
  p.chapters.forEach((id, ch) => {
    const M = MISSIONS[id], cnt = chCount(ch), lk = ni !== -1 && Math.floor(ni/10) < ch, first = ni !== -1 ? (ni >= ch*10 && ni < ch*10+10 ? ni : ch*10+Math.min(9,cnt)) : ch*10;
    const best = S.courses[S.path+':'+ch];
    h += `<div class="crs ${LV_COL[ch%8]} ${lk?'locked':''}"><div class="crs-top"><span class="ico-chip">${ic(lk?'lock':(cnt===10?'check':'flame'),30)}</span><div><span class="label">Level ${ch+1}</span><h2>${esc(M[0])}</h2></div></div>
      <p class="muted" style="margin:0">Villain: <b style="color:var(--fg)">${esc(M[1])}</b></p><div class="sdots">${Array.from({length:10},(_,l)=>`<span class="sd ${isDone(ch*10+l)?'on':''}" style="--c:${typeHex(GT[l])}" title="${GNAME[GT[l]]}"></span>`).join('')}</div><p class="muted learnp"><b>You will learn:</b> ${TOPICS[id].steps.slice(0,3).map(s=>esc(s[0])).join(' · ')}</p><div class="bar" style="height:12px"><i style="width:${cnt*10}%"></i></div>
      <p class="muted" style="margin:0;font-size:14px">${cnt}/10 terminals hacked${best?' · best '+best.t+'s':''}</p>
      <div class="row"><button class="btn red" ${lk?'disabled':`data-act="course" data-ch="${ch}"`}>${ic('flame',18)} ${best?'Replay':'Run course'}</button><button class="btn sm" ${lk?'disabled':`data-act="open" data-i="${first}"`}>Steps only</button><button class="btn sm ghost" data-act="manual" data-id="${id}">Manual</button></div></div>`;
  });
  return h + '</div>';
}
function viewLearn(){
  if(gameOn()) return viewCourses();
  const p = P_(), ni = nextIdx(), dc = doneCount(), pct = Math.round(dc/80*100);
  let h = `<div class="row" style="justify-content:space-between;margin-bottom:10px"><div><p class="label">${esc(p.name)} track · ${esc(p.who)}</p><h1 style="margin:0">${gameOn()?'Mission map':'Your course'}</h1></div><span class="chip ${gameOn()?'red':''}">${gameOn()?'Game version':'Regular version'}</span></div>
    <div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div>
    <p class="muted" style="margin:8px 0 16px">${dc} of 80 steps complete</p>`;
  if(ni === -1) h += certCard(S.path);
  const offs = [0,38,62,38,0,-38,-62,-38,0,38];
  p.chapters.forEach((id, ch) => {
    const T = TOPICS[id], M = MISSIONS[id], cnt = chCount(ch), first = ch*10, cleared = cnt === 10;
    const status = cleared ? 'cleared' : (ni !== -1 && Math.floor(ni/10) === ch ? 'active' : (ni === -1 || ni > first+9 ? 'cleared' : 'locked'));
    if(gameOn()){
      h += `<div class="banner ${status==='locked'?'locked':(cleared?'cleared':'')}"><div class="grow"><p class="label">Level ${ch+1} · ${cnt}/10</p><h3>${esc(M[0])}</h3><p style="margin:4px 0 0;font-size:14px">Villain: ${esc(M[1])}</p></div>
        <div style="display:grid;gap:8px;justify-items:end"><span class="big">${ic(status==='locked'?'lock':'skull',40)}</span><button class="btn sm ghost" data-act="manual" data-id="${id}" style="color:inherit;border-color:currentColor">Manual</button></div></div><div class="path">`;
      for(let l=0;l<10;l++){
        const i = ch*10+l, d = isDone(i), nx = i === ni, lk = !unlocked(i);
        h += `<div class="node-wrap" style="transform:translateX(${offs[l]}px)">${nx?'<span class="bubble">START</span>':''}
          <button class="node ${d?'done':''} ${lk?'locked':''} ${nx?'next':''}" ${lk?'disabled':`data-act="open" data-i="${i}"`} aria-label="${lname(l)}: ${esc(T.steps[l][0])}${d?', complete':''}${lk?', locked':''}">${ic(d?'check':(lk?'lock':licon(l)),34)}</button>
          ${nx?`<span class="nodelabel">${lname(l)}</span>`:''}</div>`;
        if(l === 4){
          const ck = S.path+':'+ch, claimed = !!S.chests[ck], ready = !claimed && [0,1,2,3,4].every(x=>isDone(ch*10+x));
          h += `<div class="node-wrap"><button class="node chest ${ready?'ready':(claimed?'':'closed')}" ${ready?`data-act="chest" data-ch="${ch}"`:'disabled'} aria-label="Supply crate${claimed?', opened':(ready?', ready to open':', locked')}">${ic(claimed?'check':(ready?'gift':'lock'),34)}</button></div>`;
        }
        if(nx) h += '<div style="height:20px"></div>';
      }
      h += '</div>';
    } else {
      h += `<div class="card" style="margin-bottom:14px"><div class="row" style="justify-content:space-between"><h3 style="margin:0">Chapter ${ch+1}: ${esc(T.name)}</h3><span class="chip ${cleared?'ok':''}">${cnt}/10</span></div><p class="muted" style="margin:6px 0 12px">${esc(T.blurb)}</p><div class="list-ch" style="margin:0">`;
      for(let l=0;l<10;l++){
        const i = ch*10+l, d = isDone(i), nx = i === ni;
        h += `<button class="lrow" data-act="open" data-i="${i}"><span class="ico ${d?'done':(nx?'next':'')}">${ic(d?'check':licon(l),22)}</span><span class="grow"><b>${esc(T.steps[l][0])}</b><br><span class="muted" style="font-size:13px">${lname(l)}</span></span>${nx?'<span class="chip red">Next</span>':''}</button>`;
      }
      h += '</div></div>';
    }
  });
  return h;
}

/* ---------- manual ---------- */
function viewManual(){
  const ids = P_().chapters;
  if(S.manual && TOPICS[S.manual]){
    const T = TOPICS[S.manual];
    const notes = T.steps.map((s,k)=>`<div class="note-item"><b>${k+1}. ${esc(s[0])}</b><span class="muted">${esc(s[1])}</span></div>`).join('');
    const gloss = T.terms.map(t=>`<div><b>${esc(t[0])}</b><span class="muted">${esc(t[1])}</span></div>`).join('');
    const clinic = T.labs.map(l=>`<div class="card" style="margin-bottom:12px"><p class="label">Prompt clinic</p><p style="margin:6px 0 10px"><b>${esc(l[0])}</b></p><p class="muted" style="margin:0 0 4px">Weak: ${esc(l[1].filter((o,k)=>k!==l[2]).sort((a,b)=>a.length-b.length)[0])}</p><p style="margin:0 0 6px;color:var(--ok)">Strong: ${esc(l[1][l[2]])}</p><p class="muted" style="margin:0;font-size:14px">${esc(l[3])}</p></div>`).join('');
    return `<button class="btn sm" data-act="manual" data-id="">← All topics</button><div style="height:14px"></div><p class="label">Field manual</p><h1>${esc(T.name)}</h1><p class="muted">${esc(T.blurb)}</p>
      <h2 style="margin-top:20px">Field notes</h2><div class="note-list">${notes}</div><h2 style="margin-top:22px">Glossary</h2><div class="gloss">${gloss}</div><h2 style="margin-top:22px">Prompt clinic</h2>${clinic}`;
  }
  const cards = ids.map((id,ch)=>{ const T = TOPICS[id]; return `<button class="pick" data-act="manual" data-id="${id}">${ic('book',32)}<span><strong>${esc(T.name)}</strong><small>${esc(T.blurb)}</small></span></button>`; }).join('');
  return `<p class="label">Reference</p><h1>Field manual</h1><p class="muted">Notes, glossary and prompt examples for every chapter in your track. Read them any time.</p><div class="stack">${cards}</div>`;
}
