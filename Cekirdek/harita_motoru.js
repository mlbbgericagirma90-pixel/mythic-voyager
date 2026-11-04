// ======================================================================
// CEKIRDEK / HARITA MOTORU
// Ortak harita kodu. Her harita kendi klasöründe defineMap(...) ile tanımlanır.
// Oyun her an tek bir aktif haritayla çalışır (activeMap).
// Parçalar oyuncu MAP_LOAD_DIST kadar yaklaşınca yüklenir, MAP_UNLOAD_DIST uzaklaşınca bırakılır.
// WORLD: görünüm ölçeği referansı. Harita boyutu DEĞİL.
// ======================================================================
const WORLD=1248;
const MAP_LOAD_DIST=300, MAP_UNLOAD_DIST=600;
const MAPS={};
let activeMap=null;

// Poligon (HARITA_ALAN[id]) kenarlarını 32 px'lik satır kutularına böler; ilk onRoad çağrısında kurulur.
function buildPoly(m){
  const raw=(typeof HARITA_ALAN!=='undefined')&&HARITA_ALAN[m.id];if(!raw)return null;
  const list=[];
  for(const r of raw){const n=r.length/2;for(let i=0;i<n;i++){const j=(i+1)%n;list.push(r[i*2],r[i*2+1],r[j*2],r[j*2+1]);}}
  const e=new Float32Array(list),bins=[];
  for(let k=0;k<e.length;k+=4){
    if(e[k+1]===e[k+3])continue;
    const a=Math.max(0,Math.floor(Math.min(e[k+1],e[k+3])/32)),b=Math.floor(Math.max(e[k+1],e[k+3])/32);
    for(let q=a;q<=b;q++)(bins[q]=bins[q]||[]).push(k/4);
  }
  return {e,bins};
}

function defineMap(id,cfg){
  const m={
    id, dir:cfg.dir, W:cfg.W, H:cfg.H, baslangic:cfg.baslangic||null, karakterBoy:cfg.karakterBoy||285,
    parts:cfg.parts.map(p=>({file:p.file,x:p.x,y:p.y,w:p.w,h:p.h,img:new Image(),requested:false}))
  };
  m.poly=null;
  m.onRoad=function(x,y){
    if(x<0||y<0||x>=m.W||y>=m.H)return false;
    if(!m.poly)m.poly=buildPoly(m);
    const pl=m.poly;if(!pl)return false;
    const bn=pl.bins[y>>5];if(!bn)return false;
    const e=pl.e;let c=0;
    for(let i=0;i<bn.length;i++){
      const k=bn[i]*4,x1=e[k],y1=e[k+1],x2=e[k+2],y2=e[k+3];
      if((y1>y)!==(y2>y)&&x<x1+(y-y1)*(x2-x1)/(y2-y1))c^=1;
    }
    return c===1;
  };
  m.update=function(px,py,ld=MAP_LOAD_DIST,ul=MAP_UNLOAD_DIST){
    for(const p of m.parts){
      const dx=Math.max(p.x-px,0,px-(p.x+p.w)), dy=Math.max(p.y-py,0,py-(p.y+p.h));
      const d=Math.hypot(dx,dy);
      if(!p.requested&&d<ld){p.requested=true;p.img.src=m.dir+p.file;}
      else if(p.requested&&d>ul){p.requested=false;p.img.removeAttribute('src');}
    }
  };
  m.draw=function(sx,sy,scale){
    for(const p of m.parts){
      if(p.img.complete&&p.img.naturalWidth)ctx.drawImage(p.img,sx+p.x*scale,sy+p.y*scale,p.w*scale,p.h*scale);
    }
  };
  m.unload=function(){
    for(const p of m.parts){p.requested=false;p.img.removeAttribute('src');}
  };

  MAPS[id]=m;
  if(!activeMap)activeMap=m;
  return m;
}

function setActiveMap(id){
  if(!MAPS[id])return;
  if(activeMap&&activeMap!==MAPS[id])activeMap.unload();
  activeMap=MAPS[id];
}

// Oyun dosyalarının kullandığı genel fonksiyonlar (aktif haritaya yönlenir).
function onRoad(x,y){return activeMap?activeMap.onRoad(x,y):false;}
function updateMapParts(px,py,ld,ul){if(activeMap)activeMap.update(px,py,ld,ul);}
function drawMapParts(sx,sy,scale){if(activeMap)activeMap.draw(sx,sy,scale);}
