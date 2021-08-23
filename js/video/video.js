/**
 * slider
 *
 * multirole slider plug-in
 *
 * @category	jQuery plugin
 * @license		http://www.opensource.org/licenses/mit-license.html	 MIT License
 * @copyright	2010 RaNa design associates, inc.
 * @author		keisuke YAMAMOTO <keisukey@ranadesign.com>
 * @link		http://www.ranadesign.com/
 * @version		4.0
 * @since		Aug 30, 2010
 * @update		Feb 13, 2014
 */

 ; (function ($) {
    var mobile = "createTouch" in document;
    $.fn.slider = function (param) {
        var def = {
            loop: true,
            time: 10,
            speed: 1,
            direction: "left",
            reverse: true,
            auto: true,
            easing: "linear",
            guideSelector: ".slideGuide",
            cellSelector: ".slideCell",
            ctrlSelector: ".slideCtrl",
            ctrlClick: false,
            ctrlHover: true,
            draggable: false,
            dragCursorOpen: "open.cur",
            dragCursorClose: "close.cur",
            shuttle: false,
            once: false,
            restart: true,
            restartTime: 3000,
            pause: true,
            build: true,
            sp: 1
        };

        return this.each(function () {
            if (param) {
                delete param.guide;
                delete param.sp;
            }
            $.extend(def, param);
            def.guide = $(this).find(def.guideSelector);
            if (def.draggable || def.shuttle) def.loop = def.auto = def.pause = false;
            def.d = def.direction;
            def.cell = def.cellSelector;
            def.ctrl = def.ctrlSelector;
            def.curOpen = "url(" + def.dragCursorOpen + "), default";
            def.curClose = "url(" + def.dragCursorClose + "), default";
            def.mousedownX = 0;

            if (!def.guide || def.loop && !def.guide.children(def.cell).length || !def.loop && def.guide.hasClass(def.guideSelector)) return true;

            def.frameBorder = def.guide.offset().left - def.guide.parent().offset().left;
            def.horizontalMargin = def.guide.find(def.cell).eq(0).outerWidth(true) - def.guide.find(def.cell).eq(0).outerWidth();
            def.verticalMargin = def.guide.find(def.cell).eq(0).outerHeight(true) - def.guide.find(def.cell).eq(0).outerHeight();
            def.handlerMousedown = mobile ? "touchstart" : "mousedown";
            def.handlerMousemove = mobile ? "touchmove" : "mousemove";
            def.handlerMouseup = mobile ? "touchend" : "mouseup";

            var init = function (def) {
                var cell = def.guide.find(def.cell);
                var max = 0;
                var size = 0;
                switch (def.direction) {
                    case "up":
                    case "down":
                        cell.each(function () {
                            max = max > $(this).outerHeight() ? max : $(this).outerHeight();
                            size += $(this).outerHeight(true);
                        });
                        if (!def.loop) {
                            def.guide.height(size);
                            return false;
                        }
                        while (size < def.guide.parent().height() + max) {
                            cell.clone(true).appendTo(def.guide);
                            size += cell.outerHeight();
                        }
                        def.guide.height(size + max);
                        break;
                    case "left":
                    case "right":
                    default:
                        cell.each(function () {
                            max = max > $(this).outerWidth() ? max : $(this).outerWidth();
                            size += $(this).outerWidth(true);
                        });
                        if (!def.loop) {
                            def.guide.width(size);
                            return false;
                        }
                        while (size < def.guide.parent().width() + max) {
                            cell.clone(true).appendTo(def.guide);
                            size += cell.outerWidth();
                        }
                        def.guide.width(size + max);
                }
            }
            var initTimerId = 0;
            var slider = function (par) {
                var cell = par.guide.find(par.cell);

                if (par.loop) {
                    cell.first = cell.eq(0);
                    cell.last = cell.eq(cell.length - 1);

                    switch (par.direction.toLowerCase()) {
                        case "up":
                            if (cell.first.height() === 0) {
                                setTimeout(function () {
                                    slider(par);
                                }, 200);
                                return false;
                            }
                            cell.first.animate({
                                marginTop: -1 * cell.first.innerHeight() - def.verticalMargin
                            }, {
                                duration: ~~Math.abs(par.time / par.sp * cell.first.height() *
                                    (cell.first.offset().top - par.guide.parent().offset().top < 0 ?
                                        (cell.first.height() + cell.first.offset().top - par.guide.parent().offset().top) / cell.first.height() : 1
                                    )
                                ),
                                easing: par.easing,
                                complete: function () {
                                    if (par.loop) {
                                        cell.first.appendTo(par.guide).css("marginTop", 0);
                                        if (!par.once) slider(par);
                                    }
                                }
                            });
                            break;
                        case "down":
                            if (cell.first.height() === 0) {
                                setTimeout(function () {
                                    slider(par);
                                }, 200);
                                return false;
                            }
                            if (cell.first.offset().top - par.guide.parent().offset().top < 0) {
                                cell.first.animate({
                                    marginTop: 0
                                }, {
                                    duration: ~~Math.abs(par.time / par.sp * cell.first.height() *
                                        (cell.first.offset().top - par.guide.parent().offset().top < 0 ?
                                            (par.guide.parent().offset().top - cell.first.offset().top) / cell.first.height() : 1
                                        )
                                    ),
                                    easing: par.easing,
                                    complete: function () { if (!par.once) slider(par); }
                                });
                            } else {
                                cell.last.prependTo(par.guide).css("marginTop", -1 * cell.last.innerHeight() - def.verticalMargin);
                                slider(par);
                            }
                            break;
                        case "left":
                            cell.first.animate({
                                marginLeft: -1 * cell.first.innerWidth() - par.horizontalMargin
                            }, {
                                duration: ~~Math.abs(par.time / par.sp * cell.first.width() *
                                    (cell.first.offset().left - par.guide.offset().left < 0 ?
                                        (cell.first.width() + cell.first.offset().left - par.guide.offset().left) / cell.first.width() : 1
                                    )
                                ),
                                easing: par.easing,
                                complete: function () {
                                    if (par.loop) {
                                        cell.first.appendTo(par.guide).css("marginLeft", 0);
                                        if (!par.once) slider(par);
                                    }
                                }
                            });
                            break;
                        case "right":
                            if (cell.first.offset().left - par.guide.offset().left < 0) {
                                cell.first.animate({
                                    marginLeft: 0
                                }, {
                                    duration: ~~Math.abs(par.time / par.sp * cell.first.width() *
                                        (cell.first.offset().left - par.guide.offset().left < 0 ?
                                            (par.guide.offset().left - cell.first.offset().left) / cell.first.width() : 1
                                        )
                                    ),
                                    easing: par.easing,
                                    complete: function () { if (!par.once) slider(par); }
                                });
                            } else {
                                cell.last.prependTo(par.guide).css("marginLeft", -1 * cell.last.innerWidth() - par.horizontalMargin);
                                slider(par);
                            }
                            break;
                        default:
                            return false;
                    }

                } else {
                    var ctrl = par.guide.siblings(par.ctrl);
                    ctrl.show();
                    var d = 0;
                    switch (par.direction.toLowerCase()) {
                        case "up":
                        case "down":
                            d = par.direction.toLowerCase() === "up" ? -1 : 1;
                            par.guide.animate({
                                marginTop: par.guide.height() * d
                            }, {
                                duration: par.time * par.guide.height() / par.sp,
                                easing: par.easing
                            });
                            var gl = par.guide.offset().top;
                            var fl = par.guide.parent().offset().top;
                            var timerId = setInterval(function () {
                                if (d > 0 && par.guide.offset().top > par.guide.parent().offset().top + par.frameBorder) {
                                    clearInterval(timerId);
                                    par.guide.stop(true);
                                    ctrl.filter(".up").hide();
                                }
                                if (d < 0 && par.guide.parent().height() + par.guide.parent().offset().top + par.frameBorder + par.verticalMargin > par.guide.height() + par.guide.offset().top) {
                                    clearInterval(timerId);
                                    par.guide.stop(true);
                                    ctrl.filter(".down").hide();
                                }
                            }, 20);
                            break;
                        case "left":
                        case "right":
                        default:
                            d = par.direction.toLowerCase() === "left" ? -1 : 1;
                            par.guide.animate({
                                marginLeft: par.guide.width() * d
                            }, {
                                duration: par.time * par.guide.width() / par.sp,
                                easing: par.easing
                            });
                            var gl = par.guide.offset().left;
                            var fl = par.guide.parent().offset().left;
                            var timerId = setInterval(function () {
                                if (d > 0 && par.guide.offset().left > par.guide.parent().offset().left + par.frameBorder) {
                                    clearInterval(timerId);
                                    par.guide.stop(true);
                                    ctrl.filter(".left").hide();
                                }
                                if (d < 0 && par.guide.parent().width() + par.guide.parent().offset().left + par.frameBorder + par.horizontalMargin > par.guide.width() + par.guide.offset().left) {
                                    clearInterval(timerId);
                                    par.guide.stop(true);
                                    ctrl.filter(".right").hide();
                                }
                            }, 20);
                            break;
                    }
                }
            }
            if (def.build) {
                $(window).resize(function () {
                    clearTimeout(initTimerId);
                    initTimerId = setTimeout(function () {
                        init(def);
                    }, 100);
                }).triggerHandler("resize");
            }

            if (def.auto) slider(def);
            if (def.pause) {
                def.guide.hover(
                    function () { $(this).find(def.cell).stop(true); },
                    function () { slider(def); }
                );
            }

            if (def.ctrlHover) {
                if (mobile) {
                    def.guide.siblings(def.ctrl)
                        .bind(def.handlerMousedown, function (event) {
                            event.preventDefault();
                            def.guide.find(def.cell).stop(true);
                            def.sp = def.speed;
                            switch (true) {
                                case $(this).hasClass("right"):
                                    def.direction = "right";
                                    break;
                                case $(this).hasClass("up"):
                                    def.direction = "up";
                                    break;
                                case $(this).hasClass("down"):
                                    def.direction = "down";
                                    break;
                                case $(this).hasClass("left"):
                                default:
                                    def.direction = "left";
                            }
                            slider(def);
                        }).bind(def.handlerMouseup, function () {
                            def.guide.find(def.cell).stop(true);
                            def.sp = 1;
                            def.direction = def.d;
                            if (def.auto) slider(def);
                        });
                } else {
                    def.guide.siblings(def.ctrl).hover(
                        function () {
                            def.guide.stop(true).find(def.cell).stop(true);
                            def.sp = def.speed;
                            def.direction = $(this).hasClass("right") ? def.reverse ? "left" : "right" : def.reverse ? "right" : "left";
                            switch (true) {
                                case $(this).hasClass("right"):
                                    def.direction = def.reverse ? "left" : "right";
                                    break;
                                case $(this).hasClass("up"):
                                    def.direction = def.reverse ? "down" : "up";
                                    break;
                                case $(this).hasClass("down"):
                                    def.direction = def.reverse ? "up" : "down";
                                    break;
                                case $(this).hasClass("left"):
                                default:
                                    def.direction = def.reverse ? "right" : "left";
                            }
                            slider(def);
                        },
                        function () {
                            def.guide.stop(true).find(def.cell).stop(true);
                            def.sp = 1;
                            def.direction = def.d;
                            if (def.auto) slider(def);
                        }
                    );
                }
            }

            if (def.ctrlClick) {
                def.guide.siblings(def.ctrl).bind(def.handlerMousedown, function (event) {
                    def.guide.find(def.cell).stop(true, true);
                    event.preventDefault();
                    def.direction = $(this).hasClass("right") ? def.reverse ? "left" : "right" : def.reverse ? "right" : "left";
                    def.once = true;
                    slider(def);
                    if (def.restart) {
                        setTimeout(function () {
                            def.once = false;
                            slider(def);
                        }, def.restartTime);
                    }
                });
            }
            var dragmove = function (event) {
                var frameEnd = def.guide.parent().width() + def.guide.parent().position().left;
                var guideEnd = def.guide.width() + def.guide.position().left;
                var stuff = 100;

                def.guide.css("position", "absolute").css("left", (mobile ? event.originalEvent.touches[0].pageX : event.pageX) - def.mousedownX);

                if (frameEnd - guideEnd > stuff || def.guide.offset().left - def.guide.parent().offset().left > stuff) {
                    $(document).unbind(def.handlerMousemove, dragmove).one(def.handlerMouseup, function () {
                        def.guide.animate({
                            left: frameEnd - guideEnd > stuff ? "+=" + (frameEnd - guideEnd) : 0
                        }, {
                            duration: 500,
                            easing: "easeOutQuart"
                        });
                    });
                }
            }
            if (def.draggable) {
				def.guide.bind(def.handlerMousedown, function(event) {
					event.preventDefault();
					def.mousedownX = (mobile ? event.originalEvent.touches[0].pageX : event.pageX) - def.guide.position().left;
					$(this).stop(true).css("cursor", def.curClose);
					$(document).bind(def.handlerMousemove, dragmove);
				});
				$(document).bind(def.handlerMouseup, function() {
					def.guide.css("cursor", def.curOpen);
					$(document).unbind(def.handlerMousemove, dragmove);
				});
			}
			
		});
	};

}(jQuery));
$(document).ready(function() {

    var curPage = 1;
    var numOfPages = $(".skw-page").length;
    var animTime = 1000;
    var scrolling = false;
    var pgPrefix = ".skw-page-";
  
    function pagination() {
      scrolling = true;
  
      $(pgPrefix + curPage).removeClass("inactive").addClass("active");
      $(pgPrefix + (curPage - 1)).addClass("inactive");
      $(pgPrefix + (curPage + 1)).removeClass("active");
  
      setTimeout(function() {
        scrolling = false;
      }, animTime);
    };
  
    function navigateUp() {
      if (curPage === 1) return;
      curPage--;
      pagination();
    };
  
    function navigateDown() {
      if (curPage === numOfPages) return;
      curPage++;
      pagination();
    };
  
    $(document).on("mousewheel DOMMouseScroll", function(e) {
      if (scrolling) return;
      if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
        navigateUp();
      } else { 
        navigateDown();
      }
    });
  
    $(document).on("keydown", function(e) {
      if (scrolling) return;
      if (e.which === 38) {
        navigateUp();
      } else if (e.which === 40) {
        navigateDown();
      }
    });
  
  });