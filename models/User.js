const { DataTypes } = require("sequelize");
const sequelize = require("../core/db");
const argon2 = require("argon2");

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
    try {
        const hashedPassword = await argon2.hash(user.password);
        user.password = hashedPassword;
    } catch (error) {
        throw new Error("Error hashing password");
    }
});

module.exports = User;
