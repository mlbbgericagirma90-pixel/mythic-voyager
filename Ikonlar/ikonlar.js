// ======================================================================
// İKONLAR / arayüz (HUD)
// Tüm ekran arayüzü burada kurulur. Konumlar ornek.png (1080x2342) oranına göre, --u birimiyle (1 örnek px) verilir;
// telefon ekranına göre otomatik ölçeklenir. Üst öğeler üstten, alt öğeler alttan sabitlenir.
// Görseller: Ikonlar/Resimler/. Eski (index.html/stil.css) butonlar burada görsele çevrilir, id'leri korunur.
// ======================================================================
(function(){
const R='Ikonlar/Resimler/';
const MAP_ADLARI={harita01:'YEŞİL ORMAN',harita02:'SESSİZ TEPE'};
const MAP_ADI_RESIM={harita01:{dosya:'harita_adi_harita01',oran:1100/130},harita02:{dosya:'harita_adi_harita02',oran:1100/130}}; // yazı yerine görsel kullanan haritalar
const css=document.createElement('style');
css.textContent=`
:root{--u:min(calc(100vw / 1080),calc(100vh / 2342))}
@supports(height:100dvh){:root{--u:min(calc(100vw / 1080),calc(100dvh / 2342))}}
#hudKok{position:fixed;inset:0;z-index:12;pointer-events:none}
#hudKok .hk{position:absolute;margin:0;padding:0;border:0;background:none;box-shadow:none;display:block;pointer-events:auto;-webkit-user-select:none;user-select:none;touch-action:manipulation}
#hudKok .hk img{display:block;width:100%;height:100%;object-fit:contain;pointer-events:none;-webkit-user-drag:none}
#hudKok .ikb .zemin{position:absolute;inset:0}
#hudKok .ikb .sim{position:absolute;left:13%;top:13%;width:74%;height:74%}
#hudKok .ikb:active img{filter:brightness(.8)}
#hudKok .np{pointer-events:none}
body.ikGizli #hudKok>.hk:not(#ikGizle){display:none}
body.ikGizli #reset{display:none!important}
#hint,#status,#goldCounter{display:none!important}
#lvStar span{position:absolute;left:0;right:0;top:50%;transform:translateY(-44%);text-align:center;font:900 calc(var(--u)*62)/1 system-ui,Arial;color:#e3ebff;text-shadow:0 2px 4px #000,0 0 8px #0a1a44}
#oyuncuAdi{font:900 calc(var(--u)*40)/1.1 system-ui,Arial;color:#f6e7b0;text-shadow:0 2px 3px #000,0 0 6px #000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#expFill{position:absolute;left:13%;right:11%;top:29%;bottom:30%;border-radius:calc(var(--u)*12);overflow:hidden;pointer-events:none}
#expFill i{display:block;height:100%;width:0;background:linear-gradient(180deg,#ff6a5c,#d3202a 55%,#8e0e16);box-shadow:0 0 calc(var(--u)*10) #ff3b30aa;transition:width .35s}
.kutuYazi{position:absolute;left:34%;right:10%;top:0;bottom:0;display:flex;align-items:center;justify-content:center;font:900 calc(var(--u)*46)/1 system-ui,Arial;color:#fff6d4;text-shadow:0 2px 3px #000,0 0 6px #000;white-space:nowrap;pointer-events:none}
#hudKok #haritaAdi{display:flex;align-items:center;justify-content:center;border:calc(var(--u)*4) solid #c9a24a;border-radius:calc(var(--u)*22);background:linear-gradient(180deg,#0e1d3acc,#071226dd);font:900 calc(var(--u)*36)/1 system-ui,Arial;letter-spacing:calc(var(--u)*4);color:#f0dfa6;text-shadow:0 2px 3px #000;box-shadow:0 4px 14px #0008}
#hudKok #haritaAdi.resimli{border:0;background:none;box-shadow:none;border-radius:0}
#hudKok #haritaAdi.tikla{pointer-events:auto;cursor:pointer}
#hudKok #haritaAdi.tikla:active{filter:brightness(.8)}
#haritaMenu{z-index:45;background:linear-gradient(180deg,#0b1a38,#050a14);flex-direction:column;align-items:center;justify-content:center;gap:calc(var(--u)*24)}
#haritaMenu .hm{width:min(calc(var(--u)*760),90vw);height:calc(var(--u)*110);flex:0 0 auto;border:calc(var(--u)*5) solid #c9a24a;border-radius:calc(var(--u)*26);background:linear-gradient(180deg,#10224a,#081329);font:900 calc(var(--u)*44)/1 system-ui,Arial;letter-spacing:calc(var(--u)*4);color:#f0dfa6;text-shadow:0 2px 3px #000}
#haritaMenu .hm.su{border-color:#7fe3a1;color:#cfffe0}
#haritaMenuKapat{position:absolute;right:calc(var(--u)*38);top:calc(env(safe-area-inset-top) + var(--u)*45);width:calc(var(--u)*109);height:calc(var(--u)*109);padding:0;border:0;background:none}
#haritaMenuKapat img{display:block;width:100%;height:100%}
#koordYazi{display:flex;align-items:center;justify-content:flex-end;font:800 calc(var(--u)*27)/1 system-ui,Arial;color:#f6e7b0;text-shadow:0 1px 3px #000,0 0 5px #000;white-space:nowrap}
#joy{left:calc(var(--u)*40)!important;bottom:calc(env(safe-area-inset-bottom) + var(--u)*154)!important;width:calc(var(--u)*341)!important;height:calc(var(--u)*341)!important;background:url(${R}analog_arka.webp) center/100% 100% no-repeat!important;border:0!important;box-shadow:none!important;border-radius:0!important}
#knob{width:calc(var(--u)*154)!important;height:calc(var(--u)*154)!important;background:url(${R}analog_dugme.webp) center/100% 100% no-repeat!important;border:0!important;box-shadow:none!important;border-radius:0!important}
#reset{right:calc(var(--u)*34)!important;bottom:calc(env(safe-area-inset-bottom) + var(--u)*437)!important;width:calc(var(--u)*118)!important;height:calc(var(--u)*118)!important;background:url(${R}baslangica_don.webp) center/contain no-repeat!important;border:0!important;border-radius:0!important;font-size:0!important;color:transparent!important;box-shadow:none!important;z-index:12}
#adSecim{position:fixed;inset:0;z-index:95;display:flex;align-items:center;justify-content:center;background:#050a14f2;padding:20px}
#adSecim .kart{width:min(340px,100%);padding:22px 18px;border:2px solid #c9a24a;border-radius:18px;background:linear-gradient(180deg,#10224a,#081329);color:#f6e7b0;text-align:center;box-shadow:0 10px 30px #000a}
#adSecim h2{margin:0 0 6px;font-size:22px}
#adSecim p{margin:0 0 14px;font-size:13px;opacity:.85}
#adSecim input{width:100%;padding:12px;border:2px solid #c9a24a;border-radius:12px;background:#050d1f;color:#fff;font:800 20px system-ui,Arial;text-align:center;outline:none;-webkit-touch-callout:none}
#adSecim .hata{min-height:18px;margin-top:8px;font-size:13px;color:#ff8a80}
#adSecim button{margin-top:10px;width:100%;padding:12px;border:2px solid #f2d479;border-radius:12px;background:#24402f;color:#fff3c4;font:900 17px system-ui,Arial}
`;
document.head.appendChild(css);

const kok=document.createElement('div');kok.id='hudKok';document.body.appendChild(kok);
const cu=n=>`calc(var(--u)*${n})`;
function put(el,p){ // p: l/r (soldan/sağdan), t/b (üstten/alttan), w, h  (örnek px)
  el.classList.add('hk');const s=el.style;
  s.left=p.l!=null?cu(p.l):'auto';s.right=p.r!=null?cu(p.r):'auto';
  s.top=p.t!=null?`calc(env(safe-area-inset-top) + ${cu(p.t)})`:'auto';
  s.bottom=p.b!=null?`calc(env(safe-area-inset-bottom) + ${cu(p.b)})`:'auto';
  s.width=cu(p.w);s.height=cu(p.h);kok.appendChild(el);return el;
}
const mk=(tag,id,html)=>{const e=document.createElement(tag);if(id)e.id=id;if(html!=null)e.innerHTML=html;return e;};
const im=(n,cls)=>`<img src="${R}${n}.webp" alt=""${cls?` class="${cls}"`:''}>`;
const H=1080,V=2342;
const sag=(x1,x2)=>({r:H-x2,w:x2-x1}); // sağdan konum

// ---- Sol üst: EXP barı, seviye yıldızı, oyuncu adı
const expBar=put(mk('div','expBar',im('exp_bar')+'<div id="expFill"><i></i></div>'),{l:164,t:105,w:434,h:74});expBar.classList.add('np');
const star=put(mk('div','lvStar',im('level_yildiz')+'<span id="lvNum">1</span>'),{l:0,t:0,w:209,h:196});star.classList.add('np');
const adEl=put(mk('div','oyuncuAdi',''),{l:224,t:52,w:350,h:50});adEl.classList.add('np');
// ---- Altın ve elmas kutuları
const altin=put(mk('div','altinKutu',im('altin_kutusu')+'<div class="kutuYazi"><span id="goldAmount">0</span></div>'),{l:40,t:200,w:411,h:120});altin.classList.add('np');
const elmas=put(mk('div','elmasKutu',im('elmas_kutusu')+'<div class="kutuYazi"><span id="diamondAmount">0</span></div>'),{l:463,t:200,w:433,h:126});elmas.classList.add('np');
// ---- Aktif görevler panosu (boş)
const gorev=put(mk('div','gorevPano',im('gorev_panosu')),{l:34,t:345,w:680,h:150});gorev.classList.add('np');

// ---- Düğmeler
function dugme(id,sim,zeminli,p,fn){
  let e=id?document.getElementById(id):null;
  if(!e){e=mk('button',id||null);e.type='button';}
  e.removeAttribute('style');e.className='ikb';
  e.innerHTML=(zeminli?im('ikon_zemin','zemin'):'')+(zeminli?im(sim,'sim'):im(sim));
  put(e,p);if(fn)e.addEventListener('click',fn);return e;
}
const yakinda=()=>{if(typeof showBottomNotice==='function')showBottomNotice('Yakında...');};
dugme('saveBtn','manuel_kayit',false,{r:221,t:55,w:93,h:93});                // kayit.js bağlar
dugme('ayarlarBtn','ayarlar',true,{r:38,t:45,w:109,h:109},yakinda);
dugme('mapBtn','mini_map',true,{r:20,t:181,w:146,h:146},()=>{if(window.openMiniMap)openMiniMap();});
const gizle=dugme('ikGizle','ikon_gizle',false,{r:52,t:586,w:82,h:82},()=>{
  const g=document.body.classList.toggle('ikGizli');
  gizle.innerHTML=im(g?'ikon_goster':'ikon_gizle');
});
dugme('marketBtn','market',true,{r:20,t:699,w:146,h:146});                  // market.js bağlar
dugme('equipBtn','ekipman',true,{r:20,t:878,w:146,h:146});                   // envanter.js bağlar
dugme('arastirmaBtn','arastirma',true,{r:20,t:1055,w:146,h:146},yakinda);
dugme('siralamaBtn','siralama',true,{r:20,t:1237,w:146,h:146},yakinda);
dugme('basarimBtn','basarimlar',true,{r:20,t:1410,w:146,h:146},yakinda);
dugme('settingsBtn','statu_arttir',false,{r:36,b:V-1763,w:114,h:115});       // ayarlar.js bağlar (statü paneli)
dugme('afkBtn','afk_farm',true,{l:30,b:V-1775,w:146,h:146},()=>{if(window.afkAc)afkAc();else yakinda();});
const bag=document.getElementById('bagBtn');if(bag)bag.style.display='none';
// ---- Harita adı
const ad=put(mk('div','haritaAdi','YEŞİL ORMAN'),{l:257,b:12,w:598,h:92});
const menu=mk('div','haritaMenu','<button type="button" id="haritaMenuKapat" aria-label="Kapat"><img src="'+R+'kapat.webp" alt=""></button>');menu.classList.add('modalPanel');document.body.appendChild(menu);
const koord=put(mk('div','koordYazi','X:0 Y:0'),{r:38,t:8,w:260,h:34});koord.classList.add('np');
setInterval(()=>{koord.textContent='X:'+Math.round(px)+' Y:'+Math.round(py);},150);

// ---- Değerler
window.updateExpUi=function(){
  const need=expGerekli(playerLevel),max=!isFinite(need);
  const n=document.getElementById('lvNum');if(n)n.textContent=playerLevel;
  const f=document.querySelector('#expFill i');if(f)f.style.width=(max?100:Math.min(100,playerExp/need*100))+'%';
};
window.updatePlayerName=function(){adEl.textContent=playerName||'';};
let sonHarita='';
function adCiz(id){
  const r=MAP_ADI_RESIM[id];
  if(r){const w=760,h=Math.round(w/r.oran);ad.classList.add('resimli');ad.innerHTML=im(r.dosya);ad.style.width=cu(w);ad.style.height=cu(h);ad.style.left='50%';ad.style.marginLeft=cu(-w/2);}
  else{ad.classList.remove('resimli');ad.textContent=MAP_ADLARI[id]||id.toUpperCase();ad.style.width=cu(598);ad.style.height=cu(92);ad.style.left='50%';ad.style.marginLeft=cu(-299);}
  ad.classList.toggle('tikla',acilanHaritalar.length>1);
}
function listeKapat(){menu.classList.remove('show');}
function listeCiz(){
  menu.querySelectorAll('.hm').forEach(e=>e.remove());
  for(const id of acilanHaritalar){const b=mk('button',null,MAP_ADLARI[id]||id);b.type='button';b.className='hm'+(activeMap&&activeMap.id===id?' su':'');b.addEventListener('click',()=>haritayaGit(id));menu.appendChild(b);}
}
function haritayaGit(id){
  listeKapat();
  if(battle||(typeof dead!=='undefined'&&dead)||!MAPS[id]||!acilanHaritalar.includes(id)||(activeMap&&activeMap.id===id))return;
  const b=MAPS[id].baslangic||(id==='harita01'?HARITA01_AYAR.baslangic:null);if(!b)return;
  setActiveMap(id);px=b.x;py=b.y;moveX=moveY=0;
  if(typeof setMapGecis==='function')setMapGecis(false);if(typeof gecisAktif!=='undefined')gecisAktif=false;
  saveGame(false);
}
ad.addEventListener('click',()=>{
  if(battle||acilanHaritalar.length<2)return;
  listeCiz();menu.classList.add('show');
});
document.getElementById('haritaMenuKapat').addEventListener('click',listeKapat);
function haritaTik(){
  const id=activeMap&&activeMap.id;
  if(id&&id!==sonHarita){sonHarita=id;if(!acilanHaritalar.includes(id)){acilanHaritalar.push(id);saveGame(false);}adCiz(id);listeKapat();}
  else if(ad.classList.contains('tikla')!==(acilanHaritalar.length>1))adCiz(id);
  if(battle)listeKapat();
}
haritaTik();setInterval(haritaTik,300);
updateExpUi();updateDiamonds();updatePlayerName();

// ---- Oyuncu adı seçimi (3-10 karakter, sadece harf ve rakam, kopyala/yapıştır yasak)
const AD_RE=/^[A-Za-z0-9ÇĞİÖŞÜçğıöşü]{3,10}$/;
if(!AD_RE.test(playerName||'')){
  const m=mk('div','adSecim','<div class="kart"><h2>Oyuncu Adı</h2><p>3-10 karakter, sadece harf ve rakam</p><input type="text" maxlength="10" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" inputmode="text" aria-label="Oyuncu adı"><div class="hata"></div><button type="button">Başla</button></div>');
  document.body.appendChild(m);
  const inp=m.querySelector('input'),hata=m.querySelector('.hata'),btn=m.querySelector('button');
  for(const t of ['paste','copy','cut','drop','dragstart','contextmenu'])inp.addEventListener(t,e=>e.preventDefault());
  inp.addEventListener('keydown',e=>{const k=(e.key||'').toLowerCase();if((e.ctrlKey||e.metaKey)&&['v','c','x','a','insert'].includes(k)||(e.shiftKey&&k==='insert')){e.preventDefault();return;}if(e.key==='Enter')btn.click();});
  inp.addEventListener('beforeinput',e=>{if(['insertFromPaste','insertFromPasteAsQuotation','insertFromDrop','insertFromYank','insertReplacementText','deleteByCut'].includes(e.inputType))e.preventDefault();});
  inp.addEventListener('input',()=>{const v=inp.value.replace(/[^A-Za-z0-9ÇĞİÖŞÜçğıöşü]/g,'').slice(0,10);if(v!==inp.value)inp.value=v;hata.textContent='';});
  inp.addEventListener('select',()=>{try{inp.setSelectionRange(inp.value.length,inp.value.length);}catch(e){}});
  btn.addEventListener('click',()=>{
    const v=inp.value;
    if(v.length<3){hata.textContent='En az 3 karakter olmalı';return;}
    if(!AD_RE.test(v)){hata.textContent='Sadece harf ve rakam kullanılabilir';return;}
    playerName=v;updatePlayerName();saveGame(false);m.remove();
  });
  setTimeout(()=>{try{inp.focus();}catch(e){}},300);
}
})();
