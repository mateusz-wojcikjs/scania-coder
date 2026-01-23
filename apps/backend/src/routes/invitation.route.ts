import express from "express";
import { cancelInvitation, resendInvitation, setupPassword } from "../controllers/invitation.controller";

const router = express.Router();

router.post("/invitation/setup-password", setupPassword);
router.patch("/invitation/:id/cancel", cancelInvitation);
router.post("/invitation/:id/resend", resendInvitation);

export default router;
