// ======================================================================
// MAPLER / Harita01 — sadece bu haritanın ayarları.
// Ortak kod: Cekirdek/harita_motoru.js
// ======================================================================
defineMap('harita01', {
  dir:'Mapler/Harita01/',
  W:3382, H:3382,
  maskN:1649,
  parts:[
    {file:'sol_ust.webp', x:0,    y:0,    w:1691, h:1691},
    {file:'sag_ust.webp', x:1691, y:0,    w:1691, h:1691},
    {file:'sol_alt.webp', x:0,    y:1691, w:1691, h:1691},
    {file:'sag_alt.webp', x:1691, y:1691, w:1691, h:1691}
  ]
});
