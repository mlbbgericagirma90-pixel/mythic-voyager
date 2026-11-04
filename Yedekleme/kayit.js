// ======================================================================
// YEDEKLEME / oyuncu kaydı
// Oyuncunun verisi (konum, altın, seviyeler, seviye/EXP, envanter, canavar doğma süreleri) tarayıcıda (localStorage) saklanır.
// Her 3 saniyede ve sayfa kapanırken otomatik kaydeder. Yeni kayıtlanacak değişken eklerken saveGame ve loadGame ikisine de ekle.
// Kayıt yoksa (ilk açılış) yalnızca başlangıç altını verilir; başlangıç gümüş kılıcı kaldırıldı.
// ======================================================================
const SAVE_KEY='yolGezginSave_v1';
function saveGame(showNotice=false){
 try{
  const data={version:1,mapV:2,px,py,angle,gold,diamonds,playerName,acilanHaritalar,aktifHarita:activeMap?activeMap.id:'harita01',strLevel,hpLevel,defLevel,heroHP,playerLevel,playerExp,inventory,selectedItemSerial,equippedItems,swordSerial,unlockedSlots,nextSlotCost,extraTab,afk:afkVeri(),mons:Object.fromEntries(MONS.map(m=>[m.id,{avail:m.avail,rem:Math.max(0,m.respawnAt-Date.now())}]))};
  localStorage.setItem(SAVE_KEY,JSON.stringify(data));
  if(showNotice&&typeof showBottomNotice==='function')showBottomNotice('Kaydedildi');
  return true;
 }catch(e){if(showNotice&&typeof showBottomNotice==='function')showBottomNotice('Kayıt başarısız');return false;}
}
function loadGame(){
 try{const raw=localStorage.getItem(SAVE_KEY);if(!raw)return false;const d=JSON.parse(raw);if(!d||d.version!==1)return false;
  // Eski kayıtlar eski harita koordinatındadır: konum ve canavar durumu sadece yeni harita kaydında (mapV=2) okunur.
  if(d.mapV===2){if(Number.isFinite(d.px))px=d.px;if(Number.isFinite(d.py))py=d.py;if(Number.isFinite(d.angle))angle=d.angle;}
  if(Number.isFinite(d.playerLevel))playerLevel=Math.max(1,Math.min(EXP_MAX_SEVIYE,d.playerLevel));if(Number.isFinite(d.playerExp))playerExp=Math.max(0,d.playerExp);
  if(Number.isFinite(d.gold))gold=Math.max(0,d.gold);if(Number.isFinite(d.diamonds))diamonds=Math.max(0,d.diamonds);if(typeof d.playerName==='string')playerName=d.playerName.slice(0,10);
  if(Array.isArray(d.acilanHaritalar))acilanHaritalar=d.acilanHaritalar.filter(id=>MAPS[id]);if(!acilanHaritalar.includes('harita01'))acilanHaritalar.unshift('harita01');
  if(d.mapV===2&&typeof d.aktifHarita==='string'&&MAPS[d.aktifHarita]&&acilanHaritalar.includes(d.aktifHarita))setActiveMap(d.aktifHarita);if(Number.isFinite(d.strLevel))strLevel=Math.max(0,d.strLevel);if(Number.isFinite(d.hpLevel))hpLevel=Math.max(0,d.hpLevel);if(Number.isFinite(d.defLevel))defLevel=Math.max(0,d.defLevel);
  if(Number.isFinite(d.heroHP))heroHP=Math.max(1,Math.min(heroMaxHP(),d.heroHP));
  if(Array.isArray(d.inventory))inventory=d.inventory.filter(x=>x&&itemDefs.some(def=>def.id===x.id)&&typeof x.name==='string'&&Number.isFinite(x.damage)).slice(0,120);
  if(d.selectedItemSerial!==undefined)selectedItemSerial=d.selectedItemSerial;
  if(d.equippedItems&&typeof d.equippedItems==='object')for(const slot of EQUIP_SLOTS)equippedItems[slot]=Number.isFinite(d.equippedItems[slot])?d.equippedItems[slot]:null;
  if(Number.isFinite(d.unlockedSlots))unlockedSlots=Math.max(5,Math.min(INV_MAX,d.unlockedSlots));if(Number.isFinite(d.nextSlotCost))nextSlotCost=Math.max(30,d.nextSlotCost);if(Number.isFinite(d.swordSerial))swordSerial=d.swordSerial;
  if(d.extraTab&&typeof d.extraTab==='object')for(const t of ['stone','other']){const e=d.extraTab[t];if(e&&Number.isFinite(e.u)&&Number.isFinite(e.c))extraTab[t]={u:Math.max(5,Math.min(INV_MAX,e.u)),c:Math.max(30,e.c)};}
  for(const slot of EQUIP_SLOTS)if(equippedItems[slot]&&!inventory.some(x=>x.serial===equippedItems[slot]&&x.slot===slot))equippedItems[slot]=null;
  if(d.mapV===2&&d.mons){for(const m of MONS){const s=d.mons[m.id];if(s){m.avail=!!s.avail;m.respawnAt=m.avail?0:Date.now()+Math.max(0,s.rem||0);}}}
  afkYukle(d.afk);
  if(!inventory.some(x=>x.serial===selectedItemSerial))selectedItemSerial=null;
  return true;
 }catch(e){return false;}
}
if(!loadGame()){gold=KARAKTER_DEGER.baslangicAltin;swordSerial=1;inventory=[{...itemDefs.find(d=>d.id==='wood_sword'),serial:1,enchant:null}];selectedItemSerial=null;equippedItems={helmet:null,armor:null,pants:null,boots:null,necklace:null,earring:null,weapon:1,ring:null,cape:null,costume:null,charm:null};unlockedSlots=5;nextSlotCost=30;}
document.getElementById('saveBtn')?.addEventListener('click',()=>saveGame(true));
window.addEventListener('pagehide',()=>saveGame(false));
window.addEventListener('beforeunload',()=>saveGame(false));
setInterval(()=>saveGame(false),3000);
