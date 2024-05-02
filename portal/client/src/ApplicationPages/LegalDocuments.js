import { useTheme } from "@emotion/react";
import { Box, Typography, Stack, DialogContent, useMediaQuery } from "@mui/material";
import * as React from "react";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import StyledButton from "../MainPages/StyledButton";
import Divider from "@mui/material/Divider";
import { useState } from "react";
import SubjectSharpIcon from "@mui/icons-material/SubjectSharp";
import SignatureCanvas from "react-signature-canvas";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PropTypes from "prop-types";
import FileBase64 from "react-file-base64";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import Notification from "../Components/Notification";

const LegalDocuments = () => {
  const [stepData, setStepData] = useOutletContext();
  const [open, setOpen] = useState(false);
  const [notificationHandle, setNotificationHandle] = useState({});

  const signatureCanvasRef = useRef(null);

  const dispatch = useDispatch();

  const formData = useSelector((state) => state.app.formData);

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check for mobile screens

  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isiPad = useMediaQuery(
    "(max-width: 1200px) and (orientation: landscape), (max-height: 1024px) and (orientation: portrait)"
  );

  useEffect(() => {
    setStepData({ name: "Legal Documents", count: 7, requiredFields: false });
  }, []);

  useEffect(() => {
    if (formData.vsnWaiver && formData.governmentTax && formData.personalIdFile) {
      setStepData((prevStepData) => ({
        ...prevStepData,
        requiredFields: true,
      }));
    } else {
      setStepData((prevStepData) => ({
        ...prevStepData,
        requiredFields: false,
      }));
    }
  }, [formData.vsnWaiver, formData.governmentTax, formData.personalIdFile]);

  const handleClickOpen = (event) => {
    event.preventDefault();
    setOpen(true);
  };

  const saveSignatureAsImage = () => {
    const canvas = signatureCanvasRef.current.getCanvas();
    const dataURL = canvas.toDataURL("image/png");

    fetch(dataURL)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "signature.png", { type: "image/png" });

        dispatch({
          type: "UPDATE_FORM_DATA",
          payload: { vsnWaiver: file },
        });

        setNotificationHandle({
          open: true,
          type: "info",
          text: "Successfully signed",
        });
        setOpen(false);
      });
  };

  function SimpleDialog(props) {
    const { onClose, selectedValue, open } = props;

    const handleListItemClick = (value) => {
      onClose(value);
    };

    return (
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth>
        <Box
          p={1}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 2,
            textAlign: isMobile ? "left" : "center",

            width: isMobile || isTablet || isiPad ? null : 900,
          }}
        >
          <DialogTitle>Applicant Waiver</DialogTitle>
          <DialogContent sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
            <Typography variant={isMobile ? "h6" : "h5"} component="h5" fontWeight={700}>
              PARTICIPATION WAIVER & RELEASE OF LIABILITY
            </Typography>
            <Typography variant="p" component="p">
              In consideration for permitting Applicant to participate in Stellar Staff Now's
              recruitment and placement activities, the Applicant agrees as follows:
            </Typography>
            <Typography variant="p" component="p" textAlign="left" pl={2}>
              1. Non-solicitation agreement: The Applicant hereby acknowledges and agrees not to
              make contact and solicit any direct service from clients that they are introduced to
              by Stellar Staff Now. If the Applicant is found to have broken this agreement, legal
              action will be taken in response. <br />
              <br /> 2. Assurance of attendance: The Applicant acknowledges and assures their
              attendance for any meetings and/or interviews that Stellar Staff Now sets. If the
              Applicant cannot attend for any reason, and does not inform Stellar Staff Now, they
              will be ineligible to participate in the Client Deliberation/Interview. If the
              applicant fails to attend three times (3x) for any meetings and/or interviews that
              Stellar Staff Now sets without probable reason/s, they will be removed from the
              pooling list and will not be eligible to participate permanently in any appointments
              from Stellar Staff Now. <br />
              <br /> 3. Removal from the Pooling Program: Applicants who fail to meet the above
              points, will have to re apply and pass the recruitment process again in order to be
              eligible to participate for any meetings and/or interviews that Stellar Staff Now
              sets.
            </Typography>
            <Typography variant="span" component="span" fontWeight={700}>
              By signing below, I hereby acknowledge that I have completely read and fully
              understand the PARTICIPATION WAIVER & RELEASE OF LIABILITY of Stellar Staff Now.
            </Typography>
          </DialogContent>
          <SignatureCanvas
            ref={signatureCanvasRef}
            penColor="black"
            backgroundColor="#EFEFEF"
            canvasProps={{ width: isMobile ? 375 : 900, height: 200, className: "sigCanvas" }}
          />
          <StyledButton variant="main" onClick={saveSignatureAsImage} sx={{ alignSelf: "center" }}>
            Submit Signature
          </StyledButton>
        </Box>
      </Dialog>
    );
  }

  SimpleDialog.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    selectedValue: PropTypes.string,
  };

  return (
    <Box boxShadow={[theme.shadows[11]]} border={theme.border} borderRadius={theme.borderRadius}>
      <Stack p={isMobile ? 4 : 5} spacing={2}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Stack
              flexDirection={isMobile ? "column" : "row"}
              justifyContent="space-between"
              alignItems="stretch"
            >
              <Typography variant="span" component="span" fontWeight="bold" fontSize="18px" pb={1}>
                Personal ID
              </Typography>
              <StyledButton
                variant={!formData.personalIdFile ? "outlined" : "completed"}
                component="label"
              >
                Upload
                <FileBase64
                  type="file"
                  multiple={false}
                  name="personalIdFile"
                  maxFileSize={5242880}
                  onDone={({ base64, file }) => {
                    if (!/^(image\/jpeg|image\/jpg|image\/png)$/i.test(file.type)) {
                      setNotificationHandle({
                        open: true,
                        type: "error",
                        text: "Invalid file type. Please select a JPEG, JPG or PNG file.",
                      });
                      return;
                    } else {
                      dispatch({
                        type: "UPDATE_FORM_DATA",
                        payload: { personalIdFile: file },
                      });
                      setNotificationHandle({
                        open: true,
                        type: "info",
                        text: "Personal ID file is uploaded",
                      });
                    }
                  }}
                />
              </StyledButton>
            </Stack>
          </Stack>
          <Divider />
          <Stack spacing={1}>
            <Stack
              flexDirection={isMobile ? "column" : "row"}
              justifyContent="space-between"
              alignItems="stretch"
            >
              <Typography variant="span" component="span" fontWeight="bold" pb={1} fontSize="18px">
                Government Tax Document
              </Typography>
              <StyledButton
                variant={!formData.governmentTax ? "outlined" : "completed"}
                component="label"
              >
                Upload
                <FileBase64
                  type="file"
                  multiple={false}
                  name="governmentTax"
                  maxFileSize={5242880}
                  onDone={({ base64, file }) => {
                    if (!/^(image\/jpeg|image\/jpg|image\/png)$/i.test(file.type)) {
                      setNotificationHandle({
                        open: true,
                        type: "error",
                        text: "Invalid file type. Please select a JPEG, JPG or PNG file.",
                      });
                      return;
                    } else {
                      dispatch({
                        type: "UPDATE_FORM_DATA",
                        payload: { governmentTax: file },
                      });
                      setNotificationHandle({
                        open: true,
                        type: "info",
                        text: "Government tax file is uploaded",
                      });
                    }
                  }}
                />
              </StyledButton>
            </Stack>
          </Stack>
          <Divider />
          <Stack spacing={1}>
            <Stack
              flexDirection={isMobile ? "column" : "row"}
              justifyContent="space-between"
              alignItems="stretch"
            >
              <Typography variant="span" component="span" fontWeight="bold" pb={1} fontSize="18px">
                VSN Applicant's Waiver
              </Typography>
              <StyledButton
                variant="main"
                disabled={!formData.vsnWaiver ? false : true}
                onClick={handleClickOpen}
                sx={{ backgroundColor: theme.palette.background.black }}
              >
                Sign now
              </StyledButton>
              <SimpleDialog open={open} onClose={() => setOpen(false)} />
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      {notificationHandle.open && (
        <Notification notification={notificationHandle} onClose={() => setNotificationHandle({})} />
      )}
    </Box>
  );
};

export default LegalDocuments;
