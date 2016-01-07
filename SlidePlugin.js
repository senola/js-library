(function () {
	'use strict'; // 使用严格模式
	var $;
	//============================//
	// SlidePlugin
	//============================//
	var SlidePlugin = function (container, params) {
		// 确保SlidePlugin实例已创建
		if(!(this instanceof SlidePlugin)) return new SlidePlugin(container, params);

        //默认参数配置
        var defaults = {
            direction: 'horizontal',  // 默认滑动方向
            touchEventsTarget: 'container', // 滑动事件作用的对象
            initialSlide: 0, 
            speed: 300,
            // autoplay
            autoplay: false,
            autoplayDisableOnInteraction: true,
            // To support iOS's swipe-to-go-back gesture (when being used in-app, with UIWebView).
            iOSEdgeSwipeDetection: false,
            iOSEdgeSwipeThreshold: 20,
            // Free mode
            freeMode: false,
            freeModeMomentum: true,
            freeModeMomentumRatio: 1,
            freeModeMomentumBounce: true,
            freeModeMomentumBounceRatio: 1,
            freeModeSticky: false,
            freeModeMinimumVelocity: 0.02,
            // Autoheight
            autoHeight: false,
            // Set wrapper width
            setWrapperSize: false,
            // Virtual Translate
            virtualTranslate: false,
            // Effects
            effect: 'slide', // 'slide' or 'fade' or 'cube' or 'coverflow'
            coverflow: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows : true
            },
            cube: {
                slideShadows: true,
                shadow: true,
                shadowOffset: 20,
                shadowScale: 0.94
            },
            fade: {
                crossFade: false
            },
            // Parallax
            parallax: false,
            // Scrollbar
            scrollbar: null,
            scrollbarHide: true,
            scrollbarDraggable: false,
            scrollbarSnapOnRelease: false,
            // Keyboard Mousewheel
            keyboardControl: false,
            mousewheelControl: false,
            mousewheelReleaseOnEdges: false,
            mousewheelInvert: false,
            mousewheelForceToAxis: false,
            mousewheelSensitivity: 1,
            // Hash Navigation
            hashnav: false,
            // Breakpoints
            breakpoints: undefined,
            // Slides grid
            spaceBetween: 0,
            slidesPerView: 1,
            slidesPerColumn: 1,
            slidesPerColumnFill: 'column',
            slidesPerGroup: 1,
            centeredSlides: false,
            slidesOffsetBefore: 0, // in px
            slidesOffsetAfter: 0, // in px
            // Round length
            roundLengths: false,
            // Touches
            touchRatio: 1,
            touchAngle: 45,
            simulateTouch: true,
            shortSwipes: true,
            longSwipes: true,
            longSwipesRatio: 0.5,
            longSwipesMs: 300,
            followFinger: true,
            onlyExternal: false,
            threshold: 0,
            touchMoveStopPropagation: true,
            // Pagination
            pagination: null,
            paginationElement: 'span',
            paginationClickable: false,
            paginationHide: false,
            paginationBulletRender: null,
            // Resistance
            resistance: true,
            resistanceRatio: 0.85,
            // Next/prev buttons
            nextButton: null,
            prevButton: null,
            // Progress
            watchSlidesProgress: false,
            watchSlidesVisibility: false,
            // Cursor
            grabCursor: false,
            // Clicks
            preventClicks: true,
            preventClicksPropagation: true,
            slideToClickedSlide: false,
            // Lazy Loading
            lazyLoading: false,
            lazyLoadingInPrevNext: false,
            lazyLoadingOnTransitionStart: false,
            // Images
            preloadImages: true,
            updateOnImagesReady: true,
            // loop
            loop: false,
            loopAdditionalSlides: 0,
            loopedSlides: null,
            // Control
            control: undefined,
            controlInverse: false,
            controlBy: 'slide', //or 'container'
            // Swiping/no swiping
            allowSwipeToPrev: true,
            allowSwipeToNext: true,
            swipeHandler: null, //'.swipe-handler',
            noSwiping: true,
            noSwipingClass: 'swiper-no-swiping',
            // NS
            slideClass: 'swiper-slide',
            slideActiveClass: 'swiper-slide-active',
            slideVisibleClass: 'swiper-slide-visible',
            slideDuplicateClass: 'swiper-slide-duplicate',
            slideNextClass: 'swiper-slide-next',
            slidePrevClass: 'swiper-slide-prev',
            wrapperClass: 'swiper-wrapper',
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active',
            buttonDisabledClass: 'swiper-button-disabled',
            paginationHiddenClass: 'swiper-pagination-hidden',
            // Observer
            observer: false,
            observeParents: false,
            // Accessibility
            a11y: false,
            prevSlideMessage: 'Previous slide',
            nextSlideMessage: 'Next slide',
            firstSlideMessage: 'This is the first slide',
            lastSlideMessage: 'This is the last slide',
            paginationBulletMessage: 'Go to slide {{index}}',
            // Callbacks
            runCallbacksOnInit: true
            /*
            Callbacks:
            onInit: function (swiper)
            onDestroy: function (swiper)
            onClick: function (swiper, e)
            onTap: function (swiper, e)
            onDoubleTap: function (swiper, e)
            onSliderMove: function (swiper, e)
            onSlideChangeStart: function (swiper)
            onSlideChangeEnd: function (swiper)
            onTransitionStart: function (swiper)
            onTransitionEnd: function (swiper)
            onImagesReady: function (swiper)
            onProgress: function (swiper, progress)
            onTouchStart: function (swiper, e)
            onTouchMove: function (swiper, e)
            onTouchMoveOpposite: function (swiper, e)
            onTouchEnd: function (swiper, e)
            onReachBeginning: function (swiper)
            onReachEnd: function (swiper)
            onSetTransition: function (swiper, duration)
            onSetTranslate: function (swiper, translate)
            onAutoplayStart: function (swiper)
            onAutoplayStop: function (swiper),
            onLazyImageLoad: function (swiper, slide, image)
            onLazyImageReady: function (swiper, slide, image)
            */
        };

        var initialVirtualTranslate = params && params.virtualTranslate;

        // SlidePlugin
		var s = this;
		// ==================初始化参数======================//
        //获取原始参数
        s.originalParams = (function () {
            params = params || {};
            var originalParams = {};
            for (var param in params) {
                if (typeof params[param] === 'object' && !(params[param].nodeType || params[param] === window || params[param] === document || (typeof Dom7 !== 'undefined' && params[param] instanceof Dom7) || (typeof jQuery !== 'undefined' && params[param] instanceof jQuery))) {
                    originalParams[param] = {};
                    for (var deepParam in params[param]) {
                        originalParams[param][deepParam] = params[param][deepParam];
                    }
                } else {
                    originalParams[param] = params[param];
                }
            }
            return originalParams;
        })();
        // 合并默认参数及自定义参数
        s.params = (function () {
            params = params || {};
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
            return params;
        })();


        // 声明classNames对象
        s.classNames = [];

        //存储$至SlidePlugin实例
        //使用优先级为： Dom7 > Zepto > jQuery
        s.$ = (function () {
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
            return $;
        })();
        
		
        //=======================视图[Breakpoints]============================//
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
		// 加载时候设置breakpoint
        if (s.params.breakpoints) {
            s.setBreakpoint();
        }

        // 是否是水平
        function isH() {
            return s.params.direction === 'horizontal';
        }

        //初始化相关参数
        (function () {
            //===========定义Container/Wrapper/Pagination=========================//
            s.container = $(container); //获取容器对象
            if (s.container.length === 0) return;
            //当需要操作的容器数量>1时候,为每个容器单独创建一个SlidePlugin实例
            if (s.container.length > 1) {
                s.container.each(function () {
                    new SlidePlugin(this, params);
                });
                return;
            }

            // 将SlidePlugin实例保存起来
            //s.container[0]为container的dom对象，即将SlidePlugin实例存储在dom对象中
            s.container[0].SlidePlugin = s;
            //将SlidePlugin实例存储在$(container)中
            s.container.data('SlidePlugin', s);
            s.classNames.push('SlidePlugin-container-' + s.params.direction);

            if (s.params.freeMode) { //自由模式
                s.classNames.push('SlidePlugin-container-free-mode');
            }
            if (!s.support.flexbox) {
                s.classNames.push('SlidePlugin-container-no-flexbox');
                s.params.slidesPerColumn = 1;
            }
            if (s.params.autoHeight) {
                s.classNames.push('SlidePlugin-container-autoheight');
            }

            // Enable slides progress when required
            if (s.params.parallax || s.params.watchSlidesVisibility) {
                s.params.watchSlidesProgress = true;
            }
            // Coverflow / 3D
            if (['cube', 'coverflow'].indexOf(s.params.effect) >= 0) {
                if (s.support.transforms3d) {
                    s.params.watchSlidesProgress = true;
                    s.classNames.push('SlidePlugin-container-3d');
                } else {
                    s.params.effect = 'slide';
                }
            }
            if (s.params.effect !== 'slide') {
                s.classNames.push('SlidePlugin-container-' + s.params.effect);
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
            // 光标
            if (s.params.grabCursor && s.support.touch) {
                s.params.grabCursor = false;
            }
            //设置光标
            if (s.params.grabCursor) {
                s.container[0].style.cursor = 'move';
                s.container[0].style.cursor = '-webkit-grab';
                s.container[0].style.cursor = '-moz-grab';
                s.container[0].style.cursor = 'grab';
            }

            // Wrapper
            s.wrapper = s.container.children('.' + s.params.wrapperClass);

            // Pagination
            if (s.params.pagination) {
                s.paginationContainer = $(s.params.pagination);
                if (s.params.paginationClickable) {
                    s.paginationContainer.addClass('SlidePlugin-pagination-clickable');
                }
            }

            // RTL
            s.rtl = isH() && (s.container[0].dir.toLowerCase() === 'rtl' || s.container.css('direction') === 'rtl');
            if (s.rtl) {
                s.classNames.push('SlidePlugin-container-rtl');
            }

            // Wrong RTL support
            if (s.rtl) {
                s.wrongRTL = s.wrapper.css('display') === '-webkit-box';
            }

            // Columns
            if (s.params.slidesPerColumn > 1) {
                s.classNames.push('SlidePlugin-container-multirow');
            }
            
            // Check for Android
            if (s.device.android) {
                s.classNames.push('SlidePlugin-container-android');
            }
            // Add classes
            s.container.addClass(s.classNames.join(' '));
            
            // Translate
            s.translate = 0;
            
            // 进度
            s.progress = 0;
            
            // 速度
            s.velocity = 0;
        })();

        //=================锁定/解锁===============//
        s.lockSwipeToNext = function () {
            s.params.allowSwipeToNext = false;
        };
        s.lockSwipeToPrev = function () {
            s.params.allowSwipeToPrev = false;
        };
        s.lockSwipes = function () {
            s.params.allowSwipeToNext = s.params.allowSwipeToPrev = false;
        };
        s.unlockSwipeToNext = function () {
            s.params.allowSwipeToNext = true;
        };
        s.unlockSwipeToPrev = function () {
            s.params.allowSwipeToPrev = true;
        };
        s.unlockSwipes = function () {
            s.params.allowSwipeToNext = s.params.allowSwipeToPrev = true;
        };

        //=================四舍五入===============//
        function round(a) {
            return Math.floor(a);
        }

        //=================图片加载===============//
        s.imagesToLoad = []; //要加载的图片集合
        s.imagesLoaded = 0; //已加载的图片数量
        //加载图片方法
        s.loadImage = function (imgElement, src, srcset, checkForComplete, callback) {
            var image;
            function onReady () {
                if(callback) callback();
            }
            if (!imgElement.complete || !checkForComplete) {
                if (src) {
                   image = new window.Image();
                   image.onload = onReady; 
                   image.onerror = onReady;
                   if (srcset) {
                        image.srcset = srcset;
                   }
                   if (src) {
                        image.src = src;
                   }
                } else {
                    onReady();
                }
            } else { // 图片已经加载完
                onReady();
            }
        };
        //图片预加载
        s.preloadImages = function () {
            s.imagesToLoad = s.container.find('img'); // 获取所有图片
            function _onReady() {
                if(typeof s === 'undefined' || s === null) return;
                if(s.imagesLoaded !== undefined) s.imagesLoaded++;
                if(s.imagesLoaded === s.imagesToLoad.length) { // 图片加载完毕
                    if(s.params.updateOnImagesReady) s.update();
                    s.emit('onImagesReady', s); //广播图片加载完成消息
                }
            }
            //遍历所有图片
            for(var i = 0; i < s.imagesToLoad.length; i++) {
                s.loadImage(s.imagesToLoad[i], (s.imagesToLoad[i].currentSrc || s.imagesToLoad[i].getAttribute('src')), (s.imagesToLoad[i].srcset || s.imagesToLoad[i].getAttribute('srcset')), true, _onReady)
            }
        };

        //=================自动运行===============//
        s.autoplayTimeoutId = undefined;
        s.autoplaying = false;
        s.autoplayPaused = false;
        function autoplay() {
        	s.autoplayTimeoutId = setTimeout(function () {
        		if (s.params.loop) {
        			s.fixLoop();
        			s._slideNext(); //滑动到下一页
        		} else {
        			if(!s.isEnd) {
        				s._slideNext();
        			} else {
        				if(!params.autoplayStopOnLast) {
        					s._slideTo(0);
        				} else {
        					s.stopAutoplay();
        				}
        			}
        		}
        	}, s.params.autoplay)
        }
        //开始运行
        s.startAutoplay = function () {
        	if (typeof s.autoplayTimeoutId !== 'undefined') return false;
            if (!s.params.autoplay) return false;
            if (s.autoplaying) return false;
            s.autoplaying = true;
            s.emit('onAutoplayStart', s);
            autoplay();
        };
        //停止运行
        s.stopAutoplay = function (internal) {
        	if (!s.autoplayTimeoutId) return;
            if (s.autoplayTimeoutId) clearTimeout(s.autoplayTimeoutId);
            s.autoplaying = false;
            s.autoplayTimeoutId = undefined;
            s.emit('onAutoplayStop', s);
        };
        //暂停运行
        s.pauseAutoplay = function (speed) {
        	if (s.autoplayPaused) return;
            if (s.autoplayTimeoutId) clearTimeout(s.autoplayTimeoutId);
            s.autoplayPaused = true;
            if (speed === 0) {
                s.autoplayPaused = false;
                autoplay();
            } else {
                s.wrapper.transitionEnd(function () {
                    if (!s) return;
                    s.autoplayPaused = false;
                    if (!s.autoplaying) {
                        s.stopAutoplay();
                    } else {
                        autoplay();
                    }
                });
            }
        };

        //=================Min/Max Translate===============//
        s.minTranslate = function () {
        	return (-s.snapGrid[0]);
        };
        s.maxTranslate = function () {
        	return (-s.snapGrid[s.snapGrid.length - 1]);
        };

        //=================Slider/slides 大小控制===============//
        s.updateAutoHeight = function () {
        	//更新高度
            var newHeight = s.slides.eq(s.activeIndex)[0].offsetHeight;
            if (newHeight) s.wrapper.css('height', s.slides.eq(s.activeIndex)[0].offsetHeight + 'px');
        };
        s.updateContainerSize = function () {
        	var width, height;
            if (typeof s.params.width !== 'undefined') {
                width = s.params.width;
            } else {
                width = s.container[0].clientWidth;
            }
            if (typeof s.params.height !== 'undefined') {
                height = s.params.height;
            } else {
                height = s.container[0].clientHeight;
            }
            if (width === 0 && isH() || height === 0 && !isH()) {
                return;
            }
        
            //Subtract paddings
            width = width - parseInt(s.container.css('padding-left'), 10) - parseInt(s.container.css('padding-right'), 10);
            height = height - parseInt(s.container.css('padding-top'), 10) - parseInt(s.container.css('padding-bottom'), 10);
        
            // Store values
            s.width = width;
            s.height = height;
            s.size = isH() ? s.width : s.height;
        };
        s.updateSlidesSize = function () {
        	s.slides = s.wrapper.children('.' + s.params.slideClass);
        	s.snapGrid = [];
        	s.slidesGrid = [];
        	s.slidesSizesGrid = [];

	        var spaceBetween = s.params.spaceBetween,
	            slidePosition = -s.params.slidesOffsetBefore,
	            i,
	            prevSlideSize = 0,
	            index = 0;

	        if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
                spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * s.size;
            }

            s.virtualSize = -spaceBetween;
            if (s.rtl) s.slides.css({marginLeft: '', marginTop: ''});
            else s.slides.css({marginRight: '', marginBottom: ''});

            var slidesNumberEvenToRows;
            if (s.params.slidesPerColumn > 1) {
                if (Math.floor(s.slides.length / s.params.slidesPerColumn) === s.slides.length / s.params.slidesPerColumn) {
                    slidesNumberEvenToRows = s.slides.length;
                } else {
                    slidesNumberEvenToRows = Math.ceil(s.slides.length / s.params.slidesPerColumn) * s.params.slidesPerColumn;
                }
                if (s.params.slidesPerView !== 'auto' && s.params.slidesPerColumnFill === 'row') {
                    slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, s.params.slidesPerView * s.params.slidesPerColumn);
                }
            }

            //计算 slides
            var slideSize;
            var slidesPerColumn = s.params.slidesPerColumn;
            var slidesPerRow = slidesNumberEvenToRows / slidesPerColumn;
            var numFullColumns = slidesPerRow - (s.params.slidesPerColumn * slidesPerRow - s.slides.length);
            for (i = 0; i < s.slides.length; i++) {
                slideSize = 0;
                var slide = s.slides.eq(i);
                if (s.params.slidesPerColumn > 1) {
                    // Set slides order
                    var newSlideOrderIndex;
                    var column, row;
                    if (s.params.slidesPerColumnFill === 'column') {
                        column = Math.floor(i / slidesPerColumn);
                        row = i - column * slidesPerColumn;
                        if (column > numFullColumns || (column === numFullColumns && row === slidesPerColumn-1)) {
                            if (++row >= slidesPerColumn) {
                                row = 0;
                                column++;
                            }
                        }
                        newSlideOrderIndex = column + row * slidesNumberEvenToRows / slidesPerColumn;
                        slide.css({
                                '-webkit-box-ordinal-group': newSlideOrderIndex,
                                '-moz-box-ordinal-group': newSlideOrderIndex,
                                '-ms-flex-order': newSlideOrderIndex,
                                '-webkit-order': newSlideOrderIndex,
                                'order': newSlideOrderIndex
                            });
                    } else {
                        row = Math.floor(i / slidesPerRow);
                        column = i - row * slidesPerRow;
                    }
                    slide.css({
                            'margin-top': (row !== 0 && s.params.spaceBetween) && (s.params.spaceBetween + 'px')
                        })
                        .attr('data-swiper-column', column)
                        .attr('data-swiper-row', row);
        
                }
                if (slide.css('display') === 'none') continue;
                if (s.params.slidesPerView === 'auto') {
                    slideSize = isH() ? slide.outerWidth(true) : slide.outerHeight(true);
                    if (s.params.roundLengths) slideSize = round(slideSize);
                } else {
                    slideSize = (s.size - (s.params.slidesPerView - 1) * spaceBetween) / s.params.slidesPerView;
                    if (s.params.roundLengths) slideSize = round(slideSize);
        
                    if (isH()) {
                        s.slides[i].style.width = slideSize + 'px';
                    }
                    else {
                        s.slides[i].style.height = slideSize + 'px';
                    }
                }
                s.slides[i].swiperSlideSize = slideSize;
                s.slidesSizesGrid.push(slideSize);
        
        
                if (s.params.centeredSlides) {
                    slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
                    if (i === 0) slidePosition = slidePosition - s.size / 2 - spaceBetween;
                    if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
                    if ((index) % s.params.slidesPerGroup === 0) s.snapGrid.push(slidePosition);
                    s.slidesGrid.push(slidePosition);
                }
                else {
                    if ((index) % s.params.slidesPerGroup === 0) s.snapGrid.push(slidePosition);
                    s.slidesGrid.push(slidePosition);
                    slidePosition = slidePosition + slideSize + spaceBetween;
                }
        
                s.virtualSize += slideSize + spaceBetween;
        
                prevSlideSize = slideSize;
        
                index ++;
            }
            s.virtualSize = Math.max(s.virtualSize, s.size) + s.params.slidesOffsetAfter;
            var newSlidesGrid;
        
            if (
                s.rtl && s.wrongRTL && (s.params.effect === 'slide' || s.params.effect === 'coverflow')) {
                s.wrapper.css({width: s.virtualSize + s.params.spaceBetween + 'px'});
            }
            if (!s.support.flexbox || s.params.setWrapperSize) {
                if (isH()) s.wrapper.css({width: s.virtualSize + s.params.spaceBetween + 'px'});
                else s.wrapper.css({height: s.virtualSize + s.params.spaceBetween + 'px'});
            }
        
            if (s.params.slidesPerColumn > 1) {
                s.virtualSize = (slideSize + s.params.spaceBetween) * slidesNumberEvenToRows;
                s.virtualSize = Math.ceil(s.virtualSize / s.params.slidesPerColumn) - s.params.spaceBetween;
                s.wrapper.css({width: s.virtualSize + s.params.spaceBetween + 'px'});
                if (s.params.centeredSlides) {
                    newSlidesGrid = [];
                    for (i = 0; i < s.snapGrid.length; i++) {
                        if (s.snapGrid[i] < s.virtualSize + s.snapGrid[0]) newSlidesGrid.push(s.snapGrid[i]);
                    }
                    s.snapGrid = newSlidesGrid;
                }
            }
            // Remove last grid elements depending on width
            if (!s.params.centeredSlides) {
                newSlidesGrid = [];
                for (i = 0; i < s.snapGrid.length; i++) {
                    if (s.snapGrid[i] <= s.virtualSize - s.size) {
                        newSlidesGrid.push(s.snapGrid[i]);
                    }
                }
                s.snapGrid = newSlidesGrid;
                if (Math.floor(s.virtualSize - s.size) > Math.floor(s.snapGrid[s.snapGrid.length - 1])) {
                    s.snapGrid.push(s.virtualSize - s.size);
                }
            }
            if (s.snapGrid.length === 0) s.snapGrid = [0];
        
            if (s.params.spaceBetween !== 0) {
                if (isH()) {
                    if (s.rtl) s.slides.css({marginLeft: spaceBetween + 'px'});
                    else s.slides.css({marginRight: spaceBetween + 'px'});
                }
                else s.slides.css({marginBottom: spaceBetween + 'px'});
            }
            if (s.params.watchSlidesProgress) {
                s.updateSlidesOffset();
            }
        };
        s.updateSlidesOffset = function () {
        	for (var i = 0; i < s.slides.length; i++) {
                s.slides[i].swiperSlideOffset = isH() ? s.slides[i].offsetLeft : s.slides[i].offsetTop;
            }
        };

        //=================Slider/slides progress===============//
        s.updateSlidesProgress = function (translate) {
        	if (typeof translate === 'undefined') {
                translate = s.translate || 0;
            }
            if (s.slides.length === 0) return;
            if (typeof s.slides[0].swiperSlideOffset === 'undefined') s.updateSlidesOffset();
        
            var offsetCenter = -translate;
            if (s.rtl) offsetCenter = translate;
        
            // Visible Slides
            s.slides.removeClass(s.params.slideVisibleClass);
            for (var i = 0; i < s.slides.length; i++) {
                var slide = s.slides[i];
                var slideProgress = (offsetCenter - slide.swiperSlideOffset) / (slide.swiperSlideSize + s.params.spaceBetween);
                if (s.params.watchSlidesVisibility) {
                    var slideBefore = -(offsetCenter - slide.swiperSlideOffset);
                    var slideAfter = slideBefore + s.slidesSizesGrid[i];
                    var isVisible =
                        (slideBefore >= 0 && slideBefore < s.size) ||
                        (slideAfter > 0 && slideAfter <= s.size) ||
                        (slideBefore <= 0 && slideAfter >= s.size);
                    if (isVisible) {
                        s.slides.eq(i).addClass(s.params.slideVisibleClass);
                    }
                }
                slide.progress = s.rtl ? -slideProgress : slideProgress;
            }
        };
        s.updateProgress = function (translate) {
        	if (typeof translate === 'undefined') {
                translate = s.translate || 0;
            }
            var translatesDiff = s.maxTranslate() - s.minTranslate();
            var wasBeginning = s.isBeginning;
            var wasEnd = s.isEnd;
            if (translatesDiff === 0) {
                s.progress = 0;
                s.isBeginning = s.isEnd = true;
            } else {
                s.progress = (translate - s.minTranslate()) / (translatesDiff);
                s.isBeginning = s.progress <= 0;
                s.isEnd = s.progress >= 1;
            }
            if (s.isBeginning && !wasBeginning) s.emit('onReachBeginning', s);
            if (s.isEnd && !wasEnd) s.emit('onReachEnd', s);
        
            if (s.params.watchSlidesProgress) s.updateSlidesProgress(translate);
            s.emit('onProgress', s, s.progress);
        };
        s.updateActiveIndex = function () {
        	var translate = s.rtl ? s.translate : -s.translate;
            var newActiveIndex, i, snapIndex;
            for (i = 0; i < s.slidesGrid.length; i ++) {
                if (typeof s.slidesGrid[i + 1] !== 'undefined') {
                    if (translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1] - (s.slidesGrid[i + 1] - s.slidesGrid[i]) / 2) {
                        newActiveIndex = i;
                    } else if (translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1]) {
                        newActiveIndex = i + 1;
                    }
                } else {
                    if (translate >= s.slidesGrid[i]) {
                        newActiveIndex = i;
                    }
                }
            }
            // Normalize slideIndex
            if (newActiveIndex < 0 || typeof newActiveIndex === 'undefined') newActiveIndex = 0;
            // for (i = 0; i < s.slidesGrid.length; i++) {
                // if (- translate >= s.slidesGrid[i]) {
                    // newActiveIndex = i;
                // }
            // }
            snapIndex = Math.floor(newActiveIndex / s.params.slidesPerGroup);
            if (snapIndex >= s.snapGrid.length) snapIndex = s.snapGrid.length - 1;
        
            if (newActiveIndex === s.activeIndex) {
                return;
            }
            s.snapIndex = snapIndex;
            s.previousIndex = s.activeIndex;
            s.activeIndex = newActiveIndex;
            s.updateClasses();
        };

        //=================更新classes===============//
        s.updateClasses = function () {
        	//清除所有样式
        	s.slides.removeClass(s.params.slideActiveClass + ' ' + s.params.slideNextClass + ' ' + s.params.slidePrevClass);
        	var activeSlide = s.slides.eq(s.activeIndex); // 获取当前激活的slide
        	// Active classes
            activeSlide.addClass(s.params.slideActiveClass);
            activeSlide.next('.' + s.params.slideClass).addClass(s.params.slideNextClass);
            activeSlide.prev('.' + s.params.slideClass).addClass(s.params.slidePrevClass);

            // Pagination
            if (s.bullets && s.bullets.length > 0) {
            	//清除所有样式
            	s.bullets.removeClass(s.params.bulletActiveClass);
            	var bulletIndex;
            	if (s.params.loop) {
            		bulletIndex = Math.ceil(s.activeIndex - s.loopedSlides)/s.params.slidesPerGroup;
            		if (bulletIndex > s.slides.length - 1 - s.loopedSlides * 2) {
                        bulletIndex = bulletIndex - (s.slides.length - s.loopedSlides * 2);
                    }
                    if (bulletIndex > s.bullets.length - 1) bulletIndex = bulletIndex - s.bullets.length;
            	} else {
            		 if (typeof s.snapIndex !== 'undefined') {
                        bulletIndex = s.snapIndex;
                    }
                    else {
                        bulletIndex = s.activeIndex || 0;
                    }
            	}
            	if (s.paginationContainer.length > 1) {
                    s.bullets.each(function () {
                        if ($(this).index() === bulletIndex) $(this).addClass(s.params.bulletActiveClass);
                    });
                }
                else {
                    s.bullets.eq(bulletIndex).addClass(s.params.bulletActiveClass);
                }
            }

            // Next/active buttons
            if (!s.params.loop) {
                if (s.params.prevButton) {
                    if (s.isBeginning) {
                        $(s.params.prevButton).addClass(s.params.buttonDisabledClass);
                        if (s.params.a11y && s.a11y) s.a11y.disable($(s.params.prevButton));
                    } else {
                        $(s.params.prevButton).removeClass(s.params.buttonDisabledClass);
                        if (s.params.a11y && s.a11y) s.a11y.enable($(s.params.prevButton));
                    }
                }
                if (s.params.nextButton) {
                    if (s.isEnd) {
                        $(s.params.nextButton).addClass(s.params.buttonDisabledClass);
                        if (s.params.a11y && s.a11y) s.a11y.disable($(s.params.nextButton));
                    } else {
                        $(s.params.nextButton).removeClass(s.params.buttonDisabledClass);
                        if (s.params.a11y && s.a11y) s.a11y.enable($(s.params.nextButton));
                    }
                }
            }
        };

        //=================页码[Pagination]===============//
        s.updatePagination = function () {
        	if (!s.params.pagination) return;
        	if (s.paginationContainer && s.paginationContainer.length > 0) {
                var bulletsHTML = '';
                var numberOfBullets = s.params.loop ? Math.ceil((s.slides.length - s.loopedSlides * 2) / s.params.slidesPerGroup) : s.snapGrid.length;
                for (var i = 0; i < numberOfBullets; i++) {
                    if (s.params.paginationBulletRender) {
                        bulletsHTML += s.params.paginationBulletRender(i, s.params.bulletClass);
                    }
                    else {
                        bulletsHTML += '<' + s.params.paginationElement+' class="' + s.params.bulletClass + '"></' + s.params.paginationElement + '>';
                    }
                }
                s.paginationContainer.html(bulletsHTML);
                s.bullets = s.paginationContainer.find('.' + s.params.bulletClass);
                if (s.params.paginationClickable && s.params.a11y && s.a11y) {
                    s.a11y.initPagination();
                }
            }
        };

        //=================通用更新方法===============//
        s.update = function () {
        	s.updateContainerSize();
        	s.updateSlidesSize();
        	s.updateProgress();
        	s.updatePagination();
        	s.updateClasses();
        	if (s.params.scrollbar && s.scrollbar) {
                s.scrollbar.set();
            }
            function forceSetTranslate() {
                newTranslate = Math.min(Math.max(s.translate, s.maxTranslate()), s.minTranslate());
                s.setWrapperTranslate(newTranslate);
                s.updateActiveIndex();
                s.updateClasses();
            }
            if (updateTranslate) {
                var translated, newTranslate;
                if (s.controller && s.controller.spline) {
                    s.controller.spline = undefined;
                }
                if (s.params.freeMode) {
                    forceSetTranslate();
                    if (s.params.autoHeight) {
                        s.updateAutoHeight();
                    }
                } else {
                    if ((s.params.slidesPerView === 'auto' || s.params.slidesPerView > 1) && s.isEnd && !s.params.centeredSlides) {
                        translated = s.slideTo(s.slides.length - 1, 0, false, true);
                    } else {
                        translated = s.slideTo(s.activeIndex, 0, false, true);
                    }
                    if (!translated) {
                        forceSetTranslate();
                    }
                }
            } else if (s.params.autoHeight) {
                s.updateAutoHeight();
            }
        };

        //=================重置大小处理===============//
        s.onResize = function (forceUpdatePagination) {
        	//Breakpoints
            if (s.params.breakpoints) {
                s.setBreakpoint();
            }
            //Disable locks on resize
            var allowSwipeToPrev = s.params.allowSwipeToPrev;
            var allowSwipeToNext = s.params.allowSwipeToNext;
            s.params.allowSwipeToPrev = s.params.allowSwipeToNext = true;
            s.updateContainerSize();
            s.updateSlidesSize();
            if (s.params.slidesPerView === 'auto' || s.params.freeMode || forceUpdatePagination) s.updatePagination();
            if (s.params.scrollbar && s.scrollbar) {
                s.scrollbar.set();
            }
            if (s.controller && s.controller.spline) {
                s.controller.spline = undefined;
            }
            if (s.params.freeMode) {
                var newTranslate = Math.min(Math.max(s.translate, s.maxTranslate()), s.minTranslate());
                s.setWrapperTranslate(newTranslate);
                s.updateActiveIndex();
                s.updateClasses();
        
                if (s.params.autoHeight) {
                    s.updateAutoHeight();
                }
            } else {
                s.updateClasses();
                if ((s.params.slidesPerView === 'auto' || s.params.slidesPerView > 1) && s.isEnd && !s.params.centeredSlides) {
                    s.slideTo(s.slides.length - 1, 0, false, true);
                }
                else {
                    s.slideTo(s.activeIndex, 0, false, true);
                }
            }
             // Return locks after resize
            s.params.allowSwipeToPrev = allowSwipeToPrev;
            s.params.allowSwipeToNext = allowSwipeToNext;
        };

        //=================事件===============//
        //定义 PC端事件
        var desktopEvents = ['mousedown', 'mousemove', 'mouseup'];
        if (window.navigator.pointerEnabled) {
        	desktopEvents = ['pointerdown', 'pointermove', 'pointerup'];
        } else if (window.navigator.msPointerEnabled) {
        	desktopEvents = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp'];
        }
        //定义移动端touch事件
        s.touchEvents = {
        	start: (s.support.touch || !s.params.simulateTouch)  ? 'touchstart' : desktopEvents[0],
        	move: (s.support.touch || !s.params.simulateTouch) ? 'touchmove' : desktopEvents[1],
        	end : (s.support.touch || !s.params.simulateTouch) ? 'touchend' : desktopEvents[2]
        };
        // WP8 Touch Events Fix
        if (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) {
        	//TODO
            //(s.params.touchEventsTarget === 'container' ? s.container : s.wrapper).addClass('swiper-wp8-' + s.params.direction);
        }

        //=================绑定/解绑事件===============//
        s.initEvents = function (detach) {
        	var actionDom = detach ? 'off' : 'on';
        	var action = detach ? 'removeEventListener' : 'addEventListener';
        	var touchEventsTarget = s.params.touchEventsTarget === 'container' ? s.container[0] : s.wrapper[0];
        	var target = s.support.touch ? touchEventsTarget : document;

        	var moveCapture = s.params.nested ? true : false;

        	// touch 事件
        	if (s.browser.ie) {
        		touchEventsTarget[action](s.touchEvents.start, s.onTouchStart, false);
        		target[action](s.touchEvents.move, s.onTouchMove, moveCapture);
        		target[action](s.touchEvents.end, s.onTouchEnd, false);
        	}
        };
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
