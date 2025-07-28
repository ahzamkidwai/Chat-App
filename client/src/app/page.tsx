import { cookies } from "next/headers";
import Dashboard from "@/components/user-defined/Dashboard";
import LandingPage from "@/components/user-defined/LandingPage";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  const isAuthenticated = !!token;

  return isAuthenticated ? <Dashboard /> : <LandingPage />;
}
