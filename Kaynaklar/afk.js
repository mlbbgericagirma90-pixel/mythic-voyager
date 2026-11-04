// ======================================================================
// AFK GELİRİ
// Her 10 dk'da bulunulan son haritadan 1 canavar kesilir (oyun kapalıyken de; zaman damgasıyla hesaplanır). Maks 8 saat.
// Şanslar: normal %70, yüksek %20, elit %8, boss %2. Harita canavarları sırayla 3 gruba bölünür (normal/yüksek/elit), sonuncu boss.
// Düşen her item ayrı satır (afkItems=[{id,enchant}], efsun düşerken belirlenir); Topla ile envantere eklenir. Panel: afkAc().
// ======================================================================
const AFK_ARALIK=600000, AFK_MAKS=8*3600000, AFK_SANS=[['n',70],['y',20],['e',8],['b',2]];
let afkBaslangic=Date.now(), afkIslenen=0, afkKills={n:0,y:0,e:0,b:0}, afkItems=[], afkGold=0;
function afkVeri(){return {bas:afkBaslangic,isl:afkIslenen,k:afkKills,it:afkItems,g:afkGold};}
function afkYukle(a){
 if(!a||typeof a!=='object')return;
 if(Number.isFinite(a.bas))afkBaslangic=Math.min(a.bas,Date.now());
 if(Number.isFinite(a.isl))afkIslenen=Math.max(0,Math.min(48,a.isl));
 if(a.k)for(const t of ['n','y','e','b'])afkKills[t]=Math.max(0,Number(a.k[t])||0);
 afkItems=[];
 if(Array.isArray(a.it))afkItems=a.it.filter(x=>x&&itemDefs.some(d=>d.id===x.id)).slice(0,200);
 else if(a.it&&typeof a.it==='object')for(const id in a.it)if(itemDefs.some(d=>d.id===id))for(let i=0;i<Math.min(200,a.it[id]|0);i++)afkItems.push({id,enchant:rollEnchant()});
 if(Number.isFinite(a.g))afkGold=Math.max(0,a.g);
}
function afkSure(){return Math.max(0,Math.min(AFK_MAKS,Date.now()-afkBaslangic));}
function afkMon(mapId,tip){
 const l=MONS.filter(m=>m.harita===mapId);if(!l.length)return null;
 if(tip==='b')return l[l.length-1];
 const d=l.slice(0,-1);if(!d.length)return l[l.length-1];
 const g=Math.ceil(d.length/3),a=tip==='n'?0:tip==='y'?g:g*2,b=tip==='n'?g:tip==='y'?g*2:d.length;
 const s=d.slice(a,b);return s.length?s[Math.floor(Math.random()*s.length)]:d[d.length-1];
}
function afkOldur(){
 let r=Math.random()*100,tip='n',s=0;for(const [t,p] of AFK_SANS){s+=p;if(r<s){tip=t;break;}}
 const m=afkMon(activeMap?activeMap.id:'harita01',tip);if(!m)return;
 afkKills[tip]++;
 const cd=CANAVAR_DEGER[m.id];if(cd&&cd.altin)afkGold+=Math.round((cd.altin[0]+Math.floor(Math.random()*cd.altin[1]))*(1+enchantBonus('goldGain')/100));
 const boost=1+enchantBonus('dropChance')/100;let roll=Math.random()*100,sum=0;
 for(const d of itemDefs){sum+=d.drop*boost;if(roll<sum){afkItems.push({id:d.id,enchant:rollEnchant()});break;}}
}
function afkTik(){
 const now=Date.now();if(now<afkBaslangic){afkBaslangic=now;afkIslenen=0;}
 const due=Math.floor(afkSure()/AFK_ARALIK);let n=0;
 while(afkIslenen<due){afkOldur();afkIslenen++;n++;}
 if(n)saveGame(false);
 if(window.afkCiz)afkCiz();
}
function afkTopla(){
 let kalan=0;const bekleyen=[];
 for(const x of afkItems){
  const def=itemDefs.find(d=>d.id===x.id);if(!def)continue;
  if(bagCount('equip')<unlockedSlots)inventory.push({...def,serial:++swordSerial,enchant:x.enchant});else{bekleyen.push(x);kalan++;}
 }
 afkItems=bekleyen;
 gold+=afkGold;afkGold=0;updateGold();
 afkKills={n:0,y:0,e:0,b:0};
 const sure=afkSure();afkBaslangic=Date.now()-sure%AFK_ARALIK;afkIslenen=0;
 if(sure>=AFK_MAKS)afkBaslangic=Date.now();
 renderInventory();saveGame(false);
 showBottomNotice(kalan?'Envanter dolu; '+kalan+' item kaldı':'Toplandı');
 afkCiz();
}
(function(){
 const R='Ikonlar/Resimler/';
 const css=document.createElement('style');
 css.textContent=`
#afkPanel{z-index:46;background:#000d;padding:0;flex-direction:column;gap:8px;--aw:360px}
#afkPanel .afkKutu{position:relative;width:var(--aw);height:calc(var(--aw)*1.5);flex:0 0 auto}
#afkPanel .afkKutu>img{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
#afkPanel .av{position:absolute;left:58.6%;font:800 calc(var(--aw)*.036)/1 system-ui,Arial;color:#fff6d4;text-shadow:0 2px 3px #000;transform:translateY(-54%);white-space:nowrap}
#afkPanel #afkListe{position:absolute;left:10.5%;right:9.5%;top:77.6%;bottom:3.8%;overflow-y:auto;-webkit-overflow-scrolling:touch;touch-action:pan-y}
#afkPanel .ar{display:flex;align-items:center;gap:calc(var(--aw)*.025);padding:calc(var(--aw)*.008) 0;border-bottom:1px solid #ffffff1a;font:700 calc(var(--aw)*.036)/1.1 system-ui,Arial;color:#f5efdc}
#afkPanel .ar .ik{width:calc(var(--aw)*.075);height:calc(var(--aw)*.075);flex:0 0 auto;display:flex;align-items:center;justify-content:center;font-size:calc(var(--aw)*.05)}
#afkPanel .ar .ik img{width:100%;height:100%;object-fit:contain}
#afkPanel .ar .tx{display:flex;flex-direction:column;min-width:0}
#afkPanel .ar small{font-size:.78em;font-weight:700;color:#5ee6d0}
#afkTopla{width:calc(var(--aw)*.6);height:calc(var(--aw)*.13);border:2px solid #c9a24a;border-radius:calc(var(--aw)*.04);background:linear-gradient(180deg,#2a6b3a,#16401f);color:#fff6d4;font:900 calc(var(--aw)*.055)/1 system-ui,Arial;text-shadow:0 2px 3px #000}
#afkTopla:disabled{opacity:.45}
#afkKapat{position:absolute;right:calc(var(--aw)*.03);top:calc(env(safe-area-inset-top) + 8px);width:calc(var(--aw)*.12);height:calc(var(--aw)*.12);padding:0;border:0;background:none;z-index:2}
#afkKapat img{display:block;width:100%;height:100%}`;
 document.head.appendChild(css);
 const p=document.createElement('div');p.id='afkPanel';p.className='modalPanel';
 const rows=[['afkSureV',573.5],['afkN',991],['afkY',1038],['afkE',1085],['afkB',1132]];
 p.innerHTML='<button type="button" id="afkKapat" aria-label="Kapat"><img src="'+R+'kapat.webp" alt=""></button><div class="afkKutu"><img src="'+R+'afk_panel.webp" alt="">'+rows.map(r=>'<div class="av" id="'+r[0]+'" style="top:'+(r[1]/15.36)+'%"></div>').join('')+'<div id="afkListe"></div></div><button type="button" id="afkTopla">TOPLA</button>';
 document.body.appendChild(p);
 const $=id=>document.getElementById(id);
 const hms=ms=>{const s=Math.floor(ms/1000);return String(Math.floor(s/3600)).padStart(2,'0')+':'+String(Math.floor(s/60)%60).padStart(2,'0')+':'+String(s%60).padStart(2,'0');};
 function boyut(){const h=window.innerHeight-90-(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sat'))||0);p.style.setProperty('--aw',Math.max(240,Math.min(window.innerWidth,h/1.5))+'px');}
 let sonListe='';
 window.afkCiz=function(){
  if(!p.classList.contains('show'))return;
  $('afkSureV').textContent=hms(afkSure())+(afkSure()>=AFK_MAKS?' (MAKS)':'');
  $('afkN').textContent=afkKills.n;$('afkY').textContent=afkKills.y;$('afkE').textContent=afkKills.e;$('afkB').textContent=afkKills.b;
  let h='';
  if(afkGold>0)h+='<div class="ar"><span class="ik"><img src="'+R+'altin.webp" alt=""></span>Altın<b>x'+formatBirim(afkGold)+'</b></div>';
  for(const x of afkItems){const d=itemDefs.find(y=>y.id===x.id);if(d)h+='<div class="ar"><span class="ik">'+itemIcon(d)+'</span>'+'<span class="tx">'+d.name+(x.enchant?'<small>'+x.enchant.name+' +%'+x.enchant.value+'</small>':'')+'</span></div>';}
  if(h!==sonListe){sonListe=h;$('afkListe').innerHTML=h;}
  $('afkTopla').disabled=!(afkGold>0||afkItems.length);
 };
 window.afkAc=function(){if(typeof battle!=='undefined'&&battle)return;afkTik();boyut();sonListe='';p.classList.add('show');afkCiz();};
 $('afkKapat').addEventListener('click',()=>p.classList.remove('show'));
 $('afkTopla').addEventListener('click',afkTopla);
 addEventListener('resize',boyut);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)afkTik();});
 setInterval(afkTik,1000);
 setTimeout(afkTik,500);
})();
