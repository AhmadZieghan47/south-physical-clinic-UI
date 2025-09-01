import { Link, useLocation, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../imageWithBasePath";
import React, { useEffect, useState } from "react";
import { SidebarData } from "./sidebarData";
import { useDispatch, useSelector } from "react-redux";
import { setExpandMenu, setMobileSidebar } from "../../redux/sidebarSlice";
import { updateTheme } from "../../redux/themeSlice";
import { all_routes } from "../../../feature-module/routes/all_routes";

import "./sidebar.css"

const Sidebar = () => {
  const Location = useLocation();
  const [subOpen, setSubOpen] = useState<any>("");
  const [subsidebar, setSubsidebar] = useState("");
  const dispatch = useDispatch();

  const toggleSidebar = (title: any) => {
    localStorage.setItem("menuOpened", title);
    if (title === subOpen) {
      setSubOpen("");
    } else {
      setSubOpen(title);
    }
  };

  const toggleSubsidebar = (subitem: any) => {
    if (subitem === subsidebar) {
      setSubsidebar("");
    } else {
      setSubsidebar(subitem);
    }
  };

  const handleClick = (label: any) => {
    toggleSidebar(label);
  };

  const navigate = useNavigate();
  const themeSettings = useSelector((state: any) => state.theme.themeSettings);

  const handleMiniSidebar = () => {
    const rootElement = document.documentElement;
    const isMini = rootElement.getAttribute("data-layout") === "mini";
    const updatedLayout = isMini ? "default" : "mini";
    dispatch(
      updateTheme({
        "data-layout": updatedLayout,
      })
    );
    if (isMini) {
      rootElement.classList.remove("mini-sidebar");
    } else {
      rootElement.classList.add("mini-sidebar");
    }
  };
  const onMouseEnter = () => {
    dispatch(setExpandMenu(true));
  };
  const onMouseLeave = () => {
    dispatch(setExpandMenu(false));
  };

  const handleLayoutClick = (layout: string) => {
    const layoutSettings: any = {
      "data-layout": "default",
      dir: "ltr",
    };

    switch (layout) {
      case "Default":
        layoutSettings["data-layout"] = "default";
        break;
      case "Hidden":
        layoutSettings["data-layout"] = "hidden";
        break;
      case "Mini":
        layoutSettings["data-layout"] = "mini";
        break;
      case "Hover View":
        layoutSettings["data-layout"] = "hoverview";
        break;
      case "Full Width":
        layoutSettings["data-layout"] = "full-width";
        break;
      case "RTL":
        layoutSettings.dir = "rtl";
        break;
      default:
        break;
    }
    dispatch(updateTheme(layoutSettings));
    navigate("/dashboard");
  };
  const mobileSidebar = useSelector(
    (state: any) => state.sidebarSlice.mobileSidebar
  );
  const toggleMobileSidebar = () => {
    dispatch(setMobileSidebar(!mobileSidebar));
  };
  useEffect(() => {
    const rootElement: any = document.documentElement;
    Object.entries(themeSettings).forEach(([key, value]) => {
      rootElement.setAttribute(key, value);
    });
    if (themeSettings["data-layout"] === "mini") {
      rootElement.classList.add("mini-sidebar");
    } else {
      rootElement.classList.remove("mini-sidebar");
    }
  }, [themeSettings]);

  return (
    <>
      {/* Sidenav Menu Start */}
      <div
        className="sidebar"
        id="sidebar"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Start Logo */}
        <div className="sidebar-logo">
          <div>
            {/* Logo Normal */}
            <div className="logo-with-text d-flex">
              <ImageWithBasePath src="assets/img/logo22.png" alt="Logo" />
              <span>South Physical</span>
            </div>
            {/* <Link to={all_routes.dashboard} className="logo logo-normal">
              <ImageWithBasePath src="assets/img/logo.svg" alt="Logo" />
            </Link> */}
            {/* Logo Small */}
            <Link to={all_routes.dashboard} className="logo-small">
              <ImageWithBasePath src="assets/img/logo-small.svg" alt="Logo" />
            </Link>
            {/* Logo Dark */}
            <Link to={all_routes.dashboard} className="dark-logo">
              <ImageWithBasePath src="assets/img/logo-white.svg" alt="Logo" />
            </Link>
          </div>
          <button
            className="sidenav-toggle-btn btn border-0 p-0 active"
            id="toggle_btn"
            onClick={handleMiniSidebar}
          >
            <i className="ti ti-arrow-left" />
          </button>
          {/* Sidebar Menu Close */}
          <button className="sidebar-close" onClick={toggleMobileSidebar}>
            <i className="ti ti-x align-middle" />
          </button>
        </div>
        {/* End Logo */}
        {/* Sidenav Menu */}
        <div className="sidebar-inner" data-simplebar="">
          <div id="sidebar-menu" className="sidebar-menu">
            <ul>
              {SidebarData?.map((mainLabel, index) => (
                <React.Fragment key={`main-${index}`}>
                  <li className="menu-title">
                    <span>{mainLabel?.tittle}</span>
                  </li>
                  <li>
                    <ul>
                      {mainLabel?.submenuItems?.map((title: any, i) => {
                        let link_array: any = [];
                        if ("submenuItems" in title) {
                          title.submenuItems?.forEach((link: any) => {
                            link_array.push(link?.link);
                            if (link?.submenu && "submenuItems" in link) {
                              link.submenuItems?.forEach((item: any) => {
                                link_array.push(item?.link);
                              });
                            }
                          });
                        }
                        title.links = link_array;

                        return (
                          <li className="submenu" key={`title-${i}`}>
                            <Link
                              to={title?.submenu ? "#" : title?.link}
                              onClick={() => {
                                handleClick(title?.label);

                                if (mainLabel?.tittle === "Layout") {
                                  handleLayoutClick(title?.label);
                                }
                              }}
                              className={`${
                                subOpen === title?.label ||
                                title?.links?.includes(Location.pathname)
                                  ? "subdrop"
                                  : ""
                              } ${
                                title?.links?.includes(Location.pathname) ||
                                title?.link === Location.pathname
                                  ? "active"
                                  : ""
                              }`}
                            >
                              <i className={`ti ti-${title.icon}`}></i>
                              <span>{title?.label}</span>
                              {(title?.submenu || title?.customSubmenuTwo) && (
                                <span className="menu-arrow"></span>
                              )}
                              {title?.submenu === false &&
                                title?.version === "v1.6.7" && (
                                  <span className="badge bg-danger ms-2 rounded-2 badge-md fs-12 fw-medium">
                                    v1.6.7
                                  </span>
                                )}
                            </Link>

                            {title?.submenu !== false && (
                              <ul
                                style={{
                                  display:
                                    subOpen === title?.label ||
                                    title?.links?.includes(Location.pathname)
                                      ? "block"
                                      : "none",
                                }}
                              >
                                {title?.submenuItems?.map(
                                  (item: any, j: any) => {
                                    const isSubActive =
                                      item?.submenuItems
                                        ?.map((link: any) => link?.link)
                                        .includes(Location.pathname) ||
                                      item?.link === Location.pathname;

                                    return (
                                      <li
                                        className={`${
                                          item?.submenuItems
                                            ? "submenu submenu-two"
                                            : ""
                                        } `}
                                        key={`item-${j}`}
                                      >
                                        <Link
                                          to={item?.submenu ? "#" : item?.link}
                                          className={`${
                                            isSubActive ? "active subdrop" : ""
                                          } ${
                                            subsidebar === item?.label
                                              ? "subdrop"
                                              : ""
                                          }`}
                                          onClick={() => {
                                            toggleSubsidebar(item?.label);
                                            if (title?.label === "Layouts") {
                                              handleLayoutClick(item?.label);
                                            }
                                          }}
                                        >
                                          {item?.label}
                                          {(item?.submenu ||
                                            item?.customSubmenuTwo) && (
                                            <span className="menu-arrow"></span>
                                          )}
                                        </Link>
                                        {item?.submenuItems ? (
                                          <ul
                                            style={{
                                              display:
                                                subsidebar === item?.label
                                                  ? "block"
                                                  : "none",
                                            }}
                                          >
                                            {item?.submenuItems?.map(
                                              (items: any, k: any) => {
                                                const isSubSubActive =
                                                  items?.submenuItems
                                                    ?.map(
                                                      (link: any) => link.link
                                                    )
                                                    .includes(
                                                      Location.pathname
                                                    ) ||
                                                  items?.link ===
                                                    Location.pathname;

                                                return (
                                                  <li key={`submenu-item-${k}`}>
                                                    <Link
                                                      to={
                                                        items?.submenu
                                                          ? "#"
                                                          : items?.link
                                                      }
                                                      className={`${
                                                        isSubSubActive
                                                          ? "active"
                                                          : ""
                                                      }`}
                                                    >
                                                      {items?.label}
                                                    </Link>
                                                  </li>
                                                );
                                              }
                                            )}
                                          </ul>
                                        ) : null}
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                </React.Fragment>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* Sidenav Menu End */}
    </>
  );
};

export default Sidebar;
