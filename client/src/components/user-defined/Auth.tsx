"use client";

import { useEffect } from "react";
import Sidebar from "./shared/Sidebar";

const Auth = ({
  isAuthenticated,
  children,
  token,
}: {
  isAuthenticated: boolean;
  children: React.ReactNode;
  token: string | undefined;
}) => {
  useEffect(() => {
    console.log("ISAUTHENTICATED VALUE CHANGES");
  }, [isAuthenticated, token]);

  return (
    <div>
      {isAuthenticated ? (
        <div className="flex min-h-screen">
          <div className="w-72 border-r">
            <Sidebar />
          </div>
          <div className="flex-1">{children}</div>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default Auth;
