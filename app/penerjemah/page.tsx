// app/page.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Send,
  Copy,
  Check,
  Users,
  Hand,
  Camera,
  VideoOff,
  RefreshCcw,
  ArrowLeft,
  LogOut,
  User as UserIcon,
  Volume2,
  VolumeX,
  Loader2,
} from "lucide-react";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  get,
  onValue,
  push,
  remove,
  onDisconnect,
  serverTimestamp,
} from "firebase/database";
import { getAuth, onAuthStateChanged, signOut, type User } from "firebase/auth";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAyYsnXA4VV8zSfGO714d93out3yyTBXvI",
  authDomain: "aplikasi-isyarat.firebaseapp.com",
  databaseURL:
    "https://aplikasi-isyarat-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aplikasi-isyarat",
  storageBucket: "aplikasi-isyarat.firebasestorage.app",
  messagingSenderId: "592587180218",
  appId: "1:592587180218:web:1df705af9842261587da83",
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);
const auth = getAuth(app);

const signLanguageMap: Record<string, string> = {
  a: "✊",
  b: "✋",
  c: "⊂",
  d: "☝️",
  e: "✊",
  f: "👌",
  g: "👉",
  h: "✌️",
  i: "🤙",
  j: "🤙",
  k: "✌️",
  l: "👆",
  m: "👊",
  n: "👊",
  o: "👌",
  p: "👇",
  q: "👇",
  r: "🤞",
  s: "✊",
  t: "👊",
  u: "✌️",
  v: "✌️",
  w: "🤟",
  x: "☝️",
  y: "🤙",
  z: "☝️",
  " ": "✨",
};

const bisindoWordMap: Record<string, string> = {
  halo: "Lambai tangan",
  hai: "Angkat tangan",
  terima: "Telapak tarik ke tubuh",
  kasih: "Tangan gerak ke depan",
  tolong: "Tangan bertemu di dada",
  maaf: "Tangan mengelus dada",
  ya: "Kepalan naik turun",
  tidak: "Tangan menggeleng",
  saya: "Telunjuk ke diri",
  kamu: "Telunjuk ke lawan",
  baik: "Thumbs up",
};

