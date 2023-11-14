// //serverUrl心跳机制
		// let socketUrl = 'wss://echo.websocket.org1';
		let socketUrl = 'ws://localhost:2002';
		//保存websocket对象
		let socket;
		// reConnect函数节流标识符
		// 避免重新连接
		let flag = true;
		//心跳机制
		let heart = {
			timeOut: 3000,
			timeObj: null,
			serverTimeObj: null,
			start: function() {
				console.log('start');
				let self = this;
				//清除延时器
				this.timeObj && clearTimeout(this.timeObj);
				this.serverTimeObj && clearTimeout(this.serverTimeObj);
				this.timeObj = setTimeout(function() {
					//这里发送一个心跳，后端收到后，返回一个心跳消息，
					//onmessage拿到返回的心跳就说明连接正常
					socket.send('ping'); //发送消息，服务端返回信息，即表示连接良好，可以在socket的onmessage事件重置心跳机制函数
					//定义一个延时器等待服务器响应，若超时，则关闭连接，重新请求server建立socket连接
					self.serverTimeObj = setTimeout(function() {
						socket.close();
						reConnect(socketUrl);
					}, self.timeOut)
					// console.log(self.serverTimeObj,"000");
				}, this.timeOut)
				// console.log(this.timeObj,"???");
			}
		}
		//建立websocket连接函数
		function createWebsocket(url) {
			try {
				socket = new WebSocket(url);
				init();
				
			} catch (e) {
				//进行重连;
				console.log('websocket连接错误');
				reConnect(socketUrl);
			}
		}

		//对WebSocket各种事件进行监听   
		function init() {

			socket.onopen = function() {
				//连接已经打开
				//重置心跳机制
				console.log(event.data, "连接已经打开");
				heart.start();
			}
			socket.onmessage = function(event) {
				//通过event.data获取server发送的信息
				//对数据进行操作
				console.log(event.data, "对数据进行操作");
				//收到消息表示连接正常，所以重置心跳机制
				heart.start();
			}
			socket.onerror = function() {
				//报错+重连
				console.log('socket连接出错');
				reConnect(socketUrl);
			}
			socket.onclose = function() {
				console.log('socket连接关闭');
			}
		}

		//重连函数
		//因为重连函数会被socket事件频繁触发，所以通过函数节流限制重连请求发送
		function reConnect(url) {
			if (!flag) {
				return;
			}
			flag = false;
			//没连接上会一直重连，设置延迟避免请求过多
			setTimeout(function() {
				console.log("123");
				createWebsocket(url);
				flag = true;
			}, 3000)
		}
		createWebsocket(socketUrl)
		// 第一步创建WebSocket连接，
		// 第二步，调用init，封装各种监听事件
		// 第三步，发生错误，重连；

		//        没有错误，正常连接，重置心跳机制
		
