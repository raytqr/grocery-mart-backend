const { sequelize, CartItem, Product, Transaction, TransactionItem } = require('../models');


exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { productId, quantity } = req.body;

    // 1. Check if the product exists in database (safety check)
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // --- FIX: Implement Upsert Logic ---

    // 2. Check if the item already exists in the cart for this user
    let cartItem = await CartItem.findOne({
        where: { userId: userId, productId: productId }
    });

    if (cartItem) {
        // Item exists: Update the quantity
        cartItem.quantity += quantity;
        await cartItem.save();

        return res.status(200).json({ // Use 200 or 202 for updates
            message: "Item quantity updated successfully!",
            data: cartItem
        });
    } else {
        // Item does not exist: Create a new row
        cartItem = await CartItem.create({
            userId: userId,
            productId: productId,
            quantity: quantity
        });

        return res.status(201).json({ // Use 201 for creation
            message: "Item added to cart successfully!",
            data: cartItem
        });
    }

  } catch (error) {
    console.error("Cart Error:", error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};

exports.getCart = async (req, res) => {
  try {
    // Get all cart items for the logged-in user
    const cartItems = await CartItem.findAll({
      where: { userId: req.user.id }, 
      include: [
        {
          model: Product, 
          attributes: ['name', 'price', 'description'] 
        }
      ]
    });

    res.json({
      message: "Cart retrieved successfully",
      data: cartItems
    });

  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ error: "Failed to retrieve cart" });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 1. Get ID from URL parameter
    const { id } = req.params;
    const { quantity } = req.body;
    
    // 2. Validation
    if (!quantity || quantity <= 0) {
        return res.status(400).json({ error: "Quantity must be greater than 0" });
    }

    // 3. Find Item (FIXED: used 'id' instead of 'cartItemId')
    const cartItem = await CartItem.findOne({ 
        where: { id: id, userId: userId } 
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    // 4. Update
    cartItem.quantity = quantity;
    await cartItem.save();

    res.json({
      message: "Cart item updated successfully",
      data: cartItem
    });

  } catch (error) {
    console.error("Update Cart Item Error:", error);
    res.status(500).json({ error: "Failed to update cart item" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get the ID from the URL parameter
    const { id } = req.params; 

    // Find item matching both ID and UserID
    const cartItem = await CartItem.findOne({ 
        where: { id: id, userId: userId } 
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    await cartItem.destroy();

    res.json({
      message: "Cart item removed successfully"
    });

  } catch (error) {
    console.error("Remove From Cart Error:", error);
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
};



exports.checkout = async (req, res) => {
    // 1. Start a Sequelize Transaction to ensure atomicity
    const t = await sequelize.transaction();
    
    try {
        const userId = req.user.id;

        // 2. Get Cart Items & Check if empty
        const cartItems = await CartItem.findAll({ 
            where: { userId },
            include: [{ model: Product }] 
        }, { transaction: t }); 

        if (cartItems.length === 0) {
            await t.commit(); 
            return res.status(400).json({ error: "Cart is empty. Please add items before checking out." });
        }

        // 3. Check stock availability for each item
        for (const item of cartItems) {
            const requestedQuantity = item.quantity;
            const availableStock = item.Product.stock;
            const productName = item.Product.name;

            if (requestedQuantity > availableStock) {
                await t.rollback(); 
                return res.status(400).json({ 
                    error: `Insufficient stock for ${productName}. Available: ${availableStock}, Requested: ${requestedQuantity}` 
                });
            }
        }
        
        // --- 4. CALCULATE TOTAL PRICE & CREATE ORDER RECORD (POSISI B) ---

        let totalPrice = 0;
        // Calculate total price and prepare line item data
        for (const item of cartItems) {
            totalPrice += item.quantity * item.Product.price; 
        }

        // 4a. Create Transaction Header (Order Summary)
        const transaction = await Transaction.create({
            userId: userId,
            totalPrice: totalPrice,
        }, { transaction: t });

        // 4b. Create Transaction Line Items (TransactionItem)
        // Store details of what was purchased (quantity, price, product ID)
        const transactionItemsData = cartItems.map(item => ({
            transactionId: transaction.id, // FK to the new Transaction
            productId: item.productId,
            quantity: item.quantity,
            price: item.Product.price, // Save price at the time of purchase (Snapshot)
        }));
        
        await TransactionItem.bulkCreate(transactionItemsData, { transaction: t });


        // --- 5. Finalize: Update Stock & Clear Cart ---

        for (const item of cartItems) {
            const newStock = item.Product.stock - item.quantity;
            
            // Update product stock (reduce stock)
            await Product.update({ stock: newStock }, { 
                where: { id: item.productId } 
            }, { transaction: t }); 

            // Remove item from cart (clear cart)
            await CartItem.destroy({ 
                where: { id: item.id } 
            }, { transaction: t }); 
        }

        // 6. Commit the transaction (all database changes are finalized)
        await t.commit(); 

        res.json({
            message: "Checkout successful! Order history saved, and stock updated.",
            orderId: transaction.id,
            totalPrice: totalPrice
        });

    } catch (error) {
        // If ANY error occurs, rollback everything to the initial state
        await t.rollback(); 
        console.error("Checkout Error:", error);
        res.status(500).json({ error: "Failed to process checkout due to server error." });
    }
};