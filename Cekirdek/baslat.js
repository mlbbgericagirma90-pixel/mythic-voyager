// ======================================================================
// ÇEKİRDEK / başlat
// EN SON yüklenen dosya: ilk çizimleri yapar, oyun döngüsünü başlatır. Önce hiçbir dosya buradan sonra yüklenmemeli.
// ======================================================================
updateGold();
renderMarket();
renderInventory();
// Prevent page scrolling or accidental zoom while using the game.
document.addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('touchmove',e=>{if(e.target&&e.target.closest&&e.target.closest('#marketPanel .modalCard'))return;e.preventDefault();},{passive:false});
requestAnimationFrame(draw);
