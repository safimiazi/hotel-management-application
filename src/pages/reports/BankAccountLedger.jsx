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
  TextField,
  Autocomplete,
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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const BankAccountLedger = () => {
  const [loading, loadingSet] = useState(false);

  const reportRef = useRef();
  let [print, printSet] = useState(false);
  const [selectedFromDate, selectedFromDateSet] = useState(dayjs());
  const [selectedToDate, selectedToDateSet] = useState(dayjs());
  const [accounts, accountsSet] = useState([]);
  const [selectAccount, selectAccountSet] = useState(null);
  //get with details expense:
  const [dailyLedgerData, dailyLedgerDataSet] = useState(null);

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
                      CREATED DATE
                    </TableCell>
                    <TableCell align="left" width="6%">
                      PARTICULAR
                    </TableCell>

                    <TableCell align="left" width="5%">
                      TRANSACTION CODE
                    </TableCell>
                    <TableCell align="left" width="5%">
                      TRANSACTION TYPE
                    </TableCell>
                    <TableCell align="right" width="6%">
                      DEBIT AMOUNT
                    </TableCell>
                    <TableCell align="right" width="6%">
                      CREDIT AMOUNT
                    </TableCell>

                    <TableCell align="right" width="5%">
                      BALANCE
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6}></TableCell>
                    <TableCell style={{ textAlign: "right" }}>
                      Opening Balance:
                    </TableCell>
                    <TableCell style={{ textAlign: "right" }}>
                      {amountFormat(
                        parseFloat(dailyLedgerData.openingBalance).toFixed(2)
                      )}
                    </TableCell>
                  </TableRow>
                  {dailyLedgerData.ledger.map((ledgerItem, inx) => (
                    <>
                      <TableRow>
                        <TableCell style={{ textAlign: "left" }}>
                          {inx + parseFloat(1)}
                        </TableCell>
                        <TableCell style={{ textAlign: "left" }}>
                          {dayjs(ledgerItem.createdDate).format(dateFormat)}
                        </TableCell>
                        <TableCell style={{ textAlign: "left" }}>
                          {ledgerItem.particular}
                        </TableCell>
                        <TableCell style={{ textAlign: "left" }}>
                          {ledgerItem.transactionCode}
                        </TableCell>
                        <TableCell style={{ textAlign: "left" }}>
                          {ledgerItem.transactionType}
                        </TableCell>

                        <TableCell style={{ textAlign: "right" }}>
                          {amountFormat(
                            parseFloat(ledgerItem.debitAmount).toFixed(2)
                          )}
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          {amountFormat(
                            parseFloat(ledgerItem.creditAmount).toFixed(2)
                          )}
                        </TableCell>

                        <TableCell style={{ textAlign: "right" }}>
                          {amountFormat(
                            parseFloat(ledgerItem.balance).toFixed(2)
                          )}
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                  <TableRow>
                    <TableCell colSpan={6}></TableCell>
                    <TableCell style={{ textAlign: "right" }}>
                      Closing Balance:
                    </TableCell>
                    <TableCell style={{ textAlign: "right" }}>
                      {amountFormat(
                        parseFloat(dailyLedgerData.closingBalance).toFixed(2)
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
  const handleReport = () => {
    if (selectAccount === null) {
      Swal.fire({
        title: "Please Select Account.",
        icon: "warning",
      });

      return false;
    }

    getReport();
  };

  const getReport = async () => {
    try {
      loadingSet(true);
      const response = await axios.get(
        `${API_URL}api/v1/Report/get-cash-bank-account-ledger`,
        {
          headers: authHeaders,
          params: {
            AccountId: selectAccount != null ? selectAccount.id : null,
            FromDate: selectedFromDate.format(dateFormat),
            ToDate: selectedToDate.format(dateFormat),
          },
        }
      );
      dailyLedgerDataSet(response.data);

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
          CASH BANK LEDGER
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
              id="combo-box-account"
              options={accounts}
              value={selectAccount}
              onChange={(e, obj) => {
                selectAccountSet(obj);
              }}
              getOptionLabel={(option) => option.name}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="SELECT ACCOUNT" />
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

export default BankAccountLedger;
