import { useTheme } from "@emotion/react";
import {
  Container,
  Typography,
  Stack,
  useMediaQuery,
  TextField,
  Autocomplete,
  Checkbox,
} from "@mui/material";
import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import { createNewClientUrl, getAllSkills } from "../ApiUrls";
import StyledButton from "../MainPages/StyledButton";
import Notification from "../Components/Notification";
import LoadingScreen from "../Components/LoadingScreen";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const RegisterClient = () => {
  const [notificationHandle, setNotificationHandle] = useState({});
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isiPad = useMediaQuery(
    "(max-width: 1200px) and (orientation: landscape), (max-height: 1024px) and (orientation: portrait)"
  );
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [skillsArr, setSkills] = useState({ skills: [] });
  const clientForm = useSelector((state) => state.clientApp.clientFormData);

  const jobTypeArr = ["Full-time Virtual Assistant", "Part-time Virtual Assistant"];

  const desiredWidth = isMobile ? null : isTablet || isiPad ? 700 : 800;

  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    const getSkillsData = async () => {
      const { data: skillsData } = await axios.get(getAllSkills);
      const skillsArr = skillsData[0];
      setSkills(skillsArr);
    };

    getSkillsData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (clientForm.password !== clientForm.confirmPassword) {
      setNotificationHandle({
        open: true,
        type: "error",
        text: "Passwords don't match.",
      });
    } else {
      try {
        setLoading(true);
        const newClient = {
          firstName: clientForm.firstName,
          lastName: clientForm.lastName,
          companyName: clientForm.companyName,
          phone: clientForm.phone,
          email: clientForm.email,
          password: clientForm.password,
          confirmPassword: clientForm.confirmPassword,
          lookingFor: clientForm.lookingFor,
          jobType: clientForm.jobType,
          requiredSkills: clientForm.requiredSkills,
          currentStage: "New potential client",
        };

        const { data } = await axios.post(createNewClientUrl, newClient);
        if (data) {
          Cookies.set("client-firstName", data.Recruiter.firstName, { expires: 1 });
          Cookies.set("clientId", data.Recruiter._id, { expires: 1 });
          Cookies.set("clientToken", data.token, { expires: 1 });

          setNotificationHandle({
            open: true,
            type: "info",
            text: "Successfully registered!",
          });

          setTimeout(() => {
            navigate("/client/dashboard");
            setLoading(false);
          }, 1500);
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
        setNotificationHandle({
          open: true,
          type: "error",
        });
      }
    }
  };

  const registerClientData = (e, selectedItem) => {
    if (selectedItem) {
      dispatch({ type: "UPDATE_CLIENT_DATA", payload: { jobType: selectedItem } });
      console.log(clientForm);
    } else {
      const { name, value } = e.target;
      dispatch({ type: "UPDATE_CLIENT_DATA", payload: { [name]: value } });
      console.log(clientForm);
    }
  };

  return (
    <>
      {loading && <LoadingScreen />}
      {!loading ? (
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: isMobile ? "10px" : "5px", // Adjust padding for mobile
            marginBottom: "20px",
            alignItems: "center", // Center align for mobile
            justifyContent: "center", // Center align for mobile
          }}
        >
          <form onSubmit={handleSubmit}>
            <Stack direction="column" spacing={isMobile ? 2 : 4}>
              <Stack flex={1} spacing={isMobile ? 1 : 2} justifyContent="center" textAlign="center">
                <Typography variant={isMobile ? "h4" : "h3"} component="h1" fontWeight={600}>
                  Let's connect!
                </Typography>
                <Typography variant="p" component="p">
                  Drop your accurate personal details below so we can stay in the loop.
                </Typography>
              </Stack>
              <Stack spacing={2}>
                <Stack
                  gap="15px"
                  width={desiredWidth}
                  flex={1}
                  boxShadow={[theme.shadows[11]]}
                  border={theme.border}
                  borderRadius={theme.borderRadius}
                  p={4}
                >
                  <Stack flexDirection={isMobile ? "column" : "row"} gap={2}>
                    <TextField
                      type="text"
                      variant="outlined"
                      label="First name"
                      required
                      value={clientForm.firstName}
                      name="firstName"
                      onChange={registerClientData}
                      fullWidth
                    />
                    <TextField
                      type="text"
                      variant="outlined"
                      label="Last name"
                      required
                      value={clientForm.lastName}
                      name="lastName"
                      onChange={registerClientData}
                      fullWidth
                    />
                  </Stack>
                  <Stack flexDirection={isMobile ? "column" : "row"} gap={2}>
                    <TextField
                      type="tel"
                      variant="outlined"
                      required
                      label="Phone Number"
                      value={clientForm.phone}
                      name="phone"
                      onChange={registerClientData}
                      fullWidth
                    />
                    <TextField
                      type="email"
                      variant="outlined"
                      label="Email"
                      required
                      value={clientForm.email}
                      name="email"
                      onChange={registerClientData}
                      fullWidth
                    />
                  </Stack>
                  <Stack flexDirection={isMobile ? "column" : "row"} gap={2}>
                    <TextField
                      type="text"
                      variant="outlined"
                      value={clientForm.companyName}
                      name="companyName"
                      required
                      onChange={registerClientData}
                      fullWidth
                      label="Company Name"
                    />
                    <TextField
                      type="text"
                      variant="outlined"
                      label="lookingFor"
                      required
                      value={clientForm.lookingFor}
                      name="lookingFor"
                      onChange={registerClientData}
                      fullWidth
                    />
                  </Stack>
                  <Stack flexDirection={isMobile ? "column" : "row"} gap={2}>
                    <Autocomplete
                      fullWidth
                      multiple
                      limitTags={isMobile ? 1 : 4}
                      id="checkboxes-tags-demo"
                      options={skillsArr.skills}
                      onChange={(e, selectedOptions) => {
                        const selectedSkills = selectedOptions.map((option) => option);
                        dispatch({
                          type: "UPDATE_CLIENT_DATA",
                          payload: { requiredSkills: selectedSkills },
                        });
                      }}
                      value={clientForm.requiredSkills.map((title) =>
                        skillsArr.skills.find((skill) => skill === title)
                      )}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox
                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Required Skills"
                          placeholder="Select required skills from your Va's"
                        />
                      )}
                    />
                    <Autocomplete
                      id="combo-box-demo"
                      options={jobTypeArr}
                      name="jobType"
                      value={clientForm.jobType || null}
                      fullWidth
                      onChange={(event, value) => {
                        registerClientData(event, value);
                      }}
                      renderInput={(params) => <TextField {...params} label="Job type" />}
                    />
                  </Stack>
                  <Stack flexDirection={isMobile ? "column" : "row"} gap={2}>
                    <TextField
                      type="password"
                      variant="outlined"
                      label="Password"
                      required
                      value={clientForm.password}
                      name="password"
                      onChange={registerClientData}
                      fullWidth
                    />
                    <TextField
                      type="password"
                      variant="outlined"
                      value={clientForm.confirmPassword}
                      name="confirmPassword"
                      required
                      onChange={registerClientData}
                      fullWidth
                      label="Confirm Password"
                    />
                  </Stack>
                </Stack>
              </Stack>
              <Stack flexDirection="row" justifyContent="center" gap={isMobile ? 1 : 2}>
                <StyledButton
                  disabled={
                    clientForm.password &&
                    clientForm.confirmPassword &&
                    clientForm.firstName &&
                    clientForm.lastName &&
                    clientForm.phone &&
                    clientForm.email &&
                    clientForm.lookingFor &&
                    clientForm.jobType &&
                    clientForm.requiredSkills.length > 0
                      ? false
                      : true
                  }
                  variant="main"
                  type="Submit"
                >
                  Submit
                </StyledButton>
              </Stack>
            </Stack>
          </form>
          {notificationHandle.open && (
            <Notification
              notification={notificationHandle}
              onClose={() => setNotificationHandle({})}
            />
          )}
        </Container>
      ) : null}
    </>
  );
};

export default RegisterClient;
