const express = require('express');
const router = express.Router();
const { Task, Type } = require('../models');
const { Op } = require('sequelize');
const Joi = require('joi');
const { body, param, validationResult } = require('express-validator');

const taskSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().allow('').max(500),
    typeId: Joi.number().integer().positive(),
    dueDate: Joi.date(),
    completed: Joi.boolean()
});

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    const isDone = req.query.isDone !== undefined ? parseInt(req.query.isDone) : null;
    const isLate = req.query.isLate === 'true';
    const nameFilter = req.query.name ? `%${req.query.name}%` : null;
    const typeFilter = req.query.type ? `%${req.query.type}%` : null;

    let where = {};
    if (isDone !== null) {
        where.isDone = isDone;
    }
    if (isLate) {
        where.dueDate = { [Op.lt]: new Date() };
    }

    if (nameFilter) {
        where[Op.or] = [
            { title: { [Op.like]: nameFilter } }
        ];
    }

    try {
        const totalCount = await Task.count({ where });
        const tasks = await Task.findAll({
            where,
            limit: limit,
            offset: offset,
            // attributes: { exclude: ['typeId'] }, // It is useless to have typeId, and then, the type object
            include: [{
                model: Type, as: 'type',
                required: typeFilter ? true : false,
                where: typeFilter ? { title: { [Op.like]: typeFilter } } : {}
            }]
        });
        res.json({
            tasks: tasks,
            totalCount: totalCount,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id, {
            attributes: { exclude: ['typeId'] },
            include: [{
                model: Type, as: 'type'
            }]
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch task' });
    }
});


router.post('/',
    [
        body('title').isString().trim().escape(),
        body('description').optional().isString().trim().escape(),
        body('typeId').optional().isInt(),
        body('dueDate').optional().isISO8601().toDate()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { error, value } = taskSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const { title, description, typeId, dueDate } = value;
        if (typeId) {
            const typeExists = await Type.findByPk(typeId);
            if (!typeExists) {
                return res.status(400).json({ error: 'Invalid typeId: Type does not exist' });
            }
        }

        const newTask = await Task.create({ title, description, typeId, dueDate });

        const createdTask = await Task.findByPk(newTask.id, {
            attributes: { exclude: ['typeId'] },
            include: [{ model: Type, as: 'type' }]
        });

        res.status(201).json(createdTask);
    });

router.put('/:id', async (req, res) => {
    try {
        const { title, description, typeId, completed, dueDate } = req.body;
        console.log("The state of the task: " + title + completed);

        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        await task.update({ title, description, typeId, isDone: completed, dueDate });

        const updatedTask = await Task.findByPk(task.id, {
            attributes: { exclude: ['typeId'] },
            include: [{ model: Type, as: 'type' }]
        });

        res.json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred, task couldn\'t be updated' });
    }

});

router.delete('/:id', async (req, res) => {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    await task.destroy();
    res.status(204).send();
});

// Default error, if the error is unexpected
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
});


module.exports = router;
