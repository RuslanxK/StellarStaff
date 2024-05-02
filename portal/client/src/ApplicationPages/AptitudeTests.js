import { useTheme } from "@emotion/react";
import { Box, Typography, Stack, TextField, useMediaQuery } from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import StyledButton from "../MainPages/StyledButton";
import Divider from "@mui/material/Divider";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileBase64 from "react-file-base64";
import Notification from "../Components/Notification";

const AptitudeTests = () => {
  const [stepData, setStepData] = useOutletContext();
  const [notificationHandle, setNotificationHandle] = useState({});



  const dispatch = useDispatch();

  const formData = useSelector((state) => state.app.formData);

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check for mobile screens

  useEffect(() => {
    setStepData({ name: "Aptitude Tests", count: 6, requiredFields: false });
  }, []);

  useEffect(() => {
    if (
      formData.aptitudeFile &&
      formData.aptitudeText &&
      formData.discFile &&
      formData.discText &&
      formData.englishFile &&
      formData.englishText
    ) {
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
  }, [
    formData.aptitudeFile,
    formData.aptitudeText,
    formData.discFile,
    formData.discText,
    formData.englishFile,
    formData.englishText,
  ]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    dispatch({ type: "UPDATE_FORM_DATA", payload: { [name]: value } });
  };

  const AptitudeTestURL = () => {
    window.open(
      "https://dynomight.net/mbti/?fbclid=IwAR1DXoRcupDJ1z7ie_nTChnSM2JdM8Nsr9_X-wYpBq3Wb4vKDO-QyzheR40",
      "_blank"
    );
  };

  const discTestURL = () => {
    window.open(
      "https://openpsychometrics.org/tests/ODAT/?fbclid=IwAR0puWdizeGcUCiUu41PsvSO5HjKTDkMg_9alZeIEpsklBFBtOY27i-Fhqk",
      "_blank"
    );
  };

  const englishTestURL = () => {
    window.open(
      "https://www.efset.org/quick-check/?fbclid=IwAR3ZXeDD5uD9o5voISVytQDCSqY-Jv8Uv8ASBmFKT5UFU0Xe0-XHN_ATVbo",
      "_blank"
    );
  };

  return (
    <Box boxShadow={[theme.shadows[11]]} border={theme.border} borderRadius={theme.borderRadius}>
      <Stack p={isMobile ? 4 : 5} spacing={3}>
        <Stack spacing={3}>
          <Stack spacing={2}>
            <Stack
              flexDirection={isMobile ? "column" : "row"}
              justifyContent="space-between"
              alignItems="stretch"
            >
              <Typography
                variant="span"
                component="span"
                fontWeight="bold"
                fontSize="18px"
                paddingBottom={isMobile ? "10px" : null}
              >
                Aptitude Test
              </Typography>
              <StyledButton variant="main" onClick={AptitudeTestURL}>
                Start Test
              </StyledButton>
            </Stack>
            <Stack
              flexDirection={isMobile ? "column" : "row"}
              justifyContent="space-between"
              alignItems="stretch"
            >
              <TextField
                type="text"
                variant="outlined"
                label="Enter your test results"
                name="aptitudeText"
                onChange={handleChange}
                sx={isMobile ? { width: "100%", marginBottom: "15px" } : {}}
                value={formData.aptitudeText}
                size="small"
              />
              <StyledButton
                variant={!formData.aptitudeFile ? "outlined" : "completed"}
                component="label"
              >
                Upload Screenshot
                <FileBase64
                  type="file"
                  multiple={false}
                  name="aptitudeFile"
                  maxFileSize={5242880}
                  onDone={({ base64, file }) => {
                    dispatch({
                      type: "UPDATE_FORM_DATA",
                      payload: { aptitudeFile: file },
                    });

                    setNotificationHandle({
                      open: true,
                      type: "info",
                      text: "Aptitude test file uploaded",
                    });
                  }}
                />
              </StyledButton>
            </Stack>
          </Stack>
          <Divider />
          <Stack spacing={2}>
            <Stack
              flexDirection={isMobile ? "column" : "row"}
              justifyContent="space-between"
              alignItems="stretch"
            >
              <Typography
                variant="span"
                component="span"
                fontWeight="bold"
                fontSize="18px"
                paddingBottom={isMobile ? "15px" : null}
              >
                DISC Test
              </Typography>
              <StyledButton variant="main" onClick={discTestURL}>
                Start Test
              </StyledButton>
            </Stack>
            <Stack
              flexDirection={isMobile ? "column" : "row"}
              justifyContent="space-between"
              alignItems="stretch"
            >
              <TextField
                type="text"
                variant="outlined"
                label="Enter your test results"
                name="discText"
                onChange={handleChange}
                value={formData.discText}
                size="small"
                sx={isMobile ? { width: "100%", marginBottom: "15px" } : {}}
              />

              <StyledButton
                variant={!formData.discFile ? "outlined" : "completed"}
                component="label"
              >
                Upload Screenshot
                <FileBase64
                  type="file"
                  multiple={false}
                  name="discFile"
                  maxFileSize={5242880}
                  onDone={({ base64, file }) => {
                    dispatch({
                      type: "UPDATE_FORM_DATA",
                      payload: { discFile: file },
                    });

                    setNotificationHandle({
                      open: true,
                      type: "info",
                      text: "Disc test file uploaded",
                    });
                  }}
                />
              </StyledButton>
            </Stack>
          </Stack>
          <Divider />
          <Stack spacing={2}>
            <Stack
              flexDirection={isMobile ? "column" : "row"}
              justifyContent="space-between"
              alignItems="stretch"
            >
              <Typography
                variant="span"
                component="span"
                fontWeight="bold"
                fontSize="18px"
                paddingBottom={isMobile ? "15px" : null}
              >
                English Proficiency Test
              </Typography>
              <StyledButton variant="main" onClick={englishTestURL}>
                Start Test
              </StyledButton>
            </Stack>
            <Stack
              flexDirection={isMobile ? "column" : "row"}
              justifyContent="space-between"
              alignItems="stretch"
            >
              <TextField
                type="text"
                variant="outlined"
                label="Enter your test results"
                name="englishText"
                sx={isMobile ? { width: "100%", marginBottom: "15px" } : {}}
                onChange={handleChange}
                value={formData.englishText}
                size="small"
              />
              <StyledButton
                variant={!formData.englishFile ? "outlined" : "completed"}
                component="label"
              >
                Upload Screenshot
                <FileBase64
                  type="file"
                  multiple={false}
                  name="englishFile"
                  maxFileSize={5242880}
                  onDone={({ base64, file }) => {
                    dispatch({
                      type: "UPDATE_FORM_DATA",
                      payload: { englishFile: file },
                    });

                    setNotificationHandle({
                      open: true,
                      type: "info",
                      text: "English proficiency test file uploaded",
                    });
                  }}
                />
              </StyledButton>
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

export default AptitudeTests;
