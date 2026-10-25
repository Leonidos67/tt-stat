/* ============ ДАННЫЕ — меняй только этот блок ============ */
const DATA = {
  video: {
    duration: "6.80 с.",
    published: "Опубликовано 24 окт 2026, 16:39",
    stats: [868, 11, 2, 0, 0],            // просмотры, лайки, комментарии, репосты, сохранения
  },

  /* ---- Обзор ---- */
  metrics: {
    views: { label: "Просмотры видео",         value: 868 },   // число ≥ 1000 покажется как 6.5K
    total: { label: "Общее время просмотра",   value: "1 ч.:05 мин.:47 с." },
    avg:   { label: "Среднее время просмотра", value: "4.8 с." },
    full:  { label: "Просмотрели видео полностью",   value: "32.72%" },
    subs:  { label: "Новые подписчики",        value: "0" },
  },
  viewsByHour: [0,23,111,85,49,37,54,41,31,57,61,36,33,18,4,21,20,11,32,74,4,1,2,2,1,3,1,2,1,6],
  viewsTicks: [43, 86, 129],
  retention: [100, 73, 52, 43, 37, 34, 31, 0],      // % зрителей на каждой секунде
  avgWatchedPercent: 71,
  mostLeftAt: "0:01",
  sources: [
    ["Для вас", 95.3], ["Личный профиль", 3.6], ["Другое", 0.7],
    ["Подписки", 0.2], ["Личные сообщения", 0.2], ["Звук", 0.0], ["Поиск", 0.0],
  ],

  /* ---- Зрители ---- */
  totalViewers: 137,
  viewerTypes: [
    { left: ["Новые зрители", 99],  right: ["Вернувшиеся зрители", 1] },
    { left: ["Не подписчики", 97],  right: ["Подписчики", 3] },
  ],
  gender: [["Мужской", 19], ["Женский", 36], ["Другое", 45, true]],   // true = со стрелкой ›
  ages: [["18 - 24", 34], ["25 - 34", 38], ["35 - 44", 14], ["45 - 54", 7], ["55+", 7]],
  places: [
    ["Соединенное Королевство", 50.0], ["Кипр", 6.4], ["Соединенные Штаты", 4.8, true],
    ["Германия", 4.1], ["Украина", 3.9], ["Латвия", 2.7], ["Польша", 2.7], ["Гонконг", 2.5],
    ["Республика Молдова", 2.3], ["Литва", 2.2], ["Другое", 18.4, true],
  ],

  /* ---- Вовлеченность ---- */
  likes: {
    values: [50,19,6,0,19,0,0,0,0,0,0,0,0,6,0,0,0,0,0,0],   // % лайков на каждой секунде (0с … 19с)
    ticks: [20, 40, 60],
    text: "Большинство зрителей поставили лайк этому видео на отметке 0:00. Узнайте, какой момент понравился зрителям.",
  },
};
/* ========================================================= */

