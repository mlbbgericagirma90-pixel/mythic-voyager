// ======================================================================
// KAYNAKLAR / Altın
// Altın miktarı (gold) ve ekrana yazan updateGold(). Altın kazanma: Savas/savas.js (battleHit) içinde.
// ======================================================================
let gold=0;
// 9999'a kadar düz, sonrası 10K / 10.1K / 10M / 10.1M / 10B / 10.1B (aşağı yuvarlar). Elmas da kullanır.
function formatBirim(n){n=Math.floor(Math.max(0,n));if(n<10000)return String(n);const u=n>=1e9?[1e9,'B']:n>=1e6?[1e6,'M']:[1e3,'K'];return (Math.floor(n/u[0]*10)/10).toString().replace(/\.0$/,'')+u[1];}
function updateGold(){document.getElementById('goldAmount').textContent=formatBirim(gold);document.getElementById('strCost').textContent='Maliyet: '+KARAKTER_DEGER.gelistirmeFiyati+' altın';document.getElementById('strLevel').textContent='Seviye: '+strLevel+' · Hasar: '+heroAttack();document.getElementById('hpCost').textContent=KARAKTER_DEGER.gelistirmeFiyati+' altın · +'+KARAKTER_DEGER.canArtisi+' maksimum can';document.getElementById('hpLevel').textContent='Maksimum can: '+heroMaxHP();document.getElementById('defCost').textContent=KARAKTER_DEGER.gelistirmeFiyati+' altın · +'+KARAKTER_DEGER.savunmaCarpani+' defans';document.getElementById('defLevel').textContent='Defans: '+heroDefense()+' · Alınan hasar azalması: '+heroDefense();updateBattleHud();if(document.getElementById('inventorySlots'))renderInventory();saveGame(false);}
