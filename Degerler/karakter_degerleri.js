// ======================================================================
// DEĞERLER / karakter (Kutsal Şövalye)
// Başlangıç: can 270, saldırı 17, savunma 6, saldırı aralığı 1,2 sn.
// strLevel/hpLevel/defLevel = oyuncunun market/ayarlardan aldığı geliştirme seviyeleri (kayıt dosyasında saklanır).
// Seviye artışları Degerler/exp.js içinde (LEVEL_ARTIS).
// ======================================================================
const KARAKTER_DEGER={temelCan:270,canArtisi:20,temelSaldiri:17,temelSavunma:6,saldiriAraligi:1200,savunmaCarpani:3,gelistirmeFiyati:30,baslangicAltin:100};
let strLevel=0, hpLevel=0, defLevel=0;
let acilanHaritalar=['harita01']; // oyuncunun geçtiği haritalar (Ikonlar/ikonlar.js doldurur, kayıtta tutulur)
let playerName=''; // oyuncu adı (3-10 harf/rakam); seçimi Ikonlar/ikonlar.js, kayıt Yedekleme/kayit.js
const heroMaxHP=()=>Math.round((KARAKTER_DEGER.temelCan+hpLevel*KARAKTER_DEGER.canArtisi+levelBonus('can')+equipmentStats().hp)*(1+levelPercentBonus()/100)*(1+enchantBonus('maxHpPct')/100)); const heroAttack=()=>Math.round((KARAKTER_DEGER.temelSaldiri+strLevel+levelBonus('saldiri')+equippedEquipmentBonus())*(1+levelPercentBonus()/100)*(1+enchantBonus('attackPct')/100)); const heroDefense=()=>Math.round((KARAKTER_DEGER.temelSavunma+defLevel*KARAKTER_DEGER.savunmaCarpani+levelBonus('savunma')+equippedEquipmentDefense())*(1+levelPercentBonus()/100)*(1+enchantBonus('defensePct')/100));
