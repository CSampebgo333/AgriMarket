const mysql = require("mysql2/promise")
const fs = require('fs')
const path = require('path')
require("dotenv").config()

// Read SSL certificate
const sslCert = fs.readFileSync(path.join(__dirname, '../ssl/agrimarket-ssl-public-cert.cert'))

// Create a connection pool with environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "agrimarket",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    ca: sslCert,
    rejectUnauthorized: true
  }
})

// Test the connection on startup but don't exit the process on failure
pool
  .getConnection()
  .then((connection) => {
    console.log("Database connected successfully")
    connection.release()
  })
  .catch((err) => {
    console.error("Database connection error:", err)
    // Don't exit the process, allow the server to start anyway
  })

// Helper functions for database operations
const db = {
  // Execute a query and return all results
  async query(sql, params = []) {
    try {
      const [rows] = await pool.query(sql, params)
      return rows
    } catch (error) {
      console.error("Database query error:", error.message)
      throw error
    }
  },

  // Execute a query and return the first result
  async getOne(sql, params = []) {
    try {
      const [rows] = await pool.query(sql, params)
      return rows[0]
    } catch (error) {
      console.error("Database getOne error:", error.message)
      throw error
    }
  },

  // Insert a record and return the insert ID
  async insert(table, data) {
    try {
      const [result] = await pool.query(`INSERT INTO ${table} SET ?`, data)
      return result.insertId
    } catch (error) {
      console.error("Database insert error:", error.message)
      throw error
    }
  },

  // Update records
  async update(table, data, where) {
    try {
      const [result] = await pool.query(`UPDATE ${table} SET ? WHERE ?`, [data, where])
      return result.affectedRows
    } catch (error) {
      console.error("Database update error:", error.message)
      throw error
    }
  },

  // Delete records
  async remove(table, where) {
    try {
      const [result] = await pool.query(`DELETE FROM ${table} WHERE ?`, where)
      return result.affectedRows
    } catch (error) {
      console.error("Database remove error:", error.message)
      throw error
    }
  },
}

module.exports = db