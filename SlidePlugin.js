(function () {
	'use strict'; // 使用严格模式
	var $;
	//============================//
	// SlidePlugin
	//============================//
	var SlidePlugin = function (container, params) {
		// 确保SlidePlugin实例已创建
		if(!(this instanceof SlidePlugin)) return new SlidePlugin(container, params);

        var defaults = {};
        var initialVirtualTranslate = params && params.virtualTranslate;

        params = params || {};
        var originalParams = {};
        for (var param in params) {
            if (typeof params[param] === 'object' && !(params[param].nodeType || params[param] === window || params[param] === document || (typeof Dom7 !== 'undefined' && params[param] instanceof Dom7) || (typeof jQuery !== 'undefined' && params[param] instanceof jQuery))) {
                originalParams[param] = {};
                for (var deepParam in params[param]) {
                    originalParams[param][deepParam] = params[param][deepParam];
                }
            }
            else {
                originalParams[param] = params[param];
            }
        }
        for (var def in defaults) {
            if (typeof params[def] === 'undefined') {
                params[def] = defaults[def];
            }
            else if (typeof params[def] === 'object') {
                for (var deepDef in defaults[def]) {
                    if (typeof params[def][deepDef] === 'undefined') {
                        params[def][deepDef] = defaults[def][deepDef];
                    }
                }
            }
        }

        // SlidePlugin
		var s = this;
		// 参数
        s.params = params;
        s.originalParams = originalParams;
        // Classname
        s.classNames = [];

        // Dom Library and plugins
        if (typeof $ !== 'undefined' && typeof Dom7 !== 'undefined'){
            $ = Dom7;
        }
        if (typeof $ === 'undefined') {
            if (typeof Dom7 === 'undefined') {
                $ = window.Dom7 || window.Zepto || window.jQuery;
            } else {
                $ = Dom7;
            }
            if (!$) return;
        }

        // Export it to SlidePlugin instance
        s.$ = $;
        
		/*=========================
          Breakpoints
          ===========================*/
        s.currentBreakpoint = undefined;
        s.getActiveBreakpoint = function () {
            //Get breakpoint for window width
            if (!s.params.breakpoints) return false;
            var breakpoint = false;
            var points = [], point;
            for ( point in s.params.breakpoints ) {
                if (s.params.breakpoints.hasOwnProperty(point)) {
                    points.push(point);
                }
            }
            points.sort(function (a, b) {
                return parseInt(a, 10) > parseInt(b, 10);
            });
            for (var i = 0; i < points.length; i++) {
                point = points[i];
                if (point >= window.innerWidth && !breakpoint) {
                    breakpoint = point;
                }
            }
            return breakpoint || 'max';
        };
        s.setBreakpoint = function () {
            //Set breakpoint for window width and update parameters
            var breakpoint = s.getActiveBreakpoint();
            if (breakpoint && s.currentBreakpoint !== breakpoint) {
                var breakPointsParams = breakpoint in s.params.breakpoints ? s.params.breakpoints[breakpoint] : s.originalParams;
                for ( var param in breakPointsParams ) {
                    s.params[param] = breakPointsParams[param];
                }
                s.currentBreakpoint = breakpoint;
            }
        };

		// Set breakpoint on load
        if (s.params.breakpoints) {
            s.setBreakpoint();
        }

	    /*=========================
         Preparation - Define Container, Wrapper and Pagination
        ===========================*/
        s.container = $(container);
        if (s.container.length === 0) return;
        if (s.container.length > 1) {
            s.container.each(function () {
                new Swiper(this, params);
            });
            return;
        }

		// Save instance in container HTML Element and in data
		s.container[0].swiper = s;
        s.container.data('swiper', s);
        
        s.classNames.push('swiper-container-' + s.params.direction);
		if (s.params.freeMode) {
            s.classNames.push('swiper-container-free-mode');
        }
        if (!s.support.flexbox) {
            s.classNames.push('swiper-container-no-flexbox');
            s.params.slidesPerColumn = 1;
        }
        if (s.params.autoHeight) {
            s.classNames.push('swiper-container-autoheight');
        }

		// Enable slides progress when required
        if (s.params.parallax || s.params.watchSlidesVisibility) {
            s.params.watchSlidesProgress = true;
        }
		// Coverflow / 3D
        if (['cube', 'coverflow'].indexOf(s.params.effect) >= 0) {
            if (s.support.transforms3d) {
                s.params.watchSlidesProgress = true;
                s.classNames.push('swiper-container-3d');
            }
            else {
                s.params.effect = 'slide';
            }
        }
        if (s.params.effect !== 'slide') {
            s.classNames.push('swiper-container-' + s.params.effect);
        }
        if (s.params.effect === 'cube') {
            s.params.resistanceRatio = 0;
            s.params.slidesPerView = 1;
            s.params.slidesPerColumn = 1;
            s.params.slidesPerGroup = 1;
            s.params.centeredSlides = false;
            s.params.spaceBetween = 0;
            s.params.virtualTranslate = true;
            s.params.setWrapperSize = false;
        }
        if (s.params.effect === 'fade') {
            s.params.slidesPerView = 1;
            s.params.slidesPerColumn = 1;
            s.params.slidesPerGroup = 1;
            s.params.watchSlidesProgress = true;
            s.params.spaceBetween = 0;
            if (typeof initialVirtualTranslate === 'undefined') {
                s.params.virtualTranslate = true;
            }
        }

		// Grab Cursor
        if (s.params.grabCursor && s.support.touch) {
            s.params.grabCursor = false;
        }
        
        // Wrapper
        s.wrapper = s.container.children('.' + s.params.wrapperClass);

		// Pagination
        if (s.params.pagination) {
            s.paginationContainer = $(s.params.pagination);
            if (s.params.paginationClickable) {
                s.paginationContainer.addClass('swiper-pagination-clickable');
            }
        }

		// Is Horizontal
        function isH() {
            return s.params.direction === 'horizontal';
        }

		// RTL
        s.rtl = isH() && (s.container[0].dir.toLowerCase() === 'rtl' || s.container.css('direction') === 'rtl');
        if (s.rtl) {
            s.classNames.push('swiper-container-rtl');
        }

		// Wrong RTL support
        if (s.rtl) {
            s.wrongRTL = s.wrapper.css('display') === '-webkit-box';
        }

		// Columns
        if (s.params.slidesPerColumn > 1) {}
        
        // Check for Android
        if (s.device.android) {}
		// Add classes
        s.container.addClass(s.classNames.join(' '));
        
        // Translate
        s.translate = 0;
        
        // Progress
        s.progress = 0;
        
        // Velocity
        s.velocity = 0;

        //=================锁定/解锁===============//
        s.lockSwipeToNext = function () {};
        s.lockSwipeToPrev = function () {};
        s.lockSwipes = function () {};
        s.unlockSwipeToNext = function () {};
        s.unlockSwipeToPrev = function () {};
        s.unlockSwipes = function () {};

        //=================四舍五入===============//
        function round(a) {
            return Math.floor(a);
        }

        //=================设置光标===============//
        if (s.params.grabCursor) {
            s.container[0].style.cursor = 'move';
            s.container[0].style.cursor = '-webkit-grab';
            s.container[0].style.cursor = '-moz-grab';
            s.container[0].style.cursor = 'grab';
        }

        //=================图片加载===============//
        s.imagesToLoad = [];
        s.imagesLoaded = 0;
        s.loadImage = function (imgElement, src, srcset, checkForComplete, callback) {};
        s.preloadImages = function () {};

        //=================自动运行===============//
        s.autoplayTimeoutId = undefined;
        s.autoplaying = false;
        s.autoplayPaused = false;
        function autoplay() {
        }
        s.startAutoplay = function () {};
        s.stopAutoplay = function (internal) {};
        s.pauseAutoplay = function (speed) {};

        //=================Min/Max Translate===============//
        s.minTranslate = function () {};
        s.maxTranslate = function () {};

        //=================Slider/slides 大小控制===============//
        s.updateAutoHeight = function () {};
        s.updateContainerSize = function () {};
        s.updateSlidesSize = function () {};
        s.updateSlidesOffset = function () {};

        //=================Slider/slides progress===============//
        s.updateSlidesProgress = function (translate) {};
        s.updateProgress = function (translate) {};
        s.updateActiveIndex = function () {};

        //=================更新classes===============//
        s.updateClasses = function () {};

        //=================页码[Pagination]===============//
        s.updatePagination = function () {};

        //=================通用更新方法===============//
        s.update = function () {};

        //=================重置大小处理===============//
        s.onResize = function (forceUpdatePagination) {};

        //=================事件===============//
        //定义 touch 事件
        var desktopEvents = ['mousedown', 'mousemove', 'mouseup'];
        if (window.navigator.pointerEnabled) {
        	desktopEvents = ['pointerdown', 'pointermove', 'pointerup'];
        }
        s.touchEvents = {
        	start: s.support.touch || !s.params.simulateTouch  ? 'touchstart' : desktopEvents[0],
        	move: s.support.touch || !s.params.simulateTouch ? 'touchmove' : desktopEvents[1],
        	end : s.support.touch || !s.params.simulateTouch ? 'touchend' : desktopEvents[2]
        };
        // WP8 Touch Events Fix
        if (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) {
        	//TODO
            //(s.params.touchEventsTarget === 'container' ? s.container : s.wrapper).addClass('swiper-wp8-' + s.params.direction);
        }

        //=================绑定/解绑事件===============//
        s.initEvents = function (detach) {};
        s.attachEvents = function (detach) {};
        s.detachEvents = function () {};

        //=================Handle clicks===============//
        s.allowClick = true;
        s.preventClicks = function (e) {};
        s.onClickNext = function (e) {};
        s.onClickPrev = function (e) {};
        s.onClickIndex = function (e) {};

        //=================Handle Touches===============//
        function findElementInEvent(e, selector) {};
        s.updateClickedSlide = function (e) {};
        var isTouched,
        	isMoved,
        	allowTouchCallbacks,
        	touchStartTime,
        	isScrolling,
        	currentTranslate,
        	startTranslate,
        	allowThresholdMove,
        	// Form elements to match
            formElements = 'input, select, textarea, button',
            // Last click time
            lastClickTime = Date.now(), clickTimeout,
            //Velocities
            velocities = [],
            allowMomentumBounce;

        //=================动画开关===============//
        s.animating = false;

        //=================touch默认参数信息===============//
        s.touches = {
        	startX: 0,
        	startY: 0,
        	currentX: 0,
        	currentY: 0,
        	diff: 0
        }

        //=================touch事件处理===============//
        var isTouchEvent, 
            startMoving;
        s.onTouchStart = function (e) {};
        s.onTouchMove = function (e) {};
        s.onTouchEnd = function (e) {};

        //=================过渡[Transitions]===============//
        s._slideTo = function (slideIndex, speed) {};
        s.slideTo = function (slideIndex, speed, runCallbacks, internal) {};
        s.onTransitionStart = function (runCallbacks) {};
        s.onTransitionEnd = function (runCallbacks) {};
        s.slideNext = function (runCallbacks, speed, internal) {};
        s._slideNext = function (speed) {};
        s.slidePrev = function (runCallbacks, speed, internal) {};
        s._slidePrev = function (speed) {};
        s.slideReset = function (runCallbacks, speed, internal) {};

        //=================变换/过渡===============//
        s.setWrapperTransition = function (duration, byController) {};
        s.setWrapperTranslate = function (translate, updateActiveIndex, byController) {};
        s.getTranslate = function (el, axis) {};
        s.getWrapperTranslate = function (axis) {};

        //=================Observer===============//
        s.observers = [];
        function initObserver (target, options) {};
        s.initObservers = function () {};
        s.disconnectObservers = function () {};

        //===========appnd/prepend/remove slides==========//
        s.appendSlide = function (slides) {
        };
        s.prependSlide = function (slides) {
        };
        s.removeSlide = function (slidesIndexes) {
        };
        s.removeAllSlides = function () {
        };

        //=================循环===============//
        s.createLoop = function () {};
        s.destroyLoop = function () {};
        s.fixLoop = function () {};

        //=================效果===============//
        s.effect = {
        	fade:{},
        	cube:{},
        	coverflow:{}
        };
        //=================图片懒加载===============//
        s.lazy = {};
        //=================滚动条===============//
        s.scrollbar = {

        };

        //=================控制器===============//
        s.controller = {
        };

        //=================导航===============//
        s.hashnav = {}

        //=================键盘事件===============//
        function handleKeyboard(e) {

        }
        s.disableKeyboardControl = function () {

        }
        s.enableKeyboardControl = function () {

        }

        //=================鼠标滚轮事件===============//
        s.mousewheel = {
        };
        if (s.params.mousewheelControl) {

        }
        function handleMousewheel(e) {

        }
        s.disableMousewheelControl = function () {

        };
        s.enableMousewheelControl = function () {

        };
        //=================视差(Parallax)===============//
        function setParallaxTransform(el, progress) {
        };
        s.parallax = {
        };

        //=================收集插件和初始化插件===============//
        s._plugin = [];
        for (var plugin in s.plugins) {
            var p = s.plugins[plugin](s, s.params[plugin]);
            if (p) s._plugins.push(p);
        }
        // Method to call all plugins event/method
        s.callPlugins = function (eventName) {
            for (var i = 0; i < s._plugins.length; i++) {
                if (eventName in s._plugins[i]) {
                    s._plugins[i][eventName](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                }
            }
        };

		//=================事情/回调等===============//
		function normalizeEventName (eventName) {
		};
		s.emitterEventListeners = {};
		s.emit = function (eventName) {
		};
		s.on = function (eventName, handler) {
		}
		s.off = function (eventName, handler) {
		}
		s.once = function (eventName, handler) {
		}

		//=================工具集===============//
		s.utils = {
		};

		//=================初始化数据及销毁=================//
		s.init = function() {

		}
		//清除动态样式
		s.cleanupStyles = function () {
			//TODO
		};
		//销毁
		s.destory = function (deleteInstance, cleanupStyles) {
			//TODO
		};

		//初始化基础数据
		s.init();
		// 返回SlidePlugin实例
		return s;
	};

	//============================//
	// SlidePlugin 原型(Prototype),提供一些检测方法
	//============================//
	SlidePlugin.prototype = {
		//判断是否是safari内核
		isSafari: (function () {
			var ua = navigator.userAgent.toLowerCase();
            return (ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0);
		})(),
		//UiWebView即ios内置浏览器控件。
		isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent),
		//数组类型判断
		isArray: function(array) {
			return Object.prototype.toString.apply(array) === '[object Array]';
		},
		//检测指针事件的支持
		browser: {
            ie: window.navigator.pointerEnabled || window.navigator.msPointerEnabled,
            ieTouch: (window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 1) || (window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 1)
        },
        //获取设备信息，如：
        // {
        //    android: null
        //    ios: [0:"iPad; CPU OS 7_0", 1: "iPad", 2: "7_0", index: 13, input: "Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53"]
        // }
        device: (function () {
            var ua = navigator.userAgent;
            var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
            var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
            var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
            var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
            return {
                ios: ipad || iphone || ipod,
                android: android
            };
        })(),
        //设备支持的特性检测
        support: {
        	//touch 特性检测, Modernizr是一款检测浏览器特性的js库，可先判断是否引用该js
        	touch: (window.Modernizr && Modernizr.touch === true) || (function () {
                return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
            })(),
            // 3d变换特性检测(perspective属性检测)
            transforms3d: (window.Modernizr && Modernizr.csstransforms3d === true) || (function () {
                var div = document.createElement('div').style;
                return ('webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div);
            })(),
            // flexbox 支持检测
            flexbox: (function () {
                var div = document.createElement('div').style;
                var styles = ('alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient').split(' ');
                for (var i = 0; i < styles.length; i++) {
                    if (styles[i] in div) return true;
                }
            })(),
            //变动观察器 (Mutation Observer)检测
            //Mutation Observer是监视DOM变动的接口。当DOM对象树发生任何变动时，Mutation Observer会得到通知
            //小于IE11, Opera Mini 8, Android Browser4.3 不支持
            observer: (function () {
                return ('MutationObserver' in window || 'WebkitMutationObserver' in window);
            })()
        },
        //插件
        plugins: {}
	};

	window.SlidePlugin = SlidePlugin; // 定义SlidePlugin对象为全局对象
})();
/**
 * SlidePlugin 支持AMD规范
 */
if (typeof(module) !== 'undefined') {
	module.exports = window.SlidePlugin;
} else if (typeof define === 'function' && define.amd) {
	define([], function () {
		'use strict';
		return window.SlidePlugin;
	});
}
