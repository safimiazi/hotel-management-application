import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Conversionratio,
  Dealsstatistics,
  Profit,
  Profitearned,
  Revenueanalytics,
  Sourcedata,
  Totalcustomers,
  Totaldeals,
  Totalrevenue,
} from "./crmdata";
import face10 from "../../../assets/images/faces/10.jpg";
import face12 from "../../../assets/images/faces/12.jpg";
import axios from "axios";
import swal from "sweetalert2";
import { API_URL } from "../../../../config.json";

import { amountFormat, auth, dateFormat } from "../../../../utils";
import { authHeaders } from "../../../../utils";

import Grid from "@mui/material/Grid";
import { Box, Typography } from "@mui/material";

import dayjs from "dayjs";
import Swal from "sweetalert2";

const Crm = () => {
  // for User search function
  const [Data, setData] = useState(Dealsstatistics);

  const userdata = [];

  const myfunction = (idx) => {
    let Data;
    for (Data of Dealsstatistics) {
      if (Data.name[0] == " ") {
        Data.name = Data.name.trim();
      }
      if (Data.name.toLowerCase().includes(idx.toLowerCase())) {
        if (Data.name.toLowerCase().startsWith(idx.toLowerCase())) {
          userdata.push(Data);
        }
      }
    }
    setData(userdata);
  };

  const [checkInDate, checkInDateSet] = useState(dayjs());
  const [checkOutDate, checkOutDateSet] = useState(dayjs().add(1, "day"));
  const [allRoomsData, allRoomsDataSet] = useState([]);
  const [totalRoom, totalRoomSet] = useState(0);
  const [bookedRoom, bookedRoomSet] = useState(0);
  const [availableRoom, availableRoomSet] = useState(0);
  const [expensData, expensDataSet] = useState(null);

  const [fromDate, fromDateSet] = useState(dayjs());
  const [toDate, toDateSet] = useState(dayjs());

  const [todayTotalRestaurantSaleAmount, todayTotalRestaurantSaleAmountSet] = useState(null);
  const [todayTotalBarSaleAmount, todayTotalBarSaleAmountSet] = useState(null);
  const [todayTotalBookingAmount, todayTotalBookingAmountSet] = useState(null);
  const [todayTotalServiceAmount, todayTotalServiceAmountSet] = useState(null);
  const today = dayjs().format(dateFormat);





  useEffect(() => {
    getAllRoomWithStatus();
    getTotalRoom();
    getBookedRoom();
    getAvailableRoom();
    getExpenseThisMonth();

    getTodayRestaurantSalesAmount();
    getTodayBarSaleAmount();
    getTodayBookingAmount();
    getTodayPremiumServiceTotalAmount()
  }, []);

  //today primium service amount report:
  const getTodayPremiumServiceTotalAmount = async () => {
    try {
 
      const response = await axios.get(`${API_URL}api/v1/PremiumService/get-service-record`, {
        headers: authHeaders,
        params: {
     
          fromDate: today != null ? today : null,
          toDate: today != null ? today : null,
        },
      });
      const total = response.data.reduce(
        (prev, curr) => parseFloat(prev) + parseFloat(curr.totalAmount),
        0
      );
      todayTotalServiceAmountSet(total);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  // Today Booking Amount Report:
  const getTodayBookingAmount = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/Booking`, {
        headers: authHeaders,
        params: {
          fromDate: today != null ? today : null,
          toDate: today != null ? today : null,
        },
      });
      const total = response.data.reduce(
        (prev, curr) => parseFloat(prev) + parseFloat(curr.totalAmount),
        0
      );
      todayTotalBookingAmountSet(total);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  //today sale amount report:
  const getTodayRestaurantSalesAmount = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/ItemSales/get-item-sales-record`,
        {
          headers: authHeaders,
          params: {
            fromDate: today != null ? today : null,
            toDate: today != null ? today : null,
          },
        }
      );
      const total = response.data.reduce(
        (prev, curr) => parseFloat(prev) + parseFloat(curr.totalAmount),
        0
      );
      todayTotalRestaurantSaleAmountSet(total);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  //get total bar sale amount report:
  const getTodayBarSaleAmount = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/BarItemSale/get-item-sales-record`,
        {
          headers: authHeaders,
          params: {
            fromDate: today != null ? today : null,
            toDate: today != null ? today : null,
          },
        }
      );
      const total = response.data.reduce(
        (prev, curr) => parseFloat(prev) + parseFloat(curr.totalAmount),
        0
      );
      todayTotalBarSaleAmountSet(total);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const getExpenseThisMonth = async () => {
    try {
      // Calculate the first and last day of the previous month
      const now = dayjs();
      //for last manth:
      // const startOfLastMonth = now.subtract(1, 'month').startOf('month');
      // const endOfLastMonth = now.subtract(1, 'month').endOf('month');

      // for current month:
      const startOfMonth = now.startOf("month");
      const endOfMonth = now.endOf("month");

      // Convert to YYYY-MM-DD format
      const fromDate = startOfMonth.format(dateFormat);
      const toDate = endOfMonth.format(dateFormat);

      //  API request
      const response = await axios.get(
        `${API_URL}api/v1/Report/get-expense-balance`,
        {
          headers: authHeaders,
          params: {
            FromDate: fromDate,
            ToDate: toDate,
          },
        }
      );

      expensDataSet(response.data);
    } catch (error) {
      swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Reload or try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const getBookedRoom = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/Booking/get-booked-rooms-count`,
        {
          headers: authHeaders,
          params: {
            CheckInDate: checkInDate.format("YYYY-MM-DD"),
            CheckOutDate: checkOutDate.format("YYYY-MM-DD"),
          },
        }
      );
      bookedRoomSet(response.data);
    } catch (error) {
      swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Reload or try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const getAvailableRoom = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/Booking/get-available-rooms-count`,
        {
          headers: authHeaders,
          params: {
            CheckInDate: checkInDate.format("YYYY-MM-DD"),
            CheckOutDate: checkOutDate.format("YYYY-MM-DD"),
          },
        }
      );
      availableRoomSet(response.data);
    } catch (error) {
      swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Reload or try again later.",
        confirmButtonText: "OK",
      });
    }
  };
  const getTotalRoom = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/Booking/get-all-room-count`,
        {
          headers: authHeaders,
        }
      );
      totalRoomSet(response.data);
    } catch (error) {
      swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Reload or try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const getAllRoomWithStatus = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/Booking/get-all-room-with-status`,
        {
          headers: authHeaders,
          params: {
            CheckInDate: checkInDate.format("YYYY-MM-DD"),
            CheckOutDate: checkOutDate.format("YYYY-MM-DD"),
          },
        }
      );
      allRoomsDataSet(response.data);
    } catch (error) {
      swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Reload or try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const getClassNames = (room) => {
    return room.isBooked ? "statusColorRed" : "statusColorGreen";
  };

  // চার্টের জন্য সিরিজ এবং লেবেল তৈরি করুন
  const [chartData, chartDataSet] = useState(null);
  useEffect(() => {
    const chartData = {
      series: expensData?.report.map((item) => item.balance),
      labels: expensData?.report.map((item) => item.title),
    };
    chartDataSet(chartData);
  }, [expensData]);




  // Calculate total sales amount
  const total = todayTotalRestaurantSaleAmount + todayTotalBarSaleAmount + todayTotalBookingAmount + todayTotalServiceAmount;

  // Calculate percentages
  const getPercentage = (value) => (total > 0 ? (value / total) * 100 : 0);





  return (
    <Fragment>
      <div className="md:flex block items-center justify-between my-[1.5rem] page-header-breadcrumb">
        <div>
          <p
            className="font-semibold text-[1.125rem] text-defaulttextcolor dark:text-defaulttextcolor/70 !mb-0 "
            style={{ textTransform: "uppercase" }}
          >
            BRANCH : {auth.branchName} - USER: {auth.userName}{" "}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-9 xl:col-span-12  col-span-12">
          <div className="grid grid-cols-12 gap-x-6">
            {/* Total Room */}
            <div className="xxl:col-span-4 xl:col-span-4 col-span-12">
              <div className="box overflow-hidden">
                <div className="box-body">
                  <div className="flex items-top justify-between">
                    <div>
                      <span
                        className="!text-[0.8rem]  !w-[2.5rem] !h-[2.5rem] !leading-[2.5rem] !rounded-full inline-flex items-center justify-center "
                        style={{ backgroundColor: "blue" }}
                      >
                        <i className="ti ti-home text-[1rem] text-white"></i>
                      </span>
                    </div>

                    <div className="flex-grow ms-4">
                      <div className="flex items-center justify-between flex-wrap">
                        <div>
                          <p className="text-[#8c9097] dark:text-white/50 text-[0.813rem] mb-0">
                            Total Room
                          </p>
                          <h4 className="font-semibold  text-[1.5rem] !mb-2 ">
                            {totalRoom}
                          </h4>
                        </div>
                      </div>
        
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="xxl:col-span-4 xl:col-span-4 col-span-12">
              <div className="box overflow-hidden">
                <div className="box-body">
                  <div className="flex items-top justify-between">
                    <div>
                      <span
                        className="!text-[0.8rem]  !w-[2.5rem] !h-[2.5rem] !leading-[2.5rem] !rounded-full inline-flex items-center justify-center "
                        style={{ backgroundColor: "red" }}
                      >
                        <i className="ti ti-home text-[1rem] text-white"></i>
                      </span>
                    </div>

                    <div className="flex-grow ms-4">
                      <div className="flex items-center justify-between flex-wrap">
                        <div>
                          <p className="text-[#8c9097] dark:text-white/50 text-[0.813rem] mb-0">
                            {" "}
                            Today Booked Room{" "}
                          </p>
                          <h4 className="font-semibold  text-[1.5rem] !mb-2 ">
                            {bookedRoom}
                          </h4>
                        </div>
                      </div>
    
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="xxl:col-span-4 xl:col-span-4 col-span-12">
              <div className="box overflow-hidden">
                <div className="box-body">
                  <div className="flex items-top justify-between">
                    <div>
                      <span
                        className="!text-[0.8rem]  !w-[2.5rem] !h-[2.5rem] !leading-[2.5rem] !rounded-full inline-flex items-center justify-center "
                        style={{ backgroundColor: "green" }}
                      >
                        <i className="ti ti-home text-[1rem] text-white"></i>
                      </span>
                    </div>

                    <div className="flex-grow ms-4">
                      <div className="flex items-center justify-between flex-wrap">
                        <div>
                          <p className="text-[#8c9097] dark:text-white/50 text-[0.813rem] mb-0">
                            {" "}
                            Today Available Room{" "}
                          </p>
                          <h4 className="font-semibold  text-[1.5rem] !mb-2 ">
                            {availableRoom}
                          </h4>
                        </div>
                      </div>
       
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
              <Grid container spacing={2}>
                {allRoomsData.length !== 0 ? (
                  allRoomsData.map((floor, inx) => (
                    <Grid item xs={12} md={12} lg={6} key={inx}>
                      <div className="floor box">
                        <h4
                          className="floor-title"
                          style={{ textAlign: "center", color: "black" }}
                        >
                          <Typography
                            variant="h6"
                            className="MuiTypography-h6 mb-3"
                            style={{
                              marginBottom: "8px",
                              marginTop: "-10px",
                              color: "#585858",
                              fontWeight: "bold",
                              textTransform: "uppercase",
                              borderBottom: "1px solid #d4eb78",
                              fontSize: "large",
                              fontStyle: "italic",
                              background: "#f7f7f7",
                              borderRadius: "2px",
                            }}
                          >
                            FLOOR NO : {floor.floorNo}
                          </Typography>
                        </h4>

                        <Grid
                          container
                          justifyContent="center"
                          className="room-section"
                        >
                          {floor.roomTypes.map((roomType) => (
                            <Grid
                              container
                              style={{
                                marginBottom: "10px",
                                border: "1px solid #efe5e5",
                                padding: "10px",
                              }}
                              key={roomType.roomTypeName}
                            >
                              <Grid container xs={12}>
                                <Grid item xs={6}>
                                  <span
                                    class="!text-[0.8rem]  !w-[0.5rem] !h-[0.5rem] !leading-[0.5rem] !rounded-full inline-flex items-center justify-center  "
                                    style={{
                                      backgroundColor: "red",
                                      textAlign: "left",
                                    }}
                                  ></span>{" "}
                                  <span style={{ color: "black" }}>Booked</span>
                                  <span
                                    class="!text-[0.8rem]  !w-[0.5rem] !h-[0.5rem] !leading-[0.5rem] !rounded-full inline-flex items-center justify-center  "
                                    style={{
                                      backgroundColor: "green",
                                      textAlign: "left",
                                      marginLeft: "2px",
                                    }}
                                  ></span>{" "}
                                  <span style={{ color: "black" }}>
                                    Available TODAY
                                  </span>
                                </Grid>

                                <Grid item xs={6}>
                                  <p
                                    style={{
                                      fontWeight: "bold",
                                      textAlign: "right",
                                      marginLeft: "4px",
                                      textTransform: "uppercase",
                                      color: "#7cb500",
                                    }}
                                  >
                                    {roomType.roomTypeName}{" "}
                                    <span
                                      style={{
                                        fontSize: "12px",
                                        color: "#babcb3",
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      - (RATE : {roomType.fare} )
                                    </span>
                                  </p>
                                </Grid>
                              </Grid>

                              <Box sx={{ flexGrow: 1, display: "contents" }}>
                                {roomType.rooms.map((room) => {
                                  const classNames = getClassNames(room);

                                  return (
                                    <Grid
                                      style={{
                                        cursor: "pointer",
                                        textTransform: "uppercase",
                                        margin: "4px",
                                      }}
                                      item
                                      xs={3}
                                      className={`seat ${classNames}`}
                                      key={room.roomNo}
                                      onClick={() => handleBookingClick(room)}
                                    >
                                      <h6 className="seat-title">
                                        {room.roomNo}
                                      </h6>
                                    </Grid>
                                  );
                                })}
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </div>
                    </Grid>
                  ))
                ) : (
                  <p>No data available</p>
                )}
              </Grid>
            </div>

            {/* Total Room End */}
          </div>
        </div>
        <div className="xxl:col-span-3 xl:col-span-12 col-span-12">
          <div className="grid grid-cols-12 gap-x-6">
            
            
            {/* deals status: */}
            <div className="xxl:col-span-12 xl:col-span-6  col-span-12">
              <div className="box">
                <div className="box-header justify-between">
                  <div className="box-title">Today Summary </div>
                </div>
                <div className="box-body">
                  <div className="flex w-full h-[0.3125rem] mb-6 rounded-full overflow-hidden">
                    
                  <div
                      className="flex flex-col justify-center rounded-none overflow-hidden bg-warning "
                      style={{ width: `${getPercentage(todayTotalBookingAmount)}%` }}
                      aria-valuenow={getPercentage(todayTotalBookingAmount)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                    <div
                      className="flex flex-col justify-center rounded-s-[0.625rem] overflow-hidden bg-primary "
                      style={{ width: `${getPercentage(todayTotalRestaurantSaleAmount)}%` }}
                      aria-valuenow={getPercentage(todayTotalRestaurantSaleAmount)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                    <div
                      className="flex flex-col justify-center rounded-none overflow-hidden bg-info"
                      style={{ width: `${getPercentage(todayTotalBarSaleAmount)}%` }}
                      aria-valuenow={getPercentage(todayTotalBarSaleAmount)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
              
                    <div
                      className="flex flex-col justify-center rounded-e-[0.625rem] overflow-hidden bg-success"
                      style={{ width: `${getPercentage(todayTotalServiceAmount)}%` }}
                      aria-valuenow={getPercentage(todayTotalServiceAmount)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                  </div>
                  <ul className="list-none mb-0 pt-2 crm-deals-status">
                  <li className="warning">
                      {todayTotalBookingAmount != null && (
                        <div className="flex items-center text-[0.813rem]  justify-between">
                          <div>Today Booking Amount</div>
                          <div className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                            {amountFormat(
                              parseFloat(todayTotalBookingAmount).toFixed(2)
                            )}
                          </div>
                        </div>
                      )}
                    </li>
                    <li className="primary">
                      {todayTotalRestaurantSaleAmount != null && (
                        <div className="flex items-center text-[0.813rem]  justify-between">
                          <div>Today Restaurant Sales Amount</div>
                          <div className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                            {amountFormat(
                              parseFloat(todayTotalRestaurantSaleAmount).toFixed(2)
                            )}
                          </div>
                        </div>
                      )}
                    </li>
                    <li className="info">
                      {todayTotalBarSaleAmount != null && (
                        <div className="flex items-center text-[0.813rem]  justify-between">
                          <div>Today Bar Sales Amount</div>
                          <div className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                            {amountFormat(
                              parseFloat(todayTotalBarSaleAmount).toFixed(2)
                            )}
                          </div>
                        </div>
                      )}
                    </li>
             
                    <li className="success">
                      {
                        todayTotalServiceAmount != null && (
                          <div className="flex items-center text-[0.813rem]  justify-between">
                          <div>Today Service Amount</div>
                          <div className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                          {amountFormat(
                              parseFloat(todayTotalServiceAmount).toFixed(2)
                            )}
                          </div>
                        </div>
                        )
                      }
                    
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Expense of this Month: */}
            <div className="xxl:col-span-12 xl:col-span-12  col-span-12">
              <div className="box">
                <div className="box-header justify-between">
                  <div className="box-title">Expense of this Month</div>
             
                </div>
                <div className="box-body overflow-hidden">
                  <div className="leads-source-chart flex items-center justify-center">
                    {chartData != null ? (
                      <Sourcedata data={chartData} />
                    ) : (
                      "Loading..."
                    )}
                    <div className="lead-source-value ">
                      <span className="block text-[0.875rem] ">Total</span>
                      <span className="block text-[1.5625rem] font-bold">
                        {expensData?.totalBalance &&
                          amountFormat(parseFloat(expensData?.totalBalance))}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 border-t border-dashed dark:border-defaultborder/10">
                  {expensData != null &&
                    expensData?.report.length > 0 &&
                    expensData.report.map((item, inx) => (
                      <div key={inx} className="col !p-0">
                        <div className="!ps-4 p-[0.95rem] text-center border-e border-dashed dark:border-defaultborder/10">
                          <span className="text-[#8c9097] dark:text-white/50 text-[0.75rem] mb-1 crm-lead-legend  mobile inline-block">
                            {item?.title}
                          </span>
                          <div>
                            <span className="text-[1rem]  font-semibold">
                              {amountFormat(parseFloat(item?.balance))}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div className="transition fixed inset-0 z-50 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 opacity-0 hidden"></div>
    </Fragment>
  );
};

export default Crm;
