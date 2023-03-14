const express = require('express');
const router = express.Router();
const DBHelper = require('../utils/DBHelper');
const sql = require('../sqlMap');
// const ar = require("element-ui/src/locale/lang/ar");

//报表---月度入库
router.post('/monthPendReport', function (req, res) {
    let arr = [
        {createDate:"01" , count: 0},
        {createDate:"02" , count: 0},
        {createDate:"03" , count: 0},
        {createDate:"04" , count: 0},
        {createDate:"05" , count: 0},
        {createDate:"06" , count: 0},
        {createDate:"07" , count: 0},
        {createDate:"08" , count: 0},
        {createDate:"09" , count: 0},
        {createDate:"10" , count: 0},
        {createDate:"11" , count: 0},
        {createDate:"12" , count: 0},

    ]
    let conn = new DBHelper().getConn();
    let params = req.body;
    let sqlStr = sql.art.echartsData;
    let connect = "%"+params.year+"%"

    conn.query(sqlStr, [0, connect], function (err, result) {
        if (err) {
            console.log('err', err.message)
            res.json({
                code: 1,
                message: '数据错误'
            })
        } else {
            for( let i of result) {
                arr.map(item => {

                    i.createDate == item.createDate ? item.count = i.count :""
                })
            }
            let arr1 =[]
            arr.forEach(item=> {
                arr1.push(item.count)
            })
            res.json({
                code: 0,
                message: "success",
                data: arr1,
            })
            conn.end();
        }
    })
})

router.post('/monthOutReport', function (req, res) {
    let arr = [
        {createDate:"01" , count: 0},
        {createDate:"02" , count: 0},
        {createDate:"03" , count: 0},
        {createDate:"04" , count: 0},
        {createDate:"05" , count: 0},
        {createDate:"06" , count: 0},
        {createDate:"07" , count: 0},
        {createDate:"08" , count: 0},
        {createDate:"09" , count: 0},
        {createDate:"10" , count: 0},
        {createDate:"11" , count: 0},
        {createDate:"12" , count: 0},

    ]
    let conn = new DBHelper().getConn();
    let params = req.body;
    let sqlStr = sql.art.echartsData;
    let connect = "%"+params.year+"%"
    conn.query(sqlStr, [1, connect], function (err, result) {
        if (err) {
            console.log('err', err.message)
            res.json({
                code: 1,
                message: '数据错误'
            })
        } else {
            for( let i of result) {
                arr.map(item => {
                    i.createDate == item.createDate ? item.count = i.count :""
                })
            }
            let arr1 =[]
            arr.forEach(item=> {
                arr1.push(item.count)
            })
            res.json({
                code: 0,
                message: "success",
                data: arr1,
            })
            conn.end();
        }
    })
})
//不同质地
router.get('/echartstexture', function (req, res) {
    let conn = new DBHelper().getConn();
    // let params = req.body;
    let sqlStr = sql.art.echartstexture;
    conn.query(sqlStr, [], function (err, result) {
        if (err) {
            console.log('err', err.message)
            res.json({
                code: 1,
                message: '数据错误'
            })
        } else {
            let arr = result.map(item => {
               return {  value:  item[0].count, name: item[0].textureCategory  }
            })
            res.json({
                code: 0,
                message: "success",
                data: arr,
            })
            conn.end();
        }
    })
})
//完残程度
router.get('/echartsCrippled', function (req, res) {
    let conn = new DBHelper().getConn();
    // let params = req.body;
    let sqlStr = sql.art.echartsCrippled;
    conn.query(sqlStr, [], function (err, result) {
        if (err) {
            console.log('err', err.message)
            res.json({
                code: 1,
                message: '数据错误'
            })
        } else {
            let arr = result.map(item => {
                return {  value:  item[0].count, name: item[0].crippled  }
            })
            res.json({
                code: 0,
                message: "success",
                data: arr,
            })
            conn.end();
        }
    })
})
//年代
router.get('/echartsYear', function (req, res) {
    let conn = new DBHelper().getConn();
    // let params = req.body;
    let sqlStr = sql.art.echartsYear;
    let year = ["夏","商","周","秦朝","汉朝","三国","晋朝","十六国","南北朝","隋朝","唐朝","五代十国","宋","元","明","清","近代","现代","其他"]
    // year.forEach(item => {
        sqlStr = "select count(*) as count, artAge from  art where status = 0  group by artAge "
    // })
    conn.query(sqlStr, [], function (err, result) {
        if (err) {
            console.log('err', err.message)
            res.json({
                code: 1,
                message: '数据错误'
            })
        } else {
            let arr = result.map(item => {
                return {  value:  item.count, name: item.artAge  }
            })
            res.json({
                code: 0,
                message: "success",
                data: arr,
            })
            conn.end();
        }
    })
});
//重量
router.get('/echartsWeight', function (req, res) {
    let conn = new DBHelper().getConn();
    // let params = req.body;
    let sqlStr = sql.art.echartsWeight;
    // let year = ["夏","商","周","秦朝","汉朝","三国","晋朝","十六国","南北朝","隋朝","唐朝","五代十国","宋","元","明","清","近代","现代","其他"]
    // year.forEach(item => {
    //     sqlStr += `SELECT '${item}' as artAge , count(id) as count FROM art WHERE status = 0 and artAge= '${item}';`
    // })
    conn.query(sqlStr, [], function (err, result) {
        if (err) {
            console.log('err', err.message)
            res.json({
                code: 1,
                message: '数据错误'
            })
        } else {
            let arr = [];
            result.map(item=> {
                item.name == '0-10kg' ? arr.push(item) :  item.name == '10-20kg' ? arr.push(item) : item.name == '20-30kg' ? arr.push(item) :  item.name == '30kg以上' ? arr.push(item) : ""
            })
            res.json({
                code: 0,
                message: "success",
                data: arr,
            })
            conn.end();
        }
    })
})
//入藏时间
router.get('/echartsCollection', function (req, res) {
    let conn = new DBHelper().getConn();
    // let params = req.body;
    let sqlStr = sql.art.echartsCollection;
    // let year = ["夏","商","周","秦朝","汉朝","三国","晋朝","十六国","南北朝","隋朝","唐朝","五代十国","宋","元","明","清","近代","现代","其他"]
    // year.forEach(item => {
    //     sqlStr += `SELECT '${item}' as artAge , count(id) as count FROM art WHERE status = 0 and artAge= '${item}';`
    // })
    conn.query(sqlStr, [], function (err, result) {
        if (err) {
            console.log('err', err.message)
            res.json({
                code: 1,
                message: '数据错误'
            })
        } else {
            let arr = []
            let  arr1 = []
            console.log(result)
            result.forEach(item => {
                arr.push(item.name);
                arr1.push(item.value);
            })
            let allArr = {
                yxais: arr1,
                xxais: arr
            }
            res.json({
                code: 0,
                message: "success",
                data: allArr,
            })
            conn.end();
        }
    })
})
module.exports = router;