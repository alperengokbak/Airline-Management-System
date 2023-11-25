import Router from "express";

import jwt from "jsonwebtoken";

// Import the displayTicket and buyTicket functions from the ticketController.js file.
import { displayTicket, buyTicket, cancelTicket } from "../controllers/ticketController.js";

// Import the dotenv
import dotenv from "dotenv";
dotenv.config();

const router = Router();

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = user;
    next();
  });
};

router.get("/", displayTicket);
router.post("/buyticket", verifyToken, buyTicket);
router.delete("/cancelticket", verifyToken, cancelTicket);

export default router;
