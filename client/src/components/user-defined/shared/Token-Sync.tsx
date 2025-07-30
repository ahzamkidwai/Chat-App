"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "@/redux/slices/userSlice";

export default function TokenSync({ token }: { token: string | undefined }) {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("TokenSync token:", token);
    if (token) {
      dispatch(setToken(token));
    }
  }, [token]);

  return null;
}
