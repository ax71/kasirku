import { Navigate } from "react-router-dom";
import { useProfile } from "@/hooks/use-auth";
import LoadingSidebar from "@/components/common/loding-sidebar";

type Props = {
  children: React.ReactNode;
  allowedRoles: string[];
};

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { data: profile, isLoading } = useProfile();

  if (isLoading) return <LoadingSidebar />;

  if (!allowedRoles.includes(profile.role)) {
    return <Navigate to="/order" replace />;
  }

  return children;
};

export default ProtectedRoute;
