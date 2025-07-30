"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import globalStyles from "@/styles/globalStyles";
import SvgLogo from "./SvgLogo";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

const NavigationBar = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { colors } = globalStyles;
  const username = useSelector((state: RootState) => state.user.username);
  console.log("Username from Redux:", username);

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

  const getInitialsFromFullName = (fullName: string) => {
    if (!fullName) return "U"; // fallback

    const nameParts = fullName.trim().split(" ");
    const first = nameParts[0]?.charAt(0).toUpperCase() || "";
    const last = nameParts[nameParts.length - 1]?.charAt(0).toUpperCase() || "";

    return `${first}${last}`;
  };

  return (
    <nav
      className="w-full px-4 sm:px-10 py-4 flex items-center justify-between border-b shadow-sm"
      style={{
        background: `linear-gradient(to right, ${colors.gradientFrom}, ${colors.background}, ${colors.gradientTo})`,
        borderBottomColor: colors.border,
      }}
    >
      <div className="flex items-center gap-3">
        <SvgLogo />
        <span
          className="text-xl sm:text-2xl font-bold tracking-tight"
          style={{ color: colors.primary }}
        >
          Chat-App
        </span>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-1 cursor-pointer hover:ring-offset-1 hover:ring-primary transition">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/profile.jpg" alt="Profile" />
                <AvatarFallback>
                  {getInitialsFromFullName(username)}
                </AvatarFallback>
              </Avatar>
              <ChevronDown size={18} className="text-muted-foreground" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48 shadow-lg">
            <DropdownMenuLabel className="flex items-center gap-2 text-sm font-medium">
              <User size={16} />
              {username || "Username"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/profile")}
              className="cursor-pointer"
            >
              <Settings size={16} className="mr-2" />
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={loading}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <LogOut size={16} className="mr-2" />
              {loading ? "Logging out..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
