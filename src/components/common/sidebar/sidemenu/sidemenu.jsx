import { auth, permissions } from "../../../../../utils";
import BedroomChildOutlinedIcon from "@mui/icons-material/BedroomChildOutlined";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
import LocalBarOutlinedIcon from "@mui/icons-material/LocalBarOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import MapsHomeWorkOutlinedIcon from "@mui/icons-material/MapsHomeWorkOutlined";
import DesignServicesOutlinedIcon from "@mui/icons-material/DesignServicesOutlined";
import AddCardOutlinedIcon from "@mui/icons-material/AddCardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
const menus = [
  {
    menutitle: "MAIN",
  },

  {
    path: `${import.meta.env.BASE_URL}dashboard`,
    title: "Dashboard",

    type: "link",
    active: false,
    selected: false,
    dirchange: false,
  },

  {
    menutitle: "MODULES",
  },
  {
    title: "Hotel Management",
    icon: (
      <BedroomChildOutlinedIcon className="bx bx-layer side-menu__icon"></BedroomChildOutlinedIcon>
    ),
    type: "sub",
    selected: false,
    dirchange: false,
    active: false,
    children: [
      {
        path: `${import.meta.env.BASE_URL}hotel-management/floor-manage`,
        title: "Floor Manage",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}hotel-management/amenity-manage`,
        title: "Amenity Manage",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}hotel-management/facility-manage`,
        title: "Facility Manage",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },

      {
        path: `${import.meta.env.BASE_URL}hotel-management/room-type`,
        title: "Room Type",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },

      {
        path: `${import.meta.env.BASE_URL}hotel-management/room`,
        title: "Room",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
    ],
  },
  {
    title: "Booking",
    icon: (
      <BookmarkAddedOutlinedIcon className="bx bx-layer side-menu__icon"></BookmarkAddedOutlinedIcon>
    ),
    type: "sub",
    selected: false,
    dirchange: false,
    active: false,
    children: [
      {
        path: `${import.meta.env.BASE_URL}booking/quick-checkin`,
        title: "Quick CheckIn",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },

      {
        path: `${import.meta.env.BASE_URL}booking/booking-record`,
        title: "Booking Record",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}booking/guest-entry`,
        title: "Guest Entry",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
    ],
  },
  {
    title: "Bar",
    icon: (
      <LocalBarOutlinedIcon className="bx bx-layer side-menu__icon"></LocalBarOutlinedIcon>
    ),
    type: "sub",
    selected: false,
    dirchange: false,
    active: false,
    children: [
      {
        title: "Bar Purchase",
        icon: <i className="bx bx-layer side-menu__icon"></i>,
        type: "sub",
        selected: false,
        dirchange: false,
        active: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}bar/bar-item-purchase`,
            title: "Bar Item Purchase",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
          },
          {
            path: `${import.meta.env.BASE_URL}bar/bar-item-purchase-return`,
            title: "Bar Item Purchase Return",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
          },
          {
            path: `${import.meta.env.BASE_URL}bar/bar-item-purchase-record`,
            title: "Bar Item Purchase Record",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
          },

          {
            path: `${
              import.meta.env.BASE_URL
            }bar/bar-item-purchase-return-record`,
            title: "Bar Item Purchase Return Record",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
          },
          {
            path: `${import.meta.env.BASE_URL}bar/supplier`,
            title: "Supplier",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
          },
        ],
      },
      {
        title: "Bar Sale",
        icon: <i className="bx bx-layer side-menu__icon"></i>,
        type: "sub",
        selected: false,
        dirchange: false,
        active: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}bar/bar-item-sale`,
            title: "Bar Item Sale",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
          },
          {
            path: `${import.meta.env.BASE_URL}bar/bar-item-sale-return`,
            title: "Bar Item Sale Return",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
          },
          
          {
            path: `${import.meta.env.BASE_URL}bar/bar-item-sale-record`,
            title: "Bar Item Sale Record",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
          },

          {
            path: `${import.meta.env.BASE_URL}bar/bar-item-sale-return-record`,
            title: "Bar Item Sale Return Record",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
          },
          {
            path: `${import.meta.env.BASE_URL}bar-sale/customer-entry`,
            title: "Customer Entry",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
          },
        ],
      },
      {
        title: "Item Settings",
        icon: <i className="bx bx-layer side-menu__icon"></i>,
        type: "sub",
        selected: false,
        dirchange: false,
        active: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}bar/bar-item`,
            title: "Bar Item",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
          },
          {
            path: `${import.meta.env.BASE_URL}bar/bar-item-unit`,
            title: "Bar Item Unit",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
          },
          {
            path: `${import.meta.env.BASE_URL}bar/bar-item-category`,
            title: "Bar Item Category",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
          },
        ],
      },
    ],
  },
  {
    title: "Restaurant",
    icon: (
      <RestaurantOutlinedIcon className="bx bx-layer side-menu__icon"></RestaurantOutlinedIcon>
    ),
    type: "sub",
    selected: false,
    dirchange: false,
    active: false,
    children: [
      {
        title: "Purchase",
        icon: <i className="bx bx-layer side-menu__icon"></i>,
        type: "sub",
        selected: false,
        dirchange: false,
        active: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}purchase/item-purchase`,
            title: "Item Purchase",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
          },
          {
            path: `${import.meta.env.BASE_URL}purchase/purchase-return`,
            title: "Purchase Return",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
          },
          {
            path: `${import.meta.env.BASE_URL}purchase/purchase-record`,
            title: "Purchase Record",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
          },

          {
            path: `${import.meta.env.BASE_URL}purchase/purchase-return-record`,
            title: "Purchase Return Record",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
          },
          {
            path: `${import.meta.env.BASE_URL}purchase/supplier`,
            title: "Supplier",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
          },
        ],
      },
      {
        title: "Sales",
        icon: <i className="bx bx-layer side-menu__icon"></i>,
        type: "sub",
        selected: false,
        dirchange: false,
        active: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}sales/sale-entry`,
            title: "Sale Entry",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
          },
          {
            path: `${import.meta.env.BASE_URL}sales/sale-return`,
            title: "Sale Return",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
          },
          {
            path: `${import.meta.env.BASE_URL}sales/sale-record`,
            title: "Sale Record",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
          },

          {
            path: `${import.meta.env.BASE_URL}sales/sale-return-record`,
            title: "Sale Return Record",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
          },
          {
            path: `${import.meta.env.BASE_URL}sales/customer-entry`,
            title: "Customer Entry",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
          },

        ],
      },
      {
        title: "Production",
        icon: <i className="bx bx-layer side-menu__icon"></i>,
        type: "sub",
        selected: false,
        dirchange: false,
        active: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}restaurant/production`,
            title: "Production",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
          },
          {
            path: `${import.meta.env.BASE_URL}restaurant/production-report`,
            title: "Production Report",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
          },
        ],
      },
      {
        title: "Item Settings",
        icon: <i className="bx bx-layer side-menu__icon"></i>,
        type: "sub",
        selected: false,
        dirchange: false,
        active: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}item-management/item-unit`,
            title: "Item Unit",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
          },
          {
            path: `${import.meta.env.BASE_URL}item-management/item-category`,
            title: "Item Category",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
          },
          {
            path: `${import.meta.env.BASE_URL}item-management/item`,
            title: "Item",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
          },
        ],
      },
    ],
  },
  {
    title: "House Keeping",
    icon: (
      <MapsHomeWorkOutlinedIcon className="bx bx-layer side-menu__icon"></MapsHomeWorkOutlinedIcon>
    ),
    type: "sub",
    selected: false,
    dirchange: false,
    active: false,
    children: [
      {
        path: `${import.meta.env.BASE_URL}house-keeping/hk-item-purchase`,
        title: "HK Item Purchase",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}house-keeping/hk-purchase-return`,
        title: "HK Purchase Return",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}house-keeping/house-keeping-used`,
        title: "House Keeping Used",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}house-keeping/hk-purchase-record`,
        title: "HK Purchase Record",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },

      {
        path: `${
          import.meta.env.BASE_URL
        }house-keeping/hk-purchase-return-record`,
        title: "HK Purchase Return Record",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },

      {
        path: `${
          import.meta.env.BASE_URL
        }house-keeping/house-keeping-used-record`,
        title: "House Keeping Used Record",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },

      {
        path: `${import.meta.env.BASE_URL}house-keeping/house-keeping-unit`,
        title: "House Keeping Unit",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}house-keeping/house-keeping-category`,
        title: "House Keeping Category",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}house-keeping/house-keeping-item`,
        title: "House Keeping Item",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}house-keeping-purchase/supplier`,
        title: "Supplier",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
    ],
  },
  {
    title: "Premium Service",
    icon: (
      <DesignServicesOutlinedIcon className="bx bx-layer side-menu__icon"></DesignServicesOutlinedIcon>
    ),
    type: "sub",
    selected: false,
    dirchange: false,
    active: false,
    children: [
      {
        path: `${import.meta.env.BASE_URL}premium-service/service-entry`,
        title: "Service Entry",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}premium-service/service-expense`,
        title: "Service Expense",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}premium-service/service-record`,
        title: "Service Record",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },

      {
        path: `${
          import.meta.env.BASE_URL
        }premium-service/service-expense-record`,
        title: "Service Expense Record",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}premium-service/service-name-entry`,
        title: "Service Name Entry",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}premium-service/expense-name-entry`,
        title: "Expense Name Entry",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}premium-service/customer-entry`,
        title: "Customer Entry",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}premium-service/supplier`,
        title: "Supplier",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
    ],
  },
  {
    title: "Accounts",
    icon: (
      <CalculateOutlinedIcon className="bx bx-layer side-menu__icon"></CalculateOutlinedIcon>
    ),
    type: "sub",
    selected: false,
    dirchange: false,
    active: false,
    children: [
      {
        path: `${import.meta.env.BASE_URL}accounts/guest-payment-receipt`,
        title: "Guest Payment Receipt",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },

      {
        path: `${import.meta.env.BASE_URL}accounts/customer-transaction`,
        title: "Customer Transaction",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}accounts/supplier-transaction`,
        title: "Supplier Transaction",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}accounts/expense-entry`,
        title: "Expense Entry",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}accounts/contra`,
        title: "Contra",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },

      {
        path: `${import.meta.env.BASE_URL}accounts/expense-Head-entry`,
        title: "Expense Head Entry",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}accounts/account-entry`,
        title: "Account Entry",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
    ],
  },

  {
    title: "Payroll",
    icon: (
      <AddCardOutlinedIcon className="bx bx-layer side-menu__icon"></AddCardOutlinedIcon>
    ),
    type: "sub",
    selected: false,
    dirchange: false,
    active: false,
    children: [
      {
        path: `${import.meta.env.BASE_URL}payroll/employee-payment`,
        title: "Employee Payment",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}payroll/employee`,
        title: "Employee",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },

      {
        path: `${import.meta.env.BASE_URL}payroll/department`,
        title: "Department",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}payroll/salary-payable-report`,
        title: "Salary Payable Report",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
    ],
  },

  {
    title: "Inventory",
    icon: (
      <Inventory2OutlinedIcon className="bx bx-layer side-menu__icon"></Inventory2OutlinedIcon>
    ),
    type: "sub",
    selected: false,
    dirchange: false,
    active: false,
    children: [
      {
        path: `${import.meta.env.BASE_URL}inventory/item-stock-report`,
        title: "Item Stock Report",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}inventory/bar-item-stock-report`,
        title: "Bar Item Stock Report",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}inventory/house-keeping-stock`,
        title: "House Keeping Stock",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
    ],
  },

  {
    title: "Reports",
    icon: (
      <AssessmentOutlinedIcon className="bx bx-layer side-menu__icon"></AssessmentOutlinedIcon>
    ),
    type: "sub",
    selected: false,
    dirchange: false,
    active: false,
    children: [
      {
        path: `${import.meta.env.BASE_URL}reports/cash-bank-balance`,
        title: "Cash Bank Balance",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}reports/cash-bank-ledger`,
        title: "Cash Bank Ledger",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}reports/daily-ledger`,
        title: "Daily Ledger",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}reports/customer-balance`,
        title: "Customer Balance",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}reports/supplier-balance`,
        title: "Supplier Balance",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },

      {
        path: `${import.meta.env.BASE_URL}reports/guest-balance`,
        title: "Guest Balance",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },

      {
        path: `${import.meta.env.BASE_URL}reports/balance-sheet`,
        title: "Balance Sheet",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}reports/profit-loss`,
        title: "Profit Loss",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}reports/loan-balance`,
        title: "Loan Balance",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}reports/capital-balance`,
        title: "Capital Balance",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}reports/fixed-asset-balance`,
        title: "Fixed Asset Balance",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}reports/expense-balance`,
        title: "Expense Balance",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}reports/payroll-balance`,
        title: "Payroll Balance",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}reports/service-expense-balance`,
        title: "Service Expense Balance",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}reports/house-keeping-used-balance`,
        title: "House keeping Used Balance",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },

    
      {
        path: `${import.meta.env.BASE_URL}reports/customer-ledger`,
        title: "Customer Ledger",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}reports/supplier-ledger`,
        title: "Supplier Ledger",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}reports/guest-ledger`,
        title: "Guest Ledger",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
   

      {
        path: `${import.meta.env.BASE_URL}reports/expense-record`,
        title: "Expense Record",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
    ],
  },

  {
    title: "Settings",
    icon: (
      <SettingsOutlinedIcon className="bx bx-layer side-menu__icon"></SettingsOutlinedIcon>
    ),
    type: "sub",
    selected: false,
    dirchange: false,
    active: false,
    children: [
      {
        path: `${import.meta.env.BASE_URL}hotel-management/branch-manage`,
        title: "Branch Manage",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}company-profile`,
        title: "Company Profile",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: `${import.meta.env.BASE_URL}user-manage`,
        title: "User Manage",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
    ],
  },
];

const permittedMenus = permissions();

const filterMenus = (menuList, permitted) => {
  return menuList
    .map((menu) => {
      if (menu.children && menu.children.length > 0) {
        // Recursively filter children
        const filteredChildren = filterMenus(menu.children, permitted);
        return { ...menu, children: filteredChildren };
      }
      return menu;
    })
    .filter(
      (menu) =>
        permitted.includes(menu.title?.toLowerCase()) ||
        (menu.children && menu.children.length > 0)
    );
};

const MENUITEMS = filterMenus(menus, permittedMenus);

export default MENUITEMS;
