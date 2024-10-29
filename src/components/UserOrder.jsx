import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Collapse, Box } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const UserOrderManagement = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

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

    const toggleExpand = (orderId) => {
        setExpandedOrderId((prevOrderId) => (prevOrderId === orderId ? null : orderId));
    };

    return (
        <Container>
            
            <Typography variant="h4" gutterBottom>Đơn Hàng Của Tôi</Typography>

            {orders.length > 0 ? (
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
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
                                <React.Fragment key={order._id}>
                                    <TableRow>
                                        <TableCell>
                                            <IconButton onClick={() => toggleExpand(order._id)}>
                                                {expandedOrderId === order._id ? <ExpandLess /> : <ExpandMore />}
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>{order.orderId}</TableCell>
                                        <TableCell>{order.fullName}</TableCell>
                                        <TableCell>{order.address}</TableCell>
                                        <TableCell>{order.paymentStatus}</TableCell>
                                        <TableCell>{order.shippingStatus}</TableCell>
                                        <TableCell>{order.totalPrice} VNĐ</TableCell>
                                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={8} style={{ paddingBottom: 0, paddingTop: 0 }}>
                                            <Collapse in={expandedOrderId === order._id} timeout="auto" unmountOnExit>
                                                <Box margin={2}>
                                                    <Typography variant="h6" gutterBottom>Chi Tiết Sản Phẩm</Typography>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell></TableCell>
                                                                <TableCell>Tên Sản Phẩm</TableCell>
                                                                <TableCell>Số Lượng</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {order.products.map((item) => (
                                                                <TableRow key={item._id}>
                                                                    <TableCell>
                                                                        <img
                                                                            src={item.product.image ? `http://localhost:5000/${item.product.image}` : 'https://via.placeholder.com/150'}
                                                                            alt={item.product.name}
                                                                            style={{ width: '200px' }}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell>{item.product.name || 'Tên sản phẩm'}</TableCell>
                                                                    <TableCell>{item.quantity}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            ) : (
                <Typography variant="h6">Bạn chưa có đơn hàng nào.</Typography>
            )}
        </Container>
    );
};

export default UserOrderManagement;
