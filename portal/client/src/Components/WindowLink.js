import { Attachment } from "@mui/icons-material";
import { Typography } from "@mui/material";
import React from "react";

const WindowLink = (props) => {
  const openFileUrl = (url) => {
    window.open(process.env.REACT_APP_CLOUD_URL + url, "_blank", "noreferrer");
  };

  return (
    <>
      <Attachment sx={{ fontSize: "20px", mr: 0.5, transform: "rotate(-45deg)" }} />
      <Typography variant="span" component="span" onClick={() => openFileUrl(props.url)}>
        {props.fieldName}
      </Typography>
    </>
  );
};

export default WindowLink;
