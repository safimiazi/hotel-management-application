import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import { API_URL } from "../../../config.json";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../../context/AuthProvider";
import Button from "@mui/joy/Button";
import axios from "axios";
import { TextField } from "@mui/material";

const Login = () => {
  const { loading, login } = useContext(AuthContext);
  const [companyProfileData, companyProfileDataSet] = useState(null);
  const [password, passwordSet] = useState("");
  const [userName, userNameSet] = useState("");
  const userRef = useRef(null);
  const passRef = useRef(null);

  useEffect(() => {
    getCompanyProfileData();
  }, []);

  const getCompanyProfileData = async () => {
    const response = await axios.get(
      `${API_URL}api/v1/CompanyProfile/public/get-company-profile`,
      {}
    );
    companyProfileDataSet(response.data);
  };

  const handleSubmit = () => {
    if (userName.trim() === "") {
      Swal.fire({
        title: "User Name is Required.",
        icon: "warning",
      });
      return false;
    }

    if (password.trim() === "") {
      Swal.fire({
        title: "Password is Required.",
        icon: "warning",
      });
      return false;
    }

    login(userName, password);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (e.target === userRef.current) {
        passRef.current.focus();
      }

      if (e.target === passRef.current) {
        handleSubmit();
      }
    }
  };

  return (
    <Fragment>
      <Helmet>
        <body className="bg-white dark:!bg-bodybg"></body>
      </Helmet>
      <div
        className="flex items-center justify-center min-h-screen "
        style={{
          background: "linear-gradient(to left, #20646d 0%, #e0f7fa 100%)",
        }}
      >
        <div className="w-full max-w-sm p-8 bg-[#74cbd7] shadow-lg rounded-lg">
          <p className="text-center text-xl font-semibold mb-4">
            HOTEL RESOLVE || SOFT TASK
          </p>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="signin-username"
                className="block text-sm font-medium text-gray-700"
              >
                USER NAME
              </label>
              <TextField
                id="signin-username"
                name="username"
                autoComplete="on"
                size="small"
                inputRef={userRef}
                onKeyDown={handleKeyPress}
                fullWidth
                value={userName}
                onChange={(e) => userNameSet(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="signin-password"
                className="block text-sm font-medium text-gray-700"
              >
                PASSWORD
              </label>
              <TextField
                id="signin-password"
                name="password"
                autoComplete="on"
                size="small"
                type="password"
                inputRef={passRef}
                onKeyDown={handleKeyPress}
                fullWidth
                value={password}
                onChange={(e) => passwordSet(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="contained"
              color="success"
              sx={{
                background:
                  "linear-gradient(to left, #20646d 0%, #e0f7fa 100%)",
                color: "white",
              }}
              fullWidth
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Wait a Moment..." : "Login"}
            </Button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
