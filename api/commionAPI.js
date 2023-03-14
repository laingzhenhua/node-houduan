const express = require('express');
const router = express.Router();
let jwt = require("jsonwebtoken")
const DBHelper = require('../utils/DBHelper');
const sql = require('../sqlMap');
const md5 = require("md5");
// 分类下拉
router.post('/classify', (req, res) => {
    let sqlStr = sql.art.classify;
    let params = req.body;
    let conn = new DBHelper().getConn();
    conn.query(sqlStr, [], (err, result) => {
        if (err) {
            res.json(err);
        } else {
            let data = {
                code: 0,
                data: result,
                msg: "",
            };
            res.json(data);
        }
    });
    conn.end();
});
module.exports = router;