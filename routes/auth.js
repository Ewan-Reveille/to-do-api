var express = require('express');
var router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { User } = require('../models');

router.post('/signup', async (req, res) => {
    const { email, password, display_name } = req.body;

    if (!password || !email || !display_name) {
        res.status(400);
        return res.json({ error: "Fields 'email', 'display_name' and 'password' are mandatory" });
    }

    if (password.length <= 8) {
        res.status(400);
        return res.json({ error: "Password must be at least 8 characters" });
    }

    const user = await User.build({
        email: email,
        password: password,
        display_name: display_name,
    });

    try {
        await user.validate({ fields: ['email'] });
    } catch (error) {
        console.error(error);
        res.status(400);
        return res.json({ error: error.errors[0]?.message || 'Validation error' });
    }

    try {
        await user.save();
        res.status(201);
        return res.json({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500);
        return res.json({ error: error.message || 'Unknown error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        return res.json({
            error: "Fields 'email' and 'password' are mandatory",
        });
    }

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
        res.status(400);
        return res.json({ error: 'Email or password incorrect' });
    }

    try {
        const isPasswordOk = await argon2.verify(user.password, password);
        if (!isPasswordOk) {
            res.status(400);
            return res.json({ error: 'Email or password incorrect' });
        }
    } catch (error) {
        console.error(error);
        res.status(500);
        return res.json({ error: 'Error verifying password' });
    }

    const token = jwt.sign(
        { id: user.id },
        process.env.JWT_PRIVATE_KEY,
        { expiresIn: '1h' }
    );

    res.json({ token: token });
});

router.post('/verify-token', (req, res) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        res.status(401);
        return res.send("Unauthorized");
    }
    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        res.status(200).json({ valid: true, decoded });
    } catch (error) {
        console.error(error);
        res.status(401).json({ valid: false, error: 'Invalid token' });
    }
});

router.get('/', (req, res) => {
    res.status(200).send('Connect to your account to continue');
});

// Default error, if the error is unexpected
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
});

module.exports = router;
