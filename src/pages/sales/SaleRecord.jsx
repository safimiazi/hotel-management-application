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
  Stack,
} from "@mui/material";
import "../Accounts/style.css";
import PrintIcon from "@mui/icons-material/Print";
import CompanyProfile from "../../components/common/companyProfile/CompanyProfile";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import axios from "axios";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { API_URL } from "../../../config.json";
import { amountFormat, authHeaders, dateFormat } from "../../../utils";
import Swal from "sweetalert2";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";

import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Link } from "react-router-dom";
import Button from "@mui/joy/Button";

const SaleRecord = () => {
  const [loading, loadingSet] = useState(false);

  const reportRef = useRef();
  let [print, printSet] = useState(false);
  const [customers, customersSet] = useState([]);
  const [selectedFromDate, selectedFromDateSet] = useState(dayjs());
  const [selectedToDate, selectedToDateSet] = useState(dayjs());
  const [selectedCustomer, selectedCustomerSet] = useState(null);
  const [selectedFilterType, selectedFilterTypeSet] = useState({ type: "All" });
  const [selectedRecordType, selectedRecordTypeSet] = useState({
    type: "With Details",
  });
  const [users, usersSet] = useState([]);
  const [selectedUser, selectedUserSet] = useState(null);

  //get with details expense:
  const [saleData, saleDataSet] = useState([]);
  const [grandTotal, grandTotalSet] = useState(0);

  useEffect(() => {
    selectedFromDateSet(dayjs());
    selectedToDateSet(dayjs());
    selectedRecordTypeSet({ type: "With Details" });
    selectedCustomerSet(null);
    selectedUserSet(null);
  }, []);

  useEffect(() => {
    const total = saleData
      .map((singleItem) => singleItem.totalAmount)
      .reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);
    grandTotalSet(total);
  }, [saleData]);

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
              `${API_URL}api/v1/ItemSales/${row.id}`,
              { headers: authHeaders },
              { id: row.id }
            );
            Swal.fire({
              icon: "success",
              title: `${response.data.invoiceNo} is deleted Successfully`,
            });

            getItemSales();
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
                    {saleData.map((saleItem, inx) => (
                      <>
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            {inx + parseFloat(1)}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {saleItem.invoiceNo}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {saleItem.customer.name}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {dayjs(saleItem.createdDate).format(dateFormat)}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {saleItem.creator.userName}
                          </TableCell>

                          <TableCell style={{ textAlign: "left" }}>
                            {saleItem.itemSalesDetails[0].item.name}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(
                                saleItem.itemSalesDetails[0].rate
                              ).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {saleItem.itemSalesDetails[0].qty}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(
                                saleItem.itemSalesDetails[0].amount
                              ).toFixed(2)
                            )}
                          </TableCell>

                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(saleItem.totalAmount).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell
                            className="print-no"
                            style={{ textAlign: "right" }}
                          >
                            <div className="flex items-center gap-3 justify-around">
                              <Link
                                to={{
                                  pathname: `/sales/sale-invoice/${saleItem.id}`,
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
                                  pathname: `/sales/sale/${saleItem.id}`,
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
                                onClick={() => handleDelete(saleItem)}
                              />
                            </div>
                          </TableCell>
                        </TableRow>

                        {saleItem.itemSalesDetails.slice(1).map((detail) => (
                          <TableRow>
                            <TableCell colSpan={5}></TableCell>

                            <TableCell style={{ textAlign: "left" }}>
                              {detail.item.name}
                            </TableCell>

                            <TableCell style={{ textAlign: "right" }}>
                              {amountFormat(parseFloat(detail.rate).toFixed(2))}
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
                    {saleData.map((saleItem, inx) => (
                      <>
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            {inx + parseFloat(1)}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {saleItem.invoiceNo}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {saleItem.customer.name}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {dayjs(saleItem.createdDate).format(dateFormat)}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {saleItem.creator.userName}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {saleItem.updater.userName}
                          </TableCell>

                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(saleItem.discountAmount).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(saleItem.dueAmount).toFixed(2)
                            )}
                          </TableCell>

                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(saleItem.othersCharge).toFixed(2)
                            )}
                          </TableCell>

                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(saleItem.taxAmount).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(saleItem.paidAmount).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {}

                            {amountFormat(
                              parseFloat(saleItem.subTotal).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(saleItem.totalAmount).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell
                            className="print-no"
                            style={{ textAlign: "right" }}
                          >
                            <div className="flex items-center gap-3 justify-around">
                              <Link
                                to={{
                                  pathname: `/sales/sale-invoice/${saleItem.id}`,
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
                                  pathname: `/sales/sale/${saleItem.id}`,
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
                                onClick={() => handleDelete(saleItem)}
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
    getCustomers();
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

  //handle report:
  const handleReport = () => {
    getItemSales();
    printSet(true);
  };
  const getItemSales = async () => {
    try {
      loadingSet(true);
      let url = ``;
      if (selectedRecordType.type == "With Details") {
        url = `ItemSales`;
      }
      if (selectedRecordType.type == "Without Details") {
        url = `ItemSales/get-item-sales-record`;
      }
      const response = await axios.get(`${API_URL}api/v1/${url}`, {
        headers: authHeaders,
        params: {
          CustomerId: selectedCustomer != null ? selectedCustomer.id : null,
          UserId: selectedUser != null ? selectedUser.id : null,
          fromDate:
            selectedFromDate != null
              ? selectedFromDate.format(dateFormat)
              : null,
          toDate:
            selectedToDate != null ? selectedToDate.format(dateFormat) : null,
        },
      });
      saleDataSet(response.data);
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
    { type: "By Customer" },
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
          SALE RECORD
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
                  value={selectedUser}
                  onChange={(e, value) => {
                    selectedUserSet(value);
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
            selectedFilterType.type === "By Customer" && (
              <Grid item xs={12} md={2} sm={2}>
                <Autocomplete
                  autoHighlight={true}
                  openOnFocus={true}
                  size="small"
                  id="combo-box-filter"
                  options={customers}
                  value={selectedCustomer}
                  onChange={(e, value) => {
                    selectedCustomerSet(value);
                  }}
                  getOptionLabel={(option) => option.name}
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} label="SELECT CUSTOMER" />
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
                saleDataSet([])
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
                fullWidth
                sx={{ width: "100%" }}
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

export default SaleRecord;
