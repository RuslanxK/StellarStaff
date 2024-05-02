import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = ({ children }) => {

  const token = Cookies.get("token")
  const isAdmin = Cookies.get("isAdmin")

  if (isAdmin && token) {
    return children;
  }
  return <Navigate to="/404" />;
}

export default PrivateRoute



