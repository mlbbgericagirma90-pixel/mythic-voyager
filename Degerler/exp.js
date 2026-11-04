// ======================================================================
// DEĞERLER / exp (deneyim ve seviye)
// Her harita 20 seviye: Harita1 = 1-20, Harita2 = 21-40 ...
// Seviye atlamak için gereken EXP her seviyede bir öncekinden %10 fazla.
//   Harita1: 1->2 = 274 EXP (19->20 = ~1520). Harita2: 20->21 = 367 EXP.
// Şimdilik 40. seviyeye kadar tanımlı (Harita1 ve Harita2). Sonrası eklenince EXP_HARITALAR'a satır eklenir.
// ======================================================================
let playerLevel=1, playerExp=0;
const EXP_HARITALAR=[{ilkSeviye:1,sonSeviye:20,ilkExp:274},{ilkSeviye:21,sonSeviye:40,ilkExp:367}];
const EXP_MAX_SEVIYE=40;
// Her seviye atlamada sabit artış: +20 maksimum can, +2 saldırı, +1 savunma.
// Ayrıca seviye başına %0,5 bonus kazanılır; her özellikte seviye bonusu en fazla %50 olur.
const LEVEL_ARTIS={can:20,saldiri:2,savunma:1};
function levelPercentBonus(){return Math.min(50,Math.max(0,playerLevel-1)*0.5);}
function expHaritaIndex(seviye){return seviye<=20?0:1;}
function expGerekli(seviye){ // seviye -> seviye+1 için gereken EXP
  if(seviye>=EXP_MAX_SEVIYE)return Infinity;
  const i=seviye<=19?0:1, h=EXP_HARITALAR[i];
  const ilkGecis=i===0?1:20;
  return Math.round(h.ilkExp*Math.pow(1.1,seviye-ilkGecis));
}
function levelBonus(tur){return Math.max(0,playerLevel-1)*(LEVEL_ARTIS[tur]||0);}
// Oyuncu seviyesi haritanın son seviyesinin üstündeyse EXP azalır: +1 -> %10, +5 -> %2, +10 -> 0.
function expCarpani(haritaSonSeviye){const f=playerLevel-haritaSonSeviye;if(f>=10)return 0;if(f>=5)return .02;if(f>0)return .10;return 1;}
// Dönen: {kazanilan, seviyeAtladi}
function expKazan(miktar,haritaSonSeviye=20){
  const k=Math.round(miktar*expCarpani(haritaSonSeviye));let atladi=false;
  if(playerLevel>=EXP_MAX_SEVIYE){updateExpUi();return{kazanilan:0,seviyeAtladi:false};}
  playerExp+=k;
  while(playerLevel<EXP_MAX_SEVIYE&&playerExp>=expGerekli(playerLevel)){playerExp-=expGerekli(playerLevel);playerLevel++;atladi=true;}
  if(playerLevel>=EXP_MAX_SEVIYE)playerExp=0;
  if(typeof updateExpUi==='function')updateExpUi();
  return{kazanilan:k,seviyeAtladi:atladi};
}
