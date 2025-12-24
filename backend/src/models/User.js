import sequelize from "sequelize"
import { DataTypes } from "sequelize"
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
    }
}, {
    tableName: "User",
    timestamps: true,
})
user.beforeUpdate(async(e))
export default user;