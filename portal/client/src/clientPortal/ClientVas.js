import React from 'react';
import { Container, Stack, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@emotion/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { getClientByIdUrl } from "../ApiUrls";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import VaComp from "../Components/VaComp";
import { getVaByIdUrl, updateClientUrl } from "../ApiUrls";
import Notification from "../Components/Notification";

const ClientVas = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check for mobile screens

  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isiPad = useMediaQuery(
    "(max-width: 1200px) and (orientation: landscape), (max-height: 1024px) and (orientation: portrait)"
  );

  const token = Cookies.get("token");
  const id = Cookies.get("clientId");

  const [notificationHandle, setNotificationHandle] = useState({});
  const [assignedData, setAssignedData] = useState([]);
  const [assignedVasData, setAssignedVasData] = useState([]);
  const [client, setClientData] = useState({ assignedVas: [] });
  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [selectedVAS, setSelectedVAS] = useState(assignedVasData.length);

  const navigate = useNavigate();

  const headers = {
    Authorization: token,
  };

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const { data } = await axios.get(getClientByIdUrl(id), { headers });

        const assignedVasArr = data.assignedVas.map((data) => data);

        setAssignedData(assignedVasArr);
        setClientData(data);


        const vaPromises = assignedVasArr.map(async (va) => {
          const vaItem = await axios.get(getVaByIdUrl(va._id), { headers });
          return vaItem.data;
        });

        const vasData = await Promise.all(vaPromises);
        setAssignedVasData(vasData);

        setDataFetched(true);
      } catch (error) {
        console.error(error);
      }
    };

    fetchClientData();
  }, []);

  const checkedData = (data, id) => {
    console.log(assignedData);
    console.log(assignedVasData);
    data ? setSelectedVAS(selectedVAS + 1) : setSelectedVAS(selectedVAS - 1);
    console.log(selectedVAS);
    const index = assignedData.findIndex((item) => item._id === id);

    if (index !== -1) {
      const updatedAssignedData = [...assignedData];

      updatedAssignedData[index] = {
        ...updatedAssignedData[index],
        ...(data !== undefined ? { selected: data } : {}),
      };

      setAssignedData(updatedAssignedData);

      setClientData((prevState) => ({
        ...prevState,
        assignedVas: updatedAssignedData,
      }));
    }
  };

  const updateSelectedData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.put(updateClientUrl(client._id), client, {
        headers,
      });
      setLoading(false);
    } catch (err) {
      setNotificationHandle({
        open: true,
        type: "error",
        text: `Something went wrong! ${err}`,
      });
    }
  };

  return (
    <Container
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        rowGap: 3,
      }}
    >
      <Stack
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        p={isTablet || isiPad ? 4 : 2}
        justifyContent="center"
      >
        <Stack display="flex" rowGap={2} flex={1.5}>
          <Typography component="span" variant="span">
            Welcome,
          </Typography>
          <Typography component="h3" variant="h3" fontWeight={600}>
            {client.firstName} {client.lastName}
          </Typography>
          <Typography component="p" variant="p" pr={5}>
            Here, you can browse, choose, and schedule meetings with top-tier VAs. Get to know them
            better by accessing their comprehensive resumes and personal profiles, and even watch
            their introductory videos for a glimpse into their professional demeanor.
          </Typography>
        </Stack>
      </Stack>

      <Stack
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        justifyContent="flex-start"
        alignItems={isMobile ? "stretch" : "flex-start"}
        flexWrap="wrap"
        gap={2}
        p={isTablet || isiPad ? 4 : 0}
      >
        {dataFetched ? (
          assignedData.map((item, index) => {
            const matchingItem = assignedVasData.find((obj) => obj._id === item._id);

            return (
              <VaComp
                data={matchingItem}
                assignedVasData={client.assignedVas}
                key={index}
                order={index}
                assigned={item.selected}
                callback={checkedData}
              />
            );
          })
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Stack>

      {notificationHandle.open && (
        <Notification notification={notificationHandle} onClose={() => setNotificationHandle({})} />
      )}
    </Container>
  );
};

export default ClientVas