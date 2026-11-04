// ENVANTER ve ekipman ekranları.
let inventory=[], selectedItemSerial=null, equippedItems={helmet:null,armor:null,pants:null,boots:null,necklace:null,earring:null,weapon:null,ring:null,cape:null,costume:null,charm:null}, swordSerial=0;
let unlockedSlots=5, nextSlotCost=30, inventoryFilterSlot=null;
const INV_MAX=30;
// Ekipman sekmesi unlockedSlots/nextSlotCost kullanır; diğer sekmelerin yuvaları ayrı.
let extraTab={stone:{u:5,c:30},other:{u:5,c:30}};
let inventoryTab='equip', bulkMode=false, bulkPicked=new Set(), bulkDelArm=false, equipPopSlot=null;
function itemTab(it){return (it&&it.tab)||'equip';}
function bagItems(tab){return inventory.filter(x=>x&&itemTab(x)===tab&&!equippedSlotForSerial(x.serial)&&(tab!=='equip'||!inventoryFilterSlot||x.slot===inventoryFilterSlot));}
function bagCount(tab){tab=tab||'equip';return inventory.filter(x=>x&&itemTab(x)===tab&&!equippedSlotForSerial(x.serial)).length;}
function tabSlots(tab){return tab==='equip'?{u:unlockedSlots,c:nextSlotCost}:extraTab[tab];}
function sellPrice(it){return Math.floor((Number(it&&it.price)||0)/3);}
function removeItem(serial){for(const k of Object.keys(equippedItems))if(equippedItems[k]===serial)equippedItems[k]=null;inventory=inventory.filter(x=>x.serial!==serial);if(selectedItemSerial===serial)selectedItemSerial=null;}
function afterInvChange(){updateGold();renderInventory();renderEquipment();saveGame(false);}
function getSelectedItem(){return inventory.find(x=>x&&x.serial===selectedItemSerial)||null;}
function equippedSlotForSerial(serial){return Object.keys(equippedItems).find(k=>equippedItems[k]===serial)||null;}
const EKIPMAN_YERLESIM={cape:[403,126,219],necklace:[54,410,234],helmet:[735,410,234],ring:[54,682,234],armor:[735,682,234],weapon:[54,955,234],pants:[735,955,234],earring:[54,1232,234],boots:[735,1232,234],costume:[282,1482,230],charm:[515,1482,230]};
const SLOT_IKON={weapon:'silah',necklace:'kolye',helmet:'kask',cape:'pelerin',pants:'pantolon',costume:'kostum',armor:'zirh',ring:'yuzuk',earring:'kupe',boots:'ayakkabi',charm:'tilsim'};
function renderEquipment(){
 const root=document.getElementById('equipmentSlots');if(!root)return;root.innerHTML='';
 const ch=KARAKTER_EKIPMAN[secilenKarakter],img=document.getElementById('equipCharImg');
 if(img&&ch){img.src=ch.src;img.style.left=ch.left/10.24+'%';img.style.top=ch.top/18.2+'%';img.style.width=ch.w/10.24+'%';img.style.mixBlendMode=ch.blend?'screen':'normal';}
 for(const slotName of EQUIP_SLOTS){const [x,y,sz]=EKIPMAN_YERLESIM[slotName];const b=document.createElement('button');b.type='button';b.className='equipmentSlot';b.style.left=x/10.24+'%';b.style.top=y/18.2+'%';b.style.width=sz/10.24+'%';b.style.height=sz/18.2+'%';b.setAttribute('aria-label',SLOT_NAMES[slotName]);const it=inventory.find(i=>i.serial===equippedItems[slotName]);b.innerHTML='<img class="slotBase" src="Menuler/Resimler/Slotlar/'+SLOT_IKON[slotName]+'.webp" alt="">'+(it?'<div class="slotItem">'+itemIcon(it)+'</div>':'');if(it)b.title=it.name+' — '+itemStatsText(it)+' — '+enchantText(it);b.addEventListener('click',()=>{if(it)openEquipPopup(slotName);else{inventoryFilterSlot=slotName;inventoryTab='equip';document.getElementById('equipmentPanel').classList.remove('show');openInventory();}});root.appendChild(b);}
}
function renderStats(){
 const rows=[['Seviye',playerLevel],['Can',heroMaxHP()],['Saldırı',heroAttack()],['Defans',heroDefense()],['Kritik şansı','%'+Math.min(40,5+enchantBonus('critChance'))],['Kritik hasarı','%'+(150+enchantBonus('critDamage'))],['Saldırı aralığı',(heroAttackInterval()/1000).toFixed(2)+' sn'],['Can çalma','%'+enchantBonus('lifesteal')],['Blok şansı','%'+enchantBonus('blockChance')],['Hasar azaltma','%'+enchantBonus('damageReduction')]];
 document.getElementById('equipStats').innerHTML='<div class="statsTitle">İstatistikler</div>'+rows.map(r=>'<div class="statsRow"><span>'+r[0]+'</span><b>'+r[1]+'</b></div>').join('');
}
function openEquipment(){document.getElementById('equipStats').classList.remove('show');document.getElementById('equipPopup').classList.remove('show');renderEquipment();document.getElementById('equipmentPanel').classList.add('show');}
function openInventory(){bulkMode=false;bulkPicked.clear();bulkDelArm=false;closeItemPopup();renderInventory();document.getElementById('inventoryPanel').classList.add('show');}
function closeInventory(){bulkMode=false;bulkPicked.clear();closeItemPopup();document.getElementById('inventoryPanel').classList.remove('show');}
function openEquipPopup(slot){const it=inventory.find(i=>i.serial===equippedItems[slot]);if(!it)return;equipPopSlot=slot;document.getElementById('equipPopName').textContent=it.name+' · '+SLOT_NAMES[slot];document.getElementById('equipPopInfo').textContent=itemStatsText(it)+'\n'+enchantText(it);document.getElementById('equipPopup').classList.add('show');}
function buyInventorySlot(tab){tab=tab||inventoryTab;const ts=tabSlots(tab);if(!ts||ts.u>=INV_MAX)return;if(gold<ts.c){showBottomNotice('Yetersiz altın. Gerekli: '+ts.c+' altın');return;}gold-=ts.c;if(tab==='equip'){unlockedSlots++;nextSlotCost*=2;}else{extraTab[tab].u++;extraTab[tab].c*=2;}updateGold();renderInventory();saveGame(false);}
function closeItemPopup(){const p=document.getElementById('invPopup');if(p)p.classList.remove('show');}
function openItemPopup(){const it=getSelectedItem();if(!it)return;document.getElementById('invSelectedName').textContent=it.name+(it.slot?' · '+SLOT_NAMES[it.slot]:'');document.getElementById('invSelectedInfo').textContent=itemStatsText(it)+'\n'+enchantText(it);const eq=document.getElementById('equipItemBtn');eq.style.display=it.slot?'':'none';document.getElementById('sellItemBtn').textContent='Sat (+'+sellPrice(it)+' altın)';document.getElementById('invPopup').classList.add('show');}
function updateBulkBar(){const bar=document.getElementById('invBulkBar');bar.classList.toggle('show',bulkMode);document.getElementById('bulkBtn').classList.toggle('on',bulkMode);let sum=0;for(const sr of bulkPicked){const it=inventory.find(x=>x.serial===sr);if(it)sum+=sellPrice(it);}document.getElementById('bulkCount').textContent=bulkPicked.size+' seçili · +'+sum+' altın';document.getElementById('bulkDelBtn').textContent=bulkDelArm?'Emin misin?':'Sil';const none=bulkPicked.size===0;document.getElementById('bulkSellBtn').disabled=none;document.getElementById('bulkDelBtn').disabled=none;}
function renderInventory(){
 const slots=document.getElementById('inventorySlots');if(!slots)return;slots.innerHTML='';
 const tab=inventoryTab,ts=tabSlots(tab),list=bagItems(tab);
 document.querySelectorAll('#inventoryPanel .invTab').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
 for(let i=0;i<INV_MAX;i++){
  const item=list[i],b=document.createElement('button');b.type='button';b.className='invSlot';
  if(i>=ts.u){b.classList.add('locked');b.innerHTML='<img class="slotBg" src="Menuler/Resimler/Slotlar/kilitli_slot.webp" alt=""><span class="coinTag">🪙'+ts.c+'</span>';b.addEventListener('click',()=>buyInventorySlot(tab));}
  else{
   b.innerHTML='<img class="slotBg" src="Menuler/Resimler/Slotlar/acik_slot.webp" alt="">'+(item?'<div class="slotIcon">'+itemIcon(item)+'</div>':'');
   if(item){b.title=item.name;if(bulkMode&&bulkPicked.has(item.serial)){b.classList.add('picked');b.insertAdjacentHTML('beforeend','<span class="pickMark">✓</span>');}
    b.addEventListener('click',()=>{if(bulkMode){if(bulkPicked.has(item.serial))bulkPicked.delete(item.serial);else bulkPicked.add(item.serial);bulkDelArm=false;renderInventory();}else{selectedItemSerial=item.serial;openItemPopup();}});}
  }
  slots.appendChild(b);
 }
 const f=document.getElementById('inventoryFilter');if(f){const on=!!inventoryFilterSlot&&tab==='equip';f.style.display=on?'':'none';if(on)f.textContent=SLOT_NAMES[inventoryFilterSlot]+' ✕';}
 updateBulkBar();
}
function equipSelectedItem(){const item=getSelectedItem();if(!item||!item.slot)return;equippedItems[item.slot]=item.serial;closeItemPopup();afterInvChange();}
function unequipSlot(slot){if(!slot||!equippedItems[slot])return;if(bagCount('equip')>=unlockedSlots){showBottomNotice('Envanter dolu; önce yer aç');return;}equippedItems[slot]=null;document.getElementById('equipPopup').classList.remove('show');afterInvChange();}
function deleteSelectedItem(){const item=getSelectedItem();if(!item)return;removeItem(item.serial);closeItemPopup();afterInvChange();}
function sellSelectedItem(){const item=getSelectedItem();if(!item)return;const p=sellPrice(item);removeItem(item.serial);gold+=p;closeItemPopup();afterInvChange();showBottomNotice(item.name+' satıldı: +'+p+' altın');}
function bulkSell(){let sum=0;for(const sr of [...bulkPicked]){const it=inventory.find(x=>x.serial===sr);if(it){sum+=sellPrice(it);removeItem(sr);}}gold+=sum;bulkPicked.clear();bulkDelArm=false;afterInvChange();showBottomNotice('Satıldı: +'+sum+' altın');}
function bulkDelete(){if(!bulkDelArm){bulkDelArm=true;updateBulkBar();return;}for(const sr of [...bulkPicked])removeItem(sr);bulkPicked.clear();bulkDelArm=false;afterInvChange();}
const $=id=>document.getElementById(id);
$('equipBtn').addEventListener('click',openEquipment);
$('bagBtn').addEventListener('click',openEquipment);
$('equipmentBagBtn').addEventListener('click',()=>{inventoryFilterSlot=null;$('equipmentPanel').classList.remove('show');openInventory();});
$('closeEquipmentBtn').addEventListener('click',()=>{$('equipPopup').classList.remove('show');$('equipmentPanel').classList.remove('show');});
$('equipStatBtn').addEventListener('click',()=>{const p=$('equipStats');if(!p.classList.contains('show'))renderStats();p.classList.toggle('show');});
$('equipStats').addEventListener('click',()=>$('equipStats').classList.remove('show'));
$('closeInventoryBtn').addEventListener('click',closeInventory);
$('invBackBtn').addEventListener('click',()=>{inventoryFilterSlot=null;closeInventory();openEquipment();});
$('bulkBtn').addEventListener('click',()=>{bulkMode=!bulkMode;bulkPicked.clear();bulkDelArm=false;closeItemPopup();renderInventory();});
$('bulkSellBtn').addEventListener('click',bulkSell);
$('bulkDelBtn').addEventListener('click',bulkDelete);
document.querySelectorAll('#inventoryPanel .invTab').forEach(b=>b.addEventListener('click',()=>{inventoryTab=b.dataset.tab;bulkPicked.clear();bulkDelArm=false;closeItemPopup();renderInventory();}));
$('equipItemBtn').addEventListener('click',equipSelectedItem);
$('deleteItemBtn').addEventListener('click',deleteSelectedItem);
$('sellItemBtn').addEventListener('click',sellSelectedItem);
$('inventoryFilter').addEventListener('click',()=>{inventoryFilterSlot=null;renderInventory();});
$('unequipBtn').addEventListener('click',()=>unequipSlot(equipPopSlot));
$('changeEquipBtn').addEventListener('click',()=>{inventoryFilterSlot=equipPopSlot;inventoryTab='equip';$('equipPopup').classList.remove('show');$('equipmentPanel').classList.remove('show');openInventory();});
for(const id of ['invPopup','equipPopup'])$(id).addEventListener('click',e=>{if(e.target.id===id)e.target.classList.remove('show');});
