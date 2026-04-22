import { useState, useCallback, useRef, useEffect } from "react";

// ── THEMES & WORDS ──────────────────────────────────────────────
const THEMES = [
  { id: "djur",    label: "Djur",    emoji: "🐾", labelRu: "Животные" },
  { id: "mat",     label: "Mat",     emoji: "🍎", labelRu: "Еда" },
  { id: "familj",  label: "Familj",  emoji: "👨‍👩‍👧", labelRu: "Семья" },
  { id: "farger",  label: "Färger",  emoji: "🎨", labelRu: "Цвета" },
  { id: "skola",   label: "Skola",   emoji: "📚", labelRu: "Школа" },
  { id: "siffror", label: "Siffror", emoji: "🔢", labelRu: "Цифры" },
  { id: "kroppen", label: "Kroppen", emoji: "🧒", labelRu: "Тело" },
  { id: "klader",  label: "Kläder",  emoji: "👕", labelRu: "Одежда" },
];

const WORDS = {
  djur:    [
    { sv:"katt",     ru:"кот",       emoji:"🐱" },
    { sv:"hund",     ru:"собака",    emoji:"🐶" },
    { sv:"fågel",    ru:"птица",     emoji:"🐦" },
    { sv:"fisk",     ru:"рыба",      emoji:"🐟" },
    { sv:"häst",     ru:"лошадь",    emoji:"🐴" },
    { sv:"ko",       ru:"корова",    emoji:"🐄" },
    { sv:"kanin",    ru:"кролик",    emoji:"🐰" },
    { sv:"björn",    ru:"медведь",   emoji:"🐻" },
  ],
  mat:     [
    { sv:"äpple",    ru:"яблоко",    emoji:"🍎" },
    { sv:"bröd",     ru:"хлеб",      emoji:"🍞" },
    { sv:"mjölk",    ru:"молоко",    emoji:"🥛" },
    { sv:"ost",      ru:"сыр",       emoji:"🧀" },
    { sv:"ägg",      ru:"яйцо",      emoji:"🥚" },
    { sv:"soppa",    ru:"суп",       emoji:"🍲" },
    { sv:"banan",    ru:"банан",     emoji:"🍌" },
    { sv:"jordgubbe",ru:"клубника",  emoji:"🍓" },
  ],
  familj:  [
    { sv:"mamma",    ru:"мама",      emoji:"👩" },
    { sv:"pappa",    ru:"папа",      emoji:"👨" },
    { sv:"bror",     ru:"брат",      emoji:"👦" },
    { sv:"syster",   ru:"сестра",    emoji:"👧" },
    { sv:"morfar",   ru:"дедушка",   emoji:"👴" },
    { sv:"mormor",   ru:"бабушка",   emoji:"👵" },
    { sv:"bebis",    ru:"малыш",     emoji:"👶" },
    { sv:"kompis",   ru:"друг",      emoji:"🤝" },
  ],
  farger:  [
    { sv:"röd",      ru:"красный",   emoji:"🔴" },
    { sv:"blå",      ru:"синий",     emoji:"🔵" },
    { sv:"grön",     ru:"зелёный",   emoji:"🟢" },
    { sv:"gul",      ru:"жёлтый",    emoji:"🟡" },
    { sv:"vit",      ru:"белый",     emoji:"⚪" },
    { sv:"svart",    ru:"чёрный",    emoji:"⚫" },
    { sv:"rosa",     ru:"розовый",   emoji:"🩷" },
    { sv:"orange",   ru:"оранжевый", emoji:"🟠" },
  ],
  skola:   [
    { sv:"bok",      ru:"книга",     emoji:"📚" },
    { sv:"penna",    ru:"ручка",     emoji:"✏️" },
    { sv:"bord",     ru:"стол",      emoji:"🪑" },
    { sv:"lärare",   ru:"учитель",   emoji:"👩‍🏫" },
    { sv:"väska",    ru:"сумка",     emoji:"🎒" },
    { sv:"suddgummi",ru:"ластик",    emoji:"🧹" },
    { sv:"linjal",   ru:"линейка",   emoji:"📏" },
    { sv:"saxen",    ru:"ножницы",   emoji:"✂️" },
  ],
  siffror: [
    { sv:"ett",      ru:"один",      emoji:"1️⃣" },
    { sv:"två",      ru:"два",       emoji:"2️⃣" },
    { sv:"tre",      ru:"три",       emoji:"3️⃣" },
    { sv:"fyra",     ru:"четыре",    emoji:"4️⃣" },
    { sv:"fem",      ru:"пять",      emoji:"5️⃣" },
    { sv:"sex",      ru:"шесть",     emoji:"6️⃣" },
    { sv:"sju",      ru:"семь",      emoji:"7️⃣" },
    { sv:"åtta",     ru:"восемь",    emoji:"8️⃣" },
  ],
  kroppen: [
    { sv:"huvud",    ru:"голова",    emoji:"🗣️" },
    { sv:"öga",      ru:"глаз",      emoji:"👁️" },
    { sv:"näsa",     ru:"нос",       emoji:"👃" },
    { sv:"mun",      ru:"рот",       emoji:"👄" },
    { sv:"hand",     ru:"рука",      emoji:"✋" },
    { sv:"fot",      ru:"нога",      emoji:"🦶" },
    { sv:"öra",      ru:"ухо",       emoji:"👂" },
    { sv:"mage",     ru:"живот",     emoji:"🫃" },
  ],
  klader:  [
    { sv:"tröja",    ru:"свитер",    emoji:"👕" },
    { sv:"byxor",    ru:"штаны",     emoji:"👖" },
    { sv:"skor",     ru:"туфли",     emoji:"👟" },
    { sv:"mössa",    ru:"шапка",     emoji:"🧢" },
    { sv:"jacka",    ru:"куртка",    emoji:"🧥" },
    { sv:"strumpor", ru:"носки",     emoji:"🧦" },
    { sv:"klänning", ru:"платье",    emoji:"👗" },
    { sv:"vantar",   ru:"варежки",   emoji:"🧤" },
  ],
};

