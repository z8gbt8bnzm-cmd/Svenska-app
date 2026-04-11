import { useState, useCallback, useRef, useEffect } from "react";

const THEMES = [
  { id: "djur",   label: "Djur",   emoji: "🐾", labelRu: "Животные" },
  { id: "mat",    label: "Mat",    emoji: "🍎", labelRu: "Еда" },
  { id: "familj", label: "Familj", emoji: "👨‍👩‍👧", labelRu: "Семья" },
  { id: "farger", label: "Färger", emoji: "🎨", labelRu: "Цвета" },
  { id: "skola",  label: "Skola",  emoji: "📚", labelRu: "Школа" },
];

const LEVELS = [
  { label: "Nybörjare", labelRu: "Начинающий", emoji: "🌱", color: "#48c774", minStreak: 0 },
  { label: "Lärling",   labelRu: "Ученик",      emoji: "📘", color: "#3273dc", minStreak: 5 },
  { label: "Elev",      labelRu: "Школьник",    emoji: "🎓", color: "#9b59b6", minStreak: 12 },
  { label: "Mästare",   labelRu: "Мастер",      emoji: "🏆", color: "#FFD700", minStreak: 25 },
];

const FALLBACK = {
  djur: [
    { sv:"katt",   ru:"кот",     emoji:"🐱", example_sv:"Katten sover.",    example_ru:"Кот спит." },
    { sv:"hund",   ru:"собака",  emoji:"🐶", example_sv:"Hunden leker.",    example_ru:"Собака играет." },
    { sv:"fågel",  ru:"птица",   emoji:"🐦", example_sv:"Fågeln sjunger.",  example_ru:"Птица поёт." },
    { sv:"fisk",   ru:"рыба",    emoji:"🐟", example_sv:"Fisken simmar.",   example_ru:"Рыба плавает." },
    { sv:"häst",   ru:"лошадь",  emoji:"🐴", example_sv:"Hästen springer.", example_ru:"Лошадь бежит." },
    { sv:"ko",     ru:"корова",  emoji:"🐄", example_sv:"Kon äter gräs.",   example_ru:"Корова ест траву." },
  ],
  mat: [
    { sv:"äpple",  ru:"яблоко",  emoji:"🍎", example_sv:"Äpplet är rött.",  example_ru:"Яблоко красное." },
    { sv:"bröd",   ru:"хлеб",    emoji:"🍞", example_sv:"Brödet är gott.",  example_ru:"Хлеб вkusny." },
    { sv:"mjölk",  ru:"молоко",  emoji:"🥛", example_sv:"Mjölken är kall.", example_ru:"Молоко холодное." },
    { sv:"ost",    ru:"сыр",     emoji:"🧀", example_sv:"Osten är god.",    example_ru:"Сыр вкусный." },
    { sv:"ägg",    ru:"яйцо",    emoji:"🥚", example_sv:"Ägget är varmt.",  example_ru:"Яйцо тёплое." },
    { sv:"soppa",  ru:"суп",     emoji:"🍲", example_sv:"Soppan är varm.",  example_ru:"Суп горячий." },
  ],
  familj: [
    { sv:"mamma",  ru:"мама",    emoji:"👩", example_sv:"Mamma lagar mat.", example_ru:"Мама готовит еду." },
    { sv:"pappa",  ru:"папа",    emoji:"👨", example_sv:"Pappa jobbar.",    example_ru:"Папа работает." },
    { sv:"bror",   ru:"брат",    emoji:"👦", example_sv:"Bror leker.",      example_ru:"Брат играет." },
    { sv:"syster", ru:"сестра",  emoji:"👧", example_sv:"Syster sjunger.",  example_ru:"Сестра поёт." },
    { sv:"morfar", ru:"дедушка", emoji:"👴", example_sv:"Morfar läser.",    example_ru:"Дедушка читает." },
    { sv:"mormor", ru:"бабушка", emoji:"👵", example_sv:"Mormor bakar.",    example_ru:"Бабушка печёт." },
  ],
  farger: [
    { sv:"röd",    ru:"красный", emoji:"🔴", example_sv:"Bilen är röd.",    example_ru:"Машина красная." },
    { sv:"blå",    ru:"синий",   emoji:"🔵", example_sv:"Himlen är blå.",   example_ru:"Небо синее." },
    { sv:"grön",   ru:"зелёный", emoji:"🟢", example_sv:"Gräset är grönt.", example_ru:"Трава зелёная." },
    { sv:"gul",    ru:"жёлтый",  emoji:"🟡", example_sv:"Solen är gul.",    example_ru:"Солнце жёлтое." },
    { sv:"vit",    ru:"белый",   emoji:"⚪", example_sv:"Snön är vit.",     example_ru:"Снег белый." },
    { sv:"svart",  ru:"чёрный",  emoji:"⚫", example_sv:"Natten är svart.", example_ru:"Ночь чёрная." },
  ],
  skola: [
    { sv:"bok",    ru:"книга",   emoji:"📚", example_sv:"Boken är tjock.",  example_ru:"Книга толстая." },
    { sv:"penna",  ru:"ручка",   emoji:"✏️", example_sv:"Pennan är blå.",   example_ru:"Ручка синяя." },
    { sv:"bord",   ru:"стол",    emoji:"🪑", example_sv:"Bordet är stort.", example_ru:"Стол большой." },
    { sv:"lärare", ru:"учитель", emoji:"👩‍🏫", example_sv:"Läraren hjälper.", example_ru:"Учитель помогает." },
    { sv:"klass",  ru:"класс",   emoji:"🏫", example_sv:"Klassen är stor.",  example_ru:"Класс большой." },
    { sv:"väska",  ru:"сумка",   emoji:"🎒", example_sv:"Väskan är tung.",  example_ru:"Сумка тяжёлая." },
  ],
};