// Gesture Recognition
const recognizeGesture = (lm: any, mode: string) => {
  if (!lm) return null;
  const dist = (a: number, b: number) =>
    Math.sqrt((lm[a].x - lm[b].x) ** 2 + (lm[a].y - lm[b].y) ** 2);

  // Deteksi jari
  const thumbTip = lm[4];
  const thumbIP = lm[3];
  const thumbMCP = lm[2];
  const isThumbOut = Math.abs(thumbTip.x - thumbMCP.x) > 0.05;
  const isThumbUp = thumbTip.y < thumbIP.y - 0.02;
  const thumbExt = isThumbOut || isThumbUp;

  const idxUp = lm[8].y < lm[6].y - 0.01;
  const midUp = lm[12].y < lm[10].y - 0.01;
  const ringUp = lm[16].y < lm[14].y - 0.01;
  const pinkyUp = lm[20].y < lm[18].y - 0.01;

  const idxCurl = lm[8].y > lm[6].y;
  const midCurl = lm[12].y > lm[10].y;
  const ringCurl = lm[16].y > lm[14].y;
  const pinkyCurl = lm[20].y > lm[18].y;

  const fist = idxCurl && midCurl && ringCurl && pinkyCurl;
  const tIdx = dist(4, 8) < 0.06;
  const tMid = dist(4, 12) < 0.06;

  // SIBI (A-Z)
  if (mode === "sibi") {
    if (fist && thumbExt) return "A";
    if (idxUp && midUp && ringUp && pinkyUp && !thumbExt) return "B";
    if (dist(4, 8) > 0.08 && dist(4, 8) < 0.16 && !idxUp && !midUp) return "C";
    if (idxUp && !midUp && !ringUp && !pinkyUp && tMid) return "D";
    if (!idxUp && !midUp && !ringUp && !pinkyUp && dist(8, 5) < 0.09)
      return "E";
    if (tIdx && midUp && ringUp && pinkyUp) return "F";
    if (
      Math.abs(lm[8].x - lm[5].x) > 0.08 &&
      !midUp &&
      !ringUp &&
      !pinkyUp &&
      thumbExt
    )
      return "G";
    if (
      Math.abs(lm[8].x - lm[6].x) > 0.06 &&
      idxUp &&
      midUp &&
      !ringUp &&
      !pinkyUp
    )
      return "H";
    if (!idxUp && !midUp && !ringUp && pinkyUp && !thumbExt) return "I";
    if (!idxUp && !midUp && !ringUp && pinkyUp && thumbExt) return "J";
    if (idxUp && midUp && !ringUp && !pinkyUp && lm[4].y < lm[9].y) return "P";
    if (idxUp && !midUp && !ringUp && !pinkyUp && thumbExt && dist(4, 8) > 0.1)
      return "L";
    if (fist && lm[4].x > lm[12].x) return "M";
    if (fist && lm[4].x < lm[12].x && lm[4].y > lm[8].y) return "N";
    if (tIdx && tMid) return "O";
    if (lm[8].y > lm[6].y && midUp && thumbExt) return "P";
    if (lm[8].y > lm[5].y && lm[4].y > lm[3].y) return "Q";
    if (idxUp && midUp && !ringUp && !pinkyUp && dist(8, 12) < 0.035)
      return "R";
    if (fist && !thumbExt) return "S";
    if (fist && lm[4].x > lm[6].x && lm[4].x < lm[10].x) return "T";
    if (
      idxUp &&
      midUp &&
      !ringUp &&
      !pinkyUp &&
      !thumbExt &&
      dist(8, 12) < 0.04
    )
      return "U";
    if (idxUp && midUp && !ringUp && !pinkyUp && dist(8, 12) > 0.05) return "V";
    if (idxUp && midUp && ringUp && !pinkyUp && !thumbExt) return "W";
    if (!midUp && !ringUp && !pinkyUp && lm[8].y > lm[7].y && lm[7].y < lm[6].y)
      return "X";
    if (thumbExt && !idxUp && !midUp && !ringUp && pinkyUp) return "Y";
    if (idxUp && !midUp && !ringUp && !pinkyUp && tMid) return "Z";
  }

  // BISINDO (A-Z)
  if (mode === "bisindo") {
    if (fist && thumbExt) return "A";
    if (idxUp && midUp && ringUp && pinkyUp && !thumbExt) return "B";
    if (dist(4, 8) > 0.1 && dist(4, 8) < 0.18 && !idxUp && !midUp) return "C";
    if (idxUp && !midUp && !ringUp && !pinkyUp && tMid) return "D";
    if (
      !idxUp &&
      !midUp &&
      !ringUp &&
      !pinkyUp &&
      dist(8, 5) < 0.1 &&
      dist(8, 5) > 0.04
    )
      return "E";
    if (tIdx && midUp && ringUp && pinkyUp) return "F";
    if (Math.abs(lm[8].x - lm[5].x) > 0.1 && !midUp && !ringUp && !pinkyUp)
      return "G";
    if (
      Math.abs(lm[8].x - lm[5].x) > 0.08 &&
      !idxUp &&
      !midUp &&
      !ringUp &&
      !pinkyUp
    )
      return "H";
    if (!idxUp && !midUp && !ringUp && pinkyUp && !thumbExt) return "I";
    if (!idxUp && !midUp && !ringUp && pinkyUp && thumbExt) return "J";
    if (idxUp && midUp && !ringUp && !pinkyUp && lm[4].y < lm[9].y) return "K";
    if (idxUp && !midUp && !ringUp && !pinkyUp && thumbExt && dist(4, 8) > 0.12)
      return "L";
    if (fist && lm[4].x > lm[14].x) return "M";
    if (fist && lm[4].x > lm[10].x && lm[4].x < lm[14].x) return "N";
    if (tIdx && tMid) return "O";
    if (lm[8].y > lm[5].y && !midUp && !ringUp && !pinkyUp) return "P";
    if (lm[8].y > lm[5].y && lm[4].y > lm[2].y) return "Q";
    if (
      idxUp &&
      midUp &&
      !ringUp &&
      !pinkyUp &&
      lm[8].x > lm[12].x &&
      dist(8, 12) < 0.04
    )
      return "R";
    if (fist && !thumbExt) return "S";
    if (fist && lm[4].x > lm[5].x && lm[4].x < lm[9].x) return "T";
    if (idxUp && midUp && !ringUp && !pinkyUp && dist(8, 12) < 0.04) return "U";
    if (idxUp && midUp && !ringUp && !pinkyUp && dist(8, 12) > 0.06)
      return "from ";
    if (idxUp && midUp && ringUp && !pinkyUp) return "W";
    if (!midUp && !ringUp && !pinkyUp && lm[8].y > lm[7].y && lm[7].y < lm[6].y)
      return "X";
    if (thumbExt && !idxUp && !midUp && !ringUp && pinkyUp) return "Y";
    if (idxUp && !midUp && !ringUp && !pinkyUp && tMid) return "Z";
  }
  return null;
};

