import { Fragment, useContext, useEffect, useState } from "react";
import Modalsearch from "../modalsearch/modalsearch";
import product1 from "../../../assets/images/ecommerce/jpg/1.jpg";
import product3 from "../../../assets/images/ecommerce/jpg/3.jpg";
import product5 from "../../../assets/images/ecommerce/jpg/5.jpg";
import product4 from "../../../assets/images/ecommerce/jpg/4.jpg";
import product6 from "../../../assets/images/ecommerce/jpg/6.jpg";
import profilePic from "../../../assets/images/brand-logos/logo.png";
import { Link } from "react-router-dom";
import store from "../../../redux/store";
import { connect } from "react-redux";
import { ThemeChanger } from "../../../redux/action";
import us from "../../../assets/images/flags/us_flag.jpg";
import figma from "../../../assets/images/apps/figma.png";
import desktoplogo from "../../../assets/images/brand-logos/desktop-logo.png";
import togglelogo from "../../../assets/images/brand-logos/desktop-dark.png";
import desktopdark from "../../../assets/images/brand-logos/desktop-dark.png";
import toggledark from "../../../assets/images/brand-logos/toggle-dark.png";
import desktopwhite from "../../../assets/images/brand-logos/desktop-white.png";
import togglewhite from "../../../assets/images/brand-logos/toggle-white.png";
import { auth, authHeaders } from "../../../../utils";
import { API_URL } from "../../../../config.json";
import axios from "axios";
import { AuthContext } from "../../../context/AuthProvider";

