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

const Account = () => {
  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const typeRef = useRef(null);

  const [name, nameSet] = useState("");
  const [description, descriptionSet] = useState("");
  const [selectType, selectTypeSet] = useState(null);
  const [id, idSet] = useState(null);
  const [isSaving, isSavingSet] = useState(false);
  const [action, actionSet] = useState("post");

  const [accounts, accountsSet] = useState([]);
  const [types, typesSet] = useState([]);

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
      accessorKey: "description",
      header: "DESCRIPTION",
      size: 50,
    },
    {
      accessorKey: "type",
      header: "TYPE",
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
    let data = accounts;
    if (data.length == 0) return false;
    const csv = generateCsv(csvConfig)(
      data.map((row) => {
        return {
          name: row.name,
          description: row.description,
          creator: row.creator?.userName,
          updater: row.updater?.userName,
        };
      })
    );
    download(csvConfig)(csv);
  };

  const resetForm = () => {
    actionSet("post");
    selectTypeSet(null);
    descriptionSet("");
    nameSet("");
  };

  const handleUpdate = (row) => {
    idSet(row.id);
    actionSet("put");
    selectTypeSet({ type: row.type });
    descriptionSet(row.description);
    nameSet(row.name);
  };

  const table = useMaterialReactTable({
    columns,
    data: accounts,
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
    getAccounts();
    getTypes();
  }, []);

  const getTypes = async () => {
    try {
      const response = await axios.get(`${API_URL}getTypes`, {
        headers: authHeaders,
      });
      typesSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  // account CRUD Operations
  const getAccounts = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/Account`, {
        headers: authHeaders,
      });
      accountsSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const postAccount = async () => {
    const postData = {
      name: name,
      description: description,
      type: selectType.type,
    };

    if (postData.name.trim() == "") {
      Swal.fire({
        title: "Name is Required.",
        icon: "warning",
      });
    } else if (postData.type.trim() === "") {
      Swal.fire({
        title: "Type is Required.",
        icon: "warning",
      });
    } else {
      isSavingSet(true);
      try {
        let response;

        if (action == "post") {
          response = await axios.post(`${API_URL}api/v1/Account`, postData, {
            headers: authHeaders,
          });
        }

        if (action == "put") {
          response = await axios.put(
            `${API_URL}api/v1/Account/${id}`,
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
          text: "account added successfully",
        });
        resetForm();
        getAccounts();
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
            `${API_URL}api/v1/Account/${row.id}`,
            { headers: authHeaders },
            { id: row.id }
          );
          Swal.fire({
            icon: "success",
            title: `${response.data.name} is deleted Successfully`,
          });
          resetForm();
          getAccounts();
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
      if (e.target === nameRef.current) {
        descriptionRef.current.focus();
      } else if (e.target === descriptionRef.current) {
        typeRef.current.focus();
      } else if (e.target === typeRef.current) {
        postAccount();
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
          ACCOUNT ENTRY
        </Typography>
        <Grid container spacing={3} rowSpacing={1} columnSpacing={2}>
          <Grid item xs={12} md={3} sm={2}>
            <TextField
              label="NAME"
              name="name"
              fullWidth
              autoComplete="off"
              size="small"
              onKeyDown={handleKeyPress}
              inputRef={nameRef}
              value={name}
              onChange={(e) => {
                nameSet(e.target.value);
              }}
            />
          </Grid>

          <Grid item xs={12} md={3} sm={2}>
            <TextField
              label="DESCRIPTION"
              name="description"
              fullWidth
              autoComplete="off"
              size="small"
              onKeyDown={handleKeyPress}
              inputRef={descriptionRef}
              value={description}
              onChange={(e) => {
                descriptionSet(e.target.value);
              }}
            />
          </Grid>

          <Grid item xs={12} md={3} sm={2}>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              size="small"
              fullWidth
              id="combo-box-room-type"
              options={types}
              onKeyDown={handleKeyPress}
              value={selectType}
              onChange={(e, value) => {
                selectTypeSet(value);
              }}
              getOptionLabel={(option) => option.type}
              renderInput={(params) => (
                <TextField
                  inputRef={typeRef}
                  {...params}
                  label="SELECT ACCOUNT TYPE"
                />
              )}
            />
          </Grid>
        </Grid>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            style={{ margin: "15px", color: "green" }}
            loading={isSaving}
            onClick={() => postAccount()}
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
          ACCOUNT LIST
        </Typography>
        <MaterialReactTable table={table} />
      </Paper>
    </>
  );
};

export default Account;
