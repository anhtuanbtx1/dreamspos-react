
import React from "react";
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';

import '../src/style/css/feather.css'
import '../src/style/css/line-awesome.min.css'
import "../src/style/scss/main.scss";
import '../src/style/icons/fontawesome/css/fontawesome.min.css'
import '../src/style/icons/fontawesome/css/all.min.css'


import { Provider } from "react-redux";
import store from "./core/redux/store.jsx";
import AllRoutes from "./Router/router.jsx";

const rootElement = document.getElementById('root');

// Initialize default dark mode theme
const initializeTheme = () => {
  // Force reset to dark mode for new default (uncomment if needed)
  // localStorage.removeItem("colorschema");
  // localStorage.removeItem("layoutStyling");
  // localStorage.removeItem("layoutThemeColors");

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

  // Apply theme to document
  const colorSchema = localStorage.getItem("colorschema") || "dark_mode";
  const layoutStyling = localStorage.getItem("layoutStyling") || "default";
  const layoutThemeColors = localStorage.getItem("layoutThemeColors") || "light";

  document.documentElement.setAttribute("data-layout-mode", colorSchema);
  document.documentElement.setAttribute("data-layout-style", layoutStyling);
  document.documentElement.setAttribute("data-nav-color", layoutThemeColors);
};

// Initialize theme before rendering
initializeTheme();



if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <Provider store={store} >
      <BrowserRouter basename={process.env.PUBLIC_URL}>
      <AllRoutes />
      </BrowserRouter>
    </Provider>
  );
} else {
  console.error("Element with id 'root' not found.");
}
