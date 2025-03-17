// Import the mysql2 library
const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',    // Your MySQL server host
  user: 'root',         // Your MySQL username
  password: 'Dh@run_2**5',  // Your MySQL password
  database: 'plc'  // Name of the database you want to connect to
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

// Export connection to use in other files (like controllers)
module.exports = connection;
