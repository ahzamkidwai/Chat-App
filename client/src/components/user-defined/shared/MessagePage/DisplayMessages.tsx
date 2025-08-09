import globalStyles from "@/styles/globalStyles";

const DisplayMessages = ({
  messages,
  currentUserId,
}: {
  messages: any[];
  currentUserId: string;
}) => {
  const { sidebarInputBg, primary, sidebarText } = globalStyles.colors;

  // Helper: Format date header
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

  // Group messages by date
  const groupedMessages: { [key: string]: any[] } = {};
  messages.forEach((msg) => {
    const dateKey = new Date(msg.sentAt).toISOString().split("T")[0];
    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = [];
    }
    groupedMessages[dateKey].push(msg);
  });

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

          {/* Messages for that date */}
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
                  justifyContent: isSent ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
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
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default DisplayMessages;
