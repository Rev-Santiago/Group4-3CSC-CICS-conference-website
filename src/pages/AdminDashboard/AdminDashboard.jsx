import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { CircularProgress, Card, CardContent, Typography, Alert } from "@mui/material";

// Custom color palette for charts
const COLORS = ["#d41c1c", "#ff725c", "#ffa600", "#38a169", "#4299e1", "#805ad5", "#d53f8c"];

// Backend API URL - change this to your actual API URL
const API_URL = import.meta.env.VITE_BACKEND_URL 
  ? `${import.meta.env.VITE_BACKEND_URL}/api/analytics/overview`
  : "http://localhost:5000/api/analytics/overview";

export default function AdminDashboard() {
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
      <div className="flex justify-center items-center h-96">
        <CircularProgress size={60} />
      </div>
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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Conference performance and metrics at a glance</p>
        </div>
        
        {/* Refresh button */}
        <button 
          onClick={fetchAnalytics}
          disabled={loading}
          className="px-4 py-2 bg-customRed text-white rounded-md flex items-center gap-2 hover:bg-red-700 transition-colors"
        >
          {loading ? (
            <>
              <CircularProgress size={16} color="inherit" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshIcon />
              Refresh Data
            </>
          )}
        </button>
      </div>
      
      {/* Mock data or error alert */}
      {(usingMockData || error) && (
        <Alert 
          severity={error ? "error" : "info"} 
          className="mb-4"
          action={
            <button 
              onClick={fetchAnalytics} 
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Retry
            </button>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard 
          title="Total Users" 
          value={counts?.users || 0} 
          description="Registered admin users"
          icon={<UserIcon />}
          color="#d41c1c"
        />
        <MetricCard 
          title="Total Events" 
          value={counts?.events || 0} 
          description="Conference events scheduled"
          icon={<CalendarIcon />}
          color="#4299e1"
        />
        <MetricCard 
          title="Publications" 
          value={counts?.publications || 0} 
          description="Published conference papers"
          icon={<DocumentIcon />}
          color="#38a169"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Events Chart */}
        <Card className="shadow-md">
          <CardContent>
            <Typography variant="h6" className="mb-4">Monthly Events</Typography>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedMonthlyEvents}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="events" stroke="#d41c1c" fill="#d41c1c" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution Chart */}
        <Card className="shadow-md">
          <CardContent>
            <Typography variant="h6" className="mb-4">Event Categories</Typography>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
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
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Page Visits and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Feed */}
        <Card className="shadow-md">
          <CardContent>
            <Typography variant="h6" className="mb-4">Recent Activity</Typography>
            <div className="overflow-y-auto max-h-80">
              {recentActivity?.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {recentActivity.map((activity, index) => (
                    <li key={index} className="py-3">
                      <div className="flex items-start">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getActivityTypeColor(activity.type)}`}>
                          {getActivityTypeIcon(activity.type)}
                        </div>
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="bg-gray-100 rounded px-2 py-0.5 mr-2">{activity.type}</span>
                            <span>{formatDate(activity.date)}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6 text-gray-500">No recent activity found</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper Components
function MetricCard({ title, value, description, icon, color }) {
  return (
    <Card className="shadow-md transition-all hover:shadow-lg">
      <CardContent>
        <div className="flex items-start justify-between">
          <div>
            <Typography variant="h6" className="font-bold">{title}</Typography>
            <Typography variant="h3" className="mt-2 font-bold" style={{ color }}>
              {value.toLocaleString()}
            </Typography>
            <Typography variant="body2" className="mt-1 text-gray-600">
              {description}
            </Typography>
          </div>
          <div 
            className="p-3 rounded-full" 
            style={{ backgroundColor: `${color}20` }}
          >
            {icon}
          </div>
        </div>
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
      return 'bg-blue-100 text-blue-600';
    case 'Event':
      return 'bg-green-100 text-green-600';
    case 'Publication':
      return 'bg-purple-100 text-purple-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

function getActivityTypeIcon(type) {
  switch (type) {
    case 'User':
      return <UserIcon className="w-4 h-4" />;
    case 'Event':
      return <CalendarIcon className="w-4 h-4" />;
    case 'Publication':
      return <DocumentIcon className="w-4 h-4" />;
    default:
      return null;
  }
}

// Mock Data Function (used as fallback)
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

  return {
    counts,
    monthlyEvents,
    categoryDistribution,
    pageVisits,
    recentActivity
  };
}

// Icon Components
function UserIcon({ className = "h-6 w-6" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function CalendarIcon({ className = "h-6 w-6" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function DocumentIcon({ className = "h-6 w-6" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}