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
import { Autocomplete, Typography } from "@mui/material";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const PremiumServiceExpenseName = () => {
  const [cost, costSet] = useState(0);
  const [primiumServiceExpenseNames, primiumServiceExpenseNamesSet] = useState(
    []
  );
  const [name, nameSet] = useState("");
  const [id, idSet] = useState(null);
  const [isSaving, isSavingSet] = useState(false);
  const [action, actionSet] = useState("post");

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
      header: "NAME",
      size: 50,
    },
    {
      accessorKey: "cost",
      header: "COST",
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
    let data = primiumServiceExpenseNames;
    if (data.length == 0) return false;
    const csv = generateCsv(csvConfig)(
      data.map((row) => {
        return {
          name: row.name,
          cost: row.cost,
          creator: row.creator?.userName,
          updater: row.updater?.userName,
        };
      })
    );
    download(csvConfig)(csv);
  };

  const resetForm = () => {
    actionSet("post");
    nameSet("");
    costSet(0);
  };

  const handleUpdate = (row) => {
    idSet(row.id);
    actionSet("put");
    nameSet(row.name);
    costSet(row.cost);
  };

  const table = useMaterialReactTable({
    columns,
    data: primiumServiceExpenseNames,
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
    getPremiumServiceExpenseNames();
  }, []);

  // RoomType CRUD Operations
  const getPremiumServiceExpenseNames = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/PremiumServiceExpenseName`,
        {
          headers: authHeaders,
        }
      );
      primiumServiceExpenseNamesSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const postprimiumServiceExpenseNames = async () => {
    const postData = {
      name: name,
      cost: parseFloat(cost),
    };

    if (name.trim() === "") {
      Swal.fire({
        title: "Name is Required.",
        icon: "warning",
      });
      return false;
    } else {
      isSavingSet(true);
      try {
        let response;

        if (action == "post") {
          response = await axios.post(
            `${API_URL}api/PremiumServiceExpenseName`,
            postData,
            {
              headers: authHeaders,
            }
          );
        }

        if (action == "put") {
          response = await axios.put(
            `${API_URL}api/PremiumServiceExpenseName/${id}`,
            postData,
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
          text: "Premium Service Expense Name added successfully",
        });
        resetForm();
        getPremiumServiceExpenseNames();
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
            `${API_URL}api/PremiumServiceExpenseName/${row.id}`,
            { headers: authHeaders },
            { id: row.id }
          );
          Swal.fire({
            icon: "success",
            title: `${response.data.name} is deleted Successfully`,
          });
          resetForm();
          getPremiumServiceExpenseNames();
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

  // Start handle Enter event function
  const nameRef = useRef(null);
  const costRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (e.target === nameRef.current) {
        costRef.current.focus();
      } else if (e.target === costRef.current) {
        postprimiumServiceExpenseNames();
      }
    }
  };

  // End handle Enter event function

  return (
    <>
      <Paper className="m-3 p-3">
        <Typography
          variant="h6"
          className="MuiTypography-h6 mb-3"
          style={{ marginBottom: "8px" }}
        >
          PREMIUM SERVICE EXPENSE NAME ENTRY
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="NAME"
              name="name"
              autoComplete="off"
              size="small"
              inputRef={nameRef}
              onKeyDown={handleKeyPress}
              fullWidth
              onFocus={() => nameRef.current.select()}
              value={name}
              onChange={(e) => {
                nameSet(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="cost"
              name="cost"
              autoComplete="off"
              size="small"
              inputRef={costRef}
              type="number"
              onKeyDown={handleKeyPress}
              fullWidth
              onFocus={() => costRef.current.select()}
              value={cost}
              onChange={(e) => {
                if (0 > e.target.value) false;
                costSet(e.target.value);
              }}
            />
          </Grid>
        </Grid>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            style={{ margin: "15px", color: "green" }}
            loading={isSaving}
            onClick={() => postprimiumServiceExpenseNames()}
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
          SERVICE EXPENSE NAME LIST
        </Typography>
        <MaterialReactTable table={table} />
      </Paper>
    </>
  );
};

export default PremiumServiceExpenseName;
