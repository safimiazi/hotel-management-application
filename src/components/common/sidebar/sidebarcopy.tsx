// import { FC, Fragment, useEffect, useRef, useState } from 'react';
// import { connect } from 'react-redux';
// import { Link, useLocation } from 'react-router-dom';
// import { MENUITEMS } from './sidemenu/sidemenu';
// import { ThemeChanger } from '../../../redux/action';
// import store from '../../../redux/store';
// import logo1 from "../../../assets/images/brand-logos/desktop-logo.png";
// import logo2 from "../../../assets/images/brand-logos/toggle-logo.png";
// import logo3 from "../../../assets/images/brand-logos/desktop-dark.png";
// import logo4 from "../../../assets/images/brand-logos/toggle-dark.png";
// import logo5 from "../../../assets/images/brand-logos/desktop-white.png";
// import logo6 from "../../../assets/images/brand-logos/toggle-white.png";
// import RSC from "react-scrollbars-custom";
// import Menuloop from './menuloop';
// interface SidebarProps { }
// const history: any = [];
// const Sidebar: FC<SidebarProps> = ({ local_varaiable, ThemeChanger }: any) => {
//   const [menuitems, setMenuitems] = useState<any>(MENUITEMS);
//   function closeMenuFn() {
//     menuitems.Items.filter((items: any) => {
//       items.active = false;
//       if (items.children) {
//         items.children.map((firstLevel: any) => {
//           firstLevel.active = false;
//           if (firstLevel.children) {
//             firstLevel.children.map((secondLevel: any) => {
//               secondLevel.active = false;
//             })
//           }
//         })
//       }
//     })
//   }
//   useEffect(() => {

//     const mainContent = document.querySelector(".main-content");
//     if (window.innerWidth <= 992) {
//       if (mainContent) {
//         const theme = store.getState();
//         ThemeChanger({ ...theme, toggled: "close" });

//       }
//       else if (document.documentElement.getAttribute('data-nav-layout') == 'horizontal') {
//         console.log("horizontal");

//         closeMenuFn();
//       }
//     }

//     window.addEventListener('resize', menuResizeFn);
//   }, []);

//   const location = useLocation();
//   // const [menuitems, setMenuitems] = useState<any>(MENUITEMS);

//   useEffect(() => {
//     history.push(location.pathname); // add  history to history  stack for current location.pathname to prevent multiple history calls innerWidth  and innerWidth  calls from  multiple users. This is important because the history stack is not always empty when the user clicks  the history
//     if (history.length > 2) {
//       history.shift();
//     }
//     if (history[0] !== history[1]) {
//       setSidemenu();
//     }
//     const mainContent = document.querySelector(".main-content");
//     // console.log(local_varaiable);

//     //when we click on the body to remove
//     mainContent!.addEventListener("click", mainContentClickFn);
//     return () => {
//       mainContent!.removeEventListener("click", mainContentClickFn);
//     };

//   }, [location, setSidemenu, mainContentClickFn]);

//   // location
//   useEffect(() => {
//     if (document.body.classList.contains('horizontal') && window.innerWidth >= 992) {
//       clearMenuActive();
//     }
//   }, []);
//   //  In Horizontal When we click the body it should we Closed using in useEfffect Refer line No:16
//   function mainContentClickFn() {
//     if (document.body.classList.contains('horizontal') && window.innerWidth >= 992) {
//       clearMenuActive();
//     }
//   }

//   function clearMenuActive() {
//     MENUITEMS.filter((mainlevel) => {
//       // if (mainlevel.Items) {
//       //   mainlevel.Items.map((sublevel: any) => {
//       //     sublevel.active = false;
//       //     if (sublevel.children) {
//       //       sublevel.children.map((sublevel1: any) => {
//       //         sublevel1.active = false;
//       //         if (sublevel1.children) {
//       //           sublevel1.children.map((sublevel2: any) => {
//       //             sublevel2.active = false;
//       //             return sublevel2;
//       //           });
//       //         }
//       //         return sublevel1;
//       //       });
//       //     }
//       //     return sublevel;
//       //   });
//       // }
//       return mainlevel;
//     });
//     setMenuitems((arr: any) => [...arr]);
//   }

