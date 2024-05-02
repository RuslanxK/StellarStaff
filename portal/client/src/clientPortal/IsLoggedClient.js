import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const IsLoggedClient = ({ children }) => {
  const token = Cookies.get("clientToken");

  if (token) {
    return children;
  } 
  return <Navigate to="/404/" />;
};

export default IsLoggedClient;
