// Protects private routes by allowing access only to authenticated users.
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = useSelector((state) => state.auth.token);

  // If user is not logged in → redirect to login page
  return token ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
