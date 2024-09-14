import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { amountFormat, authHeaders, pathSplitter } from "../../../utils";
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
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const HouseKeepingUsed = () => {
  // new:
  const [floors, floorsSet] = useState([]);
  const [rooms, roomsSet] = useState([]);
  const [selectFloor, selectFloorSet] = useState(null);
  const [selectRoom, selectRoomSet] = useState(null);

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

  const [invoiceCode, invoiceCodeSet] = useState("");
  const [othersCharge, othersChargeSet] = useState(0);
  const [subTotal, subTotalSet] = useState(0);
  const [sumTotalAmount, sumTotalAmountSet] = useState(0);
  const [totalCartQty, totalCartQtySet] = useState(0);

  const navigate = useNavigate();

  const [barStock, barStockSet] = useState(null);

  useEffect(() => {
    if (selectedItem !== null) {
      rateSet(selectedItem.purchaseRate);
    }
  }, [selectedItem]);

  useEffect(() => {
    const getBarStock = async () => {
      try {
        const response = await axios.get(
          `${API_URL}api/v1/Inventory/get-housekeeping-item-current-stock`,
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

  useEffect(() => {
    const amount = parseFloat(qty) * parseFloat(rate);
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
  }, [qty, rate, cartData]);

  useEffect(() => {
    const totalAmount = parseFloat(subTotal) + parseFloat(othersCharge);
    sumTotalAmountSet(totalAmount);
  }, [subTotal, othersCharge]);

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
    getInvoiceCode();
    getFloors();
    getRooms();

    if (pathSplitter(location.pathname, 2) != undefined) {
      getUsedWithDetails();
      isSavingSet(true);
    }
  }, []);

  const getRooms = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/Room`, {
        headers: authHeaders,
      });
      roomsSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const getFloors = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/Floor`, {
        headers: authHeaders,
      });
      floorsSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const getUsedWithDetails = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/HouseKeepingUsed/${pathSplitter(
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
    selectFloorSet(null);
    selectRoomSet(null);
    rateSet(0);
    amountSet(0);
    subTotalSet(0);
    othersChargeSet(0);
    sumTotalAmountSet(0);
    cartDataSet([]);
  };

  const handleEdit = (data) => {
    idSet(data.id);
    invoiceCodeSet(data.invoiceNo);
    selectedItemSet();
    cartDataSet(
      data.itemUsedDetails.map((itemPurchase) => ({
        name: itemPurchase.item.name,
        itemId: itemPurchase.item.id,
        qty: itemPurchase.qty,
        rate: itemPurchase.rate,
        amount: itemPurchase.amount,
      }))
    );
    othersChargeSet(data.othersCharge);
    totalAmountSet(data.totalAmount);
    subTotalSet(data.subTotal);
    selectFloorSet(data.floor);
    selectRoomSet(data.room);
  };

  const getInvoiceCode = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/HouseKeepingUsed/get-invoice-code`,
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

  const getItems = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/HouseKeepingItem`, {
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

  const postHouseKeepingUsed = async () => {
    if (cartData.length < 1) {
      Swal.fire({
        title: "Cart is Empty.",
        icon: "warning",
      });
    } else {
      const postData = {
        used: {
          roomId: selectRoom.id,
          floorId: selectFloor.id,
          invoiceNo: invoiceCode,
          subTotal: subTotal,
          othersCharge: othersCharge,
          totalCost: sumTotalAmount,
        },
        usedDetails: cartData.map((item, inx) => ({
          itemId: item.itemId,
          qty: item.qty,
          rate: item.rate,
          amount: item.amount,
        })),
      };

      isSavingSet(true);
      try {
        let response;

        if (action == "post") {
          response = await axios.post(
            `${API_URL}api/v1/HouseKeepingUsed`,
            postData,
            {
              headers: authHeaders,
            }
          );
        }

        if (action == "put") {
          response = await axios.put(
            `${API_URL}api/v1/HouseKeepingUsed/${id}`,
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
                `/house-keeping/house-keeping-used-invoice/${response.data.id}`
              );
            } else {
              resetForm();
            }
          });
        } else {
          Swal.fire({
            icon: "success",
            title: `${response.data.invoiceNo} is update Successfully`,
          });
          resetForm();

          if (action === "put") {
            navigate(`/house-keeping/house-keeping-used`);
          }
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
  const floorRef = useRef(null);
  const roomRef = useRef(null);
  const invoiceRef = useRef(null);

  const itemRef = useRef(null);
  const qtyRef = useRef(null);
  const rateRef = useRef(null);
  const othersChargeRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (e.target === floorRef.current) {
        roomRef.current.focus();
      } else if (e.target === roomRef.current) {
        invoiceRef.current.focus();
      } else if (e.target === invoiceRef.current) {
        itemRef.current.focus();
      } else if (e.target === itemRef.current) {
        qtyRef.current.focus();
      } else if (e.target === qtyRef.current) {
        rateRef.current.focus();
      } else if (e.target === rateRef.current) {
        addToCart();

        postHouseKeepingUsed.current.focus();
      } else if (e.target === othersChargeRef.current) {
        postHouseKeepingUsed();
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
          HOUSE KEEPING USED ENTRY
        </Typography>

        <Grid
          container
          spacing={3}
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Grid item xs={12} sm={3}>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              size="small"
              id="combo-box-floors"
              options={floors}
              value={selectFloor}
              onKeyDown={handleKeyPress}
              onChange={(e, obj) => selectFloorSet(obj)}
              getOptionLabel={(option) => option.floorNo}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputRef={floorRef}
                  label="SELECT FLOOR"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              size="small"
              id="combo-box-rooms"
              options={rooms}
              value={selectRoom}
              onKeyDown={handleKeyPress}
              onChange={(e, obj) => selectRoomSet(obj)}
              getOptionLabel={(option) => option.roomNo}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} inputRef={roomRef} label="SELECT ROOM" />
              )}
            />
          </Grid>

          <Grid item xs={12} md={3} sm={2}>
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
            {selectedItem != null && barStock != null && (
              <p
                className={`${
                  barStock > 0 ? "stock-availity" : "stock-unavaility"
                } absolute right-8 -top-3`}
              >
                {`Available: ${barStock} ${selectedItem?.unit?.name || ""}`}
              </p>
            )}
            <Link to="/house-keeping/house-keeping-item" className="plus-link">
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
              onChange={(e, obj) => selectedItemSet(obj)}
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
              label="OTHERS CHARGE"
              name="othersCharge"
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
        </Grid>

        <Stack direction="row" spacing={2}>
          <Button
            onClick={() => postHouseKeepingUsed()}
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
    </>
  );
};

export default HouseKeepingUsed;
