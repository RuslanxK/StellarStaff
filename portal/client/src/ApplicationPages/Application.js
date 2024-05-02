import { useTheme } from "@emotion/react";
import { HelpOutline } from "@mui/icons-material";
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  useMediaQuery,
} from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import MobileStepper from "@mui/material/MobileStepper";
import StyledButton from "../MainPages/StyledButton";
import { useEffect } from "react";
import axios from "axios";
import {
  updateVAUrl,
  updateVAapplicationFileUpload,
  updateVAapplicationUpload,
} from "../ApiUrls";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";
import { getVaByIdUrl } from "../ApiUrls";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ContactVaForm from "../MainPages/ContactVaForm";
import Notification from "../Components/Notification";
import LoadingScreen from "../Components/LoadingScreen";

const Application = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check for mobile screens
  

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const formData = useSelector((state) => state.app.formData);

  const vaId = Cookies.get("vaId");

  const [UserData, setUserData] = useState({});
  const [activeStep, setActiveStep] = useState(1);
  const [stepData, setStepData] = useState({});
  const [Test, setTest] = useState("");
  const [steps, setSteps] = useState([
    "About",
    "Career",
    "Hardware",
    "Enhance",
    "Identify",
    "Assessment",
    "Legal",
  ]);
  const [openPopup, setOpenPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notificationHandle, setNotificationHandle] = useState({});

  const handleNext = () => {
    setActiveStep(activeStep + 1);
    setTest("hello");
  };

  const handlePopUpClose = () => {
    setOpenPopup(false);
  };

  const handlePopUpOpen = () => {
    setOpenPopup(true);
  };

  useEffect(() => {
    const fetchVa = async () => {
      const { data } = await axios.get(getVaByIdUrl(vaId));
      dispatch({
        type: "UPDATE_FORM_DATA",
        payload: {
          fullname: data.fullname,
          email: data.email,
          phone: data.phone,
          coverLetterText: data.coverLetterText,
        },
      });
    };

    fetchVa();
  }, []);

  useEffect(() => {
    console.log(stepData);
    switch (activeStep) {
      case 1:
        navigate("");
        break;
      case 2:
        navigate("abilities");
        break;
      case 3:
        navigate("hardware-inspect");
        break;
      case 4:
        navigate("app-improvement");
        break;
      case 5:
        navigate("introducing-yourself");
        break;
      case 6:
        navigate("aptitude-tests");
        break;
      case 7:
        navigate("legal-documents");
        break;
      default:
        // Handle the default case if needed
        break;
    }
  }, [activeStep]);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinish = async () => {
    try {
      setLoading(true);
      const video = formData.videoData !== "" ? formData.videoData : formData.recordedVideo;
      
      const videoLink = await axios.put(updateVAapplicationUpload(vaId), video);

      const files = {
        internetSpeed: formData.internetSpeed,
        hardwareTest: formData.hardwareTest,
        profileImage: formData.profileImage,
        newResumePdf: formData.newResumePdf,
        aptitudeFile: formData.aptitudeFile,
        discFile: formData.discFile,
        englishFile: formData.englishFile,
        personalIdFile: formData.personalIdFile,
        governmentTax: formData.governmentTax,
        vsnWaiver: formData.vsnWaiver,
      };

      let formDataNew = new FormData();

      Object.entries(files).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formDataNew.append(key, item.file);
          });
        } else {
          formDataNew.append(key, value);
        }
      });

      const respS3Obj = await axios.put(
        updateVAapplicationFileUpload(vaId),
        formDataNew
      );

      const nonEmptyFormData = {};
      for (const [key, value] of Object.entries(formData)) {
        if (value !== "") {
          nonEmptyFormData[key] = value;
        }
      }

      const tempDictionary = {};

      respS3Obj.data.forEach((obj) => {
        for (const [key, value] of Object.entries(obj)) {
          if (!tempDictionary[key]) {
            tempDictionary[key] = [];
          }
          tempDictionary[key].push(value);
        }
      });

      nonEmptyFormData["hardwareTest"] = [];

      for (const [key, values] of Object.entries(tempDictionary)) {
        if (values.length > 1) {
          nonEmptyFormData["hardwareTest"].push(...values);
        } else {
          nonEmptyFormData[key] = values[0];
        }
      }
      nonEmptyFormData.videoData = videoLink.data;
      console.log(nonEmptyFormData);

      const { data } = await axios.put(updateVAUrl(vaId), nonEmptyFormData);
      if (data) {
        Cookies.set("status", "Application Pending");
        Cookies.set("completedApplication", "true");
        setNotificationHandle({
          open: true,
          type: "info",
          text: "Successfully Completed!",
        });
        setTimeout(() => {
          navigate("/status");
          setLoading(false);
        }, 1500);
      }
    } catch (error) {
      setLoading(false);
      setNotificationHandle({
        open: true,
        type: "error",
        text: "Something Went Wrong",
      });
    }
  };

  return (
    <>
      {loading && <LoadingScreen />}
      { !loading ? <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: 5,
          alignItems: "center",
          justifyContent: "flex-start",
          
        }}
      >
        <Stack
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={1}
         
        >
          <Stack flexDirection="row" gap={isMobile ? 0.5 : 1}>
            {steps.map((item, index) => (
              <Typography
                variant="span"
                component="span"
                key={index}
                sx={{
                  backgroundColor: theme.palette.background.lightPurple,
                  color: theme.palette.text.black,
                  fontSize: isMobile ? "7px" : "13px",
                  padding: isMobile ? "1px 9px" : "5px 20px",
                  borderRadius: theme.borderRadius,
                  opacity: index + 1 === activeStep ? 1 : 0.2,
                  
                }}
              >
                {item}
              </Typography>
            ))}
          </Stack>
          <MobileStepper
            variant="progress"
            steps={8}
            position="static"
            activeStep={activeStep}
            sx={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "transparent",
              boxShadow: "none",
              width: "100%",
              "& .MuiMobileStepper-progress": {
                height: 10,
                width: "100%",
                borderRadius: "6px",
              },
            }}
          />
        </Stack>
        <Stack
          direction="column"
          gap="40px"
          alignItems="center"
          justifyContent="center"
        >
          <Stack
            flex={1}
            spacing={2}
            alignItems="center"
            width={isMobile ? null : 500}
          >
            <Typography
              variant="h4"
              component="h1"
              fontWeight={600}
              textAlign="center"
            >
              {stepData.name}
            </Typography>
            <Typography variant="p" component="p" textAlign="center">
              {activeStep === 1
                ? "Enter your personal info, making sure it's up-to-date."
                : activeStep === 2
                ? "Share your skill set, experience and abilities and for the selected position."
                : activeStep === 3
                ? "Provide Details About Your Hardware"
                : activeStep === 4
                ? "Congrats on completing the first application steps! AI will now improve your resume"
                : activeStep === 5
                ? "Create a brief video introducing yourself and showcasing your personality. This is your chance to let us get to know you better."
                : activeStep === 6
                ? "Complete the following tests and upload your results to help us understand your problem-solving skills, communication abilities, and overall fit for the role."
                : activeStep === 7
                ? "Submit Your Documents to Complete Your Application. Your Data is Secure and Protected"
                : ""}
            </Typography>
          </Stack>
          <Box flex={1} width={isMobile ? null : stepData.count === 5 ? 800 : 600} p={2}>
            <Outlet context={[stepData, setStepData]} />
          </Box>
        </Stack>
        <Stack
          flexDirection="column"
          alignItems="center"
          width={400}
          mb={5}
          gap={2}
        >
          <Stack flexDirection="row" columnGap={2} flex={1}>
            <StyledButton
              sx={{ width: 150 }}
              variant="secondary"
              onClick={handleBack}
              disabled={activeStep === 1}
            >
              Back
            </StyledButton>
            {activeStep === 7 ? (
              <StyledButton
                sx={{ width: 150 }}
                variant="main"
                onClick={handleFinish}
                disabled={!stepData.requiredFields}
              >
                Finish
              </StyledButton>
            ) : (
              <StyledButton
                sx={{ width: 150 }}
                variant="main"
                disabled={!stepData.requiredFields}
                onClick={handleNext}
              >
                Next
              </StyledButton>
            )}
          </Stack>
          <Stack direction="row" columnGap="5px" justifyContent="center">
            <HelpOutline />
            <Typography variant="p" component="p" fontWeight={600}>
            Questions or need assistance?
            </Typography>
            <Link fontWeight={600} onClick={handlePopUpOpen}>
              Contact Us
            </Link>
          </Stack>
        </Stack>

        <Dialog
          open={openPopup}
          onClose={() => setOpenPopup(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="lg"
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
        {notificationHandle.open && (
          <Notification
            notification={notificationHandle}
            onClose={() => setNotificationHandle({})}
          />
        )}
      </Container> : null }
    </>
  );
};

export default Application;
