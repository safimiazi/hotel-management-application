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

const Guest = () => {
  const [mobileNo, mobileNoSet] = useState("");
  const [selectedIdType, selectedIdTypeSet] = useState({ label: "NID" });

  const [formInputData, formInputDataSet] = useState({
    name: "",
    address: "",
    age: "",

    email: "",
    note: "",

    idNumber: "",
  });

  const [selectedGender, selectedGenderSet] = useState(null);

  const [guests, guestsSet] = useState([]);
  const [guestTypes, guestTypesSet] = useState([]);
  const [selectedGuestType, selectedGuestTypeSet] = useState(null);
  const [id, idSet] = useState(null);
  const [isSaving, isSavingSet] = useState(false);
  const [action, actionSet] = useState("post");
  const [totalRecordCount, totalRecordCountSet] = useState(0);
  const [pagination, paginationSet] = useState({
    pageIndex: 0,
    pageSize: 3,
  });

  const [SearchTerm, SearchTermSet] = useState("");
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
      accessorKey: "address",
      header: "ADDRESS",
      size: 50,
    },
    {
      accessorKey: "guestType",
      header: "GUEST TYPE",
      size: 50,
    },
    // {
    //   accessorKey: "age",
    //   header: "AGE",
    //   size: 50,
    // },
    {
      accessorKey: "mobileNo",
      header: "MOBILE NO",
      size: 50,
    },
    {
      accessorKey: "email",
      header: "EMAIL",
      size: 50,
    },
    {
      accessorKey: "gender",
      header: "GENDER",
      size: 50,
    },
    // {
    //   accessorKey: "note",
    //   header: "NOTE",
    //   size: 50,
    // },
    // {
    //   accessorKey: "idType",
    //   header: "ID TYPE",
    //   size: 50,
    // },
    {
      accessorKey: "idNumber",
      header: "ID NUMBER",
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
    formInputDataSet({ ...formInputData, [name]: value });
  };

  const handleExportData = () => {
    let data = guests;
    if (data.length == 0) return false;
    const csv = generateCsv(csvConfig)(
      data.map((row) => {
        return {
          name: row.name,
          address: row.address,
          age: row.age,
          mobileNo: row.mobileNo,
          email: row.email,
          gender: row.gender,
          note: row.note,
          idType: row.idType,
          idNumber: row.idNumber,
          creator: row.creator?.userName,
          updater: row.updater?.userName,
        };
      })
    );
    download(csvConfig)(csv);
  };

  const resetForm = () => {
    actionSet("post");

    formInputDataSet({
      name: "",
      address: "",
      age: "",

      email: "",

      note: "",

      idNumber: "",
    });
    selectedIdTypeSet(null);
    selectedGenderSet(null);
    mobileNoSet("");
    selectedGuestTypeSet(null);
    selectedGenderSet(null);
  };

  const handleUpdate = (row) => {
    idSet(row.id);
    actionSet("put");
    formInputDataSet({
      ...formInputData,
      name: row.name,
      address: row.address,
      age: row.age,

      email: row.email,
      note: row.note,
      idNumber: row.idNumber,
    });
    selectedIdTypeSet({ label: row.idType });
    mobileNoSet(row.mobileNo);
    selectedGenderSet({ label: row.gender });
    selectedGuestTypeSet({ guestType: row.guestType });
  };



  // table end

  useEffect(() => {
    getGuestTypes();
  }, []);

  // guest CRUD Operations
  const getGuestTypes = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/Guest/get-guest-types`,
        {
          headers: authHeaders,
        }
      );
      guestTypesSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
 
    getGuests();
  }, [pagination.pageIndex, pagination.pageSize, SearchTerm]);


  const getGuests = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/Guest`, {
        headers: authHeaders,
        params: {
          SearchTerm:
            SearchTerm !== undefined && SearchTerm.trim() !== ""
              ? SearchTerm
              : null,
          PageSize: pagination.pageSize,
          PageNumber: pagination.pageIndex,
        },
      });
      guestsSet(response.data.records);
      totalRecordCountSet(response.data.totalRecordCount);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };


  const table = useMaterialReactTable({
    columns,
    data: guests,
    manualPagination: true,
    pageCount: Math.ceil(totalRecordCount / pagination.pageSize),
    state: { pagination },
    onPaginationChange: paginationSet,
    onGlobalFilterChange: SearchTermSet,
    muiPaginationProps: {
      showRowsPerPage: true,
      shape: "rounded",
    },
    paginationDisplayMode: "pages",

    renderTopToolbarCustomActions: () => (
      <Button
        onClick={handleExportData}
        startIcon={<FileDownloadIcon />}
        size="sm"
        variant="outlined"
      >
        Export Data To CSV
      </Button>
    ),
    positionToolbarAlertBanner: "bottom",
    muiTableRowCellProps: {
      sx: {
        fontWeight: "normal",
        fontSize: "5px",
      },
    },
    title: "Hello",
  });




  const postGuest = async () => {
    if (formInputData.name.trim() === "") {
      Swal.fire({
        title: "Name is Required.",
        icon: "warning",
      });
    } else if (mobileNo.length < 11) {
      Swal.fire({
        title: "Mobile number must be at least 11 digits.",
        icon: "warning",
      });
    } else if (mobileNo === "") {
      Swal.fire({
        title: "Modbile number is Required.",
        icon: "warning",
      });
    } else if (selectedGuestType === null) {
      Swal.fire({
        title: "Guest Type is Required.",
        icon: "warning",
      });
    } else {
      const postData = {
        ...formInputData,
        gender: selectedGender != null ? selectedGender.label : "",
        guestType: selectedGuestType != null ? selectedGuestType.guestType : "",
        mobileNo: mobileNo,
        idType: selectedIdType != null ? selectedIdType.label : "",
      };
      isSavingSet(true);

      try {
        let response;

        if (action == "post") {
          response = await axios.post(`${API_URL}api/v1/Guest`, postData, {
            headers: authHeaders,
          });
        }

        if (action == "put") {
          response = await axios.put(`${API_URL}api/v1/Guest/${id}`, postData, {
            headers: authHeaders,
          });
        }

        // After Api Response

        Swal.fire({
          icon: "success",
          title: `${response.data.name} is ${
            action == "post" ? "Create" : "update"
          } Successfully`,
          text: "guest added successfully",
        });
        resetForm();
        getGuests();
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
            `${API_URL}api/v1/Guest/${row.id}`,
            { headers: authHeaders },
            { id: row.id }
          );
          Swal.fire({
            icon: "success",
            title: `${response.data.name} is deleted Successfully`,
          });
          resetForm();
          getGuests();
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

  const nameRef = useRef(null);
  const addressRef = useRef(null);
  const ageRef = useRef(null);
  const mobileNoRef = useRef(null);
  const emailRef = useRef(null);
  const genderRef = useRef(null);
  const noteRef = useRef(null);
  const idTypeRef = useRef(null);
  const idNumberRef = useRef(null);
  const guestTypeRef = useRef(null);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (event.target === nameRef.current) {
        guestTypeRef.current.focus();
      }
      if (event.target === guestTypeRef.current) {
        addressRef.current.focus();
      } else if (event.target === addressRef.current) {
        ageRef.current.focus();
      } else if (event.target === ageRef.current) {
        mobileNoRef.current.focus();
      } else if (event.target === mobileNoRef.current) {
        emailRef.current.focus();
      } else if (event.target === emailRef.current) {
        genderRef.current.focus();
      } else if (event.target === genderRef.current) {
        noteRef.current.focus();
      } else if (event.target === noteRef.current) {
        idTypeRef.current.focus();
      } else if (event.target === idTypeRef.current) {
        idNumberRef.current.focus();
      } else if (event.target === idNumberRef.current) {
        postGuest();
      }
    }
  };

  const options = [{ label: "Male" }, { label: "Female" }, { label: "Others" }];
  const idTypes = [{ label: "NID" }, { label: "PASSPORT" }];

  return (
    <>
      <Paper className="m-3 p-3">
        <Typography
          variant="h6"
          className="MuiTypography-h6 mb-3"
          style={{ marginBottom: "8px" }}
        >
          GUEST INPUT
        </Typography>
        <Grid
          container
          spacing={3}
          rowSpacing={2}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Grid item xs={12} md={3} sm={2}>
            <TextField
              label="NAME"
              name="name"
              autoComplete="off"
              size="small"
              onKeyDown={handleKeyPress}
              value={formInputData.name}
              onChange={handleChange}
              inputRef={nameRef}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3} sm={2}>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              size="small"
              id="combo-box-gender"
              options={guestTypes}
              value={selectedGuestType}
              onKeyDown={handleKeyPress}
              onChange={(e, obj) => selectedGuestTypeSet(obj)}
              getOptionLabel={(option) => option.guestType}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputRef={guestTypeRef}
                  label="SELECT GUEST TYPE"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={3} sm={2}>
            <TextField
              label="ADDRESS"
              name="address"
              autoComplete="off"
              size="small"
              onKeyDown={handleKeyPress}
              value={formInputData.address}
              onChange={handleChange}
              inputRef={addressRef}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3} sm={2}>
            <TextField
              label="AGE"
              name="age"
              autoComplete="off"
              size="small"
              type="number"
              onKeyDown={handleKeyPress}
              value={formInputData.age}
              onChange={handleChange}
              inputRef={ageRef}
              onFocus={() => ageRef.current.select()}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3} sm={2}>
            <TextField
              label="MOBILE NO"
              name="mobileNo"
              autoComplete="off"
              size="small"
              onKeyDown={handleKeyPress}
              value={mobileNo}
              inputRef={mobileNoRef}
              fullWidth
              onFocus={() => mobileNoRef.current.select()}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  if (value.length >= 11) {
                    mobileNoSet(value);
                  } else {
                    mobileNoSet(value);
                  }
                }
              }}
              helperText={
                mobileNo.length > 0 && mobileNo.length < 11
                  ? "Mobile number must be at least 11 digits."
                  : ""
              }
              error={mobileNo.length > 0 && mobileNo.length < 11}
            />
          </Grid>
          <Grid item xs={12} md={3} sm={2}>
            <TextField
              label="EMAIL"
              name="email"
              autoComplete="off"
              size="small"
              onKeyDown={handleKeyPress}
              value={formInputData.email}
              onChange={handleChange}
              inputRef={emailRef}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3} sm={2}>
            <Autocomplete
              autoHighlight
              openOnFocus
              disablePortal
              size="small"
              id="gender-autocomplete"
              options={options}
              value={selectedGender}
              onKeyDown={handleKeyPress}
              onChange={(e, obj) => selectedGenderSet(obj)}
              getOptionLabel={(option) => option.label}
              disableClearable
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Gender"
                  inputRef={genderRef}
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={3} sm={2}>
            <TextField
              label="NOTE"
              name="note"
              autoComplete="off"
              size="small"
              onKeyDown={handleKeyPress}
              value={formInputData.note}
              onChange={handleChange}
              inputRef={noteRef}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3} sm={2}>
            <Autocomplete
              autoHighlight
              openOnFocus
              size="small"
              id="idType-autocomplete"
              options={idTypes}
              value={selectedIdType}
              onKeyDown={handleKeyPress}
              onChange={(e, obj) => selectedIdTypeSet(obj)}
              getOptionLabel={(option) => option.label}
              disableClearable
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="ID TYPE"
                  inputRef={idTypeRef}
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={3} sm={2}>
            <TextField
              label="ID NUMBER"
              name="idNumber"
              autoComplete="off"
              size="small"
              onKeyDown={handleKeyPress}
              value={formInputData.idNumber}
              onChange={handleChange}
              inputRef={idNumberRef}
              fullWidth
            />
          </Grid>
        </Grid>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            style={{ margin: "15px", color: "green" }}
            loading={isSaving}
            onClick={() => postGuest()}
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
          GUEST LIST
        </Typography>
        <MaterialReactTable table={table} />
      </Paper>
    </>
  );
};

export default Guest;
