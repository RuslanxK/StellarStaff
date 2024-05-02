import { Snackbar, Alert } from "@mui/material";

const Notification = ({ notification, onClose }) => {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    onClose();
  };

  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <Alert onClose={handleClose} severity={notification.type} sx={{ width: "100%", fontSize: "18px" }}>
        {notification.text}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
