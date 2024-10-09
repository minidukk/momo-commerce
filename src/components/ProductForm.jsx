import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, InputLabel, MenuItem, Select, FormControl } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ProductForm = ({ isEditMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    stock: '',
    image: null,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/products/${id}`);
          setProductData({
            name: response.data.name,
            brand: response.data.brand,
            description: response.data.description,
            price: response.data.price,
            stock: response.data.stock,
            image: null,
          });
        } catch (err) {
          setError('Failed to load product details');
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    setProductData((prevData) => ({ ...prevData, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();

    formData.append('name', productData.name);
    formData.append('brand', productData.brand);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('stock', productData.stock);
    if (productData.image) formData.append('image', productData.image);

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/products/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post('http://localhost:5000/api/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      navigate('/admin/products'); 
    } catch (err) {
      setError('Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h4" gutterBottom>
        {isEditMode ? 'Edit Product' : 'Add New Product'}
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Product Name"
            name="name"
            value={productData.name}
            onChange={handleInputChange}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Brand"
            name="brand"
            value={productData.brand}
            onChange={handleInputChange}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={productData.description}
            onChange={handleInputChange}
            required
            multiline
            rows={4}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={productData.price}
            onChange={handleInputChange}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Stock"
            name="stock"
            type="number"
            value={productData.stock}
            onChange={handleInputChange}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Product Image</InputLabel>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Submitting...' : isEditMode ? 'Update Product' : 'Add Product'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProductForm;
