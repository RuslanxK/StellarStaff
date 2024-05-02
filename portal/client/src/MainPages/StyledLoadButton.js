import { styled } from "@mui/material/styles";
import LoadingButton from '@mui/lab/LoadingButton';

const StyledLoadButton = styled(LoadingButton)(({ theme, variant }) => ({
  backgroundColor: variant === "main" ? theme.palette.primary.main : theme.palette.secondary.main,
  color: variant === "main" ? theme.palette.text.white : theme.palette.primary.main,
  "&:hover": {
    backgroundColor:
      variant === "main" ? theme.palette.primary.green : theme.palette.secondary.green,
    color: variant === "main" ? theme.palette.text.white : theme.palette.text.white,
    borderColor: variant === "main" ? theme.palette.primary.green : undefined,
  },
  border: variant === "secondary" ? "1px solid" : undefined,
  borderColor: variant === "secondary" ? theme.palette.primary.main : undefined,
  padding: "8px 25px",
  "&:hover": {
    borderColor: variant === "secondary" ? theme.palette.primary.green : undefined,
    backgroundColor:
      variant === "secondary" ? theme.palette.primary.green : theme.palette.secondary.green,
      color: variant === "secondary" ? theme.palette.text.white : theme.palette.text.white,
  },
}));

export default StyledLoadButton;
