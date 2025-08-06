import { RootState } from "@/redux/store/store";
import globalStyles from "@/styles/globalStyles";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Search, Phone, ChevronRight, X } from "lucide-react";
import AvatarHeader from "./AvatarHeader";

interface SearchBarProps {
  searchQuery?: number;
  setSearchQuery: (query: number | undefined) => void;
}

const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const token = useSelector((state: RootState) => state.user.token);
  const router = useRouter();

  const {
    sidebarBg,
    sidebarBorder,
    sidebarText,
    sidebarInputBg,
    sidebarInputText,
    dmOnline,
  } = globalStyles.colors;

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

  useEffect(() => {
    const queryStr = searchQuery?.toString() ?? "";
    if (queryStr.length >= 3) {
      setPage(1);
      fetchSearchResults(queryStr, 1);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <div>
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
                router.push(`/profile/${user._id}`);
              }}
            >
              <div className="flex items-center gap-3 w-full">
                <AvatarHeader
                  profileImageUrl={user.profilePhoto}
                  username={user.fullName}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium group-hover:text-blue-400 transition-colors truncate">
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
                    <Phone className="w-3 h-3 opacity-70 flex-shrink-0" />
                    <p className="text-xs opacity-80 truncate">
                      {user.phoneNumber}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-70 transition-opacity flex-shrink-0" />
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
    </div>
  );
};

export default SearchBar;
