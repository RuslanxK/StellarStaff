import { useTheme } from "@emotion/react";
import { Box, Typography, Stack, useMediaQuery, Button } from "@mui/material";
import * as React from "react";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "@emotion/styled";
import FileBase64 from "react-file-base64";
import { useState } from "react";
import Notification from "../Components/Notification";

const HardwareInspect = () => {
  const formData = useSelector((state) => state.app.formData);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check for mobile screens
  const [stepData, setStepData] = useOutletContext();
  const [notificationHandle, setNotificationHandle] = useState({});
  const [uploadedFileName, setUploadedFileName] = useState({
    internetSpeedFileName: "",
    singleImageHardwareFileName: "",
    hardwareFileCount: 0
  })

  useEffect(() => {
    setStepData({ name: "Hardware Inspect", count: 3, requiredFields: false });
  }, []);

  useEffect(() => {
    if (formData.hardwareTest !== "" && formData.internetSpeed !== "") {
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
  }, [formData.internetSpeed, formData.hardwareTest]);

  const dispatch = useDispatch();

  const isValidFileType = (type) => {
    return /^(image\/jpeg|image\/jpg|image\/png)$/i.test(type);
  };

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

  return (
    <Box
      boxShadow={[theme.shadows[11]]}
      border={theme.border}
      borderRadius={theme.borderRadius}
    >
      <Stack p={3} spacing={2}>
        <CustomButton
          variant="outlined"
          component="label"
          sx={{
            background:
              formData.hardwareTest.length > 0 && "#dfefe8 !important",
            color: formData.hardwareTest.length > 0 && "#00b43f !important",
            border: formData.hardwareTest.length > 0 && "none !important",
          }}
        >
          {!formData.hardwareTest.length > 0
            ? "Upload Hardware Screenshots"
            : `"${sessionStorage.getItem("hardwareFile")}" uploaded successfully`}
          <FileBase64
            type="file"
            multiple={true}
            name="hardwareTest"
            maxFileSize={2 * 1024 * 1024}
            onDone={(files) => {
              const hardwareImagesArray = files
                .map(({ base64, file }) => {
                  if (isValidFileType(file.type)) {

                    setNotificationHandle({
                      open: true,
                      type: "info",
                      text: "Files uploaded successfully!",
                    });
                    return {
                      file,
                    };
                  } else {
                    setNotificationHandle({
                      open: true,
                      type: "error",
                      text: "Invalid file type. Please select a JPEG, JPG or PNG file.",
                    });
                    return null;
                  }
                })
                .filter(Boolean);
                if (hardwareImagesArray.length === 1) {
                  sessionStorage.setItem("hardwareFile", hardwareImagesArray[0].file.name);
                } else {
                  sessionStorage.setItem("hardwareFile", hardwareImagesArray.length + " " + "Files");
                }
                
              dispatch({
                type: "UPDATE_FORM_DATA",
                payload: { hardwareTest: hardwareImagesArray },
              });
            }}
          />
        </CustomButton>
        <CustomButton
          variant="outlined"
          component="label"
          sx={{
            background: formData.internetSpeed !== "" && "#dfefe8 !important",
            color: formData.internetSpeed !== "" && "#00b43f !important",
            border: formData.internetSpeed !== "" && "none !important",
          }}
        >
          {!formData.internetSpeed
            ? "Upload internet speed screenshot"
            : `"${sessionStorage.getItem("internetSpeedFile")}" uploaded successfully.`}
            
          <FileBase64
            type="file"
            multiple={false}
            name="internetSpeed"
            maxFileSize={5242880}
            onDone={({ base64, file }) => {
              if (!isValidFileType(file.type)) {
                setNotificationHandle({
                  open: true,
                  type: "error",
                  text: "Invalid file type. Please select a JPEG, JPG or PNG file.",
                });
                return;
              } else {
                sessionStorage.setItem("internetSpeedFile", file.name);
                dispatch({
                  type: "UPDATE_FORM_DATA",
                  payload: { internetSpeed: file },
                });
                setNotificationHandle({
                  open: true,
                  type: "info",
                  text: "Files uploaded successfully!",
                });
               
              }
            }}
          />
        </CustomButton>
      </Stack>
      {notificationHandle.open && (
        <Notification
          notification={notificationHandle}
          onClose={() => setNotificationHandle({})}
        />
      )}
    </Box>
  );
};

export default HardwareInspect;
