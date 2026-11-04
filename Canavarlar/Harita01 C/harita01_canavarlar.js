// ======================================================================
// CANAVARLAR / Harita01 canavarları (C1-C7)
// Resimler: Canavarlar/Harita01 C/Resimler/*.webp. Konumlar: Mapler/Harita01/harita_ayar.js. Değerler: Degerler/canavar_degerleri.js.
// Her canavarın durumu: avail (haritada mı), respawnAt (ne zaman doğar).
// Eski canavar dosyaları (kertenkele.js, mavi_kertenkele.js, yilan.js, ejderha.js) artık yüklenmiyor.
// ======================================================================
const MONS=HARITA01_AYAR.canavarlar.map((c,i)=>{
  const img=new Image();img.src='Canavarlar/Harita01 C/Resimler/'+c.dosya;
  return {id:c.id,harita:'harita01',cx:c.cx,ayak:c.ayak,w:c.w,img,src:img.src,avail:true,respawnAt:0,ph:i*1.3,
    // savaş tetikleme yarıçapı: canavar boyuna göre 100-220 px
    radius:Math.max(100,Math.min(220,c.w*.3))};
});
const monById=id=>MONS.find(m=>m.id===id);
const monH=m=>m.img.naturalWidth?m.w*m.img.naturalHeight/m.img.naturalWidth:m.w;
