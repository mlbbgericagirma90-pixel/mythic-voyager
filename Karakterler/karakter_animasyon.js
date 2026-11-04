// ======================================================================
// KARAKTERLER / Kutsal Şövalye koşu ve duruş animasyonu
// Kaynak: Savasci_Analog_Test.html (sprite sayfaları Karakterler/Resimler/kosu/ klasöründe).
// Her sayfada yan yana koşu kareleri, en sonda duruş karesi. Sol yönler sağ sayfanın aynasıdır.
// Hız ve adım değerleri test dosyasındaki varsayılanlardır.
// drawHeroAnim: Cekirdek/oyun_dongusu.js tarafından çağrılır.
// ======================================================================
var HERO=(function(){
  var DIR='Karakterler/Resimler/kosu/';
  var META={"w": 320, "h": 249, "px": 160, "py": 233, "stand": 230.0, "dirs": {"alt": {"n": 19, "idle": 19}, "alt_sag": {"n": 16, "idle": 16}, "ust": {"n": 20, "idle": 20}, "ust_sag": {"n": 17, "idle": null}, "sag": {"n": 12, "idle": 12}}};
  var SHEET_FILES={alt:'sayfa_alt.webp',alt_sag:'sayfa_alt_sag.webp',ust:'sayfa_ust.webp',ust_sag:'sayfa_ust_sag.webp',sag:'sayfa_sag.webp'};
  var YON={sag:['sag',0],alt_sag:['alt_sag',0],alt:['alt',0],alt_sol:['alt_sag',1],sol:['sag',1],ust_sol:['ust_sag',1],ust:['ust',0],ust_sag:['ust_sag',0]};
  var SIRA=['sag','alt_sag','alt','alt_sol','sol','ust_sol','ust','ust_sag'];
  var HIZ=2.6;        // vücut boyu / saniye
  var ADIM=1.8;       // bir adım uzunluğu (vücut boyu)
  var OLU_BOLGE=0.18; // analog ölü bölge

  var IMG={}, pending=0, ready=false;
  Object.keys(SHEET_FILES).forEach(function(k){
    var im=new Image(); pending++;
    im.onload=im.onerror=function(){ if(--pending===0) ready=true; };
    im.src=DIR+SHEET_FILES[k]; IMG[k]=im;
  });

  var st={yon:'alt',derece:90,ilk:false,faz:0,kosuyor:false};

  function yonSec(ax,ay){
    var a=Math.atan2(ay,ax)*180/Math.PI;
    var fark=Math.abs(((a-st.derece+540)%360)-180);
    if(fark>22.5+6||!st.ilk){
      var i=((Math.round(a/45)%8)+8)%8;
      st.derece=i*45>180?i*45-360:i*45; st.yon=SIRA[i]; st.ilk=true;
    }
  }

  function update(dt,mx,my,moving){
    var mag=Math.hypot(mx,my);
    if(moving&&mag>OLU_BOLGE){
      var m=Math.min(1,(mag-OLU_BOLGE)/(1-OLU_BOLGE));
      yonSec(mx,my);
      if(!st.kosuyor){ st.faz=0; st.kosuyor=true; }
      st.faz=(st.faz+(HIZ*m/ADIM)*dt)%1;
    }else{
      st.kosuyor=false;
    }
  }

  function draw(g,ch,feetY){
    if(!ready) return false;
    var k=ch/META.stand;
    var yon=YON[st.yon], sayfa=yon[0], ayna=yon[1];
    var src=sayfa, idx;
    if(!st.kosuyor){
      src=META.dirs[sayfa].idle!=null?sayfa:'ust';
      idx=META.dirs[src].idle;
    }else{
      var n=META.dirs[sayfa].n;
      idx=Math.floor(st.faz*n)%n;
    }
    g.save();
    g.imageSmoothingEnabled=true; g.imageSmoothingQuality='high';
    g.translate(0,feetY);
    if(ayna) g.scale(-1,1);
    g.drawImage(IMG[src],idx*META.w,0,META.w,META.h,-META.px*k,-META.py*k,META.w*k,META.h*k);
    g.restore();
    return true;
  }

  return {update:update, draw:draw, ready:function(){return ready;}};
})();

let __heroLastT=0;
function drawHeroAnim(g,cw,ch,moving,t,phase){
  const dt=Math.min(Math.max(t-__heroLastT,0),.05); __heroLastT=t;
  HERO.update(dt,moveX,moveY,moving);
  if(!HERO.ready()){ if(hero.complete&&hero.naturalWidth)g.drawImage(hero,-cw/2,-ch*.72,cw,ch); return; }
  HERO.draw(g,ch,ch*.28);
}
