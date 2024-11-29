import React, { useState, useEffect } from 'react';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, Button, Typography, Paper, IconButton, Collapse, Box, Select, MenuItem, TextField } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Link } from 'react-router-dom';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import axios from 'axios';

const AdminOrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
    const [shippingStatusFilter, setShippingStatusFilter] = useState('');

    useEffect(() => {
        fetchOrders();
    }, [paymentStatusFilter, shippingStatusFilter]);

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

            const paymentStatus = paymentStatusMapping[resultCode] || 'Trạng thái không xác định';

            await axios.put(`http://localhost:5000/api/orders/update-status/${order._id}`, {
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

    const updateShippingStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/orders/update-shipping-status/${orderId}`, {
                shippingStatus: newStatus,
            });
            fetchOrders();
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái giao hàng:', error);
        }
    };

    const toggleExpand = (orderId) => {
        setExpandedOrderId((prevOrderId) => (prevOrderId === orderId ? null : orderId));
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value.toLowerCase());
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = 
            order.orderId.toLowerCase().includes(searchText) ||
            order.fullName.toLowerCase().includes(searchText) ||
            order.address.toLowerCase().includes(searchText) ||
            new Date(order.createdAt).toLocaleDateString().includes(searchText);
        
        const matchesPaymentStatus = paymentStatusFilter ? order.paymentStatus === paymentStatusFilter : true;
        const matchesShippingStatus = shippingStatusFilter ? order.shippingStatus === shippingStatusFilter : true;

        return matchesSearch && matchesPaymentStatus && matchesShippingStatus;
    });

    return (
        <div>
            <Container>
            <Link to={`/admin/products`}>Quản lý sản phẩm</Link>
            <Typography variant="h4" gutterBottom>
                Quản lý đơn hàng
            </Typography>

            <Box display="flex" gap={2} marginBottom={2}>
                <TextField
                    label="Tìm kiếm"
                    variant="outlined"
                    value={searchText}
                    onChange={handleSearchChange}
                    placeholder="Mã đơn hàng, tên người nhận, địa chỉ, ngày tạo"
                />
                <Select
                    value={paymentStatusFilter}
                    onChange={(e) => setPaymentStatusFilter(e.target.value)}
                    displayEmpty
                >
                    <MenuItem value="">Tất cả trạng thái thanh toán</MenuItem>
                    <MenuItem value="Thành công">Thành công</MenuItem>
                    <MenuItem value="pending">pending</MenuItem>
                </Select>
                <Select
                    value={shippingStatusFilter}
                    onChange={(e) => setShippingStatusFilter(e.target.value)}
                    displayEmpty
                >
                    <MenuItem value="">Tất cả trạng thái giao hàng</MenuItem>
                    <MenuItem value="pending">pending</MenuItem>
                    <MenuItem value="Đang giao hàng">Đang giao hàng</MenuItem>
                    <MenuItem value="Giao hàng thành công">Giao hàng thành công</MenuItem>
                    <MenuItem value="Đã hủy">Đã hủy</MenuItem>
                </Select>
            </Box>
            </Container>
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
                            <TableCell>Chỉnh Sửa Trạng Thái Giao Hàng</TableCell>
                            <TableCell>Refresh</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((order) => (
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
                                    <TableCell>{order.shippingStatus || "pending"}</TableCell>
                                    <TableCell>{order.totalPrice} VNĐ</TableCell>
                                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={order.shippingStatus || "pending"}
                                            onChange={(e) => updateShippingStatus(order._id, e.target.value)}
                                        >
                                            <MenuItem value="pending">pending</MenuItem>
                                            <MenuItem value="Đang giao hàng">Đang giao hàng</MenuItem>
                                            <MenuItem value="Giao hàng thành công">Giao hàng thành công</MenuItem>
                                            <MenuItem value="Đã hủy">Đã hủy</MenuItem>
                                        </Select>
                                    </TableCell>
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
                                <TableRow>
                                    <TableCell colSpan={10} style={{ paddingBottom: 0, paddingTop: 0 }}>
                                        <Collapse in={expandedOrderId === order._id} timeout="auto" unmountOnExit>
                                            <Box margin={2}>
                                                <Typography variant="h6" gutterBottom>Chi Tiết Đơn Hàng</Typography>
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
                                                                <TableCell>{item.product.name || 'N/A'}</TableCell>
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
        </div>
    );
};

export default AdminOrderManagement;
