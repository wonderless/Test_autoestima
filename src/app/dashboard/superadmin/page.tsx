"use client";
import SuperAdminDashboard from "@/components/dashboard/SuperAdmin/SuperAdminDashboard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const Page = () => {
  return (
    <ProtectedRoute allowedRoles="superadmin">
      <div>
        <SuperAdminDashboard />
      </div>
    </ProtectedRoute>
  );
};

export default Page;