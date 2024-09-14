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
  Stack,
} from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";

import "../Accounts/style.css";
import PrintIcon from "@mui/icons-material/Print";
import CompanyProfile from "../../components/common/companyProfile/CompanyProfile";
import ReactToPrint from "react-to-print";
import axios from "axios";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { API_URL } from "../../../config.json";
import { amountFormat, authHeaders, dateFormat } from "../../../utils";
import Swal from "sweetalert2";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Link } from "react-router-dom";
import Button from "@mui/joy/Button";

const BookingRecord = () => {
  const [loading, loadingSet] = useState(false);

  const reportRef = useRef();
  let [print, printSet] = useState(false);
  const [selectedFromDate, selectedFromDateSet] = useState(dayjs());
  const [selectedToDate, selectedToDateSet] = useState(dayjs());
  const [selectedFilterType, selectedFilterTypeSet] = useState({ type: "All" });
  const [selectedRecordType, selectedRecordTypeSet] = useState({
    type: "With Details",
  });
  const [guests, guestsSet] = useState([]);
  const [guestSelect, guestSelectSet] = useState(null);
  const [users, usersSet] = useState([]);
  const [userSelect, userSelectSet] = useState(null);

  //get with details expense:
  const [bookingData, bookingDataSet] = useState([]);
  const [grandTotal, grandTotalSet] = useState(0);

  useEffect(() => {
    guestSelectSet(null);
    userSelectSet(null);
    selectedToDateSet(dayjs());
    selectedFromDateSet(dayjs());
  }, [selectedFilterType]);

  useEffect(() => {
    const total = bookingData
      .map((singleItem) => singleItem.totalAmount)
      .reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);
    grandTotalSet(total);
  }, [bookingData]);

  let ReportDom = React.forwardRef((props, ref) => {
    const handleDelete = async (row) => {
      Swal.fire({
        title: `Are you sure delete this?`,
        icon: "warning",
        buttons: true,
      }).then(async (res) => {
        try {
          if (res.isConfirmed) {
            let response = await axios.delete(
              `${API_URL}api/v1/Booking/${row.id}`,
              { headers: authHeaders },
              { id: row.id }
            );
            Swal.fire({
              icon: "success",
              title: `${response.data.bookingNo} is deleted Successfully`,
            });

            getBooking();
          }
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Failed ! Please try again later.",
            confirmButtonText: "OK",
          });
        }
      });
    };

    return (
      <div ref={ref} className="-mt-4">
        <span className="print-source">
          <CompanyProfile />
        </span>

        {/* with details table */}

        {print &&
          selectedRecordType != null &&
          selectedRecordType.type === "With Details" && (
            <div className="print-content p-4">
              <TableContainer className="report-dom">
                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" width="2%">
                        SL
                      </TableCell>
                      <TableCell align="left" width="6%">
                        GUEST NAME
                      </TableCell>
                      <TableCell align="left" width="8%">
                        GUEST ADDRESS
                      </TableCell>
                      <TableCell align="left" width="6%">
                        GUEST AGE
                      </TableCell>
                      <TableCell align="left" width="6%">
                        BOOKING NO
                      </TableCell>
                      <TableCell align="left" width="6%">
                        ROOM NO
                      </TableCell>
                      <TableCell align="left" width="7%">
                        CHECK IN DATE
                      </TableCell>
                      <TableCell align="left" width="8%">
                        CHECK OUT DATE
                      </TableCell>
                      <TableCell align="left" width="7%">
                        CREATED DATE
                      </TableCell>

                      <TableCell align="right" width="5%">
                         ROOM QTY
                      </TableCell>

                     
                      <TableCell align="right" width="9%">
                        DISCOUNT 
                      </TableCell>
                 
                      <TableCell align="right" width="8%">
                        OTHERS CHARGE
                      </TableCell>
                      <TableCell align="right" width="8%">
                        PAID 
                      </TableCell>
                      <TableCell align="right" width="8%">
                        DUE 
                      </TableCell>
                      <TableCell align="right" width="6%">
                        SUB TOTAL
                      </TableCell>
                    

                      <TableCell align="right" width="7%">
                        TOTAL 
                      </TableCell>
                      <TableCell className="print-no" align="left" width="6%">
                        ACTIONS
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bookingData.map((bookingItem, inx) => (
                      <>
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            {inx + parseFloat(1)}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {bookingItem.guest.name}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {bookingItem.guest.address}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {bookingItem.guest.age}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {bookingItem.bookingNo}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {bookingItem.guestBookingRooms[0].room.roomNo}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {dayjs(bookingItem.checkInDate).format(dateFormat)}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {dayjs(bookingItem.checkOutDate).format(dateFormat)}
                          </TableCell>

                          <TableCell style={{ textAlign: "left" }}>
                            {dayjs(bookingItem.createdDate).format(dateFormat)}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {bookingItem.bookingRoomQty}
                          </TableCell>
                          
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(bookingItem.dicountAmount).toFixed(2)
                            )}
                          </TableCell>
                  
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(bookingItem.otherCharge).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(bookingItem.paidAmount).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(bookingItem.dueAmount).toFixed(2)
                            )}
                          </TableCell>

                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(bookingItem.subTotal).toFixed(2)
                            )}
                          </TableCell>
                   
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(bookingItem.totalAmount).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell
                            className="print-no"
                            style={{ textAlign: "right" }}
                          >
                            <div className="flex items-center gap-3 justify-around">
                              <Link
                                to={{
                                  pathname: `/booking/booking-invoice/${bookingItem.id}`,
                                }}
                              >
                                <ReceiptIcon
                                  style={{
                                    color: "blue",
                                    cursor: "pointer",
                                  }}
                                />
                              </Link>
                              {/* <Link
                                to={{
                                  pathname: `/booking/quick-checkin/${bookingItem.id}`,
                                }}
                              >
                                <EditNoteIcon
                                  style={{
                                    color: "green",
                                    cursor: "pointer",
                                  }}
                                />
                              </Link> */}
                              <DeleteForeverIcon
                                style={{
                                  color: "red",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleDelete(bookingItem)}
                              />
                            </div>
                          </TableCell>
                        </TableRow>

                        {bookingItem.guestBookingRooms
                          .slice(1)
                          .map((detail) => (
                            <TableRow>
                              <TableCell colSpan={7}></TableCell>

                              <TableCell style={{ textAlign: "left" }}>
                                {detail.room.roomNo}
                              </TableCell>
                              <TableCell colSpan={11}></TableCell>
                            </TableRow>
                          ))}
                      </>
                    ))}

                    <TableRow>
                      <TableCell
                        colSpan={15}
                        style={{ fontWeight: "bold", textAlign: "right" }}
                      >
                        Grand Total :
                      </TableCell>
                      <TableCell
                        style={{ fontWeight: "bold", textAlign: "right" }}
                      >
                        {amountFormat(parseFloat(grandTotal).toFixed(2))}
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

  //handle report:
  const handleReport = () => {
    getBooking();
    printSet(true);
  };

  const getBooking = async () => {
    try {
      loadingSet(true);
      let url = ``;
      if (selectedRecordType.type == "With Details") {
        url = `Booking`;
      }

      const response = await axios.get(`${API_URL}api/v1/${url}`, {
        headers: authHeaders,
        params: {
          GuestId: guestSelect != null ? guestSelect.id : null,
          UserId: userSelect != null ? userSelect.id : null,
          fromDate:
            selectedFromDate != null
              ? selectedFromDate.format(dateFormat)
              : null,
          toDate:
            selectedToDate != null ? selectedToDate.format(dateFormat) : null,
        },
      });
      bookingDataSet(response.data);
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

  const filterType = [
    { type: "All" },
    { type: "By Guest" },
    { type: "By User" },
  ];
  const recordType = [{ type: "With Details" }];

  useEffect(() => {
    getUsers();
    getGuests();
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

  const getGuests = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/Guest`, {
        headers: authHeaders,
      });
      guestsSet(response.data);
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
          BOOKING RECORD
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
            selectedFilterType.type === "By Guest" && (
              <Grid item xs={12} md={2} sm={2}>
                <Autocomplete
                  autoHighlight={true}
                  openOnFocus={true}
                  size="small"
                  id="combo-box-filter"
                  options={guests}
                  value={guestSelect}
                  onChange={(e, value) => {
                    guestSelectSet(value);
                  }}
                  getOptionLabel={(option) => option.name}
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} label="SELECT GUEST" />
                  )}
                />
              </Grid>
            )}
          {selectedFilterType != null &&
            selectedFilterType.type === "By User" && (
              <Grid item xs={12} md={2} sm={2}>
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

          <Grid item xs={12} md={2} sm={2}>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              size="small"
              id="combo-box-filter"
              options={recordType}
              value={selectedRecordType}
              onChange={(e, value) => {
                selectedRecordTypeSet(value);
                bookingDataSet([])
              }}
              getOptionLabel={(option) => option.type}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="RECORD TYPE" />
              )}
            />
          </Grid>

          <Grid item xs={12} md={2} sm={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="FROM DATE"
                slotProps={{ field: { size: "small" } }}
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

export default BookingRecord;
