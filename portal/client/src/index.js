import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { combineReducers, createStore } from "redux";
import { Provider } from "react-redux";
import appReducer from "./appReducer";
import clientReducer from "./clientPortal/clientReducer";
import {disableReactDevTools} from '@fvilers/disable-react-devtools'

const rootReducer = combineReducers({
  app: appReducer,
  clientApp: clientReducer,
})

const appStore = createStore(rootReducer);

if (process.env.NODE_ENV === 'production') disableReactDevTools();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={appStore}>
    <>
      <CssBaseline>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </CssBaseline>
    </>
  </Provider>
);
