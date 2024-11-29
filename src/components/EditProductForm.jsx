import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';

const EditProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: '',
    brand: '',
    description: '',
    price: 0,
    stock: 0,
    image: null,
  });
  const [currentImage, setCurrentImage] = useState(null); // Ảnh hiện tại
  const token = localStorage.getItem('token'); // Token xác thực

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProductData(response.data);
        setCurrentImage(`http://localhost:5000/${response.data.image}`);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProductData({ ...productData, image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });

    try {
      const response = await axios.put(`http://localhost:5000/api/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Product updated:', response.data);
      navigate('/admin/products'); // Điều hướng về danh sách sản phẩm
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Chỉnh sửa sản phẩm
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

        <Box sx={{ marginTop: 2 }}>
          <Typography>Hình ảnh:</Typography>
          <img
            src={
              productData.image instanceof File
                ? URL.createObjectURL(productData.image)
                : currentImage
            }
            alt="Product"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </Box>

        <Button variant="contained" component="label" sx={{ marginTop: 2 }}>
          Đăng hình ảnh mới
          <input type="file" hidden onChange={handleFileChange} />
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 3, display: 'block', width: '100%' }}
        >
          Cập nhật sản phẩm
        </Button>
      </form>
    </Box>
  );
};

export default EditProductForm;
