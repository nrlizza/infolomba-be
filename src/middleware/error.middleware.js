import logger from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
   // Tangani error dari Multer
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      status: 'error',
      message: 'File too large. Maximum size allowed is 1MB.',
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }

  if (err.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid file type. Only JPEG, JPG, PNG, HEIC and WEBP are allowed.',
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }

  logger.error(`🔥 Error: ${err.message}`, {
    path: req.originalUrl,
    method: req.method,
    query: req.query,
    body: req.body,
    stack: err.stack,
  });

  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
}

// middlewares/zodErrorHandler.js
export function zodErrorHandler(err, req, res, next) {
  // Cek apakah error dari Zod
  if (err?.name === 'ZodError') {
    const flattened = err.flatten();

    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: flattened.fieldErrors,
    });
  }

  // Lanjut ke error handler lain kalau bukan Zod
  next(err);
}
