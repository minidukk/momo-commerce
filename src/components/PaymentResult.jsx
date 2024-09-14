import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PaymentResult.css';

const PaymentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const resultCode = queryParams.get('resultCode');

  const isSuccess = resultCode === '0';

  return (
    <div className="payment-result-container">
      {isSuccess ? (
        <div className="icon success">✔️</div>
      ) : (
        <div className="icon failure">❌</div>
      )}
      
      <h2>{isSuccess ? 'Thanh Toán Thành Công' : 'Thanh Toán Không Thành Công'}</h2>
      
      <button onClick={() => navigate('/')}>Trở Về Trang Chủ</button>
    </div>
  );
};

export default PaymentResult;
