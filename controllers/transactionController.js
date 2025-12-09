const { Transaction, TransactionItem, Product } = require('../models');

exports.getHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // 1. Get query parameters for pagination (default: page 1, limit 10)
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10;
        
        // 2. Calculate Offset
        const offset = (page - 1) * limit;

        // 3. Retrieve data with Pagination
        // We use findAndCountAll to get the total data count (for frontend)
        const { count, rows } = await Transaction.findAndCountAll({
            where: { userId: userId },
            include: [
                {
                    model: TransactionItem,
                    include: [{ model: Product }] // Nested include to see product details
                }
            ],
            limit: limit,   // Fetch X items
            offset: offset, // Skip Y items
            order: [['createdAt', 'DESC']], // Sort by newest
            distinct: true // Important to ensure accurate count when using include
        });

        // 4. Calculate total pages
        const totalPages = Math.ceil(count / limit);

        res.json({
            message: "Order history retrieved successfully",
            data: rows,
            pagination: {
                totalItems: count,
                currentPage: page,
                totalPages: totalPages,
                itemsPerPage: limit
            }
        });

    } catch (error) {
        console.error("Get History Error:", error);
        res.status(500).json({ error: "Failed to retrieve order history" });
    }
};