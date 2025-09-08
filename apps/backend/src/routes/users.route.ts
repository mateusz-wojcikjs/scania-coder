import express from "express";
import { createUser, deleteUser, getInvitationStatus, getUser, getUsers, resendInvitation, toggleUserActiveStatus, updateUser } from "../controllers/user.controller";

const router = express.Router();

router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.get("/users/invitation-status", getInvitationStatus);
router.post("/users/:id", updateUser);
router.post("/users", createUser);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/toggle-active", toggleUserActiveStatus);
router.post("/users/resend-invitation", resendInvitation);

export default router;
