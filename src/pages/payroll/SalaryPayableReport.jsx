import React, { useEffect, useRef, useState } from "react";
import ReceiptIcon from "@mui/icons-material/Receipt";

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

import PrintIcon from "@mui/icons-material/Print";
import CompanyProfile from "../../components/common/companyProfile/CompanyProfile";
import ReactToPrint from "react-to-print";
import axios from "axios";
import { API_URL } from "../../../config.json";
import { authHeaders, amountFormat } from "../../../utils";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const SalaryPayableReport = () => {
  const [loading, loadingSet] = useState(false);
  const filterType = [{ type: "All" }, { type: "By Employee" }];
  const [selectFilterType, selectFilterTypeSet] = useState({ type: "All" });
  const reportRef = useRef();
  let [print, printSet] = useState(false);

  const [employees, employeesSet] = useState([]);
  const [selectEmployee, selectEmployeeSet] = useState(null);
  const [months, monthsSet] = useState([]);
  const [selectedMonth, selectedMonthSet] = useState(null);
  const [years, yearsSet] = useState([]);
  const [selectedYear, selectedYearSet] = useState(null);

  //get with details expense:
  const [employeePayableReport, employeePayableReportSet] = useState(null);

  useEffect(() => {
    selectEmployeeSet(null);
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
                    <TableCell align="left" width="6%">
                      MONTH
                    </TableCell>

                    <TableCell align="left" width="5%">
                      YEAR
                    </TableCell>
                    <TableCell align="right" width="5%">
                      BASIC SALARY
                    </TableCell>
                    <TableCell align="right" width="6%">
                      PAID AMOUNT
                    </TableCell>
                    <TableCell align="right" width="6%">
                      PAYABLE
                    </TableCell>

                    <TableCell align="center" width="2%">
                      INVOICE
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employeePayableReport.report.map((reportItem, inx) => (
                    <>
                      <TableRow>
                        <TableCell style={{ textAlign: "left" }}>
                          {inx + parseFloat(1)}
                        </TableCell>
                        <TableCell style={{ textAlign: "left" }}>
                          {reportItem.name}
                        </TableCell>
                        <TableCell style={{ textAlign: "left" }}>
                          {reportItem.month}
                        </TableCell>
                        <TableCell style={{ textAlign: "left" }}>
                          {reportItem.year}
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          {amountFormat(
                            parseFloat(reportItem.basicSalary).toFixed(2)
                          )}
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          {amountFormat(
                            parseFloat(reportItem.paidAmount).toFixed(2)
                          )}
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          {amountFormat(
                            parseFloat(reportItem.payable).toFixed(2)
                          )}
                        </TableCell>

                        <TableCell style={{ textAlign: "right" }}>
                          <div
                            style={{
                              textAlign: "right",
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Link
                              to={{
                                pathname: `/payroll/salary-payable-invoice/${reportItem.employeeId}/${reportItem.month}/${reportItem.year}`,
                              }}
                            >
                              <ReceiptIcon
                                style={{
                                  color: "blue",
                                  cursor: "pointer",
                                }}
                              />
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                  <TableRow>
                    <TableCell colSpan={5}></TableCell>
                    <TableCell style={{ textAlign: "right" }}>
                      Total Balance:
                    </TableCell>
                    <TableCell style={{ textAlign: "right" }}>
                      {amountFormat(
                        parseFloat(employeePayableReport.totalBalance).toFixed(
                          2
                        )
                      )}
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
    getEmployes();
    getMonths();
    getYears();
  }, []);

  const getMonths = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/EmployeeSalaryPayment/get-months`,
        {
          headers: authHeaders,
        }
      );
      monthsSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };
  const getYears = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/EmployeeSalaryPayment/get-years`,
        {
          headers: authHeaders,
        }
      );
      yearsSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const getEmployes = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/Employee`, {
        headers: authHeaders,
      });
      employeesSet(response.data);
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
    if (selectedMonth === null) {
      Swal.fire({
        title: "Please Select Month!",
        icon: "warning",
      });

      return false;
    }
    if (selectedYear === null) {
      Swal.fire({
        title: "Please Select Year!",
        icon: "warning",
      });

      return false;
    }

    getEmployeePayableReport();
  };
  const getEmployeePayableReport = async () => {
    try {
      loadingSet(true);
      const response = await axios.get(
        `${API_URL}api/EmployeeSalaryPayment/get-employee-payable-report`,
        {
          headers: authHeaders,
          params: {
            EmployeeId: selectEmployee != null ? selectEmployee.id : null,
            Year: selectedYear != null ? selectedYear : null,
            Month: selectedMonth != null ? selectedMonth.month : null,
          },
        }
      );
      employeePayableReportSet(response.data);
      loadingSet(false);

      printSet(true);

      selectFilterTypeSet({ type: "All" });
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
    const getCurrentMonth = () => {
      if (months.length <= 0) {
        return false;
      }

      const date = new Date();
      const currentMonth = date.toLocaleString("default", { month: "long" });

      const foundMonthObj = months.find(
        (monthItem) => monthItem.month === currentMonth
      );

      selectedMonthSet(foundMonthObj);
    };

    getCurrentMonth();
  }, [months]);

  useEffect(() => {
    const getCurrentYear = () => {
      const year = new Date().getFullYear().toString();
      selectedYearSet(year);
    };
    getCurrentYear();
  }, []);

  return (
    <div>
      <Paper className="m-3 p-3">
        <Typography
          variant="h6"
          className="MuiTypography-h6 mb-3"
          style={{ marginBottom: "8px" }}
        >
          SALARY PAYABLE REPORT
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
            selectFilterType.type === "By Employee" && (
              <Grid item xs={12} md={2} sm={2}>
                <Autocomplete
                  autoHighlight={true}
                  openOnFocus={true}
                  size="small"
                  id="combo-box-filter"
                  options={employees}
                  value={selectEmployee}
                  onChange={(e, value) => {
                    selectEmployeeSet(value);
                  }}
                  getOptionLabel={(option) => option.name}
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} label="SELECT EMPLOYEE" />
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
              options={years}
              value={selectedYear}
              onChange={(e, value) => {
                selectedYearSet(value);
              }}
              //   getOptionLabel={(option) => option.name}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="SELECT YEAR" />
              )}
            />
          </Grid>
          <Grid item xs={12} md={2} sm={2}>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              size="small"
              id="combo-box-filter"
              options={months}
              value={selectedMonth}
              onChange={(e, value) => {
                selectedMonthSet(value);
              }}
              getOptionLabel={(option) => option.month}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="SELECT MONTH" />
              )}
            />
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

export default SalaryPayableReport;
