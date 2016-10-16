var express = require('express');
var bodyParser = require('body-parser');
var async = require('async');
var app = express();
var server = require('http').createServer(app);
var PORT = process.env.PORT || 8002;
server.listen(PORT);
console.log('Server running.');

//连接mysql
var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database:'ballgame',
    port: 3306
});
conn.connect();
console.log("Connect Mysql Success");

//设定路由
//使用body-parser解析body参数
app.use(bodyParser.urlencoded({  
    extended: true
}));

/***创建比赛，获取id */
app.post('/creategame', function (req, res) {
    res.contentType('json');//返回的数据类型
    console.log("creategame called");
    console.log(req.body);
    if(req.body.userid == undefined){
        res.send(JSON.stringify({error:"请传递userid"}));
        return;
    }
    var userid = req.body.userid;
    var createsql = 'INSERT INTO gameHistory (createTime) VALUES ('+ new Date().getTime()+')';
    //创建一个比赛
    conn.query(createsql, function (err, result) {
        if (err){
            console.log(err);
            res.send(JSON.stringify({error:"error"}));
            return;
        };
        var gameid = result.insertId;
        var sqlsArray = [
            'INSERT INTO gameUserSteps (gameid,userid,steps) VALUES ('+gameid+',"'+userid+'",0)',
            'INSERT INTO gameUserShot (gameid,userid,shotSum) VALUES ('+gameid+',"'+userid+'",0)',
        ];
        //初始化比赛数据
        async.mapLimit(sqlsArray,sqlsArray.length,
            function (sql, finishCallback) {
                conn.query(sql, function (err, result) {
                    if (err){
                        console.log(err);
                        finishCallback(err);
                        return;
                    };
                    finishCallback(null,sql);
                });
            },
            function (err, result) {
                if(err){
                    console.log("error is:"+err);
                    res.send(JSON.stringify({error:"error"}));
                    return;
                }
                res.send(JSON.stringify({error:null,gameid:gameid}));
            }
        );
    });
});

/** 设置运动员步数*/
app.post('/setusersteps', function (req, res) {
    res.contentType('json');//返回的数据类型
    console.log("setusersteps called");
    console.log(req.body);
    if(req.body.gameid == undefined || req.body.userid == undefined || req.body.steps == undefined){
        res.send(JSON.stringify({error:"请求参数不完整"}));
        return;
    }
    var gameid = req.body.gameid;
    var userid = req.body.userid;
    var steps = req.body.steps;
    var sql = 'UPDATE gameUserSteps SET steps = '+steps+' where gameid='+gameid+' AND userid="'+userid+'"';
    console.log(sql);
    //select
    conn.query(sql, function (err, result) {
        if (err){
            console.log(err);
            res.send(JSON.stringify({error:"error"}));
            return;
        };
        console.log(result);
        res.send(JSON.stringify({error:null}));
    });
});

/** 更新运动员投篮参数*/
app.post('/addusershot', function (req, res) {
    res.contentType('json');//返回的数据类型
    console.log("addusershot called");
    console.log(req.body);
    if(req.body.gameid == undefined || req.body.userid == undefined || req.body.shotIn == undefined){
        res.send(JSON.stringify({error:"请求参数不完整"}));
        return;
    }
    if(req.body.shotIn == 1 && (req.body.angle == undefined || req.body.distance == undefined)){
        res.send(JSON.stringify({error:"请求参数不完整"}));
        return;
    }
    var gameid = req.body.gameid;
    var userid = req.body.userid;
    var shotIn = req.body.shotIn;
    var angle = req.body.angle;
    var distance = req.body.distance;
    var sql;
    if(shotIn == 0){
        sql = 'INSERT gameUserShotDetail (gameid,userid,shotIn) VALUES ('+gameid+',"'+userid+'",0)';
    }else{
        sql = 'INSERT gameUserShotDetail (gameid,userid,shotIn,angle,distance) VALUES ('+gameid+',"'+userid+'",1,'+angle+','+distance+')';
    }
    console.log(sql);
    //select
    var sqlsArray = [
            sql,
            'UPDATE gameUserShot SET shotSum=shotSum+1 where gameid='+gameid+' AND userid="'+userid+'"'
        ];
    //同步更新个人投篮总记录
    async.mapLimit(sqlsArray,sqlsArray.length,
        function (sql, finishCallback) {
            conn.query(sql, function (err, result) {
                if (err){
                    console.log(err);
                    finishCallback(err);
                    return;
                };
                finishCallback(null,sql);
            });
        },
        function (err, result) {
            if(err){
                console.log("error is:"+err);
                res.send(JSON.stringify({error:"error"}));
                return;
            }
            res.send(JSON.stringify({error:null}));
        }
    );
});

/** 设置运动员步数*/
app.get('/recentgame', function (req, res) {
    res.contentType('json');//返回的数据类型
    console.log("recentgame called");
    var sql = 'SELECT * FROM gameHistory ORDER BY id DESC';
    console.log(sql);
    //select
    conn.query(sql, function (err, result) {
        if (err){
            console.log(err);
            res.send(JSON.stringify({error:"error"}));
            return;
        };
        console.log(result[0]);
        var gameInfo = {
            error:null,
            gameid:result[0].id,
            createTime:result[0].createTime
        }
        res.send(JSON.stringify(gameInfo));
    });
});