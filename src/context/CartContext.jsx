import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItemCount, setCartItemCount] = useState(0);

  const fetchCartItemCount = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setCartItemCount(data.items.length);
    } catch (error) {
      console.error('Error fetching cart item count:', error);
    }
  };

  useEffect(() => {
    fetchCartItemCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartItemCount, fetchCartItemCount }}>
      {children}
    </CartContext.Provider>
  );
};
