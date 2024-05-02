import { useState, useEffect, useReducer } from "react";
import "./style.css";
import {
  Box,
  Container,
  Typography,
  Stack,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  TextField,
  Tooltip,
  Skeleton,
} from "@mui/material";
import {
  Moving,
  PersonOutlineOutlined,
  AttachMoney,
  ToggleOnOutlined,
  DonutLarge,
  WorkOutlineOutlined,
  NotificationsActiveOutlined,
} from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import StyledButton from "../MainPages/StyledButton";
import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import { PieChart, Pie, Cell } from "recharts";
import Cookies from "js-cookie";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";

import { getAllClientsUrl, getAllVAsUrl, getAllAdminsUrl, getAdminUrl } from "../ApiUrls";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import noteAudio from "../Resources/note.wav";
import deleteNote from "../Resources/delete.wav";
import { Link, useNavigate } from "react-router-dom";

const Panel = () => {
  const username = Cookies.get("username");
  const adminId = Cookies.get("_id");

  const token = Cookies.get("token");

  const navigate = useNavigate();

  const headers = {
    Authorization: token,
  };

  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [vaData, setVaData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [adminsData, setAdminsData] = useState([]);
  const [admin, setAdmin] = useState({ notes: [] });
  const [note, setNote] = useState({
    username: username,
    title: "",
    description: "",
  });
  const [features, setFeatures] = useState([]);
  const [activeVa, setActiveVas] = useState([]);
  const [rejectedVas, setRejectedVas] = useState([]);
  const [pendingVas, setInterviewingVas] = useState([]);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const [loading, setLoading] = useState(false);

  Chart.register(...registerables);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const previousMonths = Array.from({ length: currentMonth }, (_, index) => {
    const month = currentMonth - index;
    return new Date(currentDate.getFullYear(), month - 1, 1).toLocaleString("default", {
      month: "long",
    });
  }).reverse();

  const [data, setData] = useState({
    labels: previousMonths,
    datasets: [
      {
        label: "Total VA’s grow",
        data: [],
        fill: true,
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointRadius: 4,
        pointHoverBorderColor: "#fff",
        pointHoverRadius: 6,
        lineTension: 0.2,
      },
    ],
  });

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const { data: vaData } = await axios.get(getAllVAsUrl, { headers });
      setVaData(vaData);

      const activeVas = vaData.filter((activeVa) => activeVa.status === "Added to candidate poll");
      const rejectedVas = vaData.filter((activeVa) => activeVa.status === "Rejected");
      const pendingVas = vaData.filter((activeVa) => activeVa.status === "New Applicant");

      setActiveVas(activeVas);
      setRejectedVas(rejectedVas);
      setInterviewingVas(pendingVas);

      const vaCountByMonth = countVAsByCurrentMonth(vaData);

      setData((prevData) => ({
        ...prevData,
        datasets: [
          {
            ...prevData.datasets[0],
            data: vaCountByMonth,
          },
        ],
      }));

      const { data: clientData } = await axios.get(getAllClientsUrl, {
        headers,
      });
      setClientData(clientData);

      const payingClients = clientData.filter(
        (payingClient) => payingClient.currentStage === "Paying Client"
      );

      const { data: adminsData } = await axios.get(getAllAdminsUrl, {
        headers,
      });

      setAdminsData(adminsData);

      const { data: admin } = await axios.get(getAdminUrl(adminId), {
        headers,
      });

      setAdmin(admin);

      const updatedFeatures = [
        {
          icon: (
            <PersonOutlineOutlined style={{ fontSize: "32px", color: theme.palette.text.icons }} />
          ),
          title: vaData.length,
          paragraph: "Total va's registered",
        },
        {
          icon: (
            <WorkOutlineOutlined style={{ fontSize: "32px", color: theme.palette.text.icons }} />
          ),
          title: clientData.length,
          paragraph: "Total clients added",
        },
        {
          icon: <ToggleOnOutlined style={{ fontSize: "32px", color: theme.palette.text.icons }} />,
          title: activeVas.length,
          paragraph: "Total active va's",
        },
        {
          icon: <AttachMoney style={{ fontSize: "32px", color: theme.palette.text.icons }} />,
          title: payingClients.length,
          paragraph: "Total paying clients",
        },
      ];

      setFeatures(updatedFeatures);
      setLoading(false);
    };

    getData();
  }, [reducerValue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote({ ...note, [name]: value });
  };

  const addNote = async () => {
    const adminObj = admin;

    const adminNotesArr = adminObj.notes;

    if (note.title !== "" && note.description !== "") {
      adminNotesArr.push(note);
    }

    const { data } = await axios.put(getAdminUrl(adminId), adminObj, {
      headers,
    });

    new Audio(noteAudio).play();

    setOpen(false);
    setNote({
      username: username,
      title: "",
      description: "",
    });

    forceUpdate();
  };

  const editNote = (id) => {
    const foundNote = admin.notes.find((note) => note._id === id);

    if (foundNote) {
      setNote(foundNote);
      setOpen3(true);
    }
  };

  const updateNote = async () => {
    const updatedNotes = admin.notes.map((n) => {
      if (n._id === note._id) {
        return { ...note };
      }
      return n;
    });

    const updatedAdmin = { ...admin, notes: updatedNotes };

    try {
      const { data } = await axios.put(getAdminUrl(adminId), updatedAdmin, {
        headers,
      });
      new Audio(noteAudio).play();
      setOpen3(false);
      forceUpdate();
    } catch (error) {
      console.log(error);
    }
  };

  const removeNote = (id, index) => {
    const adminObj = admin;
    const notesArr = adminObj.notes;

    const foundNote = notesArr.find((note) => note._id === id);

    if (foundNote) {
      const index = notesArr.indexOf(foundNote);

      notesArr.splice(index, 1);

      axios
        .put(getAdminUrl(adminId), adminObj, { headers })
        .then((response) => {
          new Audio(deleteNote).play();
          forceUpdate();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const countVAsByCurrentMonth = (vaData) => {
    const currentMonth = new Date().getMonth() + 1;
    const vaCountByMonth = Array.from({ length: currentMonth }, (_, index) => {
      const targetDate = new Date(new Date().getFullYear(), currentMonth - 1 - index, 1);
      return vaData.reduce((count, va) => {
        const vaDate = new Date(va.createdAt);
        if (
          vaDate.getMonth() === targetDate.getMonth() &&
          vaDate.getFullYear() === targetDate.getFullYear()
        ) {
          return count + 1;
        }
        return count;
      }, 0);
    }).reverse();

    return vaCountByMonth;
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    title: {
      display: true,
    },
    legend: {
      display: true,
    },
    tooltips: {
      enabled: true,
      mode: "nearest",
    },
    responsive: true,
    elements: {
      point: {
        borderWidth: 0,
      },
      line: {
        borderWidth: 0,
      },
      arc: {
        borderWidth: 0,
      },
    },
    layout: {
      padding: 0,
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  const pieData = [
    { title: "Added to candidate poll", value: activeVa.length, color: "#00C853" },
    { title: "Rejected", value: rejectedVas.length, color: "#BDBDBD" },
    { title: "New Applicant", value: pendingVas.length, color: "#FFD600" },
  ];

  const Label = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        fontSize="22px"
        fontWeight="600"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const addNewNote = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const capitalizeFirstLetterOfWords = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const capitalizedUsername = capitalizeFirstLetterOfWords(username);

  const filteredPieData = pieData.filter((dataPoint) => dataPoint.value !== 0);

  const changeLogNav = () => {
    navigate("changelog");
  };

  return (
    <Container
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        rowGap: 5,
        marginBottom: "30px",
      }}
    >
      <Box sx={{ position: "fixed", right: 20, bottom: 20 }}>
        <Link
          to={"/changelog"}
          style={{
            textDecoration: "none",
            backgroundColor: "#E8E9EB",
            padding: "5px 20px",
            borderRadius: theme.borderRadius,
            color: "black",
          }}
        >
          Change log
        </Link>
      </Box>

      <Box
        height="auto"
        display="flex"
        flexWrap="wrap"
        marginTop="30px"
        justifyContent="space-between"
      >
        <Typography variant="p" component="p" width="100%">
          Admin dashboard
        </Typography>
        <Typography variant="h4" component="h1" width="100%" fontWeight={600}>
          Welcome, {capitalizedUsername}
        </Typography>

        {!loading ? (
          features.map((item) => (
            <Stack
              key={item.index}
              display="flex"
              flexDirection="row"
              justifyContent="flex-start"
              alignItems="center"
              p="25px"
              width="22%"
              height="135px"
              flexWrap="wrap"
              borderRadius={theme.borderRadius}
              boxShadow={{ boxShadow: theme.shadows[11] }}
              marginTop="30px"
            >
              <Stack>{item.icon}</Stack>

              <Typography fontWeight={500} fontSize="25px" marginLeft="10px" width="50%">
                {item.title}
              </Typography>
              <Box flexWrap="wrap">
                <Typography component="p" style={{ width: "100%" }}>
                  {item.paragraph}
                </Typography>
              </Box>
            </Stack>
          ))
        ) : (
          <Stack flexDirection="row" justifyContent="space-between" width="100%" mt={4}>
            <Skeleton variant="rounded" width="22%" height="135px" />
            <Skeleton variant="rounded" width="22%" height="135px" />
            <Skeleton variant="rounded" width="22%" height="135px" />
            <Skeleton variant="rounded" width="22%" height="135px" />
          </Stack>
        )}
      </Box>
      {!loading ? (
        <Box
          sx={{
            width: "100%",
            height: "300px",
            boxShadow: theme.shadows[11],
            padding: "0px",
            borderRadius: "10px",
            paddingRight: "20px",
            paddingTop: "20px",
            paddingLeft: "20px",
            paddingBottom: "70px",
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            fontWeight={600}
            display="flex"
            alignItems="center"
            marginBottom="15px"
          >
            <Moving
              style={{
                fontSize: "32px",
                color: theme.palette.text.icons,
                marginRight: "10px",
              }}
            />{" "}
            Total VA’s grow
          </Typography>
          <Line data={data} options={options} />
        </Box>
      ) : (
        <Skeleton variant="rounded" width="100%" height="300px" />
      )}
      <Box width="100%" display="flex" justifyContent="space-between" gap={5}>
        {!loading ? (
          <Card
            sx={{
              boxShadow: theme.shadows[11],
              borderRadius: theme.borderRadius,
              width: "35%",
            }}
          >
            <CardContent sx={{ padding: "20px 40px" }}>
              <Typography
                variant="h5"
                component="h2"
                fontWeight={600}
                display="flex"
                alignItems="center"
                marginBottom="15px"
              >
                <DonutLarge
                  style={{
                    fontSize: "32px",
                    color: theme.palette.text.icons,
                    marginRight: "10px",
                  }}
                />{" "}
                VA’s Status
              </Typography>

              <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                <Table sx={{ padding: 0 }}>
                  <TableBody>
                    {pieData.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ padding: "7px" }}>{data.title}</TableCell>
                        <TableCell sx={{ padding: "7px" }}>{data.value} va's</TableCell>
                        <TableCell sx={{ padding: 0 }}>
                          <div
                            style={{
                              width: "15px",
                              height: "15px",
                              backgroundColor: data.color,
                            }}
                          ></div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <PieChart width={300} height={250}>
                <Pie
                  data={filteredPieData}
                  dataKey="value"
                  label={Label}
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {filteredPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </CardContent>
          </Card>
        ) : (
          <Skeleton variant="rounded" width="30%" height="450px" />
        )}
        {!loading ? (
          <Card
            sx={{
              boxShadow: theme.shadows[11],
              borderRadius: theme.borderRadius,
              width: "60%",
            }}
          >
            <CardContent
              sx={{
                padding: "20px 40px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h5"
                component="h2"
                fontWeight={600}
                display="flex"
                alignItems="center"
                width="50%"
              >
                <NotificationsActiveOutlined
                  style={{
                    fontSize: "32px",
                    color: theme.palette.text.icons,
                    marginRight: "10px",
                  }}
                />{" "}
                Admin Updates
              </Typography>
              <StyledButton variant="main" onClick={addNewNote}>
                Add New Note
              </StyledButton>
            </CardContent>

            <CardContent sx={{ padding: "20px 50px", overflowY: "scroll", height: "330px" }}>
              <TableContainer component={Paper} sx={{ boxShadow: "none", padding: 0 }}>
                <Table>
                  <TableBody>
                    {adminsData
                      .flatMap((data) => data.notes)
                      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                      .map((note, index) => (
                        <TableRow key={index}>
                          <TableCell
                            sx={{
                              border: "none",
                              paddingLeft: 0,
                              paddingRight: 0,
                            }}
                          >
                            <Table>
                              <TableBody
                                sx={{
                                  borderRadius: theme.borderRadius,
                                }}
                              >
                                <TableRow>
                                  <TableCell sx={{ width: "15px" }}>Title:</TableCell>
                                  <TableCell
                                    sx={{
                                      fontWeight: "bold",
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    {note.title.length > 35 ? (
                                      <Tooltip title={note.title} placement="top">
                                        <Typography
                                          sx={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            maxWidth: "270px",
                                            fontSize: "15px",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          {note.title}
                                        </Typography>
                                      </Tooltip>
                                    ) : (
                                      <Typography
                                        sx={{
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                          maxWidth: "270px",
                                          fontSize: "15px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {note.title}
                                      </Typography>
                                    )}
                                    <Typography
                                      component="span"
                                      color="white"
                                      fontSize="11px"
                                      fontWeight="500"
                                      borderRadius="25px"
                                      paddingLeft="8px"
                                      paddingRight="8px"
                                      paddingTop="4px"
                                      backgroundColor="#a7a4eb"
                                      variant="span"
                                    >
                                      {note.username
                                        .split(" ")
                                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join(" ")}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Description:</TableCell>
                                  <TableCell>
                                    {" "}
                                    <Typography
                                      sx={{
                                        whiteSpace: "pre-wrap",
                                        overflowWrap: "break-word",
                                        wordWrap: "break-word",
                                        wordBreak: "break-word",
                                      }}
                                    >
                                      {note.description}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>

                            <Stack
                              sx={{
                                fontSize: "11px",
                                display: "flex",
                                marginTop: "6px",
                                width: "100%",
                              }}
                            >
                              <span>
                                <b>Added at: </b>
                                {new Date(note.timestamp).toLocaleString()}
                              </span>
                            </Stack>
                          </TableCell>
                          <TableCell
                            sx={{
                              padding: 0,
                              border: "none",
                              paddingLeft: "10px",
                            }}
                          >
                            {note.username === username ? (
                              <Stack>
                                <IconButton
                                  color="error"
                                  sx={{
                                    border: theme.border,
                                    marginBottom: "7px",
                                    width: "30px",
                                    height: "30px",
                                  }}
                                >
                                  <DeleteIcon
                                    onClick={() => removeNote(note._id, index)}
                                    sx={{ fontSize: "15px" }}
                                  />
                                </IconButton>
                                <IconButton
                                  color="primary"
                                  sx={{
                                    border: theme.border,
                                    width: "30px",
                                    height: "30px",
                                  }}
                                >
                                  <EditIcon
                                    onClick={() => editNote(note._id)}
                                    sx={{ fontSize: "15px" }}
                                  />
                                </IconButton>
                              </Stack>
                            ) : null}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        ) : (
          <Skeleton variant="rounded" width="70%" height="450px" />
        )}
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            width: "550px",
            maxWidth: "100%",
            height: "475px",
            padding: "35px",
            borderRadius: theme.borderRadius,
            border: theme.border,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <DialogTitle sx={{ padding: "0px", fontSize: "25px", marginBottom: "20px" }}>
          Add Note
        </DialogTitle>

        <TextField
          type="text"
          variant="outlined"
          label="Title"
          name="title"
          onChange={handleChange}
          sx={{ marginBottom: "20px", width: "100%" }}
        />

        <TextField
          multiline
          rows={7}
          cols={5}
          label="Note"
          name="description"
          variant="outlined"
          onChange={handleChange}
          sx={{ marginBottom: "20px", width: "100%" }}
        />

        <Box sx={{ display: "flex", width: "100%", justifyContent: "flex-start" }}>
          <StyledButton onClick={handleClose} sx={{ marginRight: "10px" }} variant="secondary">
            Close
          </StyledButton>
          <StyledButton onClick={addNote} variant="main">
            Add Note
          </StyledButton>
        </Box>
      </Dialog>

      <Dialog
        open={open3}
        sx={{
          "& .MuiDialog-paper": {
            width: "550px",
            maxWidth: "100%",
            height: "475px",
            padding: "35px",
            borderRadius: theme.borderRadius,
            border: theme.border,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <DialogTitle sx={{ padding: "0px", fontSize: "25px", marginBottom: "20px" }}>
          Edit Note
        </DialogTitle>

        <TextField
          type="text"
          variant="outlined"
          label="Title"
          name="title"
          value={note.title}
          onChange={handleChange}
          sx={{ marginBottom: "20px", width: "100%" }}
        />

        <TextField
          multiline
          rows={7}
          cols={5}
          label="Note"
          name="description"
          value={note.description}
          variant="outlined"
          onChange={handleChange}
          sx={{ marginBottom: "20px", width: "100%" }}
        />

        <Box sx={{ display: "flex", width: "100%", justifyContent: "flex-start" }}>
          <StyledButton
            onClick={() => setOpen3(false)}
            sx={{ marginRight: "10px" }}
            variant="secondary"
          >
            Close
          </StyledButton>
          <StyledButton onClick={updateNote} variant="main">
            Update
          </StyledButton>
        </Box>
      </Dialog>
    </Container>
  );
};

export default Panel;
