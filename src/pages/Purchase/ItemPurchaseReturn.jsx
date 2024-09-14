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

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const ItemPurchaseReturnReturn = () => {
  const [totalCartQty, totalCartQtySet] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  //for get items
  const [items, itemsSet] = useState([]);
  //for add to cart
  const [selectedItem, selectedItemSet] = useState(null);
  const [qty, qtySet] = useState(0);
  const [rate, rateSet] = useState(0);
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
  const [selectSupplier, selectSupplierSet] = useState(null);
  const [invoiceCode, invoiceCodeSet] = useState("");
  const [vatAmount, vatAmountSet] = useState(0);
  const [othersCharge, othersChargeSet] = useState(0);
  const [discountAmount, discountAmountSet] = useState(0);
  const [subTotal, subTotalSet] = useState(0);
  const [sumTotalAmount, sumTotalAmountSet] = useState(0);
  const [paid, paidSet] = useState(0);
  const [due, dueSet] = useState(0);

  const [assignMaterialModal, assignMaterialModalSet] = useState(false);

  //for payment method modal
  const [paymentAmountValue, paymentAmountValueSet] = useState(0);
  const [selectedAccount, selectedAccountSet] = useState(null);
  const [
    purchaseReturnInvoiceTransactions,
    purchaseReturnInvoiceTransactionsSet,
  ] = useState([]);
  const [paymentIndex, paymentIndexSet] = useState(null);
  const [paymentTotalAmount, paymentTotalAmountSet] = useState([]);
  const [selectedDate, selectedDateSet] = useState(dayjs());
  const [barStock, barStockSet] = useState(null);

  useEffect(() => {
    const getBarStock = async () => {
      try {
        const response = await axios.get(
          `${API_URL}api/v1/Inventory/get-item-current-stock`,
          {
            headers: authHeaders,
            params: {
              ItemId: selectedItem != null ? selectedItem.id : null,
            },
          }
        );
        barStockSet(response.data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to load data! Please try again later.",
          confirmButtonText: "OK",
        });
      }
    };

    if (selectedItem != null) {
      getBarStock();
    }
  }, [selectedItem]);

  useEffect(() => {
    barStockSet(null);
  }, [selectedItem]);

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
        let copyPurchaseInvoiceTransactions = [
          ...purchaseReturnInvoiceTransactions,
        ];
        copyPurchaseInvoiceTransactions[paymentIndex] = {
          name: selectedAccount.name,
          payAccountId: selectedAccount.id,
          amount: paymentAmountValue,
        };

        purchaseReturnInvoiceTransactionsSet(copyPurchaseInvoiceTransactions);
        paymentIndexSet(null);
      } else {
        purchaseReturnInvoiceTransactionsSet([
          ...purchaseReturnInvoiceTransactions,
          transactionItem,
        ]);
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
    const filteredItem = purchaseReturnInvoiceTransactions.filter(
      (item, index) => index != inx
    );
    purchaseReturnInvoiceTransactionsSet(filteredItem);
    paymentIndexSet(null);
  };

  useEffect(() => {
    const payTotalAmount = purchaseReturnInvoiceTransactions.reduce(
      (prev, item) => parseFloat(prev) + parseFloat(item.amount),
      0
    );

    paymentTotalAmountSet(payTotalAmount);
    paidSet(payTotalAmount);
  }, [purchaseReturnInvoiceTransactions]);

  useEffect(() => {
    const totalDue = parseFloat(sumTotalAmount) - parseFloat(paid);
    dueSet(totalDue);
  }, [paid, sumTotalAmount]);

  useEffect(() => {
    const amount = parseFloat(qty) * parseFloat(rate);
    amountSet(amount);

    // Calculate totalAmount based on cartData
    const totalAmount = cartData.reduce(
      (prev, cartItem) => prev + cartItem.amount,
      0
    );

    const totalQuantity = cartData.reduce(
      (prev, cartItem) => prev + cartItem.qty,
      0
    );
    totalCartQtySet(totalQuantity);
    totalAmountSet(totalAmount);
    subTotalSet(totalAmount);
  }, [qty, rate, cartData]);

  useEffect(() => {
    const totalAmount =
      parseFloat(subTotal) +
      parseFloat(vatAmount) +
      parseFloat(othersCharge) -
      parseFloat(discountAmount);
    sumTotalAmountSet(totalAmount);
  }, [subTotal, vatAmount, othersCharge, discountAmount]);

  // add to cart function:
  const addToCart = () => {
    if (selectedItem === null) {
      Swal.fire({
        title: "Item is Required.",
        icon: "warning",
      });
    } else if (qty === 0) {
      Swal.fire({
        title: "Qty is Required.",
        icon: "warning",
      });
    } else {
      const cartItem = {
        name: selectedItem.name,
        itemId: selectedItem.id,
        qty: qty,
        rate: rate,
        amount: amount,
      };

      if (cartIndex != null) {
        let cartDataCopy = [...cartData];
        cartDataCopy[cartIndex] = {
          name: selectedItem.name,
          itemId: selectedItem.id,
          qty: qty,
          rate: rate,
          amount: amount,
        };
        cartDataSet(cartDataCopy);
        cartIndexSet(null);
      } else {
        cartDataSet([...cartData, cartItem]);
        cartIndexSet(null);
      }

      selectedItemSet(null);
      qtySet(0);
      rateSet(0);
      amountSet(0);
    }
  };

  // cart update:
  const cartUpdate = (row, inx) => {
    selectedItemSet({ name: row.name, id: row.itemId });

    qtySet(row.qty);
    rateSet(row.rate);
    amountSet(row.amount);
    cartIndexSet(inx);
  };

  const cartDelete = (inx) => {
    const filteredData = cartData.filter((item, index) => index != inx);
    cartDataSet(filteredData);
    cartIndexSet(null);

    selectedItemSet(null);
    qtySet(0);
    rateSet(0);
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

    getItems();
    getSuppliers();
    getInvoiceCode();
    getAccounts();

    if (pathSplitter(location.pathname, 2) != undefined) {
      getPurchaseWithDetails();
      isSavingSet(true);
    }
  }, []);

  const getPurchaseWithDetails = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/ItemPurchaseReturn/${pathSplitter(
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
    selectedItemSet(null);
    qtySet(0);
    rateSet(0);
    amountSet(0);
    subTotalSet(0);
    vatAmountSet(0);
    othersChargeSet(0);
    discountAmountSet(0);
    sumTotalAmountSet(0);
    cartDataSet([]);
    selectSupplierSet(null);
    dueSet(0);
    paidSet(0);
    selectedDateSet(dayjs());
    purchaseReturnInvoiceTransactionsSet([]);
    getInvoiceCode();
  };

  const handleEdit = (data) => {
    idSet(data.id);
    const parsedDate = dayjs(data.createdDate);
    selectedDateSet(parsedDate.isValid() ? parsedDate : null);
    invoiceCodeSet(data.invoiceNo);
    selectSupplierSet(data.supplier);
    selectedItemSet();
    cartDataSet(
      data.itemPurchaseReturnDetails.map((itemPurchase) => ({
        name: itemPurchase.item.name,
        itemId: itemPurchase.item.id,
        qty: itemPurchase.qty,
        rate: itemPurchase.rate,
        amount: itemPurchase.amount,
      }))
    );
    vatAmountSet(data.vatAmount);
    othersChargeSet(data.othersCharge);
    totalAmountSet(data.totalAmount);
    subTotalSet(data.subTotal);
    discountAmountSet(data.discountAmount);
    paidSet(data.paidAmount);
    purchaseReturnInvoiceTransactionsSet(
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
        `${API_URL}api/v1/ItemPurchaseReturn/get-invoice-code`,
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

  const getItems = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/Item`, {
        headers: authHeaders,
      });
      itemsSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const postItemPurchaseReturn = async () => {
    if (selectSupplier === null) {
      Swal.fire({
        title: "Supplier is Required.",
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
        itemPurchaseReturn: {
          supplierId: selectSupplier.id,
          invoiceNo: invoiceCode,
          createdDate: selectedDate.format(dateFormat),
          subTotal: subTotal,
          discountAmount: discountAmount,
          vatAmount: vatAmount,
          othersCharge: othersCharge,
          totalAmount: sumTotalAmount,
          paidAmount: paid,
          dueAmount: due,
        },
        itemPurchaseReturnDetails: cartData.map((item, inx) => ({
          itemId: item.itemId,
          qty: item.qty,
          rate: item.rate,
          amount: item.amount,
        })),

        purchaseReturnInvoiceTransactions:
          purchaseReturnInvoiceTransactions.map((transactionItem, inx) => ({
            payAccountId: transactionItem.payAccountId,
            amount: parseFloat(transactionItem.amount),
          })),
      };

      isSavingSet(true);
      try {
        let response;

        if (action == "post") {
          response = await axios.post(
            `${API_URL}api/v1/ItemPurchaseReturn`,
            postData,
            {
              headers: authHeaders,
            }
          );
        }

        if (action == "put") {
          response = await axios.put(
            `${API_URL}api/v1/ItemPurchaseReturn/${id}`,
            postData,
            {
              headers: authHeaders,
            }
          );
        }

        // After Api Response
        if (action === "post") {


          Swal.fire({
            title: `${response.data.invoiceNo} is ${
              action == "post" ? "Return" : "update"
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
                `/purchase/item-purchase-return-invoice/${response.data.id}`
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
                `/purchase/item-purchase-return-invoice/${response.data.id}`
              );
            } else {
              resetForm();
              if (action === "put") {
                navigate(`/purchase/purchase-return`);
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

  const itemRef = useRef(null);
  const qtyRef = useRef(null);
  const rateRef = useRef(null);
  const paidRef = useRef(null);
  const vatRef = useRef(null);
  const othersChargeRef = useRef(null);
  const discountAmountRef = useRef(null);
  const paymentAmountRef = useRef(null);
  const modalItemRef = useRef(null);
  const supplierRef = useRef(null);
  const invoiceRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (e.target === itemRef.current) {
        qtyRef.current.focus();
      } else if (e.target === qtyRef.current) {
        rateRef.current.focus();
      } else if (e.target === rateRef.current) {
        addToCart();
      } else if (e.target === vatRef.current) {
        othersChargeRef.current.focus();
      } else if (e.target === othersChargeRef.current) {
        discountAmountRef.current.focus();
      } else if (e.target === discountAmountRef.current) {
        paidRef.current.focus();
      }

      if (e.target === invoiceRef.current) {
        supplierRef.current.focus();
      } else if (e.target === supplierRef.current) {
        itemRef.current.focus();
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
          PURCHASE RETURN ENTRY
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
            <Link to="/purchase/supplier" className="plus-link">
              +
            </Link>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              size="small"
              id="combo-box-suppliers"
              options={suppliers}
              value={selectSupplier}
              onKeyDown={handleKeyPress}
              onChange={(e, obj) => selectSupplierSet(obj)}
              getOptionLabel={(option) => option.name}
              fullWidth
              renderInput={(params) => (
                <TextField
                  inputRef={supplierRef}
                  {...params}
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
              value={selectSupplier != null ? selectSupplier.address : ""}
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
              value={selectSupplier != null ? selectSupplier.contactNo : ""}
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
          ITEM CART
        </Typography>
        <Grid
          container
          spacing={3}
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Grid item xs={12} sm={3} className="plus-link-div">
            {selectedItem != null && barStock != null && (
              <p
                className={`${
                  barStock > 0 ? "stock-availity" : "stock-unavaility"
                } absolute right-8 -top-3`}
              >
                {`Available: ${barStock} ${selectedItem?.unit?.name || ""}`}
              </p>
            )}
            <Link to="/item-management/item" className="plus-link">
              +
            </Link>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              size="small"
              id="combo-box-gender"
              options={items}
              value={selectedItem}
              onKeyDown={handleKeyPress}
              onChange={(e, obj) => {
                selectedItemSet(obj);
                if (obj != null) {
                  rateSet(obj.openingRate);
                } else {
                  rateSet(0);
                }
              }}
              getOptionLabel={(option) => option.name}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} inputRef={itemRef} label="SELECT ITEM" />
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
              label="RATE"
              name="rate"
              autoComplete="off"
              size="small"
              type="number"
              inputRef={rateRef}
              onFocus={() => rateRef.current.select()}
              onKeyDown={handleKeyPress}
              fullWidth
              value={rate}
              onChange={(e) => {
                if (0 > parseFloat(e.target.value)) {
                  return false;
                }

                rateSet(parseFloat(e.target.value));
              }}
              onBlur={(e) => {
                if (e.target.value === "" || parseFloat(e.target.value) < 0) {
                  rateSet(0);
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
                      RATE (PER)
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
                        {amountFormat(parseFloat(row.rate).toFixed(2))}
                      </TableCell>
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
              label="VAT AMOUNT"
              name="vatAmount"
              autoComplete="off"
              size="small"
              type="number"
              onKeyDown={handleKeyPress}
              fullWidth
              value={vatAmount}
              inputRef={vatRef}
              onFocus={() => vatRef.current.select()}
              onChange={(e) => {
                if (0 > parseFloat(e.target.value)) {
                  return false;
                }
                vatAmountSet(parseFloat(e.target.value));
              }}
              onBlur={(e) => {
                if (e.target.value === "" || parseFloat(e.target.value) < 0) {
                  vatAmountSet(0);
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="OTHERS CHARGE"
              name="othersCharge"
              autoComplete="off"
              size="small"
              type="number"
              onKeyDown={handleKeyPress}
              fullWidth
              value={othersCharge}
              inputRef={othersChargeRef}
              onFocus={() => othersChargeRef.current.select()}
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
              onKeyDown={handleKeyPress}
              fullWidth
              value={discountAmount}
              inputRef={discountAmountRef}
              onFocus={() => discountAmountRef.current.select()}
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
              onKeyDown={handleKeyPress}
              fullWidth
              inputRef={paidRef}
              onFocus={() => paidRef.current.select()}
              value={paid}
              onChange={(e) => {
                if (0 > parseFloat(e.target.value)) {
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
            onClick={() => postItemPurchaseReturn()}
            variant="outlined"
            style={{ margin: "15px", color: "green" }}
            loading={isSaving}
          >
            {action == "post" ? "RETURN" : "RETURN UPDATE"}
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
          alignItems: "center",
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
                <TableCell align="left">AMOUNT</TableCell>
                <TableCell align="left">Edit</TableCell>
                <TableCell align="left">DELETE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Replace this with dynamic rows based on your data */}
              {purchaseReturnInvoiceTransactions?.map(
                (transactionItem, inx) => (
                  <TableRow>
                    <TableCell align="left">{inx + parseFloat(1)}</TableCell>
                    <TableCell align="left">{transactionItem.name}</TableCell>
                    <TableCell align="right">
                      {amountFormat(
                        parseFloat(transactionItem.amount).toFixed(2)
                      )}
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
                )
              )}
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

export default ItemPurchaseReturnReturn;
