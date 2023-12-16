const middleware = (req, res, next) => {
    // Do something with the request, response, or pass control to the next middleware

    console.log('Middleware function is called.');
    next(); // Pass control to the next middleware
}

module.exports = {
    middleware
}