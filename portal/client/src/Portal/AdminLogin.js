import { useTheme } from "@emotion/react";
import StyledButton from "../MainPages/StyledButton";
import {
  Box,
  Container,
  Typography,
  Stack,
  Link,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  useMediaQuery,
} from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import MuiAlert from "@mui/material/Alert";
import { adminLoginUrl } from "../ApiUrls";
import Notification from "../Components/Notification";
import LoadingScreen from "../Components/LoadingScreen";

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check for mobile screens

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const navigate = useNavigate();
  const [adminLogin, setAdminLogin] = useState({});

  const [notificationHandle, setNotificationHandle] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminLogin({ ...adminLogin, [name]: value });
  };

  const Login = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await axios.post(adminLoginUrl, adminLogin);

      if (data) {
        Cookies.set("token", data.token, { expires: 1 });
        Cookies.set("isAdmin", data.Admin.isAdmin, { expires: 1 });
        Cookies.set("username", data.Admin.username, { expires: 1 });
        Cookies.set("_id", data.Admin._id, { expires: 1 });

        if (data.Admin.isAdmin && data.token) {
          setNotificationHandle({
            open: true,
            type: "info",
            text: "Successfully logged in.",
          });

          setTimeout(() => {
            navigate("/panel");
            setLoading(false);
          }, 1500);
        }
      }
    } catch (error) {
      setLoading(false);
      setNotificationHandle({
        open: true,
        type: "error",
        text: "Incorrect username or password",
      });
    }
  };

  return (
    <>
      {loading && <LoadingScreen />}
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: 5,
          padding: "40px",
          justifyContent: isMobile ? null : "center",
          alignItems: isMobile ? null : "center",
        }}
      >
        <Stack
          direction="column"
          gap="40px"
          boxShadow={theme.shadows[11]}
          p={4}
        >
          <Stack flex={1} spacing={3} justifyContent="center">
            <Typography variant="h5" component="h1" fontWeight={600}>
              Login
            </Typography>
            <Box>
              <form onSubmit={Login}>
                <Stack
                  spacing={2.5}
                  alignItems={isMobile ? "stretch" : "flex-end"}
                >
                  <Stack spacing={2} direction={isMobile ? "column" : "row"}>
                    <TextField
                      type="text"
                      variant="outlined"
                      label="Username"
                      name="username"
                      onChange={handleChange}
                    />
                    <TextField
                      type="password"
                      variant="outlined"
                      label="Password"
                      name="password"
                      onChange={handleChange}
                    />
                  </Stack>
                  <Stack
                    alignItems="center"
                    direction={isMobile ? "column" : "row"}
                    justifyContent="space-between"
                    spacing={2}
                    width="100%"
                  >
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Remember my account"
                      />
                    </FormGroup>
                    <Link>Forgot Your Password</Link>
                  </Stack>
                  <StyledButton
                    type="submit"
                    variant="main"
                    sx={{ width: "100%" }}
                  >
                    Login
                  </StyledButton>
                </Stack>
              </form>
            </Box>
          </Stack>
        </Stack>
        {notificationHandle.open && (
          <Notification
            notification={notificationHandle}
            onClose={() => setNotificationHandle({})}
          />
        )}
      </Container>
    </>
  );
};

export default AdminLogin;
