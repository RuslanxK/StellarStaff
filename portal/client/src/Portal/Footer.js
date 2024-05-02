import {HelpOutline } from "@mui/icons-material";
import { Box, Typography, Link, Stack, Button } from "@mui/material";
import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useState } from "react";
import ContactVaForm from "../MainPages/ContactVaForm";


const Footer = () => {

  const [openPopup, setOpenPopup] = useState(false);

  const handlePopUpClose = () => {
    setOpenPopup(false);
  };

  const handlePopUpOpen = () => {
    setOpenPopup(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingTop: "30px",
        paddingBottom: "30px",
      }}
    >
      <Stack direction="row" columnGap="5px">
        <HelpOutline />
        <Typography variant="p" component="p" fontWeight={600}>
          Need any kind of assistant?
        </Typography>
        <Link fontWeight={600} onClick={handlePopUpOpen}>
          Contact Us
        </Link>
      </Stack>

      <Dialog
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      >
        <DialogActions sx={{ position: "absolute", top: 10, right: 0 }}>
          <Button onClick={handlePopUpClose}>
            <HighlightOffIcon />
          </Button>
        </DialogActions>
        <DialogContent>
          <ContactVaForm />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Footer;
