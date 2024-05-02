import { CheckCircleOutlineRounded } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Stack, Typography, Checkbox } from "@mui/material";
import { removeTask } from "../ApiUrls";
import axios from "axios";

const SingleLogData = ({ data, callback, showCloseIcon, sendCheckBoxVal }) => {
  const deleteTask = async () => {
    const removedData = await axios.delete(removeTask(data._id));

    console.log(removedData);

    callback("removed");
  };

  const handleCheckBoxChange = (e, id) => {
    const val = e.target.checked;
    sendCheckBoxVal(val, id);
  };

  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingTop: "5px",
        paddingBottom: "5px",
        width: "100%",
      }}
    >
      <CheckCircleOutlineRounded sx={{ color: "#32CD32", fontSize: "18px", marginRight: "5px" }} />
      <Stack flexDirection="column">
        <Typography variant="span" component="span">
          {data.title}
        </Typography>
        <Typography variant="p" component="p" fontSize={12}>
          {data.description}
        </Typography>
      </Stack>

      {showCloseIcon && (
        <Checkbox checked={data.checked} onChange={(e) => handleCheckBoxChange(e, data._id)} />
      )}

      {showCloseIcon && (
        <CloseIcon
          sx={{ display: "flex", paddingLeft: "5px", color: "red" }}
          onClick={deleteTask}
        />
      )}
    </Stack>
  );
};

export default SingleLogData;
