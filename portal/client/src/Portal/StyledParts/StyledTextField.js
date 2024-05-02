import React from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';


const StyledTextField = styled(TextField)(({ theme }) => ({
    "& label": {
      color: theme.palette.text.primary, // Set the desired label color
    },
    "& .MuiInputBase-root": {
      "&.Mui-focused": {
        "& label": {
          color: theme.palette.text.purple, // Set the desired label color when focused
        },
        opacity: 1, // Set the desired opacity value
      },
    },
  }));


  export default function CustomTextField(props) {
    return <StyledTextField {...props} />;
  }