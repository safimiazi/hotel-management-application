import React, { useState, useEffect, useRef, useCallback } from "react";
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

const GuestPaymentReceipt = () => {
  const guestRef = useState(null);
  const accountRef = useState(null);
  const bookingRef = useState(null);
  const amountRef = useState(null);
  const transactionCodeRef = useState(null);
  const dateRef = useRef(null);
  const noteRef = useRef(null);
  const [totalRecordCount, totalRecordCountSet] = useState(0);
  const [pagination, paginationSet] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [guestPaymentReceipt, guestPaymentReceiptSet] = useState([]);
  const [SearchTerm, SearchTermSet] = useState("");

  //get data
  const [accounts, accountsSet] = useState([]);
  const [guests, guestsSet] = useState([]);
  const [booking, bookingSet] = useState([]);

  // selected data
  const [selectedDate, selectedDateSet] = useState(dayjs());
  const [transactionCode, transactionCodeSet] = useState("");
  const [totalAmount, totalAmountSet] = useState(0);
  const [note, noteSet] = useState("");

  const [selectedGuest, selectedGuestSet] = useState(null);
  const [selectedAccount, selectedAccountSet] = useState(null);
  const [selectedBooking, selectedBookingSet] = useState(null);
  const [amount, amountSet] = useState(0);

  const [id, idSet] = useState(null);
  const [isSaving, isSavingSet] = useState(false);
  const [action, actionSet] = useState("post");
  const [cartIndex, cartIndexSet] = useState(null);
  const navigate = useNavigate();
  //cart data:
  const [cartData, setCartData] = useState([]);

  //for pagination:

  const [tablesearchTerm, tableSearchTermSet] = useState("");

  //   post expenseDetails data:

  const columns = [
    {
      header: "ACTIONS",
      size: 100,
      Cell: ({ row }) => (
        <div className="flex items-center justify-around">
          <Link
            to={{
              pathname: `/accounts/guest-payment-receipt-invoice/${row.original.id}`,
            }}
          >
            <ReceiptIcon
              style={{
                color: "blue",
                cursor: "pointer",
              }}
            />
          </Link>
          <EditNoteIcon
            style={{
              color: "green",
              cursor: "pointer",
              display: isSaving ? "none" : "block",
            }}
            onClick={() => handleUpdate(row.original)}
          />
          <DeleteForeverIcon
            style={{
              color: "red",
              cursor: "pointer",
              display: isSaving ? "none" : "block",
            }}
            onClick={() => handleDelete(row.original)}
          />
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
      header: "DETAILS",
      size: 35,
      Cell: ({ row }) => (
        <>
          {row.original.guestPaymentReceiptDetails.map((detail) => (
            <>
              {detail.account.name} - ({detail.booking.bookingNo}) -{" "}
              {amountFormat(parseFloat(detail.amount).toFixed(2))} <br />
            </>
          ))}
        </>
      ),
    },
    {
      header: "GUEST NAME",
      size: 35,
      Cell: ({ row }) => <>{row.original?.guest.name}</>,
    },
    {
      header: "Pay AMOUNT",
      size: 20,
      Cell: ({ row }) => (
        <>{amountFormat(parseFloat(row.original?.payAmount).toFixed(2))}</>
      ),
    },

    // {
    //   accessorKey: "note",
    //   header: "NOTE",
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
    let data = guestPaymentReceipt;
    if (data.length === 0) return false;

    const csv = generateCsv(csvConfig)(
      data.map((row) => {
        const detailsString = row.guestPaymentReceiptDetails
          .map(
            (detail) =>
              `${detail.account.name} - (${
                detail.booking.bookingNo
              }) - ${amountFormat(parseFloat(detail.amount).toFixed(2))}`
          )
          .join("\n");

        return {
          name: row.transactionCode,
          entryDate: row.createdDate,
          payAmount: row.payAmount,
          details: detailsString,
          // note: row.note,
          creator: row.creator?.userName,
          updater: row.updater?.userName,
        };
      })
    );

    download(csvConfig)(csv);
  };

  const resetForm = () => {
    actionSet("post");
    selectedDateSet(dayjs());
    noteSet("");
    guestsSet([]);

    resetCart();
    setCartData([]);
    selectedGuestSet(null);
  };

  const resetCart = () => {
    cartIndexSet(null);
    selectedAccountSet(null);
    selectedBookingSet(null);
    amountSet(0);
  };

  const handleUpdate = (row) => {
    console.log("mohi", row);
    idSet(row?.id);
    actionSet("put");
    const parsedDate = dayjs(row.createdDate);
    selectedDateSet(parsedDate.isValid() ? parsedDate : null);
    noteSet(row.note);
    transactionCodeSet(row.transactionCode);
    row.guest.displayText = row.guest.name;
    selectedGuestSet(row.guest);

    const updatedCartData = row.guestPaymentReceiptDetails.map((item) => ({
      accountId: item.account.id,
      bookingId: item.booking.id,
      amount: item.amount,
      account: item.account.name,
      bookingNo: item.booking.bookingNo,
    }));
    setCartData(updatedCartData);
  };

  const cartUpdate = (row, index) => {
    cartIndexSet(index);
    selectedAccountSet({ id: row.accountId, name: row.account });
    selectedBookingSet({ id: row.bookingId, bookingNo: row.bookingNo });
    amountSet(row.amount);
  };

  const cartDelete = (index) => {
    const deletedItem = cartData.filter((item, inx) => inx !== index);
    setCartData(deletedItem);
  };

  // table end

  useEffect(() => {
    getAccounts();
    getBooking();
    getInvoiceCode();
  }, []);
  useEffect(() => {
    getGuestPaymentReceipt();
  }, [pagination.pageIndex, pagination.pageSize, tablesearchTerm]);
  const [loading, loadingSet] = useState(false);

  const getGuestPaymentReceipt = async () => {
    try {
      loadingSet(true);
      const response = await axios.get(`${API_URL}api/v1/GuestPaymentReceipt`, {
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
      guestPaymentReceiptSet(response.data.records);
      totalRecordCountSet(response.data.totalRecordCount);
      loadingSet(false);
    } catch (error) {
      console.log("errr", error);
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
    data: guestPaymentReceipt,
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

  const getInvoiceCode = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/GuestPaymentReceipt/get-invoice-code`,
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
  const getBooking = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/Booking`, {
        headers: authHeaders,
      });
      bookingSet(response.data);
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
    const timer = setTimeout(() => {
      if (SearchTerm) {
        getGuests(SearchTerm);
      } else {
        guestsSet([]);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [SearchTerm]);
  const [selectorSearchLoading, selectorSearchLoadingSet] = useState(false);

  const getGuests = async (term) => {
    const removePluses = (input) => {
      return input.trim();
    };

    // Example usage
    const cleanedInput = removePluses(term);

    if (term.trim() === "") {
      return false;
    }

    try {
      selectorSearchLoadingSet(true);
      const response = await axios.get(`${API_URL}api/v1/Guest`, {
        headers: authHeaders,
        params: {
          SearchTerm: cleanedInput?.trim() !== "" ? cleanedInput : null,
        },
      });
      guestsSet(response.data.records);
      selectorSearchLoadingSet(false);
    } catch (error) {
      console.log("err", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to load data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDateChange = (date) => {
    selectedDateSet(date);
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
    } else if (selectedBooking == null) {
      Swal.fire({
        title: "Select Book",
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
        bookingId: selectedBooking.id,
        amount: parseFloat(amount),
        account: selectedAccount.name,
        bookingNo: selectedBooking.bookingNo,
      };

      let checkExists = cartData.findIndex((el) => {
        if (el.accountId === selectedAccount.id) {
          return true;
        } else {
          return false;
        }
      });

      if (checkExists > -1 && cartIndex != null) {
        let preCopy = [...cartData];
        preCopy[cartIndex] = cartItem;
        setCartData(preCopy);
      } else setCartData([...cartData, cartItem]);

      resetCart();
    }
  };

  useEffect(() => {
    const totalAmount = cartData.reduce((prev, curr) => {
      return prev + parseFloat(curr.amount);
    }, 0);
    totalAmountSet(totalAmount);
  }, [cartData]);

  const postGuestPaymentReceipt = async () => {
    if (selectedDate === null) {
      Swal.fire({
        title: "Invalid Date",
        icon: "warning",
      });
      return false;
    } else if (selectedGuest === null) {
      Swal.fire({
        title: "Please Select Guest.",
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
        title: "Payment Details Cart is Empty.",
        icon: "warning",
      });
    } else {
      isSavingSet(true);

      const postData = {
        guestPaymentReceipt: {
          createdDate: selectedDate.format(dateFormat),
          transactionCode: transactionCode,
          payAmount: totalAmount,
          guestId: selectedGuest.id,
          note: note,
        },
        guestPaymentReceiptDetails: cartData.map((singleCartItem) => ({
          accountId: singleCartItem.accountId,
          bookingId: singleCartItem.bookingId,
          amount: singleCartItem.amount,
        })),
      };

      try {
        let response;

        if (action == "post") {
          response = await axios.post(
            `${API_URL}api/v1/GuestPaymentReceipt`,
            postData,
            {
              headers: authHeaders,
            }
          );
        }

        if (action == "put") {
          response = await axios.put(
            `${API_URL}api/v1/GuestPaymentReceipt/${id}`,
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
                `/accounts/guest-payment-receipt-invoice/${response.data.id}`
              );
            } else {
              resetForm();
              getInvoiceCode();
              setCartData([]);
              getGuestPaymentReceipt();
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
                `/accounts/guest-payment-receipt-invoice/${response.data.id}`
              );
            } else {
              resetForm();
              getInvoiceCode();
              setCartData([]);
              getGuestPaymentReceipt();
            }
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: `${error}`,
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
            `${API_URL}api/v1/GuestPaymentReceipt/${row.id}`,
            { headers: authHeaders },
            { id: row.id }
          );
          Swal.fire({
            icon: "success",
            title: `${response.data.transactionCode} is deleted Successfully`,
          });
          resetForm();
          getGuestPaymentReceipt();
          getInvoiceCode();
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
      if (e.target === accountRef.current) {
        bookingRef.current.focus();
      } else if (e.target === bookingRef.current) {
        amountRef.current.focus();
      } else if (e.target === amountRef.current) {
        addToCart();
      }
      if (e.target === guestRef.current) {
        dateRef.current.focus();
      } else if (e.target === dateRef.current) {
        transactionCodeRef.current.focus();
      } else if (e.target === transactionCodeRef.current) {
        // noteRef.current.focus();
      } else if (e.target === noteRef.current) {
        postGuestPaymentReceipt();
      }
    }
  };

  // ---------------------------------------------------

  return (
    <>
      <Paper className="m-3 p-3">
        <Typography
          variant="h6"
          className="MuiTypography-h6 mb-3"
          style={{ marginBottom: "8px" }}
        >
          GUEST PEYMENT RECEIPT ENTRY
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
                    inputRef={accountRef}
                    {...params}
                    label="SELECT ACCOUNT"
                  />
                )}
              />
            </Grid>

            {/* booking ID selection */}
            <Grid item xs={12} sm={12} style={{ marginBottom: "10px" }}>
              <Autocomplete
                autoHighlight={true}
                openOnFocus={true}
                size="small"
                id="combo-box-booking"
                options={booking}
                value={selectedBooking}
                onKeyDown={handleKeyPress}
                onChange={(e, value) => {
                  selectedBookingSet(value);
                }}
                getOptionLabel={(option) => option.bookingNo}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    inputRef={bookingRef}
                    {...params}
                    label="SELECT BOOK"
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
              <Grid item xs={12} md={3} sm={2} style={{ marginRight: "8px" }}>
                <Autocomplete
                  autoHighlight={true}
                  openOnFocus={true}
                  size="small"
                  loading={selectorSearchLoading}
                  id="combo-box-guest"
                  noOptionsText="Please Search Guest"
                  options={guests}
                  onKeyDown={handleKeyPress}
                  value={selectedGuest}
                  onChange={(e, value) => {
                    selectedGuestSet(value);
                  }}
                  onInputChange={(e, value) => {
                    SearchTermSet(value);
                  }}
                  getOptionLabel={(option) => option.displayText}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      inputRef={guestRef}
                      label="SELECT GUEST"
                    />
                  )}
                />
              </Grid>
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
                        inputRef={dateRef}
                        label="Created Date"
                        value={selectedDate}
                        onChange={handleDateChange}
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

              <Grid item xs={12} md={2}>
                <TextField
                  style={{ width: "100%" }}
                  label="TOTAL AMOUNT"
                  name="totalamount"
                  autoComplete="off"
                  size="small"
                  type="number"
                  disabled
                  onKeyDown={handleKeyPress}
                  value={totalAmount}
                  onChange={(e) => {
                    totalAmountSet(e.target.value);
                  }}
                />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12} sm={12}>
                {cartData.length > 0 && (
                  <TableContainer style={{ marginTop: "10px" }}>
                    <Table size="small" aria-label="a dense table">
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ width: "5%" }}>SL</TableCell>

                          <TableCell align="left" style={{ width: "35%" }}>
                            ACCOUNT NAME
                          </TableCell>
                          <TableCell align="left" style={{ width: "35%" }}>
                            BOOKING NO
                          </TableCell>
                          <TableCell align="right" style={{ width: "10%" }}>
                            AMOUNT
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
                            <TableCell align="left">{row.account}</TableCell>
                            <TableCell align="left">{row.bookingNo}</TableCell>
                            <TableCell align="right">
                              {amountFormat(parseFloat(row.amount).toFixed(2))}
                            </TableCell>
                            <TableCell
                              style={{
                                display: "flex",
                                justifyContent: "right",
                                alignItems: "center",
                                gap: "10px",
                              }}
                              align="right"
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
                            colSpan={3}
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
                          <TableCell colSpan={1}></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                <Grid item xs={12} md={6} sm={4} style={{ marginTop: "10px" }}>
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
                    onClick={() => postGuestPaymentReceipt()}
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
          GUEST PEYMENT RECEIPT LIST
        </Typography>
        <MaterialReactTable table={table} />
      </Paper>
    </>
  );
};

export default GuestPaymentReceipt;
