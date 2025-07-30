"use client";

import { setToken } from "@/redux/slices/userSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

interface Props {
  token: string | undefined;
  children: React.ReactNode;
}

const AppWrapper = ({ token, children }: Props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setToken(token));
  }, [token, dispatch]);

  return <>{children}</>;
};

export default AppWrapper;
