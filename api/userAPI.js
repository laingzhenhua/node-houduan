const express = require('express');
const router = express.Router();
let jwt = require("jsonwebtoken")
const DBHelper = require('../utils/DBHelper');
const sql = require('../sqlMap');
const md5 = require("md5");
// const user = require("./../models/users")
// 登录
router.post('/getUser', (req, res) => {
    let sqlStr = sql.user.select;
    let params = req.body;
    let conn = new DBHelper().getConn();
    conn.query(sqlStr, params.loginName, (err, result) => {
        if(!result || result.length == 0) {
            return res.json({code: 1, msg: '账户或密码错误'})
        }else if (result[0].passwd == params.passwd) {
            let sucessdata = { userName: result[0].userName, }; //用户登录成功的信息
            let miyao = "flower"; //密钥
            let sessionId = jwt.sign(sucessdata, miyao,{ expiresIn: 30 * 60  });
            let data = {
                code: 0,
                data: { userName: result[0].userName,email:result[0].email,address:result[0].address,phoneNumber:result[0].phoneNumber ,sessionId,permissions:result[0].permissions},
                msg: "登录成功"
            }
            res.json(data)
        } else {
            return res.json({code: 1, msg: '账户或密码错误'})
        }
    });
    conn.end();
});
//注册待审核
router.post('/authRegister', (req, res) => {
    let sqlStr = sql.user;
    console.log(req.body)
    let params = {
        userName: req.body.userName || "",
        passwd: req.body.passwd || "",
        loginName: req.body.registerName || "",
        email: "",
        phoneNumber: "",
        address:  "",
        permissions:3,
        posts:  "普通用户",
        status: 0
    };
    let conn = new DBHelper().getConn();
    conn.query(sqlStr.select, params.loginName, (err, result) => {
        if (result.length !== 0) {
            return res.json({ code: 1, msg: "账户已被使用" });
        } else if (result == undefined) {
            return res.json({ code: 1, msg: "输入错误" });
        }
        conn.query(sqlStr.register, [params], (err, result) => {
            console.log(err)
            if (err) {
                return res.json({ code: 1, msg: "系统开小差" });
            } else {
                let data = {
                    code: 0,
                    data: "",
                    msg: "申请成功，待管理员审核",
                };
                res.json(data);
            }
        });
        conn.end();
    });
    // conn.end();
});
//修改密码
router.post('/updatePasswd', (req, res) => {
    let sqlStr = sql.user;
    let params = req.body;
    let conn = new DBHelper().getConn();
    let userMsg = {};
    var token = req.body.token || req.query.token || req.headers["x-dm-token"]; // 从body或query或者header中获取token
    jwt.verify(token, "flower", function (err, decode) {
        if (err) {  //  时间失效的时候/ 伪造的token
            res.json({err:err})
        } else {
            userMsg = decode;
        }
    })
    conn.query(sqlStr.queryByNamePassword, [userMsg.userName,params.passwd], (err, result) => {
            if (result) {
                //判断用户列表是否为空
                if (result.length) {
                    //如不为空，则说明存在此用户且密码正确
                    console.log([params.newPasswd,result[0].id])
                    conn.query(sqlStr.updateUser, [params.newPasswd,result[0].id], (err, result) => {
                        console.log(err)
                        if (result) {
                            let data = {
                                code: 0,
                                data: "",
                                msg: "修改密码成功"
                            }
                            res.json(data)
                        } else {
                            return res.json({code: 1, msg: '密码错误'})
                        }
                    })

                } else {
                    return res.json({code: 1, msg: '账户不存在'})
                }
            }
        conn.end();
    });
    //
});

//注册
// router.post('/authRegister', (req, res) => {
//     let sqlStr = sql.user;
//     let params = req.body;
//     let conn = new DBHelper().getConn();
//     let userMsg = {};
//     var token = req.body.token || req.query.token || req.headers["x-dm-token"]; // 从body或query或者header中获取token
//     jwt.verify(token, "flower", function (err, decode) {
//         if (err) {  //  时间失效的时候/ 伪造的token
//             res.json({err:err})
//         } else {
//             userMsg = decode;
//         }
//     })
//     conn.query(sqlStr.queryByNamePassword, [userMsg.userName,params.passwd], (err, result) => {
//         if (result) {
//             //判断用户列表是否为空
//             if (result.length) {
//                 //如不为空，则说明存在此用户且密码正确
//                 console.log([params.newPasswd,result[0].id])
//                 conn.query(sqlStr.updateUser, [params.newPasswd,result[0].id], (err, result) => {
//                     console.log(err)
//                     if (result) {
//                         let data = {
//                             code: 0,
//                             data: "",
//                             msg: "修改密码成功"
//                         }
//                         res.json(data)
//                     } else {
//                         return res.json({code: 1, msg: '密码错误'})
//                     }
//                 })
//
//             } else {
//                 return res.json({code: 1, msg: '账户不存在'})
//             }
//         }
//         conn.end();
//     });
//     //
// });
module.exports = router;