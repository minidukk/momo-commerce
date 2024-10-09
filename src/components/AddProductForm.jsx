import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';

const AddProductForm = () => {
  const [productData, setProductData] = useState({
    name: '',
    brand: '',
    description: '',
    price: 0,
    stock: 0,
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null); 
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProductData({ ...productData, image: file });
    setPreviewImage(URL.createObjectURL(file)); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });

    try {
      const response = await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, 
        },
      });
      console.log('Product added:', response.data);
      navigate('/admin/products'); 
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Thêm sản phẩm mới
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Tên sản phẩm"
          name="name"
          value={productData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Hãng"
          name="brand"
          value={productData.brand}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Mô tả"
          name="description"
          value={productData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          multiline
          rows={4}
        />
        <TextField
          label="Giá"
          name="price"
          type="number"
          value={productData.price}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Tồn kho"
          name="stock"
          type="number"
          value={productData.stock}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />

        {previewImage && (
          <Box sx={{ marginTop: 2 }}>
            <Typography>Image Preview:</Typography>
            <img src={previewImage} alt="Product preview" style={{ maxWidth: '100%', height: 'auto' }} />
          </Box>
        )}

        <Button variant="contained" component="label" sx={{ marginTop: 2 }}>
          Đăng hình ảnh
          <input type="file" hidden onChange={handleFileChange} />
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 3, display: 'block', width: '100%' }}
        >
          Thêm sản phẩm
        </Button>
      </form>
    </Box>
  );
};

export default AddProductForm;
