
const tg=window.Telegram?.WebApp;try{tg?.ready();tg?.expand()}catch(e){}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const K='goodigoo_rush_v07';let S=JSON.parse(localStorage.getItem(K)||'{}');S.coins??=350;S.xp??=0;S.best??=0;S.runs??=0;S.missions??=0;S.totalCoins??=0;S.inv??={shield:0,magnet:0,boost:0};
const NAME=tg?.initDataUnsafe?.user?.first_name||'GoodiGoo';
function info(){return{level:Math.floor(S.xp/250)+1,x:S.xp%250}}
function save(){localStorage.setItem(K,JSON.stringify(S));render()}
function render(){let L=info();$('#lvl').textContent=L.level;$('#xp').textContent=L.x;$('#xpbar').style.width=(L.x/250*100)+'%';$('#coins').textContent=S.coins;$('#best').textContent=S.best;$('#runs').textContent=S.runs}
function toast(t){let e=$('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1300)}
function show(id){$$('.screen').forEach(e=>e.classList.remove('active'));$('#'+id).classList.add('active');if(!['home','game','result'].includes(id))build(id);scrollTo(0,0)}
$$('[data-screen]').forEach(b=>b.onclick=()=>show(b.dataset.screen));
function build(id){let e=$('#'+id),L=info(),head=`<div class="head"><button data-screen="home">←</button><h2>${id.toUpperCase()}</h2></div>`;
if(id==='profile')e.innerHTML=head+`<div class="panel"><small>PLAYER</small><h2>${NAME}</h2><p>LVL ${L.level} · ${L.x}/250 XP</p></div><div class="cards" style="margin-top:8px"><div class="card"><small>РЕКОРД</small><b>${S.best} м</b></div><div class="card"><small>ЗАБЕГОВ</small><b>${S.runs}</b></div><div class="card"><small>МОНЕТ</small><b>${S.coins}</b></div><div class="card"><small>МИССИЙ</small><b>${S.missions}</b></div></div>`;
if(id==='rating')e.innerHTML=head+`<div class="list">${[['SHADOW',1105],['NEO',980],[NAME,S.best]].sort((a,b)=>b[1]-a[1]).map((x,i)=>`<div class="row"><b>#${i+1} ${x[0]}</b><span>${x[1]} м</span></div>`).join('')}</div>`;
if(id==='shop')e.innerHTML=head+`<div class="list"><button data-buy="shield" data-p="120"><span><b>ЩИТ</b><small>1 столкновение</small></span><b>120 G</b></button><button data-buy="magnet" data-p="180"><span><b>МАГНИТ</b><small>притягивает монеты</small></span><b>180 G</b></button><button data-buy="boost" data-p="250"><span><b>РЫВОК</b><small>ускорение</small></span><b>250 G</b></button></div>`;
if(id==='inventory')e.innerHTML=head+`<div class="cards"><div class="card"><small>ЩИТ</small><b>${S.inv.shield}</b></div><div class="card"><small>МАГНИТ</small><b>${S.inv.magnet}</b></div><div class="card"><small>РЫВОК</small><b>${S.inv.boost}</b></div></div>`;
if(id==='achievements')e.innerHTML=head+`<div class="list"><div class="row"><b>Первые 100 м</b><span>${S.best>=100?'✓':'🔒'}</span></div><div class="row"><b>25 монет</b><span>${S.totalCoins>=25?'✓':'🔒'}</span></div><div class="row"><b>500 метров</b><span>${S.best>=500?'✓':'🔒'}</span></div></div>`;
if(id==='missions')e.innerHTML=head+`<div class="list"><div class="row"><span><b>5 препятствий</b><small>за один забег</small></span><span>${S.missions?'✓':'0/1'}</span></div><div class="row"><span><b>100 метров</b><small>лучший забег</small></span><span>${Math.min(S.best,100)}/100</span></div></div>`;
if(id==='settings')e.innerHTML=head+`<div class="list"><div class="row"><b>ЗВУК</b><span>ON</span></div><div class="row"><b>ВИБРАЦИЯ</b><span>ON</span></div><button id="reset">СБРОСИТЬ ДЕМО-ДАННЫЕ</button></div>`;
$$('#'+id+' [data-screen]').forEach(b=>b.onclick=()=>show(b.dataset.screen));$$('[data-buy]').forEach(b=>b.onclick=()=>{let p=+b.dataset.p;if(S.coins<p)return toast('Не хватает монет');S.coins-=p;S.inv[b.dataset.buy]++;save();build('shop');toast('Куплено')});$('#reset')&&($('#reset').onclick=()=>{localStorage.removeItem(K);location.reload()})
}
let G=null,raf=0,last=0;const runner=$('#runner'),coinField=$('#coinField'),obField=$('#obstacleField');
function start(){show('game');G={run:true,paused:false,lane:1,jump:false,dist:0,coins:0,passed:0,objs:[],spawn:.4,cspawn:.25};last=performance.now();raf=requestAnimationFrame(loop)}
$('#playBtn').onclick=start;$('#againBtn').onclick=start;$('#pauseBtn').onclick=()=>{if(G){G.paused=!G.paused;$('#pauseBtn').textContent=G.paused?'▶':'Ⅱ'}};
document.querySelector('.game-wrap').addEventListener('pointerdown',e=>{if(!G?.run)return;G.sx=e.clientX;G.sy=e.clientY});
document.querySelector('.game-wrap').addEventListener('pointerup',e=>{if(!G?.run||G.paused)return;let dx=e.clientX-G.sx;if(Math.abs(dx)>35){G.lane=Math.max(0,Math.min(2,G.lane+(dx>0?1:-1)));runner.style.left=[31,50,69][G.lane]+'%'}else if(!G.jump){G.jump=true;runner.style.bottom='17%';setTimeout(()=>{runner.style.bottom='9%';G.jump=false},330)}});
function loop(t){if(!G?.run)return;let dt=Math.min((t-last)/1000,.03);last=t;if(!G.paused)update(dt);raf=requestAnimationFrame(loop)}
function update(dt){G.dist+=dt*54;G.spawn-=dt;G.cspawn-=dt;if(G.spawn<=0){G.objs.push({k:'o',l:Math.floor(Math.random()*3),y:24});G.spawn=.8+Math.random()*.6}if(G.cspawn<=0){let l=Math.floor(Math.random()*3);for(let i=0;i<4;i++)G.objs.push({k:'c',l,y:21-i*6});G.cspawn=.7+Math.random()*.6}
G.objs.forEach(o=>o.y+=dt*56);for(let o of G.objs){if(o.y>80&&o.y<92&&o.l===G.lane){if(o.k==='c'&&!o.hit){o.hit=true;G.coins++}if(o.k==='o'&&!o.hit&&!G.jump){o.hit=true;return end()}}if(o.k==='o'&&!o.scored&&o.y>95){o.scored=true;G.passed++}}
G.objs=G.objs.filter(o=>o.y<108&&!o.hit);drawObjs();$('#meters').textContent=Math.floor(G.dist);$('#runCoins').textContent=G.coins;$('#mission').textContent=Math.min(G.passed,5)+'/5'}
function drawObjs(){coinField.innerHTML='';obField.innerHTML='';for(let o of G.objs){let e=document.createElement('div');e.className=o.k==='c'?'coin':'obs';e.style.left=[31,50,69][o.l]+'%';e.style.top=o.y+'%';if(o.k==='c')e.textContent='G';(o.k==='c'?coinField:obField).appendChild(e)}}
function end(){G.run=false;cancelAnimationFrame(raf);let m=Math.floor(G.dist),mission=G.passed>=5,xp=Math.max(15,Math.min(120,Math.floor(m/7)+(mission?25:0)));let record=m>S.best;if(record)S.best=m;S.runs++;S.totalCoins+=G.coins;if(mission)S.missions++;$('#resultTitle').textContent=record?'НОВЫЙ РЕКОРД!':'ЗАБЕГ ОКОНЧЕН';$('#resultMeters').textContent=m;$('#resultCoins').textContent=G.coins;$('#resultXp').textContent=xp;$('#missionResult').textContent=mission?'МИССИЯ ВЫПОЛНЕНА +25 XP':'МИССИЯ '+Math.min(G.passed,5)+'/5';let b=$('#claimBtn');b.disabled=false;b.dataset.c=G.coins;b.dataset.x=xp;save();show('result')}
$('#claimBtn').onclick=()=>{let b=$('#claimBtn');if(b.disabled)return;S.coins+=Math.min(+b.dataset.c,75);S.xp+=Math.min(+b.dataset.x,120);save();b.disabled=true;b.textContent='НАГРАДА ПОЛУЧЕНА';toast('Награда получена')};
render();
