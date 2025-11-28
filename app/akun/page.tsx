"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User as UserAvatar, // UBAH NAMA IMPORT AGAR TIDAK BENTROK DENGAN STATE 'user'
  CreditCard,
  History,
  ShieldCheck,
  Palette,
  HelpCircle,
  LogOut,
  LogIn,
  KeyRound,
  ChevronRight,
  Wallet,
  Ticket,
  Home,
  MessageSquare,
  User as UserIcon,
  X,
  Loader2,
  Mail,
} from "lucide-react";

// --- FIREBASE IMPORTS ---
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";

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
const provider = new GoogleAuthProvider();

export default function AccountPage() {
  const router = useRouter();

  // State User (Tambahkan <any> untuk menghindari error TypeScript)
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // State untuk Reset Password Modal
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);

  // Cek Status Login Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fungsi Login (Google)
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login gagal:", error);
      alert("Gagal login. Coba lagi.");
    }
  };

  // Fungsi Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout gagal:", error);
    }
  };

  // --- LOGIC RESET PASSWORD ---
  const initiateResetPassword = () => {
    if (user && user.email) {
      setResetEmail(user.email);
      setIsResetModalOpen(true);
    } else {
      setResetEmail("");
      setIsResetModalOpen(true);
    }
  };

  const handleSendResetEmail = async () => {
    if (!resetEmail) return alert("Mohon masukkan email.");

    setIsSendingReset(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert(
        `Email reset password telah dikirim ke ${resetEmail}. Silakan cek inbox/spam Anda.`
      );
      setIsResetModalOpen(false);
    } catch (error: any) {
      console.error("Error reset password:", error);
      let msg = "Gagal mengirim email reset.";
      if (error.code === "auth/user-not-found") msg = "Email tidak terdaftar.";
      if (error.code === "auth/invalid-email") msg = "Format email salah.";
      alert(msg);
    } finally {
      setIsSendingReset(false);
    }
  };

  // List Menu
  const menuItems = [
    {
      icon: UserAvatar, // Menggunakan nama import baru
      label: "Profil Personal",
      desc: "Ubah nama, foto, dan informasi pribadi",
    },
    {
      icon: CreditCard,
      label: "Metode Pembayaran",
      desc: "Kelola kartu kredit & dompet digital",
    },
    {
      icon: History,
      label: "Riwayat Transaksi",
      desc: "Lihat semua aktivitas & pembelian",
    },
    {
      icon: ShieldCheck,
      label: "Keamanan & Privacy",
      desc: "Autentikasi dua faktor & pengaturan privasi",
    },
    {
      icon: Palette,
      label: "Personalisasi",
      desc: "Tema, notifikasi, dan preferensi",
    },
    {
      icon: HelpCircle,
      label: "Bantuan & Dukungan",
      desc: "FAQ, live chat, dan kontak support",
    },
  ];

  // --- FOOTER COMPONENT ---
  const renderFooter = () => (
    <div className="fixed bottom-6 left-0 right-0 z-50 px-4 flex justify-center">
      <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40 rounded-2xl p-2 flex items-center justify-between gap-1 sm:gap-4 max-w-sm w-full transition-all duration-300 hover:border-emerald-500/30">
        <button
          onClick={() => router.push("/pembelajaran")}
          className="relative group flex-1 flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 text-slate-400 hover:text-white hover:bg-white/5"
        >
          <div className="transition-transform duration-300 group-hover:scale-110">
            <Home size={24} strokeWidth={2} />
          </div>
          <span className="text-[10px] font-medium mt-1 transition-all duration-300 opacity-0 translate-y-2 hidden group-hover:block group-hover:opacity-100 group-hover:translate-y-0">
            Home
          </span>
        </button>
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
        <button
          onClick={() => router.push("/akun")}
          className="relative group flex-1 flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 text-emerald-400 bg-white/5"
        >
          <div className="transition-transform duration-300 scale-110">
            <UserIcon size={24} strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-medium mt-1 transition-all duration-300 opacity-100 translate-y-0">
            Akun
          </span>
          <span className="absolute bottom-1 w-1 h-1 bg-emerald-500 rounded-full shadow-[0_0_8px_2px_rgba(16,185,129,0.6)]"></span>
        </button>
      </div>
    </div>
  );

  return (
    // Background Radial Gradient
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black text-white pb-32">
      <div className="max-w-md mx-auto p-4">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Profil & Pengaturan
          </h1>
        </div>

        {/* USER CARD */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 mb-6 shadow-2xl relative overflow-hidden group">
          {/* Glow effect background */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[80px] -ml-10 -mb-10 pointer-events-none"></div>

          <div className="flex items-center gap-5 relative z-10">
            {/* Avatar */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-900/30 p-[2px]">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // Gunakan UserAvatar di sini (bukan User)
                  <UserAvatar size={30} className="text-slate-300" />
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white leading-tight mb-1.5">
                {loading
                  ? "Loading..."
                  : user
                  ? user.displayName || "User"
                  : "Guest User"}
              </h2>
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border ${
                    user
                      ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                      : "bg-slate-700/50 border-slate-600 text-slate-300"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      user ? "bg-emerald-400 animate-pulse" : "bg-slate-400"
                    }`}
                  ></span>
                  <p className="text-xs font-medium">
                    {user ? user.email || "Online" : "Belum Login"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-slate-800/30 border border-white/5 rounded-2xl p-4 flex flex-col justify-center items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50"></div>
            <div className="text-xs text-slate-400 mb-1 flex items-center gap-1 z-10">
              <Wallet size={14} className="text-blue-400" /> SALDO AKTIF
            </div>
            <div className="text-xl font-extrabold text-white z-10 tracking-tight">
              Rp 0
            </div>
          </div>
          <div className="bg-slate-800/30 border border-white/5 rounded-2xl p-4 flex flex-col justify-center items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-50"></div>
            <div className="text-xs text-slate-400 mb-1 flex items-center gap-1 z-10">
              <Ticket size={14} className="text-emerald-400" /> VOUCHER
            </div>
            <div className="text-xl font-extrabold text-emerald-400 z-10 tracking-tight">
              0 Tersedia
            </div>
          </div>
        </div>

        {/* MENU ITEMS */}
        <div className="space-y-2.5 mb-8">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              className="w-full bg-slate-800/20 hover:bg-slate-800/40 border border-white/5 hover:border-white/10 rounded-2xl p-3.5 flex items-center gap-4 transition-all duration-300 group text-left backdrop-blur-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900/50 border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors duration-300">
                <item.icon size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-slate-200 group-hover:text-white transition-colors">
                  {item.label}
                </h3>
                <p className="text-[11px] text-slate-500 group-hover:text-slate-400 line-clamp-1 transition-colors">
                  {item.desc}
                </p>
              </div>
              <ChevronRight
                size={16}
                className="text-slate-700 group-hover:text-slate-300 transition-colors"
              />
            </button>
          ))}
        </div>

        {/* ACTION BUTTONS */}
        <div className="space-y-3">
          {user ? (
            <>
              {/* Tombol Reset Password untuk User Login */}
              <button
                onClick={initiateResetPassword}
                className="w-full bg-slate-900/50 hover:bg-slate-900 border border-white/10 hover:border-white/20 text-slate-300 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300"
              >
                <KeyRound size={18} /> Reset Password
              </button>

              <button
                onClick={handleLogout}
                className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300"
              >
                <LogOut size={18} /> Keluar dari Akun
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 transition-all duration-300"
              >
                <LogIn size={18} /> Masuk ke Akun
              </button>

              {/* Tombol Reset Password untuk Guest */}
              <button
                onClick={initiateResetPassword}
                className="w-full bg-slate-900/50 hover:bg-slate-900 border border-white/10 hover:border-white/20 text-slate-300 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300"
              >
                <KeyRound size={18} /> Lupa Password
              </button>
            </>
          )}
        </div>
      </div>

      {/* --- MODAL RESET PASSWORD --- */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] w-full max-w-sm p-6 shadow-2xl relative">
            <button
              onClick={() => setIsResetModalOpen(false)}
              className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-8 mt-2">
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner shadow-blue-500/20">
                <KeyRound size={36} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Reset Password
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Masukkan email yang terdaftar. Kami akan mengirimkan tautan
                pemulihan.
              </p>
            </div>

            <div className="space-y-4 mb-2">
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  size={20}
                />
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full bg-slate-900/50 border border-slate-800/50 text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 focus:bg-slate-900 transition-all placeholder:text-slate-600"
                />
              </div>

              <button
                onClick={handleSendResetEmail}
                disabled={isSendingReset}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isSendingReset ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Mengirim...
                  </>
                ) : (
                  "Kirim Link Reset"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {renderFooter()}
    </div>
  );
}
