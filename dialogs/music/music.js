; (function (global, factory) {
    "use strict";

    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        global.mupiao = factory();
    };

    mupiao = new mupiao({
        type: 'qq'
    });

    dialog.onok = function () {
        mupiao.exec();
    };

    dialog.oncancel = function () {
        $G('J_preview').innerHTML = "";
    };
}(typeof window !== "undefined" ? window : this, function () {
    "use strict";

    var Init = function () {
        this.tab = true;
        this.init();
    }, LOCAL_SRC_ = '';

    Init.prototype = {
        init: function () {
            var _this = this,
                _tabs = $G('tabHeads').children;
            for (var i = 0, len = _tabs.length; i < len; i++) {
                domUtils.on(_tabs[i], "click", function (e) {
                    var target = e.target || e.srcElement;
                    _this.tab = 'qqmusic' == target.getAttribute('data-content-id') ? true : false;
                    for (var j = 0; j < _tabs.length; j++) {
                        var bodyId = _tabs[j].getAttribute('data-content-id');
                        if (_tabs[j] == target) {
                            domUtils.addClass(_tabs[j], 'focus');
                            domUtils.addClass($G(bodyId), 'focus');
                        } else {
                            domUtils.removeClasses(_tabs[j], 'focus');
                            domUtils.removeClasses($G(bodyId), 'focus');
                        };
                    };
                });
            };
        },
        getDom: function (o) {
            var dom = '';
            switch (o.type) {
                case 'qq':
                    dom = '<iframe class="res_iframe qqmusic_iframe js_editor_qqmusic" style="height:68px;" scrolling="no" frameborder="0" musicid="' + o.data['musicid'] + '" mid="' + o.data['mid'] + '" albumurl="' + o.data['albumurl'] + '" audiourl="' + o.data['audiourl'] + '" music_name="' + o.data['music_name'] + '" singer="' + o.data['singer'] + '" play_length="' + o.data['play_length'] + '" src="https://mp.weixin.qq.com' + o.data['src'] + '" musictype="' + o.data['musictype'] + '" otherid="' + o.data['otherid'] + '" albumid="' + o.data['albumid'] + '" jumpurlkey="' + o.data['jumpurlkey'] + '"></iframe>&#8203;';
                    break;
                case 'bd':
                    dom = '<audio src=' + o.data + ' controls><a href=' + o.data + '>当前不支持播放，请点击这里下载！</a></audio>&#8203;';
                    break;
                case 'wx':
                    dom = '<qqmusic class="res_iframe qqmusic_iframe js_editor_qqmusic place_music_area" scrolling="no" frameborder="0" musicid="' + o.data['musicid'] + '" mid="' + o.data['mid'] + '" albumurl="' + o.data['albumurl'] + '" audiourl="' + o.data['audiourl'] + '" music_name="' + o.data['music_name'] + '" singer="' + o.data['singer'] + '" play_length="' + o.data['play_length'] + '" src="' + o.data['src'] + '" musictype="' + o.data['musictype'] + '" otherid="' + o.data['otherid'] + '" albumid="' + o.data['albumid'] + '" jumpurlkey="' + o.data['jumpurlkey'] + '"></qqmusic>';
                    dom += '<iframe style="width:556px;height:68px;" scrolling="no" frameborder="0" src="/muguilin/qqPlay/index.html?' + o.data['_src'] + '"></iframe>&#8203;';
                    break;
                default:
                    dom = '<iframe style="width:556px;height:68px;" scrolling="no" frameborder="0" src="/muguilin/qqPlay/index.html?' + o.data['_src'] + '"></iframe>&#8203;';
                    break;
            };
            return dom;
        },
    };

    var QQ = function (opts) {
        this.opts = {
            name: opts.name || 'mupiao',
            page: 1,
            annal: 60,
            total: 72,

            __URL__: opts.url || 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp?',
            __SRC__: opts.src || 'https://api.bzqll.com/music/tencent/url?',

            dataUrl: opts.dataUrl || 'https://auth-external.music.qq.com/open/fcgi-bin/fcg_weixin_music_search.fcg?',
            playUrl: opts.playUrl || 'http://ws.stream.qqmusic.qq.com?',

            dataUrl2: "https://auth-external.music.qq.com/open/fcgi-bin/fcg_weixin_music_search.fcg?",
            playUrl2: "http://dl.stream.qqmusic.qq.com/",
        };

        this.list = null;
        this.song = null;
        this.data = null;
        this.audio = null;

        this.Init = new Init();

        this.init();
    };

    QQ.prototype = {
        init: function () {
            var _this = this;
            _this.addAudio();
            domUtils.on($G("J_searchName"), "keyup", function (e) {
                13 == (window.event || e).keyCode && _this.search();
            });
            domUtils.on($G("J_searchBtn"), "click", function () {
                _this.search();
            });

            return _this;
        },

        query: function (par) {
            var _this = this, opts = _this.opts;
            $G('J_resultBar').innerHTML = '<div class="loading"></div>';
            if (0) {
                $.ajax({
                    type: "get",
                    url: opts.dataUrl + "jsonCallback=callback&remoteplace=txt.weixin.officialaccount&w=" + par + "&platform=weixin&perpage=" + opts.total + "&curpage=1",
                    dataType: "jsonp",
                    jsonp: "callback",
                    jsonpCallback: "callback",
                    success: function (o) {
                        _this.generate(o, par);
                    },
                    error: function (e) {
                        console.log(e)
                    }
                });
            } else {
                $.ajax({
                    type: "get",
                    url: opts.__URL__ + 'aggr=1&cr=1&flag_qc=0&p=' + opts.page + '&n=' + opts.annal + '&w=' + par,
                    dataType: 'jsonp',
                    jsonp: "jsonpCallback",
                    success: function (o) {
                        _this.generate(o.data, par);
                    },
                    error: function (e) {
                        console.log(e)
                    }
                });
            }
            return _this;
        },

        addAudio: function () {
            this.audio = document.createElement('audio');
            this.audio.id = 'audio';
            document.body.appendChild(this.audio);
            return this;
        },

        select: function (i) {
            if (this.song) {
                this.data = this.song[i];
                return this.data['songmid'];
            };
            if (this.list) {
                this.data = this.list[i];
                return this.data.f.split("|")[20];
            };
        },

        play: function (o, i) {
            this.audio.src = this.opts.__SRC__ + 'id=' + this.select(i) + '&key=579621905&br=320';
            this.audio.play();
            $('#J_resultBar .play').each(function () {
                $(this).removeClass('play1').prop('checked', false);
            }); $(o).addClass('play1').parents('tr').find('.radio').prop('checked', true);
        },

        search: function () {
            var key = $G('J_searchName').value;
            if (utils.trim(key)) {
                this.query(encodeURIComponent(key));
            } else {
                alert('请正确输入关键字！');
            }
            return this;
        },

        generate: function (d, t) {
            var _this = this, dom = '', o = d.list ? d.list : d.song.list;
            if (d.list) {
                _this.list = o;
            } else {
                _this.song = o;
            };
            if (0 < o.length) {
                dom += '<table class="musci-list-table">';
                dom += '<thead>';
                dom += '<tr><th class="w60">选 择</th><th>歌 名</th><th>歌 手</th><th class="w88">操 作</th></tr>';
                dom += '</thead>';
                dom += '<tbody>';
                for (let i = 0, len = o.length; i < len; i++) {
                    dom += '<tr>';
                    dom += '<td class="w60"><input type="radio" class="radio" name="radio" onclick="window.mupiao.select(' + i + ')" /></td>';
                    if (d.list) {
                        dom += '<td>' + o[i].songname + '</td>';
                        dom += '<td>' + o[i].singername + '</td>';
                    } else {
                        dom += '<td>';
                        dom += o[i].songname ? o[i].songname : t;
                        dom += '</td><td>';
                        dom += (o[i].singer && o[i].singer[0] && o[i].singer[0].name) ? o[i].singer[0].name : '未知'
                        dom += '</td>';
                    };
                    dom += '<td class="w60"><button type="button" class="play" onclick="window.mupiao.play(this, ' + i + ')"></button></td>';
                    dom += '</tr>';
                };
                dom += '</tbody>';
                dom += '</table>';
            } else {
                dom += '<div class="empty">对不起：没有找到“ ' + decodeURIComponent(t) + ' ”相关的音乐资源！</div>';
            };
            $G('J_resultBar').innerHTML = dom;
            return _this;
        },

        getAlbumurl: function (o, f) {
            var o = o.f ? o.f.split("|")[22] : o;
            o = "/" + o.slice(o.length - 2, o.length - 1) + "/" + o.slice(o.length - 1, o.length) + "/" + o + ".jpg";
            if (f) {
                if (!/^http(s)?:\/\//i.test(o)) {
                    var src = "https://imgcache.qq.com/music/photo/mid_album_68",
                        url = "https://y.gtimg.cn/music/photo_new/T002R68x68M000#mid#.jpg",
                        img = o.split("/");
                    try {
                        img = img[img.length - 1];
                        img = img.split(".")[0];
                    } catch (e) {
                        img = "";
                    }
                    return (!img) ? src + o : url.replace("#mid#", img);
                }
            } else {
                return o;
            }
        },

        getPar: function (o) {
            var _this = this;
            if (_this.data) {
                if (_this.song) {
                    return {
                        musicid: _this.data.songid,
                        mid: _this.data.songmid,
                        albumurl: _this.getAlbumurl(_this.data.albummid),
                        audiourl: 'http://ws.stream.qqmusic.qq.com/C100' + _this.data.songmid + '.m4a?fromtag=46',
                        music_name: _this.data.songname,
                        singer: _this.data.singer[0].name,
                        play_length: _this.data.interval,
                        src: '/cgi-bin/readtemplate?t=tmpl/qqmusic_tmpl&singer=' + encodeURIComponent(_this.data.singer[0].name) + '&music_name=' + encodeURIComponent(_this.data.songname) + (_this.getAlbumurl(_this.data.albummid) ? '&albumurl=' + encodeURIComponent(_this.getAlbumurl(_this.data.albummid)) : '') + '&musictype=1',
                        _src: 'singer=' + encodeURIComponent(_this.data.singer[0].name) + '&music_name=' + encodeURIComponent(_this.data.songname) + (_this.getAlbumurl(_this.data.albummid) ? '&albumurl=' + encodeURIComponent(_this.getAlbumurl(_this.data.albummid, true)) : '') + '&playurl=' + encodeURIComponent(_this.opts.__SRC__ + 'id=' + _this.data.songmid + '&key=579621905&br=320'),
                        musictype: 1,
                        otherid: _this.data.albummid,
                        albumid: _this.data.songmid,
                        jumpurlkey: ''
                    }
                } else {
                    return {
                        musicid: _this.data.id,
                        mid: _this.data.f.split("|")[20],
                        albumurl: _this.getAlbumurl(_this.data),
                        audiourl: _this.data.m4a,
                        music_name: _this.data.songname,
                        singer: _this.data.singername,
                        play_length: _this.data.f.split("|")[7],
                        src: '/cgi-bin/readtemplate?t=tmpl/qqmusic_tmpl&singer=' + encodeURIComponent(_this.data.singername) + '&music_name=' + encodeURIComponent(_this.data.songname) + (_this.getAlbumurl(_this.data) ? '&albumurl=' + encodeURIComponent(_this.getAlbumurl(_this.data)) : '') + '&musictype=1',
                        _src: 'singer=' + encodeURIComponent(_this.data.singername) + '&music_name=' + encodeURIComponent(_this.data.songname) + (_this.getAlbumurl(_this.data) ? '&albumurl=' + encodeURIComponent(_this.getAlbumurl(_this.data, true)) : '') + '&playurl=' + encodeURIComponent(_this.opts.__SRC__ + 'id=' + _this.data.f.split("|")[20] + '&key=579621905&br=320'),
                        musictype: 1,
                        otherid: _this.data.f.split("|")[22],
                        albumid: _this.data.f.split("|")[20],
                        jumpurlkey: ''
                    }
                }
            } else {
                alert('请选择音乐');
                return false;
            };
        },

        getUrl: function () {
            return 'https://mp.weixin.qq.com/cgi-bin/readtemplate?t=tmpl/qqmusic_tmpl&singer=' + this.getPar().singer + '&music_name=' + this.getPar().music_name + 'from=tiebasongwidget&url=' + encodeURIComponent(this.getPar().audiourl) + '&name=' + encodeURIComponent(this.getPar().singer) + '&artist=' + encodeURIComponent(this.getPar().music_name) + '&extra=' + encodeURIComponent(this.getPar().albumurl) + '&autoPlay=false&loop=true';
        },

        exec: function () {
            var _this = this;
            $G("J_preview").innerHTML = "";
            if (0) {
                editor.execCommand('music', {
                    url: _this.getUrl(),
                    width: 300,
                    height: 66,
                    selectData: _this.getPar()
                });
            } else {
                if (_this.Init.tab) {
                    editor.execCommand("inserthtml", _this.getPar() ? _this.Init.getDom({
                        type: 'wx',
                        data: _this.getPar()
                    }) : '');
                } else {
                    editor.execCommand("inserthtml", LOCAL_SRC_ ? _this.Init.getDom({
                        type: 'bd',
                        data: LOCAL_SRC_
                    }) : '');
                }
            }
            return _this;
        }
    };

    var KuGou = function () {

    };

    KuGou.prototype = {

    };

    var Local = function () {
        this.QQ = new QQ({});
        this.Init = new Init();

        this.name = null;
        this.size = null;
        this.target = null;
        this.init();
    };

    Local.prototype = {
        progress: function (o) {
            var $progs = $('#head-btn .progress');
            if (o.show) {
                $progs.show();
                $progs.find('.text').text(o.speed + '%');
                $progs.find('.percentage').css('width', o.speed + '%');
            } else {
                $progs.find('.text').text(o.speed + '%');
                $progs.find('.percentage').css('width', o.speed + '%');
                $progs.hide();
            }
        },

        onProgRess: function (e) {
            this.progress({
                show: true,
                speed: Math.floor(99 * (e.loaded / e.total))
            });
        },

        upload: function () {
            var _this = this,
                event = event || window.event,
                xhr = $.ajaxSettings.xhr(),
                oFile = this.target,
                oData = new FormData();
            oData.set("Music", oFile);

            window.setTimeout(function () {
                $.ajax({
                    type: "POST",
                    url: MU.Upload__Music__Url,
                    data: oData,
                    cache: false,
                    async: true,
                    beforeSend: function (o) { },
                    processData: false,
                    contentType: false,
                    xhr: function (o) {
                        if (_this.onProgRess && xhr.upload) {
                            xhr.upload.addEventListener("progress", function (event) {
                                _this.onProgRess.call(_this, event);
                            }, false);
                            return xhr;
                        }
                    },
                    success: function (o) {
                        var o = JSON.parse(o), _text = "";
                        switch (o.status) {
                            case 1:
                                LOCAL_SRC_ = o.url;
                                _text = oFile.name + "上传成功!";
                                _this.progress({ show: false, speed: 100 });
                                break;
                            case 2:
                                _text = "目录创建失败!";
                                break;
                            case 4:
                                _text = "请上传不超过100M的音频素材!";
                                break;
                            case 5:
                                _text = "上传文件大超限（小于100MB）!";
                                break;
                            case 6:
                                _text = "文件保存失败!";
                                break;
                            default:
                                _text = "未知错误!";
                                break;
                        };
                        $("#music-size").text(_text);
                    }
                });
            }, 666);
        },

        init: function () {
            var _this = this;

            $(document.body).on('click', '#select-file', function () {
                $('#music-file').click();
            });

            $(document.body).on('click', '#open-upload', function () {
                if ($(this).text() == '开始上传') {
                    $('#music-file').val() ? _this.upload() : alert("对不起：请先选择文件！");
                } else {
                    $('#music-file').click();
                }
            });

            $(document.body).on('change', '#music-file', function (event) {
                var event = event || window.event;
                _this.target = event.target.files[0] || event.dataTransfer.files[0];
                _this.name = _this.target.name;
                _this.size = _this.target.size / (1024 * 1024);

                if (!_this.target) {
                    alert("对不起：请选择音频文件!");
                    return false;
                } else if (_this.size.toFixed(2) > 30) { //格式支持mp3、wma、wav、amr、m4a，文件大小不超过30M，语音时长不超过30分钟
                    alert("对不起：文件过大，请重新选择！");
                    return false;
                } else {
                    $('#dnd-area').css('height', '116px');
                    $('#open-upload').text('开始上传');
                    $('#music-size').html('音频文件大小，共' + _this.size.toFixed(2) + 'MB。');
                    $('#head-btn').show();
                }
            });
        }
    };

    var Music = function (opts) {
        if ('qq' == opts.type) {
            return QQ;
        } else {
            return KuGou;
        }
    }

    window.Music = function (opts) {
        new Local();
        return new Init(opts);
    }();

    return QQ;
}));