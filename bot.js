const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1280,height:720}});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto('file://'+__dirname+'/site.html');
await pg.evaluate(()=>{S.user='Bot';S.step='app';S.setup=true;S.mode='game';S.tab='learn';save();render();});
const res=await pg.evaluate(()=>{
 const out=[];
 function run(path,ch,assist){
  S.path=path;S.done={};S.courses={};S.obbyCoins={};S.assist=assist;
  for(let i=0;i<ch*10;i++) S.done[path+':'+i]=true;
  startCourse(ch); OB.paused=true; const W=OB.w,p=OB.p; let K=OB.keys; let hold=0, steps=0, stuck=0, lastx=-1e9;
  while(steps<120*400 && !OB.done){
   steps++;
   K=OB.keys; const solids=obSolids(), feet=p.y+p.h; K.right=true; K.left=false; let jump=false;
   if(p.dead<=0){
    if(p.onGround){
     const hx=p.x+p.w+8;
     const ground=solids.some(s=>!s.bar&&hx>=s.x&&hx<=s.x+s.w&&s.y>=feet-70);
     const wall=solids.some(s=>p.x+p.w+10>=s.x&&p.x+p.w<=s.x+s.w&&s.y<feet-8&&s.y>feet-110&&!(s.t==='c'&&s.st===2));
     if(wall) jump=true;
     if(!ground){
      const fwd=W.plats.find(m=>m.t!=='m'&&m.x>p.x+p.w&&m.x-(p.x+p.w)<230&&Math.abs(m.y-feet)<=85);
      const mv=W.plats.find(m=>m.t==='m'&&m!==p.ride&&m.x+m.w>p.x&&m.x<p.x+420&&Math.abs(m.y-feet)<10);
      if(p.ride&&p.ride.t==='m'){ if(fwd&&fwd.x-(p.x+p.w)<190) jump=true; else K.right=false; }
      else if(fwd && fwd.x-(p.x+p.w)<130) jump=true; else if(mv && (!p.ride || p.ride.t==='s')){ if(mv.x<hx+90&&mv.x+mv.w>hx-10&&mv.x>p.x) jump=true; else K.right=false; }
      else jump=true;
     }
     W.spikes.forEach(sp=>{const d=sp.x-(p.x+p.w); if(d>=0&&d<95&&Math.abs(sp.y-feet)<4) jump=true;});
    }
    W.lasers.forEach(l=>{const d=l.x-(p.x+p.w); if(d>-30&&d<130&&p.y+p.h>l.y1){const ph=(OB.t+l.off)%l.period; const safe=ph>=l.period*.5&&ph+.7<=l.period; if(!safe&&d>20) K.right=false;}});
   }
   if(!p.onGround && p.vy>0 && p.dead<=0){ const T=W.plats.find(m=>!(m.t==='c'&&m.st===2)&&m.y>=feet-4&&m.y-feet<200&&p.x+p.w/2>m.x&&p.x+p.w/2<m.x+m.w); if(T && T.w<=250 && !W.spikes.some(sp=>sp.x>T.x&&sp.x<T.x+T.w) && p.x+p.w/2>T.x+T.w*.62) K.right=false; }
   if(jump){K.jumpPressed=true;hold=steps+70;} K.jump=steps<hold;
   obStepPhys(1/120);
   if(OB.near && !OB.near.open){ S.done[path+':'+(ch*10+OB.near.s)]=true; obResume(); }
   if(steps%1200===0){ if(Math.abs(p.x-lastx)<5 && p.dead<=0) stuck++; else stuck=0; lastx=p.x; if(stuck>5) break; }
  }
  const r={path,ch,assist,done:OB.done,t:Math.round(OB.stats.t),deaths:OB.stats.deaths,x:Math.round(p.x),end:Math.round(W.end)};
  stopCourse(); return r;
 }
 for(const path of ['recruit','operative','fieldagent']) for(let ch=0;ch<8;ch++){ out.push(run(path,ch,true)); out.push(run(path,ch,false)); }
 return out;});
const bad=res.filter(r=>!r.done);
console.log('total',res.length,'failed',bad.length);console.log(JSON.stringify(bad));
console.log(JSON.stringify(res.filter(r=>!r.assist).slice(0,24).map(r=>[r.ch,r.t,r.deaths])));
console.log(errs);await b.close();})();
