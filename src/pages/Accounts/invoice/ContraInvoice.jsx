import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { API_URL } from "../../../../config.json";
import React, { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import "../../Accounts/style.css";
import CompanyProfile from "../../../components/common/companyProfile/CompanyProfile";
import {
  amountFormat,
  authHeaders,
  convertNumberToWords,
  dateFormat,
} from "../../../../utils";
import Swal from "sweetalert2";
import axios from "axios";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

const ContraInvoice = () => {
  const [print, printSet] = useState(false);
  const invoiceRef = useRef(null);
  const [invoiceData, invoiceDataSet] = useState({});
  const { id } = useParams();

  useEffect(() => {
    getInvoiceData();
  }, []);

  const getInvoiceData = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/Contra/${id}`, {
        headers: authHeaders,
      });

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
              <h2 className="text-2xl text-center">CONTRA INVOICE</h2>
              <hr />
            </div>

            <div className="flex justify-between items-center mb-3">
              <div className="space-y-1">
              <p>
                  <span className="font-bold">Transaction Code: </span>{" "}
                  <span>{invoiceData?.transactionCode}</span>
                </p>
                <p>
                  <span className="font-bold">Transaction Date: </span>{" "}
                  <span>
                    {dayjs(invoiceData?.createdDate).format(dateFormat)}
                  </span>
                </p>
              </div>
              <div className="text-right space-y-1">
              
                <p>
                  <span className="font-bold">Transaction By: </span>{" "}
                  <span>{invoiceData.creator?.userName}</span>
                </p>
              </div>
            </div>

            <div className="w-full mb-8">
              <TableContainer className="invoice">
                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" width="1%">
                        SL
                      </TableCell>
                      <TableCell align="left" width="5%">
                        RROM ACCOUNT
                      </TableCell>
                      <TableCell align="left" width="5%">
                        TO ACCOUNT
                      </TableCell>
                      <TableCell align="right" width="5%">
                        AMOUNT
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
             
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            1
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {invoiceData.fromAccount?.name}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {invoiceData.toAccount?.name}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(parseFloat(invoiceData?.amount).toFixed(2))}
                          </TableCell>
                        </TableRow>
                
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

    

            <div className="mb-8 mt-5">
              <p className="flex justify-start gap-1 mb-1">
                <span>In Word of Grand Total: </span>{" "}
                <span>{convertNumberToWords(invoiceData.amount)}</span>
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

export default ContraInvoice;
