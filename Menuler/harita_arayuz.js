// ======================================================================
// MENÜLER / harita arayüzü
// - Seviye/EXP ve harita ikonu artık Ikonlar/ikonlar.js içinde. Burada sadece kuş bakışı harita penceresi var (openMiniMap).
// - Alt orta: "Map Geçişi" butonu, karakter M1 alanına (Mapler/Harita01/harita_ayar.js gecis) girince çıkar.
//   Kendi görselini kullanmak için Ikonlar/Resimler/map_gecisi.png dosyasını koy; varsa buton onu gösterir.
// Elemanlar ve stiller burada kodla oluşturulur (index.html ve stil.css'e dokunmaz).
// ======================================================================
(function(){
const HW=3382;
const css=document.createElement('style');
css.textContent=`
#mapOverlay{position:fixed;inset:0;z-index:60;display:none;align-items:center;justify-content:center;flex-direction:column;background:#000d}
#mapOverlay.show{display:flex}
#mapOverlay canvas{border:2px solid #d6b45b;border-radius:10px;background:#101713}
#mapOverlay .cap{margin-top:8px;color:#f4f0df;font-size:12px;opacity:.85}
#mapClose{position:absolute;right:14px;top:calc(env(safe-area-inset-top) + 10px);width:42px;height:42px;border-radius:13px;border:1px solid #ffffff55;background:#17231d;color:#fff;font-size:20px}
#mapGecisBtn{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom) + 120px);transform:translateX(-50%);z-index:35;display:none;padding:12px 22px;border:2px solid #f2d479;border-radius:14px;background:#24402fee;color:#fff3c4;font-weight:900;font-size:16px;box-shadow:0 6px 18px #000a}
#mapGecisBtn.show{display:block}#mapGecisBtn img{display:block;max-width:180px;height:auto}
#toastMsg{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom) + 190px);transform:translateX(-50%);z-index:70;padding:9px 16px;border-radius:12px;background:#101713ee;color:#fff3c4;font-size:13px;display:none}
`;
document.head.appendChild(css);
const mk=(tag,id,html,parent=document.body)=>{const e=document.createElement(tag);if(id)e.id=id;if(html!=null)e.innerHTML=html;parent.appendChild(e);return e;};

// ---- Harita ikonu ve pencere
const ov=mk('div','mapOverlay','');
const cv=mk('canvas',null,'',ov);
mk('div',null,'Beyaz nokta: sen • Kırmızı: canavar • Gri: yeniden doğuyor',ov).className='cap';
const closeB=mk('button','mapClose','✕',ov);closeB.type='button';
const mimgs={harita01:new Image(),harita02:new Image()};mimgs.harita01.src='Mapler/Harita01/harita_kucuk.webp';mimgs.harita02.src='Mapler/Harita02/harita_kucuk.webp';
const HWS={harita01:3382,harita02:5204};
let mapTimer=null;
function drawMini(){
  const s=Math.floor(Math.min(innerWidth-24,innerHeight-120));
  if(cv.width!==s){cv.width=s;cv.height=s;}
  const hid=activeMap&&activeMap.id==='harita02'?'harita02':'harita01',mimg=mimgs[hid],c=cv.getContext('2d'),k=s/HWS[hid];
  c.clearRect(0,0,s,s);
  if(mimg.complete&&mimg.naturalWidth)c.drawImage(mimg,0,0,s,s);else{c.fillStyle='#17231d';c.fillRect(0,0,s,s);}
  // M1 geçiş alanı
  if(hid==='harita01'){const g=HARITA01_AYAR.gecis;c.save();c.translate(g.x*k,g.y*k);c.rotate(g.aci*Math.PI/180);c.strokeStyle='#d8f24a';c.lineWidth=2;c.beginPath();c.ellipse(0,0,g.w/2*k,g.h/2*k,0,0,Math.PI*2);c.stroke();c.restore();}
  c.font='bold 11px system-ui';c.textAlign='center';c.textBaseline='middle';
  for(const m of MONS){
    if(m.harita!==hid)continue;
    const lbl=m.id.replace('h2','').toUpperCase();
    const x=m.cx*k,y=(m.ayak-monH(m)*.4)*k;
    c.beginPath();c.arc(x,y,7,0,7);c.fillStyle=m.avail?'#e03a3a':'#8a8a8a';c.fill();c.lineWidth=2;c.strokeStyle='#fff';c.stroke();
    c.fillStyle='#fff';c.lineWidth=3;c.strokeStyle='#000';c.strokeText(lbl,x,y-15);c.fillText(lbl,x,y-15);
  }
  const pxm=px*k,pym=py*k,pulse=(Math.sin(Date.now()/250)*.5+.5);
  c.beginPath();c.arc(pxm,pym,10+pulse*4,0,7);c.fillStyle='#ffffff55';c.fill();
  c.beginPath();c.arc(pxm,pym,6,0,7);c.fillStyle='#fff';c.fill();c.lineWidth=2;c.strokeStyle='#1c6bd6';c.stroke();
}
function openMap(){if(battle)return;ov.classList.add('show');drawMini();clearInterval(mapTimer);mapTimer=setInterval(drawMini,120);}
function closeMap(){ov.classList.remove('show');clearInterval(mapTimer);mapTimer=null;}
window.openMiniMap=openMap;closeB.addEventListener('click',closeMap);
ov.addEventListener('click',e=>{if(e.target===ov)closeMap();});
for(const i of Object.values(mimgs))i.onload=()=>{if(ov.classList.contains('show'))drawMini();};

// ---- Map geçişi
const gb=mk('button','mapGecisBtn','⛵ Map Geçişi');gb.type='button';
const gi=new Image();gi.onload=()=>{gb.innerHTML='';gb.style.padding='0';gb.style.border='none';gb.style.background='none';gb.appendChild(gi);};gi.src='Ikonlar/Resimler/map_gecisi.png';
const toast=mk('div','toastMsg','');let toastT=null;
function showToast(msg){toast.textContent=msg;toast.style.display='block';clearTimeout(toastT);toastT=setTimeout(()=>{toast.style.display='none';},2200);}
window.setMapGecis=function(on){gb.classList.toggle('show',!!on);};
gb.addEventListener('click',()=>{
  const next=MAPS['harita02'];
  if(next&&next.baslangic){setActiveMap('harita02');px=next.baslangic.x;py=next.baslangic.y;setMapGecis(false);gecisAktif=false;}
  else showToast('Sonraki harita henüz hazır değil');
});
})();
