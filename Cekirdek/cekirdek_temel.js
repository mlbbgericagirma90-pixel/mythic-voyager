// ======================================================================
// ÇEKİRDEK / temel
// canvas, ortak durum değişkenleri (px,py,moveX...), ekran boyutu (resize), kamera zoom.
// Her yerden kullanılır; değişken eklerken dikkatli ol.
// ======================================================================
const canvas=document.getElementById('game'),ctx=canvas.getContext('2d');
let W=0,H=0,dpr=1,px=715,py=828,angle=0,moveX=0,moveY=0,last=0,walk=0;
// Camera zoom is chosen for a close third-person view: only a section of the island is visible.
let zoom=5;
function resize(){dpr=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0);}
addEventListener('resize',resize);
resize();
