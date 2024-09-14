import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Paper,
  Typography,
  Autocomplete,
  TextField,
} from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";

import "../Accounts/style.css";
import PrintIcon from "@mui/icons-material/Print";
import CompanyProfile from "../../components/common/companyProfile/CompanyProfile";
import ReactToPrint from "react-to-print";
import axios from "axios";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { API_URL } from "../../../config.json";
import { amountFormat, authHeaders, dateFormat } from "../../../utils";
import Swal from "sweetalert2";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Link } from "react-router-dom";
import Button from "@mui/joy/Button";

const HouseKeepingPurchaseRecord = () => {
  const [loading, loadingSet] = useState(false);

  const reportRef = useRef();
  let [print, printSet] = useState(false);
  const [suppliers, suppliersSet] = useState([]);
  const [selectedFromDate, selectedFromDateSet] = useState(dayjs());
  const [selectedToDate, selectedToDateSet] = useState(dayjs());
  const [selectedSupplier, selectedSupplierset] = useState(null);
  const [selectedFilterType, selectedFilterTypeSet] = useState({ type: "All" });
  const [selectedRecordType, selectedRecordTypeSet] = useState({
    type: "With Details",
  });

  //get with details expense:
  const [purchaseData, purchaseDataSet] = useState([]);
  const [grandTotal, grandTotalSet] = useState(0);
  const [users, usersSet] = useState([]);
  const [userSelect, userSelectSet] = useState(null);

  useEffect(() => {
    selectedSupplierset(null);
    userSelectSet(null);
    selectedToDateSet(dayjs());
    selectedFromDateSet(dayjs());
    selectedRecordTypeSet({ type: "With Details" });
  }, [selectedFilterType]);

  useEffect(() => {
    const total = purchaseData
      .map((singleItem) => singleItem.totalAmount)
      .reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);
    grandTotalSet(total);
  }, [purchaseData]);

  let ReportDom = React.forwardRef((props, ref) => {
    const handleDelete = async (row) => {
      Swal.fire({
        title: `Are you sure delete this?`,
        icon: "warning",
        buttons: true,
      }).then(async (res) => {
        try {
          if (res.isConfirmed) {
            let response = await axios.delete(
              `${API_URL}api/v1/HouseKeepingItemPurchase/${row.id}`,
              { headers: authHeaders },
              { id: row.id }
            );
            Swal.fire({
              icon: "success",
              title: `${response.data.invoiceNo} is deleted Successfully`,
            });

            getPurchase();
          }
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Failed ! Please try again later.",
            confirmButtonText: "OK",
          });
        }
      });
    };

    return (
      <div ref={ref} className="-mt-4">
        <span className="print-source">
          <CompanyProfile />
        </span>

        {/* with details table */}

        {print &&
          selectedRecordType != null &&
          selectedRecordType.type === "With Details" && (
            <div className="print-content p-4">
              <TableContainer className="report-dom">
                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" width="3%">
                        SL
                      </TableCell>
                      <TableCell align="left" width="5%">
                        INVOICE NO
                      </TableCell>
                      <TableCell align="left" width="5%">
                        SUPPLIER
                      </TableCell>

                      <TableCell align="left" width="5%">
                        ENTRY DATE
                      </TableCell>
                      <TableCell align="left" width="6%">
                        CREATED BY
                      </TableCell>
                      <TableCell align="left" width="6%">
                        ITEM
                      </TableCell>
                      <TableCell align="right" width="6%">
                        RATE
                      </TableCell>
                      <TableCell align="right" width="6%">
                        QTY
                      </TableCell>
                      <TableCell align="right" width="6%">
                        AMOUNT
                      </TableCell>

                      <TableCell align="right" width="6%">
                        TOTAL AMOUNT
                      </TableCell>
                      <TableCell className="print-no" align="center" width="6%">
                        ACTIONS
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {purchaseData.map((purchaseItem, inx) => (
                      <>
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            {inx + parseFloat(1)}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {purchaseItem.invoiceNo}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {purchaseItem.supplier.name}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {dayjs(purchaseItem.createdDate).format(dateFormat)}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {purchaseItem.creator.userName}
                          </TableCell>

                          <TableCell style={{ textAlign: "left" }}>
                            {purchaseItem.itemPurchaseDetails[0].item.name}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(
                                purchaseItem.itemPurchaseDetails[0].rate
                              ).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {purchaseItem.itemPurchaseDetails[0].qty}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(
                                purchaseItem.itemPurchaseDetails[0].amount
                              ).toFixed(2)
                            )}
                          </TableCell>

                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(purchaseItem.totalAmount).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell
                            className="print-no"
                            style={{ textAlign: "right" }}
                          >
                            <div className="flex items-center gap-3 justify-around">
                              <Link
                                to={{
                                  pathname: `/house-keeping/house-keeping-purchase-invoice/${purchaseItem.id}`,
                                }}
                              >
                                <ReceiptIcon
                                  style={{
                                    color: "blue",
                                    cursor: "pointer",
                                  }}
                                />
                              </Link>
                              <Link
                                to={{
                                  pathname: `/house-keeping/house-keeping-item-purchase/${purchaseItem.id}`,
                                }}
                              >
                                <EditNoteIcon
                                  style={{
                                    color: "green",
                                    cursor: "pointer",
                                  }}
                                />
                              </Link>
                              <DeleteForeverIcon
                                style={{
                                  color: "red",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleDelete(purchaseItem)}
                              />
                            </div>
                          </TableCell>
                        </TableRow>

                        {purchaseItem.itemPurchaseDetails
                          .slice(1)
                          .map((detail) => (
                            <TableRow>
                              <TableCell colSpan={5}></TableCell>

                              <TableCell style={{ textAlign: "left" }}>
                                {detail.item.name}
                              </TableCell>

                              <TableCell style={{ textAlign: "right" }}>
                                {amountFormat(
                                  parseFloat(detail.rate).toFixed(2)
                                )}
                              </TableCell>
                              <TableCell style={{ textAlign: "right" }}>
                                {detail.qty}
                              </TableCell>
                              <TableCell style={{ textAlign: "right" }}>
                                {amountFormat(
                                  parseFloat(detail.amount).toFixed(2)
                                )}
                              </TableCell>
                              <TableCell colSpan={2}></TableCell>
                            </TableRow>
                          ))}
                      </>
                    ))}

                    <TableRow>
                      <TableCell
                        colSpan={9}
                        style={{ fontWeight: "bold", textAlign: "right" }}
                      >
                        Grand Total :
                      </TableCell>
                      <TableCell
                        style={{ fontWeight: "bold", textAlign: "right" }}
                      >
                        {amountFormat(parseFloat(grandTotal).toFixed(2))}
                      </TableCell>
                      <TableCell colSpan={1}></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
        {print &&
          selectedRecordType != null &&
          selectedRecordType.type === "Without Details" && (
            <div className="print-content p-4">
              <TableContainer className="report-dom">
                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" width="3%">
                        SL
                      </TableCell>
                      <TableCell align="left" width="6%">
                        INVOICE NO
                      </TableCell>
                      <TableCell align="left" width="5%">
                        SUPPLIER
                      </TableCell>

                      <TableCell align="left" width="5%">
                        ENTRY DATE
                      </TableCell>
                      <TableCell align="left" width="6%">
                        CREATED BY
                      </TableCell>
                      <TableCell align="left" width="6%">
                        UPDATED BY
                      </TableCell>
                      <TableCell align="right" width="8%">
                        DISCOUNT AMOUNT
                      </TableCell>
                      <TableCell align="right" width="6%">
                        DUE AMOUNT
                      </TableCell>
                      <TableCell align="right" width="8%">
                        OTHERS CHARGE
                      </TableCell>
                      <TableCell align="right" width="6%">
                        TAX AMOUNT
                      </TableCell>
                      <TableCell align="right" width="6%">
                        PAID AMOUNT
                      </TableCell>
                      <TableCell align="right" width="6%">
                        SUB TOTAL
                      </TableCell>
                      <TableCell align="right" width="6%">
                        TOTAL AMOUNT
                      </TableCell>
                      <TableCell className="print-no" align="center" width="6%">
                        ACTIONS
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {purchaseData.map((purchaseItem, inx) => (
                      <>
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            {inx + parseFloat(1)}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {purchaseItem.invoiceNo}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {purchaseItem.supplier.name}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {dayjs(purchaseItem.createdDate).format(dateFormat)}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {purchaseItem.creator.userName}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {purchaseItem.updater.userName}
                          </TableCell>

                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(purchaseItem.discountAmount).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(purchaseItem.dueAmount).toFixed(2)
                            )}
                          </TableCell>

                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(purchaseItem.othersCharge).toFixed(2)
                            )}
                          </TableCell>

                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(purchaseItem.taxAmount).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(purchaseItem.paidAmount).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(purchaseItem.subTotal).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(purchaseItem.totalAmount).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell
                            className="print-no"
                            style={{ textAlign: "right" }}
                          >
                            <div className="flex items-center gap-3 justify-around">
                              <Link
                                to={{
                                  pathname: `/house-keeping/house-keeping-purchase-invoice/${purchaseItem.id}`,
                                }}
                              >
                                <ReceiptIcon
                                  style={{
                                    color: "blue",
                                    cursor: "pointer",
                                  }}
                                />
                              </Link>
                              <Link
                                to={{
                                  pathname: `/house-keeping/house-keeping-item-purchase/${purchaseItem.id}`,
                                }}
                              >
                                <EditNoteIcon
                                  style={{
                                    color: "green",
                                    cursor: "pointer",
                                  }}
                                />
                              </Link>
                              <DeleteForeverIcon
                                style={{
                                  color: "red",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleDelete(purchaseItem)}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      </>
                    ))}

                    <TableRow>
                      <TableCell
                        colSpan={12}
                        style={{ fontWeight: "bold", textAlign: "right" }}
                      >
                        Grand Total :
                      </TableCell>
                      <TableCell
                        style={{ fontWeight: "bold", textAlign: "right" }}
                      >
                        {amountFormat(parseFloat(grandTotal).toFixed(2))}
                      </TableCell>
                      <TableCell colSpan={1}></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
      </div>
    );
  });

  useEffect(() => {
    getSuppliers();
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}api/Auth/get-branch-users`, {
        headers: authHeaders,
      });
      usersSet(response.data);
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

  //handle report:
  const handleReport = () => {
    getPurchase();
    printSet(true);
  };
  const getPurchase = async () => {
    try {
      loadingSet(true);
      let url = ``;
      if (selectedRecordType.type == "With Details") {
        url = `HouseKeepingItemPurchase`;
      }
      if (selectedRecordType.type == "Without Details") {
        url = `HouseKeepingItemPurchase/get-item-purchase-record`;
      }
      const response = await axios.get(`${API_URL}api/v1/${url}`, {
        headers: authHeaders,
        params: {
          SupplierId: selectedSupplier != null ? selectedSupplier.id : null,
          UserId: userSelect != null ? userSelect.id : null,
          fromDate:
            selectedFromDate != null
              ? selectedFromDate.format(dateFormat)
              : null,
          toDate:
            selectedToDate != null ? selectedToDate.format(dateFormat) : null,
        },
      });
      purchaseDataSet(response.data);
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

  const filterType = [
    { type: "All" },
    { type: "By Supplier" },
    { type: "By User" },
  ];
  const recordType = [{ type: "With Details" }, { type: "Without Details" }];

  return (
    <div>
      <Paper className="m-3 p-3">
        <Typography
          variant="h6"
          className="MuiTypography-h6 mb-3"
          style={{ marginBottom: "8px" }}
        >
          HOUSE KEEPING PURCHASE RECORD
        </Typography>

        <Grid
          container
          spacing={3}
          style={{ paddingBottom: "5px", paddingTop: "5px" }}
        >
          <Grid item xs={12} md={2} sm={2}>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              size="small"
              id="combo-box-filter"
              options={filterType}
              value={selectedFilterType}
              onChange={(e, value) => {
                selectedFilterTypeSet(value);
              }}
              getOptionLabel={(option) => option.type}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="FILTER TYPE" />
              )}
            />
          </Grid>

          {selectedFilterType != null &&
            selectedFilterType.type === "By User" && (
              <Grid item xs={12} md={2} sm={2}>
                <Autocomplete
                  autoHighlight={true}
                  openOnFocus={true}
                  size="small"
                  id="combo-box-filter"
                  options={users}
                  value={userSelect}
                  onChange={(e, value) => {
                    userSelectSet(value);
                  }}
                  getOptionLabel={(option) => option.userName}
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} label="SELECT USER" />
                  )}
                />
              </Grid>
            )}

          {selectedFilterType != null &&
            selectedFilterType.type === "By Supplier" && (
              <Grid item xs={12} md={2} sm={2}>
                <Autocomplete
                  autoHighlight={true}
                  openOnFocus={true}
                  size="small"
                  id="combo-box-filter"
                  options={suppliers}
                  value={selectedSupplier}
                  onChange={(e, value) => {
                    selectedSupplierset(value);
                  }}
                  getOptionLabel={(option) => option.name}
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} label="SUPPLIER" />
                  )}
                />
              </Grid>
            )}
          <Grid item xs={12} md={2} sm={2}>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              size="small"
              id="combo-box-filter"
              options={recordType}
              value={selectedRecordType}
              onChange={(e, value) => {
                selectedRecordTypeSet(value);
                purchaseDataSet([]);
              }}
              getOptionLabel={(option) => option.type}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="RECORD TYPE" />
              )}
            />
          </Grid>

          <Grid item xs={12} md={2} sm={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="FROM DATE"
                slotProps={{ field: { size: "small" } }}
                fullWidth
                value={selectedFromDate}
                sx={{ width: "100%" }}
                onChange={(date) => selectedFromDateSet(date)}
                format={dateFormat}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={2} sm={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="TO DATE"
                slotProps={{ field: { size: "small" } }}
                value={selectedToDate}
                sx={{ width: "100%" }}
                fullWidth
                onChange={(date) => selectedToDateSet(date)}
                format={dateFormat}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={2}>
            <Button
              onClick={() => handleReport()}
              variant="outlined"
              loading={loading}
              style={{ background: "black", color: "white" }}
            >
              Report
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {print ? (
        <Grid container>
          <Grid item xs={12} sm={12} className="mx-3 p-3">
            <Paper
              style={{
                borderRadius: "0px",
                paddingLeft: "10px",
                marginTop: "-18px",
              }}
            >
              <ReactToPrint
                trigger={() => (
                  <button>
                    <PrintIcon />
                  </button>
                )}
                content={() => reportRef.current}
              />
            </Paper>
          </Grid>
        </Grid>
      ) : (
        ""
      )}

      <ReportDom ref={reportRef} />
    </div>
  );
};

export default HouseKeepingPurchaseRecord;
