#上传接口

1.
创建游戏 creategame

http://192.168.31.104:8002/creategame
POST
{
	"userid":"100"
}

返回参数：error == null 表示无错误，否则有错
{
	"error":null,
	"gameid":7
}

2.
设置步数 setGameUserSteps

http://192.168.31.104:8002/setGameUserSteps
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

3.添加投篮记录  shotIn:0 表示没投进，1表示投进， 为1时必须有angle和distance参数

http://192.168.31.104:8002/addusershot

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
