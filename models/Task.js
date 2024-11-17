const { DataTypes } = require('sequelize');
const sequelize = require('../core/db');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    typeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    isDone: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

module.exports = Task;