// Forest collectibles per theme
const COLLECTIBLES = {
  djur:    ["🐾","🦴","🪶","🐚"],
  mat:     ["🫐","🍄","🌰","🍒"],
  familj:  ["💌","🎀","🪷","🌻"],
  farger:  ["🌈","🎨","🖍️","✨"],
  skola:   ["📝","🔑","⭐","🎓"],
  siffror: ["🍀","💎","🪙","🔮"],
  kroppen: ["❤️","🌟","💪","🧠"],
  klader:  ["🎁","🧣","👑","🎀"],
};

// Forest path milestones (total steps = all words across all themes = 64)
const TOTAL_STEPS = 64;
const FOREST_ITEMS = ["🌲","🌿","🍄","🫐","🌸","🌲","🦋","🌿","🌲","🍄","🌸","🫐","🦌","🌲","🌿","🌸","🏠"];

// ── VOICE SELECTION ──────────────────────────────────────────────
function getBestVoice(lang) {
  const voices = window.speechSynthesis.getVoices();
  // Priority: local (not remote/network), then by lang match
  const candidates = voices.filter(v => v.lang.startsWith(lang));
  // Prefer local voices over remote (more natural on device)
  const local = candidates.filter(v => v.localService);
  const pool = local.length > 0 ? local : candidates;
  // On iOS/macOS, prefer voices with "Alva" (Swedish) or "Milena" (Russian) — they're the best
  const named = pool.find(v =>
    v.name.includes("Alva") || v.name.includes("Milena") ||
    v.name.includes("Katja") || v.name.includes("Anna") ||
    v.name.includes("Amelie")
  );
  return named || pool[0] || null;
}

function speakOut(text, lang = "sv-SE", rate = 0.82, pitch = 1.05) {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) { resolve(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = rate;
    u.pitch = pitch;
    // Try to get best voice
    const voice = getBestVoice(lang.split("-")[0]);
    if (voice) u.voice = voice;
    u.onend = resolve;
    u.onerror = resolve;
    // Small delay so voices are loaded
    setTimeout(() => window.speechSynthesis.speak(u), 80);
  });
}

// ── HELPERS ─────────────────────────────────────────────────────
function normalize(str) {
  return (str || "").toLowerCase()
    .replace(/[åä]/g,"a").replace(/ö/g,"o")
    .replace(/[её]/g,"е").replace(/[ъь]/g,"")
    .replace(/[^a-zа-яё]/g,"").trim();
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

function buildQuizQuestions(words) {
  const allRu = words.map(w => w.ru);
  return words.map(w => {
    const pool = allRu.filter(r => r !== w.ru).sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [...pool, w.ru].sort(() => Math.random() - 0.5);
    return { ...w, options };
  });
}

function loadProgress() {
  try { return JSON.parse(localStorage.getItem("bjorn_progress") || "{}"); } catch { return {}; }
}
function saveProgress(p) {
  try { localStorage.setItem("bjorn_progress", JSON.stringify(p)); } catch {}
}

const PRAISE = ["Fantastiskt! 🌟", "Jättebra! ⭐", "Perfekt! 🎉", "Wow! Bra jobbat! 🏆", "Underbart! 🌈"];

// ── FOREST MAP SCREEN ────────────────────────────────────────────
function ForestMap({ steps, collected, onClose }) {
  const pct = Math.min(1, steps / TOTAL_STEPS);
  const bjornPos = Math.floor(pct * (FOREST_ITEMS.length - 1));

  return (
    <div className="card" style={{ maxWidth: 440, width: "100%", textAlign: "center" }}>
      <h2 style={{ color: "#FFD700", fontSize: "1.8rem", margin: "0 0 4px" }}>Björns skogsväg 🌲</h2>
      <p style={{ color: "#a0d4ff", fontFamily: "'Nunito',sans-serif", fontSize: "0.85rem", marginBottom: 16 }}>
        Björns skogsväg / Лесной путь Бьёрна
      </p>

      {/* Progress bar */}
      <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 20, height: 12, marginBottom: 16, overflow: "hidden" }}>
        <div style={{ width: `${pct * 100}%`, height: "100%", background: "linear-gradient(90deg,#48c774,#FFD700)", borderRadius: 20, transition: "width 0.6s ease" }} />
      </div>
      <p style={{ color: "#a0d4ff", fontFamily: "'Nunito',sans-serif", fontSize: "0.82rem", marginBottom: 16 }}>
        {steps} / {TOTAL_STEPS} steg / шагов
      </p>

      {/* Forest path */}
      <div style={{
        background: "linear-gradient(160deg,#0d3a1a,#1a5c2a)", borderRadius: 24,
        padding: "20px 16px", marginBottom: 16, border: "2px solid rgba(72,199,116,0.3)",
        display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", alignItems: "center",
      }}>
        {FOREST_ITEMS.map((item, i) => (
          <div key={i} style={{
            fontSize: i === bjornPos ? "2.2rem" : "1.4rem",
            opacity: i > bjornPos ? 0.3 : 1,
            transition: "all 0.4s ease",
            filter: i === bjornPos ? "drop-shadow(0 0 8px #FFD700)" : "none",
            position: "relative",
          }}>
            {i === bjornPos ? "🐻" : item}
          </div>
        ))}
      </div>

      {/* Collected items */}
      {collected.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ color: "#FFD700", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "0.85rem", marginBottom: 8 }}>
            🎒 Samlat / Собрано:
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {collected.map((item, i) => (
              <span key={i} style={{ fontSize: "1.8rem" }}>{item}</span>
            ))}
          </div>
        </div>
      )}

      <button onClick={onClose} style={{
        padding: "12px 28px", borderRadius: 50, border: "none",
        background: "linear-gradient(135deg,#FFD700,#ff9500)",
        color: "#1a1a2e", fontFamily: "'Nunito',sans-serif", fontWeight: 800, cursor: "pointer", fontSize: "0.95rem",
      }}>← Tillbaka / Назад</button>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────
