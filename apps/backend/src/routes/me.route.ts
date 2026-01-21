import express from "express";
import { deactivateAccount } from "../controllers/user.controller";

const router = express.Router();

router.patch("/me/deactivate", deactivateAccount);

export default router;
