import { Stack, Typography, Checkbox, useMediaQuery } from "@mui/material";
import { useState, useEffect } from "react";
import { useTheme } from "@emotion/react";
import FormControlLabel from "@mui/material/FormControlLabel";
import StyledButton from "../MainPages/StyledButton";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import Placeholder from "../Resources/VideoPlaceholder.jpg";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import EventNoteIcon from "@mui/icons-material/EventNote";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const VaComp = ({ data, callback, assigned, assignedVasData, order }) => {
  const theme = useTheme();

  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isiPad = useMediaQuery(
    "(max-width: 1200px) and (orientation: landscape), (max-height: 1024px) and (orientation: portrait)"
  );

  const { id } = useParams();

  const PictureUrl = `https://api.unsplash.com/search/photos?query=${data.skills[0]}&client_id=O3B5SfnpZ67qgwItIK_p-Jf2_L8W9Fo1VbaT_ZAXx0c`;

  const [checked, setChecked] = useState(assigned);
  const [picture, setPicture] = useState("");
  const [experience, setExperience] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      const { data: pic } = await axios.get(PictureUrl);
      const firstPicture = pic.results.splice(0, 1);

      setPicture(firstPicture);

      data.experience.forEach((x) => {
        calculateDurationInHours(x.fromDate, x.toDate);
      });
    };

    getData();
  }, []);

  const calculateDurationInHours = (fromDate, toDate) => {
    const start = new Date(fromDate);
    const stop = new Date(toDate);

    const timeDifference = stop - start;
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    const startYear = start.getFullYear();
    const startMonth = start.getMonth();

    const stopYear = stop.getFullYear();
    const stopMonth = stop.getMonth();

    const years = stopYear - startYear;
    const months = stopMonth - startMonth;

    if (years > 1) {
      setExperience(`${years} Years`);
    } else if (years === 1) {
      setExperience(`${years} Year`);
    }

    if (years === 0 && months === 0) {
      setExperience(`${days} Days`);
    }

    if (years === 0 && months !== 0) {
      setExperience(`${months} Months`);
    }
  };

  const viewProfile = () => {
    Cookies.set("client_id", id, { expires: 30 });
    sessionStorage.setItem("client_index", order);
    Cookies.set("assignedArr", JSON.stringify(assignedVasData), {
      expires: 30,
    });

    navigate(`/va/${data._id}`);
  };

  const handleCheckboxChange = (e, id) => {
    setChecked(e.target.checked);
    callback(e.target.checked, id);
  };

  const convertDates = (date) => {
    if (!date) {
      return "No date";
    } else {
      const dateString = date;
      const dateObject = new Date(dateString);

      const year = dateObject.getFullYear();
      const month = dateObject.toLocaleString("default", { month: "long" });
      const day = dateObject.getDate();

      const formattedDate = `${day} ${month} ${year}`;
      return formattedDate;
    }
  };

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Stack
      boxShadow={theme.shadows[11]}
      borderRadius={6}
      display="flex"
      mb={isMobile ? 2 : 0}
      justifyContent="center"
      sx={{ flexBasis: !isMobile ? (isTablet || isiPad) ? "calc(50% - 11px)" : "calc(33.33% - 11px)" : '100%' }}
      
    >
      <Stack position="relative">
        <img
          src={picture[0]?.urls?.full}
          width="100%"
          height="130px"
          alt=""
          style={{
            objectFit: "cover",
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
          }}
        />

        <Stack
          p="20px 30px"
          borderRadius={5}
          gap={2}
          sx={{
            backgroundColor: "white",
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <Stack>
            <img
              src={
                data.profileImage
                  ? process.env.REACT_APP_CLOUD_URL + data.profileImage
                  : Placeholder
              }
              width="60px"
              height="60px"
              alt="profile-image"
              style={{ borderRadius: "100px", objectFit: "cover" }}
            />
          </Stack>
          <Stack flex={1} spacing={1} position="relative">
            <Typography
              component="span"
              variant="span"
              fontSize={18}
              textTransform="capitalize"
              fontWeight={600}
            >
              {data.fullname}
            </Typography>
            <Stack flexDirection="row" alignItems="flex-start" gap={0.5}>
              <AssignmentIndIcon fontSize="small" sx={{ color: "#3DAE6A" }} />
              <Typography component="span" variant="span" fontSize={14} textTransform="capitalize">
                <b>Position:</b> {data.position}
              </Typography>
            </Stack>
            <Stack flexDirection="row" alignItems="center" gap={0.5}>
              <EventNoteIcon fontSize="small" sx={{ color: "#3DAE6A" }} />
              <Typography component="span" variant="span" fontSize={14} textTransform="capitalize">
                <b>Age:</b> {data.age}
              </Typography>
            </Stack>
            <Stack flexDirection="row" alignItems="center" gap={0.5}>
              <LocationOnIcon fontSize="small" sx={{ color: "#3DAE6A" }} />
              <Typography component="span" variant="span" fontSize={14} textTransform="capitalize">
                <b>Country:</b> {data.country}
              </Typography>
            </Stack>
         { isMobile ? null :  <FormControlLabel
              sx={{ position: "absolute", right: 0, top: 0 }}
              control={
                <Checkbox
                  sx={{ padding: 0 }}
                  checked={checked}
                  onChange={(e) => handleCheckboxChange(e, data._id)}
                />
              }
            />}
          </Stack>
        </Stack>
      </Stack>
      <Stack p={3} spacing={3}>
        <Stack gap={2}>
          <Typography fontSize="14px">
            <b>Strengths:</b> {data.strengths}
          </Typography>
          <Typography fontSize="14px">
            <b>Years of experience:</b> {experience}
          </Typography>
        </Stack>
        <Stack
         display={isMobile ? "flex" : null }
         flexDirection={isMobile ?"row" : null }
         justifyContent={ isMobile ? "space-between" : null}
         alignItems={ isMobile ? "center" : null }
        
        >
          <StyledButton onClick={viewProfile} variant="main" sx={{ width: "100%" }}>
            View Profile
          </StyledButton>

          { isMobile ? <FormControlLabel display="flex"
              
              control={
                <Checkbox
                  checked={checked}
                  sx={{transform: "scale(2)", marginLeft : "10px"}}
                  onChange={(e) => handleCheckboxChange(e, data._id)}
                />
              }
            /> : null }
        </Stack>
      </Stack>
    </Stack>
  );
};

export default VaComp;
