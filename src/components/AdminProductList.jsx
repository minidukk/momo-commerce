import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Typography, Table, TableBody, TableCell, Container, TableHead, TableRow, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const AdminProductList = () => {
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

    const handleDeleteProduct = async (productId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/products/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(products.filter(product => product._id !== productId));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">Error: {error}</Typography>;

    return (
        <Container>
            <Link to={`/admin/orders`}>Quản lý đơn hàng</Link>
            <Typography variant="h4" gutterBottom>Quản lý sản phẩm</Typography>
            
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Hình ảnh</TableCell>
                            <TableCell>Tên sản phẩm</TableCell>
                            <TableCell>Hãng</TableCell>
                            <TableCell>Mô tả</TableCell>
                            <TableCell>Giá</TableCell>
                            {/* <TableCell>Tồn kho</TableCell> */}
                            <TableCell>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product._id}>
                                <TableCell>
                                    <img src={product.image ? `http://localhost:5000/${product.image}` : 'https://via.placeholder.com/100'} alt={product.name} style={{ width: '50px' }} />
                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.brand}</TableCell>
                                <TableCell>{product.description}</TableCell>
                                <TableCell>{product.price}</TableCell>
                                {/* <TableCell>{product.stock}</TableCell> */}
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
