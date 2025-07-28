"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import globalStyles from "@/styles/globalStyles";

const SignUpForm = () => {
  const router = useRouter();
  const colors = globalStyles.colors;

  const [formData, setFormData] = useState({
    phoneNumber: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      const cleanedValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: cleanedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const { phoneNumber, email, password } = formData;

    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!phoneRegex.test(phoneNumber)) {
      return "Phone number must be exactly 10 digits and contain only numbers.";
    }

    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
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
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch {
      setError("Something went wrong. Please try again.");
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
        className="w-full max-w-2xl p-8 shadow-2xl rounded-2xl"
        style={{ backgroundColor: colors.background }}
      >
        <div className="relative mb-6 h-32 flex items-center">
          <ArrowLeftIcon
            onClick={() => router.push("/")}
            className="absolute left-0 cursor-pointer hover:opacity-80"
            style={{ color: colors.primary }}
            size={24}
          />

          <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
            <div
              className="p-3 rounded-full"
              style={{ backgroundColor: colors.gradientFrom }}
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
                style={{ color: colors.primary }}
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <circle cx="9" cy="10" r="1" />
                <circle cx="13" cy="10" r="1" />
                <circle cx="17" cy="10" r="1" />
              </svg>
            </div>
            <div className="text-center">
              <h1
                className="text-3xl font-bold"
                style={{ color: colors.primary }}
              >
                Chat-App
              </h1>
              <p className="text-sm" style={{ color: colors.muted }}>
                Create your account to start chatting
              </p>
            </div>
          </div>
        </div>

        <CardHeader className="mb-4">
          <CardTitle
            className="text-xl text-center font-semibold"
            style={{ color: colors.text }}
          >
            Sign Up
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="phoneNumber" className="mb-1 block">
                Phone Number *
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                placeholder="e.g. 9876543210"
                value={formData.phoneNumber}
                onChange={handleChange}
                inputMode="numeric"
                pattern="\d*"
                maxLength={10}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="firstName" className="mb-1 block">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="e.g. John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="middleName" className="mb-1 block">
                  Middle Name
                </Label>
                <Input
                  id="middleName"
                  name="middleName"
                  placeholder="e.g. Michael"
                  value={formData.middleName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="mb-1 block">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="e.g. Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="mb-1 block">
                Email *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="mb-1 block">
                Password *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a secure password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pr-10"
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
              className="w-full transition duration-300 ease-in-out"
              style={{
                backgroundColor: colors.primary,
                color: "#fff",
              }}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>

          <p
            className="text-center text-sm mt-4"
            style={{ color: colors.muted }}
          >
            Already have an account?{" "}
            <span
              className="cursor-pointer hover:underline"
              style={{ color: colors.primary }}
              onClick={() => router.push("/login")}
            >
              Log in
            </span>
          </p>
        </CardContent>
      </div>
    </div>
  );
};

export default SignUpForm;
