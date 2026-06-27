/* ---------- иконки ---------- */
const ICONS = {
  droplet:'<path d="M10 2C7 6 5 9.5 5 12.5A5 5 0 0010 17.5 5 5 0 0015 12.5C15 9.5 13 6 10 2z"/>',
  sparkle:'<path d="M10 2v4M10 14v4M2 10h4M14 10h4M4.6 4.6l2.6 2.6M12.8 12.8l2.6 2.6M4.6 15.4l2.6-2.6M12.8 7.2l2.6-2.6"/>',
  leaf:'<path d="M4 16c6-1 10-5 11-11-6 1-10 5-11 11z"/><path d="M5 15c2-3 5-6 9-9"/>',
  sun:'<circle cx="10" cy="10" r="3.2"/><path d="M10 2v2.4M10 15.6V18M2 10h2.4M15.6 10H18M4.6 4.6l1.7 1.7M13.7 13.7l1.7 1.7M4.6 15.4l1.7-1.7M13.7 6.3l1.7-1.7"/>',
  tooth:'<g transform="translate(1.5,0.75)"><path d="M10 3.2c-1.9 0-3.3.9-4.1.9-1 0-1.9.8-1.9 2.4 0 2.6.8 5.6 1.6 7.3.4.9.8 1.5 1.4 1.5.9 0 1-2.3 1.5-2.3s.6 2.3 1.5 2.3c.6 0 1-.6 1.4-1.5.8-1.7 1.6-4.7 1.6-7.3 0-1.6-.9-2.4-1.9-2.4-.8 0-2.2-.9-4.1-.9z"/></g>',
  moon:'<path d="M15.91 11.44A6 6 0 119.11 4.04 4.8 4.8 0 0015.91 11.44z"/>',
  dot:'<circle cx="10" cy="10" r="3.4"/>',
  eye:'<path d="M2.2 10s3.1-5 7.8-5 7.8 5 7.8 5-3.1 5-7.8 5-7.8-5-7.8-5z"/><circle cx="10" cy="10" r="2.1"/>',
  clay:'<path d="M4 8c0-2.2 2.7-4 6-4s6 1.8 6 4-2.7 6-6 8c-3.3-2-6-5.8-6-8z"/>',
  patch:'<rect x="4" y="4" width="12" height="12" rx="4"/>',
  mask:'<path d="M3 9c0-3.5 3.1-6 7-6s7 2.5 7 6-3.1 7-7 7-7-3.5-7-7z"/><path d="M7 9h.01M13 9h.01"/>',
  jet:'<path d="M6 3c1.6 2 1.6 4 0 6M10 2c1.6 2.6 1.6 5.4 0 8M14 3c1.6 2 1.6 4 0 6"/><path d="M4 15h12M5.5 17.5h9"/>',
  toner:'<path d="M3 8c1.7-2 3.3-2 5 0s3.3 2 5 0 3.3-2 5 0"/><path d="M3 12.5c1.7-2 3.3-2 5 0s3.3 2 5 0 3.3-2 5 0"/>',
  jar:'<rect x="6" y="8" width="8" height="8" rx="2"/><rect x="7" y="5.5" width="6" height="2.5" rx="1"/>',
  stones:'<ellipse cx="10" cy="13.25" rx="6" ry="2"/><ellipse cx="10" cy="9.55" rx="4.6" ry="1.8"/><ellipse cx="10" cy="6.25" rx="3.2" ry="1.5"/>',
  play:'<path d="M6.5 4.5v11l9-5.5z" fill="currentColor" stroke="none"/>',
  check:'<path d="M3 9l4 4 9-9"/>',
  brow:'<path d="M3 13c1.6-4.6 5-7 7-7s5.4 2.4 7 7"/>'
};
function icon(name, extra=''){
  return `<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" ${extra}>${ICONS[name]||''}</svg>`;
}

/* ---------- расписание недели ---------- */
const DAY_LABELS = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
const DAY_FULL = ['понедельник','вторник','среда','четверг','пятница','суббота','воскресенье'];
const MONTHS = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const RETINOL_DAYS = [0,2,4,6]; // Пн Ср Пт Вс
const PEELING_DAY = 3; // Чт

/* ---------- настройка «ретинол каждый день» ----------
   Правило применяется только начиная с даты включения настройки —
   так прошлая история и проценты не пересчитываются и не обнуляются. */
const RETINOL_DAILY_KEY = 'ritual_retinol_daily';
const RETINOL_DAILY_SINCE_KEY = 'ritual_retinol_daily_since';
function getRetinolDaily(){
  try{ return localStorage.getItem(RETINOL_DAILY_KEY) === '1'; }catch(e){ return false; }
}
function getRetinolDailySince(){
  try{ return localStorage.getItem(RETINOL_DAILY_SINCE_KEY) || null; }catch(e){ return null; }
}
function setRetinolDaily(on){
  try{
    if(on){
      localStorage.setItem(RETINOL_DAILY_KEY, '1');
      if(!localStorage.getItem(RETINOL_DAILY_SINCE_KEY)){
        localStorage.setItem(RETINOL_DAILY_SINCE_KEY, ymd(today));
      }
    } else {
      localStorage.setItem(RETINOL_DAILY_KEY, '0');
    }
  }catch(e){}
}
function isRetinolApplicable(dayIndex, date){
  if(dayIndex === PEELING_DAY) return false;
  if(RETINOL_DAYS.includes(dayIndex)) return true;
  if(getRetinolDaily()){
    const since = getRetinolDailySince();
    if(since && date && ymd(date) >= since) return true;
  }
  return false;
}

function jsDayToIndex(jsDay){ return jsDay===0?6:jsDay-1; }

function morningItems(){
  return [
    {id:'cleanse-am', icon:'droplet', label:'Пенка для умывания', sub:'', type:'check'},
    {id:'toner-am', icon:'toner', label:'Тоник', sub:'Cos De BAHA, ниацинамид', type:'check'},
    {id:'peptide', icon:'sparkle', label:'Пептидная сыворотка', sub:'Cos De BAHA, можно и под глаза', type:'check'},
    {id:'massage', icon:'stones', label:'Лимфодренажный массаж', sub:'5–7 минут, с кремом для скольжения', type:'timer', duration:300},
    {id:'cream-am', icon:'jar', label:'Крем', sub:'', type:'check'},
    {id:'spf', icon:'sun', label:'SPF', sub:'SPF 50 — обязательно', type:'check'},
    {id:'teeth-am', icon:'tooth', label:'Чистка зубов', sub:'Зубы и язык, 2 минуты', type:'timer', duration:120, mouth:true},
  ];
}

