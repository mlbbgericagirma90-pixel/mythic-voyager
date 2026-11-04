// ======================================================================
// ÇEKİRDEK / oyun döngüsü
// draw(): haritayı, canavarları ve karakteri çizer; yürüme, canavara yaklaşınca savaş başlatma, canavar doğma kontrolü burada.
// Canavar listesi: Canavarlar/Harita01 C ve Harita02 C (MONS, m.harita ile haritaya göre süzülür). Konumlar ve karakter boyu: Mapler/Harita01/harita_ayar.js.
// Ölçek: karakterin ekrandaki boyu sabit, harita ona göre ölçeklenir (scale = ekran boyu / karakterBoy).
// ======================================================================
let gecisAktif=false;
// Canavar otomatik saldırı mesafesi: eski yarıçap x bu çarpan.
const MENZIL_CARPANI=2.5;
// Engele sürtünürken hep aynı yana kay (sağ/sol titremesi olmasın): -1/0/1
let slideSide=0;
function drawMonster(m,sx,sy,scale,t){
 if(!m.avail||!m.img.complete||!m.img.naturalWidth)return;
 const h=monH(m),x=sx+(m.cx-m.w/2)*scale,y=sy+(m.ayak-h)*scale;
 if(x>W||y>H||x+m.w*scale<0||y+h*scale<0)return;
 const b=(Math.sin(t/1000*2.4+m.ph)*.5+.5)*6;
 ctx.drawImage(m.img,x,y-b*scale,m.w*scale,h*scale);
}
function drawRespawnTimer(m,sx,sy,scale){
 if(m.avail||m.respawnAt<=0)return;
 const secs=Math.max(0,Math.ceil((m.respawnAt-Date.now())/1000));if(secs<=0)return;
 const tx=sx+m.cx*scale,ty=sy+(m.ayak-monH(m)*.5)*scale;
 ctx.save();ctx.font='bold 13px system-ui,Arial';ctx.textAlign='center';ctx.lineWidth=4;ctx.strokeStyle='#111';
 ctx.strokeText(secs+' sn sonra yeniden doğar',tx,ty);ctx.fillStyle='#ffe7a0';ctx.fillText(secs+' sn sonra yeniden doğar',tx,ty);ctx.restore();
}
function draw(t){let dt=Math.min((t-last)/1000||0,.04);last=t;
 if(activeMap){
  const boy=activeMap.karakterBoy||285;
  const chScreen=Math.min(H*.30,Math.max(W,H)*zoom*.0525);
  const scale=chScreen/boy;
  let sx=W*.38-px*scale, sy=H*.57-py*scale;
  ctx.fillStyle='#17231d';ctx.fillRect(0,0,W,H);
  // Görünen alanın yarıçapı kadar parça yüklenir (parçalar ekrana girmeden hazır olsun).
  const ld=Math.hypot(W*.62,H*.57)/scale+100;
  updateMapParts(px,py,ld,ld+400);drawMapParts(sx,sy,scale);
  // Karakterin arkasında kalan (ayağı karakterden yukarıda) canavarlar önce, öndekiler sonra çizilir.
  for(const m of MONS)if(m.harita===activeMap.id&&m.ayak<=py)drawMonster(m,sx,sy,scale,t);
  const speed=boy*1.5;
  if(!battle&&!dead&&(moveX||moveY)){
    const len=Math.hypot(moveX,moveY)||1,vx=moveX/len,vy=moveY/len;
    const distance=speed*dt,steps=Math.max(1,Math.ceil(distance/1.5));
    if(!moveX&&!moveY)slideSide=0;
    const offsets=[0,15,-15,30,-30,45,-45,60,-60,75,-75,90,-90,105,-105,120,-120,135,-135];
    for(let i=0;i<steps;i++){
      const step=distance/steps, nx=px+vx*step, ny=py+vy*step;
      if(onRoad(nx,ny)){px=nx;py=ny;continue;}
      let best=null,bestScore=-Infinity;
      for(const deg of offsets){
        const a=Math.atan2(vy,vx)+deg*Math.PI/180,tx=Math.cos(a),ty=Math.sin(a);
        if(!onRoad(px+tx*step,py+ty*step))continue;
        const score=tx*vx+ty*vy+(deg!==0&&Math.sign(deg)===slideSide?0.05:0);
        if(score>bestScore){bestScore=score;best={x:px+tx*step,y:py+ty*step,deg};}
      }
      if(!best)break;
      if(best.deg)slideSide=Math.sign(best.deg);
      px=best.x;py=best.y;
    }
    angle=Math.atan2(vy,vx);walk+=dt*13;
  }
  // Canavara yaklaşınca savaş: en yakın canavar seçilir. Bir kez tetiklenir, hepsinden uzaklaşınca tekrar kurulur.
  const near=MONS.filter(m=>m.harita===activeMap.id&&m.avail&&Math.hypot(px-m.cx,py-m.ayak)<m.radius*MENZIL_CARPANI).sort((a,b)=>Math.hypot(px-a.cx,py-a.ayak)-Math.hypot(px-b.cx,py-b.ayak));
  if(!near.length)proximityArmed=true;
  if(!battle&&!dead&&proximityArmed&&near.length){proximityArmed=false;startBattle(near[0].id);}
  for(const m of MONS)if(!m.avail&&Date.now()>=m.respawnAt)m.avail=true;
  // M1: harita geçiş alanı
  const inG=activeMap.id==='harita01'&&haritaGecisIcinde(px,py)&&!battle&&!dead;
  if(inG!==gecisAktif){gecisAktif=inG;if(typeof setMapGecis==='function')setMapGecis(inG);}
  // Karakter
  if(hero.complete&&hero.naturalWidth&&hero.naturalHeight){
   const ch=chScreen*.5, cw=ch*(hero.naturalWidth/hero.naturalHeight||.62);
   ctx.save();ctx.translate(W*.38,H*.57);drawHeroAnim(ctx,cw,ch,!!(moveX||moveY)&&!battle,t/1000,walk);ctx.restore();
  }
  for(const m of MONS)if(m.harita===activeMap.id){if(m.ayak>py)drawMonster(m,sx,sy,scale,t);drawRespawnTimer(m,sx,sy,scale);}
  const vg=ctx.createRadialGradient(W/2,H*.48,Math.min(W,H)*.25,W/2,H*.48,Math.max(W,H)*.72);vg.addColorStop(0,'#00000000');vg.addColorStop(1,'#07100b36');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
 } else {ctx.fillStyle='#17231d';ctx.fillRect(0,0,W,H);ctx.fillStyle='white';ctx.fillText('Harita yükleniyor…',20,30)}
 requestAnimationFrame(draw)}
