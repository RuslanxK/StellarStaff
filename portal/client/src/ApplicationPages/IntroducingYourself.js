import { useTheme } from "@emotion/react";
import { Box, Typography, Stack, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import VideoRecordingComp from "./VideoRecordingComp";
import StyledButton from "../MainPages/StyledButton";
import VideocamIcon from "@mui/icons-material/Videocam";
import CircularProgress from "@mui/material/CircularProgress";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import FileBase64 from "react-file-base64";
import Notification from "../Components/Notification";
import styled from "@emotion/styled";

const IntroducingYourself = () => {
  const [startRecording, setStartRecording] = useState(false);
  const [stepData, setStepData] = useOutletContext();
  const [recordingFinished, setRecordingFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [notificationHandle, setNotificationHandle] = useState({});

  const formData = useSelector((state) => state.app.formData);

  const theme = useTheme();

  const dispatch = useDispatch();

  const isValidFileType = (type) => {
    return /^(video\/mp4|video\/avi|video\/mov|video\/wmv)$/i.test(type);
  };

  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check for mobile screens

  useEffect(() => {
    setStepData({ name: "Introducing Yourself", count: 5, requiredFields: false });
  }, []);

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log("MediaDevices API not supported");
      return;
    }

    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const cameraStatus = devices.some((device) => device.kind === "videoinput");
        if (cameraStatus) {
          setHasCamera(true);
        } else {
          setHasCamera(false);
        }
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
      });

    if (formData.videoData !== "" || formData.recordedVideo !== "") {
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
  }, [formData.videoData, formData.recordedVideo]);

  const handleStartRecording = () => {
    setLoading(true);
    setTimeout(() => {
      setStartRecording(true);
      setLoading(false);
    }, 2000);
    clearInterval();
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
    <Stack spacing={2}>
      <Box boxShadow={[theme.shadows[11]]} border={theme.border} borderRadius={theme.borderRadius}>
        <Stack p={4} spacing={2}>
          <Stack flexDirection="column" rowGap={2}>
            <Typography variant="h6" component="h6" fontWeight={600} textAlign="center">
              How to Create your Introduction Video:
            </Typography>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >

                <Typography><b>Step 1</b> - Open your Personal Zoom Account</Typography>
              </AccordionSummary>
              <AccordionDetails>
                - Click on New Meeting <br></br>
                <br></br>
                <img
                  src={process.env.REACT_APP_CLOUD_URL + "media_item.png"}
                  loading="lazy"
                  width={450}
                />
                <br></br>
                <br></br>- Download Stellar Staff's backgrounds package{" "}
                <a href="https://d9wb6j5xkbdxb.cloudfront.net/stellar%20staff%20backgrounds.zip">
                  Here
                </a>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
              >
                
                <Typography><b>Step 2</b> - Add the Stellar Staff's required background</Typography>
              </AccordionSummary>
              <AccordionDetails>
                - Right click on Zoom's screen <br></br>
                <br></br>- Click Choose Virtual Background <br></br>
                <br></br>
                <img
                  src={process.env.REACT_APP_CLOUD_URL + "media_item2.png"}
                  loading="lazy"
                  width={450}
                />
                <br></br>
                <br></br>- On pop-up, click on the "+" plus sign, then click on "Add Image"{" "}
                <br></br>
                <br></br>
                <img
                  src={process.env.REACT_APP_CLOUD_URL + "media_item3.png"}
                  loading="lazy"
                  width={450}
                />
                <br></br>
                <br></br>
                On next pop-up, choose the downloaded file for the Stellar Staff background, and hit
                Open
                <br></br>
                <br></br>
                <img
                  src={process.env.REACT_APP_CLOUD_URL + "media_item4.png"}
                  loading="lazy"
                  width={450}
                />
                <br></br>
                <br></br>
                Once background is applied, hit Exit.
                <br></br>
                <br></br>
                <img
                  src={process.env.REACT_APP_CLOUD_URL + "media_item5.png"}
                  loading="lazy"
                  width={450}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3-content"
                id="panel3-header"
              >
                <Typography>
                  {" "}
                  <b>Step 3 </b> - Record Yourself
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                Record Yourself by hitting the record feature on Zoom. You'll know it's recording if
                there's a recording status on the upper right corner of the video. Make sure camera
                and mic is on as shown on the below screenshots.
                <br></br>
                <br></br>
                <img
                  src={process.env.REACT_APP_CLOUD_URL + "media_item5.png"}
                  loading="lazy"
                  width={450}
                />
                <br></br>
                <br></br>
                <img
                  src={process.env.REACT_APP_CLOUD_URL + "media_item6.png"}
                  loading="lazy"
                  width={450}
                />
                <br></br>
                <br></br>
                Introduce Yourself in 1-2 minutes. Only include your Name and Last Name. Highlight
                your skills and experiences (Only based on the job description/order or related to
                the industry). Tell us why we should choose you as our next VA. DO NOT share
                personal information like hobbies.
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3-content"
                id="panel3-header"
              >
                <Typography>
                  {" "}
                  <b>Step 4</b> - Upload your video
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <CustomButton
                  variant="outlined"
                  component="label"
                  sx={{
                    background: formData.recordedVideo !== "" && "#dfefe8 !important",
                    color: formData.recordedVideo !== "" && "#00b43f !important",
                    border: formData.recordedVideo !== "" && "none !important",
                  }}
                >
                  {!formData.recordedVideo ? `Upload your video` : `"${sessionStorage.getItem("videoFile")}" uploaded successfully` }
                  <FileBase64
                    multiple={false}
                    name="recordedVideo"
                    onDone={({ base64, file }) => {
                      if (!isValidFileType(file.type)) {
                        setNotificationHandle({
                          open: true,
                          type: "error",
                          text: "Invalid file type. Valid formats are: MP4, WMV, AVI, MOV",
                        });
                        return;
                      } else {
                        sessionStorage.setItem("videoFile", file.name)
                        const formDataObj = new FormData();
                        formDataObj.append("file", file);
                        dispatch({
                          type: "UPDATE_FORM_DATA",
                          payload: { recordedVideo: formDataObj },
                        });
                        setNotificationHandle({
                          open: true,
                          type: "info",
                          text: "Video has been uploaded successfully!",
                        });
                      }
                    }}
                  />
                </CustomButton>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Stack>
      </Box>
      {notificationHandle.open && (
        <Notification notification={notificationHandle} onClose={() => setNotificationHandle({})} />
      )}
      {/* 
    <Stack spacing={2}>
      <Box boxShadow={[theme.shadows[11]]} border={theme.border} borderRadius={theme.borderRadius}>
        <Stack p={4} spacing={2}>
          <Stack flexDirection="column" rowGap={2}>
            <Typography variant="h6" component="p">
              How to shoot a video?
            </Typography>
            <Typography variant="p" component="p">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod voluptate obcaecati
              esse, labore cum vel dolores, ab debitis assumenda qui at, iure fugiat doloremque!
              Ipsum consequuntur amet eum doloremque cumque.
            </Typography>
            <Typography variant="h6" component="p" fontSize={16}>
              Some title
            </Typography>
            <Typography variant="p" component="p">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </Typography>
            <Typography variant="h6" component="p" fontSize={16}>
              Some title
            </Typography>
            <Typography variant="p" component="p">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </Typography>
            <Typography variant="h6" component="p" fontSize={16}>
              Some title
            </Typography>
            <Typography variant="p" component="p">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </Typography>
          </Stack>
        </Stack>
      </Box>
      <Box boxShadow={[theme.shadows[11]]} border={theme.border} borderRadius={theme.borderRadius}>
        <Stack p={4} spacing={2}>
          {hasCamera ? (
            <Stack flexDirection="column" rowGap={2}>
              <Typography variant="p" component="p">
                Ensure to use the official VA Support Now Background for your video
              </Typography>
              {!startRecording && (
                <StyledButton
                  variant="secondary"
                  disabled={formData.videoData != "" ? true : false}
                  onClick={handleStartRecording}
                >
                  <VideocamIcon sx={{ marginRight: "10px" }} />
                  {!recordingFinished ? "I am ready to record a video" : "Your video is confirmed"}
                </StyledButton>
              )}
              {loading && <CircularProgress sx={{ alignSelf: "center" }} />}
              {!recordingFinished && startRecording && (
                <Box>
                  <VideoRecordingComp
                    dataToParent={(data) => {
                      setRecordingFinished(data);
                      setStartRecording(false);
                    }}
                    direction="../assets"
                  />
                </Box>
              )}
            </Stack>
          ) : (
            <Stack
              justifyContent="center"
              alignItems="center"
              textAlign="center"
              gap={1}
              sx={{
                backgroundColor: "#faeeee",
                color: "#ff4e4e",
                border: "1px solid red",
                borderRadius: "4px",
                padding: "20px",
                margin: "20px",
              }}
            >
              <CameraAltIcon />
              <Typography variant="span" component="span">
                No camera device detected, make sure to have a working camera to continue the
                application process.
              </Typography>
            </Stack>
          )}
        </Stack>
      </Box>
      </Stack>
    */}
    </Stack>
  );
};

export default IntroducingYourself;
