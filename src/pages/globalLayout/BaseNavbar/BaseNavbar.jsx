import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Tab, Box, Menu, MenuItem, IconButton, Collapse, InputBase, Grid } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import cicsLogo from '../../../assets/cics-logo.png';
import cicsLogoSmall from '../../../assets/cics-seal.png';

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
      if (window.innerWidth > 860) setOpenNav(false);
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
    if (event.key === 'Enter') {
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <Box sx={{ width: '95%', margin: '0 auto', position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, ml: 3, gap: 2 }}>
        <img 
          src={isSmallScreen ? cicsLogoSmall : cicsLogo} 
          alt="CICS Logo" 
          style={{ width: isSmallScreen ? '100px' : '500px', height: 'auto' }} 
        />
        
        {!isSmallScreen && (
          <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px', width: 250 }}>
            <InputBase
              placeholder="Search…"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              sx={{ paddingLeft: 1 }}
            />
            <Box sx={{ backgroundColor: '#B7152F', padding: '8px', cursor: 'pointer' }}>
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
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="conference navbar"
          centered
          textColor="inherit"
          TabIndicatorProps={{ style: { display: 'none' } }}
        >
          <Tab label="Home" {...a11yProps(0)} onClick={() => navigate('/')} />
          <Tab label="Call For Papers" {...a11yProps(1)} onClick={() => navigate('/call-for-papers')} />
          <Tab label="About Us ▼" {...a11yProps(2)} onClick={(e) => handleMenuOpen(e, 'about')} />
          <Tab label="Registration & Fees" {...a11yProps(3)} onClick={() => navigate('/registration-fees')} />
          <Tab label="Publication" {...a11yProps(4)} onClick={() => navigate('/publication')} />
          <Tab label="Schedule" {...a11yProps(5)} onClick={() => navigate('/schedule')} />
          <Tab label="Venue" {...a11yProps(6)} onClick={() => navigate('/venue')} />
          <Tab label="Speakers ▼" {...a11yProps(7)} onClick={(e) => handleMenuOpen(e, 'speakers')} />
          <Tab label="Login" {...a11yProps(8)} onClick={() => navigate('/login')} />
        </Tabs>
      </Box>

      <Collapse in={openNav} sx={{ width: '100%', backgroundColor: 'black', color: 'white', py: 2, borderTop: '5px solid #B7152F' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Tab label="Home" {...a11yProps(0)} onClick={() => navigate('/')} />
          <Tab label="Call For Papers" {...a11yProps(1)} onClick={() => navigate('/call-for-papers')} />
          <Tab label="About Us ▼" {...a11yProps(2)} onClick={(e) => handleMenuOpen(e, 'about')} />
          <Tab label="Registration & Fees" {...a11yProps(3)} onClick={() => navigate('/registration-fees')} />
          <Tab label="Publication" {...a11yProps(4)} onClick={() => navigate('/publication')} />
          <Tab label="Schedule" {...a11yProps(5)} onClick={() => navigate('/schedule')} />
          <Tab label="Venue" {...a11yProps(6)} onClick={() => navigate('/venue')} />
          <Tab label="Speakers ▼" {...a11yProps(7)} onClick={(e) => handleMenuOpen(e, 'speakers')} />
          <Tab label="Login" {...a11yProps(8)} onClick={() => navigate('/login')} />
        </Box>
      </Collapse>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {menuType === 'about' && (
          <>
            <MenuItem onClick={() => navigate('/contacts')}>Contacts</MenuItem>
            <MenuItem onClick={() => navigate('/partners')}>Partners</MenuItem>
            <MenuItem onClick={() => navigate('/committee')}>Committee</MenuItem>
            <MenuItem onClick={() => navigate('/event-history')}>Event History</MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
}
