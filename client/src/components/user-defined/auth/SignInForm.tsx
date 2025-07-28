"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import globalStyles from "@/styles/globalStyles";
import SvgLogo from "../shared/SvgLogo";

const SignInForm = () => {
  const router = useRouter();
  const colors = globalStyles.colors;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("phone");
  const [formData, setFormData] = useState({
    phoneNumber: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const { phoneNumber, email, password } = formData;

    if (loginMethod === "phone") {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return "Phone number must be exactly 10 digits.";
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return "Please enter a valid email address.";
      }
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }

    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        loginId:
          loginMethod === "phone" ? formData.phoneNumber : formData.email,
        password: formData.password,
      };

      const response = await fetch(`${API_URL}/login-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      console.log("Login successful:", data);
      router.push("/");
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
            onClick={() => router.push("/")}
            className="absolute left-0 cursor-pointer hover:opacity-80"
            style={{ color: colors.primary }}
            size={24}
          />

          <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
            <SvgLogo />
            <div className="text-center">
              <h1
                className="text-3xl font-bold"
                style={{ color: colors.primary }}
              >
                Chat-App
              </h1>
              <p className="text-sm" style={{ color: colors.muted }}>
                Log in to start chatting
              </p>
            </div>
          </div>
        </div>

        <CardHeader className="mb-4">
          <CardTitle
            className="text-xl text-center font-semibold"
            style={{ color: colors.text }} // Black
          >
            Sign In
          </CardTitle>
        </CardHeader>

        {/* Tabs */}
        <div className="flex justify-center mb-6 gap-4">
          {["phone", "email"].map((method) => {
            const isActive = loginMethod === method;
            return (
              <button
                key={method}
                type="button"
                onClick={() => setLoginMethod(method as "phone" | "email")}
                className={`px-5 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-300 border ${
                  isActive ? "scale-105" : "hover:scale-105 hover:shadow-md"
                }`}
                style={{
                  backgroundColor: isActive
                    ? colors.tabActiveBg
                    : colors.tabInactiveBg,
                  color: isActive ? colors.primary : colors.text,
                  borderColor: isActive ? colors.tabBorder : "transparent",
                  borderWidth: "1px",
                }}
              >
                {method === "phone" ? "Phone" : "Email"}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {loginMethod === "phone" ? (
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                placeholder="9876543210"
                inputMode="numeric"
                pattern="\d*"
                maxLength={10}
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
          ) : (
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
                style={{ color: colors.muted }}
              >
                {showPassword ? (
                  <EyeOffIcon size={18} />
                ) : (
                  <EyeIcon size={18} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p
              className="text-sm font-medium text-center"
              style={{ color: colors.danger }}
            >
              {error}
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
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <p className="text-center text-sm mt-4" style={{ color: colors.muted }}>
          Don’t have an account?{" "}
          <span
            className="cursor-pointer hover:underline"
            style={{ color: colors.primary }}
            onClick={() => router.push("/signup")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;