function buildQuestions(words, dir) {
  const allSv = words.map(w => w.sv);
  const allRu = words.map(w => w.ru);
  return words.map(w => {
    const correct = dir === "sv-ru" ? w.ru : w.sv;
    const pool = (dir === "sv-ru" ? allRu : allSv).filter(x => x !== correct);
    const options = [...pool.sort(() => Math.random() - 0.5).slice(0, 3), correct].sort(() => Math.random() - 0.5);
    return { question: dir === "sv-ru" ? w.sv : w.ru, correct, options, emoji: w.emoji, sv_word: w.sv, isSpeak: Math.random() < 0.4 };
  });
}

function speakOut(text, lang = "sv-SE", rate = 0.85) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang; u.rate = rate; u.pitch = 1.1;
  window.speechSynthesis.speak(u);
}

function normalize(str) {
  return (str || "").toLowerCase()
    .replace(/[åä]/g, "a").replace(/ö/g, "o")
    .replace(/[её]/g, "е").replace(/[ъь]/g, "")
    .replace(/[^a-zа-яё]/g, "").trim();
}

function isCloseEnough(heard, correct) {
  const a = normalize(heard), b = normalize(correct);
  if (!a || !b) return false;
  if (a === b || a.includes(b) || b.includes(a)) return true;
  if (Math.abs(a.length - b.length) > 2) return false;
  let diff = 0;
  for (let i = 0; i < Math.max(a.length, b.length); i++) if (a[i] !== b[i]) diff++;
  return diff <= 2;
}

function getLevel(streak) {
  return [...LEVELS].reverse().find(l => streak >= l.minStreak) || LEVELS[0];
}

