// ======================================================================
// MAPLER / Harita01 — oyun ayarları (koordinatlar birleşik harita 3382x3382 üzerinde, piksel)
// baslangic: karakterin başlangıç noktası (ayak noktası). karakterBoy: karakterin harita üzerindeki boyu.
// canavarlar: cx = canavarın yatay merkezi, ayak = canavarın ayak (alt) noktası, w = görünen genişlik.
// gecis: M1 harita geçiş alanı (elips): merkez x,y, genişlik w, yükseklik h, dönüş açısı (derece).
// Harita01'in son seviyesi: 20 (EXP kuralları için).
// ======================================================================
const HARITA01_AYAR={
  baslangic:{x:715,y:828},
  karakterBoy:285,
  sonSeviye:20,
  canavarlar:[
    {id:'c1',dosya:'kirmizi_toprak_kertenkelesi.webp',cx:904, ayak:1960,w:384},
    {id:'c2',dosya:'orman_domuzu.webp',               cx:768, ayak:2572,w:384},
    {id:'c3',dosya:'utangac_papagan.webp',            cx:1632,ayak:520, w:384},
    {id:'c4',dosya:'vahsi_goril.webp',                cx:284, ayak:3072,w:336},
    {id:'c5',dosya:'ormanlarin_krali.webp',           cx:2360,ayak:772, w:408},
    {id:'c6',dosya:'ofkeli_ayi.webp',                 cx:2364,ayak:1592,w:464},
    {id:'c7',dosya:'kizil_ejder.webp',                cx:2564,ayak:2324,w:888}
  ],
  gecis:{x:3029,y:2495,w:460,h:726,aci:135}
};
function haritaGecisIcinde(x,y){const g=HARITA01_AYAR.gecis,a=g.aci*Math.PI/180,dx=x-g.x,dy=y-g.y;const u=dx*Math.cos(a)+dy*Math.sin(a),v=-dx*Math.sin(a)+dy*Math.cos(a);return (u/(g.w/2))**2+(v/(g.h/2))**2<=1;}
