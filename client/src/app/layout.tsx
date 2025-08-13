// app/layout.tsx
import "./globals.css";
import { cookies } from "next/headers";
import ReduxProvider from "@/redux/ReduxProvider";
import TokenSync from "@/components/user-defined/shared/Token-Sync";
import Auth from "@/components/user-defined/Auth";

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
          <Auth
            token={token}
            isAuthenticated={isAuthenticated}
            children={children}
          />
        </ReduxProvider>
      </body>
    </html>
  );
}
