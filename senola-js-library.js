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
        (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1]: //IE 11
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
    getversionsInfo: function() {
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
     * 获取移动端OS系统名及系统版本号
     * return一个数组，[系统名，系统版本]，如["iPhone", "iPhone OS 7_0"] 
     **/
    getOsVersion: function() {
        var osInfo = [];
        var u = window.navigator.userAgent,
            app = window.navigator.appVersion;
        if(u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
          osInfo.push("iPhone");
          osInfo.push(navigator.appVersion.match(/iPhone OS (\d+)_(\d+)_?(\d+)?/)[0]);
        }else if(u.indexOf('Android') > -1){
          osInfo.push("Android");
          osInfo.push(navigator.userAgent.match(/Android (\d+(?:\.\d+)+)/)[0]);
        }else {
          osInfo.push("others");
          osInfo.push("others");
        }
        return osInfo;
    },
    /**
     *   判断是否是PC端，返回true表示“是”，返回false,表示“否”
     **/
    isPC: function() {
        var ua = navigator.userAgent;
        var agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
        var flag = true;
        for (var i = 0, j = agents.length; i < j; i++) {
            if (ua.indexOf(agents[i]) != -1) {
                flag = false;
                break;
            }
        }
        return flag;
    },
    /**
     *  原生js Ajax请求
     *  用法： ajax_opt({
     *            "method" : "post",
     *            "url" : "dem0o.php",
     *            "data" : {
     *                  "name" : "senola",
     *                  "age" : 25,
     *                  "num" : "1234567890"
     *              },
     *            "success" : function(data){
     *                  alert(data);
     *            },
     *            "Error" : function(text){
     *               alert(text);
     *             },
     *             "async" : false 
     *         });
     *
     **/
    function ajax_opt(obj) {
        var xhr = senolaUtils.createXHR(); //获取xhr对象
        obj.url = obj.url; // 清除缓存
        obj.data = senolaUtils.paramsEscape(obj.data); // 转义字符串
        if(obj.method === "get" || obj.method === "GET"){      // 判断使用的是否是get方式发送
            obj.url += obj.url.indexOf("?") == "-1" ? "?" + obj.data : "&" + obj.data;
        }
        // 异步
        if(obj.async === true){
            // 异步的时候需要触发onreadystatechange事件
            xhr.onreadystatechange = function(){
                // 执行完成
                if(xhr.readyState == 4){
                    callBack();
                }
            }
        }
        xhr.open(obj.method, obj.url, obj.async);  // false是同步 true是异步 // "demo.php?rand="+Math.random()+"&name=ga&ga",
        if(obj.method === "post" || obj.method === "POST"){
            xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            xhr.send(obj.data);
        }else{
            xhr.send(null);
        }
        // xhr.abort(); // 取消异步请求
        // 同步
        if(obj.async === false){
            callBack();
        }
        // 返回数据
        function callBack(){
            // 判断是否返回正确
            if(xhr.status == 200){
                obj.success(xhr.responseText);
            }else{
                obj.Error("获取数据失败，错误代号为："+xhr.status+"错误信息为："+xhr.statusText);
            }
        }
    }, 
    /**
     *  创建兼容各浏览器的xhr对象
     **/
    function createXHR() {
        if(typeof XMLHttpRequest != "undefined"){ // 非IE6浏览器
            return new XMLHttpRequest();
        }else if(typeof ActiveXObject != "undefined"){   // IE6浏览器
            var version = [
                        "MSXML2.XMLHttp.6.0",
                        "MSXML2.XMLHttp.3.0",
                        "MSXML2.XMLHttp",
            ];
            for(var i = 0; i < version.length; i++){
                try{
                    return new ActiveXObject(version[i]);
                }catch(e){
                    //跳过
                }
            }
        }else{
            throw new Error("您的系统或浏览器不支持XHR对象！");
        }
    },
    /**
     *  转义字符
     **/
    function paramsEscape(data){
        var arr = [];
        for(var i in data){
            arr.push(encodeURIComponent(i) + "=" + encodeURIComponent(data[i]));
        }
        return arr.join("&");
    },
    /**
     *  获取[under,over]之间的随机数。若只传入一个参数num则返回的结果表示[0,num]间的随机数
     **/
    getRandomNum: function(under, over) {
        switch (arguments.length) { //判断参数的长度
            case 1:
                return parseInt(Math.random() * under + 1);
            case 2:
                return parseInt(Math.random() * (over - under + 1) + under);
            default:
                return 1;
        }
    },
    /**
     *  获取[startTime,endTime]时间段之间相差的minutes
     **/
    getMinutesDiff: function(startTime, endTime) {
        var minutesDiff = endTime.getTime() - startTime.getTime(); 
        return Math.round(minutesDiff / 1000 * 60);
    },
    /**
     *  获取[startTime,endTime]时间段之间相差的month
     **/
    getMonthsDiff: function(startTime, endTime) {
        var monthsdiff;
        monthsdiff = (endTime.getFullYear() - startTime.getFullYear()) * 12;
        monthsdiff -= startTime.getMonth() + 1;
        monthsdiff += endTime.getMonth();
        if(endTime.getDate() >= startTime.getDate()) {
            months++
        }
        return monthsdiff <= 0 ? 0 : monthsdiff;
    },
    /**
     *  获取[startTime,endTime]时间段之间相差的day
     **/
    getDaysDiff: function(startTime, endTime) {
        var timeDiff = Math.abs(endTime.getTime() - startTime.getTime());
        return Math.cell(timeDiff / (1000 * 60 * 60 * 24));
    },
    /**
     *  获取[startTime,endTime]时间段之间相差的hours
     **/
    getHoursDiff: function(startTime, endTime) {
        var timeDiff = Math.abs(endTime.getTime() - startTime.getTime());
        return Math.cell(timeDiff / (1000 * 60 * 60));
    },
    /**
     *  抓取网页上所有图片地址
     **/
    getSitePictures: function() {
        var pictures = document.images;
        var images = [];
        for(var i = 0, j = pictures.length; i < j; i ++){
            images.push(pictures[i].currentSrc);
        }
        return images;
    },
    /**
     *  获取浏览器的尺寸（浏览器的视口，不包括工具栏和滚动条）。
     *  兼容所有浏览器,Internet Explorer(5+)、Chrome、Firefox、Opera 以及 Safari：
     *  return : [width, height]
     **/
    getWindowSize: function() {
        var _w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var _h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        return new Array(_w, _h);
    }
}