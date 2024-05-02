import { Box, Stack, useMediaQuery } from "@mui/material";
import * as React from "react";
import { useEffect, useState } from "react";
import { useRef } from "react";
import Twilio from "twilio-video";
import vsnBG from "../Resources/vsn_bg.png";
import * as VideoProcessors from "@twilio/video-processors";
import StyledButton from "../MainPages/StyledButton";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useDispatch } from "react-redux";
import { useTheme } from "@emotion/react";

const VideoRecordingComp = ({ direction, dataToParent }) => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const previewVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [recordAgain, setRecordAgain] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check for mobile screens

  const dispatch = useDispatch();

  useEffect(() => {
    while (videoRef.current.firstChild) {
      videoRef.current.removeChild(videoRef.current.firstChild);
    }

    if (!localVideoTrack) {
      const handleDataAvailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => prev.concat(event.data));
        }
      };

      const showLocalVideo = async () => {
        const videoTrack = await Twilio.createLocalVideoTrack({
          width: isMobile ? 225 : 480,
          height: isMobile ? 225 : 360,
          frameRate: 24,
        });

        const audioTrack = await Twilio.createLocalAudioTrack();
        setLocalAudioTrack(audioTrack);
        setLocalVideoTrack(videoTrack);
        videoRef.current.appendChild(videoTrack.attach());

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
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

          function draw() {
            if (videoRef.current && videoRef.current.firstChild) {
              const videoElement = videoRef.current.firstChild;
              ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            }
            requestAnimationFrame(draw);
          }

          draw();
        };

        const mediaStream = new MediaStream([
          canvas.captureStream(24).getVideoTracks()[0],
          audioTrack.mediaStreamTrack,
        ]); // Record from the canvas stream

        mediaRecorderRef.current = new MediaRecorder(mediaStream, {
          mimeType: "video/webm; codecs=vp9",
        });
        mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      };

      showLocalVideo();
    } else {
      videoRef.current.appendChild(localVideoTrack.attach());
    }
  }, [recordAgain]);

  useEffect(() => {
    let intervalId;

    if (recording) {
      intervalId = setInterval(() => {
        setShowIcon((prevShowIcon) => !prevShowIcon);
      }, 800);
    } else {
      clearInterval(intervalId);
      setShowIcon(false);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [recording]);

  const startRecording = () => {
    setRecordAgain(!recordAgain);
    setRecordingStatus(false);
    if (previewVideoRef.current) {
      previewVideoRef.current.src = "";
    }
    setRecordedChunks([]);
    mediaRecorderRef.current.start(10);
    setRecording(true);
  };

  const stopRecording = async () => {
    mediaRecorderRef.current.stop();
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    setRecordingStatus(true);
    if (previewVideoRef.current) {
      previewVideoRef.current.src = url;
    }
    setRecording(false);
  };

  const uploadVideo = async () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const formData = new FormData();
    formData.append("file", blob, "hello.webm");
    dispatch({
      type: "UPDATE_FORM_DATA",
      payload: {
        videoData: formData,
      },
    });
    dataToParent(true);
    if (localVideoTrack) {
      localVideoTrack.stop();
      setLocalVideoTrack(null);
    }

    if (localAudioTrack) {
      localAudioTrack.stop();
      setLocalAudioTrack(null);
    }

    URL.revokeObjectURL(previewVideoRef.current.src);
  };

  return (
    <Stack alignItems="center">
      <Box
        id="video"
        ref={videoRef}
        style={{ display: !recordingStatus ? "block" : "none" }}
      ></Box>
      <canvas
        id="canvas"
        ref={canvasRef}
        width={isMobile ? 225 : "480"}
        height={isMobile ? 225 : "360"}
        style={{ display: "none" }}
      ></canvas>
      <video
        id="preview-video"
        ref={previewVideoRef}
        style={{ display: recordingStatus ? "block" : "none" }}
        controls
        autoPlay
      ></video>
      <Stack
        spacing={1}
        direction="column"
        alignItems="center"
        flex={1}
        mt={2}
        width="100%"
      >
        <Stack
          gap={1}
          flexDirection={isMobile ? "column" : "row"}
          flex={1}
          width="100%"
        >
          <StyledButton
            variant="main"
            onClick={startRecording}
            disabled={recording}
            sx={{ width: "100%" }}
          >
            {recordedChunks.length > 1 ? "Record Again" : "Start Recording"}
          </StyledButton>
          <StyledButton
            variant="main"
            onClick={stopRecording}
            disabled={!recording}
            sx={{ width: "100%" }}
          >
            <FiberManualRecordIcon
              sx={{
                color: "red",
                width: 15,
                marginRight: "5px",
                opacity: showIcon ? 1 : 0,
                transition: "0.3s",
              }}
            />
            Stop Recording
          </StyledButton>
        </Stack>
        {recordedChunks.length > 1 && (
          <StyledButton
            variant="secondary"
            onClick={uploadVideo}
            disabled={recording || !recordedChunks.length}
            sx={{ width: "100%" }}
          >
            Confirm Video
          </StyledButton>
        )}
      </Stack>
    </Stack>
  );
};

export default VideoRecordingComp;
