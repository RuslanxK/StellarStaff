import { Dialog, DialogTitle, Box, TextField, Autocomplete, Chip } from "@mui/material";
import { useTheme } from "@emotion/react";
import LoadingScreen from "../Components/LoadingScreen";
import StyledButton from "../MainPages/StyledButton";
import CloseIcon from "@mui/icons-material/Close";

const AddClientDialog = ({
  closePopup,
  openPopup,
  loading,
  handleNewClientChange,
  skillsArr,
  jobTypeArr,
  clientStagesArr,
  addClientFnc,
  autoCompleteStages,
  autoCompleteSkills,
  autoCompleteJobType,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={openPopup}
      onClose={closePopup}
      sx={{
        "& .MuiDialog-paper": {
          width: "1000px",
          maxWidth: "100%",
          height: "550px",
          padding: "35px",
          borderRadius: theme.borderRadius,
          border: theme.border,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      {loading && <LoadingScreen />}
      <DialogTitle sx={{ padding: "0px", fontSize: "25px", marginBottom: "20px" }}>
        Add New Client
      </DialogTitle>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <TextField
          type="text"
          variant="outlined"
          label="First name"
          name="firstName"
          onChange={handleNewClientChange}
          sx={{ marginBottom: "20px", width: "32%" }}
        />

        <TextField
          type="text"
          variant="outlined"
          label="Last name"
          name="lastName"
          onChange={handleNewClientChange}
          sx={{ marginBottom: "20px", width: "32%" }}
        />

        <TextField
          type="text"
          variant="outlined"
          label="Looking for"
          name="lookingFor"
          onChange={handleNewClientChange}
          sx={{ marginBottom: "20px", width: "32%" }}
        />

        <Autocomplete
          disablePortal
          name="currentStage"
          id="combo-box-demo"
          options={clientStagesArr.currentStages}
          onChange={autoCompleteStages}
          sx={{ width: "32%", marginBottom: "20px" }}
          renderInput={(params) => <TextField {...params} label="Current stage" />}
        />

        <Autocomplete
          multiple
          limitTags={2}
          id="multiple-limit-tags"
          options={skillsArr.skills}
          onChange={autoCompleteSkills}
          name="requiredSkills"
          getOptionLabel={(option) => option}
          renderInput={(params) => <TextField {...params} label="Skills required" />}
          sx={{ width: "100%", marginBottom: "20px" }}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={index}
                label={option}
                padding="0px"
                deleteIcon={<CloseIcon style={{ color: "white", fontSize: "12px" }} />}
                {...getTagProps({ index })}
                style={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                  borderRadius: "4px",
                  fontSize: "12px",
                  marginRight: "4px",
                }}
              />
            ))
          }
        />

        <TextField
          type="date" // Set the input type to "date"
          variant="outlined"
          label="Start date"
          name="startDate"
          onChange={handleNewClientChange}
          sx={{ marginBottom: "20px", width: "49%" }}
          InputLabelProps={{
            shrink: true, // This ensures the label floats when the input is focused or filled
          }}
        />

        <Autocomplete
          id="combo-box-demo"
          options={jobTypeArr}
          onChange={autoCompleteJobType}
          sx={{ width: "49%", marginBottom: "20px" }}
          renderInput={(params) => <TextField {...params} label="Job type" />}
        />

        <TextField
          multiline
          rows={3}
          label="Notes"
          onChange={handleNewClientChange}
          name="notes"
          variant="outlined"
          sx={{ marginBottom: "20px", width: "100%" }}
        />
      </Box>

      <Box sx={{ display: "flex", width: "100%", justifyContent: "flex-start" }}>
        <StyledButton onClick={closePopup} sx={{ marginRight: "10px" }} variant="secondary">
          Close
        </StyledButton>
        <StyledButton variant="main" onClick={addClientFnc}>
          Add New Client
        </StyledButton>
      </Box>
    </Dialog>
  );
};

export default AddClientDialog;
