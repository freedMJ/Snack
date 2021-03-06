		//var time=500;
		//生成食物自调用函数
		(function(){
			//存放生成的食物小方块
			var elements=[];
			//生成食物构造函数
			//x,y:食物的横纵坐标；width：食物的宽；heigh：食物的高；color：食物的背景颜色；
			function Food(x,y,width,height,color){
				this.x=0;
				this.y=0;
				this.width=width||20;
				this.height=height||20;
				this.color=color||"green";
			};
			//初始化食物形状以及食物位置----map：地图对象
			Food.prototype.init=function(map){
				//初始化时先删除所有的食物小方块再创建
				delFood();
				var div=document.createElement("div");
				div.style.width=this.width+"px";
				div.style.height=this.height+"px";
				div.style.backgroundColor=this.color;
				div.style.position="absolute";
				//设置食物的横纵坐标
				var x=parseInt(Math.random()*map.offsetWidth/this.width)*this.width;
				var y=parseInt(Math.random()*map.offsetHeight/this.height)*this.height;
				this.x=x;
				this.y=y;
				console.log(x+"===="+y);
				div.style.left=this.x+"px";
				div.style.top=this.y+"px";
				//添加div对象到map对象中
				map.appendChild(div);
				//把生成的div添加进elements数组中
				elements.push(div);
			}
			//私有函数，删除food保证map中只能存在一个food
			function delFood(){
				for(var i=0;i<elements.length;i++){
					var ele=elements[i];
					ele.parentNode.removeChild(ele);
					elements.splice(i,1);
				}
			}
			window.Food=Food;
		}());
		
		//生成小蛇自调用函数
		(function(){
			//定义一个数组存放生成的小方块
			var elements=[];
			//生成小蛇构造函数
			function Snack(width,height,direction){
				this.width=width||20;
				this.height=height||20;
				this.direction=direction ||"right";
				this.body=[
					{x:3,y:2,color:"red"},
					{x:2,y:2,color:"yellow"},
					{x:1,y:2,color:"yellow"}
				];
			}
			//初始化小蛇形状及位置
		Snack.prototype.init=function(map){
			//每次都把小蛇删掉保正只有一条小蛇
			remove();
			for(var i=0;i<this.body.length;i++){
				var div=document.createElement("div");
				map.appendChild(div);
				div.style.width=this.width+"px";
				div.style.height=this.height+"px";
				div.style.left=this.body[i].x*this.width+"px";
				div.style.top=this.body[i].y*this.height+"px";
				div.style.backgroundColor=this.body[i].color;
				div.style.position="absolute";
				elements.push(div);
			}
			//定义小蛇移动函数
			//direction：方向
			Snack.prototype.move=function(food,map){
				
				var i=this.body.length-1;//从2开始倒叙
				for(;i>0;i--){
					this.body[i].x=this.body[i-1].x;
					this.body[i].y=this.body[i-1].y;
					
				}
				//移动头：this.body[0]代表头
				switch(this.direction){
					case "upp": //向上
						this.body[0].y-=1;
					break;
					case "down": //向下
					this.body[0].y+=1;
					;break;
					case "left"://向左
					this.body[0].x-=1;
					break;
					case "right"://向右 
						this.body[0].x+=1;
					break;
				}
				//判段是否吃到食物
				var headX=this.body[0].x*this.width;
				var headY=this.body[0].y*this.height;
				//如果头坐标等于食物坐标，尾部加一个方块
				if(food.x==headX&&food.y==headY){
					var last=this.body[this.body.length-1];
					this.body.push({
						x:last.x,
						y:last.y,
						color:last.color
					});
					food.init(map);
				}
			};
			//定义一个私有函数删除生成的小蛇保证只有一个小蛇
			function remove(){
				var i=elements.length-1;
				for(;i>=0;i--){
					var ele=elements[i];
					ele.parentNode.removeChild(ele);
					elements.splice(i,1);
				}
			}
			
		}
		window.Snack=Snack;
		}());
		//游戏对象自调用函数
		(function(){
			var that=null;
			//游戏对象构造函数
			function Game(map,time){
				this.time=time;
				this.map=map;
				//创造食物对象
				this.food=new Food();
				this.snack=new Snack();
				that=this;
			}
			//添加小蛇初始化方法
			Game.prototype.init=function(){
				//初始化食物显示出来
				this.food.init(this.map);
				//初始化小蛇显示出来
				this.snack.init(this.map);
				//调用小蛇移动方法
				this.runMove(this.food,this.map);
				//调用键盘按下事件
				this.bindKey();
			}
			//添加移动小蛇方法
			Game.prototype.runMove=function(food,map){
				var timeId=setInterval(function(){
					this.snack.move(food,map);
					this.snack.init(map);
					//最大横，纵坐标值
					var maxX=map.offsetWidth/this.snack.width;
					console.log(maxX)
					var maxY=map.offsetHeight/this.snack.height;
					//小蛇头的坐标
					var headX=this.snack.body[0].x;
					var headY=this.snack.body[0].y;
					if(headX<-1 ||headX>=maxX){
						
						clearInterval(timeId);
						alert("游戏结束");
						document.getElementById("begin").style.display="none";
						document.getElementById("newGame").style.display="block";
						document.getElementById("return").style.display="block";
						
					}
					if(headY<-1||headY>=maxY){
						
						clearInterval(timeId);
						alert("游戏结束");
					    document.getElementById("begin").style.display="none";
						document.getElementById("newGame").style.display="block";
						document.getElementById("return").style.display="block";
					}
					
				}.bind(that),this.time);
			}
			//添加键盘按下方法
			//上下左右：38，40，37，39；
			Game.prototype.bindKey=function(){
				document.addEventListener("keydown",function(e){
					switch(e.keyCode){
						case 38:this.snack.direction="upp";break;
						case 40:this.snack.direction="down";break;
						case 37:this.snack.direction="left";break;
						case 39:this.snack.direction="right";break;
					}
				}.bind(that),false);
			}
			window.Game=Game;
		}());
		//var gm=new Game(document.querySelector(".map"));
		//开始游戏
		document.getElementById("begin").onclick=function(){
			var time=document.getElementById("time").value || 200;
				var gm=new Game(document.querySelector(".map"),time);
			     gm.init();
		}
		//重新开始
		document.getElementById("newGame").onclick=function(){
			 document.getElementById("begin").style.display="block";
			 document.getElementById("time").value="";
						document.getElementById("newGame").style.display="none";
						document.getElementById("return").style.display="none";
		}
		