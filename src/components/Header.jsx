import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, TextField, Button, IconButton, Avatar, Badge } from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import WatchIcon from '@mui/icons-material/Watch';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    watchIconContainer: {
        display: 'inline-block',
        transition: 'transform 0.001s ease-in-out',
        '&:hover': {
            transform: 'scale(1.05)',
        },
    },
    watchIcon: {
        '&:hover': {
            transform: 'scale(1.05)',
        },
    },
    headerLink: {
        textDecoration: 'none',
        color: 'inherit',
        display: 'inline-flex',
        alignItems: 'center',
    },
}));

const Header = () => {
    const classes = useStyles();
    const { user, logout } = useContext(AuthContext);
    const { cartItemCount } = useContext(CartContext);

    return (
        <AppBar position="static" sx={{ backgroundColor: '#7393B3' }}>
            <Toolbar>
                <div className={classes.watchIconContainer}>
                    <IconButton component={Link} to="/" color="inherit" className={classes.watchIcon}>
                        <WatchIcon />MD-Watch
                    </IconButton>
                </div>

                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link to="/" className={classes.headerLink}>

                    </Link>
                </Typography>

                {/* <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search products..."
                    sx={{ marginRight: 2 }}
                /> */}

                <IconButton color="inherit" component={Link} to="/search">
                        <SearchIcon />
                </IconButton>

                {user ? (
                    <>
                        <IconButton color="inherit" component={Link} to="/profile">
                            <Avatar>{user.username ? user.username[0] : '?'}</Avatar>
                        </IconButton>
                        <IconButton color="inherit" component={Link} to="/cart">
                            <Badge badgeContent={cartItemCount} color="secondary">
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>
                        <Button color="inherit" onClick={logout}>
                            Đăng xuất
                        </Button>
                    </>
                ) : (
                    <Button component={Link} to="/login" color="inherit">
                        Đăng nhập
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
