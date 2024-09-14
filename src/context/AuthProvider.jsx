// AuthContext.js
import axios from "axios";
import React, { createContext, useContext, useState } from "react";
import Swal from "sweetalert2";

import { API_URL, APP_URL } from "../../config.json";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loading, loadingSet] = useState(false);
  const [sideDashTextToggle, sideDashTextToggleSet] = useState(false);

  const login = async (username, password) => {
    try {
      loadingSet(true);
      const response = await axios
        .post(`${API_URL}api/Auth/SignIn`, {
          username,
          password,
        })
        .catch((err) => {
          let msg = err.response.data.message;
          Swal.fire({
            icon: "error",
            title: `${msg}`,
            text: `Try again!`,
          });
        });

     if (response.status === 200) {
      // Check if the response contains an error field
      if (response.data.error) {
        // Display the error message from the server
        Swal.fire({
          icon: 'error',
          title: 'Login failed',
          text: response.data.message || 'An error occurred',
        });
      } else {
        // Handle successful login
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'you have logged in successfully',
          showConfirmButton: false,
          timer: 1500,
        });

        // Save authentication data to session storage
        sessionStorage.setItem('auth', JSON.stringify(response.data));

        // Redirect to home page
        location.href = '/';
      }
    }
    } catch (error) {
      // Handle errors
      if (error.response) {
        // Server responded with a status code outside the range of 2xx
        const msg = error.response.data.message || "An error occurred";
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: msg,
        });
      } else if (error.request) {
        // The request was made but no response was received
        Swal.fire({
          icon: "error",
          title: "No response from server",
          text: "Please try again later.",
        });
      } else {
        // Something else happened
        Swal.fire({
          icon: "error",
          title: "Unexpected error",
          text: "An unexpected error occurred. Please try again.",
        });
      }
    }finally {
      // Ensure loading state is reset
      loadingSet(false);
    }
  };

  const authInfo = {
    login,
    loading,
    sideDashTextToggleSet,
    sideDashTextToggle
  };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
