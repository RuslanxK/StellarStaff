import { useTheme } from "@emotion/react";
import {
  Box,
  Stack,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
} from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";


const TechnicalInformation = () => {
  const [stepData, setStepData] = useOutletContext();

  const dispatch = useDispatch();

  const formData = useSelector((state) => state.app.formData);


  useEffect(() => {
    setStepData({ name: "Technical Information", count: 4, requiredFields: false});
  }, []);

  useEffect(() => {
    if (formData.position && formData.verify) {
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
  }, [formData.position]);

  const theme = useTheme();

  const navigate = useNavigate();


  const applicationDataUpdate = (e) => {
    const { name, value } = e.target;

    dispatch({ type: "UPDATE_FORM_DATA", payload: { [name]: value } });
  };


  return (
    <Box boxShadow={[theme.shadows[11]]} border={theme.border} borderRadius={theme.borderRadius}>
      <Stack p="50px" spacing={2}>       
        <FormControl fullWidth>
          <InputLabel id="positionLabel">Position</InputLabel>
          <Select labelId="positionLabel" id="positionSelect" label="Position" value={formData.position} name="position" onChange={applicationDataUpdate}>
            <MenuItem value="FreeLancer">FreeLance</MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="HelpDesk">HelpDesk</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
};

export default TechnicalInformation;
