import { useEffect, useState, useReducer } from "react";
import {
  Box,
  Container,
  Typography,
  TextField, Grid
} from "@mui/material";
import StyledButton from "../MainPages/StyledButton";
import Footer from "./Footer";
import { Edit } from "@mui/icons-material";
import Cookies from "js-cookie";
import { useTheme } from "@emotion/react";
import {
  getAllSkills,
  getAllLangs,
  getAllClientStages,
  getAllVaStages,
  addUpdateSkills,
  addUpdateLang,
  addUpdateClientStage,
  addUpdateVaStage,
} from "../ApiUrls";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";

const AdminSettings = () => {
  const theme = useTheme();
  const username = Cookies.get("username");

  const [skillsArr, setSkills] = useState({ skills: [] });
  const [langsArr, setLangs] = useState({ languages: [] });
  const [clientStagesArr, setClientStages] = useState({ currentStages: [] });
  const [vaStagesArr, setVaStages] = useState({ currentStages: [] });
  const [skill, setSkill] = useState("");
  const [language, setLanguage] = useState("");
  const [clientStage, setClientStage] = useState("");
  const [vaStage, setVaStage] = useState("");
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const getData = async () => {
      const { data: skillsData } = await axios.get(getAllSkills);

      const skillsArr = skillsData[0];
      setSkills(skillsArr);

      const { data: langsData } = await axios.get(getAllLangs);
      const langsArr = langsData[0];
      setLangs(langsArr);

      const { data: clientStages } = await axios.get(getAllClientStages);
      const clientStageArr = clientStages[0];
      setClientStages(clientStageArr);

      const { data: vaStages } = await axios.get(getAllVaStages);
      const vaStageArr = vaStages[0];
      setVaStages(vaStageArr);
    };

    getData();
  }, [reducerValue]);

  const handleSkillChange = (e) => {
    setSkill(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleClientStageChange = (e) => {
    setClientStage(e.target.value);
  };

  const handleVaStageChange = (e) => {
    setVaStage(e.target.value);
  };

  const addSkill = async () => {
    if (skill.trim() !== "") {
      const newSkillsArr = [...skillsArr.skills, skill];

      const { data } = await axios.put(addUpdateSkills(skillsArr._id), {
        skills: newSkillsArr,
      });

      if (data) {
        console.log(data);
        setSkill("");
        forceUpdate();
      }
    }
  };

  const addLanguage = async () => {
    if (language.trim() !== "") {
      const newLanguageArr = [...langsArr.languages, language];

      const { data } = await axios.put(addUpdateLang(langsArr._id), {
        languages: newLanguageArr,
      });

      if (data) {
        console.log(data);
        setLanguage("");
        forceUpdate();
      }
    }
  };

  const addClientStage = async () => {
    if (clientStage.trim() !== "") {
      const newClientStageArr = [...clientStagesArr.currentStages, clientStage];

      const { data } = await axios.put(
        addUpdateClientStage(clientStagesArr._id),
        {
          currentStages: newClientStageArr,
        }
      );

      if (data) {
        console.log(data);
        setClientStage("");
        forceUpdate();
      }
    }
  };

  const addVaStage = async () => {
    if (vaStage.trim() !== "") {
      const newVaStageArr = [...vaStagesArr.currentStages, vaStage];

      const { data } = await axios.put(addUpdateVaStage(vaStagesArr._id), {
        currentStages: newVaStageArr,
      });

      if (data) {
        console.log(data);
        setVaStage("");
        forceUpdate();
      }
    }
  };

  const removeSkill = (index) => {
    const newSkillsArr = [...skillsArr.skills];
    newSkillsArr.splice(index, 1); // Remove the skill at the specified index
    const updatedSkillsArr = { ...skillsArr, skills: newSkillsArr };

    axios
      .put(addUpdateSkills(updatedSkillsArr._id), {
        skills: updatedSkillsArr.skills,
      })
      .then((response) => {
        if (response.data) {
          console.log(response.data);
          forceUpdate(); // Trigger a re-render
        }
      })
      .catch((error) => {
        console.error("Error removing skill:", error);
      });
  };

  const removeLanguage = (index) => {
    const newLanguageArr = [...langsArr.languages];
    newLanguageArr.splice(index, 1); // Remove the language at the specified index
    const updatedLangsArr = { ...langsArr, languages: newLanguageArr };

    axios
      .put(addUpdateLang(updatedLangsArr._id), {
        languages: updatedLangsArr.languages,
      })
      .then((response) => {
        if (response.data) {
          console.log(response.data);
          setLangs(updatedLangsArr); // Update the state with the modified array
        }
      })
      .catch((error) => {
        console.error("Error removing language:", error);
      });
  };

  const removeClientStage = (index) => {
    const newClientStageArr = [...clientStagesArr.currentStages];
    newClientStageArr.splice(index, 1); // Remove the client stage at the specified index
    const updatedClientStagesArr = {
      ...clientStagesArr,
      currentStages: newClientStageArr,
    };

    axios
      .put(addUpdateClientStage(clientStagesArr._id), {
        currentStages: updatedClientStagesArr.currentStages,
      })
      .then((response) => {
        if (response.data) {
          console.log(response.data);
          setClientStages(updatedClientStagesArr); // Update the state with the modified array
        }
      })
      .catch((error) => {
        console.error("Error removing client stage:", error);
      });
  };

  const removeVaStage = (index) => {
    const newVaStageArr = [...vaStagesArr.currentStages];
    newVaStageArr.splice(index, 1); // Remove the VA stage at the specified index
    const updatedVaStagesArr = {
      ...vaStagesArr,
      currentStages: newVaStageArr,
    };

    axios
      .put(addUpdateVaStage(vaStagesArr._id), {
        currentStages: updatedVaStagesArr.currentStages,
      })
      .then((response) => {
        if (response.data) {
          console.log(response.data);
          setVaStages(updatedVaStagesArr); // Update the state with the modified array
        }
      })
      .catch((error) => {
        console.error("Error removing VA stage:", error);
      });
  };

  return (
    <Container>
      <Box
        height="auto"
        display="flex"
        flexWrap="wrap"
        alignItems="flex-end"
        marginTop="30px"
      >
        <Typography variant="p" component="p" width="100%">
          Lorem ipsum dolor sit amet
        </Typography>
        <Typography variant="h4" component="h1" width="66%" fontWeight={600}>
          Lurem ipsom dolor
        </Typography>
      </Box>

      <Box>
      
        <Box
          sx={{
            boxShadow: theme.shadows[11],
            border: theme.border,
            marginTop: "30px",
            display: "flex",
            flexWrap: "wrap",
            borderRadius: theme.borderRadius,
            padding: "25px",
            alignItems: "flex-start",
            height: "auto",
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            fontWeight={600}
            display="flex"
            alignItems="center"
            width="100%"
            marginBottom="30px"
          >
            <Edit
              style={{
                fontSize: "35px",
                color: "#c9c9c9",
                marginRight: "10px",
              }}
            />
            Update Skills
          </Typography>

          <TextField
            type="text"
            label="Add Skill"
            variant="outlined"
            value={skill}
            onChange={handleSkillChange}
            sx={{ marginBottom: "20px", width: "40%", marginRight: "10px" }}
          />

          <StyledButton
            variant="main"
            sx={{ width: "15%", height: "55px" }}
            onClick={addSkill}
          >
            Add Skill
          </StyledButton>

          <Box sx={{ marginTop: "15px" }}>
            <Grid container spacing={1}>
              {skillsArr.skills.map((skill, index) => (
                <Grid
                  item
                  key={index}
                  xs={12}
                  sm={6}
                  md={5}
                  lg={3}
                  xl={5}
                  sx={{
                    background: "#d3d3d3",
                    borderRadius: "100px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingBottom: "5px",
                    margin: "10px",
                  }}
                >
                  {skill}{" "}
                  <ClearIcon
                    fontSize="15px"
                    sx={{ marginLeft: "10px" }}
                    onClick={() => removeSkill(index)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          boxShadow: theme.shadows[11],
          border: theme.border,
          marginTop: "30px",
          display: "flex",
          flexWrap: "wrap",
          borderRadius: theme.borderRadius,
          padding: "25px",
          alignItems: "flex-start",
          height: "auto",
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          fontWeight={600}
          display="flex"
          alignItems="center"
          width="100%"
          marginBottom="30px"
        >
          <Edit
            style={{
              fontSize: "35px",
              color: "#c9c9c9",
              marginRight: "10px",
            }}
          />
          Update Languages
        </Typography>

        <TextField
          type="text"
          label="Add Language"
          variant="outlined"
          value={language}
          onChange={handleLanguageChange}
          sx={{ marginBottom: "20px", width: "40%", marginRight: "10px" }}
        />

        <StyledButton
          variant="main"
          sx={{ width: "25%", height: "55px" }}
          onClick={addLanguage}
        >
          Add Language
        </StyledButton>

        <Box sx={{ marginTop: "15px" }}>
          <Grid container spacing={1}>
            {langsArr.languages.map((lang, index) => (
              <Grid
                item
                key={index}
                xs={12}
                sm={6}
                md={5}
                lg={3}
                xl={5}
                sx={{
                  background: "#d3d3d3",
                  borderRadius: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingBottom: "5px",
                  margin: "10px",
                }}
              >
                {lang}{" "}
                <ClearIcon
                  fontSize="15px"
                  sx={{ marginLeft: "10px" }}
                  onClick={() => removeLanguage(index)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      <Box
        sx={{
          boxShadow: theme.shadows[11],
          border: theme.border,
          marginTop: "30px",
          display: "flex",
          flexWrap: "wrap",
          borderRadius: theme.borderRadius,
          padding: "25px",
          alignItems: "flex-start",
          height: "auto",
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          fontWeight={600}
          display="flex"
          alignItems="center"
          width="100%"
          marginBottom="30px"
        >
          <Edit
            style={{
              fontSize: "35px",
              color: "#c9c9c9",
              marginRight: "10px",
            }}
          />
          Update Client Stages
        </Typography>

        <TextField
          type="text"
          label="Add Client Stage"
          variant="outlined"
          value={clientStage}
          onChange={handleClientStageChange}
          sx={{ marginBottom: "20px", width: "40%", marginRight: "10px" }}
        />

        <StyledButton
          variant="main"
          sx={{ width: "20%", height: "55px" }}
          onClick={addClientStage}
        >
          Add Client Stage
        </StyledButton>

        <Box sx={{ marginTop: "15px" }}>
          <Grid container spacing={1}>
            {clientStagesArr.currentStages.map((stage, index) => (
              <Grid
                item
                key={index}
                xs={12}
                sm={6}
                md={5}
                lg={3}
                xl={5}
                sx={{
                  background: "#d3d3d3",
                  borderRadius: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingBottom: "5px",
                  margin: "10px",
                }}
              >
                {stage}
                <ClearIcon
                  fontSize="15px"
                  sx={{ marginLeft: "10px" }}
                  onClick={() => removeClientStage(index)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      <Box
        sx={{
          boxShadow: theme.shadows[11],
          border: theme.border,
          marginTop: "30px",
          display: "flex",
          flexWrap: "wrap",
          borderRadius: theme.borderRadius,
          padding: "25px",
          alignItems: "flex-start",
          height: "auto",
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          fontWeight={600}
          display="flex"
          alignItems="center"
          width="100%"
          marginBottom="30px"
        >
          <Edit
            style={{
              fontSize: "35px",
              color: "#c9c9c9",
              marginRight: "10px",
            }}
          />
          Update Va Stages
        </Typography>
        <TextField
          type="text"
          label="Add Client Stage"
          variant="outlined"
          value={vaStage}
          onChange={handleVaStageChange}
          sx={{ marginBottom: "20px", width: "40%", marginRight: "10px" }}
        />

        <StyledButton
          variant="main"
          sx={{ width: "20%", height: "55px" }}
          onClick={addVaStage}
        >
          Add Va Stage
        </StyledButton>

        <Box sx={{ marginTop: "15px" }}>
          <Grid container spacing={1}>
            {vaStagesArr.currentStages.map((stage, index) => (
              <Grid
                item
                key={index}
                xs={12}
                sm={6}
                md={5}
                lg={3}
                xl={5}
                sx={{
                  background: "#d3d3d3",
                  borderRadius: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingBottom: "5px",
                  margin: "10px",
                }}
              >
                {stage}
                <ClearIcon
                  fontSize="15px"
                  sx={{ marginLeft: "10px" }}
                  onClick={() => removeVaStage(index)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      <Footer />
    </Container>
  );
};

export default AdminSettings;
