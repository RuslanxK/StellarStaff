import React, { useState, useEffect, useReducer } from "react";
import { Box, Container, Typography } from "@mui/material";

import StyledButton from "../MainPages/StyledButton";
import Footer from "./Footer";
import axios from "axios";
import Cookies from "js-cookie";
import { useTheme } from "@emotion/react";
import { useLocation } from "react-router-dom";
import {
  getAllVAsUrl,
  getAllRecruitersUrl,
  updateClientUrl,
  createNewClientUrl,
  deleteClientUrl,
  API_BASE_URL,
  getAllClientStages,
  getAllSkills,
  getClientByIdUrl,
} from "../ApiUrls";

import ClientTable from "./ClientTable";
import DialogClientComp from "./DialogClientComp";
import AddClientDialog from "./AddClientDialog";
import DialogRemoveClient from "./DialogRemoveClient";
import LoadingScreen from "../Components/LoadingScreen";

const Clients = () => {
  const theme = useTheme();
  const token = Cookies.get("token");
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const q = queryParams.get("q");

  const headers = {
    Authorization: token,
  };

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [client, setClient] = useState({
    fullname: "",
    firstName: "",
    lastName: "",
    lookingFor: "",
    currentStage: "",
    requiredSkills: [],
    startDate: "",
    jobType: "",
    notes: "",
  });
  const [vaData, setVaData] = useState([]);
  const [oneClientData, setOneClientData] = useState({
    requiredSkills: [],
    assignedVas: [],
  });
  const [query, setQuery] = useState({ search: "" });
  const [clientId, setClientId] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const [copiedClip, setCopiedClip] = useState(false);
  const [selectedHeadCell, setSelectedHeadCell] = useState("");
  const [clientStagesArr, setClientStages] = useState({ currentStages: [] });
  const [skillsArr, setSkills] = useState({ skills: [] });

  const jobTypeArr = ["Full-time Virtual Assistant", "Part-time Virtual Assistant"];

  const appURL = process.env.REACT_APP_URL;

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const { data: clientStages } = await axios.get(getAllClientStages);
        const clientStageArr = clientStages[0];

        console.log(clientStageArr);
        setClientStages(clientStageArr);

        const { data: skillsData } = await axios.get(getAllSkills);

        const skillsArr = skillsData[0];
        setSkills(skillsArr);

        const { data } = await axios.get(getAllRecruitersUrl(q), { headers });

        let filteredData = data;

        if (query.search) {
          const regex = new RegExp(`^${query.search}`, "i");
          filteredData = data.filter((recruiter) => {
            return (
              regex.test(recruiter.fullname) ||
              regex.test(recruiter.firstName) ||
              regex.test(recruiter.lastName) ||
              regex.test(recruiter.lookingFor) ||
              regex.test(recruiter.jobType) ||
              regex.test(recruiter.currentStage) ||
              regex.test(recruiter.notes) ||
              recruiter.assignedVas.some((vas) => regex.test(vas.fullname)) ||
              recruiter.requiredSkills.some((skill) => regex.test(skill))
            );
          });

          setClientData(filteredData);
        } else if (selectedHeadCell) {
          /*
          if (selectedHeadCell === "Full name") {
            const filteredNames = data.filter(
              (client) => client.fullname && client.fullname.trim().length > 0
            );
            setClientData(filteredNames);
          } else
          */
          if (selectedHeadCell === "Looking for") {
            const filteredLookingFor = data.filter(
              (client) => client.lookingFor && client.lookingFor.length > 0
            );
            setClientData(filteredLookingFor);
          } else if (selectedHeadCell === "Job type") {
            const filteredJobType = data.filter(
              (client) => client.jobType && client.jobType.length > 0
            );
            setClientData(filteredJobType);
          } else if (selectedHeadCell === "Required skills") {
            const filteredSkills = data.filter(
              (client) => client.requiredSkills && client.requiredSkills.length > 0
            );
            setClientData(filteredSkills);
          } else if (selectedHeadCell === "Start date") {
            const filteredStartDate = data.filter(
              (client) => client.startDate && client.startDate.trim().length > 0
            );
            setClientData(filteredStartDate);
          } else if (selectedHeadCell === "Current stage") {
            const filteredStatus = data.filter(
              (client) => client.currentStage && client.currentStage.trim().length > 0
            );
            setClientData(filteredStatus);
          } else if (selectedHeadCell === "Notes") {
            const filteredNotes = data.filter(
              (client) => client.notes && client.notes.trim().length > 0
            );
            setClientData(filteredNotes);
          }
        } else {
          setClientData(data);
        }

        const { data: vaData } = await axios.get(getAllVAsUrl, { headers });
        setVaData(vaData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchClientData();
  }, [q, reducerValue, query, selectedHeadCell]);

  const copyText = (id) => {
    setCopiedClip(true);
    navigator.clipboard.writeText(`${appURL}/va-selection/` + id);
    setTimeout(() => {
      setCopiedClip(false);
    }, 1500);
  };

  const handleSearchChange = (e) => {
    let { name, value } = e.target;
    setQuery({ ...query, [name]: value });
  };

  const handleNewClientChange = (e) => {
    let { name, value } = e.target;
    setClient({ ...client, [name]: value });
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setOneClientData({ ...oneClientData, [name]: value });
  };

  const updateClientData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.put(updateClientUrl(clientId), oneClientData, { headers });

      var foundVa;

      for (const assignedVa of oneClientData.assignedVas) {
        const API_URL_VA = `${API_BASE_URL}/api/vas/${assignedVa._id}`;

        foundVa = vaData.find((va) => va._id === assignedVa._id);

        if (foundVa) {
          const isDuplicate = foundVa.assignedRec.some((va) => va._id === oneClientData._id);

          const obj = {
            _id: oneClientData._id,
            fullname: oneClientData.firstName + " " + oneClientData.lastName,
          };

          if (!isDuplicate && obj._id.length && obj.fullname.length) {
            foundVa.assignedRec.push(obj);
          }
        }

        const { data: updatedVaData } = await axios.put(API_URL_VA, foundVa, {
          headers,
        });
      }

      // Remove the object from assignedRec if the VA is not assigned
      for (const va of vaData) {
        const isAssigned = oneClientData.assignedVas.some(
          (assignedVa) => assignedVa._id === va._id
        );

        if (!isAssigned) {
          const index = va.assignedRec.findIndex(
            (recruiter) => recruiter._id === oneClientData._id
          );
          if (index !== -1) {
            va.assignedRec.splice(index, 1);

            // Update the VA's data after removing the object
            const API_URL_UPDATE_VA = `${API_BASE_URL}/api/vas/${va._id}`;
            await axios.put(API_URL_UPDATE_VA, va, { headers });
          }
        }
      }

      setOpen(false);

      setSelected([]);
      setSelectedId([]);
      setClientId([]);
      forceUpdate();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const removeClient = async () => {
    try {
      setLoading(true);

      if (selectedId.length) {
        for (const id of selectedId) {
          await axios.delete(deleteClientUrl(id), {
            headers,
          });

          forceUpdate();
          setOpen3(false);

          for (const va of vaData) {
            const isAssigned = va.assignedRec.some((assignedRec) => assignedRec._id === id);

            if (isAssigned) {
              const index = va.assignedRec.findIndex((client) => client._id === id);
              if (index !== -1) {
                va.assignedRec.splice(index, 1);

                // Update the client's data after removing the object
                const API_URL_UPDATE_VA = `${API_BASE_URL}/api/vas/${va._id}`;
                await axios.put(API_URL_UPDATE_VA, va, { headers });
                forceUpdate();
                setOpen3(false);
              }
            }
          }
        }
      }

      for (const id of clientId) {
        const { data } = await axios.delete(deleteClientUrl(id), {
          headers,
        });

        setSelected([]);
        setSelectedId([]);
        setClientId([]);
        forceUpdate();
        setOpen3(false);

        for (const va of vaData) {
          const isAssigned = va.assignedRec.some((assignedRec) => assignedRec._id === id);

          if (isAssigned) {
            const index = va.assignedRec.findIndex((client) => client._id === id);
            if (index !== -1) {
              va.assignedRec.splice(index, 1);

              // Update the client's data after removing the object
              const API_URL_UPDATE_VA = `${API_BASE_URL}/api/vas/${va._id}`;
              await axios.put(API_URL_UPDATE_VA, va, { headers });

              setSelected([]);
              setSelectedId([]);
              setClientId([]);
              forceUpdate();
              setOpen3(false);
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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = clientData.map((n) => n._id);
      const newSelectedId = clientData.map((n) => n._id);
      setSelectedId(newSelectedId);
      setSelected(newSelected);

      return;
    }
    setSelected([]);
    setSelectedId([]);
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

  const handleClickOpen = async (e, id) => {
    e.stopPropagation();

    setClientId(id);

    try {
      const { data } = await axios.get(getClientByIdUrl(id), { headers });
      setOneClientData(data);
      setOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const selectedHeadCellFunc = (value) => {
    setSelectedHeadCell(value);
  };

  const openRemovePopup = () => {
    setOpen3(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleClose3 = () => {
    setOpen2(false);
  };

  const openNewClientPopup = () => {
    setOpen2(true);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const addNewClient = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(createNewClientUrl, client, {
        headers,
      });
      setOpen2(false);
      setLoading(false);
      forceUpdate();
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleAutocompleteChange1 = (event, value) => {
    runFunc1(value);
  };

  const handleAutocompleteChange2 = (event, value) => {
    runFunc2(value);
  };

  const handleAutocompleteChange3 = (event, value) => {
    runFunc3(value);
  };

  const handleAutocompleteChange4 = (event, value) => {
    runFunc4(value);
  };

  const handleAutocompleteStages = (event, value) => {
    runFunc5(value);
  };

  const handleAutocompleteSkills = (event, value) => {
    runFunc6(value);
  };

  const handleAutocompleteJobType = (event, value) => {
    runFunc7(value);
  };

  const runFunc1 = (value) => {
    setOneClientData((prevClient) => {
      const existingIds = new Set(prevClient.assignedVas.map((item) => item._id));
      const uniqueValues = value.filter((item) => item._id && !existingIds.has(item._id));
      const updatedAssignedVas = uniqueValues.map((item) => ({
        _id: item._id,
        fullname: item.fullname,
        email: item.email,
        phone: item.phone,
        checked: true, // Set checked to true for newly added items
        // Add other relevant properties from the item object
      }));

      const updatedAssignedVasWithUnchecked = prevClient.assignedVas.filter((item) => {
        return !value.some((selected) => selected._id === item._id);
      });

      return {
        ...prevClient,
        assignedVas: [...updatedAssignedVas, ...updatedAssignedVasWithUnchecked],
      };
    });
  };

  const runFunc2 = (value) => {
    setOneClientData((prevClient) => ({
      ...prevClient,
      currentStage: value,
    }));
  };

  const runFunc3 = (value) => {
    setOneClientData((prevClient) => ({
      ...prevClient,
      requiredSkills: value.map((option) => option),
    }));
  };

  const runFunc4 = (value) => {
    setOneClientData((prevClient) => ({
      ...prevClient,
      jobType: value,
    }));
  };

  const runFunc5 = (value) => {
    setClient({ ...client, currentStage: value });
  };

  const runFunc6 = (value) => {
    setClient((prevClient) => ({
      ...prevClient,
      requiredSkills: value.map((option) => option),
    }));
  };

  const runFunc7 = (value) => {
    setClient({ ...client, jobType: value });
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
            All Clients
          </Typography>

          <StyledButton variant="main" onClick={openNewClientPopup}>
            Add New Client
          </StyledButton>
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
          <ClientTable
            query={query}
            handleSearchChange={handleSearchChange}
            clientData={clientData}
            selectedHeadCell={selectedHeadCell}
            clientId={clientId}
            selected={selected}
            order={order}
            orderBy={orderBy}
            rowsPerPage={rowsPerPage}
            page={page}
            dense={dense}
            vaData={vaData}
            handleRequestSort={handleRequestSort}
            handleSelectAllClick={handleSelectAllClick}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            handleChangePage={handleChangePage}
            handleClickOpen={handleClickOpen}
            selectedHeadCellFunc={selectedHeadCellFunc}
            openRemovePopup={openRemovePopup}
            handleClick={handleClick}
            setClientId={setClientId}
          />
        </Box>

        <DialogClientComp
          loading={loading}
          openPopup={open}
          closePopup={handleClose}
          oneClientData={oneClientData}
          vaData={vaData}
          handleChange={handleChange}
          clientData={clientData}
          updateClientData={updateClientData}
          skillsArr={skillsArr}
          clientStagesArr={clientStagesArr}
          jobType={jobTypeArr}
          copiedTxt={copyText}
          copiedClip={copiedClip}
          handleFocus={handleFocus}
          handleBlur={handleBlur}
          isFocused={isFocused}
          handleAutocompleteChange1={handleAutocompleteChange1}
          handleAutocompleteChange2={handleAutocompleteChange2}
          handleAutocompleteChange3={handleAutocompleteChange3}
          handleAutocompleteChange4={handleAutocompleteChange4}
        />

        <AddClientDialog
          closePopup={handleClose2}
          openPopup={open2}
          handleNewClientChange={handleNewClientChange}
          skillsArr={skillsArr}
          jobTypeArr={jobTypeArr}
          clientStagesArr={clientStagesArr}
          addClientFnc={addNewClient}
          autoCompleteStages={handleAutocompleteStages}
          autoCompleteSkills={handleAutocompleteSkills}
          autoCompleteJobType={handleAutocompleteJobType}
        />

        <DialogRemoveClient
          openPopup={open3}
          closePopup={handleClose3}
          loading={loading}
          removeClient={removeClient}
        />

        <Footer />
      </Container>
    </>
  );
};

export default Clients;
