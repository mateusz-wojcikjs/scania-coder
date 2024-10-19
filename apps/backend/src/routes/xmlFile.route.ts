import express from "express";
import multer from "multer";
import { editXml, getXmlMetadata } from "../controllers/xmlFile.controller";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post("/upload-xml", upload.single("file"), getXmlMetadata);

router.post("/edit-xml", upload.single("file"), editXml);

export default router;
