// ======================================================================
// DEĞERLER / canavarlar (Harita01)
// gerekenSeviye: canavara karşı önerilen minimum oyuncu seviyesi. hasar:[en_az, aralık] -> en_az + rastgele(0..aralık-1). Örn. [15,6] = 15 ile 20 arası.
// altin için aynı. hiz: canavarın saniyede kaç sn'de bir vurduğu. exp: öldürünce verdiği tecrübe.
// dogmaSuresi: öldükten kaç ms sonra tekrar doğar (boş bırakıldı, istediğin gibi değiştir).
// ======================================================================
const CANAVAR_DEGER={
c1:{ad:'Kırmızı Toprak Kertenkelesi',can:180,hasar:[15,6],gerekenSeviye:1,hiz:1.8,altin:[11,1],exp:73,dogmaSuresi:10000},
c2:{ad:'Orman Domuzu',can:257,hasar:[17,7],gerekenSeviye:4,hiz:1.5,altin:[13,1],exp:80,dogmaSuresi:12000},
c3:{ad:'Utangaç Papağan',can:366,hasar:[28,11],gerekenSeviye:7,hiz:2.2,altin:[15,1],exp:87,dogmaSuresi:15000},
c4:{ad:'Vahşi Goril',can:522,hasar:[27,10],gerekenSeviye:10,hiz:1.8,altin:[17,1],exp:95,dogmaSuresi:18000},
c5:{ad:'Ormanların Kralı',can:744,hasar:[25,10],gerekenSeviye:13,hiz:1.5,altin:[19,1],exp:102,dogmaSuresi:22000},
c6:{ad:'Öfkeli Ayı',can:1060,hasar:[34,13],gerekenSeviye:16,hiz:2.2,altin:[21,1],exp:109,dogmaSuresi:26000},
c7:{ad:'Kızıl Ejder',can:2120,hasar:[47,18],gerekenSeviye:HARITA01_AYAR.sonSeviye-1,hiz:2.2,altin:[128,1],exp:545,dogmaSuresi:60000},
// Harita02 (geçici: can 1, saldırı 1; diğer değerler sıfır/varsayılan)
h2c1:{ad:'Sentor',can:1,hasar:[1,1],gerekenSeviye:1,hiz:2,altin:[0,1],exp:0,dogmaSuresi:10000},
h2c2:{ad:'Kara Griffin',can:1,hasar:[1,1],gerekenSeviye:1,hiz:2,altin:[0,1],exp:0,dogmaSuresi:10000},
h2c3:{ad:'Çöl Kartalı',can:1,hasar:[1,1],gerekenSeviye:1,hiz:2,altin:[0,1],exp:0,dogmaSuresi:10000},
h2c4:{ad:'Ent',can:1,hasar:[1,1],gerekenSeviye:1,hiz:2,altin:[0,1],exp:0,dogmaSuresi:10000},
h2c5:{ad:'Golem',can:1,hasar:[1,1],gerekenSeviye:1,hiz:2,altin:[0,1],exp:0,dogmaSuresi:10000},
h2c6:{ad:'Gizemli Canavar',can:1,hasar:[1,1],gerekenSeviye:1,hiz:2,altin:[0,1],exp:0,dogmaSuresi:10000},
h2c7:{ad:'Van Gölü Canavarı',can:1,hasar:[1,1],gerekenSeviye:1,hiz:2,altin:[0,1],exp:0,dogmaSuresi:10000},
h2c8:{ad:'Kum Ejderhası',can:1,hasar:[1,1],gerekenSeviye:1,hiz:2,altin:[0,1],exp:0,dogmaSuresi:10000}
};
