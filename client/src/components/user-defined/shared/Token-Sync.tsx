"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store/store";
import { getSocket } from "@/utils/socket";
import type { Socket } from "socket.io-client";

export default function TokenSync({ token }: { token: string | undefined }) {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.userId);
  const socketRef = useRef<Socket | null>(null);

  // Step 1: Save token to Redux when available
  useEffect(() => {
    if (token) {
      console.log("🔐 Setting token in Redux:", token);
      dispatch(setToken(token));
    }
  }, [token, dispatch]);

  // Step 2: Connect socket only once after userId is available
  useEffect(() => {
    if (!userId || socketRef.current) return;

    console.log("🔗 Connecting to socket for userId:", userId);
    const socket = getSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
      socket.emit("user-online", userId);
      console.log("✅ Emitted user-online with userId:", userId);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err);
    });

    // Only disconnect on unmount
    return () => {
      console.log("🔌 Socket disconnected");
      socket.disconnect();
    };
  }, [userId]);

  return null;
}
