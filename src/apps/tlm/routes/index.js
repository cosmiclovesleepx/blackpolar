/**
 * src/apps/tlm/routes/index.js
 */

import { Router } from 'express';
import { env }    from '../../../shared/config/env.js';

const router = Router();

router.get('/', (req, res) => {
  res.render('index', { appName: env.appName });
});

router.get('/api/v1', (req, res) => {
  res.json({ status: 'success', message: 'TLM API v1', version: '1.0.0' });
});

export default router;
