var express = require('express');
var router = express.Router();
const Types = require('../models/Type');
/* GET home page. */
router.get('/', async(req, res, next) => {
    try {
        const types = await Types.findAll();

        res.json(types);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

router.post('/', async(req, res, next) => {
    const {title} = req.body;
    const newType = await Types.create({title});
    return res.status(201).json(newType);
})
module.exports = router;