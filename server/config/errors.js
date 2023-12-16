const APIError = require("../utils/APIError");
const { env } = require("./env-vars");

/**
 * Error Handler Sends Stack Trace only during Development Environment
 * @param {Error} err
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 */
const Handler = (err, req, res, next) => {
    const response = {
        code: err.status,
        message: err.message,
        errors: err.errors,
        stack: err.stack,
    };
    if (env === 'production') delete response.stack;
    res.status(response.code).json(response);
    res.end();
};

exports.ErrorHandler = Handler;
exports.Handler = Handler;

/**
 * Catch 404 and forward to error handler
 * @public
 */
exports.NotFound = (req, res, next) => {
    const err = new APIError({
        message: 'Resource Not Found',
        status: 404,
    });
    return Handler(err, req, res, next);
};