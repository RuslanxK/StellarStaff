import { useTheme } from "@emotion/react";
import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "@emotion/styled";
import Education from "./Education";
import FileBase64 from "react-file-base64";
import Notification from "../Components/Notification";

const PersonalInformation = () => {
  const formData = useSelector((state) => state.app.formData);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [stepData, setStepData] = useOutletContext();
  const [dateValidationChild, setDateValidationChild] = useState({});
  const [notificationHandle, setNotificationHandle] = useState({});


  useEffect(() => {
    setStepData({
      name: "Personal Information",
      count: 1,
      requiredFields: false,
    });
  }, []);

  useEffect(() => {
   
    if (
      formData.address &&
      formData.city &&
      formData.country &&
      formData.education[0].collageUniversity &&
      formData.education[0].educationTitle &&
      formData.education[0].toDate &&
      formData.profileImage
    ) {
      setStepData((prevStepData) => ({
        ...prevStepData,
        requiredFields: true,
      }));
    } else if (
      formData.address &&
      formData.city &&
      formData.country &&
      formData.noEducation &&
      formData.profileImage
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
    formData.address,
    formData.city,
    formData.country,
    formData.education[0].collageUniversity,
    formData.education[0].educationTitle,
    formData.education[0].toDate,
    formData.noEducation,
    formData.profileImage,
    dateValidationChild,
  ]);

  const dispatch = useDispatch();


  const applicationDataUpdate = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "UPDATE_FORM_DATA", payload: { [name]: value } });
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


  const isValidFileType = (type) => {
    return /^(image\/jpeg|image\/jpg|image\/png)$/i.test(type);
  };

  return (
    <Box
      boxShadow={[theme.shadows[11]]}
      border={theme.border}
      borderRadius={theme.borderRadius}
      p={4}
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "60px",
        gap: "20px",
      }}
    >
      <CustomButton
        variant="outlined"
        component="label"
        sx={{
          background: formData.profileImage !== "" && "#dfefe8 !important",
          color: formData.profileImage !== "" && "#00b43f !important",
          border: formData.profileImage !== "" && "none !important",
        }}
      >
        {!formData.profileImage
          ? "Upload Profile Image"
          : `"${sessionStorage.getItem("profileImageFile")}" Uploaded successfully.`}
        <FileBase64
          type="file"
          multiple={false}
          name="profileImage"
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
              sessionStorage.setItem("profileImageFile", file.name);
              dispatch({
                type: "UPDATE_FORM_DATA",
                payload: { profileImage: file },
              });
              setNotificationHandle({
                open: true,
                type: "info",
                text: "Image uploaded successfully!",
              });
            }
          }}
        />
      </CustomButton>
      <Stack width="100%" spacing={2} textAlign="center">
        <Typography
          variant={isMobile ? "h6" : "h5"}
          component="h5"
          fontWeight={800}
        >
          Location
        </Typography>
        <TextField
          type="text"
          variant="outlined"
          label="Address"
          name="address"
          required
          value={formData.address}
          onChange={applicationDataUpdate}
        />
        <Stack flexDirection={isMobile ? "column" : "row"} columnGap={2}>
          <TextField
            type="text"
            variant="outlined"
            label="City"
            name="city"
            value={formData.city}
            onChange={applicationDataUpdate}
            required
            sx={{ flex: 1, marginBottom: "15px" }}
          />
          <TextField
            type="text"
            variant="outlined"
            label="County"
            name="country"
            value={formData.country}
            required
            sx={{ flex: 1 }}
            onChange={applicationDataUpdate}
          />
        </Stack>
      </Stack>
      <Box>
        <Education />
      </Box>
      {notificationHandle.open && (
        <Notification
          notification={notificationHandle}
          onClose={() => setNotificationHandle({})}
        />
      )}
    </Box>
  );
};

export default PersonalInformation;
