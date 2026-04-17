import { useState, useCallback, useRef, useEffect } from "react";

// ── THEMES & WORDS ──────────────────────────────────────────────
const THEMES = [
  { id: "djur",     label: "Djur",     emoji: "🐾", labelRu: "Животные" },
  { id: "mat",      label: "Mat",      emoji: "🍎", labelRu: "Еда" },
  { id: "familj",   label: "Familj",   emoji: "👨‍👩‍👧", labelRu: "Семья" },
  { id: "farger",   label: "Färger",   emoji: "🎨", labelRu: "Цвета" },
  { id: "skola",    label: "Skola",    emoji: "📚", labelRu: "Школа" },
  { id: "siffror",  label: "Siffror",  emoji: "🔢", labelRu: "Цифры" },
  { id: "kroppen",  label: "Kroppen",  emoji: "🧒", labelRu: "Тело" },
  { id: "klader",   label: "Kläder",   emoji: "👕", labelRu: "Одежда" },
];

const WORDS = {
  djur:    [
    { sv:"katt",    ru:"кот",      emoji:"🐱" },
    { sv:"hund",    ru:"собака",   emoji:"🐶" },
    { sv:"fågel",   ru:"птица",    emoji:"🐦" },
    { sv:"fisk",    ru:"рыба",     emoji:"🐟" },
    { sv:"häst",    ru:"лошадь",   emoji:"🐴" },
    { sv:"ko",      ru:"корова",   emoji:"🐄" },
    { sv:"kanin",   ru:"кролик",   emoji:"🐰" },
    { sv:"björn",   ru:"медведь",  emoji:"🐻" },
  ],
  mat:     [
    { sv:"äpple",   ru:"яблоко",   emoji:"🍎" },
    { sv:"bröd",    ru:"хлеб",     emoji:"🍞" },
    { sv:"mjölk",   ru:"молоко",   emoji:"🥛" },
    { sv:"ost",     ru:"сыр",      emoji:"🧀" },
    { sv:"ägg",     ru:"яйцо",     emoji:"🥚" },
    { sv:"soppa",   ru:"суп",      emoji:"🍲" },
    { sv:"banan",   ru:"банан",    emoji:"🍌" },
    { sv:"jordgubbe",ru:"клубника",emoji:"🍓" },
  ],
  familj:  [
    { sv:"mamma",   ru:"мама",     emoji:"👩" },
    { sv:"pappa",   ru:"папа",     emoji:"👨" },
    { sv:"bror",    ru:"брат",     emoji:"👦" },
    { sv:"syster",  ru:"сестра",   emoji:"👧" },
    { sv:"morfar",  ru:"дедушка",  emoji:"👴" },
    { sv:"mormor",  ru:"бабушка",  emoji:"👵" },
    { sv:"bebis",   ru:"малыш",    emoji:"👶" },
    { sv:"hund",    ru:"собака",   emoji:"🐶" },
  ],
  farger:  [
    { sv:"röd",     ru:"красный",  emoji:"🔴" },
    { sv:"blå",     ru:"синий",    emoji:"🔵" },
    { sv:"grön",    ru:"зелёный",  emoji:"🟢" },
    { sv:"gul",     ru:"жёлтый",   emoji:"🟡" },
    { sv:"vit",     ru:"белый",    emoji:"⚪" },
    { sv:"svart",   ru:"чёрный",   emoji:"⚫" },
    { sv:"rosa",    ru:"розовый",  emoji:"🩷" },
    { sv:"orange",  ru:"оранжевый",emoji:"🟠" },
  ],
  skola:   [
    { sv:"bok",     ru:"книга",    emoji:"📚" },
    { sv:"penna",   ru:"ручка",    emoji:"✏️" },
    { sv:"bord",    ru:"стол",     emoji:"🪑" },
    { sv:"lärare",  ru:"учитель",  emoji:"👩‍🏫" },
    { sv:"väska",   ru:"сумка",    emoji:"🎒" },
    { sv:"suddgummi",ru:"ластик",  emoji:"🧹" },
    { sv:"linjal",  ru:"линейка",  emoji:"📏" },
    { sv:"saxen",   ru:"ножницы",  emoji:"✂️" },
  ],
  siffror: [
    { sv:"ett",     ru:"один",     emoji:"1️⃣" },
    { sv:"två",     ru:"два",      emoji:"2️⃣" },
    { sv:"tre",     ru:"три",      emoji:"3️⃣" },
    { sv:"fyra",    ru:"четыре",   emoji:"4️⃣" },
    { sv:"fem",     ru:"пять",     emoji:"5️⃣" },
    { sv:"sex",     ru:"шесть",    emoji:"6️⃣" },
    { sv:"sju",     ru:"семь",     emoji:"7️⃣" },
    { sv:"åtta",    ru:"восемь",   emoji:"8️⃣" },
  ],
  kroppen: [
    { sv:"huvud",   ru:"голова",   emoji:"🗣️" },
    { sv:"öga",     ru:"глаз",     emoji:"👁️" },
    { sv:"näsa",    ru:"нос",      emoji:"👃" },
    { sv:"mun",     ru:"рот",      emoji:"👄" },
    { sv:"hand",    ru:"рука",     emoji:"✋" },
    { sv:"fot",     ru:"нога",     emoji:"🦶" },
    { sv:"öra",     ru:"ухо",      emoji:"👂" },
    { sv:"mage",    ru:"живот",    emoji:"🫃" },
  ],
  klader:  [
    { sv:"tröja",   ru:"свитер",   emoji:"👕" },
    { sv:"byxor",   ru:"штаны",    emoji:"👖" },
    { sv:"skor",    ru:"туфли",    emoji:"👟" },
    { sv:"mössa",   ru:"шапка",    emoji:"🧢" },
    { sv:"jacka",   ru:"куртка",   emoji:"🧥" },
    { sv:"strumpor",ru:"носки",    emoji:"🧦" },
    { sv:"klänning",ru:"платье",   emoji:"👗" },
    { sv:"vantar",  ru:"варежки",  emoji:"🧤" },
  ],
};

