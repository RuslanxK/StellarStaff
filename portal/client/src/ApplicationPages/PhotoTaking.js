import { Box, Stack, useMediaQuery, } from "@mui/material";
import { useTheme } from "@emotion/react";
import * as React from "react";
import { useEffect, useState, useRef } from "react";
import Twilio from "twilio-video";
import vsnBG from "../Resources/vsn_bg.png";
import * as VideoProcessors from "@twilio/video-processors";
import StyledButton from "../MainPages/StyledButton";
import { useDispatch } from "react-redux";

const PhotoTaking = ({ direction, sendToParent, sendImage }) => {

  const theme = useTheme();
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const previewVideoRef = useRef(null);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check for mobile screens
  
  const canvasRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const profileRef = useRef();
  const [capturedImage, setCapturedImage] = useState(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!localVideoTrack) {
      const handleDataAvailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => prev.concat(event.data));
        }
      };

      const showLocalVideo = async () => {
        const videoTrack = await Twilio.createLocalVideoTrack({
          width: isMobile ? 350 : 480,
          height: 360,
          frameRate: 24,
        });

        setLocalVideoTrack(videoTrack);

        videoRef.current.appendChild(videoTrack.attach());

        let img = new Image();
        img.src = vsnBG;
        img.onload = async () => {
          const bg = new VideoProcessors.VirtualBackgroundProcessor({
            assetsPath: direction ? direction : "assets",
            backgroundImage: img,
            maskBlurRadius: 5,
            pipeline: VideoProcessors.Pipeline.WebGL2,
            debounce: true,
          });
          await bg.loadModel();

          videoTrack.addProcessor(bg, {
            inputFrameBufferType: "video",
            outputFrameBufferContextType: "webgl2",
          });

          setVideoLoaded(true);
        };
      };

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      function draw() {
        if (videoRef.current && videoRef.current.firstChild) {
          const videoElement = videoRef.current.firstChild;
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        }
        requestAnimationFrame(draw);
      }

      draw();

      const stream = canvas.captureStream(30);

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp9",
      });
      mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      showLocalVideo();
    }

  }, []);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current.firstChild; // Access the video element
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Set the canvas dimensions to match the video feed
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the video frame onto the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const file = new File([blob], "profileImage.jpg", { type: "image/jpeg" });
        const imageUrl = URL.createObjectURL(file);
        sendImage(imageUrl);
        dispatch({ type: "UPDATE_FORM_DATA", payload: { profileImage: file } });
        URL.revokeObjectURL(file);
      });

      sendToParent();

      mediaRecorderRef.current.stop();
      setRecording(false);
      if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.detach().forEach((element) => element.remove());
        setLocalVideoTrack(null);
      }
    }
  };
  
  return (
    <Stack alignItems="center">
      <Box id="video" ref={videoRef} style={{ display: !recordingStatus ? "block" : "none" }}></Box>
      <canvas
        id="canvas"
        ref={canvasRef}
        width={isMobile ? 375 : 480}
        height="360"
        style={{ display: "none" }}
      ></canvas>
      <StyledButton
        variant="main"
        sx={{ backgroundColor: "black", alignSelf: "center" }}
        onClick={takePhoto}
      >
        Take a picture of me
      </StyledButton>
    </Stack>
  );
};

export default PhotoTaking;
