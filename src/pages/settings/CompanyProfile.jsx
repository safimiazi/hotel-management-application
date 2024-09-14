import { Box, Grid, Paper, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/joy/Button";
import Swal from "sweetalert2";
import axios from "axios";
import { API_URL } from "../../../config.json";
import { authHeaders } from "../../../utils";
import Textarea from "@mui/joy/Textarea";

const CompanyProfile = () => {
  const [title, titleSet] = useState("");
  const [desc, descSet] = useState("");
  const [currency, currencySet] = useState("");
  const [loading, loadingSet] = useState(false);
  const [imgLoading, imgLoadingSet] = useState(false);
  const [action, actionSet] = useState("post");
  const [companyProfileData, companyProfileDataSet] = useState(null);
  const [imageSrc, imageSrcSet] = useState(null);

  useEffect(() => {
    if (companyProfileData != null) {
      imageSrcSet(companyProfileData.logo);
      currencySet(companyProfileData.currency);
      descSet(companyProfileData.description);
      titleSet(companyProfileData.title);
    }
  }, [companyProfileData]);

  const handleLogoUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    imgLoadingSet(true);

    try {
      if (file) {
        const response = await axios.post(
          `${API_URL}api/CompanyProfileImageUpload/company-logo-upload`,
          {
            ImageFile: file,
          },
          {
            headers: {
              ...authHeaders,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.filePath.trim() != "") {
          imgLoadingSet(false);
          getCompanyProfileData();
        }
        // };
      } else {
      }
    } catch (error) {}
  };

  const resetForm = () => {
    actionSet("post");
    currencySet("");
    titleSet("");
    descSet("");
  };

  //post company data:
  const postCompanyData = async () => {
    if (title.trim() === "") {
      Swal.fire({
        title: "Title is Required.",
        icon: "warning",
      });
    } else {
      const postData = {
        title: title,
        description: desc,
        currency: currency,
      };

      try {
        loadingSet(true);
        let response;

        if (action === "post") {
          response = await axios.post(
            `${API_URL}api/v1/CompanyProfile`,
            postData,
            {
              headers: authHeaders,
            }
          );
        }

        Swal.fire({
          icon: "success",
          title: `Update Successfully`,
        });
        resetForm();
        loadingSet(false);
        getCompanyProfileData();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed! Please try again later.",
          confirmButtonText: "OK",
        });
      }
    }
  };

  useEffect(() => {
    getCompanyProfileData();
  }, []);

  const getCompanyProfileData = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/CompanyProfile`, {
        headers: authHeaders,
      });
      companyProfileDataSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const titleRef = useRef(null);
  const descRef = useRef(null);
  const currencyRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (e.target === titleRef.current) {
        descRef.current.focus();
      } else if (e.target === descRef.current) {
        currencyRef.current.focus();
      } else if (e.target === currencyRef.current) {
        postCompanyData();
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ marginTop: 2, padding: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
        COMPANY PROFILE
      </Typography>
      <Grid container spacing={3}>
        <Grid item md={6} sm={12}>
          <Box sx={{ mb: 2, width: "100%" }}>
            <input
              id="logo_upload"
              type="file"
              style={{ display: "none" }}
              onChange={handleLogoUpload}
            />
            <label htmlFor="logo_upload" style={{ width: "100%" }}>
              <Button
                fullWidth
                variant="contained"
                component="span"
                sx={{
                  border: "1px solid black",

                  color: "#109a07",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Choose Profile Logo...
              </Button>
            </label>
          </Box>
          <Box
            width="200px"
            height="200px"
            border="1px solid black"
            borderRadius="10px"
            position="relative"
            overflow="hidden"
          >
            {imgLoading ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="100%"
                width="100%"
                position="absolute"
                top="0"
                left="0"
                bgcolor="rgba(255, 255, 255, 0.8)"
              >
                Uploading....
              </Box>
            ) : (
              <img
                src={`${API_URL}${imageSrc}` || "default"}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}
          </Box>
        </Grid>
        <Grid item md={6} sm={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="TITLE"
                name="title"
                autoComplete="off"
                size="small"
                fullWidth
                inputRef={titleRef}
                onKeyDown={handleKeyPress}
                value={title}
                onChange={(e) => titleSet(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Textarea
                placeholder="Type anything…"
                label="DESCRIPTION"
                name="description"
                minRows={4}
                inputRef={descRef}
                onKeyDown={handleKeyPress}
                fullWidth
                value={desc}
                onChange={(e) => descSet(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="CURRENCY"
                name="currency"
                autoComplete="off"
                inputRef={currencyRef}
                onKeyDown={handleKeyPress}
                size="small"
                fullWidth
                value={currency}
                onChange={(e) => currencySet(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button loading={loading} onClick={() => postCompanyData()}>
                Save
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CompanyProfile;
