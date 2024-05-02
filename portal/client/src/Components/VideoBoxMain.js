import { Card, CardMedia, CardContent, Box, useMediaQuery } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import VideoPlaceholder from "../Resources/VideoPlaceHolder_2.jpg";
import { useTheme } from "@emotion/react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useState } from "react";

const VideoBoxMain = (videoLink) => {
  const [open, setOpen] = useState(false);


  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isiPad = useMediaQuery(
    "(max-width: 1200px) and (orientation: landscape), (max-height: 1024px) and (orientation: portrait)"
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card sx={{ position: "relative", margin: "0 auto",  boxShadow: theme.shadows[11], borderRadius: "25px", width: isTablet ||isiPad ? "75%" : "100%" }}>
      <CardMedia sx={{ height: isMobile ? 200 : 400}} image={VideoPlaceholder} title="video placeholder" />
      <CardContent
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            width: 100,
            height: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "100px",
            cursor:"pointer",
           
          }}
          onClick={handleClickOpen} 
        >
          <PlayArrow sx={{ fontSize: "30px"}}/>
        </Box>
      </CardContent>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={800}
      >
        <DialogContent>
        <iframe width={isMobile ? "100%" : "650"} height="500" src="https://www.youtube.com/embed/MLpWrANjFbI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default VideoBoxMain;
