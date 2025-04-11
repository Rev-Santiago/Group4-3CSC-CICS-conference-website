import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Tabs, Tab, Box, Collapse, InputBase, Grid, Popper, Paper, Grow } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import cicsLogoSmall from '../../../../assets/cics-seal.png';
import cicsTextWithLogo from '../../../assets/cics-logo-with-text.png';
import Breadcrumbs from "../../../components/breadcrumbComponent/Breadcrumbs.jsx";

// Constants
const MENU_TYPES = {
  ABOUT: 'about',
  SPEAKERS: 'speakers'
};

const ABOUT_MENU_ITEMS = [
  { path: '/contact', label: 'Contacts' },
  { path: '/partners', label: 'Partners' },
  { path: '/committee', label: 'Committee' },
  { path: '/event-history', label: 'Event History' }
];

const SPEAKERS_MENU_ITEMS = [
  { path: '/keynote-speakers', label: 'Keynote Speakers' },
  { path: '/invited-speakers', label: 'Invited Speakers' }
];

const NAV_LINKS = [
  { label: "Home", path: "/", hasDropdown: false },
  { label: "Call For Papers", path: "/call-for-papers", hasDropdown: false },
  { label: "About Us ▼", path: "", hasDropdown: true, menuType: MENU_TYPES.ABOUT },
  { label: "Registration & Fees", path: "/registration-and-fees", hasDropdown: false },
  { label: "Publication", path: "/publication", hasDropdown: false },
  { label: "Schedule", path: "/schedule", hasDropdown: false },
  { label: "Venue", path: "/venue", hasDropdown: false },
  { label: "Speakers ▼", path: "", hasDropdown: true, menuType: MENU_TYPES.SPEAKERS },
  { label: "Login", path: "/login", hasDropdown: false }
];

// A11y Props for Tabs
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

/**
 * HoverMenu Component - Renders dropdown menu on hover
 */
function HoverMenu({ anchorEl, open, items, onClose, onMouseEnter, onMouseLeave }) {
  const navigate = useNavigate();

  const handleItemClick = (path) => {
    navigate(path);
    // Set the active tab to -1 to remove any highlighting
    // This will be caught in the next render cycle by the useEffect
    onClose();
  };

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      transition
      placement="bottom-start"
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: [0, 0],
          },
        },
      ]}
      sx={{ zIndex: 1300 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps} timeout={350}>
          <Paper
            elevation={3}
            sx={{
              backgroundColor: 'white',
              minWidth: 180,
              borderRadius: '0 0 4px 4px',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              {items.map((item, index) => (
                <Box
                  key={index}
                  component="div"
                  onClick={() => handleItemClick(item.path)}
                  sx={{
                    padding: '10px 16px',
                    color: 'black',
                    textDecoration: 'none',
                    transition: 'background-color 0.3s',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                      color: '#B7152F',
                    }
                  }}
                >
                  {item.label}
                </Box>
              ))}
            </Box>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
}

/**
 * NavTab Component - Individual navigation tab with hover dropdown support
 */
function NavTab({ label, path, hasDropdown, menuType, index, value, onClick }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  const handleMouseEnter = (event) => {
    if (hasDropdown) {
      clearTimeout(timeoutRef.current);
      setAnchorEl(event.currentTarget);
      setOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (hasDropdown) {
      // Increased delay time for medium screens
      timeoutRef.current = setTimeout(() => {
        setOpen(false);
      }, 500); // Increased from 300ms to 500ms
    }
  };

  const handleMenuMouseEnter = () => {
    clearTimeout(timeoutRef.current);
  };

  const handleMenuMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 500); // Increased from 300ms to 500ms
  };

  const handleMenuClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    if (onClick) onClick();
    if (!hasDropdown) navigate(path);
  };

  const getMenuItems = () => {
    switch (menuType) {
      case MENU_TYPES.ABOUT:
        return ABOUT_MENU_ITEMS;
      case MENU_TYPES.SPEAKERS:
        return SPEAKERS_MENU_ITEMS;
      default:
        return [];
    }
  };

  const tabProps = {
    label,
    component: 'div',
    onClick: handleClick,
    ...a11yProps(index),
    sx: {
      textTransform: "none",
      transition: "0.3s",
      cursor: 'pointer',
      backgroundColor: value === index ? "#B7152F" : "transparent",
      color: value === index ? "white" : "inherit",
      "&:hover": {
        backgroundColor: "#B7152F",
        color: "white"
      },
      "@media (max-width:960px)": {
        fontSize: "0.74rem"
      }
    },
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave
  };

  return (
    <>
      <Tab {...tabProps} />
      {hasDropdown && (
        <HoverMenu
          anchorEl={anchorEl}
          open={open}
          items={getMenuItems()}
          onClose={handleMenuClose}
          onMouseEnter={handleMenuMouseEnter}
          onMouseLeave={handleMenuMouseLeave}
        />
      )}
    </>
  );
}

