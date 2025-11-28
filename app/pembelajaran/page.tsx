"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Volume2,
  Check,
  X,
  RotateCcw,
  Trophy,
  Star,
  BookOpen,
  Gamepad2,
  Zap,
  Brain,
  ArrowLeft,
  Play,
  Home,
  MessageSquare,
  User as UserIcon,
  LogOut, // Import icon LogOut
} from "lucide-react";

// --- FIREBASE IMPORTS ---
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

// --- FIREBASE CONFIG ---
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

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// --- TYPES ---
interface SignItem {
  letter: string;
  image: string;
  description: string;
}

interface SignDataMap {
  [key: string]: SignItem[];
}

const SignLanguageApp = () => {
  const router = useRouter();
  const pathname = usePathname();

  // --- STATE ---
  const [screen, setScreen] = useState<string>("home");
  const [currentCategory, setCurrentCategory] = useState<string>("alfabet");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);

  // State untuk User Firebase
  const [username, setUsername] = useState<string>("Loading...");

  // --- USE EFFECT: AUTH CHECK ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Ambil nama display atau bagian depan email
        const name = user.displayName || user.email?.split("@")[0] || "User";
        setUsername(name);
      } else {
        setUsername("Tamu");
      }
    });

    return () => unsubscribe();
  }, []);

  // --- LOGOUT FUNCTION ---
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/"); // Redirect ke halaman awal
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const signData: SignDataMap = {
    alfabet: [
      {
        letter: "A",
        image: "sign/sign_a.png",
        description: "Kepalan tangan dengan ibu jari di samping",
      },
      {
        letter: "B",
        image: "sign/sign_b.png",
        description: "Telapak terbuka, jari rapat, ibu jari dilipat",
      },
      {
        letter: "C",
        image: "sign/sign_c.png",
        description: "Bentuk huruf C dengan tangan",
      },
      {
        letter: "D",
        image: "sign/sign_d.png",
        description: "Telunjuk tegak, jari lain menyentuh ibu jari",
      },
      {
        letter: "E",
        image: "sign/sign_e.png",
        description: "Kepalan dengan jari melengkung",
      },
      {
        letter: "F",
        image: "sign/sign_f.png",
        description: "Telunjuk dan ibu jari menyentuh, jari lain tegak",
      },
      {
        letter: "G",
        image: "sign/sign_g.png",
        description: "Telunjuk dan ibu jari horizontal, jari lain tertutup",
      },
      {
        letter: "H",
        image: "sign/sign_h.png",
        description: "Telunjuk dan jari tengah horizontal memanjang",
      },
      {
        letter: "I",
        image: "sign/sign_i.png",
        description: "Kelingking tegak, jari lain tertutup",
      },
      {
        letter: "J",
        image: "sign/sign_j.png",
        description: "Kelingking tegak membentuk huruf J",
      },
      {
        letter: "K",
        image: "sign/sign_k.png",
        description: "Telunjuk tegak, jari tengah miring, ibu jari di tengah",
      },
      {
        letter: "L",
        image: "sign/sign_l.png",
        description: "Bentuk L dengan telunjuk dan ibu jari",
      },
      {
        letter: "M",
        image: "sign/sign_m.png",
        description: "Ibu jari di bawah tiga jari pertama",
      },
      {
        letter: "N",
        image: "sign/sign_n.png",
        description: "Ibu jari di bawah dua jari pertama",
      },
      {
        letter: "O",
        image: "sign/sign_o.png",
        description: "Bentuk lingkaran dengan semua jari",
      },
      {
        letter: "P",
        image: "sign/sign_p.png",
        description: "Seperti K tapi mengarah ke bawah",
      },
      {
        letter: "Q",
        image: "sign/sign_q.png",
        description: "Seperti G tapi mengarah ke bawah",
      },
      {
        letter: "R",
        image: "sign/sign_r.png",
        description: "Telunjuk dan jari tengah menyilang",
      },
      {
        letter: "S",
        image: "sign/sign_s.png",
        description: "Kepalan dengan ibu jari di depan jari",
      },
      {
        letter: "T",
        image: "sign/sign_t.png",
        description: "Ibu jari di antara telunjuk dan jari tengah",
      },
      {
        letter: "U",
        image: "sign/sign_u.png",
        description: "Telunjuk dan jari tengah tegak berdekatan",
      },
      {
        letter: "V",
        image: "sign/sign_v.png",
        description: "Telunjuk dan jari tengah tegak terpisah",
      },
      {
        letter: "W",
        image: "sign/sign_w.png",
        description: "Telunjuk, jari tengah, dan jari manis tegak terpisah",
      },
      {
        letter: "X",
        image: "sign/sign_x.png",
        description: "Telunjuk bengkok seperti kait",
      },
      {
        letter: "Y",
        image: "sign/sign_y.png",
        description: "Ibu jari dan kelingking terbuka",
      },
      {
        letter: "Z",
        image: "sign/sign_z.png",
        description: "Telunjuk menggambar huruf Z di udara",
      },
    ],
    angka: [
      {
        letter: "1",
        image: "sign/sign_1.png",
        description: "Satu jari telunjuk tegak",
      },
      {
        letter: "2",
        image: "sign/sign_2.png",
        description: "Telunjuk dan jari tengah tegak",
      },
      {
        letter: "3",
        image: "sign/sign_3.png",
        description: "Telunjuk, tengah, dan jari manis tegak",
      },
      {
        letter: "4",
        image: "sign/sign_4.png",
        description: "Empat jari tegak, ibu jari dilipat",
      },
      {
        letter: "5",
        image: "sign/sign_5.png",
        description: "Semua jari terbuka lebar",
      },
      {
        letter: "6",
        image: "sign/sign_6.png",
        description: "Ibu jari dan kelingking menyentuh",
      },
      {
        letter: "7",
        image: "sign/sign_7.png",
        description: "Ibu jari menyentuh jari manis",
      },
      {
        letter: "8",
        image: "sign/sign_8.png",
        description: "Ibu jari menyentuh jari tengah",
      },
      {
        letter: "9",
        image: "sign/sign_9.png",
        description: "Ibu jari menyentuh telunjuk",
      },
      {
        letter: "10",
        image: "sign/sign_10.png",
        description: "Kepalan bergoyang",
      },
    ],
    sapaan: [
      {
        letter: "Halo",
        image: "sign/sign_halo.png",
        description: "Lambaikan tangan terbuka",
      },
      {
        letter: "Terima Kasih",
        image: "sign/sign_terimakasih.png",
        description: "Tangan dari dagu turun ke depan",
      },
      {
        letter: "Maaf",
        image: "sign/sign_maaf.png",
        description: "Kepalan melingkar di dada",
      },
      {
        letter: "Tolong",
        image: "sign/sign_tolong.png",
        description: "Tangan terbuka di depan dada",
      },
      {
        letter: "Ya",
        image: "sign/sign_ya.png",
        description: "Kepalan mengangguk",
      },
      {
        letter: "Tidak",
        image: "sign/sign_tidak.png",
        description: "Tangan menggeleng",
      },
    ],
  };

  const currentData = signData[currentCategory];
  const currentSign = currentData[currentIndex] || currentData[0];

  const nextSign = () => {
    setShowAnswer(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % currentData.length);
  };

  const prevSign = () => {
    setShowAnswer(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setFlipped(false);
    setCurrentIndex(
      (prev) => (prev - 1 + currentData.length) % currentData.length
    );
  };

  const checkAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === currentSign.letter;
    setIsCorrect(correct);
    setShowAnswer(true);

    if (correct) {
      setScore(score + 1);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      nextSign();
    }, 1500);
  };

  const getRandomOptions = () => {
    if (!currentSign) return [];

    const options = [currentSign.letter];
    const allLetters = currentData.map((item) => item.letter);
    const maxOptions = Math.min(4, allLetters.length);

    while (options.length < maxOptions) {
      const randomLetter =
        allLetters[Math.floor(Math.random() * allLetters.length)];
      if (!options.includes(randomLetter)) {
        options.push(randomLetter);
      }
    }

    return options.sort(() => Math.random() - 0.5);
  };

  const startMode = (mode: string) => {
    setScreen(mode);
    setScore(0);
    setStreak(0);
    setCurrentIndex(0);
    setShowAnswer(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setFlipped(false);
  };

  const backToHome = () => {
    setScreen("home");
    setScore(0);
    setStreak(0);
    setCurrentIndex(0);
  };

  // --- COMPONENT: HEADER (USER & LOGOUT) ---
  const renderHeader = () => (
    <div className="absolute top-4 right-4 z-50 flex items-center gap-3 bg-slate-800/80 backdrop-blur-md border border-slate-700 p-1.5 pr-4 rounded-full shadow-lg">
      <div className="bg-emerald-600 p-1.5 rounded-full">
        <UserIcon size={16} className="text-white" />
      </div>
      <span className="font-bold text-xs lg:text-sm text-white max-w-[100px] truncate">
        {username}
      </span>
      <button
        onClick={handleLogout}
        className="text-red-400 ml-2 hover:text-red-300 transition-colors"
        title="Log Out"
      >
        <LogOut size={16} />
      </button>
    </div>
  );

  // --- COMPONENT: FOOTER ---
  const renderFooter = () => (
    <div className="fixed bottom-6 left-0 right-0 z-50 px-4 flex justify-center">
      <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-emerald-900/20 rounded-2xl p-2 flex items-center justify-between gap-1 sm:gap-4 max-w-sm w-full transition-all duration-300 hover:border-emerald-500/30">
        {/* MENU: HOME (AKTIF) */}
        <button
          onClick={() => router.push("/pembelajaran")}
          className="relative group flex-1 flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 text-emerald-400 bg-white/5"
        >
          <div className="transition-transform duration-300 scale-110">
            <Home size={24} strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-medium mt-1 transition-all duration-300 opacity-100 translate-y-0">
            Home
          </span>
          <span className="absolute bottom-1 w-1 h-1 bg-emerald-500 rounded-full shadow-[0_0_8px_2px_rgba(16,185,129,0.6)]"></span>
        </button>

        {/* MENU: MARI BERKOMUNIKASI */}
        <button
          onClick={() => router.push("/penerjemah")}
          className="relative -top-5 mx-2 group"
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center border-4 border-slate-950 shadow-lg transition-all duration-300 bg-slate-800 text-slate-300 hover:bg-emerald-600 hover:text-white hover:scale-105">
            <MessageSquare size={24} fill="none" />
          </div>
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-max text-[10px] font-bold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-900/90 px-2 py-0.5 rounded-full border border-white/10">
            Mulai Chat
          </span>
        </button>

        {/* MENU: AKUN */}
        <button
          onClick={() => router.push("/akun")}
          className="relative group flex-1 flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 text-slate-400 hover:text-white hover:bg-white/5"
        >
          <div className="transition-transform duration-300 group-hover:scale-110">
            <UserIcon size={24} strokeWidth={2} />
          </div>
          <span className="text-[10px] font-medium mt-1 transition-all duration-300 opacity-0 translate-y-2 hidden group-hover:block group-hover:opacity-100 group-hover:translate-y-0">
            Akun
          </span>
        </button>
      </div>
    </div>
  );

  // --- RENDER SCREENS ---

  // Home Screen
  if (screen === "home") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-4 pb-28 relative">
        {renderHeader()} {/* HEADER ADDED */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 pt-8">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              🤟 Belajar Bahasa Isyarat
            </h1>
            <p className="text-gray-400 text-xl">
              Pilih metode belajar yang sesuai dengan gaya Anda
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-center mb-6 text-purple-300">
              Pilih Kategori
            </h2>
            <div className="flex gap-4 flex-wrap justify-center">
              {Object.keys(signData).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCurrentCategory(cat)}
                  className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                    currentCategory === cat
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50 scale-105"
                      : "bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700"
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              onClick={() => startMode("learning")}
              className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-lg rounded-3xl p-8 border border-blue-500/30 hover:border-blue-400/60 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 group"
            >
              <div className="bg-blue-500/20 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen size={40} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-blue-300">
                Mode Belajar
              </h3>
              <p className="text-gray-400 mb-4">
                Pelajari isyarat dengan deskripsi lengkap dan navigasi mudah
              </p>
              <div className="flex items-center text-blue-400 font-semibold">
                <span>Mulai Belajar</span>
                <Play size={16} className="ml-2" />
              </div>
            </div>

            <div
              onClick={() => startMode("flashcard")}
              className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 group"
            >
              <div className="bg-purple-500/20 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap size={40} className="text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-purple-300">
                Flashcard
              </h3>
              <p className="text-gray-400 mb-4">
                Belajar cepat dengan kartu bolak-balik yang interaktif
              </p>
              <div className="flex items-center text-purple-400 font-semibold">
                <span>Mulai Flashcard</span>
                <Play size={16} className="ml-2" />
              </div>
            </div>

            <div
              onClick={() => startMode("quiz")}
              className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-lg rounded-3xl p-8 border border-green-500/30 hover:border-green-400/60 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-green-500/30 group"
            >
              <div className="bg-green-500/20 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain size={40} className="text-green-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-green-300">
                Kuis Interaktif
              </h3>
              <p className="text-gray-400 mb-4">
                Uji pengetahuan dengan kuis pilihan ganda
              </p>
              <div className="flex items-center text-green-400 font-semibold">
                <span>Mulai Kuis</span>
                <Play size={16} className="ml-2" />
              </div>
            </div>

            <div
              onClick={() => startMode("game")}
              className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 backdrop-blur-lg rounded-3xl p-8 border border-orange-500/30 hover:border-orange-400/60 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30 group"
            >
              <div className="bg-orange-500/20 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Gamepad2 size={40} className="text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-orange-300">
                Mode Game
              </h3>
              <p className="text-gray-400 mb-4">
                Belajar sambil bermain dengan tantangan seru
              </p>
              <div className="flex items-center text-orange-400 font-semibold">
                <span>Mulai Game</span>
                <Play size={16} className="ml-2" />
              </div>
            </div>
          </div>

          <div className="mt-12 text-center text-gray-400 bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
            <p className="text-sm">
              💡 <span className="font-semibold">Tips:</span> Setiap metode
              dirancang untuk gaya belajar yang berbeda. Coba semuanya!
            </p>
          </div>
        </div>
        {renderFooter()}
      </div>
    );
  }

  // Learning Mode
  if (screen === "learning") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-4 pb-28 relative">
        {renderHeader()} {/* HEADER ADDED */}
        <div className="max-w-4xl mx-auto">
          <button
            onClick={backToHome}
            className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Kembali ke Menu
          </button>

          <div className="bg-gray-800/30 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 shadow-2xl">
            <div className="text-center mb-8">
              <div className="mb-6 flex justify-center">
                <img
                  src={currentSign.image}
                  alt={`Bahasa isyarat ${currentSign.letter}`}
                  className="w-64 h-64 object-contain rounded-2xl bg-gray-900/50 p-4"
                />
              </div>
              <div className="text-6xl font-bold mb-4 text-purple-300">
                {currentSign.letter}
              </div>

              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105"
              >
                {showAnswer ? "Sembunyikan" : "Lihat"} Deskripsi
              </button>

              {showAnswer && (
                <div className="mt-6 bg-gray-900/50 p-6 rounded-2xl border border-cyan-500/30">
                  <p className="text-cyan-300 text-xl">
                    {currentSign.description}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={prevSign}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                ← Sebelumnya
              </button>

              <div className="text-gray-400">
                {currentIndex + 1} / {currentData.length}
              </div>

              <button
                onClick={nextSign}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Selanjutnya →
              </button>
            </div>
          </div>
        </div>
        {renderFooter()}
      </div>
    );
  }

  // Flashcard Mode
  if (screen === "flashcard") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-4 pb-28 relative">
        {renderHeader()} {/* HEADER ADDED */}
        <div className="max-w-4xl mx-auto">
          <button
            onClick={backToHome}
            className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Kembali ke Menu
          </button>

          <div className="text-center mb-6">
            <div className="text-gray-400">
              {currentIndex + 1} / {currentData.length}
            </div>
          </div>

          <div
            onClick={() => setFlipped(!flipped)}
            className="relative w-full h-96 cursor-pointer"
            style={{ perspective: "1000px" }}
          >
            <div
              className="absolute w-full h-full transition-all duration-500"
              style={{
                transformStyle: "preserve-3d",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front */}
              <div
                className="absolute w-full h-full"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <div className="bg-gradient-to-br from-purple-600/30 to-pink-600/30 backdrop-blur-xl rounded-3xl p-12 border border-purple-500/30 shadow-2xl h-full flex flex-col items-center justify-center">
                  <img
                    src={currentSign.image}
                    alt={`Bahasa isyarat ${currentSign.letter}`}
                    className="w-48 h-48 object-contain mb-6"
                  />
                  <p className="text-gray-400">Klik untuk melihat jawaban</p>
                </div>
              </div>

              {/* Back */}
              <div
                className="absolute w-full h-full"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="bg-gradient-to-br from-blue-600/30 to-cyan-600/30 backdrop-blur-xl rounded-3xl p-12 border border-blue-500/30 shadow-2xl h-full flex flex-col items-center justify-center">
                  <div className="text-6xl font-bold mb-4 text-blue-300">
                    {currentSign.letter}
                  </div>
                  <p className="text-cyan-300 text-xl text-center">
                    {currentSign.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={prevSign}
              className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              ← Sebelumnya
            </button>

            <button
              onClick={nextSign}
              className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              Selanjutnya →
            </button>
          </div>
        </div>
        {renderFooter()}
      </div>
    );
  }

  // Quiz Mode
  if (screen === "quiz") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-4 pb-28 relative">
        {renderHeader()} {/* HEADER ADDED */}
        <div className="max-w-4xl mx-auto">
          <button
            onClick={backToHome}
            className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Kembali ke Menu
          </button>

          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-4 mb-6 flex justify-around items-center border border-purple-500/20">
            <div className="flex items-center gap-2">
              <Trophy className="text-yellow-400" size={24} />
              <div>
                <div className="text-sm text-gray-400">Skor</div>
                <div className="text-2xl font-bold text-yellow-400">
                  {score}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="text-orange-400" size={24} />
              <div>
                <div className="text-sm text-gray-400">Streak</div>
                <div className="text-2xl font-bold text-orange-400">
                  {streak}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 shadow-2xl">
            <div className="text-center mb-8">
              <div className="mb-6 flex justify-center">
                <img
                  src={currentSign.image}
                  alt={`Bahasa isyarat ${currentSign.letter}`}
                  className="w-64 h-64 object-contain rounded-2xl bg-gray-900/50 p-4"
                />
              </div>
              <p className="text-2xl text-gray-300 mb-8">
                Apa arti dari isyarat ini?
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                {getRandomOptions().map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => checkAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className={`p-6 rounded-xl font-bold text-2xl transition-all duration-300 transform hover:scale-105 ${
                      selectedAnswer === option
                        ? isCorrect
                          ? "bg-green-500 shadow-lg shadow-green-500/50"
                          : "bg-red-500 shadow-lg shadow-red-500/50"
                        : selectedAnswer !== null &&
                          option === currentSign.letter
                        ? "bg-green-500 shadow-lg shadow-green-500/50"
                        : "bg-gray-700 hover:bg-gray-600"
                    } ${selectedAnswer !== null ? "cursor-not-allowed" : ""}`}
                  >
                    {option}
                    {selectedAnswer === option && (
                      <span className="ml-2">
                        {isCorrect ? (
                          <Check size={24} className="inline" />
                        ) : (
                          <X size={24} className="inline" />
                        )}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        {renderFooter()}
      </div>
    );
  }

  // Game Mode
  if (screen === "game") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-4 pb-28 relative">
        {renderHeader()} {/* HEADER ADDED */}
        <div className="max-w-4xl mx-auto">
          <button
            onClick={backToHome}
            className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Kembali ke Menu
          </button>

          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-4 mb-6 flex justify-around items-center border border-orange-500/20">
            <div className="flex items-center gap-2">
              <Trophy className="text-yellow-400" size={24} />
              <div>
                <div className="text-sm text-gray-400">Skor</div>
                <div className="text-2xl font-bold text-yellow-400">
                  {score}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="text-orange-400" size={24} />
              <div>
                <div className="text-sm text-gray-400">Streak</div>
                <div className="text-2xl font-bold text-orange-400">
                  {streak}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="text-purple-400" size={24} />
              <div>
                <div className="text-sm text-gray-400">Level</div>
                <div className="text-2xl font-bold text-purple-400">
                  {Math.floor(score / 5) + 1}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl p-8 border border-orange-500/30 shadow-2xl">
            <div className="text-center mb-8">
              <div className="mb-6 flex justify-center">
                <img
                  src={currentSign.image}
                  alt={`Bahasa isyarat ${currentSign.letter}`}
                  className="w-64 h-64 object-contain rounded-2xl bg-gray-900/50 p-4 animate-bounce"
                />
              </div>
              <p className="text-2xl text-gray-300 mb-8">
                Cepat! Tebak isyarat ini!
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                {getRandomOptions().map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => checkAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className={`p-6 rounded-xl font-bold text-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                      selectedAnswer === option
                        ? isCorrect
                          ? "bg-green-500 shadow-lg shadow-green-500/50"
                          : "bg-red-500 shadow-lg shadow-red-500/50"
                        : selectedAnswer !== null &&
                          option === currentSign.letter
                        ? "bg-green-500 shadow-lg shadow-green-500/50"
                        : "bg-gradient-to-br from-orange-600 to-pink-600 hover:from-orange-500 hover:to-pink-500"
                    } ${selectedAnswer !== null ? "cursor-not-allowed" : ""}`}
                  >
                    {option}
                    {selectedAnswer === option && (
                      <span className="ml-2">
                        {isCorrect ? (
                          <Check size={24} className="inline" />
                        ) : (
                          <X size={24} className="inline" />
                        )}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        {renderFooter()}
      </div>
    );
  }
};

export default SignLanguageApp;
