import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography, Button, Grid } from '@mui/material';

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

  const groupedProducts = products.reduce((grouped, product) => {
    const brand = product.brand;
    if (!grouped[brand]) {
      grouped[brand] = [];
    }
    grouped[brand].push(product);
    return grouped;
  }, {});

  const handleAddToCart = (productId) => {
    const token = localStorage.getItem('token');

    axios.post('http://localhost:5000/api/cart/add', { productId, quantity: 1 }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        console.log('Product added to cart:', response.data);
        window.location.reload();
      })
      .catch(error => {
        console.error('Error adding product to cart:', error);
      });
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <div>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          textAlign: 'center',
          marginTop: 3,
        }}
      >
        Nơi bán đồng hồ uy tín tại Cần Thơ
      </Typography>
      <Typography
        variant="h6"
        component="h1"
        sx={{
          padding: 4,
          textAlign: 'center',
        }}
      >
        Chào mừng bạn đến với MD-Watch, một trong những địa chỉ bán đồng hồ uy tín hàng đầu tại Cần Thơ. Với sứ mệnh mang đến cho khách hàng những sản phẩm đồng hồ chất lượng, MD-Watch không chỉ là nơi mua sắm, mà còn là một trải nghiệm thú vị cho những ai đam mê thời gian và cái đẹp.
      </Typography>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          textAlign: 'center',
          marginY: 3,
        }}
      >
        Sản Phẩm Mới
      </Typography>

      {Object.keys(groupedProducts).map((brand) => (
        <div key={brand}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              textAlign: 'center',
              marginY: 3,
            }}
          >
            {brand}
          </Typography>
          <Grid container spacing={2} sx={{ padding: 2 }}>
            {groupedProducts[brand].map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={product._id}>
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)'
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
                      {product.brand}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {product.price} VNĐ
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ marginTop: 2 }}
                      onClick={() => handleAddToCart(product._id)}
                    >
                      Thêm vào giỏ
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
