"use client";

import globalStyles from "@/styles/globalStyles";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

const { colors } = globalStyles;

const Sidebar = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const username = useSelector(
    (state: RootState) => state.user.username || "John Doe"
  );

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/logout");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
      setLoading(false);
    }
  };

  const getInitialsFromFullName = (fullName: string) => {
    if (!fullName) return "U";
    const nameParts = fullName.trim().split(" ");
    const first = nameParts[0]?.charAt(0).toUpperCase() || "";
    const last = nameParts[nameParts.length - 1]?.charAt(0).toUpperCase() || "";
    return `${first}${last}`;
  };

  return (
    <aside
      className="w-72 min-h-screen border-r px-4 py-6 flex flex-col justify-between"
      style={{
        background: `linear-gradient(to bottom, ${colors.background}, ${colors.gradientTo})`,
        borderRightColor: colors.border,
      }}
    >
      <div>
        {/* Workspace Header */}
        <div className="mb-6">
          <h2
            className="text-xl font-bold mb-2"
            style={{ color: colors.primary }}
          >
            Workspace
          </h2>
          <div className="flex items-center gap-2">
            <Avatar className="w-9 h-9">
              <AvatarImage
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="User"
              />
              <AvatarFallback>
                {getInitialsFromFullName(username)}
              </AvatarFallback>
            </Avatar>
            <span
              className="text-sm font-medium"
              style={{ color: colors.text }}
            >
              {username}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search or jump to..."
            className="w-full px-3 py-2 text-sm rounded bg-gray-100 focus:outline-none"
          />
        </div>

        {/* Direct Messages */}
        <div>
          <h3 className="text-sm font-semibold mb-2 text-gray-500">
            Direct Messages
          </h3>
          {[
            { name: "Sarah Johnson", status: "text-green-500" },
            { name: "Mike Chen", status: "text-yellow-500" },
            { name: "Alex Wong", status: "text-red-500" },
            { name: "Emily Davis", status: "text-gray-400" },
          ].map((dm) => (
            <div
              key={dm.name}
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 cursor-pointer"
            >
              <i className={`fas fa-circle ${dm.status}`} />
              <span style={{ color: colors.text }}>{dm.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Dropdown */}
      <div className="mt-6 border-t pt-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center justify-between gap-2 cursor-pointer px-2 py-1 rounded hover:bg-gray-100 transition">
              <div className="flex items-center gap-2">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/profile.jpg" alt="Profile" />
                  <AvatarFallback>
                    {getInitialsFromFullName(username)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm" style={{ color: colors.text }}>
                  {username}
                </span>
              </div>
              <ChevronDown size={16} className="text-muted-foreground" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48 shadow-lg">
            <DropdownMenuLabel className="flex items-center gap-2 text-sm font-medium">
              <User size={16} />
              {username}
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
    </aside>
  );
};

export default Sidebar;