export default function SwedishQuiz() {
  const [screen, setScreen]         = useState("home");
  const [theme, setTheme]           = useState(null);
  const [direction, setDirection]   = useState("sv-ru");
  const [words, setWords]           = useState([]);
  const [questions, setQuestions]   = useState([]);
  const [current, setCurrent]       = useState(0);
  const [score, setScore]           = useState(0);
  const [selected, setSelected]     = useState(null);
  const [loading, setLoading]       = useState(false);
  const [shake, setShake]           = useState(false);
  const [bounce, setBounce]         = useState(false);
  const [streak, setStreak]         = useState(0);
  const [streakAnim, setStreakAnim] = useState(false);
  const [learnIndex, setLearnIndex] = useState(0);
  const [speakingWord, setSpeakingWord] = useState(null);
  const [correctAnim, setCorrectAnim]   = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  // Mic state: "idle" | "listening" | "wrong" | "correct"
  const [micState, setMicState]     = useState("idle");
  const [heardText, setHeardText]   = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [micDebug, setMicDebug]     = useState(""); // visible debug line
  // Fallback buttons only show after 2 genuine failed speech attempts
  const [showFallbackBtns, setShowFallbackBtns] = useState(false);

  const recRef       = useRef(null);
  const questionsRef = useRef([]);  // always mirrors questions state
  const currentRef   = useRef(0);   // always mirrors current state

  // Keep refs in sync
  useEffect(() => { questionsRef.current = questions; }, [questions]);
  useEffect(() => { currentRef.current = current; }, [current]);

  const level     = getLevel(streak);
  const nextLevel = LEVELS.find(l => l.minStreak > streak);

  // Reset mic state when question changes
  useEffect(() => {
    try { recRef.current?.abort(); } catch {}
    recRef.current = null;
    setMicState("idle");
    setHeardText("");
    setRetryCount(0);
    setShowFallbackBtns(false);
    setMicDebug("");
  }, [current]);

  const recLang = direction === "sv-ru" ? "ru-RU" : "sv-SE";

  const advanceQuestion = useCallback(() => {
    const qs = questionsRef.current;
    const cur = currentRef.current;
    setSelected(null);
    if (cur + 1 >= qs.length) {
      setScreen("result");
    } else {
      setCurrent(c => c + 1);
    }
  }, []);

  const startListening = useCallback(() => {
    // Clean up existing recognizer
    try { recRef.current?.abort(); } catch {}
    recRef.current = null;
    setMicDebug("");

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setMicDebug("❌ SpeechRecognition not available in this browser");
      setShowFallbackBtns(true);
      return;
    }

    // Set state BEFORE starting (so UI responds immediately)
    setMicState("listening");

    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 5;
    rec.lang = recLang;
    recRef.current = rec;

    rec.onstart = () => {
      setMicDebug("✅ Mic started");
      setMicState("listening");
    };

    rec.onresult = (e) => {
      const transcripts = Array.from(e.results[0]).map(r => r.transcript);
      const heard = transcripts[0] || "";
      setHeardText(heard);
      setMicDebug(`Heard: "${heard}"`);

      const q = questionsRef.current[currentRef.current];
      if (!q) return;

      const matched = transcripts.some(t => isCloseEnough(t, q.correct));
      if (matched) {
        setMicState("correct");
        setScore(s => s + 1);
        setStreak(s => s + 1);
        setBounce(true); setCorrectAnim(true); setStreakAnim(true);
        setTimeout(() => { setBounce(false); setCorrectAnim(false); setStreakAnim(false); }, 700);
        speakOut(q.sv_word, "sv-SE");
        setTimeout(advanceQuestion, 1800);
      } else {
        setMicState("wrong");
        setStreak(0);
        setRetryCount(r => {
          const next = r + 1;
          if (next >= 2) {
            setShowFallbackBtns(true);
          }
          return next;
        });
        // Speak correct answer so child can hear it
        setTimeout(() => {
          speakOut(q.correct, recLang, 0.7);
          setTimeout(() => speakOut(q.sv_word, "sv-SE", 0.7), 1500);
        }, 400);
      }
    };

    rec.onerror = (e) => {
      const err = e.error || "unknown";
      setMicDebug(`⚠️ Error: ${err}`);
      if (err === "no-speech") {
        // Not a real failure — just no sound detected, allow retry
        setMicState("idle");
      } else if (err === "not-allowed" || err === "permission-denied") {
        setMicState("idle");
        setShowFallbackBtns(true);
        setMicDebug("🚫 Microphone blocked — check Settings → Safari → Microphone");
      } else {
        // Other errors: reset to idle, let user try again — do NOT show fallback
        setMicState("idle");
      }
    };

    rec.onend = () => {
      // Only go back to idle if we're still in listening state
      setMicState(s => s === "listening" ? "idle" : s);
    };

    try {
      rec.start();
    } catch (err) {
      setMicDebug(`❌ Could not start: ${err.message}`);
      setMicState("idle");
    }
  }, [recLang, advanceQuestion]);

  const stopListening = () => {
    try { recRef.current?.stop(); } catch {}
    setMicState("idle");
  };

  const loadTheme = useCallback(async (selectedTheme, dir) => {
    setLoading(true);
    setUsingFallback(false);
    const fallbackWords = FALLBACK[selectedTheme.id] || FALLBACK.djur;
    const fallbackQs = buildQuestions(fallbackWords, dir);
    setWords(fallbackWords);
    setQuestions(fallbackQs);
    questionsRef.current = fallbackQs;
    setLearnIndex(0); setCurrent(0); currentRef.current = 0;
    setScore(0); setSelected(null);

    try {
      const prompt = `Create a Swedish vocabulary lesson for Russian-speaking children (ages 6-12).
Theme: "${selectedTheme.label}" (${selectedTheme.labelRu})
Return ONLY raw JSON, no markdown, no fences.
Schema: {"words":[{"sv":"...","ru":"...","emoji":"...","example_sv":"max 6 words","example_ru":"..."}],"questions":[{"question":"...","correct":"...","options":["...","...","...","..."],"emoji":"...","sv_word":"..."}]}
Exactly 6 words, 6 questions. Direction: ${dir === "sv-ru" ? "question=Swedish, options=Russian" : "question=Russian, options=Swedish"}. Options include correct answer, shuffled.`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1500, messages: [{ role: "user", content: prompt }] }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.error) throw new Error();
      const parsed = JSON.parse(data.content.map(b => b.text || "").join("").replace(/```json|```/g, "").trim());
      if (parsed.words?.length && parsed.questions?.length) {
        const qs = parsed.questions.map(q => ({ ...q, isSpeak: Math.random() < 0.4 }));
        setWords(parsed.words);
        setQuestions(qs);
        questionsRef.current = qs;
      }
    } catch {
      setUsingFallback(true);
    } finally {
      setLoading(false);
      setScreen("learn");
    }
  }, []);

  const startTheme = (t) => { setTheme(t); loadTheme(t, direction); };

  const handleTapAnswer = (option) => {
    if (selected !== null) return;
    setSelected(option);
    const q = questions[current];
    if (option === q.correct) {
      setScore(s => s + 1); setStreak(s => s + 1);
      setBounce(true); setCorrectAnim(true); setStreakAnim(true);
      setTimeout(() => { setBounce(false); setCorrectAnim(false); setStreakAnim(false); }, 700);
      speakOut(q.sv_word, "sv-SE");
    } else {
      setStreak(0); setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setTimeout(() => { setSelected(null); advanceQuestion(); }, 1400);
  };

  const skipQuestion = () => {
    setStreak(0);
    try { recRef.current?.abort(); } catch {}
    advanceQuestion();
  };

  const speakWord = (word, lang) => {
    setSpeakingWord(word);
    speakOut(word, lang);
    setTimeout(() => setSpeakingWord(null), 1000);
  };

  const getStarRating = () => { const p = score/questions.length; return p===1?"🌟🌟🌟":p>=0.6?"⭐⭐":"⭐"; };
  const getMessage = () => {
    const p = score/questions.length;
    if (p===1)  return { sv:"Perfekt! Fantastiskt!", ru:"Отлично! Ты молодец!" };
    if (p>=0.6) return { sv:"Bra jobbat!",           ru:"Хорошая работа!" };
    return            { sv:"Fortsätt öva!",           ru:"Продолжай тренироваться!" };
  };

  const q = questions[current];
  const w = words[learnIndex];

  const micIcon  = micState === "listening" ? "🔴" : micState === "correct" ? "✅" : micState === "wrong" ? "🔁" : "🎤";
  const micColor = micState === "listening" ? "#ff4444" : micState === "correct" ? "#48c774" : micState === "wrong" ? "#FFD700" : "#a0c4ff";
  const micBg    = micState === "listening" ? "rgba(255,68,68,0.2)" : micState === "correct" ? "rgba(72,199,116,0.2)" : micState === "wrong" ? "rgba(255,215,0,0.15)" : "rgba(255,255,255,0.08)";

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)",
      fontFamily:"'Fredoka One',cursive",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      padding:"20px",position:"relative",overflow:"hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;800;900&display=swap" rel="stylesheet"/>
      {["🇸🇪","📖","🌟","🎯","🦆"].map((icon,i)=>(
        <div key={i} style={{position:"absolute",fontSize:"2rem",opacity:0.08,
          top:`${10+i*18}%`,left:i%2===0?`${2+i*2}%`:"auto",right:i%2!==0?`${2+i*2}%`:"auto",
          animation:`float ${3+i}s ease-in-out infinite alternate`,pointerEvents:"none"}}>{icon}</div>
      ))}

      <style>{`
        @keyframes float   {from{transform:translateY(0) rotate(0deg)}to{transform:translateY(-15px) rotate(5deg)}}
        @keyframes shake   {0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
        @keyframes bounce  {0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
        @keyframes fadeIn  {from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pop     {0%{transform:scale(0.85);opacity:0}100%{transform:scale(1);opacity:1}}
        @keyframes spop    {0%{transform:scale(1)}50%{transform:scale(1.45)}100%{transform:scale(1)}}
        @keyframes flash   {0%{box-shadow:0 0 0 0 rgba(72,199,116,0)}50%{box-shadow:0 0 32px 12px rgba(72,199,116,0.35)}100%{box-shadow:0 0 0 0 rgba(72,199,116,0)}}
        @keyframes spulse  {0%,100%{transform:scale(1)}50%{transform:scale(1.25)}}
        @keyframes micring {0%{box-shadow:0 0 0 0 rgba(255,68,68,0.8)}70%{box-shadow:0 0 0 20px rgba(255,68,68,0)}100%{box-shadow:0 0 0 0 rgba(255,68,68,0)}}
        .card   {animation:fadeIn 0.4s ease}
        .shake  {animation:shake 0.5s ease}
        .bounce {animation:bounce 0.6s ease}
        .pop    {animation:pop 0.3s ease both}
        .spop   {animation:spop 0.5s ease}
        .flash  {animation:flash 0.7s ease}
        .spulse {animation:spulse 0.5s ease}
        .micring{animation:micring 1.1s ease-out infinite}
        .opt:hover:not(:disabled){transform:scale(1.04);filter:brightness(1.12)}
        .opt    {transition:all 0.15s ease}
        .tbtn:hover{transform:translateY(-4px) scale(1.05);box-shadow:0 8px 24px rgba(0,0,0,0.3)}
        .tbtn   {transition:all 0.2s ease}
        .spk:hover{transform:scale(1.15)}
        .spk    {transition:transform 0.15s ease}
      `}</style>

      {/* Level badge */}
      {screen !== "home" && (
        <div style={{position:"fixed",top:12,right:12,background:"rgba(0,0,0,0.55)",
          backdropFilter:"blur(10px)",borderRadius:16,padding:"8px 14px",
          border:`1px solid ${level.color}44`,display:"flex",alignItems:"center",gap:8,zIndex:100}}>
          <span style={{fontSize:"1.2rem"}}>{level.emoji}</span>
          <div>
            <div style={{color:level.color,fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"0.78rem"}}>{level.label}</div>
            {nextLevel&&<div style={{width:72,height:4,background:"rgba(255,255,255,0.15)",borderRadius:4,marginTop:2}}>
              <div style={{width:`${Math.min(100,((streak-level.minStreak)/(nextLevel.minStreak-level.minStreak))*100)}%`,
                height:"100%",background:level.color,borderRadius:4,transition:"width 0.4s ease"}}/>
            </div>}
          </div>
          <div className={streakAnim?"spop":""}
            style={{color:"#FFD700",fontFamily:"'Nunito',sans-serif",fontWeight:900,fontSize:"0.95rem"}}>🔥{streak}</div>
        </div>
      )}

      {/* ══ HOME ══ */}
      {screen==="home" && (
        <div className="card" style={{textAlign:"center",maxWidth:480,width:"100%"}}>
          <div style={{fontSize:"3.5rem",marginBottom:4}}>🇸🇪</div>
          <h1 style={{color:"#FFD700",fontSize:"2.4rem",margin:"0 0 4px",textShadow:"0 2px 12px rgba(255,215,0,0.4)"}}>Svenska Quiz</h1>
          <p style={{color:"#a0c4ff",fontSize:"0.95rem",marginBottom:18,fontFamily:"'Nunito',sans-serif"}}>
            Учи шведские слова! / Lär dig svenska ord!
          </p>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,
            background:`${level.color}1a`,border:`1px solid ${level.color}44`,
            borderRadius:30,padding:"6px 16px",marginBottom:20}}>
            <span>{level.emoji}</span>
            <span style={{color:level.color,fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"0.82rem"}}>
              {level.label} / {level.labelRu}
            </span>
            <span style={{color:"#FFD700",fontFamily:"'Nunito',sans-serif",fontWeight:900,fontSize:"0.82rem"}}>🔥 {streak}</span>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:22}}>
            {[{val:"sv-ru",label:"SV → RU 🇸🇪➡️🇷🇺"},{val:"ru-sv",label:"RU → SV 🇷🇺➡️🇸🇪"}].map(opt=>(
              <button key={opt.val} onClick={()=>setDirection(opt.val)} style={{
                padding:"8px 16px",borderRadius:20,border:"2px solid",
                borderColor:direction===opt.val?"#FFD700":"#4a6fa5",
                background:direction===opt.val?"#FFD700":"transparent",
                color:direction===opt.val?"#1a1a2e":"#a0c4ff",
                fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:"0.82rem",cursor:"pointer"}}>
                {opt.label}
              </button>
            ))}
          </div>
          <p style={{color:"#7eb8f7",fontSize:"0.88rem",marginBottom:12,fontFamily:"'Nunito',sans-serif"}}>
            Välj ett ämne / Выбери тему:
          </p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            {THEMES.map(t=>(
              <button key={t.id} className="tbtn" onClick={()=>startTheme(t)} disabled={loading} style={{
                padding:"16px 10px",borderRadius:18,border:"2px solid rgba(255,255,255,0.13)",
                background:"rgba(255,255,255,0.06)",backdropFilter:"blur(8px)",
                color:"white",cursor:loading?"wait":"pointer",
                display:"flex",flexDirection:"column",alignItems:"center",gap:5,opacity:loading?0.6:1}}>
                <span style={{fontSize:"2rem"}}>{t.emoji}</span>
                <span style={{fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"0.85rem"}}>{t.label}</span>
                <span style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.7rem",opacity:0.65}}>{t.labelRu}</span>
              </button>
            ))}
          </div>
          {loading&&<div style={{color:"#a0c4ff",fontFamily:"'Nunito',sans-serif",marginTop:14,fontSize:"0.88rem"}}>⏳ Laddar... / Загружаем...</div>}
        </div>
      )}

      {/* ══ LEARN ══ */}
      {screen==="learn" && w && (
        <div className="card" style={{maxWidth:440,width:"100%",textAlign:"center"}}>
          {usingFallback&&(
            <div style={{background:"rgba(255,200,0,0.12)",border:"1px solid rgba(255,200,0,0.3)",
              borderRadius:10,padding:"6px 12px",marginBottom:12,
              color:"#FFD700",fontFamily:"'Nunito',sans-serif",fontSize:"0.75rem"}}>
              📚 Using built-in words
            </div>
          )}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <span style={{color:"#a0c4ff",fontFamily:"'Nunito',sans-serif",fontSize:"0.82rem"}}>📖 {learnIndex+1} / {words.length}</span>
            <span style={{color:"#FFD700",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"0.85rem",
              background:"rgba(255,215,0,0.1)",padding:"3px 12px",borderRadius:20}}>Lär dig / Учи</span>
          </div>
          <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:18}}>
            {words.map((_,i)=>(
              <div key={i} style={{width:i===learnIndex?22:8,height:8,borderRadius:4,transition:"all 0.3s ease",
                background:i<learnIndex?"#48c774":i===learnIndex?"#FFD700":"rgba(255,255,255,0.2)"}}/>
            ))}
          </div>
          <div style={{background:"rgba(255,255,255,0.07)",borderRadius:24,padding:"26px 20px",
            border:"1px solid rgba(255,255,255,0.12)",backdropFilter:"blur(10px)",marginBottom:16}}>
            <div style={{fontSize:"3.8rem",marginBottom:8}}>{w.emoji}</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:6}}>
              <span style={{color:"#fff",fontSize:"2.3rem",fontWeight:700}}>{w.sv}</span>
              <button className={`spk ${speakingWord===w.sv?"spulse":""}`} onClick={()=>speakWord(w.sv,"sv-SE")} style={{
                background:speakingWord===w.sv?"#FFD700":"rgba(255,215,0,0.2)",border:"2px solid #FFD700",
                borderRadius:"50%",width:36,height:36,cursor:"pointer",fontSize:"1rem",
                display:"flex",alignItems:"center",justifyContent:"center"}}>🔊</button>
            </div>
            <div style={{color:"#a0c4ff",fontSize:"1.35rem",fontFamily:"'Nunito',sans-serif",fontWeight:700,marginBottom:16}}>{w.ru}</div>
            <div style={{background:"rgba(255,255,255,0.05)",borderRadius:14,padding:"12px 14px",borderLeft:"3px solid #FFD700"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}>
                <span style={{color:"#e8e8e8",fontFamily:"'Nunito',sans-serif",fontSize:"0.88rem",fontStyle:"italic"}}>"{w.example_sv}"</span>
                <button className="spk" onClick={()=>speakWord(w.example_sv,"sv-SE")} style={{
                  background:"rgba(255,215,0,0.15)",border:"1px solid #FFD70066",borderRadius:"50%",
                  width:26,height:26,cursor:"pointer",fontSize:"0.7rem",
                  display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>🔊</button>
              </div>
              <div style={{color:"#7eb8f7",fontFamily:"'Nunito',sans-serif",fontSize:"0.8rem",marginTop:4}}>"{w.example_ru}"</div>
            </div>
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"center"}}>
            {learnIndex>0&&(
              <button onClick={()=>setLearnIndex(i=>i-1)} style={{
                padding:"12px 18px",borderRadius:50,border:"2px solid #4a6fa5",background:"transparent",color:"#a0c4ff",
                fontFamily:"'Nunito',sans-serif",fontWeight:700,cursor:"pointer",fontSize:"0.88rem"}}>← Föregående</button>
            )}
            {learnIndex<words.length-1?(
              <button onClick={()=>setLearnIndex(i=>i+1)} style={{
                padding:"12px 24px",borderRadius:50,border:"none",
                background:"linear-gradient(135deg,#FFD700,#ff9500)",
                color:"#1a1a2e",fontFamily:"'Nunito',sans-serif",fontWeight:800,cursor:"pointer",fontSize:"0.95rem"}}>Nästa →</button>
            ):(
              <button onClick={()=>setScreen("quiz")} style={{
                padding:"12px 22px",borderRadius:50,border:"none",
                background:"linear-gradient(135deg,#48c774,#06d6a0)",
                color:"white",fontFamily:"'Nunito',sans-serif",fontWeight:800,cursor:"pointer",fontSize:"0.92rem"}}>
                🎯 Starta quiz! / Начать тест!
              </button>
            )}
          </div>
          <button onClick={()=>setScreen("home")} style={{
            marginTop:14,background:"transparent",border:"none",
            color:"#7eb8f7",fontFamily:"'Nunito',sans-serif",cursor:"pointer",fontSize:"0.82rem"}}>← Tillbaka / Назад</button>
        </div>
      )}

      {/* ══ QUIZ ══ */}
      {screen==="quiz" && q && (
        <div className={`card ${shake?"shake":""} ${bounce?"bounce":""} ${correctAnim?"flash":""}`}
          style={{maxWidth:460,width:"100%",textAlign:"center",borderRadius:24}}>

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <span style={{color:"#a0c4ff",fontFamily:"'Nunito',sans-serif",fontSize:"0.82rem"}}>{current+1} / {questions.length}</span>
            <div style={{flex:1,margin:"0 10px",height:8,background:"rgba(255,255,255,0.1)",borderRadius:10,overflow:"hidden"}}>
              <div style={{width:`${((current+1)/questions.length)*100}%`,height:"100%",
                background:"linear-gradient(90deg,#FFD700,#ff9500)",borderRadius:10,transition:"width 0.4s ease"}}/>
            </div>
            <span style={{color:"#FFD700",fontFamily:"'Nunito',sans-serif",fontWeight:800}}>⭐ {score}</span>
          </div>

          {/* Question card */}
          <div style={{background:"rgba(255,255,255,0.08)",borderRadius:22,padding:"18px",marginBottom:14,
            border:"1px solid rgba(255,255,255,0.12)",backdropFilter:"blur(10px)"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,
              background:q.isSpeak&&!showFallbackBtns?"rgba(255,107,107,0.15)":"rgba(100,180,255,0.15)",
              border:`1px solid ${q.isSpeak&&!showFallbackBtns?"#ff6b6b44":"#a0c4ff44"}`,
              borderRadius:20,padding:"3px 12px",marginBottom:10}}>
              <span>{q.isSpeak&&!showFallbackBtns?"🎤":"👆"}</span>
              <span style={{color:q.isSpeak&&!showFallbackBtns?"#ff9999":"#a0c4ff",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:"0.75rem"}}>
                {q.isSpeak&&!showFallbackBtns
                  ?(direction==="sv-ru"?"Say it in Russian! / Скажи по-русски!":"Say it in Swedish! / Скажи по-шведски!")
                  :"Tap the answer / Нажми ответ"}
              </span>
            </div>
            <div style={{fontSize:"2.8rem",marginBottom:6}}>{q.emoji}</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
              <span style={{color:"#fff",fontSize:"2rem",fontWeight:700}}>{q.question}</span>
              {direction==="sv-ru"&&(
                <button className="spk" onClick={()=>speakWord(q.sv_word||q.question,"sv-SE")} style={{
                  background:"rgba(255,215,0,0.2)",border:"2px solid #FFD700",borderRadius:"50%",
                  width:34,height:34,cursor:"pointer",fontSize:"0.9rem",
                  display:"flex",alignItems:"center",justifyContent:"center"}}>🔊</button>
              )}
            </div>
          </div>

          {/* ── SPEAK MODE ── */}
          {q.isSpeak && !showFallbackBtns && (
            <div style={{textAlign:"center"}}>
              {/* Big mic button */}
              <button
                className={micState==="listening"?"micring":""}
                onClick={micState==="listening" ? stopListening : startListening}
                disabled={micState==="correct"}
                style={{
                  width:90,height:90,borderRadius:"50%",
                  border:`3px solid ${micColor}`,background:micBg,
                  cursor:micState==="correct"?"default":"pointer",
                  fontSize:"2.4rem",display:"flex",alignItems:"center",justifyContent:"center",
                  margin:"0 auto 12px",transition:"all 0.25s ease",
                }}>
                {micIcon}
              </button>

              {/* Status text */}
              <div style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.88rem",minHeight:44}}>
                {micState==="idle" && !micDebug &&
                  <p style={{color:"#a0c4ff",margin:0}}>
                    {direction==="sv-ru"?"Tap 🎤 and say the word in Russian":"Нажми 🎤 и скажи слово по-шведски"}
                  </p>}
                {micState==="listening" &&
                  <p style={{color:"#ff9999",margin:0}}>🔴 Listening... / Слушаю...</p>}
                {micState==="wrong" && heardText &&
                  <p style={{color:"#ff6b6b",margin:"0 0 6px"}}>I heard: "<b>{heardText}</b>" — not quite!</p>}
                {micState==="wrong" &&
                  <p style={{color:"#a0c4ff",fontSize:"0.8rem",margin:"0 0 10px",opacity:0.85}}>
                    🔊 Listen to the correct word, then tap 🎤 to try again
                  </p>}
                {micState==="correct" &&
                  <p style={{color:"#48c774",fontWeight:800,margin:0}}>✅ Perfekt! / Отлично!</p>}
              </div>

              {/* Debug line — small, subtle, helps diagnose issues */}
              {micDebug &&
                <div style={{background:"rgba(255,255,255,0.06)",borderRadius:8,padding:"4px 10px",
                  marginTop:6,color:"#7eb8f7",fontFamily:"'Nunito',sans-serif",fontSize:"0.7rem",opacity:0.75}}>
                  {micDebug}
                </div>}

              {/* Retry / skip */}
              {micState==="wrong" && retryCount < 2 && (
                <button onClick={startListening} style={{
                  marginTop:10,padding:"10px 24px",borderRadius:50,border:"none",
                  background:"linear-gradient(135deg,#ff6b6b,#ff9500)",
                  color:"white",fontFamily:"'Nunito',sans-serif",fontWeight:800,cursor:"pointer",fontSize:"0.88rem"}}>
                  🎤 Try again / Ещё раз
                </button>
              )}
              {retryCount > 0 && micState !== "correct" && (
                <button onClick={skipQuestion} style={{
                  display:"block",margin:"8px auto 0",background:"transparent",border:"none",
                  color:"#7eb8f7",fontFamily:"'Nunito',sans-serif",cursor:"pointer",fontSize:"0.8rem"}}>
                  Skip / Пропустить →
                </button>
              )}
            </div>
          )}

          {/* ── TAP MODE or fallback ── */}
          {(!q.isSpeak || showFallbackBtns) && (
            <div>
              {showFallbackBtns&&(
                <p style={{color:"#FFD700",fontFamily:"'Nunito',sans-serif",fontSize:"0.8rem",marginBottom:10}}>
                  Tap the correct answer / Нажми правильный ответ
                </p>
              )}
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
                      onClick={()=>handleTapAnswer(opt)} style={{
                        padding:"15px 10px",borderRadius:16,border:`2px solid ${bc}`,background:bg,
                        color:"white",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:"0.98rem",
                        cursor:selected!==null?"default":"pointer",
                        backdropFilter:"blur(8px)",animationDelay:`${i*0.07}s`}}>
                      {selected!==null&&isRight&&"✅ "}{isSel&&!isRight&&"❌ "}{opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button onClick={()=>setScreen("home")} style={{
            marginTop:16,background:"transparent",border:"none",
            color:"#7eb8f7",fontFamily:"'Nunito',sans-serif",cursor:"pointer",fontSize:"0.82rem"}}>← Tillbaka / Назад</button>
        </div>
      )}

      {/* ══ RESULT ══ */}
      {screen==="result" && (
        <div className="card" style={{textAlign:"center",maxWidth:420,width:"100%"}}>
          <div style={{fontSize:"4rem",marginBottom:10}}>{getStarRating()}</div>
          <h2 style={{color:"#FFD700",fontSize:"2rem",margin:"0 0 6px"}}>{getMessage().sv}</h2>
          <p style={{color:"#a0c4ff",fontFamily:"'Nunito',sans-serif",fontSize:"1rem",marginBottom:14}}>{getMessage().ru}</p>
          <div style={{background:"rgba(255,255,255,0.07)",borderRadius:20,padding:"18px",margin:"0 0 14px",border:"1px solid rgba(255,255,255,0.12)"}}>
            <div style={{color:"white",fontSize:"2.8rem",fontWeight:700}}>{score}/{questions.length}</div>
            <div style={{color:"#7eb8f7",fontFamily:"'Nunito',sans-serif",fontSize:"0.88rem"}}>rätta svar / правильных ответов</div>
          </div>
          <div style={{background:`${level.color}18`,border:`1px solid ${level.color}44`,borderRadius:16,padding:"14px",marginBottom:20}}>
            <div style={{color:level.color,fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"1rem"}}>
              {level.emoji} {level.label} / {level.labelRu}
            </div>
            <div style={{color:"#FFD700",fontFamily:"'Nunito',sans-serif",fontWeight:900,fontSize:"1.1rem",marginTop:4}}>🔥 Streak: {streak}</div>
            {nextLevel&&<div style={{color:"#a0c4ff",fontFamily:"'Nunito',sans-serif",fontSize:"0.76rem",marginTop:6,opacity:0.8}}>
              {nextLevel.minStreak-streak} till {nextLevel.emoji} {nextLevel.label} / {nextLevel.labelRu}
            </div>}
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={()=>{setLearnIndex(0);setScreen("learn");}} style={{
              padding:"12px 18px",borderRadius:50,border:"none",
              background:"linear-gradient(135deg,#48c774,#06d6a0)",
              color:"white",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"0.88rem",cursor:"pointer"}}>
              📖 Lär igen / Снова учить
            </button>
            <button onClick={()=>loadTheme(theme,direction)} style={{
              padding:"12px 18px",borderRadius:50,border:"none",
              background:"linear-gradient(135deg,#FFD700,#ff9500)",
              color:"#1a1a2e",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"0.88rem",cursor:"pointer"}}>
              🔄 Igen! / Ещё раз!
            </button>
            <button onClick={()=>setScreen("home")} style={{
              padding:"12px 18px",borderRadius:50,border:"2px solid #4a6fa5",background:"transparent",
              color:"#a0c4ff",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:"0.88rem",cursor:"pointer"}}>
              🏠 Hem / Домой
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
