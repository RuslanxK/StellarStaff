import React from "react";
import { Dialog, DialogTitle, Box } from "@mui/material";
import { useTheme } from "@emotion/react";
import StyledButton from "../MainPages/StyledButton";
import LoadingScreen from "../Components/LoadingScreen";

const DialogRemoveVAComp = ({ removeVa, closeVa, openPopup, closePopup, loading }) => {
  
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
      {loading && <LoadingScreen/>}
      <DialogTitle sx={{ padding: "0px", fontSize: "25px", marginBottom: "20px" }}>
        Confirm va deletion?
      </DialogTitle>

      <Box>
        <StyledButton variant="main" sx={{ marginRight: "5px" }} onClick={closeVa}>
          Cancel
        </StyledButton>

        <StyledButton variant="secondary" sx={{ marginLeft: "5px" }} onClick={removeVa}>
          Delete Va
        </StyledButton>
      </Box>
    </Dialog>
  );
};

export default DialogRemoveVAComp;
