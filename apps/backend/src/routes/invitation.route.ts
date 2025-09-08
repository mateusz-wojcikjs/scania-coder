import express from "express";
import { setupPassword } from "../controllers/invitation.controller";

const router = express.Router();

router.post("/invitation/setup-password", setupPassword);

export default router;
