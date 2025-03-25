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
import Tooltip from "@mui/material/Tooltip";
import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";
import ContactsIcon from "@mui/icons-material/Contacts";
import GroupIcon from "@mui/icons-material/Group";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import HistoryIcon from "@mui/icons-material/History";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import BookIcon from "@mui/icons-material/Book";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import cicsSeal from "../../assets/cics-seal.png";
import { useContext } from "react";
import { AuthContext } from "../../App"; 

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
  justifyContent: "flex-end",
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

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    color: "white", // ✅ Text color
    "& .MuiDrawer-paper": {
      backgroundColor: "black", // ✅ Ensures the drawer stays black
      color: "white", // ✅ Ensures the text is white
    },
    "& .MuiListItemIcon-root": {
      color: "white", // ✅ Icons white
    },
    ...(open
      ? {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": { ...openedMixin(theme), backgroundColor: "black", color: "white" },
      }
      : {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": { ...closedMixin(theme), backgroundColor: "black", color: "white" },
      }),
  })
);

const menuItems = [
  { text: "Dashboard", icon: <HomeIcon />, path: "/admin-dashboard" },
  { text: "Event Manager", icon: <ArticleIcon />, path: "/admin-dashboard/call-for-papers" },
  { text: "Page Manager", icon: <ContactsIcon />, path: "/admin-dashboard/contact" },
  // { text: "Partners", icon: <GroupIcon />, path: "/admin-dashboard/partners" },
  // { text: "Committee", icon: <PeopleAltIcon />, path: "/admin-dashboard/committee" },
  // { text: "Event History", icon: <HistoryIcon />, path: "/admin-dashboard/event-history" },
  // { text: "Registration & Fees", icon: <MonetizationOnIcon />, path: "/admin-dashboard/registration-and-fees" },
  // { text: "Publication", icon: <BookIcon />, path: "/admin-dashboard/publication" },
  // { text: "Schedule", icon: <EventIcon />, path: "/admin-dashboard/schedule" },
  // { text: "Venue", icon: <LocationOnIcon />, path: "/admin-dashboard/venue" },
  // { text: "Keynote Speakers", icon: <StarIcon />, path: "/admin-dashboard/keynote-speakers" },
  // { text: "Invited Speakers", icon: <PersonIcon />, path: "/admin-dashboard/invited-speakers" },
];

export default function MiniDrawer({ children }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const { handleLogout } = useContext(AuthContext);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ backgroundColor: "black", borderBottom: "4px solid #B7152F" }}>
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} edge="start">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>

        <DrawerHeader sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center", // Ensures logo stays centered
          position: "relative", // Allows absolute positioning of the button
          width: "100%"
        }}>
          <img src={cicsSeal} alt="Logo" style={{ width: "55px", height: "auto", marginTop: "12px" }} />

          <IconButton
            onClick={handleDrawerClose}
            sx={{
              color: "white",
              position: "absolute",
              right: "10px" // Pushes the button to the right edge
            }}>
            {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <List>
        {menuItems.map(({ text, icon, path }) => (
  <ListItem key={text} disablePadding sx={{ display: "block" }}>
    <Tooltip title={!open ? text : ""} placement="right">
      <ListItemButton
        component={path ? Link : "div"} // Prevents crash if path is undefined
        to={path || "#"} // Uses "#" if no path is provided
        sx={{ justifyContent: open ? "initial" : "center" }}
      >
        <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : "auto", justifyContent: "center" }}>
          {icon}
        </ListItemIcon>
        {open && <ListItemText primary={text} />}
      </ListItemButton>
    </Tooltip>
  </ListItem>
))}
        </List>
        <ListItem disablePadding sx={{ display: "block", mt: 2 }}>
          <ListItemButton>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Account" />}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ display: "block", textAlign: "center", marginBottom: "10px" }}>
          <ListItemButton onClick={handleLogout}>
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
    </Box>
  );
}