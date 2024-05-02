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
} from "@mui/material";
import { useTheme } from "@emotion/react";
import StyledButton from "../MainPages/StyledButton";
import WindowLink from "../Components/WindowLink";
import CloseIcon from "@mui/icons-material/Close";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { AttachmentOutlined, Height } from "@mui/icons-material";
import LoadingScreen from "../Components/LoadingScreen";

const DialogVAComp = ({
  openPopup,
  closePopup,
  oneVa,
  handleChange,
  clientData,
  updateVaData,
  skillsArr,
  langsArr,
  vaStagesArr,
  vaLinks,
  handleFocus,
  handleBlur,
  isFocused,
  handleAutocompleteChange1,
  handleAutocompleteChange2,
  handleAutocompleteChange3,
  handleAutocompleteChange4,
  loading,
}) => {
  const theme = useTheme();

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const educationArr = oneVa?.education?.map((e) => {
    if (oneVa.noEducation) {
      return (
        <Typography component="span" variant="span">
          No Education
        </Typography>
      );
    } else {
      return (
        <Typography display="flex">
          - {e.educationTitle} in {e.collageUniversity}, Year of Graduation {new Date(e.toDate).toLocaleDateString()}
        </Typography>
      );
    }
  });

  const experienceArr = oneVa?.experience?.map((exp) => {
    return (
      <Typography>
        - {exp.companyName} from {new Date(exp.fromDate).toLocaleDateString()} until{" "}
        {new Date(exp.toDate).toLocaleDateString()}
      </Typography>
    );
  });

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
      <Box display="flex" flexDirection="column">
        {loading && <LoadingScreen />}
        <DialogTitle sx={{ padding: "0px", fontSize: "25px", marginBottom: "20px" }}>
          Edit {oneVa.fullname}
        </DialogTitle>

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
            label="Full name"
            name="fullname"
            value={oneVa.fullname}
            onChange={handleChange}
            sx={{ width: "100%" }}
          />

          <TextField
            type="text"
            variant="outlined"
            name="phone"
            value={oneVa.phone}
            onChange={handleChange}
            label="Phone"
            sx={{ width: "100%" }}
          />

          <TextField
            type="text"
            variant="outlined"
            name="email"
            value={oneVa.email}
            onChange={handleChange}
            label="Email"
            sx={{ width: "100%" }}
          />

          <TextField
            type="text"
            variant="outlined"
            name="age"
            value={oneVa.age}
            onChange={handleChange}
            label="Age"
            sx={{ width: "100%" }}
          />

          <TextField
            multiline
            rows={3}
            cols={10}
            label="Short Bio"
            name="shortBio"
            onChange={handleChange}
            value={oneVa.shortBio}
            variant="outlined"
            sx={{ width: "100%" }}
          />

          <TextField
            type="text"
            variant="outlined"
            name="address"
            value={oneVa.address}
            onChange={handleChange}
            label="Address"
            sx={{ width: "100%" }}
          />

          <TextField
            type="text"
            variant="outlined"
            name="city"
            value={oneVa.city}
            onChange={handleChange}
            label="City"
            sx={{ width: "48%" }}
          />
          <TextField
            type="text"
            variant="outlined"
            name="country"
            value={oneVa.country}
            onChange={handleChange}
            label="Country"
            sx={{ width: "48%" }}
          />

          <TextField
            type="text"
            variant="outlined"
            name="position"
            value={oneVa.position}
            onChange={handleChange}
            label="Preferred position"
            sx={{ width: "100%" }}
          />

          <Autocomplete
            multiple
            limitTags={3}
            id="multiple-limit-tags"
            options={skillsArr.skills}
            name="skills"
            onChange={handleAutocompleteChange2}
            value={oneVa.skills.map((title) => skillsArr.skills.find((skill) => skill === title))}
            getOptionLabel={(option) => option}
            renderInput={(params) => <TextField {...params} label="Skills" />}
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
            multiline
            rows={4}
            cols={10}
            disabled="true"
            label="Cover letter"
            name="coverLetterText"
            onChange={handleChange}
            value={oneVa.coverLetterText}
            variant="outlined"
            sx={{ width: "100%" }}
          />

          <TextField
            multiline
            label="Achievements"
            name="achievements"
            onChange={handleChange}
            value={oneVa.achievements}
            variant="outlined"
            sx={{ width: "100%" }}
          />

          <TextField
            multiline
            label="Industries"
            name="industries"
            onChange={handleChange}
            value={oneVa.industries}
            variant="outlined"
            sx={{ width: "48%" }}
          />

          <TextField
            multiline
            label="Strengths"
            name="strengths"
            onChange={handleChange}
            value={oneVa.strengths}
            variant="outlined"
            sx={{ width: "48%" }}
          />

          <TextField
            variant="outlined"
            label="Created"
            type={isFocused ? "date" : "text"}
            value={new Date(oneVa.createdAt).toLocaleDateString()}
            disabled
            onFocus={handleFocus}
            onBlur={handleBlur}
            sx={{ width: "48%" }}
            InputLabelProps={{
              shrink: true, // This ensures the label floats when the input is focused or filled
            }}
          />

          <Autocomplete
            id="combo-box-demo"
            name="status"
            onChange={handleAutocompleteChange3}
            options={vaStagesArr.currentStages}
            value={oneVa.status || null}
            sx={{ width: "48%" }}
            renderInput={(params) => <TextField {...params} label="Current stage" />}
          />

          <Autocomplete
            multiple
            limitTags={3}
            id="multiple-limit-tags"
            options={langsArr.languages}
            name="languages"
            onChange={handleAutocompleteChange4}
            value={oneVa?.languages.map((title) =>
              langsArr.languages.find((lang) => lang === title)
            )}
            getOptionLabel={(option) => option}
            renderInput={(params) => <TextField {...params} label="Languages" />}
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

          <Autocomplete
            multiple
            limitTags={1}
            disableClearable
            id="checkboxes-tags-demo"
            options={clientData}
            disableCloseOnSelect
            value={oneVa.assignedRec.map((assigned) => {
              const client = clientData.find((client) => client._id === assigned._id);
              return client ? client.firstName + client.lastName : "";
            })}
            onChange={handleAutocompleteChange1}
            getOptionLabel={(option) => option.firstName + option.lastName}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={oneVa.assignedRec.some((assigned) => assigned._id === option._id)}
                />
                <div>
                  <Typography>{option.firstName} {option.lastName}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {option.JobType}
                  </Typography>
                </div>
              </li>
            )}
            style={{ width: "100%" }}
            renderInput={(params) => <TextField {...params} label="Assign Client" />}
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
            multiline
            rows={4}
            cols={10}
            label="Notes"
            name="notes"
            onChange={handleChange}
            value={oneVa.notes}
            variant="outlined"
            sx={{ width: "100%" }}
          />

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

          <Stack flexDirection="row" flexWrap="wrap" gap={1}>
            {Object.entries(vaLinks).map(
              ([key, value], index) =>
                value && (
                  <Box
                    key={index}
                    sx={{
                      backgroundColor: "#e2e2e2",
                      padding: "5px 13px",
                      borderRadius: theme.borderRadius,
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none !important",
                      fontSize: "14px",
                      color: "#5c5c5c",
                      transition: "0.2s",
                      "&:hover": {
                        backgroundColor: "black",
                        color: "white",
                        cursor: "pointer",
                      },
                    }}
                  >
                    <WindowLink url={value} fieldName={key} />
                  </Box>
                )
            )}
          </Stack>
        </Box>
        <Box sx={{ marginTop: "10px" }}>
          <StyledButton onClick={updateVaData} variant="main">
            Update Info
          </StyledButton>

          <StyledButton onClick={closePopup} sx={{ marginLeft: "10px" }} variant="secondary">
            Close
          </StyledButton>
        </Box>
      </Box>
    </Dialog>
  );
};

export default DialogVAComp;
