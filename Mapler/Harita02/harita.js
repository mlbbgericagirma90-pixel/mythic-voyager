// MAPLER / Harita02 — dört parça, her kenarda 4 px bindirme.
// Yürüme alanı harita_alan.js poligonundadır.
defineMap('harita02', {
  dir:'Mapler/Harita02/',
  W:5204, H:5204,
  maskN:3274,
  karakterBoy:285,
  baslangic:{x:2450,y:3650},
  parts:[
    {file:'sol_ust.webp',x:0,y:0,w:2604,h:2604},
    {file:'sag_ust.webp',x:2600,y:0,w:2604,h:2604},
    {file:'sol_alt.webp',x:0,y:2600,w:2604,h:2604},
    {file:'sag_alt.webp',x:2600,y:2600,w:2604,h:2604}
  ]
});
