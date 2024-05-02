import React from 'react'
import { Dialog, DialogTitle, Box } from "@mui/material";
import { useTheme } from "@emotion/react";
import LoadingScreen from '../Components/LoadingScreen';
import StyledButton from '../MainPages/StyledButton';

const DialogRemoveClient = ({loading, openPopup, closePopup, removeClient }) => {


    const theme = useTheme();

    
  return (
    <Dialog
        open={openPopup}
        onClose={closePopup}
        sx={{
          "& .MuiDialog-paper": {
            width: "400px",
            maxWidth: "100%",
            height: "250px",
            padding: "35px",
            borderRadius: theme.borderRadius,
            border: theme.border,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        {loading && <LoadingScreen />}

        <DialogTitle
          sx={{ padding: "0px", fontSize: "25px", marginBottom: "20px" }}
        >
          Confirm client deletion?
        </DialogTitle>

        <Box>
          <StyledButton
            variant="main"
            sx={{ marginRight: "5px" }}
            onClick={closePopup}
          >
            Cancel
          </StyledButton>

          <StyledButton
            variant="secondary"
            sx={{ marginLeft: "5px" }}
            onClick={removeClient}
          >
            Delete Client
          </StyledButton>
        </Box>
      </Dialog>
  )
}

export default DialogRemoveClient