const { DataTypes } = require("sequelize");
const sequelize = require("../core/db");
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING(325),
        validate: {
            isEmail: true,
        },
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    display_name: {
        type: DataTypes.STRING(255)
    }
});

User.beforeCreate(async user => {
    const codedPassword = await bcrypt.hash(user.password, 12);
    user.password = codedPassword;
});

module.exports = User;
