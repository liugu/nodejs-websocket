//websocket.js
// 搭建websocket服务器
const ws = require("nodejs-websocket");
const _server = ws.createServer(conn => {
	// 接收客户端返回的数据
	conn.on("text", function(str) {
		console.log(str, "接收客户端传过来的值");

        if(str==='ping'){
            conn.send('pong')
        }
		
	});

    //客户端关闭连接
	conn.on("close", function() {
		console.log("客户端已关闭连接");
		
	});

	conn.on("error", function(err) {
		//error
		console.log(err, "连接报错");
	});
});
// 定义端口为2002【端口自己随意定义】
const port = 2002;
_server.listen(port, function() {
	console.log("连接成功")
	console.log('listening on websocketServer');
})