export default function SignLanguageChat() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [detectedText, setDetectedText] = useState("");
  const [currentGesture, setCurrentGesture] = useState("");
  const [animLetter, setAnimLetter] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [mode, setMode] = useState<"bisindo" | "sibi">("bisindo");
  const [selectedMessageForTranslate, setSelectedMessageForTranslate] =
    useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const handsRef = useRef<any>(null);
  const camRef = useRef<any>(null);
  const scriptLoaded = useRef(false);
  const msgEndRef = useRef<HTMLDivElement>(null);
  const lastG = useRef("");
  const lastT = useRef(0);
  const lastC = useRef("");
  const presRef = useRef<any>(null);

  const speak = (t: string) => {
    if (!soundOn || !t) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.lang = "id-ID";
    u.rate = 0.9;
    speechSynthesis.speak(u);
  };

  const speakL = (l: string) => {
    const p: Record<string, string> = {
      a: "a",
      b: "bé",
      c: "cé",
      d: "dé",
      e: "é",
      f: "ef",
      g: "gé",
      h: "ha",
      i: "i",
      j: "jé",
      k: "ka",
      l: "el",
      m: "em",
      n: "en",
      o: "o",
      p: "pé",
      q: "ki",
      r: "er",
      s: "es",
      t: "té",
      u: "u",
      v: "fé",
      w: "wé",
      x: "ex",
      y: "yé",
      z: "zet",
    };
    speak(p[l.toLowerCase()] || l);
  };

  useEffect(() => {
    const u = onAuthStateChanged(auth, (x) => {
      setAuthUser(x);
      if (x) {
        setUsername(x.displayName || x.email?.split("@")[0] || "");
      }
      setIsAuthLoading(false);
    });
    return () => u();
  }, []);

  useEffect(() => {
    if (scriptLoaded.current) return;
    (async () => {
      setIsModelLoading(true);
      for (const u of [
        "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js",
        "https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js",
        "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js",
        "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js",
      ]) {
        const s = document.createElement("script");
        s.src = u;
        document.body.appendChild(s);
        await new Promise((r) => (s.onload = r));
      }
      scriptLoaded.current = true;
      setIsModelLoading(false);
    })();
  }, []);

  const onResults = (r: any) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 640, 480);
    if (r.image) ctx.drawImage(r.image, 0, 0, 640, 480);
    const w = window as any;
    r.multiHandLandmarks?.forEach((lm: any) => {
      w.drawConnectors?.(ctx, lm, w.HAND_CONNECTIONS, {
        color: "#0f0",
        lineWidth: 2,
      });
      w.drawLandmarks?.(ctx, lm, { color: "#f00", radius: 3 });
      const g = recognizeGesture(lm, mode);
      setCurrentGesture(g || "");
      if (
        g &&
        g === lastG.current &&
        Date.now() - lastT.current > 1000 &&
        lastC.current !== g.toLowerCase()
      ) {
        const c = g.toLowerCase();
        setDetectedText((p) => p + c);
        setMessage((p) => p + c);
        lastC.current = c;
        speakL(c);
      } else if (g !== lastG.current) {
        lastG.current = g || "";
        lastT.current = Date.now();
      }
    });
    if (!r.multiHandLandmarks?.length) {
      setCurrentGesture("");
      lastG.current = "";
      lastC.current = "";
    }
  };

  const startCam = async () => {
    if (!(window as any).Hands) return alert("AI loading...");
    const s = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 },
    });
    if (videoRef.current) {
      videoRef.current.srcObject = s;
      streamRef.current = s;
      setCameraActive(true);
      if (!handsRef.current) {
        const h = new (window as any).Hands({
          locateFile: (f: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
        });
        h.setOptions({
          maxNumHands: mode === "bisindo" ? 2 : 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.7,
        });
        h.onResults(onResults);
        handsRef.current = h;
      }
      if (!camRef.current) {
        camRef.current = new (window as any).Camera(videoRef.current, {
          onFrame: async () =>
            handsRef.current &&
            (await handsRef.current.send({ image: videoRef.current })),
          width: 640,
          height: 480,
        });
      }
      camRef.current.start();
    }
  };

  const stopCam = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setCameraActive(false);
    setCurrentGesture("");
    lastG.current = "";
    lastC.current = "";
    speechSynthesis.cancel();
  };

  const createRoom = async () => {
    if (!username.trim() || isCreating) return;
    setIsCreating(true);
    try {
      const c = Math.random().toString(36).substring(2, 8).toUpperCase();
      await set(ref(db, `rooms/${c}`), {
        creator: username,
        created: serverTimestamp(),
        lastActive: serverTimestamp(),
      });
      setRoomCode(c);
      setConnected(true);
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Gagal membuat room. Silakan coba lagi.");
    } finally {
      setIsCreating(false);
    }
  };

  const joinRoom = async () => {
    if (!username.trim() || !inputCode.trim() || isJoining) return;
    setIsJoining(true);
    try {
      const s = await get(ref(db, `rooms/${inputCode.toUpperCase()}`));
      if (s.exists()) {
        await set(
          ref(db, `rooms/${inputCode.toUpperCase()}/lastActive`),
          serverTimestamp()
        );
        setRoomCode(inputCode.toUpperCase());
        setConnected(true);
      } else {
        alert("Room tidak ditemukan");
      }
    } catch (error) {
      console.error("Error joining room:", error);
      alert("Gagal join room. Silakan coba lagi.");
    } finally {
      setIsJoining(false);
    }
  };

  const sendMsg = async () => {
    if (!message.trim()) return;
    await push(ref(db, `messages/${roomCode}`), {
      text: message,
      sender: username,
      timestamp: Date.now(),
      timeString: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
    setMessage("");
  };

  const animSign = (t: string) => {
    const l = t.toLowerCase().split("");
    let i = 0;
    setIsAnimating(true);
    setSelectedMessageForTranslate(null);
    const iv = setInterval(() => {
      if (i < l.length) {
        setAnimLetter(l[i]);
        speakL(l[i]);
        i++;
      } else {
        clearInterval(iv);
        setIsAnimating(false);
        setAnimLetter("");
        setTimeout(() => speak(t), 300);
      }
    }, 500);
  };

  useEffect(() => {
    if (!connected || !roomCode || !username) return;
    const ur = ref(db, `room_users/${roomCode}/${username}`);
    presRef.current = ur;
    const u1 = onValue(ref(db, ".info/connected"), async (s) => {
      if (s.val()) {
        await onDisconnect(ur).remove();
        await set(ur, { status: "online", timestamp: Date.now() });
      }
    });
    const u2 = onValue(ref(db, `room_users/${roomCode}`), (s) =>
      setOnlineUsers(s.exists() ? Object.keys(s.val()) : [])
    );
    return () => {
      u1();
      u2();
      presRef.current && remove(presRef.current);
    };
  }, [connected, roomCode, username]);

  useEffect(() => {
    if (!connected || !roomCode) return;
    const u = onValue(ref(db, `messages/${roomCode}`), (s) =>
      setMessages(
        s.exists()
          ? Object.keys(s.val())
              .map((k) => ({ id: k, ...s.val()[k] }))
              .sort((a, b) => a.timestamp - b.timestamp)
          : []
      )
    );
    return () => u();
  }, [connected, roomCode]);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(
    () => () => {
      speechSynthesis.cancel();
    },
    []
  );

  const logout = async () => {
    stopCam();
    presRef.current && (await remove(presRef.current));
    try {
      await signOut(auth);
    } catch {}
    setConnected(false);
    setRoomCode("");
    setMessages([]);
    setOnlineUsers([]);
    setUsername("");
    setAuthUser(null);
    router.push("/");
  };

  // LOGIN SCREEN (UPDATED: Fixed Overflow/Offside Button)
  if (!connected)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 flex items-center justify-center text-white">
        <div className="absolute top-6 left-6">
          <button
            onClick={() => router.push("/memilih")}
            className="flex items-center gap-2 text-slate-400 hover:text-white"
          >
            <ArrowLeft size={20} /> Kembali
          </button>
        </div>
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 lg:p-8 max-w-md w-full relative">
          {isAuthLoading && (
            <div className="absolute inset-0 bg-slate-900/80 rounded-3xl flex items-center justify-center z-10">
              <Loader2 size={48} className="animate-spin text-emerald-400" />
            </div>
          )}
          <div className="text-center mb-8">
            <Hand className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
            <h1 className="text-3xl font-bold mb-2">Login Chat</h1>
          </div>
          <div className="space-y-4">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nama Anda"
              disabled={isAuthLoading}
              className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-400 disabled:opacity-50"
            />
            <button
              onClick={createRoom}
              disabled={!username.trim() || isCreating || isAuthLoading}
              className="w-full py-3 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCreating && <Loader2 size={20} className="animate-spin" />}
              {isCreating ? "Membuat..." : "Buat Room Baru"}
            </button>
            <div className="flex gap-2 w-full">
              <input
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="Kode Room"
                disabled={isAuthLoading}
                className="flex-1 min-w-0 px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-400 disabled:opacity-50"
              />
              <button
                onClick={joinRoom}
                disabled={
                  !username.trim() ||
                  !inputCode.trim() ||
                  isJoining ||
                  isAuthLoading
                }
                className="px-4 lg:px-6 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isJoining ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  "Join"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  // MAIN APP - RESPONSIVE LAYOUT
  return (
    <div className="h-screen flex flex-col bg-slate-950 text-white overflow-hidden">
      {/* HEADER (Fixed) */}
      <div className="flex-none z-50 bg-slate-900 border-b border-slate-800 shadow-lg p-3 lg:p-4 flex justify-between items-center">
        <button
          onClick={() => router.push("/memilih")}
          className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full flex items-center gap-2 text-xs lg:text-sm"
        >
          <ArrowLeft size={16} />
          <span className="hidden lg:inline">Kembali</span>
        </button>
        <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700 p-1.5 pr-4 rounded-full">
          <div className="bg-emerald-600 p-1.5 rounded-full">
            <UserIcon size={14} className="lg:w-4 lg:h-4" />
          </div>
          <span className="font-bold text-xs lg:text-sm">{username}</span>
          <button onClick={logout} className="text-red-400 ml-2">
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-7xl mx-auto w-full p-2 gap-2 lg:p-4 lg:gap-4">
        {/* LEFT COLUMN: CAMERA */}
        {/* Mobile: Fixed Height (~220px) to save space. Desktop: 1/3 width, full height */}
        <div className="flex-none h-[220px] lg:h-auto lg:w-1/3 bg-slate-900 rounded-2xl lg:rounded-3xl border border-slate-800 flex flex-col overflow-hidden">
          <div className="p-2 lg:p-3 bg-slate-800 border-b border-slate-700">
            <div className="flex justify-between items-center mb-1 lg:mb-2">
              <h3 className="font-bold text-emerald-400 flex items-center gap-2 text-xs lg:text-sm">
                <Camera size={14} className="lg:w-4 lg:h-4" /> Detektor
              </h3>
              <button
                onClick={() => setSoundOn(!soundOn)}
                className={`p-1 lg:p-1.5 rounded-lg ${
                  soundOn ? "bg-emerald-600" : "bg-slate-700"
                }`}
              >
                {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
              </button>
            </div>
            <div className="flex gap-1 lg:gap-2">
              {(["bisindo", "sibi"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setDetectedText("");
                    setMessage("");
                    handsRef.current?.setOptions({
                      maxNumHands: m === "bisindo" ? 2 : 1,
                    });
                  }}
                  className={`flex-1 py-1 rounded-md text-[10px] font-bold uppercase ${
                    mode === m
                      ? m === "bisindo"
                        ? "bg-emerald-600"
                        : "bg-purple-600"
                      : "bg-slate-700"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 p-2 lg:p-3 flex flex-row lg:flex-col gap-2 overflow-hidden">
            {/* Video Area */}
            <div className="w-1/2 lg:w-full relative bg-black rounded-lg overflow-hidden border border-slate-700 aspect-video lg:aspect-auto lg:flex-1">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-0"
              />
              <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {!cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                  <VideoOff size={24} className="lg:w-8 lg:h-8" />
                  <p className="mt-1 text-[10px] lg:text-xs">Kamera Mati</p>
                </div>
              )}
              {cameraActive && currentGesture && (
                <div className="absolute top-1 right-1 bg-emerald-500 text-white font-bold text-xs lg:text-lg px-2 py-0.5 rounded animate-pulse">
                  {currentGesture}
                </div>
              )}
            </div>

            {/* Controls & Buffer */}
            <div className="w-1/2 lg:w-full flex flex-col gap-2">
              <button
                onClick={cameraActive ? stopCam : startCam}
                disabled={isModelLoading}
                className={`w-full py-1.5 lg:py-2 rounded-lg font-bold text-xs ${
                  cameraActive
                    ? "bg-red-600 hover:bg-red-500"
                    : "bg-emerald-600 hover:bg-emerald-500"
                } disabled:opacity-50`}
              >
                {isModelLoading
                  ? "Loading..."
                  : cameraActive
                  ? "Stop"
                  : "Mulai"}
              </button>
              <div className="flex-1 bg-slate-800/50 rounded-lg border border-slate-700 p-2 overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-bold text-slate-400">
                    BUFFER
                  </span>
                  <button
                    onClick={() => {
                      setDetectedText("");
                      setMessage("");
                    }}
                    className="text-red-400"
                  >
                    <RefreshCcw size={10} />
                  </button>
                </div>
                <div className="text-sm lg:text-lg font-mono font-bold break-all leading-tight overflow-y-auto flex-1">
                  {detectedText || "..."}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CHAT */}
        {/* Flex-1 ensures it takes all remaining height */}
        <div className="flex-1 bg-slate-900 rounded-2xl lg:rounded-3xl border border-slate-800 flex flex-col overflow-hidden relative">
          {/* HEADER */}
          <div className="flex-none p-2 lg:p-3 bg-slate-800 border-b border-slate-700 flex justify-between items-center shadow-sm z-10">
            <div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-emerald-400" />
                <h2 className="font-bold text-xs lg:text-sm">
                  Room: {roomCode}
                </h2>
              </div>
              <p className="text-[10px] text-slate-400">
                {onlineUsers.length} online
              </p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(roomCode);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="p-1.5 hover:bg-slate-700 rounded-lg"
            >
              {copied ? (
                <Check size={14} className="text-emerald-400" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>

          {/* ANIMATION OVERLAY */}
          {isAnimating && (
            <div className="absolute top-[50px] left-0 right-0 bg-emerald-900/90 backdrop-blur-sm p-4 flex flex-col items-center z-20 border-b border-emerald-500/50">
              <div className="text-5xl lg:text-6xl animate-bounce mb-2">
                {signLanguageMap[animLetter] || "✋"}
              </div>
              <p className="text-emerald-400 font-bold text-lg lg:text-xl">
                {animLetter.toUpperCase()}
              </p>
            </div>
          )}

          {/* MESSAGES - Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-3 bg-slate-950/30 scroll-smooth">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50">
                <Hand size={32} className="mb-2 lg:w-12 lg:h-12" />
                <p className="text-xs lg:text-sm">Belum ada pesan</p>
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.sender === username ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-2.5 lg:p-3 rounded-2xl relative shadow-sm ${
                      m.sender === username
                        ? "bg-emerald-600 text-white rounded-tr-none"
                        : "bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="text-[9px] lg:text-[10px] font-bold opacity-75">
                        {m.sender}
                      </span>
                      <span className="text-[9px] lg:text-[10px] opacity-50">
                        {m.timeString}
                      </span>
                    </div>
                    <p className="text-xs lg:text-sm leading-relaxed break-words">
                      {m.text}
                    </p>
                    {bisindoWordMap[m.text.toLowerCase()] && (
                      <div className="mt-2 text-[10px] bg-black/20 rounded px-2 py-1 flex items-center gap-1">
                        <span>🤟</span>
                        <span className="italic">
                          {bisindoWordMap[m.text.toLowerCase()]}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() =>
                        setSelectedMessageForTranslate(
                          m.id === selectedMessageForTranslate ? null : m.id
                        )
                      }
                      className="mt-2 text-[9px] lg:text-[10px] px-2 py-1 rounded-full bg-black/10 hover:bg-black/20 transition-colors flex items-center gap-1 ml-auto"
                    >
                      <Hand size={10} />
                      {selectedMessageForTranslate === m.id
                        ? "Tutup"
                        : "Translate"}
                    </button>
                  </div>
                </div>
              ))
            )}
            <div ref={msgEndRef} />
          </div>

          {/* TRANSLATE MODAL */}
          {selectedMessageForTranslate && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 w-[95%] max-w-sm animate-in slide-in-from-bottom-5 fade-in duration-200">
              <div className="bg-slate-800 rounded-xl shadow-2xl border border-emerald-500/50 p-2.5">
                <div className="flex justify-between items-center mb-2 border-b border-slate-700 pb-1">
                  <span className="text-xs font-bold text-emerald-400">
                    Terjemahkan
                  </span>
                  <button
                    onClick={() => setSelectedMessageForTranslate(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <button
                  onClick={() => {
                    const msg = messages.find(
                      (m) => m.id === selectedMessageForTranslate
                    );
                    if (msg) animSign(msg.text);
                  }}
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Hand size={12} />
                  Mulai Animasi
                </button>
              </div>
            </div>
          )}

          {/* INPUT AREA */}
          <div className="flex-none p-2 lg:p-3 bg-slate-800 border-t border-slate-700 flex gap-2 z-20">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMsg()}
              placeholder="Ketik pesan..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-4 py-2 text-xs lg:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              onClick={sendMsg}
              disabled={!message.trim()}
              className="p-2 lg:p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              <Send size={16} className="lg:w-[18px] lg:h-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
