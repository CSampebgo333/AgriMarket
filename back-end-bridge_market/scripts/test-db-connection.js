require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function testConnection() {
  try {
    // Read SSL certificate
    const sslCert = fs.readFileSync(path.join(__dirname, '../ssl/agrimarket-ssl-public-cert.cert'));

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      ssl: {
        ca: sslCert,
        rejectUnauthorized: true
      }
    });

    console.log('Successfully connected to the database!');
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT 1');
    console.log('Query test successful:', rows);

    await connection.end();
  } catch (error) {
    console.error('Database connection test failed:', error);
  }
}

testConnection(); 