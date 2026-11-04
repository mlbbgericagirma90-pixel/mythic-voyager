// ======================================================================
// MENÜLER / panel kapatma
// data-close özellikli butonlar ilgili paneli kapatır (market, envanter...).
// ======================================================================
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.close).classList.remove('show')));

// ---- Geri tuşu: açık menüyü kapatır; menü yoksa "çıkmak istiyor musun" sorar.
// history'ye bir giriş eklenir; WebView geri tuşu popstate üretir. Yerel kapatma komutu yoksa Evet'ten sonra geri tuşuna bir kez daha basmak gerekir.
(function(){
 const q=id=>document.getElementById(id);let allowExit=false;
 function push(){try{history.pushState({yg:1},'');}catch(e){}}
 function closeTop(){
  const ex=q('exitConfirm');if(ex.classList.contains('show')){ex.classList.remove('show');return true;}
  for(const id of ['invPopup','equipPopup','equipStats']){const e=q(id);if(e&&e.classList.contains('show')){e.classList.remove('show');return true;}}
  const mo=q('mapOverlay');if(mo&&mo.classList.contains('show')){const c=q('mapClose');if(c)c.click();else mo.classList.remove('show');return true;}
  const sp=q('settingsPanel');if(sp&&sp.classList.contains('show')){sp.classList.remove('show');return true;}
  const ps=[...document.querySelectorAll('.modalPanel.show')];if(ps.length){const p=ps[ps.length-1];if(p.id==='inventoryPanel'&&typeof closeInventory==='function')closeInventory();else p.classList.remove('show');return true;}
  return false;
 }
 push();
 addEventListener('popstate',()=>{if(allowExit)return;push();if(closeTop())return;q('exitConfirm').classList.add('show');});
 q('exitNo').addEventListener('click',()=>q('exitConfirm').classList.remove('show'));
 q('exitYes').addEventListener('click',()=>{
  try{saveGame(false);}catch(e){}
  q('exitConfirm').classList.remove('show');allowExit=true;
  try{window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.App&&Capacitor.Plugins.App.exitApp();}catch(e){}
  try{navigator.app&&navigator.app.exitApp&&navigator.app.exitApp();}catch(e){}
  try{window.Android&&window.Android.exitApp&&window.Android.exitApp();}catch(e){}
  try{window.close();}catch(e){}
  try{history.back();}catch(e){}
  if(typeof showBottomNotice==='function')showBottomNotice('Çıkmak için geri tuşuna bir kez daha bas');
  setTimeout(()=>{allowExit=false;push();},4000);
 });
})();
