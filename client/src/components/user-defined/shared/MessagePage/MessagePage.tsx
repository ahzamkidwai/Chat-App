"use client";

import { RootState } from "@/redux/store/store";
import globalStyles from "@/styles/globalStyles";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import DispalyMessages from "./DisplayMessages";
import { Paperclip, Send, Smile } from "lucide-react";

import MessagePageHeader from "./MessagePageHeader";

const MessagePage = () => {
  const { userId } = useParams();
  const {
    sidebarBg,
    sidebarText,
    dmOnline,
    dmIdle,
    dmDnd,
    dmOffline,
    sidebarInputBg,
    sidebarInputText,
    sidebarBorder,
    sidebarHeading,
  } = globalStyles.colors;

  const currentUserId = useSelector((state: RootState) => state.user.userId);
  const token = useSelector((state: RootState) => state.user.token);

  const [messages, setMessages] = useState<any[]>([]);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/messages/between/${currentUserId}/${userId}`;
        console.log("Fetching conversation from:", apiUrl);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const responseData = await response.json();
        console.log("Response data:", responseData);
        console.log("Conversation data:", responseData);
        // setMessages(responseData.messages || []);

        if (Array.isArray(responseData)) {
          setMessages(responseData);
        } else if (responseData.messages) {
          setMessages(responseData.messages);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Error fetching conversation:", error);
      }
    };

    if (userId && currentUserId && token) {
      fetchConversation();
    }
  }, [userId, currentUserId, token]);

  // Fetch other user details
  useEffect(() => {
    const fetchOtherUser = async () => {
      try {
        // const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`;
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/get-all-users`;
        console.log("Fetching user from:", apiUrl);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const responseData = await response.json();
        const userProfile = responseData.find(
          (user: any) => user._id === userId
        );
        console.log("Response data for other user:", userProfile);

        if (!response.ok) {
          throw new Error(
            `API error ${response.status}: ${responseData.message}`
          );
        }

        setOtherUser(userProfile);
      } catch (error) {
        console.error("Error fetching other user:", error);
      }
    };

    if (userId && token) {
      fetchOtherUser();
    }
  }, [userId, token]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sender: currentUserId,
            receiver: userId,
            content: newMessage,
            messageType: "text",
          }),
        }
      );

      const text = await response.text();

      if (!response.ok) {
        throw new Error(`Send message failed: ${text}`);
      }

      const sentMessage = JSON.parse(text);
      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div
      className="flex flex-col h-screen"
      style={{ backgroundColor: sidebarBg }}
    >
      {/* Header */}
      <MessagePageHeader otherUser={otherUser} />
      {/* Messages */}
      <DispalyMessages
        messages={messages}
        currentUserId={currentUserId as string}
      />

      {/* Input */}
      <div
        className="sticky bottom-0 z-10 p-4"
        style={{
          borderTop: `1px solid ${sidebarBorder}`,
          backgroundColor: sidebarBg,
        }}
      >
        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:text-white"
            style={{ color: sidebarText }}
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            placeholder="Type a message..."
            className="flex-1 rounded-full py-2 px-4 focus:outline-none"
            style={{
              backgroundColor: sidebarInputBg,
              color: sidebarInputText,
              // placeholderTextColor: sidebarText,
            }}
          />
          <button
            className="p-2 hover:text-white"
            style={{ color: sidebarText }}
          >
            <Smile className="w-5 h-5" />
          </button>
          <button
            onClick={handleSendMessage}
            className="p-2 hover:text-blue-400"
            style={{ color: sidebarText }}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
