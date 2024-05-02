import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRouteVa = ({ children }) => {
  const token = Cookies.get("token");
  const isAdmin = Cookies.get("isAdmin");
  const vaToken = Cookies.get("vaToken");

  if ((isAdmin && token) || vaToken) {
    return children;
  }

  return <Navigate to="/login" />;
};

export default PrivateRouteVa;
