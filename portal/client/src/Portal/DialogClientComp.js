import React from "react";
import {
  Dialog,
  DialogTitle,
  Box,
  Stack,
  TextField,
  Autocomplete,
  Checkbox,
  Typography,
  Chip,
  DialogActions,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import StyledButton from "../MainPages/StyledButton";
import WindowLink from "../Components/WindowLink";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { AttachmentOutlined, Height } from "@mui/icons-material";
import LoadingScreen from "../Components/LoadingScreen";

const DialogClientComp = ({
  openPopup,
  closePopup,
  oneClientData,
  vaData,
  handleChange,
  updateClientData,
  skillsArr,
  jobType,
  clientStagesArr,
  handleFocus,
  handleBlur,
  isFocused,
  handleAutocompleteChange1,
  handleAutocompleteChange2,
  handleAutocompleteChange3,
  handleAutocompleteChange4,
  copiedTxt,
  copiedClip,
  loading,
}) => {
  const appURL = process.env.REACT_APP_URL;

  const theme = useTheme();

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return (
    <Dialog
      open={openPopup}
      onClose={closePopup}
      sx={{
        "& .MuiDialog-paper": {
          position: "fixed",
          right: 0,
          top: 0,
          width: "650px",
          padding: "15px 25px",
          height: "100% !important",
          margin: 0,
        },
        "& .css-10jb4jx-MuiPaper-root-MuiDialog-paper": {
          maxHeight: "100% !important",
        },
      }}
    >
      {loading && <LoadingScreen />}
      <DialogTitle sx={{ padding: "0px", fontSize: "25px", marginBottom: "20px" }}>
        Edit {oneClientData.firstName} {oneClientData.lastName}
      </DialogTitle>

      <Box display="flex" flexDirection="column">
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <TextField
            type="text"
            variant="outlined"
            label="First name"
            name="firstName"
            onChange={handleChange}
            value={oneClientData.firstName}
            sx={{ width: "48%" }}
          />

          <TextField
            type="text"
            variant="outlined"
            label="Last name"
            name="lastName"
            onChange={handleChange}
            value={oneClientData.lastName}
            sx={{ width: "48%" }}
          />

          <TextField
            type="text"
            variant="outlined"
            label="Company name"
            name="companyName"
            onChange={handleChange}
            value={oneClientData.companyName}
            sx={{ width: "100%" }}
          />

          <TextField
            type="text"
            variant="outlined"
            name="lookingFor"
            onChange={handleChange}
            value={oneClientData.lookingFor}
            label="Looking for"
            sx={{ width: "100%" }}
          />

          <Autocomplete
            id="combo-box-demo"
            name="currentStage"
            onChange={handleAutocompleteChange2}
            options={clientStagesArr.currentStages}
            value={oneClientData.currentStage || null}
            sx={{ width: "100%" }}
            renderInput={(params) => <TextField {...params} label="Current stage" />}
          />

          <Autocomplete
            multiple
            limitTags={3}
            id="multiple-limit-tags"
            options={skillsArr.skills}
            name="requiredSkills"
            onChange={handleAutocompleteChange3}
            value={oneClientData?.requiredSkills.map((title) =>
              skillsArr.skills.find((skill) => skill === title)
            )}
            getOptionLabel={(option) => option}
            renderInput={(params) => <TextField {...params} label="Skills required" />}
            sx={{ width: "100%" }}
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
            variant="outlined"
            label="Start date"
            name="startDate"
            onChange={handleChange}
            type={isFocused ? "date" : "text"}
            value={new Date(oneClientData.startDate).toLocaleDateString()}
            onFocus={handleFocus}
            onBlur={handleBlur}
            sx={{ width: "48%" }}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Autocomplete
            id="combo-box-demo"
            options={jobType}
            name="jobType"
            value={oneClientData.jobType || null}
            onChange={handleAutocompleteChange4}
            sx={{ width: "48%" }}
            renderInput={(params) => <TextField {...params} label="Job type" />}
          />

          <Autocomplete
            sx={{ width: "100%" }}
            multiple
            limitTags={1}
            disableClearable
            id="checkboxes-tags-demo"
            options={vaData}
            disableCloseOnSelect
            value={oneClientData.assignedVas.map((assigned) => {
              const Va = vaData.find((va) => va._id === assigned._id);
              return Va ? Va.fullname : "";
            })}
            onChange={handleAutocompleteChange1}
            getOptionLabel={(option) => option.fullname}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={oneClientData.assignedVas.some(
                    (assigned) => assigned._id === option._id
                  )}
                />
                <div>
                  <Typography>{option.fullname}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {option.JobType}
                  </Typography>
                </div>
              </li>
            )}
            style={{ width: "100%" }}
            renderInput={(params) => <TextField {...params} label="Assign Va" />}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  key={index}
                  label={option}
                  padding="0px"
                  deleteIcon={<AttachmentOutlined style={{ color: "white", fontSize: "18px" }} />}
                  {...getTagProps({ index })}
                  style={{
                    backgroundColor: theme.palette.primary.green,
                    color: "white",
                    borderRadius: "4px",
                    fontSize: "12px",
                    marginRight: "4px",
                  }}
                />
              ))
            }
          />

          <Autocomplete
            sx={{ width: "100%" }}
            multiple
            limitTags={1}
            disableClearable
            id="checkboxes-tags-demo"
            options={vaData}
            disableCloseOnSelect
            value={oneClientData.assignedVas
              .filter((assigned) => assigned.selected === true)
              .map((assigned) => {
                const Va = vaData.find(
                  (va) => va._id === assigned._id && assigned.selected === true
                );
                return Va ? Va.fullname : "";
              })}
            getOptionLabel={(option) => option.fullname}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  disabled
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={oneClientData.assignedVas.some(
                    (assigned) => assigned._id === option._id
                  )}
                />
                <div>
                  <Typography>{option.fullname}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {option.JobType}
                  </Typography>
                </div>
              </li>
            )}
            style={{ width: "100%" }}
            renderInput={(params) => <TextField {...params} label="Selected Va" />}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  key={index}
                  label={option}
                  padding="0px"
                  deleteIcon={<AttachmentOutlined style={{ color: "white", fontSize: "18px" }} />}
                  {...getTagProps({ index })}
                  style={{
                    backgroundColor: theme.palette.primary.green,
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
            sx={{ width: "100%" }}
            multiline
            value={oneClientData.notes}
            rows={7}
            cols={10}
            name="notes"
            onChange={handleChange}
            label="Notes"
            variant="outlined"
          />

          <DialogActions sx={{ padding: "0px" }}>
            <StyledButton onClick={closePopup} variant="secondary">
              Close
            </StyledButton>
            <StyledButton onClick={updateClientData} variant="main">
              Update Info
            </StyledButton>
            <TextField
              type="text"
              variant="outlined"
              label={`${appURL}/va-selection/` + oneClientData._id}
              name="link"
              disabled
              size="small"
              sx={{ marginLeft: 2, width: 160 }}
            />
            <StyledButton onClick={() => copiedTxt(oneClientData._id)} variant="secondary">
              {!copiedClip ? (
                <ContentCopyIcon fontSize="small" />
              ) : (
                <CheckCircleOutlineIcon fontSize="small" />
              )}
            </StyledButton>
          </DialogActions>
        </Box>
      </Box>
    </Dialog>
  );
};

export default DialogClientComp;
