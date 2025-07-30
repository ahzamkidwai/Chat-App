import Sidebar from "@/components/user-defined/shared/Sidebar";
import "./globals.css";
import { cookies } from "next/headers";
import ReduxProvider from "@/redux/ReduxProvider";
import TokenSync from "@/components/user-defined/shared/Token-Sync";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  const isAuthenticated = !!token;

  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <ReduxProvider>
          <TokenSync token={token} />
          {isAuthenticated && <Sidebar />}
          <main className="flex-1">{children}</main>
        </ReduxProvider>
      </body>
    </html>
  );
}
