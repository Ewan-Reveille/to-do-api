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
        res.status(500).json({ error: 'Failed to fetch types' });
    }
});

router.post('/', async(req, res, next) => {
    try {
        const { title } = req.body;
        const newType = await Types.create({ title });
        return res.status(201).json(newType);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred, type couldn\'t be created' });
    }
});

router.delete('/:id', async(req, res, next) => {
    try {
        const type = await Types.findByPk(req.params.id);
        if (!type) return res.status(404).json({ error: 'Type not found' });
        await type.destroy();
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred, type couldn\'t be deleted' });
    }
});

router.put('/:id', async(req, res, next) => {
    try {
        const { title } = req.body;

        const type = await Types.findByPk(req.params.id);
        if (!type) return res.status(404).json({ error: 'Type not found' });

        await type.update({ title });

        const updatedType = await Types.findByPk(type.id);

        res.json(updatedType);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred, type couldn\'t be updated' });
    }
});

// Default error, if the error is unexpected
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
});
module.exports = router;