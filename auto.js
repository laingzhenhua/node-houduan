//auto.js 自动重启
let process = require('child_process');
let fs = require('fs-extra');
let ChildProcess  = process.fork('./index.js');

ChildProcess.on('exit',function (code) {
    console.log('process exits + '+code);
    // fs.appendFileSync('./log.txt','线程退出');
    if(code !== 0){
        setTimeout(function auto() {
            process.fork('./auto.js')
        } ,3000)
        // process.fork('./auto.js');
    }
})