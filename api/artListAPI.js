const express = require("express");
const router = express.Router();
let jwt = require("jsonwebtoken");
const DBHelper = require("../utils/DBHelper");
const sql = require("../sqlMap");
const md5 = require("md5");
// 调用express对象的路由方法来获取路由对象
// 引入处理文件上传的模块
//=======================路由拦截=============================
function CurentTime(val) {
    var now = new Date();
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日

    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
    var clock = "";
    if(val) {
         clock = year + "-";

        if(month < 10)
            clock += "0";
        clock += month + "-";
        if(day < 10)
            clock += "0";
        clock += day + " ";
    }else {
        clock = year + "-";

        if(month < 10)
            clock += "0";
        clock += month + "-";
        if(day < 10)
            clock += "0";
        clock += day + " ";
    }
    if(hh < 10)
        clock += "0";

    clock += hh + ":";
    if (mm < 10) clock += '0';
    clock += mm;
    return(clock);
}
function unlink(arr) {
    return arr.filter(function (item, index, arr) {
        //当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
        return arr.indexOf(item, 0) === index;
    });
}
//查询列表
router.post('/getArtList', function (req, res) {
    let conn = new DBHelper().getConn();
    const pageNo = req.body.pageNo  //当前的num
    const pageSize = req.body.pageSize  //当前页的数量
    const param = [(parseInt(pageNo -1)) * parseInt(pageSize), parseInt(pageSize)]
    const params = req.body;
    let sqlStr = sql.art.getArtList;
    let content = [...param,4];
    let isMore = false;//是否有多个查询参数
    if(params.artName){
        // 模糊查询两种方法直接在SQL语句后加 mysql.escape("%"+req.body.name+"%")
        // sql += " WHERE product_name LIKE "+mysql.escape("%"+req.body.name+"%")
        sqlStr += " and artName like ?";
        content.push('%'+params.artName+'%');
    }
    if(params.status!= undefined ){
         if(params.status !== "") {
                sqlStr += " and status = ?";//and是两个条件都必须满足，or是或的关系
                content.push(params.status);
            }
    }
    if(params.pageNo || params.pageSize) {//开启分页
        // sqlStr += " and id >= ? ";//and是两个条件都必须满足，or是或的关系
        // sqlStr += " ";
    }
    console.log(sqlStr,content);
    conn.query(sqlStr, content, function (err, result) {
        if (err) {
            console.log('err', err.message)
            res.json({
                code: 1,
                message: '查询失败'
            })

        } else {
            conn.query(sql.art.total, function (error, among) {
                if (error) {
                    console.log(error);
                } else {
                    let total = among[0].total  //查询表中的数量
                    var beforeData = result;      //将dataArr赋值给beforeData  也可直接操作dataArr
                    let tempArr = [];
                    let afterData = [];//新数组
                    async function updataArr() {
                        for (let i = 0; i < beforeData.length; i++) {
                            if (tempArr.indexOf(beforeData[i].id) === -1) {
                                afterData.push({
                                    ...result[i],
                                    pathName: [beforeData[i].pathName],
                                    fileName: [beforeData[i].fileName],
                                    filePathName: [beforeData[i].filePathName],
                                    AnxFileName: [beforeData[i].AnxFileName],
                                    sealofthebookName: [beforeData[i].sealOfTheBookfileName],
                                    sealofthebookPathName: [beforeData[i].sealOfTheBookpathName],
                                    rememberTheInscriptionfileName: [beforeData[i].rememberTheInscriptionfileName],
                                    rememberTheInscriptionpathName: [beforeData[i].rememberTheInscriptionpathName]
                                });
                                tempArr.push(beforeData[i].id);
                            } else {
                                for (let j = 0; j < afterData.length; j++) {
                                    if (afterData[j].id == beforeData[i].id) {
                                        afterData[j].pathName.push(beforeData[i].pathName);
                                        afterData[j].fileName.push(beforeData[i].fileName);
                                        afterData[j].filePathName.push(beforeData[i].filePathName);
                                        afterData[j].AnxFileName.push(beforeData[i].AnxFileName);
                                        afterData[j].sealofthebookName.push(beforeData[i].sealofthebookName);
                                        afterData[j].sealofthebookPathName.push(beforeData[i].sealofthebookPathName);
                                        afterData[j].rememberTheInscriptionfileName.push(beforeData[i].rememberTheInscriptionfileName);
                                        afterData[j].rememberTheInscriptionpathName.push(beforeData[i].rememberTheInscriptionpathName);
                                        break;
                                    }
                                }
                            }
                        }
                        afterData.map(item => {
                            item.pathName = unlink(item.pathName);
                            item.fileName= unlink(item.fileName);
                            item.filePathName = unlink(item.filePathName);
                            item.AnxFileName = unlink(item.AnxFileName)
                            item.sealofthebookName = unlink(item.sealofthebookName);
                            item.sealofthebookPathName = unlink(item.sealofthebookPathName)
                            item.rememberTheInscriptionfileName = unlink(item.rememberTheInscriptionfileName);
                            item.rememberTheInscriptionpathName = unlink(item.rememberTheInscriptionpathName)
                        })
                        await res.json({
                            code: 0,
                            message: "success",
                            data: afterData,
                            pageing: {
                                pageNo: pageNo,
                                pageSize: pageSize,
                                total: total
                            }
                        })
                    }
                    updataArr()
                    //循环afterData并且合并name值用逗号隔开
                    // afterData.map((item) => {
                    //     item.name = item.name.join(",");
                    // })
            }
            })

        }
        conn.end();
    })
})
//查看详情
router.post('/getDetail', function (req, res) {
    let conn = new DBHelper().getConn();
    const params = req.body;
    let sqlStr = sql.art.getDetail;
    let content = [params.id];
    conn.query(sqlStr, content, function (err, result) {
        if (err) {
            console.log('err', err.message)
            res.json({
                code: 1,
                message: '查询失败'
            })

        } else {
            var beforeData = result;      //将dataArr赋值给beforeData  也可直接操作dataArr
            let tempArr = [];
            let afterData = [];//新数组
            async function updataArr() {
                for (let i = 0; i < beforeData.length; i++) {
                    if (tempArr.indexOf(beforeData[i].id) === -1) {
                        afterData.push({
                            ...result[i],
                            pathName: [beforeData[i].pathName],
                            fileName: [beforeData[i].fileName],
                            filePathName: [beforeData[i].filePathName],
                            AnxFileName: [beforeData[i].AnxFileName],
                            sealofthebookName: [beforeData[i].sealOfTheBookfileName],
                            sealofthebookPathName: [beforeData[i].sealOfTheBookpathName],
                            rememberTheInscriptionfileName: [beforeData[i].rememberTheInscriptionfileName],
                            rememberTheInscriptionpathName: [beforeData[i].rememberTheInscriptionpathName]

                        });
                        tempArr.push(beforeData[i].id);
                    } else {
                        for (let j = 0; j < afterData.length; j++) {
                            if (afterData[j].id == beforeData[i].id) {
                                afterData[j].pathName.push(beforeData[i].pathName);
                                afterData[j].fileName.push(beforeData[i].fileName);
                                afterData[j].filePathName.push(beforeData[i].filePathName);
                                afterData[j].AnxFileName.push(beforeData[i].AnxFileName);
                                afterData[j].sealofthebookName.push(beforeData[i].sealofthebookName);
                                afterData[j].sealofthebookPathName.push(beforeData[i].sealofthebookPathName);
                                afterData[j].rememberTheInscriptionfileName.push(beforeData[i].rememberTheInscriptionfileName);
                                afterData[j].rememberTheInscriptionpathName.push(beforeData[i].rememberTheInscriptionpathName);
                                break;
                            }
                        }
                    }
                }
                afterData.map(item => {
                    item.pathName = unlink(item.pathName);
                    item.fileName= unlink(item.fileName);
                    item.filePathName = unlink(item.filePathName);
                    item.AnxFileName = unlink(item.AnxFileName)
                    item.sealofthebookName = unlink(item.sealofthebookName);
                    item.sealofthebookPathName = unlink(item.sealofthebookPathName)
                    item.rememberTheInscriptionfileName = unlink(item.rememberTheInscriptionfileName);
                    item.rememberTheInscriptionpathName = unlink(item.rememberTheInscriptionpathName)
                })
                await res.json({
                    code: 0,
                    message: "success",
                    data: afterData[0],
                })
            }
            updataArr()

        }
        conn.end();
    })
})
//
router.get('/getTopList', function (req, res) {
    let conn = new DBHelper().getConn();
    let sqlStr = sql.art.getTopList;
    conn.query(sqlStr, [], function (err, result) {
        if (err) {
            console.log('err', err.message)
            res.json({
                code: 1,
                message: '查询失败'
            })
        } else {
            let total = {
                pendingStockArea: result[0].length,
                outStockArea: result[1].length,
                refuse: result[2].length,
            }  //查询表中的数量
            res.json({
                code: 0,
                message: "success",
                data: total,
            })
        }
    })
    conn.end();
})
//
router.get('/getOutStockList', function (req, res) {
    let conn = new DBHelper().getConn();
    let sqlStr = sql.art.getPendStockList;
    sqlStr += "ORDER BY outLibraryTime DESC "
    conn.query(sqlStr, [5], function (err, result) {
        if (err) {
            console.log('err', err.message)
            res.json({
                code: 1,
                message: '查询失败'
            })
        } else {
            var beforeData = result;      //将dataArr赋值给beforeData  也可直接操作dataArr
            let tempArr = [];
            let afterData = [];//新数组
            async function updataArr() {
                for (let i = 0; i < beforeData.length; i++) {
                    if (tempArr.indexOf(beforeData[i].id) === -1) {
                        afterData.push({
                            ...result[i],
                            pathName: [beforeData[i].pathName],
                            fileName: [beforeData[i].fileName],
                            filePathName: [beforeData[i].filePathName],
                            AnxFileName: [beforeData[i].AnxFileName]

                        });
                        tempArr.push(beforeData[i].id);
                    } else {
                        for (let j = 0; j < afterData.length; j++) {
                            if (afterData[j].id == beforeData[i].id) {
                                afterData[j].pathName.push(beforeData[i].pathName);
                                afterData[j].fileName.push(beforeData[i].fileName);
                                afterData[j].filePathName.push(beforeData[i].filePathName);
                                afterData[j].AnxFileName.push(beforeData[i].AnxFileName);
                                break;
                            }

                        }

                    }

                }
                afterData.map(item => {
                    item.pathName = unlink(item.pathName);
                    item.fileName= unlink(item.fileName);
                    item.filePathName = unlink(item.filePathName);
                    item.AnxFileName = unlink(item.AnxFileName)
                })
                await res.json({
                    code: 0,
                    message: "success",
                    data: afterData,
                })
            }
            updataArr()

        }
    })
    conn.end();
})
//
router.post('/requestInLibrary', function (req, res) {
    let conn = new DBHelper().getConn();
    let params = req.body;
    let sqlStr = sql.art.requestInLibrary;
    let requestInLibraryTime = CurentTime()
    conn.query(sqlStr, [4,requestInLibraryTime,params.applicant,params.id], function (err, result) {
        if (err) {
            console.log('err', err.message)
            res.json({
                code: 1,
                message: '申请入库失败'
            })
        } else {
            res.json({
                code: 0,
                message: "success",
                data: "",
            })
        }
        conn.end();
    })
})
//
router.post('/lookLend', function (req, res) {
    let conn = new DBHelper().getConn();
    let params = req.body;
    let sqlStr = sql.art.lookLend;
    conn.query(sqlStr, [params.id], function (err, result) {
        if (err) {
            console.log('err', err.message)
            res.json({
                code: 1,
                message: '申请出借失败'
            })
        } else {
            res.json({
                code: 0,
                message: "success",
                data: result,
            })
        }
        conn.end();
    })
})
//导出excel

module.exports = router;
