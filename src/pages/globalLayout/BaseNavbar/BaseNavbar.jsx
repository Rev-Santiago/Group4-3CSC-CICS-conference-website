import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tabs, Tab, Box, Menu, MenuItem, IconButton, Collapse, InputBase, Grid, Fab } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import cicsLogo from '../../../assets/cics-logo.png';
import cicsLogoSmall from '../../../assets/cics-seal.png'
import Breadcrumbs from "../../../components/breadcrumbComponent/Breadcrumbs.jsx";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Navbar() {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuType, setMenuType] = useState('');
  const [openNav, setOpenNav] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 860);
  const [isMediumScreen, setIsMediumScreen] = useState(window.innerWidth <= 1150);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const updateScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 860);
      setIsMediumScreen(window.innerWidth <= 1150);
      if (window.innerWidth > 860) setOpenNav(false); // Close mobile menu on resize to desktop
    };
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleMenuOpen = (event, type) => {
    setAnchorEl(event.currentTarget);
    setMenuType(type);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuType('');
  };

  const handleSearch = (event) => {
    if ((event.key === 'Enter' || event.type === 'click') && searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Box className="container mx-auto" sx={{ width: '100%', margin: '0 auto', position: 'relative'}}>
      {/* Logo and Mobile Menu Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, ml: 3, gap: 2 }}>
        <img
          src={isSmallScreen ? cicsLogoSmall : cicsLogo}
          alt="CICS Logo"
          style={{ width: isSmallScreen ? '100px' : '500px', height: 'auto' }}
        />

        {/* Desktop Search Bar */}
        {!isSmallScreen && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              width: 200,
              height: 35,
            }}
          >
            <InputBase
              placeholder="Search…"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              sx={{ paddingLeft: 1 }}
            />
            <Box
              sx={{ backgroundColor: '#B7152F', padding: '8px', cursor: 'pointer', height: 35, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={handleSearch}
            >
              <SearchIcon sx={{ color: 'white' }} />
            </Box>
          </Box>
        )}

        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton onClick={() => setOpenNav(!openNav)}>
            {openNav ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* Desktop Navbar */}
      <Box
        sx={{
          width: '100%',
          display: { xs: 'none', md: 'flex' },
          justifyContent: 'center',
          flexWrap: 'wrap',
          backgroundColor: 'black',
          color: 'white',
          borderTop: '5px solid #B7152F',
        }}
      >
        {isMediumScreen ? (
          <Grid container spacing={2} sx={{ padding: 2 }}>
            <Grid item xs={3}>
              <Tab label="Home" component={Link} to="/" {...a11yProps(0)}
                sx={{ textTransform: "none", transition: "0.3s", "&:hover": { backgroundColor: "#B7152F", color: "white" } }} />
            </Grid>
            <Grid item xs={3}>
              <Tab label="Call For Papers" component={Link} to="/call-for-papers" {...a11yProps(1)}
                sx={{ textTransform: "none", transition: "0.3s", "&:hover": { backgroundColor: "#B7152F", color: "white" } }} />
            </Grid>
            <Grid item xs={3}>
              <Tab label="About Us ▼" onClick={(e) => handleMenuOpen(e, 'about')} {...a11yProps(2)}
                sx={{ textTransform: "none", transition: "0.3s", "&:hover": { backgroundColor: "#B7152F", color: "white" } }} />
            </Grid>
            <Grid item xs={3}>
              <Tab label="Registration & Fees" component={Link} to="/registration-and-fees" {...a11yProps(3)}
                sx={{ textTransform: "none", transition: "0.3s", "&:hover": { backgroundColor: "#B7152F", color: "white" } }} />
            </Grid>
            <Grid item xs={3}>
              <Tab label="Publication" component={Link} to="/publication" {...a11yProps(4)}
                sx={{ textTransform: "none", transition: "0.3s", "&:hover": { backgroundColor: "#B7152F", color: "white" } }} />
            </Grid>
            <Grid item xs={3}>
              <Tab label="Schedule" component={Link} to="/schedule" {...a11yProps(5)}
                sx={{ textTransform: "none", transition: "0.3s", "&:hover": { backgroundColor: "#B7152F", color: "white" } }} />
            </Grid>
            <Grid item xs={3}>
              <Tab label="Venue" component={Link} to="/venue" {...a11yProps(6)}
                sx={{ textTransform: "none", transition: "0.3s", "&:hover": { backgroundColor: "#B7152F", color: "white" } }} />
            </Grid>
            <Grid item xs={3}>
              <Tab label="Speakers ▼" onClick={(e) => handleMenuOpen(e, 'speakers')} {...a11yProps(7)}
                sx={{ textTransform: "none", transition: "0.3s", "&:hover": { backgroundColor: "#B7152F", color: "white" } }} />
            </Grid>
            <Grid item xs={3}>
              <Tab label="Login" component={Link} to="/login" {...a11yProps(8)}
                sx={{ textTransform: "none", transition: "0.3s", "&:hover": { backgroundColor: "#B7152F", color: "white" } }} />
            </Grid>
          </Grid>
        ) : (
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="conference navbar"
            centered
            textColor="inherit"
            TabIndicatorProps={{ style: { display: 'none' } }}
            sx={{ "& .MuiTab-root": { textTransform: "none", transition: "0.3s", "&:hover": { backgroundColor: "#B7152F", color: "white" } } }}
          >

            <Tab label="Home" component={Link} to="/" {...a11yProps(0)} />
            <Tab label="Call For Papers" component={Link} to="/call-for-papers" {...a11yProps(1)} />
            <Tab label="About Us ▼" onClick={(e) => handleMenuOpen(e, 'about')} {...a11yProps(2)} />
            <Tab label="Registration & Fees" component={Link} to="/registration-and-fees" {...a11yProps(3)} />
            <Tab label="Publication" component={Link} to="/publication" {...a11yProps(4)} />
            <Tab label="Schedule" component={Link} to="/schedule" {...a11yProps(5)} />
            <Tab label="Venue" component={Link} to="/venue" {...a11yProps(6)} />
            <Tab label="Speakers ▼" onClick={(e) => handleMenuOpen(e, 'speakers')} {...a11yProps(7)} />
            <Tab label="Login" component={Link} to="/login" {...a11yProps(8)} />
          </Tabs>
        )}
      </Box>

      {/* Mobile Navigation */}
      <Collapse in={openNav}
        sx={{ width: '100%', backgroundColor: 'black', color: 'white', py: 2, borderTop: '5px solid #B7152F' }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Tab label="Home" component={Link} to="/" {...a11yProps(0)}
            sx={{ textTransform: "none", transition: "0.3s", "&:hover": { backgroundColor: "#B7152F", color: "white" } }}
          />
          <Tab label="Call For Papers" component={Link} to="/call-for-papers" {...a11yProps(1)}
            sx={{ textTransform: "none", transition: "0.3s", "&:hover": { backgroundColor: "#B7152F", color: "white" } }}
          />
          <Tab label="About Us ▼" onClick={(e) => handleMenuOpen(e, 'about')} {...a11yProps(2)}
            sx={{ textTransform: "none", transition: "0.3s", "&:hover": { backgroundColor: "#B7152F", color: "white" } }}
          />
          <Tab label="Registration & Fees" component={Link} to="/registration-and-fees" {...a11yProps(3)}
            sx={{ textTransform: "none", transition: "0.3s", "&:hover": { backgroundColor: "#B7152F", color: "white" } }}
          />
          <Tab label="Publication" component={Link} to="/publication" {...a11yProps(4)}
            sx={{ textTransform: "none", transition: "0.3s", "&:hover": { backgroundColor: "#B7152F", color: "white" } }}
          />
          <Tab label="Schedule" component={Link} to="/schedule" {...a11yProps(5)}
            sx={{ textTransform: "none", transition: "0.3s", "&:hover": { backgroundColor: "#B7152F", color: "white" } }}
          />
          <Tab label="Venue" component={Link} to="/venue" {...a11yProps(6)}
            sx={{ textTransform: "none", transition: "0.3s", "&:hover": { backgroundColor: "#B7152F", color: "white" } }}
          />
          <Tab label="Speakers ▼" onClick={(e) => handleMenuOpen(e, 'speakers')} {...a11yProps(7)}
            sx={{ textTransform: "none", transition: "0.3s", "&:hover": { backgroundColor: "#B7152F", color: "white" } }}
          />
          <Tab label="Login" component={Link} to="/login" {...a11yProps(8)}
            sx={{ textTransform: "none", transition: "0.3s", "&:hover": { backgroundColor: "#B7152F", color: "white" } }}
          />
        </Box>
      </Collapse>

      {/* Dropdown Menus */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {menuType === 'about' && (
          <>
            <MenuItem component={Link} to="/contact" onClick={handleMenuClose}>
              Contacts
            </MenuItem>
            <MenuItem component={Link} to="/partners" onClick={handleMenuClose}>
              Partners
            </MenuItem>
            <MenuItem component={Link} to="/committee" onClick={handleMenuClose}>
              Committee
            </MenuItem>
            <MenuItem component={Link} to="/event-history" onClick={handleMenuClose}>
              Event History
            </MenuItem>
          </>
        )}
        {menuType === 'speakers' && (
          <>
            <MenuItem component={Link} to="/keynote-speakers" onClick={handleMenuClose}>
              Keynote Speakers
            </MenuItem>
            <MenuItem component={Link} to="/invited-speakers" onClick={handleMenuClose}>
              Invited Speakers
            </MenuItem>
          </>
        )}
      </Menu>
      <Box
        sx={{
          marginTop: {
            xs: "-20px", // Applies when screen size is small (mobile)
            md: "-50px", // Applies for small screens and larger (default)
          },
        }}
      >
        <Breadcrumbs />
      </Box>
    </Box>
  );
}