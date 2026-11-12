const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1280,height:720}});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto('file://'+__dirname+'/site.html');
await pg.evaluate(()=>{S.user='Eshun';S.step='app';S.setup=true;S.mode='game';S.equip.acc='acc-shades';save();render();});
for(const [ch,x] of [[0,1500],[1,3000],[2,4000],[3,6000],[4,5000],[5,9000],[6,3000],[7,5000]]){
 await pg.evaluate(([ch,x])=>{S.path='recruit';S.assist=true;S.done={};for(let i=0;i<ch*10;i++)S.done['recruit:'+i]=true;startCourse(ch);OB.paused=true;const W=OB.w,p=OB.p;
  const pl=W.plats.filter(m=>m.t==='s'&&m.x>x).sort((a,b)=>a.x-b.x)[0];p.x=pl.x+40;p.y=pl.y-52;OB.cam=p.x-300;OB.keys.right=true;
  for(let i=0;i<30;i++)obStepPhys(1/120);OB.paused=false;},[ch,x]);
 await pg.waitForTimeout(250);await pg.screenshot({path:'g'+ch+'.png'});
 await pg.evaluate(()=>stopCourse());}
console.log(errs);await b.close();})();
