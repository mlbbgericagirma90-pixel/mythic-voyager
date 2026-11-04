// GIRIS / açılış ekranı (13 sn)
// Açılışta: yükleme barı animasyonlu WebP (bar dolunca son karede durur), müzik, arkada kayıttaki harita parçaları ve arayüz görselleri sırayla decode edilir.
// Bitince açılış öğeleri DOM'dan silinir ve bellekten bırakılır.
(function(){
 const SURE=13000;
 const intro=document.getElementById('intro');
 if(!intro)return;
 const audio=document.getElementById('introAudio');
 const video=document.getElementById('introBar');
 let opened=false,timer=0,tickTimer=0;
 const tryAudio=()=>{if(!audio||opened)return;const p=audio.play();if(p&&p.catch)p.catch(()=>{});};
 intro.addEventListener('pointerdown',tryAudio,{passive:true});
 tryAudio();
 // 1 sn siyah yükleniyor ekranı: arka plan+logo hazır olunca (en az 1 sn) kalkar, bar animasyonu o an başlar.
 const yukle=document.getElementById('introYukle');
 const hazir=(u)=>new Promise(r=>{const i=new Image();i.onload=i.onerror=()=>{(i.decode?i.decode():Promise.resolve()).catch(()=>{}).then(r);};i.src=u;});
 const minBekle=new Promise(r=>setTimeout(r,1000));
 Promise.all([minBekle,hazir('Giris/Resimler/acilis_arka_plan.webp'),hazir('Giris/Resimler/logo.webp')]).then(()=>{
  if(opened)return;
  if(video){
   video.addEventListener('load',()=>{setTimeout(()=>{if(!opened)video.src='Giris/Resimler/yukleme_bar_son.webp';},10300);},{once:true});
   video.src='Giris/Resimler/yukleme_bar.webp';
  }
  const lg=document.getElementById('introLogo');if(lg)lg.classList.add('zipla');
  if(yukle){yukle.classList.add('hide');setTimeout(()=>yukle.remove(),450);}
 });
 // Arka plan ısınması: her adımda 1 harita parçası + 1 arayüz görseli decode edilir (yavaş yavaş).
 const hudUrls=[];
 const topla=()=>{
  const gor=new Set();
  document.querySelectorAll('style').forEach(s=>{(s.textContent.match(/url\(([^)]+)\)/g)||[]).forEach(u=>{const d=u.slice(4,-1).replace(/['"]/g,'');if(d.indexOf('Ikonlar/Resimler')>-1||d.indexOf('Resimler/')>-1)gor.add(d);});});
  document.querySelectorAll('#hudKok img').forEach(i=>{if(i.currentSrc||i.src)gor.add(i.currentSrc||i.src);});
  gor.forEach(u=>{if(u.indexOf('acilis')<0&&u.indexOf('yukleme_bar')<0)hudUrls.push(u);});
 };
 const dec=(img)=>{if(img&&img.decode){img.decode().catch(()=>{});}};
 const tick=()=>{
  if(opened)return;
  try{
   if(typeof activeMap!=='undefined'&&activeMap){
    const p=activeMap.parts.find(x=>x.requested&&!x.dec&&x.img.complete&&x.img.naturalWidth);
    if(p){p.dec=true;dec(p.img);}
   }
   const u=hudUrls.shift();
   if(u){const im=new Image();im.src=u;dec(im);}
  }catch(e){}
  tickTimer=setTimeout(tick,450);
 };
 setTimeout(()=>{topla();tick();},900);
 const closeIntro=()=>{
  if(opened)return;opened=true;
  clearTimeout(tickTimer);
  intro.classList.add('hide');
  setTimeout(()=>{
   if(audio){audio.pause();audio.removeAttribute('src');audio.load();}
   if(video){video.removeAttribute('src');}
   const logo=document.getElementById('introLogo');if(logo)logo.removeAttribute('src');
   intro.remove();
  },750);
 };
 const bekle=Math.max(0,SURE-performance.now());
 timer=setTimeout(closeIntro,bekle);
 // Sekme arka plandayken süre dolduysa görünür olunca kapat.
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&!opened&&performance.now()>=SURE)closeIntro();});
})();
