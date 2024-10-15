import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './PaymentResult.css';

const PaymentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

  const queryParams = new URLSearchParams(location.search);
  const resultCode = queryParams.get('resultCode');
  const orderId = queryParams.get('orderId');

  const paymentStatus = paymentStatusMapping[resultCode] || 'Trạng thái không xác định';

  const updatePaymentStatus = async () => {
    try {
      await axios.put(`http://localhost:5000/api/orders/update-status-by-orderId`, {
        orderId, 
        paymentStatus, 
      });
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái thanh toán:', error);
    }
  };

  useEffect(() => {
    if (orderId) {
      updatePaymentStatus();
    }
  }, [orderId]);

  return (
    <div className="payment-result-container">
      {resultCode === '0' ? (
        <div className="icon success">✔️</div>
      ) : (
        <div className="icon failure">❌</div>
      )}

      <h2>{paymentStatus}</h2>
      
      <button onClick={() => navigate('/')}>Trở Về Trang Chủ</button>
    </div>
  );
};

export default PaymentResult;
