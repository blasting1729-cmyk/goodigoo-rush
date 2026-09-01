
const tg=window.Telegram?.WebApp;try{tg?.ready();tg?.expand();tg?.setHeaderColor?.('#02050a');tg?.setBackgroundColor?.('#02050a')}catch(e){}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const KEY='goodigoo_rush_v06';let S=JSON.parse(localStorage.getItem(KEY)||'{}');
Object.assign(S,{coins:S.coins??350,xp:S.xp??0,best:S.best??0,runs:S.runs??0,missions:S.missions??0,totalCoins:S.totalCoins??0,inv:S.inv??{shield:0,magnet:0,boost:0},dailyClaimed:S.dailyClaimed??false,streak:S.streak??1,sound:S.sound??true,haptics:S.haptics??true});
const NAME=tg?.initDataUnsafe?.user?.first_name||'GoodiGoo';
function lvlInfo(){let level=Math.floor(S.xp/250)+1,into=S.xp%250;return{level,into,need:250}}
function save(){localStorage.setItem(KEY,JSON.stringify(S));render()}
function toast(t){let e=$('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1400)}
function show(id){$$('.screen').forEach(x=>x.classList.remove('active'));$('#'+id)?.classList.add('active');$$('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.screen===id));if(id!=='home'&&id!=='game'&&id!=='result')buildPage(id);window.scrollTo(0,0)}
$$('[data-screen]').forEach(b=>b.onclick=()=>show(b.dataset.screen));
function render(){let L=lvlInfo();$('#wallet').textContent=S.coins;$('#topLevel').textContent='LVL '+L.level;$('#topXp').textContent=L.into;$('#topXpNeed').textContent=L.need;$('#topXpFill').style.width=(L.into/L.need*100)+'%';$('#best').textContent=S.best;$('#level').textContent=L.level;$('#runs').textContent=S.runs;$('#xpNowSmall').textContent=L.into;$('#xpNeedSmall').textContent=L.need}
function head(kicker,title){return `<div class="page-head"><button data-screen="home">←</button><div><small>${kicker}</small><h2>${title}</h2></div></div>`}
function buildPage(id){const el=$('#'+id);let L=lvlInfo();
 if(id==='profile')el.innerHTML=head('GOODIGOO ID','ПРОФИЛЬ')+`<div class="panel" style="padding:17px"><small>PLAYER</small><h2 style="margin:5px 0">${NAME}</h2><p style="color:#7b8995">Уровень ${L.level} · ${L.into}/250 XP</p></div><div class="card-grid" style="margin-top:9px"><div class="card"><small>BEST RUN</small><b>${S.best} м</b></div><div class="card"><small>RUNS</small><b>${S.runs}</b></div><div class="card"><small>GOODICOIN</small><b>${S.coins}</b></div><div class="card"><small>MISSIONS</small><b>${S.missions}</b></div></div>`;
 if(id==='rating'){let arr=[['SHADOW',Math.max(1105,S.best+420)],['NEO',Math.max(980,S.best+250)],['FASTBOY',Math.max(875,S.best+120)],[NAME,S.best]].sort((a,b)=>b[1]-a[1]);el.innerHTML=head('SEASON 01','РЕЙТИНГ')+`<div class="list">${arr.map((x,i)=>`<div class="row"><b>#${i+1} ${x[0]}</b><span>${x[1]} м</span></div>`).join('')}</div>`}
 if(id==='rewards')el.innerHTML=head('LOGIN STREAK','НАГРАДЫ')+`<div class="panel" style="padding:20px;text-align:center"><div style="font-size:42px">◆</div><h3>ЕЖЕДНЕВНЫЙ БОНУС</h3><p style="color:#74818d">Серия: ${S.streak} дн.</p><button id="dailyBtn" class="primary">${S.dailyClaimed?'УЖЕ ЗАБРАНО':'ЗАБРАТЬ 150 G'}</button></div>`;
 if(id==='shop')el.innerHTML=head('GOODIGOO MARKET','МАГАЗИН')+`<div class="panel" style="padding:14px;margin-bottom:8px">Баланс: <b>${S.coins} G</b></div><div class="list"><button data-buy="shield" data-price="120"><span><b>ЩИТ</b><small>одно столкновение</small></span><b>120 G</b></button><button data-buy="magnet" data-price="180"><span><b>МАГНИТ</b><small>притягивает монеты</small></span><b>180 G</b></button><button data-buy="boost" data-price="250"><span><b>РЫВОК</b><small>ускорение на старте</small></span><b>250 G</b></button></div>`;
 if(id==='achievements'){let a=[['Первые 100 м',S.best>=100],['Коллекционер',S.totalCoins>=25],['Без тормозов',S.best>=500]];el.innerHTML=head('GOODIGOO ID','ДОСТИЖЕНИЯ')+`<div class="list">${a.map((x,i)=>`<div class="row" style="opacity:${x[1]?1:.4}"><b>${i+1}. ${x[0]}</b><span>${x[1]?'✓':'🔒'}</span></div>`).join('')}</div>`}
 if(id==='inventory')el.innerHTML=head('YOUR LOADOUT','ИНВЕНТАРЬ')+`<div class="card-grid"><div class="card"><small>ЩИТ</small><b>${S.inv.shield}</b></div><div class="card"><small>МАГНИТ</small><b>${S.inv.magnet}</b></div><div class="card"><small>РЫВОК</small><b>${S.inv.boost}</b></div></div>`;
 if(id==='missions')el.innerHTML=head('DAILY TASKS','МИССИИ')+`<div class="list"><div class="row"><span><b>5 препятствий</b><small>за один забег</small></span><b>${S.missions?'✓':'0/1'}</b></div><div class="row"><span><b>100 метров</b><small>лучший забег</small></span><b>${S.best>=100?'✓':S.best+'/100'}</b></div><div class="row"><span><b>25 монет</b><small>за всё время</small></span><b>${S.totalCoins>=25?'✓':S.totalCoins+'/25'}</b></div></div>`;
 if(id==='settings')el.innerHTML=head('APP OPTIONS','НАСТРОЙКИ')+`<div class="list"><button id="soundToggle"><span><b>ЗВУК</b><small>игровые эффекты</small></span><span class="toggle ${S.sound?'on':''}"><i></i></span></button><button id="hapticToggle"><span><b>ВИБРАЦИЯ</b><small>отклик Telegram</small></span><span class="toggle ${S.haptics?'on':''}"><i></i></span></button><button id="resetBtn"><span><b>СБРОСИТЬ ДЕМО-ДАННЫЕ</b><small>только на этом устройстве</small></span><span>›</span></button></div>`;
 bindPage(id)
}
function bindPage(id){$$('#'+id+' [data-screen]').forEach(b=>b.onclick=()=>show(b.dataset.screen));
 $('#dailyBtn')&&($('#dailyBtn').onclick=()=>{if(S.dailyClaimed)return;S.coins+=150;S.dailyClaimed=true;S.streak++;save();buildPage('rewards');toast('+150 G')});
 $$('[data-buy]').forEach(b=>b.onclick=()=>{let p=+b.dataset.price;if(S.coins<p)return toast('Не хватает GoodiCoin');S.coins-=p;S.inv[b.dataset.buy]++;save();buildPage('shop');toast('Куплено')});
 $('#soundToggle')&&($('#soundToggle').onclick=()=>{S.sound=!S.sound;save();buildPage('settings')});
 $('#hapticToggle')&&($('#hapticToggle').onclick=()=>{S.haptics=!S.haptics;save();buildPage('settings')});
 $('#resetBtn')&&($('#resetBtn').onclick=()=>{localStorage.removeItem(KEY);location.reload()})
}

const C=$('#canvas'),ctx=C.getContext('2d');let DPR=1,W=0,H=0,G=null,RAF=0,last=0,downX=0,downY=0;
function resize(){let r=C.getBoundingClientRect();DPR=Math.min(devicePixelRatio||1,2);C.width=r.width*DPR;C.height=r.height*DPR;W=r.width;H=r.height;ctx.setTransform(DPR,0,0,DPR,0,0)}
addEventListener('resize',resize);
function start(){show('game');setTimeout(()=>{resize();G={running:true,paused:false,lane:1,targetLane:1,jump:0,jumpV:0,dist:0,coins:0,passed:0,speed:1,objs:[],spawn:0.3,coinSpawn:0.2,shield:S.inv.shield>0,magnet:S.inv.magnet>0,boost:S.inv.boost>0};if(G.shield)S.inv.shield--;if(G.magnet)S.inv.magnet--;if(G.boost)S.inv.boost--;save();last=performance.now();cancelAnimationFrame(RAF);RAF=requestAnimationFrame(loop)},80)}
$('#playBtn').onclick=start;$('#againBtn').onclick=start;$('#pauseBtn').onclick=()=>{if(G){G.paused=!G.paused;$('#pauseBtn').textContent=G.paused?'▶':'Ⅱ'}};
C.addEventListener('pointerdown',e=>{downX=e.clientX;downY=e.clientY});
C.addEventListener('pointerup',e=>{if(!G?.running||G.paused)return;let dx=e.clientX-downX,dy=e.clientY-downY;if(Math.abs(dx)>40){G.targetLane=Math.max(0,Math.min(2,G.targetLane+(dx>0?1:-1)));haptic('light')}else if(G.jump<=0){G.jumpV=11.5;haptic('light')}});
function haptic(t){if(!S.haptics)return;try{tg?.HapticFeedback?.impactOccurred(t)}catch(e){}}
function laneX(l,z=1){let center=W/2,spread=W*(0.12+0.26*z);return center+(l-1)*spread}
function spawn(kind){let lane=Math.floor(Math.random()*3);G.objs.push({kind,lane,z:0,y:0,hit:false})}
function update(dt){if(G.boost&&G.dist<80)G.speed=1.55;else G.speed=1+Math.min(G.dist/900,.65);G.dist+=dt*40*G.speed;G.lane+=(G.targetLane-G.lane)*Math.min(1,dt*10);if(G.jumpV||G.jump>0){G.jumpV-=28*dt;G.jump+=G.jumpV*dt;if(G.jump<0){G.jump=0;G.jumpV=0}}
 G.spawn-=dt;if(G.spawn<=0){spawn('barrier');G.spawn=.8+Math.random()*.65}
 G.coinSpawn-=dt;if(G.coinSpawn<=0){let n=3+Math.floor(Math.random()*3),lane=Math.floor(Math.random()*3);for(let i=0;i<n;i++)G.objs.push({kind:'coin',lane,z:-i*.12,hit:false});G.coinSpawn=.65+Math.random()*.7}
 for(let o of G.objs){o.z+=dt*.62*G.speed;if(o.kind==='barrier'&&o.z>.86&&!o.hit&&Math.abs(G.lane-o.lane)<.42&&G.jump<.85){o.hit=true;if(G.shield){G.shield=false;haptic('medium');toast('Щит спас!')}else return end()}if(o.kind==='coin'&&!o.hit&&o.z>.78){let close=Math.abs(G.lane-o.lane)<(G.magnet?.9:.35);if(close){o.hit=true;G.coins++;haptic('light')}}if(o.kind==='barrier'&&!o.scored&&o.z>1){o.scored=true;G.passed++}}
 G.objs=G.objs.filter(o=>o.z<1.15&&!o.hit);$('#meters').textContent=Math.floor(G.dist);$('#runCoins').textContent=G.coins;$('#mission').textContent=Math.min(G.passed,5)+'/5'
}
function loop(t){if(!G?.running)return;let dt=Math.min((t-last)/1000,.033);last=t;if(!G.paused)update(dt);draw();RAF=requestAnimationFrame(loop)}
function draw(){ctx.clearRect(0,0,W,H);
 // City backdrop
 let grad=ctx.createLinearGradient(0,0,0,H);grad.addColorStop(0,'#09183e');grad.addColorStop(.42,'#13245a');grad.addColorStop(.62,'#0a1632');grad.addColorStop(1,'#03060a');ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
 // neon skyline
 for(let i=0;i<12;i++){let bw=W/11+8,x=i*W/11-5,bh=90+(i%5)*35;ctx.fillStyle=i%2?'#0a1c3d':'#0d2448';ctx.fillRect(x,H*.35-bh,bw,bh);ctx.fillStyle=i%3===0?'#bd36ff':'#16d7ff';for(let wy=H*.35-bh+12;wy<H*.35-10;wy+=18)ctx.fillRect(x+7,wy,4,7)}
 // road perspective
 let horizon=H*.34;ctx.fillStyle='#05070c';ctx.beginPath();ctx.moveTo(W*.42,horizon);ctx.lineTo(W*.58,horizon);ctx.lineTo(W*.98,H);ctx.lineTo(W*.02,H);ctx.closePath();ctx.fill();
 // neon road edges
 ctx.strokeStyle='#12cfff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(W*.42,horizon);ctx.lineTo(W*.02,H);ctx.stroke();ctx.strokeStyle='#c238ff';ctx.beginPath();ctx.moveTo(W*.58,horizon);ctx.lineTo(W*.98,H);ctx.stroke();
 // lane lines
 ctx.strokeStyle='#64ff1c66';ctx.lineWidth=1.4;for(let l of [-.5,.5]){ctx.beginPath();ctx.moveTo(W/2+l*W*.055,horizon);ctx.lineTo(W/2+l*W*.31,H);ctx.stroke()}
 // motion stripes
 let off=(G.dist*5)%70;for(let y=horizon+30-off;y<H;y+=70){let t=(y-horizon)/(H-horizon);ctx.strokeStyle=`rgba(90,255,35,${.05+t*.12})`;ctx.beginPath();ctx.moveTo(W*.5-W*.34*t,y);ctx.lineTo(W*.5+W*.34*t,y);ctx.stroke()}
 // objects sorted far->near
 let objs=[...G.objs].sort((a,b)=>a.z-b.z);for(let o of objs){let z=Math.max(0,o.z),scale=.18+z*1.25,x=laneX(o.lane,z),y=horizon+(H-horizon)*(z*z);if(o.kind==='coin'){let r=7+z*12;ctx.shadowBlur=16;ctx.shadowColor='#ffc927';ctx.fillStyle='#ffc927';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#6d4c00';ctx.font=`900 ${8+z*8}px Arial`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('G',x,y)}else{let w=26+z*45,h=22+z*52;ctx.shadowBlur=16;ctx.shadowColor='#ff3d66';ctx.fillStyle='#151822';ctx.fillRect(x-w/2,y-h,w,h);ctx.shadowBlur=0;ctx.strokeStyle='#ff4266';ctx.lineWidth=2;ctx.strokeRect(x-w/2,y-h,w,h);ctx.beginPath();ctx.moveTo(x-w*.35,y-h*.8);ctx.lineTo(x+w*.35,y-h*.2);ctx.moveTo(x+w*.35,y-h*.8);ctx.lineTo(x-w*.35,y-h*.2);ctx.stroke()}}
 // runner, faux 3D
 let px=laneX(G.lane,1),py=H*.82-G.jump*55;ctx.save();ctx.translate(px,py);let bob=Math.sin(G.dist*.35)*3;
 ctx.shadowBlur=24;ctx.shadowColor='#6dff1b';ctx.fillStyle='#0a0d12';ctx.beginPath();ctx.arc(0,-42+bob,28,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#111923';ctx.beginPath();ctx.arc(0,-42+bob,22,0,Math.PI*2);ctx.fill();ctx.fillStyle='#010203';ctx.beginPath();ctx.ellipse(0,-40+bob,19,12,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#77ff1a';ctx.lineWidth=3;[[-10,-45,-4,-39],[-4,-45,-10,-39],[5,-45,11,-39],[11,-45,5,-39]].forEach(a=>{ctx.beginPath();ctx.moveTo(a[0],a[1]+bob);ctx.lineTo(a[2],a[3]+bob);ctx.stroke()});
 ctx.fillStyle='#0a0f14';ctx.beginPath();ctx.moveTo(-24,-18+bob);ctx.lineTo(24,-18+bob);ctx.lineTo(19,30+bob);ctx.lineTo(-19,30+bob);ctx.closePath();ctx.fill();ctx.fillStyle='#77ff1a';ctx.font='900 30px Arial';ctx.textAlign='center';ctx.fillText('G',0,16+bob);
 ctx.strokeStyle='#111923';ctx.lineWidth=11;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-10,27+bob);ctx.lineTo(-19,55+bob);ctx.moveTo(10,27+bob);ctx.lineTo(19,55+bob);ctx.moveTo(-18,-5+bob);ctx.lineTo(-32,18+bob);ctx.moveTo(18,-5+bob);ctx.lineTo(34,14+bob);ctx.stroke();ctx.strokeStyle='#65ff1c';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-19,55+bob);ctx.lineTo(-29,59+bob);ctx.moveTo(19,55+bob);ctx.lineTo(29,59+bob);ctx.stroke();
 if(G.shield){ctx.strokeStyle='#27d8ff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,48,0,Math.PI*2);ctx.stroke()}ctx.restore()
}
function end(){G.running=false;cancelAnimationFrame(RAF);let m=Math.floor(G.dist),mission=G.passed>=5,xp=Math.min(120,Math.max(15,Math.floor(m/7)+(mission?25:0)));if(m>S.best)S.best=m;S.runs++;S.totalCoins+=G.coins;if(mission)S.missions++;$('#resultTitle').textContent=m===S.best?'НОВЫЙ РЕКОРД!':'ЗАБЕГ ОКОНЧЕН';$('#resultMeters').textContent=m;$('#resultCoins').textContent=G.coins;$('#resultXp').textContent=xp;$('#missionResult').textContent=mission?'МИССИЯ ВЫПОЛНЕНА +25 XP':'МИССИЯ '+Math.min(G.passed,5)+'/5';let b=$('#claimBtn');b.disabled=false;b.dataset.m=m;b.dataset.c=G.coins;b.dataset.x=xp;save();show('result')}
$('#claimBtn').onclick=()=>{let b=$('#claimBtn');if(b.disabled)return;let c=Math.min(+b.dataset.c,75),x=Math.min(+b.dataset.x,120);S.coins+=c;S.xp+=x;save();b.disabled=true;b.textContent='НАГРАДА ПОЛУЧЕНА';try{tg?.sendData?.(JSON.stringify({type:'rush_result',meters:+b.dataset.m,coins:c,xp:x}))}catch(e){}toast('+'+c+' G  +'+x+' XP')};
render();