// Björn's expressions
const BJORN = {
  idle:    "🐻",
  talking: "🐻",
  happy:   "🥳",
  great:   "🎉",
  wrong:   "🐻",
  listen:  "🐻",
};

const BJORN_MESSAGES = {
  welcome:  { sv: "Hej! Jag heter Björn!", ru: "Привет! Меня зовут Бьёрн!" },
  listen:   { sv: "Lyssna noga!", ru: "Слушай внимательно!" },
  repeat:   { sv: "Din tur! Säg ordet!", ru: "Твоя очередь! Скажи слово!" },
  correct:  ["Fantastiskt! 🌟", "Jättebra! ⭐", "Perfekt! 🎉", "Wow! Bra jobbat! 🏆"],
  wrong:    { sv: "Försök igen!", ru: "Попробуй ещё раз!" },
  nextword: { sv: "Nästa ord!", ru: "Следующее слово!" },
};

function speakOut(text, lang = "sv-SE", rate = 0.8, pitch = 1.1) {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) { resolve(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang; u.rate = rate; u.pitch = pitch;
    u.onend = resolve; u.onerror = resolve;
    window.speechSynthesis.speak(u);
  });
}

function normalize(str) {
  return (str || "").toLowerCase()
    .replace(/[åä]/g,"a").replace(/ö/g,"o")
    .replace(/[её]/g,"е").replace(/[ъь]/g,"")
    .replace(/[^a-zа-яё]/g,"").trim();
}

function isCloseEnough(heard, correct) {
  const a = normalize(heard), b = normalize(correct);
  if (!a||!b) return false;
  if (a===b||a.includes(b)||b.includes(a)) return true;
  if (Math.abs(a.length-b.length)>2) return false;
  let diff=0;
  for(let i=0;i<Math.max(a.length,b.length);i++) if(a[i]!==b[i]) diff++;
  return diff<=2;
}

function buildQuizQuestions(words) {
  const allRu = words.map(w=>w.ru);
  return words.map(w=>{
    const pool = allRu.filter(r=>r!==w.ru).sort(()=>Math.random()-0.5).slice(0,3);
    const options = [...pool, w.ru].sort(()=>Math.random()-0.5);
    return { ...w, options, isSpeak: Math.random()<0.4 };
  });
}

