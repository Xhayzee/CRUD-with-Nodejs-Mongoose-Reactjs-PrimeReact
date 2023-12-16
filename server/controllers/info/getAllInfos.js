const { Info } = require("../../models/info");
const logger = require("../../config/logger")

exports.getAllInfos = async (req, res) => {
    try {
        const page = parseInt(req.body.page);
        const limit = parseInt(req.body.limit); // Set your preferred limit
        const search = req.body.search;

        // Ensure that page and limit are valid numbers
        if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
            throw new Error("Invalid page or limit value.");
        }

        // Calculate the starting index and ending index for the query
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        // Build the query
        const query = {};

        // If a search term is provided, add conditions for searching
        if (search) {
            // Customize the search conditions based on your model's structure
            query.$or = [
                { manufacturer: { $regex: new RegExp(search, 'i') } },  // Case-insensitive search on field1
                { model: { $regex: new RegExp(search, 'i') } },  // Case-insensitive search on field2
                { carrier: { $regex: new RegExp(search, 'i') } },  // Case-insensitive search on field1
                { grade: { $regex: new RegExp(search, 'i') } },  // Case-insensitive search on field2
                { memory: { $regex: new RegExp(search, 'i') } },  // Case-insensitive search on field1
                { color: { $regex: new RegExp(search, 'i') } },  // Case-insensitive search on field2
                { reportFile: { $regex: new RegExp(search, 'i') } },  // Case-insensitive search on field1
            ];
        }

        // Get the total number of documents in the collection
        const totalDocuments = await Info.countDocuments(query);

        const results = await Info.find(query).limit(limit).skip(startIndex).exec();

        // Create a response object containing the paginated results and metadata
        const pagination = {
            currentPage: page,
            totalPages: Math.ceil(totalDocuments / limit),
            pageSize: limit,
            totalItems: totalDocuments,
            hasNextPage: endIndex < totalDocuments,
            hasPreviousPage: startIndex > 0,
        };

        res.status(200).json({
            pagination,
            results
        }).end();
    } catch (error) {
        res.status(500).json({ error: error.message }).end();
    }
}
