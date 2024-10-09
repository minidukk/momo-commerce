import React, { useState, useContext } from 'react';
import { TextField, Button, Typography, Container, Paper, Box } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      login(response.data);
      setError('');
    } catch (err) {
      setError('Sai email hoặc mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 2, padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5">Đăng nhập vào trang web</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Nhập email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Nhập password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Đang đăng nhập' : 'Đăng nhập'}
          </Button>
        </Box>
        <Box mt={2}>
          <Typography variant="body2">
            Không có tài khoản? <Link to="/register">Đăng ký ở đây</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
