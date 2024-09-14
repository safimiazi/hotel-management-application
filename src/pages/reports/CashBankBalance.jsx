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
import {
  authHeaders,
  dateFormat,
  amountFormat,
  cashBankAccountFilterTypes,
} from "../../../utils";
import Swal from "sweetalert2";

const CashBankBalance = () => {
  const [loading, loadingSet] = useState(false);
  const filterType = [
    { type: "All" },
    { type: "By Account" },
    { type: "By Type" },
  ];
  const types = [
    { type: "Cash" },
    { type: "Bank Account" },
    { type: "Card" },
    { type: "Mobile Banking" },
  ];
  const [selectFilterType, selectFilterTypeSet] = useState({ type: "All" });
  const [selectedType, selectedTypeSet] = useState(null);
  const reportRef = useRef();
  let [print, printSet] = useState(false);
  const [accounts, accountsSet] = useState([]);
  const [selectaccount, selectaccountSet] = useState(null);

  //get with details expense:
  const [cashBankBalance, cashBankBalanceSet] = useState(null);

  useEffect(() => {
    selectaccountSet(null);
    selectedTypeSet(null);
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
                    <TableCell align="left" width="3%">
                      SL
                    </TableCell>
                    <TableCell align="left" width="5%">
                      NAME
                    </TableCell>
                    <TableCell align="right" width="6%">
                      OPENING BALANCE
                    </TableCell>

                    <TableCell align="right" width="5%">
                      DEBIT AMOUNT
                    </TableCell>
                    <TableCell align="right" width="5%">
                      CREDIT AMOUNT
                    </TableCell>
                    <TableCell align="right" width="6%">
                      BALANCE
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cashBankBalance.report.map((reportItem, inx) => (
                    <>
                      <TableRow>
                        <TableCell style={{ textAlign: "left" }}>
                          {inx + parseFloat(1)}
                        </TableCell>
                        <TableCell style={{ textAlign: "left" }}>
                          {reportItem.name}
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          {amountFormat(
                            parseFloat(reportItem.openingBalance).toFixed(2)
                          )}
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          {amountFormat(
                            parseFloat(reportItem.debitAmount).toFixed(2)
                          )}
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          {amountFormat(
                            parseFloat(reportItem.creditAmount).toFixed(2)
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
                    <TableCell colSpan={4}></TableCell>
                    <TableCell style={{ textAlign: "right" }}>
                      Total Balance:
                    </TableCell>
                    <TableCell style={{ textAlign: "right" }}>
                      {amountFormat(
                        parseFloat(cashBankBalance.totalBalance).toFixed(2)
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
    getAccounts();
  }, []);

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

  //handle report:
  const handleReport = () => {
    if (selectFilterType.type === "By Account" && selectaccount === null) {
      Swal.fire({
        title: "Please Select Account!",
        icon: "warning",
      });

      return false;
    }

    getCashBankBalance();
  };
  const getCashBankBalance = async () => {
    try {
      loadingSet(true);
      const response = await axios.get(
        `${API_URL}api/v1/Report/get-cash-bank-balance`,
        {
          headers: authHeaders,
          params: {
            AccountId:
              (selectFilterType != null && selectFilterType.type === "All") ||
              selectaccount === null
                ? null
                : selectaccount.id,
            AccountType: selectedType != null ? selectedType.type : null,
          },
        }
      );
      cashBankBalanceSet(response.data);
      loadingSet(false);

      printSet(true);
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
          CASH BANK BALANCE REPORT
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
            selectFilterType.type === "By Account" && (
              <Grid item xs={12} md={2} sm={2}>
                <Autocomplete
                  autoHighlight={true}
                  openOnFocus={true}
                  size="small"
                  id="combo-box-filter"
                  options={accounts}
                  value={selectaccount}
                  onChange={(e, value) => {
                    selectaccountSet(value);
                  }}
                  getOptionLabel={(option) => option.name}
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} label="SELECT ACCOUNT" />
                  )}
                />
              </Grid>
            )}
          {selectFilterType != null && selectFilterType.type === "By Type" && (
            <Grid item xs={12} md={2} sm={2}>
              <Autocomplete
                autoHighlight={true}
                openOnFocus={true}
                size="small"
                id="combo-box-filter"
                options={types}
                value={selectedType}
                onChange={(e, value) => {
                  selectedTypeSet(value);
                }}
                getOptionLabel={(option) => option.type}
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="SELECT TYPE" />
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

export default CashBankBalance;
