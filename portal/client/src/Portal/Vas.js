import React, { useState, useEffect, useReducer } from "react";
import { useLocation } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import Footer from "./Footer";
import axios from "axios";
import Cookies from "js-cookie";
import {
  getAllVAsWithQUrl,
  updateVAUrl,
  deleteVAUrl,
  API_BASE_URL,
  getAllClientsUrl,
  getAllSkills,
  getAllVaStages,
  getAllLangs,
  getVaByIdUrl,
} from "../ApiUrls";

import { useTheme } from "@emotion/react";
import DialogRemoveVAComp from "./DialogRemoveVAComp";
import DialogVAComp from "./DialogVAComp";
import VasTable from "./VasTable";
import LoadingScreen from "../Components/LoadingScreen";

const Vas = () => {
  const theme = useTheme();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const q = queryParams.get("q");
  const token = Cookies.get("token");

  const headers = {
    Authorization: token,
  };
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = useState(false);
  const [vaData, setVaData] = useState([]);
  const [selectedHeadCell, setSelectedHeadCell] = useState("");

  const [clientData, setClientsData] = useState([]);
  const [oneVa, setOneVa] = useState({
    skills: [],
    languages: [],
    assignedRec: [],
  });
  const [vaId, setVAId] = useState([]);
  const [query, setQuery] = useState({ search: "" });
  const [isFocused, setIsFocused] = useState(false);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const [skillsArr, setSkills] = useState({ skills: [] });
  const [langsArr, setLangs] = useState({ languages: [] });
  const [vaStagesArr, setVaStages] = useState({ currentStages: [] });
  const [vaLinks, setVaLinks] = useState({});

  const fetchData = async () => {
    try {
      const { data: skillsData } = await axios.get(getAllSkills);

      const skillsArr = skillsData[0];
      setSkills(skillsArr);

      const { data: langsData } = await axios.get(getAllLangs);
      const langsArr = langsData[0];
      setLangs(langsArr);

      const { data: vaStages } = await axios.get(getAllVaStages);
      const vaStageArr = vaStages[0];
      setVaStages(vaStageArr);

      const { data } = await axios.get(getAllVAsWithQUrl(q), { headers });

      let filtered = data;

      if (query.search) {
        const regex = new RegExp(`^${query.search}`, "i");
        filtered = data.filter((va) => {
          return (
            regex.test(va.fullname) ||
            regex.test(va.position) ||
            regex.test(va.status) ||
            regex.test(va.notes) ||
            va.assignedRec.some((rec) => regex.test(rec.fullname)) ||
            va.skills.some((skill) => regex.test(skill)) ||
            va.languages.some((language) => regex.test(language))
          );
        });

        setVaData(filtered);
      } else if (selectedHeadCell) {
        if (selectedHeadCell === "Assigned") {
          const filteredRec = data.filter((va) => va.assignedRec && va.assignedRec.length > 0);
          setVaData(filteredRec);
        } else if (selectedHeadCell === "Full name") {
          const filteredNames = data.filter((va) => va.fullname && va.fullname.trim().length > 0);
          setVaData(filteredNames);
        } else if (selectedHeadCell === "Languages") {
          const filteredLang = data.filter((va) => va.languages && va.languages.length > 0);
          setVaData(filteredLang);
        } else if (selectedHeadCell === "Skills") {
          const filteredSkills = data.filter((va) => va.skills && va.skills.length > 0);
          setVaData(filteredSkills);
        } else if (selectedHeadCell === "Preferred position") {
          const filteredPosition = data.filter(
            (va) => va.position && va.position.trim().length > 0
          );
          setVaData(filteredPosition);
        } else if (selectedHeadCell === "Created") {
          const filteredCreated = data.filter(
            (va) => va.createdAt && va.createdAt.trim().length > 0
          );
          setVaData(filteredCreated);
        } else if (selectedHeadCell === "Status") {
          const filteredStatus = data.filter((va) => va.status && va.status.trim().length > 0);
          setVaData(filteredStatus);
        } else if (selectedHeadCell === "Notes") {
          const filteredNotes = data.filter((va) => va.notes && va.notes.trim().length > 0);
          setVaData(filteredNotes);
        }
      } else {
        setVaData(data);
      }

      const { data: clientsData } = await axios.get(getAllClientsUrl, {
        headers,
      });
      setClientsData(clientsData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [query, reducerValue, q, selectedHeadCell]);

  const handleSearchChange = async (e) => {
    let { name, value } = e.target;
    setQuery({ ...query, [name]: value });
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setOneVa({ ...oneVa, [name]: value });
  };

  const removeVa = async () => {
    try {
      setLoading(true);
      if (selectedId.length) {
        for (const id of selectedId) {
          await axios.delete(deleteVAUrl(id), {
            headers,
          });

          forceUpdate();
          setOpen2(false);

          for (const client of clientData) {
            const isAssigned = client.assignedVas.some((assignedVas) => assignedVas._id === id);

            if (isAssigned) {
              const index = client.assignedVas.findIndex((va) => va._id === id);
              if (index !== -1) {
                client.assignedVas.splice(index, 1);

                // Update the client's data after removing the object
                const API_URL_UPDATE_CLIENT = `${API_BASE_URL}/api/recruiter/${client._id}`;
                await axios.put(API_URL_UPDATE_CLIENT, client, { headers });

                forceUpdate();
                setOpen2(false);
              }
            }
          }
        }
      }

      for (const id of vaId) {
        const { data } = await axios.delete(deleteVAUrl(id), {
          headers,
        });

        setSelected([]);
        setSelectedId([]);
        setVAId([]);
        forceUpdate();
        setOpen2(false);

        for (const client of clientData) {
          const isAssigned = client.assignedVas.some((assignedVas) => assignedVas._id === id);

          if (isAssigned) {
            const index = client.assignedVas.findIndex((va) => va._id === id);
            if (index !== -1) {
              client.assignedVas.splice(index, 1);

              // Update the client's data after removing the object
              const API_URL_UPDATE_CLIENT = `${API_BASE_URL}/api/recruiter/${client._id}`;
              await axios.put(API_URL_UPDATE_CLIENT, client, { headers });

              setSelected([]);
              setSelectedId([]);
              setVAId([]);
              forceUpdate();
              setOpen2(false);
            }
          }
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleAutocompleteChange1 = (event, value) => {
    runFunc1(value);
  };

  const runFunc1 = (value) => {
    setOneVa((prevClient) => {
      const existingIds = new Set(prevClient.assignedRec.map((item) => item._id));
      const uniqueValues = value.filter((item) => item._id && !existingIds.has(item._id));
      const updatedAssignedRec = uniqueValues.map((item) => ({
        _id: item._id,
        fullname: item.fullname,
        email: item.email,
        phone: item.phone,
        checked: true,
        // Add other relevant properties from the item object
      }));

      const updatedAssignedRecWithUnchecked = prevClient.assignedRec.filter((item) => {
        return !value.some((selected) => selected._id === item._id);
      });

      return {
        ...prevClient,
        assignedRec: [...updatedAssignedRec, ...updatedAssignedRecWithUnchecked],
      };
    });
  };

  const handleAutocompleteChange2 = (event, value) => {
    runFunc2(value);
  };

  const runFunc2 = (value) => {
    setOneVa((prevClient) => ({
      ...prevClient,
      skills: value.map((option) => option),
    }));
  };

  const handleAutocompleteChange3 = (event, value) => {
    runFunc3(value);
  };

  const runFunc3 = (value) => {
    sessionStorage.setItem("stageChange", value);
    setOneVa((prevClient) => ({
      ...prevClient,
      status: value,
    }));
  };

  const handleAutocompleteChange4 = (event, value) => {
    runFunc4(value);
  };
  const runFunc4 = (value) => {
    setOneVa((prevClient) => ({
      ...prevClient,
      languages: value.map((option) => option),
    }));
  };

  const updateVaData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.put(updateVAUrl(vaId), oneVa, { headers });

      const crmVaData = {
        crmId: oneVa.crmId,
        phone: oneVa.phone,
        email: oneVa.email,
      };

      console.log(oneVa);

      if (sessionStorage.getItem("stageChange") === "Approved") {
        await axios.post(
          "https://services.leadconnectorhq.com/hooks/XFGuHSsryGOJsmsmqkbB/webhook-trigger/8d1c294b-4bbf-4580-8743-ffe2a221f675",
          crmVaData
        );
        sessionStorage.removeItem("stageChange");
      } else if (sessionStorage.getItem("stageChange") === "Passed initial screening") {
        await axios.post(
          "https://services.leadconnectorhq.com/hooks/XFGuHSsryGOJsmsmqkbB/webhook-trigger/bfa7b664-0f5c-4163-bd00-43c715d44756",
          crmVaData
        );
        sessionStorage.removeItem("stageChange");
      } else if (sessionStorage.getItem("stageChange") === "Added to candidate poll") {
        await axios.post(
          "https://services.leadconnectorhq.com/hooks/XFGuHSsryGOJsmsmqkbB/webhook-trigger/fb9c8452-1d69-49cf-83b9-4dbabbf0f372",
          crmVaData
        );
        sessionStorage.removeItem("stageChange");
      } else if (sessionStorage.getItem("stageChange") === "Unreachable via Phone") {
        await axios.post(
          "https://services.leadconnectorhq.com/hooks/XFGuHSsryGOJsmsmqkbB/webhook-trigger/I8XJWZ5YjVa91JQ65alr",
          crmVaData
        );
        sessionStorage.removeItem("stageChange");
      } else if (sessionStorage.getItem("stageChange") === "Did not passed initial screening") {
        await axios.post(
          "https://services.leadconnectorhq.com/hooks/XFGuHSsryGOJsmsmqkbB/webhook-trigger/pTmiclX8bh6QhfiSmBEw",
          crmVaData
        );
        sessionStorage.removeItem("stageChange");
      }

      else if (sessionStorage.getItem("stageChange") === "Application Pending") {
        await axios.post(
          "https://services.leadconnectorhq.com/hooks/XFGuHSsryGOJsmsmqkbB/webhook-trigger/mlyo0YZmJN37Jvicqcwi",
          crmVaData
        );
        sessionStorage.removeItem("stageChange");
      }

      else if (sessionStorage.getItem("stageChange") === "Rejected") {
        await axios.post(
          "https://services.leadconnectorhq.com/hooks/XFGuHSsryGOJsmsmqkbB/webhook-trigger/WwrCOOgxAcXHlDajH0TX",
          crmVaData
        );
        sessionStorage.removeItem("stageChange");
      }

      Cookies.set("status", oneVa.status);

      for (const assignedClient of oneVa.assignedRec) {
        const API_URL_CLIENT = `${API_BASE_URL}/api/recruiter/${assignedClient._id}`;

        var foundClient = clientData.find((client) => client._id === assignedClient._id);

        if (foundClient) {
          const isDuplicate = foundClient.assignedVas.some((va) => va._id === oneVa._id);

          const obj = { _id: oneVa._id, fullname: oneVa.fullname };

          if (!isDuplicate && obj._id.length && obj.fullname.length) {
            foundClient.assignedVas.push(obj);
          }
        }

        const { data: updatedClientData } = await axios.put(API_URL_CLIENT, foundClient, {
          headers,
        });
      }

      // Remove the object from assignedVas if the client is not assigned
      for (const client of clientData) {
        const isAssigned = oneVa.assignedRec.some(
          (assignedClient) => assignedClient._id === client._id
        );

        if (!isAssigned) {
          const index = client.assignedVas.findIndex((va) => va._id === oneVa._id);
          if (index !== -1) {
            client.assignedVas.splice(index, 1);

            // Update the client's data after removing the object
            const API_URL_UPDATE_CLIENT = `${API_BASE_URL}/api/recruiter/${client._id}`;
            await axios.put(API_URL_UPDATE_CLIENT, client, { headers });
          }
        }
      }

      setOpen(false);
      setSelected([]);
      setSelectedId([]);
      setVAId([]);
      forceUpdate();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setOpen2(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = vaData.map((n) => n._id);
      const newSelectedId = vaData.map((n) => n._id);
      setSelectedId(newSelectedId);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
    setSelectedId([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickOpen = async (e, id) => {
    e.stopPropagation();

    setVAId(id);

    try {
      const { data } = await axios.get(getVaByIdUrl(id), { headers });
      setOneVa(data);
      setVaLinks({
        "Internet Speed": data.internetSpeed !== "" ? data.internetSpeed : "",
        "Hardware Test": data.hardwareTest !== "" ? data.hardwareTest : "",
        "Profile Image": data.profileImage !== "" ? data.profileImage : "",
        "AI Resume": data.newResumePdf !== "" ? data.newResumePdf : "",
        "Aptitude File": data.aptitudeFile !== "" ? data.aptitudeFile : "",
        "Disc File": data.discFile !== "" ? data.discFile : "",
        "English File": data.englishFile !== "" ? data.englishFile : "",
        "Personal ID": data.personalIdFile !== "" ? data.personalIdFile : "",
        "Government Tax": data.governmentTax !== "" ? data.governmentTax : "",
        "Vsn Waiver": data.vsnWaiver !== "" ? data.vsnWaiver : "",
        "Original Resume": data.coverLetterImage !== "" ? data.coverLetterImage : "",
        "Resume Video": data.videoData !== "" ? data.videoData : "",
      });
      setOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const selectedHeadCellFunc = (value) => {
    setSelectedHeadCell(value);
  };

  const openRemovePopup = () => {
    setOpen2(true);
  };

  return (
    <>
      {loading && <LoadingScreen />}
      <Container flex={1}>
        <Box
          height="auto"
          display="flex"
          flexWrap="wrap"
          marginTop="30px"
          justifyContent="space-between"
          alignContent="center"
        >
          <Typography variant="p" component="p" width="100%">
            Lorem ipsum dolor sit amet
          </Typography>
          <Typography variant="h4" component="h1" width="66%" fontWeight={600}>
            All Va's
          </Typography>
        </Box>

        <Box
          sx={{
            boxShadow: theme.shadows[11],
            border: theme.border,
            width: "100%",
            marginTop: "30px",
            display: "flex",
            flexWrap: "wrap",
            borderRadius: theme.borderRadius,
            padding: "25px",
          }}
        >
          <VasTable
            query={query}
            handleSearchChange={handleSearchChange}
            vaData={vaData}
            selectedHeadCell={selectedHeadCell}
            vaId={vaId}
            selected={selected}
            order={order}
            orderBy={orderBy}
            rowsPerPage={rowsPerPage}
            page={page}
            dense={dense}
            clientData={clientData}
            handleRequestSort={handleRequestSort}
            handleSelectAllClick={handleSelectAllClick}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            handleChangePage={handleChangePage}
            handleClickOpen={handleClickOpen}
            selectedHeadCellFunc={selectedHeadCellFunc}
            openRemovePopup={openRemovePopup}
            handleClick={handleClick}
            setVAId={setVAId}
          />
        </Box>

        <DialogVAComp
          loading={loading}
          openPopup={open}
          closePopup={handleClose}
          oneVa={oneVa}
          handleChange={handleChange}
          clientData={clientData}
          updateVaData={updateVaData}
          skillsArr={skillsArr}
          langsArr={langsArr}
          vaStagesArr={vaStagesArr}
          vaLinks={vaLinks}
          handleFocus={handleFocus}
          handleBlur={handleBlur}
          isFocused={isFocused}
          handleAutocompleteChange1={handleAutocompleteChange1}
          handleAutocompleteChange2={handleAutocompleteChange2}
          handleAutocompleteChange3={handleAutocompleteChange3}
          handleAutocompleteChange4={handleAutocompleteChange4}
        />

        <DialogRemoveVAComp
          openPopup={open2}
          closeVa={handleClose}
          closePopup={handleClose}
          removeVa={removeVa}
          loading={loading}
        />

        <Footer />
      </Container>
    </>
  );
};

export default Vas;
