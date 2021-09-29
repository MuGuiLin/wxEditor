$.support.cors = true;

; (function (global, factory) {
    'use strict';
    typeof exports === 'object' && typeof module !== 'undefined' ?
        module.exports = factory(require('global/window'), require('global/document')) :
        typeof define === 'function' && define.amd ?
            define(['global/window', 'global/document'], factory) :
            (global.MU = factory(global.window, global.document, jQuery));

}(typeof window !== "undefined" ? window : this, (function (global, doc, $) {
    'use strict';

    /**
     * 全局常用方法，数据请求API域名配置
     */
    (function (global, doc, $) {
        Array.prototype.indexOf = function (val) {
            for (var i = 0, l = this.length; i < l; i++) {
                if (this[i] == val) {
                    return i;
                }
            };
            return -1;
        };
        Array.prototype.remove = function (val) {
            var index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };
        Array.prototype.pull = function (val, key) {
            if (key) {
                for (var i = 0, l = this.length; i < l; i++) {
                    if (this[i][key] == val[key]) {
                        this.splice(i, 1);
                        return;
                    }
                };
            } else {
                for (var i = 0, l = this.length; i < l; i++) {
                    if (this[i] == val) {
                        this.splice(i, 1);
                        return;
                    }
                };
            }
        };
        $.fn.prompt = function (color, text, time, auto) {
            var $this = $(this),
                auto = auto || false;
            (auto) ? $this.css("color", color).html(text).slideDown() : $this.css("color", color).html(text);
            if (time) {
                MU.setTimeout(function () {
                    (auto) ? $this.slideUp().html("") : $this.html("");
                }, time);
            }
        };
        $.fn.movedraw = function (type) {
            $(this).removeClass(MD).addClass('animated ' + type).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                MD = type;
                $(this).removeClass(type);
            });
        };
        $.fn.setContent = function (text) {
            var $this = $(this)[0];
            if (doc.selection) {
                this.focus();
                var oSelection = doc.selection.createRange();
                oSelection.text = text;
                this.focus();
            } else {
                if ($this.selectionStart || '0' == $this.selectionStart) {
                    var startPos = $this.selectionStart,
                        endPos = $this.selectionEnd,
                        scrollTop = $this.scrollTop;
                    $this.value = $this.value.substring(0, startPos) + text + $this.value.substring(endPos, $this.value.length);
                    this.focus();
                    $this.selectionStart = startPos + text.length;
                    $this.selectionEnd = startPos + text.length;
                    $this.scrollTop = scrollTop;
                } else {
                    this.value += text;
                    this.focus();
                }
            }
        };
        $.getUrlParam = function (o) {
            var p = new RegExp("(^|&)" + o + "=([^&]*)(&|$)");
            var r = global.location.search.substr(1).match(p);
            if (r != null) return unescape(r[2]);
            return null;
        };

        $.extend({
            /**
             * 前端API域名 (用于 让开发，测试，生产3个环境自动识别当前点击上传图片地址域名所改【注：这是修改编辑器自带的上传哦】)
            */
            QD__NET__: '',  // 默认：location.host, 

            /**
             * 后端API域名 （用于图裁切等,自定义上传功能【注：不是编辑器自带的上传功能哦】）
            */
            HD__NET__: '',  // 默认：location.host,  
        });
        var Init = function () {

            /**
             * 前后端分离 相关文件上传API配置，可根据需求修改！
             */
            this.All__Url = $.HD__NET__ + "/index.php/api/index";

            this.Upload__Image__Url = $.HD__NET__ + "/index.php/upload/images";

            // 获取编辑器中的图片 API
            this.Upload__Cover__Url = $.HD__NET__ + "/index.php/upload/cover";

            // 本地音频道上传
            this.Upload__Music__Url = $.HD__NET__ + "/index.php/upload/music";

            this.Upload__Video__Url = $.HD__NET__ + "/index.php/upload/video";

            this.isiPhone = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent || global.navigator.userAgent);

            this.getId = function (id) {
                return document.querySelector('#' + id) || document.getElementById(id);
            };
        };

        Init.prototype = {

            isDevicePcOrMobileFn: function () {
                var Agent = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"),
                    mobile = false;
                for (var i = 0, l = Agent.length; i < l; i++) {
                    if (navigator.userAgent.indexOf(Agent[i]) > 0) {
                        mobile = true;
                    }
                };
                return mobile;
            },

            isPassword: function (str) {
                var reg = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/;
                return reg.test(str);
            },

            isPhone: function (str) {
                var reg = /^1[0-9]{10}$/;
                return reg.test(str);
            },

            isEmail: function (str) {
                var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/;
                return reg.test(str);
            },

            isExitsFunction: function (funcName) {
                try {
                    if (typeof (eval(funcName)) == "function") {
                        return true;
                    }
                } catch (e) {
                    return false;
                }
            },

            isFullscreen: function () {
                doc.addEventListener("webkitfullscreenchange", function () {
                    return doc.webkitIsFullScreen ? true : false;
                }, false);
            },

            jsonStringify: function (obj) {
                return JSON.stringify(obj);
            },

            isClassName: function (obj, cla) {
                return $(obj).hasClass(cla);
            },

            mergeArray: function () {
                return Array.prototype.concat.apply([], arguments);
            },

            selectInputText: function (obj) {
                this.getId(obj).select();
            },

            selectDomText: function (obj) {
                global.getSelection().selectAllChildren(this.getId(obj));
            },

            copyText: function (obj, back) {
                var dom = this.getId(obj);
                if (dom.select) dom.select();
                global.getSelection().selectAllChildren(dom);
                doc.execCommand('Copy');
                this.setTimeout(function () {
                    if (back) back();
                }, 100);
            },

            setTimeout: function (obj, num) {
                var num = num || 2000;
                global.setTimeout(obj, num);
            },

            ReloadPage: function (s) {
                var s = s || 2000;
                this.setTimeout(function () {
                    global.location.reload();
                }, s);
            },

            ReferrerPage: function (s) {
                var s = s || 2000;
                this.setTimeout(function () {
                    global.location.href = window.document.referrer;
                }, s);
            },

            HistoryGoTwo: function (s, t) {
                var t = t || -2,
                    s = s || 2000;
                this.setTimeout(function () {
                    window.history.go(t);
                }, s);
            },

            openFullscreen: function (element) {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullScreen();
                }
            },

            exitFullScreenexitFullScreen: function () {
                if (doc.exitFullscreen) {
                    doc.exitFullscreen();
                } else if (doc.mozCancelFullScreen) {
                    doc.mozCancelFullScreen();
                } else if (doc.msExitFullscreen) {
                    doc.msExiFullscreen();
                } else if (doc.webkitCancelFullScreen) {
                    doc.webkitCancelFullScreen();
                } else if (doc.webkitExitFullscreen) {
                    doc.webkitExitFullscreen();
                }
            },

            //从正文中选取图片
            ExtractTextImage: function () {
                var getContent = MU.ueditor.getContent();
                if (getContent == '<p id="initContent" style="color:#A9A9A9">请在此编写正文...</p>' || getContent == "") {
                    MU.Alert({
                        time: 2000,
                        message: "正文中有没图片！"
                    });
                    return false;
                } else {
                    var dom = '<p class="title-img-tit">请从正文使用过的图片中选择封面图<span> （尺寸小于220px × 150px的图片已被自动过滤）</span></p><div id="selectTextImages" class="title-img-box">';
                    getContent.replace(/<img.*?src="(.*?)"[^>]*>/g, function (ent, src) {
                        dom += '<img width="124px" src="' + src + '"/>';
                    });
                    dom += '</div>';
                    MU.Alert({
                        title: '标题图片',
                        dom: dom
                    });
                };
            },

            //图片裁切
            getImgBase64: function (attr, back) {
                $.Cropper((2 / 1.2), {
                    getBase64: function (result) {
                        if (back) back(result.toDataURL('image/jpeg'));
                    }
                });
                if (attr) $.CropperSrc(attr);
                $('#cropper-box').animate({ top: '50%' }, '300', function () {
                    $('.mask').show();
                });
            },

            //图文粘贴进度
            MoveOnSpeedBar: function (w, s) {
                var $bar = $('#wxEditor-progress-bar');
                clearTimeout($.SET__TIMEOUT);
                $.SET__TIMEOUT = MU.setTimeout(function () {
                    if (100 > $bar.width()) {
                        $bar.width(w + '%');
                    } else {
                        clearTimeout($.SET__TIMEOUT);
                    };
                }, s);
            },

            //编辑器图文粘贴
            WxEditorImgBar: function (obj) {
                switch (obj.type) {
                    case 'show':
                        MU.Alert({
                            title: "上传进度",
                            hide: 'showclose',
                            dom: '<section class="wxEditor-progress-main"><p id="wxEditor-progress-text">素材上传中，请稍候！</p><div class="wxEditor-progress-box"><i id="wxEditor-progress-bar" class="wxEditor-progress-bar"></i></div></section>'
                        });
                        var len = obj.size;
                        if (10 > len) {
                            len = len * 2;
                        };
                        if (20 < len && 60 > len) {
                            len = 20;
                            this.MoveOnSpeedBar(40, 1000);
                            this.MoveOnSpeedBar(60, 4000);
                            this.MoveOnSpeedBar(80, 8000);
                        };
                        if (60 < len && 100 > len) {
                            len = 20;
                            this.MoveOnSpeedBar(30, 2000);
                            this.MoveOnSpeedBar(50, 5000);
                            this.MoveOnSpeedBar(70, 10000);
                            this.MoveOnSpeedBar(90, 15000);
                        };
                        if (100 < len) {
                            len = 20;
                            this.MoveOnSpeedBar(30, 2000);
                            this.MoveOnSpeedBar(40, 5000);
                            this.MoveOnSpeedBar(50, 8000);
                            this.MoveOnSpeedBar(60, 12000);
                            this.MoveOnSpeedBar(70, 18000);
                            this.MoveOnSpeedBar(80, 24000);
                            this.MoveOnSpeedBar(90, 30000);
                        };
                        console.log(len)
                        $('#wxEditor-progress-bar').width(len + '%');
                        break;
                    case 'hide':
                        $('#wxEditor-progress-bar').width('100%');
                        setTimeout(function () {
                            MU.AlertThis.RemoveAlert();
                            if (obj.not) {
                                MU.Alert({
                                    title: '粘贴提示',
                                    message: "有" + obj.not + "张图片粘贴失败，请手动替换！",
                                    buttons: [{
                                        name: "确定",
                                        style: "enter",
                                        callback: function () {
                                            MU.AlertThis.RemoveAlert();
                                        }
                                    }, {}]
                                }); obj.call();
                            };
                        }, obj.time);
                    default:
                        break;
                };
            },
        };

        global.MU = new Init();

    })(global, doc, $);

    /**
     * jQuery颜色选取器插件
     */
    (function (global, doc, $) {
        $.fn.farbtastic = function (callback, gotoback) {
            $.farbtastic(this, callback, gotoback);
            return this;
        };
        $.farbtastic = function (container, callback, gotoback) {
            var container = $(container).get(0);
            return container.farbtastic || (container.farbtastic = new $._farbtastic(container, callback, gotoback));
        };
        $._farbtastic = function (container, callback, gotoback) {
            var fb = this;
            $(container).html('<div class="farbtastic"><div class="color"></div><div class="wheel"></div><div class="overlay"></div><div class="h-marker marker"></div><div class="sl-marker marker"></div></div>');
            var e = $('.farbtastic', container);
            fb.wheel = $('.wheel', container).get(0);
            fb.radius = 84;
            fb.square = 100;
            fb.width = 194;
            if (navigator.appVersion.match(/MSIE [0-6]\./)) {
                $('*', e).each(function () {
                    if (this.currentStyle.backgroundImage != 'none') {
                        var image = this.currentStyle.backgroundImage;
                        image = this.currentStyle.backgroundImage.substring(5, image.length - 2);
                        $(this).css({
                            'backgroundImage': 'none',
                            'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='" + image + "')"
                        });
                    };
                });
            };
            fb.linkTo = function (callback) {
                if (typeof fb.callback == 'object') {
                    $(fb.callback).unbind('keyup', fb.updateValue);
                };
                fb.color = null;
                if (typeof callback == 'function') {
                    fb.callback = callback;
                } else if (typeof callback == 'object' || typeof callback == 'string') {
                    fb.callback = $(callback);
                    fb.callback.bind('keyup', fb.updateValue);
                    if (fb.callback.get(0).value) {
                        fb.setColor(fb.callback.get(0).value);
                    };
                };
                return this;
            };
            fb.updateValue = function (event) {
                if (this.value && this.value != fb.color) {
                    fb.setColor(this.value);
                };
            };
            fb.setColor = function (color) {
                var unpack = fb.unpack(color);
                if (fb.color != color && unpack) {
                    fb.color = color;
                    fb.rgb = unpack;
                    fb.hsl = fb.RGBToHSL(fb.rgb);
                    fb.updateDisplay();
                }
                return this;
            };
            fb.setHSL = function (hsl) {
                fb.hsl = hsl;
                fb.rgb = fb.HSLToRGB(hsl);
                fb.color = fb.pack(fb.rgb);
                fb.updateDisplay();
                return this;
            };
            fb.widgetCoords = function (event) {
                var x, y;
                var el = event.target || event.srcElement;
                var reference = fb.wheel;
                if (typeof event.offsetX != 'undefined') {
                    var pos = {
                        x: event.offsetX,
                        y: event.offsetY
                    };
                    var e = el;
                    while (e) {
                        e.mouseX = pos.x;
                        e.mouseY = pos.y;
                        pos.x += e.offsetLeft;
                        pos.y += e.offsetTop;
                        e = e.offsetParent;
                    }
                    var e = reference;
                    var offset = {
                        x: 0,
                        y: 0
                    };
                    while (e) {
                        if (typeof e.mouseX != 'undefined') {
                            x = e.mouseX - offset.x;
                            y = e.mouseY - offset.y;
                            break
                        };
                        offset.x += e.offsetLeft;
                        offset.y += e.offsetTop;
                        e = e.offsetParent;
                    };
                    e = el;
                    while (e) {
                        e.mouseX = undefined;
                        e.mouseY = undefined;
                        e = e.offsetParent;
                    };
                } else {
                    var pos = fb.absolutePosition(reference);
                    x = (event.pageX || 0 * (event.clientX + $('html').get(0).scrollLeft)) - pos.x;
                    y = (event.pageY || 0 * (event.clientY + $('html').get(0).scrollTop)) - pos.y;
                };
                return {
                    x: x - fb.width / 2,
                    y: y - fb.width / 2
                };
            };
            fb.mousedown = function (event) {
                if (!document.dragging) {
                    $(document).bind('mousemove', fb.mousemove).bind('mouseup', fb.mouseup);
                    document.dragging = true;
                }
                var pos = fb.widgetCoords(event);
                fb.circleDrag = Math.max(Math.abs(pos.x), Math.abs(pos.y)) * 2 > fb.square;
                fb.mousemove(event);
                return false;
            };
            fb.mousemove = function (event) {
                var pos = fb.widgetCoords(event);
                if (fb.circleDrag) {
                    var hue = Math.atan2(pos.x, -pos.y) / 6.28;
                    if (hue < 0) hue += 1;
                    fb.setHSL([hue, fb.hsl[1], fb.hsl[2]]);
                } else {
                    var sat = Math.max(0, Math.min(1, -(pos.x / fb.square) + .5));
                    var lum = Math.max(0, Math.min(1, -(pos.y / fb.square) + .5));
                    fb.setHSL([fb.hsl[0], sat, lum]);
                };
                return false;
            };
            fb.mouseup = function () {
                $(document).unbind('mousemove', fb.mousemove);
                $(document).unbind('mouseup', fb.mouseup);
                document.dragging = false
            };
            fb.updateDisplay = function () {
                var angle = fb.hsl[0] * 6.28;
                $('.h-marker', e).css({
                    left: Math.round(Math.sin(angle) * fb.radius + fb.width / 2) + 'px',
                    top: Math.round(-Math.cos(angle) * fb.radius + fb.width / 2) + 'px'
                });
                $('.sl-marker', e).css({
                    left: Math.round(fb.square * (.5 - fb.hsl[1]) + fb.width / 2) + 'px',
                    top: Math.round(fb.square * (.5 - fb.hsl[2]) + fb.width / 2) + 'px'
                });
                $('.color', e).css('backgroundColor', fb.pack(fb.HSLToRGB([fb.hsl[0], 1, 0.5])));
                if (typeof fb.callback == 'object') {
                    if (gotoback) {
                        gotoback(fb.color);
                    } else {
                        $(fb.callback).css({
                            backgroundColor: fb.color,
                            color: fb.hsl[2] > 0.5 ? '#000' : '#fff'
                        });
                    };
                    $(fb.callback).each(function () {
                        if (this.value && this.value != fb.color) {
                            this.value = fb.color
                        };
                    });
                } else if (typeof fb.callback == 'function') {
                    fb.callback.call(fb, fb.color);
                };
            };
            fb.absolutePosition = function (el) {
                var r = {
                    x: el.offsetLeft,
                    y: el.offsetTop
                };
                if (el.offsetParent) {
                    var tmp = fb.absolutePosition(el.offsetParent);
                    r.x += tmp.x;
                    r.y += tmp.y;
                };
                return r;
            };
            fb.pack = function (rgb) {
                var r = Math.round(rgb[0] * 255);
                var g = Math.round(rgb[1] * 255);
                var b = Math.round(rgb[2] * 255);
                return '#' + (r < 16 ? '0' : '') + r.toString(16) + (g < 16 ? '0' : '') + g.toString(16) + (b < 16 ? '0' : '') + b.toString(16);
            };
            fb.unpack = function (color) {
                if (color.length == 7) {
                    return [parseInt('0x' + color.substring(1, 3)) / 255, parseInt('0x' + color.substring(3, 5)) / 255, parseInt('0x' + color.substring(5, 7)) / 255];
                } else if (color.length == 4) {
                    return [parseInt('0x' + color.substring(1, 2)) / 15, parseInt('0x' + color.substring(2, 3)) / 15, parseInt('0x' + color.substring(3, 4)) / 15];
                }
            };
            fb.HSLToRGB = function (hsl) {
                var m1, m2, r, g, b;
                var h = hsl[0],
                    s = hsl[1],
                    l = hsl[2];
                m2 = (l <= 0.5) ? l * (s + 1) : l + s - l * s;
                m1 = l * 2 - m2;
                return [this.hueToRGB(m1, m2, h + 0.33333), this.hueToRGB(m1, m2, h), this.hueToRGB(m1, m2, h - 0.33333)]
            };
            fb.hueToRGB = function (m1, m2, h) {
                h = (h < 0) ? h + 1 : ((h > 1) ? h - 1 : h);
                if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
                if (h * 2 < 1) return m2;
                if (h * 3 < 2) return m1 + (m2 - m1) * (0.66666 - h) * 6;
                return m1
            };
            fb.RGBToHSL = function (rgb) {
                var min, max, delta, h, s, l;
                var r = rgb[0],
                    g = rgb[1],
                    b = rgb[2];
                min = Math.min(r, Math.min(g, b));
                max = Math.max(r, Math.max(g, b));
                delta = max - min;
                l = (min + max) / 2;
                s = 0;
                if (l > 0 && l < 1) {
                    s = delta / (l < 0.5 ? (2 * l) : (2 - 2 * l))
                };
                h = 0;
                if (delta > 0) {
                    if (max == r && max != g) h += (g - b) / delta;
                    if (max == g && max != b) h += (2 + (b - r) / delta);
                    if (max == b && max != r) h += (4 + (r - g) / delta);
                    h /= 6
                };
                return [h, s, l];
            };
            $('*', e).mousedown(fb.mousedown);
            fb.setColor('#000000');
            if (callback) fb.linkTo(callback);
        };
    }(global, doc, $));

    /**
     * 自定义弹窗，图片裁切，图片预览
     */
    (function (global, doc, $) {

        var Cropper = function (scale, opts) {
            this.opts = {
                scale: scale,
                opts: opts
            };
            this.mask = $('<div class="mask">');
            this.cropper = $('<div class="cropper-box" id="cropper-box">');
            this.header = $('<div class="header">');
            this.mainbox = $('<div class="mainbox">');
            this.footer = $('<div class="footer">');
            this.winurl = global.URL || global.webkitURL;
            this.init();
        };

        var InsertSrc = function (src) {
            var URL = global.URL || global.webkitURL;
            $('#cropper-image').one({
                'build.cropper': function (e) {
                    //console.log(e.type);
                },
                'built.cropper': function (e) {
                    URL.revokeObjectURL(src);
                }
            }).cropper('reset').cropper('replace', src);

            $('#input-images').val('');
            if ($('#title_image').length) $('#preview-box .w-100, #preview-box .w-50').css('margin-top', '50px');
        };

        var Alert = function (config) {
            var $this = this;
            MU.AlertThis = $this;
            this.config = {
                width: "auto",
                height: "auto",
                title: "提示信息",
                move: true,
                dom: "",
                hide: "",
                message: "",
                buttons: [],
                time: null,
                opacity: null
            };

            if (config && $.isPlainObject(config)) {
                $.extend(this.config, config)
            } else {
                this.isParameter = true;
            }
            this.mask = $('<section class="alert-mask">');
            this.box = $('<div class="alert-box">');
            this.header = $('<div class="alert-header">');
            this.main = $('<div class="alert-main">');
            this.dom = $('<div class="alert-dom">');
            this.footer = $('<div class="alert-footer">');

            this.header[0].addEventListener('mousedown', function (event) {
                var dom_L = 0, dom_T = 0, moveX = 0, moveY = 0,
                    isdrag = true,
                    box = $this.box[0],
                    e = event || global.event;
                dom_L = e.pageX - box.offsetLeft;
                dom_T = e.pageY - box.offsetTop;
                doc.onmousemove = function (event) {
                    var ev = event || global.event,
                        mouseX = ev.pageX,
                        mouseY = ev.pageY;
                    var domW = box.offsetWidth,
                        domH = box.offsetHeight;
                    var pageW = doc.documentElement.clientWidth,
                        pageH = doc.documentElement.clientHeight;
                    if (isdrag === true) {
                        moveX = mouseX - dom_L;
                        moveY = mouseY - dom_T;
                        moveX = Math.min((pageW - domW), Math.max(0, moveX));
                        moveY = Math.min((pageH - domH), Math.max(0, moveY));
                        box.style.left = moveX + 'px';
                        box.style.top = moveY + 'px';
                    }
                };
                doc.onmouseup = function () {
                    isdrag = false;
                }
            }, true);
            $this.CreateAlert();
        };

        global.console.log("%c\u5b89\u5168❤️\u8b66\u544a\uff01\uff01\uff01", "font-size:56px;color:white;-webkit-text-fill-color:blue;-webkit-text-stroke: 1px blue;");

        var ImgZoom = function (config) {
            this.config = config;
            this.index = 0;
            this.wrapWidth = 0;
            this.liLength = 0;
            this.li = '';
            this.mask = $('<section class="img-zoom-mask">');
            this.close = $('<i class="i zoom-close">');
            this.prev = $('<i class="i zoom-prev">');
            this.next = $('<i class="i zoom-next"">');
            this.slider = $('<ul class="zoom-slider">');
            this.shrink = $('<ul class="zoom-shrink">');
            this.box = $('<div class="zoom-box">');
            this.main = $('<div class="zoom-main">');
            this.wrap = $('<div class="zoom-wrap">');
            this.footer = $('<div class="zoom-footer">');

            if (0 < this.config.imgs.length) {
                for (var i in this.config.imgs) {
                    if (this.config.imgs[i].url) {
                        this.li += '<li><img src=' + this.config.imgs[i].url + ' /></li>';
                    }
                }
                this.liLength = this.config.imgs.length;
                this.CreateImgZoom();
            };
        };

        Cropper.prototype = {
            init: function () {
                if (!$('#cropper-image').length) {
                    this.header.html('<a href="javascript:void(0)">' +
                        '<input type="file" id="input-images" name="UploadForm[photo]" accept=".jpg, .jpeg, .png, .gif" /><span id="btn_text">请选择图片</span></a>' +
                        '<label id="photo-size"></label>' +
                        '<button class="closeCropper" id="close-cropper" type="button">&times;</button>');
                    this.mainbox.html('<div class="canvasbox"><img src="" id="cropper-image" /></div>' +
                        '<div class="preview" id="preview-box">' +
                        '<div class="img-preview w-200"></div>' +
                        '<div class="img-preview w-100"></div>' +
                        '<div class="img-preview w-50"></div>' +
                        '</div>');
                    this.footer.html('<div class="left"><div class="left_lbtn">' +
                        '<button class="btn" type="button" data-method="setDragMode" data-option="move" style="margin:0px;">移动</button>' +
                        '<button class="btn" type="button" data-method="reset">重置</button>' +
                        '</div><div class="left_rbtn">' +
                        '<button class="btn" type="button" data-method="rotate" data-option="-45">左转</button>' +
                        '<button class="btn" type="button" data-method="rotate" data-option="45">右转</button>' +
                        '<button class="btn" type="button" data-method="scaleX" data-option="-1">横向</button>' +
                        '<button class="btn" type="button" data-method="scaleY" data-option="-1">纵向</button>' +
                        '<button class="btn" type="button" data-method="zoom" data-option="0.1">放大</button>' +
                        '<button class="btn" type="button" data-method="zoom" data-option="-0.1">缩小</button>' +
                        '</div></div><div class="right"><button class="btn" type="button" data-method="getCroppedCanvas" data-option="">保 存</button></div></div>');
                    $(doc.body).append(this.mask, this.cropper.append(this.header, this.mainbox, this.footer));
                };
                this.load();
                this.cropper.animate({ top: '50%' });
            },

            load: function () {
                var _this = this;
                this.cropperimg = $('#cropper-image');
                this.cropperimg.cropper({
                    aspectRatio: this.opts.scale,
                    preview: '.img-preview',
                    crossOrigin: 'Anonymous',
                    crop: function (e) {
                        //console.log(Math.round(e.x), Math.round(e.y), Math.round(e.height), Math.round(e.width), e.rotate, e.scaleX, e.scaleY);
                    }
                });
                $(doc.body).on('change', '#input-images', function (event) {
                    var event = event || global.event,
                        target = event.target.files[0] || event.dataTransfer.files[0],
                        type = target.type,
                        size = target.size / (1024 * 1024);
                    size = (target.size > 1024 * 1024) ? (Math.round(target.size * 100 / (1024 * 1024)) / 100).toString() + 'MB' : (Math.round(target.size * 100 / 1024) / 100).toString() + 'KB';
                    $('#btn_text').text('重新选择图片');
                    if (event.target.outerHTML) {
                        event.target.outerHTML = event.target.outerHTML;
                    } else {
                        event.target.value = '';
                    };
                    if (!$('#LoadTitImg_btn').attr('data-size')) {
                        if ('MB' == size.substring(size.length - 2, size.length) && 2 < size.substring(0, size.length - 2)) {
                            $('#photo-size').html('当前图片文件大小：' + size + '，（必须小于2MB），请压缩后再试！').css('color', 'red');
                            return false;
                        };
                    };
                    if (['jpeg', 'png', 'gif', 'jpg'].indexOf(type.split("/")[1]) < 0) {
                        $('#photo-size').html('当前图片文件类型：' + type + '，（必须PNG\JPEG\JPG\GIF格式），请重新选择！').css('color', 'red');
                        return false;
                    } else {
                        if (_this.cropperimg.data('cropper')) {
                            InsertSrc(_this.winurl.createObjectURL(this.files[0]));
                            $('#photo-size').html('已选图片文件大小，共' + size + '。').css('color', '#0091f2');
                        } else {
                            $('#photo-size').html('当前图片文件已损坏，请重新选择！').css('color', 'red');
                        }
                    };
                });
                this.footer.on('click', '[data-method]', function () {
                    var $this = $(this),
                        $data = $this.data(),
                        $target, $result;
                    if (_this.cropperimg.data('cropper') && $data.method) {
                        $data = $.extend({}, $data);
                        if (typeof $data.target !== 'undefined') {
                            $target = $($data.target);
                            if (typeof $data.option === 'undefined') {
                                try {
                                    $data.option = JSON.parse($target.val());
                                } catch (e) {
                                    console.log(e.message);
                                }
                            }
                        }
                        if ($data.method === 'rotate') {
                            _this.cropperimg.cropper('clear');
                        }
                        if ($data.method === 'rotate') {
                            _this.cropperimg.cropper('crop');
                        }
                        $result = _this.cropperimg.cropper($data.method, $data.option);
                        switch ($data.method) {
                            case 'scaleX':
                            case 'scaleY':
                                $(this).data('option', -$data.option);
                                break;
                            case 'getCroppedCanvas':
                                if ($result) {
                                    _this.opts.opts.getBase64($result);
                                }
                                break;
                        }
                        if ($.isPlainObject($result) && $target) {
                            try {
                                $target.val(JSON.stringify($result));
                            } catch (e) {
                                console.log(e.message);
                            }
                        }
                    }
                });
                $(doc.body).on('click', '#close-cropper', function () {
                    _this.cropper.animate({ top: '-50%' }, '300', function () {
                        $('.mask').hide();
                    });
                });
            }
        };

        Alert.prototype = {
            RemoveAlert: function (clear) {
                var _this = this;
                if (1 == MU.All__Role || 2 == MU.All__Role || 3 == MU.All__Role) {
                    if (!clear) {
                        MU.isExitsFunction('DeleteAllSelect()');
                    }
                }
                if (_this.config.move) {
                    _this.box.css({
                        'transform': 'scale(0)',
                        '-webkit-transform': 'scale(0)'
                    });
                    MU.setTimeout(function () {
                        _this.mask.remove();
                    }, 300);
                } else {
                    _this.mask.remove();
                }
                doc.body.style.overflow = "auto";
            },
            CreateButton: function (obj, footer) {
                var _this = this;
                obj.forEach(function (obj) {
                    var css = obj.style ? 'class=' + obj.style : 'class="cancel"',
                        name = obj.name ? obj.name : '取消',
                        $fn = obj.callback ? obj.callback : null,
                        $btn = $('<button ' + css + '>' + name + '</button>');
                    if ($fn) {
                        if ("cache" === $fn) {
                            $btn.click(function () {
                                _this.RemoveAlert(true);
                            });
                        } else {
                            $btn.click(function () {
                                $fn(_this);
                            });
                        }
                    } else {
                        $btn.click(function () {
                            _this.RemoveAlert();
                        });
                    }
                    footer.append($btn);
                });
            },
            Animation: function () {
                var $this = this;
                $($this.mask).on('touchmove', function (event) {
                    var e = event || global.event;
                    e.preventDefault();
                    e.stopPropagation();
                }, false);
                doc.body.style.overflow = "hidden";
                $this.box.css({
                    'transform': 'scale(0)',
                    '-webkit-transform': 'scale(0)'
                });
                MU.setTimeout(function () {
                    $this.box.css({
                        'top': ($(global).height() - $($this.box).height()) / 2,
                        'left': ($(global).width() - $($this.box).width()) / 2,
                        'transform': 'scale(1)',
                        '-webkit-transform': 'scale(1)'
                    });
                }, 100);
            },
            CreateAlert: function () {
                var mask = this.mask,
                    box = this.box,
                    header = this.header,
                    main = this.main,
                    dom = this.dom,
                    config = this.config,
                    footer = this.footer,
                    close = config.hide == 'close' ? '' : '<i onclick="MU.AlertThis.RemoveAlert()">';
                if (this.isParameter) {
                    $('body').append(mask.append(box.append(header.append('<span>' + config.title + '</span><hr/>' + close))));
                } else {
                    box.append(header.append('<span>' + config.title + '</span><hr/>' + close));
                    if (config.message) {
                        box.append(main.append(config.message));
                    }
                    if (config.dom) {
                        box.append(dom.append(config.dom));
                    }
                    if (config.buttons) {
                        this.CreateButton(config.buttons, footer);
                        box.append(footer);
                    }
                    $('body').append(mask.append(box));

                    if ('auto' != config.width) {
                        box.width(config.width);
                    }
                    if ('auto' != config.height) {
                        box.height(config.height);
                    }
                    if (config.opacity) {
                        mask.css('backgroundColor', 'rgba(0, 0, 0, ' + config.opacity + ')');
                    }
                    if (config.time && 0 < config.time) {
                        var $this = this;
                        MU.setTimeout(function () {
                            $this.RemoveAlert();
                        }, config.time);
                    }
                    if (config.move) {
                        this.Animation();
                    }
                }
            }
        };

        ImgZoom.prototype = {
            ShrinkActive: function (i) {
                MU.setTimeout(function () {
                    $('.zoom-slider li').eq(i).addClass('activc').siblings('li').removeClass('activc');
                    $('.zoom-shrink li').eq(i).addClass('active').siblings('li').removeClass('active');
                }, 200);
            },

            SetLiftPx: function (i) {
                this.slider.css('left', -(this.wrapWidth * i));
                this.ShrinkActive(i);
            },

            SlidePrev: function () {
                this.index--;
                if (-1 == this.index) {
                    this.index = this.liLength - 1;
                };
                this.SetLiftPx(this.index);
            },

            SlideNext: function () {
                this.index++;
                if (this.liLength == this.index) {
                    this.index = 0;
                };
                this.SetLiftPx(this.index);
            },

            CreateImgZoom: function () {
                var _this = this,
                    mask = _this.mask,
                    close = _this.close,
                    prev = _this.prev,
                    next = _this.next,
                    slider = _this.slider,
                    shrink = _this.shrink,
                    box = _this.box,
                    main = _this.main,
                    wrap = _this.wrap,
                    footer = _this.footer;
                $('body').append(mask.append(close, box.append(main.append(prev, wrap.html(slider.html(_this.li)), next), footer.html(shrink.html(_this.li)))));

                _this.wrapWidth = wrap.width();
                box.movedraw('rollIn');
                slider.width(_this.wrapWidth * _this.liLength);
                shrink.width(102 * _this.liLength);

                close.click(function () {
                    box.movedraw('rollOut');
                    MU.setTimeout(function () {
                        _this.mask.remove();
                    }, 300);
                });

                prev.click(function () {
                    _this.SlidePrev();
                });

                next.click(function () {
                    _this.SlideNext();
                });

                $(doc.body).on('click', '.zoom-shrink li', function () {
                    _this.index = $(this).index();
                    _this.ShrinkActive($(this).index());
                    _this.SetLiftPx($(this).index());
                });

                if (2 > _this.liLength) {
                    prev.hide();
                    next.hide();
                };

                _this.index = _this.config.index;
                _this.SetLiftPx(_this.index);
            },
        };

        global.console.log("%c\u8be5\u5728\u7ebf\u7f16\u8f91\u5668\u7528\u4e8e\u672c\u4eba\u7814\u7a76\u548c\u5b66\u4e60\u4f7f\u7528\u7684\uff0c\u4e3b\u8981\u529f\u80fd\u7c7b\u4f3c\u5fae\u4fe1\u53d1\u5e03\u6587\u7ae0\u7684\u7f16\u8f91\u5668\uff0c\u4ec5\u4f9b\u53c2\u8003\uff01", "font-size:22px; color:red; background:yellow;");

        $.extend({
            Alert: function (options) {
                return new Alert(options);
            },
            Cropper: function (scale, options) {
                return new Cropper(scale, options);
            },
            CropperSrc: function (src) {
                InsertSrc(src);
            }
        });

        global.Alert = Alert;

        MU.Alert = function (options) {
            return new Alert(options);
        };

        MU.ImgZoom = function (options) {
            return new ImgZoom(options);
        };

    }(global, doc, $));

    return MU;
})));