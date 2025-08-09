// app/layout.tsx
import "./globals.css";
import { cookies } from "next/headers";
import ReduxProvider from "@/redux/ReduxProvider";
import TokenSync from "@/components/user-defined/shared/Token-Sync";
import Sidebar from "@/components/user-defined/shared/Sidebar";

// app/layout.tsx
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  const isAuthenticated = !!token;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
        <ReduxProvider>
          <TokenSync token={token} />
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
        </ReduxProvider>
      </body>
    </html>
  );
}
