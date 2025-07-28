"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import globalStyles from "@/styles/globalStyles";
import SvgLogo from "./shared/SvgLogo";

const { colors } = globalStyles;

const LandingPage = () => {
  return (
    <div
      className="min-h-screen font-sans text-gray-800 px-6 sm:px-12 py-8 flex flex-col justify-between"
      style={{
        background: `linear-gradient(to bottom right, ${colors.gradientFrom}, ${colors.background}, ${colors.gradientTo})`,
      }}
    >
      <header className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <SvgLogo />
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Chat-App
          </h1>
        </div>
        <div className="hidden sm:flex gap-4 items-center">
          <Link href="/login">
            <Button
              variant="ghost"
              style={{ color: colors.primary }}
              className="hover:underline"
            >
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button style={{ backgroundColor: colors.primary, color: "white" }}>
              Sign Up
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex flex-col items-center text-center gap-8 sm:gap-12 mt-10 sm:mt-16">
        <h2
          className="text-4xl sm:text-5xl font-bold"
          style={{ color: colors.text }}
        >
          Chat. Connect. Collaborate — Without Limits.
        </h2>
        <p className="text-lg sm:text-xl" style={{ color: colors.muted }}>
          Welcome to <strong>Chat-App</strong> — where conversations flow fast,
          data stays safe, and privacy is a priority.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/signup">
            <Button
              className="px-6 py-3 text-base"
              style={{ backgroundColor: colors.primary, color: "white" }}
            >
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button
              variant="outline"
              className="px-6 py-3 text-base"
              style={{
                borderColor: colors.primary,
                color: colors.primary,
                backgroundColor: "transparent",
              }}
            >
              Log In
            </Button>
          </Link>
        </div>
      </main>

      <section className="grid md:grid-cols-3 gap-8 mt-20 text-center">
        {[
          {
            title: "🔒 End-to-End Encryption",
            desc: "All messages are encrypted from sender to receiver. Your data is your own.",
          },
          {
            title: "⚡ Real-Time Messaging",
            desc: "Send and receive messages instantly with no delays or interruptions.",
          },
          {
            title: "🛡️ Privacy First",
            desc: "We never store your data unnecessarily. You’re in control of your conversations.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="shadow-md rounded-xl p-6"
            style={{ backgroundColor: colors.background }}
          >
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: colors.text }}
            >
              {item.title}
            </h3>
            <p style={{ color: colors.muted }}>{item.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default LandingPage;
