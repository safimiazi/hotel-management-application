import React, { useState, useEffect } from "react";
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

const HouseKeepingCategory = () => {
  const [houseKeepingCategories, houseKeepingCategoriesSet] = useState([]);
  const [id, idSet] = useState(null);
  const [isSaving, isSavingSet] = useState(false);
  const [action, actionSet] = useState("post");
  const [houseKeepingCategoryFormData, houseKeepingCategoryFormDataSet] =
    useState({
      name: "",
    });

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
      accessorKey: "name",
      header: "CATEGORY NAME",
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    houseKeepingCategoryFormDataSet({
      ...houseKeepingCategoryFormData,
      [name]: value,
    });
  };

  const handleExportData = () => {
    let data = houseKeepingCategories;
    if (data.length == 0) return false;
    const csv = generateCsv(csvConfig)(
      data.map((row) => {
        return {
          name: row.name,
          creator: row.creator?.userName,
          updater: row.updater?.userName,
        };
      })
    );
    download(csvConfig)(csv);
  };

  const resetForm = () => {
    houseKeepingCategoryFormDataSet({
      name: "",
    });
    actionSet("post");
  };

  const handleUpdate = (row) => {
    idSet(row.id);
    actionSet("put");
    houseKeepingCategoryFormDataSet({
      ...houseKeepingCategoryFormData,
      name: row.name,
    });
  };

  const table = useMaterialReactTable({
    columns,
    data: houseKeepingCategories,
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
    getHouseKeepingCategories();
  }, []);

  // itemCategory CRUD Operations
  const getHouseKeepingCategories = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/HouseKeepingItemCategory`,
        {
          headers: authHeaders,
        }
      );
      houseKeepingCategoriesSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };
  const postHouseKeepingCategory = async (e) => {
    e.preventDefault();

    if (houseKeepingCategoryFormData.name.trim() == "") {
      Swal.fire({
        title: "House Keeping Category Name is Required.",
        icon: "warning",
      });
      return false;
    } else {
      isSavingSet(true);
      try {
        let response;

        if (action == "post") {
          response = await axios.post(
            `${API_URL}api/v1/HouseKeepingItemCategory`,
            houseKeepingCategoryFormData,
            {
              headers: authHeaders,
            }
          );
        }

        if (action == "put") {
          response = await axios.put(
            `${API_URL}api/v1/HouseKeepingItemCategory/${id}`,
            houseKeepingCategoryFormData,
            {
              headers: authHeaders,
            }
          );
        }

        // After Api Response

        Swal.fire({
          icon: "success",
          title: `${response.data.name} is ${
            action == "post" ? "Create" : "update"
          } Successfully`,
          text: "House Keeping Category added successfully",
        });
        resetForm();
        getHouseKeepingCategories();
      } catch (error) {
        if (
          error.response.status === 409 &&
          error.response.statusText === "Conflict"
        ) {
          Swal.fire({
            icon: "error",
            title: "Conflict!",
            text: `${error.response.data}`,
            confirmButtonText: "OK",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Failed! Please try again later.",
            confirmButtonText: "OK",
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
            `${API_URL}api/v1/HouseKeepingItemCategory/${row.id}`,
            { headers: authHeaders },
            { id: row.id }
          );
          Swal.fire({
            icon: "success",
            title: `${response.data.name} is deleted Successfully`,
          });
          resetForm();
          getHouseKeepingCategories();
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

  return (
    <>
      <Paper className="m-3 p-3">
        <Typography
          variant="h6"
          className="MuiTypography-h6 mb-3"
          style={{ marginBottom: "8px" }}
        >
          HOUSE KEEPING CATEGORY NAME ENTRY
        </Typography>
        <form onSubmit={postHouseKeepingCategory}>
          <Grid
            container
            spacing={3}
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={12} md={3} sm={2}>
              <TextField
                label="CATEGORY NAME"
                name="name"
                fullWidth
                autoComplete="off"
                size="small"
                value={houseKeepingCategoryFormData.name}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              style={{ margin: "15px", color: "green" }}
              loading={isSaving}
              type="submit"
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
        </form>
      </Paper>

      <Paper className="m-3">
        <Typography
          variant="h6"
          className="MuiTypography-h6 m-3"
          style={{ padding: "10px" }}
        >
          BAR ITEM CATEGORY LIST
        </Typography>
        <MaterialReactTable table={table} />
      </Paper>
    </>
  );
};

export default HouseKeepingCategory;
