import express from 'express';

import { getWebContent, updateContent } from '../Controllers/webController.js';
const router = express.Router();
router.get('/', getWebContent);
router.put('/:id', updateContent);

export default router;
