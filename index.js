const fs = require("fs");
const https = require("https");
const client = require("prom-client");
let path = require("path");
// Create a Registry which registers the metrics
const register = new client.Registry();
// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: "clocktower-online"
});
const options = {};
// if (process.env.NODE_ENV !== "development") {
//   options.cert = fs.readFileSync("cert.pem");
//   options.key = fs.readFileSync("key.pem");
// }
const badyParser = require('body-parser');
const express = require('express');
const commionAPI = require('./api/commionAPI');
const userAPI = require('./api/userAPI');
const artListAPI = require('./api/artListAPI');
const sysAPI = require('./api/sys');
const reportApi = require('./api/reportApi');
const DBHelper = require('./utils/DBHelper');
// const models = require('./models/index');
// 引入路由模块
// 调用express对象的路由方法来获取路由对象
const router=express.Router();
const app = express();

// const multer = require('multer')
// app.use('/uploads', express.static(__dirname + '/public/uploads'));
// const upload = multer({dest: __dirname + '../uploads'})
//
//
// router.post('/upload',upload.array('files',6),  (req, res) => {
//   const file = req.file
//   file.url = `http://localhost:3001/server/uploads/${file.filename}`
//   console.log(req.file)
//   res.send(file)
// })
app.all("*",function(req,res,next){
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Credentials","true");
  //允许的header类型
  res.header("Access-Control-Allow-Headers","Origin, Content-Type, cache-control,postman-token,Cookie, Accept,SCREEN-RESOLUTION,X-DM-TOKEN,page-name");
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() == 'options')
    res.send(200);  //让options尝试请求快速结束
  else
    next();
})
let conn = new DBHelper().getConn();
// let ass = new models().db;
// app.use(badyParser.json());
// app.use(badyParser.urlencoded({
//   extended: false
// }));
app.use(badyParser.json({limit:'100mb'}));
app.use(badyParser.urlencoded({ limit:'100mb', extended: true }));
// var cors = require("cors");
// app.use(cors());
app.post("/postImg")
app.use('/', commionAPI);
app.use('/', userAPI);
app.use('/', artListAPI);
app.use('/', sysAPI);
app.use('/', reportApi);
/*开始*/
// var http = require('http').Server(app);
app.listen(8765, function() {
  console.log("listening on *:8765");
});
