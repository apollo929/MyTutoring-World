module.exports = {
  serverError(data) {
    return {
      code: 500,
      httpCode: 500,
      error: true,
      message: 'ERR_SERVER_ERROR',
      data: data || null
    };
  },
  validationError(data) {
    return {
      code: 422,
      httpCode: 400,
      error: true,
      message: 'ERR_VALIDATE_ERROR',
      data: data || null
    };
  },
  forbidden(data) {
    return {
      code: 403,
      httpCode: 403,
      error: true,
      message: 'ERR_FORBIDDEN',
      data: data || null
    };
  },
  unauthenticated(data) {
    return {
      code: 401,
      httpCode: 401,
      error: true,
      message: 'ERR_UNAUTHENTICATED',
      data: data || null
    };
  },
  notFound(data) {
    return {
      code: 404,
      httpCode: 404,
      error: true,
      message: 'ERR_ITEM_NOT_FOUND',
      data: data || null
    };
  },
  fetchSuccess(data) {
    return {
      code: 200,
      error: false,
      message: 'FETCH_SUCCESS',
      data
    };
  },
  createSuccess(data) {
    return {
      code: 200,
      error: false,
      message: 'CREATE_SUCCESS',
      data
    };
  },
  updateSuccess(data) {
    return {
      code: 200,
      error: false,
      message: 'UPDATE_SUCCESS',
      data
    };
  },
  deleteSuccess(data) {
    return {
      code: 200,
      error: false,
      message: 'DELETE_SUCCESS',
      data
    };
  },
  success(data = null, message = '', code = 200, httpCode = 200) {
    return {
      code,
      httpCode,
      error: false,
      message,
      data
    };
  },
  error(data = null, message = '', code = 400, httpCode = 400) {
    return {
      code,
      httpCode,
      error: true,
      message,
      data
    };
  }
};
