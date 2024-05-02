import { useTheme } from "@mui/material/styles";
import StyledButton from "./StyledButton";
import { Speed, AttachMoney, InventoryOutlined, TrendingUpOutlined } from "@mui/icons-material";
import { Box, Container, Typography, Stack, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VideoBoxMain from "../Components/VideoBoxMain";

const Mainpage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isiPad = useMediaQuery(
    "(max-width: 1200px) and (orientation: landscape), (max-height: 1024px) and (orientation: portrait)"
  );

  const [features] = useState([
    {
      icon: <Speed fontSize="large" sx={{ color: theme.palette.primary.green }} />,
      title: "Effortless Entry",
      paragraph: "Begin with ease, no complications.",
    },
    {
      icon: <AttachMoney fontSize="large" sx={{ color: theme.palette.primary.green }} />,
      title: "Skill-Based Earnings",
      paragraph: "Compensation that matches your expertise.",
    },
    {
      icon: <InventoryOutlined fontSize="large" sx={{ color: theme.palette.primary.green }} />,
      title: "Focused on Your Success",
      paragraph: "A workplace dedicated to your achievement.",
    },
    {
      icon: <TrendingUpOutlined fontSize="large" sx={{ color: theme.palette.primary.green }} />,
      title: "Inclusive Benefit Packages",
      paragraph: "Diverse benefits to meet all your needs.",
    },
  ]);

  return (
    <Container
      sx={{
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        maxWidth: "800px !important",
      }}
    >
      <Stack
        direction="column"
        alignItems="center"
        spacing={2}
        textAlign="center"
        p={isTablet || isiPad ? 2 : 0}
      >
        <Typography variant="h6" component="h2" fontWeight={600} color={theme.palette.primary.main}>
          SHOOT FOR THE STARS!
        </Typography>
        <Typography
          variant="h4"
          component="h1"
          fontWeight={600}
          fontSize={isMobile ? "25px" : "28px"}
        >
          <u>VOTED</u>: BEST PLACE TO WORK AT BY THE PEOPLE WHO WORK HERE :)
        </Typography>
        <Typography variant="p" component="p" fontSize={isMobile ? "16px" : "18px"}>
          At Stellar Staff, your job is more than a paycheck. You'll find opportunities to grow and
          make a job you truly love.
        </Typography>
      </Stack>
      <Stack width={isMobile ? '100%' : '80%'}>
        <VideoBoxMain />
      </Stack>
      <Stack
        direction="column"
        justifyContent="center"
        spacing={2}
        width={isMobile ? "100%" : "700px"}
        position="relative"
        marginTop="20px"
      >
        <Box position="absolute" left={isMobile ? "-20px " : isTablet ? "-20px" : "-80px"} bottom={isTablet ? "150px" : "120px"} sx={{ transform: "rotate(60deg)" }}>
          <img src="https://d9wb6j5xkbdxb.cloudfront.net/arrow.png" width={isMobile ? 80 : 150} />
        </Box>
        <Stack justifyContent='center' alignItems='center' width='auto' gap={2}>
          <StyledButton
            variant="main"
            onClick={() => navigate("/register")}
            sx={{ fontSize: "18px", width: isMobile ? "300px" : "500px", alignSelf: "center" }}
          >
            Click here to apply
          </StyledButton>
          <StyledButton
            variant="underline"
            onClick={() => navigate("/login")}
            sx={{
              textDecoration: "underline",
              width: isMobile ? "300px" : "500px",
              textTransform: "lowercase",
              fontSize: "16px",
            }}
          >
            Or login into your account
          </StyledButton>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Mainpage;
