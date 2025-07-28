import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 font-sans text-gray-800 px-6 sm:px-12 py-8 flex flex-col justify-between">
      <header className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <circle cx="9" cy="10" r="1" />
            <circle cx="13" cy="10" r="1" />
            <circle cx="17" cy="10" r="1" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 tracking-wide">
            Chat-App
          </h1>
        </div>
        <div className="hidden sm:flex gap-4 items-center">
          <Link href="/login">
            <Button variant="ghost" className="text-blue-700 hover:underline">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Sign Up
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex flex-col items-center text-center gap-8 sm:gap-12 mt-10 sm:mt-16">
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 max-w-3xl">
          Chat. Connect. Collaborate — Without Limits.
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl">
          Welcome to <strong>Chat-App</strong> — where conversations flow fast,
          data stays safe, and privacy is a priority. Secure messaging made
          simple.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/signup">
            <Button className="px-6 py-3 text-base bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button
              variant="outline"
              className="px-6 py-3 text-base border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Log In
            </Button>
          </Link>
        </div>
      </main>

      <section className="grid md:grid-cols-3 gap-8 mt-20 text-center">
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-2">
            🔒 End-to-End Encryption
          </h3>
          <p className="text-gray-600">
            All messages are encrypted from sender to receiver. Your data is
            your own.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-2">⚡ Real-Time Messaging</h3>
          <p className="text-gray-600">
            Send and receive messages instantly with no delays or interruptions.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-2">🛡️ Privacy First</h3>
          <p className="text-gray-600">
            We never store your data unnecessarily. You’re in control of your
            conversations.
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
