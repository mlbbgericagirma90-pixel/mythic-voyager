// ======================================================================
// CANAVARLAR / Harita02 canavarları (h2c1-h2c8, h2c8 boss). Harita01 C'den sonra yüklenir, aynı MONS listesine eklenir.
// Resimler: Canavarlar/Harita02 C/Resimler/*.webp. Konumlar: Mapler/Harita02/harita_ayar.js. Değerler: Degerler/canavar_degerleri.js.
// ======================================================================
HARITA02_AYAR.canavarlar.forEach((c,i)=>{
  const img=new Image();img.src='Canavarlar/Harita02 C/Resimler/'+c.dosya;
  MONS.push({id:c.id,harita:'harita02',cx:c.cx,ayak:c.ayak,w:c.w,img,src:img.src,avail:true,respawnAt:0,ph:i*1.3,
    radius:Math.max(100,Math.min(220,c.w*.3))});
});