//   // function toggleSidemenu(item: any) {
//     // const theme = store.getState();

//     // if (
//     //   !document.body.classList.contains("horizontal-hover") ||
//     //   window.innerWidth < 992
//     // ) {
//     //   // if (theme.dataNavStyle != "icon-hover" && theme.dataNavStyle != "menu-hover") {
//     //   if (!item.active) {
//     //     MENUITEMS.map((mainlevel) => {
//     //       if (mainlevel.Items) {
//     //         mainlevel.Items.map(sublevel => {
//     //           sublevel.active = false;
//     //           if (item === sublevel) {
//     //             sublevel.active = true;
//     //           }
//     //           if (sublevel.children) {
//     //             sublevel.children.map((sublevel1: any) => {
//     //               sublevel1.active = false;
//     //               if (item === sublevel1) {
//     //                 sublevel.active = true;
//     //                 sublevel1.active = true;
//     //               }
//     //               if (sublevel1.children) {
//     //                 sublevel1.children.map((sublevel2: any) => {
//     //                   sublevel2.active = false;
//     //                   if (item === sublevel2) {
//     //                     sublevel.active = true;
//     //                     sublevel1.active = true;
//     //                     sublevel2.active = true;
//     //                   }
//     //                   if (sublevel2.children) {
//     //                     sublevel2.children.map((sublevel3: any) => {
//     //                       sublevel3.active = false;
//     //                       if (item === sublevel3) {
//     //                         sublevel.active = true;
//     //                         sublevel1.active = true;
//     //                         sublevel2.active = true;
//     //                         sublevel3.active = true;
//     //                       }
//     //                       return sublevel2;
//     //                     });
//     //                   }
//     //                   return sublevel2;
//     //                 });
//     //               }
//     //               return sublevel1;
//     //             });
//     //           }
//     //           return sublevel;
//     //         });
//     //       }
//     //       return mainlevel;
//     //     });
//     //   }
//     //   else {
//     //     if (localStorage.ynexverticalstyles != 'doublemenu') {
//     //       item.active = !item.active;
//     //     }
//     //     // item.active = !item.active;
//     //   }
//     //   // }
//     // }

//     // if (localStorage.ynexverticalstyles === 'doublemenu' && theme.toggled !== 'double-menu-open') {
//     //   // if (!document.querySelectorAll(".main-menu .slide.active")[0].querySelector('ul')) {
//     //   ThemeChanger({ ...theme, "toggled": "double-menu-open" });
//     //   // }
//     // }
//     // setMenuitems((arr: any) => [...arr]);
//   // }

//   function Onhover() {
//     console.log("onhover")
//     const theme = store.getState();
//     if ((theme.toggled == 'icon-overlay-close' || theme.toggled == 'detached-close') && theme.iconOverlay != 'open') {
//       ThemeChanger({ ...theme, "iconOverlay": "open" });
//     }
//   }
//   function Outhover() {
//     console.log("outhover")
//     const theme = store.getState();
//     if ((theme.toggled == 'icon-overlay-close' || theme.toggled == 'detached-close') && theme.iconOverlay == 'open') {
//       ThemeChanger({ ...theme, "iconOverlay": "" });
//     }
//   }
//   function Clickhandelar() {
//     console.log("click");

//     if (localStorage.getItem("ynexverticalstyles") == "icontext") {
//       ThemeChanger({ ...local_varaiable, "iconText": "open" });
//     }

//   }
//   function menuClose() {

//     const theme = store.getState();
//     if (window.innerWidth <= 992) {
//       ThemeChanger({ ...theme, toggled: "close" });
//     }
//     const overlayElement = document.querySelector("#responsive-overlay") as HTMLElement | null;
//     if (overlayElement) {

//       overlayElement.classList.remove("active");
//     }
//   }
//   // useEffect(() => {

