import * as React from "react";
import { Link } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";
import ContactsIcon from "@mui/icons-material/Contacts";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import cicsSeal from "../../assets/cics-seal.png";
import { useContext } from "react";
import { AuthContext } from "../../App";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Paper from "@mui/material/Paper";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  color: "white",
  "& .MuiDrawer-paper": {
    backgroundColor: "black",
    color: "white",
  },
  "& .MuiListItemIcon-root": {
    color: "white",
  },
  ...(open
    ? {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": {
          ...openedMixin(theme),
          backgroundColor: "black",
          color: "white",
        },
      }
    : {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": {
          ...closedMixin(theme),
          backgroundColor: "black",
          color: "white",
        },
      }),
}));

const menuItems = [
  { text: "Dashboard", icon: <HomeIcon />, path: "/admin-dashboard" },
  { text: "Events", icon: <ArticleIcon />, isEvent: true },
  { text: "Pages", icon: <ContactsIcon />, path: "/admin-dashboard/contact" },
];

export default function MiniDrawer({ children }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [eventOpen, setEventOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { handleLogout } = useContext(AuthContext);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const toggleEventSidebar = () => setEventOpen(!eventOpen);

  const handleEventClick = (event, isEvent) => {
    if (!open && isEvent) {
      setAnchorEl(event.currentTarget);
    } else {
      toggleEventSidebar();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openPopper = Boolean(anchorEl);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{ backgroundColor: "black", borderBottom: "4px solid #B7152F" }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <img
            src={cicsSeal}
            alt="Logo"
            style={{ width: "55px", height: "auto", marginTop: "12px" }}
          />
          <IconButton
            onClick={handleDrawerClose}
            sx={{ color: "white", position: "absolute", right: "10px" }}
          >
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <List>
          {menuItems.map(({ text, icon, path, isEvent }) => (
            <React.Fragment key={text}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={(event) => handleEventClick(event, isEvent)}
                  component={path ? Link : "div"}
                  to={path || "#"}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#B7152F",
                      color: "white",
                      borderRadius: "8px",
                    },
                  }}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  {open && <ListItemText primary={text} />}
                  {isEvent &&
                    open &&
                    (eventOpen ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </ListItem>
              {isEvent && open && (
                <Collapse in={eventOpen} timeout="auto" unmountOnExit>
                  <List>
                    {["Add Event", "Edit Event", "Delete Event"].map(
                      (text, index) => (
                        <ListItem key={text} disablePadding>
                          <ListItemButton
                            sx={{
                              pl: 6,
                              justifyContent: "flex-start",
                              "&:hover": {
                                backgroundColor: "#B7152F",
                                color: "white",
                                borderRadius: "8px",
                              },
                            }}
                          >
                            <ListItemIcon>
                              {
                                [
                                  <CalendarTodayIcon
                                    fontSize="small"
                                    key="add"
                                  />,
                                  <EditIcon fontSize="small" key="edit" />,
                                  <DeleteIcon fontSize="small" key="delete" />,
                                ][index]
                              }
                            </ListItemIcon>
                            <Typography variant="body2">{text}</Typography>
                          </ListItemButton>
                        </ListItem>
                      )
                    )}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
        <ListItem disablePadding sx={{ display: "block", mt: 2 }}>
          <ListItemButton
            sx={{
              "&:hover": {
                backgroundColor: "#B7152F",
                color: "white",
                borderRadius: "10px",
              },
            }}
          >
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Account" />}
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          sx={{ display: "block", textAlign: "center", marginBottom: "10px" }}
        >
          <ListItemButton
            onClick={handleLogout}
            sx={{
              "&:hover": {
                backgroundColor: "#B7152F",
                color: "white",
                borderRadius: "8px",
              },
            }}
          >
            <ListItemIcon>
              <LogoutIcon color="error" />
            </ListItemIcon>
            {open && <ListItemText primary="Log Out" sx={{ color: "red" }} />}
          </ListItemButton>
        </ListItem>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>

      {/* Popper for Event Actions */}
      <Popper open={openPopper} anchorEl={anchorEl} placement="right-start">
        <ClickAwayListener onClickAway={handleClose}>
          <Paper
            sx={{ backgroundColor: "gray", color: "white", width: "160px" }}
          >
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/add-event">
                  <ListItemIcon sx={{ color: "white", minWidth: "35px" }}>
                    {" "}
                    {/* Adjust spacing */}
                    <CalendarTodayIcon sx={{ fontSize: "15px" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Add Event"
                    primaryTypographyProps={{ sx: { fontSize: "15px" } }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/edit-event">
                  <ListItemIcon sx={{ color: "white", minWidth: "35px" }}>
                    {" "}
                    {/* Adjust spacing */}
                    <EditIcon sx={{ fontSize: "15px" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Edit Event"
                    primaryTypographyProps={{ sx: { fontSize: "15px" } }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/delete-event">
                  <ListItemIcon sx={{ color: "white", minWidth: "35px" }}>
                    {" "}
                    {/* Adjust spacing */}
                    <DeleteIcon sx={{ fontSize: "15px" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Delete Event"
                    primaryTypographyProps={{ sx: { fontSize: "15px" } }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
}
