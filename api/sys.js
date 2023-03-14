const express = require("express");
const router = express.Router();
let jwt = require("jsonwebtoken");
const DBHelper = require("../utils/DBHelper");
const sql = require("../sqlMap");
const md5 = require("md5");
//查询列表
router.post("/getUserList", function (req, res) {
    let conn = new DBHelper().getConn();
    const pageNo = req.body.pageNo; //当前的num
    const pageSize = req.body.pageSize; //当前页的数量
    const param = [
        parseInt(pageNo - 1) * parseInt(pageSize),
        parseInt(pageSize),
    ];
    const params = req.body;
    let sqlStr = sql.sys.getUser;
    let content = [];
    let isMore = false; //是否有多个查询参数
    if(params.permissions) {
        sqlStr += " where permissions > 2";
    }else {
        sqlStr += " where status != 2";
    }
    if (params.userName) {
        // 模糊查询两种方法直接在SQL语句后加 mysql.escape("%"+req.body.name+"%")
        // sql += " WHERE product_name LIKE "+mysql.escape("%"+req.body.name+"%")
        sqlStr += " and userName like ?";
        content.push("%" + params.userName + "%");
        isMore = true;
    }
    if (params.posts) {
        if (isMore) {
            //true代表有多个参数
            sqlStr += "and posts like ?"; //and是两个条件都必须满足，or是或的关系
        } else {
            sqlStr += " WHERE posts LIKE ?";
        }
        content.push("%" + params.posts + "%");
    }
    if (params.pageNo || params.pageSize) {
        //开启分页
        sqlStr += " ORDER BY id DESC limit ?,?";
        content.push(...param);
    }
    conn.query(sqlStr, content, function (err, result) {
        if (err) {
            console.log("err", err.message);
            res.json({
                code: 1,
                message: "查询失败",
            });
        } else {
                    if (!params.userName && !params.posts) {
                        if(!params.permissions) {
                            result.splice(result.length - 1, 1);
                        }
                    }
                    res.json({
                        code: 0,
                        message: "success",
                        data: result,
                        pageing: {
                            pageNo: pageNo,
                            pageSize: pageSize,
                            total: result.length,
                        },
                    });
            //     }
            // });
        }
    });
    conn.end();
});
// 增加用户
router.post("/addUser", (req, res) => {
    let sqlStr = sql.user;
    let params;
    let conn = new DBHelper().getConn();
    conn.query(sql.sys.updateId, [], (err, result) => {});
    params = {
        userName: req.body.userName || "",
        passwd: req.body.passwd || "",
        loginName: req.body.loginName || "",
        email: req.body.email || "",
        phoneNumber: req.body.phoneNumber || "",
        address: req.body.address || "",
        permissions: req.body.permissions || "",
        posts: req.body.permissions == 1 ? "管理员" : "员工" || "",
        status: 1
    };
    if (params.userName == "") {
        return res.json({ code: 1, msg: "用户名不能为空" });
    } else if (params.passwd == "") {
        return res.json({ code: 1, msg: "密码不能为空" });
    } else if (params.loginName == "") {
        return res.json({ code: 1, msg: "登录名不能为空" });
    }
    conn.query(sqlStr.select, params.loginName, (err, result) => {
        if (result.length !== 0) {
            return res.json({ code: 1, msg: "登录账户已被使用" });
        } else if (result == undefined) {
            return res.json({ code: 1, msg: "输入错误" });
        }
        conn.query(sqlStr.insert, [params], (err, result) => {
            if (err) {
                return res.json({ code: 1, msg: "系统开小差" });
            } else {
                let data = {
                    code: 0,
                    data: "",
                    msg: "新增用户成功",
                };
                res.json(data);
            }
        });
        conn.end();
    });
    //     (async () => {
    //         try {
    //             // 第一次运行要同步数据库，若没有这个数据库则新建，有则检查表结构与model是否一致，使用sync()当不一致时不作任何更改，不存在破坏性
    //             // await Book.sync();
    //             await userAdd.save();
    //             console.log("保存成功");
    //         } catch(error) {
    //             console.log("操作失败！\n"+error)
    //         }
    //     })();
});
//更改用户状态
router.post("/changeUser", (req, res) => {
    let sqlStr = sql.sys;
    let params = req.body;
    let post = params.permissions == 1 ? "管理员" : "员工";
    let conn = new DBHelper().getConn();
    conn.query(
        sqlStr.updateUser,
        [params.permissions, post, params.id],
        (err, result) => {
            if (result) {
                let data = {
                    code: 0,
                    data: "",
                    msg: "修改成功",
                };
                res.json(data);
            } else {
                return res.json({ code: 1, msg: "密码错误" });
            }
        },
    );
    conn.end();
    //
});
//通过审核与否
router.post("/changeUserStatus", (req, res) => {
    let sqlStr = sql.sys;
    let params = req.body;
    let conn = new DBHelper().getConn();
    conn.query(
        sqlStr.passOrRefuseUser,
        [params.status, params.id],
        (err, result) => {
            if (result) {
                let data = {
                    code: 0,
                    data: "",
                    msg: "操作成功",
                };
                res.json(data);
            } else {
                return res.json({ code: 1, msg: "密码错误" });
            }
        },
    );
    conn.end();
    //
});

//编辑用户
router.post("/userEdit", (req, res) => {
    let sqlStr = sql.sys;
    let params = {
        userName: req.body.userName || "",
        passwd: req.body.passwd || "",
        loginName: req.body.loginName || "",
        email: req.body.email || "",
        phoneNumber: req.body.phoneNumber || "",
        address: req.body.address || "",
        permissions: req.body.permissions || "",
        posts: req.body.posts || "",

    };
    let conn = new DBHelper().getConn();
    conn.query(sql.user.select, params.loginName, (err, result) => {
        // console.log(req.body.id , result[0].id)
        if (result.length !== 0 && req.body.id !== result[0].id) {
            return res.json({ code: 1, msg: "登录账户已被使用" });
        } else if (result == undefined) {
            return res.json({ code: 1, msg: "输入错误" });
        }
        conn.query(sqlStr.userEdit, [params, req.body.id], (err, result) => {
            if (result) {
                let data = {
                    code: 0,
                    data: "",
                    msg: "修改成功",
                };
                res.json(data);
            } else {
                console.log(err);

                return res.json({ code: 1, msg: "修改失败" });
            }
        });
        conn.end();
    });
    //
});
//删除用户
router.post("/deleteUser", (req, res) => {
    let sqlStr = sql.sys;
    let params = req.body;
    let conn = new DBHelper().getConn();
    conn.query(sqlStr.deleteUser, [params.id], (err, result) => {
        if (result) {
            let data = {
                code: 0,
                data: "",
                msg: "成功删除",
            };
            res.json(data);
            conn.query(sqlStr.updateId, [], (err, result) => {
                // console.log(err,result)
            });
        } else {
            return res.json({ code: 1, msg: "错误" });
        }
        conn.end();
    });
    //
});
//重置密码
router.post("/resetPasswd", (req, res) => {
    let sqlStr = sql.sys;
    let params = req.body;
    let conn = new DBHelper().getConn();
    conn.query(
        sqlStr.updateUserPasswd,
        [params.newPasswd, params.id],
        (err, result) => {
            if (result) {
                let data = {
                    code: 0,
                    data: "",
                    msg: "重置成功",
                };
                res.json(data);
            } else {
                return res.json({ code: 1, msg: "错误" });
            }
            conn.end();
        },
    );
    //
});
module.exports = router;
