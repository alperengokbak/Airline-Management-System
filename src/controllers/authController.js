// Import the sql package and the connection string.
import sql from "msnodesqlv8";

// Import the jsonwebtoken package and the bcrypt package.
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Import the dotenv package and call the config() method to load the environment variables from the .env file.
import dotenv from "dotenv";
dotenv.config();

// Import the connection string.
import { connectionString } from "../db/dbConfig.js";

export const login = (req, res) => {
  // Execute a SQL query to select all records from the Passenger table.
  sql.query(connectionString, "SELECT * FROM Passenger", (error, results) => {
    if (error) throw error;

    const user = results.find((user) => user.Username === req.body.username);

    if (user === undefined) {
      return res.status(400).json({ error: "User not found" });
    }

    // Compare the provided password with the hashed password stored in the database.
    bcrypt.compare(req.body.password, user.Password, (err, result) => {
      if (err) throw err;

      // If the password is correct, generate an access token using JWT.
      if (result) {
        const accessToken = jwt.sign({ username: user.Username }, process.env.SECRET_KEY, {
          expiresIn: "30d",
        });

        // Return a success response with user details and the access token.
        return res.status(200).json({
          status: "Success",
          passenger: {
            passengerId: user.PassengerId,
            username: user.Username,
            fullName: user.FullName,
          },
          accessToken: accessToken,
        });
      } else {
        return res.status(400).json({ error: "Incorrect password" });
      }
    });
  });
};

export const register = async (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) throw err;

    const query = `INSERT INTO Passenger (Username, Password, FullName) VALUES ('${req.body.username}', '${hash}', '${req.body.fullName}')`;

    sql.query(connectionString, query, (error, results) => {
      if (error) throw error;

      return res.status(200).json({ status: "Success" });
    });
  });
};

export const getAllPassengers = async (req, res) => {
  const query = `SELECT * FROM Passenger`;

  sql.query(connectionString, query, (error, results) => {
    if (error) throw error;

    return res.status(200).json(results);
  });
};
