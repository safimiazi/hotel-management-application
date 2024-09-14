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
import KeyIcon from "@mui/icons-material/Key";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { Autocomplete, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const Signup = () => {
  const userRef = useRef(null);
  const emailRef = useRef(null);
  const branchRef = useRef(null);
  const passRef = useRef(null);
  const rolesRef = useRef(null);
  const [selectedBranch, selectedBranchSet] = useState(null);

  const [branchs, branchsSet] = useState([]);
  const [signupFormData, signupFormDataSet] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [users, usersSet] = useState([]);
  const [id, idSet] = useState(null);
  const [isSaving, isSavingSet] = useState(false);
  const [action, actionSet] = useState("post");
  const [selectedRoles, selectedRolesSet] = useState([]);
  const roles = ["Reader", "creator", "updater", "deleter"];

  const columns = [
    {
      accessor: "action",
      header: "ACTIONS",
      size: 100,
      Cell: ({ row }) => (
        <div className="flex items-center justify-start gap-2">
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
      accessorKey: "userName",
      header: "USER NAME",
      size: 50,
    },
    {
      header: "BRANCH NAME",
      size: 50,
      Cell: ({ row }) => <div>{row.original.branch.name}</div>,
    },
    {
      accessor: "roles",
      header: "Roles",
      size: 100,
      Cell: ({ row }) => (
        <div className="flex items-center justify-start gap-2">
          {row.original.roles.join(", ")}
        </div>
      ),
    },

    {
      accessorKey: "email",
      header: "EMAIL",
      size: 50,
    },
    {
      accessorKey: "phoneNumber",
      header: "PHONE NUMBER",
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

    {
      accessor: "Permissions",
      header: "Permissions",
      size: 10,
      Cell: ({ row }) => (
        <div className="flex items-center justify-start gap-2">
          <Link to={`/user-manage/user-access/${row.original.id}`}>
            <KeyIcon
              style={{
                color: "brown",
                cursor: "pointer",
                display: isSaving ? "none" : "block",
              }}
              onClick={() => handleUpdate(row.original)}
            />
          </Link>
        </div>
      ),
    },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;

    signupFormDataSet({ ...signupFormData, [name]: value });
  };

  const handleExportData = () => {
    let data = users;
    if (data.length == 0) return false;
    const csv = generateCsv(csvConfig)(
      data.map((row) => {
        return {
          userName: row.userName,
          email: row.email,
          phoneNumber: row.phoneNumber,
          branchName: row.branch.name,
          creator: row.creator?.userName,
          updater: row.updater?.userName,
        };
      })
    );
    download(csvConfig)(csv);
  };

  const resetForm = () => {
    selectedBranchSet(null);
    signupFormDataSet({
      username: "",
      email: "",
      password: "",
    });
    actionSet("post");
    selectedRolesSet([]);
  };

  const handleUpdate = (row) => {
    signupFormDataSet({
      username: row.userName,
      email: row.email,
    });
    actionSet("put");
    idSet(row.id);
    selectedBranchSet(row?.branch);
    selectedRolesSet(row?.roles);
  };

  const table = useMaterialReactTable({
    columns,
    data: users,
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
    getbranchs();
    getUsers();
  }, []);

  const getbranchs = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/Branch`, {
        headers: authHeaders,
      });
      branchsSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const getUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}api/Auth/get-all-users`, {
        headers: authHeaders,
      });
      usersSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };
  const signup = async () => {
    const signupData = {
      ...signupFormData,
      branchId: selectedBranch.id,
      roles: selectedRoles,
    };
    if (signupData.branchId === "") {
      Swal.fire({
        title: "BRANCH ID is Required.",
        icon: "warning",
      });
    } else if (signupData.email.trim() === "") {
      Swal.fire({
        title: "EMAIL is Required.",
        icon: "warning",
      });
    } else if (signupData.password?.trim() === "" && action === "post") {
      Swal.fire({
        title: "PASSWORD is Required.",
        icon: "warning",
      });
    } else if (signupData.username.trim() === "") {
      Swal.fire({
        title: "USER NAME is Required.",
        icon: "warning",
      });
    } else if (signupData.roles === null) {
      Swal.fire({
        title: "ROLES is Required.",
        icon: "warning",
      });
    } else {
      isSavingSet(true);
      try {
        let response;

        if (action == "post") {
          response = await axios.post(`${API_URL}api/Auth/signup`, signupData, {
            headers: authHeaders,
          });
        }

        if (action == "put") {
          response = await axios.put(
            `${API_URL}api/Auth/user-update/${id}`,
            signupData,

            {
              headers: authHeaders,
            }
          );
        }

        // After Api Response

        Swal.fire({
          icon: "success",
          title: `${response.data}`,
          text: "Signup successfully",
        });
        resetForm();
        getUsers();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed! Please try again later.",
          confirmButtonText: "OK",
        });
      }

      isSavingSet(false);
    }
  };

  // const handleDelete = async (row) => {

  //     Swal.fire({
  //         title: `Are you sure delete this?`,
  //         icon: 'warning',
  //         buttons: true
  //     }).then(async (res) => {

  //         isSavingSet(true)
  //         try {
  //             if (res.isConfirmed) {
  //                 let response = await axios.delete(`${API_URL}api/Auth/signup/${row.id}`, { headers: authHeaders }, { id: row.id })
  //                 Swal.fire({
  //                     icon: 'success',
  //                     title: `${response.data.branchNo} is deleted Successfully`,
  //                 });
  //                 resetForm()
  //                 getUsers()
  //             }
  //         } catch (err) {
  //             Swal.fire({
  //                 icon: 'error',
  //                 title: 'Error!',
  //                 text: 'Failed ! Please try again later.',
  //                 confirmButtonText: 'OK'
  //             });
  //         }
  //         isSavingSet(false)

  //     })

  // }

  // End CRUD Operations

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (event.target === userRef.current) {
        emailRef.current.focus();
      } else if (event.target === emailRef.current) {
        branchRef.current.focus();
      } else if (event.target === branchRef.current) {
        passRef.current.focus();
      } else if (event.target === passRef.current) {
        rolesRef.current.focus();
      } else if (event.target === rolesRef.current) {
        signup();
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
          USER MANAGE
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="USERNAME"
              name="username"
              autoComplete="off"
              size="small"
              inputRef={userRef}
              value={signupFormData.username}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="EMAIL"
              name="email"
              inputRef={emailRef}
              autoComplete="off"
              size="small"
              value={signupFormData.email}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              autoComplete="off"
              size="small"
              id="combo-box-floors"
              options={branchs}
              value={selectedBranch}
              onChange={(e, obj) => {
                if (obj === null) return null;
                selectedBranchSet(obj);
              }}
              onKeyDown={handleKeyPress}
              getOptionLabel={(option) => option.name}
              fullWidth
              renderInput={(params) => (
                <TextField
                  inputRef={branchRef}
                  {...params}
                  label="SELECT BRANCH"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="PASSWORD"
              name="password"
              type="password"
              inputRef={passRef}
              autoComplete="off"
              size="small"
              value={signupFormData.password}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              multiple
              id="roles-autocomplete"
              options={roles}
              size="small"
              value={selectedRoles}
              onChange={(e, obj) => {
                if (obj !== null) {
                  selectedRolesSet(obj);
                }
              }}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField
                  inputRef={rolesRef}
                  {...params}
                  variant="outlined"
                  label="ROLES"
                  fullWidth
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
            onClick={() => signup()}
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
          USER LIST
        </Typography>
        <MaterialReactTable table={table} />
      </Paper>
    </>
  );
};

export default Signup;
