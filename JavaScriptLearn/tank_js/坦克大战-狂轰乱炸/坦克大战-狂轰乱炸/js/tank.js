		var BEIJING = "#000";
		var width = screen.width;
		var height = screen.height;
		var can = document.createElement("canvas");
		can.width = width * 0.85;
		can.height = height * 0.8;
		can.style.position = "absolute";
		can.style.backgroundColor = BEIJING;
		can.style.left = (width - can.width) / 2 + "px";
		document.body.appendChild(can);
		
		var g = can.getContext("2d");
		var UNIT 	= 0;		// 每个物体的编号
		var WOJUN 	= "我军";
		var QIANG 	= "墙";
		var CMD		= "指挥官";
		var DIJUN 	= "敌军";
		var ZIDAN	= "子弹";
		var DILEI	= "地雷";
		var DAOJU	= "道具";
		var TUPIAN	= "图片";
		var FEIJI	= "飞机";
		var DAODAN	= "炸弹";
		
		var TANK_W = 40;
		var TANK_H = 40;
		var DI_W = 40;
		var DI_H = 40;
		var WO_IMG = "img/wU.gif";
		var DI_IMG = "img/tankD.gif";
		
		var FJ_W = 80;
		var FJ_H = 80;
		var MM_W = 50;
		var MM_H = 70;
		var TP_W = 50;
		var TP_H = 50;
		var DJ_W = 24;
		var DJ_H = 24;
		
		var WALL_W = 30;
		var WALL_H = 30;
		var zhb = [];				// 保存8块指挥部的墙
		var kill  = [12, 17, 22, 27, 32];
		var def   = [0,   2,  5,  8, 10];
		var z1	  = [4, 6, 8, 10, 12];
		var z2 	  = [10,12,15,19, 22];
		var zt = ["未开始", "激战", "暂停", "胜利", "失败", "冰冻", "被冰冻", "无敌", "待复活"];
		var wallcount = 20;			// 墙块数量
		var enemycount = 18;		// 敌军数量
		var jianmie	= 0;			// 歼灭数量
		var zhuangtai = zt[0];		// 游戏默认状态 
		var kaishitimer = null;		// 开始文字闪烁的定时器
		var kaishicolor = false;
		var tempstate	= zt[1];	// 状态临时记录变量
		var bdtimer 	= null;		// 冰冻定时器
		var bdshijian	= 5;		// 冰冻时间(秒)
		var djshijian	= 9;		// 倒计时时间(秒)
		var djstimer	= null;		// 倒计时定时器
		var overy 		= 750;		// 游戏结束时的文字y轴
		var overtimer 	= null;		// 游戏结束时的文字定时器
		var shantimer 	= null;		// 无敌闪烁定时器
		var shan =		false;		// 是否闪烁
		var shanshijian = 3;		// 闪的时间
		var timer9		= null;		// 控制闪烁时间的定时器
		
		var gametime	= 180;		// 最开始的时间(秒)
		var gametimer 	= null;		// 游戏定时器
		
		var jifen 		= 0;		// 积分(杀死普通坦克得100分，英雄坦克得150分)
		var fjcount 	= 0;		// 飞机数量
		
		function Stage(){
			this.data = [];
		}
		
		Stage.prototype.add = function(o){
			this.data.push(o);	// 把对象o扔进数组
		}
		
		Stage.prototype.remove = function(o){
			var index = this.data.indexOf(o);
			if ( index != -1 ){
				this.data.splice(index, 1);		// 从数组中删除一个元素
			}
		}
		
		Stage.prototype.render = function(){	// 屏幕重复渲染
			var list = this.data;
			function loop(){
				// 清屏
//				g.fillStyle = BEIJING;
//				g.fillRect(0, 0, can.width , can.height );
				
				var bg = new Image();
				bg.src = "img/ditudark.jpg";
				g.drawImage(bg, 0, 0, can.width, can.height);
				
				huabeijing();	huaxinxi();	 huashuoming();		huazuozhe();
				huakaishi();	huajishi();	 huazanting();		huadaojishi();
				huaover();		huatime();		huajifen();		huashengli();
				
				list.forEach(function(o){
					o.show();
				});
				
				requestAnimationFrame(loop);
			}
			
			loop();
		}
		
		function huabeijing() {
//			var x = (can.width-90*4) / 2 , y = can.height/2 + 50;
//			g.fillStyle = "#333";
//			g.font = "90px 楷体";
//			g.fillText( "坦克大战", x, y );
		}
		
		function huaxinxi() {
			var x = 20, y = 30;
			g.fillStyle = "#DDD";
			g.font = "14px 微软雅黑";
			g.fillText( "敌军数量: " + enemycount, x, y );	x += 100;
			g.fillText( "歼灭数量: " + jianmie, x, y );	x += 100;
			g.fillText( "生命值: "   + wo.life, x, y );	x += 100;
			g.fillText( "复活机会: " + wo.fuhuo, x, y );	x += 100;
			g.fillText( "攻: " 		+ wo.gong, x, y );	x += 60;
			g.fillText( "防: " 		+ wo.fang, x, y );	x += 60;
			g.fillText( "移动速度: " + wo.speed, x, y );	x += 100;
			g.fillText( "可用地雷: " + wo.dilei, x, y );	x += 150;
			g.fillText( "游戏状态: " , x, y );	x += 70;
			g.fillStyle = "coral";
			g.fillText( zhuangtai, x, y );	x += 100;
		}
		
		function huashuoming() {
			var x = 30, y = 300;
			g.fillStyle = "#999";
			g.font = "18px 楷体";
			g.fillText( "操作说明", x + 15, y );			y += 25;
			g.font = "13px 宋体";
			g.fillText( "发射子弹: 空格", x, y );		y += 25;
			g.fillText( "暂停游戏: P", x, y );		y += 25;
			g.fillText( "复活坦克: R", x, y );		y += 25;
			g.fillText( "埋放地雷: B", x, y );		y += 25;
			g.fillText( "发大绝技: A(按一次失血3)", x, y );		y += 25;
		}
		
		function huazuozhe() {
			var x = 30, y = can.height-10;
			g.fillStyle = "#777";
			g.font = "13px 宋体";
			g.fillText( "作者QQ: 498357779", x, y );
		}
		
		function huakaishi() {
			if ( zhuangtai != zt[0] ) return;
			var x = (can.width-40*8.5) / 2 , y = can.height/2 - 80;
			if ( kaishicolor ) {
				g.fillStyle = "#FFF";
				g.font = "40px 黑体";
				g.fillText( "按【Y】键开始游戏", x, y );
			}
			
			var bg = new Image();
			bg.src = "img/bg1.gif";
			g.drawImage(bg, (can.width-900)/2, can.height-400-50, 900,400);
		}
		
		function huajishi() {
			if ( zhuangtai != zt[5] && zhuangtai != zt[6] ) return;
			var x = (can.width-50) / 2 , y = can.height - 180;
			g.fillStyle = zhuangtai == zt[6] ? "darkorange" : "aquamarine";
			g.font = "80px 黑体";
			g.fillText( bdshijian, x, y );
		}
		
		function huazanting() {
			if ( zhuangtai != zt[2] ) return;
			var x = (can.width-40*8.5) / 2 , y = can.height/2 - 80;
			g.fillStyle = "#F78";
			g.font = "40px 黑体";
			g.fillText( "按【P】键继续游戏", x, y );
		}
		
		function huadaojishi() {
			if ( zhuangtai != zt[8] ) return;
			var x = (can.width-150) / 2 , y = can.height - 280;
			g.fillStyle = zhuangtai == zt[6] ? "darkorange" : "aquamarine";
			g.font = "280px 黑体";
			g.fillText( djshijian, x, y );
		}
		
		function huaover() {
			if ( zhuangtai != zt[4] ) return;
			var x = (can.width-380) / 2;
			g.fillStyle = "red";
			g.font = "80px Consolas";
			g.fillText( "Game Over", x, overy );
		}
		
		function huatime() {
			var x = can.width-60, y = 30;
			g.fillStyle = "lightgreen";
			g.font = "18px 微软雅黑";
			g.fillText( gametime, x, y );
		}
		
		function huajifen() {
			var x = 20, y = 80;
			g.fillStyle = "aqua";
			g.font = "16px 微软雅黑";
			g.fillText( "积分: " + jifen, x, y );
		}
		
		function huashengli() {
			if ( zhuangtai != zt[3] ) return;
			var x = (can.width-80*9) / 2 , y = can.height/2 - 50;
			g.fillStyle = "lightcyan";
			g.font = "80px 楷体";
			g.fillText( "大吉大利  今晚吃鸡", x, y );
		}
		
		/**父类**/
		function Base(x, y, w, h, src, type) {
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
			this.src = src;				// 图片名
			this.type = type;			// 类别
			this.life = 100;			// 生命值
			this.index = UNIT ++;		// 唯一的编号
			this.img = new Image();
			this.img.src = this.src;
			this.show = function(){
				g.drawImage(this.img, this.x, this.y, this.w, this.h);
				if ( this.type == WOJUN || this.type == DIJUN || this.type == QIANG 
										|| this.type == CMD || this.type == FEIJI ){
					this.blood();
				}
			}
			this.die = function(){
				stage.remove(this);
				clearInterval(this.movetimer);
				if ( this.type == DIJUN || this.type == WOJUN || this.type == FEIJI ) {
					if ( this.life <= 0 ) {
						this.boom();
						bofang("bomb2.wav");
						if ( this.type == FEIJI ) {
							jifen += 180;
						}
					}
				} else if ( this.type == DAODAN ){
					this.w = 60; this.h = 60;	this.x -= this.w /2; this.y -= this.h /2;
					this.boom();
					bofang("bomb1.wav");
				}
				this.life = 0;
				if ( this.type == DIJUN ){
					enemycount --;
					jianmie ++;
					if ( enemycount == 0 && zhuangtai != zt[4] ){
						zhuangtai = zt[3];
						clearInterval(gametimer);
						bofang("winend.wav");
						bofang("bg.mp3");
					}
					clearInterval(this.kongzhitimer);
					jifen += this.hero ? 150 : 100;
				} else if ( this.type == WOJUN ){
					zhuangtai = wo.fuhuo > 0 ? zt[8] : zt[4];
					bofang("die.wav");
					if ( wo.fuhuo > 0 ){
						djstimer = setInterval(function(){
							djshijian --;	bofang("peng.wav");
							if ( djshijian == 0 ){
								clearInterval(djstimer);
								wo.fuhuo = 0;
								zhuangtai = zt[4];
								over();
							}
						}, 1100);
					} else {
						over();
					}
				} else if ( this.type == CMD ){
					wo.fuhuo = 0;
					wo.life = 0;
					wo.die();
					zhuangtai = zt[4];
					bofang("hithe.wav");
					bofang("hedan.wav");
					over();
				} else if ( this.type == QIANG ){
					bofang("zhahui.wav");
					this.boom();
				}
			}
		}
		
		function Dilei(tank) {
			var x = tank.x + (tank.w-DJ_W) / 2,	y = tank.y + (tank.h-DJ_H) / 2;
			var o = new Base(x-2, y-2, DJ_W + 2, DJ_H + 2, "img/x10.gif", DILEI);
			o.n = 10;
			return o;
		}
		
		function Daoju(tank, ishome) {
			var x = tank.x + (tank.w-DJ_W) / 2,	y = tank.y + (tank.h-DJ_H) / 2;
			var n = parseInt( Math.random() * 10 );
			while ( n == 5 && ishome ) {
				n = parseInt( Math.random() * 10 );
			}
			var o = new Base(x - 1, y - 1, DJ_W, DJ_H, "img/x"+ n + ".gif", DAOJU);
			o.n = n;
			return o;
		}
		
		function Baozha(tank){
			var x = tank.x - 5,	y = tank.y - 5;
			var o = new Base(x , y , tank.w + 10, tank.h+10, "img/b0.gif", TUPIAN);
			var i = 0;
			o.movetimer = setInterval( function(){
				if ( zhuangtai == zt[2] ) return;	// 爆炸效果暂停
				i ++;
				o.img.src = "img/b" + i + ".gif";
				if ( i == 8 ) {
					o.die();
					if ( tank.type != DILEI && tank.type != DAODAN ){
						var dj = new Daoju(o, tank.ishome);
						stage.add(dj);
					}
				}
			} , 120);
			return o;
		}
		
		function Zidan(tank) {
			var x = tank.x, y = tank.y;
			if ( tank.dir == "U" ){
				x += tank.w / 2 - 2; 	y -= 17;
			} else if ( tank.dir == "R" ){
				x += tank.w + 2; 	y += tank.h / 2 - 2;
			} else if ( tank.dir == "L" ){
				x -= 14; 			y += tank.h / 2 - 3;
			} else if ( tank.dir == "D" ){
				x += tank.w / 2 - 3; 	y += tank.h - 1;
			}
			
			if ( tank.dir == "D" ) {
				if ( tank.gong == 0 ){
					x += 1;
				} else if ( tank.gong == 3 ){
					x -= 2;
				} else if ( tank.gong == 4 ){
					x -= 3;
				}
			} else if ( tank.dir == "U" ) {
				if ( tank.gong == 1 ){
					x -= 1;
				} else if ( tank.gong == 2 ){
					x -= 2;
				} else if ( tank.gong == 3 ){
					x -= 3;  y -= 3;
				} else if ( tank.gong == 4 ){
					x -= 4;  y -= 8;
				}
			} else if ( tank.dir == "L" ) {
				if ( tank.gong == 3 ){
					x -= 5;  y -= 1;
				} else if ( tank.gong == 4 ){
					y -= 2;	x -= 10;
				}
			} else if ( tank.dir == "R" ) {
				if ( tank.gong == 2 ){
					y -= 1;
				} else if ( tank.gong == 3 ){
					y -= 2;
				} else if ( tank.gong == 4 ){
					y -= 4;
				}
			}
			
			var w = 0, h = 0;
			if ( tank.dir == "D" || tank.dir == "U" ) {
				w = z1[tank.gong];	h = z2[tank.gong];
			} else {
				w = z2[tank.gong];	h = z1[tank.gong];
			}
			
			var src = "img/m" + tank.gong + tank.dir + ".png";
			var o = new Base(x, y, w, h, src, ZIDAN);
			o.tank = tank;				// 记录子弹的发射者
			o.gong = kill[tank.gong];	// 子弹的伤害点数==坦克的等级对应的数字
			o.speed = 15;
			o.left  = tank.dir == "L";
			o.right = tank.dir == "R";
			o.up    = tank.dir == "U";
			o.down  = tank.dir == "D";
			o.movetimer = setInterval(yidong, 30);
			function yidong(){
				if ( zhuangtai == zt[2] ) return;
				var ox = o.x, oy = o.y;	// 保存移动前的旧坐标
				if ( o.left ){
					o.x -= o.speed;
				} else if ( o.right ){
					o.x += o.speed;
				} else if ( o.up ){
					o.y -= o.speed;
				} else if ( o.down ){
					o.y += o.speed;
				}
				if ( checkOut(o) ){		// 移动后，发现坐标超出范围，就死掉
					o.die();
				}
				var r = pengzhuang(o);
				if ( r.peng ){			// 是否发其他物体发生了碰撞，如果有就死掉
					o.die();
					r.o.shixue(o.gong);	// 调用被击中的对象的失血方法
					if ( r.o.type == WOJUN ){
						bofang("hits.wav");
					} else if ( r.o.type == CMD ){
						bofang("hithe.wav");
						bofang("hitcmd.wav");
					} else if ( r.o.type == QIANG ){
						bofang("di.wav");
					}
				}
			}
			return o;
		}
		
		function Youxuetiao(x, y, w, h, src, type) {
			var o = new Base(x, y, w, h, src, type);
			o.blood = function(){		// 绘制本对象的血条
				if ( o.life <= 0 ) return;
				g.fillStyle = "red";
				if ( o.life > 80 ) g.fillStyle = "springgreen";
				else if ( o.life > 60 ) g.fillStyle = "yellow";
				else if ( o.life > 40 ) g.fillStyle = "orangered";
				g.fillRect(o.x, o.y-5, o.life / 100 * o.w , 5);
			}
			o.shixue = function(many) {
				if ( zhuangtai == zt[7] && o.type == WOJUN ) return;
				o.life -= many;
				o.life += def[o.fang];
				if ( o.life <= 0 ) {
					o.die();
				}
			}
			return o;
		}
		
		function Daodan(fj){
			var x = fj.x + fj.w / 3 + 5,  y = fj.y + fj.h / 3;
			var w = fj.dir == "U" || fj.dir == "D" ? 25 : 50;
			var h = fj.dir == "U" || fj.dir == "D" ? 50 : 25;
			var src = "img/daodan" + fj.dir + ".png";
			
			y = fj.dir == "U" ? y + 30 : y;
			y = fj.dir == "D" ? y - 50 : y;
			x = fj.dir == "L" ? x + 40 : x;
			x = fj.dir == "R" ? x - 50 : x;
			
			var o = new Base(x, y, w, h, src, DAODAN);
			
			o.dir = fj.dir;
			o.speed = 2;
			o.left = fj.left;
			o.right = fj.right;
			o.up = fj.up;
			o.down = fj.down;
			o.gong = 30 + parseInt(Math.random()*30);
			o.ww = fj.dir == "U" || fj.dir == "D" ? 1 : 2;
			o.hh = fj.dir == "U" || fj.dir == "D" ? 2 : 1;		// 炸弹落地过程中变小的尺寸
			o.endw = fj.dir == "U" || fj.dir == "D" ? 5 : 10;	// 炸弹落地时停止变小的尺寸
			o.xx = fj.dir == "U" || fj.dir == "D" ? 1 : 0;
			o.yy = fj.dir == "U" || fj.dir == "D" ? 0 : 1;
			o.movetimer = setInterval(yidong, 50);
			function yidong(){
				if ( zhuangtai == zt[2] ) return ;
				if ( o.left ){
					o.x -= o.speed;
				} else if ( o.right ){
					o.x += o.speed;
				} else if ( o.up ){
					o.y -= o.speed;
				} else if ( o.down ){
					o.y += o.speed;
				}
				if ( checkOut(o) ){		// 移动后，发现坐标超出范围，就恢复为旧坐标
					o.die();
				}
				o.w -= o.ww; o.h -= o.hh;	// 落地前变小尺寸
				if ( o.dir == "L" || o.dir == "R" )
					o.x += o.xx; o.y += o.yy;
				if (o.w <= o.endw ) {
					o.die();
				}
			}
			
			o.boom = function(){
				var zd = new Baozha(o);
				stage.add(zd);
				var r = zhadanpengzhuang(o);
			}
			
			return o;
		}
		
		function Feiji () {
			var n = parseInt(Math.random() * 4 );	// 决定飞机的图
			var f = parseInt(Math.random() * 4 ); 	// 决定飞机的朝向
			var x = 200 + parseInt(Math.random() * (can.width - 400));
			var y = 100 + parseInt(Math.random() * (can.height - 200));
			var fx = "U";
			if ( f == 0 ) {							// 上
				y = can.height - FJ_H;
			} else if ( f == 1 ){					// 下
				y = 0;	fx = "D";
			} else if ( f == 2 ){					// 左
				x = can.width - FJ_W;	fx = "L";
			} else if ( f == 3 ){					// 右
				x = 0;	fx = "R";
			}
			var o = new Youxuetiao(x, y, FJ_W, FJ_H, "img/f" + n + fx + ".png", FEIJI);
			o.dir = fx;
			o.speed = 3;
			o.left  = fx == "L";
			o.right = fx == "R";
			o.up    = fx == "U";
			o.down  = fx == "D";
			o.fang = 0;
			o.c = 0;		// 投弹的频率控制
			o.movetimer = setInterval(yidong, 17);
			
			function yidong(){
				if ( zhuangtai == zt[2] || zhuangtai == zt[5] ) return ;
				if ( o.left ){
					o.x -= o.speed;
				} else if ( o.right ){
					o.x += o.speed;
				} else if ( o.up ){
					o.y -= o.speed;
				} else if ( o.down ){
					o.y += o.speed;
				}
				if ( o.x < -(o.w-10) || o.y < -(o.h-10) || o.x > can.width-10 || o.y > can.height-10){
					o.die();
					fjcount --;
				}
				
				o.c ++;
				if ( o.c % 40 == 0 && parseInt(Math.random()*100) % 2 == 0 ) {
					var dd = new Daodan(o);
					stage.add(dd);
					bofang("hongzha.wav");
				}
			}
			
			o.boom = function(){
				var zd = new Baozha(o);
				stage.add(zd);
				fjcount --;
			}
			
			return o;
		}
		
		
		function Command(x, y, fang ){
			var o = new Youxuetiao(x, y, MM_W, MM_H, "img/p1.gif", CMD);
			o.fang = fang;
			return o;
		}
		
		function Wall(x, y, fang) {
			var o = new Youxuetiao(x, y, WALL_W, WALL_H, "img/qiang.gif", QIANG);
			o.fang = fang;
			o.boom = function(){
				var zd = new Baozha(o);
				stage.add(zd);
			}
			return o;
		}
		
		function Tank(x, y, w, h, src, type, speed, gong, fang, dir, filename){
			var o = new Youxuetiao(x, y, w, h, src, type);
			o.speed = speed;
			o.gong = gong;
			o.fang = fang;
			o.dir = dir;		// 坦克的方向 UDLR 上下左右
			o.filename = filename;
			o.left = false;
			o.right = false;
			o.up = false;
			o.down = false;
			o.movetimer = setInterval(yidong, 40, o);
			
			o.toLeft = function(){
				o.dir = "L";	o.img.src = "img/" + o.filename + o.dir + ".gif";
				o.left = true;	o.right = false;	o.up = false;	o.down = false;
			}
			o.toRight = function(){
				o.dir = "R";	o.img.src = "img/" + o.filename + o.dir + ".gif";
				o.left = false;	o.right = true;	o.up = false;	o.down = false;
			}
			o.toUp = function(){
				o.dir = "U";	o.img.src = "img/" + o.filename + o.dir + ".gif";
				o.left = false;	o.right = false;	o.up = true;	o.down = false;
			}
			o.toDown = function(){
				o.dir = "D";	o.img.src = "img/" + o.filename + o.dir + ".gif";
				o.left = false;	o.right = false;	o.up = false;	o.down = true;
			}
			o.stopLeft = function(){
				o.left = false;
			}
			o.stopRight = function(){
				o.right = false;
			}
			o.stopUp = function(){
				o.up = false;
			}
			o.stopDown = function(){
				o.down = false;
			}
			o.fire = function(){
				if ( o.life <= 0 ) return;
				var zd = new Zidan(o);
				stage.add(zd);
			}
			o.boom = function(){
				var zd = new Baozha(o);
				stage.add(zd);
			}
			o.eat = function(dj){
				jiandaoju(o, dj);
			}
			return o;
		}
		function Wojun(x, y) {
			var o = new Tank(x, y, TANK_W, TANK_H, WO_IMG, WOJUN, 3, 0, 0, "U", "w");
			o.dilei = 2;
			o.fuhuo = 3;
			o.relife = function(){
				o.life = 100;
				o.gong = 1;
				o.fang = 0;
				o.speed = 4;
				o.dilei = 2;
				o.fuhuo --;
				o.left = false; o.right = false; o.up = false; o.down = false;
				// 检验坐标是否碰撞
				jiancha(o);
				stage.add(o);
				clearInterval(djstimer);
				djshijian = 9;
				o.movetimer = setInterval(yidong, 40, o);
				zhuangtai = zt[7];
				shantimer = setInterval(function(){
					shan = !shan;
					if ( shan ){
						stage.remove(o);
					} else {
						stage.add(o);
					}
				} , 20);
				timer9 = setInterval(function(){
					shanshijian --;
					if ( shanshijian == 0 ){
						jiancha(o);
						stage.remove(o);	stage.add(o);
						shanshijian = 3;	shan = false;				// 为下一次闪做准备
						clearInterval(shantimer);
						clearInterval(timer9);
						zhuangtai = enemycount > 0 ? zt[1] : zhuangtai;	// 恢复激战状态
					}
				}, 900);
			}
			
			o.mailei = function(){
				if ( o.dilei < 1 ) return;
				var lei = new Dilei(o);
				stage.add(lei);
				o.dilei --;
				bofang("bready.wav");
			}
			
			o.dajueji = function(){
				if ( o.life <= 3 ) return;
				o.life -= 3;	var fx = o.dir;
				o.dir = "U"; o.fire(o);
				o.dir = "L"; o.fire(o);
				o.dir = "R"; o.fire(o);
				o.dir = "D"; o.fire(o);
				o.dir = fx;
			}
			
			return o;
		}
		function Dijun(x, y) {
			var o = new Tank(x, y, DI_W, DI_H, DI_IMG, DIJUN, 3, 0, 0, "D", "tank");
			var n = parseInt(Math.random()*100);
			o.hero = n % 5 == 0;
			if ( o.hero ){	// 英雄坦克比较厉害，所以速度，攻防都较高
				o.speed = 4; o.gong = 2; o.fang = 2;
				o.filename = "d";
				o.img.src = "img/" + o.filename + o.dir + ".gif";
			}
			o.kongzhitimer = setInterval(function(){
				if ( zhuangtai == zt[0] || zhuangtai == zt[2] || zhuangtai == zt[5] )
					return;
				n = parseInt(Math.random()*100);
				if ( n % 39 == 0 ){		// 决定是否可以改变方向
					n = parseInt(Math.random()*4);
					if ( 0 == n ){
						o.toUp();
					} else if ( n == 1 ){
						o.toDown();
					} else if ( n == 2 ){
						o.toLeft();
					} else if ( n == 3 ){
						o.toRight();
					}
				}
				var k = parseInt(Math.random()*100);
				if ( k % 29 == 0 ){
					o.fire();
				}
			}, 30);
			return o;
		}
		
		function initWall(){
			var x = (can.width - wallcount * WALL_W) / 2;
			var y = 150;
			for ( var i = 0; i < wallcount; i ++ ){
				var o = new Wall(x, y, 2);
				stage.add(o);	x += WALL_W;
			}
		}
		
		function initEnemy(){
			var x = (can.width - enemycount * DI_W - enemycount * 5) / 2;
			var y = 80;
			for ( var i = 0; i < enemycount; i ++ ){
				var o = new Dijun(x, y);
				stage.add(o);	x += DI_W + 5;
			}
		}
		
		function initHome(){
			var x = mm.x - 35, y = mm.y - 35;
			var o = new Wall(x, y, 3);	o.ishome = true;
			stage.add(o);	x += WALL_W;		zhb.push(o);
			
			o = new Wall(x, y, 3);		o.ishome = true;
			stage.add(o);	x += WALL_W;		zhb.push(o);
			
			o = new Wall(x, y, 3);		o.ishome = true;
			stage.add(o);	x += WALL_W;		zhb.push(o);
			
			o = new Wall(x, y, 3);		o.ishome = true;
			stage.add(o);	x += WALL_W;		zhb.push(o);
			
			x = mm.x - 35, y = y + WALL_H;
			
			o = new Wall(x, y, 3);		o.ishome = true;
			stage.add(o);	x += WALL_W*3;		zhb.push(o);
			o = new Wall(x, y, 3);		o.ishome = true;
			stage.add(o);	x += WALL_W*3;		zhb.push(o);
			
			x = mm.x - 35, y = y + WALL_H;
			
			o = new Wall(x, y, 3);	o.h += 15;		o.ishome = true;
			stage.add(o);	x += WALL_W*3;		zhb.push(o);
			o = new Wall(x, y, 3);	o.h += 15;		o.ishome = true;
			stage.add(o);	x += WALL_W*3;		zhb.push(o);
		}
		
		function anxiaqu(){
			var c = event.keyCode;
			if ( c == 89 && zhuangtai == zt[0] ) {
				zhuangtai = zt[1];
				clearInterval(kaishitimer);
				bofang("kaipao.wav");
				gametimer = setInterval(function(){
					if ( zhuangtai == zt[2] ) return;
					gametime --;
					
					var n = parseInt(Math.random() * 100);
					if ( n % 3 == 0 ){
						if ( fjcount < 10 ){
							var fj = new Feiji();
							stage.add(fj);
							fjcount ++;
						}
					}
					
					if ( gametime == 0 ){
						mm.die();
						clearInterval(gametimer);
					}
				}, 1000);
			} else if ( c == 80 && zhuangtai != zt[0] ){
				if ( zhuangtai == zt[3] || zhuangtai == zt[4] || zhuangtai == zt[5] 
					|| zhuangtai == zt[6] || zhuangtai == zt[8]) return;
				zhuangtai = zhuangtai == zt[2] ? zt[1] : zt[2];		// 暂停和恢复游戏
				if ( zhuangtai == zt[2] ){
					wo.left = false; wo.right = false; wo.up = false; wo.down = false;
				}
			}
			if ( zhuangtai == zt[0] || zhuangtai == zt[2] || zhuangtai == zt[4]  
						|| zhuangtai == zt[6] || zhuangtai == zt[8] || zhuangtai == zt[3] ){
				return;
			}
			if ( c == 37 ){
				wo.toLeft();
			} else if ( c == 38 ){
				wo.toUp();
			} else if ( c == 39 ){
				wo.toRight();
			} else if ( c == 40 ){
				wo.toDown();
			}
		}
		
		function songkai(){
			var c = event.keyCode;
			if ( c == 82 && zhuangtai == zt[8] ){
				wo.relife();
			}
			if ( zhuangtai == zt[0] || zhuangtai == zt[2] || zhuangtai == zt[4]  
						|| zhuangtai == zt[6] || zhuangtai == zt[8] ){
				return;
			}
			if ( c == 37 ){
				wo.stopLeft();
			} else if ( c == 38 ){
				wo.stopUp();
			} else if ( c == 39 ){
				wo.stopRight();
			} else if ( c == 40 ){
				wo.stopDown();
			} else if ( c == 32 ){
				if ( wo.life <= 0 ) return;
				wo.fire();
				bofang("attack.mp3");
			} else if ( c == 66 ){
				wo.mailei();
			} else if ( c == 65 ){
				wo.dajueji();
			}
		}
		
		/**检查o对象是否超出屏幕范围**/
		function checkOut(o){
			return o.x < 0 || o.y < 0 || o.x > can.width - o.w || o.y > can.height - o.h;
		}
		
		
		/**当前物体o与界面上所有物体的碰撞检验**/
		function pengzhuang(o){
			var r = new Object();
			r.peng = false;
			var list = stage.data;
			for ( var i in list ){
				var m = list[i];
				if ( m.index == o.index ) continue;					// 避开自己与自己的碰撞
				if ( m.type == TUPIAN ) continue;					// 避开子弹与图片的碰撞
				if ( m.type == DAODAN ) continue;					// 避开与炸弹的碰撞
				if ( o.type == WOJUN && m.type == ZIDAN ) continue;	// 避开坦克与子弹的碰撞
				if ( o.type == DIJUN && m.type == ZIDAN ) continue;	// 避开坦克与子弹的碰撞
				if ( o.type == ZIDAN && m.type == ZIDAN ) continue;	// 避开子弹与子弹的碰撞
				if ( o.type == ZIDAN && m.type == DAOJU ) continue;	// 避开子弹与道具的碰撞
				if ( o.type == WOJUN && m.type == DILEI ) continue;	// 避开我军与地雷的碰撞
				if ( o.type == ZIDAN && m.type == DILEI ) continue;	// 避开子弹与地雷的碰撞
				
				if ( o.type == DIJUN && m.type == FEIJI ) continue;	// 避开敌军与飞机的碰撞
				if ( o.type == WOJUN && m.type == FEIJI ) continue;	// 避开我军与飞机的碰撞
				if ( o.type == FEIJI ) 					 continue;	// 避开飞机与墙的碰撞
				if ( o.type == ZIDAN && o.tank.type == DIJUN && m.type == FEIJI ) continue;	// 避开敌人子弹与飞机的碰撞
				if ( o.type == ZIDAN && o.tank.type == DIJUN && m.type == DIJUN) continue;	// 避开子弹与盟军的碰撞
				if ( hitForRectangle(o, m) ) {
					r.peng = true;
					r.o = m;
					return r;
				}
			}
			return r;
		}
		
		/**炸弹伤害碰撞**/
		function zhadanpengzhuang(o){
			var r = new Object();
			r.peng = false;
			var list = stage.data;
			for ( var i in list ){
				var m = list[i];
				if ( m.index == o.index ) continue;					// 避开自己与自己的碰撞
				if ( m.type == TUPIAN ) continue;					// 避开子弹与图片的碰撞
				if ( m.type == DAODAN ) continue;					// 避开与炸弹的碰撞
				if ( o.type == WOJUN && m.type == ZIDAN ) continue;	// 避开坦克与子弹的碰撞
				if ( o.type == DIJUN && m.type == ZIDAN ) continue;	// 避开坦克与子弹的碰撞
				if ( o.type == ZIDAN && m.type == ZIDAN ) continue;	// 避开子弹与子弹的碰撞
				if ( o.type == ZIDAN && m.type == DAOJU ) continue;	// 避开子弹与道具的碰撞
				if ( o.type == WOJUN && m.type == DILEI ) continue;	// 避开我军与地雷的碰撞
				if ( o.type == ZIDAN && m.type == DILEI ) continue;	// 避开子弹与地雷的碰撞
				
				if ( o.type == DIJUN && m.type == FEIJI ) continue;	// 避开敌军与飞机的碰撞
				if ( o.type == WOJUN && m.type == FEIJI ) continue;	// 避开我军与飞机的碰撞
				if ( o.type == FEIJI ) 					 continue;	// 避开飞机与墙的碰撞
				if ( o.type == ZIDAN && o.tank.type == DIJUN && m.type == FEIJI ) continue;	// 避开敌人子弹与飞机的碰撞
				if ( o.type == ZIDAN && o.tank.type == DIJUN && m.type == DIJUN) continue;	// 避开子弹与盟军的碰撞
				if ( hitForRectangle(o, m) ) {
					r.peng = true;
					r.o = m;
					if ( r.o.type == WOJUN ){
						r.o.shixue(o.gong);
					} else if ( r.o.type == DIJUN || r.o.type == QIANG || r.o.type == CMD ) {
						r.o.shixue(r.o.fang + 15);	// 被炸的失血5
					}
				}
			}
			return r;
		}
		
		/**
		 * 矩形物体碰撞检验
		 * @param {Object} o1
		 * @param {Object} o2
		 */
		function hitForRectangle(o1,o2){
			if ( o1.x < o2.x )
			{
				if ( o2.x - o1.x <= o1.w ){
					if ( o1.y < o2.y ){
						return o2.y - o1.y <= o1.h;
					} else if ( o1.y > o2.y ){
						return o1.y - o2.y <= o2.h;
					} else 
						return o1.y == o2.y;
				}
			} else if ( o1.x > o2.x )
			{
				if ( o1.x - o2.x <= o2.w ){
					if ( o1.y < o2.y ){
						return o2.y - o1.y <= o1.h;
					} else if ( o1.y > o2.y ){
						return o1.y - o2.y <= o2.h;
					} else 
						return o1.y == o2.y;
				}
			} else {
				if ( o1.y < o2.y ){
					return o2.y - o1.y <= o1.h;
				} else if ( o1.y > o2.y ){
					return o1.y - o2.y <= o2.h;
				} else 
					return o1.y == o2.y;
			}
		 	return false;
		}
		
		function bofang(src){
			var audio = new Audio();
			audio.src = "sounds/" + src;
			audio.play();
		}
		
		function jiandaoju(o, dj){
			dj.die();
			if ( dj.n == 0 ){						// 提速
				o.speed ++;
				o.speed = o.speed > 7 ? 7 : o.speed;
				if ( o.type == WOJUN )	bofang("speed.wav");
			} else if ( dj.n == 1 ){				// 奖励生命和多出敌人
				if ( o.type == WOJUN ){
					o.fuhuo ++;
					o.fuhuo = o.fuhuo > 6 ? 6 : o.fuhuo;
					createNewEnemy(2);
				} else {
					createNewEnemy(5);
				}
				if ( o.type == WOJUN )	bofang("prop.mp3");
			} else if ( dj.n == 2 ){				// 冰冻对方
				if ( zhuangtai == zt[7] ) return;
				if ( o.type == WOJUN ){
					changeState(zt[5]);
					bofang("daxiao.wav");
				} else {
					changeState(zt[6]);
					bofang("ice.wav");
				}
			} else if ( dj.n == 3 ){				// 火力升级
				o.gong ++;
				o.gong = o.gong > 4 ? 4 : o.gong;
				if ( o.type == WOJUN )	bofang("prop.wav");
			} else if ( dj.n == 4 ){				// 防御升级
				o.fang ++;
				o.fang = o.fang > 4 ? 4 : o.fang;
				if ( o.type == WOJUN )	bofang("yongbao.wav");
			} else if ( dj.n == 5 ){				// 加固指挥部
				if ( o.type == WOJUN ){
					zhihuibu(20);
					bofang("yongbao.wav");
				} else {
					zhihuibu(-20);
				}
			} else if ( dj.n == 6 ){				// 加血
				o.life += 30;
				o.life = o.life > 100 ? 100 : o.life;
				if ( o.type == WOJUN )	bofang("prop.wav");
			} else if ( dj.n == 7 ){				// 失血
				if ( zhuangtai == zt[7] && o.type == WOJUN ) return;
				o.life -= (parseInt(Math.random() * 30) + 60);
				if ( o.life <= 0 ) {
					o.die();
				}
				bofang("bomb1.wav");
			} else if ( dj.n == 8 ){				// 给指挥官加血
				if ( o.type == WOJUN ){
					mm.life += 30;
					mm.life = mm.life > 100 ? 100 : mm.life;
					bofang("yongbao.mp3");
				} else {
					jiaxue();
					createNewEnemy(4);
				}
			} else if ( dj.n == 9 ){				// 加地雷2颗
				if ( o.type == WOJUN ){
					o.dilei += 2;
					o.dilei = o.dilei > 10 ? 10 : o.dilei;
					bofang("prop.wav");
				} else {
					shengfang();
					createNewEnemy(3);
				}
			}
		}
		
		function jiaxue(){
			var list = stage.data;
			for ( var i = 0; i < list.length; i ++ ){
				if ( list[i].type == DIJUN ){		// 给所有敌军加血
					list[i].life += 10 + parseInt(Math.random()*20);
					list[i].life = list[i].life > 100 ? 100 : list[i].life;
				}
			}
		}
		
		function shengfang(){
			var list = stage.data;
			for ( var i = 0; i < list.length; i ++ ){
				if ( list[i].type == DIJUN ){		// 给所有敌军升防
					list[i].fang ++;
					list[i].fang = list[i].fang > 4 ? 4 : list[i].fang;
				}
			}
		}
		
		function createNewEnemy(count){
			if ( enemycount > 27 ) return;
			for ( var i = 0; i < count; i ++ ){
				var x = parseInt(Math.random() * (can.width -200)) + 80;
				var y = parseInt(Math.random() * (can.height-150)) + 50;
				var o = new Dijun(x, y);
				var r = pengzhuang(o);
				while ( r.peng ){
					x = parseInt(Math.random() * (can.width -200)) + 80;
					y = parseInt(Math.random() * (can.height-150)) + 50;
					o.x = x; o.y = y;
					r = pengzhuang(o);
				}
				stage.add(o);
			}
			enemycount += count;
			gametime += 50;
			bofang("newenemy.wav");
		}
		
		function zhihuibu(xue){
			for ( var i in zhb ){
				if ( xue > 0 && zhb[i].life <= 0 ){
					stage.add(zhb[i]);
				}
				zhb[i].life += xue;
				zhb[i].life = zhb[i].life > 100 ? 100 : zhb[i].life;
				if ( zhb[i].life <= 0 ){
					zhb[i].die();
				}
			}
		}
		
		function changeState(st){
			if ( zhuangtai == zt[3] || zhuangtai == zt[4] || zhuangtai == zt[8]
					|| zhuangtai == zt[5] || zhuangtai == zt[6] ) return;
			tempstate = zhuangtai;			// 记录一下冰冻以前的状态
			zhuangtai = st;
			// 启动解冻定时器
			bdtimer = setInterval(function(){
				bdshijian --;
				if ( bdshijian <= 0 ){
					bdshijian = 5;
					clearInterval(bdtimer);
					zhuangtai = zhuangtai == zt[5] || zhuangtai == zt[6] ? tempstate : zhuangtai; 
				}
			}, 1000);
		}
		
		function over(){
			if ( overtimer == null ) {
				overtimer = setInterval(function(){
					overy -= 10;
					if ( overy <= can.height / 2) {
						clearInterval(overtimer);
					}
				}, 50);
			}
			bofang("lost.wav");
		}
		
		function yidong(o){
			if ( zhuangtai == zt[2] ) return ;
			if ( o.type == DIJUN ){
				if ( zhuangtai == zt[0] || zhuangtai == zt[5] ) {
					return;
				}
			} else {
				if ( zhuangtai == zt[6] ) {
					o.left = false; o.right = false; o.up = false; o.down = false;
					return;
				}
			}
			var ox = o.x, oy = o.y;	// 保存移动前的旧坐标
			if ( o.left ){
				o.x -= o.speed;
			} else if ( o.right ){
				o.x += o.speed;
			} else if ( o.up ){
				o.y -= o.speed;
			} else if ( o.down ){
				o.y += o.speed;
			}
			if ( checkOut(o) ){		// 移动后，发现坐标超出范围，就恢复为旧坐标
				o.x = ox;	o.y = oy;
			}
			var r = pengzhuang(o);
			if ( r.peng ){			// 是否发其他物体发生了碰撞，如果有就恢复为旧坐标
				if ( r.o.type == DAOJU ){
					o.eat(r.o);		// 吃道具
				} if ( r.o.type == DILEI ) {
					r.o.die();
					var bz = new Baozha(r.o);
					stage.add(bz);
					var m = 40 + parseInt(Math.random() * 55);
					o.shixue(m);
					bofang("hedan.wav");
				} else {
					o.x = ox;	o.y = oy;
				}
			}
		}
		
		function jiancha(o){
			var r = pengzhuang(o);
			while ( r.peng && (r.o.type == DIJUN || r.o.type == QIANG ) ) {
				if ( o.x > can.width/2 ) {
					o.x -= 10;
				} else {
					o.x += 10;
				}
				if ( o.y > can.height/2 ){
					o.y -= 10;
				} else {
					o.y += 10;
				}
				r = pengzhuang(o);
			}
		}
		
		// 定义一个存储器对象
		var stage = new Stage();
		
		var wo = new Wojun(300, 600);
		wo.gong = 1;	wo.speed = 4;
		var mm = new Command((can.width-MM_W)/2, (can.height-MM_H), 2);
		
		stage.add(mm);
		
		// 构造一排障碍墙
		initWall();
		
		// 构造一排敌军
		initEnemy();
		
		// 构造指挥部
		initHome();
		
		stage.add(wo);
		stage.render();
		
		kaishitimer = setInterval(function(){ kaishicolor = ! kaishicolor }, 400);

		addEventListener("keydown", anxiaqu);
		addEventListener("keyup", songkai);
		setTimeout(function(){ bofang("start.mp3");}, 200);