import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1267F6",
      green: "#191919",
      white: "#ffffff",
      purple: "#4e49a3",
    },
    secondary: {
      main: "#ffffff",
      green: "#191919",
    },
    completed: {
      background: "#dfefe8",
      color: "#00b43f"
    },
    text: {
      main: "#131313",
      green: "#08ae88",
      purple: "#4e49a3",
      white: "#ffffff",
      icons: "#707070",
      black: "#000000",
    },
    background: {
      main: "#eefffb",
      white: "#ffffff",
      purple: "#4e49a3",
      lightPurple: "#d9d7fa",
      black: "#000000",
      gray: "#F3F4F9",
      transparent: "none"
    },
  },
  shadows: [
    "none",
    "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
    "0px 4px 4px rgba(0, 0, 0, 0.25)",
    "0px 8px 10px rgba(0, 0, 0, 0.22)",
    "0px 3px 5px rgba(0, 0, 0, 0.21)",
    "0px 6px 10px rgba(0, 0, 0, 0.19)",
    "0px 9px 12px rgba(0, 0, 0, 0.17)",
    "0px 12px 16px rgba(0, 0, 0, 0.15)",
    "0px 16px 24px rgba(0, 0, 0, 0.14)",
    "0px 24px 32px rgba(0, 0, 0, 0.12)",
    "0px 32px 48px rgba(0, 0, 0, 0.11)",
    "1px 10px 29px 0px rgba(0,0,0,0.11)",
  ],
  border: "1px solid #D9D9D9",
  borderRadius: "14px",
});
