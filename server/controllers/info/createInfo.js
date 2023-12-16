const { Info } = require("../../models/info");

exports.createInfo = async (req, res) => {
    try {
        const info = new Info({
            ...req.body,
            reportFile: req.file.originalname
        });
        const saved = await info.save();
        res.status(200).json(saved).end();
    } catch (error) {
        res.status(400).json({ error: error.message }).end();
    }
}