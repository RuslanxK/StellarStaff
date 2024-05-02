import {
  Stack,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  TableHead,
  useMediaQuery,
  Box,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "@emotion/react";
import StyledButton from "../MainPages/StyledButton";
import axios from "axios";
import { getVaByIdUrl, updateClientUrl, getClientByIdUrl } from "../ApiUrls";
import { useParams, useNavigate } from "react-router-dom";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import Cookies from "js-cookie";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import VideoPlaceHolder from "../Resources/VideoPlaceholder.jpg";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const VaInnerComp = () => {
  const theme = useTheme();
  const token = Cookies.get("token");

  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check for mobile screens
  const headers = {
    Authorization: token,
  };


  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isiPad = useMediaQuery(
    "(max-width: 1200px) and (orientation: landscape), (max-height: 1024px) and (orientation: portrait)"
  );

  const navigate = useNavigate();

  const clientId = Cookies.get("client_id");
  const storedAssignedVasArr = JSON.parse(Cookies.get("assignedArr") || "[]");
  const clientIndex = sessionStorage.getItem("client_index");
  const { id } = useParams();

  const container = useRef(null);
  const videoRef = useRef();

  const [data, setData] = useState({});
  const [currentIndex, setCurrentIndex] = useState(clientIndex ? clientIndex : 0);
  const [client, setClient] = useState({});
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);

  const tableData = [
    {
      column1: "Hardware Component:",
      column2: "",
    },
    { column1: "Processor (CPU)", column2: "checkCircle" },
    { column1: "Memory (RAM):", column2: "checkCircle" },
    { column1: "Storage:", column2: "checkCircle" },
    { column1: "Graphics Card (GPU):", column2: "checkCircle" },
    { column1: "Network Connectivity:", column2: "checkCircle" },
  ];

  useEffect(() => {
    const getVaData = async () => {
      try {
        const { data } = await axios.get(getVaByIdUrl(id));
        setData(data);
        const { data: client } = await axios.get(getClientByIdUrl(clientId));
        setClient(client);
      } catch (err) {
        console.log(err);
      }
    };

    getVaData();

    videoRef.current?.load();
  }, [id, data.videoData]);

  const openResume = () => {
    window.open(process.env.REACT_APP_CLOUD_URL + data.newResumePdf, "_blank", "noreferrer");
  };

  const handleViewNext = () => {
    let newIndex;
    if (currentIndex < storedAssignedVasArr.length - 1) {
      newIndex = currentIndex + 1;
    } else {
      newIndex = 0; // Reset to the first index
    }
    setCurrentIndex(newIndex);
    navigate(`/va/${storedAssignedVasArr[newIndex]._id}`);
  };

  const handleViewPrevious = () => {
    let newIndex;
    if (currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else {
      newIndex = storedAssignedVasArr.length - 1; // Reset to the last index
    }
    setCurrentIndex(newIndex);
    navigate(`/va/${storedAssignedVasArr[newIndex]._id}`);
  };

  const updateVa = async () => {
    try {
      let foundVa = client.assignedVas.find((x) => x._id === data._id);

      if (foundVa) {
        foundVa.selected = true; // Set the selected property to true
      }

      const updatedClient = { ...client }; // Create a copy of the client object

      const { data: updatedClientData } = await axios.put(
        updateClientUrl(clientId),
        updatedClient, // Use the updated client object
        {
          headers,
        }
      );

      navigate(`/va-selection/${clientId}`);
    } catch (err) {
      console.error(err);
    }
  };

  const openVideoDialog = () => {
    setIsVideoDialogOpen(true);
  };

  const closeVideoDialog = () => {
    setIsVideoDialogOpen(false);
  };

  const skill = data?.skills?.map((s) => {
    return (
      <Typography
        p={1}
        mr={1}
        component="span"
        variant="span"
        sx={{
          background: theme.palette.background.gray,
          borderRadius: "50px",
          marginBottom: "10px",
          fontSize: isMobile ? "10px" : "14px",
          paddingLeft: "15px",
          paddingRight: "15px",
          display: isMobile ? "flex" : null,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {s}
      </Typography>
    );
  });

  const educationArr = data?.education?.map((e) => {
    if (data.noEducation) {
      return (
        <Typography component="span" variant="span">
          No Education
        </Typography>
      );
    } else {
      return (
        <Typography display="flex">
          - {e.educationTitle} in {e.collageUniversity}, Year of Graduation: {new Date(e.toDate).toLocaleDateString()}
        </Typography>
      );
    }
  });

  const experienceArr = data?.experience?.map((exp) => {
    return (
      <Typography>
        - {exp.companyName} from {new Date(exp.fromDate).toLocaleDateString()} until{" "}
        {new Date(exp.toDate).toLocaleDateString()}
      </Typography>
    );
  });

  return (
    <Container
      maxWidth
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        rowGap: 3,
        paddingLeft: isMobile ? "40px" : null,
        paddingRight: isMobile ? "40px" : null ,
        paddingBottom: isMobile ? "50px" : "50px",
        backgroundColor: "#f5f5f5",
        alignItems: "center",
        
      }}
    >
      <Stack width={isMobile || isTablet || isiPad ? "100%" : 1200} alignItems="flex-start" mt={3}>
        <Button onClick={() => navigate(`/va-selection/${clientId}`)}>
          <KeyboardArrowLeftIcon fontSize="12px" />
          Back to all Assistants
        </Button>
      </Stack>

      <Stack>
        {isMobile && data.videoData && (
          <video
            width="100%"
            height="100%"
            style={{ borderRadius: "15px" }}
            controls
            ref={videoRef}
          >
            <source
              src={process.env.REACT_APP_CLOUD_URL + data.videoData}
              type="video/webm"
            ></source>
            Your browser does not support the video tag.
          </video>
        )}
      </Stack>

      <Stack
        boxShadow={theme.shadows[11]}
        width={isMobile || isTablet || isiPad ? "100%" : 1200}
        p={4}
        flexDirection={isMobile ? "column" : "row"}
        alignItems={isMobile ? "space=between" : "center"}
        backgroundColor="white"
        borderRadius={theme.borderRadius}
        gap={2}
      >
        <Stack
          flexDirection="row"
          alignItems={isMobile ? "flex-start" : "flex-start"}
          gap={2}
          flex={2}
          
        >
          <img
            src={
              data.profileImage
                ? process.env.REACT_APP_CLOUD_URL + data.profileImage
                : VideoPlaceHolder
            }
            width={isMobile ? "50px" : "100px"}
            height={isMobile ? "50px" : "100px"}
            style={{
              borderRadius: "100%",
              objectFit: "cover",
              boxShadow: theme.shadows[11],
            }}
            alt=""
          />
          <Stack p={isMobile ? 0 : 2}>
            <Typography
              component="h3"
              variant={isMobile ? "h6" : "h4"}
              textTransform="capitalize"
              fontWeight={700}
              mb={1}
            >
              {data.fullname}
            </Typography>
            <Box
              sx={{
                display: isMobile ? "flex" : "none",
                gap: 0.5,
                flexWrap: "wrap",
                marginBottom: 2,
                color: "green",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: isMobile ? "flex" : "none",
                  gap: 1,
                  fontSize: 14,
                }}
              >
                <Typography variant="span" component="span">
                  {data.age}
                </Typography>
                |
                <Typography variant="span" component="span">
                  {data.country}
                </Typography>
              </Box>
              <Typography variant="span" component="span" fontSize={14}>
                {data.industries}
              </Typography>
            </Box>
            <Stack
              width="100%"
              sx={{
                display: "flex",
                justifyContent: isMobile ? "center" : "flex-start",
                alignItems: isMobile ? "center" : "flex-start",
                flexDirection: "row",
              }}
            >
              {!isMobile /* Mobile version */ ? (
                <StyledButton
                  variant="main"
                  onClick={updateVa}
                  sx={{ marginTop: "30px", marginRight: "10px" }}
                >
                  Select
                </StyledButton>
              ) : null}

              {!isMobile && storedAssignedVasArr.length > 1 ? (
                <StyledButton
                  variant="secondary"
                  onClick={handleViewNext}
                  sx={{ marginTop: "30px", marginRight: "10px" }}
                >
                 Next
                </StyledButton>
              ) : null}
              {!isMobile && storedAssignedVasArr.length > 1 ? (
                <StyledButton
                  variant="secondary"
                  onClick={handleViewPrevious}
                  sx={{ marginTop: "30px", marginRight: "10px" }}
                >
                 Previous
                </StyledButton>
              ) : null}
            </Stack>
          </Stack>
        </Stack>
        <Stack flex={1}>
          <Box sx={{ display: isMobile ? "none" : "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="span" component="span">
              <b>Age:</b> {data.age}
            </Typography>
            <Typography variant="span" component="span">
              <b>Country:</b> {data.country}
            </Typography>
            <Typography variant="span" component="span">
              <b>Industries:</b> {data.industries}
            </Typography>
          </Box>
          {data.newResumePdf && isMobile && (
            <StyledButton variant="main" onClick={openResume}>
              Download CV
            </StyledButton>
          )}
        </Stack>
      </Stack>
      <Stack
        p={4}
        display={isMobile ? "flex" : "none"}
        justifyContent="flex-start"
        alignItems="flex-start"
        backgroundColor="white"
        borderRadius={theme.borderRadius}
        boxShadow={theme.shadows[11]}
        spacing={2}
        flex={2}
        width='100%'
      >
        <Typography component="h4" variant="span">
          Skills
        </Typography>
        <Stack flexDirection="row" flexWrap="wrap">
          {skill}
        </Stack>
      </Stack>
      <Box
        sx={{
          display: isMobile ? "flex" : "none",
          flexDirection: "column",
          gap: 2,
          height: "auto",
        }}
      >
        <Accordion sx={{ borderRadius: "6px", width: "100%" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>About</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{data.coverLetterText}</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ borderRadius: "6px", width: "100%" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Achievements</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{data.achievements}</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ borderRadius: "6px", width: "100%" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Experience</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{experienceArr}</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ borderRadius: "6px", width: "100%" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Education</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{educationArr}</Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
      {isMobile && (
        <Stack
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: "column",
            width: '100%'
          }}
        >
          <Stack flexDirection="row" gap={2}>
            {storedAssignedVasArr.length > 1 ? (
              <StyledButton
                variant="secondary"
                onClick={handleViewNext}
                sx={{width: "100%" }}
              >
                 Next
              </StyledButton>
            ) : null}
            {storedAssignedVasArr.length > 1 ? (
              <StyledButton
                variant="secondary"
                onClick={handleViewPrevious}
                sx={{ width: "100%" }}
              >
                 Previous
              </StyledButton>
            ) : null}
          </Stack>
          <Stack width="100%">
            <StyledButton variant="main" onClick={updateVa}>
              Select VA
            </StyledButton>
          </Stack>
        </Stack>
      )}
      <Stack display={isMobile && "none"} flexDirection="column" maxWidth={isMobile ? null : 1200}>
        <Stack flexDirection={isMobile ? "column" : "row"} gap={3}>
          <Stack
            p={4}
            display="flex"
            justifyContent="flex-start"
            alignItems="flex-start"
            backgroundColor="white"
            borderRadius={theme.borderRadius}
            boxShadow={theme.shadows[11]}
            spacing={5}
            flex={2}
          >
            <Stack width="100%" spacing={2} pb={5} borderBottom={theme.border}>
              {!isMobile && data.videoData && (
                <video
                  width="400px"
                  height="300px"
                  style={{ borderRadius: "15px" }}
                  controls
                  ref={videoRef}
                >
                  <source
                    src={process.env.REACT_APP_CLOUD_URL + data.videoData}
                    type="video/webm"
                  ></source>
                  Your browser does not support the video tag.
                </video>
              )}
              <Stack
                width="100%"
                spacing={2}
                pb={5}
                pt={isMobile ? 0 : 5}
                borderBottom={theme.border}
              >
                <Typography component="h4" variant="span">
                  Skills
                </Typography>
                <Stack flexDirection="row" flexWrap="wrap">
                  {skill}
                </Stack>
              </Stack>
              <Stack width="100%" spacing={2} pb={5} borderBottom={theme.border}>
                <Typography component="h4" variant="span">
                  Why we picked {data.fullname}
                </Typography>
                <Typography component="p" variant="p">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua.
                </Typography>
              </Stack>

              <Typography component="h4" variant="span">
                About
              </Typography>
              <Typography component="p" variant="p">
                {data.coverLetterText}
              </Typography>
            </Stack>

            <Stack width="100%" spacing={2} pb={5} borderBottom={theme.border}>
              <Typography component="h4" variant="span">
                Experience
              </Typography>
              <Typography component="p" variant="p">
                {experienceArr}
              </Typography>
            </Stack>

            <Stack width="100%" spacing={2} pb={5} borderBottom={theme.border}>
              <Typography component="h4" variant="span">
                Education
              </Typography>
              <Typography component="p" variant="p">
                {educationArr}
              </Typography>
            </Stack>

            <Stack width="100%" spacing={2} pb={5} borderBottom={theme.border}>
              <Typography component="h4" variant="span">
                Achievements
              </Typography>
              <Typography component="p" variant="p">
                {data.achievements}
              </Typography>
            </Stack>
          </Stack>

          <Stack gap={3}>
            {!isMobile ? (
              <Stack
                borderRadius={theme.borderRadius}
                boxShadow={theme.shadows[11]}
                p={4}
                backgroundColor="white"
              >
                <Typography
                  component="h3"
                  variant="h6"
                  sx={{ fontWeight: "bold", display: "flex", marginBottom: 2 }}
                >
                  <DisplaySettingsIcon sx={{ marginRight: "7px" }} /> Actions
                </Typography>
                <Stack gap={1}>
                  {data.newResumePdf && (
                    <StyledButton variant="main" onClick={openResume}>
                      Download CV
                    </StyledButton>
                  )}
                </Stack>
              </Stack>
            ) : null}

            <Stack>
              <TableContainer
                component={Paper}
                sx={{
                  boxShadow: theme.shadows[5],
                  borderRadius: theme.shape.borderRadius,
                  overflow: "hidden",
                  padding: 4,
                }}
              >
                <Table>
                  <TableHead>
                    <Typography
                      component="h3"
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        display: "flex",
                        marginBottom: 2,
                      }}
                    >
                      <DisplaySettingsIcon sx={{ marginRight: "7px" }} /> Hardware Info
                    </Typography>
                  </TableHead>
                  <TableBody>
                    {tableData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ padding: "8px", fontSize: "12px" }}>
                          {row.column1}
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "8px",
                            textAlign: "center",
                            fontSize: "12px",
                          }}
                        >
                          {row.column2 === "checkCircle" ? (
                            <Stack flexDirection="row" alignItems="center" gap={1}>
                              <CheckCircleOutlineIcon
                                sx={{
                                  color: "green",
                                  fontSize: "18px",
                                }} // Adjust the icon size
                              />
                              <Typography variant="span" component="span" color="green">
                                Passed
                              </Typography>
                            </Stack>
                          ) : (
                            ""
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};

export default VaInnerComp;
