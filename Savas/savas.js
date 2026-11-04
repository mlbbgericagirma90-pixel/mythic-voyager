// ======================================================================
// SAVAŞ / savaş sistemi
// startBattle, battleHit (vuruş, altın kazanma, canavar doğma süresi), finishBattle, closeBattle, savaş HUD.
// Sayılar Degerler/canavar_degerleri.js içinde. Ölüm ekranı: Menuler/olum_ekrani.js.
// ======================================================================
function updateBattleHud(){const maxHP=heroMaxHP();document.getElementById('heroHpBar').style.width=Math.max(0,heroHP/maxHP*100)+'%';document.getElementById('monsterHpBar').style.width=Math.max(0,monsterHP/monsterMaxHP*100)+'%';document.getElementById('heroHpText').textContent=heroHP+' / '+maxHP+' HP';document.getElementById('monsterHpText').textContent=monsterHP+' / '+monsterMaxHP+' HP';}
function closeBattle(){battle=false;hudToggle(true);if(autoBattleInterval){clearInterval(autoBattleInterval);autoBattleInterval=null;}moveX=moveY=0;battleEl.classList.remove('show');battleEl.setAttribute('aria-hidden','true');document.getElementById('hint').style.display='';document.getElementById('status').style.display='';document.getElementById('joy').style.display='';document.getElementById('reset').style.display='';document.getElementById('attackBtn').disabled=false;}
function startBattle(id){
 const mon=monById(id);if(!mon||!mon.avail)return;
 activeMonsterType=id;const cd=CANAVAR_DEGER[id];
 battleMonsterStats=monsterStatsForLevel(cd,playerLevel);
 monsterMaxHP=battleMonsterStats.can;monsterDamage=battleMonsterStats.hasar[0];monsterReward=cd.altin[0]+Math.floor(Math.random()*cd.altin[1]);
 document.getElementById('battleTitle').textContent=cd.ad.toLocaleUpperCase('tr-TR');
 document.querySelector('#battleHud > div:nth-child(2) .hudName').textContent=cd.ad;
 const bm=document.getElementById('battleMonster');bm.style.filter='none';bm.src=mon.src;
 document.getElementById('settingsPanel').classList.remove('show');
 battle=true;hudToggle(false);moveX=moveY=0;battleTurn=0;battleDone=false;heroHP=heroMaxHP();monsterHP=monsterMaxHP;
 battleEl.classList.add('show');battleEl.setAttribute('aria-hidden','false');
 for(const k of ['hint','status','joy','reset'])document.getElementById(k).style.display='none';
 document.getElementById('battleMsg').textContent=battleMonsterStats.missing>0
  ? 'Savaş başladı! Gereken seviye: '+cd.gerekenSeviye+'. Eksik seviye: '+battleMonsterStats.missing+'. Can x'+Math.pow(1.3,battleMonsterStats.missing).toFixed(2)+', vuruş x'+Math.pow(2,battleMonsterStats.missing)+'.'
  : 'Savaş başladı! Saldırılar sırayla gerçekleşiyor.';
 document.getElementById('continueBtn').style.display='none';
 document.getElementById('attackBtn').style.display='none';document.getElementById('attackBtn').disabled=true;
 document.getElementById('cancelBattleBtn').style.display='inline-block';
 updateBattleHud();
 // Kahraman her KARAKTER_DEGER.saldiriAraligi ms'de, canavar kendi hızında (cd.hiz sn) vurur.
 const now=Date.now();battleHeroNext=now+heroAttackInterval();battleMonNext=now+cd.hiz*1000;
 if(autoBattleInterval)clearInterval(autoBattleInterval);
 autoBattleInterval=setInterval(()=>{
  if(!battle||battleDone){clearInterval(autoBattleInterval);autoBattleInterval=null;return;}
  const n=Date.now();
  if(n>=battleHeroNext){battleHeroNext+=heroAttackInterval();heroStrike();}
  if(!battleDone&&n>=battleMonNext){battleMonNext+=CANAVAR_DEGER[activeMonsterType].hiz*1000;monsterStrike();}
 },50);
}
function finishBattle(kind){battleDone=true;document.getElementById('attackBtn').disabled=true;moveX=moveY=0;setTimeout(()=>{closeBattle();if(kind==='hero')showDeath();},650);}
function hudToggle(show){for(const id of ['hudKok']){const e=document.getElementById(id);if(e)e.style.display=show?'':'none';}}
function playFx(id){const e=document.getElementById(id);if(!e)return;e.classList.remove('play');void e.offsetWidth;e.classList.add('play');}
let battleHeroNext=0,battleMonNext=0;
let battleMonsterStats=null;
// Her eksik seviye canı 1.3, hasarı 2 kat artırır. Yuvarlama yukarı yapılır.
function monsterStatsForLevel(cd,level){
 const missing=Math.max(0,(cd.gerekenSeviye||1)-level);
 const hpMultiplier=Math.pow(1.3,missing),damageMultiplier=Math.pow(2,missing);
 return {
  missing,
  can:Math.ceil(cd.can*hpMultiplier),
  hasar:[Math.floor(cd.hasar[0]*damageMultiplier),Math.ceil((cd.hasar[0]+cd.hasar[1]-1)*damageMultiplier)-Math.floor(cd.hasar[0]*damageMultiplier)+1]
 };
}
function heroStrike(){
 if(!battle||battleDone)return;
 const pf=document.getElementById('playerFighter'),mf=document.getElementById('monsterFighter');
 pf.style.transform='translateX(14px)';mf.style.transform='translateX(8px)';
 mf.classList.remove('hit');void mf.offsetWidth;mf.classList.add('hit');playFx('fxSlash');
 let rawDamage=heroAttack();const cd=CANAVAR_DEGER[activeMonsterType];rawDamage=Math.round(rawDamage*(1+(activeMonsterType==='c7'?enchantBonus('bossDamage'):enchantBonus('normalDamage'))/100));const crit=heroCriticalDamage(rawDamage);const hitDamage=crit.damage;monsterHP=Math.max(0,monsterHP-hitDamage);
 const steal=Math.round(hitDamage*enchantBonus('lifesteal')/100);if(steal>0)heroHP=Math.min(heroMaxHP(),heroHP+steal);
 document.getElementById('battleMsg').textContent='Kutsal Şövalye '+hitDamage+' hasar verdi!'+(crit.critical?' Kritik!':'')+(steal>0?' '+steal+' can çaldı.':'');
 setTimeout(()=>{pf.style.transform='';mf.style.transform='';},220);updateBattleHud();
 if(monsterHP<=0){
  const dropped=dropItem();const goldEarned=Math.round(monsterReward*(1+enchantBonus('goldGain')/100));gold+=goldEarned;updateGold();
  const cd=CANAVAR_DEGER[activeMonsterType],mon=monById(activeMonsterType);
  mon.avail=false;mon.respawnAt=Date.now()+cd.dogmaSuresi;
  const r=expKazan(cd.exp,HARITA01_AYAR.sonSeviye);if(r.seviyeAtladi)updateGold();
  document.getElementById('battleMsg').textContent=goldEarned+' altın, '+r.kazanilan+' EXP kazandın!'+(dropped?' '+dropped.name+' düştü!':'')+(r.seviyeAtladi?' Seviye atladın! (Sv '+playerLevel+')':'');
  finishBattle('monster');
 }
}
function monsterStrike(){
 if(!battle||battleDone)return;
 const pf2=document.getElementById('playerFighter'),mf2=document.getElementById('monsterFighter');
 mf2.style.transform='translateX(-14px)';pf2.style.transform='translateX(-8px)';
 pf2.classList.remove('hit');void pf2.offsetWidth;pf2.classList.add('hit');playFx('fxClaw');
 const cd=CANAVAR_DEGER[activeMonsterType];
 const hitStats=battleMonsterStats||cd;const raw=hitStats.hasar[0]+Math.floor(Math.random()*hitStats.hasar[1]);
 if(Date.now()<(window.monsterStunnedUntil||0)){document.getElementById('battleMsg').textContent=cd.ad+' sersemledi ve saldıramadı!';return;}
 if(Math.random()*100<enchantBonus('stunChance')){window.monsterStunnedUntil=Date.now()+2000;}
 if(Math.random()*100<enchantBonus('blockChance')){document.getElementById('battleMsg').textContent='Saldırıyı blokladın!';return;}
 const reduced=Math.max(0,raw-heroDefense());const actualDamage=Math.max(0,Math.round(reduced*(1-enchantBonus('damageReduction')/100)));
 heroHP=Math.max(0,heroHP-actualDamage);
 document.getElementById('battleMsg').textContent=cd.ad+' '+actualDamage+' hasar verdi!';
 setTimeout(()=>{pf2.style.transform='';mf2.style.transform='';},220);updateBattleHud();
 if(heroHP<=0){document.getElementById('battleMsg').textContent='Kutsal Şövalye yenildi!';finishBattle('hero');}
}
const battleHit=heroStrike;
document.getElementById('attackBtn').addEventListener('click',battleHit);
document.getElementById('cancelBattleBtn').addEventListener('click',()=>{if(!battle)return;document.getElementById('battleMsg').textContent='Savaştan ayrıldın.';battleDone=true;closeBattle();});
