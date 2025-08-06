import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import globalStyles from "@/styles/globalStyles";
import { getInitialsFromFullName } from "@/utils/auth";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AvatarHeader from "./AvatarHeader";

interface ProfileDropDownProps {
  profileImageUrl?: string;
  username?: string;
}

const ProfileDropDown = ({
  profileImageUrl,
  username,
}: ProfileDropDownProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    sidebarBg,
    sidebarBorder,
    sidebarText,
    sidebarHeading,
    dmDnd,
    hoverBg,
    hoverText,
  } = globalStyles.colors;

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

  return (
    <div className="border-t pt-4" style={{ borderTopColor: sidebarBorder }}>
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
              <AvatarHeader
                profileImageUrl={profileImageUrl}
                username={username}
              />
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
  );
};

export default ProfileDropDown;
