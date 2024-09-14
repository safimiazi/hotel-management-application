import {
  amountFormat,
  authHeaders,
  convertNumberToWords,
  dateFormat,
  pathSplitter,
} from "../../../utils";
import { useLocation } from "react-router-dom";
import { API_URL } from "../../../config.json";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import "../Accounts/style.css";
import CompanyProfile from "../../components/common/companyProfile/CompanyProfile";

import Swal from "sweetalert2";
import axios from "axios";
import dayjs from "dayjs";

const EmployeeSalaryPayableInvoice = () => {
  const [print, printSet] = useState(false);
  const invoiceRef = useRef(null);
  const location = useLocation();
  const [id, idSet] = useState(null);
  const [month, monthSet] = useState(null);
  const [year, yearSet] = useState(null);
  const [invoiceData, invoiceDataSet] = useState(null);
  useEffect(() => {
    idSet(
      pathSplitter(location.pathname, 2) != undefined
        ? pathSplitter(location.pathname, 2)
        : 0
    );
    monthSet(
      pathSplitter(location.pathname, 3) != undefined
        ? pathSplitter(location.pathname, 3)
        : 0
    );
    yearSet(
      pathSplitter(location.pathname, 4) != undefined
        ? pathSplitter(location.pathname, 4)
        : 0
    );

    if (
      pathSplitter(location.pathname, 2) != undefined &&
      pathSplitter(location.pathname, 3) != undefined &&
      pathSplitter(location.pathname, 4) != undefined
    ) {
      getEmployeeSalaryPayableInvoice();
    }
  }, []);

  const getEmployeeSalaryPayableInvoice = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/EmployeeSalaryPayment/get-employee-payable-report`,
        {
          headers: authHeaders,
          params: {
            EmployeeId: pathSplitter(location.pathname, 2),
            Month: pathSplitter(location.pathname, 3),
            Year: pathSplitter(location.pathname, 4),
          },
        }
      );

      invoiceDataSet(response.data);
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

  let BottomComponent = (ref) => {
    return (
      <div className="flex justify-between">
        <div className="flex flex-col gap-5">
          <div>
            <div
              style={{ height: "1px", width: "100px", background: "black" }}
            ></div>
            <p className="font-bold">Received By </p>
          </div>
          <p>
            <small>Print Date : </small>
            <small> {dayjs().format(dateFormat)}</small>
          </p>
        </div>
        <div className="flex flex-col gap-5">
          <div>
            <div
              style={{ height: "1px", width: "100px", background: "black" }}
            ></div>
            <p className="font-bold">Authorized By</p>
          </div>
          <p className="">
            <small>Developed By :</small>
            <small> SOFT TASK </small>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div ref={invoiceRef} className="bg-blue-50 p-10  h-full">
      <div className="print-no">
        {print && (
          <ReactToPrint
            trigger={() => (
              <button>
                <PrintIcon />
              </button>
            )}
            content={() => invoiceRef.current}
          />
        )}
      </div>
      <div className="w-full  p-8 rounded  flex flex-col justify-between">
        <div className="">
          <div className="print-source">
            <CompanyProfile />
          </div>
          <div>
            <div className="flex flex-col gap-1 mb-4 mt-4">
              <hr />
              <h2 className="text-2xl text-center">MONTHLY SALARY RECEIPT</h2>
              <hr />
            </div>

            <div className="w-full mb-8">
              <TableContainer className="invoice">
                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
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
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoiceData?.report.map((reportItem, inx) => (
                      <>
                        <TableRow>
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
                        </TableRow>
                      </>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            <div className="mb-8 mt-5">
              <p className="flex justify-start gap-1 mb-1">
                <span>In Word of Grand Total: </span>{" "}
                <span>{convertNumberToWords(invoiceData?.totalBalance)}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="print-source mt-10">
          <BottomComponent />
        </div>
      </div>
    </div>
  );
};

export default EmployeeSalaryPayableInvoice;
