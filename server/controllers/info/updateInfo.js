const { Info } = require("../../models/info");

exports.updateInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const info = await Info.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(info).end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}