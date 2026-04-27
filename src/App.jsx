import { useState, useCallback, useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";

const THEMES = [
  { id:"djur",    label:"Djur",      emoji:"🐾", labelRu:"Животные" },
  { id:"mat",     label:"Mat",       emoji:"🍎", labelRu:"Еда" },
  { id:"familj",  label:"Familj",    emoji:"👨‍👩‍👧", labelRu:"Семья" },
  { id:"farger",  label:"Färger",    emoji:"🎨", labelRu:"Цвета" },
  { id:"skola",   label:"Skola",     emoji:"📚", labelRu:"Школа" },
  { id:"kroppen", label:"Kroppen",   emoji:"🧒", labelRu:"Тело" },
  { id:"klader",  label:"Kläder",    emoji:"👕", labelRu:"Одежда" },
  { id:"hemmet",  label:"Hemmet",    emoji:"🏠", labelRu:"Дом" },
  { id:"vader",   label:"Väder",     emoji:"🌤️", labelRu:"Погода" },
  { id:"transport",label:"Transport",emoji:"🚗", labelRu:"Транспорт" },
  { id:"siffror", label:"Siffror",   emoji:"🔢", labelRu:"Цифры" },
  { id:"verb1",   label:"Verb",      emoji:"🏃", labelRu:"Глаголы" },
  { id:"verb2",   label:"Meningar",  emoji:"💬", labelRu:"Фразы" },
];

const WORDS = {
  djur: [
    {sv:"katt",ru:"кот",emoji:"🐱"},{sv:"hund",ru:"собака",emoji:"🐶"},
    {sv:"fågel",ru:"птица",emoji:"🐦"},{sv:"fisk",ru:"рыба",emoji:"🐟"},
    {sv:"häst",ru:"лошадь",emoji:"🐴"},{sv:"ko",ru:"корова",emoji:"🐄"},
    {sv:"kanin",ru:"кролик",emoji:"🐰"},{sv:"björn",ru:"медведь",emoji:"🐻"},
    {sv:"get",ru:"коза",emoji:"🐐"},{sv:"groda",ru:"лягушка",emoji:"🐸"},
    {sv:"orm",ru:"змея",emoji:"🐍"},{sv:"lejon",ru:"лев",emoji:"🦁"},
    {sv:"elefant",ru:"слон",emoji:"🐘"},{sv:"apa",ru:"обезьяна",emoji:"🐒"},
    {sv:"pingvin",ru:"пингвин",emoji:"🐧"},{sv:"uggla",ru:"сова",emoji:"🦉"},
    {sv:"räv",ru:"лиса",emoji:"🦊"},{sv:"varg",ru:"волк",emoji:"🐺"},
    {sv:"tiger",ru:"тигр",emoji:"🐯"},{sv:"anka",ru:"утка",emoji:"🦆"},
    {sv:"tupp",ru:"петух",emoji:"🐓"},{sv:"myra",ru:"муравей",emoji:"🐜"},
    {sv:"bi",ru:"пчела",emoji:"🐝"},{sv:"fjäril",ru:"бабочка",emoji:"🦋"},
  ],
  mat: [
    {sv:"äpple",ru:"яблоко",emoji:"🍎"},{sv:"bröd",ru:"хлеб",emoji:"🍞"},
    {sv:"mjölk",ru:"молоко",emoji:"🥛"},{sv:"ost",ru:"сыр",emoji:"🧀"},
    {sv:"ägg",ru:"яйцо",emoji:"🥚"},{sv:"soppa",ru:"суп",emoji:"🍲"},
    {sv:"banan",ru:"банан",emoji:"🍌"},{sv:"jordgubbe",ru:"клубника",emoji:"🍓"},
    {sv:"morot",ru:"морковь",emoji:"🥕"},{sv:"potatis",ru:"картошка",emoji:"🥔"},
    {sv:"pasta",ru:"паста",emoji:"🍝"},{sv:"ris",ru:"рис",emoji:"🍚"},
    {sv:"kyckling",ru:"курица",emoji:"🍗"},{sv:"glass",ru:"мороженое",emoji:"🍦"},
    {sv:"tårta",ru:"торт",emoji:"🎂"},{sv:"juice",ru:"сок",emoji:"🧃"},
    {sv:"vatten",ru:"вода",emoji:"💧"},{sv:"te",ru:"чай",emoji:"🍵"},
    {sv:"smör",ru:"масло",emoji:"🧈"},{sv:"tomat",ru:"помидор",emoji:"🍅"},
    {sv:"lök",ru:"лук",emoji:"🧅"},{sv:"vitlök",ru:"чеснок",emoji:"🧄"},
    {sv:"apelsin",ru:"апельсин",emoji:"🍊"},{sv:"vindruva",ru:"виноград",emoji:"🍇"},
  ],
  familj: [
    {sv:"mamma",ru:"мама",emoji:"👩"},{sv:"pappa",ru:"папа",emoji:"👨"},
    {sv:"bror",ru:"брат",emoji:"👦"},{sv:"syster",ru:"сестра",emoji:"👧"},
    {sv:"morfar",ru:"дедушка",emoji:"👴"},{sv:"mormor",ru:"бабушка",emoji:"👵"},
    {sv:"bebis",ru:"малыш",emoji:"👶"},{sv:"kompis",ru:"друг",emoji:"🤝"},
    {sv:"farbror",ru:"дядя",emoji:"👨‍💼"},{sv:"faster",ru:"тётя",emoji:"👩‍💼"},
    {sv:"barn",ru:"ребёнок",emoji:"🧒"},{sv:"familj",ru:"семья",emoji:"👨‍👩‍👧"},
    {sv:"kärlek",ru:"любовь",emoji:"❤️"},{sv:"hemmet",ru:"дом",emoji:"🏠"},
    {sv:"kusin",ru:"двоюродный брат",emoji:"👦"},{sv:"farfar",ru:"дедушка",emoji:"👴"},
    {sv:"farmor",ru:"бабушка",emoji:"👵"},{sv:"son",ru:"сын",emoji:"👦"},
    {sv:"dotter",ru:"дочь",emoji:"👧"},{sv:"man",ru:"муж",emoji:"👨"},
    {sv:"fru",ru:"жена",emoji:"👩"},{sv:"föräldrar",ru:"родители",emoji:"👨‍👩‍👧"},
    {sv:"syskon",ru:"братья и сёстры",emoji:"👫"},{sv:"granne",ru:"сосед",emoji:"🏘️"},
  ],
  farger: [
    {sv:"röd",ru:"красный",emoji:"🔴"},{sv:"blå",ru:"синий",emoji:"🔵"},
    {sv:"grön",ru:"зелёный",emoji:"🟢"},{sv:"gul",ru:"жёлтый",emoji:"🟡"},
    {sv:"vit",ru:"белый",emoji:"⚪"},{sv:"svart",ru:"чёрный",emoji:"⚫"},
    {sv:"rosa",ru:"розовый",emoji:"🩷"},{sv:"orange",ru:"оранжевый",emoji:"🟠"},
    {sv:"lila",ru:"фиолетовый",emoji:"🟣"},{sv:"brun",ru:"коричневый",emoji:"🟤"},
    {sv:"grå",ru:"серый",emoji:"🩶"},{sv:"ljusblå",ru:"голубой",emoji:"🩵"},
    {sv:"mörkblå",ru:"тёмно-синий",emoji:"🔷"},{sv:"guld",ru:"золотой",emoji:"🌟"},
    {sv:"silver",ru:"серебряный",emoji:"⚡"},{sv:"turkos",ru:"бирюзовый",emoji:"💚"},
  ],
  skola: [
    {sv:"bok",ru:"книга",emoji:"📚"},{sv:"penna",ru:"ручка",emoji:"✏️"},
    {sv:"bord",ru:"стол",emoji:"🪑"},{sv:"lärare",ru:"учитель",emoji:"👩‍🏫"},
    {sv:"väska",ru:"сумка",emoji:"🎒"},{sv:"suddgummi",ru:"ластик",emoji:"🧹"},
    {sv:"linjal",ru:"линейка",emoji:"📏"},{sv:"saxen",ru:"ножницы",emoji:"✂️"},
    {sv:"dator",ru:"компьютер",emoji:"💻"},{sv:"tavlan",ru:"доска",emoji:"📋"},
    {sv:"krita",ru:"мел",emoji:"🖍️"},{sv:"papper",ru:"бумага",emoji:"📄"},
    {sv:"klass",ru:"класс",emoji:"🏫"},{sv:"rast",ru:"перемена",emoji:"⏰"},
    {sv:"läxa",ru:"домашнее задание",emoji:"📝"},{sv:"elev",ru:"ученик",emoji:"🧑‍🎓"},
  ],
  kroppen: [
    {sv:"huvud",ru:"голова",emoji:"🗣️"},{sv:"öga",ru:"глаз",emoji:"👁️"},
    {sv:"näsa",ru:"нос",emoji:"👃"},{sv:"mun",ru:"рот",emoji:"👄"},
    {sv:"hand",ru:"рука",emoji:"✋"},{sv:"fot",ru:"нога",emoji:"🦶"},
    {sv:"öra",ru:"ухо",emoji:"👂"},{sv:"mage",ru:"живот",emoji:"🫃"},
    {sv:"rygg",ru:"спина",emoji:"🫁"},{sv:"axel",ru:"плечо",emoji:"💪"},
    {sv:"knä",ru:"колено",emoji:"🦵"},{sv:"tand",ru:"зуб",emoji:"🦷"},
    {sv:"hår",ru:"волосы",emoji:"💇"},{sv:"kind",ru:"щека",emoji:"😊"},
    {sv:"finger",ru:"палец",emoji:"☝️"},{sv:"hjärta",ru:"сердце",emoji:"❤️"},
  ],
  klader: [
    {sv:"tröja",ru:"свитер",emoji:"👕"},{sv:"byxor",ru:"штаны",emoji:"👖"},
    {sv:"skor",ru:"туфли",emoji:"👟"},{sv:"mössa",ru:"шапка",emoji:"🧢"},
    {sv:"jacka",ru:"куртка",emoji:"🧥"},{sv:"strumpor",ru:"носки",emoji:"🧦"},
    {sv:"klänning",ru:"платье",emoji:"👗"},{sv:"vantar",ru:"варежки",emoji:"🧤"},
    {sv:"halsduk",ru:"шарф",emoji:"🧣"},{sv:"skjorta",ru:"рубашка",emoji:"👔"},
    {sv:"kjol",ru:"юбка",emoji:"👗"},{sv:"bälte",ru:"ремень",emoji:"👜"},
    {sv:"glasögon",ru:"очки",emoji:"👓"},{sv:"hatt",ru:"шляпа",emoji:"🎩"},
    {sv:"pyjamas",ru:"пижама",emoji:"😴"},{sv:"badkläder",ru:"купальник",emoji:"👙"},
  ],
  hemmet: [
    {sv:"soffa",ru:"диван",emoji:"🛋️"},{sv:"säng",ru:"кровать",emoji:"🛏️"},
    {sv:"bord",ru:"стол",emoji:"🪑"},{sv:"stol",ru:"стул",emoji:"🪑"},
    {sv:"fönster",ru:"окно",emoji:"🪟"},{sv:"dörr",ru:"дверь",emoji:"🚪"},
    {sv:"kök",ru:"кухня",emoji:"🍳"},{sv:"badrum",ru:"ванная",emoji:"🛁"},
    {sv:"lampa",ru:"лампа",emoji:"💡"},{sv:"matta",ru:"ковёр",emoji:"🪆"},
    {sv:"spegel",ru:"зеркало",emoji:"🪞"},{sv:"klocka",ru:"часы",emoji:"🕐"},
    {sv:"TV",ru:"телевизор",emoji:"📺"},{sv:"telefon",ru:"телефон",emoji:"📱"},
    {sv:"nyckel",ru:"ключ",emoji:"🔑"},{sv:"trappa",ru:"лестница",emoji:"🪜"},
    {sv:"garderob",ru:"шкаф",emoji:"🚪"},{sv:"kudde",ru:"подушка",emoji:"🛌"},
    {sv:"filt",ru:"одеяло",emoji:"🛌"},{sv:"tallrik",ru:"тарелка",emoji:"🍽️"},
    {sv:"glas",ru:"стакан",emoji:"🥛"},{sv:"gaffel",ru:"вилка",emoji:"🍴"},
    {sv:"sked",ru:"ложка",emoji:"🥄"},{sv:"kniv",ru:"нож",emoji:"🔪"},
  ],
  vader: [
    {sv:"sol",ru:"солнце",emoji:"☀️"},{sv:"regn",ru:"дождь",emoji:"🌧️"},
    {sv:"snö",ru:"снег",emoji:"❄️"},{sv:"vind",ru:"ветер",emoji:"💨"},
    {sv:"moln",ru:"облако",emoji:"☁️"},{sv:"åska",ru:"гром",emoji:"⛈️"},
    {sv:"regnbåge",ru:"радуга",emoji:"🌈"},{sv:"dimma",ru:"туман",emoji:"🌫️"},
    {sv:"is",ru:"лёд",emoji:"🧊"},{sv:"värme",ru:"жара",emoji:"🌡️"},
    {sv:"kyla",ru:"холод",emoji:"🥶"},{sv:"storm",ru:"буря",emoji:"🌪️"},
    {sv:"vår",ru:"весна",emoji:"🌸"},{sv:"sommar",ru:"лето",emoji:"☀️"},
    {sv:"höst",ru:"осень",emoji:"🍂"},{sv:"vinter",ru:"зима",emoji:"⛄"},
  ],
  transport: [
    {sv:"bil",ru:"машина",emoji:"🚗"},{sv:"buss",ru:"автобус",emoji:"🚌"},
    {sv:"tåg",ru:"поезд",emoji:"🚂"},{sv:"flygplan",ru:"самолёт",emoji:"✈️"},
    {sv:"båt",ru:"лодка",emoji:"⛵"},{sv:"cykel",ru:"велосипед",emoji:"🚲"},
    {sv:"motorcykel",ru:"мотоцикл",emoji:"🏍️"},{sv:"taxi",ru:"такси",emoji:"🚕"},
    {sv:"tunnelbana",ru:"метро",emoji:"🚇"},{sv:"spårvagn",ru:"трамвай",emoji:"🚊"},
    {sv:"helikopter",ru:"вертолёт",emoji:"🚁"},{sv:"fartyg",ru:"корабль",emoji:"🚢"},
    {sv:"lastbil",ru:"грузовик",emoji:"🚚"},{sv:"ambulans",ru:"скорая помощь",emoji:"🚑"},
    {sv:"brandbil",ru:"пожарная машина",emoji:"🚒"},{sv:"polisbil",ru:"полицейская машина",emoji:"🚓"},
  ],
  siffror: [
    {sv:"noll",ru:"ноль",emoji:"0️⃣"},{sv:"ett",ru:"один",emoji:"1️⃣"},
    {sv:"två",ru:"два",emoji:"2️⃣"},{sv:"tre",ru:"три",emoji:"3️⃣"},
    {sv:"fyra",ru:"четыре",emoji:"4️⃣"},{sv:"fem",ru:"пять",emoji:"5️⃣"},
    {sv:"sex",ru:"шесть",emoji:"6️⃣"},{sv:"sju",ru:"семь",emoji:"7️⃣"},
    {sv:"åtta",ru:"восемь",emoji:"8️⃣"},{sv:"nio",ru:"девять",emoji:"9️⃣"},
    {sv:"tio",ru:"десять",emoji:"🔟"},{sv:"elva",ru:"одиннадцать",emoji:"1️⃣1️⃣"},
    {sv:"tolv",ru:"двенадцать",emoji:"1️⃣2️⃣"},{sv:"tjugo",ru:"двадцать",emoji:"✌️"},
    {sv:"hundra",ru:"сто",emoji:"💯"},{sv:"tusen",ru:"тысяча",emoji:"🔢"},
  ],
  // Verb del 1 — basic verb form (infinitive)
  verb1: [
    {sv:"äta",ru:"есть / кушать",emoji:"🍽️"},
    {sv:"dricka",ru:"пить",emoji:"🥛"},
    {sv:"sova",ru:"спать",emoji:"😴"},
    {sv:"springa",ru:"бежать",emoji:"🏃"},
    {sv:"gå",ru:"идти",emoji:"🚶"},
    {sv:"sitta",ru:"сидеть",emoji:"🪑"},
    {sv:"stå",ru:"стоять",emoji:"🧍"},
    {sv:"leka",ru:"играть",emoji:"🎮"},
    {sv:"läsa",ru:"читать",emoji:"📖"},
    {sv:"skriva",ru:"писать",emoji:"✏️"},
    {sv:"rita",ru:"рисовать",emoji:"🎨"},
    {sv:"sjunga",ru:"петь",emoji:"🎵"},
    {sv:"dansa",ru:"танцевать",emoji:"💃"},
    {sv:"simma",ru:"плавать",emoji:"🏊"},
    {sv:"cykla",ru:"ехать на велосипеде",emoji:"🚲"},
    {sv:"hoppa",ru:"прыгать",emoji:"🦘"},
    {sv:"skratta",ru:"смеяться",emoji:"😄"},
    {sv:"gråta",ru:"плакать",emoji:"😢"},
    {sv:"prata",ru:"говорить",emoji:"💬"},
    {sv:"lyssna",ru:"слушать",emoji:"👂"},
    {sv:"titta",ru:"смотреть",emoji:"👀"},
    {sv:"hjälpa",ru:"помогать",emoji:"🤝"},
    {sv:"älska",ru:"любить",emoji:"❤️"},
    {sv:"köpa",ru:"покупать",emoji:"🛒"},
  ],
};

// Verb del 2 — conjugation phrases (special type, shown as sentence pairs)
const VERB_PHRASES = [
  {
    verb:"äta", emoji:"🍽️",
    forms:[
      {sv:"Jag äter",      ru:"Я ем"},
      {sv:"Du äter",       ru:"Ты ешь"},
      {sv:"Han äter",      ru:"Он ест"},
      {sv:"Vi äter",       ru:"Мы едим"},
      {sv:"Ni äter",       ru:"Вы едите"},
      {sv:"De äter",       ru:"Они едят"},
      {sv:"Jag åt",        ru:"Я ел"},
      {sv:"Vi åt",         ru:"Мы ели"},
    ]
  },
  {
    verb:"dricka", emoji:"🥛",
    forms:[
      {sv:"Jag dricker",   ru:"Я пью"},
      {sv:"Du dricker",    ru:"Ты пьёшь"},
      {sv:"Han dricker",   ru:"Он пьёт"},
      {sv:"Vi dricker",    ru:"Мы пьём"},
      {sv:"Jag drack",     ru:"Я пил"},
      {sv:"Vi drack",      ru:"Мы пили"},
    ]
  },
  {
    verb:"sova", emoji:"😴",
    forms:[
      {sv:"Jag sover",     ru:"Я сплю"},
      {sv:"Du sover",      ru:"Ты спишь"},
      {sv:"Han sover",     ru:"Он спит"},
      {sv:"Vi sover",      ru:"Мы спим"},
      {sv:"Jag sov",       ru:"Я спал"},
      {sv:"Vi sov",        ru:"Мы спали"},
    ]
  },
  {
    verb:"gå", emoji:"🚶",
    forms:[
      {sv:"Jag går",       ru:"Я иду"},
      {sv:"Du går",        ru:"Ты идёшь"},
      {sv:"Han går",       ru:"Он идёт"},
      {sv:"Vi går",        ru:"Мы идём"},
      {sv:"Jag gick",      ru:"Я шёл"},
      {sv:"Vi gick",       ru:"Мы шли"},
    ]
  },
  {
    verb:"springa", emoji:"🏃",
    forms:[
      {sv:"Jag springer",  ru:"Я бегу"},
      {sv:"Du springer",   ru:"Ты бежишь"},
      {sv:"Han springer",  ru:"Он бежит"},
      {sv:"Vi springer",   ru:"Мы бежим"},
      {sv:"Jag sprang",    ru:"Я бежал"},
      {sv:"Vi sprang",     ru:"Мы бежали"},
    ]
  },
  {
    verb:"leka", emoji:"🎮",
    forms:[
      {sv:"Jag leker",     ru:"Я играю"},
      {sv:"Du leker",      ru:"Ты играешь"},
      {sv:"Han leker",     ru:"Он играет"},
      {sv:"Vi leker",      ru:"Мы играем"},
      {sv:"Jag lekte",     ru:"Я играл"},
      {sv:"Vi lekte",      ru:"Мы играли"},
    ]
  },
  {
    verb:"läsa", emoji:"📖",
    forms:[
      {sv:"Jag läser",     ru:"Я читаю"},
      {sv:"Du läser",      ru:"Ты читаешь"},
      {sv:"Han läser",     ru:"Он читает"},
      {sv:"Vi läser",      ru:"Мы читаем"},
      {sv:"Jag läste",     ru:"Я читал"},
      {sv:"Vi läste",      ru:"Мы читали"},
    ]
  },
  {
    verb:"prata", emoji:"💬",
    forms:[
      {sv:"Jag pratar",    ru:"Я говорю"},
      {sv:"Du pratar",     ru:"Ты говоришь"},
      {sv:"Han pratar",    ru:"Он говорит"},
      {sv:"Vi pratar",     ru:"Мы говорим"},
      {sv:"Jag pratade",   ru:"Я говорил"},
      {sv:"Vi pratade",    ru:"Мы говорили"},
    ]
  },
  {
    verb:"älska", emoji:"❤️",
    forms:[
      {sv:"Jag älskar",    ru:"Я люблю"},
      {sv:"Du älskar",     ru:"Ты любишь"},
      {sv:"Han älskar",    ru:"Он любит"},
      {sv:"Vi älskar",     ru:"Мы любим"},
      {sv:"Jag älskade",   ru:"Я любил"},
      {sv:"Vi älskade",    ru:"Мы любили"},
    ]
  },
  {
    verb:"titta", emoji:"👀",
    forms:[
      {sv:"Jag tittar",    ru:"Я смотрю"},
      {sv:"Du tittar",     ru:"Ты смотришь"},
      {sv:"Han tittar",    ru:"Он смотрит"},
      {sv:"Vi tittar",     ru:"Мы смотрим"},
      {sv:"Jag tittade",   ru:"Я смотрел"},
      {sv:"Vi tittade",    ru:"Мы смотрели"},
    ]
  },
];

const COLLECTIBLES = {
  djur:["🐾","🦴","🪶","🐚","🦋","🌿"],
  mat:["🫐","🍄","🌰","🍒","🌿","🍀"],
  familj:["💌","🎀","🪷","🌻","⭐","🎁"],
  farger:["🌈","🎨","🖍️","✨","🌟","💎"],
  skola:["📝","🔑","⭐","🎓","🏅","🔮"],
  kroppen:["❤️","🌟","💪","🧠","🌿","🍀"],
  klader:["🎁","🧣","👑","🎀","🌸","✨"],
  hemmet:["🛋️","🔑","🪴","🕯️","🏡","🪟"],
  vader:["☀️","❄️","🌈","⛄","🌸","🍂"],
  transport:["🚗","✈️","⚓","🎫","🗺️","🚀"],
  siffror:["🍀","💎","🪙","🔮","🌙","☀️"],
  verb1:["🏃","💪","🎯","⚡","🌟","🎪"],
  verb2:["💬","📢","🗣️","✍️","📖","🎭"],
};

const FOREST_ITEMS = ["🌲","🌿","🍄","🫐","🌸","🌲","🦋","🌿","🌲","🍄","🌸","🫐","🦌","🌲","🌿","🌸","🏠"];
const TOTAL_STEPS = 200;

function getBestVoice(lang) {
  const voices = window.speechSynthesis.getVoices();
  const cands = voices.filter(v => v.lang.startsWith(lang));
  const local = cands.filter(v => v.localService);
  const pool = local.length > 0 ? local : cands;
  for (const name of ["Alva","Klara","Astrid","Google svenska"]) {
    const v = pool.find(v => v.name.includes(name));
    if (v) return v;
  }
  return pool[0] || cands[0] || null;
}

function speakOut(text, lang="sv-SE", rate=0.72, pitch=1.0) {
  return new Promise(resolve => {
    if (!window.speechSynthesis) { resolve(); return; }
    window.speechSynthesis.cancel();
    setTimeout(() => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang; u.rate = rate; u.pitch = pitch; u.volume = 1.0;
      const v = getBestVoice(lang.split("-")[0]);
      if (v) u.voice = v;
      u.onend = resolve; u.onerror = resolve;
      window.speechSynthesis.speak(u);
    }, 120);
  });
}

