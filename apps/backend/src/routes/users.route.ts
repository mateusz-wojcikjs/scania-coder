import express from "express";
import { createUser, deactivateUser, deleteUser, getInvitationStatus, getUser, getUsers, resendInvitation, toggleUserActiveStatus, updateUser } from "../controllers/user.controller";

const router = express.Router();

router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.get("/users/invitation-status", getInvitationStatus);
router.patch("/users/:id", updateUser);
router.post("/users", createUser);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/toggle-active", toggleUserActiveStatus);
router.patch("/users/:id/deactivate", deactivateUser);
router.post("/users/resend-invitation", resendInvitation);

export default router;
