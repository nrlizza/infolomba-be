export const response = {
  success(res, data = null, message = "Success", pagination = null, code = 200) {
    const body = {
      success: true,
      message,
      data,
    };

    if (pagination) {
      body.pagination = pagination;
    }

    return res.status(code).json(body);
  },

  created(res, data = null, message = "Created") {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  },

  notFound(res, message = "Resource not found") {
    return res.status(404).json({
      success: false,
      message,
      data: null,
    });
  },

  noContent(res, message = "No content") {
    return res.status(204).json({
      success: true,
      message,
      data: null,
    });
  },

  badRequest(res, message = "Bad request", code = 400) {
    return res.status(code).json({
      success: false,
      message,
      data: null,
    });
  },

  serverError(res, message = "Internal server error", error = null) {
    console.error("[ServerError]", error); // optional log
    return res.status(500).json({
      success: false,
      message,
      data: null,
      error: error?.message || null,
    });
  },
};
