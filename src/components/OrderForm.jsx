import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Button, Box, Grid, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const OrderForm = () => {
    const [cart, setCart] = useState(null);
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/cart', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setCart(response.data);
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        };
        fetchCart();
    }, []);

    const calculateTotalPrice = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const handleCheckOut = async () => {
        const total = calculateTotalPrice();

        // if (!user || !user._id) {
        //     console.log(user)
        //     console.error('User not found. Please log in again.');
        //     return;
        // }
    
        const orderData = {
            userId: user.username,
            fullName,
            address,
            purchasedProducts: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
            })),
            totalPrice: total,
        };
    
        try {
            const paymentResponse = await axios.post('http://localhost:5000/api/momo', {
                amount: total,
                ...orderData,
            });
    
            const payUrl = paymentResponse.data.payUrl;
            window.location.href = payUrl;
    
        } catch (error) {
            console.error("Failed to initiate payment: ", error);
        }
    };

    useEffect(() => {
        if (cart) {
            setTotalPrice(calculateTotalPrice());
        }
    }, [cart]);

    return (
        <Container spacing={2} sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>Nhập thông tin đơn hàng</Typography>
            
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    {cart && cart.items.length > 0 ? (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell>Sản phẩm</TableCell>
                                        <TableCell>Số lượng</TableCell>
                                        <TableCell>Giá</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cart.items.map((item) => (
                                        <TableRow key={item.product._id}>
                                            <TableCell>
                                                <img 
                                                    src={item.product.image ? `http://localhost:5000/${item.product.image}` : 'https://via.placeholder.com/150'} 
                                                    alt={item.product.name}
                                                    style={{ width: '100px' }} 
                                                />
                                            </TableCell>
                                            <TableCell>{item.product.name}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>{(item.product.price * item.quantity).toFixed(2)} VNĐ</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={2} />
                                        <TableCell align="right">Tổng tiền:</TableCell>
                                        <TableCell>{totalPrice.toFixed(2)} VNĐ</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography variant="h6">Giỏ hàng trống...</Typography>
                    )}
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Thông tin khách hàng</Typography>
                    <TextField
                        label="Họ và Tên"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    <TextField
                        label="Địa chỉ và SĐT"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <Box mt={4}>
                        <Button variant="contained" color="primary" onClick={() => handleCheckOut()}>
                            Thanh toán qua Momo
                        </Button>
                    </Box>
                    {/* {user && (
                        <Typography variant="body1" mt={2}>
                            User ID: {user._id}
                        </Typography>
                    )} */}
                </Grid>
            </Grid>
        </Container>
    );
};

export default OrderForm;
