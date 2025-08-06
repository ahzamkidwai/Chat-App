"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store/store";

export default function TokenSync({ token }: { token: string | undefined }) {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.userId);
  console.log("TokenSync userId:", userId);
  useEffect(() => {
    console.log("TokenSync token:", token);
    if (token) {
      dispatch(setToken(token));
    }
  }, [token]);

  return null;
}
