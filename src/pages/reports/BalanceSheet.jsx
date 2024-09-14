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

const BalanceSheet = () => {
  const [selectedFromDate, selectedFromDateSet] = useState(dayjs());
  const [selectedToDate, selectedToDateSet] = useState(dayjs());
  const [loading, loadingSet] = useState(false);
  const filterType = [
    // { type: "Date Wise" },
    { type: "Life Time" },
  ];
  const [selectFilterType, selectFilterTypeSet] = useState({
    type: "Life Time",
  });
  const reportRef = useRef();
  let [print, printSet] = useState(false);

  //   Assets related state management:
  const [cashBankBalanceAmount, cashBankBalanceAmountSet] = useState(null);
  const [guestBalanceAmount, guestBalanceAmountSet] = useState(null);
  const [customerBalanceAmount, customerBalanceAmountSet] = useState(null);
  const [fixedAssetBalanceAmount, fixedAssetBalanceAmountSet] = useState(null);
  const [houseKeepingStockBalanceAmount, houseKeepingStockBalanceAmountSet] =
    useState(null);
  const [barStockBalanceAmount, barStockBalanceAmountSet] = useState(null);
  const [restaurantStockBalanceAmount, restaurantStockBalanceAmountSet] =
    useState(null);

  //   Liabilities related state management:
  const [supplierBalanceAmount, supplierBalanceAmountSet] = useState(null);
  const [capitalBalanceAmount, capitalBalanceAmountSet] = useState(null);
  const [loanBalanceAmount, loanBalanceAmountSet] = useState(null);
  const [profitLossAmount, profitLossAmountSet] = useState(null);

  // total assets and total liabilities:
  const [totalAsset, totalAssetSet] = useState(null);
  const [totalLiabilities, totalLiabilitiesSet] = useState(null);

  const [defferenceInOpening, defferenceInOpeningSet] = useState(null);
  const [defferenceInOpeningBalance, defferenceInOpeningBalanceSet] =
    useState(null);

  useEffect(() => {
    const deffBalance =
      parseFloat(totalAsset) - parseFloat(defferenceInOpening);
    defferenceInOpeningBalanceSet(deffBalance);
  }, [defferenceInOpening, totalAsset]);

  useEffect(() => {
    const total =
      parseFloat(cashBankBalanceAmount) +
      parseFloat(guestBalanceAmount) +
      parseFloat(customerBalanceAmount) +
      parseFloat(fixedAssetBalanceAmount) +
      parseFloat(houseKeepingStockBalanceAmount) +
      parseFloat(barStockBalanceAmount) +
      parseFloat(restaurantStockBalanceAmount);
    totalAssetSet(total);
  }, [
    cashBankBalanceAmount,
    guestBalanceAmount,
    customerBalanceAmount,
    fixedAssetBalanceAmount,
    houseKeepingStockBalanceAmount,
    barStockBalanceAmount,
    restaurantStockBalanceAmount,
  ]);

  useEffect(() => {
    const total =
      parseFloat(profitLossAmount) +
      parseFloat(loanBalanceAmount) +
      parseFloat(capitalBalanceAmount) +
      parseFloat(supplierBalanceAmount) +
      parseFloat(defferenceInOpeningBalance);
    totalLiabilitiesSet(total);
  }, [
    profitLossAmount,
    loanBalanceAmount,
    capitalBalanceAmount,
    supplierBalanceAmount,
    defferenceInOpeningBalance
  ]);

  // Difference In Opening
  useEffect(() => {
    const total =
      parseFloat(profitLossAmount) +
      parseFloat(loanBalanceAmount) +
      parseFloat(capitalBalanceAmount) +
      parseFloat(supplierBalanceAmount);
    defferenceInOpeningSet(total);
  }, [
    profitLossAmount,
    loanBalanceAmount,
    capitalBalanceAmount,
    supplierBalanceAmount,
  ]);

  let ReportDom = React.forwardRef((props, ref) => {
    return (
      <div ref={ref} className="-mt-4">
        <span className="print-source">
          <CompanyProfile />
        </span>

        {/* with details table */}
        <Paper style={{ margin: "12px" }}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              {print && (
                <div className="print-content p-4">
                  <TableContainer className="report-dom">
                    <Table size="small" aria-label="a dense table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="left" width="5%">
                            LIABILITIES
                          </TableCell>
                          <TableCell align="right" width="5%">
                            AMOUNT
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            Supplier Balance
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {supplierBalanceAmount != null &&
                              amountFormat(
                                parseFloat(supplierBalanceAmount).toFixed(2)
                              )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            Capital Balance
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {capitalBalanceAmount != null &&
                              amountFormat(
                                parseFloat(capitalBalanceAmount).toFixed(2)
                              )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            Loan Balance
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {loanBalanceAmount != null &&
                              amountFormat(
                                parseFloat(loanBalanceAmount).toFixed(2)
                              )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            Profit Loss
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {profitLossAmount != null &&
                              amountFormat(
                                parseFloat(profitLossAmount).toFixed(2)
                              )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            Difference In Opening
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {profitLossAmount != null &&
                              amountFormat(
                                parseFloat(defferenceInOpeningBalance).toFixed(
                                  2
                                )
                              )}
                          </TableCell>
                        </TableRow>

                        <TableRow
                          style={{
                            background: `#c6d3cf`,
                          }}
                        >
                          <TableCell
                            style={{
                              textAlign: "left",
                              fontSize: "18px",
                              fontWeight: "bold",
                            }}
                          >
                            Total Liabilities
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "right",
                              fontSize: "18px",
                              fontWeight: "bold",
                            }}
                          >
                            {totalLiabilities != null &&
                              amountFormat(
                                parseFloat(totalLiabilities).toFixed(2)
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
                          <TableCell align="left" width="5%">
                            ASSETS
                          </TableCell>
                          <TableCell align="right" width="5%">
                            AMOUNT
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            Cash & Bank Balance
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {cashBankBalanceAmount != null &&
                              amountFormat(
                                parseFloat(cashBankBalanceAmount).toFixed(2)
                              )}
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            Guest Balance
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {guestBalanceAmount != null &&
                              amountFormat(
                                parseFloat(guestBalanceAmount).toFixed(2)
                              )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            Customer Balance
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {customerBalanceAmount != null &&
                              amountFormat(
                                parseFloat(customerBalanceAmount).toFixed(2)
                              )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            Fixed Assets
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {fixedAssetBalanceAmount != null &&
                              amountFormat(
                                parseFloat(fixedAssetBalanceAmount).toFixed(2)
                              )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            House Keeping Stock Value
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {houseKeepingStockBalanceAmount != null &&
                              amountFormat(
                                parseFloat(
                                  houseKeepingStockBalanceAmount
                                ).toFixed(2)
                              )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            Bar Stock Value
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {barStockBalanceAmount != null &&
                              amountFormat(
                                parseFloat(barStockBalanceAmount).toFixed(2)
                              )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            Restaurant Stock Value
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {restaurantStockBalanceAmount != null &&
                              amountFormat(
                                parseFloat(
                                  restaurantStockBalanceAmount
                                ).toFixed(2)
                              )}
                          </TableCell>
                        </TableRow>
                        <TableRow
                          style={{
                            background: `#c6d3cf`,
                          }}
                        >
                          <TableCell style={{ textAlign: "left" }}>
                            Total Assets
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {restaurantStockBalanceAmount != null &&
                              amountFormat(parseFloat(totalAsset).toFixed(2))}
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
    //   Assets related function call start:
    getCashBankBalanceData();
    getGuestBalanceData();
    getCustomerBalanceData();
    getFixedAssetBalanceData();
    getHouseKeepingStockBalanceData();
    getBarStockBalanceData();
    getRestaurantStockBalanceData();

    //   Assets related function call start:
    getSupplierBalanceData();
    getCapitalBalanceData();
    getLoanBalanceData();
    getProfitLossData();
  };

  //   Liabilities related api call start:

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
            ReportType: "headTotal",
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
      printSet(true);
      loadingSet(false);
      profitLossAmountSet(response.data.report.netProfit);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const getLoanBalanceData = async () => {
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
        `${API_URL}api/v1/Report/get-loan-balance`,
        {
          headers: authHeaders,
          params: {
            ReportType: "headTotal",
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
      printSet(true);
      loadingSet(false);
      loanBalanceAmountSet(response.data.totalBalance);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const getCapitalBalanceData = async () => {
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
        `${API_URL}api/v1/Report/get-capital-balance`,
        {
          headers: authHeaders,
          params: {
            ReportType: "headTotal",
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
      printSet(true);
      loadingSet(false);
      capitalBalanceAmountSet(response.data.totalBalance);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const getSupplierBalanceData = async () => {
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
        `${API_URL}api/v1/Report/get-supplier-balance`,
        {
          headers: authHeaders,
          params: {
            ReportType: "headTotal",
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
      printSet(true);
      loadingSet(false);
      supplierBalanceAmountSet(response.data.totalBalance);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  //   Liabilities related api call end:

  //   Assets related api call start:
  const getRestaurantStockBalanceData = async () => {
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
        `${API_URL}api/v1/Inventory/get-item-stock-report`,
        {
          headers: authHeaders,
          params: {
            ReportType: "headTotal",
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
      printSet(true);
      loadingSet(false);
      restaurantStockBalanceAmountSet(response.data.totalStockValue);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const getBarStockBalanceData = async () => {
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
        `${API_URL}api/v1/Inventory/get-bar-item-stock-report`,
        {
          headers: authHeaders,
          params: {
            ReportType: "headTotal",
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
      printSet(true);
      loadingSet(false);
      barStockBalanceAmountSet(response.data.totalStockValue);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const getHouseKeepingStockBalanceData = async () => {
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
        `${API_URL}api/v1/Inventory/get-housekeeping-item-stock-report`,
        {
          headers: authHeaders,
          params: {
            ReportType: "headTotal",
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
      printSet(true);
      loadingSet(false);
      houseKeepingStockBalanceAmountSet(response.data.totalStockValue);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const getFixedAssetBalanceData = async () => {
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
        `${API_URL}api/v1/Report/get-fixed-asset-balance`,
        {
          headers: authHeaders,
          params: {
            ReportType: "headTotal",
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
      printSet(true);
      loadingSet(false);
      fixedAssetBalanceAmountSet(response.data.totalBalance);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const getCustomerBalanceData = async () => {
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
        `${API_URL}api/v1/Report/get-customer-balance`,
        {
          headers: authHeaders,
          params: {
            ReportType: "headTotal",
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
      printSet(true);
      loadingSet(false);
      customerBalanceAmountSet(response.data.totalBalance);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const getGuestBalanceData = async () => {
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
        `${API_URL}api/v1/Report/get-guest-balance`,
        {
          headers: authHeaders,
          params: {
            ReportType: "headTotal",
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
      printSet(true);
      loadingSet(false);
      guestBalanceAmountSet(response.data.totalBalance);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const getCashBankBalanceData = async () => {
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
        `${API_URL}api/v1/Report/get-cash-bank-balance`,
        {
          headers: authHeaders,
          params: {
            ReportType: "headTotal",
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
      printSet(true);
      loadingSet(false);
      cashBankBalanceAmountSet(response.data.totalBalance);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  //   Assets related api call end:

  return (
    <div>
      <Paper className="m-3 p-3">
        <Typography
          variant="h6"
          className="MuiTypography-h6 mb-3"
          style={{ marginBottom: "8px" }}
        >
          BALANCE SHEET
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

export default BalanceSheet;
