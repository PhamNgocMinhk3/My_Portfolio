import express from 'express';
import { getCertifications } from '../controllers/certifications.controller.js';
const router = express.Router();
router.get('/', getCertifications);

export default router;
