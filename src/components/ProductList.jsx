import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography, Button, Grid } from '@mui/material';
import Slideshow from './Slideshow';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (productId) => {
    const token = localStorage.getItem('token'); // Ensure the token is available

    axios.post('http://localhost:5000/api/cart/add', { productId, quantity: 1 }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        console.log('Product added to cart:', response.data);
        window.location.reload(); // Reload the page to reflect cart changes
      })
      .catch(error => {
        console.error('Error adding product to cart:', error);
      });
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <div>
      <Slideshow />
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <h1></h1>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={product._id}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                transition: 'transform 0.3s ease', // Smooth transition for scaling
                '&:hover': {
                  transform: 'scale(1.05)', // Scale up on hover
                  boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)' // Optional: add shadow for better effect
                }
              }}
            >
              <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image ? `http://localhost:5000/${product.image}` : 'https://via.placeholder.com/150'}
                  alt={product.name}
                />
              </Link>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  ${product.price}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 2 }}
                  onClick={() => handleAddToCart(product._id)} // Call the function with the product ID
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ProductList;
