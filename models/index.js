const sequelize = require('../core/db');

const Task = require('./Task');
const Type = require('./Type');
const User = require('./User');

Task.belongsTo(Type, { foreignKey: 'typeId', as: 'type' });

Type.hasMany(Task, { foreignKey: 'typeId', as: 'tasks' });

// sequelize.sync({alter: true});
module.exports = {
    sequelize,
    Task,
    Type,
    User
};
