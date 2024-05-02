import { useTheme } from "@emotion/react";
import {
  Box,
  Typography,
  Stack,
  TextField,
  Autocomplete,
  Checkbox,
  Button,
  FormGroup,
  FormControlLabel,
  useMediaQuery,
} from "@mui/material";
import * as React from "react";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import StyledButton from "../MainPages/StyledButton";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { CheckCircle } from "@mui/icons-material";
import axios from "axios";
import { getAllSkills } from "../ApiUrls";

const AbilitiesKnowledge = () => {
  const [stepData, setStepData] = useOutletContext();
  const [today, setToday] = useState(dayjs);
  const [skillsArr, setSkills] = useState({ skills: [] });

  const dispatch = useDispatch();

  const formData = useSelector((state) => state.app.formData);

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check for mobile screens

  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isiPad = useMediaQuery(
    "(max-width: 1200px) and (orientation: landscape), (max-height: 1024px) and (orientation: portrait)"
  );

  useEffect(() => {
    setStepData({ name: "Career ", count: 2, requiredFields: false });

    const getData = async () => {
      const { data: skillsData } = await axios.get(getAllSkills);

      const skillsArr = skillsData[0];
      setSkills(skillsArr);
    };

    getData();
  }, []);

  useEffect(() => {
    console.log("hello");
    if (
      formData.industries &&
      formData.achievements &&
      formData.strengths &&
      formData.industries &&
      formData.skills[0] &&
      formData.experience[0].companyName &&
      formData.experience[0].companyLocation &&
      formData.experience[0].fromDate &&
      formData.experience[0].toDate &&
      formData.experience[0].description
    ) {
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
  }, [
    formData.industries,
    formData.strengths,
    formData.achievements,
    formData.skills[0],
    formData.experience[0].companyName,
    formData.experience[0].companyLocation,
    formData.experience[0].fromDate,
    formData.experience[0].toDate,
    formData.experience[0].description,
  ]);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const [activeFormIndex, setActiveFormIndex] = useState(0);

  const addPlaceOfEmployment = () => {
    const updatedExperience = [...formData.experience];
    updatedExperience.push({
      companyName: "",
      companyLocation: "",
      fromDate: "",
      toDate: "",
      description: "",
    });

    dispatch({
      type: "UPDATE_FORM_DATA",
      payload: {
        experience: updatedExperience,
      },
    });

    setActiveFormIndex(updatedExperience.length - 1);
  };

  const handleFormClick = (index) => {
    setActiveFormIndex(index);
  };

  const handlePresentCheck = (e, activeFormIndex) => {
    dispatch({
      type: "UPDATE_FORM_DATA",
      payload: {
        experience: formData.experience.map((experience, index) => {
          if (index === activeFormIndex) {
            return {
              ...experience,
              toDate: e.target.checked ? "Present" : "",
            };
          }
          return experience;
        }),
      },
    });
  };

  const applicationDataUpdate = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "UPDATE_FORM_DATA", payload: { [name]: value } });
  };
  

  return (
    <Stack gap={4}>
      <Stack
        boxShadow={theme.shadows[11]}
        border={theme.border}
        borderRadius={theme.borderRadius}
        p={isMobile ? "35px" : "50px"}
        spacing={5}
      >
        <Stack spacing={2}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            component="h5"
            fontWeight={800}
            alignSelf="center"
          >
            Professional Experience
          </Typography>

          <Autocomplete
            multiple
            limitTags={isMobile ? 1 : 4}
            id="checkboxes-tags-demo"
            options={skillsArr.skills}
            onChange={(e, selectedOptions) => {
              const selectedSkills = selectedOptions.map((option) => option);
              dispatch({
                type: "UPDATE_FORM_DATA",
                payload: { skills: selectedSkills },
              });
            }}
            value={formData.skills.map((title) =>
              skillsArr.skills.find((skill) => skill === title)
            )}
            disableCloseOnSelect
            getOptionLabel={(option) => option}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option}
              </li>
            )}
            renderInput={(params) => (
              <TextField required {...params} label="Skills" placeholder="Select skills" />
            )}
          />
          <TextField
            type="text"
            variant="outlined"
            label="Industries"
            name="industries"
            required
            value={formData.industries}
            onChange={applicationDataUpdate}
          />
        </Stack>
      </Stack>
      <Stack
        boxShadow={theme.shadows[11]}
        border={theme.border}
        borderRadius={theme.borderRadius}
        p={isMobile ? "35px" : "50px"}
        spacing={5}
      >
        <Typography variant="span" component="span" fontWeight="bold" alignSelf="center">
          Employment Background
        </Typography>
        <Stack direction="row" gap={2} alignItems="center" flexWrap="wrap" justifyContent="center">
          {formData.experience.map((form, placeIndex) => (
            <Button
              key={placeIndex}
              variant="outlined"
              onClick={() => handleFormClick(placeIndex)}
              sx={{
                minWidth: "50px",
                height: "50px",
                opacity: placeIndex !== activeFormIndex ? 0.3 : 1,
                "&:hover": { opacity: placeIndex !== activeFormIndex ? 1 : 1 },
              }}
            >
              {placeIndex + 1}
            </Button>
          ))}
        </Stack>
        <Box key={activeFormIndex}>
          <Stack direction="column" rowGap={2}>
            <Stack direction={isMobile || isTablet || isiPad ? "column" : "row"} columnGap={2} rowGap={2}>
              <TextField
                type="text"
                variant="outlined"
                label="Company Name"
                name="companyName"
                value={formData.experience[activeFormIndex]?.companyName}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FORM_DATA",
                    payload: {
                      experience: formData.experience.map((experience, index) => {
                        if (index === activeFormIndex) {
                          return {
                            ...experience,
                            companyName: e.target.value,
                          };
                        }
                        return experience;
                      }),
                    },
                  })
                }
                sx={{ width: "100%", ...(isMobile && { marginBottom: "15px" }) }}
              />
              <TextField
                type="text"
                variant="outlined"
                label="Company Location"
                value={formData.experience[activeFormIndex]?.companyLocation}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FORM_DATA",
                    payload: {
                      experience: formData.experience.map((experience, index) => {
                        if (index === activeFormIndex) {
                          return {
                            ...experience,
                            companyLocation: e.target.value,
                          };
                        }
                        return experience;
                      }),
                    },
                  })
                }
                sx={{ width: "100%" }}
              />
            </Stack>
            <Stack direction={isMobile || isTablet || isiPad ? "column" : "row"} columnGap={2} rowGap={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  sx={{ padding: 0, ...(isMobile && { marginBottom: "15px" }) }}
                  components={["DatePicker"]}
                >
                  <DatePicker
                    views={["year", "month"]}
                    maxDate={today}
                    label="From date"
                    slotProps={{
                      field: {
                          readOnly: true
                      }
                    }
                  }
                    value={formData.experience[activeFormIndex]?.fromDate || null}
                    onAccept={(date) =>
                      dispatch({
                        type: "UPDATE_FORM_DATA",
                        payload: {
                          experience: formData.experience.map((experience, index) => {
                            if (index === activeFormIndex) {
                              return {
                                ...experience,
                                fromDate: date,
                              };
                            }
                            return experience;
                          }),
                        },
                      })
                    }
                    onError={() =>
                      dispatch({
                        type: "UPDATE_FORM_DATA",
                        payload: {
                          experience: formData.experience.map((experience, index) => {
                            if (index === activeFormIndex) {
                              return {
                                ...experience,
                                fromDate: "",
                              };
                            }
                            return experience;
                          }),
                        },
                      })
                    }
                  />
                </DemoContainer>
              </LocalizationProvider>
              {formData.experience[activeFormIndex].toDate !== "Present" ? (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer sx={{ padding: 0 }} components={["DatePicker"]}>
                    <DatePicker
                      views={["year", "month"]}
                      maxDate={today}
                      label="To date"
                      slotProps={{
                        field: {
                            readOnly: true
                        }
                      }
                    }
                      value={formData.experience[activeFormIndex]?.toDate || null}
                      onAccept={(date) =>
                        dispatch({
                          type: "UPDATE_FORM_DATA",
                          payload: {
                            experience: formData.experience.map((experience, index) => {
                              if (index === activeFormIndex) {
                                return {
                                  ...experience,
                                  toDate: date,
                                };
                              }
                              return experience;
                            }),
                          },
                        })
                      }
                      onError={() =>
                        dispatch({
                          type: "UPDATE_FORM_DATA",
                          payload: {
                            experience: formData.experience.map((experience, index) => {
                              if (index === activeFormIndex) {
                                return {
                                  ...experience,
                                  toDate: "",
                                };
                              }
                              return experience;
                            }),
                          },
                        })
                      }
                    />
                  </DemoContainer>
                </LocalizationProvider>
              ) : (
                <Stack
                  sx={{
                    border: "rgba(0, 0, 0, 0.23) solid 1px",
                    borderRadius: 1,
                  }}
                  flexDirection="row"
                  gap={1}
                  alignItems="center"
                  justifyContent="center"
                  color="green"
                  flex={1}
                >
                  <CheckCircle fontSize="15px" />
                  <Typography variant="span" component="span">
                    Present
                  </Typography>
                </Stack>
              )}
            </Stack>
            <FormGroup sx={{ alignSelf: "center" }}>
              <FormControlLabel
                checked={formData.experience[activeFormIndex].toDate == "Present" ? true : false}
                control={<Checkbox onChange={(e) => handlePresentCheck(e, activeFormIndex)} />}
                label="Still working"
              />
            </FormGroup>
          </Stack>
          <Stack direction="column" columnGap={2} mt={2}>
            <TextField
              type="text"
              value={formData.experience[activeFormIndex]?.description}
              variant="outlined"
              label="Describe your experience with the company"
              multiline
              rows={4}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_FORM_DATA",
                  payload: {
                    experience: formData.experience.map((experience, index) => {
                      if (index === activeFormIndex) {
                        return {
                          ...experience,
                          description: e.target.value,
                        };
                      }
                      return experience;
                    }),
                  },
                })
              }
              sx={{ flex: 10, marginBottom: "5px" }}
            />
          </Stack>
        </Box>
        <StyledButton
          variant="main"
          sx={{ backgroundColor: "black" }}
          onClick={addPlaceOfEmployment}
        >
          Add Another Place
        </StyledButton>
      </Stack>
      <Stack
        boxShadow={theme.shadows[11]}
        border={theme.border}
        borderRadius={theme.borderRadius}
        p={isMobile ? "35px" : "50px"}
        spacing={5}
      >
        <Stack spacing={2}>
          <Typography variant="h5" component="h5" fontWeight={800} alignSelf="center">
            Personal Abilities
          </Typography>
          <TextField
            type="text"
            multiline
            rows={3}
            variant="outlined"
            label="List 3 Notable Abilities"
            name="strengths"
            required
            value={formData.strengths}
            onChange={applicationDataUpdate}
          />
          <TextField
            type="text"
            multiline
            rows={5}
            variant="outlined"
            label="List 3 Primary Achievements"
            name="achievements"
            required
            value={formData.achievements}
            onChange={applicationDataUpdate}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default AbilitiesKnowledge;
