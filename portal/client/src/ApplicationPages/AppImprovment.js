import { useTheme } from "@emotion/react";
import { Box, Typography, Stack, useMediaQuery } from "@mui/material";
import * as React from "react";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import StyledLoadButton from "../MainPages/StyledLoadButton";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfDocument from "../PdfCreator/PdfDocument";
import { API_BASE_URL } from "../ApiUrls";
import CircularProgress from "@mui/material/CircularProgress";

const AppImprovement = () => {
  const [stepData, setStepData] = useOutletContext();

  const [loading, setLoading] = useState(false);
  const [improveFinish, setImproveFinish] = useState(false);

  const dispatch = useDispatch();

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check for mobile screens

  const storeData = useSelector((state) => state.app);

  useEffect(() => {
    setStepData({ name: "AI Improvement", count: 4, requiredFields: false });
  }, []);

  useEffect(() => {
    if (storeData.formData.newResumePdf !== "") {
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
  }, [storeData.formData.newResumePdf]);

  const sendDataGpt = () => {
    setLoading(true);
    const contentObj = {
      coverLetterText: storeData.formData.coverLetterText,
      experience: storeData.formData.experience,
    };

    const content = JSON.stringify(contentObj);
    console.log(content);

    axios
      .post(`${API_BASE_URL}/api/gpt`, { content })
      .then((response) => {
        const data = JSON.parse(response.data.completion);
        dispatch({
          type: "UPDATE_FORM_DATA",
          payload: {
            coverLetterText: data.coverLetterText,
            experience: data.experience,
            isImproved: true,
          },
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        sendDataGpt();
      });
  };

  const convertToFile = (blob) => {
    const newFile = new File([blob], "newResume.pdf");
    dispatch({
      type: "UPDATE_FORM_DATA",
      payload: {
        newResumePdf: newFile,
      },
    });
    setImproveFinish(true);
  };

  return (
    <Box boxShadow={[theme.shadows[11]]} border={theme.border} borderRadius={theme.borderRadius}>
      <Stack p={isMobile ? "35px" : "50px"} spacing={2}>
        <Typography variant="p" component="p">
          Congratulations you have the first steps of the application. Now your application will
          processed by AI to enhance and refine your resume.
        </Typography>
        {!storeData.formData.isImproved && !loading ? (
          <StyledLoadButton
            loading={loading}
            variant="outlined"
            loadingPosition="start"
            startIcon={<SaveIcon />}
            onClick={sendDataGpt}
            sx={{ textTransform: "none" }}
          >
            Improve the application
          </StyledLoadButton>
        ) : loading ? (
          <CircularProgress size={35} sx={{alignSelf: "center"}} />
        ) : (
          <StyledLoadButton
            variant="outlined"
            startIcon={<SaveIcon />}
            sx={{ textTransform: "none" }}
          >
            <PDFDownloadLink
              style={{
                textDecoration: "none",
                color: theme.palette.text.purple,
              }}
              document={<PdfDocument data={storeData} />}
              fileName="VA-Support-Resume.pdf"
            >
              {({ blob, url, loading, error }) => {
                if (url && !improveFinish) {
                  convertToFile(blob);
                }
                return "Download your new resume";
              }}
            </PDFDownloadLink>
          </StyledLoadButton>
        )}
      </Stack>
    </Box>
  );
};

export default AppImprovement;
