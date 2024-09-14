import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { authHeaders } from "../../../utils";
import { API_URL } from "../../../config.json";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/joy/Button";
import Stack from "@mui/material/Stack";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { Typography } from "@mui/material";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const Facility = () => {
  const facilityRef = useRef(null);
  const [facilities, facilitiesSet] = useState([]);
  const [id, idSet] = useState(null);
  const [isSaving, isSavingSet] = useState(false);
  const [action, actionSet] = useState("post");
  const [facilityFormData, facilityFormDataSet] = useState("");

  const columns = [
    {
      header: "ACTIONS",
      size: 100,
      Cell: ({ row }) => (
        <div className="flex gap-8 items-center">
          <div>
            <EditNoteIcon
              style={{
                color: "green",
                cursor: "pointer",
                display: isSaving ? "none" : "block",
              }}
              onClick={() => handleUpdate(row.original)}
            />
          </div>
          <div>
            <DeleteForeverIcon
              style={{
                color: "red",
                cursor: "pointer",
                display: isSaving ? "none" : "block",
              }}
              onClick={() => handleDelete(row.original)}
            />
          </div>
        </div>
      ),
    },
    {
      accessor: "sl",
      header: "SL",
      size: 10,
      Cell: ({ row }) => <>{row.index + parseFloat(1)}</>,
    },
    {
      accessorKey: "title",
      header: "TITLE",
      size: 50,
    },
    {
      accessorKey: "creator.userName",
      header: "CREATE BY",
      size: 20,
    },
    {
      accessorKey: "updater.userName",
      header: "UPDATE BY",
      size: 20,
    },

  ];

  const handleExportData = () => {
    let data = facilities;
    if (data.length == 0) return false;
    const csv = generateCsv(csvConfig)(
      data.map((row) => {
        return {
          title: row.title,
          creator: row.creator?.userName,
          updater: row.updater?.userName,
        };
      })
    );
    download(csvConfig)(csv);
  };

  const resetForm = () => {
    facilityFormDataSet("");
    actionSet("post");
  };

  const handleUpdate = (row) => {
    idSet(row.id);
    actionSet("put");
    facilityFormDataSet(row.title);
  };

  const table = useMaterialReactTable({
    columns,
    data: facilities,
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiTableRowCellProps: {
      sx: {
        fontWeight: "normal",
        fontSize: "5px",
      },
    },
    title: "Hello",
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
        onClick={handleExportData}
        startIcon={<FileDownloadIcon />}
        size="sm"
        variant="outlined"
      >
        Export Data To CSV
      </Button>
    ),
    initialState: { density: "compact" },
  });

  // table end

  useEffect(() => {
    getFacilities();
  }, []);

  // facility CRUD Operations
  const getFacilities = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/Facility`, {
        headers: authHeaders,
      });
      facilitiesSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const postFacility = async () => {
    const postData = {
      title: facilityFormData,
    };

    if (postData.title.trim() == "") {
      Swal.fire({
        title: "TITLE is Required.",
        icon: "warning",
      });
      return false;
    } else {
      isSavingSet(true);
      try {
        let response;

        if (action == "post") {
          response = await axios.post(`${API_URL}api/v1/Facility`, postData, {
            headers: authHeaders,
          });
        }

        if (action == "put") {
          response = await axios.put(
            `${API_URL}api/v1/Facility/${id}`,
            postData,
            {
              headers: authHeaders,
            }
          );
        }

        // After Api Response

        Swal.fire({
          icon: "success",
          title: `${response.data.title} is ${
            action == "post" ? "Create" : "update"
          } Successfully`,
          text: "facility added successfully",
        });
        resetForm();
        getFacilities();
      } catch (error) {
      
        if(error.response.status === 409 && error.response.statusText ===   "Conflict"){
          Swal.fire({
              icon: 'error',
              title: 'Conflict!',
              text: `${error.response.data}`,
              confirmButtonText: 'OK'
          });
      }else{
          Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed! Please try again later.',
              confirmButtonText: 'OK'
          });
      }
      }

      isSavingSet(false);
    }
  };

  const handleDelete = async (row) => {
    Swal.fire({
      title: `Are you sure delete this?`,
      icon: "warning",
      buttons: true,
    }).then(async (res) => {
      isSavingSet(true);
      try {
        if (res.isConfirmed) {
          let response = await axios.delete(
            `${API_URL}api/v1/Facility/${row.id}`,
            { headers: authHeaders },
            { id: row.id }
          );
          Swal.fire({
            icon: "success",
            title: `${response.data.title} is deleted Successfully`,
          });
          resetForm();
          getFacilities();
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed ! Please try again later.",
          confirmButtonText: "OK",
        });
      }
      isSavingSet(false);
    });
  };

  // End CRUD Operations

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (e.target === facilityRef.current) {
        postFacility();
      }
    }
  };

  return (
    <>
      <Paper className="m-3 p-3">
        <Typography
          variant="h6"
          className="MuiTypography-h6 mb-3"
          style={{ marginBottom: "8px" }}
        >
          FACILITY ENTRY
        </Typography>
        <Grid
          container
          spacing={3}
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Grid item xs={12} md={3}>
            <TextField
              label="TITLE"
              name="title"
              fullWidth
              autoComplete="off"
              size="small"
              onKeyDown={handleKeyPress}
              inputRef={facilityRef}
              value={facilityFormData}
              onChange={(e) => {
                facilityFormDataSet(e.target.value);
              }}
            />
          </Grid>
        </Grid>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            style={{ margin: "15px", color: "green" }}
            loading={isSaving}
            onClick={() => postFacility()}
          >
            {action == "post" ? "CREATE" : "UPDATE"}
          </Button>

          <Button
            variant="outlined"
            style={{ margin: "15px", color: "red", border: "1px solid red" }}
            size="sm"
            onClick={() => resetForm()}
          >
            RESET
          </Button>
        </Stack>
      </Paper>

      <Paper className="m-3">
        <Typography
          variant="h6"
          className="MuiTypography-h6 m-3"
          style={{ padding: "10px" }}
        >
          FACILITY LIST
        </Typography>
        <MaterialReactTable table={table} />
      </Paper>
    </>
  );
};

export default Facility;
