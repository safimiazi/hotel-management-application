import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReceiptIcon from "@mui/icons-material/Receipt";

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

import dayjs from "dayjs";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Link, useNavigate } from "react-router-dom";
import { Textarea } from "@mui/joy";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const CustomerTransaction = () => {
  const [totalRecordCount, totalRecordCountSet] = useState(0);

  const [pagination, paginationSet] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [tablesearchTerm, tableSearchTermSet] = useState("");

  //get data
  const [customerTransationData, customerTransationDataSet] = useState([]);
  const [accounts, accountsSet] = useState([]);
  const [transactionTypes, transactionTypesSet] = useState([]);
  const [customers, customersSet] = useState([]);
  const [selectedDate, selectedDateSet] = useState(dayjs());
  const navigate = useNavigate();

  //post data
  const [transactionCode, transactionCodeSet] = useState("");
  const [selectedTransactionType, selectedTransactionTypeSet] = useState({
    transactionType: "Receive",
  });
  const [selectedCustomer, selectedCustomerSet] = useState(null);
  const [paymentAmount, paymentAmountSet] = useState(0);
  const [note, noteSet] = useState("");
  const [cartData, setCartData] = useState([]);

  const [totalAmount, totalAmountSet] = useState(0);
  const [selectedAccount, selectedAccountSet] = useState(null);
  const [amount, amountSet] = useState(0);

  const [id, idSet] = useState(null);
  const [isSaving, isSavingSet] = useState(false);
  const [action, actionSet] = useState("post");
  const [cartIndex, cartIndexSet] = useState(null);

  //cart data:

  //   post expenseDetails data:

  const columns = [
    {
      header: "ACTIONS",
      size: 100,
      Cell: ({ row }) => (
        <div className="flex gap-3 items-center justify-around">
          <Link
            to={{
              pathname: `/accounts/customer-transaction-invoice/${row.original.id}`,
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
      header: "TRANS CODE",
      size: 50,
    },
    {
      accessorKey: "createdDate",
      header: "CREATED DATE",
      size: 50,
      Cell: ({ row }) => (
        <>{dayjs(row.original.createdDate).format(dateFormat)}</>
      ),
    },
    {
      accessorKey: "transactionType",
      header: "TRANS TYPE",
      size: 50,
    },

    {
      accessor: "s",
      header: "CUSTOMER NAME",
      size: 35,
      Cell: ({ row }) => <>{row.original.customer.name}</>,
    },
    {
      accessor: "s",
      header: "CUSTOMER ADDRESS",
      size: 35,
      Cell: ({ row }) => <>{row.original.customer.address}</>,
    },
    {
      accessor: "s",
      header: "ACCOUNT NAME",
      size: 35,
      Cell: ({ row }) => (
        <>
          {row.original.customerTransactionDetails.map((item, inx) => (
            <div>{item.account.name}</div>
          ))}
        </>
      ),
    },
    // {
    //   accessor: "s",
    //   header: "AMOUNT",
    //   size: 35,
    //   Cell: ({ row }) => (
    //     <>
    //    {row.original.supplierTransactionDetails.map((item, inx)=> <div>{item.amount}</div>)}
    //     </>
    //   ),
    // },

    // {
    //   accessorKey: "NOTE",
    //   header: "Note",
    //   size: 10,
    // },
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
    let data = customerTransationData;
    if (data.length == 0) return false;
    const csv = generateCsv(csvConfig)(
      data.map((row) => {
        return {
          transactionCode: row.transactionCode,
          createdDate: `${dayjs(row.createdDate).format(dateFormat)}`,
          transactionType: row.transactionType,
          customerName: row.customer.name,
          customerAddress: row.customer.address,
          accountName: `${row.customerTransactionDetails.map(
            (item) => item?.account.name
          )}`,

          creator: row.creator?.userName,
          updater: row.updater?.userName,
        };
      })
    );
    download(csvConfig)(csv);
  };

  const resetForm = () => {
    actionSet("post");
    noteSet("");
    selectedTransactionTypeSet(null);
    selectedCustomerSet(null);
    paymentAmountSet(0);
    noteSet("");
    resetCart();
    selectedDateSet(dayjs());
    setCartData([]);
  };

  const resetCart = () => {
    selectedAccountSet(null);
    amountSet("");
    cartIndexSet(null);
  };

  const handleUpdate = (row) => {
    idSet(row?.id);
    actionSet("put");
    const parsedDate = dayjs(row.createdDate);
    selectedDateSet(parsedDate.isValid() ? parsedDate : null);
    noteSet(row.note);
    selectedCustomerSet(row.customer);
    selectedTransactionTypeSet({ transactionType: row.transactionType });
    transactionCodeSet(row.transactionCode);
    paymentAmountSet(row.payAmount);

    const updatedCartData = row.customerTransactionDetails.map((item) => ({
      accountId: item.account.id,
      amount: item.amount,
      accountName: item.account.name,
    }));
    setCartData(updatedCartData);
  };

  const cartUpdate = (row, index) => {
    cartIndexSet(index);
    selectedAccountSet({ id: row.accountId, name: row.accountName });
    amountSet(row.amount);
  };

  const cartDelete = (index) => {
    const deletedItem = cartData.filter((item, inx) => inx !== index);
    setCartData(deletedItem);
    resetCart();
  };

  // table end

  useEffect(() => {
    getAccounts();
    getInvoiceCode();
    getTransactionType();
    getCustomers();
  }, []);

  const getInvoiceCode = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/CustomerTransation/get-invoice-code`,
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

  const getCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/Customer`, {
        headers: authHeaders,
      });
      customersSet(response.data);
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
    getCustomerTransationData();
  }, [pagination.pageIndex, pagination.pageSize, tablesearchTerm]);
  const [loading, loadingSet] = useState(false);

  const getCustomerTransationData = async () => {
    try {
      loadingSet(true);
      const response = await axios.get(`${API_URL}api/v1/CustomerTransation`, {
        headers: authHeaders,
        params: {
          SearchTerm:
            tablesearchTerm !== undefined && tablesearchTerm.trim() !== ""
              ? tablesearchTerm
              : null,
          PageSize: pagination.pageSize,
          PageNumber: pagination.pageIndex,
        },
      });
      customerTransationDataSet(response.data.records);
      totalRecordCountSet(response.data.totalRecordCount);
      loadingSet(false);
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
    data: customerTransationData,
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    manualPagination: true,
    onGlobalFilterChange: tableSearchTermSet,
    rowCount: Math.ceil(totalRecordCount / pagination.pageSize),
    pageCount: Math.ceil(totalRecordCount / pagination.pageSize),
    state: { pagination, isLoading: loading },
    onPaginationChange: paginationSet,
    muiPaginationProps: {
      showRowsPerPage: true,
      shape: "rounded",
    },

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

  const getTransactionType = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/CustomerTransation/get-transaction-types`,
        {
          headers: authHeaders,
        }
      );
      transactionTypesSet(response.data);
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

  const addToCart = () => {
    if (selectedAccount == null) {
      Swal.fire({
        title: "Select Acount",
        icon: "warning",
      });
    } else if (amount == "" && amount < 1) {
      Swal.fire({
        title: "Invalid Amount",
        icon: "warning",
      });
    } else {
      const cartItem = {
        accountId: selectedAccount.id,
        amount: amount,
        accountName: selectedAccount.name,
      };

      if (cartIndex != null) {
        let preCopy = [...cartData];
        preCopy[cartIndex] = {
          accountId: selectedAccount.id,
          amount: amount,
          accountName: selectedAccount.name,
        };
        setCartData(preCopy);
      } else {
        setCartData([...cartData, cartItem]);
      }

      resetCart();
    }
  };

  useEffect(() => {
    const totalAmount = cartData.reduce((prev, curr) => {
      return prev + parseFloat(curr.amount);
    }, 0);
    totalAmountSet(totalAmount);
    paymentAmountSet(totalAmount);
  }, [cartData]);

  const postCustomerTransaction = async () => {
    if (transactionCode.trim() === "") {
      Swal.fire({
        title: "Transaction code is Required.",
        icon: "warning",
      });
    } else if (selectedCustomer == null) {
      Swal.fire({
        title: "Please Select Customer.",
        icon: "warning",
      });
      return false;
    } else if (selectedTransactionType == null) {
      Swal.fire({
        title: "Please Select Transaction Type.",
        icon: "warning",
      });
      return false;
    } else if (cartData.length == 0) {
      Swal.fire({
        title: "Account Details Cart  is Empty.",
        icon: "warning",
      });
    } else {
      isSavingSet(true);

      const postData = {
        customerTransaction: {
          createdDate: selectedDate.format(dateFormat),
          transactionCode: transactionCode,
          transactionType:
            selectedTransactionType != null
              ? selectedTransactionType.transactionType
              : null,
          customerId: selectedCustomer.id,
          payAmount: parseFloat(paymentAmount),
          note: note,
        },
        customerTransactionDetail: cartData.map((item, inx) => ({
          accountId: item.accountId,
          amount: parseFloat(item.amount),
        })),
      };

      try {
        let response;

        if (action == "post") {
          response = await axios.post(
            `${API_URL}api/v1/CustomerTransation`,
            postData,
            {
              headers: authHeaders,
            }
          );
        }

        if (action == "put") {
          response = await axios.put(
            `${API_URL}api/v1/CustomerTransation/${id}`,
            postData,
            {
              headers: authHeaders,
            }
          );
        }

        // After Api Response
        if (action === "post") {
          Swal.fire({
            title: `${response.data.transactionCode} is ${
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
              navigate(
                `/accounts/customer-transaction-invoice/${response.data.id}`
              );
            } else {
              resetForm();
              getInvoiceCode();
              setCartData([]);
              getCustomerTransationData();
            }
          });
        } else {
          Swal.fire({
            title: `${response.data.transactionCode} is update Successfully. Do you want to view the invoice?`,

            icon: "success",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonText: "No",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(
                `/accounts/customer-transaction-invoice/${response.data.id}`
              );
            } else {
              resetForm();
              getInvoiceCode();
              setCartData([]);
              getCustomerTransationData();
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
            `${API_URL}api/v1/CustomerTransation/${row.id}`,
            { headers: authHeaders },
            { id: row.id }
          );
          Swal.fire({
            icon: "success",
            title: `${response.data.transactionCode} is deleted Successfully`,
          });
          resetForm();
          getCustomerTransationData();
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

  // ---------------------------------------------------
  const transactionCodeRef = useRef(null);
  const noteRef = useRef(null);
  const amountRef = useRef(null);
  const accountRef = useRef(null);
  const paymentAmountRef = useRef(null);
  const transactionTypeRef = useRef(null);
  const customerRef = useRef(null);
  const dateRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      switch (e.target) {
        case accountRef.current:
          amountRef.current.focus();
          break;
        case amountRef.current:
          addToCart();
          break;
        case dateRef.current:
          customerRef.current.focus();
          break;
        case customerRef.current:
          transactionTypeRef.current.focus();
          break;
        case transactionTypeRef.current:
          transactionCodeRef.current.focus();
          break;
        case transactionCodeRef.current:
          // noteRef.current.focus();
          break;
        case noteRef.current:
          postCustomerTransaction();
          break;
        default:
          break;
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
          CUSTOMER TRANSACTION ENTRY
        </Typography>

        <Grid
          container
          spacing={3}
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Grid item xs={12} sm={3}>
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
                    {...params}
                    inputRef={accountRef}
                    label="SELECT ACCOUNT"
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
            <Grid container gap={2}>
              <Grid item xs={12} md={3} sm={12} className="plus-link-div">
                <Link to="/sales/customer-entry" className="plus-link">
                  +
                </Link>
                <Autocomplete
                  autoHighlight={true}
                  openOnFocus={true}
                  size="small"
                  id="combo-box-customer"
                  options={customers}
                  value={selectedCustomer}
                  onKeyDown={handleKeyPress}
                  onChange={(e, value) => {
                    selectedCustomerSet(value);
                  }}
                  getOptionLabel={(option) => option.name}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      inputRef={customerRef}
                      {...params}
                      label="SELECT CUSTOMER"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={3} sm={12}>
                <Autocomplete
                  autoHighlight={true}
                  openOnFocus={true}
                  size="small"
                  id="combo-box-transType"
                  options={transactionTypes}
                  value={selectedTransactionType}
                  onKeyDown={handleKeyPress}
                  onChange={(e, value) => {
                    selectedTransactionTypeSet(value);
                  }}
                  getOptionLabel={(option) => option.transactionType}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      inputRef={transactionTypeRef}
                      label="SELECT TRANSACTION TYPE"
                    />
                  )}
                />
              </Grid>

              <Grid item style={{ marginTop: "-8px" }} md={3}>
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
                        inputRef={dateRef}
                        label="Created Date"
                        value={selectedDate}
                        onChange={(date) => selectedDateSet(date)}
                        format={dateFormat}
                        slotProps={{ field: { size: "small" } }}
                        renderInput={(params) => (
                          <TextField onKeyDown={handleKeyPress} {...params} />
                        )}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={2} sm={2}>
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

              {/* <Grid item xs={12} md={2} sm={4}>
                <TextField
                  style={{ width: "100%" }}
                  label="PAYMENT AMOUNT"
                  name="paymentAmount"
                  disabled
                  autoComplete="off"
                  size="small"
                  inputRef={paymentAmountRef}
                  onFocus={() => paymentAmountRef.current.select()}
                  type="number"
                  onKeyDown={handleKeyPress}
                  value={paymentAmount}
                  onChange={(e) => {
                    paymentAmountSet(e.target.value);
                  }}
                />
              </Grid> */}
            </Grid>

            <Grid container>
              <Grid item xs={12} style={{ marginTop: "10px" }} sm={12}>
                {cartData.length > 0 && (
                  <TableContainer>
                    <Table size="small" aria-label="a dense table">
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ width: "5%" }}>SL</TableCell>

                          <TableCell align="left" style={{ width: "35%" }}>
                            ACCOUNT NAME
                          </TableCell>
                          <TableCell align="right" style={{ width: "10%" }}>
                            Amount
                          </TableCell>
                          <TableCell align="right" style={{ width: "10%" }}>
                            ACTIONS
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
                              {row.accountName}
                            </TableCell>
                            <TableCell align="right">
                              {amountFormat(parseFloat(row.amount).toFixed(2))}
                            </TableCell>
                            <TableCell
                              align="right"
                              style={{
                                display: "flex",
                                justifyContent: "space-around",
                                gap: "5px",
                              }}
                            >
                              <EditNoteIcon
                                style={{
                                  color: "green",
                                  cursor: "pointer",
                                  display: isSaving ? "none" : "block",
                                }}
                                onClick={() => cartUpdate(row, index)}
                              />
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
                            colSpan={2}
                            align="right"
                            style={{ fontWeight: "bold" }}
                          >
                            Total :
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{ fontWeight: "bold" }}
                          >
                            {amountFormat(parseFloat(totalAmount).toFixed(2))}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                <Grid item xs={12} style={{ marginTop: "10px" }} md={6} sm={4}>
                  <Textarea
                    style={{ width: "100%" }}
                    color="primary"
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
                    onClick={() => postCustomerTransaction()}
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
          CUSTOMER TRANSACTION LIST
        </Typography>
        <MaterialReactTable table={table} />
      </Paper>
    </>
  );
};

export default CustomerTransaction;
