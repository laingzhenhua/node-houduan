// sql语句
var sqlMap = {
    common: {
        // 查询用户
        select: "select * from common",
    },
    user: {
        // 添加用户
        add: "insert into user(userName,passwd,loginName,email,phoneNumber,address,permissions) values (?,?,?,?,?,?,?)",
        // 查询用户
        select: "select * from user where loginName = ?",
        queryAll: "select * from user", // 查询所有用户
        queryByName: "select * from  user where userName=?", // 通过用户名索引查询用户
        queryByNamePassword: "select * from  user where userName = ? and passwd=?", // 通过用户名和密码索引查询用户
        insert: "insert into user set ?", // 插入新用户
        updateUser: "update user set passwd= ? where id = ?", // 更新用户信息
        deleteUser: "delete from user where userName=?", // 删除用户
        register: "insert into user set ?", // 审核用户表

    },
    art: {
        // add: 'insert into art(artName,oldArtName,description,artLocation,venuesName,artCode,oldArtCode,artAge,artFrom,artLevel,categoryRange,artCategory,weight,textureCategory,collectionDate,crippled,lang,widthOrHeight,authenticationInformation,custodyRemake,amount,completeDisability,fromMsg,handover,superintendent,recipient,entrant,remake) values (null,?, ?)',
        add: "insert into art set ?",
        update: "update art set ? where id = ?",
        getArtList:"SELECT * FROM ( SELECT * FROM art ORDER BY id DESC limit ?,?) as art left join t_url on art.id=t_url.artId left join files on art.id  = files.artId  left join artmsgurl on art.id = artmsgurl.artId  left join sealofthebook on art.id = sealofthebook.artId WHERE status < ? ", //列表
        getTopList: "SELECT status FROM art WHERE status = 4;SELECT status FROM art WHERE status = 5;SELECT status FROM art WHERE status = 6;", //ORDER BY id DESC
        getPendStockList: "SELECT * FROM  (art left join t_url on art.id=t_url.artId) left join files on art.id  = files.artId  left join artmsgurl on art.id = artmsgurl.artId  left join sealofthebook on art.id = sealofthebook.artId WHERE status = ? ", //查询待入库/出库/拒绝出库
        updateStatus: "update art set status= ?,agreeLibraryTime = ? where id = ?", //同意入库
        refuseInStatus: "update art set status= ?,refuseAgreeTime = ?, refuseAgreeRemake= ? where id = ?", //拒绝入库
        OutLibrary: "update art set status= ?,outLibraryTime = ?,applicant= ?  where id = ?", //申请出库
        agreeOutLibrary: "update art set status= ?,agreeOutLibraryTime = ? where id = ?", // 同意出库
        refuseOutStatus: "update art set status= ?,refuseOutTime = ? ,refuseOutRemake= ? where id = ?", //拒绝出库
        requestInLibrary: "update art set status= ?,inLibraryTime = ?,applicant= ? where id = ?",//申请入库
        requestOutLibrary: "update art set status= ?,outLibraryTime = ?,applicant= ? where id = ?",//申请出库
        lend: "insert into lendrecording set ?;update art set status= ? where id = ?",
        lookLend: "SELECT * FROM lendrecording WHERE artId = ? ORDER BY id DESC",
        returnArt: "update art set status= ? where id = ?",
        returnArtTime: "update lendrecording set actualReturnTime= ?,returnRemake = ? where id = ?",
        lookLendFile: "SELECT * FROM lendFiles WHERE lendId = ?",
        echartsData: "select  DATE_FORMAT(creatTime, '%m') as createDate,count(id) as count from art WHERE status=? and creatTime like ? group by createDate order by createDate limit 12",//入库出库统计
        echartstexture: "SELECT '泥' as textureCategory, count(id) as count  FROM art WHERE status = 0 and textureCategory= '泥';SELECT '陶' as textureCategory, count(id) as count FROM art WHERE status = 0 and textureCategory= '陶';SELECT '竹' as textureCategory ,count(id) as count FROM art WHERE status = 0 and textureCategory= '竹';",//质地类别
        echartsCrippled: "SELECT '完整' as crippled , count(id) as count FROM art WHERE status = 0 and crippled= '完整';SELECT '残缺' as crippled , count(id) as count FROM art WHERE status = 0 and crippled= '残缺';",
        echartsHeight: "SELECT * FROM lendFiles WHERE artId = ?",
        echartsYear: "",
        echartsWeight: "select weight as name,count(*) as value from (SELECT CASE  when weight>0 and weight<=10 then '0-10kg' when weight>10 and weight<=20 then '10-20kg'  when weight>20 and weight<=30 then '20-30kg'  else '30kg以上' END as weight from art ) a GROUP BY weight",
        echartsCollection: "select  DATE_FORMAT(creatTime, '%Y-%m') as name,count(id) as value from art group by name order by name limit 12",
        total: "select count(*) as total from art where status < 4",
        getDetail: "SELECT * FROM  (art left join t_url on art.id=t_url.artId) left join files on art.id  = files.artId  left join artmsgurl on art.id = artmsgurl.artId  left join sealofthebook on art.id = sealofthebook.artId where id = ?",
        deletePic: "update t_url set artId = null  where pathName=?",
        deleteFile: "update files set artId = null  where filePathName=?",
        classify: "select *  from classify"
    },
    sys: {
        /* 获得数据总条数 */
        total: "select count(*) as total from user",
        /* 假设每页显示10条，则直接进行除法运算，然后向上取整 */
        getUser: "select * from user ", //ORDER BY id DESC
        updateUser: "update user set permissions= ? , posts= ? where id = ?", // 更新用户信息
        passOrRefuseUser: "update user set status= ?  where id = ?", // 申请
        deleteUser: "delete from user where id=?", // 删除用户
        updateId: "SET @auto_id = -1;UPDATE user SET id = (@auto_id := @auto_id + 1);ALTER TABLE user AUTO_INCREMENT = 1;",
        updateUserPasswd: "update user set passwd=? where id = ?", // 更新用户密码
        userEdit: "update user set ? where id = ?"
    },
    index: {
        //按照时间筛选
        getList: "select * from test where date_format(create_time,'%Y-%m-%d') between '2019-03-05' and '2019-03-08';"
    }
};

module.exports = sqlMap;
