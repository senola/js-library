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
			romanNum: [0,"I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"],  
			radius: function() { //半径，默认为宽高最小值的一半
				return Math.min(c.canvas.height, c.canvas.width) / 2
			},
			color: "rgba(255, 0, 0, .2)",
			rim: function() { //
				return getValue("radius") * 0.2; 
			},
			x: function() {
				return c.canvas.width / 2;
			},
			y: function() {
				return c.canvas.height / 2;
			},
			lineColor: function() {
				return c.defaults.color;
			},
			fillColor: function() {
				return c.defaults.color;
			},
			lineWidth: 1,
			centreCircle: true,
			addHours: 0,
			addMinutes: 0,
			addSeconds: 0
		};

		//初始化参数 
		params = params || {}; //自定义参数
		var originalParams = {}; //原始参数
		for (var param in params) {
            if (typeof params[param] === 'object' && !(params[param].nodeType || params[param] === window || params[param] === document)) {
                originalParams[param] = {};
                for (var deepParam in params[param]) {
                    originalParams[param][deepParam] = params[param][deepParam];
                }
            } else {
                originalParams[param] = params[param];
            }
        }
        //合并原始参数和自定义参数
        for (var def in defaults) {
            if (typeof params[def] === 'undefined') {
                params[def] = defaults[def];
            } else if (typeof params[def] === 'object') {
                for (var deepDef in defaults[def]) {
                    if (typeof params[def][deepDef] === 'undefined') {
                        params[def][deepDef] = defaults[def][deepDef];
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
					return (currentDate.getSeconds() + currentDate.getMilliseconds() / 1000) / 60;
				}
			},
			minuteHand: {
				length: 0.8,
				width: 0.4,
				percentile: function() {
					return (currentDate.getMinutes() + currentDate.getSeconds() / 60) / 60;
				}
			},
			hourHand: {
				length: 0.5,
				width: 0.9,
				percentile: function() {
					return (currentDate.getHours() + currentDate.getMinutes() / 60) / 12;
				}
			}
		}
		//动态获取函数值 
		var getValue = function(funcName, defaultFuncName) {
			if(typeof c.defaults[funcName] === "function") {
				var result = c.defaults[funcName]();
				if(result != null) {
					return result;
			    }
			    if(typeof defaultFuncName == "function"){
					return defaultFuncName();
				}
				return (typeof c.defaults[defaultFuncName] == "function") ? c.defaults[defaultFuncName]() : c.defaults[defaultFuncName];
			} else {
				return c.defaults[funcName];
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
				y: y + 2 * radius / 8 * Math.sin(theta + offAmount)}
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
		};

		var drawMaker = function(x, y, i){

		};
		var drawMakers = function(x, y) {

		};
		var updateDate = function() {

		};
		//draw
		c.draw = function() {
			// canvas 默认充满整个父类标签
			c.canvas.height = c.canvas.parentNode.offsetHeight;
			c.canvas.width  = c.canvas.parentNode.offsetWidth;
			var radius = getValue("radius"); //获取半径
			var x = getValue("x");
			var y = getValue("y");
			//清空
			c.context.clearRect(0,0, c.canvas.width, c.canvas.height);
		};
		//animate
		c.animate = function() {
			if(!c.started) return;
			c.draw();
			c.getRequestAnimationFrame(c.animate);
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
	}
	//============================//
	// Clock 原型(Prototype),提供一些公用方法
	//============================//
	Clock.prototype = {
		addHours : function(){

		},
		addMinutes: function() {

		},
		addSeconds: function() {
			
		},
		getRequestAnimationFrame: function() {
	        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	        if(requestAnimationFrame == null) {
	            requestAnimationFrame = function(fn) {
	               setTimeout(fn, 50);
	            }
	        }
	        return requestAnimationFrame;
       }
	}

	window.Clock = Clock; // 定义Clock对象为全局对象
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