export default function SvenskaQuiz() {
  const [screen, setScreen]       = useState("home"); // home | forest | listen | quiz | result
  const [theme, setTheme]         = useState(null);
  const [mode, setMode]           = useState("listen");
  const [words, setWords]         = useState([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent]     = useState(0);
  const [score, setScore]         = useState(0);
  const [selected, setSelected]   = useState(null);
  const [sessionCollected, setSessionCollected] = useState([]);

  // Forest progress (persisted)
  const [progress, setProgress] = useState(() => loadProgress());
  const totalSteps = Object.values(progress).reduce((a, b) => a + b, 0);
  const allCollected = Object.entries(progress).flatMap(([tid, count]) =>
    (COLLECTIBLES[tid] || []).slice(0, Math.min(count, 4))
  );

  // Björn
  const [bjornMood, setBjornMood]       = useState("idle");
  const [bjornMsg, setBjornMsg]         = useState({ sv: "Hej! Jag heter Björn!", ru: "Привет! Меня зовут Бьёрн!" });
  const [bjornTalking, setBjornTalking] = useState(false);

  // Mic
  const [micState, setMicState]     = useState("idle");
  const [heardText, setHeardText]   = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [showTapBtns, setShowTapBtns] = useState(false);
  const [shake, setShake]           = useState(false);
  const [bounce, setBounce]         = useState(false);
  const [newItem, setNewItem]       = useState(null); // newly collected item flash

  const recRef       = useRef(null);
  const wordsRef     = useRef([]);
  const wordIdxRef   = useRef(0);
  const questionsRef = useRef([]);
  const currentRef   = useRef(0);
  const themeRef     = useRef(null);

  useEffect(() => { wordsRef.current = words; }, [words]);
  useEffect(() => { wordIdxRef.current = wordIndex; }, [wordIndex]);
  useEffect(() => { questionsRef.current = questions; }, [questions]);
  useEffect(() => { currentRef.current = current; }, [current]);

  // Voices load async on some devices
  useEffect(() => {
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {};
    }
  }, []);

  // Reset mic on question/word change
  useEffect(() => {
    try { recRef.current?.abort(); } catch {}
    recRef.current = null;
    setMicState("idle"); setHeardText(""); setRetryCount(0); setShowTapBtns(false);
  }, [wordIndex, current]);

  // ── Award progress ──
  const awardStep = useCallback((themeId) => {
    setProgress(prev => {
      const next = { ...prev, [themeId]: (prev[themeId] || 0) + 1 };
      saveProgress(next);
      return next;
    });
    const collectibles = COLLECTIBLES[themeId] || [];
    const themeCount = (progress[themeId] || 0) + 1;
    const item = collectibles[Math.min(themeCount - 1, collectibles.length - 1)];
    if (item && themeCount <= collectibles.length) {
      setNewItem(item);
      setSessionCollected(s => [...s, item]);
      setTimeout(() => setNewItem(null), 2000);
    }
  }, [progress]);

  // ── Björn speak ──
  const bjornSay = useCallback(async (msg, mood = "talking", lang = "sv-SE", rate = 0.82) => {
    setBjornMood(mood); setBjornTalking(true);
    setBjornMsg(typeof msg === "string" ? { sv: msg, ru: "" } : msg);
    await speakOut(typeof msg === "string" ? msg : msg.sv, lang, rate, 1.05);
    setBjornTalking(false); setBjornMood("idle");
  }, []);

  // ── Speak current word ──
  const speakWord = useCallback(async () => {
    const w = wordsRef.current[wordIdxRef.current];
    if (!w) return;
    setBjornMsg({ sv: "Lyssna! / Слушай!", ru: "" });
    setBjornMood("talking"); setBjornTalking(true);
    await speakOut(w.sv, "sv-SE", 0.75, 1.05);
    setBjornTalking(false); setBjornMood("idle");
    setBjornMsg({ sv: "Din tur! Säg ordet!", ru: "Твоя очередь! Скажи слово!" });
  }, []);

  // ── Start theme ──
  const startTheme = useCallback(async (t, selectedMode) => {
    setTheme(t); themeRef.current = t;
    setMode(selectedMode);
    setSessionCollected([]);
    const w = WORDS[t.id] || [];
    setWords(w); wordsRef.current = w;
    setWordIndex(0); wordIdxRef.current = 0;
    setScore(0); setSelected(null); setCurrent(0);

    if (selectedMode === "listen") {
      setScreen("listen");
      await bjornSay({ sv: "Hej! Lyssna och upprepa!", ru: "Привет! Слушай и повторяй!" }, "happy");
      await new Promise(r => setTimeout(r, 300));
      await speakWord();
    } else {
      const qs = buildQuizQuestions(w);
      setQuestions(qs); questionsRef.current = qs;
      setScreen("quiz");
      await bjornSay({ sv: "Dags för quiz!", ru: "Время для теста!" }, "happy");
    }
  }, [bjornSay, speakWord]);

  // ── Listen mic ──
  const startListening = useCallback(() => {
    try { recRef.current?.abort(); } catch {}
    recRef.current = null;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setShowTapBtns(true); return; }
    setMicState("listening");

    const rec = new SR();
    rec.continuous = false; rec.interimResults = false; rec.maxAlternatives = 5;
    rec.lang = "sv-SE";
    recRef.current = rec;

    rec.onresult = async (e) => {
      const transcripts = Array.from(e.results[0]).map(r => r.transcript);
      const heard = transcripts[0] || "";
      setHeardText(heard);
      const w = wordsRef.current[wordIdxRef.current];
      if (!w) return;
      const matched = transcripts.some(t => isCloseEnough(t, w.sv));
      if (matched) {
        setMicState("correct");
        setScore(s => s + 1);
        setBounce(true); setTimeout(() => setBounce(false), 600);
        awardStep(themeRef.current?.id);
        const praise = PRAISE[Math.floor(Math.random() * PRAISE.length)];
        await bjornSay(praise, "great");
        await new Promise(r => setTimeout(r, 300));
        const next = wordIdxRef.current + 1;
        if (next >= wordsRef.current.length) setScreen("result");
        else { setWordIndex(next); setTimeout(speakWord, 500); }
      } else {
        setMicState("wrong");
        setShake(true); setTimeout(() => setShake(false), 500);
        setRetryCount(r => { const n = r + 1; if (n >= 2) setShowTapBtns(true); return n; });
        await bjornSay({ sv: "Försök igen!", ru: "Попробуй ещё раз!" }, "wrong");
        await speakOut(w.sv, "sv-SE", 0.7, 1.0);
      }
    };
    rec.onerror = (e) => {
      if (e.error === "no-speech") setMicState("idle");
      else if (e.error === "not-allowed") setShowTapBtns(true);
      else setMicState("idle");
    };
    rec.onend = () => setMicState(s => s === "listening" ? "idle" : s);
    try { rec.start(); } catch { setMicState("idle"); }
  }, [bjornSay, speakWord, awardStep]);

  // ── Quiz tap ──
  const handleTap = useCallback(async (option) => {
    if (selected !== null) return;
    setSelected(option);
    const q = questionsRef.current[currentRef.current];
    if (!q) return;
    if (option === q.ru) {
      setScore(s => s + 1);
      setBounce(true); setTimeout(() => setBounce(false), 600);
      awardStep(themeRef.current?.id);
      const praise = PRAISE[Math.floor(Math.random() * PRAISE.length)];
      await bjornSay(praise, "great");
      await speakOut(q.sv, "sv-SE", 0.78, 1.05);
    } else {
      setShake(true); setTimeout(() => setShake(false), 500);
      await bjornSay({ sv: "Försök igen!", ru: "Попробуй ещё раз!" }, "wrong");
      await speakOut(q.sv, "sv-SE", 0.75, 1.05);
    }
    setTimeout(() => {
      setSelected(null);
      const next = currentRef.current + 1;
      if (next >= questionsRef.current.length) setScreen("result");
      else setCurrent(next);
    }, 1400);
  }, [selected, bjornSay, awardStep]);

  // ── Quiz mic (Russian) ──
  const startQuizMic = useCallback(() => {
    try { recRef.current?.abort(); } catch {}
    recRef.current = null;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setShowTapBtns(true); return; }
    setMicState("listening");

    const rec = new SR();
    rec.continuous = false; rec.interimResults = false; rec.maxAlternatives = 5;
    rec.lang = "ru-RU";
    recRef.current = rec;

    rec.onresult = async (e) => {
      const transcripts = Array.from(e.results[0]).map(r => r.transcript);
      const heard = transcripts[0] || "";
      setHeardText(heard);
      const q = questionsRef.current[currentRef.current];
      if (!q) return;
      // Check against Russian answer
      const matched = transcripts.some(t => isCloseEnough(t, q.ru));
      if (matched) {
        setMicState("correct");
        setScore(s => s + 1);
        awardStep(themeRef.current?.id);
        const praise = PRAISE[Math.floor(Math.random() * PRAISE.length)];
        await bjornSay(praise, "great");
        await speakOut(q.sv, "sv-SE", 0.78, 1.05);
        setTimeout(() => {
          setSelected(q.ru);
          setTimeout(() => {
            setSelected(null);
            const next = currentRef.current + 1;
            if (next >= questionsRef.current.length) setScreen("result");
            else setCurrent(next);
          }, 1200);
        }, 600);
      } else {
        setMicState("wrong");
        setShake(true); setTimeout(() => setShake(false), 500);
        setRetryCount(r => { const n = r + 1; if (n >= 2) setShowTapBtns(true); return n; });
        await bjornSay({ sv: "Försök igen!", ru: "Попробуй ещё раз!" }, "wrong");
        // Speak the correct Russian answer so child hears it
        await speakOut(q.ru, "ru-RU", 0.72, 1.0);
        await new Promise(r => setTimeout(r, 800));
        await speakOut(q.sv, "sv-SE", 0.75, 1.05);
      }
    };
    rec.onerror = (e) => {
      if (e.error === "no-speech") setMicState("idle");
      else setMicState("idle");
    };
    rec.onend = () => setMicState(s => s === "listening" ? "idle" : s);
    try { rec.start(); } catch { setMicState("idle"); }
  }, [bjornSay, awardStep]);

  const skipWord = () => {
    try { recRef.current?.abort(); } catch {}
    const next = wordIdxRef.current + 1;
    if (next >= wordsRef.current.length) setScreen("result");
    else { setWordIndex(next); setTimeout(speakWord, 400); }
  };

  const micColor = micState==="listening"?"#ff4444":micState==="correct"?"#48c774":micState==="wrong"?"#FFD700":"#a0c4ff";
  const micBg    = micState==="listening"?"rgba(255,68,68,0.2)":micState==="correct"?"rgba(72,199,116,0.2)":micState==="wrong"?"rgba(255,215,0,0.15)":"rgba(255,255,255,0.08)";
  const micIcon  = micState==="listening"?"🔴":micState==="correct"?"✅":micState==="wrong"?"🔁":"🎤";

  const w = words[wordIndex];
  const q = questions[current];
  const totalAnswered = words.length || questions.length || 1;
  const getStars = () => { const p = score / totalAnswered; return p === 1 ? "🌟🌟🌟" : p >= 0.6 ? "⭐⭐" : "⭐"; };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg,#0d1b4b 0%,#1a3a6b 40%,#0d4a3a 100%)",
      fontFamily: "'Fredoka One',cursive",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "16px", position: "relative", overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;800;900&display=swap" rel="stylesheet" />

      {[...Array(10)].map((_, i) => (
        <div key={i} style={{
          position: "absolute", opacity: 0.12,
          top: `${10 + i * 9}%`, left: `${i % 2 === 0 ? 2 + i : 85 - i}%`,
          fontSize: "1.2rem", pointerEvents: "none",
          animation: `twinkle ${2 + i * 0.4}s ease-in-out infinite alternate`,
        }}>🌲</div>
      ))}

      <style>{`
        @keyframes twinkle   {from{opacity:0.08;transform:scale(0.9)}to{opacity:0.2;transform:scale(1.05)}}
        @keyframes fadeIn    {from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shake     {0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-10px)}40%,80%{transform:translateX(10px)}}
        @keyframes bounce    {0%,100%{transform:scale(1)}40%{transform:scale(1.15)}70%{transform:scale(0.95)}}
        @keyframes bjornTalk {0%,100%{transform:rotate(0) scale(1)}25%{transform:rotate(-5deg) scale(1.05)}75%{transform:rotate(5deg) scale(1.05)}}
        @keyframes bjornHappy{0%,100%{transform:scale(1) rotate(0)}20%{transform:scale(1.2) rotate(-10deg)}50%{transform:scale(1.25) rotate(10deg)}80%{transform:scale(1.1) rotate(-5deg)}}
        @keyframes micring   {0%{box-shadow:0 0 0 0 rgba(255,68,68,0.8)}70%{box-shadow:0 0 0 22px rgba(255,68,68,0)}100%{box-shadow:0 0 0 0 rgba(255,68,68,0)}}
        @keyframes itemPop   {0%{transform:scale(0) translateY(0);opacity:0}50%{transform:scale(1.4) translateY(-20px);opacity:1}100%{transform:scale(1) translateY(-40px);opacity:0}}
        @keyframes pop       {0%{transform:scale(0.85);opacity:0}100%{transform:scale(1);opacity:1}}
        .card       {animation:fadeIn 0.45s ease}
        .shake      {animation:shake 0.5s ease}
        .bounce     {animation:bounce 0.6s ease}
        .bjorn-talk {animation:bjornTalk 0.6s ease infinite}
        .bjorn-happy{animation:bjornHappy 0.7s ease}
        .micring    {animation:micring 1.1s ease-out infinite}
        .item-pop   {animation:itemPop 2s ease forwards}
        .pop        {animation:pop 0.3s ease both}
        .opt:hover:not(:disabled){transform:scale(1.05);filter:brightness(1.15)}
        .opt        {transition:all 0.15s ease}
        .tbtn:hover {transform:translateY(-4px) scale(1.06);box-shadow:0 10px 28px rgba(0,0,0,0.35)}
        .tbtn       {transition:all 0.2s ease}
      `}</style>

      {/* Collected item flash */}
      {newItem && (
        <div className="item-pop" style={{
          position: "fixed", top: "30%", left: "50%", transform: "translateX(-50%)",
          fontSize: "3rem", zIndex: 200, pointerEvents: "none",
        }}>{newItem}</div>
      )}

      {/* Forest progress button (always visible except home) */}
      {screen !== "home" && screen !== "forest" && (
        <button onClick={() => setScreen("forest")} style={{
          position: "fixed", top: 12, left: 12,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)",
          borderRadius: 20, padding: "6px 12px", border: "1px solid rgba(72,199,116,0.4)",
          color: "#48c774", fontFamily: "'Nunito',sans-serif", fontWeight: 800,
          fontSize: "0.8rem", cursor: "pointer", zIndex: 100,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          🌲 {totalSteps}
        </button>
      )}

      {/* ══ HOME ══ */}
      {screen === "home" && (
        <div className="card" style={{ textAlign: "center", maxWidth: 500, width: "100%" }}>
          <div style={{ fontSize: "5.5rem", marginBottom: 6, filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.4))" }}>🐻</div>
          <h1 style={{ color: "#FFD700", fontSize: "2.4rem", margin: "0 0 4px", textShadow: "0 2px 16px rgba(255,215,0,0.5)" }}>Svenska med Björn!</h1>
          <p style={{ color: "#a0d4ff", fontSize: "0.9rem", marginBottom: 4, fontFamily: "'Nunito',sans-serif" }}>Учи шведский с Бьёрном! 🇸🇪</p>

          {/* Forest progress pill */}
          <button onClick={() => setScreen("forest")} style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 18, marginTop: 8,
            background: "rgba(72,199,116,0.15)", border: "1px solid rgba(72,199,116,0.4)",
            borderRadius: 30, padding: "6px 16px", cursor: "pointer",
          }}>
            <span style={{ fontSize: "1.2rem" }}>🌲</span>
            <span style={{ color: "#48c774", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "0.82rem" }}>
              Björns skogsväg: {totalSteps} / {TOTAL_STEPS} steg
            </span>
          </button>

          {/* Mode selector */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
            {[
              { val: "listen", label: "👂 Lyssna & Upprepa", sub: "Слушай и повторяй" },
              { val: "quiz",   label: "🎯 Quiz",              sub: "Тест" },
            ].map(m => (
              <button key={m.val} onClick={() => setMode(m.val)} style={{
                padding: "10px 14px", borderRadius: 20, border: "2px solid",
                borderColor: mode === m.val ? "#FFD700" : "rgba(255,255,255,0.2)",
                background: mode === m.val ? "#FFD700" : "rgba(255,255,255,0.07)",
                color: mode === m.val ? "#1a1a2e" : "white",
                fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "0.8rem", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              }}>
                <span>{m.label}</span>
                <span style={{ fontSize: "0.68rem", opacity: 0.8 }}>{m.sub}</span>
              </button>
            ))}
          </div>

          <p style={{ color: "#7eb8f7", fontSize: "0.85rem", marginBottom: 12, fontFamily: "'Nunito',sans-serif" }}>
            Välj ett ämne / Выбери тему:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {THEMES.map(t => (
              <button key={t.id} className="tbtn" onClick={() => startTheme(t, mode)} style={{
                padding: "14px 10px", borderRadius: 20,
                border: "2px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.07)", backdropFilter: "blur(8px)",
                color: "white", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              }}>
                <span style={{ fontSize: "2rem" }}>{t.emoji}</span>
                <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "0.85rem" }}>{t.label}</span>
                <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: "0.68rem", opacity: 0.65 }}>{t.labelRu}</span>
                {(progress[t.id] || 0) > 0 && (
                  <span style={{ fontSize: "0.7rem", color: "#48c774", fontFamily: "'Nunito',sans-serif", fontWeight: 800 }}>
                    ✓ {progress[t.id]} steg
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ══ FOREST MAP ══ */}
      {screen === "forest" && (
        <ForestMap
          steps={totalSteps}
          collected={allCollected}
          onClose={() => setScreen("home")}
        />
      )}

      {/* ══ LISTEN MODE ══ */}
      {screen === "listen" && w && (
        <div className={`card ${shake ? "shake" : ""} ${bounce ? "bounce" : ""}`}
          style={{ maxWidth: 440, width: "100%", textAlign: "center" }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ color: "#a0c4ff", fontFamily: "'Nunito',sans-serif", fontSize: "0.82rem" }}>{wordIndex + 1} / {words.length}</span>
            <div style={{ flex: 1, margin: "0 10px", height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ width: `${((wordIndex + 1) / words.length) * 100}%`, height: "100%", background: "linear-gradient(90deg,#FFD700,#ff9500)", borderRadius: 10, transition: "width 0.4s ease" }} />
            </div>
            <span style={{ color: "#48c774", fontFamily: "'Nunito',sans-serif", fontWeight: 800 }}>⭐{score}</span>
          </div>

          {/* Björn */}
          <div style={{ marginBottom: 10 }}>
            <div className={bjornTalking ? "bjorn-talk" : bjornMood === "great" ? "bjorn-happy" : ""}
              style={{ fontSize: "4.5rem", display: "inline-block", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}>
              {bjornMood === "great" ? "🥳" : "🐻"}
            </div>
            <div style={{
              background: "rgba(255,255,255,0.1)", borderRadius: 14, padding: "7px 14px",
              margin: "6px auto 0", maxWidth: 280, border: "1px solid rgba(255,255,255,0.15)",
            }}>
              <div style={{ color: "white", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "0.88rem" }}>{bjornMsg.sv}</div>
              {bjornMsg.ru && <div style={{ color: "#a0c4ff", fontFamily: "'Nunito',sans-serif", fontSize: "0.72rem", marginTop: 2 }}>{bjornMsg.ru}</div>}
            </div>
          </div>

          {/* Word card */}
          <div style={{
            background: "rgba(255,255,255,0.09)", borderRadius: 26, padding: "24px 18px", marginBottom: 14,
            border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(12px)",
          }}>
            <div style={{ fontSize: "4.5rem", marginBottom: 8 }}>{w.emoji}</div>
            <div style={{ color: "#FFD700", fontSize: "2.6rem", fontWeight: 700, marginBottom: 4, letterSpacing: 1 }}>{w.sv}</div>
            <div style={{ color: "#a0d4ff", fontSize: "1.15rem", fontFamily: "'Nunito',sans-serif", fontWeight: 700 }}>{w.ru}</div>
            <button onClick={speakWord} style={{
              marginTop: 10, background: "rgba(255,215,0,0.15)", border: "2px solid #FFD700",
              borderRadius: 50, padding: "7px 18px", color: "#FFD700",
              fontFamily: "'Nunito',sans-serif", fontWeight: 800, cursor: "pointer", fontSize: "0.8rem",
            }}>🔊 Lyssna igen / Слушать снова</button>
          </div>

          {/* Mic */}
          {!showTapBtns ? (
            <div style={{ textAlign: "center" }}>
              <button className={micState === "listening" ? "micring" : ""}
                onClick={micState === "listening" ? () => { try { recRef.current?.stop(); } catch {} setMicState("idle"); } : startListening}
                disabled={micState === "correct"}
                style={{
                  width: 84, height: 84, borderRadius: "50%",
                  border: `3px solid ${micColor}`, background: micBg,
                  cursor: micState === "correct" ? "default" : "pointer",
                  fontSize: "2.2rem", display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 10px", transition: "all 0.25s ease",
                }}>{micIcon}</button>
              <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: "0.85rem", color: "#a0c4ff", minHeight: 26 }}>
                {micState === "idle" && "Tap 🎤 and say the word in Swedish!"}
                {micState === "listening" && <span style={{ color: "#ff9999" }}>🔴 Слушаю... / Listening...</span>}
                {micState === "wrong" && heardText && <span style={{ color: "#ff9999" }}>I heard: "{heardText}"</span>}
                {micState === "correct" && <span style={{ color: "#48c774", fontWeight: 800 }}>✅ Perfekt!</span>}
              </div>
              {retryCount > 0 && micState !== "correct" && (
                <button onClick={skipWord} style={{
                  marginTop: 6, background: "transparent", border: "none",
                  color: "#7eb8f7", fontFamily: "'Nunito',sans-serif", cursor: "pointer", fontSize: "0.78rem",
                }}>Skip / Пропустить →</button>
              )}
            </div>
          ) : (
            <div>
              <p style={{ color: "#FFD700", fontFamily: "'Nunito',sans-serif", fontSize: "0.8rem", marginBottom: 10 }}>
                Tap the Swedish word! / Нажми шведское слово!
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[w.sv, ...words.filter((_, i) => i !== wordIndex).sort(() => Math.random() - 0.5).slice(0, 3).map(x => x.sv)]
                  .sort(() => Math.random() - 0.5).map((opt, i) => (
                  <button key={i} className="opt pop" onClick={async () => {
                    if (opt === w.sv) {
                      setScore(s => s + 1); setBounce(true); setTimeout(() => setBounce(false), 600);
                      awardStep(themeRef.current?.id);
                      await bjornSay(PRAISE[Math.floor(Math.random() * PRAISE.length)], "great");
                      const next = wordIndex + 1;
                      if (next >= words.length) setScreen("result");
                      else { setWordIndex(next); setShowTapBtns(false); setTimeout(speakWord, 400); }
                    } else {
                      setShake(true); setTimeout(() => setShake(false), 500);
                      await bjornSay({ sv: "Försök igen!", ru: "Попробуй ещё раз!" }, "wrong");
                      await speakOut(w.sv, "sv-SE", 0.75, 1.05);
                    }
                  }} style={{
                    padding: "14px 8px", borderRadius: 16, border: "2px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.08)", color: "white",
                    fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "0.95rem",
                    cursor: "pointer", backdropFilter: "blur(8px)", animationDelay: `${i * 0.07}s`,
                  }}>{opt}</button>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => setScreen("home")} style={{
            marginTop: 14, background: "transparent", border: "none",
            color: "#7eb8f7", fontFamily: "'Nunito',sans-serif", cursor: "pointer", fontSize: "0.8rem",
          }}>← Hem / Домой</button>
        </div>
      )}

      {/* ══ QUIZ MODE ══ */}
      {screen === "quiz" && q && (
        <div className={`card ${shake ? "shake" : ""}`}
          style={{ maxWidth: 460, width: "100%", textAlign: "center" }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ color: "#a0c4ff", fontFamily: "'Nunito',sans-serif", fontSize: "0.82rem" }}>{current + 1} / {questions.length}</span>
            <div style={{ flex: 1, margin: "0 10px", height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ width: `${((current + 1) / questions.length) * 100}%`, height: "100%", background: "linear-gradient(90deg,#FFD700,#ff9500)", borderRadius: 10, transition: "width 0.4s ease" }} />
            </div>
            <span style={{ color: "#48c774", fontFamily: "'Nunito',sans-serif", fontWeight: 800 }}>⭐{score}</span>
          </div>

          {/* Björn */}
          <div style={{ marginBottom: 10 }}>
            <div className={bjornTalking ? "bjorn-talk" : bjornMood === "great" ? "bjorn-happy" : ""}
              style={{ fontSize: "3.8rem", display: "inline-block" }}>
              {bjornMood === "great" ? "🥳" : "🐻"}
            </div>
            <div style={{
              background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: "6px 14px",
              margin: "6px auto 0", maxWidth: 260, border: "1px solid rgba(255,255,255,0.12)",
            }}>
              <div style={{ color: "white", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "0.85rem" }}>{bjornMsg.sv}</div>
              {bjornMsg.ru && <div style={{ color: "#a0c4ff", fontFamily: "'Nunito',sans-serif", fontSize: "0.7rem" }}>{bjornMsg.ru}</div>}
            </div>
          </div>

          {/* Question */}
          <div style={{
            background: "rgba(255,255,255,0.08)", borderRadius: 22, padding: "18px 16px", marginBottom: 12,
            border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(10px)",
          }}>
            <div style={{ fontSize: "3.2rem", marginBottom: 8 }}>{q.emoji}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <span style={{ color: "#FFD700", fontSize: "2rem", fontWeight: 700 }}>{q.sv}</span>
              <button onClick={() => speakOut(q.sv, "sv-SE", 0.75, 1.05)} style={{
                background: "rgba(255,215,0,0.2)", border: "2px solid #FFD700", borderRadius: "50%",
                width: 32, height: 32, cursor: "pointer", fontSize: "0.85rem",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>🔊</button>
            </div>
            <div style={{ color: "#a0d4ff", fontFamily: "'Nunito',sans-serif", fontSize: "0.8rem", marginTop: 6, opacity: 0.85 }}>
              Как это по-русски? / Vad heter det på ryska?
            </div>
          </div>

          {/* Mic button for quiz */}
          {!showTapBtns && (
            <div style={{ textAlign: "center", marginBottom: 10 }}>
              <button className={micState === "listening" ? "micring" : ""}
                onClick={micState === "listening" ? () => { try { recRef.current?.stop(); } catch {} setMicState("idle"); } : startQuizMic}
                disabled={micState === "correct"}
                style={{
                  width: 72, height: 72, borderRadius: "50%",
                  border: `3px solid ${micColor}`, background: micBg,
                  cursor: micState === "correct" ? "default" : "pointer",
                  fontSize: "1.9rem", display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 8px", transition: "all 0.25s ease",
                }}>{micIcon}</button>
              <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: "0.8rem", color: "#a0c4ff", minHeight: 22 }}>
                {micState === "idle" && "🎤 Say it in Russian! / Скажи по-русски!"}
                {micState === "listening" && <span style={{ color: "#ff9999" }}>🔴 Listening... / Слушаю...</span>}
                {micState === "correct" && <span style={{ color: "#48c774", fontWeight: 800 }}>✅ Perfekt!</span>}
                {micState === "wrong" && heardText && <span style={{ color: "#ff9999" }}>"{heardText}" — try again!</span>}
              </div>
              {retryCount > 0 && micState !== "correct" && (
                <button onClick={() => setShowTapBtns(true)} style={{
                  marginTop: 4, background: "transparent", border: "none",
                  color: "#7eb8f7", fontFamily: "'Nunito',sans-serif", cursor: "pointer", fontSize: "0.76rem",
                }}>Use buttons / Использовать кнопки</button>
              )}
            </div>
          )}

          {/* Tap buttons */}
          {showTapBtns && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {q.options.map((opt, i) => {
                const isSel = selected === opt, isRight = opt === q.ru;
                let bg = "rgba(255,255,255,0.07)", bc = "rgba(255,255,255,0.12)";
                if (selected !== null) {
                  if (isRight)    { bg = "rgba(72,199,116,0.3)";  bc = "#48c774"; }
                  else if (isSel) { bg = "rgba(255,107,107,0.3)"; bc = "#ff6b6b"; }
                }
                return (
                  <button key={i} className="opt pop" disabled={selected !== null}
                    onClick={() => handleTap(opt)} style={{
                      padding: "14px 8px", borderRadius: 16, border: `2px solid ${bc}`, background: bg,
                      color: "white", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.95rem",
                      cursor: selected !== null ? "default" : "pointer",
                      backdropFilter: "blur(8px)", animationDelay: `${i * 0.07}s`,
                    }}>
                    {selected !== null && isRight && "✅ "}{isSel && !isRight && "❌ "}{opt}
                  </button>
                );
              })}
            </div>
          )}

          <button onClick={() => setScreen("home")} style={{
            marginTop: 14, background: "transparent", border: "none",
            color: "#7eb8f7", fontFamily: "'Nunito',sans-serif", cursor: "pointer", fontSize: "0.8rem",
          }}>← Hem / Домой</button>
        </div>
      )}

      {/* ══ RESULT ══ */}
      {screen === "result" && (
        <div className="card" style={{ textAlign: "center", maxWidth: 420, width: "100%" }}>
          <div className="bjorn-happy" style={{ fontSize: "5rem", display: "inline-block", marginBottom: 6 }}>🥳</div>
          <div style={{ fontSize: "2.2rem", marginBottom: 6 }}>{getStars()}</div>
          <h2 style={{ color: "#FFD700", fontSize: "1.9rem", margin: "0 0 4px" }}>
            {score >= totalAnswered * 0.8 ? "Fantastiskt!" : "Bra jobbat!"}
          </h2>
          <p style={{ color: "#a0c4ff", fontFamily: "'Nunito',sans-serif", fontSize: "0.95rem", marginBottom: 14 }}>
            {score >= totalAnswered * 0.8 ? "Отлично! Ты молодец! 🎉" : "Хорошая работа! 👍"}
          </p>
          <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 20, padding: "16px", margin: "0 0 12px", border: "1px solid rgba(255,255,255,0.12)" }}>
            <div style={{ color: "white", fontSize: "2.6rem", fontWeight: 700 }}>{score}/{totalAnswered}</div>
            <div style={{ color: "#7eb8f7", fontFamily: "'Nunito',sans-serif", fontSize: "0.85rem" }}>rätta svar / правильных ответов</div>
          </div>

          {/* Collected this session */}
          {sessionCollected.length > 0 && (
            <div style={{ background: "rgba(72,199,116,0.1)", border: "1px solid rgba(72,199,116,0.3)", borderRadius: 16, padding: "12px", marginBottom: 14 }}>
              <div style={{ color: "#48c774", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "0.85rem", marginBottom: 6 }}>
                🎒 Björn hittade / Бьёрн нашёл:
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                {sessionCollected.map((item, i) => (
                  <span key={i} style={{ fontSize: "1.8rem" }}>{item}</span>
                ))}
              </div>
            </div>
          )}

          {/* Forest progress mini */}
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 16, padding: "10px 14px", marginBottom: 16 }}>
            <div style={{ color: "#48c774", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "0.82rem", marginBottom: 6 }}>
              🌲 Björns skogsväg: {totalSteps} / {TOTAL_STEPS} steg
            </div>
            <div style={{ height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ width: `${(totalSteps / TOTAL_STEPS) * 100}%`, height: "100%", background: "linear-gradient(90deg,#48c774,#FFD700)", borderRadius: 10, transition: "width 0.6s ease" }} />
            </div>
            <button onClick={() => setScreen("forest")} style={{
              marginTop: 8, background: "transparent", border: "none",
              color: "#48c774", fontFamily: "'Nunito',sans-serif", cursor: "pointer", fontSize: "0.78rem", fontWeight: 800,
            }}>Se skogen → / Посмотреть лес →</button>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => startTheme(theme, mode)} style={{
              padding: "12px 20px", borderRadius: 50, border: "none",
              background: "linear-gradient(135deg,#FFD700,#ff9500)",
              color: "#1a1a2e", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "0.9rem", cursor: "pointer",
            }}>🔄 Igen! / Ещё раз!</button>
            <button onClick={() => setScreen("home")} style={{
              padding: "12px 20px", borderRadius: 50, border: "2px solid #4a6fa5", background: "transparent",
              color: "#a0c4ff", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
            }}>🏠 Hem / Домой</button>
          </div>
        </div>
      )}
    </div>
  );
}
