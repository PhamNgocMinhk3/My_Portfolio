import express from 'express';
import { getEducations } from '../controllers/educations.controller.js';
const router = express.Router();
router.get('/', getEducations);

export default router;
