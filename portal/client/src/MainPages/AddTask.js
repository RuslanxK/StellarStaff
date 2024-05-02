import { useState } from "react";
import { Box, TextField, TextareaAutosize, Stack, Typography } from "@mui/material";
import StyledButton from "./StyledButton";
import { useTheme } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useReducer } from "react";
import axios from "axios";
import { addTask, getAllChangeLogs, updateTask } from "../ApiUrls";
import SingleLogData from "./SingleLogData";

const AddTask = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [task, setTask] = useState({
    title: "",
    description: ""
  });
  const [groupedTasks, setGroupedTasks] = useState({});
  const [uniqueDates, setUniqueDates] = useState([]);
  const [taskData, setTaskData] = useState([])
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const [titleValue, setTitleValue] = ("")

  useEffect(() => {
    const getAllLogs = async () => {
      const { data } = await axios.get(getAllChangeLogs);

       setTaskData(data)

      const groupedData = data.reduce((result, task) => {
        const taskDate = new Date(task.timestamp).toLocaleDateString();

        if (!result[taskDate]) {
          result[taskDate] = [];
        }
        result[taskDate].push(task);

        return result;
      }, {});

      setGroupedTasks(groupedData);
      setUniqueDates(Object.keys(groupedData).reverse());
    };

    getAllLogs();
  }, [reducerValue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const add = async () => {
    const data = await axios.post(addTask, task);
    setTask({title: "", description: ""});
    forceUpdate();
  };

  const removedData = (val) => {
    if (val) {
      forceUpdate();
    }
  };



  const checkBoxVal = async (val, id) => {

    const foundObj = taskData.find(task => task._id === id)

    if(foundObj) {


      foundObj.checked = val

           try {

           const { data } = await axios.put(updateTask(id), foundObj);

           console.log(data)
           forceUpdate()

          }

          catch(error) {

            console.log(error)
          }
    }
  }




  return (
    <Box
      display="flex"
      justifyContent="space-evenly"
      alignItems="center"
      minHeight="100vh"
    >
      <Stack
        border={theme.border}
        borderRadius={theme.borderRadius}
        padding={5}
        width="50%"
        spacing={2}
        sx={{
          position: "sticky",
          top: "40px",
          alignSelf: "flex-start",
        }}
      >
        <Typography
          component="h2"
          variant="h5"
          fontWeight="500"
          textAlign="center"
          marginBottom={2}
        >
          Add Task
        </Typography>
        <TextField
          type="text"
          variant="outlined"
          label="Title"
          name="title"
          value={task.title}
          onChange={handleChange}
          fullWidth
        />
        <Box>
          <TextareaAutosize
            rowsMin={10} // Set the minimum number of rows
            style={{
              width: "100%",
              height: "150px",
              resize: "none",
              padding: "10px",
            }}
            name="description"
            value={task.description}
            onChange={handleChange}
            placeholder="Description"
            type="text"
          />
        </Box>
        <StyledButton variant="main" onClick={add}>
          Add Task
        </StyledButton>
      </Stack>

      <Stack direction="column" spacing={4} width={600}>
        {uniqueDates.map((date, index) => (
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
              <SingleLogData
                key={taskIndex}
                data={task}
                callback={removedData}
                showCloseIcon={true}
                sendCheckBoxVal={checkBoxVal}
              />
            ))}
          </div>
        ))}
      </Stack>
    </Box>
  );
};

export default AddTask;
