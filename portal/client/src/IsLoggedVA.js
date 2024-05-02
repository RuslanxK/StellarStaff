import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const IsLoggedVA = ({ children }) => {

  const vaToken = Cookies.get("vaToken");
  const token = Cookies.get("token");

  if (!vaToken) {
    return children;
  }

  else if (token) {
     return children
  }

  return <Navigate to="/status" />;
};

export default IsLoggedVA;
