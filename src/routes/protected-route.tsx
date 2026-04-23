import { Navigate } from "react-router-dom";
import { useProfile } from "@/features/auth/hooks/use-auth";
import LoadingSidebar from "@/components/common/loding-sidebar";
import type { UserRole } from "@/features/auth/types";

type Props = {
  children: React.ReactNode;
  allowedRoles: UserRole[];
};

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { data: profile, isLoading } = useProfile();

  if (isLoading) return <LoadingSidebar />;

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(profile.role as UserRole)) {
    return <Navigate to="/admin/order" replace />;
  }

  return children;
};

export default ProtectedRoute;
