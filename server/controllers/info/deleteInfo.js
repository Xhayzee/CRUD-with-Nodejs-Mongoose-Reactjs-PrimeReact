const { Info } = require("../../models/info");

exports.deleteInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Info.findByIdAndDelete(id);
        res.status(200).json(item).end();
    } catch (error) {
        res.status(400).json({ error: error.message }).end();
    }
}