"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import globalStyles from "@/styles/globalStyles";

const VerifyOtp = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const colors = globalStyles.colors;

  const [otp, setOtp] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const queryPhone = searchParams.get("phoneNumber");
    if (queryPhone) {
      setUserPhone(queryPhone);
      localStorage.setItem("userPhone", queryPhone);
    } else {
      const stored = localStorage.getItem("userPhone");
      if (stored) setUserPhone(stored);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: userPhone, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed");

      setSuccess(true); // ✅ Show success message
      setTimeout(() => {
        router.push("/login"); // ✅ Navigate after 2 seconds
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background: `linear-gradient(to bottom right, ${colors.secondary}, white, ${colors.primary})`,
      }}
    >
      <div
        className="w-full max-w-md p-8 shadow-2xl rounded-2xl"
        style={{ backgroundColor: colors.background }}
      >
        {/* Header */}
        <div className="relative mb-6 h-32 flex items-center">
          <ArrowLeftIcon
            onClick={() => router.back()}
            className="absolute left-0 cursor-pointer hover:opacity-80"
            style={{ color: colors.primary }}
            size={24}
          />

          <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
            <div
              className="p-3 rounded-full"
              style={{ backgroundColor: "#007bff" }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "#ffffff" }}
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <circle cx="9" cy="10" r="1" />
                <circle cx="13" cy="10" r="1" />
                <circle cx="17" cy="10" r="1" />
              </svg>
            </div>
            <div className="text-center">
              <h1
                className="text-2xl font-bold"
                style={{ color: colors.primary }}
              >
                Verify OTP
              </h1>
              <p className="text-sm" style={{ color: colors.muted }}>
                Enter the code sent to <strong>{userPhone}</strong>
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="otp">OTP</Label>
            <Input
              id="otp"
              name="otp"
              inputMode="numeric"
              pattern="\d*"
              maxLength={6}
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              required
            />
          </div>

          {error && (
            <p
              className="text-sm font-medium text-center"
              style={{ color: colors.danger }}
            >
              {error}
            </p>
          )}

          {success && (
            <p
              className="text-sm font-medium text-center"
              style={{ color: colors.success || "green" }}
            >
              ✅ OTP verification successful!
            </p>
          )}

          <Button
            type="submit"
            className="w-full flex items-center justify-center gap-2"
            style={{
              backgroundColor: colors.primary,
              color: "#fff",
            }}
            disabled={loading}
          >
            {loading && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z"
                ></path>
              </svg>
            )}
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
