(function(){
	'use strict';
	//============================//
	// Clock
	//============================//
	var Clock = function(container, params) {
		// 确保Clock实例已创建
		if(!(this instanceof Clock)) return new Clock(container, params);

		var default = {};
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