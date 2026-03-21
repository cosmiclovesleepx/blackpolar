/**
 * shared/utils/response.js
 * Helpers para respuestas JSON consistentes en toda la API.
 *
 * Uso en un route handler:
 *   import { ok, created, fail } from '../../shared/utils/response.js';
 *   ok(res, { user });
 *   created(res, { user });
 *   fail(res, 'No encontrado', 404);
 */

export const ok = (res, data = {}, message = 'OK') =>
  res.status(200).json({ success: true, message, data });

export const created = (res, data = {}, message = 'Recurso creado') =>
  res.status(201).json({ success: true, message, data });

export const noContent = (res) =>
  res.status(204).send();

export const fail = (res, message = 'Error', statusCode = 400, extra = {}) =>
  res.status(statusCode).json({ success: false, error: { message, statusCode, ...extra } });

export const paginate = (res, { data, total, page, limit }) =>
  res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page:       Number(page),
      limit:      Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  });
