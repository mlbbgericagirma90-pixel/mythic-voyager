// MARKET — yeni tahta ekipmanlar.
function renderMarket(){
 const g=document.getElementById('marketGrid');g.innerHTML='';
 itemDefs.forEach(d=>{const c=document.createElement('div');c.className='swordCard';c.innerHTML=`<div class="swordArt">${itemIcon(d)}</div><div class="swordName">${d.name}</div><div class="swordMeta">🪙 ${d.price} altın<br>${itemStatsText(d)}</div><button class="gameBtn">Satın al</button>`;
 c.querySelector('button').addEventListener('click',()=>{if(gold<d.price){c.querySelector('button').textContent='Yetersiz altın';return;}if(bagCount('equip')>=unlockedSlots){c.querySelector('button').textContent='Envanter dolu';return;}gold-=d.price;inventory.push({...d,serial:++swordSerial,enchant:null});selectedItemSerial=inventory[inventory.length-1].serial;updateGold();renderInventory();c.querySelector('button').textContent='Satın alındı ✓';saveGame(false);});g.appendChild(c);});
}
document.getElementById('marketBtn').addEventListener('click',()=>{renderMarket();document.getElementById('marketPanel').classList.add('show');});
