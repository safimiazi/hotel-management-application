import React from "react";
import "../../../assets/css/global.css";
import { Box, CircularProgress, Stack } from "@mui/material";

const LazyLoading = () => {
  return (
    <Box
      sx={{
        
        position:'absolute',
        top: '50%',
        right: '45%'
   
      }}
    >
      <Stack
        sx={{ color: "grey.500" }}
      >
        <CircularProgress color="success" />
      </Stack>
    </Box>
  );
};

export default LazyLoading;