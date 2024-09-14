import {
  Checkbox,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  Paper,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { authHeaders, pathSplitter } from "../../../utils";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL, APP_URL } from "../../../config.json";
import Swal from "sweetalert2";

const UserAccess = () => {
  const navigate = useNavigate();
  const [access, accessSet] = useState([]);
  const [userFullName, userFullNameSet] = useState("Loading...");

  // States for checkboxes
  //Hotel Management:
  const [hotelManagement, hotelManagementSet] = useState(false);
  const [floorManage, floorManageSet] = useState(false);
  const [amenityManage, amenityManageSet] = useState(false);
  const [facilityManage, facilityManageSet] = useState(false);
  const [roomType, roomTypeSet] = useState(false);
  const [room, roomSet] = useState(false);

  //Booking:
  const [booking, bookingSet] = useState(false);
  const [quickCheckIn, quickCheckInSet] = useState(false);
  const [bookingRecord, bookingRecordSet] = useState(false);
  const [guestEntry, guestEntrySet] = useState(false);

  //bar:
  const [bar, barSet] = useState(false);
  const [barItemPurchase, barItemPurchaseSet] = useState(false);
  const [barItemPurchaseReturn, barItemPurchaseReturnSet] = useState(false);
  const [barItemPurchaseRecord, barItemPurchaseRecordSet] = useState(false);
  const [barItemPurchaseReturnRecord, barItemPurchaseReturnRecordSet] =
    useState(false);

  const [barItemSale, barItemSaleSet] = useState(false);
  const [barItemSaleReturn, barItemSaleReturnSet] = useState(false);
  const [barItemSaleRecord, barItemSaleRecordSet] = useState(false);
  const [barItemSaleReturnRecord, barItemSaleReturnRecordSet] = useState(false);

  const [barItem, barItemSet] = useState(false);
  const [barItemUnit, barItemUnitSet] = useState(false);
  const [barItemCategory, barItemCategorySet] = useState(false);

  //restaurant
  const [restaurant, restaurantSet] = useState(false);
  const [itemPurchase, itemPurchaseSet] = useState(false);
  const [purchaseReturn, purchaseReturnSet] = useState(false);
  const [purchaseRecord, purchaseRecordSet] = useState(false);
  const [purchaseReturnRecord, purchaseReturnRecordSet] = useState(false);
  const [suppplier, suppplierSet] = useState(false);

  const [saleEntry, saleEntrySet] = useState(false);
  const [saleReturn, saleReturnSet] = useState(false);
  const [saleRecord, saleRecordSet] = useState(false);
  const [saleReturnRecord, saleReturnRecordSet] = useState(false);
  const [customerEntry, customerEntrySet] = useState(false);

  const [production, productionSet] = useState(false);
  const [productionReport, productionReportSet] = useState(false);

  const [item, itemSet] = useState(false);
  const [itemCategory, itemCategorySet] = useState(false);
  const [itemUnit, itemUnitSet] = useState(false);

  //House Keeping:
  const [houseKeeping, houseKeepingSet] = useState(false);
  const [houseKeepingItemPurchase, houseKeepingItemPurchaseSet] =
    useState(false);
  const [houseKeepingPurchaseReturn, houseKeepingPurchaseReturnSet] =
    useState(false);
  const [houseKeepingUsed, houseKeepingUsedSet] = useState(false);
  const [houseKeepingPurchaseRecord, houseKeepingPurchaseRecordSet] =
    useState(false);
  const [
    houseKeepingPurchaseReturnRecord,
    houseKeepingPurchaseReturnRecordSet,
  ] = useState(false);
  const [houseKeepingUsedRecord, houseKeepingUsedRecordSet] = useState(false);
  const [houseKeepingUnit, houseKeepingUnitSet] = useState(false);
  const [houseKeepingCategory, houseKeepingCategorySet] = useState(false);
  const [houseKeepingItem, houseKeepingItemSet] = useState(false);

  //Premium Service:
  const [premiumService, premiumServiceSet] = useState(false);
  const [premiumServiceEntry, premiumServiceEntrySet] = useState(false);
  const [premiumServiceExpense, premiumServiceExpenseSet] = useState(false);
  const [premiumServiceRecord, premiumServiceRecordSet] = useState(false);
  const [premiumServiceExpenseRecord, premiumServiceExpenseRecordSet] =
    useState(false);
  const [serviceNameEntry, serviceNameEntrySet] = useState(false);
  const [serviceExpenseNameEntry, serviceExpenseNameEntrySet] = useState(false);

  //Accounts
  const [accounts, accountsSet] = useState(false);
  const [guestPaymentReceipt, guestPaymentReceiptSet] = useState(false);
  const [customerTransaction, customerTransactionSet] = useState(false);
  const [supplierTransaction, supplierTransactionSet] = useState(false);
  const [expenseEntry, expenseEntrySet] = useState(false);
  const [contra, contraSet] = useState(false);
  const [expenseHeadEntry, expenseHeadEntrySet] = useState(false);
  const [accountEntry, accountEntrySet] = useState(false);

  //payroll:
  const [payroll, payrollSet] = useState(false);
  const [employeePayment, employeePaymentSet] = useState(false);
  const [employee, employeeSet] = useState(false);
  const [department, departmentSet] = useState(false);
  const [salaryPayableReport, salaryPayableReportSet] = useState(false);

  //inventory:
  const [inventory, inventorySet] = useState(false);
  const [itemStockReport, itemStockReportSet] = useState(false);
  const [barItemStockReport, barItemStockReportSet] = useState(false);
  const [houseKeepingItemStockReport, houseKeepingItemStockReportSet] =
    useState(false);

  //reports:
  const [reports, reportsSet] = useState(false);
  const [balanceSheet, balanceSheetSet] = useState(false);
  const [profitLost, profitLostSet] = useState(false);
  const [customerLedger, customerLedgerSet] = useState(false);
  const [dailyLedger, dailyLedgerSet] = useState(false)
  const [cashBankLedger, cashBankLedgerSet] = useState(false)
  const [cashBankBalance, cashBankBalanceSet] = useState(false)
  const [supplierLedger, supplierLedgerSet] = useState(false);
  const [guestLedger, guestLedgerSet] = useState(false);
  const [customerBalance, customerBalanceSet] = useState(false);
  const [supplierBalance, supplierBalanceSet] = useState(false);
  const [guestBalance, guestBalanceSet] = useState(false);
  const [loanBalance, loanBalanceSet] = useState(false);
  const [capitalBalance, capitalBalanceSet] = useState(false);
  const [fixedAssetBalance, fixedAssetBalanceSet] = useState(false);
  const [expenseBalance, expenseBalanceSet] = useState(false);
  const [payrollBalance, payrollBalanceSet] = useState(false);
  const [serviceExpenseBalance, serviceExpenseBalanceSet] = useState(false);
  const [houseKeepingUsedBalance, houseKeepingUsedBalanceSet] = useState(false);
  const [expenseRecord, expenseRecordSet] = useState(false);

  //settings:
  const [setting, settingSet] = useState(false);
  const [branchManage, branchManageSet] = useState(false);
  const [companyProfile, companyProfileSet] = useState(false);
  const [userManage, userManageSet] = useState(false);

  // user id :
  const [id, idSet] = useState();
  const location = useLocation();

  useEffect(() => {
    idSet(
      pathSplitter(location.pathname, 2) != undefined
        ? parseFloat(pathSplitter(location.pathname, 2))
        : 0
    );

    // Example data fetching and setting state
    // Replace this with your actual data fetching logic
    getAccess();
  }, []);

  const getAccess = async () => {
    const response = await axios.get(`${API_URL}api/Auth/get-user-access`, {
      headers: authHeaders,
      params: {
        userId: pathSplitter(location.pathname, 2),
      },
    });

    const accessArr = JSON.parse(
      response.data.permissions != null ? response.data.permissions : "[]"
    );

    userFullNameSet(response.data?.userName);
    accessSet(accessArr);
    checkAccess(accessArr);
  };

  const SaveAccess = async () => {
    const accessString = JSON.stringify(access);
    try {
      const response = await axios.put(
        `${API_URL}api/Auth/user-access-update/${pathSplitter(
          location.pathname,
          2
        )}`,
        { permissions: accessString },
        {
          headers: { authHeaders },
        }
      );

      Swal.fire({
        icon: "success",
        title: `Access Saved success`,
      });
      navigate("/user-manage");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const checkAccess = (acc) => {
    // Set individual states based on access array

    hotelManagementSet(acc.includes("Hotel Management"));
    floorManageSet(acc.includes("Floor Manage"));
    amenityManageSet(acc.includes("Amenity Manage"));
    facilityManageSet(acc.includes("Facility Manage"));
    roomTypeSet(acc.includes("Room Type"));
    roomSet(acc.includes("Room"));
    dailyLedgerSet(acc.includes("Daily Ledger"));
    cashBankLedgerSet(acc.includes("Cash Bank Ledger"));
    cashBankBalanceSet(acc.includes("Cash Bank Balance"));
    salaryPayableReportSet(acc.includes("Salary Payable Report"));

    bookingSet(acc.includes("Booking"));
    quickCheckInSet(acc.includes("Quick CheckIn"));
    bookingRecordSet(acc.includes("Booking Record"));
    guestEntrySet(acc.includes("Guest Entry"));

    barSet(acc.includes("Bar"));
    barItemPurchaseSet(acc.includes("Bar Item Purchase"));
    barItemPurchaseReturnSet(acc.includes("Bar Item Purchase Return"));
    barItemPurchaseRecordSet(acc.includes("Bar Item Purchase Record"));
    barItemPurchaseReturnRecordSet(
      acc.includes("Bar Item Purchase Return Record")
    );
    barItemSaleSet(acc.includes("Bar Item Sale"));
    barItemSaleReturnSet(acc.includes("Bar Item Sale Return"));
    barItemSaleRecordSet(acc.includes("Bar Item Sale Record"));
    barItemSaleReturnRecordSet(acc.includes("Bar Item Sale Return Record"));
    barItemSet(acc.includes("Bar Item"));
    barItemUnitSet(acc.includes("Bar Item Unit"));
    barItemCategorySet(acc.includes("Bar Item Category"));

    restaurantSet(acc.includes("Restaurant"));
    itemPurchaseSet(acc.includes("Item Purchase"));
    purchaseReturnSet(acc.includes("Purchase Return"));
    purchaseRecordSet(acc.includes("Purchase Record"));
    purchaseReturnRecordSet(acc.includes("Purchase Return Record"));
    suppplierSet(acc.includes("Supplier"));
    saleEntrySet(acc.includes("Sale Entry"));
    saleReturnSet(acc.includes("Sale Return"));
    saleRecordSet(acc.includes("Sale Record"));
    saleReturnRecordSet(acc.includes("Sale Return Record"));
    customerEntrySet(acc.includes("Customer Entry"));
    productionSet(acc.includes("Production"));
    productionReportSet(acc.includes("Production Report"));
    itemSet(acc.includes("Item"));
    itemCategorySet(acc.includes("Item Category"));
    itemUnitSet(acc.includes("Item Unit"));

    houseKeepingSet(acc.includes("House Keeping"));
    houseKeepingItemPurchaseSet(acc.includes("HK Item Purchase"));
    houseKeepingPurchaseReturnSet(acc.includes("HK Purchase Return"));
    houseKeepingUsedSet(acc.includes("House Keeping Used"));
    houseKeepingPurchaseRecordSet(acc.includes("HK Purchase Record"));
    houseKeepingPurchaseReturnRecordSet(acc.includes("HK Purchase Return Record"));
    houseKeepingUsedRecordSet(acc.includes("House Keeping Used Record"));
    houseKeepingUnitSet(acc.includes("House Keeping Unit"));
    houseKeepingCategorySet(acc.includes("House Keeping Category"));
    houseKeepingItemSet(acc.includes("House Keeping Item"));

    premiumServiceSet(acc.includes("Premium Service"));
    premiumServiceEntrySet(acc.includes("Service Entry"));
    premiumServiceExpenseSet(acc.includes("Service Expense"));
    premiumServiceRecordSet(acc.includes("Service Record"));
    premiumServiceExpenseRecordSet(acc.includes("Service Expense Record"));
    serviceNameEntrySet(acc.includes("Service Name Entry"));
    serviceExpenseNameEntrySet(acc.includes("Expense Name Entry"));

    accountsSet(acc.includes("Accounts"));
    guestPaymentReceiptSet(acc.includes("Guest Payment Receipt"));
    customerTransactionSet(acc.includes("Customer Transaction"));
    supplierTransactionSet(acc.includes("Supplier Transaction"));
    expenseEntrySet(acc.includes("Expense Entry"));
    contraSet(acc.includes("Contra"));
    expenseHeadEntrySet(acc.includes("Expense Head Entry"));
    accountEntrySet(acc.includes("Account Entry"));

    payrollSet(acc.includes("Payroll"));
    employeePaymentSet(acc.includes("Employee Payment"));
    employeeSet(acc.includes("Employee"));
    departmentSet(acc.includes("Department"));

    inventorySet(acc.includes("Inventory"));
    itemStockReportSet(acc.includes("Item Stock Report"));
    barItemStockReportSet(acc.includes("Bar Item Stock Report"));
    houseKeepingItemStockReportSet(
      acc.includes("House Keeping Stock")
    );

    reportsSet(acc.includes("Reports"));
    balanceSheetSet(acc.includes("Balance Sheet"));
    profitLostSet(acc.includes("Profit Loss"));
    customerLedgerSet(acc.includes("Customer Ledger"));
    supplierLedgerSet(acc.includes("Supplier Ledger"));
    guestLedgerSet(acc.includes("Guest Ledger"));
    customerBalanceSet(acc.includes("Customer Balance"));
    supplierBalanceSet(acc.includes("Supplier Balance"));
    guestBalanceSet(acc.includes("Guest Balance"));
    loanBalanceSet(acc.includes("Loan Balance"));
    capitalBalanceSet(acc.includes("Capital Balance"));
    fixedAssetBalanceSet(acc.includes("Fixed Asset Balance"));
    expenseBalanceSet(acc.includes("Expense Balance"));
    payrollBalanceSet(acc.includes("Payroll Balance"));
    serviceExpenseBalanceSet(acc.includes("Service Expense Balance"));
    houseKeepingUsedBalanceSet(acc.includes("House keeping Used Balance"));
    expenseRecordSet(acc.includes("Expense Record"));
    settingSet(acc.includes("Settings"))
    branchManageSet(acc.includes("Branch Manage"))
    companyProfileSet(acc.includes("Company Profile"))
    userManageSet(acc.includes("User Manage"))
  };

  const handleCheckboxChange = (e, setter) => {
    setter(e.target.checked);
    checkExistAccess(e.target);
  };

  const handleMasterChange = (e) => {
    const isChecked = e.target.checked;
    const masterName = e.target.name;

    // Define related checkboxes based on the master checkbox
    const checkboxGroups = {
      "Hotel Management": [
        "Hotel Management",
        "Floor Manage",
        "Amenity Manage",
        "Facility Manage",
        "Room Type",
        "Room",
      ],
      Booking: ["Booking", "Quick CheckIn", "Booking Record", "Guest Entry"],
      Bar: [
        "Bar",
        "Bar Item Purchase",
        "Bar Item Purchase Return",
        "Bar Item Purchase Record",
        "Bar Item Purchase Return Record",
        "Bar Item Sale",
        "Bar Item Sale Return",
        "Bar Item Sale Record",
        "Bar Item Sale Return Record",
        "Bar Item",
        "Bar Item Unit",
        "Bar Item Category",
      ],
      Restaurant: [
        "Restaurant",
        "Item Purchase",
        "Purchase Return",
        "Purchase Record",
        "Purchase Return Record",
        "Supplier",
        "Sale Entry",
        "Sale Return",
        "Sale Record",
        "Sale Return Record",
        "Customer Entry",
        "Production",
        "Production Report",
        "Item",
        "Item Category",
        "Item Unit",
      ],
      "House Keeping": [
        "House Keeping",
        "HK Item Purchase",
        "HK Purchase Return",
        "House Keeping Used",
        "HK Purchase Record",
        "HK Purchase Return Record",
        "House Keeping Used Record",
        "House Keeping Unit",
        "House Keeping Category",
        "House Keeping Item",
      ],
      "Premium Service": [
        "Premium Service",
        "Service Entry",
        "Service Expense",
        "Service Record",
        "Service Expense Record",
        "Service Name Entry",
        "Expense Name Entry",
      ],
      Accounts: [
        "Accounts",
        "Guest Payment Receipt",
        "Customer Transaction",
        "Supplier Transaction",
        "Expense Entry",
        "Contra",
        "Expense Head Entry",
        "Account Entry",
      ],
      Payroll: ["Payroll", "Employee Payment", "Employee", "Department", "Salary Payable Report"],
      Inventory: [
        "Inventory",
        "Item Stock Report",
        "Bar Item Stock Report",
        "House Keeping Stock",
      ],
      Reports: [
        "Reports",
        "Balance Sheet",
        "Profit Loss",
        "Customer Ledger",
        "Supplier Ledger",
        "Guest Ledger",
        "Daily Ledger",
        "Cash Bank Ledger",
        "Customer Balance",
        "Supplier Balance",
        "Cash Bank Balance",
        "Guest Balance",
        "Loan Balance",
        "Capital Balance",
        "Fixed Asset Balance",
        "Expense Balance",
        "Payroll Balance",
        "Service Expense Balance",
        "House keeping Used Balance",
        "Expense Record",
      ],
      Settings: ["Settings", "Branch Manage", "Company Profile", "User Manage"],
    };

    const relatedCheckboxes = checkboxGroups[masterName] || [];

    // Update states based on master checkbox
    if (masterName === "Hotel Management") {
      hotelManagementSet(isChecked);
      floorManageSet(isChecked);
      amenityManageSet(isChecked);
      facilityManageSet(isChecked);
      roomTypeSet(isChecked);
      roomSet(isChecked);
    } else if (masterName === "Booking") {
      bookingSet(isChecked);
      quickCheckInSet(isChecked);
      bookingRecordSet(isChecked);
      guestEntrySet(isChecked);
    } else if (masterName === "Bar") {
      barSet(isChecked);
      barItemPurchaseSet(isChecked);
      barItemPurchaseReturnSet(isChecked);
      barItemPurchaseRecordSet(isChecked);
      barItemPurchaseReturnRecordSet(isChecked);

      barItemSaleSet(isChecked);
      barItemSaleReturnSet(isChecked);
      barItemSaleRecordSet(isChecked);
      barItemSaleReturnRecordSet(isChecked);

      barItemSet(isChecked);
      barItemUnitSet(isChecked);
      barItemCategorySet(isChecked);
    } else if (masterName === "Restaurant") {
      restaurantSet(isChecked);
      itemPurchaseSet(isChecked);
      purchaseReturnSet(isChecked);
      purchaseRecordSet(isChecked);
      purchaseReturnRecordSet(isChecked);
      suppplierSet(isChecked);

      customerEntrySet(isChecked);
      saleReturnRecordSet(isChecked);
      saleRecordSet(isChecked);
      saleReturnSet(isChecked);
      saleEntrySet(isChecked);

      productionSet(isChecked);
      productionReportSet(isChecked);

      itemSet(isChecked);
      itemCategorySet(isChecked);
      itemUnitSet(isChecked);
    } else if (masterName === "House Keeping") {
      houseKeepingSet(isChecked);
      houseKeepingItemPurchaseSet(isChecked);
      houseKeepingPurchaseReturnSet(isChecked);
      houseKeepingUsedSet(isChecked);
      houseKeepingPurchaseRecordSet(isChecked);
      houseKeepingPurchaseReturnRecordSet(isChecked);
      houseKeepingUsedRecordSet(isChecked);
      houseKeepingUnitSet(isChecked);
      houseKeepingCategorySet(isChecked);
      houseKeepingItemSet(isChecked);
    } else if (masterName === "Premium Service") {
      premiumServiceSet(isChecked);
      premiumServiceEntrySet(isChecked);
      premiumServiceExpenseSet(isChecked);
      premiumServiceRecordSet(isChecked);
      premiumServiceExpenseRecordSet(isChecked);
      serviceNameEntrySet(isChecked);
      serviceExpenseNameEntrySet(isChecked);
    } else if (masterName === "Accounts") {
      accountsSet(isChecked);
      guestPaymentReceiptSet(isChecked);
      customerTransactionSet(isChecked);
      supplierTransactionSet(isChecked);
      expenseEntrySet(isChecked);
      contraSet(isChecked);
      expenseHeadEntrySet(isChecked);
      accountEntrySet(isChecked);
    } else if (masterName === "Payroll") {
      payrollSet(isChecked);
      employeePaymentSet(isChecked);
      employeeSet(isChecked);
      departmentSet(isChecked);
      salaryPayableReportSet(isChecked);
    } else if (masterName === "Inventory") {
      inventorySet(isChecked);
      itemStockReportSet(isChecked);
      barItemStockReportSet(isChecked);
      houseKeepingItemStockReportSet(isChecked);
    } else if (masterName === "Reports") {

      reportsSet(isChecked);
      balanceSheetSet(isChecked);
      profitLostSet(isChecked);
      customerLedgerSet(isChecked);
      supplierLedgerSet(isChecked);
      guestLedgerSet(isChecked);
      dailyLedgerSet(isChecked);
      cashBankLedgerSet(isChecked);
      cashBankBalanceSet(isChecked);
      customerBalanceSet(isChecked);
      supplierBalanceSet(isChecked);
      guestBalanceSet(isChecked);
      loanBalanceSet(isChecked);
      capitalBalanceSet(isChecked);
      fixedAssetBalanceSet(isChecked);
      expenseBalanceSet(isChecked);
      payrollBalanceSet(isChecked);
      serviceExpenseBalanceSet(isChecked);
      houseKeepingUsedBalanceSet(isChecked);
      expenseRecordSet(isChecked);
    } else if (masterName === "Settings") {
      settingSet(isChecked);
      branchManageSet(isChecked);
      companyProfileSet(isChecked);
      userManageSet(isChecked);
    }

    // Update access array based on the master checkbox
    if (isChecked) {
      accessSet((prevAccess) => [
        ...new Set([...prevAccess, ...relatedCheckboxes]),
      ]);
    } else {
      accessSet((prevAccess) =>
        prevAccess.filter((item) => !relatedCheckboxes.includes(item))
      );
    }
  };

  const checkExistAccess = (checkbox) => {
    const updatedAccess = [...access];
    const checkboxName = checkbox.name;

    if (checkbox.checked && !updatedAccess.includes(checkboxName)) {
      updatedAccess.push(checkboxName);
    } else if (!checkbox.checked && updatedAccess.includes(checkboxName)) {
      const index = updatedAccess.indexOf(checkboxName);
      if (index > -1) {
        updatedAccess.splice(index, 1);
      }
    }
    accessSet(updatedAccess);
  };

  return (
    <Paper style={{ marginTop: "20px", marginBottom: "20px", padding: "20px" }}>
      <h4 style={{ fontSize: "18px" }}>User Access for {userFullName}</h4>

      <Grid container spacing={3}>

    {/* Bar Module */}
    <Grid item xs={12} sm={3}>
          <FormControl component="fieldset">
            <FormControlLabel
              control={
                <Checkbox
                  checked={bar}
                  onChange={handleMasterChange}
                  name="Bar"
                />
              }
              label="Bar"
            />
            <FormGroup style={{ marginLeft: "20px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={barItemPurchase}
                    onChange={(e) =>
                      handleCheckboxChange(e, barItemPurchaseSet)
                    }
                    name="Bar Item Purchase"
                  />
                }
                label="Bar Item Purchase"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={barItemPurchaseReturn}
                    onChange={(e) =>
                      handleCheckboxChange(e, barItemPurchaseReturnSet)
                    }
                    name="Bar Item Purchase Return"
                  />
                }
                label="Bar Item Purchase Return"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={barItemPurchaseRecord}
                    onChange={(e) =>
                      handleCheckboxChange(e, barItemPurchaseRecordSet)
                    }
                    name="Bar Item Purchase Record"
                  />
                }
                label="Bar Item Purchase Record"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={barItemPurchaseReturnRecord}
                    onChange={(e) =>
                      handleCheckboxChange(e, barItemPurchaseReturnRecordSet)
                    }
                    name="Bar Item Purchase Return Record"
                  />
                }
                label="Bar Item Purchase Return Record"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={barItemSale}
                    onChange={(e) => handleCheckboxChange(e, barItemSaleSet)}
                    name="Bar Item Sale"
                  />
                }
                label="Bar Item Sale"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={barItemSaleReturn}
                    onChange={(e) =>
                      handleCheckboxChange(e, barItemSaleReturnSet)
                    }
                    name="Bar Item Sale Return"
                  />
                }
                label="Bar Item Sale Return"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={barItemSaleRecord}
                    onChange={(e) =>
                      handleCheckboxChange(e, barItemSaleRecordSet)
                    }
                    name="Bar Item Sale Record"
                  />
                }
                label="Bar Item Sale Record"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={barItemSaleReturnRecord}
                    onChange={(e) =>
                      handleCheckboxChange(e, barItemSaleReturnRecordSet)
                    }
                    name="Bar Item Sale Return Record"
                  />
                }
                label="Bar Item Sale Return Record"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={barItem}
                    onChange={(e) => handleCheckboxChange(e, barItemSet)}
                    name="Bar Item"
                  />
                }
                label="Bar Item"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={barItemUnit}
                    onChange={(e) => handleCheckboxChange(e, barItemUnitSet)}
                    name="Bar Item Unit"
                  />
                }
                label="Bar Item Unit"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={barItemCategory}
                    onChange={(e) =>
                      handleCheckboxChange(e, barItemCategorySet)
                    }
                    name="Bar Item Category"
                  />
                }
                label="Bar Item Category"
              />
            </FormGroup>
            <FormHelperText>Bar Module End</FormHelperText>
          </FormControl>
        </Grid>

        {/* Restaurant Module*/}
        <Grid item xs={12} sm={3}>
          <FormControl component="fieldset">
            <FormControlLabel
              control={
                <Checkbox
                  checked={restaurant}
                  onChange={handleMasterChange}
                  name="Restaurant"
                />
              }
              label="Restaurant"
            />
            <FormGroup style={{ marginLeft: "20px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={itemPurchase}
                    onChange={(e) => handleCheckboxChange(e, itemPurchaseSet)}
                    name="Item Purchase"
                  />
                }
                label="Item Purchase"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={purchaseReturn}
                    onChange={(e) => handleCheckboxChange(e, purchaseReturnSet)}
                    name="Purchase Return"
                  />
                }
                label="Purchase Return"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={purchaseRecord}
                    onChange={(e) => handleCheckboxChange(e, purchaseRecordSet)}
                    name="Purchase Record"
                  />
                }
                label="Purchase Record"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={purchaseReturnRecord}
                    onChange={(e) =>
                      handleCheckboxChange(e, purchaseReturnRecordSet)
                    }
                    name="Purchase Return Record"
                  />
                }
                label="Purchase Return Record"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={suppplier}
                    onChange={(e) => handleCheckboxChange(e, suppplierSet)}
                    name="Supplier"
                  />
                }
                label="Supplier"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={saleEntry}
                    onChange={(e) => handleCheckboxChange(e, saleEntrySet)}
                    name="Sale Entry"
                  />
                }
                label="Sale Entry"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={saleReturn}
                    onChange={(e) => handleCheckboxChange(e, saleReturnSet)}
                    name="Sale Return"
                  />
                }
                label="Sale Return"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={saleRecord}
                    onChange={(e) => handleCheckboxChange(e, saleRecordSet)}
                    name="Sale Record"
                  />
                }
                label="Sale Record"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={saleReturnRecord}
                    onChange={(e) =>
                      handleCheckboxChange(e, saleReturnRecordSet)
                    }
                    name="Sale Return Record"
                  />
                }
                label="Sale Return Record"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={customerEntry}
                    onChange={(e) => handleCheckboxChange(e, customerEntrySet)}
                    name="Customer Entry"
                  />
                }
                label="Customer Entry"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={production}
                    onChange={(e) => handleCheckboxChange(e, productionSet)}
                    name="Production"
                  />
                }
                label="Production"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={productionReport}
                    onChange={(e) =>
                      handleCheckboxChange(e, productionReportSet)
                    }
                    name="Production Report"
                  />
                }
                label="Production Report"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={item}
                    onChange={(e) => handleCheckboxChange(e, itemSet)}
                    name="Item"
                  />
                }
                label="Item"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={itemCategory}
                    onChange={(e) => handleCheckboxChange(e, itemCategorySet)}
                    name="Item Category"
                  />
                }
                label="Item Category"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={itemUnit}
                    onChange={(e) => handleCheckboxChange(e, itemUnitSet)}
                    name="Item Unit"
                  />
                }
                label="Item Unit"
              />
            </FormGroup>
            <FormHelperText>Restaurant Module End</FormHelperText>
          </FormControl>
        </Grid>

        {/* House Keeping Module*/}
        <Grid item xs={12} sm={3}>
          <FormControl component="fieldset">
            <FormControlLabel
              control={
                <Checkbox
                  checked={houseKeeping}
                  onChange={handleMasterChange}
                  name="House Keeping"
                />
              }
              label="House Keeping"
            />
            <FormGroup style={{ marginLeft: "20px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={houseKeepingItemPurchase}
                    onChange={(e) =>
                      handleCheckboxChange(e, houseKeepingItemPurchaseSet)
                    }
                    name="HK Item Purchase"
                  />
                }
                label="HK Item Purchase"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={houseKeepingPurchaseReturn}
                    onChange={(e) =>
                      handleCheckboxChange(e, houseKeepingPurchaseReturnSet)
                    }
                    name="HK Purchase Return"
                  />
                }
                label="HK Purchase Return"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={houseKeepingUsed}
                    onChange={(e) =>
                      handleCheckboxChange(e, houseKeepingUsedSet)
                    }
                    name="House Keeping Used"
                  />
                }
                label="House Keeping Used"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={houseKeepingPurchaseRecord}
                    onChange={(e) =>
                      handleCheckboxChange(e, houseKeepingPurchaseRecordSet)
                    }
                    name="HK Purchase Record"
                  />
                }
                label="HK Purchase Record"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={houseKeepingPurchaseReturnRecord}
                    onChange={(e) =>
                      handleCheckboxChange(
                        e,
                        houseKeepingPurchaseReturnRecordSet
                      )
                    }
                    name="HK Purchase Return Record"
                  />
                }
                label="HK Purchase Return Record"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={houseKeepingUsedRecord}
                    onChange={(e) =>
                      handleCheckboxChange(e, houseKeepingUsedRecordSet)
                    }
                    name="House Keeping Used Record"
                  />
                }
                label="House Keeping Used Record"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={houseKeepingUnit}
                    onChange={(e) =>
                      handleCheckboxChange(e, houseKeepingUnitSet)
                    }
                    name="House Keeping Unit"
                  />
                }
                label="House Keeping Unit"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={houseKeepingCategory}
                    onChange={(e) =>
                      handleCheckboxChange(e, houseKeepingCategorySet)
                    }
                    name="House Keeping Category"
                  />
                }
                label="House Keeping Category"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={houseKeepingItem}
                    onChange={(e) =>
                      handleCheckboxChange(e, houseKeepingItemSet)
                    }
                    name="House Keeping Item"
                  />
                }
                label="House Keeping Item"
              />
            </FormGroup>
            <FormHelperText>Booking Module End</FormHelperText>
          </FormControl>
        </Grid>


              {/* Reports Module*/}
              <Grid item xs={12} sm={3}>
          <FormControl component="fieldset">
            <FormControlLabel
              control={
                <Checkbox
                  checked={reports}
                  onChange={handleMasterChange}
                  name="Reports"
                />
              }
              label="Reports"
            />
            <FormGroup style={{ marginLeft: "20px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={profitLost}
                    onChange={(e) => handleCheckboxChange(e, profitLostSet)}
                    name="Profit Loss"
                  />
                }
                label="Profit Loss"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={balanceSheet}
                    onChange={(e) => handleCheckboxChange(e, balanceSheetSet)}
                    name="Balance Sheet"
                  />
                }
                label="Balance Sheet"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={customerLedger}
                    onChange={(e) => handleCheckboxChange(e, customerLedgerSet)}
                    name="Customer Ledger"
                  />
                }
                label="Customer Ledger"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={supplierLedger}
                    onChange={(e) => handleCheckboxChange(e, supplierLedgerSet)}
                    name="Supplier Ledger"
                  />
                }
                label="Supplier Ledger"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={guestLedger}
                    onChange={(e) => handleCheckboxChange(e, guestLedgerSet)}
                    name="Guest Ledger"
                  />
                }
                label="Guest Ledger"
              />
            
              <FormControlLabel
                control={
                  <Checkbox
                    checked={dailyLedger}
                    onChange={(e) => handleCheckboxChange(e, dailyLedgerSet)}
                    name="Daily Ledger"
                  />
                }
                label="Daily Ledger"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={cashBankLedger}
                    onChange={(e) => handleCheckboxChange(e, cashBankLedgerSet)}
                    name="Cash Bank Ledger"
                  />
                }
                label="Cash Bank Ledger"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={customerBalance}
                    onChange={(e) =>
                      handleCheckboxChange(e, customerBalanceSet)
                    }
                    name="Customer Balance"
                  />
                }
                label="Customer Balance"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={supplierBalance}
                    onChange={(e) =>
                      handleCheckboxChange(e, supplierBalanceSet)
                    }
                    name="Supplier Balance"
                  />
                }
                label="Supplier Balance"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={cashBankBalance}
                    onChange={(e) =>
                      handleCheckboxChange(e, cashBankBalanceSet)
                    }
                    name="Cash Bank Balance"
                  />
                }
                label="Cash Bank Balance"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={guestBalance}
                    onChange={(e) => handleCheckboxChange(e, guestBalanceSet)}
                    name="Guest Balance"
                  />
                }
                label="Guest Balance"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={loanBalance}
                    onChange={(e) => handleCheckboxChange(e, loanBalanceSet)}
                    name="Loan Balance"
                  />
                }
                label="Loan Balance"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={capitalBalance}
                    onChange={(e) => handleCheckboxChange(e, capitalBalanceSet)}
                    name="Capital Balance"
                  />
                }
                label="Capital Balance"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={fixedAssetBalance}
                    onChange={(e) =>
                      handleCheckboxChange(e, fixedAssetBalanceSet)
                    }
                    name="Fixed Asset Balance"
                  />
                }
                label="Fixed Asset Balance"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={expenseBalance}
                    onChange={(e) => handleCheckboxChange(e, expenseBalanceSet)}
                    name="Expense Balance"
                  />
                }
                label="Expense Balance"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={payrollBalance}
                    onChange={(e) => handleCheckboxChange(e, payrollBalanceSet)}
                    name="Payroll Balance"
                  />
                }
                label="Payroll Balance"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={serviceExpenseBalance}
                    onChange={(e) =>
                      handleCheckboxChange(e, serviceExpenseBalanceSet)
                    }
                    name="Service Expense Balance"
                  />
                }
                label="Service Expense Balance"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={houseKeepingUsedBalance}
                    onChange={(e) =>
                      handleCheckboxChange(e, houseKeepingUsedBalanceSet)
                    }
                    name="House keeping Used Balance"
                  />
                }
                label="House keeping Used Balance"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={expenseRecord}
                    onChange={(e) => handleCheckboxChange(e, expenseRecordSet)}
                    name="Expense Record"
                  />
                }
                label="Expense Record"
              />
            </FormGroup>
            <FormHelperText>Report Module End</FormHelperText>
          </FormControl>
        </Grid>


        {/* hotel management */}
        <Grid item xs={12} sm={3}>
          <FormControl component="fieldset">
            <FormControlLabel
              control={
                <Checkbox
                  checked={hotelManagement}
                  onChange={handleMasterChange}
                  name="Hotel Management"
                />
              }
              label="Hotel Management"
            />
            <FormGroup style={{ marginLeft: "20px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={floorManage}
                    onChange={(e) => handleCheckboxChange(e, floorManageSet)}
                    name="Floor Manage"
                  />
                }
                label="Floor Manage"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={amenityManage}
                    onChange={(e) => handleCheckboxChange(e, amenityManageSet)}
                    name="Amenity Manage"
                  />
                }
                label="Amenity Manage"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={facilityManage}
                    onChange={(e) => handleCheckboxChange(e, facilityManageSet)}
                    name="Facility Manage"
                  />
                }
                label="Facility Manage"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={roomType}
                    onChange={(e) => handleCheckboxChange(e, roomTypeSet)}
                    name="Room Type"
                  />
                }
                label="Room Type"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={room}
                    onChange={(e) => handleCheckboxChange(e, roomSet)}
                    name="Room"
                  />
                }
                label="Room"
              />
            </FormGroup>
            <FormHelperText>Hotel Management Module End</FormHelperText>
          </FormControl>
        </Grid>

        {/* Booking Module*/}
        <Grid item xs={12} sm={3}>
          <FormControl component="fieldset">
            <FormControlLabel
              control={
                <Checkbox
                  checked={booking}
                  onChange={handleMasterChange}
                  name="Booking"
                />
              }
              label="Booking"
            />
            <FormGroup style={{ marginLeft: "20px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={quickCheckIn}
                    onChange={(e) => handleCheckboxChange(e, quickCheckInSet)}
                    name="Quick CheckIn"
                  />
                }
                label="Quick CheckIn"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={bookingRecord}
                    onChange={(e) => handleCheckboxChange(e, bookingRecordSet)}
                    name="Booking Record"
                  />
                }
                label="Booking Record"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={guestEntry}
                    onChange={(e) => handleCheckboxChange(e, guestEntrySet)}
                    name="Guest Entry"
                  />
                }
                label="Guest Entry"
              />
            </FormGroup>
            <FormHelperText>Booking Module End</FormHelperText>
          </FormControl>
        </Grid>

    

        {/* Premium service Module*/}
        <Grid item xs={12} sm={3}>
          <FormControl component="fieldset">
            <FormControlLabel
              control={
                <Checkbox
                  checked={premiumService}
                  onChange={handleMasterChange}
                  name="Premium Service"
                />
              }
              label="Premium Service"
            />
            <FormGroup style={{ marginLeft: "20px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={premiumServiceEntry}
                    onChange={(e) =>
                      handleCheckboxChange(e, premiumServiceEntrySet)
                    }
                    name="Service Entry"
                  />
                }
                label="Service Entry"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={premiumServiceExpense}
                    onChange={(e) =>
                      handleCheckboxChange(e, premiumServiceExpenseSet)
                    }
                    name="Service Expense"
                  />
                }
                label="Service Expense"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={premiumServiceRecord}
                    onChange={(e) =>
                      handleCheckboxChange(e, premiumServiceRecordSet)
                    }
                    name="Service Record"
                  />
                }
                label="Service Record"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={premiumServiceExpenseRecord}
                    onChange={(e) =>
                      handleCheckboxChange(e, premiumServiceExpenseRecordSet)
                    }
                    name="Service Expense Record"
                  />
                }
                label="Service Expense Record"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={serviceNameEntry}
                    onChange={(e) =>
                      handleCheckboxChange(e, serviceNameEntrySet)
                    }
                    name="Service Name Entry"
                  />
                }
                label="Service Name Entry"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={serviceExpenseNameEntry}
                    onChange={(e) =>
                      handleCheckboxChange(e, serviceExpenseNameEntrySet)
                    }
                    name="Expense Name Entry"
                  />
                }
                label="Expense Name Entry"
              />
            </FormGroup>
            <FormHelperText>Premium Service Module End</FormHelperText>
          </FormControl>
        </Grid>

        {/* Accounts Module*/}
        <Grid item xs={12} sm={3}>
          <FormControl component="fieldset">
            <FormControlLabel
              control={
                <Checkbox
                  checked={accounts}
                  onChange={handleMasterChange}
                  name="Accounts"
                />
              }
              label="Accounts"
            />
            <FormGroup style={{ marginLeft: "20px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={guestPaymentReceipt}
                    onChange={(e) =>
                      handleCheckboxChange(e, guestPaymentReceiptSet)
                    }
                    name="Guest Payment Receipt"
                  />
                }
                label="Guest Payment Receipt"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={customerTransaction}
                    onChange={(e) =>
                      handleCheckboxChange(e, customerTransactionSet)
                    }
                    name="Customer Transaction"
                  />
                }
                label="Customer Transaction"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={supplierTransaction}
                    onChange={(e) =>
                      handleCheckboxChange(e, supplierTransactionSet)
                    }
                    name="Supplier Transaction"
                  />
                }
                label="Supplier Transaction"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={expenseEntry}
                    onChange={(e) => handleCheckboxChange(e, expenseEntrySet)}
                    name="Expense Entry"
                  />
                }
                label="Expense Entry"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={contra}
                    onChange={(e) => handleCheckboxChange(e, contraSet)}
                    name="Contra"
                  />
                }
                label="Contra"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={expenseHeadEntry}
                    onChange={(e) =>
                      handleCheckboxChange(e, expenseHeadEntrySet)
                    }
                    name="Expense Head Entry"
                  />
                }
                label="Expense Head Entry"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={accountEntry}
                    onChange={(e) => handleCheckboxChange(e, accountEntrySet)}
                    name="Account Entry"
                  />
                }
                label="Account Entry"
              />
            </FormGroup>
            <FormHelperText>Account Module End</FormHelperText>
          </FormControl>
        </Grid>

        {/* payroll Module*/}
        <Grid item xs={12} sm={3}>
          <FormControl component="fieldset">
            <FormControlLabel
              control={
                <Checkbox
                  checked={payroll}
                  onChange={handleMasterChange}
                  name="Payroll"
                />
              }
              label="Payroll"
            />
            <FormGroup style={{ marginLeft: "20px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={employeePayment}
                    onChange={(e) =>
                      handleCheckboxChange(e, employeePaymentSet)
                    }
                    name="Employee Payment"
                  />
                }
                label="Employee Payment"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={employee}
                    onChange={(e) => handleCheckboxChange(e, employeeSet)}
                    name="Employee"
                  />
                }
                label="Employee"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={department}
                    onChange={(e) => handleCheckboxChange(e, departmentSet)}
                    name="Department Transaction"
                  />
                }
                label="Department"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={salaryPayableReport}
                    onChange={(e) => handleCheckboxChange(e, salaryPayableReportSet)}
                    name="Salary Payable Report"
                  />
                }
                label="Salary Payable Report"
              />
            </FormGroup>
            <FormHelperText>Payroll Module End</FormHelperText>
          </FormControl>
        </Grid>

        {/* Inventory Module*/}
        <Grid item xs={12} sm={3}>
          <FormControl component="fieldset">
            <FormControlLabel
              control={
                <Checkbox
                  checked={inventory}
                  onChange={handleMasterChange}
                  name="Inventory"
                />
              }
              label="Inventory"
            />
            <FormGroup style={{ marginLeft: "20px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={itemStockReport}
                    onChange={(e) =>
                      handleCheckboxChange(e, itemStockReportSet)
                    }
                    name="Item Stock Report"
                  />
                }
                label="Item Stock Report"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={barItemStockReport}
                    onChange={(e) =>
                      handleCheckboxChange(e, barItemStockReportSet)
                    }
                    name="Bar Item Stock Report"
                  />
                }
                label="Bar Item Stock Report"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={houseKeepingItemStockReport}
                    onChange={(e) =>
                      handleCheckboxChange(e, houseKeepingItemStockReportSet)
                    }
                    name="House Keeping Stock"
                  />
                }
                label="House Keeping Stock"
              />
            </FormGroup>
            <FormHelperText>Inventory Module End</FormHelperText>
          </FormControl>
        </Grid>

  
        {/* setting module*/}
        <Grid item xs={12} sm={3}>
          <FormControl component="fieldset">
            <FormControlLabel
              control={
                <Checkbox
                  checked={setting}
                  onChange={handleMasterChange}
                  name="Settings"
                />
              }
              label="Settings"
            />
            <FormGroup style={{ marginLeft: "20px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={branchManage}
                    onChange={(e) => handleCheckboxChange(e, branchManageSet)}
                    name="Branch Manage"
                  />
                }
                label="Branch Manage"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={companyProfile}
                    onChange={(e) => handleCheckboxChange(e, companyProfileSet)}
                    name="Company Profile"
                  />
                }
                label="Company Profile"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={userManage}
                    onChange={(e) => handleCheckboxChange(e, userManageSet)}
                    name="User Manage"
                  />
                }
                label="User Manage"
              />
            </FormGroup>
            <FormHelperText>Settings Module End</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12}>
          <Button
            style={{ fontSize: "12px" }}
            variant="contained"
            color="primary"
            size="small"
            onClick={SaveAccess}
          >
            Save Access
          </Button>

          <Button
            style={{ fontSize: "12px", marginLeft: "20px" }}
            variant="contained"
            color="primary"
            size="small"
            onClick={() => navigate("/user-manage")}
          >
            Back
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default UserAccess;
