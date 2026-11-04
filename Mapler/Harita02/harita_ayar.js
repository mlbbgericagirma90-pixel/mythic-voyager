// MAPLER / Harita02 — oyun ayarları (koordinatlar 5204x5204 birleşik harita, piksel; 4 px bindirme (2600 aralık))
// baslangic: M1 noktası (mavi daire). canavarlar: cx = yatay merkez, ayak = alt nokta, w = görünen genişlik.
const HARITA02_AYAR={
  baslangic:{x:4298,y:4169},
  canavarlar:[
    {id:'h2c1',dosya:'sentor.webp',cx:3455,ayak:3387,w:427},
    {id:'h2c2',dosya:'kara_griffin.webp',cx:1002,ayak:4081,w:552},
    {id:'h2c3',dosya:'col_kartali.webp',cx:752,ayak:2123,w:698},
    {id:'h2c4',dosya:'ent.webp',cx:622,ayak:857,w:531},
    {id:'h2c5',dosya:'golem.webp',cx:2104,ayak:2740,w:545},
    {id:'h2c6',dosya:'gizemli_canavar.webp',cx:4086,ayak:1926,w:572},
    {id:'h2c7',dosya:'van_golu_canavari.webp',cx:4474,ayak:733,w:446},
    {id:'h2c8',dosya:'kum_ejderhasi.webp',cx:2754,ayak:716,w:701}
  ]
};
if(typeof MAPS!=='undefined'&&MAPS['harita02'])MAPS['harita02'].baslangic=HARITA02_AYAR.baslangic;
