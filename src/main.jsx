

import React, { lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.scss';
import ScrollToTop from './components/ui/scrolltotop.jsx';
import { AuthProvider } from './context/AuthProvider.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import LoginRoute from './routes/LoginRoute.jsx';

// Lazy loading components
const App = lazy(() => import('./pages/App.jsx'));
const Crm = lazy(() => import('./container/dashboards/crm/crm.jsx'));
const Dash = lazy(() => import('./pages/dash/Dash.jsx'));
const Floor = lazy(() => import('./pages/hotelmanagement/Floor.jsx'));
const Login = lazy(() => import('./pages/login/Login.jsx'));
const LoginLayout = lazy(() => import('./LoginLayout.jsx'));
const Branch = lazy(() => import('./pages/branch/Branch.jsx'));
const Signup = lazy(() => import('./pages/signup/Signup.jsx'));
const Amenity = lazy(() => import('./pages/hotelmanagement/Amenity.jsx'));
const Facility = lazy(() => import('./pages/hotelmanagement/Facility.jsx'));
const RoomType = lazy(() => import('./pages/hotelmanagement/RoomType.jsx'));
const Room = lazy(() => import('./pages/hotelmanagement/Room.jsx'));
const ExpenseHead = lazy(() => import('./pages/Accounts/ExpenseHead.jsx'));
const Account = lazy(() => import('./pages/Accounts/Account.jsx'));
const Expense = lazy(() => import('./pages/Accounts/Expense.jsx'));
const ExpenseRecord = lazy(() => import('./pages/Accounts/ExpenseRecord.jsx'));
const Guest = lazy(() => import('./pages/booking/Guest.jsx'));
const BookingUi = lazy(() => import('./pages/booking/BookingUi.jsx'));
const GuestPaymentReceipt = lazy(() => import('./pages/Accounts/GuestPaymentReceipt.jsx'));
const Department = lazy(() => import('./pages/payroll/Department.jsx'));
const Employee = lazy(() => import('./pages/payroll/Employee.jsx'));
const EmployeeSalaryPayment = lazy(() => import('./pages/payroll/EmployeeSalaryPayment.jsx'));
const ItemUnit = lazy(() => import('./pages/itemManagement/ItemUnit.jsx'));
const ItemCategory = lazy(() => import('./pages/itemManagement/ItemCategory.jsx'));
const Item = lazy(() => import('./pages/itemManagement/Item.jsx'));
const Supplier = lazy(() => import('./pages/Purchase/Supplier.jsx'));
const ItemPurchase = lazy(() => import('./pages/Purchase/ItemPurchase.jsx'));
const PurchaseRecord = lazy(() => import('./pages/Purchase/PurchaseRecord.jsx'));
const ItemPurchaseReturn = lazy(() => import('./pages/Purchase/ItemPurchaseReturn.jsx'));
const ItemPurchaseReturnRecord = lazy(() => import('./pages/Purchase/ItemPurchaseReturnRecord.jsx'));
const SaleEntry = lazy(() => import('./pages/sales/SaleEntry.jsx'));
const CustomerEntry = lazy(() => import('./pages/sales/CustomerEntry.jsx'));
const SaleRecord = lazy(() => import('./pages/sales/SaleRecord.jsx'));
const SaleReturn = lazy(() => import('./pages/sales/SaleReturn.jsx'));
const SaleReturnRecord = lazy(() => import('./pages/sales/SaleReturnRecord.jsx'));
const SaleInvoice = lazy(() => import('./pages/sales/salesInvoice/SaleInvoice.jsx'));
const SaleReturnInvoice = lazy(() => import('./pages/sales/salesInvoice/SaleReturnInvoice.jsx'));
const PurchaseInvoice = lazy(() => import('./pages/Purchase/purchaseInvoice/PurchaseInvoice.jsx'));
const PurchaseReturnInvoice = lazy(() => import('./pages/Purchase/purchaseInvoice/PurchaseReturnInvoice.jsx'));
const BarItemUnit = lazy(() => import('./pages/bar/BarItemUnit.jsx'));
const BarItemCategory = lazy(() => import('./pages/bar/BarItemCategory.jsx'));
const BarItem = lazy(() => import('./pages/bar/BarItem.jsx'));
const BarItemPurchase = lazy(() => import('./pages/bar/BarItemPurchase.jsx'));
const BarItemPurchaseRecord = lazy(() => import('./pages/bar/BarItemPurchaseRecord.jsx'));
const BarPurchaseInvoice = lazy(() => import('./pages/bar/barInvoices/BarPurchaseInvoice.jsx'));
const BarItemPurchaseReturn = lazy(() => import('./pages/bar/BarItemPurchaseReturn.jsx'));
const BarItemPurchaseReturnRecord = lazy(() => import('./pages/bar/BarItemPurchaseReturnRecord.jsx'));
const BarPurchaseReturnInvoice = lazy(() => import('./pages/bar/barInvoices/BarPurchaseReturnInvoice.jsx'));
const BarItemSale = lazy(() => import('./pages/bar/BarItemSale.jsx'));
const BarItemSaleRecord = lazy(() => import('./pages/bar/BarItemSaleRecord.jsx'));
const BarItemSaleInvoice = lazy(() => import('./pages/bar/barInvoices/BarItemSaleInvoice.jsx'));
const BarItemSaleReturn = lazy(() => import('./pages/bar/BarItemSaleReturn.jsx'));
const BarItemSaleReturnRecord = lazy(() => import('./pages/bar/BarItemSaleReturnRecord.jsx'));
const BarItemSaleReturnInvoice = lazy(() => import('./pages/bar/barInvoices/BarItemSaleReturnInvoice.jsx'));
const HouseKeepingUnit = lazy(() => import('./pages/houseKeeping/HouseKeepingUnit.jsx'));
const HouseKeepingCategory = lazy(() => import('./pages/houseKeeping/HouseKeepingCategory.jsx'));
const HouseKeepingItem = lazy(() => import('./pages/houseKeeping/HouseKeepingItem.jsx'));
const HouseKeepingItemPurchase = lazy(() => import('./pages/houseKeeping/HouseKeepingItemPurchase.jsx'));
const HouseKeepingPurchaseRecord = lazy(() => import('./pages/houseKeeping/HouseKeepingPurchaseRecord.jsx'));
const HouseKeepingPurchaseInvoice = lazy(() => import('./pages/houseKeeping/houseKeepingInvoices/HouseKeepingPurchaseInvoice.jsx'));
const HouseKeepingItemPurchaseReturn = lazy(() => import('./pages/houseKeeping/HouseKeepingItemPurchaseReturn.jsx'));
const HouseKeepingItemPurchaseReturnRecord = lazy(() => import('./pages/houseKeeping/HouseKeepingItemPurchaseReturnRecord.jsx'));
const HouseKeepingPurchaseReturnInvoice = lazy(() => import('./pages/houseKeeping/houseKeepingInvoices/HouseKeepingPurchaseReturnInvoice.jsx'));
const HouseKeepingUsed = lazy(() => import('./pages/houseKeeping/HouseKeepingUsed.jsx'));
const HouseKeepingUsedRecord = lazy(() => import('./pages/houseKeeping/HouseKeepingUsedRecord.jsx'));
const HouseKeepingUsedInvoice = lazy(() => import('./pages/houseKeeping/houseKeepingInvoices/HouseKeepingUsedInvoice.jsx'));
const ItemStockReport = lazy(() => import('./pages/Inventory/ItemStockReport.jsx'));
const BarItemStockReport = lazy(() => import('./pages/Inventory/BarItemStockReport.jsx'));
const HouseKeepingItemStockReport = lazy(() => import('./pages/Inventory/HouseKeepingItemStockReport.jsx'));
const PremiumServiceName = lazy(() => import('./pages/premiumService/PremiumServiceName.jsx'));
const PremiumServiceExpenseName = lazy(() => import('./pages/premiumService/PremiumServiceExpenseName.jsx'));
const PremiumServices = lazy(() => import('./pages/premiumService/PremiumServices.jsx'));
const PremiumServiceRecord = lazy(() => import('./pages/premiumService/PremiumServiceRecord.jsx'));
const PremiumServiceInvoice = lazy(() => import('./pages/premiumService/PremiumServiceAndExpenseInvoice/PremiumServiceInvoice.jsx'));
const PremiumServiceExpense = lazy(() => import('./pages/premiumService/PremiumServiceExpense.jsx'));
const Contra = lazy(() => import('./pages/Accounts/Contra.jsx'));
const PremiumServiceExpenseRecord = lazy(() => import('./pages/premiumService/PremiumServiceExpenseRecord.jsx'));
const PremiumServiceExpenseInvoice = lazy(() => import('./pages/premiumService/PremiumServiceAndExpenseInvoice/PremiumServiceExpenseInvoice.jsx'));
const SupplierTransaction = lazy(() => import('./pages/Accounts/SupplierTransaction.jsx'));
const CustomerTransaction = lazy(() => import('./pages/Accounts/CustomerTransaction.jsx'));
const Production = lazy(() => import('./pages/restaurant/Production.jsx'));
const ProductionRecord = lazy(() => import('./pages/restaurant/ProductionRecord.jsx'));
const BookingRecord = lazy(() => import('./pages/booking/BookingRecord.jsx'));
const BookingInvoice = lazy(() => import('./pages/booking/BookingInvoice.jsx'));
const ProductionInvoice = lazy(() => import('./pages/restaurant/ProductionInvoice.jsx'));
const CustomerLedger = lazy(() => import('./pages/reports/CustomerLedger.jsx'));
const SupplierLedger = lazy(() => import('./pages/reports/SupplierLedger.jsx'));
const GuestLedger = lazy(() => import('./pages/reports/GuestLedger.jsx'));
const CustomerBalance = lazy(() => import('./pages/reports/CustomerBalance.jsx'));
const SupplierBalance = lazy(() => import('./pages/reports/SupplierBalance.jsx'));
const GuestBalance = lazy(() => import('./pages/reports/GuestBalance.jsx'));
const LoanBalance = lazy(() => import('./pages/reports/LoanBalance.jsx'));
const CapitalBalance = lazy(() => import('./pages/reports/CapitalBalance.jsx'));
const FixedAssetBalance = lazy(() => import('./pages/reports/FixedAssetBalance.jsx'));
const ExpenseBalance = lazy(() => import('./pages/reports/ExpenseBalance.jsx'));
const PayrollBalance = lazy(() => import('./pages/reports/PayrollBalance.jsx'));
const ServiceExpenseBalance = lazy(() => import('./pages/reports/ServiceExpenseBalance.jsx'));
const HouseKeepingUsedBalanace = lazy(() => import('./pages/reports/HouseKeepingUsedBalanace.jsx'));
const CompanyProfile = lazy(() => import('./pages/settings/CompanyProfile.jsx'));
const ProfitLoss = lazy(() => import('./pages/reports/ProfitLoss.jsx'));
const UserAccess = lazy(() => import('./pages/settings/UserAccess.jsx'));
const DailyLedger = lazy(() => import('./pages/reports/DailyLedger.jsx'));
const BankAccountLedger = lazy(() => import('./pages/reports/BankAccountLedger.jsx'));
const CashBankBalance = lazy(() => import('./pages/reports/CashBankBalance.jsx'));
const GuestPaymentRecieptInvoice = lazy(() => import('./pages/Accounts/invoice/GuestPaymentRecieptInvoice.jsx'));
const CustomerTransactionInvoice = lazy(() => import('./pages/Accounts/invoice/CustomerTransactionInvoice.jsx'));
const SupplierTransactionInvoice = lazy(() => import('./pages/Accounts/invoice/SupplierTransactionInvoice.jsx'));
const ExpenseInvoice = lazy(() => import('./pages/Accounts/invoice/ExpenseInvoice.jsx'));
const ContraInvoice = lazy(() => import('./pages/Accounts/invoice/ContraInvoice.jsx'));
const EmployeeSalaryPaymentInvoice = lazy(() => import('./pages/payroll/EmployeeSalaryPaymentInvoice.jsx'));
const SalaryPayableReport = lazy(() => import('./pages/payroll/SalaryPayableReport.jsx'));
const EmployeeSalaryPayableInvoice = lazy(() => import('./pages/payroll/EmployeeSalaryPayableInvoice.jsx'));
const BalanceSheet = lazy(() => import('./pages/reports/BalanceSheet.jsx'));






ReactDOM.createRoot(document.getElementById('root')).render(
  <React.Fragment>
    <BrowserRouter>
      <React.Suspense>
        <ScrollToTop />
        <AuthProvider>
          <Routes>

            <Route path={`${import.meta.env.BASE_URL}`} element={<ProtectedRoute><App /></ProtectedRoute>}>
              <Route index element={<Crm />} />
              <Route path={`${import.meta.env.BASE_URL}dashboard`} element={<ProtectedRoute><Crm /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}dashboards/dashboard`} element={<ProtectedRoute><Dash /></ProtectedRoute>} />

              {/* hotel management routes */}
              <Route path={`${import.meta.env.BASE_URL}hotel-management/floor-manage`} element={<ProtectedRoute><Floor /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}hotel-management/amenity-manage`} element={<ProtectedRoute><Amenity /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}hotel-management/facility-manage`} element={<ProtectedRoute><Facility /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}hotel-management/room-type`} element={<ProtectedRoute><RoomType /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}hotel-management/room`} element={<ProtectedRoute><Room /></ProtectedRoute>} />

              {/* accounts  routes*/}
              <Route path={`${import.meta.env.BASE_URL}accounts/expense-head-entry`} element={<ProtectedRoute><ExpenseHead /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}accounts/account-entry`} element={<ProtectedRoute><Account /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}accounts/expense-entry`} element={<ProtectedRoute><Expense /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}accounts/expense-invoice/:id`} element={<ProtectedRoute><ExpenseInvoice /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}accounts/guest-payment-receipt`} element={<ProtectedRoute><GuestPaymentReceipt /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}accounts/guest-payment-receipt-invoice/:id`} element={<ProtectedRoute><GuestPaymentRecieptInvoice /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}accounts/contra`} element={<ProtectedRoute><Contra /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}accounts/contra-invoice/:id`} element={<ProtectedRoute><ContraInvoice /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}accounts/supplier-transaction`} element={<ProtectedRoute><SupplierTransaction /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}accounts/supplier-transaction-invoice/:id`} element={<ProtectedRoute><SupplierTransactionInvoice /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}accounts/customer-transaction`} element={<ProtectedRoute><CustomerTransaction /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}accounts/customer-transaction-invoice/:id`} element={<ProtectedRoute><CustomerTransactionInvoice /></ProtectedRoute>} />


              {/* Booking */}
              <Route path={`${import.meta.env.BASE_URL}booking/quick-checkin`} element={<ProtectedRoute><BookingUi /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}booking/quick-checkin/:id`} element={<ProtectedRoute><BookingUi /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}booking/guest-entry`} element={<ProtectedRoute><Guest /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}booking/booking-record`} element={<ProtectedRoute><BookingRecord /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}booking/booking-invoice/:id`} element={<ProtectedRoute><BookingInvoice /></ProtectedRoute>} />
              
              
              {/* payroll */}
              <Route path={`${import.meta.env.BASE_URL}payroll/department`} element={<ProtectedRoute><Department /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}payroll/employee`} element={<ProtectedRoute><Employee /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}payroll/employee-payment`} element={<ProtectedRoute><EmployeeSalaryPayment /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}payroll/employee-payment-invoice/:id`} element={<ProtectedRoute><EmployeeSalaryPaymentInvoice /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}payroll/salary-payable-report`} element={<ProtectedRoute><SalaryPayableReport /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}payroll/salary-payable-invoice/:id/:month/:year`} element={<ProtectedRoute><EmployeeSalaryPayableInvoice /></ProtectedRoute>} />

              {/* item management */}
              <Route path={`${import.meta.env.BASE_URL}item-management/item-unit`} element={<ProtectedRoute><ItemUnit /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}item-management/item-category`} element={<ProtectedRoute><ItemCategory /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}item-management/item`} element={<ProtectedRoute><Item /></ProtectedRoute>} />

              {/* purchase */}
              <Route path={`${import.meta.env.BASE_URL}purchase/supplier`} element={<ProtectedRoute><Supplier /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}purchase/item-purchase`} element={<ProtectedRoute><ItemPurchase /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}purchase/item-purchase/:id`} element={<ProtectedRoute><ItemPurchase /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}purchase/purchase-record`} element={<ProtectedRoute><PurchaseRecord /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}purchase/purchase-return`} element={<ProtectedRoute><ItemPurchaseReturn /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}purchase/purchase-return/:id`} element={<ProtectedRoute><ItemPurchaseReturn /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}purchase/purchase-return-record`} element={<ProtectedRoute><ItemPurchaseReturnRecord /></ProtectedRoute>} />
              {/* purchase invoice */}
              <Route path={`${import.meta.env.BASE_URL}purchase/item-purchase-invoice/:id`} element={<ProtectedRoute><PurchaseInvoice /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}purchase/item-purchase-return-invoice/:id`} element={<ProtectedRoute><PurchaseReturnInvoice /></ProtectedRoute>} />




              {/* Sales */}
              <Route path={`${import.meta.env.BASE_URL}sales/customer-entry`} element={<ProtectedRoute><CustomerEntry /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}sales/sale-entry`} element={<ProtectedRoute><SaleEntry /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}sales/sale/:id`} element={<ProtectedRoute><SaleEntry /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}sales/sale-record`} element={<ProtectedRoute><SaleRecord /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}sales/sale-return`} element={<ProtectedRoute><SaleReturn /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}sales/sale-return/:id`} element={<ProtectedRoute><SaleReturn /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}sales/sale-return-record`} element={<ProtectedRoute><SaleReturnRecord /></ProtectedRoute>} />
            
              {/* Sales Invoice */}
              <Route path={`${import.meta.env.BASE_URL}sales/sale-invoice/:id`} element={<ProtectedRoute><SaleInvoice /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}sales/sale-return-invoice/:id`} element={<ProtectedRoute><SaleReturnInvoice /></ProtectedRoute>} />

             {/* bar */}
             <Route path={`${import.meta.env.BASE_URL}bar/bar-item-unit`} element={<ProtectedRoute><BarItemUnit /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}bar/bar-item-category`} element={<ProtectedRoute><BarItemCategory /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}bar/bar-item`} element={<ProtectedRoute><BarItem /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}bar/bar-item-purchase`} element={<ProtectedRoute><BarItemPurchase /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}bar/bar-item-purchase/:id`} element={<ProtectedRoute><BarItemPurchase /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}bar/bar-item-purchase-record`} element={<ProtectedRoute><BarItemPurchaseRecord /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}bar/bar-item-purchase-return`} element={<ProtectedRoute><BarItemPurchaseReturn /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}bar/bar-item-purchase-return/:id`} element={<ProtectedRoute><BarItemPurchaseReturn /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}bar/bar-item-purchase-return-record`} element={<ProtectedRoute><BarItemPurchaseReturnRecord /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}bar/bar-item-sale`} element={<ProtectedRoute><BarItemSale /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}bar/bar-item-sale/:id`} element={<ProtectedRoute><BarItemSale /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}bar/bar-item-sale-record`} element={<ProtectedRoute><BarItemSaleRecord /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}bar/bar-item-sale-return`} element={<ProtectedRoute><BarItemSaleReturn /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}bar/bar-item-sale-return/:id`} element={<ProtectedRoute><BarItemSaleReturn /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}bar/bar-item-sale-return-record`} element={<ProtectedRoute><BarItemSaleReturnRecord /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}bar/supplier`} element={<ProtectedRoute><Supplier /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}bar-sale/customer-entry`} element={<ProtectedRoute><CustomerEntry /></ProtectedRoute>} />


             {/* bar purchase invoice */}
             <Route path={`${import.meta.env.BASE_URL}bar/bar-item-purchase-invoice/:id`} element={<ProtectedRoute><BarPurchaseInvoice /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}bar/bar-item-purchase-return-invoice/:id`} element={<ProtectedRoute><BarPurchaseReturnInvoice /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}bar/bar-item-sale-invoice/:id`} element={<ProtectedRoute><BarItemSaleInvoice /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}bar/bar-item-sale-return-invoice/:id`} element={<ProtectedRoute><BarItemSaleReturnInvoice /></ProtectedRoute>} />

             
             {/* House Keeping Module */}
             <Route path={`${import.meta.env.BASE_URL}house-keeping/house-keeping-unit`} element={<ProtectedRoute><HouseKeepingUnit /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}house-keeping/house-keeping-category`} element={<ProtectedRoute><HouseKeepingCategory /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}house-keeping/house-keeping-item`} element={<ProtectedRoute><HouseKeepingItem /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}house-keeping/hk-item-purchase`} element={<ProtectedRoute><HouseKeepingItemPurchase /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}house-keeping/house-keeping-item-purchase/:id`} element={<ProtectedRoute><HouseKeepingItemPurchase /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}house-keeping/hk-purchase-record`} element={<ProtectedRoute><HouseKeepingPurchaseRecord /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}house-keeping/hk-purchase-return`} element={<ProtectedRoute><HouseKeepingItemPurchaseReturn /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}house-keeping/house-keeping-item-purchase-return/:id`} element={<ProtectedRoute><HouseKeepingItemPurchaseReturn /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}house-keeping/hk-purchase-return-record`} element={<ProtectedRoute><HouseKeepingItemPurchaseReturnRecord /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}house-keeping/house-keeping-used`} element={<ProtectedRoute><HouseKeepingUsed /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}house-keeping/house-keeping-used/:id`} element={<ProtectedRoute><HouseKeepingUsed /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}house-keeping/house-keeping-used-record`} element={<ProtectedRoute><HouseKeepingUsedRecord /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}house-keeping-purchase/supplier`} element={<ProtectedRoute><Supplier /></ProtectedRoute>} />

             {/* house keeping invoice */}
             <Route path={`${import.meta.env.BASE_URL}house-keeping/house-keeping-purchase-invoice/:id`} element={<ProtectedRoute><HouseKeepingPurchaseInvoice /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}house-keeping/house-keeping-purchase-return-invoice/:id`} element={<ProtectedRoute><HouseKeepingPurchaseReturnInvoice /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}house-keeping/house-keeping-used-invoice/:id`} element={<ProtectedRoute><HouseKeepingUsedInvoice /></ProtectedRoute>} />


             {/* Inventory module */}
             <Route path={`${import.meta.env.BASE_URL}inventory/item-stock-report`} element={<ProtectedRoute><ItemStockReport /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}inventory/bar-item-stock-report`} element={<ProtectedRoute><BarItemStockReport /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}inventory/house-keeping-stock`} element={<ProtectedRoute><HouseKeepingItemStockReport /></ProtectedRoute>} />
            

             {/* Premium Service Module */}
             <Route path={`${import.meta.env.BASE_URL}premium-service/service-name-entry`} element={<ProtectedRoute><PremiumServiceName /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}premium-service/expense-name-entry`} element={<ProtectedRoute><PremiumServiceExpenseName /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}premium-service/service-entry`} element={<ProtectedRoute><PremiumServices /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}premium-service/premium-service/:id`} element={<ProtectedRoute><PremiumServices /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}premium-service/service-record`} element={<ProtectedRoute><PremiumServiceRecord /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}premium-service/service-expense`} element={<ProtectedRoute><PremiumServiceExpense /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}premium-service/premium-service-expense/:id`} element={<ProtectedRoute><PremiumServiceExpense /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}premium-service/service-expense-record`} element={<ProtectedRoute><PremiumServiceExpenseRecord /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}premium-service/customer-entry`} element={<ProtectedRoute><CustomerEntry /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}premium-service/supplier`} element={<ProtectedRoute><Supplier /></ProtectedRoute>} />


             {/* Premium Service Invoice */}
             <Route path={`${import.meta.env.BASE_URL}premium-service/premium-service-invoice/:id`} element={<ProtectedRoute><PremiumServiceInvoice /></ProtectedRoute>} />
             <Route path={`${import.meta.env.BASE_URL}premium-service/premium-service-expense-invoice/:id`} element={<ProtectedRoute><PremiumServiceExpenseInvoice /></ProtectedRoute>} />


             {/* Restaurant module */}
              <Route path={`${import.meta.env.BASE_URL}restaurant/production`} element={<ProtectedRoute><Production /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}restaurant/production/:id`} element={<ProtectedRoute><Production /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}restaurant/production-invoice/:id`} element={<ProtectedRoute><ProductionInvoice /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}restaurant/production-report`} element={<ProtectedRoute><ProductionRecord /></ProtectedRoute>} />


              {/* Reports module */}
              <Route path={`${import.meta.env.BASE_URL}reports/balance-sheet`} element={<ProtectedRoute><BalanceSheet /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}reports/profit-loss`} element={<ProtectedRoute><ProfitLoss /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}reports/customer-ledger`} element={<ProtectedRoute><CustomerLedger /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}reports/supplier-ledger`} element={<ProtectedRoute><SupplierLedger /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}reports/guest-ledger`} element={<ProtectedRoute><GuestLedger /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}reports/daily-ledger`} element={<ProtectedRoute><DailyLedger /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}reports/cash-bank-ledger`} element={<ProtectedRoute><BankAccountLedger /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}reports/customer-balance`} element={<ProtectedRoute><CustomerBalance /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}reports/supplier-balance`} element={<ProtectedRoute><SupplierBalance /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}reports/cash-bank-balance`} element={<ProtectedRoute><CashBankBalance /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}reports/guest-balance`} element={<ProtectedRoute><GuestBalance /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}reports/loan-balance`} element={<ProtectedRoute><LoanBalance /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}reports/capital-balance`} element={<ProtectedRoute><CapitalBalance /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}reports/fixed-asset-balance`} element={<ProtectedRoute><FixedAssetBalance /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}reports/expense-balance`} element={<ProtectedRoute><ExpenseBalance /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}reports/payroll-balance`} element={<ProtectedRoute><PayrollBalance /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}reports/service-expense-balance`} element={<ProtectedRoute><ServiceExpenseBalance /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}reports/house-keeping-used-balance`} element={<ProtectedRoute><HouseKeepingUsedBalanace /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}reports/expense-record`} element={<ProtectedRoute><ExpenseRecord /></ProtectedRoute>} />



              {/* settings */}
              <Route path={`${import.meta.env.BASE_URL}user-manage`} element={<ProtectedRoute><Signup /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}company-profile`} element={<ProtectedRoute><CompanyProfile /></ProtectedRoute>} />
              <Route path={`${import.meta.env.BASE_URL}user-manage/user-access/:id`} element={<ProtectedRoute><UserAccess /></ProtectedRoute>} />

              {/* branch management routes */}
              <Route path={`${import.meta.env.BASE_URL}hotel-management/branch-manage`} element={<ProtectedRoute><Branch /></ProtectedRoute>} />

            </Route>

            <Route path={`${import.meta.env.BASE_URL}login`} element={
              <LoginRoute>
                <LoginLayout><Login /></LoginLayout>
              </LoginRoute>} />


          </Routes>
        </AuthProvider>
      </React.Suspense>
    </BrowserRouter>
  </React.Fragment>
)
