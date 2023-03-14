import { Outlet, Navigate } from "react-router-dom";

const RedirectedRoute = ({ user }) => {
  if (user) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default RedirectedRoute;
