import { Box, Container, Typography } from "@mui/material";
import StyledButton from "../MainPages/StyledButton";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container
      sx={{ height: "100vh", display: "flex", justifyContent: "center" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography component="h1" variant="h2" fontWeight="500">
          404 - Page Not Found
        </Typography>
        <Typography variant="p" sx={{ marginTop: "15px" }}>
          Sorry, the page you are looking for does not exist.
        </Typography>
        <StyledButton
          variant="main"
          sx={{ marginTop: "15px" }}
          onClick={() => navigate("/")}
        >
          Back To Main Page
        </StyledButton>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
