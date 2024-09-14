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
import Button from "@mui/joy/Button";

import "../Accounts/style.css";
import PrintIcon from "@mui/icons-material/Print";
import CompanyProfile from "../../components/common/companyProfile/CompanyProfile";
import ReactToPrint from "react-to-print";
import axios from "axios";
import { API_URL } from "../../../config.json";
import { authHeaders, dateFormat, amountFormat } from "../../../utils";
import Swal from "sweetalert2";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const ProfitLoss = () => {
  const [selectedFromDate, selectedFromDateSet] = useState(dayjs());
  const [selectedToDate, selectedToDateSet] = useState(dayjs());

  const [loading, loadingSet] = useState(false);
  const filterType = [{ type: "Date Wise" }, { type: "Life Time" }];
  const [selectFilterType, selectFilterTypeSet] = useState({
    type: "Date Wise",
  });
  const reportRef = useRef();
  let [print, printSet] = useState(false);

  //get with details expense:
  const [profitLossData, profitLossDataSet] = useState(null);

  useEffect(() => {}, [selectFilterType]);

  let ReportDom = React.forwardRef((props, ref) => {
    return (
      <div ref={ref} className="-mt-4">
        <span className="print-source">
          <CompanyProfile />
        </span>

        {/* with details table */}
        <Paper style={{ margin: "12px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              {print && (
                <div className="print-content p-4">
                  <TableContainer className="report-dom">
                    <Table size="small" aria-label="a dense table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="left" width="3%">
                            PARTICULAR INCOME
                          </TableCell>
                          <TableCell align="right" width="5%">
                            AMOUNT
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            Item Profit
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {profitLossData != null &&
                              amountFormat(
                                parseFloat(
                                  profitLossData.report.itemProfit
                                ).toFixed(2)
                              )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            Bar Item Profit
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {profitLossData != null &&
                              amountFormat(
                                parseFloat(
                                  profitLossData.report.barItemProfit
                                ).toFixed(2)
                              )}
                          </TableCell>
                        </TableRow>
                        <TableRow style={{ background: "#c3c3c3" }}>
                          <TableCell style={{ textAlign: "left" }}>
                            Total Item Sale Profit
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {profitLossData != null &&
                              amountFormat(
                                parseFloat(
                                  profitLossData.report.totalItemProfit
                                ).toFixed(2)
                              )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            Booking Amount
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {profitLossData != null &&
                              amountFormat(
                                parseFloat(
                                  profitLossData.report.bookingAmount
                                ).toFixed(2)
                              )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            Premium Service Amount
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {profitLossData != null &&
                              amountFormat(
                                parseFloat(
                                  profitLossData.report.premiumServiceAmount
                                ).toFixed(2)
                              )}
                          </TableCell>
                        </TableRow>

                        <TableRow
                          style={{
                            background: `${
                              profitLossData.report.netProfit <= 0
                                ? "red"
                                : "#76f576"
                            }`,
                          }}
                        >
                          <TableCell
                            style={{
                              textAlign: "left",
                              fontSize: "18px",
                              fontWeight: "bold",
                            }}
                          >
                            Net Profit
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "right",
                              fontSize: "18px",
                              fontWeight: "bold",
                            }}
                          >
                            {profitLossData != null &&
                              amountFormat(
                                parseFloat(
                                  profitLossData.report.netProfit
                                ).toFixed(2)
                              )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              {print && (
                <div className="print-content p-4">
                  <TableContainer className="report-dom">
                    <Table size="small" aria-label="a dense table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="left" width="3%">
                            PARTICULAR EXPENSE
                          </TableCell>
                          <TableCell align="right" width="5%">
                            AMOUNT
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            Expense Amount
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {profitLossData != null &&
                              amountFormat(
                                parseFloat(
                                  profitLossData.report.expenseAmount
                                ).toFixed(2)
                              )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            HouseKeeping Used Amount
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {profitLossData != null &&
                              amountFormat(
                                parseFloat(
                                  profitLossData.report.houseKeepingUsedAmount
                                ).toFixed(2)
                              )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            Premium Service Expense Amount
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {profitLossData != null &&
                              amountFormat(
                                parseFloat(
                                  profitLossData.report
                                    .premiumServiceExpenseAmount
                                ).toFixed(2)
                              )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            Salary Payment Amount
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {profitLossData != null &&
                              amountFormat(
                                parseFloat(
                                  profitLossData.report.salaryPaymentAmount
                                ).toFixed(2)
                              )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )}
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  });

  //handle report:
  const handleReport = () => {
    getProfitLossData();
  };

  const getProfitLossData = async () => {
    try {
      loadingSet(true);

      if (selectFilterType === null) {
        Swal.fire({
          title: "Filter Type is Required.",
          icon: "warning",
        });
        return false;
      }

      const response = await axios.get(
        `${API_URL}api/v1/Report/get-profit-loss`,
        {
          headers: authHeaders,
          params: {
            fromDate:
              selectedFromDate === null || selectFilterType.type === "Life Time"
                ? null
                : selectedFromDate.format(dateFormat),
            toDate:
              selectedToDate === null || selectFilterType.type === "Life Time"
                ? null
                : selectedToDate.format(dateFormat),
          },
        }
      );
      profitLossDataSet(response.data);

      printSet(true);
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

  return (
    <div>
      <Paper className="m-3 p-3">
        <Typography
          variant="h6"
          className="MuiTypography-h6 mb-3"
          style={{ marginBottom: "8px" }}
        >
          PROFIT LOSS REPORT
        </Typography>

        <Grid
          container
          spacing={2}
          style={{ paddingBottom: "5px", paddingTop: "5px" }}
        >
          <Grid item xs={12} md={2} sm={2}>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              size="small"
              fullWidth
              id="combo-box-filter"
              options={filterType}
              value={selectFilterType}
              onChange={(e, value) => {
                selectFilterTypeSet(value);
              }}
              getOptionLabel={(option) => option.type}
              renderInput={(params) => (
                <TextField {...params} label="FILTER TYPE" />
              )}
            />
          </Grid>
          {selectFilterType != null &&
            selectFilterType.type === "Date Wise" && (
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
            )}
          {selectFilterType != null &&
            selectFilterType.type === "Date Wise" && (
              <Grid item xs={12} md={2} sm={2}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="TO DATE"
                    slotProps={{ field: { size: "small" } }}
                    value={selectedToDate}
                    sx={{ width: "100%" }}
                    onChange={(date) => selectedToDateSet(date)}
                    format={dateFormat}
                    renderInput={(params) => (
                      <TextField fullWidth {...params} />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            )}

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

export default ProfitLoss;
