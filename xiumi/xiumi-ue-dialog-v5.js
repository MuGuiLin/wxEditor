/**
 * Created by shunchen_yang on 16/10/25.
 */

App = new Object();

App.WordLength = function (obj, size) {
	if ($(obj).val().length > size) {
		$(obj).val($(obj).val().slice(0, size));
		$('toast-text-ttile').prompt('red', '字数不能超过' + size + '字！', 2000, true);
	}
};

App.ImgUpload = function (event) {
	var event = event || window.event,
		oFile = event.target.files[0] || event.dataTransfer.files[0],
		oData = new FormData();
		oData.set("howm", 2);
		oData.set("image", oFile);
		oData.set("uid", MU.All__Uid);

	if (2 < (oFile.size / (1024 * 1024))) {
		$('#toast-text-red').prompt('red', '图片文件大小不能超过2MB！', 2000, true);
		return false;
	}
	$.ajax({
		type: "POST",
		url: MU.Upload__Image__Url,
		data: oData,
		cache: false,
		async: true,
		beforeSend: function (o) {},
		processData: false,
		contentType: false,
		success: function (o) {
			var o = JSON.parse(o);
			if (1 == o.status) {
				$('#mode-image').attr('src', o.url).slideDown();
			}
		}
	});
};

App.OpenLets = function () {
	var html5 = '', 
	 	appid = $('#app-id').val(),
		appsrc = $('#app-src').val(),
		isshow = $('#is-show-box input:radio[name="show"]:checked').val(),
		apptxt = $('#app-txt').val(),
		appimg = $('#mode-image').attr('src'),
		apptit = $('#app-card-tit').val(),
		cradimg = $('#crad-image').attr('src');
	if (!appid) {
		$('#toast_text').prompt('red', '请输入小程序APPID！', 2000, true);
		$('#app-id').focus();
		return false;
	}
	if (!appsrc) {
		$('#toast_text').prompt('red', '请输入小程序路径！', 2000, true);
		$('#app-src').focus();
		return false;
	}
	if (1 == isshow) {
		if (!apptxt) {
			$('#toast_text').prompt('red', '请输入文字内容！', 2000, true);
			$('#app-txt').focus();
			return false;
		}
		html5 = '<p><a data-miniprogram-appid="'+ appid +'" data-miniprogram-path="'+ appsrc +'" href="" class="weapp_text_link">'+ apptxt +'</a></p>';
	}
	if (2 == isshow) {
		if (!appimg) {
			$('#toast_text').prompt('red', '请添加上传图片！', 2000, true);
			return false;
		}
		html5 = '<p><a data-miniprogram-appid="' + appid + '" data-miniprogram-path="' + appsrc + '" href=""><img src="' + appimg + '" alt="" width="160px" data-width="null" data-ratio="NaN"></a></p>';
	}
	if (3 == isshow) {
		if (!apptit) {
			$('#toast_text').prompt('red', '请输入卡片标题！', 2000, true);
			$('#app-card-tit').focus();
			return false;
		}
		if (!cradimg) {
			$('#toast_text').prompt('red', '请添加卡片封面！', 2000, true);
			return false;
		}
		html5 = '<p><mp-miniprogram data-miniprogram-appid="'+ appid +'" data-miniprogram-path="'+ appsrc +'"  data-miniprogram-title="'+ apptit +'" data-miniprogram-imageurl="'+ cradimg +'"></mp-miniprogram>'
			+'<iditorminiprogram><lable style="display: block; padding: 2px; width: 220px; border: 1px solid #e1e1e1; background-color: #fdfdfd; ">'
        	+'<span style="display: block; padding-left: 6px; line-height: 32px; "><i class="weapp-xiao-logo"></i> iDitor全发部云</span>'
        	+'<b style="display: block; padding-left: 6px; line-height: 32px; color: #666; border-bottom: 1px solid #e1e1e1">' + apptit + '</b>'
			+'<lable style="display: block; padding: 4px; text-align: center;"><img src="' + cradimg + '" width="90%" /></lable>'
			+'<span style="display: block; padding-left: 6px; line-height: 28px; font-size: 14px; border-top: 1px solid #e1e1e1" class="weapp_text_link"> 小程序</span>'
			+'</lable></iditorminiprogram></p>';
	}
	MU.ueditor.execCommand('inserthtml', html5);
	MU.AlertThis.RemoveAlert();	
};

