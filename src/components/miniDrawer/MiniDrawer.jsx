import * as React from "react";
import { Link } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
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
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventsIcon from "@mui/icons-material/Event";
import PagesIcon from "@mui/icons-material/Pages";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import cicsSeal from "../../assets/cics-seal.png";
import { useContext } from "react";
import { AuthContext } from "../../App";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";

const drawerWidth = 200;

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
  { text: "Dashboard", icon: <DashboardIcon />, path: "/admin-dashboard" },
  { text: "Events", icon: <EventsIcon />, path: "events" },
  { text: "Pages", icon: <PagesIcon />, path: "pages" },
];

export default function MiniDrawer({ children }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const { handleLogout } = useContext(AuthContext);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const navigate = useNavigate();

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
            sx={{
              "&:hover": {
                backgroundColor: "#B7152F",
                color: "white",
                borderRadius: "full",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" marginLeft={"3px"}>
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
            sx={{
              "&:hover": {
                backgroundColor: "#B7152F",
                color: "white",
                borderRadius: "full",
              },
              color: "white",
              position: "absolute",
              right: "10px"
            }}
          >
            {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        {open && (
          <>
            <Typography variant="caption" sx={{ pl: 2, pt: 2, color: "gray" }}>
              Main
            </Typography>
          </>
        )}
        <List>
          {menuItems.map(({ text, icon, path }) => (
            <React.Fragment key={text} >
              {/* Conditionally render Divider and Typography if open */}
              {open && text === "Events" && (
                <>
                  <Divider sx={{ mt: 3, mx: 2, backgroundColor: "gray" }} />
                  <Typography variant="caption" sx={{ mt: 2, mb: 1 , pl: 2, color: "gray", display: "block" }}>
                    Content Management
                  </Typography>
                </>
              )}
              <ListItem disablePadding>
                <Tooltip title={!open ? text : ""} placement="right">
                  <ListItemButton
                    onClick={() => navigate(path)}
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
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            </React.Fragment>
          ))}

          {/* Account Section (Moved outside the loop) */}
          {open && (
            <>
              <Divider sx={{ mt: 3, mx: 2, backgroundColor: "gray" }} />
              <Typography variant="caption" sx={{ mt: 2, pl: 2, color: "gray", display: "block" }}>
                User
              </Typography>
            </>
          )}
          <ListItem disablePadding sx={{ display: "block", mt: 1 }}>
            {open ? (
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
                <ListItemText primary="Account" />
              </ListItemButton>
            ) : (
              <Tooltip title="Account" placement="right">
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
                </ListItemButton>
              </Tooltip>
            )}
          </ListItem>
        </List>

        <ListItem
          disablePadding
          sx={{ display: "block", textAlign: "center", marginBottom: "10px" }}
        >
          {open ? (
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
              <ListItemText primary="Log Out" sx={{ color: "red" }} />
            </ListItemButton>
          ) : (
            <Tooltip title="Log Out" placement="right">
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
              </ListItemButton>
            </Tooltip>
          )}
        </ListItem>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
