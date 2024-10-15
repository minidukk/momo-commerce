import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const UserOrderManagement = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/orders/user/${user.username}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching user orders:', error);
            }
        };

        if (user && user.username) {
            fetchUserOrders(); 
        }
    }, [user]);
    
    return (
        <Container>
            <Typography variant="h4" gutterBottom>Đơn Hàng Của Tôi</Typography>
            
            {orders.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Mã Đơn Hàng</TableCell>
                                <TableCell>Tên Người Nhận</TableCell>
                                <TableCell>Địa Chỉ</TableCell>
                                <TableCell>Trạng Thái Thanh Toán</TableCell>
                                <TableCell>Trạng Thái Giao Hàng</TableCell>
                                <TableCell>Tổng Tiền</TableCell>
                                <TableCell>Ngày Tạo</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell>{order.orderId}</TableCell>
                                    <TableCell>{order.fullName}</TableCell>
                                    <TableCell>{order.address}</TableCell>
                                    <TableCell>{order.paymentStatus}</TableCell>
                                    <TableCell>{order.shippingStatus}</TableCell>
                                    <TableCell>{order.totalPrice} VNĐ</TableCell>
                                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="h6">Bạn chưa có đơn hàng nào.</Typography>
            )}
        </Container>
    );
};

export default UserOrderManagement;
