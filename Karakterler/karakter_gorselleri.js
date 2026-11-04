// ======================================================================
// KARAKTERLER / görseller
// Envanter portresi (CHAR_SRC), savaş portresi (BATTLE_SRC) ve harita üzerindeki yedek karakter resmi (hero).
// ======================================================================
const CHAR_SRC='Karakterler/Resimler/envanter_portre.webp';
const BATTLE_SRC='Karakterler/Resimler/savas_portre.webp';
const hero=new Image();hero.decoding='async';hero.src=CHAR_SRC;hero.onerror=()=>{console.error('Karakter resmi yüklenemedi');};

// Ekipman penceresi orta görseli (1024x1820 pencere pikseli). Karakter seçim ekranı gelince secilenKarakter oradan atanacak.
let secilenKarakter='kutsal_sovalye';
const KARAKTER_EKIPMAN={
 kutsal_sovalye:{src:'Karakterler/Kutsal_Sovalye/ekipman_gorsel.webp',left:212,top:283,w:598},
 ragnar:{src:'Karakterler/Ragnar/ekipman_gorsel.webp',left:170,top:437,w:684},
 orman_perisi:{src:'Karakterler/Orman_Perisi/ekipman_gorsel.webp',left:137,top:434,w:690},
 kizil_tanrica:{src:'Karakterler/Kizil_Tanrica/ekipman_gorsel.webp',left:62,top:573,w:900,blend:true}
};
