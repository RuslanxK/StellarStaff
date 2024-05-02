import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  TextareaAutosize,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  useMediaQuery,
} from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import FileBase64 from "react-file-base64";
import Notification from "../Components/Notification";

const RegisterStepTwo = () => {
  const [notificationHandle, setNotificationHandle] = useState({});

  const theme = useTheme();

  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isiPad = useMediaQuery(
    "(max-width: 1200px) and (orientation: landscape), (max-height: 1024px) and (orientation: portrait)"
  );

  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check for mobile screens

  const formData = useSelector((state) => state.app.formData);

  const dispatch = useDispatch();

  const CustomButton = styled(Button)`
    background: none;
    border: 2px dashed;
    border-radius: 0;
    border-color: black;
    color: black;
    box-shadow: none;
    width: 100%;
    height: 60px;
  `;

  const registerUserData = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "UPDATE_FORM_DATA", payload: { [name]: value } });
  };

  return (
    <Container>
      <Stack direction="column" gap="20px">
        <Stack
          flexDirection={isMobile ? "column" : "row"}
          justifyContent="center"
          alignItems="center"
          width={isMobile || isTablet || isiPad ? null : 800}
          gap={2}
          flex={1}
          boxShadow={[theme.shadows[11]]}
          border={theme.border}
          borderRadius={theme.borderRadius}
          p={4}
        >
          <TextField
            type="text"
            variant="outlined"
            label="Age"
            name="age"
            value={formData.age}
            required
            onChange={registerUserData}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="positionLabel">Position</InputLabel>
            <Select
              labelId="positionLabel"
              id="positionSelect"
              label="Position"
              value={formData.position}
              name="position"
              onChange={registerUserData}
            >
              <MenuItem value="FreeLancer">FreeLance</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="HelpDesk">HelpDesk</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Box
          flex={1}
          boxShadow={[theme.shadows[11]]}
          border={theme.border}
          borderRadius={theme.borderRadius}
        >
          <Stack p="40px" pb="0px" spacing={2}>
            <Typography variant="h5" component="h2" fontWeight="bold">
              Short Bio
            </Typography>
            <TextareaAutosize
              minRows={3}
              type="text"
              name="shortBio"
              value={formData.shortBio}
              required
              onChange={registerUserData}
              style={{
                border: theme.border,
                borderRadius: "6px",
                padding: "10px",
                fontSize: "15px",
              }}
            ></TextareaAutosize>
          </Stack>
          <Stack p="40px" pt="20px" spacing={2}>
            <Typography variant="h5" component="h2" fontWeight="bold">
              Cover Letter
            </Typography>
            <Typography variant="p" component="p">
              Send your cover letter. Highlight your fit for our positions.
            </Typography>
            <TextareaAutosize
              minRows={8}
              type="text"
              name="coverLetterText"
              value={formData.coverLetterText}
              required
              onChange={registerUserData}
              style={{
                border: theme.border,
                borderRadius: "6px",
                padding: "10px",
                fontSize: "15px",
              }}
            ></TextareaAutosize>

            <CustomButton
              variant="outlined"
              component="label"
              sx={{
                background: formData.coverLetterImage && "#dfefe8 !important",
                color: formData.coverLetterImage && "#00b43f !important",
                border: formData.coverLetterImage && "none !important",
              }}
            >
              {!formData.coverLetterImage
                ? "Upload PDF Resume"
                : `File "${sessionStorage["fileName"]}" uploaded successfully.`}
              <FileBase64
                type="file"
                multiple={false}
                name="coverLetterImage"
                onDone={({ base64, file }) => {
                  if (file.type !== "application/pdf") {
                    setNotificationHandle({
                      open: true,
                      type: "error",
                      text: "Only PDF files are allowed.",
                    });
                    return;
                  } else if (file.size > 10485760) {
                    setNotificationHandle({
                      open: true,
                      type: "error",
                      text: "File is too large, max file size is 10MB",
                    });
                    return;
                  }

                  const formData = new FormData();
                  formData.append(`coverLetterImage`, file);
                  dispatch({
                    type: "UPDATE_FORM_DATA",
                    payload: { coverLetterImage: formData },
                  });

                  setNotificationHandle({
                    open: true,
                    type: "info",
                    text: "File uploaded successfully!",
                  });

                  sessionStorage.setItem("fileName", file.name);
                }}
              />
            </CustomButton>
          </Stack>
        </Box>
      </Stack>
      {notificationHandle.open && (
        <Notification notification={notificationHandle} onClose={() => setNotificationHandle({})} />
      )}
    </Container>
  );
};

export default RegisterStepTwo;