//   //   // const mainContent = document.querySelector(".main-content");
//   //   // if (window.innerWidth <= 992) {
//   //   //   if (mainContent) {
//   //   //     mainContent.addEventListener("click", menuClose);
//   //   //     menuClose();
//   //   //   }
//   //   // } else {
//   //   //   if (mainContent) {
//   //   //     mainContent.removeEventListener("click", menuClose);
//   //   //   }
//   //   // }
//   //   // window.addEventListener("resize", () => {
//   //   //   const mainContent = document.querySelector(".main-content");
//   //   //   setTimeout(() => {
//   //   //     if (window.innerWidth <= 992) {
//   //   //       if (mainContent) {
//   //   //         mainContent.addEventListener("click", menuClose);
//   //   //         menuClose();
//   //   //       }
//   //   //     } else {
//   //   //       if (mainContent) {
//   //   //         mainContent.removeEventListener("click", menuClose);
//   //   //         // menuClose();
//   //   //       }
//   //   //     }
//   //   //   }, 100);
//   //   // });
//   //   window.addEventListener('resize', menuResizeFn);
//   //   // console.log("aaa")
//   // }, []);


//   const WindowPreSize = [window.innerWidth]

//   function menuResizeFn() {
//     // console.log("presize");

//     WindowPreSize.push(window.innerWidth);
//     if (WindowPreSize.length > 2) { WindowPreSize.shift() }
//     const theme = store.getState();
//     if (WindowPreSize.length > 1) {
//       if ((WindowPreSize[WindowPreSize.length - 1] < 992) && (WindowPreSize[WindowPreSize.length - 2] >= 992)) {
//         // less than 992;
//         ThemeChanger({ ...theme, toggled: "close" });
//       }

//       if ((WindowPreSize[WindowPreSize.length - 1] >= 992) && (WindowPreSize[WindowPreSize.length - 2] < 992)) {
//         // greater than 992
//         ThemeChanger({ ...theme, toggled: theme.dataVerticalStyle == "doublemenu" ? "double-menu-open" : "" });
//       }
//     }
//   }

//   function setSidemenu(list?: any) {

//     let dd = list ? list.path + '/' : location.pathname;
//     if (menuitems) {
//       menuitems.filter((mainlevel: any) => {
//         // if (mainlevel.Items) {
//           // mainlevel.Items.filter((items: any) => {

//             // if (ulRef.current.href != document.location['href'] || localStorage.ynexverticalstyles != 'doublemenu') {
//             //   items.active = false;
//             // }
//             mainlevel.selected = false;

//             if (dd === '/test/ynex-ts/preview') {
//               dd = '/dashboards/crm/';
//             }
//             if (dd === mainlevel.path + '/') {
//               mainlevel.active = true;
//               mainlevel.selected = true;
//             }
//             if (mainlevel.children) {
//               mainlevel.children.filter((submenu: any) => {
//                 submenu.active = false;
//                 submenu.selected = false;
//                 if (dd === submenu.path + '/') {
//                   const theme = store.getState();
//                   mainlevel.active = theme.dataNavLayout == 'horizontal' || theme.dataNavStyle == 'icon-hover' ? false : true;
//                   mainlevel.selected = true;
//                   submenu.active = true;
//                   submenu.selected = true;
//                 }
//                 if (submenu.path === "#") {
//                   submenu.active = false;
//                   submenu.selected = false;
//                 }
//                 if (submenu.children) {
//                   submenu.children.filter((submenu1: any) => {
//                     submenu1.active = false;
//                     submenu1.selected = false;
//                     if (dd === submenu1.path + '/') {
//                       mainlevel.active = true;
//                       mainlevel.selected = true;
//                       submenu.active = true;
//                       submenu.selected = true;
//                       submenu1.active = true;
//                       submenu1.selected = true;
//                     }
//                     if (submenu1.path === "#") {
//                       submenu1.active = false;
//                       submenu1.selected = false;
//                     }
//                     return submenu1;
//                   });
//                 }
//                 return submenu;
//               });
//             }
//             return mainlevel;
//           // }
//           // );
//         // }
//         setMenuitems((arr: any) => [...arr]);
//         return mainlevel;
//       });
//     }

//     if (localStorage.getItem("ynexverticalstyles") == "icontext") {
//       // ThemeChanger({...local_varaiable,"iconText":"open"})
//     }
//     if (local_varaiable.dataVerticalStyle == "doublemenu") {
//       // ThemeChanger({...local_varaiable,"toggled":"double-menu-open"})
//     }
//   }

