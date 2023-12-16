import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, notAllowCondition, navigateTo }) => {

  if (notAllowCondition) {
    return <Navigate to={navigateTo}/>;
  } else {
    return children;
  }
};

export default ProtectedRoute;
