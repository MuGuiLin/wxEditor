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

    (function ($) {
        Element.prototype.mupiao = function () {
            return `myMupiao()`;
        };
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
        var rotateLeft = function (lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        };
        var addUnsigned = function (lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            if (lX4 | lY4) {
                if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        };
        var F = function (x, y, z) {
            return (x & y) | ((~x) & z);
        };
        var G = function (x, y, z) {
            return (x & z) | (y & (~z));
        };
        var H = function (x, y, z) {
            return (x ^ y ^ z);
        };
        var I = function (x, y, z) {
            return (y ^ (x | (~z)));
        };
        var FF = function (a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };
        var GG = function (a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };
        var HH = function (a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };
        var II = function (a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };

        global.console.log("%chttps://github.com/MuGuiLin/wxEditor", "font-size:32px; color:blue;");

        var convertToWordArray = function (string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWordsTempOne = lMessageLength + 8;
            var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
            var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        };
        var wordToHex = function (lValue) {
            var WordToHexValue = "",
                WordToHexValueTemp = "",
                lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValueTemp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
            }
            return WordToHexValue;
        };
        var uTF8Encode = function (string) {
            string = string.replace(/\x0d\x0a/g, "\x0a");
            var output = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    output += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    output += String.fromCharCode((c >> 6) | 192);
                    output += String.fromCharCode((c & 63) | 128);
                } else {
                    output += String.fromCharCode((c >> 12) | 224);
                    output += String.fromCharCode(((c >> 6) & 63) | 128);
                    output += String.fromCharCode((c & 63) | 128);
                }
            }
            return output;
        };

        $.getUrlParam = function (o) {
            var p = new RegExp("(^|&)" + o + "=([^&]*)(&|$)");
            var r = global.location.search.substr(1).match(p);
            if (r != null) return unescape(r[2]);
            return null;
        };

        $.extend({
            QD__NET__: '',  //global.location.host,  //前端API域名 (用于 让开发，测试，生产3个环境自动识别当前点击上传图片地址域名所改【注：这是修改编辑器自带的上传哦】)
            HD__NET__: '',  //global.location.host,  //后端API域名 （用于图裁切等,自定义上传功能【注：不是编辑器自带的上传功能哦】）

            md5: function (string) {
                var x = Array();
                var k, AA, BB, CC, DD, a, b, c, d;
                var S11 = 7,
                    S12 = 12,
                    S13 = 17,
                    S14 = 22;
                var S21 = 5,
                    S22 = 9,
                    S23 = 14,
                    S24 = 20;
                var S31 = 4,
                    S32 = 11,
                    S33 = 16,
                    S34 = 23;
                var S41 = 6,
                    S42 = 10,
                    S43 = 15,
                    S44 = 21;

                string = uTF8Encode(string);
                x = convertToWordArray(string);
                a = 0x67452301;
                b = 0xEFCDAB89;
                c = 0x98BADCFE;
                d = 0x10325476;

                for (k = 0; k < x.length; k += 16) {
                    AA = a;
                    BB = b;
                    CC = c;
                    DD = d;
                    a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
                    d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
                    c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
                    b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
                    a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
                    d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
                    c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
                    b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
                    a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
                    d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
                    c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
                    b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
                    a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
                    d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
                    c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
                    b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
                    a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
                    d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
                    c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
                    b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
                    a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
                    d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
                    c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
                    b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
                    a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
                    d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
                    c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
                    b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
                    a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
                    d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
                    c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
                    b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
                    a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
                    d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
                    c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
                    b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
                    a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
                    d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
                    c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
                    b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
                    a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
                    d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
                    c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
                    b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
                    a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
                    d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
                    c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
                    b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
                    a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
                    d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
                    c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
                    b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
                    a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
                    d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
                    c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
                    b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
                    a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
                    d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
                    c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
                    b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
                    a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
                    d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
                    c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
                    b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
                    a = addUnsigned(a, AA);
                    b = addUnsigned(b, BB);
                    c = addUnsigned(c, CC);
                    d = addUnsigned(d, DD);
                }
                var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
                return tempValue.toLowerCase();
            }
        });

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
    }($));

    (function (factory) {
        if (typeof define === 'function' && define.amd) {
            define(['jquery'], factory);
        } else if (typeof exports === 'object') {
            factory(require('jquery'));
        } else {
            factory(jQuery);
        }
    }(function ($) {
        var pluses = /\+/g;

        function encode(s) {
            return configs.raw ? s : encodeURIComponent(s);
        };

        function decode(s) {
            return configs.raw ? s : decodeURIComponent(s);
        };

        function stringifyCookieValue(value) {
            return encode(configs.json ? JSON.stringify(value) : String(value));
        };

        function parseCookieValue(s) {
            if (s.indexOf('"') === 0) {
                s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            }
            try {
                s = decodeURIComponent(s.replace(pluses, ' '));
                return configs.json ? JSON.parse(s) : s;
            } catch (e) { }
        };

        function read(s, converter) {
            var value = configs.raw ? s : parseCookieValue(s);
            return $.isFunction(converter) ? converter(value) : value;
        };

        var configs = $.cookie = function (key, value, options) {
            if (value !== undefined && !$.isFunction(value)) {
                options = $.extend({}, configs.defaults, options);
                if (typeof options.expires === 'number') {
                    var days = options.expires,
                        t = options.expires = new Date();
                    t.setTime(+t + days * 864e+5);
                }
                return (doc.cookie = [
                    encode(key), '=', stringifyCookieValue(value),
                    options.expires ? '; expires=' + options.expires.toUTCString() : '',
                    options.path ? '; path=' + options.path : '',
                    options.domain ? '; domain=' + options.domain : '',
                    options.secure ? '; secure' : ''
                ].join(''));
            };
            var result = key ? undefined : {};
            var cookies = doc.cookie ? doc.cookie.split('; ') : [];
            for (var i = 0, l = cookies.length; i < l; i++) {
                var parts = cookies[i].split('=');
                var name = decode(parts.shift());
                var cookie = parts.join('=');
                if (key && key === name) {
                    result = read(cookie, value);
                    break;
                }
                if (!key && (cookie = read(cookie)) !== undefined) {
                    result[name] = cookie;
                }
            }
            return result;
        };
        configs.defaults = {};
        $.removeCookie = function (key, options) {
            if ($.cookie(key) === undefined) {
                return false;
            }
            $.cookie(key, '', $.extend({}, options, {
                expires: -1
            }));
            return !$.cookie(key);
        };
    }));

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

    (function (global, doc, $) {
        var Init = function () {

            this.All__Url = $.HD__NET__ + "/index.php/api/index";

            this.Upload__Image__Url = $.HD__NET__ + "/index.php/upload/images";

            this.Upload__Cover__Url = $.HD__NET__ + "/index.php/upload/cover";

            this.Upload__Photo__Url = $.HD__NET__ + "/index.php/upload/photo";

            this.Upload__Files__Url = $.HD__NET__ + "/index.php/upload/file";

            this.Upload__Music__Url = $.HD__NET__ + "/index.php/upload/music";

            this.Upload__Audio__Url = $.HD__NET__ + "/index.php/upload/audio";

            this.Upload__Video__Url = $.HD__NET__ + "/index.php/upload/video";

            this.localSave = localStorage || global.localStorage;

            this.sessionSave = sessionStorage || global.sessionStorage;

            this.title = doc.title;

            this.wxh_Name = this.author_Name = this.title_Image = this.draft_Title = this.draft_Date = this.draft_Link = '';

            this.pathName = global.location.pathname;

            this.hostName = doc.domain || global.location.host;

            this.isiPhone = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent || global.navigator.userAgent);

            this.init();
            this.getId = function (id) {
                return document.querySelector('#' + id) || document.getElementById(id);
            };
        };

        Init.prototype = {

            init: function () {
            },

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

            focusStyleFn: function (obj) {
                $(obj).css({
                    borderColor: "#157EFB",
                    boxShadow: "0px 0px 5px 0px #43B7FF"
                });
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

            blurStyleFn: function (obj) {
                $(obj).css({
                    borderColor: "",
                    boxShadow: ""
                });
            },

            errorPromptFn: function (tag, cor, info, time) {
                $("" + tag + "").css("color", cor).html(info);
                if (time) {
                    this.setTimeout(function () {
                        $("" + tag + "").html("");
                    }, (time + "000"));
                }
            },

            upDateDomWh: function (obj) {
                $(obj).find('img, section, p, ul, li, table, video, iframe, embed, object').each(function (i, e) {
                    var $this = $(this),
                        $width = $this.width() || $this.css('width'),
                        $height = $this.height() || $this.css('height');
                    if ($width >= $(obj).width()) {
                        $this.attr({ 'width': '100%', 'height': 'auto' }).css({ 'width': '100%', 'height': 'auto' });
                        if ($this.attr('src') && -1 != $this.attr('src').indexOf('/Public/qqPlay/')) {
                            $this.attr({ 'width': '100%', 'height': $height }).css({ 'width': '100%', 'height': $height });
                        };
                    };
                });
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

            codeToUtf8: function (str) {
                var out, i, len, c;
                out = "";
                len = str.length;

                for (i = 0; i < len; i++) {
                    c = str.charCodeAt(i);
                    if ((c >= 0x0001) && (c <= 0x007F)) {
                        out += str.charAt(i);
                    } else if (c > 0x07FF) {
                        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                        out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                    } else {
                        out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                    }
                }
                return out;
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

            Ajax: function (obj, noe) {
                var _this = this
                return $.ajax({
                    type: "POST",
                    url: _this.All__Url,
                    data: obj,
                    timeout: 10000,
                    cache: false,
                    async: false,
                    dataType: "JSON",
                    beforeSend: function () { },
                    success: function () {
                        if (_this.AlertThis && !noe) {
                            _this.AlertThis.RemoveAlert();
                        }
                    },
                    error: function () {
                        if (_this.AlertThis && !noe) {
                            _this.AlertThis.RemoveAlert();
                        }
                    }
                });
            },

            EncRypt: function () {
                var Date_Obj = new Date();
                var Date_Str = Date_Obj.getFullYear() + "" + (Date_Obj.getMonth() + 1) + "" + Date_Obj.getDate();
                var Week_Num = Date_Obj.getDay() == 0 ? 7 : Date_Obj.getDay();
                return $.md5("*Ih*ub*" + (Date_Str * Week_Num) + "@idi@tor@");
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