//   function switcherArrowFn(): void {

//     // Used to remove is-expanded class and remove class on clicking arrow buttons
//     function slideClick(): void {
//       const slide = document.querySelectorAll<HTMLElement>(".slide");
//       const slideMenu = document.querySelectorAll<HTMLElement>(".slide-menu");

//       slide.forEach((element) => {
//         if (element.classList.contains("is-expanded")) {
//           element.classList.remove("is-expanded");
//         }
//       });

//       slideMenu.forEach((element) => {
//         if (element.classList.contains("open")) {
//           element.classList.remove("open");
//           element.style.display = "none";
//         }
//       });
//     }

//     slideClick();
//   }

//   function slideRight(): void {
//     const menuNav = document.querySelector<HTMLElement>(".main-menu");
//     const mainContainer1 = document.querySelector<HTMLElement>(".main-sidebar");

//     if (menuNav && mainContainer1) {
//       const marginLeftValue = Math.ceil(
//         Number(window.getComputedStyle(menuNav).marginInlineStart.split("px")[0])
//       );
//       const marginRightValue = Math.ceil(
//         Number(window.getComputedStyle(menuNav).marginInlineEnd.split("px")[0])
//       );
//       const check = menuNav.scrollWidth - mainContainer1.offsetWidth;
//       let mainContainer1Width = mainContainer1.offsetWidth;

//       if (menuNav.scrollWidth > mainContainer1.offsetWidth) {
//         if (!(local_varaiable.dataVerticalStyle.dir === "rtl")) {
//           if (Math.abs(check) > Math.abs(marginLeftValue)) {
//             menuNav.style.marginInlineEnd = "0";

//             if (!(Math.abs(check) > Math.abs(marginLeftValue) + mainContainer1Width)) {
//               mainContainer1Width = Math.abs(check) - Math.abs(marginLeftValue);
//               const slideRightButton = document.querySelector<HTMLElement>("#slide-right");
//               if (slideRightButton) {
//                 slideRightButton.classList.add("hidden");
//               }
//             }

//             menuNav.style.marginInlineStart =
//               (Number(menuNav.style.marginInlineStart.split("px")[0]) -
//                 Math.abs(mainContainer1Width)) +
//               "px";

//             const slideRightButton = document.querySelector<HTMLElement>("#slide-right");
//             if (slideRightButton) {
//               slideRightButton.classList.remove("hidden");
//             }
//           }
//         } else {
//           if (Math.abs(check) > Math.abs(marginRightValue)) {
//             menuNav.style.marginInlineEnd = "0";

//             if (!(Math.abs(check) > Math.abs(marginRightValue) + mainContainer1Width)) {
//               mainContainer1Width = Math.abs(check) - Math.abs(marginRightValue);
//               const slideRightButton = document.querySelector<HTMLElement>("#slide-right");
//               if (slideRightButton) {
//                 slideRightButton.classList.add("hidden");
//               }
//             }

//             menuNav.style.marginInlineStart =
//               (Number(menuNav.style.marginInlineStart.split("px")[0]) -
//                 Math.abs(mainContainer1Width)) +
//               "px";

//             const slideLeftButton = document.querySelector<HTMLElement>("#slide-left");
//             if (slideLeftButton) {
//               slideLeftButton.classList.remove("hidden");
//             }
//           }
//         }
//       }

//       const element = document.querySelector<HTMLElement>(".main-menu > .slide.open");
//       const element1 = document.querySelector<HTMLElement>(".main-menu > .slide.open > ul");
//       if (element) {
//         element.classList.remove("active");
//       }
//       if (element1) {
//         element1.style.display = "none";
//       }
//     }

//     switcherArrowFn();
//   }

//   function slideLeft(): void {
//     const menuNav = document.querySelector<HTMLElement>(".main-menu");
//     const mainContainer1 = document.querySelector<HTMLElement>(".main-sidebar");

