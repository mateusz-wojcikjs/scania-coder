import express from "express";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "../controllers/user.controller";

const router = express.Router();

router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.post("/users/:id", updateUser);
router.post("/users", createUser);
router.delete("/users/:id", deleteUser);

export default router;
