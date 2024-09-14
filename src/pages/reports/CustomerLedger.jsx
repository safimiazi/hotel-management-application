import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  keyframes,
  Grid,
  Paper,
  Typography,
  Autocomplete,
  TextField,
  Stack,
} from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";

import "../Accounts/style.css";
import PrintIcon from "@mui/icons-material/Print";
import CompanyProfile from "../../components/common/companyProfile/CompanyProfile";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import axios from "axios";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { API_URL } from "../../../config.json";
import { authHeaders, dateFormat, amountFormat } from "../../../utils";
import Swal from "sweetalert2";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Link } from "react-router-dom";
import Button from "@mui/joy/Button";

const CustomerLedger = () => {
  const [loading, loadingSet] = useState(false);
  const reportRef = useRef();
  let [print, printSet] = useState(false);
  const [customers, customersSet] = useState([]);
  const [selectCustomer, selectCustomerSet] = useState(null);
  const [selectedFromDate, selectedFromDateSet] = useState(dayjs());
  const [selectedToDate, selectedToDateSet] = useState(dayjs());

  //get with details expense:
  const [customerLedgerData, customerLedgerDataSet] = useState(null);

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
                        parseFloat(customerLedgerData.openingBalance).toFixed(2)
                      )}
                    </TableCell>
                  </TableRow>
                  {customerLedgerData.ledger.map((ledgerItem, inx) => (
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
                        parseFloat(customerLedgerData.closingBalance).toFixed(2)
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
    getCustomers();
  }, []);

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
    if (selectCustomer === null) {
      Swal.fire({
        title: "Please Select Customer!",
        icon: "warning",
      });

      return false;
    }

    getCustomerLedger();
  };
  const getCustomerLedger = async () => {
    try {
      loadingSet(true);
      const response = await axios.get(
        `${API_URL}api/v1/Report/get-customer-ledger`,
        {
          headers: authHeaders,
          params: {
            CustomerId: selectCustomer.id ? selectCustomer.id : null,
            FromDate: selectedFromDate.format(dateFormat),
            ToDate: selectedToDate.format(dateFormat),
          },
        }
      );
      customerLedgerDataSet(response.data);

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
          CUSTOMER LEDGER
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
              options={customers}
              value={selectCustomer}
              onChange={(e, value) => {
                selectCustomerSet(value);
              }}
              getOptionLabel={(option) => option.name}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="SELECT CUSTOMER" />
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

export default CustomerLedger;
