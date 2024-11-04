import { Outlet, Navigate } from "react-router-dom";

import { useSession } from "../context/SessionContext";

const AuthProtectedRoute = () => {
  const { session } = useSession();
  if (!session) {
    return <Navigate to="/" />;
  }
  return (
    <div style={{ width: "100%", overflow: "scroll" }}>
      <Outlet />
    </div>
  );
};

export default AuthProtectedRoute;
