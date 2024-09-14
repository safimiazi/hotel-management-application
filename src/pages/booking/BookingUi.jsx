import React, { useState, useEffect, useRef, useCallback } from "react";
import TextField from "@mui/material/TextField";
import swal from "sweetalert2";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import Button from "@mui/joy/Button";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { API_URL } from "../../../config.json";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "../../assets/css/global.css";
import "../../assets/css/global.css";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Box,
  debounce,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import {
  amountFormat,
  authHeaders,
  cashBankAccountFilterTypes,
  dateFormat,
  pathSplitter,
} from "../../../utils";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";

const GroupManage = () => {
  // Init states start
  const [checkInDate, checkInDateSet] = useState(null);
  const [checkOutDate, checkOutDateSet] = useState(null);
  const [allRoomsData, allRoomsDataSet] = useState([]);
  const [loading, loadingSet] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState([]);
  let [selectedRoom, selectedRoomSet] = useState(null);

  // pagination states:
  const [SearchTerm, SearchTermSet] = useState("");
  // guest information:
  const [guestTypes, guestTypesSet] = useState([]);
  const [guests, guestsSet] = useState([]);
  const [accounts, accountsSet] = useState([]);

  const [selectedGuestType, selectedGuestTypeSet] = useState(null);
  const [selectedAccount, selectedAccountSet] = useState(null);
  const [paymentAmountValue, paymentAmountValueSet] = useState(0);
  const [selectedIdType, selectedIdTypeSet] = useState({ label: "NID" });

  const [bookingNo, bookingNoSet] = useState("");
  const [note, noteSet] = useState("");
  const [bookingRoomQty, bookingRoomQtySet] = useState(0);
  const [totalStayDay, totalStayDaySet] = useState(0);
  const [assignMaterialModal, assignMaterialModalSet] = useState(false);
  const [paymentIndex, paymentIndexSet] = useState(null);
  const [purchaseInvoiceTransactions, purchaseInvoiceTransactionsSet] =
    useState([]);
  const [isSaving, isSavingSet] = useState(false);
  const [name, nameSet] = useState("");
  const [address, addressSet] = useState("");
  const [age, ageSet] = useState("");
  const [mobileNo, mobileNoSet] = useState("");
  const [email, emailSet] = useState("");
  const [gender, genderSet] = useState(null);
  const [idNumber, idNumberSet] = useState("");
  const [subTotal, subTotalSet] = useState(0);
  const [othersCharge, othersChargeSet] = useState(0);
  const [discountAmount, discountAmountSet] = useState(0);
  const [paidAmount, paidAmountSet] = useState(0);
  const [dueAmount, dueAmountSet] = useState(0);
  const [action, actionSet] = useState("post");

  const [totalAmount, totalAmountSet] = useState(0);
  const [createdDate, createdDateSet] = useState(dayjs());
  const [selectedGuest, selectedGuestSet] = useState(null);
  const [paymentTotalAmount, paymentTotalAmountSet] = useState(0);
  const [id, idSet] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const getAllRoomWithStatus = async () => {
    if (checkInDate === null) {
      Swal.fire({
        title: "Please Select Check In Date",
        icon: "warning",
      });

      return false;
    }

    if (checkOutDate === null) {
      Swal.fire({
        title: "Please Select Check Out Date",
        icon: "warning",
      });

      return false;
    }

    if (checkInDate && checkOutDate && !checkInDate.isBefore(checkOutDate)) {
      Swal.fire({
        title:
          "Check-In Date and Check-Out Date not should be same or Invalid Date Duration.",
        icon: "warning",
      });
      return false;
    }
    if (checkOutDate && checkInDate && !checkOutDate.isAfter(checkInDate)) {
      Swal.fire({
        title: "Check-Out Date must be after Check-In Date",
        icon: "warning",
      });
      return false;
    }

    loadingSet(true);

    try {
      const response = await axios.get(
        `${API_URL}api/v1/Booking/get-all-room-with-status`,
        {
          headers: authHeaders,
          params: {
            CheckInDate: checkInDate.format(dateFormat),
            CheckOutDate: checkOutDate.format(dateFormat),
          },
        }
      );
      setSelectedRooms([]);
      allRoomsDataSet(response.data);
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

  const handleBookingClick = (room) => {
    if (room.isBooked == true) {
      swal.fire({
        title: "Already Booked",
        icon: "warning",
      });
      return false;
    }
    setSelectedRooms((prevSelectedRooms) => {
      if (prevSelectedRooms.includes(room)) {
        return prevSelectedRooms.filter(
          (selectedRoom) => selectedRoom !== room
        );
      } else {
        return [...prevSelectedRooms, room];
      }
    });
  };

  const getClassNames = (room) => {
    const isSelected = selectedRooms.includes(room);
    if (isSelected) {
      return "selectedColor";
    }
    return room.isBooked ? "statusColorRed" : "statusColorGreen";
  };

  const handleGuestSelect = (obj) => {
    selectedGuestSet(obj);
    noteSet(obj.note);
    idNumberSet(obj.idNumber);
    selectedIdTypeSet({ label: obj.idType });
    genderSet({ label: obj.gender });
    emailSet(obj.email);
    mobileNoSet(obj.mobileNo);
    ageSet(obj.age);
    addressSet(obj.address);
    nameSet(obj.name);
  };

  const resetForm = () => {
    createdDateSet(dayjs());
    selectedGuestSet(null);
    selectedGuestTypeSet(null);
    bookingNoSet("");
    bookingRoomQtySet(0);
    totalStayDaySet(0);
    nameSet("");
    addressSet("");
    ageSet("");
    mobileNoSet("");
    emailSet("");
    genderSet(null);
    selectedIdTypeSet(null);
    idNumberSet("");
    noteSet("");
    subTotalSet(0);
    othersChargeSet(0);
    discountAmountSet(0);
    totalAmountSet(0);
    paidAmountSet(0);
    dueAmountSet(0);
    allRoomsDataSet([]);
  };

  useEffect(() => {
    const totalAmount =
      parseFloat(subTotal) +
      parseFloat(othersCharge) -
      parseFloat(discountAmount);
    totalAmountSet(totalAmount);
  }, [subTotal, othersCharge, discountAmount]);

  useEffect(() => {
    const dueAmount = parseFloat(totalAmount) - parseFloat(paidAmount);
    dueAmountSet(dueAmount);
  }, [totalAmount, paidAmount]);

  useEffect(() => {
    allRoomsDataSet([]);
    selectedRoomSet([]);
  }, [checkInDate, checkOutDate]);

  useEffect(() => {
    const totalFare = selectedRooms.reduce(
      (prev, item) => parseFloat(prev) + parseFloat(item.fare),
      0
    );
    subTotalSet(parseFloat(totalFare) * parseFloat(totalStayDay));
  }, [selectedRooms, checkInDate, checkOutDate]);

  useEffect(() => {
    const payTotalAmount = purchaseInvoiceTransactions.reduce(
      (prev, item) => parseFloat(prev) + parseFloat(item.amount),
      0
    );

    paymentTotalAmountSet(payTotalAmount);
    paidAmountSet(payTotalAmount);
  }, [purchaseInvoiceTransactions]);

  useEffect(() => {
    bookingRoomQtySet(selectedRooms.length);
  }, [selectedRooms]);

  useEffect(() => {
    if (checkInDate != null && checkOutDate != null) {
      const daysDiff = checkOutDate.diff(checkInDate, "day");
      totalStayDaySet(daysDiff);
    }
  }, [checkInDate, checkOutDate]);

  const postGuest = async () => {
    if (createdDate === null) {
      Swal.fire({
        title: "Created Date is Required.",
        icon: "warning",
      });
    } 
    else if (selectedGuestType === null) {
      Swal.fire({
        title: "Guest Type is Required.",
        icon: "warning",
      });
    } 
    else if (gender === null) {
      Swal.fire({
        title: "Gender selection is Required.",
        icon: "warning",
      });
      return false;
    } 
    else if (mobileNo.length < 11) {
      Swal.fire({
        title: "Mobile number must be at least 11 digits.",
        icon: "warning",
      });
    } else if (bookingNo.trim() === "") {
      Swal.fire({
        title: "Booking No is Required.",
        icon: "warning",
      });
    } else if (checkInDate === null) {
      Swal.fire({
        title: "Check In Date is Required.",
        icon: "warning",
      });
    } else if (checkOutDate === null) {
      Swal.fire({
        title: "Check Out Date is Required.",
        icon: "warning",
      });
    } else if (bookingRoomQty === 0 || bookingRoomQty < 0) {
      Swal.fire({
        title: "Booking Room Qty is Required.",
        icon: "warning",
      });
    } else if (totalStayDay === 0 || totalStayDay < 0) {
      Swal.fire({
        title: "Total Stay Day is Required.",
        icon: "warning",
      });
    } else if (selectedRooms.length === 0) {
      Swal.fire({
        title: "Please Select Room",
        icon: "warning",
      });
    } else if (name.trim() === "") {
      Swal.fire({
        title: "Name is Required!",
        icon: "warning",
      });
    } else if (mobileNo === 0) {
      Swal.fire({
        title: "Mobile Number is Required!",
        icon: "warning",
      });
    } else if (paymentTotalAmount != paidAmount) {
      Swal.fire({
        title: "Payment Mathod Amount and Paid Amount Should be Same!",
        icon: "warning",
      });
    } else {
      const postData = {
        createdDate: createdDate.format(dateFormat),
        guestType: selectedGuestType.guestType,
        bookingNo: bookingNo,
        note: note,
        guestId: selectedGuest != null ? selectedGuest.id : null,
        checkInDate: checkInDate.format(dateFormat),
        checkOutDate: checkOutDate.format(dateFormat),
        bookingRoomQty: bookingRoomQty,
        totalStayDay: totalStayDay,
        bookingRoomIds: selectedRooms.map((room, inx) => room.id),
        invoiceTransaction: purchaseInvoiceTransactions.map((item) => ({
          payAccountId: item.payAccountId,
          amount: item.amount,
        })),
        guestSaveData: {
          name: name,
          guestType: selectedGuestType.guestType,
          address: address,
          age: age,
          mobileNo: mobileNo,
          email: email,
          gender: gender.label,
          note: note,
          idType: selectedIdType != null ? selectedIdType.label : "",
          idNumber: idNumber,
        },
        subTotal: subTotal,
        otherCharge: othersCharge,
        discountAmount: discountAmount,
        paidAmount: paidAmount,
        dueAmount: dueAmount,
        totalAmount: totalAmount,
      };

      isSavingSet(true);
      try {
        let response;

        if (action == "post") {
          response = await axios.post(`${API_URL}api/v1/Booking`, postData, {
            headers: authHeaders,
          });
        }

        if (action == "put") {
          response = await axios.put(
            `${API_URL}api/v1/Booking/${id}`,
            postData,
            {
              headers: authHeaders,
            }
          );
        }

        // After Api Response
        if (action === "post") {
          Swal.fire({
            title: `Booking is ${
              action == "post" ? "Create" : "update"
            } Successfully. Do you want to view the invoice?`,

            icon: "success",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonText: "No",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(`/booking/booking-invoice/${response.data.id}`);
            } else {
              resetForm();
            }
          });
        } else {
          Swal.fire({
            icon: "success",
            title: `Booking is update Successfully`,
          });
          resetForm();

          // if (action === "put") {
          //   navigate(`/purchase/item-purchase`);
          // }
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed! Please try again later.",
          confirmButtonText: "OK",
        });
      }

      isSavingSet(false);
    }
  };

  const handlePayment = () => {
    if (selectedAccount === null) {
      Swal.fire({
        title: "Please Select Account.",
        icon: "warning",
      });
    } else if (paymentAmountValue === 0) {
      Swal.fire({
        title: "Amount is Required.",
        icon: "warning",
      });
    } else {
      const transactionItem = {
        name: selectedAccount.name,
        payAccountId: selectedAccount.id,
        amount: paymentAmountValue,
      };

      if (paymentIndex != null) {
        let copyPurchaseInvoiceTransactions = [...purchaseInvoiceTransactions];
        copyPurchaseInvoiceTransactions[paymentIndex] = {
          name: selectedAccount.name,
          payAccountId: selectedAccount.id,
          amount: paymentAmountValue,
        };

        purchaseInvoiceTransactionsSet(copyPurchaseInvoiceTransactions);
        paymentIndexSet(null);
      } else {
        purchaseInvoiceTransactionsSet([
          ...purchaseInvoiceTransactions,
          transactionItem,
        ]);
        paymentIndexSet(null);
      }

      selectedAccountSet(null);
      paymentAmountValueSet(0);
    }
  };

  const handlePaymentEdit = (transactionItem, inx) => {
    paymentIndexSet(inx);
    selectedAccountSet({
      id: transactionItem.payAccountId,
      name: transactionItem.name,
    });
    paymentAmountValueSet(transactionItem.amount);
  };

  const handlePaymentDelete = (inx) => {
    const filteredItem = purchaseInvoiceTransactions.filter(
      (item, index) => index != inx
    );
    purchaseInvoiceTransactionsSet(filteredItem);
    paymentIndexSet(null);
  };

  useEffect(() => {
    idSet(
      pathSplitter(location.pathname, 2) != undefined
        ? parseFloat(pathSplitter(location.pathname, 2))
        : 0
    );

    if (pathSplitter(location.pathname, 2) != undefined) {
      actionSet("put");
    }

    if (pathSplitter(location.pathname, 2) != undefined) {
      getBookingDataWithDetails();
      isSavingSet(true);
    }
  }, []);

  const getBookingDataWithDetails = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/Booking/${pathSplitter(location.pathname, 2)}`,
        {
          headers: authHeaders,
        }
      );

      isSavingSet(false);

      handleEdit(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const handleEdit = (data) => {
    idSet(data.id);
    const parsedDate = dayjs(data.createdDate, dateFormat);
    createdDateSet(parsedDate.isValid() ? parsedDate : null);
    const parseCheckInDate = dayjs(data.checkInDate, dateFormat);
    checkInDateSet(parseCheckInDate.isValid() ? parseCheckInDate : null);
    const parseCheckOutDate = dayjs(data.checkOutDate, dateFormat);
    checkOutDateSet(parseCheckOutDate.isValid() ? parseCheckOutDate : null);
    row.guest.displayText = row.guest.name;
    handleGuestSelect(data.guest);
    selectedGuestTypeSet({ guestType: data.guestType });
    bookingNoSet(data.bookingNo);
    bookingRoomQtySet(data.bookingRoomQty);
    totalStayDaySet(0);
    nameSet("");
    addressSet("");
    ageSet("");
    mobileNoSet("");
    emailSet("");
    genderSet(null);
    selectedIdTypeSet(null);
    idNumberSet("");
    noteSet(data.note);
    subTotalSet(data.subTotal);
    othersChargeSet(data.otherCharge);
    discountAmountSet(0);
    totalAmountSet(data.totalAmount);
    paidAmountSet(0);
    dueAmountSet(0);
    purchaseInvoiceTransactionsSet(
      data.invoiceTransactions.map((item) => ({
        payAccountId: item.id,
        amount: item.amount,
      }))
    );
  };

  useEffect(() => {
    getGuestTypes();
    getAccounts();
    getBookingNumber();
  }, []);

  const getBookingNumber = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/Booking/get-booking-number`,
        {
          headers: authHeaders,
        }
      );
      bookingNoSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };
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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (SearchTerm) {
        getGuests(SearchTerm);
      } else {
        guestsSet([]);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [SearchTerm]);

  const [selectorSearchLoading, selectorSearchLoadingSet] = useState(false);

  const getGuests = async (term) => {
    if (term?.trim() === "") {
      return false;
    }
    try {
      selectorSearchLoadingSet(true);
      const response = await axios.get(`${API_URL}api/v1/Guest`, {
        headers: authHeaders,
        params: {
          SearchTerm: term.trim() !== "" ? term : null,
        },
      });
      guestsSet(response.data.records);
      selectorSearchLoadingSet(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to load data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const getGuestTypes = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/Booking/get-guest-types`,
        {
          headers: authHeaders,
        }
      );
      guestTypesSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const createdDateRef = useRef(null);
  const selectGuestRef = useRef(null);
  const guestTypeRef = useRef(null);
  const bookingNoRef = useRef(null);
  const bookingRoomQtyRef = useRef(null);
  const totalStayDayRef = useRef(null);
  const nameRef = useRef(null);
  const addressRef = useRef(null);
  const ageRef = useRef(null);
  const mobileNoRef = useRef(null);
  const emailRef = useRef(null);
  const genderRef = useRef(null);
  const idTypeRef = useRef(null);
  const idNumRef = useRef(null);
  const othersChargeRef = useRef(null);
  const discountAmountRef = useRef(null);
  const paidAmountRef = useRef(null);
  const bookingDateRef = useRef(null);
  const modalItemRef = useRef(null);
  const paymentAmountRef = useRef(null);
  const noteRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (e.target === bookingNoRef.current) {
        guestTypeRef.current.focus();
      } else if (e.target === guestTypeRef.current) {
        bookingDateRef.current.focus();
      } else if (e.target === bookingDateRef.current) {
        selectGuestRef.current.focus();
      } else if (e.target === selectGuestRef.current) {
        othersChargeRef.current.focus();
      } else if (e.target === othersChargeRef.current) {
        discountAmountRef.current.focus();
      } else if (e.target === discountAmountRef.current) {
        paidAmountRef.current.focus();
      }

      //for model
      if (e.target === paidAmountRef.current) {
        assignMaterialModalSet(true);
      } else if (e.target === modalItemRef.current) {
        paymentAmountRef.current.focus();
      } else if (e.target === paymentAmountRef.current) {
        handlePayment();
      }

      if (e.target === paymentAmountRef.current) {
        noteRef.current.focus();
      } else if (e.target === noteRef.current) {
        postGuest();
      }

      if (e.target === nameRef.current) {
        mobileNoRef.current.focus();
      } else if (e.target === mobileNoRef.current) {
        addressRef.current.focus();
      } else if (e.target === addressRef.current) {
        idTypeRef.current.focus();
      } else if (e.target === idTypeRef.current) {
        idNumRef.current.focus();
      } else if (e.target === idNumRef.current) {
        genderRef.current.focus();
      } else if (e.target === genderRef.current) {
        ageRef.current.focus();
      } else if (e.target === ageRef.current) {
        emailRef.current.focus();
      } else if (e.target === emailRef.current) {
        othersChargeRef.current.focus();
      }
    }
  };

  const options = [{ label: "Male" }, { label: "Female" }, { label: "Others" }];
  const idTypes = [{ label: "NID" }, { label: "PASSPORT" }];

  return (
    <div>
      <Paper className="m-3 p-3">
        <Typography
          variant="h6"
          className="MuiTypography-h6 mb-3"
          style={{ marginBottom: "8px" }}
        >
          BOOKING CHECK IN
        </Typography>
        <Grid container style={{ marginBottom: "8px" }}>
          <Grid
            spacing={2}
            container
            style={{ paddingBottom: "5px", paddingTop: "5px" }}
          >
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="CHECK IN DATE"
                  slotProps={{ field: { size: "small" } }}
                  sx={{
                    width: "100%",
                  }}
                  value={checkInDate}
                  onChange={(date) => checkInDateSet(date)}
                  format={dateFormat}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={3} style={{ width: "100%" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="CHECK OUT DATE"
                  slotProps={{ field: { size: "small" } }}
                  sx={{
                    width: "100%",
                  }}
                  value={checkOutDate}
                  style={{ width: "100%" }}
                  onChange={(date) => checkOutDateSet(date)}
                  format={dateFormat}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={2}>
              <Button
                onClick={() => getAllRoomWithStatus()}
                loading={loading}
                style={{ background: "black", color: "white" }}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <span
          style={{
            color: "#a70202",
            fontSize: "12px",
            fontStyle: "italic",
            fontWeight: "bold",
          }}
        >
          Note : Click on ROOM to BOOK
        </span>

        <Grid container className="building-section">
          <Grid item xs={12} md={8} style={{ padding: "5px" }}>
            <Grid container>
              {allRoomsData.length != 0
                ? allRoomsData.map((floor, inx) => (
                    <Grid
                      item
                      xs={12}
                      className="floor box"
                      // key={apartment.floor_no} onDoubleClick={()=>floorUpdateDelete(apartment)}
                    >
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
                                    Available{" "}
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
                                      xs={5}
                                      md={2}
                                      className={`seat ${classNames}`}
                                      //   key={seat.seat_no}
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
                : ""}
            </Grid>
          </Grid>

          <Grid item xs={12} md={4} style={{ padding: "20px" }}>
            <div className="mb-5">
              <h5 className="mt-4"> BILLING </h5>
              <div
                className="border-b-2 w-full"
                style={{ height: "2px", borderBottom: "2px solid #bbbbbb" }}
              ></div>
            </div>

            <Grid container rowSpacing={2} columnSpacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  sx={{
                    fontSize: "19px",
                    fontWeight: "bold",
                    textAlign: "center",
                    background: "#bdbdbd",
                    "& input": {
                      color: "#ff0000",
                      fontWeight: "bold",
                      textAlign: "center", // Change '#ff0000' to your desired text color
                    },
                    "& .MuiInputLabel-root": {
                      color: "#8c1717 !important",
                      fontWeight: "bold",
                      background: "#ffffff",
                      padding: "2px",
                      borderRadius: "10px",
                      fontSize: "15px",
                    },
                  }}
                  label="BOOKING ROOM QTY"
                  name="bookingRoomQty"
                  autoComplete="off"
                  size="small"
                  onKeyDown={handleKeyPress}
                  fullWidth
                  type="number"
                  disabled
                  value={bookingRoomQty}
                  onChange={(e) =>
                    bookingRoomQtySet(parseFloat(e.target.value))
                  }
                  InputProps={{
                    style: { color: "#ff0000" }, // Change '#ff0000' to your desired text color
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  sx={{
                    fontSize: "19px",
                    fontWeight: "bold",
                    textAlign: "center",
                    background: "#bdbdbd",
                    "& input": {
                      color: "#ff0000",
                      fontWeight: "bold",
                      textAlign: "center", // Change '#ff0000' to your desired text color
                    },
                    "& .MuiInputLabel-root": {
                      color: "#8c1717",
                      fontWeight: "bold",
                      background: "#ffffff",
                      padding: "2px",
                      borderRadius: "10px",
                      fontSize: "15px",
                    },
                  }}
                  label="TOTAL STAY DAY"
                  name="totalStayDay"
                  autoComplete="off"
                  size="small"
                  onKeyDown={handleKeyPress}
                  fullWidth
                  disabled
                  type="number"
                  value={totalStayDay}
                  onChange={(e) => totalStayDaySet(parseFloat(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  sx={{
                    fontSize: "19px",
                    fontWeight: "bold",
                    textAlign: "center",
                    background: "#bdbdbd",
                    "& input": {
                      color: "#ff0000",
                      fontWeight: "bold",
                      textAlign: "center", // Change '#ff0000' to your desired text color
                    },
                    "& .MuiInputLabel-root": {
                      color: "#8c1717",
                      fontWeight: "bold",
                      background: "#ffffff",
                      padding: "2px",
                      borderRadius: "10px",
                      fontSize: "15px",
                    },
                  }}
                  label="ROOM BOOKING AMOUNT"
                  autoComplete="off"
                  size="small"
                  fullWidth
                  disabled
                  type="number"
                  value={subTotal}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="OTHERS CHARGE"
                  name="othersCharge"
                  autoComplete="off"
                  size="small"
                  inputRef={othersChargeRef}
                  onKeyDown={handleKeyPress}
                  fullWidth
                  type="number"
                  value={othersCharge}
                  onFocus={() => othersChargeRef.current.select()}
                  onChange={(e) => othersChargeSet(parseFloat(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="DISCOUNT AMOUNT"
                  name="discountAmount"
                  autoComplete="off"
                  size="small"
                  inputRef={discountAmountRef}
                  onKeyDown={handleKeyPress}
                  fullWidth
                  type="number"
                  value={discountAmount}
                  onFocus={() => discountAmountRef.current.select()}
                  onChange={(e) =>
                    discountAmountSet(parseFloat(e.target.value))
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="TOTAL AMOUNT"
                  name="totalAmount"
                  autoComplete="off"
                  size="small"
                  onKeyDown={handleKeyPress}
                  fullWidth
                  type="number"
                  disabled
                  value={totalAmount}
                  onChange={(e) => totalAmountSet(parseFloat(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="PAID AMOUNT"
                  name="paidAmount"
                  autoComplete="off"
                  size="small"
                  inputRef={paidAmountRef}
                  onKeyDown={handleKeyPress}
                  fullWidth
                  type="number"
                  value={paidAmount}
                  onFocus={() => paidAmountRef.current.select()}
                  onChange={(e) => paidAmountSet(parseFloat(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="DUE AMOUNT"
                  name="dueAmount"
                  autoComplete="off"
                  size="small"
                  onKeyDown={handleKeyPress}
                  fullWidth
                  disabled
                  type="number"
                  value={dueAmount}
                  onChange={(e) => dueAmountSet(parseFloat(e.target.value))}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack>
                  <Button
                    variant="outlined"
                    onClick={() => assignMaterialModalSet(true)}
                    style={{ color: "black" }}
                  >
                    Payment Method
                  </Button>
                </Stack>
              </Grid>

              <Grid
                container
                columnSpacing={2}
                style={{ marginTop: "10px", marginLeft: "1px" }}
              >
                <Grid item xs={6} sm={6}>
                  <Button
                    variant="outlined"
                    onClick={() => postGuest()}
                    style={{ color: "black", background: "#67d589" }}
                    fullWidth
                    loading={isSaving}
                  >
                    BOOK NOW
                  </Button>
                </Grid>
                <Grid item xs={6} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => resetForm()}
                    style={{ color: "black" }}
                  >
                    CANCLE
                  </Button>
                </Grid>
              </Grid>

              <h6 className="mt-4 ml-4 "> GUEST INFORMATION </h6>
              <span
                className="border-b-2 w-full ml-4"
                style={{ height: "2px", borderBottom: "2px solid #bbbbbb" }}
              ></span>

              <Grid item xs={12} md={12}>
                <TextField
                  label="BOOKING NO"
                  name="bookingNo"
                  autoComplete="off"
                  size="small"
                  inputRef={bookingNoRef}
                  onKeyDown={handleKeyPress}
                  fullWidth
                  value={bookingNo}
                  onChange={(e) => bookingNoSet(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Autocomplete
                  autoHighlight={true}
                  openOnFocus={true}
                  size="small"
                  id="combo-box-guest"
                  options={guestTypes}
                  value={selectedGuestType}
                  onKeyDown={handleKeyPress}
                  onChange={(e, obj) => selectedGuestTypeSet(obj)}
                  getOptionLabel={(option) => option.guestType}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      inputRef={guestTypeRef}
                      label="SELECT GUEST TYPE"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    inputRef={createdDateRef}
                    label=" BOOKING DATE"
                    slotProps={{ field: { size: "small" } }}
                    sx={{ width: "100%" }}
                    onKeyDown={handleKeyPress}
                    value={createdDate}
                    onChange={(date) => createdDateSet(date)}
                    format={dateFormat}
                    renderInput={(params) => (
                      <TextField inputRef={bookingDateRef} {...params} />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              {selectedGuestType?.guestType === "Exist Guest" && (
                <Grid item xs={12} md={12}>
                  <Autocomplete
                    autoHighlight={true}
                    openOnFocus={true}
                    disablePortal
                    size="small"
                    id="combo-box-guest"
                    options={guests}
                    loading={selectorSearchLoading}
                    noOptionsText="Please Search Guest"
                    value={selectedGuest}
                    onKeyDown={handleKeyPress}
                    onChange={(e, obj) => {
                      handleGuestSelect(obj);
                    }}
                    onInputChange={(e, value) => {
                      SearchTermSet(value);
                    }}
                    getOptionLabel={(option) => option.displayText}
                    fullWidth
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        inputRef={selectGuestRef}
                        label="SELECT GUEST"
                      />
                    )}
                  />
                </Grid>
              )}

              <Grid item xs={12} md={12}>
                <TextField
                  label="NAME"
                  name="name"
                  autoComplete="off"
                  size="small"
                  inputRef={nameRef}
                  onKeyDown={handleKeyPress}
                  fullWidth
                  disabled={selectedGuestType?.guestType === "Exist Guest"}
                  value={name}
                  onChange={(e) => nameSet(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  label="MOBILE NO"
                  name="mobileNo"
                  autoComplete="off"
                  size="small"
                  inputRef={mobileNoRef}
                  disabled={selectedGuestType?.guestType === "Exist Guest"}
                  onKeyDown={handleKeyPress}
                  fullWidth
                  value={mobileNo}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      if (value.length >= 11) {
                        mobileNoSet(value);
                      } else {
                        mobileNoSet(value);
                      }
                    }
                  }}
                  helperText={
                    mobileNo.length > 0 && mobileNo.length < 11
                      ? "Mobile number must be at least 11 digits."
                      : ""
                  }
                  error={mobileNo.length > 0 && mobileNo.length < 11}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  label="ADDRESS"
                  name="address"
                  autoComplete="off"
                  size="small"
                  inputRef={addressRef}
                  disabled={selectedGuestType?.guestType === "Exist Guest"}
                  onKeyDown={handleKeyPress}
                  fullWidth
                  value={address}
                  onChange={(e) => addressSet(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  autoHighlight
                  openOnFocus
                  disabled={selectedGuestType?.guestType === "Exist Guest"}
                  size="small"
                  id="idType-autocomplete"
                  options={idTypes}
                  value={selectedIdType}
                  onKeyDown={handleKeyPress}
                  onChange={(e, obj) => selectedIdTypeSet(obj)}
                  getOptionLabel={(option) => option.label}
                  disableClearable
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="ID TYPE"
                      inputRef={idTypeRef}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="ID NUMBER"
                  name="idNumber"
                  autoComplete="off"
                  size="small"
                  inputRef={idNumRef}
                  disabled={selectedGuestType?.guestType === "Exist Guest"}
                  onKeyDown={handleKeyPress}
                  fullWidth
                  value={idNumber}
                  onChange={(e) => idNumberSet(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  autoHighlight
                  openOnFocus
                  disablePortal
                  size="small"
                  id="gender-autocomplete"
                  options={options}
                  value={gender}
                  onKeyDown={handleKeyPress}
                  onChange={(e, obj) => genderSet(obj)}
                  getOptionLabel={(option) => option.label}
                  disableClearable
                  disabled={selectedGuestType?.guestType === "Exist Guest"}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Gender"
                      inputRef={genderRef}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="AGE"
                  name="age"
                  autoComplete="off"
                  size="small"
                  inputRef={ageRef}
                  disabled={selectedGuestType?.guestType === "Exist Guest"}
                  onKeyDown={handleKeyPress}
                  fullWidth
                  type="number"
                  value={age}
                  onChange={(e) => ageSet(parseFloat(e.target.value))}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="EMAIL"
                  name="email"
                  disabled={selectedGuestType?.guestType === "Exist Guest"}
                  autoComplete="off"
                  size="small"
                  inputRef={emailRef}
                  onKeyDown={handleKeyPress}
                  fullWidth
                  value={email}
                  onChange={(e) => emailSet(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="NOTE"
                  name="note"
                  autoComplete="off"
                  size="small"
                  inputRef={noteRef}
                  disabled={selectedGuestType?.guestType === "Exist Guest"}
                  onKeyDown={handleKeyPress}
                  fullWidth
                  value={note}
                  onChange={(e) => noteSet(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* payment method modals */}

      <Modal
        open={assignMaterialModal}
        onClose={() => assignMaterialModalSet(false)}
        center
        style={{
          minWidth: "600px",
          minHeight: "500px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <h5
          style={{
            margin: 0,
            padding: 0,
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Payment Method
        </h5>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={10}>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              size="small"
              id="combo-box-item"
              options={accounts}
              onKeyDown={handleKeyPress}
              value={selectedAccount}
              onChange={(e, obj) => selectedAccountSet(obj)}
              getOptionLabel={(option) => option.name}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputRef={modalItemRef}
                  label="SELECT ACCOUNT"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={10}>
            <TextField
              label="PAYMENT AMOUNT"
              name="paymentAmount"
              autoComplete="off"
              size="small"
              fullWidth
              type="number"
              inputRef={paymentAmountRef}
              onKeyDown={handleKeyPress}
              value={paymentAmountValue}
              onFocus={() => paymentAmountRef.current.select()}
              onChange={(e) => paymentAmountValueSet(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={10}>
            <Button
              onClick={() => handlePayment()}
              style={{
                background: "black",
                color: "#ffffff",
                width: "100%",
              }}
              variant="contained"
            >
              {paymentIndex != null ? "Edit" : "Add Pay"}
            </Button>
          </Grid>
        </Grid>

        <br />

        <TableContainer style={{ marginTop: "20px", width: "100%" }}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="left">SL</TableCell>
                <TableCell align="left">ACCOUNT NAME</TableCell>
                <TableCell align="right">AMOUNT</TableCell>
                <TableCell align="left">Edit</TableCell>
                <TableCell align="left">DELETE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Replace this with dynamic rows based on your data */}
              {purchaseInvoiceTransactions?.map((transactionItem, inx) => (
                <TableRow>
                  <TableCell align="left">{inx + parseFloat(1)}</TableCell>
                  <TableCell align="left">{transactionItem.name}</TableCell>
                  <TableCell align="right">
                    {amountFormat(
                      parseFloat(transactionItem.amount).toFixed(2)
                    )}
                  </TableCell>
                  <TableCell align="left">
                    <EditNoteIcon
                      style={{
                        color: "green",
                        cursor: "pointer",
                        display: isSaving ? "none" : "block",
                      }}
                      onClick={() => handlePaymentEdit(transactionItem, inx)}
                    />
                  </TableCell>
                  <TableCell align="left">
                    <DeleteForeverIcon
                      style={{
                        color: "red",
                        cursor: "pointer",
                        display: isSaving ? "none" : "block",
                      }}
                      onClick={() => handlePaymentDelete(inx)}
                    />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={1} align="left"></TableCell>
                <TableCell align="left">TOTAL</TableCell>
                <TableCell align="right">
                  {amountFormat(parseFloat(paymentTotalAmount).toFixed(2))}
                </TableCell>
                <TableCell colSpan={2} align="left"></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Modal>
    </div>
  );
};

export default GroupManage;
