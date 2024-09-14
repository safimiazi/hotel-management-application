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

const Supplier = () => {
  // const [moduleTypes, moduleTypesSet] = useState([]);
  // const [selectedModule, selectedModuleSet] = useState(null);
  const [name, nameSet] = useState("");
  const [contactNo, contactNoSet] = useState("");
  const [address, addressSet] = useState("");
  const [openingBalance, openingBalanceSet] = useState(0);

  const nameRef = useRef(null);
  const contactRef = useRef(null);
  const addressRef = useRef(null);
  const openingBalanceRef = useRef(null);

  const [suppliers, suppliersSet] = useState([]);
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
      header: "SUPPLIERS NAME",
      size: 50,
    },
    {
      accessorKey: "contactNo",
      header: "CONTACT NO",
      size: 50,
    },
    {
      accessorKey: "address",
      header: "ADDRESS",
      size: 50,
    },
    // {
    //   accessorKey: "moduleType",
    //   header: "MODULE TYPE",
    //   size: 50,
    // },
    {
      accessorKey: "openingBalance",
      header: "OPENING BALANCE",
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
    let data = suppliers;
    if (data.length == 0) return false;
    const csv = generateCsv(csvConfig)(
      data.map((row) => {
        return {
          name: row.name,
          contactNo: row.contactNo,
          address: row.address,
          moduleType: row.moduleType,
          openingBalance: row.openingBalance,
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
    contactNoSet("");
    addressSet("");
    openingBalanceSet(0);
    // selectedModuleSet(null);
  };

  const handleUpdate = (row) => {
    idSet(row.id);
    actionSet("put");
    nameSet(row.name);
    // selectedModuleSet({ moduleType: row.moduleType });
    contactNoSet(row.contactNo);
    addressSet(row.address);
    openingBalanceSet(row.openingBalance);
  };

  const table = useMaterialReactTable({
    columns,
    data: suppliers,
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
    getSuppliers();
    // getModuleType();
  }, []);

  // const getModuleType = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${API_URL}api/v1/Supplier/get-module-types`,
  //       {
  //         headers: authHeaders,
  //       }
  //     );
  //     moduleTypesSet(response.data);
  //   } catch (error) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error!",
  //       text: "Failed Load Data! Please try again later.",
  //       confirmButtonText: "OK",
  //     });
  //   }
  // };

  const getSuppliers = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/Supplier`, {
        headers: authHeaders,
      });
      suppliersSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const postSupplier = async () => {
    if (name.trim() === "") {
      Swal.fire({
        title: "Name is Required.",
        icon: "warning",
      });
      return false;
    } else {
      const postData = {
        name,
        contactNo,
        address,
        openingBalance,
        // moduleType: selectedModule.moduleType,
      };

      isSavingSet(true);
      try {
        let response;

        if (action == "post") {
          response = await axios.post(`${API_URL}api/v1/Supplier`, postData, {
            headers: authHeaders,
          });
        }

        if (action == "put") {
          response = await axios.put(
            `${API_URL}api/v1/Supplier/${id}`,
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
          text: "supplier added successfully",
        });
        resetForm();
        getSuppliers();
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
            `${API_URL}api/v1/Supplier/${row.id}`,
            { headers: authHeaders },
            { id: row.id }
          );
          Swal.fire({
            icon: "success",
            title: `${response.data.name} is deleted Successfully`,
          });
          resetForm();
          getSuppliers();
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
  const moduleTypeRef = useRef(null);
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (e.target === nameRef.current) {
        contactRef.current.focus();
      } else if (e.target === contactRef.current) {
        addressRef.current.focus();
      } else if (e.target === addressRef.current) {
        openingBalanceRef.current.focus();
      } else if (e.target === openingBalanceRef.current) {
        moduleTypeRef.current.focus();
      } else if (e.target === moduleTypeRef.current) {
        postSupplier();
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
          SUPPLIER ENTRY
        </Typography>
        <Grid
          container
          spacing={3}
          rowSpacing={2}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Grid item xs={12} sm={3}>
            <TextField
              label="NAME"
              name="name"
              autoComplete="off"
              size="small"
              onKeyDown={handleKeyPress}
              inputRef={nameRef}
              fullWidth
              value={name}
              onChange={(e) => nameSet(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="CONTACT NO"
              name="contactNo"
              autoComplete="off"
              size="small"
              onKeyDown={handleKeyPress}
              fullWidth
              inputRef={contactRef}
              value={contactNo}
              onFocus={() => contactRef.current.select()}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  if (value.length >= 11) {
                    contactNoSet(value);
                  } else {
                    contactNoSet(value);
                  }
                }
              }}
              helperText={
                contactNo.length > 0 && contactNo.length < 11
                  ? "Mobile number must be at least 11 digits."
                  : ""
              }
              error={contactNo.length > 0 && contactNo.length < 11}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="ADDRESS"
              name="address"
              autoComplete="off"
              size="small"
              fullWidth
              onKeyDown={handleKeyPress}
              inputRef={addressRef}
              value={address}
              onChange={(e) => addressSet(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="OPENING BALANCE"
              name="openingBalance"
              autoComplete="off"
              size="small"
              type="number"
              onKeyDown={handleKeyPress}
              inputRef={openingBalanceRef}
              onFocus={() => openingBalanceRef.current.select()}
              fullWidth
              value={openingBalance}
              onChange={(e) => {
                if (0 > e.target.value) {
                  return false;
                }
                openingBalanceSet(e.target.value);
              }}
              onBlur={(e) => {
                if (e.target.value === "" || parseFloat(e.target.value) < 0) {
                  openingBalanceSet(0);
                }
              }}
            />
          </Grid>
          {/* <Grid item xs={12} sm={3}>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              size="small"
              id="combo-box-moduleType"
              options={moduleTypes}
              value={selectedModule}
              onKeyDown={handleKeyPress}
              onChange={(e, obj) => selectedModuleSet(obj)}
              getOptionLabel={(option) => option.moduleType}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputRef={moduleTypeRef}
                  label="SELECT MODULE TYPE"
                />
              )}
            />
          </Grid> */}
        </Grid>
        <Stack direction="row" spacing={2}>
          <Button
            onClick={() => postSupplier()}
            variant="outlined"
            style={{ margin: "15px", color: "green" }}
            loading={isSaving}
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
          SUPPLIER LIST
        </Typography>
        <MaterialReactTable table={table} />
      </Paper>
    </>
  );
};

export default Supplier;
