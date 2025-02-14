import mysql from 'mysql2';

// Create a connection to the database
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',  // default to localhost if no DB_HOST is specified
  user: process.env.DB_USER || 'root',      // default to 'root' if no DB_USER is specified
  password: process.env.DB_PASSWORD || 'Livers831*',  // default to empty string if no DB_PASSWORD is specified
  database: process.env.DB_NAME || 'cics-conference-website',  // default to 'test' if no DB_NAME is specified
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database as ID ' + db.threadId);
});

// Export the database connection
export default db;