export default function SvenskaQuiz() {
  const [screen, setScreen]       = useState("home"); // home | listen | quiz | result
  const [theme, setTheme]         = useState(null);
  const [mode, setMode]           = useState("listen"); // listen | quiz
  const [words, setWords]         = useState([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent]     = useState(0);
  const [score, setScore]         = useState(0);
  const [selected, setSelected]   = useState(null);
  const [streak, setStreak]       = useState(0);
  const [streakAnim, setStreakAnim] = useState(false);

  // Björn state
  const [bjornMood, setBjornMood]       = useState("idle");
  const [bjornMsg, setBjornMsg]         = useState(BJORN_MESSAGES.welcome);
  const [bjornTalking, setBjornTalking] = useState(false);

  // Mic state
  const [micState, setMicState]     = useState("idle"); // idle|listening|correct|wrong
  const [heardText, setHeardText]   = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [showTapBtns, setShowTapBtns] = useState(false);
  const [shake, setShake]           = useState(false);
  const [bounce, setBounce]         = useState(false);

  const recRef       = useRef(null);
  const wordsRef     = useRef([]);
  const wordIndexRef = useRef(0);
  const questionsRef = useRef([]);
  const currentRef   = useRef(0);

  useEffect(()=>{ wordsRef.current=words; },[words]);
  useEffect(()=>{ wordIndexRef.current=wordIndex; },[wordIndex]);
  useEffect(()=>{ questionsRef.current=questions; },[questions]);
  useEffect(()=>{ currentRef.current=current; },[current]);

  // Reset mic on word/question change
  useEffect(()=>{
    try{ recRef.current?.abort(); }catch{}
    recRef.current=null;
    setMicState("idle"); setHeardText(""); setRetryCount(0); setShowTapBtns(false);
  },[wordIndex, current]);

  // ── Björn helpers ──
  const bjornSay = useCallback(async (msg, mood="talking", lang="sv-SE") => {
    setBjornMood(mood); setBjornTalking(true);
    setBjornMsg(typeof msg==="string" ? {sv:msg,ru:""} : msg);
    await speakOut(typeof msg==="string" ? msg : msg.sv, lang, 0.8, 1.15);
    setBjornTalking(false);
    setBjornMood("idle");
  },[]);

  // ── START THEME ──
  const startTheme = useCallback(async (t, selectedMode) => {
    setTheme(t);
    setMode(selectedMode);
    const w = WORDS[t.id] || [];
    setWords(w); wordsRef.current=w;
    setWordIndex(0); wordIndexRef.current=0;
    setScore(0); setSelected(null); setCurrent(0);

    if (selectedMode==="listen") {
      setScreen("listen");
      await bjornSay(BJORN_MESSAGES.welcome, "happy");
      await new Promise(r=>setTimeout(r,300));
      // Speak first word
      const first = w[0];
      if (first) {
        setBjornMsg(BJORN_MESSAGES.listen);
        setBjornMood("talking"); setBjornTalking(true);
        await speakOut(first.sv, "sv-SE", 0.75, 1.1);
        setBjornTalking(false); setBjornMood("idle");
        setBjornMsg(BJORN_MESSAGES.repeat);
      }
    } else {
      const qs = buildQuizQuestions(w);
      setQuestions(qs); questionsRef.current=qs;
      setScreen("quiz");
      await bjornSay("Dags för quiz! Lyssna och svara!", "happy");
    }
  },[bjornSay]);

  // ── LISTEN MODE: speak current word ──
  const speakCurrentWord = useCallback(async () => {
    const w = wordsRef.current[wordIndexRef.current];
    if (!w) return;
    setBjornMsg(BJORN_MESSAGES.listen);
    setBjornMood("talking"); setBjornTalking(true);
    await speakOut(w.sv, "sv-SE", 0.75, 1.1);
    setBjornTalking(false); setBjornMood("idle");
    setBjornMsg(BJORN_MESSAGES.repeat);
  },[]);

  // ── LISTEN MODE: start mic ──
  const startListening = useCallback(()=>{
    try{ recRef.current?.abort(); }catch{}
    recRef.current=null;

    const SR = window.SpeechRecognition||window.webkitSpeechRecognition;
    if (!SR) { setShowTapBtns(true); return; }

    setMicState("listening");
    const rec = new SR();
    rec.continuous=false; rec.interimResults=false; rec.maxAlternatives=5;
    rec.lang="sv-SE";
    recRef.current=rec;

    rec.onresult = async (e)=>{
      const transcripts = Array.from(e.results[0]).map(r=>r.transcript);
      const heard = transcripts[0]||"";
      setHeardText(heard);
      const w = wordsRef.current[wordIndexRef.current];
      if (!w) return;
      const matched = transcripts.some(t=>isCloseEnough(t,w.sv));
      if (matched) {
        setMicState("correct");
        setStreak(s=>s+1); setStreakAnim(true);
        setTimeout(()=>setStreakAnim(false),600);
        setBounce(true); setTimeout(()=>setBounce(false),600);
        const praise = BJORN_MESSAGES.correct[Math.floor(Math.random()*BJORN_MESSAGES.correct.length)];
        await bjornSay(praise,"great");
        await new Promise(r=>setTimeout(r,400));
        // Next word
        const next = wordIndexRef.current+1;
        if (next >= wordsRef.current.length) {
          setScreen("result");
        } else {
          setWordIndex(next);
          await new Promise(r=>setTimeout(r,300));
          await speakCurrentWord();
        }
      } else {
        setMicState("wrong");
        setStreak(0); setShake(true); setTimeout(()=>setShake(false),500);
        setRetryCount(r=>{ const n=r+1; if(n>=2) setShowTapBtns(true); return n; });
        await bjornSay(BJORN_MESSAGES.wrong,"wrong");
        await speakOut(w.sv,"sv-SE",0.7,1.1);
      }
    };

    rec.onerror=(e)=>{
      const err=e.error||"";
      if(err==="no-speech") setMicState("idle");
      else if(err==="not-allowed"||err==="permission-denied") setShowTapBtns(true);
      else setMicState("idle");
    };

    rec.onend=()=>setMicState(s=>s==="listening"?"idle":s);

    try{ rec.start(); }catch{ setMicState("idle"); }
  },[bjornSay, speakCurrentWord]);

  // ── QUIZ MODE: tap answer ──
  const handleTap = useCallback(async (option)=>{
    if (selected!==null) return;
    setSelected(option);
    const q = questionsRef.current[currentRef.current];
    if (!q) return;
    if (option===q.correct) {
      setScore(s=>s+1); setStreak(s=>s+1); setStreakAnim(true);
      setTimeout(()=>setStreakAnim(false),600);
      setBounce(true); setTimeout(()=>setBounce(false),600);
      const praise = BJORN_MESSAGES.correct[Math.floor(Math.random()*BJORN_MESSAGES.correct.length)];
      await bjornSay(praise,"great");
      await speakOut(q.sv,"sv-SE",0.75,1.1);
    } else {
      setStreak(0); setShake(true); setTimeout(()=>setShake(false),500);
      await bjornSay(BJORN_MESSAGES.wrong,"wrong");
      await speakOut(q.sv,"sv-SE",0.75,1.1);
    }
    setTimeout(()=>{
      setSelected(null);
      const next = currentRef.current+1;
      if (next>=questionsRef.current.length) setScreen("result");
      else setCurrent(next);
    },1400);
  },[bjornSay, selected]);

  // ── QUIZ MODE: mic ──
  const startQuizListening = useCallback(()=>{
    try{ recRef.current?.abort(); }catch{}
    recRef.current=null;
    const SR = window.SpeechRecognition||window.webkitSpeechRecognition;
    if (!SR) { setShowTapBtns(true); return; }

    setMicState("listening");
    const rec = new SR();
    rec.continuous=false; rec.interimResults=false; rec.maxAlternatives=5;
    rec.lang="ru-RU";
    recRef.current=rec;

    rec.onresult = async (e)=>{
      const transcripts = Array.from(e.results[0]).map(r=>r.transcript);
      const heard = transcripts[0]||"";
      setHeardText(heard);
      const q = questionsRef.current[currentRef.current];
      if (!q) return;
      const matched = transcripts.some(t=>isCloseEnough(t,q.correct));
      if (matched) {
        setMicState("correct");
        setScore(s=>s+1); setStreak(s=>s+1); setStreakAnim(true);
        setTimeout(()=>setStreakAnim(false),600);
        const praise = BJORN_MESSAGES.correct[Math.floor(Math.random()*BJORN_MESSAGES.correct.length)];
        await bjornSay(praise,"great");
        await speakOut(q.sv,"sv-SE",0.75,1.1);
        setTimeout(()=>{
          setSelected(q.correct);
          setTimeout(()=>{
            setSelected(null);
            const next = currentRef.current+1;
            if(next>=questionsRef.current.length) setScreen("result");
            else setCurrent(next);
          },1200);
        },600);
      } else {
        setMicState("wrong");
        setStreak(0);
        setRetryCount(r=>{ const n=r+1; if(n>=2) setShowTapBtns(true); return n; });
        await bjornSay(BJORN_MESSAGES.wrong,"wrong");
        await speakOut(q.correct,"ru-RU",0.7,1.0);
        setTimeout(()=>speakOut(q.sv,"sv-SE",0.7,1.1),1500);
      }
    };
    rec.onerror=(e)=>{ if(e.error==="no-speech") setMicState("idle"); else setMicState("idle"); };
    rec.onend=()=>setMicState(s=>s==="listening"?"idle":s);
    try{ rec.start(); }catch{ setMicState("idle"); }
  },[bjornSay]);

  const skipWord = ()=>{
    try{ recRef.current?.abort(); }catch{}
    const next = wordIndexRef.current+1;
    if(next>=wordsRef.current.length) setScreen("result");
    else { setWordIndex(next); setTimeout(speakCurrentWord,400); }
  };

  const getStars = ()=>{ const p=score/Math.max(words.length,questions.length,1); return p===1?"🌟🌟🌟":p>=0.6?"⭐⭐":"⭐"; };

  const w = words[wordIndex];
  const q = questions[current];

  const micColor = micState==="listening"?"#ff4444":micState==="correct"?"#48c774":micState==="wrong"?"#FFD700":"#a0c4ff";
  const micBg    = micState==="listening"?"rgba(255,68,68,0.2)":micState==="correct"?"rgba(72,199,116,0.2)":micState==="wrong"?"rgba(255,215,0,0.15)":"rgba(255,255,255,0.08)";
  const micIcon  = micState==="listening"?"🔴":micState==="correct"?"✅":micState==="wrong"?"🔁":"🎤";

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(160deg,#0d1b4b 0%,#1a3a6b 40%,#0d4a3a 100%)",
      fontFamily:"'Fredoka One',cursive",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      padding:"16px",position:"relative",overflow:"hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;800;900&display=swap" rel="stylesheet"/>

      {/* Stars background */}
      {[...Array(12)].map((_,i)=>(
        <div key={i} style={{position:"absolute",
          top:`${Math.random()*90}%`,left:`${Math.random()*90}%`,
          fontSize:`${0.6+Math.random()*0.8}rem`,opacity:0.15,
          animation:`twinkle ${2+Math.random()*3}s ease-in-out infinite alternate`,
          pointerEvents:"none"}}>⭐</div>
      ))}

      <style>{`
        @keyframes twinkle  {from{opacity:0.1;transform:scale(0.8)}to{opacity:0.3;transform:scale(1.1)}}
        @keyframes fadeIn   {from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shake    {0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-10px)}40%,80%{transform:translateX(10px)}}
        @keyframes bounce   {0%,100%{transform:scale(1)}40%{transform:scale(1.15)}70%{transform:scale(0.95)}}
        @keyframes bjornTalk{0%,100%{transform:rotate(0deg) scale(1)}25%{transform:rotate(-5deg) scale(1.05)}75%{transform:rotate(5deg) scale(1.05)}}
        @keyframes bjornHappy{0%,100%{transform:scale(1) rotate(0)}20%{transform:scale(1.2) rotate(-10deg)}50%{transform:scale(1.25) rotate(10deg)}80%{transform:scale(1.1) rotate(-5deg)}}
        @keyframes micring  {0%{box-shadow:0 0 0 0 rgba(255,68,68,0.8)}70%{box-shadow:0 0 0 22px rgba(255,68,68,0)}100%{box-shadow:0 0 0 0 rgba(255,68,68,0)}}
        @keyframes spop     {0%{transform:scale(1)}50%{transform:scale(1.5)}100%{transform:scale(1)}}
        @keyframes pop      {0%{transform:scale(0.85);opacity:0}100%{transform:scale(1);opacity:1}}
        .card    {animation:fadeIn 0.45s ease}
        .shake   {animation:shake 0.5s ease}
        .bounce  {animation:bounce 0.6s ease}
        .bjorn-talk  {animation:bjornTalk 0.5s ease infinite}
        .bjorn-happy {animation:bjornHappy 0.7s ease}
        .micring {animation:micring 1.1s ease-out infinite}
        .spop    {animation:spop 0.5s ease}
        .pop     {animation:pop 0.3s ease both}
        .opt:hover:not(:disabled){transform:scale(1.05);filter:brightness(1.15)}
        .opt     {transition:all 0.15s ease}
        .tbtn:hover{transform:translateY(-4px) scale(1.06);box-shadow:0 10px 28px rgba(0,0,0,0.35)}
        .tbtn    {transition:all 0.2s ease}
      `}</style>

      {/* Streak badge */}
      {screen!=="home" && streak>0 && (
        <div style={{position:"fixed",top:12,right:12,
          background:"rgba(0,0,0,0.5)",backdropFilter:"blur(10px)",
          borderRadius:20,padding:"6px 14px",border:"1px solid #FFD70044",zIndex:100,
          display:"flex",alignItems:"center",gap:6}}>
          <span className={streakAnim?"spop":""} style={{color:"#FFD700",fontFamily:"'Nunito',sans-serif",fontWeight:900,fontSize:"1rem"}}>🔥 {streak}</span>
        </div>
      )}

      {/* ══ HOME ══ */}
      {screen==="home" && (
        <div className="card" style={{textAlign:"center",maxWidth:500,width:"100%"}}>
          {/* Björn welcome */}
          <div style={{fontSize:"6rem",marginBottom:8,filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.3))"}}>🐻</div>
          <h1 style={{color:"#FFD700",fontSize:"2.6rem",margin:"0 0 4px",textShadow:"0 2px 16px rgba(255,215,0,0.5)"}}>Svenska med Björn!</h1>
          <p style={{color:"#a0d4ff",fontSize:"0.95rem",marginBottom:6,fontFamily:"'Nunito',sans-serif"}}>Учи шведский с Бьёрном! 🇸🇪</p>

          {/* Mode selector */}
          <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:24,marginTop:16}}>
            {[
              {val:"listen", label:"👂 Lyssna & Upprepa", labelRu:"Слушай и повторяй"},
              {val:"quiz",   label:"🎯 Quiz",              labelRu:"Тест"},
            ].map(m=>(
              <button key={m.val} onClick={()=>setMode(m.val)} style={{
                padding:"10px 16px",borderRadius:20,border:"2px solid",
                borderColor:mode===m.val?"#FFD700":"rgba(255,255,255,0.2)",
                background:mode===m.val?"#FFD700":"rgba(255,255,255,0.07)",
                color:mode===m.val?"#1a1a2e":"white",
                fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"0.82rem",cursor:"pointer",
                display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                <span>{m.label}</span>
                <span style={{fontSize:"0.7rem",opacity:0.8}}>{m.labelRu}</span>
              </button>
            ))}
          </div>

          <p style={{color:"#7eb8f7",fontSize:"0.88rem",marginBottom:14,fontFamily:"'Nunito',sans-serif"}}>
            Välj ett ämne / Выбери тему:
          </p>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {THEMES.map(t=>(
              <button key={t.id} className="tbtn" onClick={()=>startTheme(t,mode)} style={{
                padding:"14px 10px",borderRadius:20,
                border:"2px solid rgba(255,255,255,0.15)",
                background:"rgba(255,255,255,0.07)",backdropFilter:"blur(8px)",
                color:"white",cursor:"pointer",
                display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <span style={{fontSize:"2rem"}}>{t.emoji}</span>
                <span style={{fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"0.85rem"}}>{t.label}</span>
                <span style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.7rem",opacity:0.65}}>{t.labelRu}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ══ LISTEN MODE ══ */}
      {screen==="listen" && w && (
        <div className={`card ${shake?"shake":""} ${bounce?"bounce":""}`}
          style={{maxWidth:440,width:"100%",textAlign:"center"}}>

          {/* Progress */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <span style={{color:"#a0c4ff",fontFamily:"'Nunito',sans-serif",fontSize:"0.82rem"}}>{wordIndex+1} / {words.length}</span>
            <div style={{flex:1,margin:"0 10px",height:8,background:"rgba(255,255,255,0.1)",borderRadius:10,overflow:"hidden"}}>
              <div style={{width:`${((wordIndex+1)/words.length)*100}%`,height:"100%",
                background:"linear-gradient(90deg,#FFD700,#ff9500)",borderRadius:10,transition:"width 0.4s ease"}}/>
            </div>
            <span style={{color:"#FFD700",fontFamily:"'Nunito',sans-serif",fontWeight:800}}>⭐{score}</span>
          </div>

          {/* Björn */}
          <div style={{marginBottom:12}}>
            <div className={bjornTalking?"bjorn-talk":bjornMood==="great"?"bjorn-happy":""}
              style={{fontSize:"5rem",display:"inline-block",filter:"drop-shadow(0 4px 16px rgba(0,0,0,0.3))"}}>
              {BJORN[bjornMood]||"🐻"}
            </div>
            <div style={{
              background:"rgba(255,255,255,0.1)",borderRadius:16,
              padding:"8px 16px",margin:"8px auto 0",maxWidth:280,
              border:"1px solid rgba(255,255,255,0.15)"}}>
              <div style={{color:"white",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"0.92rem"}}>{bjornMsg.sv}</div>
              {bjornMsg.ru&&<div style={{color:"#a0c4ff",fontFamily:"'Nunito',sans-serif",fontSize:"0.75rem",marginTop:2}}>{bjornMsg.ru}</div>}
            </div>
          </div>

          {/* Word card */}
          <div style={{
            background:"rgba(255,255,255,0.09)",borderRadius:28,padding:"28px 20px",marginBottom:16,
            border:"1px solid rgba(255,255,255,0.15)",backdropFilter:"blur(12px)"}}>
            <div style={{fontSize:"5rem",marginBottom:10}}>{w.emoji}</div>
            <div style={{color:"#FFD700",fontSize:"2.8rem",fontWeight:700,marginBottom:6,letterSpacing:1}}>{w.sv}</div>
            <div style={{color:"#a0d4ff",fontSize:"1.2rem",fontFamily:"'Nunito',sans-serif",fontWeight:700}}>{w.ru}</div>
            {/* Replay button */}
            <button onClick={speakCurrentWord} style={{
              marginTop:12,background:"rgba(255,215,0,0.15)",border:"2px solid #FFD700",
              borderRadius:50,padding:"8px 20px",color:"#FFD700",
              fontFamily:"'Nunito',sans-serif",fontWeight:800,cursor:"pointer",fontSize:"0.82rem"}}>
              🔊 Lyssna igen / Слушать снова
            </button>
          </div>

          {/* Mic area */}
          {!showTapBtns ? (
            <div style={{textAlign:"center"}}>
              <button className={micState==="listening"?"micring":""}
                onClick={micState==="listening"?()=>{try{recRef.current?.stop()}catch{} setMicState("idle")}:startListening}
                disabled={micState==="correct"}
                style={{
                  width:86,height:86,borderRadius:"50%",
                  border:`3px solid ${micColor}`,background:micBg,
                  cursor:micState==="correct"?"default":"pointer",
                  fontSize:"2.2rem",display:"flex",alignItems:"center",justifyContent:"center",
                  margin:"0 auto 10px",transition:"all 0.25s ease"}}>
                {micIcon}
              </button>
              <div style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.88rem",color:"#a0c4ff",minHeight:28}}>
                {micState==="idle"&&"Tap 🎤 and say the word in Swedish!"}
                {micState==="listening"&&<span style={{color:"#ff9999"}}>🔴 Слушаю... / Listening...</span>}
                {micState==="wrong"&&heardText&&<span style={{color:"#ff9999"}}>I heard: "{heardText}"</span>}
                {micState==="correct"&&<span style={{color:"#48c774",fontWeight:800}}>✅ Perfekt!</span>}
              </div>
              {retryCount>0&&micState!=="correct"&&(
                <button onClick={skipWord} style={{
                  marginTop:8,background:"transparent",border:"none",
                  color:"#7eb8f7",fontFamily:"'Nunito',sans-serif",cursor:"pointer",fontSize:"0.8rem"}}>
                  Skip / Пропустить →
                </button>
              )}
            </div>
          ):(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[w.sv, ...words.filter((_,i)=>i!==wordIndex).sort(()=>Math.random()-0.5).slice(0,3).map(x=>x.sv)].sort(()=>Math.random()-0.5).map((opt,i)=>(
                <button key={i} className="opt pop" onClick={async()=>{
                  if(opt===w.sv){
                    setScore(s=>s+1); setBounce(true); setTimeout(()=>setBounce(false),600);
                    await bjornSay(BJORN_MESSAGES.correct[Math.floor(Math.random()*BJORN_MESSAGES.correct.length)],"great");
                    const next=wordIndex+1;
                    if(next>=words.length) setScreen("result");
                    else{ setWordIndex(next); setShowTapBtns(false); setTimeout(speakCurrentWord,400); }
                  } else {
                    setShake(true); setTimeout(()=>setShake(false),500);
                    await bjornSay(BJORN_MESSAGES.wrong,"wrong");
                    await speakOut(w.sv,"sv-SE",0.75,1.1);
                  }
                }} style={{
                  padding:"14px 8px",borderRadius:16,
                  border:"2px solid rgba(255,255,255,0.15)",
                  background:"rgba(255,255,255,0.08)",
                  color:"white",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"0.95rem",
                  cursor:"pointer",backdropFilter:"blur(8px)",animationDelay:`${i*0.07}s`}}>
                  {opt}
                </button>
              ))}
            </div>
          )}

          <button onClick={()=>setScreen("home")} style={{
            marginTop:14,background:"transparent",border:"none",
            color:"#7eb8f7",fontFamily:"'Nunito',sans-serif",cursor:"pointer",fontSize:"0.82rem"}}>← Hem / Домой</button>
        </div>
      )}

      {/* ══ QUIZ MODE ══ */}
      {screen==="quiz" && q && (
        <div className={`card ${shake?"shake":""}`}
          style={{maxWidth:460,width:"100%",textAlign:"center"}}>

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <span style={{color:"#a0c4ff",fontFamily:"'Nunito',sans-serif",fontSize:"0.82rem"}}>{current+1} / {questions.length}</span>
            <div style={{flex:1,margin:"0 10px",height:8,background:"rgba(255,255,255,0.1)",borderRadius:10,overflow:"hidden"}}>
              <div style={{width:`${((current+1)/questions.length)*100}%`,height:"100%",
                background:"linear-gradient(90deg,#FFD700,#ff9500)",borderRadius:10,transition:"width 0.4s ease"}}/>
            </div>
            <span style={{color:"#FFD700",fontFamily:"'Nunito',sans-serif",fontWeight:800}}>⭐{score}</span>
          </div>

          {/* Björn */}
          <div style={{marginBottom:10}}>
            <div className={bjornTalking?"bjorn-talk":bjornMood==="great"?"bjorn-happy":""}
              style={{fontSize:"4rem",display:"inline-block"}}>
              {BJORN[bjornMood]||"🐻"}
            </div>
            <div style={{background:"rgba(255,255,255,0.08)",borderRadius:14,padding:"6px 14px",
              margin:"6px auto 0",maxWidth:260,border:"1px solid rgba(255,255,255,0.12)"}}>
              <div style={{color:"white",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"0.85rem"}}>{bjornMsg.sv}</div>
              {bjornMsg.ru&&<div style={{color:"#a0c4ff",fontFamily:"'Nunito',sans-serif",fontSize:"0.72rem"}}>{bjornMsg.ru}</div>}
            </div>
          </div>

          {/* Question */}
          <div style={{background:"rgba(255,255,255,0.08)",borderRadius:22,padding:"20px 16px",marginBottom:14,
            border:"1px solid rgba(255,255,255,0.12)",backdropFilter:"blur(10px)"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,
              background:q.isSpeak&&!showTapBtns?"rgba(255,107,107,0.15)":"rgba(100,180,255,0.15)",
              border:`1px solid ${q.isSpeak&&!showTapBtns?"#ff6b6b44":"#a0c4ff44"}`,
              borderRadius:20,padding:"3px 12px",marginBottom:10}}>
              <span>{q.isSpeak&&!showTapBtns?"🎤":"👆"}</span>
              <span style={{color:q.isSpeak&&!showTapBtns?"#ff9999":"#a0c4ff",
                fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:"0.72rem"}}>
                {q.isSpeak&&!showTapBtns?"Скажи по-русски! / Say in Russian!":"Нажми ответ / Tap the answer"}
              </span>
            </div>
            <div style={{fontSize:"3.5rem",marginBottom:8}}>{q.emoji}</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
              <span style={{color:"#FFD700",fontSize:"2.2rem",fontWeight:700}}>{q.sv}</span>
              <button onClick={()=>speakOut(q.sv,"sv-SE",0.75,1.1)} style={{
                background:"rgba(255,215,0,0.2)",border:"2px solid #FFD700",borderRadius:"50%",
                width:32,height:32,cursor:"pointer",fontSize:"0.85rem",
                display:"flex",alignItems:"center",justifyContent:"center"}}>🔊</button>
            </div>
          </div>

          {/* Speak mode */}
          {q.isSpeak&&!showTapBtns&&(
            <div style={{textAlign:"center",marginBottom:8}}>
              <button className={micState==="listening"?"micring":""}
                onClick={micState==="listening"?()=>{try{recRef.current?.stop()}catch{} setMicState("idle")}:startQuizListening}
                disabled={micState==="correct"}
                style={{
                  width:82,height:82,borderRadius:"50%",
                  border:`3px solid ${micColor}`,background:micBg,
                  cursor:micState==="correct"?"default":"pointer",
                  fontSize:"2rem",display:"flex",alignItems:"center",justifyContent:"center",
                  margin:"0 auto 8px",transition:"all 0.25s ease"}}>
                {micIcon}
              </button>
              <div style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.85rem",color:"#a0c4ff",minHeight:24}}>
                {micState==="idle"&&"Tap 🎤 and say the Russian word"}
                {micState==="listening"&&<span style={{color:"#ff9999"}}>🔴 Listening...</span>}
                {micState==="correct"&&<span style={{color:"#48c774",fontWeight:800}}>✅ Perfekt!</span>}
                {micState==="wrong"&&heardText&&<span style={{color:"#ff9999"}}>"{heardText}" — try again!</span>}
              </div>
              {retryCount>0&&micState!=="correct"&&(
                <button onClick={()=>setShowTapBtns(true)} style={{
                  marginTop:6,background:"transparent",border:"none",
                  color:"#7eb8f7",fontFamily:"'Nunito',sans-serif",cursor:"pointer",fontSize:"0.78rem"}}>
                  Use buttons instead / Использовать кнопки
                </button>
              )}
            </div>
          )}

          {/* Tap buttons */}
          {(!q.isSpeak||showTapBtns)&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {q.options.map((opt,i)=>{
                const isSel=selected===opt, isRight=opt===q.correct;
                let bg="rgba(255,255,255,0.07)",bc="rgba(255,255,255,0.12)";
                if(selected!==null){
                  if(isRight)    {bg="rgba(72,199,116,0.3)";  bc="#48c774";}
                  else if(isSel) {bg="rgba(255,107,107,0.3)"; bc="#ff6b6b";}
                }
                return (
                  <button key={i} className="opt pop" disabled={selected!==null}
                    onClick={()=>handleTap(opt)} style={{
                      padding:"14px 8px",borderRadius:16,border:`2px solid ${bc}`,background:bg,
                      color:"white",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:"0.95rem",
                      cursor:selected!==null?"default":"pointer",
                      backdropFilter:"blur(8px)",animationDelay:`${i*0.07}s`}}>
                    {selected!==null&&isRight&&"✅ "}{isSel&&!isRight&&"❌ "}{opt}
                  </button>
                );
              })}
            </div>
          )}

          <button onClick={()=>setScreen("home")} style={{
            marginTop:14,background:"transparent",border:"none",
            color:"#7eb8f7",fontFamily:"'Nunito',sans-serif",cursor:"pointer",fontSize:"0.82rem"}}>← Hem / Домой</button>
        </div>
      )}

      {/* ══ RESULT ══ */}
      {screen==="result" && (
        <div className="card" style={{textAlign:"center",maxWidth:420,width:"100%"}}>
          <div className="bjorn-happy" style={{fontSize:"5rem",display:"inline-block",marginBottom:8}}>🥳</div>
          <div style={{fontSize:"2.5rem",marginBottom:8}}>{getStars()}</div>
          <h2 style={{color:"#FFD700",fontSize:"2rem",margin:"0 0 6px"}}>
            {score>=(words.length||questions.length)*0.8?"Fantastiskt!":"Bra jobbat!"}
          </h2>
          <p style={{color:"#a0c4ff",fontFamily:"'Nunito',sans-serif",fontSize:"1rem",marginBottom:16}}>
            {score>=(words.length||questions.length)*0.8?"Отлично! Ты молодец! 🎉":"Хорошая работа! 👍"}
          </p>
          <div style={{background:"rgba(255,255,255,0.08)",borderRadius:20,padding:"16px",
            margin:"0 0 20px",border:"1px solid rgba(255,255,255,0.12)"}}>
            <div style={{color:"white",fontSize:"2.8rem",fontWeight:700}}>{score}/{words.length||questions.length}</div>
            <div style={{color:"#7eb8f7",fontFamily:"'Nunito',sans-serif",fontSize:"0.88rem"}}>rätta svar / правильных ответов</div>
            <div style={{color:"#FFD700",fontFamily:"'Nunito',sans-serif",fontWeight:900,fontSize:"1rem",marginTop:6}}>🔥 Streak: {streak}</div>
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={()=>startTheme(theme,mode)} style={{
              padding:"12px 20px",borderRadius:50,border:"none",
              background:"linear-gradient(135deg,#FFD700,#ff9500)",
              color:"#1a1a2e",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"0.9rem",cursor:"pointer"}}>
              🔄 Igen! / Ещё раз!
            </button>
            <button onClick={()=>setScreen("home")} style={{
              padding:"12px 20px",borderRadius:50,border:"2px solid #4a6fa5",background:"transparent",
              color:"#a0c4ff",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:"0.9rem",cursor:"pointer"}}>
              🏠 Hem / Домой
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
