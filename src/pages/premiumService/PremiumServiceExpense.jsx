import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  amountFormat,
  authHeaders,
  cashBankAccountFilterTypes,
  dateFormat,
  pathSplitter,
} from "../../../utils";
import { API_URL, APP_URL } from "../../../config.json";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/joy/Button";
import Stack from "@mui/material/Stack";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import 'react-responsive-modal/styles.css';


import {
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Modal from "react-responsive-modal";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const PremiumServiceExpense = () => {
  const location = useLocation();
  //for get primiumServiceExpenseNames
  const [primiumServiceExpenseNames, primiumServiceExpenseNamesSet] = useState(
    []
  );
  //for add to cart
  const [
    selectedprimiumServiceExpenseName,
    selectedprimiumServiceExpenseNameset,
  ] = useState(null);
  const [qty, qtySet] = useState(0);
  const [cost, costSet] = useState(0);
  const [amount, amountSet] = useState(0);
  const [totalAmount, totalAmountSet] = useState(0);

  const [id, idSet] = useState(null);
  const [isSaving, isSavingSet] = useState(false);
  const [action, actionSet] = useState("post");

  const [cartData, cartDataSet] = useState([]);
  const [cartIndex, cartIndexSet] = useState(null);

  //get suplliers:
  const [suppliers, suppliersSet] = useState([]);
  //get accounts
  const [accounts, accountsSet] = useState([]);
  const [selectsupplier, selectsupplierset] = useState(null);
  const [invoiceCode, invoiceCodeSet] = useState("");
  const [taxAmount, taxAmountSet] = useState(0);
  const [othersCharge, othersChargeSet] = useState(0);
  const [discountAmount, discountAmountSet] = useState(0);
  const [subTotal, subTotalSet] = useState(0);
  const [sumTotalAmount, sumTotalAmountSet] = useState(0);
  const [paid, paidSet] = useState(0);
  const [due, dueSet] = useState(0);
  const [assignMaterialModal, assignMaterialModalSet] = useState(false);
  const [totalCartQty, totalCartQtySet] = useState(0);

  //for payment method modal
  const [paymentAmountValue, paymentAmountValueSet] = useState(0);
  const [selectedAccount, selectedAccountSet] = useState(null);
  const [invoiceTransactions, invoiceTransactionsSet] = useState([]);
  const [paymentIndex, paymentIndexSet] = useState(null);
  const [paymentTotalAmount, paymentTotalAmountSet] = useState([]);
  const [selectedDate, selectedDateSet] = useState(dayjs());
  const navigate = useNavigate();
  const handlePayment = () => {
    if (selectedAccount === null) {
      Swal.fire({
        title: "Please Select Account.",
        icon: "warning",
      });
    } else if (paymentAmountValue === 0) {
      Swal.fire({
        title: "Amount is Required.",
        icon: "warning",
      });
    } else {
      const transactionItem = {
        name: selectedAccount.name,
        payAccountId: selectedAccount.id,
        amount: paymentAmountValue,
      };

      if (paymentIndex != null) {
        let copyinvoiceTransactions = [...invoiceTransactions];
        copyinvoiceTransactions[paymentIndex] = {
          name: selectedAccount.name,
          payAccountId: selectedAccount.id,
          amount: paymentAmountValue,
        };

        invoiceTransactionsSet(copyinvoiceTransactions);
        paymentIndexSet(null);
      } else {
        invoiceTransactionsSet([...invoiceTransactions, transactionItem]);
        paymentIndexSet(null);
      }

      selectedAccountSet(null);
      paymentAmountValueSet(0);
    }
  };

  const handlePaymentEdit = (transactionItem, inx) => {
    paymentIndexSet(inx);
    selectedAccountSet({
      id: transactionItem.payAccountId,
      name: transactionItem.name,
    });
    paymentAmountValueSet(transactionItem.amount);
  };

  const handlePaymentDelete = (inx) => {
    const filteredItem = invoiceTransactions.filter(
      (item, index) => index != inx
    );
    invoiceTransactionsSet(filteredItem);
    paymentIndexSet(null);
  };

  useEffect(() => {
    const payTotalAmount = invoiceTransactions.reduce(
      (prev, item) => prev + parseFloat(item.amount),
      0
    );

    paymentTotalAmountSet(payTotalAmount);
    paidSet(payTotalAmount);
  }, [invoiceTransactions]);

  useEffect(() => {
    const totalDue = parseFloat(sumTotalAmount) - parseFloat(paid);
    dueSet(totalDue);
  }, [paid, sumTotalAmount]);

  useEffect(() => {
    const amount = parseFloat(qty) * parseFloat(cost);
    amountSet(amount);

    // Calculate totalAmount based on cartData
    const totalAmount = cartData.reduce(
      (prev, cartItem) => prev + cartItem.amount,
      0
    );
    totalAmountSet(totalAmount);
    const totalQuantity = cartData.reduce(
      (prev, cartItem) => prev + cartItem.qty,
      0
    );
    totalCartQtySet(totalQuantity);
    subTotalSet(totalAmount);
  }, [qty, cost, cartData]);

  useEffect(() => {
    const totalAmount =
      parseFloat(subTotal) +
      parseFloat(taxAmount) +
      parseFloat(othersCharge) -
      parseFloat(discountAmount);
    sumTotalAmountSet(totalAmount);
  }, [subTotal, taxAmount, othersCharge, discountAmount]);

  // add to cart function:
  const addToCart = () => {
    if (selectedprimiumServiceExpenseName === null) {
      Swal.fire({
        title: "Service Name is Required.",
        icon: "warning",
      });
    } else if (qty === 0) {
      Swal.fire({
        title: "Qty is Required.",
        icon: "warning",
      });
    } else {
      const cartItem = {
        name: selectedprimiumServiceExpenseName.name,
        expenseNameId: selectedprimiumServiceExpenseName.id,
        qty: qty,
        cost: cost,
        amount: amount,
      };

      if (cartIndex != null) {
        let cartDataCopy = [...cartData];
        cartDataCopy[cartIndex] = {
          name: selectedprimiumServiceExpenseName.name,
          expenseNameId: selectedprimiumServiceExpenseName.id,
          qty: qty,
          cost: cost,
          amount: amount,
        };
        cartDataSet(cartDataCopy);
        cartIndexSet(null);
      } else {
        cartDataSet([...cartData, cartItem]);
        cartIndexSet(null);
      }

      selectedprimiumServiceExpenseNameset(null);
      qtySet(0);
      costSet(0);
      amountSet(0);
    }
  };

  // cart update:
  const cartUpdate = (row, inx) => {
    selectedprimiumServiceExpenseNameset({
      name: row.name,
      id: row.expenseNameId,
    });

    qtySet(row.qty);
    costSet(row.cost);
    amountSet(row.amount);
    cartIndexSet(inx);
  };

  const cartDelete = (inx) => {
    const filteredData = cartData.filter((item, index) => index != inx);
    cartDataSet(filteredData);
    cartIndexSet(null);

    selectedprimiumServiceExpenseNameset(null);
    qtySet(0);
    costSet(0);
    amountSet(0);
  };

  // table end

  useEffect(() => {
    idSet(
      pathSplitter(location.pathname, 2) != undefined
        ? parseFloat(pathSplitter(location.pathname, 2))
        : 0
    );

    if (pathSplitter(location.pathname, 2) != undefined) {
      actionSet("put");
    }

    getPremiumServiceExpenseNames();
    getsuppliers();
    getInvoiceCode();
    getAccounts();

    if (pathSplitter(location.pathname, 2) != undefined) {
      getPremiumServiceWithDetails();
      isSavingSet(true);
    }
  }, []);

  const getPremiumServiceWithDetails = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/PremiumServiceExpense/${pathSplitter(
          location.pathname,
          2
        )}`,
        {
          headers: authHeaders,
        }
      );

      isSavingSet(false);

      handleEdit(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const resetForm = () => {
    actionSet("post");
    selectedprimiumServiceExpenseNameset(null);
    qtySet(0);
    costSet(0);
    amountSet(0);
    subTotalSet(0);
    taxAmountSet(0);
    othersChargeSet(0);
    discountAmountSet(0);
    sumTotalAmountSet(0);
    cartDataSet([]);
    selectsupplierset(null);
    dueSet(0);
    paidSet(0);
    selectedDateSet(dayjs());
    invoiceTransactionsSet([]);
  };

  const handleEdit = (data) => {
    idSet(data.id);
    const parsedDate = dayjs(data.createdDate);
    selectedDateSet(parsedDate.isValid() ? parsedDate : null);
    invoiceCodeSet(data.invoiceNo);
    selectsupplierset(data.supplier);
    cartDataSet(
      data.expenseDetails.map((serviceItem) => ({
        name: serviceItem.expenseName.name,
        expenseNameId: serviceItem.expenseName.id,
        qty: serviceItem.qty,
        cost: serviceItem.cost,
        amount: serviceItem.amount,
      }))
    );
    taxAmountSet(data.taxAmount);
    othersChargeSet(data.othersCharge);
    totalAmountSet(data.totalAmount);
    subTotalSet(data.subTotal);
    discountAmountSet(data.discountAmount);
    paidSet(data.paidAmount);
    invoiceTransactionsSet(
      data.invoiceTransactions.map((transaction) => ({
        name: transaction.account.name,
        payAccountId: transaction.account.id,
        amount: transaction.amount,
      }))
    );
  };

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

  const getInvoiceCode = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/PremiumServiceExpense/get-invoice-code`,
        {
          headers: authHeaders,
        }
      );
      invoiceCodeSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const getsuppliers = async () => {
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

  const postPremiumServiceExpense = async () => {
    if (selectsupplier === null) {
      Swal.fire({
        title: "Customer is Required.",
        icon: "warning",
      });
    } else if (cartData.length < 1) {
      Swal.fire({
        title: "Cart is Empty.",
        icon: "warning",
      });
    } else if (paymentTotalAmount != paid) {
      Swal.fire({
        title: "Payment Mathod Amount and Paid Amount Should be Same!",
        icon: "warning",
      });
    } else {
      const postData = {
        premiumServiceExpense: {
          supplierId: selectsupplier.id,
          invoiceNo: invoiceCode,
          createdDate: selectedDate.format(dateFormat),
          subTotal: subTotal,
          discountAmount: discountAmount,
          taxAmount: taxAmount,
          othersCharge: othersCharge,
          totalAmount: sumTotalAmount,
          paidAmount: paid,
          dueAmount: due,
        },
        serviceExpenseDetail: cartData.map((item, inx) => ({
          expenseNameId: item.expenseNameId,
          qty: item.qty,
          cost: item.cost,
          amount: item.amount,
        })),

        invoiceTransactions: invoiceTransactions.map(
          (transactionItem, inx) => ({
            payAccountId: transactionItem.payAccountId,
            amount: transactionItem.amount,
          })
        ),
      };

      isSavingSet(true);
      try {
        let response;

        if (action == "post") {
          response = await axios.post(
            `${API_URL}api/v1/PremiumServiceExpense`,
            postData,
            {
              headers: authHeaders,
            }
          );
        }

        if (action == "put") {
          response = await axios.put(
            `${API_URL}api/v1/PremiumServiceExpense/${id}`,
            postData,
            {
              headers: authHeaders,
            }
          );
        }

        // After Api Response

        // After Api Response
        if (action === "post") {
          Swal.fire({
            title: `${response.data.invoiceNo} is ${
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
                `/premium-service/premium-service-expense-invoice/${response.data.id}`
              );
            } else {
              resetForm();
            }
          });
        } else {
          Swal.fire({
            title: `${response.data.invoiceNo} is update Successfully. Do you want to view the invoice?`,

            icon: "success",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonText: "No",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(
                `/premium-service/premium-service-expense-invoice/${response.data.id}`
              );
            } else {
              resetForm();

              if (action === "put") {
                navigate(`/premium-service/premium-service-expense`);
              }
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

  // End CRUD Operations

  const expenseNameRef = useRef(null);
  const qtyRef = useRef(null);
  const costRef = useRef(null);
  const paidRef = useRef(null);
  const taxRef = useRef(null);
  const othersChargeRef = useRef(null);
  const discountAmountRef = useRef(null);
  const paymentAmountRef = useRef(null);
  const supplierRef = useRef(null);
  const invoiceRef = useRef(null);
  const modalItemRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (e.target === invoiceRef.current) {
        supplierRef.current.focus();
      }
      if (e.target === supplierRef.current) {
        expenseNameRef.current.focus();
      }
      if (e.target === expenseNameRef.current) {
        qtyRef.current.focus();
      } else if (e.target === qtyRef.current) {
        costRef.current.focus();
      } else if (e.target === costRef.current) {
        addToCart();
      } else if (e.target === taxRef.current) {
        othersChargeRef.current.focus();
      } else if (e.target === othersChargeRef.current) {
        discountAmountRef.current.focus();
      } else if (e.target === discountAmountRef.current) {
        paidRef.current.focus();
      }

      //for model
      if (e.target === paidRef.current) {
        assignMaterialModalSet(true);
      } else if (e.target === modalItemRef.current) {
        paymentAmountRef.current.focus();
      } else if (e.target === paymentAmountRef.current) {
        handlePayment();
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
          PREMIUM SERVICE EXPENSE ENTRY
        </Typography>
        <Grid
          container
          spacing={3}
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          style={{ marginBottom: "15px" }}
        >
          <Grid item xs={12} sm={3} style={{ marginTop: "-10px" }}>
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
                    value={selectedDate}
                    onChange={(date) => selectedDateSet(date)}
                    format={dateFormat}
                    slotProps={{ field: { size: "small" } }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </DemoItem>
              </DemoContainer>
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={2}>
            <TextField
              label="INVOICE CODE"
              name="invoice"
              autoComplete="off"
              size="small"
              inputRef={invoiceRef}
              onKeyDown={handleKeyPress}
              fullWidth
              value={invoiceCode}
              onChange={(e) => invoiceCodeSet(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3} className="plus-link-div">
            <Link to="/premium-service/supplier" className="plus-link">
              +
            </Link>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              size="small"
              id="combo-box-suppliers"
              options={suppliers}
              value={selectsupplier}
              onKeyDown={handleKeyPress}
              onChange={(e, obj) => selectsupplierset(obj)}
              getOptionLabel={(option) => option.name}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputRef={supplierRef}
                  label="SELECT SUPPLIER"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="ADDRESS"
              name="address"
              autoComplete="off"
              size="small"
              disabled
              fullWidth
              value={selectsupplier != null ? selectsupplier.address : ""}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="CONTACT NO"
              name="contactNo"
              autoComplete="off"
              size="small"
              disabled
              fullWidth
              value={selectsupplier != null ? selectsupplier.contactNo : ""}
            />
          </Grid>
        </Grid>
        <Grid
          style={{
            marginTop: "15px",
            marginBottom: "15px",
            width: "100%",
            height: "2px",
            background: "#f1eeee",
          }}
        ></Grid>
        <Typography
          variant="h6"
          className="MuiTypography-h6 mb-3"
          style={{ marginBottom: "8px" }}
        >
          SERVICE CART
        </Typography>
        <Grid
          container
          spacing={3}
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Grid item xs={12} sm={3} className="plus-link-div">
            <Link
              to="/premium-service/expense-name-entry"
              className="plus-link"
            >
              +
            </Link>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              size="small"
              id="combo-box-expense"
              options={primiumServiceExpenseNames}
              value={selectedprimiumServiceExpenseName}
              onKeyDown={handleKeyPress}
              onChange={(e, obj) => {
                selectedprimiumServiceExpenseNameset(obj);
                if (obj != null) {
                  costSet(obj.cost);
                } else {
                  costSet(0);
                }
              }}
              getOptionLabel={(option) => option.name}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputRef={expenseNameRef}
                  label="SELECT EXPENSE NAME"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="QTY"
              name="qty"
              autoComplete="off"
              size="small"
              inputRef={qtyRef}
              onFocus={() => qtyRef.current.select()}
              type="number"
              onKeyDown={handleKeyPress}
              fullWidth
              value={qty}
              onChange={(e) => {
                if (0 > parseFloat(e.target.value)) {
                  return false;
                }
                qtySet(parseFloat(e.target.value));
              }}
              onBlur={(e) => {
                if (e.target.value === "" || parseFloat(e.target.value) < 0) {
                  qtySet(0);
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="COST"
              name="cost"
              autoComplete="off"
              size="small"
              type="number"
              inputRef={costRef}
              onFocus={() => costRef.current.select()}
              onKeyDown={handleKeyPress}
              fullWidth
              value={cost}
              onChange={(e) => {
                if (0 > parseFloat(e.target.value)) {
                  return false;
                }

                costSet(parseFloat(e.target.value));
              }}
              onBlur={(e) => {
                if (e.target.value === "" || parseFloat(e.target.value) < 0) {
                  costSet(0);
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="AMOUNT"
              name="amount"
              autoComplete="off"
              size="small"
              type="number"
              disabled
              onKeyDown={handleKeyPress}
              fullWidth
              value={amount}
              onChange={(e) => amountSet(parseFloat(e.target.value))}
            />
          </Grid>
        </Grid>
        <Stack direction="row" spacing={2}>
          {/* add to cart button row */}
          <Button
            onClick={() => addToCart()}
            variant="outlined"
            style={{ margin: "15px", color: "blue" }}
            loading={isSaving}
          >
            {cartIndex != null ? "Cart Update" : "Add To Cart"}
          </Button>
        </Stack>
        {/* cart section */}
        <Stack direction="row" spacing={2}>
          {cartData.length > 0 ? (
            <TableContainer>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "5%" }}>SL</TableCell>
                    <TableCell align="left" style={{ width: "35%" }}>
                      ITEM NAME
                    </TableCell>
                    <TableCell align="left" style={{ width: "35%" }}>
                      ITEM QUANTITY
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      COST (PER)
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      AMOUNT
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
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{row.qty}</TableCell>
                      <TableCell align="right">
                        {amountFormat(parseFloat(row.cost).toFixed(2))}
                      </TableCell>
                      <TableCell align="right">
                        {parseFloat(row.amount).toFixed(2)}
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
                      colSpan={2}
                      align="center"
                      style={{ fontWeight: "bold" }}
                    >
                      TOTAL :
                    </TableCell>
                    <TableCell align="left" style={{ fontWeight: "bold" }}>
                      {totalCartQty}
                    </TableCell>
                    <TableCell colSpan={1}></TableCell>
                    <TableCell align="right" style={{ fontWeight: "bold" }}>
                      {amountFormat(parseFloat(totalAmount).toFixed(2))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            ""
          )}
        </Stack>

        {/* main input section */}
        <Grid
          style={{ marginTop: "20px" }}
          container
          spacing={3}
          rowSpacing={2}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Grid item xs={12} sm={3}>
            <TextField
              label="SUB TOTAL"
              name="subTotal"
              autoComplete="off"
              size="small"
              type="number"
              onKeyDown={handleKeyPress}
              fullWidth
              disabled
              value={subTotal}
              onChange={(e) => subTotalSet(parseFloat(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="TAX AMOUNT"
              name="taxAmount"
              autoComplete="off"
              size="small"
              type="number"
              inputRef={taxRef}
              onFocus={() => taxRef.current.select()}
              onKeyDown={handleKeyPress}
              fullWidth
              value={taxAmount}
              onChange={(e) => {
                if (0 > parseFloat(e.target.value)) {
                  return false;
                }
                taxAmountSet(parseFloat(e.target.value));
              }}
              onBlur={(e) => {
                if (e.target.value === "" || parseFloat(e.target.value) < 0) {
                  taxAmountSet(0);
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="OTHERS CHARGE"
              name="otherscharge"
              autoComplete="off"
              size="small"
              type="number"
              inputRef={othersChargeRef}
              onFocus={() => othersChargeRef.current.select()}
              onKeyDown={handleKeyPress}
              fullWidth
              value={othersCharge}
              onChange={(e) => {
                if (0 > parseFloat(e.target.value)) {
                  return false;
                }
                othersChargeSet(parseFloat(e.target.value));
              }}
              onBlur={(e) => {
                if (e.target.value === "" || parseFloat(e.target.value) < 0) {
                  othersChargeSet(0);
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="DISCOUNT AMOUNT"
              name="discountAmount"
              autoComplete="off"
              size="small"
              type="number"
              inputRef={discountAmountRef}
              onFocus={() => discountAmountRef.current.select()}
              onKeyDown={handleKeyPress}
              fullWidth
              value={discountAmount}
              onChange={(e) => {
                if (0 > parseFloat(e.target.value)) {
                  return false;
                }

                discountAmountSet(parseFloat(e.target.value));
              }}
              onBlur={(e) => {
                if (e.target.value === "" || parseFloat(e.target.value) < 0) {
                  discountAmountSet(0);
                }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              label="TOTAL AMOUNT"
              name="totalAmount"
              autoComplete="off"
              size="small"
              disabled
              type="number"
              onKeyDown={handleKeyPress}
              fullWidth
              value={sumTotalAmount}
              onChange={(e) => sumTotalAmountSet(parseFloat(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="PAID"
              name="paid"
              autoComplete="off"
              size="small"
              type="number"
              inputRef={paidRef}
              onFocus={() => paidRef.current.select()}
              onKeyDown={handleKeyPress}
              fullWidth
              value={paid}
              onChange={(e) => {
                if (
                  0 > parseFloat(e.target.value) ||
                  sumTotalAmount < parseFloat(e.target.value)
                ) {
                  return false;
                }
                paidSet(parseFloat(e.target.value));
              }}
              onBlur={(e) => {
                if (e.target.value === "" || parseFloat(e.target.value) < 0) {
                  paidSet(0);
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="DUE"
              name="due"
              autoComplete="off"
              size="small"
              disabled
              type="number"
              onKeyDown={handleKeyPress}
              fullWidth
              value={due}
              onChange={(e) => dueSet(parseFloat(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="outlined"
              onClick={() => assignMaterialModalSet(true)}
              style={{ color: "black" }}
            >
              Payment Method
            </Button>
          </Grid>
        </Grid>

        <Stack direction="row" spacing={2}>
          <Button
            onClick={() => postPremiumServiceExpense()}
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

      {/* Modal */}

      <Modal
        open={assignMaterialModal}
        onClose={() => assignMaterialModalSet(false)}
        center
        style={{
          minWidth: "600px",
          minHeight: "500px",
          display: "flex",
          flexDirection: "column",
          alignprimiumServiceExpenseNames: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <h5
          style={{
            margin: 0,
            padding: 0,
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Payment Method
        </h5>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={10}>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              size="small"
              id="combo-box-item"
              options={accounts}
              onKeyDown={handleKeyPress}
              value={selectedAccount}
              onChange={(e, obj) => selectedAccountSet(obj)}
              getOptionLabel={(option) => option.name}
              fullWidth
              renderInput={(params) => (
                <TextField
                  inputRef={modalItemRef}
                  {...params}
                  label="SELECT ACCOUNT"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={10}>
            <TextField
              label="PAYMENT AMOUNT"
              name="paymentAmount"
              autoComplete="off"
              size="small"
              fullWidth
              type="number"
              onKeyDown={handleKeyPress}
              value={paymentAmountValue}
              onChange={(e) => paymentAmountValueSet(e.target.value)}
              inputRef={paymentAmountRef}
              onFocus={() => paymentAmountRef.current.select()}
            />
          </Grid>

          <Grid item xs={12} sm={10}>
            <Button
              onClick={() => handlePayment()}
              style={{
                background: "black",
                color: "#ffffff",
                width: "100%",
              }}
              variant="contained"
            >
              {paymentIndex != null ? "Edit" : "Add Pay"}
            </Button>
          </Grid>
        </Grid>

        <br />

        <TableContainer style={{ marginTop: "20px", width: "100%" }}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="left">SL</TableCell>
                <TableCell align="left">ACCOUNT NAME</TableCell>
                <TableCell align="right">AMOUNT</TableCell>
                <TableCell align="left">Edit</TableCell>
                <TableCell align="left">DELETE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Replace this with dynamic rows based on your data */}
              {invoiceTransactions?.map((transactionItem, inx) => (
                <TableRow>
                  <TableCell align="left">{inx + parseFloat(1)}</TableCell>
                  <TableCell align="left">{transactionItem.name}</TableCell>
                  <TableCell align="right">
                    {amountFormat(parseFloat(transactionItem.amount))}
                  </TableCell>
                  <TableCell align="left">
                    <EditNoteIcon
                      style={{
                        color: "green",
                        cursor: "pointer",
                        display: isSaving ? "none" : "block",
                      }}
                      onClick={() => handlePaymentEdit(transactionItem, inx)}
                    />
                  </TableCell>
                  <TableCell align="left">
                    <DeleteForeverIcon
                      style={{
                        color: "red",
                        cursor: "pointer",
                        display: isSaving ? "none" : "block",
                      }}
                      onClick={() => handlePaymentDelete(inx)}
                    />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={1} align="left"></TableCell>
                <TableCell align="left">TOTAL</TableCell>
                <TableCell align="right">
                  {amountFormat(parseFloat(paymentTotalAmount).toFixed(2))}
                </TableCell>
                <TableCell colSpan={2} align="left"></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Modal>
    </>
  );
};

export default PremiumServiceExpense;
