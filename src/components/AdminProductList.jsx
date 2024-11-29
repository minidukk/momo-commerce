import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Slider, Button, Typography, Table, TableBody, TableCell, Container, TableHead, TableRow, Paper, TextField, Select, MenuItem, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const AdminProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [priceRange, setPriceRange] = useState([0, 20000]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                const sortedProducts = response.data.sort((a, b) => b.price - a.price);
                setProducts(sortedProducts);
                setFilteredProducts(sortedProducts);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleDeleteProduct = async (productId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/products/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(products.filter(product => product._id !== productId));
            setFilteredProducts(filteredProducts.filter(product => product._id !== productId));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterByBrand = (event) => {
        setSelectedBrand(event.target.value);
    };

    useEffect(() => {
        let tempProducts = [...products];

        if (searchTerm) {
            tempProducts = tempProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedBrand) {
            tempProducts = tempProducts.filter(product => product.brand === selectedBrand);
        }

        tempProducts = tempProducts.filter(product =>
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        setFilteredProducts(tempProducts);
    }, [searchTerm, selectedBrand, priceRange, products]);


    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">Error: {error}</Typography>;

    const uniqueBrands = [...new Set(products.map(product => product.brand))];

    return (
        <Container>
            <Link to={`/admin/orders`}>Quản lý đơn hàng</Link>
            <Typography variant="h4" gutterBottom>Quản lý sản phẩm</Typography>

            <Box display="flex" gap={2} marginBottom={2} alignItems="center">
                <TextField
                    label="Tìm kiếm"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <Select
                    value={selectedBrand}
                    onChange={handleFilterByBrand}
                    displayEmpty
                >
                    <MenuItem value="">Tất cả hãng</MenuItem>
                    {uniqueBrands.map(brand => (
                        <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                    ))}
                </Select>

                <Box>
                    <Typography gutterBottom>Khoảng giá</Typography>
                    <Slider
                        value={priceRange}
                        onChange={(event, newValue) => setPriceRange(newValue)}
                        valueLabelDisplay="auto"
                        min={0}
                        max={20000}
                        step={500}
                    />
                    <Typography>
                        Giá từ: {priceRange[0]} VNĐ - {priceRange[1]} VNĐ
                    </Typography>
                </Box>
            </Box>


            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Hình ảnh</TableCell>
                            <TableCell>Tên sản phẩm</TableCell>
                            <TableCell>Hãng</TableCell>
                            <TableCell>Mô tả</TableCell>
                            <TableCell>Giá</TableCell>
                            <TableCell>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProducts.map((product) => (
                            <TableRow key={product._id}>
                                <TableCell>
                                    <img src={product.image ? `http://localhost:5000/${product.image}` : 'https://via.placeholder.com/100'} alt={product.name} style={{ width: '50px' }} />
                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.brand}</TableCell>
                                <TableCell>{product.description}</TableCell>
                                <TableCell>{product.price}</TableCell>
                                <TableCell>
                                    <Button component={Link} to={`/admin/products/edit/${product._id}`} variant="contained" color="primary" sx={{ marginRight: 1 }}>Chỉnh sửa</Button>
                                    <Button variant="contained" color="secondary" onClick={() => handleDeleteProduct(product._id)}>Xóa</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
            <Button component={Link} sx={{ marginTop: 2 }} to="/admin/products/add" variant="contained" color="primary">Thêm sản phẩm</Button>
        </Container>
    );
};

export default AdminProductList;
