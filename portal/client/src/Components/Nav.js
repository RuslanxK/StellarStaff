import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Typography,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../Resources/logo.png";
import {
  GridView,
  BusinessCenterOutlined,
  PersonOutlineOutlined,
  SettingsOutlined,
  LogoutOutlined,
} from "@mui/icons-material";
import Cookies from "js-cookie";
import { useTheme } from "@emotion/react";
import axios from "axios"
import { API_BASE_URL } from "../ApiUrls";


const Nav = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate()
  
  const token = Cookies.get("token")

  const [items, setItems] = useState([
    {
      icon: <GridView style={{ color: "#cecece" }} />,
      text: "Home",
      color: "#cecece",
      open: false,
      path: "/panel",
    },
    {
      icon: <BusinessCenterOutlined style={{ color: "#bfbfbf" }} />,
      text: "Our Clients",
      color: "#bfbfbf",
      open: false,
      path: "/clients",
      subItems: [
        {
          text: "Pending clients",
          path: "/clients/?q=pending",
        },
        {
          text: "Active clients",
          path: "/clients/?q=active",
        },
        {
          text: "Paused clients",
          path: "/clients/?q=paused",
        },
      ],
    },
    {
      icon: <PersonOutlineOutlined style={{ color: "#bfbfbf" }} />,
      text: "Our Virtual Assistants",
      color: "#bfbfbf",
      open: false,
      path: "/vas/",
      subItems: [
        {
          text: "Active Virtual Assistants",
          path: "/vas/?q=active",
        },
        {
          text: "Inactive Virtual Assistants",
          path: "/vas/?q=inactive",
        },
        {
          text: "Pending Virtual Assistants",
          path: "/vas/?q=pending",
        },
      ],
    },
    {
      icon: <SettingsOutlined style={{ color: "#bfbfbf" }} />,
      text: "Settings",
      color: "#bfbfbf",
      open: false,
      path: "/settings",
    },
  ]);

  const handleItemClick = (index) => {
    if (index === 1 || index === 2) {
      // Only toggle open for "Our Clients" and "Our Virtual Assistants"
      const newItems = [...items];
      newItems[index].open = !newItems[index].open;
      setItems(newItems);
    }
  };



  const LogOut = async () => {


    const data = {};

    const options = {
      
      headers: {
        Authorization: token,
      },
    };

    axios
      .post(`${API_BASE_URL}/api/admins/logoutAll`, data, options)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });

    Cookies.remove("username");
    Cookies.remove("token");
    Cookies.remove("isAdmin");
    Cookies.remove("_id")
    

    navigate("/manage/access");
    
  };
  


  return (
    <Box sx={{ display: "flex" }}>
      <Drawer variant="permanent" sx={{ width: 240 }}>
        <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <Box sx={{ width: "15vw" }}>
            <Box margin={3}>
              <img src={logo} alt="logo" loading="lazy" width={150} />
            </Box>

            <List>
              {items.map(
                ({ icon, text, color, open, path, subItems }, index) => {
                  const isActive = location.pathname.startsWith(path);
                  const listItemStyle = {
                    borderBottom: "1px solid #e5e5e5",
                    paddingTop: "15px",
                    paddingBottom: "15px",
                    bgcolor: isActive
                      ? theme.palette.primary.main
                      : "transparent",
                    "&:hover": {
                      bgcolor: isActive
                        ? theme.palette.primary.main
                        : "#f5f5f5",
                    },
                  };

                  const iconStyle = { color: isActive ? "#ffffff" : color };
                  const textStyle = {
                    color: isActive ? "#ffffff" : "black",
                    fontSize: "14px",
                    marginLeft: "5px",
                  };

                  const nestedTextStyle = { fontSize: "13px" };

                  return (
                    <React.Fragment key={index}>
                      <ListItem
                        button
                        component={Link}
                        to={path}
                        onClick={() => handleItemClick(index)}
                        sx={listItemStyle}
                      >
                        {React.cloneElement(icon, { style: iconStyle })}
                        <ListItemText
                          primaryTypographyProps={{
                            variant: "body1",
                            style: textStyle,
                          }}
                          primary={text}
                        />
                      </ListItem>
                      {open && subItems && (
                        <Collapse in={open} timeout="auto" unmountOnExit>
                          <List>
                            {subItems.map(
                              (
                                { text: subItemText, path: subItemPath },
                                subIndex
                              ) => (
                                <ListItem
                                  key={subIndex}
                                  button
                                  component={Link}
                                  to={subItemPath}
                                >
                                  <ListItemText
                                    primary={subItemText}
                                    primaryTypographyProps={{
                                      style: nestedTextStyle,
                                    }}
                                  />
                                </ListItem>
                              )
                            )}
                          </List>
                        </Collapse>
                      )}
                    </React.Fragment>
                  );
                }
              )}
            </List>
          </Box>

          <Box>
            <Typography onClick={LogOut}
              sx={{
                display: "flex",
                justifyContent: "center",
                fontSize: "14px",
                marginBottom: "12px",
                cursor: "pointer"
              }}>
              <LogoutOutlined
                style={{ color: "#bfbfbf", marginRight: "7px" }}
              />{" "}
              Log Out Now
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Nav;