/**
 * Main Navbar Component
 */
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(0);
  const [openNav, setOpenNav] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 860);
  const [isMediumScreen, setIsMediumScreen] = useState(window.innerWidth <= 1150);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    // Find the index of the current path in NAV_LINKS
    const currentPath = location.pathname;
    
    // First check if the current path matches any dropdown item
    const isDropdownPath = [...ABOUT_MENU_ITEMS, ...SPEAKERS_MENU_ITEMS].some(item => 
      item.path === currentPath
    );
    
    if (isDropdownPath) {
      // If we're on a dropdown path, don't highlight any main tab
      setValue(-1);
    } else {
      // Otherwise find the matching main tab
      const activeTabIndex = NAV_LINKS.findIndex(link =>
        !link.hasDropdown && link.path === currentPath
      );

      if (activeTabIndex !== -1) {
        setValue(activeTabIndex);
      }
    }
  }, [location.pathname]);

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

  const handleSearch = (event) => {
    if ((event.key === 'Enter' || event.type === 'click') && searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleMobileDropdown = (menuType) => {
    setMobileDropdown(mobileDropdown === menuType ? null : menuType);
  };

  const handleMobileNavItemClick = (path) => {
    navigate(path);
    
    // Check if this is a dropdown path and remove tab highlighting if it is
    const isDropdownPath = [...ABOUT_MENU_ITEMS, ...SPEAKERS_MENU_ITEMS].some(
      item => item.path === path
    );
    
    if (isDropdownPath) {
      setValue(-1);
    }
    
    setOpenNav(false);
    setMobileDropdown(null);
  };

  const getMobileMenuItems = (menuType) => {
    return menuType === MENU_TYPES.ABOUT ? ABOUT_MENU_ITEMS : SPEAKERS_MENU_ITEMS;
  };

  // Add this function for Grid layout to handle dropdown
  const handleGridItemMouseEnter = (menuType) => {
    setActiveDropdown(menuType);
  };

  const handleGridItemMouseLeave = () => {
    // Use timeout to prevent immediate closing
    setTimeout(() => {
      setActiveDropdown(null);
    }, 500);
  };

  return (
    <Box className="container mx-auto" sx={{ width: '100%', margin: '0 auto', position: 'relative' }}>
      {/* Logo and Mobile Menu Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, gap: 2 }}>
        <img
          src={isSmallScreen ? cicsLogoSmall : cicsTextWithLogo}
          alt="CICS Logo"
          style={{
            width: isSmallScreen ? '100px' : '480px',
            height: 'auto',
            objectFit: 'contain',
            display: 'block',
          }}
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
              sx={{
                backgroundColor: '#B7152F',
                padding: '8px',
                cursor: 'pointer',
                height: 35,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={handleSearch}
            >
              <SearchIcon sx={{ color: 'white' }} />
            </Box>
          </Box>
        )}

        {/* Mobile Menu Toggle */}
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
            {NAV_LINKS.map((link, index) => (
              <Grid 
                item 
                xs={3} 
                sm={2} 
                key={index}
                onMouseEnter={link.hasDropdown ? () => handleGridItemMouseEnter(link.menuType) : undefined}
                onMouseLeave={link.hasDropdown ? handleGridItemMouseLeave : undefined}
                position="relative"
              >
                <Box 
                  onClick={() => {
                    if (!link.hasDropdown) {
                      navigate(link.path);
                      setValue(index);
                    }
                  }}
                  sx={{
                    textAlign: 'center',
                    padding: '8px 4px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    backgroundColor: value === index ? "#B7152F" : "transparent",
                    color: "white",
                    transition: "background-color 0.3s",
                    "&:hover": {
                      backgroundColor: "#B7152F",
                    },
                    fontSize: { xs: '0.74rem', sm: '0.875rem' }
                  }}
                >
                  {link.label}
                </Box>
                
                {/* Medium screen dropdown */}
                {link.hasDropdown && activeDropdown === link.menuType && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      zIndex: 1300,
                      backgroundColor: 'white',
                      boxShadow: 3,
                      borderRadius: '0 0 4px 4px',
                      marginTop: '2px'
                    }}
                    onMouseEnter={() => setActiveDropdown(link.menuType)}
                    onMouseLeave={handleGridItemMouseLeave}
                  >
                    {(link.menuType === MENU_TYPES.ABOUT ? ABOUT_MENU_ITEMS : SPEAKERS_MENU_ITEMS).map((item, idx) => (
                      <Box
                        key={idx}
                        component="div"
                        onClick={() => {
                          navigate(item.path);
                          setActiveDropdown(null);
                        }}
                        sx={{
                          padding: '10px 8px',
                          color: 'black',
                          textDecoration: 'none',
                          transition: 'background-color 0.3s',
                          cursor: 'pointer',
                          textAlign: 'center',
                          '&:hover': {
                            backgroundColor: '#f5f5f5',
                            color: '#B7152F',
                          }
                        }}
                      >
                        {item.label}
                      </Box>
                    ))}
                  </Box>
                )}
              </Grid>
            ))}
          </Grid>
        ) : (
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="conference navbar"
            centered
            textColor="inherit"
            TabIndicatorProps={{ style: { display: 'none' } }}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                transition: "0.3s",
                color: "white", // 🔥 ensures default state is white
                opacity: 1,      // ✨ prevents the default 70% opacity
                "&.Mui-selected": {
                  backgroundColor: "#B7152F",
                  color: "white"
                },
                "&:hover": {
                  backgroundColor: "#B7152F",
                  color: "white"
                },
                "&.Mui-disabled": {
                  color: "white", // just in case any tab gets disabled
                  opacity: 1
                }
              }
            }}
          >
            {NAV_LINKS.map((link, index) => (
              <NavTab
                key={index}
                {...link}
                index={index}
                value={value}
                onClick={() => setValue(index)}
              />
            ))}
          </Tabs>
        )}
      </Box>

      {/* Mobile Navigation */}
      <Collapse
        in={openNav}
        sx={{
          width: '100%',
          backgroundColor: 'black',
          color: 'white',
          py: 2,
          borderTop: '5px solid #B7152F',
          "& .MuiTab-root": {
            textTransform: "none",
            transition: "0.3s",
            color: "white", // 🔥 ensures default state is white
            opacity: 1,      // ✨ prevents the default 70% opacity
            "&.Mui-selected": {
              backgroundColor: "#B7152F",
              color: "white"
            }
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          {NAV_LINKS.map((link, index) => {
            const isOpen = mobileDropdown === link.menuType;

            return (
              <Box
                key={index}
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Tab
                  label={link.label}
                  component="div"
                  onClick={() => {
                    if (link.hasDropdown) {
                      // toggle logic to prevent flicker
                      toggleMobileDropdown(isOpen ? null : link.menuType);
                    } else {
                      setValue(index);
                      handleMobileNavItemClick(link.path);
                    }
                  }}
                  {...a11yProps(index)}
                  sx={{
                    minWidth: '200px',
                    maxWidth: '90%',
                    textAlign: 'center',
                    mx: 'auto',
                    my: 0.5,
                    borderRadius: 1,
                    textTransform: "none",
                    transition: "0.3s",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '40px',
                    backgroundColor: value === index ? "#B7152F" : "transparent",
                    color: 'white', // 🟢 Uniform text color
                    "&:hover": {
                      backgroundColor: "#B7152F",
                      color: "white"
                    }
                  }}
                />

                {link.hasDropdown && (
                  <Collapse in={isOpen}>
                    <Box
                      sx={{
                        backgroundColor: '#333',
                        py: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      {getMobileMenuItems(link.menuType).map((item, idx) => (
                        <Box
                          key={idx}
                          component="div"
                          onClick={() => handleMobileNavItemClick(item.path)}
                          sx={{
                            padding: '8px 32px',
                            color: 'white', // ✨ consistent color
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                            textAlign: 'center',
                            width: 'fit-content',
                            mx: 'auto',
                            '&:hover': {
                              backgroundColor: '#444',
                            }
                          }}
                        >
                          {item.label}
                        </Box>
                      ))}
                    </Box>
                  </Collapse>
                )}
              </Box>
            );
          })}
        </Box>
      </Collapse>

      {/* Breadcrumbs */}
      <Box
        sx={{
          marginTop: {
            xs: "-20px",
            md: "-50px",
          },
        }}
      >
        <Breadcrumbs />
      </Box>
    </Box>
  );
}
