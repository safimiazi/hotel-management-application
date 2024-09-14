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

import "../Accounts/style.css";
import PrintIcon from "@mui/icons-material/Print";
import CompanyProfile from "../../components/common/companyProfile/CompanyProfile";
import ReactToPrint from "react-to-print";
import axios from "axios";
import { API_URL } from "../../../config.json";
import { authHeaders, dateFormat, amountFormat } from "../../../utils";
import Swal from "sweetalert2";
import Button from "@mui/joy/Button";

const SupplierBalance = () => {
  const [loading, loadingSet] = useState(false);

  const filterType = [{ type: "All" }, { type: "By Supplier" }];
  const [selectFilterType, selectFilterTypeSet] = useState({ type: "All" });
  const reportRef = useRef();
  let [print, printSet] = useState(false);
  const [suppliers, suppliersSet] = useState([]);
  const [selectSupplier, selectSupplierSet] = useState(null);

  //get with details expense:
  const [supplierBalanceData, supplierBalanceDataSet] = useState(null);

  useEffect(() => {
    selectSupplierSet(null);
  }, [selectFilterType]);

  let ReportDom = React.forwardRef((props, ref) => {
    return (
      <div ref={ref} className="-mt-4">
        <span className="print-source">
          <CompanyProfile />
        </span>

        {/* with details table */}

        {print && (
          <div className="print-content p-4">
            <TableContainer className="report-dom">
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left" width="1%">
                      SL
                    </TableCell>
                    <TableCell align="left" width="2%">
                      NAME
                    </TableCell>
                    <TableCell align="left" width="2%">
                      ADDRESS
                    </TableCell>

                    <TableCell align="left" width="2%">
                      CONTACT NO
                    </TableCell>
        
                    <TableCell align="right" width="4%">
                      OPENING 
                    </TableCell>
                    <TableCell align="right" width="4%">
                      BAR BILL
                    </TableCell>

                    <TableCell align="right" width="3%">
                      RESTAURANT BILL
                    </TableCell>
                    <TableCell align="right" width="3%">
                      Hk BILL
                    </TableCell>
                    <TableCell align="right" width="5%">
                      SERVICE EXPENSE 
                    </TableCell>
                    <TableCell align="right" width="4%">
                      TOTAL BILL
                    </TableCell>
                    <TableCell align="right" width="4%">
                     RECEIVED 
                    </TableCell>
                    <TableCell align="right" width="4%">
                      TOTAL PAID
                    </TableCell>
                    <TableCell align="right" width="4%">
                      BALANCE
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {supplierBalanceData.report.map((reportItem, inx) => (
                    <>
                      <TableRow>
                        <TableCell style={{ textAlign: "left" }}>
                          {inx + parseFloat(1)}
                        </TableCell>
                        <TableCell style={{ textAlign: "left" }}>
                          {reportItem.name}
                        </TableCell>
                        <TableCell style={{ textAlign: "left" }}>
                          {reportItem.address}
                        </TableCell>
                        <TableCell style={{ textAlign: "left" }}>
                          {reportItem.contactNo}
                        </TableCell>
                 

                        <TableCell style={{ textAlign: "right" }}>
                          {amountFormat(
                            parseFloat(reportItem.openingBalance).toFixed(2)
                          )}
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          {amountFormat(
                            parseFloat(reportItem.barBillAmount).toFixed(2)
                          )}
                        </TableCell>

                        <TableCell style={{ textAlign: "right" }}>
                          {amountFormat(
                            parseFloat(reportItem.restaurantBillAmount).toFixed(
                              2
                            )
                          )}
                        </TableCell>

                        <TableCell style={{ textAlign: "right" }}>
                          {amountFormat(
                            parseFloat(
                              reportItem.houseKeepingBillAmount
                            ).toFixed(2)
                          )}
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          {amountFormat(
                            parseFloat(
                              reportItem.serviceExpenseBillAmount
                            ).toFixed(2)
                          )}
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          {amountFormat(
                            parseFloat(reportItem.totalBillAmount).toFixed(2)
                          )}
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          {amountFormat(
                            parseFloat(reportItem.receivedAmount).toFixed(2)
                          )}
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          {amountFormat(
                            parseFloat(reportItem.totalPaidAmount).toFixed(2)
                          )}
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          {amountFormat(
                            parseFloat(reportItem.balance).toFixed(2)
                          )}
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                  <TableRow>
                    <TableCell colSpan={11}></TableCell>
                    <TableCell style={{ textAlign: "right" }}>
                      Total Balance:
                    </TableCell>
                    <TableCell style={{ textAlign: "right" }}>
                      {amountFormat(
                        parseFloat(supplierBalanceData.totalBalance).toFixed(2)
                      )}
                    </TableCell>
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
  }, []);

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
    if (selectFilterType.type === "By Supplier" && selectSupplier === null) {
      Swal.fire({
        title: "Please Select Supplier!",
        icon: "warning",
      });

      return false;
    }

    getSupplierBalance();
  };
  const getSupplierBalance = async () => {
    try {
      loadingSet(true);
      const response = await axios.get(
        `${API_URL}api/v1/Report/get-supplier-balance`,
        {
          headers: authHeaders,
          params: {
            SupplierId:
              selectFilterType != null && selectFilterType.type === "All"
                ? null
                : selectSupplier.id,
          },
        }
      );
      supplierBalanceDataSet(response.data);

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
          SUPPLIER BALANCE REPORT
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
              value={selectFilterType}
              onChange={(e, value) => {
                selectFilterTypeSet(value);
              }}
              getOptionLabel={(option) => option.type}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="FILTER TYPE" />
              )}
            />
          </Grid>
          {selectFilterType != null &&
            selectFilterType.type === "By Supplier" && (
              <Grid item xs={12} md={2} sm={2}>
                <Autocomplete
                  autoHighlight={true}
                  openOnFocus={true}
                  size="small"
                  id="combo-box-filter"
                  options={suppliers}
                  value={selectSupplier}
                  onChange={(e, value) => {
                    selectSupplierSet(value);
                  }}
                  getOptionLabel={(option) => option.name}
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} label="SELECT SUPPLIER" />
                  )}
                />
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

export default SupplierBalance;