//     if (menuNav && mainContainer1) {
//       const marginLeftValue = Math.ceil(
//         Number(window.getComputedStyle(menuNav).marginInlineStart.split("px")[0])
//       );
//       const marginRightValue = Math.ceil(
//         Number(window.getComputedStyle(menuNav).marginInlineEnd.split("px")[0])
//       );
//       const check = menuNav.scrollWidth - mainContainer1.offsetWidth;
//       let mainContainer1Width = mainContainer1.offsetWidth;

//       if (menuNav.scrollWidth > mainContainer1.offsetWidth) {
//         if (!(local_varaiable.dataVerticalStyle.dir === "rtl")) {
//           if (Math.abs(check) <= Math.abs(marginLeftValue)) {
//             menuNav.style.marginInlineStart = "0px";
//           }
//         } else {
//           if (Math.abs(check) > Math.abs(marginRightValue)) {
//             menuNav.style.marginInlineStart = "0";

//             if (!(Math.abs(check) > Math.abs(marginRightValue) + mainContainer1Width)) {
//               mainContainer1Width = Math.abs(check) - Math.abs(marginRightValue);
//               const slideRightButton = document.querySelector<HTMLElement>("#slide-right");
//               if (slideRightButton) {
//                 slideRightButton.classList.add("hidden");
//               }
//             }

//             menuNav.style.marginInlineStart =
//               (Number(menuNav.style.marginInlineStart.split("px")[0]) -
//                 Math.abs(mainContainer1Width)) +
//               "px";

//             const slideLeftButton = document.querySelector<HTMLElement>("#slide-left");
//             if (slideLeftButton) {
//               slideLeftButton.classList.remove("hidden");
//             }
//           }
//         }
//       }

//       const element = document.querySelector<HTMLElement>(".main-menu > .slide.open");
//       const element1 = document.querySelector<HTMLElement>(".main-menu > .slide.open > ul");
//       if (element) {
//         element.classList.remove("active");
//       }
//       if (element1) {
//         element1.style.display = "none";
//       }
//     }

//     switcherArrowFn();
//   }
//   const noChild = () => {
//     if (localStorage.ynexverticalstyles == 'doublemenu') {
//       const theme = store.getState();
//       ThemeChanger({ ...theme, "toggled": "double-menu-close" });
//     }
//   };

//   const ulRef = useRef<any>(null);
//   const ulElement = useRef(null);

//   useEffect(() => {
//     if (localStorage.ynexverticalstyles != 'overlay' && localStorage.ynexverticalstyles != "detached") {
//       setSidemenu();
//     }
//   }, []);

//   const MenuOpen = (_event: any) => {
//     // console.log("Working");
//     const MainContent = document.querySelector(".main-content");

//     if (local_varaiable.dataVerticalStyle === 'icontext' && local_varaiable.iconText !== 'open') {
//       const theme = store.getState();
//       ThemeChanger({ ...theme, "iconText": "open" });

//       MainContent?.addEventListener("click", (_event) => {
//         const theme = store.getState();
//         ThemeChanger({ ...theme, "iconText": "" });
//       });
//     }

//     // const theme = store.getState();
//     // if (localStorage.ynexverticalstyles === 'doublemenu' && theme.toggled !== 'double-menu-open') {
//     //   ThemeChanger({ ...theme, "toggled": "double-menu-open" });
//     // }

//   };

//   const Topup = () => {
//     if (window.scrollY > 30 && document.querySelector(".app-sidebar")) {
//       const Scolls = document.querySelectorAll(".app-sidebar");
//       Scolls.forEach((e) => {
//         e.classList.add("sticky-pin");
//       });
//     } else {
//       const Scolls = document.querySelectorAll(".app-sidebar");
//       Scolls.forEach((e) => {
//         e.classList.remove("sticky-pin");
//       });
//     }
//   };
//   window.addEventListener("scroll", Topup);

// function togglesidemenu({event, targetObject}:any){
//   const theme = store.getState();
//   let element = event.target;
//   if (theme.dataNavStyle != "icon-hover" && theme.dataNavStyle != "menu-hover") {
//   MENUITEMS.map((item:any) => {
//     if (item === targetObject) {
//       // if (html.getAttribute('data-vertical-style') == 'doublemenu' && item.active) { return }
//       item.active = !item.active;
//       if (item.active) {
//           closeOtherMenus(MENUITEMS, item);
//       } else {
//           if (theme.dataVerticalStyle === "doublemenu") {
//             ThemeChanger({ ...theme, toggled: "double-menu-close" });
//           }
//       }
//       setAncestorsActive(MENUITEMS, item);
//      }
//      else if (!item.active) {
//       if (theme.dataVerticalStyle != "doublemenu") {
//           item.active = false; // Set active to false for items not matching the target
//       }
//      }
//      if (item.children && item.children.length > 0) {
//       togglesidemenu(item.children);
//   }

