import { useAuthContext } from "@/context/auth-context";
// import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import SideNav from "./side-navigation";
import UserProvider from "@/context/users-context";

const MainLayout = () => {
  const { isSignedIn } = useAuthContext();
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="flex min-h-screen text-gray-100 bg-gray-900">
      <SideNav />
      <div className="w-[80%] p-5">
        <UserProvider>
          <Outlet />
        </UserProvider>
      </div>
    </div>
  );
};

export default MainLayout;
