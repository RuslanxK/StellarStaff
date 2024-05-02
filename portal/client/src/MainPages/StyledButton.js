import React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

const StyledButton = styled(Button)(({ theme, variant, disabled }) => ({
  backgroundColor:
    variant === "main"
      ? theme.palette.primary.main
      : variant === "completed"
      ? theme.palette.completed.background
      : variant === "underline"  
      ? theme.palette.background.transparent
      : theme.palette.secondary.main,
  color:
    variant === "main" && disabled === true
      ? theme.palette.text.white + "!important"
      : variant === "main"
      ? theme.palette.text.white
      : variant === "completed"
      ? theme.palette.completed.color
      : variant === "underline"  
      ? theme.palette.text.black
      : theme.palette.primary.main,
  opacity: variant === "main" && disabled === true ? 0.5 : 1,
  "&:hover": {
    backgroundColor: variant === "main" ? theme.palette.primary.green : variant === "underline" ? theme.palette.background.transparent : theme.palette.secondary.green,
    color: variant === "main" ? theme.palette.text.white : variant === "underline" ? theme.palette.text.main :  theme.palette.text.white,
    borderColor: variant === "main" ? theme.palette.primary.green : undefined,
  },
  border: variant === "secondary" ? "1px solid" : undefined,
  borderColor: variant === "secondary" ? theme.palette.primary.main : undefined,
  padding: "8px 25px",
  "&:hover": {
    borderColor: variant === "secondary" ? theme.palette.primary.green : undefined,
    backgroundColor:
      variant === "secondary" ? theme.palette.primary.green : variant === "underline" ? theme.palette.background.transparent : theme.palette.secondary.green,
    color: variant === "secondary" ? theme.palette.text.white : variant === "underline" ? theme.palette.text.main : theme.palette.text.white,
  },
}));

export default StyledButton;
