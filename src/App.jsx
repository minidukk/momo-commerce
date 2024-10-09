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
import AdminProductList from './components/AdminProductList';
import AdminOrderManagement from './components/AdminOrderManagement';
import ProductForm from './components/ProductForm';
import SearchProducts from './components/SearchProducts';
import AddProductForm from './components/AddProductForm';
import EditProductForm from './components/EditProductForm';
import OrderForm from './components/OrderForm';
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
          <Route path="/order" element={<OrderForm />} />
          <Route path="/search" element={<SearchProducts />} />
          <Route path="/admin/products" element={<AdminProductList />} />
          <Route path="/admin/products/add" element={<AddProductForm />} />
          <Route path="/admin/products/edit/:id" element={<EditProductForm />} />
          <Route path="/admin/orders" element={<AdminOrderManagement />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
