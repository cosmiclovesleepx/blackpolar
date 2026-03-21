/**
 * shared/middlewares/sanitize.js
 * Limpia caracteres peligrosos de req.body, req.query y req.params
 * para reducir la superficie de inyección XSS / NoSQL.
 *
 * Uso: app.use(sanitizeInput);
 */

const clean = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === 'string') {
      obj[key] = value.replace(/[<>$]/g, '').trim();
    } else if (typeof value === 'object') {
      obj[key] = clean(value);
    }
  }

  return obj;
};

export const sanitizeInput = (req, res, next) => {
  if (req.body) clean(req.body);    
  if (req.query) clean(req.query);   
  if (req.params) clean(req.params); 
  next();
};