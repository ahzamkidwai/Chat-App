"use client";

import { RootState } from "@/redux/store/store";
import globalStyles from "@/styles/globalStyles";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import { Paperclip, Send, Smile, CheckCheck, Check } from "lucide-react";
import Image from "next/image";

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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        setMessages(responseData.messages || []);
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

  const getMessageContent = (message: any) => {
    if (message.messageType === "image")
      return (
        <div className="mt-2">
          <Image
            src={message.mediaUrl}
            alt="Sent image"
            width={200}
            height={200}
            className="rounded-lg max-w-full h-auto"
          />
        </div>
      );
    if (message.messageType === "video")
      return (
        <div className="mt-2">
          <video controls className="rounded-lg max-w-full h-auto">
            <source src={message.mediaUrl} type="video/mp4" />
          </video>
        </div>
      );
    if (message.messageType === "audio")
      return (
        <div className="mt-2">
          <audio controls className="w-full">
            <source src={message.mediaUrl} type="audio/mpeg" />
          </audio>
        </div>
      );
    return message.content;
  };

  return (
    <div
      className="flex flex-col h-screen"
      style={{ backgroundColor: sidebarBg }}
    >
      {/* Header */}
      <MessagePageHeader otherUser={otherUser} />
      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3"
        style={{ backgroundColor: sidebarInputBg }}
      >
        {messages.map((message) => {
          const isMine = message.sender === currentUserId;

          return (
            <div
              key={message._id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-2xl relative ${
                  isMine ? "rounded-br-none" : "rounded-bl-none"
                }`}
                style={{
                  backgroundColor: isMine ? "#4f545c" : "#36393f",
                  color: sidebarText,
                }}
              >
                {/* Message Content */}
                <div className="text-sm break-words">
                  {getMessageContent(message)}
                </div>

                {/* Time + Read Receipt */}
                <div
                  className="text-[10px] mt-1 flex justify-end items-center gap-1"
                  style={{ opacity: 0.7 }}
                >
                  {formatDistanceToNowStrict(new Date(message.sentAt), {
                    addSuffix: true,
                  })}
                  {isMine &&
                    (message.isRead ? (
                      <CheckCheck
                        className="w-3 h-3"
                        style={{ color: dmOnline }}
                      />
                    ) : (
                      <Check
                        className="w-3 h-3"
                        style={{ color: sidebarText }}
                      />
                    ))}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

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
