// Import the sql package and the connection string.
import sql from "msnodesqlv8";

// Import the connection string.
import { connectionString } from "../db/dbConfig.js";

export const displayAllFlights = async (req, res) => {
  const query = `SELECT * FROM  Flights ORDER BY Date`;

  sql.query(connectionString, query, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.status(200).json(results);
  });
};

export const displayTicket = async (req, res) => {
  const { date, fromLocation, toLocation, numberOfPeople } = req.body;

  if (numberOfPeople < 1) return res.status(400).json({ error: "Number of people must be greater than 0" });

  const query = `SELECT FlightId, Date, FlightNumber, Price, AvailableSeats FROM  Flights WHERE Date = ? AND FromLocation = ? AND ToLocation = ? AND AvailableSeats >= ? ORDER BY Date OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY`;

  sql.query(connectionString, query, [date, fromLocation, toLocation, numberOfPeople], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    console.log(results);
    return res.status(200).json(results);
  });
};

export const buyTicket = async (req, res) => {
  const { date, fromLocation, toLocation, fullName } = req.body;

  // Get PassengerId
  const takePassengerId = await new Promise((resolve, reject) => {
    sql.query(
      connectionString,
      "SELECT PassengerId FROM Passenger WHERE FullName = ?",
      [fullName],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          const passengerId = results.length > 0 ? parseInt(results[0].PassengerId, 10) : null;
          resolve(passengerId);
        }
      }
    );
  });

  // Get FlightId
  const takeFlightId = await new Promise((resolve, reject) => {
    sql.query(
      connectionString,
      "SELECT FlightId FROM Flights WHERE Date = ? AND FromLocation = ? AND ToLocation = ?",
      [date, fromLocation, toLocation],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          const flightId = results.length > 0 ? parseInt(results[0].FlightId, 10) : null;
          resolve(flightId);
        }
      }
    );
  });

  try {
    const flightId = await takeFlightId;
    const passengerId = await takePassengerId;

    sql.query(
      connectionString,
      "SELECT AvailableSeats FROM Flights WHERE FlightId = ?",
      [flightId],
      (error, results) => {
        if (error) {
          console.error(error);
          console.log("4");
          return res.status(500).json({ error: "Internal Server Error" });
        }
        if (results[0].AvailableSeats > 0) {
          sql.query(
            connectionString,
            "INSERT INTO Tickets (FlightId, PassengerId) VALUES (?, ?)",
            [flightId, passengerId],
            (error, results) => {
              if (error) {
                console.error(error);

                if (error.message.includes("duplicate key")) {
                  return res.status(409).json({ error: "You already bought the ticket in advance!" });
                }
                console.log("3");
                return res.status(500).json({ error: "Internal Server Error" });
              }

              sql.query(
                connectionString,
                "UPDATE Flights SET AvailableSeats = AvailableSeats - 1 WHERE FlightId = ?",
                [flightId],
                (updateError, updateResults) => {
                  if (updateError) {
                    console.error(updateError);
                    console.log("2");
                    return res.status(500).json({ error: "Internal Server Error" });
                  }
                  return res.status(200).json({ status: "Success" });
                }
              );
            }
          );
        } else {
          return res.status(400).json({ error: "No seats available" });
        }
      }
    );
  } catch (error) {
    console.error(error);
    console.log("1");
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const cancelTicket = async (req, res) => {
  const { flightNumber, passengerId } = req.body;

  const getFlightId = await new Promise((resolve, reject) => {
    sql.query(
      connectionString,
      "SELECT FlightId FROM Flights WHERE FlightNumber = ?",
      [flightNumber],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          const flightId = results.length > 0 ? parseInt(results[0].FlightId, 10) : null;
          resolve(flightId);
        }
      }
    );
  });

  const getTicketId = await new Promise((resolve, reject) => {
    sql.query(
      connectionString,
      "SELECT TicketId FROM Tickets WHERE FlightId = ? AND PassengerId = ?",
      [getFlightId, passengerId],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          const ticketInfo = results.length > 0 ? results[0] : null;
          resolve(ticketInfo);
        }
      }
    );
  });

  if (!getTicketId) {
    return res.status(404).json({ error: "Ticket not found." });
  } else {
    const { TicketId } = getTicketId;

    sql.query(connectionString, "DELETE FROM Tickets WHERE TicketId = ?", [TicketId], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      sql.query(
        connectionString,
        "UPDATE Flights SET AvailableSeats = AvailableSeats + 1 WHERE FlightId = ?",
        [getFlightId],
        (updateError, updateResults) => {
          if (updateError) {
            console.error(updateError);
            return res.status(500).json({ error: "Internal Server Error" });
          }
          return res.status(200).json({ status: "Success" });
        }
      );
    });
  }
};
