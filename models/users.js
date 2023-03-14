// const { DataTypes } = require('sequelize')
// // 将数据库连接对象导入
// const {sequelize} = require('./index')
// // 测试代码 导入对象成功
// // 创建模型
// const users = sequelize.define('user', {
//     /** 姓名 */
//     userName: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     passwd: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     loginName: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     email: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     phoneNumber: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     address: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
// },
//     {
//         timestamps: false, // 不要默认时间戳 数据库没有时间戳字段时，设置为false，否则报错  SequelizeDatabaseError: Unknown column 'createdAt' in 'field list'
//         freezeTableName:true
//     }
// );
// // 导出模型
// module.exports = users;