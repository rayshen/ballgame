#上传接口

##1.创建游戏 creategame

http://139.224.67.24:8002/creategame
POST
{
	"userid":"100"
}

返回参数：error == null 表示无错误，否则有错
{
	"error":null,
	"gameid":7
}

##2.设置步数 setGameUserSteps

http://139.224.67.24:8002/setGameUserSteps
POST
{
	"gameid":7,
	"userid":"100",
	"steps":100
}

返回参数：error == null 表示无错误，否则有错
{
	"error":null
}

##3.添加投篮记录  shotIn:0 表示没投进，1表示投进， 为1时必须有angle和distance参数

http://139.224.67.24:8002/addusershot

POST
{
	"gameid":7,
	"userid":"100",
	"shotIn":1,
	"angle":120,
	"distance":100
}

返回参数：error == null 表示无错误，否则有错
{
	"error":null
}


#查询接口

##1.查询最近场次的比赛

http://139.224.67.24:8002/recentgame

{
	error:null
	gameid:7,
	createTime:"147xxxxxx"
}


##2.查询某用户某个比赛的步数
http://139.224.67.24:8002/userSteps?gameid=7&userid=100
{
	error:null,
	steps:100
}