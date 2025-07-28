"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const SignUpForm = () => {
  const router = useRouter();

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      console.log("Submitting form", formData);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl p-8 shadow-2xl bg-white rounded-2xl">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full mb-2">
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
              className="text-blue-600"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <circle cx="9" cy="10" r="1" />
              <circle cx="13" cy="10" r="1" />
              <circle cx="17" cy="10" r="1" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-blue-700">Chat-App</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Create your account to start chatting
          </p>
        </div>

        <CardHeader className="mb-4">
          <CardTitle className="text-xl text-center text-gray-800 font-semibold">
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
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
              <p className="text-sm text-red-600 font-medium text-center">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition duration-300 ease-in-out"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <span
              className="text-blue-600 hover:underline cursor-pointer"
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
