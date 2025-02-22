import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Card, CardContent, CardMedia, Button, TextField, Grid } from '@mui/material';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async (productId, quantity) => {
    const token = localStorage.getItem('token');

    try {
      await axios.post('http://localhost:5000/api/cart/add',
        { productId, quantity },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      window.location.reload();
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const handleBuyNow = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/momo', {
        amount: product.price
      });

      const payUrl = response.data.payUrl;
      window.location.href = payUrl;

    } catch (error) {
      console.error("Payment failed: ", error);
      alert("Failed to initiate payment");
    }
  };

  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (!product) return <Typography>Loading...</Typography>;

  return (
    <Container>
      <Grid container spacing={1} sx={{ padding: 4 }}>
        <Grid item xs={12} md={6}>
          <CardMedia
            component="img"
            height="400"
            image={product.image ? `http://localhost:5000/${product.image}` : 'https://via.placeholder.com/400'}
            alt={product.name}
            sx={{
              objectFit: 'contain'    
          }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CardContent>
            <Typography variant="h4">{product.name}</Typography>
            <Typography variant="h6" color="textSecondary">{product.brand}</Typography>
            <Typography variant="h5" color="primary">{product.price} VNĐ</Typography>
            
            <TextField
              type="number"
              label="Số lượng"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              inputProps={{ min: 1, max: product.stock }}
              sx={{ marginTop: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAddToCart(product._id, quantity)}
              sx={{ marginTop: 2, marginLeft: 2 }}
            >
              Thêm vào giỏ
            </Button>
            {/* <Button
              variant="contained"
              color="secondary"
              onClick={handleBuyNow}
              sx={{ marginTop: 2, marginLeft: 2 }}
            >
              Buy Now
            </Button> */}
          </CardContent>
        </Grid>
        
      </Grid>
      <Typography variant="h4">Thông tin sản phẩm</Typography>
        <Typography variant="body1">{product.description}</Typography>
    </Container>
  );
};

export default ProductDetail;