//     })
//     if (targetObject?.children && targetObject.active) {
//       if (theme.dataVerticalStyle == 'doublemenu' && theme.toggled != 'double-menu-open') {
//         ThemeChanger({ ...theme, toggled: "double-menu-open" });
//       }
//   }
//   if (element && theme.dataNavLayout == 'horizontal' && theme.dataNavStyle == 'menu-click' || theme.dataNavStyle  == 'icon-click') {
//       const listItem = element.closest("li");
//       if (listItem) {
//           // Find the first sibling <ul> element
//           const siblingUL = listItem.querySelector("ul");
//           let outterUlWidth = 0;
//           let listItemUL = listItem.closest('ul:not(.main-menu)');
//           while (listItemUL) {
//               listItemUL = listItemUL.parentElement.closest('ul:not(.main-menu)');
//               if (listItemUL) {
//                   outterUlWidth += listItemUL.clientWidth;
//               }
//           }
//           if (siblingUL) {
//               // You've found the sibling <ul> element
//               let siblingULRect = listItem.getBoundingClientRect();
//               if (theme.dir == 'rtl') {
//                   if ((siblingULRect.left - siblingULRect.width - outterUlWidth + 150 < 0 && outterUlWidth < window.innerWidth) && (outterUlWidth + siblingULRect.width + siblingULRect.width < window.innerWidth)) {
//                       targetObject.dirchange = true;
//                   } else {
//                       targetObject.dirchange = false;
//                   }
//               } else {
//                   if ((outterUlWidth + siblingULRect.right + siblingULRect.width + 50 > window.innerWidth && siblingULRect.right >= 0) && (outterUlWidth + siblingULRect.width + siblingULRect.width < window.innerWidth)) {
//                       targetObject.dirchange = true;
//                   } else {
//                       targetObject.dirchange = false;
//                   }
//               }
//           }
//           setTimeout(() => {
//               let computedValue = siblingUL.getBoundingClientRect();
//               if ((computedValue.bottom) > window.innerHeight) {
//                   siblingUL.style.height = (window.innerHeight - computedValue.top - 8) + 'px';
//                   siblingUL.style.overflow = 'auto';
//               }
//           }, 100);
//       }
//   }
//   }

// }



// function setAncestorsActive(MENUITEMS, targetObject) {
//   let html = document.documentElement;
//   const parent = findParent(MENUITEMS, targetObject);
//   if (parent) {
//       parent.active = true;
//       if (parent.active) {
//           html.setAttribute('data-toggled', 'double-menu-open');
//       }

//       setAncestorsActive(MENUITEMS, parent);
//   } else {
//       if (html.getAttribute('data-vertical-style') == 'doublemenu') {
//           html.setAttribute('data-toggled', 'double-menu-close');
//       }

//   }
// }
//  function  closeOtherMenus({MENUITEMS,targetObject}:any) {
//   // for (const item of MENUITEMS) {
//     MENUITEMS.map((item:any) => {
//       if (item !== targetObject) {
//           item.active = false;
//           if (item.children && item.children.length > 0) {
//               closeOtherMenus(item.children, targetObject);
//           }
//       }
//   })
    
// }
//  function findParent( targetObject) {
//   // for (const item of MENUITEMS) {
//     MENUITEMS.map((item:any) => {
//       if (item.children && item.children.includes(targetObject)) {
//           return item;
//       }
//       if (item.children && item.children.length > 0) {
//           const parent = findParent(item.children, targetObject);
//           if (parent) {
//               return parent;
//           }
//       }
//     })
//   // }
//   return null;
// }
//  const level = 0
//   return (
//     <Fragment>
//       <div id="responsive-overlay"
//         onClick={() => { menuClose() }}
//       ></div>
//       <aside className="app-sidebar" id="sidebar" onMouseEnter={() => Onhover()}
//         onMouseLeave={() => Outhover()}>

