//页面滑动
function Swipe(container) {
		//获取第一个子节点
		var element=container.find(":first");
		
		//滑动对象
        var swipe = {};

		//li页面数量
		var slides=element.find("li");
		
		//获取容器尺寸
		var width=container.width();
		var height=container.height();
		
		//设置li页面总宽度
		element.css({
			width:(slides.length*width)+"px",
			height:height+"px"
		});
		
		//设置每个li的总宽度
		$.each(slides,function(index){
			var slide=slides.eq(index);
			slide.css({
				width:width+'px',
				height:height+'px'
			});
		});
		
		//监控完成与移动
        swipe.scrollTo = function(x, speed) {
        //执行动画移动
        element.css({
            'transition-timing-function' : 'linear',
            'transition-duration'        : speed + 'ms',
            'transform'                  : 'translate3d(-' + x + 'px,0px,0px)'
        });
        return this;
        };
        return swipe;
}
// JavaScript Document
//****小孩走路，BoyWalk****
		
		function BoyWalk(){
			var container = $('#content');
			//页面可是区域
			var visualWidth = container.width();
            var visualHeight = container.height();
			
			//获取数据
			var getValue = function(className){
				var $elem=$(''+className+'')
				//走路的路线坐标
				return{
					height:$elem.height(),
					top:$elem.position().top
				};
			};
					
			//路的Y轴 路的中间位置
			var pathY = function(){
				var data = getValue('.a_background_middle');
				return data.top + data.height/2;
			};
					
			var $boy = $("#boy");
			var boyWidth = $boy.width();
			var boyHeight = $boy.height();
					
			//修正小男孩的正确位置,25是修正值
			$boy.css({
				top:pathY()-boyHeight+25+'px'
			});
			
			//******小男孩路径动画的处理******
			
			// 暂停走路
			function pauseWalk() {
			   $boy.addClass('pauseWalk');
			}
			
			//恢复走路
			function restoreWalk(){
				$boy.removeClass('pauseWalk');
			}
			
			//css3的动作处理
			function slowWalk(){
				$boy.addClass('slowWalk');
			}
			
			//计算移动距离
			function calculateDist(direction, proportion) {
				return (direction == "x" ?
					visualWidth : visualHeight) * proportion;
			}
			//用transition做过渡
			function startMove(options,moveTime){
				var dfdPlay=$.Deferred();
				//取消暂停，恢复走路
				restoreWalk();
				//过渡的属性
				$boy.transition(options,moveTime,'linear',
							  function() {
								  dfdPlay.resolve(); // 动画完成
							  });
				return dfdPlay;
			}
			
			//开始走路
			function startWalk(time,distX,distY){
				time=time||3000; 
				//脚开始动
				slowWalk();
				//开始走路
				var d1=startMove({
					'left':distX+'px',
					'top':distY ? distY : undefined
				},time);
				return d1;
			}
			
			var instanceX;
			var instanceY;
			//走进商店
			function walkToShop(runTime){
			   var defer = $.Deferred();
			   var doorObj=$('.door');
			   //门的坐标
			   var offsetDoor =doorObj.offset(); //用于获取对象的坐标
			   var doorOffsetLeft = offsetDoor.left;
			   var doorOffsetTop = offsetDoor.top;
			   //小男孩的坐标
			   var posBoy = $boy.position();
               var boyPoxLeft = posBoy.left;
               var boyPoxTop = posBoy.top;
			   // 中间位置
               var boyMiddle = $boy.width() / 2;
               var doorMiddle = doorObj.width() / 2;
               var doorTopMiddle = doorObj.height() / 2;
			   
			   //当前需要移动的距离
			   instanceX = (doorOffsetLeft+doorMiddle)-(boyPoxLeft+boyMiddle);
			   //instanceY = boyPoxTop + boyHeight - doorOffsetTop + (doorTopMiddle);
			   
			   //开始走路
			   var walkPlay = startMove({
				   transform: 'translateX(' + instanceX + 'px),scale(0.5,0.5)',
				   opacity:0.1
				   },runTime);
			   //走路完毕
			   walkPlay.done(function(){
				  $boy.css({
					  opacity:0
				  })
				  defer.resolve();
			   })
			   return defer;
			}
			
			//走出商店
			function walkOutShop(runTime){
				var defer = $.Deferred();
				restoreWalk();
				//开始走路
				var walkPlay =startMove({
					transform:'translateX('+instanceX+'px),translateY(0),scale(1,1)',
					opacity:1
				},runTime);
				//走路完毕
				walkPlay.done(function(){
					defer.resolve();
				});
				return defer;
			}
			
			//买花
			function talkFlower() {
				  // 增加延时等待效果
				  var defer = $.Deferred();
				  setTimeout(function() {  //JavaScript中见过的基础，定时器
					  // 取花
					  $boy.addClass('slowFlowerWalk');
					  defer.resolve();
				  }, 1500);
				  return defer;
			  }
			
			return {
				//开始走路 
				walkTo: function(time,proportionX,proportionY){
					var distX = calculateDist('x',proportionX);
					var distY = calculateDist('y',proportionY);
					return startWalk(time,distX,distY);
				},
				
				//走进商店
				toShop: function(){
					return walkToShop.apply(null,arguments)
				},
				
				//走出商店
				outShop: function(){
					return walkOutShop.apply(null,arguments)
				},
				
				//停止走路
				stopWalk: function(){
					pauseWalk();
				},
				
				setColoer: function(value){
					$boy.css('background-color',value);
				},
				
				// 获取男孩的宽度
				getWidth: function() {
					return $boy.width();
				},
				// 复位初始状态
				resetOriginal: function() {
					this.stopWalk();
					// 恢复图片
					$boy.removeClass('slowWalk slowFlowerWalk').addClass('boyOriginal');
				},
			    // 转身动作
				rotate: function(callback) {
					restoreWalk();
					$boy.addClass('boy-rotate');
					// 监听转身完毕
					if (callback) {
				   	   $boy.on(animationEnd, function() {
						 callback();
						 $(this).off();
						 })
					  }
				},
				// 买花
				talkFlower: function() {
					return talkFlower();
				},
				setFlowerWalk:function(){
                    $boy.addClass('slowFlowerWalk');
                }
			};
  }

      // 动画结束事件
       var animationEnd = (function() {
           var explorer = navigator.userAgent;
           if (~explorer.indexOf('WebKit')) {
               return 'webkitAnimationEnd';
           }
           return 'animationend';
       })();
	  // swipe.scrollTo(visualWidth * 2,0);
	   
	   
	   //****************************
	   //*****页面三动作***************
	   //****************************
			// 获取数据
		  var container = $("#content");
		  var swipe = Swipe(container);
		      visualWidth = container.width();
	          visualHeight = container.height();	
		  var getValue = function(className) {
			  var $elem = $('' + className + '')
			  // 走路的路线坐标
			  return {
				  height: $elem.height(),
				  top: $elem.position().top
			  };
		  };
		  // 桥的Y轴
		  var bridgeY = function() {
			  var data = getValue('.c_background_middle');
			  return data.top;
		  }();
		  var girl = {
			elem: $('.girl'),
			getHeight: function() {
				return this.elem.height();
			},
			// 转身动作
			rotate: function() {
				this.elem.addClass('girl-rotate');
			},
			setOffset: function() {
				this.elem.css({
					left: visualWidth / 2,
					top: bridgeY - this.getHeight()
				});
			},
			getOffset: function() {
				return this.elem.offset();
			},
			getWidth: function() {
				return this.elem.width();
			}
		};
	  // 修正小女孩位置
	  girl.setOffset();
	  //***logo动画
		var logo = {
            elem: $('.logo'),
            run: function() {
               this.elem.addClass('logolightSpeedIn')
                  .on(animationEnd, function() {
                     $(this).addClass('logoshake').off();
                  });
               }
        };
	    //雪花
		  var snowflakeURL =['images/snowflake/snowflake1.png',
		                     'images/snowflake/snowflake2.png',
							 'images/snowflake/snowflake3.png',
							 'images/snowflake/snowflake4.png',
							 'images/snowflake/snowflake5.png',
							 'images/snowflake/snowflake6.png'
							 ]//注意数组的初始化用的是方括号[]
		  //***飘雪花效果
		  function snowflake(){
			  //雪花容器
			  var $flakeContainer=$('#snowflake');
			  //随机六张图
			  function getImagesName(){
				  return snowflakeURL[Math.floor(Math.random()*6)];
			  }
			  //创建一个雪花元素
			  function createSnowBox(){
				  var url =getImagesName();
				  return $('<div class="snowbox" />').css({
						'width': 41,
						'height': 41,
						'position': 'absolute',
						'backgroundSize': 'cover',
						'zIndex': 100000,
						'top': '-41px',
						'backgroundImage': 'url(' + url + ')'
					    }).addClass('snowRoll');
			  }
			  //开始飘花
			  setInterval(function(){
				  // 运动的轨迹
                  var startPositionLeft = Math.random() * visualWidth - 100,
                      startOpacity    = 1,
                      endPositionTop  = visualHeight - 40,
                      endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
                      duration        = visualHeight * 10 + Math.random() * 5000; 
				  // 随机透明度，不小于0.5
                  var randomStart = Math.random();
                      randomStart = randomStart < 0.5 ? startOpacity : randomStart; 
				  // 创建一个雪花
                  var $flake = createSnowBox();
				  // 设计起点位置
                  $flake.css({
                          left: startPositionLeft,
                          opacity : randomStart
                         });
				  // 加入到容器
                  $flakeContainer.append($flake);
				  // 开始执行动画
                  $flake.transition({
                          top: endPositionTop,
                          left: endPositionLeft,
                          opacity: 0.7
                         }, duration, 'ease-out', function() {
                           $(this).remove() //结束后删除
                         });
			  },200)
		  }
	  //****************
	  //**页面二动作******
	  //****************
	  //门
       function doorAction(left, right, time) {
			var $door = $('.door');
			var doorLeft = $('.door-left');
			var doorRight = $('.door-right');
			var defer = $.Deferred();
			var count = 2;
			// 等待开门完成
			var complete = function() {
				if (count == 1) {
					defer.resolve();
					return;
				}
				count--;
			};
			doorLeft.transition({
				'left': left
			}, time, complete);
			
			doorRight.transition({
		   'left': right
		   }, time, complete);
			
			 return defer;
		}
	
		// 开门
		function openDoor() {
			return doorAction('-50%', '100%', 2000);
		}
	
		// 关门
		function shutDoor() {
			return doorAction('0%', '50%', 2000);
		}
	    //鸟飞
	   var bird = {
			elem: $(".bird"),
			fly: function() {
				this.elem.addClass('birdFly')
				this.elem.transition({
					right: container.width()
				}, 15000, 'linear');
			}
		};
		  //灯的亮灭
		var lamp={
			elem:$('.b_background'),
			bright:function(){
				this.elem.addClass('lamp_bright');
			},
			dark:function(){
				this.elem.removeClass('lamp_bright');
			}
		};
		// 音乐配置
	  var audioConfig = {
		  enable: true, // 是否开启音乐
		  playURl: 'music/music.mp3', // 正常播放地址
		  //cycleURL: 'music/happy.wav' // 正常循环播放地址
	  };
  
	  /////////
	  //背景音乐 //
	  /////////
	  function Html5Audio(url, isloop) {
		  var audio = new Audio(url);
		  audio.autoPlay = true;
		  audio.loop = isloop || false;
		  audio.play();
		  return {
			  end: function(callback) {
				  audio.addEventListener('ended', function() {
					  callback();
				  }, false);
			  }
		  };
	  }
	  var container = $('#content');
	  var swipe = Swipe(container);
	  var visualWidth = container.width();
	  var visualHeight = container.height();	
	  var boy = BoyWalk();
	  // 页面滚动到指定的位置
	  function scrollTo(time, proportionX) {
		var distX = container.width() * proportionX;
		swipe.scrollTo(distX, time);
	  }
	  // 开始
	  
		  var audio1 = Html5Audio(audioConfig.playURl);
		  audio1.end(function() {
			  Hmlt5Audio(audioConfig.cycleURL, true);
		  });
		  //太阳自转
		  $('#sun').addClass('rotation');  
		  //云朵飘
		  $('.cloud:first').addClass('cloud1Anim');
		  $('.cloud:last').addClass('cloud2Anim');
		  // 开始第一次走路
		  boy.walkTo(1000,0.2)
			  .then(function() {
				  // 第一次走路完成
				  // 开始页面滚动
				  scrollTo(7000, 1);
			  }).then(function() {
				  // 第二次走路
				  return boy.walkTo(7000, 0.5);
			  }).then(function() {
                  //暂停走路
                  boy.stopWalk()
              }).then(function() {
                  //开门
                  return openDoor();
              }).then(function() {
                  //开灯
                  lamp.bright();
              }).then(function() {
                  //进商店
                  return boy.toShop(2000)
              }).then(function(){
                  // 取花
                  return boy.talkFlower();
              }).then(function() {
                  // 飞鸟
				  bird.fly();
			  }).then(function() {
                  //出商店
                  return boy.outShop(2000)
              }).then(function() {
                  //灯暗
                  lamp.dark();
				  boy.stopWalk();
              }).then(function(){
				  // 关门
				  return shutDoor();
			  }).then(function(){
				  scrollTo(6000,2);
				  return boy.walkTo(6000,0.01);
			  }).then(function(){
				  // 第一次走路到桥底边left,top
				  return boy.walkTo(2000, 0.15);
			  }).then(function() {
				  // 第二次走路到桥上left,top
				  return boy.walkTo(1500, 0.25, (bridgeY - girl.getHeight()) / visualHeight);
			  }).then(function() {
				  // 实际走路的比例
				  var proportionX = (girl.getOffset().left+10- boy.getWidth() + girl.getWidth() / 5) /                      visualWidth;
				  // 第三次桥上直走到小女孩面前
				  return boy.walkTo(1500, proportionX);
			  }).then(function() {
				  // 图片还原原地停止状态
				  boy.resetOriginal();
			  }).then(function() {
                  // 增加转身动作 
                  setTimeout(function() {
                    girl.rotate();
                    boy.rotate(function() {
                        // 开始logo动画
                        logo.run();
                    });
                  }, 1000);
				  snowflake();
              });

		
		
		