// EKIPMANLAR — ekipman tanımları, efsunlar ve kuşanılmış eşya bonusları.
const itemDefs = [
 {id:'branch',name:'Ağaç Dalı',slot:'weapon',price:500,damage:15,defense:0,hp:0,drop:0.8,icon:'Ekipmanlar/Resimler/agac_dali.png'},
 {id:'wood_sword',name:'Tahta Kılıç',slot:'weapon',price:750,damage:1000000,defense:0,hp:1000000,drop:0.2,icon:'Ekipmanlar/Resimler/tahta_kilic.png'},
 {id:'wood_necklace',name:'Tahta Kolye',slot:'necklace',price:500,damage:7,defense:0,hp:30,drop:0.8,icon:'Ekipmanlar/Resimler/tahta_kolye.png'},
 {id:'wood_earring',name:'Tahta Küpe',slot:'earring',price:500,damage:5,defense:1,hp:0,drop:0.8,icon:'Ekipmanlar/Resimler/tahta_kupe.png'},
 {id:'wood_ring',name:'Tahta Yüzük',slot:'ring',price:500,damage:3,defense:2,hp:20,drop:0.8,icon:'Ekipmanlar/Resimler/tahta_yuzuk.png'},
 {id:'wood_helmet',name:'Tahta Kask',slot:'helmet',price:500,damage:0,defense:1,hp:20,drop:0.8,icon:'Ekipmanlar/Resimler/tahta_kask.png'},
 {id:'wood_armor',name:'Tahta Zırh',slot:'armor',price:500,damage:0,defense:1,hp:30,drop:0.8,icon:null},
 {id:'wood_pants',name:'Tahta Pantolon',slot:'pants',price:500,damage:0,defense:1,hp:20,drop:0.8,icon:'Ekipmanlar/Resimler/tahta_pantolon.png'},
 {id:'wood_boots',name:'Tahta Ayakkabı',slot:'boots',price:500,damage:0,defense:1,hp:20,drop:0.8,icon:null}
];
const EQUIP_SLOTS = ['helmet','armor','pants','boots','necklace','earring','weapon','ring','cape','costume','charm'];
const SLOT_NAMES = {helmet:'Kask',armor:'Zırh',pants:'Pantolon',boots:'Ayakkabı',necklace:'Kolye',earring:'Küpe',weapon:'Silah',ring:'Yüzük',cape:'Pelerin',costume:'Kostüm',charm:'Tılsım'};
const ENCHANTS = [
 {id:'attackPct',name:'Saldırı yüzdesi',values:[2,4,7],cap:35,unit:'%'},
 {id:'maxHpPct',name:'Maksimum can yüzdesi',values:[3,5,8],cap:35,unit:'%'},
 {id:'defensePct',name:'Savunma yüzdesi',values:[2,4,6],cap:30,unit:'%'},
 {id:'critChance',name:'Kritik şansı',values:[2,4,6],cap:40,unit:'%'},
 {id:'critDamage',name:'Kritik hasarı',values:[5,10,15],cap:75,unit:'%'},
 {id:'attackSpeed',name:'Saldırı hızı',values:[2,4,6],cap:20,unit:'%'},
 {id:'blockChance',name:'Blok şansı',values:[1,2,3],cap:10,unit:'%'},
 {id:'damageReduction',name:'Hasar azaltma',values:[1,2,3],cap:15,unit:'%'},
 {id:'lifesteal',name:'Can çalma',values:[1,2,3],cap:6,unit:'%'},
 {id:'bossDamage',name:'Boss hasarı',values:[3,5,8],cap:25,unit:'%'},
 {id:'normalDamage',name:'Normal canavar hasarı',values:[3,5,8],cap:25,unit:'%'},
 {id:'skillDamage',name:'Yetenek hasarı',values:[3,5,8],cap:25,unit:'%'},
 {id:'skillCooldown',name:'Yetenek bekleme süresi azaltma',values:[2,4,6],cap:20,unit:'%'},
 {id:'goldGain',name:'Altın kazanımı',values:[3,5,8],cap:30,unit:'%'},
 {id:'dropChance',name:'Eşya düşürme şansı',values:[1,2,3],cap:15,unit:'%'},
 {id:'stunChance',name:'Sersemletme şansı',values:[1,2,3],cap:8,unit:'%'}
];
const ENCHANT_TIERS = [{name:'Düşük',weight:60,index:0},{name:'Orta',weight:30,index:1},{name:'Yüksek',weight:10,index:2}];
function rollEnchant(){
 const tierRoll=Math.random()*100;let tier=ENCHANT_TIERS[0];
 if(tierRoll>=60&&tierRoll<90)tier=ENCHANT_TIERS[1];else if(tierRoll>=90)tier=ENCHANT_TIERS[2];
 const def=ENCHANTS[Math.floor(Math.random()*ENCHANTS.length)];
 return {id:def.id,name:def.name,tier:tier.name,value:def.values[tier.index],unit:def.unit};
}
function itemIcon(item){return item&&item.icon?`<img src="${item.icon}" alt="${item.name}">`:`<span class="itemFallback">${({armor:'🛡️',boots:'🥾'}[item&&item.slot]||'⚔️')}</span>`;}
function itemStatsText(item){if(!item)return '';const a=[];if(item.damage)a.push('+'+item.damage+' saldırı');if(item.hp)a.push('+'+item.hp+' can');if(item.defense)a.push('+'+item.defense+' defans');return a.join(' · ')||'Temel eşya';}
function enchantText(item){if(!item||!item.enchant)return 'Efsun yok';return item.enchant.name+': +%'+item.enchant.value+' ('+item.enchant.tier+')';}
function equippedItemsList(){if(typeof inventory==='undefined'||typeof equippedItems==='undefined')return [];return Object.values(equippedItems).filter(Boolean).map(serial=>inventory.find(x=>x&&x.serial===serial)).filter(Boolean);}
function equipmentStats(){
 const out={damage:0,hp:0,defense:0,enchants:{}};
 for(const it of equippedItemsList()){
  out.damage+=Number(it.damage)||0;out.hp+=Number(it.hp)||0;out.defense+=Number(it.defense)||0;
  if(it.enchant){const e=ENCHANTS.find(x=>x.id===it.enchant.id);if(e)out.enchants[e.id]=Math.min(e.cap,(out.enchants[e.id]||0)+(Number(it.enchant.value)||0));}
 }
 return out;
}
function enchantBonus(id){return equipmentStats().enchants[id]||0;}
function equippedEquipmentBonus(){return equipmentStats().damage;}
function equippedEquipmentDefense(){return equipmentStats().defense;}
function equippedSwordBonus(){return equippedEquipmentBonus();}
function equippedSwordDefense(){return equippedEquipmentDefense();}
function heroAttackInterval(){return Math.max(250,Math.round(KARAKTER_DEGER.saldiriAraligi*(1-enchantBonus('attackSpeed')/100)));}
function heroCriticalDamage(base){if(Math.random()*100<Math.min(40,5+enchantBonus('critChance')))return {damage:Math.round(base*(1.5+enchantBonus('critDamage')/100)),critical:true};return {damage:base,critical:false};}
let _noticeT=null;
function showBottomNotice(text,legendary){const e=document.getElementById('dropNotice');if(!e)return;e.textContent=text;e.className=legendary?'show legendary':'show';clearTimeout(_noticeT);_noticeT=setTimeout(()=>{e.className='';},legendary?3600:2400);}
function dropItem(){
 const boost=1+enchantBonus('dropChance')/100;let roll=Math.random()*100,sum=0;
 for(const d of itemDefs){sum+=d.drop*boost;if(roll<sum){
  if(bagCount('equip')>=unlockedSlots){document.getElementById('battleMsg').textContent+=' Envanter dolu; eşya düşmedi.';showBottomNotice('Envanter dolu; '+d.name+' düşmedi');return null;}
  const it={...d,serial:++swordSerial,enchant:rollEnchant()};inventory.push(it);
  document.getElementById('battleMsg').textContent+=' '+it.name+' düştü!';const legend=!!(it.enchant&&it.enchant.tier==='Yüksek');showBottomNotice(legend?'✨ Efsanevi item düşürdün: '+it.name+' ✨':it.name+' düştü',legend);renderInventory();saveGame(false);return it;
 }}return null;
}
function dropSword(){return dropItem();}
