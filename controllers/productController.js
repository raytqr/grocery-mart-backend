const { Product, ProductImage } = require('../models');

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
        const { name, price, stock, description } = req.body;

        // 1. Buat Produk (Data teks)
        const newProduct = await Product.create({
            name, price, stock, description
        });

        // 2. Simpan Gambar ke tabel ProductImages (jika ada)
        if (req.files && req.files.length > 0) {
            const imageEntries = req.files.map(file => ({
                productId: newProduct.id,
                imageUrl: file.filename
            }));
            
            await ProductImage.bulkCreate(imageEntries);
        }

        // 3. (BARU) Ambil ulang data produk LENGKAP dengan gambarnya
        const fullProduct = await Product.findByPk(newProduct.id, {
            include: [{ model: ProductImage, as: 'images' }] 
        });

        res.status(201).json({
            message: "Product and images created successfully",
            data: fullProduct // Kita kirim data yang sudah lengkap
        });

    } catch (error) {
        console.error("Create Product Error:", error);
        res.status(500).json({ error: "Failed to create product" });
    }
};