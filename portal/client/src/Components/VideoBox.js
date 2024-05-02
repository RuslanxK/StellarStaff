import React from "react";
import { Card, CardMedia, CardContent, Link, Box } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import VideoPlaceholder from "../Resources/VideoPlaceholder.jpg";
import { useTheme } from "@emotion/react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from "react";
import Button from '@mui/material/Button';


const VideoBox = (videoLink) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const theme = useTheme();
  return (
    <Card
      sx={{
        position: "relative",
        boxShadow: theme.none,
        borderRadius: "25px",
        width: "33.333%",
      }}
    >
      <CardMedia sx={{ height: 120 }} image={VideoPlaceholder} title="video placeholder" />
      <CardContent
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Link href="#">
          <Box
            sx={{
              backgroundColor: "white",
              width: 50,
              height: 50,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "100px",
            }}
          >
            <PlayArrow sx={{ fontSize: "20px", color: "black" }} />
          </Box>
        </Link>
      </CardContent>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
    
  );
};

export default VideoBox;
