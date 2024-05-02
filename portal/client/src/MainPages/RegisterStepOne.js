import { Container, Stack, TextField, useMediaQuery } from "@mui/material";
import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MuiAlert from "@mui/material/Alert";
import StyledButton from "./StyledButton";
import { useTheme } from "@emotion/react";
import Notification from "../Components/Notification";

const RegisterStepOne = () => {
  
  const [allInputsFilled, setAllInputsFilled] = useState(true);
  const [notificationHandle, setNotificationHandle] = useState({});

  const theme = useTheme();
  

  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isiPad = useMediaQuery(
    "(max-width: 1200px) and (orientation: landscape), (max-height: 1024px) and (orientation: portrait)"
  );

  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check for mobile screens

  const formData = useSelector((state) => state.app.formData);

  const desiredWidth = isMobile ? null : (isTablet || isiPad ? 700 : 800);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (
      formData.password &&
      formData.cPassword &&
      formData.email &&
      formData.phone &&
      formData.firstName &&
      formData.lastName
    ) {
      setAllInputsFilled(false);
    } else {
      setAllInputsFilled(true);
    }
  }, [
    formData.password,
    formData.cPassword,
    formData.email,
    formData.phone,
    formData.firstName,
    formData.lastName,
  ]);

  const handleNext = () => {
    if (formData.password !== formData.cPassword) {
      setNotificationHandle({
        open: true,
        type: "error",
        text: "Password don't match.",
      });
    } else {
      const phoneValid = /^(\+\d+)?[0-9\s]+$/.test(formData.phone);
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/g.test(formData.email);

      if (!phoneValid) {
        setNotificationHandle({
          open: true,
          type: "error",
          text: "This is not a valid phone number.",
        });
      } else if (!emailValid) {
        setNotificationHandle({
          open: true,
          type: "error",
          text: "This is not a valid email.",
        });
      } else {
        navigate("step-two");
      }
    }
  };

  useEffect(() => {
    const listener = (e) => {
      if (e.key === "Enter" && !allInputsFilled) {
        handleNext(e);
      }
    };

    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [handleNext]);

  const registerUserData = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "UPDATE_FORM_DATA", payload: { [name]: value } });
    console.log(formData);
  };

  return (
    <Container>
      <Stack spacing={2} >
        <Stack
          gap="15px"
          width={desiredWidth}
          flex={1}
          boxShadow={[theme.shadows[11]]}
          border={theme.border}
          borderRadius={theme.borderRadius}
          p={4}
        >
          <Stack flexDirection={isMobile ? "column" : "row"} gap={2}>
            <TextField
              type="text"
              variant="outlined"
              label="First name"
              required
              value={formData.firstName}
              name="firstName"
              onChange={registerUserData}
              fullWidth
            />
            <TextField
              type="text"
              variant="outlined"
              label="Last name"
              required
              value={formData.lastName}
              name="lastName"
              onChange={registerUserData}
              fullWidth
            />
          </Stack>
          <Stack flexDirection={isMobile ? "column" : "row"} gap={2}>
            <TextField
              type="tel"
              variant="outlined"
              required
              label="Phone Number"
              value={formData.phone}
              name="phone"
              onChange={registerUserData}
              fullWidth
            />
            <TextField
              type="email"
              variant="outlined"
              label="Email"
              required
              value={formData.email}
              name="email"
              onChange={registerUserData}
              fullWidth
            />
          </Stack>
          <Stack flexDirection={isMobile ? "column" : "row"} gap={2}>
            <TextField
              type="password"
              variant="outlined"
              label="Password"
              required
              value={formData.password}
              name="password"
              onChange={registerUserData}
              fullWidth
            />
            <TextField
              type="password"
              variant="outlined"
              value={formData.cPassword}
              name="cPassword"
              required
              onChange={registerUserData}
              fullWidth
              label="Confirm Password"
            />
          </Stack>
          <StyledButton
            disabled={allInputsFilled}
            onClick={handleNext}
            type="button"
            variant="main"
          >
            Next
          </StyledButton>
        </Stack>
      </Stack>
      {notificationHandle.open && (
        <Notification
          notification={notificationHandle}
          onClose={() => setNotificationHandle({})}
        />
      )}
    </Container>
  );
};

export default RegisterStepOne;
