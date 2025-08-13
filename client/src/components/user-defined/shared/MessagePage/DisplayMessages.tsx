import globalStyles from "@/styles/globalStyles";
import ImageAvatar from "../../ImageAvatar";

interface Message {
  _id: string;
  sender: string;
  content: string;
  sentAt: string;
  senderProfile?: string; // URL of sender's image
  senderName?: string; // Optional sender name
}

const DisplayMessages = ({
  messages,
  currentUserId,
  otherUser,
  userProfileImageUrl,
}: {
  messages: Message[];
  currentUserId: string;
  otherUser: any;
  userProfileImageUrl: string;
}) => {
  const { sidebarInputBg, primary, sidebarText } = globalStyles.colors;
  const otherUserProfileUrl = otherUser.profilePhoto || "";

  const formatDateHeader = (dateStr: string) => {
    const today = new Date();
    const msgDate = new Date(dateStr);
    const diffTime = today.setHours(0, 0, 0, 0) - msgDate.setHours(0, 0, 0, 0);
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return msgDate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const groupedMessages = messages.reduce((acc, msg) => {
    const dateKey = new Date(msg.sentAt).toISOString().split("T")[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(msg);
    return acc;
  }, {} as Record<string, Message[]>);

  const sortedDates = Object.keys(groupedMessages).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {sortedDates.map((dateKey) => (
        <div key={dateKey}>
          {/* Date Header */}
          <div
            style={{
              textAlign: "center",
              margin: "1rem 0",
              color: sidebarText,
              fontSize: "0.8rem",
              opacity: 0.8,
            }}
          >
            {formatDateHeader(dateKey)}
          </div>

          {/* Messages for this date */}
          {groupedMessages[dateKey].map((msg) => {
            const isSent = msg.sender === currentUserId;
            const time = new Date(msg.sentAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });

            return (
              <div
                key={msg._id}
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: isSent ? "flex-end" : "flex-start",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                {/* Avatar for received messages */}
                {!isSent && <ImageAvatar profileImage={otherUserProfileUrl} />}

                {/* Message bubble */}
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "0.6rem 1rem",
                    borderRadius: "1rem",
                    backgroundColor: isSent ? primary : sidebarInputBg,
                    color: "#fff",
                    wordBreak: "break-word",
                    fontSize: "0.9rem",
                  }}
                >
                  {msg.content}
                  <div
                    style={{
                      fontSize: "0.7rem",
                      opacity: 0.8,
                      textAlign: "right",
                      marginTop: "0.3rem",
                      color: "#ddd",
                    }}
                  >
                    {time}
                  </div>
                </div>

                {/* Avatar for sent messages */}
                {isSent && <ImageAvatar profileImage={userProfileImageUrl} />}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default DisplayMessages;
