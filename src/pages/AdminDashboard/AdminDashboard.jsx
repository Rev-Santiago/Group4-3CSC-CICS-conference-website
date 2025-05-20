import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { 
  CircularProgress, 
  Card, 
  CardContent, 
  Typography, 
  Alert,
  useTheme,
  useMediaQuery,
  Box,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Button
} from "@mui/material";
import { Refresh, Person, CalendarToday, Description } from "@mui/icons-material";

// Custom color palette for charts
const COLORS = ["#B7152F", "#ff725c", "#ffa600", "#38a169", "#4299e1", "#805ad5", "#d53f8c"];

// Backend API URL - change this to your actual API URL
const API_URL = import.meta.env.VITE_BACKEND_URL 
  ? `${import.meta.env.VITE_BACKEND_URL}/api/analytics/overview`
  : "http://localhost:5000/api/analytics/overview";

export default function AdminDashboard() {
  // Use Material UI's useMediaQuery hook for consistent responsive behavior
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const navigate = useNavigate();

  // Simulate user authentication check
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Function to fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching analytics data from:", API_URL);
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Received analytics data:", data);
      
      // Validate the data structure
      if (!data.counts || !data.recentActivity || !data.monthlyEvents || 
          !data.categoryDistribution || !data.pageVisits) {
        console.warn("Incomplete data received from API");
        throw new Error("Incomplete data structure from API");
      }
      
      setAnalyticsData(data);
      setUsingMockData(false);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      setError(error.message);
      
      // Fallback to mock data
      console.log("Falling back to mock data");
      setAnalyticsData(getMockAnalyticsData());
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Show loading state
  if (loading && !analyticsData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Extract data after ensuring analyticsData exists
  const { counts, recentActivity, monthlyEvents, categoryDistribution, pageVisits } = analyticsData || {};

  // Format data for charts
  const formattedMonthlyEvents = monthlyEvents?.map(item => ({
    name: formatMonth(item.month),
    events: item.count
  })) || [];

  const formattedCategoryData = categoryDistribution?.map((item, index) => ({
    name: item.category,
    value: item.count,
    color: COLORS[index % COLORS.length]
  })) || [];

  const topPages = pageVisits?.slice(0, 5) || [];

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5 }}>
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Conference performance and metrics at a glance
          </Typography>
        </Box>
        
        {/* Refresh button */}
        <Button 
          onClick={fetchAnalytics}
          disabled={loading}
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Refresh />}
          sx={{ 
            bgcolor: '#B7152F', 
            '&:hover': { bgcolor: '#871122' },
            borderRadius: '6px',
          }}
        >
          {loading ? "Refreshing..." : "Refresh Data"}
        </Button>
      </Box>
      
      {/* Mock data or error alert */}
      {(usingMockData || error) && (
        <Alert 
          severity={error ? "error" : "info"} 
          sx={{ mb: 3 }}
          action={
            <Button 
              onClick={fetchAnalytics} 
              size="small"
              color="inherit"
            >
              Retry
            </Button>
          }
        >
          {error ? (
            <>Error loading data: {error}. Using sample data instead.</>
          ) : (
            <>Using sample data. Could not connect to the analytics API.</>
          )}
        </Alert>
      )}

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard 
            title="Total Users" 
            value={counts?.users || 0} 
            description="Registered admin users"
            icon={<Person />}
            color="#B7152F"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard 
            title="Total Events" 
            value={counts?.events || 0} 
            description="Conference events scheduled"
            icon={<CalendarToday />}
            color="#4299e1"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard 
            title="Publications" 
            value={counts?.publications || 0} 
            description="Published conference papers"
            icon={<Description />}
            color="#38a169"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Monthly Events Chart */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%', boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Monthly Events
              </Typography>
              <Box sx={{ height: isMobile ? '250px' : '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                    data={formattedMonthlyEvents}
                    margin={isMobile ? { top: 5, right: 5, bottom: 5, left: 5 } : { top: 10, right: 30, bottom: 30, left: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                      angle={isMobile ? -45 : 0}
                      textAnchor={isMobile ? "end" : "middle"}
                      height={isMobile ? 60 : 40}
                    />
                    <YAxis 
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                      width={isMobile ? 30 : 40}
                    />
                    <Tooltip />
                    <Area type="monotone" dataKey="events" stroke="#B7152F" fill="#B7152F" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Distribution Chart */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%', boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Event Categories
              </Typography>
              <Box sx={{ 
                height: isMobile ? '250px' : '300px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                <ResponsiveContainer width="100%" height="100%">
                  {isMobile ? (
                    // Mobile view - Simple bar chart
                    <BarChart
                      data={formattedCategoryData}
                      layout="vertical"
                      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        width={80}
                      />
                      <Tooltip />
                      <Bar dataKey="value" nameKey="name">
                        {formattedCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  ) : (
                    // Desktop view - Pie chart with legend
                    <PieChart>
                      <Pie
                        data={formattedCategoryData}
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                        label={renderCustomizedLabel}
                      >
                        {formattedCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend layout="vertical" verticalAlign="middle" align="right" />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Card sx={{ boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Recent Activity
          </Typography>
          {recentActivity?.length > 0 ? (
            <List sx={{ 
              maxHeight: isMobile ? '300px' : '400px', 
              overflow: 'auto',
              p: 0
            }}>
              {recentActivity.map((activity, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <Divider component="li" />}
                  <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                    <ListItemIcon sx={{ minWidth: 44 }}>
                      <Avatar
                        sx={{ 
                          width: 36, 
                          height: 36,
                          bgcolor: getActivityTypeColor(activity.type).bg,
                          color: getActivityTypeColor(activity.type).color
                        }}
                      >
                        {getActivityTypeIcon(activity.type)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.title}
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Chip 
                            label={activity.type} 
                            size="small" 
                            sx={{ 
                              mr: 1,
                              bgcolor: 'grey.100',
                              fontSize: '0.75rem'
                            }} 
                          />
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: '0.75rem' }}
                          >
                            {formatDate(activity.date)}
                          </Typography>
                        </Box>
                      }
                      primaryTypographyProps={{
                        fontWeight: 500,
                        variant: 'body1'
                      }}
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              py: 4,
              color: 'text.secondary'
            }}>
              <Typography>No recent activity found</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

// Helper Components
function MetricCard({ title, value, description, icon, color }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Card sx={{ 
      height: '100%',
      boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0px 4px 8px rgba(0,0,0,0.15)'
      }
    }}>
      <CardContent sx={{ 
        display: 'flex', 
        alignItems: isMobile ? 'center' : 'flex-start',
        justifyContent: 'space-between',
        height: '100%'
      }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {title}
          </Typography>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            sx={{ 
              fontWeight: 'bold', 
              color: color,
              mb: 0.5
            }}
          >
            {value.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
        <Box sx={{ 
          p: 1.5,
          borderRadius: '50%',
          bgcolor: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color
        }}>
          {React.cloneElement(icon, { sx: { fontSize: isMobile ? 24 : 28 } })}
        </Box>
      </CardContent>
    </Card>
  );
}

// Helper Functions
function formatMonth(monthStr) {
  // Handle both "YYYY-MM" format from API and "Month YYYY" format from mock data
  if (monthStr.includes('-')) {
    const [year, month] = monthStr.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
  return monthStr; // Already formatted in mock data
}

function formatDate(dateStr) {
  // Handle ISO date strings from API
  if (dateStr.includes('T') || dateStr.includes('-')) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  return dateStr; // Already formatted in mock data
}

function renderCustomizedLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

function getActivityTypeColor(type) {
  switch (type) {
    case 'User':
      return { bg: '#e6f2ff', color: '#1967d2' };
    case 'Event':
      return { bg: '#e6f4ea', color: '#1e8e3e' };
    case 'Publication':
      return { bg: '#f3e8fd', color: '#6200ee' };
    default:
      return { bg: '#f1f3f4', color: '#5f6368' };
  }
}

function getActivityTypeIcon(type) {
  switch (type) {
    case 'User':
      return <Person fontSize="small" />;
    case 'Event':
      return <CalendarToday fontSize="small" />;
    case 'Publication':
      return <Description fontSize="small" />;
    default:
      return null;
  }
}

// Mock data function for fallback (you'd need to implement this yourself)
function getMockAnalyticsData() {
  // Mock counts
  const counts = {
    users: 24,
    events: 42,
    publications: 15
  };

  // Mock monthly events data (6 months)
  const monthlyEvents = [
    { month: 'Jan 2023', count: 4 },
    { month: 'Feb 2023', count: 6 },
    { month: 'Mar 2023', count: 8 },
    { month: 'Apr 2023', count: 12 },
    { month: 'May 2023', count: 7 },
    { month: 'Jun 2023', count: 5 }
  ];

  // Mock category distribution
  const categoryDistribution = [
    { category: 'Workshop', count: 15 },
    { category: 'Panel', count: 10 },
    { category: 'Keynote', count: 5 },
    { category: 'Paper Presentation', count: 8 },
    { category: 'Networking', count: 4 }
  ];

  // Mock recent activity
  const recentActivity = [
    { type: 'Event', title: 'New AI Workshop Added', date: 'May 15, 2023' },
    { type: 'User', title: 'Dr. Sarah Johnson Created Account', date: 'May 14, 2023' },
    { type: 'Publication', title: 'Machine Learning Advances Paper', date: 'May 12, 2023' },
    { type: 'Event', title: 'Schedule Updated', date: 'May 10, 2023' },
    { type: 'User', title: 'Prof. James Smith Updated Profile', date: 'May 9, 2023' },
    { type: 'Publication', title: 'Data Science Ethics Review', date: 'May 8, 2023' },
    { type: 'Event', title: 'Keynote Session Added', date: 'May 5, 2023' },
    { type: 'User', title: 'Admin Role Assigned to Lisa Chen', date: 'May 3, 2023' }
  ];

  const pageVisits = [
    { page: '/home', visits: 1245 },
    { page: '/schedule', visits: 987 },
    { page: '/speakers', visits: 842 },
    { page: '/registration', visits: 654 },
    { page: '/about', visits: 432 }
  ];

  return {
    counts,
    monthlyEvents,
    categoryDistribution,
    pageVisits,
    recentActivity
  };
}