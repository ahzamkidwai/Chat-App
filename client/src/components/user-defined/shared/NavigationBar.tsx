"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import globalStyles from "@/styles/globalStyles";
import SvgLogo from "./SvgLogo";

const NavigationBar = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { colors } = globalStyles;

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
      className="w-full px-6 sm:px-12 py-4 flex items-center justify-between border-b"
      style={{
        background: `linear-gradient(to right, ${colors.gradientFrom}, ${colors.background}, ${colors.gradientTo})`,
        borderBottomColor: colors.border,
      }}
    >
      {/* Left side - Logo */}
      <div className="flex items-center gap-3">
        <SvgLogo />
        <span
          className="text-xl sm:text-2xl font-bold"
          style={{ color: colors.primary }}
        >
          Chat-App
        </span>
      </div>

      {/* Right side - Links and Logout */}
      <div className="flex items-center gap-4">
        {/* <Link href="/dashboard">
          <Button
            variant="ghost"
            className="hover:underline"
            style={{
              backgroundColor: colors.tabInactiveBg,
              color: colors.text,
            }}
          >
            Dashboard
          </Button>
        </Link> */}

        <Button
          onClick={handleLogout}
          disabled={loading}
          style={{
            backgroundColor: colors.danger,
            color: colors.lightText,
            opacity: loading ? 0.7 : 1,
          }}
          className="flex items-center gap-2"
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
        </Button>
      </div>

      {/* Spinner keyframes */}
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
