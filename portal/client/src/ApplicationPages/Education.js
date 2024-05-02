import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  useMediaQuery,
} from "@mui/material";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import StyledButton from "../MainPages/StyledButton";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { CheckCircle } from "@mui/icons-material";
import { useTheme } from "@emotion/react";

const Education = () => {
  const formData = useSelector((state) => state.app.formData);
  const [today] = useState(dayjs);
  const [stepData, setStepData] = useOutletContext();
  const [dateValidation, setDateValidation] = useState({
    fromDate: false,
    toDate: false,
  });
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check for mobile screens

  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isiPad = useMediaQuery(
    "(max-width: 1200px) and (orientation: landscape), (max-height: 1024px) and (orientation: portrait)"
  );

  useEffect(() => {
    setStepData({ name: "Personal Information", count: 3 });
  }, []);

  const dispatch = useDispatch();

  const [activeFormIndex, setActiveFormIndex] = useState(0);

  const addPlaceOfEducation = () => {
    const updatedEducation = [...formData.education];
    updatedEducation.push({
      collageUniversity: "",
      educationTitle: "",
      fromDate: "",
      toDate: "",
    });

    dispatch({
      type: "UPDATE_FORM_DATA",
      payload: {
        education: updatedEducation,
      },
    });

    setActiveFormIndex(updatedEducation.length - 1);
  };

  const handleFormClick = (index) => {
    setActiveFormIndex(index);
  };

  const handleEducationCheck = (e) => {
    const payload = {
      type: "UPDATE_FORM_DATA",
      payload: {
        noEducation: e.target.checked,
      },
    };

    if (e.target.checked) {
      payload.payload.education = [
        {
          collageUniversity: "",
          educationTitle: "",
          fromDate: "",
          toDate: "",
        },
      ];
    }

    dispatch(payload);
  };

  const handlePresentCheck = (e, activeFormIndex) => {
    dispatch({
      type: "UPDATE_FORM_DATA",
      payload: {
        education: formData.education.map((education, index) => {
          if (index === activeFormIndex) {
            return {
              ...education,
              toDate: e.target.checked ? "Present" : "",
            };
          }
          return education;
        }),
      },
    });
  };

  return (
    <Box>
      <Stack
        
        pt={0}
        spacing={2}
        textAlign="center"
        alignItems="center"
      >
        <Typography variant={isMobile ? "h6" : "h5"} component="h5" fontWeight={800}>
          Education
        </Typography>
        <FormGroup>
          <FormControlLabel
            checked={formData.noEducation}
            control={<Checkbox onChange={(e) => handleEducationCheck(e)} />}
            label="No Formal Schooling Attended"
          />
        </FormGroup>
        {!formData.noEducation && (
          <>
            <Stack
              direction="row"
              gap={2}
              justifyContent="center"
              alignItems="center"
              flexWrap="wrap"
            >
              {formData.education.map((form, placeIndex) => (
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
            <Box
              key={activeFormIndex}
              sx={{ display: "flex", flexDirection: "column", gap: "15px", width: "100%" }}
            >
              <Stack flexDirection={isMobile || isTablet || isiPad ? "column" : "row"} gap={2}>
                <TextField
                  fullWidth
                  type="text"
                  variant="outlined"
                  label="Collage/University"
                  name="collageUniversity"
                  value={formData.education[activeFormIndex]?.collageUniversity}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_FORM_DATA",
                      payload: {
                        education: formData.education.map((education, index) => {
                          if (index === activeFormIndex) {
                            return {
                              ...education,
                              collageUniversity: e.target.value,
                            };
                          }
                          return education;
                        }),
                      },
                    })
                  }
                />

                <TextField
                  fullWidth
                  type="text"
                  variant="outlined"
                  label="Education Title"
                  value={formData.education[activeFormIndex]?.educationTitle}
                  name="EducationTitle"
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_FORM_DATA",
                      payload: {
                        education: formData.education.map((education, index) => {
                          if (index === activeFormIndex) {
                            return {
                              ...education,
                              educationTitle: e.target.value,
                            };
                          }
                          return education;
                        }),
                      },
                    })
                  }
                />
              </Stack>
              <Stack direction={isMobile ? "column" : "row"} columnGap={2}>
                {/*
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer
                    sx={{ padding: 0, flex: 1, ...(isMobile && { marginBottom: "15px" }) }}
                    components={["DatePicker"]}
                  >
                    <DatePicker
                      views={["year", "month"]}
                      maxDate={today}
                      slotProps={{
                        field: {
                            readOnly: true
                        }}}
                      value={formData.education[activeFormIndex]?.fromDate || null}
                      label="From date"
                      onAccept={(date) =>
                        dispatch({
                          type: "UPDATE_FORM_DATA",
                          payload: {
                            education: formData.education.map((education, index) => {
                              if (index === activeFormIndex) {
                                return {
                                  ...education,
                                  fromDate: date,
                                };
                              }
                              return education;
                            }),
                          },
                        })
                      }
                      onError={() =>
                        dispatch({
                          type: "UPDATE_FORM_DATA",
                          payload: {
                            education: formData.education.map((education, index) => {
                              if (index === activeFormIndex) {
                                return {
                                  ...education,
                                  fromDate: "",
                                };
                              }
                              return education;
                            }),
                          },
                        })
                      }
                    />
                  </DemoContainer>
                </LocalizationProvider>
                    */}
                {formData.education[activeFormIndex].toDate !== "Present" ? (
                  <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <DemoContainer sx={{ padding: 0, flex: 1}} components={["DatePicker"]}>
                      <DatePicker
                        sx={{width: '100%'}}
                        views={["year", "month"]}
                        label="Year of Graduation"
                        maxDate={today}
                        slotProps={{
                          field: {
                              readOnly: true
                          }}}
                        value={formData.education[activeFormIndex]?.toDate || null}
                        onAccept={(date) =>
                          dispatch({
                            type: "UPDATE_FORM_DATA",
                            payload: {
                              education: formData.education.map((education, index) => {
                                if (index === activeFormIndex) {
                                  return {
                                    ...education,
                                    toDate: date,
                                  };
                                }
                                return education;
                              }),
                            },
                          })
                        }
                        onError={() =>
                          dispatch({
                            type: "UPDATE_FORM_DATA",
                            payload: {
                              education: formData.education.map((education, index) => {
                                if (index === activeFormIndex) {
                                  return {
                                    ...education,
                                    toDate: "",
                                  };
                                }
                                return education;
                              }),
                            },
                          })
                        }
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                ) : (
                  <Stack
                    sx={{ border: "rgba(0, 0, 0, 0.23) solid 1px", borderRadius: 1 }}
                    flexDirection="row"
                    gap={1}
                    alignItems="center"
                    justifyContent="center"
                    color="green"
                    flex={1}
                    padding={2}
                  >
                    <CheckCircle fontSize="15px" />
                    <Typography variant="span" component="span">
                      Present
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Box>
            <FormGroup>
              <FormControlLabel
                checked={formData.education[activeFormIndex].toDate == "Present" ? true : false}
                control={<Checkbox onChange={(e) => handlePresentCheck(e, activeFormIndex)} />}
                label="Still studying"
              />
            </FormGroup>
            <StyledButton
              variant="main"
              onClick={addPlaceOfEducation}
              sx={{ backgroundColor: "black", alignSelf: "center" }}
            >
              Add More
            </StyledButton>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default Education;