function normalize(str) {
  return (str||"").toLowerCase()
    .replace(/[åä]/g,"a").replace(/ö/g,"o")
    .replace(/[её]/g,"е").replace(/[ъь]/g,"")
    .replace(/[^a-zа-яё]/g,"").trim();
}

function isCloseEnough(heard, correct) {
  const a=normalize(heard), b=normalize(correct);
  if (!a||!b) return false;
  if (a===b||a.includes(b)||b.includes(a)) return true;
  if (Math.abs(a.length-b.length)>2) return false;
  let diff=0;
  for (let i=0;i<Math.max(a.length,b.length);i++) if (a[i]!==b[i]) diff++;
  return diff<=2;
}

function buildQuizQuestions(words) {
  const allSv = words.map(w => w.sv);
  return words.map(w => {
    const pool = allSv.filter(s => s!==w.sv).sort(()=>Math.random()-0.5).slice(0,3);
    const options = [...pool, w.sv].sort(()=>Math.random()-0.5);
    return {...w, options};
  });
}

function loadProgress() {
  try { return JSON.parse(localStorage.getItem("bjorn_progress_v3")||"{}"); } catch { return {}; }
}
function saveProgress(p) {
  try { localStorage.setItem("bjorn_progress_v3", JSON.stringify(p)); } catch {} 
}

