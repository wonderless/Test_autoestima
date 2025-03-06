"use client";
import AdminDashboard from "@/components/dashboard/Admin/AdminDashboard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const Page = () => {
  return (
    <ProtectedRoute allowedRoles="admin">
      <div>
        <AdminDashboard />
      </div>
    </ProtectedRoute>
  );
};

export default Page;