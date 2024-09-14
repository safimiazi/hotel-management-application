import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { authHeaders, dateFormat } from "../../../utils";
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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const Employee = () => {
  const [mobileNo, mobileNoSet] = useState(0);

  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const presentAddressRef = useRef(null);
  const permanentAddressRef = useRef(null);
  const genderRef = useRef(null);
  const idNumberRef = useRef(null);
  const joiningDateRef = useRef(null);
  const basicSalaryRef = useRef(null);
  const departmentRef = useRef(null);
  const nameRef = useRef(null);
  const [departments, departmentsSet] = useState([]);
  const [id, idSet] = useState(null);
  const [isSaving, isSavingSet] = useState(false);
  const [action, actionSet] = useState("post");
  const [selectGender, selectGenderSet] = useState(null);
  const [employeeFormData, employeeFormDataSet] = useState({
    name: "",
    email: "",
    presentAddress: "",
    permanentAddress: "",
    idNumber: "",
  });
  const [joiningDate, joiningDateSet] = useState(dayjs());
  const [selectedDepartment, selectedDepartmentSet] = useState(null);
  const [employes, employesSet] = useState([]);
  const [basicSalary, basicSalarySet] = useState(0);

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
      accessorKey: "joiningDate",
      header: "JOINING DATE",
      size: 50,
      Cell: ({ row }) => (
        <>{dayjs(row.original.joiningDate).format(dateFormat)}</>
      ),
    },
    {
      accessorKey: "name",
      header: "NAME",
      size: 50,
    },
    {
      accessorKey: "phone",
      header: "PHONE",
      size: 50,
    },
    {
      accessorKey: "gender",
      header: "GENDER",
      size: 50,
    },
    {
      header: "DEPARTMENT",
      size: 100,
      Cell: ({ row }) => <>{row.original.department.name}</>,
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
    employeeFormDataSet({ ...employeeFormData, [name]: value });
  };

  const handleExportData = () => {
    let data = employes;
    if (data.length == 0) return false;
    const csv = generateCsv(csvConfig)(
      data.map((row) => {
        return {
          joiningDate: `${dayjs(row.joiningDate).format(dateFormat)}`,
          name: row.name,
          phone: row.phone,
          gender: row.gender,
          department: row.department.name,
          creator: row.creator?.userName,
          updater: row.updater?.userName,
        };
      })
    );
    download(csvConfig)(csv);
  };

  const resetForm = () => {
    employeeFormDataSet({
      name: "",
      email: "",
      presentAddress: "",
      permanentAddress: "",
      idNumber: "",
    });
    mobileNoSet(0);
    selectGenderSet(null);
    actionSet("post");
    joiningDateSet(dayjs());
    selectedDepartmentSet(null);
    basicSalarySet(0);
  };

  const handleUpdate = (row) => {
    idSet(row.id);
    actionSet("put");
    employeeFormDataSet({
      ...employeeFormData,
      name: row.name,
      email: row.email,
      presentAddress: row.presentAddress,
      permanentAddress: row.permanentAddress,
      idNumber: row.idNumber,
    });
    mobileNoSet(row.phone);
    selectGenderSet({ type: row.gender });
    joiningDateSet(dayjs(row.joiningDate));
    basicSalarySet(row.basicSalary);
    selectedDepartmentSet(row.department);
  };

  const table = useMaterialReactTable({
    columns,
    data: employes,
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
    getDepartments();
    getEmployes();
  }, []);

  // department CRUD Operations
  const getEmployes = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/Employee`, {
        headers: authHeaders,
      });
      employesSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };
  const getDepartments = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/Department`, {
        headers: authHeaders,
      });
      departmentsSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const postEmployee = async () => {
    if (employeeFormData.name.trim() === "") {
      Swal.fire({
        title: "Name is Required.",
        icon: "warning",
      });
    } else if (mobileNo.length < 11) {
      Swal.fire({
        title: "Mobile number must be at least 11 digits.",
        icon: "warning",
      });
    } else {
      isSavingSet(true);
      try {
        const employeeData = {
          ...employeeFormData,
          phone: mobileNo,
          gender: selectGender?.type,
          joiningDate: joiningDate.format(dateFormat),
          departmentId: selectedDepartment?.id,
          basicSalary: parseFloat(basicSalary),
        };

        let response;

        if (action == "post") {
          response = await axios.post(
            `${API_URL}api/v1/Employee`,
            employeeData,
            {
              headers: authHeaders,
            }
          );
        }

        if (action == "put") {
          response = await axios.put(
            `${API_URL}api/v1/Employee/${id}`,
            employeeData,
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
        });
        resetForm();
        getEmployes();
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
            `${API_URL}api/v1/Employee/${row.id}`,
            { headers: authHeaders },
            { id: row.id }
          );
          Swal.fire({
            icon: "success",
            title: `${response.data.name} is deleted Successfully`,
          });
          resetForm();
          getEmployes();
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

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (event.target === nameRef.current) {
        emailRef.current.focus();
      } else if (event.target === emailRef.current) {
        phoneRef.current.focus();
      } else if (event.target === phoneRef.current) {
        presentAddressRef.current.focus();
      } else if (event.target === presentAddressRef.current) {
        permanentAddressRef.current.focus();
      } else if (event.target === permanentAddressRef.current) {
        genderRef.current.focus();
      } else if (event.target === genderRef.current) {
        idNumberRef.current.focus();
      } else if (event.target === idNumberRef.current) {
        joiningDateRef.current.focus();
      } else if (event.target === joiningDateRef.current) {
        basicSalaryRef.current.focus();
      } else if (event.target === basicSalaryRef.current) {
        departmentRef.current.focus();
      }
    }
  };

  const gender = [{ type: "Male" }, { type: "Female" }, { type: "Others" }];

  return (
    <>
      <Paper className="m-3 p-3">
        <Typography
          variant="h6"
          className="MuiTypography-h6 mb-3"
          style={{ marginBottom: "8px" }}
        >
          EMPLOYEE ENTRY
        </Typography>
        <Grid
          container
          spacing={3}
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Grid item xs={12} sm={2} md={3}>
            <TextField
              label="NAME"
              name="name"
              autoComplete="off"
              size="small"
              fullWidth
              onKeyDown={handleKeyPress}
              value={employeeFormData.name}
              onChange={handleChange}
              inputRef={nameRef}
            />
          </Grid>
          <Grid item xs={12} sm={2} md={3}>
            <TextField
              label="EMAIL"
              name="email"
              autoComplete="off"
              size="small"
              fullWidth
              onKeyDown={handleKeyPress}
              value={employeeFormData.email}
              onChange={handleChange}
              inputRef={emailRef}
            />
          </Grid>
          <Grid item xs={12} sm={2} md={3}>
            <TextField
              label="MOBILE NO"
              name="mobileNo"
              autoComplete="off"
              size="small"
              inputRef={phoneRef}
              onFocus={() => phoneRef.current.select()}
              onKeyDown={handleKeyPress}
              fullWidth
              value={mobileNo}
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
          <Grid item xs={12} sm={2} md={3}>
            <TextField
              label="PRESENT ADDRESS"
              name="presentAddress"
              autoComplete="off"
              size="small"
              fullWidth
              onKeyDown={handleKeyPress}
              value={employeeFormData.presentAddress}
              onChange={handleChange}
              inputRef={presentAddressRef}
            />
          </Grid>
          <Grid item xs={12} sm={2} md={3}>
            <TextField
              label="PERMANENT ADDRESS"
              name="permanentAddress"
              autoComplete="off"
              size="small"
              fullWidth
              onKeyDown={handleKeyPress}
              value={employeeFormData.permanentAddress}
              onChange={handleChange}
              inputRef={permanentAddressRef}
            />
          </Grid>

          {/* <Grid item xs={12} sm={2} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">GENDER</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="gender"
                inputRef={genderRef}   
                onKeyDown={handleKeyPress}
                value={employeeFormData.gender}
                label="GENDER"
                onChange={handleChange}
                

              >
                <MenuItem value={"male"}>Male</MenuItem>
                <MenuItem value={"female"}>Female</MenuItem>
                <MenuItem value={"others"}>Others</MenuItem>
              </Select>
            </FormControl>
          </Grid> */}

          <Grid item xs={12} sm={2} md={3}>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              size="small"
              id="combo-box-gender"
              options={gender}
              value={selectGender}
              onKeyDown={handleKeyPress}
              onChange={(e, obj) => selectGenderSet(obj)}
              getOptionLabel={(option) => option.type}
              fullWidth
              renderInput={(params) => (
                <TextField
                  inputRef={genderRef}
                  {...params}
                  label="SELECT GENDER"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={2} md={3}>
            <TextField
              label="ID NUMBER"
              name="idNumber"
              autoComplete="off"
              size="small"
              fullWidth
              type="number"
              onKeyDown={handleKeyPress}
              value={employeeFormData.idNumber}
              onChange={handleChange}
              inputRef={idNumberRef}
              onFocus={() => idNumberRef.current.select()}
            />
          </Grid>

          <Grid item xs={12} sm={2} md={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                components={[
                  "DatePicker",
                  "DesktopDatePicker",
                  "MobileDatePicker",
                ]}
              >
                <DemoItem>
                  <DatePicker
                    label="JOINING DATE"
                    value={joiningDate}
                    onChange={(e) => {
                      joiningDateSet(e);
                    }}
                    format={dateFormat}
                    slotProps={{ field: { size: "small" } }}
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        inputRef={joiningDateRef}
                        {...params}
                        onKeyDown={handleKeyPress}
                      />
                    )}
                  />
                </DemoItem>
              </DemoContainer>
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={2} md={3}>
            <TextField
              label="BASIC SALARY"
              name="basicSalary"
              autoComplete="off"
              size="small"
              fullWidth
              type="number"
              onKeyDown={handleKeyPress}
              value={basicSalary}
              onChange={(e) => {
                basicSalarySet(e.target.value);
              }}
              inputRef={basicSalaryRef}
              onFocus={() => basicSalaryRef.current.select()}
            />
          </Grid>

          <Grid item xs={12} sm={2} md={3}>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              size="small"
              id="combo-box-department"
              options={departments}
              value={selectedDepartment}
              onKeyDown={handleKeyPress}
              onChange={(e, obj) => selectedDepartmentSet(obj)}
              getOptionLabel={(option) => option.name}
              fullWidth
              renderInput={(params) => (
                <TextField
                  inputRef={departmentRef}
                  {...params}
                  label="SELECT DEPARTMENT"
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
            onClick={() => postEmployee()}
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
          EMPLOYEE LIST
        </Typography>
        <MaterialReactTable table={table} />
      </Paper>
    </>
  );
};

export default Employee;
