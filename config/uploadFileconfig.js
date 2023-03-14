const multer=require("multer"); // 引入multer模块

//文件上传模块的配置
const storage=multer.diskStorage({
    destination:function (req,file,cb) {
        // console.log(file);
        cb(null,"./public/uploadFiles");// 保存上传的文件的路径
    },
    filename:function (req,file,cb) {
        // console.log(file);
        let fileFormat=(file.originalname).split(".");
        // 保存上传的文件的名称
        cb(null,fileFormat[0]+"-"+Date.now()+"."+fileFormat[fileFormat.length-1]);
    }
});
//将配置匹配给multer对象
const upload=multer({
    storage:storage
});
//公开配置
module.exports=upload;