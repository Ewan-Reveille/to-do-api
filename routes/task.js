const express = require('express');
const router = express.Router();
const { Task, Type } = require('../models');
const { Op } = require('sequelize');

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
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
});

router.post('/', async (req, res) => {
    const { title, description, typeId, userId, dueDate } = req.body;
    const newTask = await Task.create({ title, description, typeId, userId, dueDate });
    res.status(201).json(newTask);
});

router.put('/:id', async (req, res) => {
    const { title, description, typeId, userId, completed, dueDate } = req.body;
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    await task.update({ title, description, typeId, userId, isDone: completed, dueDate });
    res.json(task);
});

router.delete('/:id', async (req, res) => {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    await task.destroy();
    res.status(204).send();
});

module.exports = router;
