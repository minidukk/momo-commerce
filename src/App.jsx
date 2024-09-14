import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Login from './components/Login';
import Register from './components/Register';
import PaymentResult from './components/PaymentResult';
import Cart from './components/Cart';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/payment" element={<PaymentResult />} />
          <Route path="/cart" element={<Cart />} />
          {/* Thêm các route khác nếu cần */}
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
