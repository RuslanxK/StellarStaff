import React, { useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Box , useMediaQuery} from "@mui/material";
import { useTheme } from "@emotion/react";


const LoadingScreen = () => {

  const theme = useTheme();


  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check for mobile screens


//  const [blockScroll, allowScroll] = useScrollBlock();

  useEffect(() => {
  //  blockScroll();
  }, [])
  
  return (
    <Box
      sx={{
        backgroundColor: "#ffffffde",
        display: "flex",
        height:  "100vh",                                                          
        width: "100%",
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 999,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress size={50} />
    </Box>
  );
};

export default LoadingScreen;