const $ = id => document.getElementById(id);
const BLUE = "#0a74da";
const CHEV = `<svg viewBox="0 0 24 24" width="14" height="14"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/* ---------- сводка по видео ---------- */
document.querySelectorAll("[data-vid]:not(.sm)").forEach(el => el.insertAdjacentHTML("afterbegin",
  `<p class="vt">когда вместо звезд решил заправить самолетик подарком - RubUP</p>
   <i class="isl"></i><i class="road"></i>
   <div class="vbar"><b>Посадка на воду</b><small>Активировать · 50 ★</small></div>
   <svg class="vplay" viewBox="0 0 24 24"><path d="M7 4.5v15l13-7.5z" fill="#fff"/></svg>`));
$("summary").querySelector(".vid").insertAdjacentHTML("afterbegin", `<i class="chat c1"></i><i class="chat c2"></i><i class="chat c3"></i><i class="chat c4"></i>`);
$("dur").textContent = DATA.video.duration;
$("pub").textContent = DATA.video.published;
const ICONS = [   // все иконки нарисованы в одной сетке 24×24, высота глифа ≈ 17
  `<path d="M7 4.5L19 12 7 19.5z"/>`,
  `<path d="M12 20C6.8 16 3.8 13.2 3.8 9.5 3.8 6.9 5.7 5 8 5c1.7 0 3.1 1 4 2.600C12.9 6 14.3 5 16 5c2.3 0 4.2 1.9 4.2 4.500C20.2 13.2 17.2 16 12 20z"/>`,
  `<path d="M12 4C7.6 4 4 7 4 10.700c0 2.2 1.2 4.1 3.1 5.300l-.9 3.6 3.7-2c.7.1 1.4.2 2.1.2 4.4 0 8-3.3 8-7.100C20 7 16.4 4 12 4z"/><circle cx="8.5" cy="10.9" r="1.2"/><circle cx="12" cy="10.9" r="1.2"/><circle cx="15.5" cy="10.9" r="1.2"/>`,
  `<path d="M14 5.500l6.5 6-6.5 6v-3.300c-4 0-7 1.2-9.5 4.3.7-5.1 4-8.7 9.5-9.500z"/>`,
  `<path d="M7 4.500h10v15l-5-4-5 4z"/>`,
];
$("stats").innerHTML = DATA.video.stats.map((v, i) =>
  `<div><svg viewBox="0 0 24 24" width="22" height="22">${ICONS[i]}</svg>${v.toLocaleString("en-US")}</div>`).join("");

/* ---------- вкладки ---------- */
const tabBtns = [...document.querySelectorAll(".tabs button")];
const tabIndicator = document.getElementById("tab-indicator");

// Функция для передвижения полоски
function moveIndicator(activeBtn) {
  if (!activeBtn) return;
  // Вычисляем позицию и ширину активной кнопки
  const btnLeft = activeBtn.offsetLeft;
  const btnWidth = activeBtn.offsetWidth;
  
  // Применяем стили к полоске
  tabIndicator.style.width = `${btnWidth}px`;
  tabIndicator.style.transform = `translateX(${btnLeft}px)`;
}

function showTab(name, scroll) {
  if (!document.querySelector(`.pane[data-pane="${name}"]`)) name = "overview";
  
  let activeBtn = null;

  tabBtns.forEach(b => {
    const on = b.dataset.tab === name;
    b.classList.toggle("on", on);
    b.setAttribute("aria-selected", on);
    if (on) activeBtn = b;
  });

  // Двигаем полоску к активной кнопке
  if (activeBtn) {
    moveIndicator(activeBtn);
  }

  document.querySelectorAll(".pane").forEach(p => p.hidden = p.dataset.pane !== name);
  history.replaceState(null, "", "#" + name);
  
  if (name === "overview" && typeof fitValues === "function") requestAnimationFrame(fitValues);
  
  const lim = $("summary").offsetHeight;          
  if (scroll && window.scrollY > lim) window.scrollTo(0, lim);
}

tabBtns.forEach(b => b.addEventListener("click", () => showTab(b.dataset.tab, true)));

// Обновляем позицию полоски при ресайзе окна
window.addEventListener('resize', () => {
  const activeBtn = document.querySelector('.tabs button.on');
  if (activeBtn) moveIndicator(activeBtn);
});

// Ждем загрузки шрифтов, чтобы размеры кнопок не "прыгали"
(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
  const activeBtn = document.querySelector('.tabs button.on');
  if (activeBtn) moveIndicator(activeBtn);
});

/* ---------- графики ---------- */
function areaPaths(pts, baseY) {
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  return { line, area: `${line} L${pts[pts.length - 1][0]} ${baseY} L${pts[0][0]} ${baseY} Z` };
}

// универсальный area-график; возвращает функции X(i) и Y(value)
function areaChart(svgId, vals, o) {
  const svg = $(svgId), gid = "g-" + svgId;
  const x0 = o.x0 ?? 6, x1 = 346, top = 10;
  const base = o.H - (o.xLabels ? 30 : 10);
  const X = i => x0 + (i / (vals.length - 1)) * (x1 - x0);
  const Y = v => base - (v / o.max) * (base - top);
  const { line, area } = areaPaths(vals.map((v, i) => [X(i), Y(v)]), base);
  svg.setAttribute("viewBox", `0 0 400 ${o.H}`);
  svg.innerHTML =
    `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
       <stop offset="0" stop-color="${BLUE}" stop-opacity=".25"/><stop offset="1" stop-color="${BLUE}" stop-opacity=".02"/>
     </linearGradient></defs>` +
    o.ticks.map(t => `<line class="grid" x1="${x0}" x2="${x1 + 4}" y1="${Y(t)}" y2="${Y(t)}"/>
       <text x="394" y="${Y(t) + 4}" text-anchor="end">${t}${o.unit || ""}</text>`).join("") +
    `<line x1="${x0}" x2="${x1 + 4}" y1="${base}" y2="${base}" stroke="#c9cacd"/>` +
    `<path d="${area}" fill="url(#${gid})"/>` +
    `<path d="${line}" fill="none" stroke="${BLUE}" stroke-width="1.6" stroke-linejoin="round"/>` +
    (o.dot ? `<line x1="${x0}" x2="${x0}" y1="${top}" y2="${base}" stroke="${BLUE}" stroke-width="1"/>
              <circle id="${svgId}-dot" r="4" fill="#fff" stroke="${BLUE}" stroke-width="2"/>` : "") +
    (o.xLabels ? `<text x="${x0}" y="${o.H - 8}">0h</text><text x="${x1}" y="${o.H - 8}" text-anchor="end">${vals.length - 1}h</text>` : "");
  return { X, Y };
}

// ползунок + точка на графике
function bindSlider(prefix, vals, X, Y) {
  const slider = $(prefix + "-slider"), dot = $(prefix + "-chart-dot"), secs = vals.length - 1;
  const fmt = s => "00:" + String(Math.round(s)).padStart(2, "0");
  slider.max = secs;
  $(prefix + "-end").textContent = fmt(secs);
  function update() {
    const s = +slider.value, i = Math.min(Math.floor(s), secs - 1), f = s - i;
    const p = vals[i] + (vals[i + 1] - vals[i]) * f;
    dot.setAttribute("cx", X(s)); dot.setAttribute("cy", Y(p));
    $(prefix + "-now").textContent = `${fmt(s)} (${Math.round(p)}%)`;
  }
  slider.addEventListener("input", update);
  update();
}

/* ---------- Обзор ---------- */
// общий размер значений: 20px, а если «Общее время просмотра» не влезает — уменьшаем у всех карточек одинаково
function fitValues() {
  const wrap = document.querySelector(".metrics"), total = $("v-total");
  if (!total.clientWidth) return;                    // вкладка скрыта
  let s = 20; wrap.style.setProperty("--vs", s + "px");
  while (total.scrollWidth > total.clientWidth && s > 12) { s -= 0.5; wrap.style.setProperty("--vs", s + "px"); }
}

const fmtK = n => n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "K" : String(n);
for (const k in DATA.metrics) {
  const v = DATA.metrics[k].value;
  $("l-" + k).textContent = DATA.metrics[k].label;
  $("v-" + k).textContent = typeof v === "number" ? fmtK(v) : v;
}
areaChart("views-chart", DATA.viewsByHour, { H: 200, max: DATA.viewsTicks.at(-1), ticks: DATA.viewsTicks, xLabels: true, x0: 4 });

$("ret-lead").textContent = `В среднем, зрители смотрели ваше видео на ${DATA.avgWatchedPercent}%.`;
$("ret-sub").textContent = `Большинство зрителей прекратили просмотр на отметке ${DATA.mostLeftAt}. Узнайте, с какого момента они потеряли интерес к вашему видео.`;
{ const c = areaChart("ret-chart", DATA.retention, { H: 110, max: 100, ticks: [100, 50], unit: "%", dot: true });
  bindSlider("ret", DATA.retention, c.X, c.Y); }

fitValues();
(document.fonts ? document.fonts.ready : Promise.resolve()).then(fitValues);
window.addEventListener("resize", fitValues);
// выбор метрики (подсветка рамкой)
document.querySelectorAll(".m").forEach(m => m.addEventListener("click", () => {
  document.querySelectorAll(".m").forEach(x => x.classList.toggle("sel", x === m));
}));

/* ---------- общий рендер полосок ---------- */
function bars(id, rows, dec) {
  $(id).innerHTML = rows.map(([name, v, chev]) => `
    <div class="src">
      <div class="src-h"><span>${name}</span><b>${v.toFixed(dec)}%${chev ? CHEV : ""}</b></div>
      <div class="bar ${v === 0 ? "zero" : ""}"><i style="width:${v}%"></i></div>
    </div>`).join("");
}
bars("sources", DATA.sources, 1);

/* ---------- Зрители ---------- */
$("v-total-viewers").textContent = DATA.totalViewers.toLocaleString("en-US");
$("types").innerHTML = DATA.viewerTypes.map(t => `
  <div class="split">
    <div class="nums"><span>${t.left[1]}%</span><span>${t.right[1]}%</span></div>
    <div class="sbar"><i style="flex:${t.left[1]}"></i><i style="flex:${t.right[1]}"></i></div>
    <div class="names"><span>${t.left[0]}</span><span>${t.right[0]}</span></div>
  </div>`).join("");

{ // полукруглая диаграмма
  const COLORS = ["#0a74da", "#7fb8ec", "#cce2f8"], cx = 80, cy = 80, R = 80, r = 52;
  const total = DATA.gender.reduce((s, g) => s + g[1], 0);
  const pt = (rad, t) => [cx + rad * Math.cos(Math.PI * (1 - t)), cy - rad * Math.sin(Math.PI * (1 - t))];
  let acc = 0, svg = "";
  DATA.gender.forEach((g, i) => {
    const t0 = acc / total, t1 = (acc += g[1]) / total;
    const [a, b, c, d] = [pt(R, t0), pt(R, t1), pt(r, t1), pt(r, t0)];
    svg += `<path d="M${a} A${R} ${R} 0 0 1 ${b} L${c} A${r} ${r} 0 0 0 ${d}Z" fill="${COLORS[i]}" stroke="#fff" stroke-width="1.5"/>`;
  });
  $("donut").innerHTML = svg;
  $("gender").innerHTML = DATA.gender.map(([n, v, chev], i) =>
    `<div class="leg"><i class="dot" style="background:${COLORS[i]}"></i><span>${n}</span><b>${v}%${chev ? CHEV : ""}</b></div>`).join("");
}
bars("ages", DATA.ages, 0);
bars("places", DATA.places, 1);

/* ---------- Вовлеченность ---------- */
$("likes-text").textContent = DATA.likes.text;
{ const L = DATA.likes, c = areaChart("likes-chart", L.values, { H: 110, max: L.ticks.at(-1), ticks: [...L.ticks].reverse(), unit: "%", dot: true });
  bindSlider("likes", L.values, c.X, c.Y); }

/* ---------- баннер: логотип 1:1 по высоте текстового блока ---------- */
function syncLogo() {
  const t = document.querySelector(".bn-text"), l = document.querySelector(".banner .logo");
  if (!t || !l) return;
  for (let k = 0; k < 2; k++) {              // два прохода: ширина логотипа влияет на перенос текста
    const h = t.offsetHeight;
    if (h) { l.style.width = l.style.height = h + "px"; }
  }
}
syncLogo();
window.addEventListener("load", syncLogo);
window.addEventListener("resize", syncLogo);
(document.fonts ? document.fonts.ready : Promise.resolve()).then(syncLogo);

/* ---------- баннер ---------- */
$("banner-close").addEventListener("click", () => $("banner").remove());

showTab(location.hash.slice(1) || "overview", false);