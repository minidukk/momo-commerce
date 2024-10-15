import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography, Button, Grid, TextField, Container, MenuItem, Select, InputLabel, Slider } from '@mui/material';

const SearchProducts = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('');
    const [priceRange, setPriceRange] = useState([0, 20000]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                setProducts(response.data);
                setFilteredProducts(response.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handlePriceChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    useEffect(() => {
        if (!products || products.length === 0) return;

        let updatedProducts = products.filter(product => {
            const searchKeywords = searchTerm.split(',').map(term => term.trim());
            return searchKeywords.some(keyword =>
                product.name.toLowerCase().includes(keyword) ||
                product.brand.toLowerCase().includes(keyword)
            );
        });

        updatedProducts = updatedProducts.filter(product =>
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        switch (sortOrder) {
            case 'priceAsc':
                updatedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'priceDesc':
                updatedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'nameAsc':
                updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'nameDesc':
                updatedProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                break;
        }

        setFilteredProducts(updatedProducts);
    }, [searchTerm, sortOrder, priceRange, products]);

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
        <Container>
            <Typography variant="h4" component="h1" sx={{ textAlign: 'center', marginY: 3 }}>
                Tìm kiếm sản phẩm
            </Typography>

            <TextField
                variant="outlined"
                fullWidth
                placeholder="Nhập tên sản phẩm để tìm kiếm..."
                value={searchTerm}
                onChange={handleSearch}
                sx={{
                    marginY: 2,
                    width: '50%',
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}
            />

            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                <Grid item xs={12} sm={6}>
                    <InputLabel id="sort-label">Sắp xếp theo</InputLabel>
                    <Select
                        labelId="sort-label"
                        fullWidth
                        value={sortOrder}
                        onChange={handleSortChange}
                    >
                        <MenuItem value="nameAsc">A-Z</MenuItem>
                        <MenuItem value="nameDesc">Z-A</MenuItem>
                        <MenuItem value="priceAsc">Giá: Thấp đến cao</MenuItem>
                        <MenuItem value="priceDesc">Giá: Cao đến thấp</MenuItem>
                    </Select>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography gutterBottom>Khoảng giá</Typography>
                    <Slider
                        value={priceRange}
                        onChange={handlePriceChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={20000}
                        step={1}
                    />
                    <Typography>Giá từ: {priceRange[0]}$ - {priceRange[1]}$</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ padding: 2 }}>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
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
                    ))
                ) : (
                    <Typography variant="h6" sx={{ textAlign: 'center', width: '100%' }}>
                        Không tìm thấy sản phẩm
                    </Typography>
                )}
            </Grid>
        </Container>
    );
};

export default SearchProducts;
