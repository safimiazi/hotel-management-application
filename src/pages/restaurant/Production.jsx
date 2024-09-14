import {
  Autocomplete,
  Button,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { amountFormat, authHeaders, dateFormat, pathSplitter } from "../../../utils";
import { API_URL } from "../../../config.json";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";

const Production = () => {
  const navigate = useNavigate();

  const [isSaving, isSavingSet] = useState(false);
  const location = useLocation();

  // get input data from input:
  const [selectedDate, selectedDateSet] = useState(dayjs());

  const [invoiceNo, invoiceNoSet] = useState("");
  const [subTotalCost, subTotalCostSet] = useState(0);
  const [othersCost, othersCostSet] = useState(0);
  const [totalCost, totalCostSet] = useState(0);
  const [items, itemsSet] = useState([]);
  //   Production item details
  const [selectedItem, selectedItemSet] = useState(null);
  const [itemQty, itemQtySet] = useState(0);
  const [itemRate, itemRateSet] = useState(0);
  const [itemAmount, itemAmountSet] = useState(0);
  const [id, idSet] = useState(null);

  //   Production item details
  const [selectedMaterial, selectedMaterialSet] = useState(null);
  const [materialQty, materialQtySet] = useState(0);
  const [materialRate, materialRateSet] = useState(0);
  const [materialAmount, materialAmountSet] = useState(0);
  const [cartIndex, cartIndexSet] = useState(null);
  const [itemCartData, itemCartDataSet] = useState([]);
  const [materialCartData, materialCartDataSet] = useState([]);
  const [action, actionSet] = useState("post");
  const [itemTotalAmount, itemTotalAmountSet] = useState(0);
  const [itemBarStock, itemBarStockSet] = useState(null);
  const [materialBarStock, materialBarStockSet] = useState(null);

  useEffect(() => {
    const getItemBarStock = async () => {
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
        itemBarStockSet(response.data);
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
      getItemBarStock();
    }
  }, [selectedItem]);

  useEffect(() => {
    itemBarStockSet(null);
  }, [selectedItem]);

  useEffect(() => {
    const getMaterialBarStock = async () => {
      try {
        const response = await axios.get(
          `${API_URL}api/v1/Inventory/get-item-current-stock`,
          {
            headers: authHeaders,
            params: {
              ItemId: selectedMaterial != null ? selectedMaterial.id : null,
            },
          }
        );
        materialBarStockSet(response.data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to load data! Please try again later.",
          confirmButtonText: "OK",
        });
      }
    };

    if (selectedMaterial != null) {
      getMaterialBarStock();
    }
  }, [selectedMaterial]);

  useEffect(() => {
    materialBarStockSet(null);
  }, [selectedMaterial]);

  useEffect(() => {
    const subTotalCost = materialCartData.reduce(
      (prev, curr) => parseFloat(prev) + parseFloat(curr.amount),
      0
    );
    subTotalCostSet(subTotalCost);
  }, [materialCartData]);

  useEffect(() => {
    const itemTotalAmount = itemCartData.reduce(
      (prev, curr) => parseFloat(prev) + parseFloat(curr.amount),
      0
    );
    itemTotalAmountSet(itemTotalAmount);
  }, [itemCartData]);

  useEffect(() => {
    const totalCost = parseFloat(subTotalCost) + parseFloat(othersCost);
    totalCostSet(totalCost);
  }, [subTotalCost, othersCost]);

  // start item add to card , edit and delete
  const itemAddToCart = () => {
    if (selectedItem === null) {
      Swal.fire({
        title: "Item is Required.",
        icon: "warning",
      });
    } else if (itemQty === 0) {
      Swal.fire({
        title: "Qty is Required.",
        icon: "warning",
      });
    } else {
      const cartItem = {
        name: selectedItem.name,
        itemId: selectedItem.id,
        qty: itemQty,
        rate: itemRate,
        amount: itemAmount,
      };

      if (cartIndex != null) {
        let cartDataCopy = [...itemCartData];
        cartDataCopy[cartIndex] = {
          name: selectedItem.name,
          itemId: selectedItem.id,
          qty: itemQty,
          rate: itemRate,
          amount: itemAmount,
        };
        itemCartDataSet(cartDataCopy);
        cartIndexSet(null);
      } else {
        itemCartDataSet([...itemCartData, cartItem]);
        cartIndexSet(null);
      }

      selectedItemSet(null);
      itemQtySet(0);
      itemRateSet(0);
      itemAmountSet(0);
    }
  };

  const itemCartUpdate = (row, inx) => {
    selectedItemSet({ name: row.name, id: row.itemId });

    itemQtySet(row.qty);
    itemRateSet(row.rate);
    itemAmountSet(row.amount);
    cartIndexSet(inx);
  };

  const itemCartDelete = (inx) => {
    const filteredData = itemCartData.filter((item, index) => index != inx);
    itemCartDataSet(filteredData);
    cartIndexSet(null);

    selectedItemSet(null);
    itemQtySet(0);
    itemRateSet(0);
    itemAmountSet(0);
  };

  // end item add to card , edit and delete

  // start material add to card , edit and delete

  const materialAddToCart = () => {
    if (selectedMaterial === null) {
      Swal.fire({
        title: "Item is Required.",
        icon: "warning",
      });
    } else if (materialQty === 0) {
      Swal.fire({
        title: "Qty is Required.",
        icon: "warning",
      });
    } else {
      const cartItem = {
        name: selectedMaterial.name,
        itemId: selectedMaterial.id,
        qty: materialQty,
        rate: materialRate,
        amount: materialAmount,
      };

      if (cartIndex != null) {
        let cartDataCopy = [...materialCartData];
        cartDataCopy[cartIndex] = {
          name: selectedMaterial.name,
          itemId: selectedMaterial.id,
          qty: materialQty,
          rate: materialRate,
          amount: materialAmount,
        };
        materialCartDataSet(cartDataCopy);
        cartIndexSet(null);
      } else {
        materialCartDataSet([...materialCartData, cartItem]);
        cartIndexSet(null);
      }

      selectedMaterialSet(null);
      materialQtySet(0);
      materialRateSet(0);
      materialAmountSet(0);
    }
  };

  const materialCartUpdate = (row, inx) => {
    selectedMaterialSet({ name: row.name, id: row.itemId });

    materialQtySet(row.qty);
    materialRateSet(row.rate);
    materialAmountSet(row.amount);
    cartIndexSet(inx);
  };

  const materialCartDelete = (inx) => {
    const filteredData = materialCartData.filter((item, index) => index != inx);
    materialCartDataSet(filteredData);
    cartIndexSet(null);

    selectedMaterialSet(null);
    materialQtySet(0);
    materialRateSet(0);
    materialAmountSet(0);
  };

  // start material add to card , edit and delete

  //get data from backend:
  useEffect(() => {
    getInvoiceNo();
    getItems();
  }, []);

  useEffect(() => {
    idSet(
      pathSplitter(location.pathname, 2) != undefined
        ? parseFloat(pathSplitter(location.pathname, 2))
        : 0
    );

    if (pathSplitter(location.pathname, 2) != undefined) {
      actionSet("put");
    }

    if (pathSplitter(location.pathname, 2) != undefined) {
      getProductionWithDetails();
      isSavingSet(true);
    }
  }, []);

  const getProductionWithDetails = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/Production/${pathSplitter(location.pathname, 2)}`,
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

  const handleEdit = (data) => {
    idSet(data.id);

    itemCartDataSet(
      data.productionItemDetails.map((item) => ({
        name: item.item.name,
        itemId: item.item.id,
        qty: item.qty,
        rate: item.rate,
        amount: item.amount,
      }))
    );
    materialCartDataSet(
      data.productionUsedItemDetails.map((item) => ({
        name: item.item.name,
        itemId: item.item.id,
        qty: item.qty,
        rate: item.rate,
        amount: item.amount,
      }))
    );
    subTotalCostSet(data.subTotalCost);
    othersCostSet(data.othersCost);
    totalCostSet(data.totalCost);
    invoiceNoSet(data.invoiceNo);
    const parsedDate = dayjs(row.createdDate);
    selectedDateSet(parsedDate.isValid() ? parsedDate : null);
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
  const getInvoiceNo = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/Production/get-invoice-code`,
        {
          headers: authHeaders,
        }
      );
      invoiceNoSet(response.data);
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
    subTotalCostSet(0);
    selectedDateSet(dayjs());

    othersCostSet(0);
    totalCostSet(0);
    itemCartDataSet([]);
    materialCartDataSet([]);
    getInvoiceNo();
  };

  const postProduction = async () => {
    // if (othersCost === 0) {
    //   Swal.fire({
    //     title: "Others Cost is Required.",
    //     icon: "warning",
    //   });
    // } else {
    const postData = {
      production: {
        invoiceNo: invoiceNo,
        subTotalCost: subTotalCost,
        othersCost: othersCost,
        totalCost: totalCost,
      },
      productionItemDetail: itemCartData.map((item, inx) => ({
        itemId: item.itemId,
        qty: item.qty,
        rate: item.rate,
        amount: item.amount,
      })),
      productionMaterialDetail: materialCartData.map((item, inx) => ({
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
        response = await axios.post(`${API_URL}api/v1/Production`, postData, {
          headers: authHeaders,
        });
      }

      if (action == "put") {
        response = await axios.put(
          `${API_URL}api/v1/Production/${id}`,
          postData,
          {
            headers: authHeaders,
          }
        );
      }

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
            navigate(`/restaurant/production-invoice/${response.data.id}`);
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
            navigate(`/restaurant/production-invoice/${response.data.id}`);
          } else {
            resetForm();
            if (action === "put") {
              navigate(`/restaurant/production`);
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
    // }
  };

  const othersCostRef = useRef(null);
  const itemSelectionRef = useRef(null);
  const itemQtyRef = useRef(null);
  const itemRateRef = useRef(null);
  const itemAmountRef = useRef(null);
  const materialSelectionRef = useRef(null);
  const materialQtyRef = useRef(null);
  const materialRateRef = useRef(null);
  const materialAmountRef = useRef(null);
  const dateRef = useRef(null);

  // Input Focus related Function:
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (e.target === itemSelectionRef.current) {
        itemQtyRef.current.focus();
      } 
      
      else if (e.target === itemQtyRef.current) {
        itemRateRef.current.focus();
      } else if (e.target === itemRateRef.current) {
        itemAddToCart();
      } else if (e.target === materialSelectionRef.current) {
        materialQtyRef.current.focus();
      } else if (e.target === materialQtyRef.current) {
        materialRateRef.current.focus();
      } else if (e.target === materialRateRef.current) {
        materialAddToCart();
      }
    }
  };

  useEffect(() => {
    const itemAmount = parseFloat(itemQty) * parseFloat(itemRate);
    itemAmountSet(itemAmount);
  }, [itemQty, itemRate]);

  useEffect(() => {
    const materialAmount = parseFloat(materialQty) * parseFloat(materialRate);
    materialAmountSet(materialAmount);
  }, [materialQty, materialRate]);

  return (
    <div>
      <Paper className="m-3 p-3">
        <Typography variant="h6" style={{ marginBottom: "15px" }}>
          PRODUCTION ENTRY
        </Typography>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
          <Grid item xs={12} md={3} sm={12} style={{ marginTop: "-8px"}}>
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
                        onChange={(date)=> selectedDateSet(date)}
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
          <Grid item xs={12} md={3} sm={12}>
            <TextField
              label="INVOICE NO"
              name="invoiceNo"
              autoComplete="off"
              size="small"
              onKeyDown={handleKeyPress}
              fullWidth
              value={invoiceNo}
              onChange={(e) => invoiceNoSet(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={2} sm={12}>
            <TextField
              label="SUB TOTAL COST"
              name="subTotalCost"
              autoComplete="off"
              size="small"
              type="number"
              disabled
              onKeyDown={handleKeyPress}
              fullWidth
              value={subTotalCost}
              onChange={(e) => subTotalCostSet(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={2} sm={12}>
            <TextField
              label="OTHERS COST"
              name="othersCost"
              autoComplete="off"
              size="small"
              type="number"
              inputRef={othersCostRef}
              onFocus={() => othersCostRef.current.select()}
              onKeyDown={handleKeyPress}
              fullWidth
              value={othersCost}
              onChange={(e) => {
                if (0 > e.target.value) {
                  return false;
                }
                othersCostSet(e.target.value);
              }}
              onBlur={(e) => {
                if (e.target.value === "" || parseFloat(e.target.value) < 0) {
                  othersCostSet(0);
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={2} sm={12}>
            <TextField
              label="TOTAL COST"
              name="totalCost"
              autoComplete="off"
              size="small"
              type="number"
              disabled
              onKeyDown={handleKeyPress}
              fullWidth
              value={totalCost}
              onChange={(e) => totalCostSet(e.target.value)}
            />
          </Grid>
        </Grid>

        <Grid
          container
          columnSpacing={2}
          rowSpacing={2}
          style={{ marginBottom: "15px", marginTop: "15px" }}
        >
          <Grid item xs={12} md={6}>
            <h4 className="text-base mb-5">PRODUCTION ITEM DETAILS</h4>

            <Grid container columnSpacing={2} rowSpacing={2}>
              <Grid item xs={12} sm={12} md={6} className="plus-link-div">
                {selectedItem != null && itemBarStock != null && (
                  <p
                    className={`${
                      itemBarStock > 0 ? "stock-availity" : "stock-unavaility"
                    } absolute right-8 -top-1`}
                  >
                    {`Available: ${itemBarStock} ${
                      selectedItem?.unit?.name || ""
                    }`}
                  </p>
                )}

                <Link to="/item-management/item" className="plus-link">
                  +
                </Link>
                <Autocomplete
                  autoHighlight={true}
                  openOnFocus={true}
                  size="small"
                  id="combo-box-item"
                  options={items}
                  value={selectedItem}
                  onKeyDown={handleKeyPress}
                  onChange={(e, obj) => selectedItemSet(obj)}
                  getOptionLabel={(option) => option.name}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      inputRef={itemSelectionRef}
                      {...params}
                      label="SELECT ITEM"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  label="QTY"
                  name="qty"
                  autoComplete="off"
                  size="small"
                  type="number"
                  inputRef={itemQtyRef}
                  onFocus={() => itemQtyRef.current.select()}
                  onKeyDown={handleKeyPress}
                  fullWidth
                  value={itemQty}
                  onChange={(e) => itemQtySet(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  label="RATE"
                  name="rate"
                  autoComplete="off"
                  size="small"
                  type="number"
                  inputRef={itemRateRef}
                  onFocus={() => itemRateRef.current.select()}
                  onKeyDown={handleKeyPress}
                  fullWidth
                  value={itemRate}
                  onChange={(e) => itemRateSet(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  label="AMOUNT"
                  name="amount"
                  autoComplete="off"
                  size="small"
                  type="number"
                  disabled
                  inputRef={itemAmountRef}
                  onFocus={() => itemAmountRef.current.select()}
                  onKeyDown={handleKeyPress}
                  fullWidth
                  value={itemAmount}
                  onChange={(e) => itemAmountSet(e.target.value)}
                />
              </Grid>
              <Stack direction="row" spacing={2}>
                {/* add to cart button row */}
                <Button
                  onClick={() => itemAddToCart()}
                  variant="outlined"
                  style={{ margin: "15px", color: "blue" }}
                  loading={isSaving}
                >
                  {cartIndex != null ? "Cart Update" : "Add To Cart"}
                </Button>
              </Stack>
            </Grid>
            <Grid container>
              <Stack direction="row" spacing={2}>
                {itemCartData.length > 0 ? (
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
                            RATE
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
                        {itemCartData.map((row, index) => (
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
                                onClick={() => itemCartUpdate(row, index)}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <DeleteForeverIcon
                                style={{
                                  color: "red",
                                  cursor: "pointer",
                                  display: isSaving ? "none" : "block",
                                }}
                                onClick={() => itemCartDelete(index)}
                              />
                            </TableCell>
                          </TableRow>
                        ))}

                        <TableRow>
                          <TableCell
                            colSpan={4}
                            align="right"
                            style={{ fontWeight: "bold" }}
                          >
                            TOTAL AMOUNT :
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{ fontWeight: "bold" }}
                          >
                            {amountFormat(
                              parseFloat(itemTotalAmount).toFixed(2)
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  ""
                )}
              </Stack>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <h4 className="text-base mb-5">PRODUCTION MATERIAL DETAILS</h4>

            <Grid container columnSpacing={2} rowSpacing={2}>
              <Grid item xs={12} sm={12} md={6} className="plus-link-div">
                {selectedMaterial != null && materialBarStock != null && (
                  <p
                    className={`${
                      materialBarStock > 0
                        ? "stock-availity"
                        : "stock-unavaility"
                    } absolute right-8 -top-1`}
                  >
                    {`Available: ${materialBarStock} ${
                      selectedMaterial?.unit?.name || ""
                    }`}
                  </p>
                )}

                <Link to="/item-management/item" className="plus-link">
                  +
                </Link>
                <Autocomplete
                  autoHighlight={true}
                  openOnFocus={true}
                  size="small"
                  id="combo-box-item"
                  options={items}
                  value={selectedMaterial}
                  onKeyDown={handleKeyPress}
                  onChange={(e, obj) => selectedMaterialSet(obj)}
                  getOptionLabel={(option) => option.name}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      inputRef={materialSelectionRef}
                      {...params}
                      label="SELECT ITEM"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  label="QTY"
                  name="qty"
                  autoComplete="off"
                  size="small"
                  type="number"
                  inputRef={materialQtyRef}
                  onKeyDown={handleKeyPress}
                  onFocus={() => materialQtyRef.current.select()}
                  fullWidth
                  value={materialQty}
                  onChange={(e) => materialQtySet(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  label="RATE"
                  name="rate"
                  autoComplete="off"
                  size="small"
                  type="number"
                  inputRef={materialRateRef}
                  onKeyDown={handleKeyPress}
                  fullWidth
                  onFocus={() => materialRateRef.current.select()}
                  value={materialRate}
                  onChange={(e) => materialRateSet(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  label="AMOUNT"
                  name="amount"
                  autoComplete="off"
                  size="small"
                  type="number"
                  disabled
                  inputRef={materialAmountRef}
                  onFocus={() => materialAmountRef.current.select()}
                  onKeyDown={handleKeyPress}
                  fullWidth
                  value={materialAmount}
                  onChange={(e) => materialAmountSet(e.target.value)}
                />
              </Grid>

              <Stack direction="row" spacing={2}>
                {/* add to cart button row */}
                <Button
                  onClick={() => materialAddToCart()}
                  variant="outlined"
                  style={{ margin: "15px", color: "blue" }}
                  loading={isSaving}
                >
                  {cartIndex != null ? "Cart Update" : "Add To Cart"}
                </Button>
              </Stack>
            </Grid>
            <Grid container>
              <Stack direction="row" spacing={2}>
                {materialCartData.length > 0 ? (
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
                            RATE
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
                        {materialCartData.map((row, index) => (
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
                                onClick={() => materialCartUpdate(row, index)}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <DeleteForeverIcon
                                style={{
                                  color: "red",
                                  cursor: "pointer",
                                  display: isSaving ? "none" : "block",
                                }}
                                onClick={() => materialCartDelete(index)}
                              />
                            </TableCell>
                          </TableRow>
                        ))}

                        <TableRow>
                          <TableCell
                            colSpan={4}
                            align="right"
                            style={{ fontWeight: "bold" }}
                          >
                            TOTAL AMOUNT :
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{ fontWeight: "bold" }}
                          >
                            {amountFormat(parseFloat(subTotalCost).toFixed(2))}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  ""
                )}
              </Stack>
            </Grid>
          </Grid>
        </Grid>

        <Stack direction="row" spacing={2}>
          <Button
            onClick={() => postProduction()}
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
    </div>
  );
};

export default Production;