const Header = ({ local_varaiable, ThemeChanger }) => {
  //Fullscvreen
  const [fullScreen, setFullScreen] = useState(false);

  const toggleFullScreen = () => {
    const elem = document.documentElement;

    if (!document.fullscreenElement) {
      elem.requestFullscreen().then(() => setFullScreen(true));
    } else {
      document.exitFullscreen().then(() => setFullScreen(false));
    }
  };

  const handleFullscreenChange = () => {
    setFullScreen(!!document.fullscreenElement);
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);
  //
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  const cartProduct = [
    {
      id: 1,
      src: product1,
      name: "SomeThing Phone",
      price: "$1,299.00",
      color: "Metallic Blue",
      text: "6gb Ram",
      class: "",
    },
    {
      id: 2,
      src: product3,
      name: "Stop Watch",
      price: "$179.29",
      color: "Analog",
      text: "Free shipping",
      class:
        "font-[600] py-[0.25rem] px-[0.45rem] rounded-[0.25rem] bg-pink/10 text-pink text-[0.625rem]",
    },
    {
      id: 3,
      src: product5,
      name: "Photo Frame",
      price: "$29.00",
      color: "Decorative",
      text: "",
      class: "",
    },
    {
      id: 4,
      src: product4,
      name: "Kikon Camera",
      price: "$4,999.00",
      color: "Black",
      text: "50MM",
      class: "",
    },
    {
      id: 5,
      src: product6,
      name: "Canvas Shoes",
      price: "$129.00",
      color: "Gray",
      text: "Sports",
      class: "",
    },
  ];
  const [cartItems, setCartItems] = useState([...cartProduct]);
  const [cartItemCount, setCartItemCount] = useState(cartProduct.length);

  const logout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const handleRemove = (e, itemId) => {
    e.stopPropagation(); // Prevents the event from reaching the button click event
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
    setCartItemCount(updatedCart.length);
  };

  function menuClose() {
    const theme = store.getState();
    if (window.innerWidth <= 992) {
      ThemeChanger({ ...theme, toggled: "close" });
    }
    if (window.innerWidth >= 992) {
      ThemeChanger({
        ...theme,
        toggled: local_varaiable.toggled ? local_varaiable.toggled : "",
      });
    }
  }
  const { sideDashTextToggleSet, sideDashTextToggle } = useContext(AuthContext);

  const toggleSidebar = () => {
    sideDashTextToggleSet(!sideDashTextToggle)
    const theme = store.getState();
    let sidemenuType = theme.dataNavLayout;
    if (window.innerWidth >= 992) {
      if (sidemenuType === "vertical") {
        let verticalStyle = theme.dataVerticalStyle;
        const navStyle = theme.dataNavStyle;
        switch (verticalStyle) {
          // closed
          case "closed":
            ThemeChanger({ ...theme, dataNavStyle: "" });
            if (theme.toggled === "close-menu-close") {
              ThemeChanger({ ...theme, toggled: "" });
            } else {
              ThemeChanger({ ...theme, toggled: "close-menu-close" });
            }
            break;
          // icon-overlay
          case "overlay":
            ThemeChanger({ ...theme, dataNavStyle: "" });
            if (theme.toggled === "icon-overlay-close") {
              ThemeChanger({ ...theme, toggled: "" });
            } else {
              if (window.innerWidth >= 992) {
                ThemeChanger({ ...theme, toggled: "icon-overlay-close" });
              }
            }
            break;
          // icon-text
          case "icontext":
            ThemeChanger({ ...theme, dataNavStyle: "" });
            if (theme.toggled === "icon-text-close") {
              ThemeChanger({ ...theme, toggled: "" });
            } else {
              ThemeChanger({ ...theme, toggled: "icon-text-close" });
            }
            break;
          // doublemenu
          case "doublemenu":
            ThemeChanger({ ...theme, dataNavStyle: "" });
            if (theme.toggled === "double-menu-open") {
              ThemeChanger({ ...theme, toggled: "double-menu-close" });
            } else {
              let sidemenu = document.querySelector(".side-menu__item.active");
              if (sidemenu) {
                ThemeChanger({ ...theme, toggled: "double-menu-open" });
                if (sidemenu.nextElementSibling) {
                  sidemenu.nextElementSibling.classList.add(
                    "double-menu-active"
                  );
                } else {
                  ThemeChanger({ ...theme, toggled: "double-menu-close" });
                }
              }
            }

            // doublemenu(ThemeChanger);
            break;
          // detached
          case "detached":
            if (theme.toggled === "detached-close") {
              ThemeChanger({ ...theme, toggled: "" });
            } else {
              ThemeChanger({ ...theme, toggled: "detached-close" });
            }
            break;

          // default
          case "default":
            ThemeChanger({ ...theme, toggled: "" });
        }
        switch (navStyle) {
          case "menu-click":
            if (theme.toggled === "menu-click-closed") {
              ThemeChanger({ ...theme, toggled: "" });
            } else {
              ThemeChanger({ ...theme, toggled: "menu-click-closed" });
            }
            break;
          // icon-overlay
          case "menu-hover":
            if (theme.toggled === "menu-hover-closed") {
              ThemeChanger({ ...theme, toggled: "" });
            } else {
              ThemeChanger({ ...theme, toggled: "menu-hover-closed" });
            }
            break;
          case "icon-click":
            if (theme.toggled === "icon-click-closed") {
              ThemeChanger({ ...theme, toggled: "" });
            } else {
              ThemeChanger({ ...theme, toggled: "icon-click-closed" });
            }
            break;

          case "icon-hover":
            if (theme.toggled === "icon-hover-closed") {
              ThemeChanger({ ...theme, toggled: "" });
            } else {
              ThemeChanger({ ...theme, toggled: "icon-hover-closed" });
            }
            break;
        }
      }
    } else {
      if (theme.toggled === "close") {
        ThemeChanger({ ...theme, toggled: "open" });

        setTimeout(() => {
          if (theme.toggled == "open") {
            const overlay = document.querySelector("#responsive-overlay");

            if (overlay) {
              overlay.classList.add("active");
              overlay.addEventListener("click", () => {
                const overlay = document.querySelector("#responsive-overlay");

                if (overlay) {
                  overlay.classList.remove("active");
                  menuClose();
                }
              });
            }
          }

          window.addEventListener("resize", () => {
            if (window.screen.width >= 992) {
              const overlay = document.querySelector("#responsive-overlay");

              if (overlay) {
                overlay.classList.remove("active");
              }
            }
          });
        }, 100);
      } else {
        ThemeChanger({ ...theme, toggled: "close" });
      }
    }
  };
  // const ToggleDark = () => {
  //   ThemeChanger({
  //     ...local_varaiable,
  //     class: local_varaiable.class == "dark" ? "light" : "dark",
  //     dataHeaderStyles: local_varaiable.class == "dark" ? "light" : "dark",
  //     dataMenuStyles:
  //       local_varaiable.dataNavLayout == "horizontal"
  //         ? local_varaiable.class == "dark"
  //           ? "light"
  //           : "dark"
  //         : "dark",
  //   });
  //   const theme = store.getState();

  //   if (theme.class != "dark") {
  //     ThemeChanger({
  //       ...theme,
  //       bodyBg: "",
  //       Light: "",
  //       darkBg: "",
  //       inputBorder: "",
  //     });
  //     localStorage.setItem("ynexlighttheme", "light");
  //     localStorage.removeItem("ynexdarktheme");
  //     localStorage.removeItem("ynexMenu");
  //     localStorage.removeItem("ynexHeader");
  //   } else {
  //     localStorage.setItem("ynexdarktheme", "dark");
  //     localStorage.removeItem("ynexlighttheme");
  //     localStorage.removeItem("ynexMenu");
  //     localStorage.removeItem("ynexHeader");
  //   }
  // };

  const [companyProfileData, companyProfileDataSet] = useState(null);

  useEffect(() => {
    getCompanyProfileData();
  }, []);

  const getCompanyProfileData = async () => {
    const response = await axios.get(`${API_URL}api/v1/CompanyProfile`, {
      headers: authHeaders,
    });
    companyProfileDataSet(response.data);
  };


  return (
    <Fragment>
      <header className="app-header">
        <nav className="main-header !h-[3.75rem]" aria-label="Global">
          <div className="main-header-container ps-[0.725rem] pe-[1rem] ">
            <div className="header-content-left">
              <div className="header-element">
                <div className="horizontal-logo">
                  <a
                    href={`${import.meta.env.BASE_URL}dashboards/crm/`}
                    className="header-logo"
                  >
                    <img
                      src={desktoplogo}
                      alt="logo"
                      className="desktop-logo"
                    />
                    <img src={togglelogo} alt="logo" className="toggle-logo" />
                    <img
                      src={desktopdark}
                      alt="logo"
                      className="desktop-dark"
                    />
                    {/* <img src={toggledark} alt="logo" className="toggle-dark" /> */}
                    <img
                      src={desktopwhite}
                      alt="logo"
                      className="desktop-white"
                    />
                    <img
                      src={togglewhite}
                      alt="logo"
                      className="toggle-white"
                    />
                  </a>
                </div>
              </div>
              <div
                className="header-element md:px-[0.325rem] !items-center"
                onClick={() => toggleSidebar()}
              >
                <Link
                  aria-label="Hide Sidebar"
                  className="sidemenu-toggle animated-arrow  hor-toggle horizontal-navtoggle inline-flex items-center"
                  to="#"
                >
                  <span></span>
                </Link>
              </div>
            </div>

            <div className="header-content-right">
              {/* <div className="header-element py-[1rem] md:px-[0.65rem] px-2 header-search">
                <button aria-label="button" type="button" data-hs-overlay="#search-modal"
                  className="inline-flex flex-shrink-0 justify-center items-center gap-2  rounded-full font-medium focus:ring-offset-0 focus:ring-offset-white transition-all text-xs dark:bg-bgdark dark:hover:bg-black/20 dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10">
                  <i className="bx bx-search-alt-2 header-link-icon"></i>
                </button>
              </div> */}

              {/* <div className="header-element py-[1rem] md:px-[0.65rem] px-2  header-country hs-dropdown ti-dropdown  hidden sm:block [--placement:bottom-left]">
                <button id="dropdown-flag" type="button"
                  className="hs-dropdown-toggle ti-dropdown-toggle !p-0 flex-shrink-0  !border-0 !rounded-full !shadow-none">
                  <img src={us} alt="flag-img" className="h-[1.25rem] w-[1.25rem] rounded-full" />
                </button>

                <div className="hs-dropdown-menu ti-dropdown-menu min-w-[10rem] hidden !-mt-3" aria-labelledby="dropdown-flag">
                  <div className="ti-dropdown-divider divide-y divide-gray-200 dark:divide-white/10">
                    <div className="py-2 first:pt-0 last:pb-0">
                      <div className="ti-dropdown-item !p-[0.65rem] ">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse w-full">
                          <div className="h-[1.375rem] flex items-center w-[1.375rem] rounded-full">
                            <img src={us} alt="flag-img"
                              className="h-[1rem] w-[1rem] rounded-full" />
                          </div>
                          <div>
                            <p className="!text-[0.8125rem] font-medium">
                              English
                            </p>
                          </div>
                        </div>
                      </div>
                     
                 
                    </div>
                  </div>
                </div>
              </div> */}
              <div
                style={{ display: "none" }}
                className="header-element  header-theme-mode hidden !items-center sm:block !py-[1rem] md:!px-[0.65rem] px-2"
                // onClick={() => ToggleDark()}
              >
                <Link
                  aria-label="anchor"
                  className="hs-dark-mode-active:hidden flex hs-dark-mode group flex-shrink-0 justify-center items-center gap-2  rounded-full font-medium transition-all text-xs dark:bg-bgdark dark:hover:bg-black/20 dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                  to="#"
                  data-hs-theme-click-value="dark"
                >
                  <i className="bx bx-moon header-link-icon"></i>
                </Link>
                <Link
                  aria-label="anchor"
                  className="hs-dark-mode-active:flex hidden hs-dark-mode group flex-shrink-0 justify-center items-center gap-2 
             rounded-full font-medium text-defaulttextcolor  transition-all text-xs dark:bg-bodybg dark:bg-bgdark dark:hover:bg-black/20 dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                  to="#"
                  data-hs-theme-click-value="light"
                >
                  <i className="bx bx-sun header-link-icon"></i>
                </Link>
              </div>

              {/* <div className="header-element header-apps dark:text-[#8c9097] dark:text-white/50 py-[1rem] md:px-[0.65rem] px-2 hs-dropdown ti-dropdown md:!block !hidden [--placement:bottom-left]">

                <button aria-label="button" id="dropdown-apps" type="button"
                  className="hs-dropdown-toggle ti-dropdown-toggle !p-0 !border-0 flex-shrink-0  !rounded-full !shadow-none text-xs">
                  <i className="bx bx-grid-alt header-link-icon text-[1.125rem]"></i>
                </button>

                <div
                  className="main-header-dropdown !-mt-3 hs-dropdown-menu ti-dropdown-menu !w-[22rem] border-0 border-defaultborder   hidden"
                  aria-labelledby="dropdown-apps">

                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="mb-0 text-defaulttextcolor text-[1.0625rem] dark:text-[#8c9097] dark:text-white/50 font-semibold">Modules</p>
                    </div>
                  </div>
                  <div className="dropdown-divider mb-0"></div>
                  <div className="ti-dropdown-divider divide-y divide-gray-200 dark:divide-white/10 main-header-shortcuts p-2" id="header-shortcut-scroll">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="">
                        <a href="#" className="p-4 items-center related-app block text-center rounded-sm hover:bg-gray-50 dark:hover:bg-black/20">
                          <div>
                            <img src={figma} alt="figma"
                              className="!h-[1.75rem] !w-[1.75rem] text-2xl avatar text-primary flex justify-center items-center mx-auto" />
                            <div className="text-[0.75rem] text-defaulttextcolor dark:text-[#8c9097] dark:text-white/50">Apartment Management</div>
                          </div>
                        </a>
                      </div>
                     
                    
                    </div>
                  </div>
                  <div className="p-4 first:pt-0 border-t">
                    <a className="w-full ti-btn ti-btn-primary-full p-2 !m-0" href="#">
                      View All
                    </a>
                  </div>

                </div>
              </div> */}
              <div className="header-element header-fullscreen py-[1rem] md:px-[0.65rem] px-2">
                <Link
                  to="#"
                  aria-label="anchor"
                  onClick={toggleFullScreen}
                  className="inline-flex flex-shrink-0 justify-center items-center gap-2  !rounded-full font-medium dark:hover:bg-black/20 dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                >
                  {fullScreen ? (
                    <i className="bx bx-exit-fullscreen full-screen-close header-link-icon"></i>
                  ) : (
                    <i className="bx bx-fullscreen full-screen-open header-link-icon"></i>
                  )}
                </Link>
              </div>
              <div className="header-element md:!px-[0.65rem] px-2 hs-dropdown !items-center ti-dropdown [--placement:bottom-left]">
                <button
                  id="dropdown-profile"
                  type="button"
                  className="hs-dropdown-toggle ti-dropdown-toggle !gap-2 !p-0 flex-shrink-0 sm:me-2 me-0 !rounded-full !shadow-none text-xs align-middle !border-0 !shadow-transparent "
                >
                  {companyProfileData != null && companyProfileData.logo !== "" ? (
                    <img
                      className="inline-block rounded-full "
                      src={`${API_URL}${companyProfileData?.logo}`}
                      width="32"
                      height="32"
                      alt="Image Description"
                    />
                  ) : (
                    <img
                      className="inline-block rounded-full "
                      src={profilePic}
                      width="32"
                      height="32"
                      alt="Image Description"
                    />
                  )}
                </button>
                <div className="md:block hidden dropdown-profile cursor-pointer">
                  <p className="font-semibold mb-0 leading-none text-[#536485] text-[0.813rem] ">
                    {auth.userName}
                  </p>
                </div>
                <div
                  className="hs-dropdown-menu ti-dropdown-menu !-mt-3 border-0 w-[11rem] !p-0 border-defaultborder hidden main-header-dropdown  pt-0 overflow-hidden header-profile-dropdown dropdown-menu-end"
                  aria-labelledby="dropdown-profile"
                >
                  <ul className="text-defaulttextcolor font-medium dark:text-[#8c9097] dark:text-white/50">
                    <li>
                      <Link
                        to={`/user-manage`}
                        className="w-full ti-dropdown-item !text-[0.8125rem] !gap-x-0 !p-[0.65rem] !inline-flex"
                      >
                        <i className="ti ti-adjustments-horizontal text-[1.125rem] me-2 opacity-[0.7]"></i>
                        Settings
                      </Link>
                    </li>

                    <li>
                      <Link
                        onClick={() => logout()}
                        className="w-full ti-dropdown-item !text-[0.8125rem] !p-[0.65rem] !gap-x-0 !inline-flex"
                        to="#"
                      >
                        <i className="ti ti-logout text-[1.125rem] me-2 opacity-[0.7]"></i>
                        Log Out
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              {/* <div className="header-element md:px-[0.48rem]">
                <button aria-label="button" type="button"
                  className="hs-dropdown-toggle switcher-icon inline-flex flex-shrink-0 justify-center items-center gap-2  rounded-full font-medium  align-middle transition-all text-xs dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                  data-hs-overlay="#hs-overlay-switcher">
                  <i className="bx bx-cog header-link-icon animate-spin-slow"></i>
                </button>
              </div> */}
            </div>
          </div>
        </nav>
      </header>
      <Modalsearch />
    </Fragment>
  );
};
const mapStateToProps = (state) => ({
  local_varaiable: state,
});
export default connect(mapStateToProps, { ThemeChanger })(Header);
