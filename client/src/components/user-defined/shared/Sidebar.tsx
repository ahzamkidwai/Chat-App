"use client";

import globalStyles from "@/styles/globalStyles";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import ProfileDropDown from "./Sidebar/ProfileDropDown";
import SearchBar from "./Sidebar/SearchBar";
import AvatarHeader from "./Sidebar/AvatarHeader";
import DirectMessages from "./Sidebar/DirectMessages";

const Sidebar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<number | undefined>();

  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const username = useSelector(
    (state: RootState) => state.user.username || "John Doe"
  );
  const reloadKey = useSelector((state: RootState) => state.user.reloadKey);
  const token = useSelector((state: RootState) => state.user.token);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/user-profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
        const data = await response.json();
        setProfileImageUrl(data.profile.profilePhotoUrl || "");
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, [reloadKey]);

  const {
    sidebarBg,
    sidebarBorder,
    sidebarText,
    sidebarHeading,
    sidebarInputText,
    hoverText,
  } = globalStyles.colors;

  return (
    <aside
      className="fixed top-0 left-0 w-72 min-h-screen border-r px-4 py-6 flex flex-col"
      style={{
        backgroundColor: sidebarBg,
        borderRightColor: sidebarBorder,
        color: sidebarText,
      }}
    >
      {/* Top content */}
      <div className="flex-1">
        {/* Workspace Header */}
        <div className="mb-6">
          <h2
            className="text-xl font-bold mb-2 cursor-pointer"
            style={{ color: sidebarHeading }}
            onClick={() => router.push("/")}
          >
            Workspace
          </h2>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <AvatarHeader
              profileImageUrl={profileImageUrl}
              username={username}
            />
            <span
              className="text-sm font-medium"
              style={{ color: sidebarHeading }}
            >
              {username}
            </span>
          </div>
        </div>

        {/* Search */}
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Direct Messages */}

        <DirectMessages />
      </div>

      <ProfileDropDown profileImageUrl={profileImageUrl} username={username} />
    </aside>
  );
};

export default Sidebar;
