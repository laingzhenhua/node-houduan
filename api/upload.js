const express=require("express");
const path=require("path");
// 引入路由模块
const uploadController=require("./uploadController");

// 调用express对象的路由方法来获取路由对象
const router=express.Router();

// 引入处理文件上传的模块
const upload=require("../config/uploadconfig");

//=======================路由拦截=============================

// 单文件上传
router.post("/uploadFile",upload.single("myFile"),uploadController.uploadFile);

// 多文件上传
router.post("/uploadFiles",upload.array("myFiles",6),uploadController.uploadFiles);
// 公开路由模块
module.exports=router;