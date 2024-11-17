const sequelize = require('../core/db');

const Task = require('./Task');
const Type = require('./Type');

Task.belongsTo(Type, { foreignKey: 'typeId', as: 'type' });

Type.hasMany(Task, { foreignKey: 'typeId', as: 'tasks' });

module.exports = {
    sequelize,
    Task,
    Type
};
