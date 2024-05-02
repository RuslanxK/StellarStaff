import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { Box, Container, Typography, Stack, Button, useMediaQuery } from "@mui/material";
import * as React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HelpOutline } from "@mui/icons-material";
import { keyframes } from "@emotion/react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import StyledButton from "./StyledButton";
import Cookies from "js-cookie";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import ContactVaForm from "./ContactVaForm";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import axios from "axios";
import { getVaByIdUrl } from "../ApiUrls";
import Skeleton from "@mui/material/Skeleton";

const Status = () => {
  const theme = useTheme();

  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isiPad = useMediaQuery(
    "(max-width: 1200px) and (orientation: landscape), (max-height: 1024px) and (orientation: portrait)"
  );
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const fullname = Cookies.get("fullname");
  const vaId = Cookies.get("vaId");

  const desiredWidth = isMobile ? null : isTablet || isiPad ? 500 : 700;

  const [userStatus, setUserStatus] = useState("");
  const [openPopup, setOpenPopup] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get(getVaByIdUrl(vaId));

      setUserStatus(data.status);
    };

    getData();
  }, []);

  const heartbeatAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
`;

  const StatusIcon = styled(
    userStatus === "New Applicant" || userStatus === "Application Pending"
      ? ErrorOutlineIcon
      : userStatus === "Passed initial screening"
      ? CheckCircleOutlineIcon
      : userStatus === "Did not passed initial screening"
      ? HighlightOffIcon
      : userStatus === "Rejected"
      ? HighlightOffIcon
      : userStatus === "Added to candidate poll"
      ? CheckCircleOutlineIcon
      : userStatus === "Approved"
      ? CheckCircleOutlineIcon
      : "Error"
  )(() => ({
    fontSize: "55px",
    color:
      userStatus === "New Applicant" || userStatus === "Application Pending"
        ? "#ADADAD"
        : userStatus === "Rejected" || userStatus === "Did not passed initial screening"
        ? "#C61F1F"
        : userStatus === "Approved" ||
          userStatus === "Added to candidate poll" ||
          userStatus === "Passed initial screening"
        ? "#58B12F"
        : "black",
    animation: `${heartbeatAnimation} 2s infinite`,
  }));

  const navigate = useNavigate();

  const handleChange = (newFiles) => {
    navigate("/status");
  };

  const handlePopUpClose = () => {
    setOpenPopup(false);
  };

  const handlePopUpOpen = () => {
    setOpenPopup(true);
  };

  const meetingSchedule = () => {
    window.open(
      "https://link.alwaysconvert.com/widget/bookings/initial-screening",
      "_blank"
    );
  };

  return (
    <Container
      sx={{
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack
        direction={isMobile || isTablet || isiPad ? "column" : "row"}
        width={desiredWidth}
        justifyContent={"space-between"}
        alignItems="center"
        p={2}
        gap={2}
      >
        <Stack spacing={3} flex={3}>
          <Stack spacing={1}>
            <Typography variant="p" component="p">
              Welcome,
            </Typography>
            {userStatus ? (
              <Typography variant={isMobile ? "h4" : "h3"} component="h1" fontWeight={600}>
                {fullname}
              </Typography>
            ) : (
              <Skeleton variant="rounded" width="80%" height={30} />
            )}
            {userStatus ? (
              <Box width={isMobile || isTablet || isiPad ? null : 500}>
                <Typography variant="h6" component="span" color={theme.palette.primary.green}>
                  {userStatus === "New Applicant"
                    ? "Your Big Moment is Coming"
                    : userStatus === "Application Pending"
                    ? "Congratulations! Your Application is Complete."
                    : userStatus === "Approved"
                    ? "Your account has been approved"
                    : userStatus === "Passed initial screening"
                    ? "Interview Passed!"
                    : userStatus === "Rejected" || userStatus === "Did not passed initial screening"
                    ? "Thank you for taking part in the application process!"
                    : userStatus === "Added to candidate poll"
                    ? "Application Approved! Let's Begin your Onboarding."
                    : "Status error"}
                </Typography>
                <Typography variant="p" component="p">
                  {userStatus === "New Applicant"
                    ? "We're reviewing your application. Expect to hear from us soon."
                    : userStatus === "Approved"
                    ? "Congratulations! We are pleased to inform you that your account has been successfully approved. To move forward in the process, please click on the button below to schedule your interview. This is an important step to secure your spot. We look forward to meeting you soon!"
                    : userStatus === "Application Pending"
                    ? "Our team will get back to you with a final confirmation within 24 hours."
                    : userStatus === "Passed initial screening"
                    ? "Now, take the next steps to complete your application."
                    : userStatus === "Rejected" || userStatus === "Did not passed initial screening"
                    ? "After careful consideration, we regret to inform you that your application was not selected to move forward in the current hiring process. We appreciate your interest and the effort you put into your application. Although your qualifications were impressive, we faced a tough decision and encourage you to pursue opportunities that match your career goals. We believe in fostering a culture of growth and development, and as such, we invite you to reapply for future positions after a 60-day period to maintain a fair and competitive hiring process. In the meantime, continue enhancing your skills and experience, which may strengthen your qualifications for potential future opportunities with us."
                    : userStatus === "Added to candidate poll"
                    ? "Great news! Your application has been approved. We are thrilled to welcome you aboard. Expect a message from our team to begin the onboarding process. This will include all the necessary information and steps to get you started and integrated into our team smoothly. Keep an eye on your inbox and welcome aboard!"
                    : "Status error"}
                </Typography>
                {userStatus === "Rejected" || userStatus === "Did not pass initial screening" ? (
                  <Stack gap={2}>
                    <Typography mt={4}>
                      We are still here for you:
                      <a href="https://youtu.be/_7Cj-f0hIXo">https://youtu.be/_7Cj-f0hIXo</a>
                    </Typography>
                    <Typography fontWeight={600}>
                      You may check out these resources that may be helpful for your future
                      interviews
                    </Typography>
                    <a href="https://www.youtube.com/c/SelfMadeMillennial">
                      - Self Made Millennial
                    </a>
                    <a href="https://www.youtube.com/channel/UCvn_XCl_mgQmt3sD753zdJA">
                      - Rachel's English
                    </a>
                    <a href="https://www.poised.com/">
                      - Poised - Free AI-Powered Communication Coach
                    </a>
                    <Typography variant="p" component="p">
                      Thank you again for applying. We wish you every success in your job search and
                      hope that our paths may cross again in the future!
                    </Typography>
                  </Stack>
                ) : null}
              </Box>
            ) : (
              <Stack width={isMobile || isTablet || isiPad ? null : 500} gap={1}>
                <Skeleton variant="rounded" width="100%" height={30} />
                <Skeleton variant="rounded" width="100%" height={30} />
              </Stack>
            )}
          </Stack>
          {userStatus === "Approved" ? (
            <Stack direction="column" spacing={1} alignItems="flex-start">
              <StyledButton variant="secondary" onClick={meetingSchedule}>
                Schedule a meeting
              </StyledButton>
            </Stack>
          ) : userStatus === "Passed initial screening" ? (
            <Stack direction="column" spacing={1} alignItems="flex-start">
              <StyledButton variant="main" onClick={() => navigate("/application")}>
                Proceed with the application
              </StyledButton>
            </Stack>
          ) : null}
        </Stack>
        <Stack
          borderRadius={theme.borderRadius}
          justifyContent="center"
          alignItems="center"
          flex={isMobile ? null : 1}
          height={isMobile ? 150 : null}
          width={isMobile ? 200 : null}
          boxShadow={theme.shadows[11]}
          mt={isMobile ? 3 : 2}
          p={isTablet || isiPad ? 4 : 4}
        >
          <StatusIcon></StatusIcon>
          {userStatus ? (
            <Typography variant="h6" component="span">
              {userStatus === "New Applicant" || userStatus === "Application Pending"
                ? "Pending"
                : userStatus === "Approved"
                ? "Approved"
                : userStatus === "Passed initial screening"
                ? "Passed"
                : userStatus === "Did not passed initial screening"
                ? "Rejected"
                : userStatus === "Rejected"
                ? "Rejected"
                : userStatus === "Added to candidate poll"
                ? "Approved"
                : "Status error"}
            </Typography>
          ) : (
            <Skeleton variant="rounded" width="50%" height={20} sx={{ marginTop: "10px" }} />
          )}
        </Stack>
      </Stack>
      <Box
        width={isMobile || isTablet || isiPad ? null : 700}
        sx={{ backgroundColor: "#F5F5F5" }}
        p={4}
        mt={5}
        mb={isMobile ? 5 : null}
      >
        <Stack direction={isMobile ? "column" : "row"} columnGap="5px">
          <HelpOutline />
          <Typography variant="p" component="p" fontWeight={600}>
            Need assistance or feedback?
          </Typography>
          <Link fontWeight={600} onClick={handlePopUpOpen}>
            Contact Us
          </Link>
        </Stack>
        <Typography variant="p" component="p" mt={2}>
          Our team's ready to help you out.
        </Typography>
      </Box>

      <Dialog
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogActions sx={{ position: "absolute", top: 10, right: 0 }}>
          <Button onClick={handlePopUpClose}>
            <HighlightOffIcon />
          </Button>
        </DialogActions>
        <DialogContent>
          <ContactVaForm />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Status;