function eveningItems(dayIndex, date){
  const isPeeling = dayIndex===PEELING_DAY;
  const isRetinol = isRetinolApplicable(dayIndex, date);
  const dailyOn = getRetinolDaily();
  const items = [];
  if(isPeeling){
    items.push({id:'peeling', icon:'clay', label:'Пилинг / глина', sub:'10 минут, вместо умывания — сегодня без ретинола', type:'check'});
    items.push({id:'brows', icon:'brow', label:'Коррекция бровей', sub:'', type:'check', optional:true});
  } else {
    items.push({id:'cleanse-pm', icon:'droplet', label:'Пенка для умывания', sub:'', type:'check'});
  }
  items.push({id:'toner-pm', icon:'toner', label:'Тоник', sub:'Cos De BAHA, ниацинамид', type:'check'});
  if(isRetinol){
    items.push({id:'retinol', icon:'moon', label:'Ретинол', sub: dailyOn ? 'The Ordinary 0.2%, ежедневно' : 'The Ordinary 0.2% (через день)', type:'check'});
  }
  items.push({id:'cream-pm', icon:'jar', label:'Крем', sub: isRetinol ? 'Обязательно после ретинола' : '', type:'check'});
  items.push({id:'spot', icon:'dot', label:'Точечно: цинк / салициловая', sub:'на воспаления, если есть', type:'check', optional:true});
  items.push({id:'eye-pm', icon:'eye', label:'Уход под глазами', sub:'Eveline-роллер', type:'check'});
  items.push({id:'teeth-pm', icon:'tooth', label:'Чистка зубов', sub:'Зубы и язык, 2 минуты', type:'timer', duration:120, mouth:true});
  items.push({id:'irrigator', icon:'jet', label:'Ирригатор', sub:'после чистки зубов', type:'check', mouth:true});
  return {items, isPeeling, isRetinol};
}

/* ---------- состояние и хранилище ---------- */
const today = new Date();
const todayIndex = jsDayToIndex(today.getDay());
let selectedIndex = todayIndex;

let morningOpen, eveningOpen;
(function setDefaultOpenBlock(){
  const h = today.getHours();
  if(h >= 18 || h < 3){
    eveningOpen = true;
    morningOpen = false;
  } else {
    morningOpen = true;
    eveningOpen = false;
  }
})();

/* ---------- тема: «авто» (тёмная вечером/ночью), либо зафиксированная вручную ---------- */
const THEME_KEY = 'ritual_theme_mode';
function getThemeMode(){
  try{
    const m = localStorage.getItem(THEME_KEY);
    return (m==='light' || m==='dark') ? m : 'auto';
  }catch(e){ return 'auto'; }
}
function setThemeMode(mode){
  try{ localStorage.setItem(THEME_KEY, mode); }catch(e){}
}
function isNightHour(h){ return h>=18 || h<3; }
function resolveNight(){
  const mode = getThemeMode();
  if(mode==='dark') return true;
  if(mode==='light') return false;
  return isNightHour(new Date().getHours());
}
function applyNightTheme(){
  const isNight = resolveNight();
  document.documentElement.classList.toggle('theme-night', isNight);
  const meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.setAttribute('content', isNight ? '#1B1820' : '#2E2A33');
}
applyNightTheme();
// «авто» нужно пересчитывать со временем; в ручных режимах тема просто остаётся фиксированной
setInterval(applyNightTheme, 60000);

