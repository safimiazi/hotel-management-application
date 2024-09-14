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
import "./style.css";
import PrintIcon from "@mui/icons-material/Print";

import CompanyProfile from "../../components/common/companyProfile/CompanyProfile";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import axios from "axios";
import { API_URL } from "../../../config.json";
import { amountFormat, authHeaders, dateFormat } from "../../../utils";
import Swal from "sweetalert2";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Button from "@mui/joy/Button";

const ExpenseRecord = () => {
  const [loading, loadingSet] = useState(false);

  const reportRef = useRef();
  let [print, printSet] = useState(false);
  const [selectedFromDate, selectedFromDateSet] = useState(dayjs());
  const [selectedToDate, selectedToDateSet] = useState(dayjs());
  const [selectedFilterType, selectedFilterTypeSet] = useState({ type: "All" });
  const [selectedRecordType, selectedRecordTypeSet] = useState({
    type: "With Details",
  });

  //get with details expense:
  const [detailsExpense, detailsExpenseSet] = useState([]);
  const [grandTotal, grandTotalSet] = useState(0);
  const [users, usersSet] = useState([]);
  const [userSelect, userSelectSet] = useState(null);

  useEffect(() => {
    userSelectSet(null);
    selectedFromDateSet(dayjs());
    selectedToDateSet(dayjs());
  }, [selectedFilterType]);

  //grand total
  useEffect(() => {
    const total = detailsExpense
      .map((singleExpense) => singleExpense.totalAmount)
      .reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);
    grandTotalSet(total);
  }, [detailsExpense]);

  let ReportDom = React.forwardRef((props, ref) => {
    return (
      <div ref={ref} className="-mt-5 p-4">
        <span className="print-source">
          <CompanyProfile />
        </span>

        {/* with details table */}

        {print &&
          selectedRecordType != null &&
          selectedRecordType.type === "With Details" && (
            <div className="print-content ">
              <TableContainer className="report-dom">
                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" width="3%">
                        SL
                      </TableCell>
                      <TableCell align="left" width="5%">
                        TRAN CODE
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
                      <TableCell align="left" width="6%">
                        Expense Head
                      </TableCell>
                      <TableCell align="right" width="6%">
                        AMOUNT
                      </TableCell>
                      <TableCell align="right" width="6%">
                        TOTAL AMOUNT
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {detailsExpense.map((expense, inx) => (
                      <>
                        <TableRow>
                          <TableCell
                            style={{ fontWeight: "bold", textAlign: "left" }}
                          >
                            {inx + parseFloat(1)}
                          </TableCell>
                          <TableCell
                            style={{ fontWeight: "bold", textAlign: "left" }}
                          >
                            {expense.transactionCode}
                          </TableCell>
                          <TableCell
                            style={{ fontWeight: "bold", textAlign: "left" }}
                          >
                            {dayjs(expense.createdDate).format(dateFormat)}
                          </TableCell>
                          <TableCell
                            style={{ fontWeight: "bold", textAlign: "left" }}
                          >
                            {expense.creator.userName}
                          </TableCell>
                          <TableCell
                            style={{ fontWeight: "bold", textAlign: "left" }}
                          >
                            {expense.updater.userName}
                          </TableCell>

                          <TableCell
                            style={{ fontWeight: "bold", textAlign: "left" }}
                          >
                            {expense.expenseDetails[0].expenseHead.title}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(
                                expense.expenseDetails[0].amount
                              ).toFixed(2)
                            )}
                          </TableCell>

                          <TableCell
                            style={{ fontWeight: "bold", textAlign: "right" }}
                          >
                            {amountFormat(
                              parseFloat(expense.totalAmount).toFixed(2)
                            )}
                          </TableCell>
                        </TableRow>

                        {expense.expenseDetails.slice(1).map((head) => (
                          <TableRow>
                            <TableCell colSpan={5}></TableCell>

                            <TableCell style={{ textAlign: "left" }}>
                              {head.expenseHead.title}
                            </TableCell>

                            <TableCell style={{ textAlign: "right" }}>
                              {amountFormat(parseFloat(head.amount).toFixed(2))}
                            </TableCell>
                            <TableCell colSpan={2}></TableCell>
                          </TableRow>
                        ))}
                      </>
                    ))}

                    <TableRow>
                      <TableCell
                        colSpan={7}
                        style={{ fontWeight: "bold", textAlign: "right" }}
                      >
                        Grand Total :
                      </TableCell>
                      <TableCell
                        style={{ fontWeight: "bold", textAlign: "right" }}
                      >
                        {amountFormat(parseFloat(grandTotal).toFixed(2))}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
        {print &&
          selectedRecordType != null &&
          selectedRecordType.type === "Without Details" && (
            <div className="print-content">
              <TableContainer className="report-dom">
                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" width="3%">
                        SL
                      </TableCell>
                      <TableCell align="left" width="5%">
                        TRAN CODE
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

                      <TableCell align="left" width="6%">
                        EXPENSE AMOUNT
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {detailsExpense.map((expense, inx) => (
                      <TableRow>
                        <TableCell
                          style={{ fontWeight: "bold", textAlign: "left" }}
                        >
                          {inx + parseFloat(1)}
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold", textAlign: "left" }}
                        >
                          {expense.transactionCode}
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold", textAlign: "left" }}
                        >
                          {dayjs(expense.createdDate).format(dateFormat)}
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold", textAlign: "left" }}
                        >
                          {expense.creator.userName}
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold", textAlign: "left" }}
                        >
                          {expense.updater.userName}
                        </TableCell>

                        <TableCell
                          style={{ fontWeight: "bold", textAlign: "right" }}
                        >
                          {amountFormat(
                            parseFloat(expense.totalAmount).toFixed(2)
                          )}
                        </TableCell>
                      </TableRow>
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

  //handle report:
  const handleReport = () => {
    getExpense();
    printSet(true);
  };
  const getExpense = async () => {
    try {
      loadingSet(true);
      let url = ``;
      if (selectedRecordType.type == "With Details") {
        url = `Expense`;
      }
      if (selectedRecordType.type == "Without Details") {
        url = `Expense-Record`;
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
      detailsExpenseSet(response.data);
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
          EXPENSE RECORD
        </Typography>

        <Grid
          container
          spacing={3}
          style={{ paddingBottom: "5px", paddingTop: "5px" }}
        >
          <Grid item xs={12} sm={2}>
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
              <Grid item xs={12} sm={2}>
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

          <Grid item xs={12} sm={2}>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              size="small"
              id="combo-box-filter"
              options={recordType}
              value={selectedRecordType}
              onChange={(e, value) => {
                selectedRecordTypeSet(value);
              }}
              getOptionLabel={(option) => option.type}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="RECORD TYPE" />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="FROM DATE"
                slotProps={{ field: { size: "small" } }}
                fullWidth
                value={selectedFromDate}
                onChange={(date) => selectedFromDateSet(date)}
                format={dateFormat}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="TO DATE"
                slotProps={{ field: { size: "small" } }}
                value={selectedToDate}
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

export default ExpenseRecord;
