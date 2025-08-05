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
import {
  ChevronDown,
  LogOut,
  Settings,
  User,
  Search,
  Phone,
  ChevronRight,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

const Sidebar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const username = useSelector(
    (state: RootState) => state.user.username || "John Doe"
  );

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    const queryStr = searchQuery?.toString() ?? "";
    if (queryStr.length >= 3) {
      setPage(1);
      fetchSearchResults(queryStr, 1);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const fetchSearchResults = async (query: string, currentPage: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/search?phone=${query}&page=${currentPage}&limit=5`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data = await response.json();

      if (currentPage === 1) {
        setSearchResults(data);
      } else {
        setSearchResults((prev) => [...prev, ...data]);
      }

      // If less than 5 items returned, no more to fetch
      setHasMore(data.length === 5);
    } catch (error) {
      console.error("API Error while searching phone number:", error);
    }
  };

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

  // const getInitialsFromFullName = (fullName: string) => {
  //   if (!fullName) return "U";
  //   const nameParts = fullName.trim().split(" ");
  //   const first = nameParts[0]?.charAt(0).toUpperCase() || "";
  //   const last = nameParts[nameParts.length - 1]?.charAt(0).toUpperCase() || "";
  //   return `${first}${last}`;
  // };

  const getInitialsFromFullName = (fullName: string) => {
    if (!fullName) return "U";

    const nameParts = fullName.trim().split(/\s+/); // handles multiple spaces
    const initials = nameParts
      .map((part) => part.charAt(0).toUpperCase())
      .join("");

    return initials;
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
        <div className="mb-4 relative">
          <input
            type="text"
            value={searchQuery?.toString() ?? ""}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d{0,10}$/.test(val)) {
                setSearchQuery(val === "" ? undefined : Number(val));
              }
            }}
            placeholder="Search or jump to..."
            className="w-full px-3 py-2 pr-10 text-sm rounded focus:outline-none"
            style={{
              backgroundColor: sidebarInputBg,
              color: sidebarInputText,
              border: "none",
            }}
          />
          <div className="absolute inset-y-0 right-3 flex items-center">
            {searchQuery && searchQuery.toString().length > 0 ? (
              <X
                className="w-4 h-4 text-gray-400 cursor-pointer"
                onClick={() => setSearchQuery(undefined)}
              />
            ) : (
              <Search className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </div>

        {searchResults.length > 0 && (
          <div
            className="overflow-y-auto mt-2 rounded shadow-lg overflow-x-hidden" // Added overflow-x-hidden
            style={{
              backgroundColor: sidebarInputBg,
              color: sidebarInputText,
              maxHeight: "200px",
              width: "100%",
              border: `1px solid ${sidebarBorder}`,
            }}
            onScroll={(e) => {
              const bottom =
                e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
                e.currentTarget.clientHeight;
              if (bottom && hasMore) {
                const nextPage = page + 1;
                setPage(nextPage);
                fetchSearchResults(searchQuery!.toString(), nextPage);
              }
            }}
          >
            {searchResults.map((user, index) => (
              <div
                key={index}
                className="px-3 py-3 text-sm cursor-pointer transition-all hover:scale-[1.01] group"
                style={{
                  borderBottom: `1px solid ${sidebarBorder}`,
                  backgroundColor: sidebarBg,
                  color: sidebarText,
                }}
                onClick={() => {
                  router.push(`/profile/${user.id}`);
                }}
              >
                <div className="flex items-center gap-3 w-full">
                  {" "}
                  {/* Added w-full */}
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    {" "}
                    {/* Added flex-shrink-0 */}
                    <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                    <AvatarFallback>
                      {getInitialsFromFullName(user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    {" "}
                    <div className="flex items-center gap-2">
                      <p className="font-medium group-hover:text-blue-400 transition-colors truncate">
                        {" "}
                        {/* Added truncate */}
                        {user.fullName || "No Name"}
                      </p>
                      {user.isOnline && (
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: dmOnline }}
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Phone className="w-3 h-3 opacity-70 flex-shrink-0" />{" "}
                      <p className="text-xs opacity-80 truncate">
                        {" "}
                        {user.phoneNumber}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-70 transition-opacity flex-shrink-0" />{" "}
                </div>
              </div>
            ))}
            {hasMore && (
              <div
                className="px-3 py-2 text-center text-xs opacity-70"
                style={{ borderTop: `1px solid ${sidebarBorder}` }}
              >
                Scroll to load more...
              </div>
            )}
          </div>
        )}

        {/* Direct Messages */}
        <div>
          <h3
            className="text-sm font-semibold mb-2 mt-3"
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

      {/* Fixed Profile Dropdown at Bottom */}
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
