import { Container, useMediaQuery, useTheme } from "@mui/material";

const ContactVaForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check for mobile screens

  return (
    <Container
      sx={{
        width: isMobile ? "275px" : "450px",
        height: isMobile ? "500px" : "666px",
        padding: "0",
      }}
    >
      <iframe
        src="https://link.alwaysconvert.com/widget/form/voWLvtJbcgNnWeqNTsRe"
        id="inline-voWLvtJbcgNnWeqNTsRe"
        style={{
          width: isMobile ? "100%" : "100%",
          height: "100%",
          border: "none",
          borderRadius: "3px",
          padding: "0",
        }}
        data-layout="{'id':'INLINE'}"
        data-trigger-type="alwaysShow"
        data-trigger-value=""
        data-activation-type="alwaysActivated"
        data-activation-value=""
        data-deactivation-type="neverDeactivate"
        data-deactivation-value=""
        data-form-name="Portal Customer Support"
        data-height="592"
        data-layout-iframe-id="inline-voWLvtJbcgNnWeqNTsRe"
        data-form-id="voWLvtJbcgNnWeqNTsRe"
        title="Portal Customer Support"
      ></iframe>
    </Container>
  );
};

export default ContactVaForm;
