const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = await User.create({ username, email, password });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.json({ token, user });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; 
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 

        const user = await User.findById(decoded.id); 
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ username: user.username, email: user.email });
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = { register, login, getMe };
