/*
 * @fileOverview 工具JS类
 * @author Ants 2012-05-4
 * @version 1.0.0
 */

var chatData = {
	// "webPathPre": "http://121.40.28.189:81/",
	"webPathPre": "http://caochang.super.cn",

	"verificationUrl": "/playground/verification.jsp", //--正式环境  "/verification.jsp"--非正式环境  
	"interface": {
		"touristGetTopics": "/V2/Treehole/Topic/touristGetTopics.action", //获取操场板块列表
		"touristGetMessageByTopicId": "/V2/Treehole/Message/touristGetMessageV3ByTopicId.action", //获取板块里面下课聊主题列表
		"touristGetMessageDetailV2": "/V2/Treehole/Message/touristGetMessageDetailV4.action", //网页版--获取主题详情
		//"touristPcShowCommentsByEncryId": "/V2/Treehole/Comment//touristPcShowCommentsByEncryId.action", //根据加密后的messageId获取评论
		"touristSupportV2": "/V2/Treehole/Evaluate/touristSupportV2.action", // 呵呵
		"touristRemoveSupportV2": "/V2/Treehole/Evaluate/touristRemoveSupportV2.action", //取消呵呵
		"touristCommentV2": "/V2/Treehole/Comment/touristCommentV2.action", //网页版--发布评论
		"touristReplyV2": "/V2/Treehole/Comment/touristReplyV2.action", //网页版--回复评论
		"touristLike": "/V2/Treehole/Like/touristLike.action", //0924点赞
		"touristRate": "/V2/Treehole/Score/touristRate.action" //160219 评分
	}
};

var enterForSearch = 1;

(function(scope) {
	var CommonJS = {
		invokeObject: null,
		getDataFromJson: function(json) {
			if (!json) {
				return {};
			}
			//			json = json.replace(new RegExp("\"","gm"),"'");
			if (typeof(json) == "string") {
				if (json == "") {
					return {};
				}
				try {
					var result = eval("(" + json + ")");
					return result;
					//					var result=JSON.parse(json);
					//					return result;
				} catch (err) {
					txt = "此页面存在一个错误。\n\n"
					txt += "错误描述: " + err.message + "\n\n"
					txt += "点击OK继续。\n\n"
					commonJS.consoleTip(txt);
					return JSON.parse(json);
				}
			} else {
				return json;
			}
		},
		/**
		 * 调用本工程的后端来调用接口
		 * @param {String} ajaxData.method 方法名
		 * @param {Object} ajaxData.data 入参
		 * @param {Function} ajaxData.successFunc 调用成功的回调函数
		 * @param {Function} ajaxData.errorFunc 调用失败的回调函数
		 * @param {Object} ajaxData.options 配置参数
		 */
		//method, params, successFunc, errorFunc, options
		invokeInterface: function(ajaxData) {
			var url = chatData.webPathPre + ajaxData.method;
			var async = ajaxData.options && ajaxData.options.async != null ? ajaxData.options.async : true;
			var timeout = ajaxData.options && ajaxData.options.timeout != null ? ajaxData.options.timeout : 30000;
			ajaxData.data = ajaxData.data || {};

			//commonJS.consoleTip("调用方法：" + method + "\n" + "入参：" + JSON.stringify(params));
			$.ajax({
				type: "post",
				url: url,
				async: async,
				data: ajaxData.data,
				timeout: timeout,
				beforeSend: function(XMLHttpRequest) {
					if (ajaxData.options && ajaxData.options.invokeObject) {
						var invokeObject = ajaxData.options.invokeObject;
						if (commonJS.invokeObject && commonJS.invokeObject == invokeObject) {
							return false;
						} else {
							commonJS.invokeObject = invokeObject;
							return true;
						}
					} else {
						return true;
					}
				},
				success: function(data, textStatus, jqXHR) {
					commonJS.consoleTip("调用" + ajaxData.method + "结果：" + jqXHR.responseText + "\n\n");
					if (typeof ajaxData.successFunc == 'function') {
						var res = commonJS.getDataFromJson(data),
							code = res.code;
						if (res.status === -1 && (code === '20205' || code === '20201')) {
							if (ajaxData.method.indexOf('touristGetMessageDetailV2') != '-1') {
								$('.main-box').css({
									background: '#fafafa',
									height: ($('body').height() + 'px')
								}).html('<div id="deleteMessage"><div class="messBox"><img src="statics/img/deleteMess.png" class="messPic"><div class="messTxt"><p class="messTitle">该下课聊节操值过高，攻城狮已怒删！！</p><p class="messTip">更多无节操内容，请下载客户端查看</p></div></div></div>');
							} else {
								commonJS.alertTip(res.message);
								window.location.href = 'index.jsp';
							}
						} else {
							ajaxData.successFunc(jqXHR.responseText, textStatus);
						}
					}
					//					if(res.code === '20201'){
					//						window.location.href='index.jsp'
					//					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					//					alert(XMLHttpRequest.status);alert(textStatus);alert(errorThrown);
					if (typeof ajaxData.errorFunc == 'function') {
						ajaxData.errorFunc(XMLHttpRequest, textStatus, errorThrown);
					}
				},
				complete: function(XMLHttpRequest, textStatus) {
					commonJS.invokeObject = null;
				}
			});
		}
	};
	window.commonJS = CommonJS;
}(window));


(function() {
	commonJS.invokeInterface({
		method: chatData.interface.touristGetMessageDetailV2,
		data: {
			encryId: encryId,
			plateId: plateId
		},
		successFunc: function(responseText, textStatus) {
			var res = commonJS.getDataFromJson(responseText),
				status = res.status;
			if (status === 1) {
				var data = res.data,
					comments = data.comments;
				encryTopicId = data.treeholeTopicBO ? data.treeholeTopicBO.encryTopicId : null;
				themeWrap.html(template('themeTemplate', data));


				var treeholeTopicBO = data.treeholeTopicBO;
				if (treeholeTopicBO) {
					nameStr = treeholeTopicBO.nameStr;
				}
				if (nameStr === '我这么美我不能死') {
					$('.comments-section').remove();
				} else {
					$('.comments-section').show();
				}

				renderComments(data);
				$('li[encryTopicId=' + encryTopicId + ']', sideOrder.parent()).addClass('active');
				// touristShowComments();

				$('.comments-num span').text(setNum(comments));

			} else {
				commonJS.alertTip(res.message);
			}
		},
		errorFunc: function(XMLHttpRequest, textStatus, errorThrown) {
				var retJson = commonJS.getDataFromJson(XMLHttpRequest.responseText);
				if (retJson && retJson.error) {
					commonJS.alertTip(retJson.error);
				} else {
					commonJS.consoleTip(textStatus);
				}
			}
			//	options: {}
	});
})()