"use client";

import React, { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../app/firebaseConfig/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";

// Komponen Logo yang sedikit dimodernisasi warnanya
const AppLogo = ({ size = 56 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
    <rect width="64" height="64" rx="16" fill="url(#g)" />
    <path
      d="M20 36c4-6 10-12 20-8"
      stroke="#fff"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" width="20px" height="20px" aria-hidden>
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    ></path>
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    ></path>
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    ></path>
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    ></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoginView, setIsLoginView] = useState<boolean>(true);
  const [showResetForm, setShowResetForm] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>("");
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();

  const getErrorMessage = (err: unknown) =>
    err instanceof Error ? err.message : String(err);

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError(null);
    setSuccess(null);
    setShowResetForm(false);
    setResetError(null);
    setResetSuccess(null);
  };

  const handleEmailLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User logged in:", userCredential.user);
      router.push("/memilih");
    } catch (err) {
      setError(getErrorMessage(err));
    }
    setLoading(false);
  };

  const handleEmailSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User registered:", userCredential.user);
      setSuccess("Pendaftaran berhasil! Silakan login.");
      setIsLoginView(true);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(getErrorMessage(err));
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User signed in with Google:", result.user);
      router.push("/memilih");
    } catch (err) {
      setError(getErrorMessage(err));
    }
    setLoading(false);
  };

  const handlePasswordReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResetError(null);
    setResetSuccess(null);
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSuccess("Link reset telah dikirim ke email Anda.");
      setResetEmail("");
    } catch (err) {
      setResetError(getErrorMessage(err));
    }
    setLoading(false);
  };

  return (
    <>
      <div className="pageWrap">
        {/* BACKGROUND AMBIENT LIGHTS */}
        <div className="ambientLight light-1"></div>
        <div className="ambientLight light-2"></div>

        <aside className="welcomePanel" aria-hidden>
          <div className="welcomeInner">
            <div className="logoWrap">
              <AppLogo size={64} />
              <div className="appName">
                ISYARAT<span className="dot">.</span>
              </div>
            </div>

            <h1 className="heroTitle">Komunikasi Tanpa Batas</h1>
            <p className="heroSubtitle">
              Pelajari bahasa isyarat dengan teknologi AI modern. Cepat,
              interaktif, dan mudah dipahami.
            </p>

            <ul className="benefits">
              <li>
                <span className="icon">🚀</span>
                <div>
                  <strong>Akses Cepat</strong>
                  <span>Materi siap pakai kapan saja.</span>
                </div>
              </li>
              <li>
                <span className="icon">🎯</span>
                <div>
                  <strong>Latihan Interaktif</strong>
                  <span>Feedback real-time.</span>
                </div>
              </li>
              <li>
                <span className="icon">🔒</span>
                <div>
                  <strong>Aman & Privat</strong>
                  <span>Data Anda terlindungi.</span>
                </div>
              </li>
            </ul>
          </div>
        </aside>

        <main className="formPanel" role="main">
          <div className="formCard">
            <div className="formHeader">
              <div className="mobileLogo">
                <AppLogo size={40} />
              </div>
              <h2>
                {showResetForm
                  ? "Reset Password"
                  : isLoginView
                  ? "Selamat Datang"
                  : "Buat Akun Baru"}
              </h2>
              <p>
                {showResetForm
                  ? "Masukkan email untuk memulihkan akun"
                  : isLoginView
                  ? "Masuk untuk melanjutkan progres Anda"
                  : "Bergabunglah dengan komunitas kami"}
              </p>
            </div>

            {!showResetForm && (
              <div className="authTabs">
                <button
                  className={`tab ${isLoginView ? "active" : ""}`}
                  onClick={() => setIsLoginView(true)}
                >
                  Masuk
                </button>
                <button
                  className={`tab ${!isLoginView ? "active" : ""}`}
                  onClick={toggleView}
                >
                  Daftar
                </button>
              </div>
            )}

            {(error || resetError) && (
              <div className="alert error">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>{error || resetError}</span>
              </div>
            )}
            {(success || resetSuccess) && (
              <div className="alert success">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>{success || resetSuccess}</span>
              </div>
            )}

            {!showResetForm ? (
              <>
                <form
                  onSubmit={isLoginView ? handleEmailLogin : handleEmailSignUp}
                  className="authForm"
                >
                  <div className="inputGroup">
                    <label>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="nama@email.com"
                    />
                  </div>

                  <div className="inputGroup">
                    <label>Password</label>
                    <div className="passwordWrap">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="eyeBtn"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <svg
                            width="20"
                            height="20"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            ></path>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            ></path>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {isLoginView && (
                    <div className="forgotRow">
                      <button
                        type="button"
                        className="textLink"
                        onClick={() => {
                          setShowResetForm(true);
                          setError(null);
                          setSuccess(null);
                        }}
                      >
                        Lupa password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="primaryBtn"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner"></span>
                    ) : isLoginView ? (
                      "Masuk ke Akun"
                    ) : (
                      "Buat Akun Baru"
                    )}
                  </button>
                </form>

                <div className="divider">
                  <span>Atau lanjutkan dengan</span>
                </div>

                <button
                  onClick={handleGoogleSignIn}
                  className="googleBtn"
                  disabled={loading}
                >
                  <GoogleIcon />
                  <span>Google</span>
                </button>
              </>
            ) : (
              <form onSubmit={handlePasswordReset} className="authForm">
                <div className="inputGroup">
                  <label>Email untuk reset</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    placeholder="email@contoh.com"
                  />
                </div>

                <div className="btnRow">
                  <button
                    type="button"
                    className="secondaryBtn"
                    onClick={() => {
                      setShowResetForm(false);
                      setResetError(null);
                      setResetSuccess(null);
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="primaryBtn"
                    disabled={loading}
                  >
                    {loading ? "..." : "Kirim Link"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>

      <style jsx>{`
        :root {
          --bg-dark: #020617;
          --bg-card: rgba(15, 23, 42, 0.6);
          --primary: #06b6d4; /* Cyan-500 */
          --primary-hover: #0891b2;
          --accent: #3b82f6; /* Blue-500 */
          --text-main: #f1f5f9;
          --text-muted: #94a3b8;
          --border: rgba(148, 163, 184, 0.1);
          --glow: rgba(6, 182, 212, 0.5);
        }

        .pageWrap {
          min-height: 100vh;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr;
          background-color: var(--bg-dark);
          color: var(--text-main);
          position: relative;
          overflow: hidden;
        }

        /* AMBIENT BACKGROUND LIGHTS */
        .ambientLight {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.4;
          z-index: 0;
          animation: float 10s infinite alternate;
        }
        .light-1 {
          width: 500px;
          height: 500px;
          background: var(--primary);
          top: -100px;
          left: -100px;
        }
        .light-2 {
          width: 600px;
          height: 600px;
          background: var(--accent);
          bottom: -100px;
          right: -100px;
          animation-delay: -5s;
        }
        @keyframes float {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }

        @media (min-width: 1024px) {
          .pageWrap {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* SIDE PANEL (DESKTOP ONLY) */
        .welcomePanel {
          display: none;
          position: relative;
          z-index: 1;
          padding: 60px;
          flex-direction: column;
          justify-content: center;
          backdrop-filter: blur(40px);
          background: rgba(2, 6, 23, 0.3);
          border-right: 1px solid var(--border);
        }
        @media (min-width: 1024px) {
          .welcomePanel {
            display: flex;
          }
        }

        .welcomeInner {
          max-width: 480px;
          margin: 0 auto;
        }

        .logoWrap {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 40px;
        }
        .appName {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(to right, #fff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .dot {
          color: var(--primary);
          -webkit-text-fill-color: var(--primary);
        }

        .heroTitle {
          font-size: 48px;
          line-height: 1.1;
          font-weight: 800;
          margin-bottom: 20px;
          -webkit-background-clip: text;
        }
        .heroSubtitle {
          font-size: 18px;
          line-height: 1.6;
          color: var(--text-muted);
          margin-bottom: 48px;
        }

        .benefits {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .benefits li {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        .icon {
          font-size: 24px;
          background: rgba(255, 255, 255, 0.05);
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          border: 1px solid var(--border);
        }
        .benefits strong {
          display: block;
          color: var(--text-main);
          margin-bottom: 4px;
        }
        .benefits span {
          color: var(--text-muted);
          font-size: 14px;
        }

        /* FORM PANEL */
        .formPanel {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .formCard {
          width: 100%;
          max-width: 420px;
          background: var(--bg-card);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .mobileLogo {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }
        @media (min-width: 1024px) {
          .mobileLogo {
            display: none;
          }
        }

        .formHeader {
          text-align: center;
          margin-bottom: 32px;
        }
        .formHeader h2 {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 8px 0;
        }
        .formHeader p {
          color: var(--text-muted);
          font-size: 14px;
          margin: 0;
        }

        /* TABS */
        .authTabs {
          display: flex;
          background: rgba(0, 0, 0, 0.2);
          padding: 4px;
          border-radius: 12px;
          margin-bottom: 24px;
        }
        .tab {
          flex: 1;
          background: transparent;
          border: none;
          padding: 10px;
          color: var(--text-muted);
          font-weight: 600;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .tab.active {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-main);
          shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        /* ALERTS */
        .alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 13px;
        }
        .alert.error {
          background: rgba(239, 68, 68, 0.1);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .alert.success {
          background: rgba(34, 197, 94, 0.1);
          color: #86efac;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        /* INPUTS */
        .authForm {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .inputGroup {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .inputGroup label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
          margin-left: 4px;
        }

        input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 12px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border);
          color: var(--text-main);
          font-size: 15px;
          transition: all 0.2s;
        }
        input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.15);
          background: rgba(0, 0, 0, 0.5);
        }

        .passwordWrap {
          position: relative;
        }
        .eyeBtn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }
        .eyeBtn:hover {
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.1);
        }

        /* BUTTONS */
        .primaryBtn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          color: white;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
        }
        .primaryBtn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(6, 182, 212, 0.5);
        }
        .primaryBtn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .secondaryBtn {
          padding: 12px 24px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-muted);
          font-weight: 600;
          cursor: pointer;
        }
        .secondaryBtn:hover {
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.05);
        }

        .googleBtn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 14px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-main);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .googleBtn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .forgotRow {
          display: flex;
          justify-content: flex-end;
          margin-top: -10px;
        }
        .textLink {
          background: none;
          border: none;
          color: var(--primary);
          font-size: 13px;
          cursor: pointer;
          font-weight: 500;
        }
        .textLink:hover {
          text-decoration: underline;
        }

        .btnRow {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 8px;
        }

        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 24px 0;
          color: var(--text-muted);
          font-size: 13px;
        }
        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          border-bottom: 1px solid var(--border);
        }
        .divider span {
          padding: 0 12px;
        }

        /* SPINNER */
        .spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          margin: 0;
          padding: 0;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          background: #020617;
          color: #f1f5f9;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </>
  );
}