//微信小程序
UE.registerUI('applets-card-btn', function (editor, uiName) {
	return new UE.ui.Button({
		name: 'applets-card',
		title: '小程序',
		onclick: function () {
			var dom = '<div class="app-applets"><ul>' +
				'<li><b>APP-ID</b><input type="text" id="app-id" placeholder="请输入小程序APPID" /></li>' +
				'<li><b>访问路径</b><input type="text" id="app-src" placeholder="请输入小程序路径" /></li>' +
				'<li id="is-show-box"><b>展示方式</b><label class="is-show"><input type="radio" checked name="show" value="1"/> 文字</label><label class="is-show"><input type="radio" name="show" value="2"/> 图片</label><label class="is-show"><input type="radio" name="show" value="3"/> 小程序卡片</label></li>' +
				'<li class="app-li is-show-1"><b>文字内容</b><textarea id="app-txt" placeholder="请输入文字内容"></textarea></li>' +
				'<li class="app-li is-show-2"><b>上传图片</b><button>添加图片<form action="" method="" enctype="multipart/form-data"><input type="file" accept="image/*" id="image-file-input" name="image/*" multiple="false" onchange="App.ImgUpload(event)"/></form></button><div class="img-box"><img id="mode-image" src=""/></div></li>' +
				'<li class="app-li is-show-3"><b>卡片标题</b><input type="text" id="app-card-tit" placeholder="请输入卡片标题" /></li>' +
				'<li class="app-li is-show-3"><b>卡片封面</b><button id="card-up-btn">添加图片</button><div class="img-box"><img id="crad-image" src=""/></div></li>' +
				'<li class="toast_txt" id="toast_text"></li><li class="toast_txt" id="toast-text-red"></li>' +
				'</ul></div>';
			MU.Alert({
				title: '小程序',
				dom: dom,
				buttons: [{
					name: "确定",
					style: "enter",
					callback: function () { App.OpenLets() }
				}, {}]
			});
			
		}
	});
});

// 秀米助手
UE.registerUI('dialog', function (editor, uiName) {
	var btn = new UE.ui.Button({
		name   : 'xiumi-connect',
		title  : '秀米',
		onclick: function () {
			var dialog = new UE.ui.Dialog({
				iframeUrl: './xiumi/xiumi-ue-dialog-v5.html',
				editor   : editor,
				name     : 'xiumi-connect',
				title    : "秀米图文助手",
				cssRules : "width: " + (window.innerWidth - 60) + "px;" + "height: " + (window.innerHeight - 60) + "px;",
			});
			dialog.render();
			dialog.open();
		}
	});
	return btn;
});


$(document.body).on('input keyup', 'input', function () {
	$(this).val($(this).val().replace(/^\s+|\s+$/g, ""));
});

$(document.body).on('click', '#is-show-box .is-show', function() {
	var $index = $('.is-show-' + $(this).index());
	$('.app-li').not($index).slideUp();
	$index.slideDown();
});

$(document.body).on('click', '#card-up-btn', function () {
	$.Cropper((2 / 1.6), {
		getBase64: function (result) {
			$.ajax({
				type: 'POST',
				url: MU.Upload__Cover__Url,
				data: {
					userId: MU.All__Uid,
					headimg: result.toDataURL('image/jpeg')
				},
				timeout: 60000,
				cache: false,
				beforeSend: function () {},
				dataType: 'JSON',
				success: function (data) {
					if (data.url) {
						$('#crad-image').attr('src', data.url).slideDown();
						$('#cropper-box').animate({ top: '-50%' }, '3000');
						$('.mask').hide();
						$('#l_conBox, #r_conBox').removeClass('pop_box');
					} else {
						MU.Alert({
							time: 2000,
							message: data.result.msg
						});
					}
				}
			});
		}
	});
	$('#cropper-box').animate({ top: '50%' }, '3000');
	$('.mask').show();
	$('#l_conBox, #r_conBox').addClass('pop_box'); 
});