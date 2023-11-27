import Router from "express";
import { login, register, getAllPassengers } from "../controllers/authController.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/passengers", getAllPassengers);

export default router;
