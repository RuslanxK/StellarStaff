import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { HelpOutline } from "@mui/icons-material";
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Card,
  CardMedia,
  CardContent,
  Link,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  useMediaQuery,
  DialogTitle,
} from "@mui/material";
import * as React from "react";
import { useState } from "react";
import OfficeImage from "../Resources/OfficeImage.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { loginClient } from "../ApiUrls";
import { useDispatch } from "react-redux";
import Notification from "../Components/Notification";
import LoadingScreen from "../Components/LoadingScreen";

const LoginClient = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check for mobile screens

  const [clientLogin, setClientLogin] = useState({});
  const [clientRememberCheck, setClientRememberCheck] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [notificationHandle, setNotificationHandle] = useState({});
  const [loading, setLoading] = useState(false);

  const MainButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.white,
    "&:hover": {
      backgroundColor: theme.palette.primary.green,
    },
    padding: "8px 25px",
  }));

  const loginData = (e) => {
    const { name, value } = e.target;
    setClientLogin({ ...clientLogin, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { data } = await axios.post(loginClient, clientLogin);

      if (data) {
        const expirationDays = clientRememberCheck ? 30 : 1;

        Cookies.set("client-firstName", data.Recruiter.firstName, { expires: expirationDays });
        Cookies.set("clientId", data.Recruiter._id, { expires: expirationDays });
        Cookies.set("clientToken", data.token, { expires: expirationDays });

        if (data.token) {
          setNotificationHandle({
            open: true,
            type: "info",
            text: "Successfully logged in!",
          });

          setTimeout(() => {
            navigate("/client/dashboard");
            setLoading(false);
          }, 1500);
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setNotificationHandle({
        open: true,
        type: "error",
        text: "Incorrect email or password.",
      });
    }
  };

  const handlePopUpClose = () => {
    setOpenPopup(false);
  };

  const handlePopUpOpen = () => {
    setOpenPopup(true);
  };

  return (
    <>
      {loading && <LoadingScreen />}
      {!loading ? (
        <Container
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            rowGap: isMobile ? "20px" : "5px", // Adjust padding for mobile
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Stack
            direction={isMobile ? "column" : "row"}
            gap={isMobile ? "10px" : "40px"}
            p={isMobile ? 2 : 4}
          >
            <Stack flex={1} spacing={2} justifyContent="center">
              <Typography variant="p" component="p">
                Welcome Back!
              </Typography>
              <Typography variant={isMobile ? "h4" : "h3"} component="h1" fontWeight={600}>
                Login
              </Typography>
              <Typography variant="p" component="p">
                Access your account to continue your journey with us. Your future awaits.
              </Typography>
              <Stack direction="row" alignItems="center" columnGap="10px" pb="10px">
                <HelpOutline />
                <Typography variant="p" component="p" fontWeight={600}>
                  Need assistant?
                </Typography>
                <Link fontWeight={600} onClick={handlePopUpOpen}>
                  Contact Us
                </Link>
              </Stack>
              <Box>
                <form onSubmit={handleSubmit}>
                  <Stack
                    spacing={isMobile ? "20px" : "20px"}
                    alignItems={isMobile ? "stretch" : "flex-start"}
                  >
                    <Stack
                      spacing={isMobile ? "20px" : "20px"}
                      direction={isMobile ? "column" : "row"}
                    >
                      <TextField
                        type="email"
                        variant="outlined"
                        label="Email"
                        value={clientLogin.email}
                        name="email"
                        onChange={loginData}
                      />
                      <TextField
                        type="password"
                        variant="outlined"
                        label="Password"
                        value={clientLogin.password}
                        name="password"
                        onChange={loginData}
                      />
                    </Stack>
                    <Stack
                      alignItems="center"
                      justifyContent="space-between"
                      direction="row"
                      spacing={isMobile ? "0px" : "20px"}
                    >
                      <FormGroup>
                        <FormControlLabel
                          checked={clientRememberCheck}
                          control={
                            <Checkbox onChange={(e) => setClientRememberCheck(e.target.checked)} />
                          }
                          label="Remember me"
                        />
                      </FormGroup>
                      <Link>Forgot Password</Link>
                    </Stack>
                    <MainButton type="submit">Login</MainButton>
                  </Stack>
                </form>
              </Box>
            </Stack>
            <Box flex={1} pt={isMobile ? 4 : null} pb={isMobile ? 4 : null}>
              <Card
                sx={{
                  position: "relative",
                  boxShadow: theme.shadows[11],
                  borderRadius: theme.borderRadius,
                }}
              >
                <CardMedia
                  sx={{ height: isMobile ? "200px" : "300px" }}
                  image={OfficeImage}
                  title="video placeholder"
                />

                <CardContent sx={{ padding: isMobile ? "10px 20px" : "20px 40px" }}>
                  <Typography gutterBottom variant="h5" component="h3" fontWeight="bold">
                    Promising Fulfillment at Stellar Staff Now
                  </Typography>
                  <Typography variant="p" component="p">
                    At Stellar Staff Now, we are committed to creating a fulfilling work experience
                    for you.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Stack>

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

export default LoginClient;
