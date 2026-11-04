// ======================================================================
// KAYNAKLAR / Elmas
// diamonds değişkeni, ekran yazısı (#diamondAmount, Ikonlar/ikonlar.js oluşturur) ve addDiamonds().
// Formatı formatBirim() (altin.js) yapar. Kayıt: Yedekleme/kayit.js. Kazanma/harcama sistemi henüz yok.
// ======================================================================
let diamonds=0;
function updateDiamonds(){const e=document.getElementById('diamondAmount');if(e)e.textContent=formatBirim(diamonds);}
function addDiamonds(n){diamonds=Math.max(0,diamonds+n);updateDiamonds();}