//         <div className="main-sidebar-header">
//           <a href={`${import.meta.env.BASE_URL}dashboards/crm/`} className="header-logo">
//             <img src={logo1} alt="logo" className="desktop-logo" />
//             <img src={logo2} alt="logo" className="toggle-logo" />
//             <img src={logo3} alt="logo" className="desktop-dark" />
//             <img src={logo4} alt="logo" className="toggle-dark" />
//             <img src={logo5} alt="logo" className="desktop-white" />
//             <img src={logo6} alt="logo" className="toggle-white" />
//           </a>
//         </div>
//         <div className="main-sidebar" id="sidebar-scroll">

//           <RSC
//             // style={{ width: "100%", height: "100%" }}
//             noScrollX={false}>
//             <nav className="main-menu-container nav nav-pills flex-column sub-open">
//               <div className="slide-left" id="slide-left" onClick={() => { slideLeft(); }}><svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191" width="24"
//                 height="24" viewBox="0 0 24 24">
//                 <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path>
//               </svg></div>

//               <ul className="main-menu">
//                 {MENUITEMS.map((levelone) => (
//                   <Fragment key={Math.random()}>
//                     <li className={`${levelone.menutitle ? 'slide__category' : ''} ${levelone.type === 'link' ? 'slide' : ''}
//                        ${levelone.type === 'sub' ? 'slide has-sub' : ''} ${levelone?.active ? 'open' : ''} ${levelone?.selected ? 'active' : ''}`}>
//                       <span className='category-name'>
//                         {levelone.menutitle}
//                       </span>
//                       {levelone.type === "link" ?
//                         <Link to={levelone.path + "/"} className={`side-menu__item ${levelone.selected ? 'active' : ''}`} onClick={(_event) => { setSidemenu() }}>
//                           {levelone.icon}
//                           <span className="side-menu__label">
//                             {levelone.title}
//                             {levelone.badgetxt ? (
//                               <span className={levelone.class}>
//                                 {levelone.badgetxt}
//                               </span>
//                             ) : (
//                               ""
//                             )}
//                           </span>
//                         </Link>
//                         : ""}
//                          {levelone.type === "empty" ? 
//                         <Link to="#" className='side-menu__item'>
//                           {levelone.icon}
//                           <span className="side-menu__label">
//                             {levelone.title}
//                             {levelone.badgetxt ? (
//                               <span className={levelone.class}>
//                                 {levelone.badgetxt}
//                               </span>
//                             ) : (
//                               ""
//                             )}
//                           </span>
//                         </Link>
//                         : ""}
//                         {levelone.type === "sub" ? 
//                          <Menuloop MENUITEMS={levelone} level={level + 1 } togglesidemenu={togglesidemenu} />
//                         : ''}
                       
//                       {/* {levelone.type === "link" ?
//                     <Link to="#" className={`side-menu__item ${levelone.selected ? 'active' : ''}`}>
//                      {levelone.icon}
//                      <span className="side-menu__label">
//                       {levelone.title}
//                       {levelone.badgetxt ? (
//                                 <span className={levelone.class}>
//                                   {levelone.badgetxt}
//                                 </span>
//                               ) : (
//                                 ""
//                               )}
//                      </span>
//                     </Link>
//                     :
//                      levelone.type === "sub" ?
//                     <Menuloop MENUITEMS={levelone}/>
//                   : ""} */}
//                     </li>
//                   </Fragment>
//                 ))}
//               </ul>
//               <div className="slide-right" id="slide-right" onClick={() => { slideRight(); }}><svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191" width="24"
//                 height="24" viewBox="0 0 24 24">
//                 <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path>
//               </svg>
//               </div>
//             </nav>
//           </RSC>
//         </div>

//       </aside>
//     </Fragment>
//   )
//     ;
// }

// const mapStateToProps = (state: any) => ({
//   local_varaiable: state
// });

// export default connect(mapStateToProps, { ThemeChanger })(Sidebar);
// // export default Sidebar;
