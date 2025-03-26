import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ authUser }) => {
  return authUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
