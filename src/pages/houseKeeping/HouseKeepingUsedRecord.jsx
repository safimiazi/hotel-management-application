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

const HouseKeepingUsedRecord = () => {
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
  const [houseKeepingUsedData, houseKeepingUsedDataSet] = useState([]);
  const [grandTotal, grandTotalSet] = useState(0);
  const [users, usersSet] = useState([]);
  const [userSelect, userSelectSet] = useState(null);

  const [rooms, roomsSet] = useState([]);
  const [selectedRoom, selectedRoomSet] = useState(null);
  const [floors, floorsSet] = useState([]);
  const [selectedFloor, selectedFloorSet] = useState(null);

  useEffect(() => {
    const total = houseKeepingUsedData
      .map((singleItem) => singleItem.totalCost)
      .reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);
    grandTotalSet(total);
  }, [houseKeepingUsedData]);

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
              `${API_URL}api/v1/HouseKeepingUsed/${row.id}`,
              { headers: authHeaders },
              { id: row.id }
            );
            Swal.fire({
              icon: "success",
              title: `${response.data.invoiceNo} is deleted Successfully`,
            });

            getHouseKeepingUsed();
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
                      <TableCell align="left" width="3%">
                        SL
                      </TableCell>
                      <TableCell align="left" width="5%">
                        INVOICE NO
                      </TableCell>
                      <TableCell align="left" width="5%">
                        FLOOR NO
                      </TableCell>
                      <TableCell align="left" width="5%">
                        ROOM NO
                      </TableCell>
                      <TableCell align="left" width="5%">
                        SUB TOTAL
                      </TableCell>
                      <TableCell align="left" width="5%">
                        OTHERS CHARGE
                      </TableCell>

                      {/* details start */}
                      <TableCell align="left" width="5%">
                        ITEM NAME
                      </TableCell>
                      <TableCell align="left" width="5%">
                        QTY
                      </TableCell>
                      <TableCell align="left" width="5%">
                        RATE
                      </TableCell>
                      <TableCell align="left" width="5%">
                        AMOUNT
                      </TableCell>
                      {/* details end */}

                      <TableCell align="left" width="5%">
                        TOTAL COST
                      </TableCell>
                      <TableCell className="print-no" align="left" width="6%">
                        ACTIONS
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {houseKeepingUsedData.map((usedItem, inx) => (
                      <>
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            {inx + parseFloat(1)}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {usedItem.invoiceNo}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {usedItem.floor.floorNo}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {usedItem.room.roomNo}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(usedItem.subTotal).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(usedItem.othersCharge).toFixed(2)
                            )}
                          </TableCell>

                          {/* details start */}
                          <TableCell style={{ textAlign: "left" }}>
                            {usedItem.itemUsedDetails[0].item.name}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {usedItem.itemUsedDetails[0].qty}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(
                                usedItem.itemUsedDetails[0].rate
                              ).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(
                                usedItem.itemUsedDetails[0].amount
                              ).toFixed(2)
                            )}
                          </TableCell>
                          {/* details start */}
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(usedItem.totalCost).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell
                            className="print-no"
                            style={{ textAlign: "right" }}
                          >
                            <div className="flex items-center gap-3 justify-around">
                              <Link
                                to={{
                                  pathname: `/house-keeping/house-keeping-used-invoice/${usedItem.id}`,
                                }}
                              >
                                <ReceiptIcon
                                  style={{
                                    color: "blue",
                                    cursor: "pointer",
                                  }}
                                />
                              </Link>
                              <Link
                                to={{
                                  pathname: `/house-keeping/house-keeping-used/${usedItem.id}`,
                                }}
                              >
                                <EditNoteIcon
                                  style={{
                                    color: "green",
                                    cursor: "pointer",
                                  }}
                                />
                              </Link>
                              <DeleteForeverIcon
                                style={{
                                  color: "red",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleDelete(usedItem)}
                              />
                            </div>
                          </TableCell>
                        </TableRow>

                        {usedItem.itemUsedDetails.slice(1).map((detail) => (
                          <TableRow>
                            <TableCell colSpan={7}></TableCell>

                            <TableCell style={{ textAlign: "left" }}>
                              {detail.item.name}
                            </TableCell>
                            <TableCell style={{ textAlign: "right" }}>
                              {detail.qty}
                            </TableCell>
                            <TableCell style={{ textAlign: "right" }}>
                              {amountFormat(parseFloat(detail.rate).toFixed(2))}
                            </TableCell>
                            <TableCell style={{ textAlign: "right" }}>
                              {amountFormat(
                                parseFloat(detail.amount).toFixed(2)
                              )}
                            </TableCell>
                            <TableCell colSpan={2}></TableCell>
                          </TableRow>
                        ))}
                      </>
                    ))}

                    <TableRow>
                      <TableCell
                        colSpan={10}
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
        {print &&
          selectedRecordType != null &&
          selectedRecordType.type === "Without Details" && (
            <div className="print-content p-4">
              <TableContainer className="report-dom">
                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" width="3%">
                        SL
                      </TableCell>
                      <TableCell align="left" width="5%">
                        INVOICE NO
                      </TableCell>
                      <TableCell align="left" width="5%">
                        FLOOR NO
                      </TableCell>
                      <TableCell align="left" width="5%">
                        ROOM NO
                      </TableCell>
                      <TableCell align="left" width="5%">
                        SUB TOTAL
                      </TableCell>
                      <TableCell align="left" width="5%">
                        OTHERS CHARGE
                      </TableCell>
                      <TableCell align="left" width="5%">
                        TOTAL COST
                      </TableCell>

                      <TableCell className="print-no" align="left" width="6%">
                        ACTIONS
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {houseKeepingUsedData.map((usedItem, inx) => (
                      <>
                        <TableRow>
                          <TableCell style={{ textAlign: "left" }}>
                            {inx + parseFloat(1)}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {usedItem.invoiceNo}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {usedItem.floor.floorNo}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {usedItem.room.roomNo}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(usedItem.subTotal).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(usedItem.othersCharge).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {amountFormat(
                              parseFloat(usedItem.totalCost).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell
                            className="print-no"
                            style={{ textAlign: "right" }}
                          >
                            <div className="flex items-center gap-3 justify-around">
                              <Link
                                to={{
                                  pathname: `/house-keeping/house-keeping-used-invoice/${usedItem.id}`,
                                }}
                              >
                                <ReceiptIcon
                                  style={{
                                    color: "blue",
                                    cursor: "pointer",
                                  }}
                                />
                              </Link>
                              <Link
                                to={{
                                  pathname: `/house-keeping/house-keeping-used/${usedItem.id}`,
                                }}
                              >
                                <EditNoteIcon
                                  style={{
                                    color: "green",
                                    cursor: "pointer",
                                  }}
                                />
                              </Link>
                              <DeleteForeverIcon
                                style={{
                                  color: "red",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleDelete(usedItem)}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      </>
                    ))}

                    <TableRow>
                      <TableCell
                        colSpan={6}
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
    getHouseKeepingUsed();
    printSet(true);
  };
  const getHouseKeepingUsed = async () => {
    try {
      loadingSet(true);
      let url = ``;
      if (selectedRecordType.type == "With Details") {
        url = `HouseKeepingUsed`;
      }
      if (selectedRecordType.type == "Without Details") {
        url = `HouseKeepingUsed/get-item-Used-record`;
      }
      const response = await axios.get(`${API_URL}api/v1/${url}`, {
        headers: authHeaders,
        params: {
          FloorId: selectedFloor != null ? selectedFloor.id : null,
          RoomId: selectedRoom != null ? selectedRoom.id : null,
          UserId: userSelect != null ? userSelect.id : null,
          fromDate:
            selectedFromDate != null
              ? selectedFromDate.format(dateFormat)
              : null,
          toDate:
            selectedToDate != null ? selectedToDate.format(dateFormat) : null,
        },
      });
      houseKeepingUsedDataSet(response.data);
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

  useEffect(() => {
    getUsers();
    getFloors();
    getRooms();
  }, []);

  const getRooms = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/Room`, {
        headers: authHeaders,
      });
      roomsSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const getFloors = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/Floor`, {
        headers: authHeaders,
      });
      floorsSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

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

  const filterType = [
    { type: "All" },
    { type: "By Floor" },
    { type: "By Room" },
    { type: "By User" },
  ];
  const recordType = [{ type: "With Details" }, { type: "Without Details" }];

  return (
    <div>
      <Paper className="m-3 p-3">
        <Typography
          variant="h6"
          className="MuiTypography-h6 mb-3"
          style={{ marginBottom: "8px" }}
        >
          HOUSE KEEPING USED RECORD
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

          {selectedFilterType != null &&
            selectedFilterType.type === "By Room" && (
              <Grid item xs={12} md={2} sm={2}>
                <Autocomplete
                  autoHighlight={true}
                  openOnFocus={true}
                  size="small"
                  id="combo-box-filter"
                  options={rooms}
                  value={selectedRoom}
                  onChange={(e, value) => {
                    selectedRoomSet(value);
                  }}
                  getOptionLabel={(option) => option.roomNo}
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} label="SELECT ROOM" />
                  )}
                />
              </Grid>
            )}
          {selectedFilterType != null &&
            selectedFilterType.type === "By Floor" && (
              <Grid item xs={12} md={2} sm={2}>
                <Autocomplete
                  autoHighlight={true}
                  openOnFocus={true}
                  size="small"
                  id="combo-box-filter"
                  options={floors}
                  value={selectedFloor}
                  onChange={(e, value) => {
                    selectedFloorSet(value);
                  }}
                  getOptionLabel={(option) => option.floorNo}
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} label="SELECT FLOOR" />
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

export default HouseKeepingUsedRecord;
