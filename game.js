
const tg=window.Telegram?.WebApp;
try{tg?.ready();tg?.expand()}catch(e){}
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const K='goodigoo_rush_v120';
let S=JSON.parse(localStorage.getItem(K)||'{}');
Object.assign(S,{coins:S.coins??350,xp:S.xp??0,best:S.best??0,runs:S.runs??0,missions:S.missions??0,totalCoins:S.totalCoins??0,daily:S.daily??false});
S.inv??={shield:1,magnet:1,boost:1};
const NAME=tg?.initDataUnsafe?.user?.first_name||'GoodiGoo';
const level=()=>({level:Math.floor(S.xp/250)+1,x:S.xp%250});
function save(){localStorage.setItem(K,JSON.stringify(S));render()}
function render(){
  const L=level();
  $('#lvl').textContent=L.level; $('#xp').textContent=L.x; $('#xpfill').style.width=(L.x/2.5)+'%';
  $('#wallet').textContent=S.coins; $('#best').textContent=S.best; $('#level').textContent=L.level;
  $('#xp2').textContent=L.x; $('#runs').textContent=S.runs;
  $('#shieldN').textContent=S.inv.shield; $('#magnetN').textContent=S.inv.magnet; $('#boostN').textContent=S.inv.boost;
}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1200)}
function show(id){$$('.screen').forEach(x=>x.classList.remove('active'));$('#'+id).classList.add('active');if(!['home','game','result'].includes(id))build(id);scrollTo(0,0)}
$$('[data-screen]').forEach(b=>b.onclick=()=>show(b.dataset.screen));
function head(t){return `<div class="pageHead"><button data-screen="home">←</button><h2>${t}</h2></div>`}
function build(id){
  let e=$('#'+id),L=level();
  if(id==='profile')e.innerHTML=head('ПРОФИЛЬ')+`<div class="panel"><h2>${NAME}</h2><p>LVL ${L.level} · ${L.x}/250 XP</p></div><div class="cards" style="margin-top:8px"><div class="card"><small>РЕКОРД</small><b>${S.best} м</b></div><div class="card"><small>ЗАБЕГОВ</small><b>${S.runs}</b></div><div class="card"><small>GOODICOIN</small><b>${S.coins}</b></div><div class="card"><small>МИССИЙ</small><b>${S.missions}</b></div></div>`;
  if(id==='rating'){let a=[['SHADOW',1105],['NEO',980],['FASTBOY',875],[NAME,S.best]].sort((a,b)=>b[1]-a[1]);e.innerHTML=head('РЕЙТИНГ')+`<div class="list">${a.map((x,i)=>`<div class="row"><b>#${i+1} ${x[0]}</b><span>${x[1]} м</span></div>`).join('')}</div>`}
  if(id==='rewards')e.innerHTML=head('НАГРАДЫ')+`<div class="panel" style="text-align:center"><h2>ЕЖЕДНЕВНЫЙ БОНУС</h2><p>+150 GoodiCoin</p><button id="daily" class="primary">${S.daily?'УЖЕ ЗАБРАНО':'ЗАБРАТЬ'}</button></div>`;
  if(id==='shop')e.innerHTML=head('МАГАЗИН')+`<div class="list"><button data-buy="shield" data-p="120"><b>ЩИТ</b><b>120 G</b></button><button data-buy="magnet" data-p="180"><b>МАГНИТ</b><b>180 G</b></button><button data-buy="boost" data-p="250"><b>РЫВОК</b><b>250 G</b></button></div>`;
  if(id==='inventory')e.innerHTML=head('ИНВЕНТАРЬ')+`<div class="cards"><div class="card"><small>ЩИТ</small><b>${S.inv.shield}</b></div><div class="card"><small>МАГНИТ</small><b>${S.inv.magnet}</b></div><div class="card"><small>РЫВОК</small><b>${S.inv.boost}</b></div></div>`;
  if(id==='achievements')e.innerHTML=head('ДОСТИЖЕНИЯ')+`<div class="list"><div class="row"><b>Первые 100 м</b><span>${S.best>=100?'✓':'🔒'}</span></div><div class="row"><b>25 монет</b><span>${S.totalCoins>=25?'✓':'🔒'}</span></div><div class="row"><b>500 метров</b><span>${S.best>=500?'✓':'🔒'}</span></div></div>`;
  if(id==='missions')e.innerHTML=head('МИССИИ')+`<div class="list"><div class="row"><b>Обойди 5 препятствий</b><span>${S.missions?'✓':'0/1'}</span></div><div class="row"><b>Пробеги 100 метров</b><span>${Math.min(S.best,100)}/100</span></div></div>`;
  if(id==='settings')e.innerHTML=head('НАСТРОЙКИ')+`<div class="list"><div class="row"><b>ЗВУК</b><span>ON</span></div><div class="row"><b>ВИБРАЦИЯ</b><span>ON</span></div><button id="reset">СБРОСИТЬ ДЕМО-ДАННЫЕ</button></div>`;
  $$('#'+id+' [data-screen]').forEach(b=>b.onclick=()=>show(b.dataset.screen));
  $('#daily')&&($('#daily').onclick=()=>{if(S.daily)return;S.daily=true;S.coins+=150;save();build('rewards');toast('+150 G')});
  $$('[data-buy]').forEach(b=>b.onclick=()=>{let p=+b.dataset.p;if(S.coins<p)return toast('Не хватает монет');S.coins-=p;S.inv[b.dataset.buy]++;save();build('shop');toast('Куплено')});
  $('#reset')&&($('#reset').onclick=()=>{localStorage.removeItem(K);location.reload()});
}

let G=null,raf=0,last=0,sx=0;
const world=$('#world'),runner=$('#runner'),game=$('.game');
function laneX(l,z=1){ const spread=22 + 10*z; return 50+(l-1)*spread; }
function start(){
  show('game');
  G={run:true,paused:false,lane:1,jump:false,dist:0,coins:0,passed:0,objs:[],spawn:.55,cspawn:.22,speed:1,shield:false,magnet:false,boost:false,boostUntil:0};
  runner.style.left='50%'; runner.classList.remove('jump','shielded','boosting');
  world.innerHTML=''; last=performance.now(); raf=requestAnimationFrame(loop);
}
$('#play').onclick=start;
$('#pause').onclick=()=>{if(G){G.paused=!G.paused;$('#pause').textContent=G.paused?'▶':'Ⅱ'}};
game.addEventListener('pointerdown',e=>sx=e.clientX);
game.addEventListener('pointerup',e=>{
  if(!G?.run||G.paused)return;
  let dx=e.clientX-sx;
  if(Math.abs(dx)>34){
    G.lane=Math.max(0,Math.min(2,G.lane+(dx>0?1:-1)));
    runner.style.left=[23,50,77][G.lane]+'%';
  }else jump();
});
function jump(){if(G.jump)return;G.jump=true;runner.classList.add('jump');setTimeout(()=>{runner.classList.remove('jump');G.jump=false},560)}
$('#shield').onclick=()=>{if(S.inv.shield<1||!G?.run)return toast('Нет щита');S.inv.shield--;G.shield=true;runner.classList.add('shielded');save();toast('Щит активирован')};
$('#magnet').onclick=()=>{if(S.inv.magnet<1||!G?.run)return toast('Нет магнита');S.inv.magnet--;G.magnet=true;save();toast('Магнит активирован')};
$('#boost').onclick=()=>{if(S.inv.boost<1||!G?.run)return toast('Нет рывка');S.inv.boost--;G.boost=true;G.boostUntil=performance.now()+4000;runner.classList.add('boosting');save();toast('Рывок: 4 сек')};

function spawn(k,l=null,z=0){G.objs.push({k,l:l??Math.floor(Math.random()*3),z,hit:false,scored:false})}
function loop(t){if(!G?.run)return;let dt=Math.min((t-last)/1000,.032);last=t;if(!G.paused)update(dt,t);raf=requestAnimationFrame(loop)}
function update(dt,t){
  if(G.boost && t>G.boostUntil){G.boost=false;runner.classList.remove('boosting')}
  G.speed=1+Math.min(G.dist/1700,.72)+(G.boost?.48:0);
  G.dist+=dt*64*G.speed; G.spawn-=dt; G.cspawn-=dt;
  game.style.setProperty('--motion',String(G.speed));
  if(G.spawn<=0){
    const r=Math.random(), lane=Math.floor(Math.random()*3);
    spawn(r<.13?'drone':r<.52?'car':'barrier',lane,0);
    G.spawn=.88+Math.random()*.52;
  }
  if(G.cspawn<=0){
    const l=Math.floor(Math.random()*3);
    for(let i=0;i<5;i++)spawn('coin',l,-i*.085);
    G.cspawn=.8+Math.random()*.72;
  }
  for(const o of G.objs){
    o.z+=dt*.62*G.speed;
    if(o.k==='coin'&&G.magnet&&o.z>.57)o.l=G.lane;
    const near=o.z>.78&&o.z<1.04&&o.l===G.lane;
    if(near){
      if(o.k==='coin'&&!o.hit){o.hit=true;G.coins++}
      else if(o.k!=='coin'&&!o.hit&&!G.jump&&!G.boost){
        o.hit=true;
        if(G.shield){G.shield=false;runner.classList.remove('shielded');toast('Щит спас!')}
        else return end();
      }
    }
    if(o.k!=='coin'&&!o.scored&&o.z>1.03){o.scored=true;G.passed++}
  }
  G.objs=G.objs.filter(o=>o.z<1.18&&!o.hit);
  draw();
  $('#meters').textContent=Math.floor(G.dist); $('#runCoins').textContent=G.coins; $('#mission').textContent=Math.min(G.passed,5)+'/5';
}
function draw(){
  world.innerHTML='';
  for(const o of G.objs){
    const z=Math.max(0,o.z), e=document.createElement('div');
    e.className='entity '+o.k;
    const y=29 + Math.pow(z,1.42)*70;
    const sc=.18 + Math.pow(z,1.28)*1.18;
    e.style.left=laneX(o.l,z)+'%'; e.style.top=y+'%';
    e.style.transform=`translate(-50%,-50%) scale(${sc})`;
    e.style.opacity=Math.min(1,.28+z*1.35);
    e.style.zIndex=5+Math.floor(z*20);
    if(o.k==='coin')e.textContent='G';
    if(o.k==='car')e.innerHTML='<i></i><b></b>';
    if(o.k==='drone')e.innerHTML='<i></i>';
    world.appendChild(e);
  }
}
function end(){
  G.run=false;cancelAnimationFrame(raf);
  const m=Math.floor(G.dist),mission=G.passed>=5,xp=Math.min(120,Math.max(15,Math.floor(m/8)+(mission?25:0))),record=m>S.best;
  if(record)S.best=m;S.runs++;S.totalCoins+=G.coins;if(mission)S.missions++;
  const e=$('#result');
  e.innerHTML=`<div class="pageHead"><button data-screen="home">←</button><h2>РЕЗУЛЬТАТ</h2></div><div class="panel" style="text-align:center"><h2>${record?'НОВЫЙ РЕКОРД!':'ЗАБЕГ ОКОНЧЕН'}</h2><div style="font-size:56px;font-weight:900">${m}</div><small>МЕТРОВ</small><div class="cards" style="margin:16px 0"><div class="card"><small>GOODICOIN</small><b>${G.coins}</b></div><div class="card"><small>XP</small><b>+${xp}</b></div></div><p>${mission?'МИССИЯ ВЫПОЛНЕНА +25 XP':'МИССИЯ '+Math.min(G.passed,5)+'/5'}</p><button id="claim" class="primary">ЗАБРАТЬ НАГРАДУ</button><button id="again" class="secondary">ЕЩЁ РАЗ</button></div>`;
  $$('#result [data-screen]').forEach(b=>b.onclick=()=>show(b.dataset.screen));$('#again').onclick=start;
  $('#claim').onclick=()=>{S.coins+=Math.min(G.coins,75);S.xp+=xp;save();$('#claim').disabled=true;$('#claim').textContent='НАГРАДА ПОЛУЧЕНА';toast('Награда получена')};
  save();show('result');
}
render();
