import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';


const Cart = () => {
    const [cart, setCart] = useState(null);

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

    const handleRemoveFromCart = async (productId) => {
        try {
            setCart(prevCart => ({
                ...prevCart,
                items: prevCart.items.filter(item => item.product._id !== productId)
            }));

            await axios.post('http://localhost:5000/api/cart/remove', { productId }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            window.location.reload();
        } catch (error) {
            console.error('Error removing from cart:', error);
            fetchCart();
        }
    };

    // const handleCheckOut = async () => {
    //     const totalPrice = calculateTotalPrice();

    //     try {
    //         const response = await axios.post('http://localhost:5000/api/momo', {
    //             amount: totalPrice,
    //         });
    //         const payUrl = response.data.payUrl;
    //         window.location.href = payUrl;

    //     } catch (error) {
    //         console.error("Payment failed: ", error);
    //         alert("Failed to initiate payment");
    //     }
    // };

    const calculateTotalPrice = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    return (
        <Container spacing={2} sx={{ padding: 2 }}>
            {cart && cart.items.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Sản phẩm</TableCell>
                                <TableCell>Số lượng</TableCell>
                                <TableCell>Giá</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cart.items.sort((a, b) => a.product.price - b.product.price).map((item) => (
                                <TableRow key={item.product._id}>
                                    <TableCell>
                                        <img
                                            src={item.product.image ? `http://localhost:5000/${item.product.image}` : 'https://via.placeholder.com/150'}
                                            alt={item.product.name}
                                            style={{ width: '200px' }}
                                        />
                                    </TableCell>
                                    <TableCell>{item.product.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{item.product.price.toFixed(2)} VNĐ</TableCell>
                                    <TableCell>
                                        <Button variant="outlined" color="error" onClick={() => handleRemoveFromCart(item.product._id)}>
                                            Xóa
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={2} />
                                <TableCell align="right">Tổng tiền:</TableCell>
                                <TableCell>{calculateTotalPrice().toFixed(2)} VNĐ</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="h6">Giỏ hàng trống...</Typography>
            )}
            {cart && cart.items.length > 0 && (
                <Box mt={4}>
                    <Link to="/order" style={{ textDecoration: 'none' }}>
                        <Button variant="contained" color="primary">
                            Tiến hành đặt hàng
                        </Button>
                    </Link>
                </Box>
            )}
        </Container>
    );
};

export default Cart;
