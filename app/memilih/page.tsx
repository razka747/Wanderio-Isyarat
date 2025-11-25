"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const goDifababel = () => router.push("/penerjemah");
  const goUser = () => router.push("/memilih");

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Pilih Cara Masuk</h1>
        <p style={styles.subtitle}>Pilih peran untuk melanjutkan.</p>

        <div style={styles.buttons}>
          <button
            aria-label="Masuk sebagai Difababel"
            onClick={goDifababel}
            style={{ ...styles.button, ...styles.primary }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              style={{ marginRight: 10 }}
            >
              <path
                d="M12 2v6"
                stroke="white"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 10c1.8-1.5 3.6-2 6-2s4.2.5 6 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8z"
                stroke="white"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Masuk sebagai Difababel
          </button>

          <button
            aria-label="Login sebagai User Biasa"
            onClick={goUser}
            style={{ ...styles.button, ...styles.secondary }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              style={{ marginRight: 10 }}
            >
              <circle cx="12" cy="8" r="3" stroke="white" strokeWidth="1.4" />
              <path
                d="M5 20a7 7 0 0 1 14 0"
                stroke="white"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            Login sebagai User Biasa
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: { [k: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(180deg,#071018 0%, #0b0f14 60%)",
    fontFamily:
      "Inter, Roboto, system-ui, -apple-system, 'Segoe UI', sans-serif",
    color: "#e6eef8",
    padding: 20,
  },
  card: {
    width: 420,
    maxWidth: "92%",
    padding: 28,
    borderRadius: 14,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
    boxShadow: "0 8px 30px rgba(2,6,23,0.7)",
    border: "1px solid rgba(255,255,255,0.03)",
  },
  title: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: -0.2,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 20,
    color: "rgba(230,238,248,0.7)",
    fontSize: 13,
  },
  buttons: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "12px 16px",
    borderRadius: 10,
    cursor: "pointer",
    border: "none",
    fontWeight: 600,
    fontSize: 15,
    transition: "transform .13s ease, box-shadow .13s ease, opacity .13s ease",
    userSelect: "none",
  },
  primary: {
    background: "linear-gradient(90deg, #06b6d4, #7c3aed)",
    boxShadow:
      "0 6px 18px rgba(124,58,237,0.18), inset 0 -2px 6px rgba(0,0,0,0.2)",
    color: "#fff",
  },
  secondary: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "rgba(230,238,248,0.95)",
  },
  tertiary: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.04)",
    color: "rgba(230,238,248,0.9)",
  },
};
