import { sequelize } from "../config/Database.js"
import { DataTypes } from "sequelize"
import bcrypt from "bcrypt"

const user = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM("User", "Admin"),
        defaultValue: "User"
    }
}, {
    tableName: "User",
    timestamps: true,
})
user.beforeUpdate(async (e: any) => {
    if (e.changed("password")) {
        e.password = await bcrypt.hash(e.password, 10)
    }
})
export default user;