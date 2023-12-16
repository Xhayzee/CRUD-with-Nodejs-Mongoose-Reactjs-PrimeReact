const router = require("express").Router();

router.use("/info", require("./info"))

module.exports = router;