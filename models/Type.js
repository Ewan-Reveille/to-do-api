const { DataTypes } = require('sequelize');
const sequelize = require('../core/db');

const Type = sequelize.define('Type', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Type;
