import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReceiptIcon from "@mui/icons-material/Receipt";
import '../Accounts/style.css'
import {
  authHeaders,
  dateFormat,
  amountFormat,
  cashBankAccountFilterTypes,
} from "../../../utils";
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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Textarea } from "@mui/joy";
import { Link, useNavigate } from "react-router-dom";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const selectedEmployeeSalaryPayment = () => {
  //get data
  const [employeeSalaryPayment, employeeSalaryPaymentSet] = useState([]);
  const [months, mothsSet] = useState([]);
  const [accounts, accountsSet] = useState([]);
  const [employes, employesSet] = useState([]);
  const [years, yearsSet] = useState([]);
  const [selectedYear, selectedYearSet] = useState(null);
  const [transactionCode, transactionCodeSet] = useState("");

  // selected data
  const [selectedCreatedDate, selectedCreatedDateSet] = useState(dayjs());
  const [payAmount, payAmountSet] = useState(0);
  const [note, noteSet] = useState("");

  //add to cart
  const [selectedEmployee, selectedEmployeeSet] = useState(null);
  const [selectedAccount, selectedAccountSet] = useState(null);
  const [amount, amountSet] = useState(0);

  const [id, idSet] = useState(null);
  const [isSaving, isSavingSet] = useState(false);
  const [action, actionSet] = useState("post");
  const [cartIndex, cartIndexSet] = useState(null);
  const navigate = useNavigate();

  //cart data:
  const [cartData, setCartData] = useState([]);

  const [selectedMonth, selectedMonthSet] = useState(null);

  const columns = [
    {
      header: "ACTIONS",
      size: 100,
      Cell: ({ row }) => (
        <div className="flex gap-3 items-center justify-around">
          <Link
            to={{
              pathname: `/payroll/employee-payment-invoice/${row.original.id}`,
            }}
          >
            <ReceiptIcon
              style={{
                color: "blue",
                cursor: "pointer",
              }}
            />
          </Link>
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
      accessorKey: "transactionCode",
      header: "TRAN CODE",
      size: 50,
    },
    {
      accessor: "createdDate",
      header: "ENTRY DATE",
      size: 10,
      Cell: ({ row }) => (
        <>{dayjs(row.original.createdDate).format(dateFormat)}</>
      ),
    },

    {
      accessor: "s",
      header: "DETAIL",
      size: 35,
      Cell: ({ row }) => (
        <>
          {row.original.employeeSalaryPaymentDetails.map((detail) => (
            <>
              {detail.employee.name} - {detail.account.name} - {detail.amount}{" "}
              <br />
            </>
          ))}
        </>
      ),
    },
    {
      header: "PAY AMOUNT",
      size: 20,

      Cell: ({ row }) => (
        <>{amountFormat(parseFloat(row.original.payAmount).toFixed(2))}</>
      ),
    },
    {
      header: "YEAR",
      size: 10,
      Cell: ({ row }) => (
        <>
          {row.original.employeeSalaryPaymentDetails.map((item) => (
            <div className="flex flex-col">{item?.year}</div>
          ))}
        </>
      ),
    },
    {
      header: "MONTH",
      size: 10,
      Cell: ({ row }) => (
        <>
          {row.original.employeeSalaryPaymentDetails.map((item) => (
            <div className="flex flex-col">{item?.month}</div>
          ))}
        </>
      ),
    },

    {
      accessorKey: "creator.userName",
      header: "CREATE BY",
      size: 10,
    },
    {
      accessorKey: "updater.userName",
      header: "UPDATE BY",
      size: 5,
    },
  ];

  const handleExportData = () => {
    let data = employeeSalaryPayment;
    if (data.length == 0) return false;
    const csv = generateCsv(csvConfig)(
      data.map((row) => {
        return {
          createdDate: `${dayjs(row.createdDate).format(dateFormat)}`,
          transactionCode: row.transactionCode,
          details: row.employeeSalaryPaymentDetails
            .map(
              (detail) =>
                `${detail.employee.name} - ${detail.account.name} - ${detail.amount}`
            )
            .join(", "),
          payAmount: row.payAmount,
          month: row.employeeSalaryPaymentDetails
            .map((item) => item.month)
            .join(", "),
          creator: row.creator?.userName,
          updater: row.updater?.userName,
        };
      })
    );
    download(csvConfig)(csv);
  };

  const resetForm = () => {
    actionSet("post");
    selectedCreatedDateSet(dayjs());
    noteSet("");

    resetCart();
    setCartData([]);
  };

  const resetCart = () => {
    selectedEmployeeSet(null);
    selectedAccountSet(null);
    selectedYearSet(null);
    amountSet("");
    cartIndexSet(null);
    selectedMonthSet(null);
  };

  const handleUpdate = (row) => {
    idSet(row?.id);
    actionSet("put");
    selectedCreatedDateSet(dayjs());
    noteSet(row.note);
    transactionCodeSet(row.transactionCode);

    const updatedCartData = row.employeeSalaryPaymentDetails.map((item) => ({
      //for post
      employeeId: item.employee.id,
      accountId: item.account.id,
      year: item.year,
      month: item.month,
      amount: item.amount,
      //for show to cart
      employeeName: item.employee.name,
      accountName: item.account.name,
    }));
    setCartData(updatedCartData);
  };

  const cartUpdate = (row, index) => {
    cartIndexSet(index);
    selectedEmployeeSet({ id: row.employeeId, name: row.employeeName });
    selectedAccountSet({ id: row.accountId, name: row.accountName });
    selectedMonthSet({ month: row.month });
    amountSet(row.amount);
    selectedYearSet(row.year);
  };

  const cartDelete = (index) => {
    const deletedItem = cartData.filter((item, inx) => inx !== index);
    setCartData(deletedItem);
  };

  const table = useMaterialReactTable({
    columns,
    data: employeeSalaryPayment,
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
    getMonths();
    getInvoiceCode();
    getEmployes();
    getEmployeeSalaryPayment();
    getYears();
  }, []);

  const getEmployeeSalaryPayment = async () => {
    try {
      const response = await axios.get(`${API_URL}api/EmployeeSalaryPayment`, {
        headers: authHeaders,
      });
      employeeSalaryPaymentSet(response.data.records);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

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

  const getInvoiceCode = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/EmployeeSalaryPayment/get-invoice-code`,
        {
          headers: authHeaders,
        }
      );
      transactionCodeSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const getMonths = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/EmployeeSalaryPayment/get-months`,
        {
          headers: authHeaders,
        }
      );
      mothsSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };
  const getYears = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/EmployeeSalaryPayment/get-years`,
        {
          headers: authHeaders,
        }
      );
      yearsSet(response.data);
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
        params: {
          AccountType: cashBankAccountFilterTypes,
        },
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

  const handleDateChange = (date) => {
    selectedCreatedDateSet(date);
  };

  const addToCart = () => {
    if (selectedEmployee == null) {
      Swal.fire({
        title: "Select Employee",
        icon: "warning",
      });
    } else if (selectedAccount == null) {
      Swal.fire({
        title: "Select Acount",
        icon: "warning",
      });
    } else if (selectedMonth == null) {
      Swal.fire({
        title: "Select Month",
        icon: "warning",
      });
    } else if (amount < 1) {
      Swal.fire({
        title: "Invalid Amount",
        icon: "warning",
      });
    } else {
      const cartItem = {
        //for post
        employeeId: selectedEmployee.id,
        accountId: selectedAccount.id,
        month: selectedMonth.month,
        year: selectedYear,
        amount: amount,
        //for show to cart
        employeeName: selectedEmployee.name,
        accountName: selectedAccount.name,
      };

      let checkExists = cartData.findIndex((ele) => {
        if (ele.employeeId == selectedEmployee.id) {
          return true;
        } else {
          return false;
        }
      });
      if (checkExists > -1 && cartIndex != null) {
        let preCopy = [...cartData];
        preCopy[cartIndex] = cartItem;
        setCartData(preCopy);
      } else {
        setCartData([...cartData, cartItem]);
      }

      resetCart();
    }
  };

  useEffect(() => {
    const payAmount = cartData.reduce((prev, curr) => {
      return prev + parseFloat(curr.amount);
    }, 0);
    payAmountSet(payAmount);
  }, [cartData]);

  const postEmployeeSalaryPayment = async () => {
    if (selectedCreatedDate === null) {
      Swal.fire({
        title: "Invalid Date",
        icon: "warning",
      });
      return false;
    } else if (transactionCode.trim() === "") {
      Swal.fire({
        title: "Transaction code is Required.",
        icon: "warning",
      });
    } else if (cartData.length == 0) {
      Swal.fire({
        title: "Employee Payment Details Cart is Empty.",
        icon: "warning",
      });
    } else {
      isSavingSet(true);

      const postData = {
        employeePayment: {
          createdDate: selectedCreatedDate.format(dateFormat),
          transactionCode: transactionCode,
          payAmount: parseFloat(payAmount),
          note,
        },
        employeeSalaryPaymentDetails: cartData.map((item) => ({
          employeeId: item.employeeId,
          accountId: item.accountId,
          amount: parseFloat(item.amount),
          month: item.month,
          year: item.year,
        })),
      };

      try {
        let response;

        if (action == "post") {
          response = await axios.post(
            `${API_URL}api/EmployeeSalaryPayment`,
            postData,
            {
              headers: authHeaders,
            }
          );
        }

        if (action == "put") {
          response = await axios.put(
            `${API_URL}api/EmployeeSalaryPayment/${id}`,
            postData,
            {
              headers: authHeaders,
            }
          );
        }

        // After Api Response
        if (action === "post") {
          Swal.fire({
            title: `Payment ${
              action == "post" ? "Create" : "update"
            } Successfully. Do you want to view the invoice?`,

            icon: "success",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonText: "No",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(`/payroll/employee-payment-invoice/${response.data.id}`);
            } else {
              resetForm();
              getInvoiceCode();
              setCartData([]);
              getEmployeeSalaryPayment();
            }
          });
        } else {
          Swal.fire({
            title: `Payment is update Successfully. Do you want to view the invoice?`,

            icon: "success",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonText: "No",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(`/payroll/employee-payment-invoice/${response.data.id}`);
            } else {
              resetForm();
              getInvoiceCode();
              setCartData([]);
              getEmployeeSalaryPayment();
            }
          });
        }
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
            `${API_URL}api/EmployeeSalaryPayment/${row.id}`,
            { headers: authHeaders },
            { id: row.id }
          );
          Swal.fire({
            icon: "success",
            title: `${response.data.transactionCode} is deleted Successfully`,
          });
          resetForm();
          getEmployeeSalaryPayment();
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

  useEffect(() => {
    const getCurrentMonth = () => {
      if (months.length <= 0) {
        return false;
      }

      const date = new Date();
      const currentMonth = date.toLocaleString("default", { month: "long" });

      const foundMonthObj = months.find(
        (monthItem) => monthItem.month === currentMonth
      );

      selectedMonthSet(foundMonthObj);
    };

    getCurrentMonth();
  }, [months]);

  useEffect(() => {
    const getCurrentYear = () => {
      const year = new Date().getFullYear().toString();
      selectedYearSet(year);
    };
    getCurrentYear();
  }, []);

  // End CRUD Operations

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (e.target === employeeRef.current) {
        accountRef.current.focus();
      } else if (e.target === accountRef.current) {
        yearRef.current.focus();
      } else if (e.target === yearRef.current) {
        monthRef.current.focus();
      } else if (e.target === monthRef.current) {
        amountRef.current.focus();
      } else if (e.target === amountRef.current) {
        addToCart();
      } else if (e.target === transactionCodeRef.current) {
        entryDateRef.current.focus();
      } else if (e.target === entryDateRef.current) {
        noteRef.current.focus();
      }
      if (e.target === noteRef.current) {
        postEmployeeSalaryPayment();
      }
    }
  };

  // ---------------------------------------------------
  const transactionCodeRef = useRef(null);
  const employeeRef = useRef(null);
  const accountRef = useRef(null);
  const monthRef = useRef(null);
  const amountRef = useRef(null);
  const entryDateRef = useRef(null);
  const noteRef = useRef(null);
  const yearRef = useRef(null);

  return (
    <>
      <Paper className="m-3 p-3">
        <Typography
          variant="h6"
          className="MuiTypography-h6 mb-3"
          style={{ marginBottom: "8px" }}
        >
          EMPLOYEEE SALARY PAYMENT ENTRY
        </Typography>

        <Grid
          container
          spacing={3}
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Grid item xs={12} sm={3}>
            <Grid item xs={12} sm={12} style={{ marginBottom: "10px" }}>
              <Autocomplete
                autoHighlight={true}
                openOnFocus={true}
                size="small"
                id="combo-box-employee"
                options={employes}
                onKeyDown={handleKeyPress}
                value={selectedEmployee}
                onChange={(e, value) => {
                  selectedEmployeeSet(value);
                }}
                getOptionLabel={(option) => option.name}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    inputRef={employeeRef}
                    {...params}
                    label="SELECT EMPLOYEE"
                  />
                )}
              />
            </Grid>

            {/* ACCOUONT ID selection */}
            <Grid item xs={12} sm={12} style={{ marginBottom: "10px" }}>
              <Autocomplete
                autoHighlight={true}
                openOnFocus={true}
                size="small"
                id="combo-box-account"
                options={accounts}
                value={selectedAccount}
                onKeyDown={handleKeyPress}
                onChange={(e, value) => {
                  selectedAccountSet(value);
                }}
                getOptionLabel={(option) => option.name}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    inputRef={accountRef}
                    {...params}
                    label="SELECT ACCOUNT"
                  />
                )}
              />
            </Grid>
            {/* years ID selection */}
            <Grid item xs={12} sm={12} style={{ marginBottom: "10px" }}>
              <Autocomplete
                autoHighlight={true}
                openOnFocus={true}
                size="small"
                id="combo-box-years"
                options={years}
                value={selectedYear}
                onKeyDown={handleKeyPress}
                onChange={(e, value) => {
                  selectedYearSet(value);
                }}
                // getOptionLabel={(option) => option.month}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    inputRef={yearRef}
                    {...params}
                    label="SELECT YEAR"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} style={{ marginBottom: "10px" }}>
              <Autocomplete
                autoHighlight={true}
                openOnFocus={true}
                size="small"
                id="combo-box-months"
                options={months}
                value={selectedMonth}
                onKeyDown={handleKeyPress}
                onChange={(e, value) => {
                  selectedMonthSet(value);
                }}
                getOptionLabel={(option) => option.month}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    inputRef={monthRef}
                    {...params}
                    label="SELECT MONTH"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} style={{ marginBottom: "10px" }}>
              <TextField
                style={{ width: "100%" }}
                label="AMOUNT"
                name="amount"
                autoComplete="off"
                size="small"
                inputRef={amountRef}
                onFocus={() => amountRef.current.select()}
                onKeyDown={handleKeyPress}
                value={amount}
                type="number"
                onChange={(e) => {
                  amountSet(e.target.value);
                }}
              />
            </Grid>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                //   style={{ margin: "15px", color: "blue" }}
                loading={isSaving}
                onClick={() => addToCart()}
              >
                {cartIndex !== null ? "CART UPDATE" : "ADD TO CART"}
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={9}>
            <Grid container>
              <Grid
                item
                xs={12}
                sm={3}
                style={{ marginTop: "-8px", marginRight: "10px" }}
              >
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
                        label="Entry Date"
                        value={selectedCreatedDate}
                        onChange={handleDateChange}
                        format={dateFormat}
                        onKeyDown={handleKeyPress}
                        slotProps={{ field: { size: "small" } }}
                        renderInput={(params) => (
                          <TextField inputRef={entryDateRef} {...params} />
                        )}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={3} sm={2} style={{ marginRight: "8px" }}>
                <TextField
                  label="TRANSACTION CODE"
                  name="transactionCode"
                  autoComplete="off"
                  size="small"
                  fullWidth
                  inputRef={transactionCodeRef}
                  onKeyDown={handleKeyPress}
                  value={transactionCode}
                  onChange={(e) => {
                    transactionCodeSet(e.target.value);
                  }}
                />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12} sm={12}>
                {cartData.length > 0 && (
                  <TableContainer>
                    <Table size="small" aria-label="a dense table">
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ width: "5%" }}>SL</TableCell>
                          <TableCell align="left" style={{ width: "35%" }}>
                            EMPLOYEE NAME
                          </TableCell>
                          <TableCell align="left" style={{ width: "35%" }}>
                            ACCOUNT NAME
                          </TableCell>
                          <TableCell align="left" style={{ width: "35%" }}>
                            YEAR
                          </TableCell>
                          <TableCell align="left" style={{ width: "35%" }}>
                            MONTH
                          </TableCell>
                          <TableCell align="right" style={{ width: "10%" }}>
                            Amount
                          </TableCell>
                          <TableCell align="right" style={{ width: "10%" }}>
                            Update
                          </TableCell>
                          <TableCell align="right" style={{ width: "10%" }}>
                            Delete
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {cartData.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell
                              style={{ width: "5%" }}
                              component="th"
                              scope="row"
                            >
                              {index + parseFloat(1)}
                            </TableCell>
                            <TableCell align="left">
                              {row.employeeName}
                            </TableCell>
                            <TableCell align="left">
                              {row.accountName}
                            </TableCell>
                            <TableCell align="left">{row.year}</TableCell>
                            <TableCell align="left">{row.month}</TableCell>
                            <TableCell align="right">
                              {amountFormat(parseFloat(row.amount).toFixed(2))}
                            </TableCell>
                            <TableCell align="right">
                              <EditNoteIcon
                                style={{
                                  color: "green",
                                  cursor: "pointer",
                                  display: isSaving ? "none" : "block",
                                }}
                                onClick={() => cartUpdate(row, index)}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <DeleteForeverIcon
                                style={{
                                  color: "red",
                                  cursor: "pointer",
                                  display: isSaving ? "none" : "block",
                                }}
                                onClick={() => cartDelete(index)}
                              />
                            </TableCell>
                          </TableRow>
                        ))}

                        <TableRow>
                          <TableCell
                            colSpan={5}
                            align="right"
                            style={{ fontWeight: "bold" }}
                          >
                            pay :
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{ fontWeight: "bold" }}
                          >
                            {amountFormat(parseFloat(payAmount).toFixed(2))}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                <Grid item xs={12} style={{ marginTop: "10px" }} md={6} sm={4}>
                  <Textarea
                    style={{ width: "100%" }}
                    // color="primary"
                    minRows={2}
                    placeholder="Note…"
                    variant="outlined"
                    inputRef={noteRef}
                    onKeyDown={handleKeyPress}
                    value={note}
                    onChange={(e) => {
                      noteSet(e.target.value);
                    }}
                  />
                </Grid>

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    style={{
                      margin: "15px",
                      color: "green",
                      border: "1px solid green",
                    }}
                    size="sm"
                    onClick={() => postEmployeeSalaryPayment()}
                  >
                    {action == "post" ? "SAVE" : "UPDATE"}
                  </Button>
                  <Button
                    variant="outlined"
                    style={{
                      margin: "15px",
                      color: "red",
                      border: "1px solid red",
                    }}
                    size="sm"
                    onClick={() => resetForm()}
                  >
                    RESET
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Grid>

          {/* Table  */}
        </Grid>
      </Paper>

      <Paper className="m-3">
        <Typography
          variant="h6"
          className="MuiTypography-h6 m-3"
          style={{ padding: "10px" }}
        >
          EMPLOYEEE SALARY PAYMENT LIST
        </Typography>
        <MaterialReactTable table={table} />
      </Paper>
    </>
  );
};

export default selectedEmployeeSalaryPayment;
