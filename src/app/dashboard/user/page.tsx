"use client";
import UserDashboard from "@/components/dashboard/User/UserDashboard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const Page = () => {
  return (
    <ProtectedRoute allowedRoles="user">
      <div>
        <UserDashboard />
      </div>
    </ProtectedRoute>
  );
};

export default Page; 