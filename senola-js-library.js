/**
 *  author: senola
 *  version: 0.0.1
 *  createTime: 2014-12-9  
 *  description: my own native javascript library
 *  repository: https://github.com/senola/js-library
 *  blog: senola.github.io
**/

var senolaUtils = {
	  /**
	   * 获取浏览器信息
		 **/
	  getBrowserInfo: function() { // 各个浏览器判断
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase(); //获取 userAgent 值
        var s;
        (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] : //IE 11
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

        if (Sys.ie) return ('IE: ' + Sys.ie);
        if (Sys.firefox) return ('Firefox: ' + Sys.firefox);
        if (Sys.chrome) return ('Chrome: ' + Sys.chrome);
        if (Sys.opera) return ('Opera: ' + Sys.opera);
        if (Sys.safari) return ('Safari: ' + Sys.safari);
    },

		/**
		 *  获取js宿主环境信息
		 **/
		versions: function () {
        var u = window.navigator.userAgent, 
           app = window.navigator.appVersion;
        return {
            trident: u.indexOf('Trident') > -1,
            presto: u.indexOf('Presto') > -1,
            webKit: u.indexOf('AppleWebKit') > -1,
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
            mobile: !!u.match(/AppleWebKit.*Mobile.*/),
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            android: u.indexOf('Android') > -1,
            iPhone: u.indexOf('iPhone') > -1,
            iPod: u.indexOf('iPod') > -1,
            iPad: u.indexOf('iPad') > -1,
            webApp: u.indexOf('Safari') == -1
        };
    }(),

		/**
		 *   判断是否是PC端，返回true表示“是”，返回false,表示“否”
		 **/
	  isPC : function () {                            
				var ua = navigator.userAgent;
				var agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
				var flag = true;
				for (var i = 0, j = agents.length; i < j ; i ++ ){
				    if (ua.indexOf(agents[i]) != -1) {
				           flag = false; 
				           break;
				    }
				}
				return flag;
    },
    /**
     *  获取[under,over]之间的随机数。若只传入一个参数num则返回的结果表示[0,num]间的随机数
     **/
    getRandomNum : function (under, over){
			switch (arguments.length){ //判断参数的长度
					case 1: 
					    return parseInt(Math.random() * under + 1);
					case 2: 
					    return parseInt(Math.random() * (over - under + 1) + under);
					default: return 1;
			}
		}
}
