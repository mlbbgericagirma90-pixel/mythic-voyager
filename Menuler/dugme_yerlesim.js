// Arayüz düzeltmesi: buton yerleşimi artık Ikonlar/ikonlar.js içinde. Burada sadece açılış perdesi güvenlik zamanlayıcısı kalır.
(function(){
  // Önceki sürümde bir çalışma zamanı hatası olsa bile siyah açılış perdesinde kalmasın.
  setTimeout(function(){const intro=document.getElementById('intro');if(intro){intro.classList.add('hide');setTimeout(()=>intro.remove(),850);}},15000);
})();
