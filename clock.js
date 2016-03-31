(function(){
	'use strict';
	//============================//
	// Clock
	//============================//
	var Clock = function(container, params) {
		// 确保Clock实例已创建
		if(!(this instanceof Clock)) return new Clock(container, params);
		
		var c = this;
		//init canvas && context
		c.canvas = document.getElementById(container);
		c.context = c.canvas.getContext("2d");

		//当前时间
		c.currentDate = new Date();

		//启动标识
		c.started = false;
		//默认的参数
		var defaults = {
			romanNumerals: [0,"I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"],  
			radius: function() { //半径，默认为宽高最小值的一半
				return Math.min(c.canvas.height, c.canvas.width) / 2
			},
			color: "rgba(255, 0, 0, .2)",
			rim: function() { //圆环
				return getValue("radius") * 0.2; 
			},
			rimColour: function(){ 
				return getValue("color"); 
			},
			x: function() {
				return c.canvas.width / 2;
			},
			y: function() {
				return c.canvas.height / 2;
			},
			lineColor: function() {
				return getValue("color");
			},
			fillColor: function() {
				return getValue("color") ;
			},
			lineWidth: 1,
			centreCircle: true,
			addHours: 0,
			addMinutes: 0,
			addSeconds: 0,
			directionCoefficient: 1,
			centreCircle: true,
			centreCircleRadius: function(){ 
				return getValue("radius") * 0.03; 
			},
			centreCircleColour: function(){
				return getValue("colour");
			},
			centreCircleCutout: function(){ 
				return getValue("radius") * 0.01; 
			},
			markerDisplay: true, //是否显示时标
			markerType: "number", // number、numeral、dot、none
			markerColour: function(){ 
				return defaults.colour; 
			},
			markerSize: function(){ 
				return getValue("radius") * 0.02; 
			},
			markerDistance: function(){ 
				return getValue("radius") * 0.9; 
			},
			colorChange: true
		};

		//初始化参数 
		c.params = params || {}; //自定义参数
		var originalParams = {}; //原始参数
		for (var param in c.params) {
            if (typeof c.params[param] === 'object' && !(c.params[param].nodeType || c.params[param] === window || c.params[param] === document)) {
                originalParams[param] = {};
                for (var deepParam in params[param]) {
                    originalParams[param][deepParam] = c.params[param][deepParam];
                }
            } else {
                originalParams[param] = c.params[param];
            }
        }
        //合并原始参数和自定义参数
        for (var def in defaults) {
            if (typeof c.params[def] === 'undefined') {
                c.params[def] = defaults[def];
            } else if (typeof c.params[def] === 'object') {
                for (var deepDef in defaults[def]) {
                    if (typeof c.params[def][deepDef] === 'undefined') {
                        c.params[def][deepDef] = defaults[def][deepDef];
                    }
                }
            }
        }

		//表针属性
		c.hands = {
			secondHand: {
				length: 1,
				width: 0.1,
				percentile: function() {
					return (c.currentDate.getSeconds() + c.currentDate.getMilliseconds() / 1000) / 60;
				}
			},
			minuteHand: {
				length: 0.8,
				width: 0.4,
				percentile: function() {
					return (c.currentDate.getMinutes() + c.currentDate.getSeconds() / 60) / 60;
				}
			},
			hourHand: {
				length: 0.5,
				width: 0.9,
				percentile: function() {
					return (c.currentDate.getHours() + c.currentDate.getMinutes() / 60) / 12;
				}
			}
		}
		//动态获取函数值 
		var getValue = function(funcName, defaultFuncName) {
			if(typeof c.params[funcName] === "function") {
				var result = c.params[funcName]();
				if(result != null) {
					return result;
			    }
			    if(typeof defaultFuncName == "function"){
					return defaultFuncName();
				}
				return (typeof c.params[defaultFuncName] == "function") ? c.params[defaultFuncName]() : c.params[defaultFuncName];
			} else {
				return c.params[funcName];
			}
		}
		//获取【down, up】之间的随机整数
		var getRandomNum = function(down, up) {
		   switch (arguments.length) { //传入的参数个数
		      case 1: 
		          return parseInt(Math.random() * down + 1); // 获取[0,down)间的随机数
		      case 2:
		          return parseInt(Math.random() * (up - down + 1) + down); //获取[down,up] 之间的随机数
		      default: 
		          return 0; 
		   }
		}
		//draw hand
		var drawHand = function(x, y, radius, theta, lineWidth) {
			c.context.lineWidth = 1;
			c.context.beginPath(); //begin draw
			c.context.moveTo(x, y);
			var offAmount = (lineWidth != null) ? lineWidth : 0.5;
			var one = {
				x: x + 2 * radius / 8 * Math.cos(theta + offAmount),
				y: y + 2 * radius / 8 * Math.sin(theta + offAmount)
			};
			var two = {
				x: x,
				y: y
			};
 			var one2 = {
 				x: x + 2 * radius / 8 * Math.cos(theta - offAmount),
 				y: y + 2 * radius / 8 * Math.sin(theta - offAmount)
 			};
 			var finalx = x + radius * Math.cos(theta);
 			var finaly = y + radius * Math.sin(theta);
 			c.context.bezierCurveTo(one.x, one.y, two.x, two.y, finalx, finaly);
 			c.context.bezierCurveTo(two.x, two.y, one2.x, one2.y, x, y);
 			c.context.stroke();
 			c.context.fill();
 			c.context.lineWidth = 1;
		}
		//draw maker
		var drawMarker = function(x, y, i){
			c.context.beginPath();
			c.context.fillStyle = getValue("markerColour", "colour");
			var markerSize = getValue("markerSize");

			switch (getValue("markerType")) {
				case "numeral":
					markerSize *= 4;
					c.context.font = markerSize + "px sans-serif";
					c.context.textAlign = "center";
					c.context.fillStyle = getValue("markerColour");
					c.context.textBaseline = "middle";
					c.context.fillText(c.params.romanNumerals[i + 1], x, y);
					break;
				case "number":
					markerSize *= 4;
					c.context.font = markerSize + "px sans-serif";
					c.context.textAlign = "center";
					c.context.fillStyle = getValue("markerColour");
					c.context.textBaseline = "middle";
					c.context.fillText(i + 1, x, y);
					break;
				case "dot":
					c.context.arc(x, y, markerSize, 0, 2 * Math.PI);
					c.context.fill();
				    break;
				case "none":
				    break;
				default:
					break;
			}
		}
		// draw markers
		var drawMarkers = function(x, y) {
			if(getValue("markerDisplay") == false) return;

			var directionCoefficient = getValue("directionCoefficient");
			var markerDistance = getValue("markerDistance");
			var theta = directionCoefficient * 2 * Math.PI / 12 - Math.PI / 2;
			for(var i = 0; i < 12; i++) {
				var markerX =	x + markerDistance * Math.cos(theta);
				var markerY = y + markerDistance * Math.sin(theta);
				drawMarker(markerX, markerY, i);
				theta += directionCoefficient * 2 * Math.PI / 12;
			}
		}
		//update date
		var updateDate = function() {
			c.currentDate = new Date(); 
			c.addHours(c.currentDate, getValue("addHours", function(){return 0;}));
			c.addMinutes(c.currentDate, getValue("addMinutes", function(){return 0;}));
		    c.addSeconds(c.currentDate, getValue("addSeconds", function(){return 0;}));
		};
		//draw
		c.draw = function() {
			if(getValue("colorChange")) {
				c.params.color = "rgba(" + 255 + "," + 200 + "," + getRandomNum(0, 255) + ", ." + getRandomNum(1, 9) + ")";
			}
			// canvas 默认充满整个父类标签
			c.canvas.height = c.canvas.parentNode.offsetHeight;
			c.canvas.width  = c.canvas.parentNode.offsetWidth;
			var radius = getValue("radius"); //获取半径
			var x = getValue("x");
			var y = getValue("y");
			//清空
			c.context.clearRect(0,0, c.canvas.width, c.canvas.height);

			//画圆环
			c.context.strokeStyle = getValue("rimColour");
			c.context.lineWidth = getValue("rim");
			c.context.beginPath();
			c.context.arc(x, y, radius - getValue("rim") / 2, 0, 2 * Math.PI);
			c.context.stroke();

			c.context.strokeStyle = getValue("lineColour");
			c.context.fillStyle = getValue("fillColour");
			c.context.lineWidth = getValue("lineWidth");

			//markers
			drawMarkers(x, y);

			//update date
			updateDate();

			var directionCoefficient = getValue("directionCoefficient", function() {return 1;});

			// draw hand
			for(var key in c.hands) {
				if(c.hands.hasOwnProperty(key)) {
					var tempTheta = directionCoefficient * c.hands[key].percentile() * 2 * Math.PI - Math.PI / 2;
					var tempRadius = radius * c.hands[key].length;
					drawHand(x, y, tempRadius, tempTheta, c.hands[key].width);
				}
			}

			//centreCircle
			c.context.beginPath();
			c.context.fillStyle = getValue("centreCircleColour", "colour");
			c.context.arc(x, y, getValue("centreCircleRadius"), 0, 2 * Math.PI);
			c.context.fill();
			c.context.stroke();
			
			//cutout
			c.context.beginPath();
			c.context.arc(x, y, getValue("centreCircleCutout"), 0, 2 * Math.PI);
			c.context.clip();
			c.context.clearRect(0, 0, c.canvas.width, c.canvas.height);
		};
		//animate
		c.animate = function() {
			if(!c.started) return;
			c.draw();
			c.requestAnimationFrame(c.animate);
		};
		//start
		c.start = function() {
			c.started = true;
			c.animate();
		};
		//stop
		c.stop = function() {
			c.started = false;
		};
		//return
		return c;
	};
	//============================//
	// Clock 原型(Prototype),提供一些公用方法
	//============================//
	Clock.prototype = {
		addHours : function(d, h){
			d.setHours(d.getHours() + h);
		},
		addMinutes: function(d, m) {
			d.setMinutes(d.getMinutes() + m);
		},
		addSeconds: function(d,s) {
			d.setSeconds(d.getSeconds() + s);
		},
		requestAnimationFrame: function(fn) {
	        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	        if(requestAnimationFrame == null) {
	            requestAnimationFrame = function(fn) {
	               setTimeout(fn, 50);
	            }
	        }
	        return requestAnimationFrame(fn);
       }
	}
	//============================//
	// ClockCreator
	//============================//
	var ClockFactory = function() {
		var factory = this;
		factory.started = false;

		factory.clocks = [];

		factory.createClock = function(clockItem, options) {
			if(typeof clockItem === "string") {
				clockItem = new Clock(clockItem, options);
			}
			factory.clocks.push({
				clock: clockItem, 
				started: true
			});
		}

		factory.draw = function() {
			for(var i in factory.clocks) {
				var currentClock = factory.clocks[i];
				if(currentClock.started == true){
					currentClock.clock.draw();
				}
			}
		}

		factory.animate = function() {
			if(factory.started == false){
				return;
			}
			
			factory.draw();
			
			factory.clocks[0].clock.requestAnimationFrame(factory.animate);
		}
		factory.start = function() {
			factory.started = true;
			for(var i in factory.clocks){
				var currentClock = factory.clocks[i];
				currentClock.started = true;
			}
			
			factory.animate();
		}
		factory.stop = function(){
			factory.started = false;
		}
		return factory;
	}
	window.Clock = Clock; // 定义Clock对象为全局对象
	window.ClockFactory = ClockFactory; // 定义Clock对象为全局对象
})();

//============================//
// Clock 支持AMD规范
//============================//
if (typeof(module) !== 'undefined') {
	module.exports = window.Clock;
} else if (typeof define === 'function' && define.amd) {
	define([], function () {
		'use strict';
		return window.Clock;
	});
}