// ======================================================================
// SAVAŞ / değişkenler
// Savaş sırasındaki durum: can, hasar, tur sayacı, otomatik saldırı zamanlayıcısı.
// ======================================================================
let battle=false, heroHP=100, monsterHP=100, monsterMaxHP=100, monsterDamage=10, monsterReward=10, activeMonsterType='green', battleTimer=0, battleTurn=0, battleDone=false, returnToMapHP=100;
let rewardTimer=null;
let autoBattleInterval=null;
let proximityArmed=true;
const battleEl=document.getElementById('battle');
