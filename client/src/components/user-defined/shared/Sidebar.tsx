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

  const {
    sidebarBg,
    sidebarBorder,
    sidebarText,
    sidebarHeading,
    sidebarInputBg,
    sidebarInputText,
    dmOnline,
    dmIdle,
    dmDnd,
    dmOffline,
    hoverBg,
    hoverText,
  } = globalStyles.colors;

  return (
    <aside
      className="w-72 min-h-screen border-r px-4 py-6 flex flex-col justify-between"
      style={{
        backgroundColor: sidebarBg,
        borderRightColor: sidebarBorder,
        color: sidebarText,
      }}
    >
      <div>
        {/* Workspace Header */}
        <div className="mb-6">
          <h2
            className="text-xl font-bold mb-2"
            style={{ color: sidebarHeading }}
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
              style={{ color: sidebarHeading }}
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
            className="w-full px-3 py-2 text-sm rounded focus:outline-none"
            style={{
              backgroundColor: sidebarInputBg,
              color: sidebarInputText,
              border: "none",
            }}
          />
        </div>

        {/* Direct Messages */}
        <div>
          <h3
            className="text-sm font-semibold mb-2"
            style={{ color: dmOffline }}
          >
            Direct Messages
          </h3>
          {[
            { name: "Sarah Johnson", status: "online" },
            { name: "Mike Chen", status: "idle" },
            { name: "Alex Wong", status: "dnd" },
            { name: "Emily Davis", status: "offline" },
          ].map((dm) => (
            <div
              key={dm.name}
              className="flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors"
              style={{
                color: dm.status === "offline" ? dmOffline : sidebarHeading,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = hoverBg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor:
                    dm.status === "online"
                      ? dmOnline
                      : dm.status === "idle"
                      ? dmIdle
                      : dm.status === "dnd"
                      ? dmDnd
                      : dmOffline,
                }}
              />
              <span>{dm.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Dropdown */}
      <div
        className="mt-6 border-t pt-4"
        style={{ borderTopColor: sidebarBorder }}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className="flex items-center justify-between gap-2 cursor-pointer px-2 py-1 rounded transition-colors"
              style={{ color: sidebarHeading }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = hoverBg;
                e.currentTarget.style.color = hoverText;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = sidebarHeading;
              }}
            >
              <div className="flex items-center gap-2">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/profile.jpg" alt="Profile" />
                  <AvatarFallback>
                    {getInitialsFromFullName(username)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{username}</span>
              </div>
              <ChevronDown size={16} style={{ color: sidebarText }} />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-48 shadow-lg"
            style={{
              backgroundColor: sidebarBg,
              borderColor: sidebarBorder,
              color: sidebarText,
            }}
          >
            <DropdownMenuLabel
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: sidebarHeading }}
            >
              <User size={16} />
              {username}
            </DropdownMenuLabel>
            <DropdownMenuSeparator style={{ backgroundColor: sidebarBorder }} />
            <DropdownMenuItem
              onClick={() => router.push("/profile")}
              className="cursor-pointer"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = hoverBg;
                e.currentTarget.style.color = hoverText;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = sidebarText;
              }}
            >
              <Settings size={16} className="mr-2" />
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={loading}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = hoverBg;
                e.currentTarget.style.color = dmDnd;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = dmDnd;
              }}
              style={{
                color: dmDnd,
              }}
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