function pad(n){ return n<10 ? '0'+n : ''+n; }
function ymd(d){ return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
function dateKey(d){ return `ritual_${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }

function loadState(key){
  try{
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  }catch(e){ return {}; }
}
function saveState(key, state){
  try{ localStorage.setItem(key, JSON.stringify(state)); }catch(e){}
}

let state = loadState(dateKey(today));

/* ---------- таймеры ---------- */
const RUNNING = {}; // id -> intervalId

function startTimer(id, duration){
  const s = state[id] || {};
  s.status = 'running';
  s.startTs = Date.now() - ((duration - (s.remaining ?? duration)) * 1000);
  s.duration = duration;
  state[id] = s;
  saveState(dateKey(today), state);
  renderMain();
}
function pauseTimer(id){
  const s = state[id];
  if(!s || s.status!=='running') return;
  const elapsed = (Date.now() - s.startTs)/1000;
  s.remaining = Math.max(0, s.duration - elapsed);
  s.status = 'paused';
  delete s.startTs;
  saveState(dateKey(today), state);
  renderMain();
}
function finishTimer(id){
  const s = state[id] || {};
  s.status = 'done';
  s.remaining = 0;
  delete s.startTs;
  state[id] = s;
  saveState(dateKey(today), state);
}

function tick(){
  let needsRender = false;
  const showingToday = selectedIndex === todayIndex;
  Object.keys(state).forEach(id=>{
    const s = state[id];
    if(s && s.status==='running'){
      const elapsed = (Date.now() - s.startTs)/1000;
      const remaining = s.duration - elapsed;
      if(remaining <= 0){
        finishTimer(id);
        needsRender = true;
      } else if(showingToday){
        const pct = Math.max(0, Math.min(100, (1 - remaining/s.duration)*100));
        const fillEl = document.querySelector(`[data-timer-row="${id}"] .fill`);
        const timeEl = document.querySelector(`[data-timer-time="${id}"]`);
        if(fillEl) fillEl.style.width = pct + '%';
        if(timeEl) timeEl.textContent = fmtTime(remaining);
      }
    }
  });
  if(needsRender) renderMain();
}
setInterval(tick, 250);

/* ---------- рендер ---------- */
function fmtTime(sec){
  sec = Math.max(0, Math.ceil(sec));
  const m = Math.floor(sec/60);
  const s = sec%60;
  return `${m}:${pad(s)}`;
}

function checkSvg(){ return `<svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${ICONS.check}</svg>`; }

function renderCheckItem(item, interactive, viewState){
  const vs = viewState || state;
  const done = !!(vs[item.id] && vs[item.id].done);
  return `
    <div class="item ${item.optional?'is-optional':''} ${done?'is-done':''} ${item.mouth?'item-mouth':'item-face'}">
      <div class="icn">${icon(item.icon)}</div>
      <div class="txt">
        <div class="lbl">${item.label}</div>
        ${item.sub ? `<div class="sub">${item.sub}</div>` : ''}
      </div>
      <button class="chk ${done?'checked':''} ${interactive?'':'disabled'}" data-check="${item.id}" aria-label="${item.label}">${checkSvg()}</button>
    </div>`;
}

function renderTimerItem(item, interactive, viewState){
  const vs = viewState || state;
  const raw = vs[item.id] || {};
  const status = interactive ? (raw.status || 'idle') : (raw.status==='done' ? 'done' : 'idle');
  const duration = item.duration;
  const remaining = (interactive && status==='running')
    ? Math.max(0, duration - (Date.now()-raw.startTs)/1000)
    : (status==='done' ? 0 : (interactive ? (raw.remaining ?? duration) : duration));
  const pct = status==='idle' ? 0 : status==='done' ? 100 : Math.max(0, Math.min(100, (1 - remaining/duration)*100));
  const rightHtml = status==='done'
    ? `<span class="chk checked" aria-hidden="true">${checkSvg()}</span>`
    : `<span class="timer-time ${status==='running'?'is-running':''} ${interactive?'':'disabled'}" data-timer-time="${item.id}">${fmtTime(status==='running'?remaining:duration)}</span>`;
  return `
    <div class="item ${status==='done'?'is-done':''} ${item.mouth?'item-mouth':'item-face'}" data-timer-row="${item.id}" data-duration="${duration}" ${status!=='done' ? 'role="button" tabindex="0"' : ''} aria-label="${item.label}">
      ${status!=='done' ? `<div class="fill" style="width:${pct}%"></div>` : ''}
      <div class="icn">${icon(item.icon)}</div>
      <div class="txt">
        <div class="lbl">${item.label}</div>
        ${item.sub ? `<div class="sub">${item.sub}</div>` : ''}
      </div>
      ${rightHtml}
    </div>`;
}

function computeProgress(items){
  const required = items.filter(i=>!i.optional);
  const done = required.filter(i=>{
    if(i.type==='check') return !!(state[i.id] && state[i.id].done);
    if(i.type==='timer') return state[i.id] && state[i.id].status==='done';
    return false;
  });
  return {done: done.length, total: required.length};
}

/* ---------- история выполнения ритуала (точки) ---------- */
function getDayStatus(date){
  const dayIdx = jsDayToIndex(date.getDay());
  const morning = morningItems();
  const {items: evening} = eveningItems(dayIdx, date);
  const required = morning.concat(evening).filter(i=>!i.optional);
  if(required.length===0) return 'none';
  const dstate = loadState(dateKey(date));
  const doneCount = required.filter(i=>{
    if(i.type==='check') return !!(dstate[i.id] && dstate[i.id].done);
    if(i.type==='timer') return dstate[i.id] && dstate[i.id].status==='done';
    return false;
  }).length;
  if(doneCount===0) return 'none';
  if(doneCount===required.length) return 'full';
  return 'partial';
}

function renderHistoryDots(n){
  let html = '';
  for(let i=n-1; i>=0; i--){
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate()-i);
    const status = getDayStatus(d);
    const isToday = i===0;
    html += `<span class="hdot ${status==='full'?'on':''} ${status==='partial'?'partial':''} ${isToday?'is-today':''}"></span>`;
  }
  return html;
}

/* ---------- чек-ин: вес / диета / таблетки ----------
   Вопросы в тесте — про вчерашний день, поэтому ответы (диета/таблетки)
   сохраняются в запись ВЧЕРАШНЕГО дня (checkinKey(yesterday)), а не сегодняшнего.
   promptKey — отдельная отметка, что тест за сегодня пройден (+ текущий вес). */
function checkinKey(d){ return `ritual_checkin_${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
function promptKey(d){ return `ritual_prompt_${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate()-1);

let prompt = loadState(promptKey(today));
let yesterdayCheckin = loadState(checkinKey(yesterday));

function renderColorDots(n, field){
  let html = '';
  for(let i=n-1; i>=0; i--){
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate()-i);
    const c = loadState(checkinKey(d));
    const val = c[field];
    const cls = val==='yes' ? 'on' : val==='partial' ? 'partial' : val==='no' ? 'bad' : '';
    const isToday = i===0;
    html += `<span class="hdot ${cls} ${isToday?'is-today':''}"></span>`;
  }
  return html;
}

function renderWeight(){
  let w = '';
  try{ w = localStorage.getItem('ritual_latest_weight') || ''; }catch(e){}
  document.getElementById('weightValue').textContent = w ? w : '—';
}

/* ---------- шкала веса: старт -> цель (редактируется в настройках) ---------- */
const WEIGHT_GOALS_KEY = 'ritual_weight_goals';
function getWeightGoals(){
  try{
    const raw = localStorage.getItem(WEIGHT_GOALS_KEY);
    if(raw){
      const g = JSON.parse(raw);
      if(typeof g.start === 'number' && typeof g.goal === 'number') return g;
    }
  }catch(e){}
  return {start: 65, goal: 55};
}
function setWeightGoals(start, goal){
  try{ localStorage.setItem(WEIGHT_GOALS_KEY, JSON.stringify({start, goal})); }catch(e){}
}

function renderWeightProgress(){
  const {start: WEIGHT_START, goal: WEIGHT_GOAL} = getWeightGoals();
  let w = WEIGHT_START;
  try{
    const lw = localStorage.getItem('ritual_latest_weight');
    if(lw) w = parseFloat(lw);
  }catch(e){}

  const total = WEIGHT_START - WEIGHT_GOAL; // сколько всего нужно сбросить
  const done = WEIGHT_START - w;            // сколько уже сброшено
  const pct = total > 0 ? Math.max(0, Math.min(100, done/total*100)) : 0;
  document.getElementById('wpFill').style.width = pct + '%';
  document.getElementById('wpStart').textContent = WEIGHT_START + ' кг';
  document.getElementById('wpGoal').textContent = WEIGHT_GOAL + ' кг';

  const statusEl = document.getElementById('wpStatus');
  const remaining = w - WEIGHT_GOAL;
  if(remaining <= 0){
    statusEl.textContent = 'цель достигнута 🎉';
  } else {
    statusEl.textContent = `осталось ${remaining.toFixed(1)} кг`;
  }
}

/* ---------- серия идеальных дней: уход + питание + лекарства подряд ---------- */
function isPerfectDay(date){
  if(getDayStatus(date) !== 'full') return false;
  const c = loadState(checkinKey(date));
  return c.diet === 'yes' && c.pills === 'yes';
}

// "Заморозка": если в день было хоть какое-то усердие (не нулевой день), он не
// рвёт серию — просто пропускается и не учитывается в счёте. Так подарок за 7
// дней можно получить только за 7 НАСТОЯЩИХ идеальных дней, а не за 6 идеальных
// + 1 прощённый.
function hasAnyEffort(date){
  if(getDayStatus(date) !== 'none') return true;
  const c = loadState(checkinKey(date));
  return c.diet === 'yes' || c.diet === 'partial' || c.pills === 'yes' || c.pills === 'partial';
}

function computeStreak(){
  let streak = 0;
  let cursor = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
  let guard = 0;
  while(guard < 400){
    if(isPerfectDay(cursor)){
      streak++;
    } else if(!hasAnyEffort(cursor)){
      break; // совсем пустой день — серия рвётся
    }
    // иначе: день прощён (что-то было сделано) — пропускаем, не прерывая и не считая
    cursor.setDate(cursor.getDate()-1);
    guard++;
  }
  return streak;
}

const CHEER_MESSAGES = [
  {title:'Идеальная неделя! 🎉', msg:'Семь дней подряд ты заботилась о себе — и довела это до конца. Это по-настоящему ценно. Горжусь тобой!'},
  {title:'Целая неделя! 🌿', msg:'Ты не пропустила ни дня. Это не просто галочки — это ты выбираешь себя каждый день. Невероятно круто.'},
  {title:'Ура, семь из семи! ✨', msg:'Маленькие шаги каждый день сложились в целую неделю заботы о себе. Ты это сделала — и заслуживаешь отдохнуть и похвалить себя.'},
  {title:'Так держать! 🐾', msg:'Неделя без единого срыва — это дисциплина и любовь к себе одновременно. Ты справилась, и это правда достижение.'},
  {title:'Семь дней — твои! 💛', msg:'Ты сдержала обещание себе семь раз подряд. Будь к себе так же добра, как была дисциплинированна — ты это заслужила.'},
  {title:'Неделя выполнена! 🌸', msg:'Уход, питание, лекарства — всё вместе, семь дней подряд. Это та забота о себе, которая со временем меняет всё. Молодец!'}
];
const cheerPick = CHEER_MESSAGES[Math.floor(Math.random()*CHEER_MESSAGES.length)];

const GIFT_IDEAS = [
  'сертификат на массаж',
  'новая книга, которую давно хотела',
  'десерт в любимой кофейне',
  'вечер без дел — плед, чай и сериал',
  'новый лак для ногтей',
  'букет цветов просто так',
  'поход в кино одной, без чувства вины',
  'свеча с любимым ароматом',
  'хорошая маска для лица или волос',
  'ужин в кафе без подсчёта калорий'
];
const giftPick = GIFT_IDEAS[Math.floor(Math.random()*GIFT_IDEAS.length)];

function starIcon(cls){
  return `<svg class="wg-star ${cls}" viewBox="0 0 24 24" width="16" height="16"><path d="M12 2L14.9 8.6L22 9.3L16.5 14.1L18.2 21L12 17.3L5.8 21L7.5 14.1L2 9.3L9.1 8.6Z"/></svg>`;
}
function renderWeekGoal(){
  const streak = computeStreak();
  const slots = 7;
  const filled = Math.min(streak, slots);
  const todayLooksGood = getDayStatus(today) === 'full';
  let html = '';
  for(let i=0; i<slots; i++){
    if(i < filled){
      html += starIcon('on');
    } else if(i === filled && streak < slots){
      // это "сегодня" — пока не решено, идеальный ли день; обводка + цвет по ходу дня
      html += starIcon(`current ${todayLooksGood?'on':'pending'}`);
    } else {
      html += starIcon('');
    }
  }
  document.getElementById('weekGoalDots').innerHTML = html;
  document.getElementById('weekGoalCount').textContent = `${filled}/7`;
  document.getElementById('cheerTitle').textContent = cheerPick.title;
  document.getElementById('cheerMsg').textContent = cheerPick.msg;
  document.getElementById('cheerGift').textContent = `🎁 Дарю тебе: ${giftPick}!`;

  // Поздравление показываем за каждую завершённую неделю (7, 14, 21…), но только
  // пока его не закрыли кнопкой «Ок». Закрытие НЕ обнуляет серию — просто прячет
  // сообщение до следующего недельного рубежа.
  const milestone = Math.floor(streak / 7);
  const seen = getCheerSeen();
  document.getElementById('weekGoalCheer').classList.toggle('show', milestone >= 1 && milestone > seen);
}
const CHEER_SEEN_KEY = 'ritual_cheer_seen';
function getCheerSeen(){
  try{ return parseInt(localStorage.getItem(CHEER_SEEN_KEY) || '0', 10) || 0; }catch(e){ return 0; }
}
document.getElementById('cheerOk').addEventListener('click', ()=>{
  try{ localStorage.setItem(CHEER_SEEN_KEY, String(Math.floor(computeStreak() / 7))); }catch(e){}
  document.getElementById('weekGoalCheer').classList.remove('show');
});

function renderStreak(){
  document.getElementById('historyDots').innerHTML = renderHistoryDots(14);
  document.getElementById('dietDots').innerHTML = renderColorDots(14, 'diet');
  document.getElementById('pillDots').innerHTML = renderColorDots(14, 'pills');
  renderWeight();
  renderWeightProgress();
  renderWeekGoal();
  renderWeightChart();
}

function renderRing(items){
  const {done, total} = computeProgress(items);
  const pct = total ? Math.round(done/total*100) : 0;
  const circ = 2*Math.PI*23;
  document.getElementById('ringFg').setAttribute('stroke-dasharray', circ);
  document.getElementById('ringFg').setAttribute('stroke-dashoffset', circ - (circ*pct/100));
  document.getElementById('ringPct').textContent = pct+'%';
}

function getMondayOfWeek(d){
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  copy.setDate(copy.getDate() - jsDayToIndex(copy.getDay()));
  return copy;
}

function renderDayTabs(){
  const wrap = document.getElementById('dayTabs');
  const monday = getMondayOfWeek(today);
  wrap.innerHTML = DAY_LABELS.map((lbl, idx)=>{
    const isToday = idx===todayIndex;
    const isSel = idx===selectedIndex;
    const dDate = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate()+idx);
    const isPeel = idx===PEELING_DAY;
    const isRet = isRetinolApplicable(idx, dDate);
    return `<button class="day-btn ${isToday?'is-today':''} ${isSel?'is-selected':''} ${isRet?'has-retinol':''} ${isPeel?'has-peeling':''}" data-day="${idx}">
      <span>${lbl}</span><span class="ddate">${dDate.getDate()}</span>
    </button>`;
  }).join('');
  wrap.querySelectorAll('.day-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      selectedIndex = parseInt(btn.dataset.day,10);
      renderAll();
    });
  });
}

function renderMain(){
  const interactive = selectedIndex === todayIndex;
  const monday = getMondayOfWeek(today);
  const selectedDate = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate()+selectedIndex);
  const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isPast = !interactive && selectedDate.getTime() < todayMid.getTime();
  const viewState = interactive ? state : (isPast ? loadState(dateKey(selectedDate)) : {});

  const morning = morningItems();
  const {items: evening, isPeeling, isRetinol} = eveningItems(selectedIndex, selectedDate);

  const banner = document.getElementById('previewBanner');
  if(interactive){
    banner.style.display = 'none';
  } else if(isPast){
    banner.style.display = 'block';
    banner.textContent = 'Вот что было отмечено в этот день — только просмотр, менять нельзя.';
  } else {
    banner.style.display = 'block';
    banner.textContent = 'Это план на день — отмечать пункты можно только для сегодняшней даты.';
  }

  const main = document.getElementById('main');
  // прогресс и значки "всё сделано" всегда про сегодня, а не про просматриваемую вкладку
  const todayEvening = eveningItems(todayIndex, today).items;
  const morningProg = computeProgress(morning);
  const eveningProg = computeProgress(todayEvening);
  const morningAllDone = morningProg.total > 0 && morningProg.done === morningProg.total;
  const eveningAllDone = eveningProg.total > 0 && eveningProg.done === eveningProg.total;
  const doneBadge = `<span class="done-badge" title="Всё сделано">${icon('check')}</span>`;
  main.innerHTML = `
    <section class="block">
      <button type="button" class="block-head am ${morningOpen?'is-open':''}" id="toggleMorning" aria-expanded="${morningOpen}">
        <div class="icon">${icon('sun')}</div>
        <h2>Утро</h2>
        <span class="head-right">
          ${(interactive && morningAllDone) ? doneBadge : ''}
          <svg class="chev" width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7l5 6 5-6"/></svg>
        </span>
      </button>
      <div class="card-list ${morningOpen?'':'is-collapsed'}">
        ${morning.map(it=> it.type==='timer' ? renderTimerItem(it, interactive, viewState) : renderCheckItem(it, interactive, viewState)).join('')}
      </div>
    </section>
    <section class="block">
      <button type="button" class="block-head pm ${eveningOpen?'is-open':''}" id="toggleEvening" aria-expanded="${eveningOpen}">
        <div class="icon">${icon('moon')}</div>
        <h2>Вечер</h2>
        <span class="head-right">
          <span class="note">${isPeeling? 'день пилинга' : (isRetinol? 'день ретинола' : 'без ретинола')}</span>
          ${(interactive && eveningAllDone) ? doneBadge : ''}
          <svg class="chev" width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7l5 6 5-6"/></svg>
        </span>
      </button>
      <div class="card-list ${eveningOpen?'':'is-collapsed'}">
        ${evening.map(it=> it.type==='timer' ? renderTimerItem(it, interactive, viewState) : renderCheckItem(it, interactive, viewState)).join('')}
      </div>
    </section>
  `;

  document.getElementById('toggleMorning').addEventListener('click', ()=>{
    morningOpen = !morningOpen;
    renderMain();
  });
  document.getElementById('toggleEvening').addEventListener('click', ()=>{
    eveningOpen = !eveningOpen;
    renderMain();
  });

  // навешиваем обработчики только если интерактивно
  if(interactive){
    main.querySelectorAll('[data-check]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.dataset.check;
        const s = state[id] || {};
        s.done = !s.done;
        state[id] = s;
        saveState(dateKey(today), state);
        renderMain();
      });
    });
    main.querySelectorAll('[data-timer-row]').forEach(row=>{
      const id = row.dataset.timerRow;
      const duration = parseInt(row.dataset.duration,10);
      const activate = ()=>{
        const s = state[id] || {};
        const status = s.status || 'idle';
        if(status==='idle' || status==='paused'){
          startTimer(id, duration);
        } else if(status==='running'){
          pauseTimer(id);
        }
      };
      row.addEventListener('click', activate);
      row.addEventListener('keydown', (e)=>{
        if(e.key==='Enter' || e.key===' '){ e.preventDefault(); activate(); }
      });
    });
  }

  renderRing(morning.concat(todayEvening));
  renderStreak();
}

function renderDateLabel(){
  document.getElementById('dateLabel').textContent =
    `${today.getDate()} ${MONTHS[today.getMonth()]}`;
}

function renderAll(){
  renderDayTabs();
  renderMain();
}

renderDateLabel();
renderAll();

/* ---------- модалка чек-ина (вес / диета / таблетки) ---------- */
function setActiveOption(groupId, val){
  document.querySelectorAll('#'+groupId+' .opt-btn').forEach(b=>{
    b.classList.toggle('is-active', b.dataset.val===val);
  });
}
document.querySelectorAll('.checkin-options').forEach(group=>{
  group.querySelectorAll('.opt-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      group.querySelectorAll('.opt-btn').forEach(b=>b.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });
});

function closeCheckin(){
  document.getElementById('checkinOverlay').classList.add('hidden');
}

let weightStepperValue = 65;
function getDefaultWeight(){
  if(typeof prompt.weight === 'number') return prompt.weight;
  try{
    const lw = localStorage.getItem('ritual_latest_weight');
    if(lw) return parseFloat(lw);
  }catch(e){}
  return getWeightGoals().start;
}
function renderWeightStepper(){
  document.getElementById('weightDisplay').textContent = weightStepperValue.toFixed(1);
}
document.getElementById('weightMinus').addEventListener('click', ()=>{
  weightStepperValue = Math.max(30, Math.round((weightStepperValue - 0.1)*10)/10);
  renderWeightStepper();
});
document.getElementById('weightPlus').addEventListener('click', ()=>{
  weightStepperValue = Math.min(200, Math.round((weightStepperValue + 0.1)*10)/10);
  renderWeightStepper();
});

function openCheckinIfNeeded(){
  if(prompt.done) return;
  weightStepperValue = getDefaultWeight();
  renderWeightStepper();
  setActiveOption('dietOptions', yesterdayCheckin.diet);
  setActiveOption('pillsOptions', yesterdayCheckin.pills);
  document.getElementById('checkinOverlay').classList.remove('hidden');
}

// Закрытие (крестиком) и "Сохранить" работают одинаково: сохраняют введённые
// данные, но тест считается пройденным только если отвечено на оба вопроса
// (диета и таблетки) — иначе он появится снова при следующем открытии.
// Вопросы — про вчерашний день, поэтому ответы пишутся в запись вчерашнего дня,
// а не сегодняшнего (точки за сегодня закрасятся только завтра).
function trySaveCheckin(){
  prompt.weight = weightStepperValue;
  try{ localStorage.setItem('ritual_latest_weight', String(weightStepperValue)); }catch(e){}

  const dietBtn = document.querySelector('#dietOptions .opt-btn.is-active');
  if(dietBtn) yesterdayCheckin.diet = dietBtn.dataset.val;
  const pillsBtn = document.querySelector('#pillsOptions .opt-btn.is-active');
  if(pillsBtn) yesterdayCheckin.pills = pillsBtn.dataset.val;
  saveState(checkinKey(yesterday), yesterdayCheckin);

  prompt.done = !!(yesterdayCheckin.diet && yesterdayCheckin.pills);
  saveState(promptKey(today), prompt);

  closeCheckin();
  renderStreak();
}

document.getElementById('checkinClose').addEventListener('click', closeCheckin);
document.getElementById('checkinSave').addEventListener('click', trySaveCheckin);

/* ---------- график веса (сворачиваемый) ---------- */
function getWeightHistory(){
  const out = [];
  try{
    for(let i=0; i<localStorage.length; i++){
      const key = localStorage.key(i);
      if(key && key.startsWith('ritual_prompt_')){
        const rec = loadState(key);
        if(typeof rec.weight === 'number'){
          const parts = key.slice('ritual_prompt_'.length).split('-').map(Number);
          const d = new Date(parts[0], parts[1]-1, parts[2]);
          out.push({date: d, weight: rec.weight});
        }
      }
    }
  }catch(e){}
  out.sort((a,b)=>a.date-b.date);
  return out;
}

/* ---------- общий помощник: "настоящий" линейный график — сетка, подложка,
   ось значений, подписи дат, скролл вбок при большом количестве точек ---------- */
function buildLineChartSVG(values, dates, color, opts={}){
  const H = opts.H || 132;
  const visibleCount = opts.visibleCount || 14;
  const n = values.length;
  const padLeft = 30, padRight = 14, padTop = 20, padBottom = 20;
  const containerWidth = opts.containerWidth || 320;
  const visiblePlotW = Math.max(60, containerWidth - padLeft - padRight);
  const denom = Math.max(1, Math.min(n-1, visibleCount-1));
  const pxPerSeg = visiblePlotW/denom;
  const plotW = pxPerSeg*Math.max(1,(n-1));
  const totalW = plotW + padLeft + padRight;
  const plotH = H - padTop - padBottom;

  let rangeVals = values.slice();
  if(typeof opts.goalValue === 'number') rangeVals.push(opts.goalValue);
  let min = Math.min(...rangeVals), max = Math.max(...rangeVals);
  if(min === max){ min -= 1; max += 1; }
  const pad = (max-min)*0.18;
  min -= pad; max += pad;

  const xAt = i => padLeft + i*pxPerSeg;
  const yAt = v => (H-padBottom) - ((v-min)/(max-min))*plotH;

  let svg = '';
  // подложка плота
  svg += `<rect x="${padLeft}" y="${padTop-6}" width="${plotW}" height="${plotH+6}" rx="8" fill="var(--surface)"/>`;

  // горизонтальные линии сетки + подписи оси значений
  const gridRows = 3;
  for(let g=0; g<=gridRows; g++){
    const v = min + (max-min)*g/gridRows;
    const y = yAt(v);
    svg += `<line x1="${padLeft}" y1="${y.toFixed(1)}" x2="${(padLeft+plotW).toFixed(1)}" y2="${y.toFixed(1)}" stroke="var(--line)" stroke-width="1"/>`;
    svg += `<text x="${padLeft-5}" y="${(y+2.8).toFixed(1)}" text-anchor="end" font-size="7.5" font-family="'JetBrains Mono',monospace" fill="var(--muted)">${v.toFixed(0)}</text>`;
  }
  // вертикальные линии сетки + подписи дат
  values.forEach((v,i)=>{
    const x = xAt(i);
    svg += `<line x1="${x.toFixed(1)}" y1="${padTop-6}" x2="${x.toFixed(1)}" y2="${(padTop+plotH).toFixed(1)}" stroke="var(--line)" stroke-width="1"/>`;
    if(dates && dates[i]){
      svg += `<text x="${x.toFixed(1)}" y="${H-6}" text-anchor="middle" font-size="7" fill="var(--muted)">${dates[i].getDate()}</text>`;
    }
  });

  if(typeof opts.goalValue === 'number'){
    const gy = yAt(opts.goalValue).toFixed(1);
    svg += `<line x1="${padLeft}" y1="${gy}" x2="${(padLeft+plotW).toFixed(1)}" y2="${gy}" stroke="${opts.goalColor||'var(--sage)'}" stroke-width="1.3" stroke-dasharray="3,3"/>`;
  }

  // область под линией
  const areaPts = `${xAt(0).toFixed(1)},${(padTop+plotH).toFixed(1)} ` +
    values.map((v,i)=>`${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`).join(' ') +
    ` ${xAt(n-1).toFixed(1)},${(padTop+plotH).toFixed(1)}`;
  svg += `<polygon points="${areaPts}" fill="${color}" opacity="0.10"/>`;

  // сама линия + точки + подписи значений
  const lineStr = values.map((v,i)=>`${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`).join(' ');
  svg += `<polyline points="${lineStr}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`;
  values.forEach((v,i)=>{
    const x = xAt(i), y = yAt(v);
    svg += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" fill="var(--surface)" stroke="${color}" stroke-width="1.6"/>`;
    const anchor = i===0 ? 'start' : (i===n-1 ? 'end' : 'middle');
    const lx = i===0 ? x-3 : (i===n-1 ? x+3 : x);
    svg += `<text x="${lx.toFixed(1)}" y="${(y-7.5).toFixed(1)}" text-anchor="${anchor}" font-size="8.5" font-weight="700" font-family="'JetBrains Mono',monospace" fill="${color}">${v}</text>`;
  });

  const scrollId = opts.scrollId || ('cs'+Math.random().toString(36).slice(2));
  return `<div class="chart-scroll" id="${scrollId}"><svg width="${totalW.toFixed(1)}" height="${H}" viewBox="0 0 ${totalW.toFixed(1)} ${H}">${svg}</svg></div>`;
}
function scrollChartsToEnd(container){
  container.querySelectorAll('.chart-scroll').forEach(el=>{ el.scrollLeft = el.scrollWidth; });
}

function renderWeightChart(){
  const wrap = document.getElementById('chartWrap');
  const hist = getWeightHistory();
  if(hist.length < 2){
    wrap.innerHTML = `<div class="chart-empty">Пока маловато данных для графика — заполняй вес в тесте каждый день, и здесь появится линия.</div>`;
    return;
  }
  const {goal} = getWeightGoals();
  const values = hist.map(h=>h.weight);
  const dates = hist.map(h=>h.date);
  const containerWidth = wrap.clientWidth || 320;
  const svg = buildLineChartSVG(values, dates, 'var(--am-text)', {H:132, goalValue: goal, goalColor:'var(--sage)', containerWidth, scrollId:'wpChartScroll'});

  wrap.innerHTML = svg;
  scrollChartsToEnd(wrap);
}

const weightToggleBtn = document.getElementById('weightToggleBtn');
const chartBodyEl = document.getElementById('chartBody');
weightToggleBtn.addEventListener('click', ()=>{
  const isOpen = chartBodyEl.classList.toggle('is-open');
  weightToggleBtn.classList.toggle('is-open', isOpen);
  weightToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

/* ---------- удалить все данные ---------- */
let deleteAllArmed = false;
let deleteAllTimer = null;
const deleteAllBtn = document.getElementById('deleteAllBtn');
const deleteAllMsg = document.getElementById('deleteAllMsg');
const deleteAllLabelDefault = deleteAllBtn.textContent;
deleteAllBtn.addEventListener('click', ()=>{
  if(!deleteAllArmed){
    deleteAllArmed = true;
    deleteAllBtn.textContent = 'Точно удалить? Нажмите ещё раз';
    deleteAllBtn.classList.add('is-armed');
    deleteAllMsg.textContent = '';
    deleteAllMsg.className = 'backup-msg';
    deleteAllTimer = setTimeout(()=>{
      deleteAllArmed = false;
      deleteAllBtn.textContent = deleteAllLabelDefault;
      deleteAllBtn.classList.remove('is-armed');
    }, 4000);
    return;
  }
  clearTimeout(deleteAllTimer);
  try{
    const keys = [];
    for(let i=0; i<localStorage.length; i++){
      const k = localStorage.key(i);
      if(k && k.startsWith('ritual_')) keys.push(k);
    }
    keys.forEach(k=> localStorage.removeItem(k));
  }catch(e){}
  deleteAllMsg.textContent = 'Все данные удалены. Перезагружаю…';
  deleteAllMsg.className = 'backup-msg ok';
  setTimeout(()=> location.reload(), 500);
});


/* ---------- если данных совсем мало, подкладываем немного примеров, чтобы график не был пустым ---------- */
(function ensureSomeChartData(){
  try{
    if(getWeightHistory().length < 2){
      const demo = [
        ['2026-06-08', 64.8], ['2026-06-11', 64.1], ['2026-06-14', 63.6],
        ['2026-06-17', 63.0], ['2026-06-20', 62.4], ['2026-06-23', 61.8],
        ['2026-06-26', 61.2]
      ];
      demo.forEach(([dateStr, w])=>{
        const rec = loadState(`ritual_prompt_${dateStr}`);
        if(typeof rec.weight !== 'number'){
          rec.weight = w;
          saveState(`ritual_prompt_${dateStr}`, rec);
        }
      });
      if(!localStorage.getItem('ritual_latest_weight')){
        localStorage.setItem('ritual_latest_weight', '61.2');
      }
    }
    renderStreak();
  }catch(e){}
})();


/* ---------- настройки: цель по весу + резервная копия ---------- */
function exportBackupJSON(){
  const data = {};
  try{
    for(let i=0; i<localStorage.length; i++){
      const k = localStorage.key(i);
      if(k && k.startsWith('ritual_')) data[k] = localStorage.getItem(k);
    }
  }catch(e){}
  return JSON.stringify(data, null, 2);
}

function openSettings(){
  const g = getWeightGoals();
  document.getElementById('goalStartInput').value = g.start;
  document.getElementById('goalTargetInput').value = g.goal;
  document.getElementById('retinolDailyToggle').checked = getRetinolDaily();
  document.getElementById('backupTextarea').value = exportBackupJSON();
  document.getElementById('backupMsg').textContent = '';
  document.getElementById('backupMsg').className = 'backup-msg';

  const dInput = document.getElementById('editDayInput');
  if(!dInput.value){
    dInput.value = `${yesterday.getFullYear()}-${pad(yesterday.getMonth()+1)}-${pad(yesterday.getDate())}`;
  }
  dInput.max = `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`;
  loadEditDay();

  syncThemeSwitch();
  document.getElementById('settingsOverlay').classList.remove('hidden');
}
function syncThemeSwitch(){
  const mode = getThemeMode();
  document.querySelectorAll('#themeSwitch .theme-opt').forEach(b=>{
    b.classList.toggle('is-active', b.dataset.theme===mode);
  });
}
document.querySelectorAll('#themeSwitch .theme-opt').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    setThemeMode(btn.dataset.theme);
    syncThemeSwitch();
    applyNightTheme();
  });
});
function closeSettings(){
  document.getElementById('settingsOverlay').classList.add('hidden');
}
document.getElementById('settingsBtn').addEventListener('click', openSettings);
document.getElementById('retinolDailyToggle').addEventListener('change', (e)=>{
  setRetinolDaily(e.target.checked);
  renderAll();
});
document.getElementById('settingsClose').addEventListener('click', closeSettings);

document.getElementById('goalSaveBtn').addEventListener('click', ()=>{
  const s = parseFloat(document.getElementById('goalStartInput').value);
  const g = parseFloat(document.getElementById('goalTargetInput').value);
  if(isNaN(s) || isNaN(g)){
    alert('Введите оба значения веса.');
    return;
  }
  setWeightGoals(s, g);
  renderStreak();
  closeSettings();
});

/* ---------- редактировать день (вес / диета / таблетки за любую дату) ---------- */
function parseDateInput(str){
  const [y,m,d] = str.split('-').map(Number);
  return new Date(y, m-1, d);
}
let editWeightValue = 65;
function loadEditDay(){
  const str = document.getElementById('editDayInput').value;
  if(!str) return;
  const d = parseDateInput(str);
  const pRec = loadState(promptKey(d));
  const cRec = loadState(checkinKey(d));
  editWeightValue = typeof pRec.weight === 'number' ? pRec.weight : getDefaultWeight();
  document.getElementById('editWeightDisplay').textContent = editWeightValue.toFixed(1);
  setActiveOption('editDietOptions', cRec.diet);
  setActiveOption('editPillsOptions', cRec.pills);
  document.getElementById('editDayMsg').textContent = '';
  document.getElementById('editDayMsg').className = 'backup-msg';
}
document.getElementById('editDayInput').addEventListener('change', loadEditDay);
document.getElementById('editWeightMinus').addEventListener('click', ()=>{
  editWeightValue = Math.max(30, Math.round((editWeightValue - 0.1)*10)/10);
  document.getElementById('editWeightDisplay').textContent = editWeightValue.toFixed(1);
});
document.getElementById('editWeightPlus').addEventListener('click', ()=>{
  editWeightValue = Math.min(200, Math.round((editWeightValue + 0.1)*10)/10);
  document.getElementById('editWeightDisplay').textContent = editWeightValue.toFixed(1);
});

document.getElementById('editDaySaveBtn').addEventListener('click', ()=>{
  const str = document.getElementById('editDayInput').value;
  const msg = document.getElementById('editDayMsg');
  if(!str){
    msg.textContent = 'Выбери дату.';
    msg.className = 'backup-msg err';
    return;
  }
  const d = parseDateInput(str);
  const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if(d.getTime() > todayMid.getTime()){
    msg.textContent = 'Нельзя редактировать будущую дату.';
    msg.className = 'backup-msg err';
    return;
  }

  const pRec = loadState(promptKey(d));
  pRec.weight = editWeightValue;
  saveState(promptKey(d), pRec);

  const cRec = loadState(checkinKey(d));
  const dietBtn = document.querySelector('#editDietOptions .opt-btn.is-active');
  const pillsBtn = document.querySelector('#editPillsOptions .opt-btn.is-active');
  if(dietBtn) cRec.diet = dietBtn.dataset.val;
  if(pillsBtn) cRec.pills = pillsBtn.dataset.val;
  saveState(checkinKey(d), cRec);

  if(d.getTime() === todayMid.getTime()){
    try{ localStorage.setItem('ritual_latest_weight', String(editWeightValue)); }catch(e){}
  }

  msg.textContent = 'Сохранено.';
  msg.className = 'backup-msg ok';
  renderStreak();
  renderMain();
});

document.getElementById('backupDownloadBtn').addEventListener('click', ()=>{
  const json = document.getElementById('backupTextarea').value || exportBackupJSON();
  const blob = new Blob([json], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ritual-backup-${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

document.getElementById('backupCopyBtn').addEventListener('click', async ()=>{
  const txt = document.getElementById('backupTextarea').value;
  const msg = document.getElementById('backupMsg');
  try{
    await navigator.clipboard.writeText(txt);
    msg.textContent = 'Скопировано в буфер обмена.';
    msg.className = 'backup-msg ok';
  }catch(e){
    msg.textContent = 'Не получилось скопировать само — выдели текст вручную и скопируй.';
    msg.className = 'backup-msg err';
  }
});

document.getElementById('backupUploadBtn').addEventListener('click', ()=>{
  document.getElementById('backupFileInput').click();
});
document.getElementById('backupFileInput').addEventListener('change', (e)=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{ document.getElementById('backupTextarea').value = reader.result; };
  reader.readAsText(file);
});

document.getElementById('backupApplyBtn').addEventListener('click', ()=>{
  const msg = document.getElementById('backupMsg');
  const txt = document.getElementById('backupTextarea').value;
  let obj;
  try{
    obj = JSON.parse(txt);
  }catch(e){
    msg.textContent = 'Не получилось прочитать текст — это должен быть правильный JSON.';
    msg.className = 'backup-msg err';
    return;
  }
  if(!obj || typeof obj !== 'object' || Array.isArray(obj)){
    msg.textContent = 'Это не похоже на резервную копию.';
    msg.className = 'backup-msg err';
    return;
  }
  if(!confirm('Это заменит сохранённые данные приложения данными из текста выше. Продолжить?')) return;
  try{
    Object.keys(obj).forEach(k=>{
      if(k.startsWith('ritual_')){
        const v = obj[k];
        localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
      }
    });
  }catch(e){
    msg.textContent = 'Ошибка при сохранении данных.';
    msg.className = 'backup-msg err';
    return;
  }
  msg.textContent = 'Готово! Применяю и перезагружаю…';
  msg.className = 'backup-msg ok';
  setTimeout(()=> location.reload(), 600);
});

openCheckinIfNeeded();

window.addEventListener('load', ()=>{
  setTimeout(()=>{
    const loader = document.getElementById('loader');
    if(loader) loader.classList.add('hide');
  }, 450);
});
setTimeout(()=>{
  const loader = document.getElementById('loader');
  if(loader) loader.classList.add('hide');
}, 2500);

/* ---------- офлайн-режим: регистрируем service worker ----------
   Работает только по https или на localhost. После первого открытия с сетью
   приложение будет запускаться и работать без интернета. */
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  });
}
