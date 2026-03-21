/**
 * src/apps/tlm/app.js
 * Black Polar — TLM Application (tlm.blackpolar.io)
 */

import express     from 'express';
import helmet      from 'helmet';
import compression from 'compression';
import rateLimit   from 'express-rate-limit';
import path        from 'path';
import { fileURLToPath } from 'url';

import { setupLogging }  from '../../shared/middlewares/logging.js';
import { setupCORS }     from '../../shared/middlewares/cors.js';
import { requestId }     from '../../shared/middlewares/requestId.js';
import { sanitizeInput } from '../../shared/middlewares/sanitize.js';
import { notFound }      from '../../shared/middlewares/notFound.js';
import { errorHandler }  from '../../shared/middlewares/errorHandler.js';
import { env }           from '../../shared/config/env.js';

import tlmRoutes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: env.isDev ? false : undefined }));
app.use(requestId);
setupCORS(app, { origin: env.cors.origins, credentials: true });

app.use(rateLimit({
  windowMs: env.rateLimit.windowMs,
  max:      env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, error: { message: 'Demasiadas peticiones.', statusCode: 429 } },
}));

app.use(compression());
setupLogging(app);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(sanitizeInput);

app.use('/styles', express.static(path.join(__dirname, '../../shared/styles'), {
  maxAge: env.isProd ? '1d' : 0, dotfiles: 'deny', index: false,
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/public', express.static(path.join(__dirname, 'public'), {
  maxAge: env.isProd ? '1d' : 0, dotfiles: 'deny', index: false,
}));

app.get('/health', (req, res) => {
  res.json({ status: 'success', app: 'tlm', env: env.env, uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.use('/', tlmRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
