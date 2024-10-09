import React, { useState, useEffect } from 'react';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, Button, Typography, Paper,} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';

const AdminOrderManagement = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/orders', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleCheckPaymentAndUpdate = async (order) => {
        const { orderId } = order;
    
        try {
            const response = await axios.post(
                'http://localhost:5000/api/momo/check-status-transaction',
                { orderId }
            );
    
            const resultCode = response.data.resultCode;
            let paymentStatus;
    
            const paymentStatusMapping = {
                0: 'Thành công',
                10: 'Hệ thống bảo trì',
                11: 'Truy cập bị từ chối',
                12: 'Phiên bản API không được hỗ trợ',
                13: 'Xác thực doanh nghiệp thất bại',
                20: 'Yêu cầu sai định dạng',
                21: 'Số tiền giao dịch không hợp lệ',
                22: 'Số tiền không trong giới hạn',
                40: 'RequestId bị trùng',
                41: 'OrderId bị trùng',
                42: 'OrderId không hợp lệ',
                43: 'Xung đột giao dịch',
                45: 'ItemId bị trùng',
                47: 'Thông tin không hợp lệ',
                98: 'QR Code không thành công',
                99: 'Lỗi không xác định',
                1000: 'Chờ xác nhận thanh toán',
                1001: 'Thất bại do không đủ tiền',
                1002: 'Bị từ chối bởi nhà phát hành',
                1003: 'Giao dịch bị hủy',
                1004: 'Số tiền vượt quá hạn mức',
                1005: 'URL hoặc QR Code đã hết hạn',
                1006: 'Người dùng từ chối xác nhận',
                1007: 'Tài khoản không tồn tại',
                1017: 'Giao dịch bị hủy bởi đối tác',
                1026: 'Hạn chế theo chương trình khuyến mãi',
                1080: 'Hoàn tiền thất bại',
                1081: 'Hoàn tiền bị từ chối',
                1088: 'Hoàn tiền không được hỗ trợ',
                2019: 'OrderGroupId không hợp lệ',
                4001: 'Tài khoản người dùng bị hạn chế',
                4100: 'Người dùng chưa đăng nhập',
                7000: 'Giao dịch đang xử lý',
                7002: 'Đang xử lý bởi nhà cung cấp',
                9000: 'Giao dịch đã xác nhận thành công'
            };
    
            paymentStatus = paymentStatusMapping[resultCode] || 'Trạng thái không xác định';
    
            await axios.put(`http://localhost:5000/api/orders/${order._id}`, {
                paymentStatus: paymentStatus,
            });
    
            fetchOrders();
        } catch (error) {
            console.error('Lỗi khi kiểm tra trạng thái thanh toán:', error);
        }
    };
    
    const handleCheckAllPayments = async () => {
        try {
            for (const order of orders) {
                await handleCheckPaymentAndUpdate(order);
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra thanh toán cho tất cả đơn hàng:', error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Quản lý đơn hàng
            </Typography>
            <Button
                variant="contained"
                color="secondary"
                onClick={handleCheckAllPayments}
                style={{ marginBottom: '16px' }}
            >
                Kiểm tra tất cả thanh toán
            </Button>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Tên khách hàng</TableCell>
                            <TableCell>Tổng tiền</TableCell>
                            <TableCell>Tình trạng thanh toán</TableCell>
                            <TableCell>Tình trạng vận chuyển</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order._id}>
                                <TableCell>{order.orderId}</TableCell>
                                <TableCell>{order.fullName}</TableCell>
                                <TableCell>{order.totalPrice.toFixed(2)} VNĐ</TableCell>
                                <TableCell>{order.paymentStatus}</TableCell>
                                <TableCell>{order.shippingStatus}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleCheckPaymentAndUpdate(order)}
                                    >
                                        <RefreshIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
};

export default AdminOrderManagement;
