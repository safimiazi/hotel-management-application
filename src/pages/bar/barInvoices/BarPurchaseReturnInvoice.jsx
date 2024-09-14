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
  pathSplitter,
} from "../../../../utils";
import Swal from "sweetalert2";
import axios from "axios";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";

const BarPurchaseReturnInvoice = () => {
  const location = useLocation();
  const [print, printSet] = useState(false);
  const invoiceRef = useRef(null);
  const [invoiceData, invoiceDataSet] = useState([]);

  useEffect(() => {
    getInvoiceData();
  }, []);

  const getInvoiceData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/BarItemPurchaseReturn/${pathSplitter(
          location.pathname,
          2
        )}`,
        {
          headers: authHeaders,
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
              <h2 className="text-2xl text-center">
                BAR PURCHASE RETURN INVOICE
              </h2>
              <hr />
            </div>

            <div className="flex justify-between items-center mb-3">
              <div className="space-y-1">
                <p className="mt-2">
                  <span className="font-bold">Name: </span>{" "}
                  <span>{invoiceData.supplier?.name}</span>
                </p>
                <p>
                  <span className="font-bold">Address: </span>{" "}
                  <span>{invoiceData.supplier?.address}</span>
                </p>
                <p>
                  <span className="font-bold">Contact No: </span>{" "}
                  <span>{invoiceData.supplier?.contactNo}</span>
                </p>
              </div>
              <div className="text-right space-y-1">
                <p>
                  <span className="font-bold">Invoice No: </span>{" "}
                  <span>{invoiceData?.invoiceNo}</span>
                </p>
                <p>
                  <span className="font-bold">Invoice Date: </span>{" "}
                  <span>
                    {dayjs(invoiceData?.createdDate).format(dateFormat)}
                  </span>
                </p>
                <p>
                  <span className="font-bold">Invoice By: </span>{" "}
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
                        DESCRIPTION
                      </TableCell>
                      <TableCell align="right" width="5%">
                        RATE
                      </TableCell>

                      <TableCell align="right" width="5%">
                        QTY
                      </TableCell>
                      <TableCell align="right" width="6%">
                        TOTAL
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoiceData.itemPurchaseReturnDetails?.map((item, inx) => (
                      <TableRow style={{ margin: "20px" }}>
                        <TableCell style={{ textAlign: "left" }}>
                          {inx + parseFloat(1)}
                        </TableCell>
                        <TableCell style={{ textAlign: "left" }}>
                          {item.item?.name}
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          {amountFormat(parseFloat(item.rate).toFixed(2))}
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          {item.qty}
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          {amountFormat(parseFloat(item.amount).toFixed(2))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            <div className="flex items-start justify-between gap-12">
              <div className="flex-1">
                {invoiceData.invoiceTransactions?.length > 0 && (
                  <div className="">
                    <p className="flex  justify-between mb-2">
                      <span className="">PAYMENT DETAILS</span>
                    </p>
                    <table className="w-full mb-8">
                      <thead>
                        <tr className="">
                          <th className=" text-left  ">SL</th>
                          <th className=" text-left  ">Account</th>
                          <th className=" text-right  ">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceData.invoiceTransactions?.map(
                          (transaction, inx) => (
                            <tr className="border-b border-gray-300">
                              <td className="  ">{inx + parseFloat(1)}</td>
                              <td className="  ">
                                {transaction?.account?.name}
                              </td>
                              <td className=" text-right  ">
                                {amountFormat(
                                  parseFloat(transaction?.amount).toFixed(2)
                                )}
                              </td>
                            </tr>
                          )
                        )}
                        <tr>
                          <td className="  "></td>
                          <td className="  "></td>
                          <td className=" text-right   flex justify-between items-center">
                            <span>Total Amount: </span>{" "}
                            <span>
                              {" "}
                              {amountFormat(
                                parseFloat(invoiceData.paidAmount).toFixed(2)
                              )}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className=" flex-1">
                <p className="flex items-center justify-between">
                  <span>(Total Qty): </span>{" "}
                  <span>
                    {parseFloat(
                      invoiceData.itemPurchaseReturnDetails?.reduce(
                        (prev, curr) => {
                          return prev + parseFloat(curr.qty);
                        },
                        0
                      )
                    )}
                  </span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Sub Total: </span>{" "}
                  <span>
                    {amountFormat(parseFloat(invoiceData.subTotal).toFixed(2))}
                  </span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Tax Amount: </span>{" "}
                  <span>
                    {amountFormat(parseFloat(invoiceData.taxAmount).toFixed(2))}
                  </span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Discount Amount: </span>{" "}
                  <span>
                    {amountFormat(
                      parseFloat(invoiceData.discountAmount).toFixed(2)
                    )}
                  </span>
                </p>
                <div
                  style={{ height: "1px", width: "100%", background: "black" }}
                />
                <p className="flex items-center justify-between">
                  <span className="font-bold">Grand Total:</span>{" "}
                  <span>
                    {amountFormat(
                      parseFloat(invoiceData.totalAmount).toFixed(2)
                    )}
                  </span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="font-bold">Paid:</span>{" "}
                  <span>
                    {amountFormat(
                      parseFloat(invoiceData.paidAmount).toFixed(2)
                    )}
                  </span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="font-bold">Due:</span>{" "}
                  <span>
                    {amountFormat(parseFloat(invoiceData.dueAmount).toFixed(2))}
                  </span>
                </p>
              </div>
            </div>

            <div className="mb-8 mt-5">
              <p className="flex justify-start gap-1 mb-1">
                <span>In Word of Grand Total: </span>{" "}
                <span>{convertNumberToWords(invoiceData.totalAmount)}</span>
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

export default BarPurchaseReturnInvoice;
