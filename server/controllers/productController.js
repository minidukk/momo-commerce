const Product = require('../models/productModel');

const addProduct = async (req, res) => {
  const { name, brand, description, price, stock} = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const product = new Product({
      name,
      brand,
      description,
      price,
      stock,
      image
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, brand, description, price, stock } = req.body;
  let image = req.file ? req.file.path : undefined; // Update image only if a new one is uploaded

  try {
    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Update product fields
    product.name = name || product.name;
    product.brand = brand || product.brand;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    
    // Only update the image if a new one is uploaded
    if (image) {
      product.image = image;
    }

    // Save the updated product
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error });
  }
};


const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { addProduct, updateProduct, deleteProduct, getProducts, getProductById };
