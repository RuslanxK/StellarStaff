import { Container, useMediaQuery, useTheme } from "@mui/material";

const ContactClientForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check for mobile screens

  return (
    <Container
      sx={{
        width: isMobile ? "275px" : "450px",
        height: isMobile ? "500px" : "750px",
        padding: "0",
      }}
    >
      <iframe
        src="https://link.vasupportnow.com/widget/form/KTrWpuF57X5Gruu8ZVnq"
        style={{
          width: isMobile ? "100%" : "100%",
          height: "100%",
          border: "none",
          borderRadius: "3px",
          padding: "0",
        }}
        id="inline-KTrWpuF57X5Gruu8ZVnq"
        data-layout="{'id':'INLINE'}"
        data-trigger-type="alwaysShow"
        data-trigger-value=""
        data-activation-type="alwaysActivated"
        data-activation-value=""
        data-deactivation-type="neverDeactivate"
        data-deactivation-value=""
        data-form-name="Portal Client Support"
        data-height="609"
        data-layout-iframe-id="inline-KTrWpuF57X5Gruu8ZVnq"
        data-form-id="KTrWpuF57X5Gruu8ZVnq"
        title="Portal Client Support"
      ></iframe>
    </Container>
  );
};

export default ContactClientForm;