function ForestMap({ steps, collected, onClose }) {
  const pct = Math.min(1, steps/TOTAL_STEPS);
  const bjornPos = Math.floor(pct*(FOREST_ITEMS.length-1));
  return (
    <div className="card" style={{maxWidth:440,width:"100%",textAlign:"center"}}>
      <h2 style={{color:"#FFD700",fontSize:"1.8rem",margin:"0 0 4px"}}>Björns skogsväg 🌲</h2>
      <p style={{color:"#a0d4ff",fontFamily:"'Nunito',sans-serif",fontSize:"0.85rem",marginBottom:16}}>Лесной путь Бьёрна</p>
      <div style={{background:"rgba(255,255,255,0.1)",borderRadius:20,height:8,marginBottom:8,overflow:"hidden"}}>
        <div style={{width:`${pct*100}%`,height:"100%",background:"linear-gradient(90deg,#48c774,#FFD700)",borderRadius:20,transition:"width 0.6s ease"}}/>
      </div>
      <p style={{color:"#a0d4ff",fontFamily:"'Nunito',sans-serif",fontSize:"0.82rem",marginBottom:16}}>{steps} / {TOTAL_STEPS} steg</p>
      <div style={{background:"linear-gradient(160deg,#0d3a1a,#1a5c2a)",borderRadius:24,padding:"20px 16px",marginBottom:16,border:"2px solid rgba(72,199,116,0.3)",display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",alignItems:"center"}}>
        {FOREST_ITEMS.map((item,i)=>(
          <div key={i} style={{fontSize:i===bjornPos?"2.2rem":"1.4rem",opacity:i>bjornPos?0.3:1,transition:"all 0.4s ease",filter:i===bjornPos?"drop-shadow(0 0 8px #FFD700)":"none"}}>
            {i===bjornPos?"🐻":item}
          </div>
        ))}
      </div>
      {collected.length>0&&(
        <div style={{marginBottom:16}}>
          <p style={{color:"#FFD700",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"0.85rem",marginBottom:8}}>🎒 Samlat / Собрано:</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
            {collected.map((item,i)=><span key={i} style={{fontSize:"1.8rem"}}>{item}</span>)}
          </div>
        </div>
      )}
      <button onClick={onClose} style={{padding:"12px 28px",borderRadius:50,border:"none",background:"linear-gradient(135deg,#FFD700,#ff9500)",color:"#1a1a2e",fontFamily:"'Nunito',sans-serif",fontWeight:800,cursor:"pointer",fontSize:"0.95rem"}}>← Tillbaka / Назад</button>
    </div>
  );
}

export default function SvenskaQuiz() {
  const [screen, setScreen]           = useState("home");
  const [theme, setTheme]             = useState(null);
  const [mode, setMode]               = useState("titta");
  const [words, setWords]             = useState([]);
  const [wordIndex, setWordIndex]     = useState(0);
  const [questions, setQuestions]     = useState([]);
  const [current, setCurrent]         = useState(0);
  const [score, setScore]             = useState(0);
  const [selected, setSelected]       = useState(null);
  const [sessionCollected, setSessionCollected] = useState([]);
  const [progress, setProgress]       = useState(()=>loadProgress());
  const [bjornMood, setBjornMood]     = useState("idle");
  const [bjornMsg, setBjornMsg]       = useState({sv:"Hej! Jag heter Björn!",ru:"Привет! Меня зовут Бьёрн!"});
  const [bjornTalking, setBjornTalking] = useState(false);
  const [micState, setMicState]       = useState("idle");
  const [heardText, setHeardText]     = useState("");
  const [retryCount, setRetryCount]   = useState(0);
  const [showTapBtns, setShowTapBtns] = useState(false);
  const [shake, setShake]             = useState(false);
  const [bounce, setBounce]           = useState(false);
  const [newItem, setNewItem]         = useState(null);
  // verb2 state
  const [verbIndex, setVerbIndex]     = useState(0);
  const [formIndex, setFormIndex]     = useState(0);

  const recRef       = useRef(null);
  const wordsRef     = useRef([]);
  const wordIdxRef   = useRef(0);
  const questionsRef = useRef([]);
  const currentRef   = useRef(0);
  const themeRef     = useRef(null);
  const verbIdxRef   = useRef(0);
  const formIdxRef   = useRef(0);

  useEffect(()=>{wordsRef.current=words;},[words]);
  useEffect(()=>{wordIdxRef.current=wordIndex;},[wordIndex]);
  useEffect(()=>{questionsRef.current=questions;},[questions]);
  useEffect(()=>{currentRef.current=current;},[current]);
  useEffect(()=>{verbIdxRef.current=verbIndex;},[verbIndex]);
  useEffect(()=>{formIdxRef.current=formIndex;},[formIndex]);
  useEffect(()=>{
    if(window.speechSynthesis.onvoiceschanged!==undefined)
      window.speechSynthesis.onvoiceschanged=()=>{};
  },[]);
  useEffect(()=>{
    try{recRef.current?.abort();}catch{}
    recRef.current=null;
    setMicState("idle");setHeardText("");setRetryCount(0);setShowTapBtns(false);
  },[wordIndex,current,formIndex]);

  const totalSteps = Object.values(progress).reduce((a,b)=>a+b,0);
  const allCollected = Object.entries(progress).flatMap(([tid,count])=>
    (COLLECTIBLES[tid]||[]).slice(0,Math.min(count,6))
  );

  const awardStep = useCallback((themeId)=>{
    setProgress(prev=>{
      const next={...prev,[themeId]:(prev[themeId]||0)+1};
      saveProgress(next);
      const collectibles=COLLECTIBLES[themeId]||[];
      const count=(prev[themeId]||0)+1;
      const item=collectibles[Math.min(count-1,collectibles.length-1)];
      if(item&&count<=collectibles.length){
        setNewItem(item);
        setSessionCollected(s=>[...s,item]);
        setTimeout(()=>setNewItem(null),2000);
      }
      return next;
    });
  },[]);

  const bjornReact = useCallback((mood)=>{
    setBjornMood(mood);setBjornTalking(false);
    if(mood==="great") setBjornMsg({sv:"✓",ru:""});
    else if(mood==="wrong") setBjornMsg({sv:"Försök igen!",ru:"Попробуй ещё раз!"});
    setTimeout(()=>setBjornMood("idle"),900);
  },[]);

  const bjornSay = useCallback(async(sv,ru="",mood="talking")=>{
    setBjornMood(mood);setBjornTalking(true);setBjornMsg({sv,ru});
    await speakOut(sv,"sv-SE",0.72,1.0);
    setBjornTalking(false);setBjornMood("idle");
  },[]);

  const speakWord = useCallback(async()=>{
    const w=wordsRef.current[wordIdxRef.current]; if(!w) return;
    setBjornMsg({sv:"Lyssna! / Слушай!",ru:""});setBjornMood("talking");setBjornTalking(true);
    await speakOut(w.sv,"sv-SE",0.68,1.0);
    setBjornTalking(false);setBjornMood("idle");
    setBjornMsg({sv:"Din tur!",ru:"Твоя очередь!"});
  },[]);

  const speakPhrase = useCallback(async(text)=>{
    setBjornMsg({sv:"Lyssna!",ru:"Слушай!"});setBjornMood("talking");setBjornTalking(true);
    await speakOut(text,"sv-SE",0.68,1.0);
    setBjornTalking(false);setBjornMood("idle");
    setBjornMsg({sv:"Din tur!",ru:"Твоя очередь!"});
  },[]);

  const startTheme = useCallback(async(t,selectedMode)=>{
    setTheme(t);themeRef.current=t;
    setMode(selectedMode);setSessionCollected([]);
    setScore(0);setSelected(null);setCurrent(0);
    setRetryCount(0);setShowTapBtns(false);setMicState("idle");setHeardText("");

    if(t.id==="verb2"){
      setVerbIndex(0);verbIdxRef.current=0;
      setFormIndex(0);formIdxRef.current=0;
      setScreen("verb2");
      setBjornMsg({sv:"Lyssna och upprepa!",ru:"Слушай и повторяй!"});
      await new Promise(r=>setTimeout(r,400));
      await speakPhrase(VERB_PHRASES[0].forms[0].sv);
      return;
    }

    const w=WORDS[t.id]||[];
    setWords(w);wordsRef.current=w;
    setWordIndex(0);wordIdxRef.current=0;

    if(selectedMode==="titta"){
      setScreen("titta");
      setBjornMsg({sv:"Lyssna och titta!",ru:"Слушай и смотри!"});
      setBjornMood("happy");
      await new Promise(r=>setTimeout(r,400));
      await speakOut(w[0].sv,"sv-SE",0.68,1.0);
      setBjornMood("idle");
    } else if(selectedMode==="listen"){
      setScreen("listen");
      await bjornSay("Lyssna och upprepa!","Слушай и повторяй!","happy");
      await new Promise(r=>setTimeout(r,200));
      await speakWord();
    } else {
      const qs=buildQuizQuestions(w);
      setQuestions(qs);questionsRef.current=qs;
      setScreen("quiz");
      await bjornSay("Dags för quiz!","Время для теста!","happy");
    }
  },[bjornSay,speakWord,speakPhrase]);

  const tittaNext = useCallback(async()=>{
    const next=wordIdxRef.current+1;
    if(next>=wordsRef.current.length){setScreen("result");return;}
    setWordIndex(next);
    await new Promise(r=>setTimeout(r,300));
    await speakOut(wordsRef.current[next].sv,"sv-SE",0.68,1.0);
  },[]);

  const startListening = useCallback(()=>{
    try{recRef.current?.abort();}catch{}
    recRef.current=null;
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){setShowTapBtns(true);return;}
    setMicState("listening");
    const rec=new SR();
    rec.continuous=false;rec.interimResults=false;rec.maxAlternatives=5;rec.lang="sv-SE";
    recRef.current=rec;
    rec.onresult=async(e)=>{
      const transcripts=Array.from(e.results[0]).map(r=>r.transcript);
      setHeardText(transcripts[0]||"");
      const w=wordsRef.current[wordIdxRef.current]; if(!w) return;
      const matched=transcripts.some(t=>isCloseEnough(t,w.sv));
      if(matched){
        setMicState("correct");setScore(s=>s+1);
        setBounce(true);setTimeout(()=>setBounce(false),600);
        awardStep(themeRef.current?.id);bjornReact("great");
        await speakOut(w.sv,"sv-SE",0.68,1.0);
        await new Promise(r=>setTimeout(r,200));
        const next=wordIdxRef.current+1;
        if(next>=wordsRef.current.length)setScreen("result");
        else{setWordIndex(next);setTimeout(speakWord,400);}
      } else {
        setMicState("wrong");setShake(true);setTimeout(()=>setShake(false),500);
        setRetryCount(r=>{const n=r+1;if(n>=2)setShowTapBtns(true);return n;});
        bjornReact("wrong");
        await speakOut(w.sv,"sv-SE",0.62,1.0);
        setMicState("idle");
      }
    };
    rec.onerror=(e)=>{if(e.error==="not-allowed")setShowTapBtns(true);setMicState("idle");};
    rec.onend=()=>setMicState(s=>s==="listening"?"idle":s);
    try{rec.start();}catch{setMicState("idle");}
  },[bjornReact,speakWord,awardStep]);

  const startQuizMic = useCallback(()=>{
    try{recRef.current?.abort();}catch{}
    recRef.current=null;
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){setShowTapBtns(true);return;}
    setMicState("listening");
    const rec=new SR();
    rec.continuous=false;rec.interimResults=false;rec.maxAlternatives=5;rec.lang="sv-SE";
    recRef.current=rec;
    rec.onresult=async(e)=>{
      const transcripts=Array.from(e.results[0]).map(r=>r.transcript);
      setHeardText(transcripts[0]||"");
      const q=questionsRef.current[currentRef.current]; if(!q) return;
      const matched=transcripts.some(t=>isCloseEnough(t,q.sv));
      if(matched){
        setMicState("correct");setScore(s=>s+1);
        awardStep(themeRef.current?.id);bjornReact("great");
        await speakOut(q.sv,"sv-SE",0.68,1.0);
        setTimeout(()=>{
          const next=currentRef.current+1;
          if(next>=questionsRef.current.length)setScreen("result");
          else{setCurrent(next);setMicState("idle");setHeardText("");setRetryCount(0);}
        },1000);
      } else {
        setMicState("wrong");setShake(true);setTimeout(()=>setShake(false),500);
        setRetryCount(r=>{const n=r+1;if(n>=2)setShowTapBtns(true);return n;});
        bjornReact("wrong");
        await speakOut(q.sv,"sv-SE",0.62,1.0);
        setMicState("idle");
      }
    };
    rec.onerror=()=>setMicState("idle");
    rec.onend=()=>setMicState(s=>s==="listening"?"idle":s);
    try{rec.start();}catch{setMicState("idle");}
  },[bjornReact,awardStep]);

  // Verb2 mic — listen for the Swedish phrase
  const startPhraseMic = useCallback(()=>{
    try{recRef.current?.abort();}catch{}
    recRef.current=null;
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){setShowTapBtns(true);return;}
    setMicState("listening");
    const rec=new SR();
    rec.continuous=false;rec.interimResults=false;rec.maxAlternatives=5;rec.lang="sv-SE";
    recRef.current=rec;
    rec.onresult=async(e)=>{
      const transcripts=Array.from(e.results[0]).map(r=>r.transcript);
      setHeardText(transcripts[0]||"");
      const vp=VERB_PHRASES[verbIdxRef.current];
      const form=vp.forms[formIdxRef.current];
      if(!form) return;
      const matched=transcripts.some(t=>isCloseEnough(t,form.sv));
      if(matched){
        setMicState("correct");setScore(s=>s+1);
        setBounce(true);setTimeout(()=>setBounce(false),600);
        awardStep(themeRef.current?.id);bjornReact("great");
        await speakOut(form.sv,"sv-SE",0.68,1.0);
        await new Promise(r=>setTimeout(r,300));
        // advance to next form or next verb
        const nextForm=formIdxRef.current+1;
        if(nextForm>=vp.forms.length){
          const nextVerb=verbIdxRef.current+1;
          if(nextVerb>=VERB_PHRASES.length){setScreen("result");return;}
          setVerbIndex(nextVerb);verbIdxRef.current=nextVerb;
          setFormIndex(0);formIdxRef.current=0;
        } else {
          setFormIndex(nextForm);formIdxRef.current=nextForm;
        }
        setMicState("idle");
        await new Promise(r=>setTimeout(r,400));
        await speakPhrase(VERB_PHRASES[verbIdxRef.current].forms[formIdxRef.current].sv);
      } else {
        setMicState("wrong");setShake(true);setTimeout(()=>setShake(false),500);
        bjornReact("wrong");
        await speakOut(form.sv,"sv-SE",0.62,1.0);
        setMicState("idle");
      }
    };
    rec.onerror=()=>setMicState("idle");
    rec.onend=()=>setMicState(s=>s==="listening"?"idle":s);
    try{rec.start();}catch{setMicState("idle");}
  },[bjornReact,awardStep,speakPhrase]);

  const handleTap = useCallback(async(option)=>{
    if(selected!==null) return;
    setSelected(option);
    const q=questionsRef.current[currentRef.current]; if(!q) return;
    if(option===q.sv){
      setScore(s=>s+1);setBounce(true);setTimeout(()=>setBounce(false),600);
      awardStep(themeRef.current?.id);bjornReact("great");
      await speakOut(q.sv,"sv-SE",0.68,1.0);
    } else {
      setShake(true);setTimeout(()=>setShake(false),500);
      bjornReact("wrong");
      await speakOut(q.sv,"sv-SE",0.65,1.0);
    }
    setTimeout(()=>{
      setSelected(null);
      const next=currentRef.current+1;
      if(next>=questionsRef.current.length)setScreen("result");
      else setCurrent(next);
    },1400);
  },[selected,bjornReact,awardStep]);

  const skipWord=()=>{
    try{recRef.current?.abort();}catch{}
    const next=wordIdxRef.current+1;
    if(next>=wordsRef.current.length)setScreen("result");
    else{setWordIndex(next);setTimeout(speakWord,400);}
  };

  const w=words[wordIndex];
  const q=questions[current];
  const totalAnswered=words.length||questions.length||1;
  const getStars=()=>{const p=score/totalAnswered;return p===1?"🌟🌟🌟":p>=0.6?"⭐⭐":"⭐";};
  const micColor=micState==="listening"?"#ff4444":micState==="correct"?"#48c774":micState==="wrong"?"#FFD700":"#a0c4ff";
  const micBg=micState==="listening"?"rgba(255,68,68,0.2)":micState==="correct"?"rgba(72,199,116,0.2)":micState==="wrong"?"rgba(255,215,0,0.15)":"rgba(255,255,255,0.08)";
  const micIcon=micState==="listening"?"🔴":micState==="correct"?"✅":micState==="wrong"?"🔁":"🎤";

  const currentVP = VERB_PHRASES[verbIndex];
  const currentForm = currentVP?.forms[formIndex];
  const totalForms = VERB_PHRASES.reduce((a,vp)=>a+vp.forms.length,0);
  const doneFormsCount = VERB_PHRASES.slice(0,verbIndex).reduce((a,vp)=>a+vp.forms.length,0)+formIndex;

  const MODES=[
    {val:"titta",label:"👀 Titta & Lyssna",sub:"Смотри и слушай"},
    {val:"listen",label:"👂 Upprepa",sub:"Повторяй"},
    {val:"quiz",label:"🎯 Quiz",sub:"Тест"},
  ];

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0d1b4b 0%,#1a3a6b 40%,#0d4a3a 100%)",fontFamily:"'Fredoka One',cursive",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"16px",position:"relative",overflow:"hidden"}}>
      <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;800;900&display=swap" rel="stylesheet"/>
      {[...Array(10)].map((_,i)=>(
        <div key={i} style={{position:"absolute",opacity:0.12,top:`${10+i*9}%`,left:`${i%2===0?2+i:85-i}%`,fontSize:"1.2rem",pointerEvents:"none",animation:`twinkle ${2+i*0.4}s ease-in-out infinite alternate`}}>🌲</div>
      ))}
      <style>{`
        @keyframes twinkle{from{opacity:0.08;transform:scale(0.9)}to{opacity:0.2;transform:scale(1.05)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-10px)}40%,80%{transform:translateX(10px)}}
        @keyframes bounce{0%,100%{transform:scale(1)}40%{transform:scale(1.15)}70%{transform:scale(0.95)}}
        @keyframes bjornTalk{0%,100%{transform:rotate(0) scale(1)}25%{transform:rotate(-4deg) scale(1.04)}75%{transform:rotate(4deg) scale(1.04)}}
        @keyframes bjornHappy{0%,100%{transform:scale(1) rotate(0)}30%{transform:scale(1.18) rotate(-8deg)}60%{transform:scale(1.18) rotate(8deg)}}
        @keyframes micring{0%{box-shadow:0 0 0 0 rgba(255,68,68,0.8)}70%{box-shadow:0 0 0 22px rgba(255,68,68,0)}100%{box-shadow:0 0 0 0 rgba(255,68,68,0)}}
        @keyframes itemPop{0%{transform:scale(0) translateY(0);opacity:0}50%{transform:scale(1.4) translateY(-20px);opacity:1}100%{transform:scale(1) translateY(-40px);opacity:0}}
        @keyframes pop{0%{transform:scale(0.85);opacity:0}100%{transform:scale(1);opacity:1}}
        .card{animation:fadeIn 0.45s ease}
        .shake{animation:shake 0.5s ease}
        .bounce{animation:bounce 0.6s ease}
        .bjorn-talk{animation:bjornTalk 0.55s ease infinite}
        .bjorn-happy{animation:bjornHappy 0.65s ease}
        .micring{animation:micring 1.1s ease-out infinite}
        .item-pop{animation:itemPop 2s ease forwards}
        .pop{animation:pop 0.3s ease both}
        .opt:hover:not(:disabled){transform:scale(1.05);filter:brightness(1.15)}
        .opt{transition:all 0.15s ease}
        .tbtn:hover{transform:translateY(-3px) scale(1.04);box-shadow:0 8px 24px rgba(0,0,0,0.3)}
        .tbtn{transition:all 0.2s ease}
      `}</style>

      {newItem&&<div className="item-pop" style={{position:"fixed",top:"30%",left:"50%",transform:"translateX(-50%)",fontSize:"3rem",zIndex:200,pointerEvents:"none"}}>{newItem}</div>}
      {screen!=="home"&&screen!=="forest"&&(
        <button onClick={()=>setScreen("forest")} style={{position:"fixed",top:12,left:12,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(10px)",borderRadius:20,padding:"6px 12px",border:"1px solid rgba(72,199,116,0.4)",color:"#48c774",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"0.8rem",cursor:"pointer",zIndex:100,display:"flex",alignItems:"center",gap:6}}>🌲 {totalSteps}</button>
      )}

      {/* ══ HOME ══ */}
      {screen==="home"&&(
        <div className="card" style={{textAlign:"center",maxWidth:520,width:"100%"}}>
          <div style={{fontSize:"5rem",marginBottom:4,filter:"drop-shadow(0 4px 16px rgba(0,0,0,0.4))"}}>🐻</div>
          <h1 style={{color:"#FFD700",fontSize:"2.2rem",margin:"0 0 4px",textShadow:"0 2px 16px rgba(255,215,0,0.5)"}}>Svenska med Björn!</h1>
          <p style={{color:"#a0d4ff",fontSize:"0.85rem",marginBottom:4,fontFamily:"'Nunito',sans-serif"}}>Учи шведский с Бьёрном! 🇸🇪</p>
          <button onClick={()=>setScreen("forest")} style={{display:"inline-flex",alignItems:"center",gap:8,margin:"6px 0 14px",background:"rgba(72,199,116,0.15)",border:"1px solid rgba(72,199,116,0.4)",borderRadius:30,padding:"5px 14px",cursor:"pointer"}}>
            <span>🌲</span>
            <span style={{color:"#48c774",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"0.78rem"}}>{totalSteps} / {TOTAL_STEPS} steg</span>
          </button>
          <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:16}}>
            {MODES.map(m=>(
              <button key={m.val} onClick={()=>setMode(m.val)} style={{padding:"8px 8px",borderRadius:16,border:"2px solid",borderColor:mode===m.val?"#FFD700":"rgba(255,255,255,0.2)",background:mode===m.val?"#FFD700":"rgba(255,255,255,0.07)",color:mode===m.val?"#1a1a2e":"white",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"0.72rem",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1,flex:1,maxWidth:120}}>
                <span>{m.label}</span>
                <span style={{fontSize:"0.6rem",opacity:0.8}}>{m.sub}</span>
              </button>
            ))}
          </div>
          <p style={{color:"#7eb8f7",fontSize:"0.8rem",marginBottom:10,fontFamily:"'Nunito',sans-serif"}}>Välj ett ämne / Выбери тему:</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {THEMES.map(t=>(
              <button key={t.id} className="tbtn" onClick={()=>startTheme(t,mode)} style={{padding:"12px 8px",borderRadius:18,border:"2px solid rgba(255,255,255,0.15)",background:t.id==="verb1"?"rgba(255,215,0,0.08)":t.id==="verb2"?"rgba(72,199,116,0.08)":"rgba(255,255,255,0.07)",backdropFilter:"blur(8px)",color:"white",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                <span style={{fontSize:"1.8rem"}}>{t.emoji}</span>
                <span style={{fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"0.8rem"}}>{t.label}</span>
                <span style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.62rem",opacity:0.65}}>{t.labelRu}</span>
                {(progress[t.id]||0)>0&&<span style={{fontSize:"0.65rem",color:"#48c774",fontFamily:"'Nunito',sans-serif",fontWeight:800}}>✓ {progress[t.id]}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ══ FOREST ══ */}
      {screen==="forest"&&<ForestMap steps={totalSteps} collected={allCollected} onClose={()=>setScreen("home")}/>}

      {/* ══ TITTA ══ */}
      {screen==="titta"&&w&&(
        <div className="card" style={{maxWidth:440,width:"100%",textAlign:"center"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <span style={{color:"#a0c4ff",fontFamily:"'Nunito',sans-serif",fontSize:"0.82rem"}}>{wordIndex+1} / {words.length}</span>
            <div style={{flex:1,margin:"0 10px",height:8,background:"rgba(255,255,255,0.1)",borderRadius:10,overflow:"hidden"}}>
              <div style={{width:`${((wordIndex+1)/words.length)*100}%`,height:"100%",background:"linear-gradient(90deg,#48c774,#ff9500)",borderRadius:10,transition:"width 0.4s ease"}}/>
            </div>
            <span style={{color:"#48c774",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"0.82rem"}}>👀</span>
          </div>
          <div style={{marginBottom:10}}>
            <div className={bjornTalking?"bjorn-talk":bjornMood==="happy"?"bjorn-happy":""} style={{fontSize:"4rem",display:"inline-block",filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.3))"}}>{bjornMood==="happy"?"🥳":"🐻"}</div>
            <div style={{background:"rgba(255,255,255,0.1)",borderRadius:14,padding:"6px 14px",margin:"6px auto 0",maxWidth:280,border:"1px solid rgba(255,255,255,0.15)"}}>
              <div style={{color:"white",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"0.85rem"}}>{bjornMsg.sv}</div>
              {bjornMsg.ru&&<div style={{color:"#a0c4ff",fontFamily:"'Nunito',sans-serif",fontSize:"0.7rem",marginTop:2}}>{bjornMsg.ru}</div>}
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,0.09)",borderRadius:26,padding:"28px 18px",marginBottom:18,border:"1px solid rgba(255,255,255,0.15)",backdropFilter:"blur(12px)"}}>
            <div style={{fontSize:"5rem",marginBottom:10}}>{w.emoji}</div>
            <div style={{color:"#FFD700",fontSize:"2.8rem",fontWeight:700,marginBottom:8,letterSpacing:1}}>{w.sv}</div>
            <div style={{color:"rgba(255,255,255,0.35)",fontSize:"1rem",marginBottom:4,fontFamily:"'Nunito',sans-serif"}}>—</div>
            <div style={{color:"#a0d4ff",fontSize:"1.4rem",fontFamily:"'Nunito',sans-serif",fontWeight:800}}>{w.ru}</div>
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:14}}>
            <button onClick={()=>speakOut(w.sv,"sv-SE",0.68,1.0)} style={{padding:"12px 18px",borderRadius:50,border:"2px solid #FFD700",background:"rgba(255,215,0,0.15)",color:"#FFD700",fontFamily:"'Nunito',sans-serif",fontWeight:800,cursor:"pointer",fontSize:"0.85rem"}}>🔊 Lyssna igen</button>
            {wordIndex+1<words.length?(
              <button onClick={tittaNext} style={{padding:"12px 20px",borderRadius:50,border:"none",background:"linear-gradient(135deg,#FFD700,#ff9500)",color:"#1a1a2e",fontFamily:"'Nunito',sans-serif",fontWeight:800,cursor:"pointer",fontSize:"0.85rem"}}>Nästa →</button>
            ):(
              <button onClick={()=>setScreen("result")} style={{padding:"12px 20px",borderRadius:50,border:"none",background:"linear-gradient(135deg,#48c774,#00a854)",color:"white",fontFamily:"'Nunito',sans-serif",fontWeight:800,cursor:"pointer",fontSize:"0.85rem"}}>Klart! ✓</button>
            )}
          </div>
          <button onClick={()=>setScreen("home")} style={{background:"transparent",border:"none",color:"#7eb8f7",fontFamily:"'Nunito',sans-serif",cursor:"pointer",fontSize:"0.8rem"}}>← Hem / Домой</button>
        </div>
      )}

      {/* ══ LISTEN ══ */}
      {screen==="listen"&&w&&(
        <div className={`card ${shake?"shake":""} ${bounce?"bounce":""}`} style={{maxWidth:440,width:"100%",textAlign:"center"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <span style={{color:"#a0c4ff",fontFamily:"'Nunito',sans-serif",fontSize:"0.82rem"}}>{wordIndex+1} / {words.length}</span>
            <div style={{flex:1,margin:"0 10px",height:8,background:"rgba(255,255,255,0.1)",borderRadius:10,overflow:"hidden"}}>
              <div style={{width:`${((wordIndex+1)/words.length)*100}%`,height:"100%",background:"linear-gradient(90deg,#FFD700,#ff9500)",borderRadius:10,transition:"width 0.4s ease"}}/>
            </div>
            <span style={{color:"#48c774",fontFamily:"'Nunito',sans-serif",fontWeight:800}}>⭐{score}</span>
          </div>
          <div style={{marginBottom:10}}>
            <div className={bjornTalking?"bjorn-talk":bjornMood==="great"?"bjorn-happy":""} style={{fontSize:"4rem",display:"inline-block",filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.3))"}}>{bjornMood==="great"?"🥳":"🐻"}</div>
            <div style={{background:"rgba(255,255,255,0.1)",borderRadius:14,padding:"6px 14px",margin:"6px auto 0",maxWidth:280,border:"1px solid rgba(255,255,255,0.15)"}}>
              <div style={{color:"white",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"0.85rem"}}>{bjornMsg.sv}</div>
              {bjornMsg.ru&&<div style={{color:"#a0c4ff",fontFamily:"'Nunito',sans-serif",fontSize:"0.7rem",marginTop:2}}>{bjornMsg.ru}</div>}
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,0.09)",borderRadius:26,padding:"22px 18px",marginBottom:14,border:"1px solid rgba(255,255,255,0.15)",backdropFilter:"blur(12px)"}}>
            <div style={{fontSize:"4rem",marginBottom:8}}>{w.emoji}</div>
            <div style={{color:"#FFD700",fontSize:"2.6rem",fontWeight:700,marginBottom:4,letterSpacing:1}}>{w.sv}</div>
            <div style={{color:"#a0d4ff",fontSize:"1.1rem",fontFamily:"'Nunito',sans-serif",fontWeight:700}}>{w.ru}</div>
            <button onClick={speakWord} style={{marginTop:10,background:"rgba(255,215,0,0.15)",border:"2px solid #FFD700",borderRadius:50,padding:"6px 16px",color:"#FFD700",fontFamily:"'Nunito',sans-serif",fontWeight:800,cursor:"pointer",fontSize:"0.78rem"}}>🔊 Lyssna igen</button>
          </div>
          {!showTapBtns?(
            <div style={{textAlign:"center"}}>
              <button className={micState==="listening"?"micring":""} onClick={micState==="listening"?()=>{try{recRef.current?.stop();}catch{}setMicState("idle");}:startListening} disabled={micState==="correct"} style={{width:84,height:84,borderRadius:"50%",border:`3px solid ${micColor}`,background:micBg,cursor:micState==="correct"?"default":"pointer",fontSize:"2.2rem",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",transition:"all 0.25s ease"}}>{micIcon}</button>
              <div style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.82rem",color:"#a0c4ff",minHeight:24}}>
                {micState==="idle"&&"🎤 Säg ordet på svenska! / Скажи по-шведски!"}
                {micState==="listening"&&<span style={{color:"#ff9999"}}>🔴 Слушаю... / Listening...</span>}
                {micState==="wrong"&&heardText&&<span style={{color:"#ff9999"}}>Jag hörde: "{heardText}"</span>}
                {micState==="correct"&&<span style={{color:"#48c774",fontWeight:800}}>✅ Perfekt!</span>}
              </div>
              {retryCount>0&&micState!=="correct"&&<button onClick={skipWord} style={{marginTop:6,background:"transparent",border:"none",color:"#7eb8f7",fontFamily:"'Nunito',sans-serif",cursor:"pointer",fontSize:"0.75rem"}}>Hoppa över / Пропустить →</button>}
            </div>
          ):(
            <div>
              <p style={{color:"#FFD700",fontFamily:"'Nunito',sans-serif",fontSize:"0.78rem",marginBottom:10}}>Tryck på det svenska ordet! / Нажми шведское слово!</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[w.sv,...words.filter((_,i)=>i!==wordIndex).sort(()=>Math.random()-0.5).slice(0,3).map(x=>x.sv)].sort(()=>Math.random()-0.5).map((opt,i)=>(
                  <button key={i} className="opt pop" onClick={async()=>{
                    if(opt===w.sv){setScore(s=>s+1);setBounce(true);setTimeout(()=>setBounce(false),600);awardStep(themeRef.current?.id);bjornReact("great");await speakOut(w.sv,"sv-SE",0.68,1.0);const next=wordIndex+1;if(next>=words.length)setScreen("result");else{setWordIndex(next);setShowTapBtns(false);setTimeout(speakWord,400);}}else{setShake(true);setTimeout(()=>setShake(false),500);bjornReact("wrong");await speakOut(w.sv,"sv-SE",0.65,1.0);}
                  }} style={{padding:"13px 8px",borderRadius:16,border:"2px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.08)",color:"white",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"0.9rem",cursor:"pointer",backdropFilter:"blur(8px)",animationDelay:`${i*0.07}s`}}>{opt}</button>
                ))}
              </div>
            </div>
          )}
          <button onClick={()=>setScreen("home")} style={{marginTop:14,background:"transparent",border:"none",color:"#7eb8f7",fontFamily:"'Nunito',sans-serif",cursor:"pointer",fontSize:"0.78rem"}}>← Hem / Домой</button>
        </div>
      )}

      {/* ══ QUIZ ══ */}
      {screen==="quiz"&&q&&(
        <div className={`card ${shake?"shake":""}`} style={{maxWidth:460,width:"100%",textAlign:"center"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <span style={{color:"#a0c4ff",fontFamily:"'Nunito',sans-serif",fontSize:"0.82rem"}}>{current+1} / {questions.length}</span>
            <div style={{flex:1,margin:"0 10px",height:8,background:"rgba(255,255,255,0.1)",borderRadius:10,overflow:"hidden"}}>
              <div style={{width:`${((current+1)/questions.length)*100}%`,height:"100%",background:"linear-gradient(90deg,#FFD700,#ff9500)",borderRadius:10,transition:"width 0.4s ease"}}/>
            </div>
            <span style={{color:"#48c774",fontFamily:"'Nunito',sans-serif",fontWeight:800}}>⭐{score}</span>
          </div>
          <div style={{marginBottom:10}}>
            <div className={bjornTalking?"bjorn-talk":bjornMood==="great"?"bjorn-happy":""} style={{fontSize:"3.5rem",display:"inline-block"}}>{bjornMood==="great"?"🥳":"🐻"}</div>
            <div style={{background:"rgba(255,255,255,0.08)",borderRadius:14,padding:"6px 14px",margin:"6px auto 0",maxWidth:260,border:"1px solid rgba(255,255,255,0.12)"}}>
              <div style={{color:"white",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"0.82rem"}}>{bjornMsg.sv}</div>
              {bjornMsg.ru&&<div style={{color:"#a0c4ff",fontFamily:"'Nunito',sans-serif",fontSize:"0.68rem"}}>{bjornMsg.ru}</div>}
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,0.08)",borderRadius:22,padding:"18px 16px",marginBottom:12,border:"1px solid rgba(255,255,255,0.12)",backdropFilter:"blur(10px)"}}>
            <div style={{fontSize:"3rem",marginBottom:8}}>{q.emoji}</div>
            <div style={{color:"#a0d4ff",fontSize:"1.9rem",fontFamily:"'Nunito',sans-serif",fontWeight:800,marginBottom:6}}>{q.ru}</div>
            <div style={{color:"rgba(255,255,255,0.45)",fontFamily:"'Nunito',sans-serif",fontSize:"0.78rem"}}>Hur säger man på svenska? / Как по-шведски?</div>
          </div>
          {!showTapBtns&&(
            <div style={{textAlign:"center",marginBottom:10}}>
              <button className={micState==="listening"?"micring":""} onClick={micState==="listening"?()=>{try{recRef.current?.stop();}catch{}setMicState("idle");}:startQuizMic} disabled={micState==="correct"} style={{width:72,height:72,borderRadius:"50%",border:`3px solid ${micColor}`,background:micBg,cursor:micState==="correct"?"default":"pointer",fontSize:"1.9rem",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 8px",transition:"all 0.25s ease"}}>{micIcon}</button>
              <div style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.78rem",color:"#a0c4ff",minHeight:22}}>
                {micState==="idle"&&"🎤 Säg det på svenska! / Скажи по-шведски!"}
                {micState==="listening"&&<span style={{color:"#ff9999"}}>🔴 Listening... / Слушаю...</span>}
                {micState==="correct"&&<span style={{color:"#48c774",fontWeight:800}}>✅ Perfekt!</span>}
                {micState==="wrong"&&heardText&&<span style={{color:"#ff9999"}}>"{heardText}" — försök igen!</span>}
              </div>
              {retryCount>0&&micState!=="correct"&&<button onClick={()=>setShowTapBtns(true)} style={{marginTop:4,background:"transparent",border:"none",color:"#7eb8f7",fontFamily:"'Nunito',sans-serif",cursor:"pointer",fontSize:"0.74rem"}}>Använd knappar / Использовать кнопки</button>}
            </div>
          )}
          {showTapBtns&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {q.options.map((opt,i)=>{
                const isSel=selected===opt,isRight=opt===q.sv;
                let bg="rgba(255,255,255,0.07)",bc="rgba(255,255,255,0.12)";
                if(selected!==null){if(isRight){bg="rgba(72,199,116,0.3)";bc="#48c774";}else if(isSel){bg="rgba(255,107,107,0.3)";bc="#ff6b6b";}}
                return(
                  <button key={i} className="opt pop" disabled={selected!==null} onClick={()=>handleTap(opt)} style={{padding:"13px 8px",borderRadius:16,border:`2px solid ${bc}`,background:bg,color:"white",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:"0.9rem",cursor:selected!==null?"default":"pointer",backdropFilter:"blur(8px)",animationDelay:`${i*0.07}s`}}>
                    {selected!==null&&isRight&&"✅ "}{isSel&&!isRight&&"❌ "}{opt}
                  </button>
                );
              })}
            </div>
          )}
          <button onClick={()=>setScreen("home")} style={{marginTop:14,background:"transparent",border:"none",color:"#7eb8f7",fontFamily:"'Nunito',sans-serif",cursor:"pointer",fontSize:"0.78rem"}}>← Hem / Домой</button>
        </div>
      )}

      {/* ══ VERB2 — Conjugation phrases ══ */}
      {screen==="verb2"&&currentVP&&currentForm&&(
        <div className={`card ${shake?"shake":""} ${bounce?"bounce":""}`} style={{maxWidth:460,width:"100%",textAlign:"center"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <span style={{color:"#a0c4ff",fontFamily:"'Nunito',sans-serif",fontSize:"0.78rem"}}>{currentVP.verb} · {formIndex+1}/{currentVP.forms.length}</span>
            <div style={{flex:1,margin:"0 10px",height:8,background:"rgba(255,255,255,0.1)",borderRadius:10,overflow:"hidden"}}>
              <div style={{width:`${(doneFormsCount/totalForms)*100}%`,height:"100%",background:"linear-gradient(90deg,#48c774,#FFD700)",borderRadius:10,transition:"width 0.4s ease"}}/>
            </div>
            <span style={{color:"#48c774",fontFamily:"'Nunito',sans-serif",fontWeight:800}}>⭐{score}</span>
          </div>

          <div style={{marginBottom:10}}>
            <div className={bjornTalking?"bjorn-talk":bjornMood==="great"?"bjorn-happy":""} style={{fontSize:"3.8rem",display:"inline-block"}}>{bjornMood==="great"?"🥳":"🐻"}</div>
            <div style={{background:"rgba(255,255,255,0.1)",borderRadius:14,padding:"6px 14px",margin:"6px auto 0",maxWidth:280,border:"1px solid rgba(255,255,255,0.15)"}}>
              <div style={{color:"white",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"0.85rem"}}>{bjornMsg.sv}</div>
              {bjornMsg.ru&&<div style={{color:"#a0c4ff",fontFamily:"'Nunito',sans-serif",fontSize:"0.7rem",marginTop:2}}>{bjornMsg.ru}</div>}
            </div>
          </div>

          {/* Current verb header */}
          <div style={{background:"rgba(255,215,0,0.1)",borderRadius:16,padding:"10px 16px",marginBottom:12,border:"1px solid rgba(255,215,0,0.2)"}}>
            <span style={{fontSize:"1.8rem"}}>{currentVP.emoji}</span>
            <span style={{color:"#FFD700",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"1rem",marginLeft:8}}>{currentVP.verb}</span>
          </div>

          {/* The phrase to repeat */}
          <div style={{background:"rgba(255,255,255,0.09)",borderRadius:22,padding:"20px 16px",marginBottom:14,border:"1px solid rgba(255,255,255,0.15)",backdropFilter:"blur(12px)"}}>
            <div style={{color:"#FFD700",fontSize:"2rem",fontWeight:700,marginBottom:6,letterSpacing:0.5}}>{currentForm.sv}</div>
            <div style={{color:"#a0d4ff",fontSize:"1.2rem",fontFamily:"'Nunito',sans-serif",fontWeight:700}}>{currentForm.ru}</div>
            <button onClick={()=>speakPhrase(currentForm.sv)} style={{marginTop:10,background:"rgba(255,215,0,0.15)",border:"2px solid #FFD700",borderRadius:50,padding:"6px 16px",color:"#FFD700",fontFamily:"'Nunito',sans-serif",fontWeight:800,cursor:"pointer",fontSize:"0.78rem"}}>🔊 Lyssna igen</button>
          </div>

          {/* All forms of this verb as a mini table */}
          <div style={{background:"rgba(255,255,255,0.05)",borderRadius:16,padding:"10px 14px",marginBottom:14,border:"1px solid rgba(255,255,255,0.08)"}}>
            {currentVP.forms.map((f,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:i<currentVP.forms.length-1?"1px solid rgba(255,255,255,0.06)":"none",opacity:i===formIndex?1:0.4}}>
                <span style={{color:i===formIndex?"#FFD700":"white",fontFamily:"'Nunito',sans-serif",fontWeight:i===formIndex?800:400,fontSize:"0.82rem"}}>{f.sv}</span>
                <span style={{color:i===formIndex?"#a0d4ff":"rgba(160,212,255,0.5)",fontFamily:"'Nunito',sans-serif",fontSize:"0.82rem"}}>{f.ru}</span>
              </div>
            ))}
          </div>

          {/* Mic */}
          <div style={{textAlign:"center"}}>
            <button className={micState==="listening"?"micring":""} onClick={micState==="listening"?()=>{try{recRef.current?.stop();}catch{}setMicState("idle");}:startPhraseMic} disabled={micState==="correct"} style={{width:80,height:80,borderRadius:"50%",border:`3px solid ${micColor}`,background:micBg,cursor:micState==="correct"?"default":"pointer",fontSize:"2rem",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",transition:"all 0.25s ease"}}>{micIcon}</button>
            <div style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.8rem",color:"#a0c4ff",minHeight:22}}>
              {micState==="idle"&&"🎤 Säg hela meningen! / Скажи всю фразу!"}
              {micState==="listening"&&<span style={{color:"#ff9999"}}>🔴 Listening... / Слушаю...</span>}
              {micState==="correct"&&<span style={{color:"#48c774",fontWeight:800}}>✅ Perfekt!</span>}
              {micState==="wrong"&&heardText&&<span style={{color:"#ff9999"}}>"{heardText}" — försök igen!</span>}
            </div>
          </div>

          <button onClick={()=>setScreen("home")} style={{marginTop:12,background:"transparent",border:"none",color:"#7eb8f7",fontFamily:"'Nunito',sans-serif",cursor:"pointer",fontSize:"0.78rem"}}>← Hem / Домой</button>
        </div>
      )}

      {/* ══ RESULT ══ */}
      {screen==="result"&&(
        <div className="card" style={{textAlign:"center",maxWidth:420,width:"100%"}}>
          <div className="bjorn-happy" style={{fontSize:"5rem",display:"inline-block",marginBottom:6}}>🥳</div>
          <div style={{fontSize:"2rem",marginBottom:6}}>{getStars()}</div>
          <h2 style={{color:"#FFD700",fontSize:"1.8rem",margin:"0 0 4px"}}>{score>=totalAnswered*0.8?"Fantastiskt!":"Bra jobbat!"}</h2>
          {mode!=="titta"&&(
            <div style={{background:"rgba(255,255,255,0.08)",borderRadius:20,padding:"14px",margin:"10px 0 12px",border:"1px solid rgba(255,255,255,0.12)"}}>
              <div style={{color:"white",fontSize:"2.4rem",fontWeight:700}}>{score}/{totalAnswered}</div>
              <div style={{color:"#7eb8f7",fontFamily:"'Nunito',sans-serif",fontSize:"0.82rem"}}>rätta svar / правильных ответов</div>
            </div>
          )}
          {mode==="titta"&&<p style={{color:"#a0c4ff",fontFamily:"'Nunito',sans-serif",fontSize:"0.9rem",margin:"10px 0 14px"}}>Du har sett alla ord! / Ты посмотрел все слова! 🎉</p>}
          {sessionCollected.length>0&&(
            <div style={{background:"rgba(72,199,116,0.1)",border:"1px solid rgba(72,199,116,0.3)",borderRadius:16,padding:"12px",marginBottom:12}}>
              <div style={{color:"#48c774",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"0.82rem",marginBottom:6}}>🎒 Björn hittade / Бьёрн нашёл:</div>
              <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
                {sessionCollected.map((item,i)=><span key={i} style={{fontSize:"1.8rem"}}>{item}</span>)}
              </div>
            </div>
          )}
          <div style={{background:"rgba(255,255,255,0.06)",borderRadius:16,padding:"10px 14px",marginBottom:14}}>
            <div style={{color:"#48c774",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"0.8rem",marginBottom:6}}>🌲 {totalSteps} / {TOTAL_STEPS} steg</div>
            <div style={{height:8,background:"rgba(255,255,255,0.1)",borderRadius:10,overflow:"hidden"}}>
              <div style={{width:`${(totalSteps/TOTAL_STEPS)*100}%`,height:"100%",background:"linear-gradient(90deg,#48c774,#FFD700)",borderRadius:10,transition:"width 0.6s ease"}}/>
            </div>
            <button onClick={()=>setScreen("forest")} style={{marginTop:8,background:"transparent",border:"none",color:"#48c774",fontFamily:"'Nunito',sans-serif",cursor:"pointer",fontSize:"0.76rem",fontWeight:800}}>Se skogen → / Посмотреть лес →</button>
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={()=>startTheme(theme,mode)} style={{padding:"12px 18px",borderRadius:50,border:"none",background:"linear-gradient(135deg,#FFD700,#ff9500)",color:"#1a1a2e",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"0.88rem",cursor:"pointer"}}>🔄 Igen!</button>
            <button onClick={()=>setScreen("home")} style={{padding:"12px 18px",borderRadius:50,border:"2px solid #4a6fa5",background:"transparent",color:"#a0c4ff",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:"0.88rem",cursor:"pointer"}}>🏠 Hem / Домой</button>
          </div>
        </div>
      )}
    </div>
  );
}

const root=ReactDOM.createRoot(document.getElementById("root"));
root.render(<SvenskaQuiz/>);
