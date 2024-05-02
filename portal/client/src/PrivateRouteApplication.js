import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRouteApplication = ({ children }) => {
  
  const completedApplication = Cookies.get("completedApplication");

  if (completedApplication !== "true") {
    return children;
  }

  return <Navigate to="/status" />;
};

export default PrivateRouteApplication;
