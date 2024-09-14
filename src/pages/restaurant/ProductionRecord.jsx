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

const ProductionRecord = () => {
  const [loading, loadingSet] = useState(false);

  const reportRef = useRef();
  let [print, printSet] = useState(false);
  const [selectedFromDate, selectedFromDateSet] = useState(dayjs());
  const [selectedToDate, selectedToDateSet] = useState(dayjs());
  const [combinedProductionData, combinedProductionDataSet] = useState([]);
  const [selectedFilterType, selectedFilterTypeSet] = useState({ type: "All" });
  const [selectedRecordType, selectedRecordTypeSet] = useState({
    type: "With Details",
  });

  //get with details expense:
  const [productionData, productionDataSet] = useState([]);
  const [grandTotal, grandTotalSet] = useState(0);
  const [users, usersSet] = useState([]);
  const [userSelect, userSelectSet] = useState(null);

  useEffect(() => {
    userSelectSet(null);
    selectedToDateSet(dayjs());
    selectedFromDateSet(dayjs());
  }, [selectedFilterType]);

  useEffect(() => {
    const total = productionData
      .map((singleItem) => singleItem.totalCost)
      .reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);
    grandTotalSet(total);
  }, [productionData]);

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
              `${API_URL}api/v1/Production/${row.id}`,
              { headers: authHeaders },
              { id: row.id }
            );
            Swal.fire({
              icon: "success",
              title: `${response.data.invoiceNo} is deleted Successfully`,
            });

            getProductionRecord();
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
                        OTHERS COST
                      </TableCell>
                      <TableCell align="left" width="5%">
                        SUB TOTAL COST
                      </TableCell>
                      <TableCell align="left" width="5%">
                        PROD ITEM NAME
                      </TableCell>
                      <TableCell align="left" width="5%">
                        PROD ITEM AMOUNT
                      </TableCell>
                      <TableCell align="left" width="5%">
                        PROD ITEM QTY
                      </TableCell>
                      <TableCell align="left" width="5%">
                        PROD ITEM RATE
                      </TableCell>
                      <TableCell align="left" width="5%">
                        USED ITEM NAME
                      </TableCell>
                      <TableCell align="left" width="5%">
                        USED ITEM AMOUNT
                      </TableCell>
                      <TableCell align="left" width="5%">
                        USED ITEM QTY
                      </TableCell>
                      <TableCell align="left" width="5%">
                        USED ITEM RATE
                      </TableCell>
                      <TableCell align="left" width="6%">
                        TOTAL COST
                      </TableCell>
                      <TableCell className="print-no" align="left" width="6%">
                        ACTIONS
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {combinedProductionData.map((productionItem, inx) => (
                      <>
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            {inx + parseFloat(1)}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {productionItem.invoiceNo}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(productionItem.othersCost).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(productionItem.subTotalCost).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {
                              productionItem.combinedDetails[0]?.productionItem
                                ?.item?.name
                            }
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(
                                productionItem.combinedDetails[0]
                                  ?.productionItem?.amount
                              ).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {
                              productionItem.combinedDetails[0]?.productionItem
                                ?.qty
                            }
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(
                                productionItem.combinedDetails[0]
                                  ?.productionItem?.rate
                              ).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {
                              productionItem.combinedDetails[0]?.usedItem?.item
                                ?.name
                            }
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(
                                productionItem.combinedDetails[0]?.usedItem
                                  ?.amount
                              ).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {productionItem.combinedDetails[0]?.usedItem?.qty}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(
                                productionItem.combinedDetails[0]?.usedItem
                                  ?.rate
                              ).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(productionItem.totalCost).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell
                            className="print-no"
                            style={{ textAlign: "right" }}
                          >
                            <div className="flex items-center gap-3 justify-around">
                              <Link
                                to={{
                                  pathname: `/restaurant/production-invoice/${productionItem.id}`,
                                }}
                              >
                                <ReceiptIcon
                                  style={{ color: "blue", cursor: "pointer" }}
                                />
                              </Link>
                              <Link
                                to={{
                                  pathname: `/restaurant/production/${productionItem.id}`,
                                }}
                              >
                                <EditNoteIcon
                                  style={{ color: "green", cursor: "pointer" }}
                                />
                              </Link>
                              <DeleteForeverIcon
                                style={{ color: "red", cursor: "pointer" }}
                                onClick={() => handleDelete(productionItem)}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                        {productionItem.combinedDetails
                          .slice(1)
                          .map((detail, index) => (
                            <TableRow key={index}>
                              <TableCell colSpan={4}></TableCell>
                              <TableCell style={{ textAlign: "left" }}>
                                {detail.productionItem?.item?.name}
                              </TableCell>
                              <TableCell style={{ textAlign: "right" }}>
                                {amountFormat(
                                  parseFloat(
                                    detail.productionItem?.amount
                                  ).toFixed(2)
                                )}
                              </TableCell>
                              <TableCell style={{ textAlign: "right" }}>
                                {detail.productionItem?.qty}
                              </TableCell>
                              <TableCell style={{ textAlign: "right" }}>
                                {amountFormat(
                                  parseFloat(
                                    detail.productionItem?.rate
                                  ).toFixed(2)
                                )}
                              </TableCell>
                              <TableCell style={{ textAlign: "left" }}>
                                {detail.usedItem?.item?.name}
                              </TableCell>
                              <TableCell style={{ textAlign: "right" }}>
                                {amountFormat(
                                  parseFloat(detail.usedItem?.amount).toFixed(2)
                                )}
                              </TableCell>
                              <TableCell style={{ textAlign: "right" }}>
                                {detail.usedItem?.qty}
                              </TableCell>
                              <TableCell style={{ textAlign: "right" }}>
                                {amountFormat(
                                  parseFloat(detail.usedItem?.rate).toFixed(2)
                                )}
                              </TableCell>
                              <TableCell colSpan={2}></TableCell>
                            </TableRow>
                          ))}
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
                      <TableCell colSpan={2}></TableCell>
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
                      <TableCell align="left" width="5%">
                        INVOICE NO
                      </TableCell>
                      <TableCell align="left" width="5%">
                        OTHERS COST
                      </TableCell>

                      <TableCell align="left" width="5%">
                        SUB TOTAL COST
                      </TableCell>
                      <TableCell align="left" width="6%">
                        TOTAL COST
                      </TableCell>
                      <TableCell className="print-no" align="left" width="6%">
                        ACTIONS
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productionData.map((productionItem, inx) => (
                      <>
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            {inx + parseFloat(1)}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {productionItem.invoiceNo}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(productionItem.othersCost).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(productionItem.subTotalCost).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(productionItem.totalCost).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell
                            className="print-no"
                            style={{ textAlign: "right" }}
                          >
                            <div className="flex items-center gap-3 justify-around">
                              <Link
                                to={{
                                  pathname: `/restaurant/production-invoice/${productionItem.id}`,
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
                                  pathname: `/restaurant/production/${productionItem.id}`,
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
                                onClick={() => handleDelete(productionItem)}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      </>
                    ))}

                    <TableRow>
                      <TableCell
                        colSpan={5}
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

  //handle report:
  const handleReport = () => {
    getProductionRecord();
    printSet(true);
  };

  const getProductionRecord = async () => {
    try {
      loadingSet(true);
      let url = ``;
      if (selectedRecordType.type == "With Details") {
        url = `Production`;
      }
      if (selectedRecordType.type == "Without Details") {
        url = `Production/get-production-record`;
      }
      const response = await axios.get(`${API_URL}api/v1/${url}`, {
        headers: authHeaders,
        params: {
          UserId: userSelect != null ? userSelect.id : null,
          fromDate:
            selectedFromDate != null
              ? selectedFromDate.format(dateFormat)
              : null,
          toDate:
            selectedToDate != null ? selectedToDate.format(dateFormat) : null,
        },
      });

      //for without details
      productionDataSet(response.data);

      //for with details  vary vary importent logic
      const combinedProductionData = response.data.map((item) => {
        const combinedDetails = [];

        const maxLength = Math.max(
          item.productionItemDetails.length,
          item.productionUsedItemDetails.length
        );

        for (let i = 0; i < maxLength; i++) {
          combinedDetails.push({
            productionItem: item.productionItemDetails[i] || {},
            usedItem: item.productionUsedItemDetails[i] || {},
          });
        }

        return {
          ...item,
          combinedDetails,
        };
      });

      combinedProductionDataSet(combinedProductionData);
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

  useEffect(() => {
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

  const filterType = [{ type: "All" }, { type: "By User" }];
  const recordType = [{ type: "With Details" }, { type: "Without Details" }];

  return (
    <div>
      <Paper className="m-3 p-3">
        <Typography
          variant="h6"
          className="MuiTypography-h6 mb-3"
          style={{ marginBottom: "8px" }}
        >
          PRODUCTION RECORD
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
                productionDataSet([]);
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
                sx={{ width: "100%" }}
                value={selectedFromDate}
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

export default ProductionRecord;
