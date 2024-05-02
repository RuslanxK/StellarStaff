import { useTheme } from "@emotion/react";
import { Box, Container, Typography, Stack, useMediaQuery } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import { registerVa, updateVAUrl, updateVAapplicationFileUpload } from "../ApiUrls";
import StyledButton from "./StyledButton";
import Notification from "../Components/Notification";
import LoadingScreen from "../Components/LoadingScreen";

const Register = () => {
  const [notificationHandle, setNotificationHandle] = useState({});
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check for mobile screens

  const formData = useSelector((state) => state.app.formData);

  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.cPassword) {
      setNotificationHandle({
        open: true,
        type: "error",
        text: "Passwords don't match",
      });
    } else {
      try {
        setLoading(true);
        const newVa = {
          fullname: formData.fullname,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          coverLetterText: formData.coverLetterText,
          age: formData.age,
          position: formData.position,
          shortBio: formData.shortBio,
          status: "New Applicant",
        };

        const newVaCRM = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
        };

        const { data } = await axios.post(registerVa, newVa);

        await axios.post(
          "https://services.leadconnectorhq.com/hooks/XFGuHSsryGOJsmsmqkbB/webhook-trigger/4ef62096-4873-44af-8d64-1a7833d21eb5",
          newVaCRM
        );

        const resumeFile = formData.coverLetterImage;
        const fileLink = await axios.put(updateVAapplicationFileUpload(data.Va._id), resumeFile);
        const updatedCoverLink = {
          coverLetterImage: fileLink.data,
        };

        await axios.put(updateVAUrl(data.Va._id), updatedCoverLink);

        if (data) {
          Cookies.set("fullname", data.Va.fullname, { expires: 1 });
          Cookies.set("status", data.Va.status, { expires: 1 });
          Cookies.set("vaId", data.Va._id, { expires: 1 });
          Cookies.set("vaToken", data.token, { expires: 1 });
          Cookies.set("completedApplication", data.Va.completedApplication, {
            expires: 1,
          });

          setNotificationHandle({
            open: true,
            type: "info",
            text: "Successfully registered!",
          });

          setTimeout(() => {
            navigate("/status");
            setLoading(false);
          }, 1500);
        }
      } catch (error) {
        setNotificationHandle({
          open: true,
          type: "error",
          text: error.response.data.includes("E11000")
            ? "This email already existed"
            : "Register error",
        });
      }
    }
  };

  return (
    <>
      {loading && <LoadingScreen />}
      {!loading ? (
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: isMobile ? "10px" : "5px", // Adjust padding for mobile
            marginBottom: "20px",
            alignItems: "center", // Center align for mobile
            justifyContent: "center", // Center align for mobile
          }}
        >
          <form onSubmit={handleSubmit}>
            <Stack direction="column" spacing={isMobile ? 2 : 4}>
              <Stack flex={1} spacing={isMobile ? 1 : 2} justifyContent="center" textAlign="center">
                <Typography variant="h4" component="h1" fontWeight={600}>
                  {location.pathname === "/register/step-two"
                    ? "Nearly Finished! Start Your Stellar Journey."
                    : `Let's connect!`}
                </Typography>
                <Typography variant="p" component="p">
                  {location.pathname === "/register/step-two"
                    ? "Pick a position, drop your personal details and let's get you started!"
                    : `Enter Your Info to proceed with Sign Up`}
                </Typography>
              </Stack>
              <Box>
                <Outlet />
              </Box>
              <Stack flexDirection="row" justifyContent="center" gap={isMobile ? 1 : 2}>
                {location.pathname === "/register/step-two" ? (
                  <StyledButton
                    variant="outlined"
                    type="button"
                    onClick={() => navigate("/register")}
                  >
                    Back
                  </StyledButton>
                ) : (
                  ""
                )}
                {location.pathname === "/register/step-two" ? (
                  <StyledButton
                    disabled={
                      formData.coverLetterText &&
                      formData.coverLetterImage &&
                      formData.position &&
                      formData.age &&
                      formData.shortBio
                        ? false
                        : true
                    }
                    variant="main"
                    type="Submit"
                  >
                    Submit
                  </StyledButton>
                ) : (
                  ""
                )}
              </Stack>
            </Stack>
          </form>
          {notificationHandle.open && (
            <Notification
              notification={notificationHandle}
              onClose={() => setNotificationHandle({})}
            />
          )}
        </Container>
      ) : null}
    </>
  );
};

export default Register;
