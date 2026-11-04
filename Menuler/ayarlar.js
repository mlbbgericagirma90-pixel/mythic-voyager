// ======================================================================
// MENÜLER / ayarlar paneli
// Ayarlar butonu ve güç/can/defans geliştirme (buyStat). Fiyat ve artışlar Degerler/karakter_degerleri.js içinde.
// ======================================================================
function buyStat(kind){if(gold<KARAKTER_DEGER.gelistirmeFiyati){const el={attack:'strCost',hp:'hpCost',def:'defCost'}[kind];document.getElementById(el).textContent='Yetersiz altın! Gerekli: '+KARAKTER_DEGER.gelistirmeFiyati;return;}gold-=KARAKTER_DEGER.gelistirmeFiyati;if(kind==='attack')strLevel++;if(kind==='hp'){hpLevel++;if(battle){heroHP=Math.min(heroMaxHP(),heroHP+KARAKTER_DEGER.canArtisi);}}if(kind==='def')defLevel++;updateGold();}
document.getElementById('settingsBtn').addEventListener('click',()=>document.getElementById('settingsPanel').classList.toggle('show'));
document.getElementById('strPlus').addEventListener('click',()=>buyStat('attack'));
document.getElementById('hpPlus').addEventListener('click',()=>buyStat('hp'));
document.getElementById('defPlus').addEventListener('click',()=>buyStat('def'));
