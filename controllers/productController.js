const { Product } = require('../models');

exports.getProducts = async (req, res) => {
    try {
        // Find all products in the database
        const products = await Product.findAll();
        
        res.json({
            message: "Products retrieved successfully",
            data: products
        });
    } catch (error) {
        console.error("Get Products Error:", error);
        res.status(500).json({ error: "Failed to retrieve products" });
    }
};

exports.getProductById = async (req, res) => {
    try {
        // Get ID from URL parameter (using the standard we agreed on)
        const { id } = req.params; 
        
        // Find product by primary key (ID)
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({
            message: "Product retrieved successfully",
            data: product
        });
    } catch (error) {
        console.error("Get Product By ID Error:", error);
        res.status(500).json({ error: "Failed to retrieve product" });
    }
};

exports.createProduct = async (req, res) => {
    try {
        // 1. Get text data from the request body
        const { name, price, stock, description } = req.body;

        // 2. Get the image filename (Multer puts the file info in req.file)
        // We use a ternary operator (?) to handle cases where no image is uploaded
        const imageFilename = req.file ? req.file.filename : null;

        // 3. Create the new product in the database
        const newProduct = await Product.create({
            name: name,
            price: price,
            stock: stock,
            description: description,
            image: imageFilename
            
        });

        res.status(201).json({
            message: "Product created successfully",
            data: newProduct
        });

    } catch (error) {
        console.error("Create Product Error:", error);
        res.status(500).json({ error: "Failed to create product" });
    }
};