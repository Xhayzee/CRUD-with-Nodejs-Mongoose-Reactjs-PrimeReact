const express = require('express');
const flash = require("express-flash");
const bodyParser = require('body-parser');
const session = require("express-session");
const path = require('path');
const helmet = require('helmet');
const compress = require('compression');
const cors = require('cors');
const methodOverride = require('method-override');
const cookieParser = require("cookie-parser");
const { NotFound } = require('./errors');

/**
 * Instantiate Express Framwork
 * @public
 */
const app = express();

app.use(flash());

// Mount BodyParser middleware will append body of request to req.body
app.use(bodyParser.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10kb' }));

app.use(
    session({
        secret: "secret",
        resave: true,
        cookie: { httpOnly: true /*, secure: true*/ },
        saveUninitialized: false,
    })
);

// Gzip Compression
app.use(compress());

// Lets you use HTTP verbs such as PUT or DELETE
// In places where the client doesn't support it
app.use(methodOverride());

// Static assets directory setup
app.use(express.static(path.join(__dirname, '../public')));

// Secure apps by setting various HTTP headers
app.use(helmet());

// Enable CORS - Cross Origin Resource Sharing
app.use(cors());

app.use(cookieParser("secret"));

var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // intercept OPTIONS method
    if ("OPTIONS" == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
};

app.use(allowCrossDomain);

app.use("/api", require("../controllers"))

app.use(NotFound)

module.exports = app