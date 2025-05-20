import express from 'express';
import db from '../db.js'; // Adjust path as needed to your db connection

const router = express.Router();

// Get overview analytics data
router.get('/overview', async (req, res) => {
  try {
    // Total counts
    const [totalUsers] = await db.query('SELECT COUNT(*) as count FROM users');
    const [totalEvents] = await db.query('SELECT COUNT(*) as count FROM events');
    const [totalPublications] = await db.query('SELECT COUNT(*) as count FROM conference_publications');
    
    // Activity - recent changes in the last 7 days
    const [recentActivity] = await db.query(`
      SELECT 
        'User' as type, 
        email as title, 
        created_at as date 
      FROM users 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      UNION
      SELECT 
        'Event' as type, 
        program as title, 
        event_date as date 
      FROM events 
      WHERE event_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      UNION
      SELECT 
        'Publication' as type, 
        publication_description as title, 
        publication_date as date 
      FROM conference_publications
      WHERE publication_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      ORDER BY date DESC
      LIMIT 10
    `);
    
    // Monthly event counts for the last 6 months
    const [monthlyEvents] = await db.query(`
      SELECT 
        DATE_FORMAT(event_date, '%Y-%m') as month,
        COUNT(*) as count
      FROM events
      WHERE event_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(event_date, '%Y-%m')
      ORDER BY month
    `);
    
    // Category distribution
    const [categoryDistribution] = await db.query(`
      SELECT 
        category,
        COUNT(*) as count
      FROM events
      WHERE category IS NOT NULL AND category != ''
      GROUP BY category
      ORDER BY count DESC
    `);
    
    // Page visit simulation (since you may not have actual visit data)
    // In a real application, you would replace this with actual analytics data
    const pageVisits = generateMockPageVisits();
    
    res.json({
      counts: {
        users: totalUsers[0]?.count || 0,
        events: totalEvents[0]?.count || 0,
        publications: totalPublications[0]?.count || 0
      },
      recentActivity,
      monthlyEvents,
      categoryDistribution,
      pageVisits
    });
    
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

// Get detailed user analytics
router.get('/users', async (req, res) => {
  try {
    // Get user growth over time
    const [userGrowth] = await db.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count
      FROM users
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month
    `);
    
    // Get user roles distribution
    const [userRoles] = await db.query(`
      SELECT 
        account_type,
        COUNT(*) as count
      FROM users
      GROUP BY account_type
    `);
    
    // Get most active users (for admin activity)
    // In a real app, you'd track admin actions in a separate table
    // This is a placeholder
    const [activeUsers] = await db.query(`
      SELECT 
        id,
        email,
        last_login_at
      FROM users
      ORDER BY last_login_at DESC
      LIMIT 5
    `);
    
    res.json({
      userGrowth,
      userRoles,
      activeUsers
    });
    
  } catch (error) {
    console.error('User analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch user analytics' });
  }
});

// Get detailed event analytics
router.get('/events', async (req, res) => {
  try {
    // Get upcoming vs past events count
    const [eventCounts] = await db.query(`
      SELECT
        SUM(CASE WHEN event_date >= CURDATE() THEN 1 ELSE 0 END) as upcoming,
        SUM(CASE WHEN event_date < CURDATE() THEN 1 ELSE 0 END) as past
      FROM events
    `);
    
    // Get events by venue
    const [eventsByVenue] = await db.query(`
      SELECT
        venue,
        COUNT(*) as count
      FROM events
      WHERE venue IS NOT NULL AND venue != ''
      GROUP BY venue
      ORDER BY count DESC
    `);
    
    // Get events by weekday
    const [eventsByWeekday] = await db.query(`
      SELECT
        WEEKDAY(event_date) + 1 as day_of_week,
        COUNT(*) as count
      FROM events
      GROUP BY WEEKDAY(event_date)
      ORDER BY day_of_week
    `);
    
    // Map day numbers to day names
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const eventsByDay = eventsByWeekday.map(item => ({
      name: dayNames[item.day_of_week - 1],
      count: item.count
    }));
    
    res.json({
      eventCounts: eventCounts[0] || { upcoming: 0, past: 0 },
      eventsByVenue,
      eventsByDay
    });
    
  } catch (error) {
    console.error('Event analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch event analytics' });
  }
});

// Helper function to generate mock page visit data
// In a real application, replace this with actual analytics data
function generateMockPageVisits() {
  const pages = [
    'Home', 
    'Call For Papers', 
    'Contacts', 
    'Partners', 
    'Committee', 
    'Event History', 
    'Registration & Fees', 
    'Publication', 
    'Schedule', 
    'Venue', 
    'Keynote Speakers', 
    'Invited Speakers'
  ];
  
  return pages.map(page => ({
    name: page,
    visits: Math.floor(Math.random() * 1000) + 100, // Random number between 100-1100
    uniqueVisitors: Math.floor(Math.random() * 800) + 50, // Random number between 50-850
  })).sort((a, b) => b.visits - a.visits); // Sort by most visits
}

export default router;