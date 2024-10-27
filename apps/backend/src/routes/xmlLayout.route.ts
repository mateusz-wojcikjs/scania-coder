import express from "express";
import { createLayout, deleteLayout, getLayoutById, getLayouts } from "../controllers/xmlLayout.controller";

const router = express.Router();

router.get('/layouts/:id', getLayoutById);
router.get('/layouts', getLayouts);
router.delete('/layouts/:id', deleteLayout);
router.post('/layouts', express.json(), createLayout);

export default router;
