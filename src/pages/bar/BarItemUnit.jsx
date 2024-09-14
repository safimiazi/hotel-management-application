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

const BarItemUnit = () => {
  const [barItemUnits, barItemUnitsSet] = useState([]);
  const [id, idSet] = useState(null);
  const [isSaving, isSavingSet] = useState(false);
  const [action, actionSet] = useState("post");
  const [barItemUnitFormData, barItemUnitFormDataSet] = useState({
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
      header: "BAR ITEM UNIT NAME",
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
    barItemUnitFormDataSet({ ...barItemUnitFormData, [name]: value });
  };

  const handleExportData = () => {
    let data = barItemUnits;
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
    barItemUnitFormDataSet({
      name: "",
    });
    actionSet("post");
  };

  const handleUpdate = (row) => {
    idSet(row.id);
    actionSet("put");
    barItemUnitFormDataSet({
      ...barItemUnitFormData,
      name: row.name,
    });
  };

  const table = useMaterialReactTable({
    columns,
    data: barItemUnits,
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
    getBarItemUnits();
  }, []);

  // itemUnit CRUD Operations
  const getBarItemUnits = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/BarItemUnit`, {
        headers: authHeaders,
      });
      barItemUnitsSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };
  const postBarItemUnit = async (e) => {
    e.preventDefault();

    if (barItemUnitFormData.name.trim() == "") {
      Swal.fire({
        title: "Bar Item Unit Name is Required.",
        icon: "warning",
      });
      return false;
    } else {
      isSavingSet(true);
      try {
        let response;

        if (action == "post") {
          response = await axios.post(
            `${API_URL}api/v1/BarItemUnit`,
            barItemUnitFormData,
            {
              headers: authHeaders,
            }
          );
        }

        if (action == "put") {
          response = await axios.put(
            `${API_URL}api/v1/BarItemUnit/${id}`,
            barItemUnitFormData,
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
          text: "Bar Item Unit added successfully",
        });
        resetForm();
        getBarItemUnits();
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
            `${API_URL}api/v1/BarItemUnit/${row.id}`,
            { headers: authHeaders },
            { id: row.id }
          );
          Swal.fire({
            icon: "success",
            title: `${response.data.name} is deleted Successfully`,
          });
          resetForm();
          getBarItemUnits();
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
          ITEM UNIT NAME ENTRY
        </Typography>
        <form onSubmit={postBarItemUnit}>
          <Grid
            container
            spacing={3}
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={12} md={3} sm={2}>
              <TextField
                label="BAR ITEM UNIT NAME"
                name="name"
                autoComplete="off"
                size="small"
                fullWidth
                value={barItemUnitFormData.name}
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
          BAR ITEM UNIT LIST
        </Typography>
        <MaterialReactTable table={table} />
      </Paper>
    </>
  );
};

export default BarItemUnit;
