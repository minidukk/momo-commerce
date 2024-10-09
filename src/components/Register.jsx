import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp!');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password,
      });
      setError('');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký không thành công');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 2, padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5">Đăng ký tài khoản</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Nhập Username"
            fullWidth
            margin="normal"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Nhập Email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Nhập Mật Khẩu"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            label="Xác nhận mật khẩu"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
