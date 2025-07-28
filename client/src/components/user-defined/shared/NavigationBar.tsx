"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import globalStyles from "@/styles/globalStyles";

const NavigationBar = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { primary, border, danger, text, lightText } = globalStyles.colors;

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/logout");
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (err) {
      console.error("Logout error:", err);
      setLoading(false);
    }
  };

  return (
    <nav
      style={{
        backgroundColor: globalStyles.colors.gradientFrom,
        borderBottom: `2px solid ${border}`,
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: primary }}>
        ChatBot
      </div>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Link
          href="/dashboard"
          style={{
            backgroundColor: globalStyles.colors.tabInactiveBg,
            color: text,
            padding: "0.5rem 1rem",
            borderRadius: "0.375rem",
            textDecoration: "none",
          }}
        >
          Dashboard
        </Link>

        <button
          onClick={handleLogout}
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            borderRadius: "0.375rem",
            backgroundColor: danger,
            color: lightText,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = "#b91c1c"; // dark red
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = danger;
          }}
        >
          {loading && (
            <span
              style={{
                width: "1rem",
                height: "1rem",
                border: "2px solid white",
                borderTopColor: "transparent",
                borderRadius: "9999px",
                animation: "spin 1s linear infinite",
              }}
            />
          )}
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </nav>
  );
};

export default NavigationBar;
