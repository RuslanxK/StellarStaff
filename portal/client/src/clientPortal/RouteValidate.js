import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const RouteValidate = ({ children }) => {

  const token = Cookies.get("clientToken")

  if (!token) {
    return children;
  }
  return <Navigate to="/client/dashboard" />;
}

export default RouteValidate



