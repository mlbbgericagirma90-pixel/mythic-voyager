// ======================================================================
// MENÜLER / ölüm ekranı
// "Öldün" yazısı ve 5 saniyelik bekleme.
// ======================================================================
let dead=false;
function showDeath(){dead=true;moveX=moveY=0;const o=document.getElementById('deathOverlay'),c=document.getElementById('deathCount');o.classList.add('show');let n=5;c.textContent=n;const iv=setInterval(()=>{n--;if(n<=0){clearInterval(iv);o.classList.remove('show');dead=false;heroHP=heroMaxHP();}else c.textContent=n;},1000);}
