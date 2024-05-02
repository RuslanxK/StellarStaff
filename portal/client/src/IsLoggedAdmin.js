import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const IsLoggedAdmin = ({ children }) => {

  const token = Cookies.get("token");

  if (!token) {
    return children;
  } else {
    
  }

  return <Navigate to="/panel" />;
};

export default IsLoggedAdmin;
