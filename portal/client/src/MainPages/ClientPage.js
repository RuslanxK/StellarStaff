import { Container, Stack, Typography, useMediaQuery, Box } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import StyledButton from "./StyledButton";
import { useTheme } from "@emotion/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { getClientByIdUrl } from "../ApiUrls";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import VaComp from "../Components/VaComp";
import { getVaByIdUrl, updateClientUrl } from "../ApiUrls";
import StyledLoadButton from "../MainPages/StyledLoadButton";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import Notification from "../Components/Notification";

const ClientPage = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check for mobile screens

  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isiPad = useMediaQuery(
    "(max-width: 1200px) and (orientation: landscape), (max-height: 1024px) and (orientation: portrait)"
  );

  const { id } = useParams();

  const token = Cookies.get("token");

  const [notificationHandle, setNotificationHandle] = useState({});
  const [assignedData, setAssignedData] = useState([]);
  const [assignedVasData, setAssignedVasData] = useState([]);
  const [client, setClientData] = useState({ assignedVas: [] });
  const [hasMeetings, setHasMeetings] = useState(false);
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

        if (data && data.appointments && data.appointments.length > 0) {
          setHasMeetings(true);
        }

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

  const updateSelectedData = async (meetingsStatus) => {
    try {
      setLoading(true);
      const { data } = await axios.put(updateClientUrl(client._id), client, {
        headers,
      });
      setLoading(false);
      if (meetingsStatus === "no-meetings") {
        window.open(
          `https://link.vasupportnow.com/widget/bookings/portal-testing-cal/?first_name=${client.firstName}&last_name=${client.lastName}&phone=${client.phone}&email=${client.email}`,
          "_blank"
        );
      }
    } catch (err) {
      setNotificationHandle({
        open: true,
        type: "error",
        text: `Something went wrong! ${err}`,
      });
    }
  };

  const handleCancel = (id) => {
    window.open(`https://link.alwaysconvert.com/widget/cancel-booking?event_id=${id}`, "_blank");
  };

  const contact = (value) => {
    value === "call" ? window.open("tel:900300400") : window.open("sms:900300400");
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
          <Typography component="h4" variant="h4" fontWeight={600}>
          Greetings, {client.firstName} {client.lastName}!
          </Typography>
          <Typography component="p" variant="p" pr={5}>
          Browse, pick, and schedule meetings with our top candidates. Get to know them better through their detailed profiles and resumes. Check out their intro videos to get a sense of their personality and professionalism.
          </Typography>
        </Stack>
        {isMobile ? null : (
          <Stack
            display="flex"
            flex={1}
            rowGap={2}
            border={theme.border}
            borderRadius={theme.borderRadius}
            p={isTablet || isiPad ? 4 : 4}
            alignSelf="flex-start"
          >
            <Stack display="flex" flexDirection="row" columnGap={1}>
              <HelpOutlineIcon />
              <Typography component="span" variant="span" fontWeight={600}>
                Do you have any questions?
              </Typography>
            </Stack>
            <Stack flexDirection="row" gap={2}>
              <StyledButton variant="secondary" onClick={() => contact("call")}>
                Call us
              </StyledButton>
              <StyledButton variant="secondary" onClick={() => contact("sms")}>
                Send us a message
              </StyledButton>
            </Stack>
          </Stack>
        )}
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
      {client && client.appointments && client.appointments.length > 0 && (
        <Box>
          <Typography
            component="h3"
            variant="h6"
            fontWeight={600}
            mb={2}
            p={2}
            textAlign={isMobile ? "center" : null}
          >
            Your upcoming meetings
          </Typography>
          {client.appointments.map((item, index) => (
            <Stack
              alignItems="center"
              justifyContent="space-between"
              flexDirection={isMobile ? "column" : "row"}
              border={theme.border}
              mb={2}
              p="20px"
              key={index}
              gap={isMobile ? 2 : 0}
            >
              <Stack flexDirection="row" gap={2} alignItems="center" justifyContent="center">
                <Stack
                  justifyContent="center"
                  alignItems="center"
                  width="40px"
                  height="40px"
                  borderRadius={40}
                  sx={{ backgroundColor: "#e9fafc" }}
                >
                  <BookmarkAddedIcon sx={{ color: "#6f9ef6" }} />
                </Stack>
                <Stack flexDirection="column">
                  <Typography variant="span" component="span" fontWeight={600}>
                    {item.title}
                  </Typography>
                  <Typography variant="span" component="span" fontSize={14}>
                    {item.startTime} - {item.endTime}
                  </Typography>
                </Stack>
              </Stack>
              <Stack flexDirection="row" gap={2}>
                <StyledButton variant="outlined" onClick={() => handleCancel(item.id)}>
                  Cancel
                </StyledButton>
              </Stack>
            </Stack>
          ))}
        </Box>
      )}
      <Stack
        alignContent="center"
        alignItems="center"
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "center",
        }}
        pb={isMobile ? 2 : 4}
        ml={isMobile ? 4 : 0}
        mr={isMobile ? 4 : 0}
        m={isTablet || isiPad ? 3 : 0}
        mt='40px'
      >
        {!hasMeetings ? (
          <StyledLoadButton
            loading={loading}
            variant="main"
            loadingPosition="start"
            onClick={() => updateSelectedData("no-meetings")}
          >
            Book interviews with chosen candidates
          </StyledLoadButton>
        ) : (
          <StyledLoadButton
            variant="main"
            loadingPosition="start"
            onClick={() => updateSelectedData("has-meetings")}
          >
            Confirm selected Va's for your upcoming meetings
          </StyledLoadButton>
        )}
      </Stack>

      {isMobile ? (
        <Stack
          display="flex"
          flex={1}
          rowGap={2}
          border={theme.border}
          borderRadius={theme.borderRadius}
          p={4}
          m={isMobile ? 3 : 0}
        >
          <Stack display="flex" flexDirection="row" columnGap={1}>
            <HelpOutlineIcon />
            <Typography component="span" variant="span" fontWeight={600}>
              Do you have any questions?
            </Typography>
          </Stack>
          <Stack flexDirection="row" gap={2}>
            <StyledButton variant="secondary" onClick={() => contact("call")}>
              Call us
            </StyledButton>
            <StyledButton variant="secondary" onClick={() => contact("sms")}>
              Send us a message
            </StyledButton>
          </Stack>
        </Stack>
      ) : null}

      {notificationHandle.open && (
        <Notification notification={notificationHandle} onClose={() => setNotificationHandle({})} />
      )}
    </Container>
  );
};

export default ClientPage;
