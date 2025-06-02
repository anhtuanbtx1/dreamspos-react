import React, { useEffect, useState } from "react";
import { Settings, Sun, Moon, Layout, RotateCcw, X } from "react-feather";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setLayoutChange } from "../core/redux/action";
import ImageWithBasePath from "../core/img/imagewithbasebath";

const ThemeSettings = () => {
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [layoutColor, setlayoutColor] = useState(
    localStorage.getItem("colorschema") || "dark_mode"
  );

  const [layoutView, setLayoutView] = useState(
    localStorage.getItem("layoutStyling") || "default"
  );

  const [layoutTheme, setLayoutTheme] = useState(
    localStorage.getItem("layoutThemeColors") || "light"
  );

  const showSettings = () => {
    setShow(!show);
  };

  const DarkThemes = () => {
    localStorage.setItem("colorschema", "dark_mode");
    setlayoutColor("dark_mode");
    document.documentElement.setAttribute("data-layout-mode", "dark_mode");

    // Add smooth transition effect
    document.body.classList.add('theme-transition');
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 300);
  };

  const LightThemes = () => {
    localStorage.setItem("colorschema", "light_mode");
    setlayoutColor("light_mode");
    document.documentElement.setAttribute("data-layout-mode", "light_mode");

    // Add smooth transition effect
    document.body.classList.add('theme-transition');
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 300);
  };

  const DefaultStyle = () => {
    localStorage.setItem("layoutStyling", "default");
    setLayoutView("default");
    dispatch(setLayoutChange("default"));
    document.documentElement.setAttribute("data-layout-style", "default");
  };

  const LayoutBox = () => {
    localStorage.setItem("layoutStyling", "box");
    setLayoutView("box");
    dispatch(setLayoutChange("box"));
    document.documentElement.setAttribute("data-layout-style", "box");
  };
  const collapsedLayout = () => {
    localStorage.setItem("layoutStyling", "collapsed");
    setLayoutView("collapsed");
    dispatch(setLayoutChange("collapsed"));
    document.documentElement.setAttribute("data-layout-style", "collapsed");
  };

  const HorizontalLayout = () => {
    localStorage.setItem("layoutStyling", "horizontal");
    setLayoutView("horizontal");
    dispatch(setLayoutChange("horizontal"));
    document.documentElement.setAttribute("data-layout-style", "horizontal");
  };
  const modernLayout = () => {
    localStorage.setItem("layoutStyling", "modern");
    setLayoutView("modern");
    dispatch(setLayoutChange("modern"));
    document.documentElement.setAttribute("data-layout-style", "modern");
  };

  const LayoutGrey = () => {
    localStorage.setItem("layoutThemeColors", "grey");
    setLayoutTheme("grey");
    document.documentElement.setAttribute("data-nav-color", "grey");
  };

  const LayoutDark = () => {
    localStorage.setItem("layoutThemeColors", "dark");
    setLayoutTheme("dark");
    document.documentElement.setAttribute("data-nav-color", "dark");
  };
  const LayoutLight = () => {
    localStorage.setItem("layoutThemeColors", "light");
    setLayoutTheme("light");
    document.documentElement.setAttribute("data-nav-color", "light");
  };
  const ResetData = () => {
    localStorage.setItem("colorschema", "dark_mode");
    localStorage.setItem("layoutStyling", "default");
    localStorage.setItem("layoutThemeColors", "light");

    setlayoutColor("dark_mode");
    setLayoutView("default");
    setLayoutTheme("light");

    document.documentElement.setAttribute("data-layout-mode", "dark_mode");
    document.documentElement.setAttribute("data-layout-style", "default");
    document.documentElement.setAttribute("data-nav-color", "light");
  };

  // Initialize default values on component mount
  useEffect(() => {
    // Set default values if not exists in localStorage
    if (!localStorage.getItem("colorschema")) {
      localStorage.setItem("colorschema", "dark_mode");
    }
    if (!localStorage.getItem("layoutStyling")) {
      localStorage.setItem("layoutStyling", "default");
    }
    if (!localStorage.getItem("layoutThemeColors")) {
      localStorage.setItem("layoutThemeColors", "light");
    }

    // Add keyboard shortcut to toggle theme customizer (Ctrl + T)
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 't') {
        event.preventDefault();
        setShow(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-layout-mode", layoutColor);
    document.documentElement.setAttribute("data-layout-style", layoutView);
    document.documentElement.setAttribute("data-nav-color", layoutTheme);
  }, [layoutColor, layoutTheme, layoutView]);


  return (
    <>
      {/* CSS Animation Keyframes */}
      <style>
        {`
          @keyframes spin-smooth {
            0% {
              transform: rotate(0deg);
            }
            25% {
              transform: rotate(90deg);
            }
            50% {
              transform: rotate(180deg);
            }
            75% {
              transform: rotate(270deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          @keyframes spin-glow {
            0% {
              transform: rotate(0deg);
              filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
            }
            50% {
              transform: rotate(180deg);
              filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.6));
            }
            100% {
              transform: rotate(360deg);
              filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
            }
          }

          /* Icon luôn xoay tròn */
          .settings-icon {
            animation: spin-smooth 3s linear infinite !important;
            transform-origin: center center !important;
          }

          .settings-icon.rotating {
            animation: spin-smooth 2s linear infinite !important;
            transform-origin: center center !important;
          }

          /* Hover effects - tăng tốc và glow */
          .floating-theme-btn:hover .settings-icon {
            animation: spin-glow 1.5s linear infinite !important;
            transform: scale(1.1) !important;
          }

          /* Khi panel mở và hover - xoay nhanh hơn */
          .floating-theme-btn:hover .settings-icon.rotating {
            animation: spin-smooth 0.8s linear infinite !important;
            transform: scale(1.15) !important;
          }
        `}
      </style>

      {/* Floating Theme Toggle Button with Beautiful Effects */}
      <div
        className={`theme-toggle-btn floating-theme-btn ${show ? 'panel-open' : ''}`}
        onClick={showSettings}
        title="Theme Customizer (Ctrl + T)"
      >
        <div className="btn-ripple"></div>
        <div className="btn-glow"></div>

        {/* Custom SVG Icon with Rotation */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className={`settings-icon ${show ? 'rotating' : ''}`}
          data-show={show}
          style={{
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transformOrigin: 'center',
            zIndex: 2
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className="btn-pulse pulse-ring-1"></div>
        <div className="btn-pulse pulse-ring-2"></div>
        <div className="btn-pulse pulse-ring-3"></div>
      </div>

      <div
        className={
          show
            ? "sidebar-settings nav-toggle show-settings"
            : "sidebar-settings nav-toggle"
        }
        id="layoutDiv"
        // onclick="toggleClassDetail()"
      >
        <div className="sidebar-content sticky-sidebar-one">
          <div className="sidebar-header">
            <div className="sidebar-theme-title">
              <h5>🎨 Theme Customizer</h5>
              <p>Customize & Preview in Real Time</p>
              <small style={{color: '#888', fontSize: '11px'}}>Press Ctrl + T to toggle</small>
            </div>
            <div className="close-sidebar-icon d-flex">
              <Link className="sidebar-refresh me-2" onClick={ResetData}>
                <RotateCcw size={16} />
              </Link>
              <Link className="sidebar-close" to="#" onClick={showSettings}>
                <X size={16} />
              </Link>
            </div>
          </div>
          <div className="sidebar-body p-0">
            <form id="theme_color" method="post">
              <div className="theme-mode mb-0">
                <div className="theme-body-main">
                  <div className="theme-head">
                    <h6><Settings size={18} style={{marginRight: '8px', verticalAlign: 'middle'}} />Theme Mode</h6>
                    <p>Enjoy Dark & Light modes with beautiful transitions.</p>
                  </div>
                  <div className="row">
                    <div className="col-xl-6 ere">
                      <div className="layout-wrap">
                        <div className="d-flex align-items-center">
                          <div
                            className="status-toggle d-flex align-items-center me-2"
                            onClick={LightThemes}
                          >
                            <input
                              type="radio"
                              name="theme-mode"
                              id="light_mode"
                              className="check color-check stylemode lmode"
                              defaultValue="light_mode"
                            />
                            <label
                              htmlFor="light_mode"
                              className="checktoggles theme-preview-card"
                            >
                              {/* Custom Light Mode Preview */}
                              <div className="theme-preview light-preview">
                                <div className="preview-header">
                                  <div className="preview-dots">
                                    <span className="dot red"></span>
                                    <span className="dot yellow"></span>
                                    <span className="dot green"></span>
                                  </div>
                                </div>
                                <div className="preview-body">
                                  <div className="preview-sidebar light-sidebar">
                                    <div className="sidebar-item"></div>
                                    <div className="sidebar-item"></div>
                                    <div className="sidebar-item active"></div>
                                  </div>
                                  <div className="preview-content light-content">
                                    <div className="content-header"></div>
                                    <div className="content-body">
                                      <div className="content-line"></div>
                                      <div className="content-line short"></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <span className="theme-name">
                                <Sun size={14} style={{marginRight: '6px', verticalAlign: 'middle'}} />
                                Light Mode
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6 ere">
                      <div className="layout-wrap">
                        <div className="d-flex align-items-center">
                          <div className="status-toggle d-flex align-items-center me-2">
                            <input
                              type="radio"
                              name="theme-mode"
                              id="dark_mode"
                              className="check color-check stylemode"
                              defaultValue="dark_mode"
                              defaultChecked
                            />
                            <label htmlFor="dark_mode" className="checktoggles theme-preview-card">
                              <div onClick={DarkThemes}>
                                {/* Custom Dark Mode Preview */}
                                <div className="theme-preview dark-preview">
                                  <div className="preview-header">
                                    <div className="preview-dots">
                                      <span className="dot red"></span>
                                      <span className="dot yellow"></span>
                                      <span className="dot green"></span>
                                    </div>
                                  </div>
                                  <div className="preview-body">
                                    <div className="preview-sidebar dark-sidebar">
                                      <div className="sidebar-item"></div>
                                      <div className="sidebar-item"></div>
                                      <div className="sidebar-item active"></div>
                                    </div>
                                    <div className="preview-content dark-content">
                                      <div className="content-header"></div>
                                      <div className="content-body">
                                        <div className="content-line"></div>
                                        <div className="content-line short"></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <span className="theme-name">
                                <Moon size={14} style={{marginRight: '6px', verticalAlign: 'middle'}} />
                                Dark Mode
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="theme-mode border-0 mb-0">
                  <div className="theme-head">
                    <h6><Layout size={18} style={{marginRight: '8px', verticalAlign: 'middle'}} />Layout Mode</h6>
                    <p>Select the primary layout style for your app.</p>
                  </div>
                  <div className="row">
                    <div className="col-xl-6 ere">
                      <div className="layout-wrap">
                        <div className="d-flex align-items-center">
                          <div
                            className="status-toggle d-flex align-items-center me-2"
                            onClick={DefaultStyle}
                          >
                            <input
                              type="radio"
                              name="layout"
                              id="default_layout"
                              className="check layout-mode"
                              defaultValue="default"
                              defaultChecked
                            />
                            <label
                              htmlFor="default_layout"
                              className="checktoggles"
                            >
                              <ImageWithBasePath
                                src="assets/img/theme/theme-img-01.jpg"
                                alt="img"
                              />
                              <span className="theme-name">Default</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6 ere">
                      <div className="layout-wrap">
                        <div className="d-flex align-items-center">
                          <div
                            className="status-toggle d-flex align-items-center me-2"
                            onClick={LayoutBox}
                          >
                            <input
                              type="radio"
                              name="layout"
                              id="box_layout"
                              className="check layout-mode"
                              defaultValue="box"
                            />
                            <label
                              htmlFor="box_layout"
                              className="checktoggles"
                            >
                              <ImageWithBasePath
                                src="assets/img/theme/theme-img-07.jpg"
                                alt="img"
                              />
                              <span className="theme-name">Box</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6 ere">
                      <div className="layout-wrap">
                        <div className="d-flex align-items-center">
                          <div
                            className="status-toggle d-flex align-items-center me-2"
                            onClick={collapsedLayout}
                          >
                            <input
                              type="radio"
                              name="layout"
                              id="collapse_layout"
                              className="check layout-mode"
                              defaultValue="collapsed"
                            />
                            <label
                              htmlFor="collapse_layout"
                              className="checktoggles"
                            >
                              <ImageWithBasePath
                                src="assets/img/theme/theme-img-05.jpg"
                                alt="img"
                              />
                              <span className="theme-name">Collapsed</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6 ere">
                      <div className="layout-wrap">
                        <div className="d-flex align-items-center">
                          <div
                            className="status-toggle d-flex align-items-center me-2"
                            onClick={HorizontalLayout}
                          >
                            <input
                              type="radio"
                              name="layout"
                              id="horizontal_layout"
                              className="check layout-mode"
                              defaultValue="horizontal"
                            />
                            <label
                              htmlFor="horizontal_layout"
                              className="checktoggles"
                            >
                              <ImageWithBasePath
                                src="assets/img/theme/theme-img-06.jpg"
                                alt
                              />
                              <span className="theme-name">Horizontal</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6 ere">
                      <div className="layout-wrap">
                        <div className="d-flex align-items-center">
                          <div
                            className="status-toggle d-flex align-items-center me-2"
                            onClick={modernLayout}
                          >
                            <input
                              type="radio"
                              name="layout"
                              id="modern_layout"
                              className="check layout-mode"
                              defaultValue="modern"
                            />
                            <label
                              htmlFor="modern_layout"
                              className="checktoggles"
                            >
                              <ImageWithBasePath
                                src="assets/img/theme/theme-img-04.jpg"
                                alt
                              />
                              <span className="theme-name">Modern</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="theme-mode">
                  <div className="theme-head">
                    <h6>Navigation Colors</h6>
                    <p>Setup the color for the Navigation</p>
                  </div>
                  <div className="row">
                    <div className="col-xl-4 ere">
                      <div className="layout-wrap">
                        <div className="d-flex align-items-center">
                          <div className="status-toggle d-flex align-items-center me-2">
                            <input
                              type="radio"
                              name="nav_color"
                              id="light_color"
                              className="check nav-color"
                              defaultValue="light"
                              defaultChecked
                            />
                            <label
                              htmlFor="light_color"
                              className="checktoggles"
                            >
                              <span
                                className="theme-name"
                                onClick={LayoutLight}
                              >
                                Light
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4 ere">
                      <div className="layout-wrap">
                        <div className="d-flex align-items-center">
                          <div className="status-toggle d-flex align-items-center me-2">
                            <input
                              type="radio"
                              name="nav_color"
                              id="grey_color"
                              className="check nav-color"
                              defaultValue="grey"
                            />
                            <label
                              htmlFor="grey_color"
                              className="checktoggles"
                            >
                              <span
                                className="theme-name"
                                onClick={LayoutGrey}
                              >
                                Grey
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4 ere">
                      <div className="layout-wrap">
                        <div className="d-flex align-items-center">
                          <div className="status-toggle d-flex align-items-center me-2">
                            <input
                              type="radio"
                              name="nav_color"
                              id="dark_color"
                              className="check nav-color"
                              defaultValue="dark"
                            />
                            <label
                              htmlFor="dark_color"
                              className="checktoggles"
                            >
                              <span
                                className="theme-name"
                                onClick={LayoutDark}
                              >
                                Dark
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThemeSettings;
