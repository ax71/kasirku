import { useProfile } from "@/features/auth/hooks/use-auth";
import { Navigate } from "react-router-dom";

const AdminPage = () => {
  const { data: profile } = useProfile();

  if (profile?.role !== "admin") {
    return <Navigate to="/order" replace />;
  }

  return <div>Welcome to Admin Page</div>;
};

export default AdminPage;
