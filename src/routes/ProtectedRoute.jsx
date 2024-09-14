// ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate,useParams  } from 'react-router-dom';
import { auth,getLastPathSegment, permissions } from '../../utils';

const ProtectedRoute = ({ children }) => {
  const { id } = useParams(); // Extracts the 'id' parameter from the URL
  if (sessionStorage.getItem("auth") === null) {
    return <Navigate to={`login`} />;
  }
   // Get User Permited Menus
   const permittedMenus = permissions()
 
  // If Not Permited & "", Dashboard & not is parameter name Id so will be redirect 
  // if (permittedMenus.includes(getLastPathSegment()) == false 
  //     && (getLastPathSegment() != "" &&  getLastPathSegment() != "dashboard") && (  id === undefined )  ) {
  //    window.location.href = '/'
  // }
  return children;
};

export default ProtectedRoute;
