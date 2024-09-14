const Product = require('../models/productModel');

const addProduct = async (req, res) => {
  const { name, brand, description, price, stock} = req.body;
  const image = req.file ? req.file.path : null; // Lấy đường dẫn file ảnh nếu có

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
  const { name, description, price, stock } = req.body;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    product.name = name || product.name;
    product.brand = brand || product.brand;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await product.remove();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
