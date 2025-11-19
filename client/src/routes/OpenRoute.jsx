// Restricts access to public routes (Login, Signup) for authenticated users.
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function OpenRoute({ children }) {
  const token = useSelector((state) => state.auth.token);

  // If user is logged in → redirect them away from public pages
  return token ? <Navigate to="/dashboard/my-profile" replace /> : children;
}

export default OpenRoute;
