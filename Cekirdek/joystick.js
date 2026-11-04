// ======================================================================
// ÇEKİRDEK / joystick
// Analog joystick (dokunma ve fare) ve konum sıfırlama butonu.
// ======================================================================
const joy=document.getElementById('joy'),knob=document.getElementById('knob');
let activeId=null;
function joystick(e){const r=joy.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=e.clientX-cx,dy=e.clientY-cy;const max=Math.max(10,(r.width/2-knob.offsetWidth/2)*.97),len=Math.hypot(dx,dy);if(len>max){dx=dx/len*max;dy=dy/len*max;}knob.style.left=`calc(50% + ${dx}px)`;knob.style.top=`calc(50% + ${dy}px)`;moveX=dx/max;moveY=dy/max;}
joy.addEventListener('pointerdown',e=>{activeId=e.pointerId;joy.setPointerCapture(e.pointerId);joystick(e)});
joy.addEventListener('pointermove',e=>{if(e.pointerId===activeId)joystick(e)});
function release(e){if(activeId===e.pointerId){activeId=null;moveX=moveY=0;knob.style.left='50%';knob.style.top='50%';}}
joy.addEventListener('pointerup',release);
joy.addEventListener('pointercancel',release);
joy.addEventListener('lostpointercapture',()=>{activeId=null;moveX=moveY=0;knob.style.left='50%';knob.style.top='50%'});
document.getElementById('reset').addEventListener('click',()=>{const b=activeMap&&activeMap.id==='harita02'?HARITA02_AYAR.baslangic:HARITA01_AYAR.baslangic;px=b.x;py=b.y;moveX=moveY=0;knob.style.left='50%';knob.style.top='50%'});
