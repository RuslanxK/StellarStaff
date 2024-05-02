import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RegisterStepOneValid = ({ children }) => {
  const formData = useSelector((state) => state.app.formData);

  if (formData.email) {
    return children;
  }
  return <Navigate to="/register" />;
};

export default RegisterStepOneValid;
