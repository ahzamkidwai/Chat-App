import { cookies } from "next/headers";
import Dashboard from "@/components/user-defined/Dashboard";
import LandingPage from "@/components/user-defined/LandingPage";
import AppWrapper from "@/components/user-defined/shared/AppWrapper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  const isAuthenticated = !!token;
  return (
    <AppWrapper token={token}>
      <ToastContainer />
      {isAuthenticated ? <Dashboard /> : <LandingPage />}
    </AppWrapper>
  );
}
