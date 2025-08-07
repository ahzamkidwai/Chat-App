import { RootState } from "@/redux/store/store";
import globalStyles from "@/styles/globalStyles";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { formatDistanceToNowStrict } from "date-fns";
import {
  MessageCircle,
  Check,
  CheckCheck,
  ImageIcon,
  VideoIcon,
  Volume2,
} from "lucide-react";

const DirectMessages = () => {
  const { sidebarText, dmOnline, dmIdle, dmDnd, dmOffline, sidebarBg } =
    globalStyles.colors;

  const userId = useSelector((state: RootState) => state.user.userId);
  const token = useSelector((state: RootState) => state.user.token);

  const [directMessages, setDirectMessages] = useState<any[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null); // ✅ Moved outside

  useEffect(() => {
    const fetchDirectMessages = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/messages/user/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch direct messages");

        const data = await response.json();

        const list = data.map((dm: any) => {
          const otherParticipant = dm.participants.find(
            (p: any) => p._id !== userId
          );

          return {
            name: otherParticipant?.fullName || "Unknown User",
            phone: otherParticipant?.phoneNumber || "Unknown Phone",
            profilePhoto: otherParticipant?.profilePhoto || "",
            status: otherParticipant?.status || "offline",
            messageContent: dm.lastMessage?.content || "",
            messageType: dm.lastMessage?.messageType || "text",
            mediaUrl: dm.lastMessage?.mediaUrl || "",
            isRead: dm.lastMessage?.isRead || false,
            sentAt: dm.lastMessage?.sentAt || new Date(),
            senderId: dm.lastMessage?.sender,
            receiverId: dm.lastMessage?.receiver,
          };
        });

        setDirectMessages(list);
      } catch (error) {
        console.error("Error fetching direct messages:", error);
      }
    };

    fetchDirectMessages();
  }, [userId, token]);

  const getMessagePreview = (message: any) => {
    const isSender = message.senderId === userId;
    const prefix = isSender ? "You: " : "";

    if (message.messageType === "image")
      return (
        <span className="flex items-center gap-1">
          <ImageIcon className="w-3 h-3" /> {prefix}Photo
        </span>
      );
    if (message.messageType === "video")
      return (
        <span className="flex items-center gap-1">
          <VideoIcon className="w-3 h-3" /> {prefix}Video
        </span>
      );
    if (message.messageType === "audio")
      return (
        <span className="flex items-center gap-1">
          <Volume2 className="w-3 h-3" /> {prefix}Audio
        </span>
      );
    if (!message.messageContent)
      return (
        <span className="flex items-center gap-1">
          <MessageCircle className="w-3 h-3" /> Start a conversation
        </span>
      );

    return (
      <span className="truncate">
        {prefix}
        {message.messageContent.length > 20
          ? `${message.messageContent.substring(0, 20)}...`
          : message.messageContent}
      </span>
    );
  };

  return (
    <div className="px-2">
      <h3
        className="text-xs font-semibold mb-2 mt-3 px-3 uppercase tracking-wider"
        style={{ color: dmOffline }}
      >
        Direct Messages
      </h3>

      {directMessages.map((dm, index) => {
        const isSender = dm.senderId === userId;
        const isHovered = hoveredIndex === index;

        const dynamicColor = isHovered ? sidebarBg : sidebarText;

        return (
          <div
            key={index}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-opacity-10 hover:bg-white ${
              !dm.isRead && !isSender ? "bg-gray-800/20" : ""
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Profile Photo */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                {dm.profilePhoto ? (
                  <Image
                    src={dm.profilePhoto}
                    alt={dm.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    {dm.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-800"
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
            </div>

            {/* Message Details */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <span
                  className="text-sm font-medium truncate transition-colors duration-200"
                  style={{ color: dynamicColor }}
                >
                  {dm.name}
                </span>
                <span className="text-xs text-gray-400">
                  {formatDistanceToNowStrict(new Date(dm.sentAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-400 truncate flex items-center gap-1">
                  {getMessagePreview(dm)}
                </p>
                <div className="flex items-center">
                  {dm.isRead ? (
                    <CheckCheck className="text-blue-500 w-3 h-3" />
                  ) : (
                    <Check className="text-gray-500 w-3 h-3" />
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DirectMessages;
