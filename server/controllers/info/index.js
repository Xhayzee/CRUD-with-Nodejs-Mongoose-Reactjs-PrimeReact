const { upload } = require("../../config/multer");
const { middleware } = require("../../middleware");
const { createInfo } = require("./createInfo");
const { deleteInfo } = require("./deleteInfo");
const { getAllInfos } = require("./getAllInfos");
const { updateInfo } = require("./updateInfo");
const router = require("express").Router();

router.post("/all", middleware, getAllInfos)
router.post("/create", middleware, upload.single('file'), createInfo)
router.delete("/delete/:id", middleware, deleteInfo)
router.put("/update/:id", middleware, updateInfo)

module.exports = router;