import React from "react";
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';


const save = () => {
  const MainButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.white,
    "&:hover": {
      backgroundColor: theme.palette.primary.green,
    },
    padding: "8px 25px",
  }));

  const SecondaryButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.secondary.green,
      color: theme.palette.text.white,
      borderColor: theme.palette.primary.green,
    },
    border: "1px solid",
    borderColor: theme.palette.primary.main,
    padding: "8px 25px",
  }));
};

export default save;
