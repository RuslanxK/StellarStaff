import { useTheme } from "@emotion/react";
import { Container, Typography, Stack } from "@mui/material";
import { useState, useEffect } from "react";
import { getAllChangeLogs } from "../ApiUrls";
import axios from "axios";
import SingleLogData from "./SingleLogData";

const ChangeLog = () => {
  const theme = useTheme();

  const [groupedTasks, setGroupedTasks] = useState({});
  const [uniqueDates, setUniqueDates] = useState([]);
 


  useEffect(() => {

    const getAllLogs = async () => {
      
      const { data } = await axios.get(getAllChangeLogs);

      const groupedData = data.reduce((result, task) => {
        const taskDate = new Date(task.timestamp).toLocaleDateString();

        if (!result[taskDate]) {
          result[taskDate] = [];
        }
        result[taskDate].push(task);

        return result;
      }, {});

      setGroupedTasks(groupedData);
      setUniqueDates(Object.keys(groupedData));

      console.log(groupedData);
    };

    getAllLogs();
  }, []);





  return (
    <Container
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
        rowGap: 5,
        paddingBottom: "15px"
        
      }}
    >
      <Stack direction="column" spacing={4}>
        {uniqueDates.reverse().map((date, index) => (
          <div
            key={index}
            style={{
              padding: "25px",
              border: theme.border,
              borderRadius: theme.borderRadius,
            }}
          >
            <Typography
              variant="h5"
              component="h3"
              fontSize="20px"
              fontWeight={500}
              paddingBottom="10px"
            >
              {date}
            </Typography>
            {groupedTasks[date].map((task, taskIndex) => (
              <SingleLogData key={taskIndex} data={task}  />
            ))}
          </div>
        ))}

      </Stack>
    </Container>
  );
};

export default ChangeLog;
