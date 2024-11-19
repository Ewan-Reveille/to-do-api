var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const { User } = require('../models')

router.post('/signup', async (req, res) => {
    const { email, password, display_name } = req.body;

    if (!password || !email || !display_name) {
        res.status(400);
        res.json({ error: "Fields 'email', 'display_name' and 'password' are mandatory" });
    }

    if (password.length <= 8) {
        res.status(400);
        res.json({ error: "Password must be at least 8 characters" });
        return;
    }

    const user = await User.build({
        'email': email,
        'password': password,
        'display_name': display_name
    });
    try {
        await user.validate({ fields: ['email'] })
    } catch (error) {
        res.status(500);
        console.error(error);
        res.json({ error });
    }

    try {
        await user.save();
        res.status(204);
        res.json("ok");
    } catch (error) {
        res.status(500);
        res.json({ error: error.message || 'Unknown error' });1
        console.error(error);
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        res.json({
            'error': "Fields 'email' and 'password' are mandatory"
        });
        return;
    }
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
        res.status(400);
        res.json({ error: `Email or password incorrect` });
        return;
    }

    const isPasswordOk = await bcrypt.compare(password, user.password);

    if (!isPasswordOk) {
        res.status(400);
        res.json({ error: 'Email or password incorrect' });
        return;
    }

    const token = jwt.sign(
        { 'id': user.id },
        process.env.JWT_PRIVATE_KEY,
        { expiresIn: '1h' }
    );

    res.json({ 'token': token });
});

router.post('/verify-token', (req, res) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        res.status(401);
        res.send("Unauthorized");
        return;
    }
    const token = req.headers.authorization.split(' ')[1];
    
});

router.get('/', (req, res) => {
    res.status(200);
    res.send('Connect to your account to continue');
})

// Default error, if the error is unexpected
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
});
module.exports = router;