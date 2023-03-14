// 数据库连接助手
const mysql = require('mysql');

class DBHelper{
    // 获取数据库连接
    getConn(){
        let conn = mysql.createConnection({
            multipleStatements: true,
            // 数据库连接配置
            host:'192.168.1.235',
            port:'3306',
            user:'root',				// Mysql管理员用户名
            password:'user123456',			// Mysql管理员密码
            database:'digitalmuseum'  			// 数据库名
        });
        conn.connect((err)=>{
            if(err) throw err;
            // console.log("连接成功");
        });
        return conn;
    }
}
module.exports = DBHelper;