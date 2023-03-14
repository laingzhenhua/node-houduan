const express = require('express');
const router = express.Router();
let jwt = require("jsonwebtoken")
const DBHelper = require('../utils/DBHelper');
let conn = new DBHelper().getConn();
const fileController={
    uploadFile(req,resp){// 单文件上传
        // console.log(req.file.filename);
        let pathName="uploads/"+req.file.filename;// 路径名
        let fileName=(req.file.originalname).split(".")[0]; // 文件名
        conn.query("insert into t_url values (?,?,?)", // mysql语句，存入数据库
            [null,pathName,fileName],// 数据库中t_url表格有三列，第一列为自增，所以写null
            (err,data)=>{
                if(!err){
                    resp.send("上传成功！");
                }
            })
    },
    uploadFiles(req,resp){// 多文件上传
        // console.log(req);
        for(let i = 0; i < req.files.length; i ++) {
            let pathName = "uploads/" + req.files[i].filename;// 路径名
            let fileName = (req.files[i].originalname).split(".")[0];// 文件名
            conn.query("insert into t_url values (?,?,?)", // mysql语句，存入数据库
                [null, pathName,fileName],// 数据库中t_url表格有三列，第一列为自增，所以写null
                (err, data) => {
                    // console.log(data);
                    // console.log(err);
                    if (!err) {
                        if (i==req.files.length-1){
                            resp.send("上传成功！");
                        }
                    }
                })
        }
    }
};
module.exports=fileController;