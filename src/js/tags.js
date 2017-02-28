//riot tags需要的依赖
import flux from 'riot-seed-flux';
import {
    store,
    httpGet,
    httpPost
} from './store';
import $ from 'jquery';
import uploader from 'simple-ajax-uploader';
import echarts from 'echarts/index.common';
import daterangepicker from 'daterangepicker';
import utils from './utils';
import shop from './shop';
import CONSTANT from './constant';
require('../static/laydate.js')

if (window.navigator.userAgent.match(/Cordova/)) {
    var api = require('./API-online');
    var tokenPath = window.iposHeader + '/qiniu/uptoken';

} else {
  if (utils.isAndroid()) {   // Android 环境
    var tokenPath = window.iposHeader + '/qiniu/uptoken';
    var api = require('./API-android');
  } else {    // pc 端
    var tokenPath = window.iposHeader + '/qiniu/uptoken';
    var api = require('./API-server');
  }
}
var qiniuOpts = {
    runtimes: 'html5,flash,html4', //上传模式,依次退化
    browse_button: '', //上传选择的点选按钮，**必需**
    uptoken_url: tokenPath, //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
    unique_names: true,
    save_key: true,
    domain: 'https://o93qmsoro.qnssl.com/', //bucket 域名，下载资源时用到，**必需**
    get_new_uptoken: false, //设置上传文件的时候是否每次都重新获取新的token
    container: 'content', //上传区域DOM ID，默认是browser_button的父元素，
    max_file_size: '2mb', //最大文件体积限制
    flash_swf_url: '//libs.cdnjs.net/plupload/2.1.8/Moxie.swf', //引入flash,相对路径
    max_retries: 2, //上传失败最大重试次数
    chunk_size: '4mb', //分块上传时，每片的体积
    auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
    init: {
        'FilesAdded': function(up, files) {
            plupload.each(files, function(file) {});
        },
        'BeforeUpload': function(up, file) {
          console.log("------------------");
        },
        'UploadProgress': function(up, file) {
          console.log("--------------");
        },
        'FileUploaded': function(up, file, info) {
            var domain = up.getOption('domain');
            var res = $.parseJSON(info);
            var sourceLink = domain + res.key;
            console.log("u: " + sourceLink);
            console.log("v: " + sourceLink + "?imageView2/1/w/200/q/50");

        },
        'Error': function(up, err, errTip) {
            alert(errTip);
        },
        'UploadComplete': function() {},
        'Key': function(up, file) {
            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
            // 该配置必须要在 unique_names: false , save_key: false 时才生效

            var key = "img/" + file.name;
            return "";
        }
    }
}

var checkToken = function(tokenPath, callback) {
    $.ajax({
        url: tokenPath,
        type: 'get',
        timeout: 3000,
        dataType: 'json',
        success: function() {
            callback(true);
        },
        error: function() {
            callback(false);
        }
    });
};

utils.createUploader = function(opts) {
    var container = opts.container || 'content';
    checkToken(tokenPath, function(tag) {
        if (tag) {
            var options = $.extend(qiniuOpts, {
                browse_button: opts.idName,
                container: container,
                init: {
                    'FileUploaded': function(up, file, info) {
                        opts.success && opts.success(up, file, info);
                    },
                    'Error': function(up, err, errTip) {
                        utils.toast(errTip);
                    },
                }
            });
            return Qiniu.uploader(options);
        }
    });
};

$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

var insertPage = function(target, src) {
    var iframe = document.createElement('iframe');
    iframe.src = src || "http://www.baidu.com";
    iframe.style.height = '100%';
    iframe.style.width = '100%';
    target.appendChild(iframe);
}

var globleEvents = riot.observable();


function connectWebViewJavascriptBridge(callback) {
    //如果桥接对象已存在，则直接调用callback函数
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
    }
    //否则添加一个监听器来执行callback函数
    else {
        document.addEventListener('WebViewJavascriptBridgeReady', function() {
            callback(WebViewJavascriptBridge)
        }, false)
    }
}

var scanNumber = ''  // 全局 扫码 数据
//页面加载后，立刻调用创建桥接对象的函数
connectWebViewJavascriptBridge(function(bridge) {
    //这个方法用于js接收oc发来的send，并使用responseCallback方法给OC回发消息
    bridge.init(function(message, responseCallback) {
        var data = {};
        responseCallback(data);
    });

    //这个方法用于js接收oc的callHandler，handler用一个key标记，可以注册多个handler
    bridge.registerHandler('scanInputNumber', function(data, responseCallback) {
        scanNumber = data;
  			window.dispatchEvent(new Event('inputNumber'));
        responseCallback();
    })
})

// 检测url变化，，修改title  安卓头部标题
riot.routeParams.on('changed', function () {
  var params = riot.routeParams.params;
  if (params) {
      document.title = params.title
  }
});

riot.tag2('login', '<div id="login-wrap"> <form class="login" onsubmit="{submit}"> <div class="logo"></div> <div class="setting" onclick="{openSetting}"></div> <input id="username" type="text" name="username" placeholder="账号/手机号" maxlength="12"> <input id="password" type="password" name="account" placeholder="密码" maxlength="12"> <button class="login-btn">登录</button> <div class="tips"> <a class="left" href="#/license-key">开店</a> <a class="right" href="#/find-password">找回店主密码</a> </div> </form> <div class="warning" id="login-warning" style="display:none"> <h2>提示</h2> <p>账号或密码错误。如果使用员工账号登录，请确保该收银机已绑 定至账号所属店铺。修改绑定请用店主账号登录并在“店铺资料” 处绑定。</p> <a class="red-box" onclick="{closeWarning}">知道了</a> </div> </div>', '', '', function(opts) {
		var self = this;

		self.openSetting = function () {
			utils.androidBridge(api.openSetting)

		}

		self.submit = function (e) {
			e.preventDefault();
			var username = $('#username').val();
			var password = $('#password').val();
			if(!username){
				utils.toast("请填写用户名");
				return;
			}

			if(!password){
				utils.toast("请填写密码");
				return;
			}

			store.account.login({
				username: $('#username').val(),
				password: $('#password').val(),
				imeCode: '2021414914044598'
			}, function (data) {
				if (data.code == 1) {
					self.login = true;

					location.replace("#/casher/index");
					location.reload();

				} else if (data.code == 20101) {
					self.login = false;
					$('#login-warning').show();
				} else if (data.msg) {
					alert(data.msg);
				}
			});
		};

		self.closeWarning = function () {
			$('#login-warning').hide();
		}
});

riot.tag2('casher-balance', '<div class="balance-wrap"> <div class="balance-select"> <ul class="pay-info"> <li> <p if="{!refund}">应收<strong>￥<b>{pay.amount || 0}</b> </strong> </p> <p class="red" if="{refund}">应退<strong>￥<b>{payCashStr}</b> </strong> </p> </li> <li> <p class="red" if="{!refund && type==\'1\'}">现金<strong>￥<b>{payCashStr}</b> </strong> </p> </li> <li> <p if="{!refund && type==\'1\'}">找零<strong>￥<b>{payback}</b> </strong> </p> </li> </ul> <ul class="pay-type"> <li class="cash {active: type == \'1\'}" onclick="{changeType(\'1\')}"></li> <li if="{!refund}" class="alipay {active: type == \'2\'}" onclick="{changeType(\'2\')}"></li> <li if="{!refund}" class="wechat {active: type == \'3\'}" onclick="{changeType(\'3\')}"></li> <li if="{!refund}" class="bank {active: type == \'4\'}" onclick="{changeType(\'4\')}"></li> </ul> </div> <div class="keyboard"> <table> <tbody> <tr> <td colspan="1" rowspan="4" style="width:56.8%" show="{type !=\'1\'}"> <div class="pic-pay"> <img show="{type==\'2\'}" class="alipay-code" riot-src="{alipayUrl}"> <img show="{type==\'3\'}" class="wechat-code" riot-src="{wechatUrl}"> <div show="{type==\'4\'}" class="bank-code code-pic"></div> <p show="{type==\'2\' || type==\'3\'}">{codeTips}</p> </div> </td> <td onclick="{addString(\'7\')}" if="{type==\'1\'}">7</td> <td onclick="{addString(\'8\')}" if="{type==\'1\'}">8</td> <td onclick="{addString(\'9\')}" if="{type==\'1\'}">9</td> <td onclick="{backspace}" class="backspace" if="{type==\'1\'}"></td> <td colspan="2" if="{refund && type==\'1\'}" class="payback-option"> <p class="on" onclick="{setStorage}">退回时增加库存</p> </td> <td class="red" if="{!refund}" onclick="{wipe}">抹零</td> <td class="red discount-td" if="{!refund}" onclick="{openDiscount}">折扣</td> <td class="red" if="{!refund}" onclick="{openCoupon}">优惠券</td> <td class="red" if="{refund && type==\'1\'}" onclick="{openBox}">开钱箱</td> </tr> <tr if="{type !=\'1\'}"> <td class="big" rowspan="3" colspan="3" onclick="{check}">结算</td> </tr> <tr if="{type==\'1\'}"> <td onclick="{addString(\'4\')}">4</td> <td onclick="{addString(\'5\')}">5</td> <td onclick="{addString(\'6\')}">6</td> <td onclick="{addString(\'100\')}">100</td> <td class="big" rowspan="3" colspan="3" onclick="{check}">结算</td> </tr> <tr if="{type==\'1\'}"> <td onclick="{addString(\'1\')}">1</td> <td onclick="{addString(\'2\')}">2</td> <td onclick="{addString(\'3\')}">3</td> <td onclick="{addString(\'50\')}">50</td> </tr> <tr if="{type==\'1\'}"> <td onclick="{addString(\'0\')}">0</td> <td onclick="{addString(\'00\')}">00</td> <td onclick="{addString(\'.\')}">.</td> <td onclick="{addString(\'20\')}">20</td> </tr> </tbody> </div> </div> <modal id="discount-layer" modal-height="280px" opts="{discountOpts}"> <div class="discount"> <div class="top"> <label>请输入折扣百分比: <input id="discountInput" maxlength="3" type="tel" pattern="[0-9]*" value="{parent.discount}" name="discount"></label> </div> <div class="label">快捷输入：</div> <ul> <li onclick="{parent.getDiscount(95)}">95%</li> <li onclick="{parent.getDiscount(90)}">90%</li> <li onclick="{parent.getDiscount(85)}">85%</li> <li onclick="{parent.getDiscount(80)}">80%</li> <li onclick="{parent.getDiscount(75)}">75%</li> <li onclick="{parent.getDiscount(70)}">70%</li> <li onclick="{parent.getDiscount(65)}">65%</li> <li onclick="{parent.getDiscount(60)}">60%</li> </ul> </div> </modal> <modal id="pay-change" modal-width="500px" nocancel="nocancel" buttonok nofooter opts="{payChangeOpts}"> <div class="modal-paychange"> <div class="">找零</div> <p>{parent.payback}</p> </div> </modal> <modal id="pay-warning" modal-width="200px" modal-height="80px" nofooter> <p class="warning-text">{parent.warningText}</p> </modal> <pop id="billCouponInfo" title="优惠券" twobutton popzbig="true" popclose="true"> <bill-coupon-info></bill-coupon-info> </pop> <pop id="billCouponNum" title="优惠券" twobutton popzbig="true" cancletext="返回"> <bill-coupon-num></bill-coupon-num> </pop> <pop id="billCoupon" title="优惠券" popclose="true"> <bill-coupon></bill-coupon> </pop> </div>', '', '', function(opts) {
		var self = this;

		var params = riot.routeParams.params;

		self.type = '1';
		self.discount = 100;
		self.discountNum = 100;
		self.payback = 0;
		self.refund = params.refund || false;
		self.couponPrice = 0;
		self.wipeButton = false;
		self.coupon = 0;
		self.couponCode = 0;
		self.vipNumber = 0;
		var q = riot.route.query();
		if (q.vipphone && q.vipphone != "" && q.vipphone != "undefined" && q.vipphone != 0) {
			self.vipNumber = q.vipphone;
			setTimeout(payVip,500);
			function payVip(){
				store.balance.payVip({vipNumber: self.vipNumber})
			}
		}

		self.cartList = function () {
			store.cart.get(function (res) {
				self.baskets = JSON.stringify(res.list);
				self.update();
			})
		}

		self.getPay = function () {
			store.pay.open(function (res) {
				self.pay = res;
				if (self.pay && self.pay.amount) {
					var pay_amount = self.pay.amount.toFixed(1);
					self.pay.amount = pay_amount;

					self.hisPayPrice = self.pay.amount;
					self.payCashStr = self.payCashStr || self.pay.amount;
					caculate(self.pay.amount, self.payCashStr);
					self.update();
				}
			});
			store.sys.sync();
		}
		function warning(text) {
			var layer = $('#pay-warning')[0];

			self.warningText = text;
			self.update();

			layer.open();
			setTimeout(function () {
				layer.close();
			}, 1000);
		}

		function caculate(needPay, cash) {
			if (needPay == undefined || cash == undefined) {
				return;
			}
			needPay = Math.round(needPay * 1000);
			cash = Math.round(cash * 1000);
			self.payback = ((cash - needPay) / 1000);
			self.update();
		}

		self.log = function (name) {
			utils.androidBridge(api.logEvent,{eventId: name})

		}

		self.backspace = function () {
			var str = self.payCashStr;
			var l = str.length;

			if (!self.payInput) {
				self.payCashStr = '0';
				self.payInput = true;
			} else if (l > 1) {
				self.payCashStr = str.substring(-1, l - 1);
			} else if (str != '0') {
				self.payCashStr = '0';
			} else {
				return;
			}

			self.payInput = true;
			caculate(self.pay.amount, self.payCashStr);
		}

		self.addString = function (str) {
			return function () {
				if (self.payCashStr == '0') {
					if (str == '.') {
						self.payCashStr += str;
					} else if (str != '0' && str != '00') {
						self.payCashStr = str;
					}
				} else if (!self.cashInput) {
					self.payInput = true;
					if (str == '.') {
						self.payCashStr = '0' + str;
					} else {
						self.payCashStr = str;
					}
				} else {
					self.payCashStr += str;
				}

				self.cashInput = true;
				caculate(self.pay.amount, self.payCashStr);
			}
		}

		self.changeType = function (type) {
			return function () {
				self.type = type;
				if ((self.noWechatCode && self.type === '3') || (self.noAlipayCode && self.type === '2')) {
					self.codeTips = '请在 “店铺 - 支付二维码 ” 处设置';
				}

				store.balance.change({ 	type: self.type, 	cash: self.payCashStr });
			}
		}

		self.getDiscount = function (num) {
			return function () {
				self.discount = num;
				self.update();
			}
		}

		self.payChangeOpts = {
				onClose: function(){
					self.payChange();
				}
		};
		self.payChange = function () {

				warning('结算完成');
				self.bill={};
				setTimeout(function () {
					location.hash = '#/casher/index';
				}, 1000);

		}
		self.openDiscount = function () {
			self.log("0202");
			if ($(".discount-td").is('.button-on')) {
				$(".discount-td").toggleClass('button-on');
				self.discountNum = 100;
				store.balance.discount({
					discountNum: 100,
					wipe:self.wipeButton
				}, function (res) {
					if (res && res.code) {
						$('#discount-layer')[0].close();
					}
					self.update();
				});
				self.update();
				self.computePayPrice();
			} else {
				$('#discount-layer')[0].open();
			}
		};

		self.wipe = function (e) {
			self.log("0201");
			$(e.target).toggleClass('button-on');
			if ($(e.target).is(".button-on")) {
				self.wipeButton = true;
				store.balance.wipe({wipe: true});
			} else {
				self.wipeButton = false;
				store.balance.wipe({wipe: false});
			}
			self.update();
			self.computePayPrice();
		};

		self.computePayPrice = function () {

			var pay_amount = (self.hisPayPrice * self.discountNum / 100 - self.coupon).toFixed(1);
			if (self.wipeButton) {
				var cash = self.payCashStr;
				var needPay = self.pay.amount;
				var pay_amount = (self.hisPayPrice * self.discountNum / 100 - self.coupon).toFixed(3);

				self.pay.amount = pay_amount.substring(0,pay_amount.length-2);

			} else {

 				var pay_amount = (self.hisPayPrice * self.discountNum / 100 - self.coupon).toFixed(1);
				self.pay.amount = pay_amount;
			}
			caculate(self.pay.amount, self.payCashStr);
			self.update();
		}

		self.openCoupon = function (e) {

			if ($(e.target).is(".button-on")) {

				self.couponCode = 0;
				self.coupon = 0;
				self.computePayPrice();
				store.balance.payCoupon({coupon: self.coupon});
				$(e.target).removeClass('button-on');
			} else {
				$("#billCoupon")[0].open(e);
			}
		}

		self.couponAdd = function (e) {
			$(e.target).addClass('button-on');
			if (e.item.couponInfo) {
				self.coupon = e.item.couponInfo.price;
				self.couponCode = e.item.couponInfo.couponCode;
				store.balance.payCoupon({coupon: self.coupon,couponNumber:self.couponCode});
			} else {
				self.coupon = 0;
				self.couponCode = 0;
				store.balance.payCoupon({coupon: self.coupon});
			}
			self.computePayPrice();
		}

		self.submitDiscount = function () {
			var discount = parseInt($('#discountInput').val());
			if(!/(^[1-9][0-9]$)|(^100)|(^[1-9]$)$/.test(discount)) {
				utils.toast('折扣只能是1-100之间的正数');
				return;
			}

			$(".discount-td").toggleClass('button-on');
			if ($(".discount-td").is('.button-on')) {
				self.discountNum = discount;
				store.balance.discount({
					discountNum: discount,
					wipe:self.wipeButton
				}, function (res) {
					if (res && res.code) {
						$('#discount-layer')[0].close();
					}
					self.update();
				});
			} else {
				self.discountNum = 100;
				store.balance.discount({
					discountNum: 100,
					wipe:self.wipeButton
				}, function (res) {
					if (res && res.code) {
						$('#discount-layer')[0].close();
					}
					self.update();
				});
			}
			$('#discount-layer')[0].close();
			self.update();
			self.computePayPrice();
		};

		self.check = function () {
			var param = {

			type: self.refund ? 2 : 1,
			cash: self.payCashStr,
			stockAdd: $('.payback-option p').hasClass('on') ? 1	: 0,
			discountNum: self.discountNum,

			wipe: self.wipeButton,
			baskets: self.baskets,
			payType: self.type
		}
			if (!self.refund && (self.payCashStr - self.pay.amount < 0) && self.type == 1) {
				warning('现金不得小于应收');
				return;
			}

			if (self.vipNumber && self.vipNumber != 0) {
				param.vipNumber = self.vipNumber;
			}

			if (self.couponCode && self.couponCode != 0) {
				param.couponCode = self.couponCode;
				param.couponNumber = self.couponCode;
				param.coupon = self.coupon;
			}

			store.pay.commit(param, function (res) {
				if (res && res.data) {
					self.bill = res.data;
				}
				if (!self.refund) {
					if (self.type == 1) {
						self.openBox();
						$("#pay-change")[0].open()
						return;
					}
					if ((self.type == 2 || self.type == 3 || self.type == 5)) {

						self.paySuccess();

					} else {
						self.paySuccess();
					}

				} else {
					self.paySuccess();
				}
			});

		};
		self.paySuccess = function () {
					warning('结算完成');
					self.bill = {};
					setTimeout(function () {
						location.hash = '#/casher/index';
					}, 1000);
				}
		self.setStorage = function (e) {
			$(e.target).toggleClass('on');
		}

		self.openBox = function () {
			self.log("0203");
			httpGet({url: api.openBox, success: function (res) {}});
		};

		self.discountOpts = {
			onSubmit: self.submitDiscount
		};

		self.setQrcode = function () {
			self.codeTips = "请顾客扫描二维码，输入相应金额";

			if (window.Icommon) {
				var realZhifubaoUrl = Icommon.fileRootPath + 'qrcode/zhifubao_' + Icommon.storeId + '.data?t=' + new Date().getTime();
				var realWeixinUrl = Icommon.fileRootPath + 'qrcode/weixin_' + Icommon.storeId + '.data?t=' + new Date().getTime();
			}
			var defaultUrl = 'imgs/not-set.jpg';
			self.wechatUrl = window.Icommon
				? realWeixinUrl
				: defaultUrl;
			self.alipayUrl = window.Icommon
				? realZhifubaoUrl
				: defaultUrl;
			$('.pic-pay .wechat-code').on('error', function () {
				self.wechatUrl = defaultUrl;
				self.noWechatCode = true;
				self.update();
			})
			$('.pic-pay .alipay-code').on('error', function () {
				self.alipayUrl = defaultUrl;
				self.noAlipayCode = true;
				self.update();
			})
			self.update();
		}

		self.on('mount', function () {
			self.cashInput = false;
			self.setQrcode();
			self.cartList();
			self.getPay();
		});
});

riot.tag2('casher-bill', '<div class="white-box bill"> <div class="list" each="{bill}" onclick="{reviewBill(tbId)}"> <div class="time"><span>{time}</span></div> <ul> <li each="{goods}" class="bill-goods-list">{goodsName || \'无码商品\'} <span class="bill-quantity">{weight}</span></li> <li class="more" if="{goods.more}">......</li> </ul> </div> </div>', '', '', function(opts) {
		var self = this;

		flux.bind.call(self, {
			name: 'bill',
			store: store.bill,
			success: function () {
				for (var i in self.bill){
					var date = new Date(self.bill[i].creationDate);
					self.bill[i].time = date.getHours() + ':' + date.getMinutes();
					if ( self.bill[i].goods.length > 5){
						self.bill[i].goods.length = 5;
						self.bill[i].goods.more = true;
					}
				}
				self.update();
			}
		});

		self.reviewBill = function(id){
			return function(){
				store.bill.take({tbId: id});
			}
		};

});

riot.tag2('casher-cart', '<div class="shopping-list {empty:!cartList.list.length}" id="casherCartShopList"> <ul> <li each="{i in cartList.list}" buyid="{i.goodsUuid}" onclick="{setDetail(i)}" class="{active : (i.goodsUuid == activeId && active)}"> <div class="li-wrap"> <div class="item-pic" riot-style="background-image:url({i.imageUrl || \'imgs/default-product.png\'})"></div> <div class="item-info"> <p>{i.goodsName || \'无码商品\'}</p> <p class="item-unit">￥{i.price}</p> </div> <div class="item-price"> <div> <i class="minus" onclick="{minus(i)}"></i> <span class="count">{i.weight}</span> <i class="add" onclick="{add(i)}"></i> </div> <strong>小计：￥<b>{i.amount}</b> </strong> </div> </div> </li> </ul> </div> <modal modal-width="" modal-height="" id="create-product"> <create-product></create-product> </modal>', '', '', function(opts) {
		var self = this;
		var timer = 50;
		var scrollTimer;

		self.active = self.opts.active;

		function getMulti(a, b) {
			return Math.round(a * 1000) * b / 1000;
		};

		function getPlus(a, b) {
			return (Math.round(a * 1000) + Math.round(b * 1000)) / 1000;
		}

		function scrollCart() {
			var scroll = $('#casherCartShopList');
			var scrollTop = scroll[0].scrollHeight;
			scroll[0].scrollTop = scrollTop;
		}

		function scrollHandler(e) {
			clearTimeout(scrollTimer);

			var scroll = e.target;
			var rate = scroll.scrollTop / (scroll.scrollHeight - scroll.clientHeight);

			scrollTimer = setTimeout(function () {
				store.sys.sendMessage({
					'scrollMessage': {
						scrollRate: rate
					}
				});
			}, 500);
		}

		function addToCart(item) {
			item.quantity = 1;

			var list = self.cartList.list;
			var onOff = false;
			if (list.length) {
				for (var i = 0; i < list.length; i++) {
					if (list[i].goodsUuid == item.goodsUuid) {
						onOff = true;
						list[i].quantity++;
						if(onOff){
							item.price = list[i].price;
							item.weight = list[i].weight;
						}
						break;
					}
					if (i == list.length - 1) {
						list.push(item);
						break;
					}
				}
			} else {
				list.push(item);
			}

			store.cart.add(item.goodsUuid);

			setTimeout(function () {
				scrollCart();
			}, 200);

		}

		function barcodeHandle() {

			var number = scanNumber

			self.barCode = number;

			httpGet({
				url: api.goodByBarcode,
				params: {
					barcode: number
				},
				success: function (res) {
					var list = self.cartList.list;
					if (res.data) {
						addToCart(res.data);
					} else {
						self.createProductFromCode(number);
					}
				},
				error:function(err){
					if(err.code === 10007){
						utils.toast("请检查网络");
					}
				}
			});
			self.update();
		}

		self.createProductFromCode = function (number) {
			var curModal = $('#create-product');
			var cur = curModal[0];
			var styleInfo;
			if (cur.attributes && cur.attributes.getNamedItem) {
				styleInfo = cur.attributes.getNamedItem("style");
			}
			if (!styleInfo || (styleInfo.value && styleInfo.value.indexOf("display:flex;") < 0 && styleInfo.value.indexOf("display: flex;") < 0)) {
				$('#create-product')[0].open({casherCart: true});
			}
			httpGet({
				url: api.goodBySpecBarcode,
				params: {
					barcode: number
				},
				success: function (res) {
					$('#create-product .barcode-input').val(number);
					if (res.data) {
						$('#create-product [name="goodsName"]').val(res.data.goodsName);
						$('#create-product [name="cateId"]').val(res.data.cateId);
					}
					if (res.data && res.data.imageUrl) {
						$('#create-product .img-area img').attr('src', res.data.imageUrl);
						$('#create-product-imgUrl').val(res.data.imageUrl);
					}
				},
				complete: function (status) {
					if (status == "error") {
						utils.toast("请检查网络");
					}
				}
			});
		}

		flux.bind.call(self, {
			name: 'cartList',
			store: store.cart,
			success: function () {
				var data = self.cartList;
				if (data) {
					data.goodsAmount = 0;
					data.list.forEach(function (i) {
						data.goodsAmount = getPlus(data.goodsAmount, getMulti(i.price, i.quantity));
					});
				}
				self.update();
			}
		});
		flux.bind.call(self, {
			name: 'detail',
			store: store.detail,
			success: function () {
				if (self.detail) {
					self.activeId = self.detail.goodsUuid;
				} else {
					self.activeId = '';
				}
			}
		});

		self.getMulti = getMulti;

		self.cashAddCart = function (params) {
			addToCart(params);
		}
		self.add = function (data) {
			return function () {
				store.cart.add(data.goodsUuid);
			}
		}

		self.minus = function (data) {
			return function () {

				if (data.quantity == 1) {
					setTimeout(function () {
						store.detail.set(null);
					}, 0)
				}

				store.cart.reduce(data.goodsUuid);

			}
		}

		self.setDetail = function (data) {
			return function () {
				store.detail.set(data);
			}
		};

		self.scan = function () {
			window.dispatchEvent(new Event('inputNumber'));
		};

		self.modalOpts = {
			onSubmit: function () {
				httpPost({
					url: api.cartByScan,
					params: $('#add-product-form').serializeObject(),
					success: function (res) {
						store.cart.get();
						self.addModal.close();
					},
					error: function (res) {}
				});
			},
			onClose: function () {
				self.addModal.find('input').val('');
			}
		};

		self.on('mount', function () {
			var scroll = $(self.root).find('.shopping-list');
			self.addModal = $('#add-product')[0];
			window.addEventListener('inputNumber', barcodeHandle);
			scroll.bind('scroll', scrollHandler);
		});

		self.on('unmount', function () {
			var scroll = $(self.root).find('.shopping-list');
			window.removeEventListener('inputNumber', barcodeHandle);
			scroll.unbind('scroll', scrollHandler);
		});
});

riot.tag2('casher-detail', '<div class="detail white-box" if="{detail}"> <div class="pic" riot-style="{detail.imageUrl ? \'background-image:url(\'+ detail.imageUrl +\')\' : \'background-image:url(imgs/default-product.png)\'}"></div> <p class="detail-goodsName">{detail.goodsName || \'无码商品\'} <i class="change-price" if="{viewProfit}" onclick="{changePrice}">修改单价</i> </p> <div class="modify-cart"> <label>数量：</label> <span onclick="{modifyCart}">{detail.weight}</span> </div> <strong>￥{detail.price}</strong> <i class="line" style="display:none"></i> <div class="more" style="display:none"> <span>13811468801</span> </div> <modal id="modifyCartqu" modal-width="500px" opts="{modalCartOpts}"> <div class="wrap"> <div class="content"> <label for="">商品数量：</label> <input id="" type="tel" maxlength="9"> </div> </div> </modal> <modal id="modifyCartPrice" modal-width="500px" opts="{modalCartPriceOpts}"> <div class="wrap"> <div class="content"> <label for="">商品价格：</label> <input id="" type="tel" maxlength="9"> </div> </div> </modal> </div>', '', '', function(opts) {
		var self = this;
		var modal = self.parent;
		var cashDetail = self.parent.parent;
		self.viewProfit = true;

		flux.bind.call(self, {
			name: 'detail',
			store: store.detail,
			success: function (data) {
				self.update();
			}
		});

		self.modalCartOpts = {
 				onOpen: function () {

 				},
 				onSubmit: function(){
 					self.submitModifyCart();
 				},
 				onClose: function(){
 					$('#modifyCartqu').find('input').val('');
 				}
 		};
		self.modalCartPriceOpts = {
 				onOpen: function () {
 					$('#modifyCartPrice').find('input').val(self.detail.price);
 				},
 				onSubmit: function(){
 					self.submitModifyCartPr();
 				},
 				onClose: function(){
 					$('#modifyCartPrice').find('input').val('');
 				}
 		};
 		self.submitModifyCart = function () {
 			var quantity = $('#modifyCartqu').find('input').val() * 1;
			if (!$('#modifyCartqu').find('input').val()) {
 				utils.toast("数量不能为空")
 				return
 			}
 			if (quantity > 2000) {
 				utils.toast("数量不能超过2000")
 				return
 			}
 			var unit = self.detail.unit;
 			if (unit == 5 || unit == 6 || unit == 7 || unit == 8 ||unit == 9) {
 				if (!/^[0-9]+([.]{1}[0-9]{1,3})?$/.test(quantity)) {
 					utils.toast("请输入正确的数量")
 					return
 				}
 			} else {
 				if (!/^(0|\+?[1-9][0-9]*)$/.test(quantity)) {
 					utils.toast("请输入正确的数量")
 					return
 				}
 			}
 			var params = {
 				goodsUuid: self.detail.goodsUuid,
 				weight: quantity
 			};
 			self.update();
 			$('#modifyCartqu')[0].close();

 			httpPost({
 					url: api.modifyCartQuantity,
 					params: params,
 					success: function(res) {
						store.cart.update(self.detail.goodsUuid, res.data);
 						store.detail.set(res.data.goods);
 					}
 			});

 			$('#modifyCartqu').find('input').val('');
 		}
		self.submitModifyCartPr = function () {
			self.log('0108');
			var price = $('#modifyCartPrice').find('input').val() * 1;
			if(!$('#modifyCartPrice').find('input').val()) {
				utils.toast('价格不能为空');
				return;
			}

			if(!/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(price)) {

				utils.toast('请输入正确的价格');
				return;
			}
			var params = {
 				goodsUuid: self.detail.goodsUuid,
 				price: price
 			};
			self.update();
			httpPost({
 					url: api.shoppingcartGoodsPriceModify,
 					params: params,
 					success: function(res) {
						store.cart.update(self.detail.goodsUuid, res.data);
 						store.detail.set(res.data.goods);

 					}
 			});
			$('#modifyCartPrice')[0].close();
			$('#modifyCartPrice').find('input').val('');
		}

 		self.modifyCart = function () {
 			$('#modifyCartqu')[0].open();
 			$('#modifyCartqu').find('input').focus();
 		}

		self.changePrice = function () {
			if(self.viewProfit){
				$('#modifyCartPrice')[0].open();
				$('#modifyCartPrice').find('input').focus();
			}else if(!self.viewProfit){
				utils.toast('您还没有该权限....');
			}
 		}

		self.log = function(name) {
			utils.androidBridge(api.logEvent,{eventId: name})

		}
		self.checkAuth = function() {
			httpGet({
								url: api.auth,
								success: function(res) {
										self.auth = res.data.permissionCodes.split(',');

										if (self.auth.indexOf('131') < 0) {

												self.viewProfit = false;
										}else{

										}
										self.update();
								}
						});
		}
		self.on('mount', function() {
			self.checkAuth();
		});

});

riot.tag2('casher-index', '<div class="content-wrap"> <div class="cart"> <casher-cart active="true"></casher-cart> <div class="actions"> <span onclick="{openBox}">开钱箱</span> <span onclick="{clearCart}">清空商品</span> <span onclick="{openWithoutName}">无码收银</span> <span onclick="{moreAction}">更多</span> <span class="more back-action" onclick="{backAction}"></span> <span class="more" onclick="{saveBill}">挂单</span> <span class="more" onclick="{openBill}">取单</span> <span class="more" onclick="{openRefund}">退货</span> </div> </div> <div class="borad"> <div id="casher-view"> <casher-view></casher-view> </div> <div class="vip-btn"> <a onclick="{vipModify}" if="{!vipLogin}"> <span class="vip-icon"></span> <span class="text line vip-nologin">网店会员</span> </a> <a onclick="{vipModify}" if="{vipLogin}"> <span class="vip-icon vip-login"></span> <span class="text vip-login">网店会员 <i>{vipphone}</i></span> <span class="modify text line">修改</span> </a> </div> <div class="balance-btn"> <a onclick="{goCheck}" class="{disable: !cartList.goodsAmount}">收银 <span if="{cartList.goodsAmount}">￥{cartList.goodsAmount}</span> </a> </div> </div> <modal id="withoutName" modal-width="500px" opts="{modalOpts}"> <div class="wrap"> <div class="content"> <label for="priceNoName">商品价格：</label> <input pattern="[0-9]\\{1,5\\}\\.?[0-9]\\{0,2\\}" id="priceNoName" name="price" type="tel" maxlength="9"> </div> </div> </modal> <modal id="cart-warning" modal-width="200px" modal-height="80px" nofooter> <p class="warning-text">{parent.warningText}</p> </modal> <pop id="vipLogin" title="会员购物" twobutton> <vip-login></vip-login> </pop> </div>', '', '', function(opts) {
		var self = this;
		var clientTimer;
		self.vipLogin = false;

		self.vipModify  =function(){
			$("#vipLogin")[0].open();
		}

		self.modalOpts = {
				onSubmit: function(){
					self.addNoName();
				},
				onClose: function(){
					$('#withoutName').find('input').val('');
				}
		};

		store.detail.set(null);

		self.log = function (name) {
			utils.androidBridge(api.logEvent,{eventId: name})

		}

		function closeDetail(e) {
			if (self.detail && ($('.detail')[0] && $('.detail')[0].contains(e.target) || $(e.target).parents('li').attr('buyid') == self.detail.goodsUuid)) {
				return;
			} else {
				store.detail.set(null);
				$('body').unbind('click', closeDetail);
				self.isBindDetail = false;
			}
		}

		function warning(text) {
			var layer = $('#cart-warning')[0];

			self.warningText = text;
			self.update();

			layer.open();
			setTimeout(function () {
				layer.close();
			}, 1000);
		}

		function matchInput() {
			var val = $('#withoutName').find('input').val();
			if (!/^[0-9]{1,5}\.?[0-9]{0,2}$/.test(val)) {
				$('#withoutName').find('.content').css({'border-color': 'red'});
			} else {
				$('#withoutName').find('.content').css({'border-color': '#CCC'});
			}
		}

		self.moreAction = self.backAction = function () {
			$('.actions').toggleClass('more');
		};

		self.openBox = function () {
			self.log("0102");
			httpGet({url: api.openBox, success: function (res) {}});
		};

		self.clearCart = function () {
			self.log("0103");
			if (self.cartList.list.length == 0) {
				warning('购物车是空的');
				return;
			}
			store.cart.clear();
			store.detail.set(null);
		};

		self.bindDetail = function () {
			if (!self.isBindDetail) {
				$('body').bind('click', closeDetail);
				self.isBindDetail = true;
			}
		};

		self.saveBill = function (e) {
			self.log("0105");
			if (self.cartList.list.length == 0) {
				warning('购物车是空的');
				return;
			}
			store.bill.add();
			self.openBill(e);
		};

		self.openBill = function (e) {
			self.log("0106");;
			var target = e? e.target: null;

			function closeBill(e) {
				if ($('.bill')[0] && $('.bill')[0].contains(e.target) || target == e.target) {
					return;
				} else {
					store.bill.close();
					$('body').unbind('click', closeBill);
				}
			}

			store.bill.open();
			$('body').bind('click', closeBill);
		};

		self.openRefund = function () {
			self.log("0107");
			store.cart.clear();
			location.hash = '#/casher/refund';
		};

		self.goCheck = function () {
			if (self.cartList.list.length > 0) {
				console.log(self.vipphone);
				location.hash = '#/casher/balance?vipphone='+self.vipphone;
			} else {
				return;
			}
		};

		self.openWithoutName = function () {
			self.log("0104");
			$('#withoutName')[0].open();
			$('#withoutName').find('input').focus();
		};

		self.addNoName = function () {

			var goodsUuid = 'good-id-' + new Date() * 1;
			var price = $('#withoutName').find('input').val() * 1;

			if (!price) return;

			var data = {
				name: null,
				goodsUuid: goodsUuid,
				shoppingcartGoodsUuid: goodsUuid,
				type: 2,
				quantity: 1,
				price: price
			};

			store.detail.set(data);
			self.cartList.list.push(data);
			store.cart.addNoName({
				price: price,
				goodsUuid: data.goodsUuid
			});

			$('#withoutName').find('input').val('');
			$('#withoutName')[0].close();
		};

		self.on('mount', function () {

			flux.bind.call(self, {
				name: 'cartList',
				store: store.cart,
				success: function () {
					self.update();
				}
			});

			flux.bind.call(self, {
				name: 'detail',
				store: store.detail,
				success: function () {
					self.detail && self.bindDetail();
				}
			});

			$('#withoutName input').on('input', matchInput);
			store.pay.close();
			store.cart.setState('shopping');
		});

		self.on('unmount', function () {
			$('#withoutName input').unbind('input', matchInput);
		});
});

riot.tag2('casher-refund', '<div class="content-wrap"> <div class="cart"> <casher-cart></casher-cart> <div class="actions"> <span onclick="{cancelRefund}">取消退货</span> </div> </div> <div class="borad"> <div id="casher-view"></div> <div class="balance-btn"> <a onclick="{goCheck}" class="{disable:!cart.list.length}">确认退货</a> </div> </div> </div>', '', '', function(opts) {
		var self = this;

		flux.bind.call(self, {
			name: 'cart',
			store: store.cart,
			success: function () {
			}
		});

		self.cancelRefund = function(){
			store.cart.clear();
			location.hash = '#/casher/index';
		};

		self.goCheck = function(){
			if (self.cart.list.length > 0) {
				location.hash = '#/casher/refund-balance';
			} else {
				return ;
			}
		}

		self.on('mount', function(){
			store.cart.setState('refunding');
		});
});

riot.tag2('casher-view', '<casher-bill if="{bill}"></casher-bill> <casher-detail if="{detail}"></casher-detail>', '', '', function(opts) {
		var self = this;
		flux.bind.call(self, {
			name: 'detail',
			store: store.detail,
			success: function () {
				self.update();
			}
		});

		flux.bind.call(self, {
			name: 'bill',
			store: store.bill,
			success: function () {
				self.update();
			}
		});
});

riot.tag2('date-month', '<div class="month-data"> <h4> <span class="el-icon-before" onclick="{beforeYear}"></span> <span class="year">{year}年</span> <span class="el-icon-after" onclick="{afterYear}"></span> </h4> <div class="content"> <ul> <li each="{monthList}" onclick="{selectDate}" class="{active: (value == month) && (selectyear == year)}"> <span>{name}</span> </li> </ul> </div> </div>', '', '', function(opts) {
  var self = this
  self.monthList = [
    {name: '1月', value: '01', active: false},
    {name: '2月', value: '02', active: false},
    {name: '3月', value: '03', active: false},
    {name: '4月', value: '04', active: false},
    {name: '5月', value: '05', active: false},
    {name: '6月', value: '06', active: false},
    {name: '7月', value: '07', active: false},
    {name: '8月', value: '08', active: false},
    {name: '9月', value: '09', active: false},
    {name: '10月', value: '10', active: false},
    {name: '11月', value: '11', active: false},
    {name: '12月', value: '12', active: false}
  ];
  self.year = '';

  self.update();
  self.selectDate = function (e) {
    self.month = e.item.value;
    self.selectyear = self.year;
    var showDate = {
      year: parseInt(self.year),
      month: parseInt(e.item.value)
    }
    self.parent.trigger('selectMonthdate', showDate);
    self.trigger('selectMonthdate', showDate);
  }

  self.beforeYear = function () {
    var em = window.event;
    em.preventDefault();
    if (em && em.stopPropagation) {
      em.stopPropagation();
    }
    self.year = parseInt(this.year) - 1
  }
  self.afterYear = function () {
    var em = window.event;
    em.preventDefault();
    if (em && em.stopPropagation) {
      em.stopPropagation();
    }
    self.year = parseInt(this.year) + 1
  }

  self.root.openDateMonth = self.openDateMonth = function(params) {
    var _date
    if (params) {
      _date = params
    } else {
      var myDate = new Date()
      _date = myDate.getFullYear() + '-' + (myDate.getMonth() + 1 < 10 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1)
    }
    var date = _date.split('-')
    self.year = date[0];
    self.month = date[1];
    self.selectyear = date[0];
    self.update();
  }

});

riot.tag2('date-picker', '<div class="date-picker">{value}</div> <input type="{type}" name="{name}" onchange="{changeValue}" max="{max}" min="{min}" defaultvalue="{defaultValue}">', '', '', function(opts) {
		var self = this;
		var root = self.root;

		self.getDateStr = function(time) {
			return utils.getDateStr(time);
		}

		self.init = function() {
			self.type = root.getAttribute('type') || 'date';
			self.name = root.getAttribute('name');
			self.defaultValue = root.getAttribute('defaultValue');
			self.max = root.getAttribute('max');
			self.min = root.getAttribute('min');
			if (self.type === 'date') {
				self.root.value = self.value = root.getAttribute('value') || self.getDateStr(new Date().getTime());
			}
			else if (self.type === 'time') {
				self.root.value = self.value = root.getAttribute('value') || '00:00';
			}
			self.update();
			self.trigger('gotDate');
			self.parent.trigger('gotDate');
		}

		self.on('mount', function() {
			self.init();
		});

		self.changeValue = function() {
			self.root.value = self.value = root.getElementsByTagName('input')[0].value;
			if (self.type === 'date' && !self.value) {
				self.root.value = self.value = self.getDateStr(new Date().getTime());
			}
			else if (self.type === 'time' && !self.value) {
				self.root.value = self.value = '00:00';
			}
			self.parent.trigger('dateChange');
			self.trigger('dateChange');
		}

		self.root.setValue = function(value) {
			root.getElementsByTagName('input')[0].value = value;
			self.changeValue();
		}

		self.root.setTime = function(time) {
			var value = self.getDateStr(time);
			root.getElementsByTagName('input')[0].value = value;
			self.changeValue();
		}

		self.dateString = function(date) {
			var Y = date.getFullYear();
			var M = date.getMonth() + 1;
			M = M < 10 ? ('0' + M)  : M;
			var D = date.getDate();
			D = D < 10 ? ('0' + D) : D;
			return Y + "-" + M + "-" + D;
		}

		self.root.nextDay = function(cb) {
			var str = self.value.replace(/-/g,"/");
			var timestamp = new Date(str).getTime() + 1000 * 60 * 60 *24;
			var date = new Date(timestamp);
			var newStr = self.dateString(date);
			root.getElementsByTagName('input')[0].value = newStr;
			self.changeValue();
			cb && cb(newStr);
		}

		self.root.prevDay = function(cb) {
			var str = self.value.replace(/-/g,"/");

			var timestamp = new Date(str).getTime() - 1000 * 60 * 60 *24;

			var date = new Date(timestamp);
			var newStr = self.dateString(date);
			root.getElementsByTagName('input')[0].value = newStr;
			self.changeValue();
			cb && cb(newStr);
		}

		self.root.get = function() {
			return root.getElementsByTagName('input')[0].value;
		}

});

riot.tag2('date-year', '<div class="year-data"> <h4> <span class="el-icon-before" onclick="{beforeYear}"></span> <span class="year"></span> <span class="el-icon-after" onclick="{afterYear}"></span> </h4> <div class="content"> <ul> <li each="{yearList}" onclick="{selectDate}" class="{active: value == year}"> <span>{name}</span> </li> </ul> </div> </div>', '', '', function(opts) {
    var self = this

    self.selectDate = function (e) {
      self.year = e.item.value;
      var showDate = e.item.value;
      self.parent.trigger('selectYeardate', showDate);
      self.trigger('selectYeardate', showDate);
    }

    function get12year (last) {
      var list = []
      for (var i = 0; i < 12; i++) {
        var lastyear = last-i;
        self.lastyear = lastyear
        list.unshift({'name': lastyear, 'value': lastyear})
      }
      self.yearList = list
      self.update();
    }

    self.beforeYear = function () {
      var em = window.event;
      em.preventDefault();
      if (em && em.stopPropagation) {
        em.stopPropagation();
      }
      get12year(self.lastyear-1);
    }
    self.afterYear = function () {
      var em = window.event;
      em.preventDefault();
      if (em && em.stopPropagation) {
        em.stopPropagation();
      }
      get12year(self.lastyear+23);
    }
    self.root.openDateYear = self.openDateYear = function(params) {
      var _date
      if (params) {
        _date = params
      } else {
        var myDate = new Date()
        _date = myDate.getFullYear() + '-' + (myDate.getMonth() + 1 < 10 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1)
      }
      var date = _date.split('-')
      self.year = parseInt(date[0]);
      var lastyear = self.year
      var _index = lastyear%12
      if (_index != 1) {
        for (var i = 0; i < 12; i++) {
          lastyear = lastyear + 1
          if (lastyear%12 == 1) {
            break;
          }
        }
      }
      get12year(parseInt(lastyear));
      self.update();
    }
});

riot.tag2('daterangepicker', '<div class="daterange"> <input id="daterange" value="" readonly="readonly" type="text"> </div>', '.daterangepicker.dropdown-menu { max-width:none; z-index:30; padding-bottom:100px; border-left:1px solid #f1f1f1; border-right:1px solid #f1f1f1; border-bottom:1px solid #f1f1f1; border-radius:5px; display: none; } .daterangepicker .applyBtn{ position: absolute; bottom:26px; width:250px; height: 50px; line-height: 50px; text-align: center; color: #fff; font-size: 18px; background: #fe5f5f; border:0; left:50%; margin-left: -125px; border-radius:5px; } .table-condensed thead tr:first-child{ border-bottom:1px solid #ccc; } .daterangepicker .left .table-condensed tr td:last-child{ padding-right: 10px; min-width: 60px; border-right: 1px solid #ccc; } .daterangepicker .left .table-condensed tr:last-child th:last-child{ padding-right: 10px; min-width: 60px; border-right: 1px solid #ccc; } .daterangepicker .right .table-condensed tr:last-child th:first-child{ padding-left: 10px; min-width: 60px; } .daterangepicker .right .table-condensed tr td:first-child{ padding-left: 10px; min-width: 60px; } .daterangepicker .left .table-condensed thead tr:first-child th:first-child{ background: url(../imgs/nextno.png) no-repeat center; background-size:13px; } .daterangepicker .left .table-condensed thead tr:first-child th.available:first-child{ background: url(../imgs/back.png) no-repeat center; background-size:13px; } .daterangepicker .right .table-condensed thead tr:first-child th:last-child{ background: url(../imgs/nextno.png) no-repeat center; background-size:13px; transform: rotate(180deg); -o-transform: rotate(180deg); -webkit-transform: rotate(180deg); -moz-transform: rotate(180deg); } .daterangepicker .right .table-condensed thead tr:first-child th.available:last-child{ background: url(../imgs/back.png) no-repeat center; background-size:13px; transform: rotate(180deg); -o-transform: rotate(180deg); -webkit-transform: rotate(180deg); -moz-transform: rotate(180deg); } .daterangepicker .calendar.left{ float: left; } .daterangepicker .calendar.right{ float:right; } .daterangepicker .calendar{ display:none; } .daterangepicker.show-calendar .calendar{ display:block; } .daterangepicker .calendar.single .calendar-date{ border:0; } .daterangepicker .calendar th,.daterangepicker .calendar td{ font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif; white-space:nowrap; text-align:center; min-width:50px; font-size: 16px; color: #666; line-height: 40px; } .daterangepicker .daterangepicker_start_input,.daterangepicker .daterangepicker_end_input,.daterangepicker .cancelBtn{ display: none; } .daterangepicker .calendar-time{ text-align:center; line-height:30px; margin:8px auto 0; } .daterangepicker{ position:absolute; background:#fff; top:100px; left:20px; margin-top:1px; -webkit-border-radius:4px; -moz-border-radius:4px; border-radius:4px; padding:4px; } .daterangepicker table{ width:100%; margin:0; } .daterangepicker td,.daterangepicker th{ text-align:center; width:20px; height:20px; cursor:pointer; white-space:nowrap; } .daterangepicker td.available:hover,.daterangepicker th.available:hover{ background:#eee; } .daterangepicker td.in-range{ background:#ebf4f8; -webkit-border-radius:0; -moz-border-radius:0; border-radius:0; } .daterangepicker td.available+td.start-date{ -webkit-border-radius:30px; -moz-border-radius:30px; border-radius:30px; } .daterangepicker td.in-range+td.end-date{ -webkit-border-radius:30px; -moz-border-radius:30px; border-radius:30px; } .daterangepicker td.start-date.end-date{ -webkit-border-radius:30px; -moz-border-radius:30px; border-radius:30px; } .daterangepicker td.active,.daterangepicker td.active:hover{ background: #fed9d9; color: #666; border-radius: 30px; width: 50px; height: 40px; } .daterangepicker th.month{ width:auto; height: 60px; font-size: 20px; color: #505050; } .daterangepicker td.off{ color:#999; } .daterangepicker td.disabled{ color:#ccc; text-decoration:line-through }', '', function(opts) {
		var self = this;
		var root = self.root;

		self.format = function(myDate){
			return myDate.getFullYear()+"-"+( ((myDate.getMonth()+1)<9)?("0"+(myDate.getMonth()+1)):(myDate.getMonth()+1))+"-"+((myDate.getDate()<9)?("0"+myDate.getDate()):myDate.getDate());
		}
		self.on('mount', function() {
			var myDate = new Date();
			var todayDate = self.format(myDate);
			myDate.setTime(myDate.getTime()-24*60*60*1000*7);
			var startDate = self.format(myDate);
			$("#daterange").val(startDate+"~"+todayDate);
      $('#daterange').daterangepicker({
      	format: 'YYYY-MM-DD',
          maxDate:todayDate,
          startDate: startDate,
  		endDate: todayDate,
          dateLimit:{days:30},
       	 	separator: ' ~ ',
          locale:{
          	 applyLabel: '确定',
          	 customRangeLabel: 'Custom',
                 daysOfWeek: ['周日', '周一', '周二', '周三', '周四', '周五','周六'],
                 monthNames: ['1-', '2-', '3-', '4-', '5-', '6-', '7-', '8-', '9-', '10-', '11-', '12-'],
                 firstDay: 1
          },
  		}, function(start,end,label) {

			self.parent.trigger('dateChange');
			self.trigger('dateChange');
  		});
		})
});


riot.tag2('modal', '<div class="modal-dialog" riot-style="width:{width}; height:{height}"> <div class="modal-container"> <div class="modal-title" if="{title}">{title}</div> <yield></yield> </div> <div class="modal-submit" if="{!noFooter}"> <div class="button-wrap"> <a class="btn btn-default cancle {small: needDelete || samllBtn} {three:continue}">{cancleText || ⁗取消⁗}</a> <a class="btn btn-default delete {small: needDelete || samllBtn} " if="{needDelete}">{deleteText || ⁗删除⁗}</a> <a class="btn btn-primary continue {small: samllBtn} {three:continue}" if="{continue}">{continue || ⁗继续添加⁗}</a> <a class="btn btn-primary submit {small: samllBtn} {three:continue}">{submitText || ⁗确定⁗}</a> </div> <div class="clearfix"></div> </div> <div class="modal-submit" if="{buttonOk}"> <div class="button-wrap"> <a class="btn btn-primary cancle">{submitText || ⁗知道了⁗}</a> </div> <div class="clearfix"></div> </div> </div>', '', '', function(opts) {
    var self = this;
    var config = self.opts.opts || self.opts || {};
    var EL = self.root;
    self.needDelete = EL.hasAttribute('delete');
    self.noFooter = EL.hasAttribute('nofooter');
    self.samllBtn = EL.hasAttribute('small');
    self.continue = EL.hasAttribute('continue');
    self.title = EL.hasAttribute('title');
    self.buttonOk = EL.hasAttribute('buttonOk');

    for (var i in config) {
        self[i] = config[i];
    }
    self.width = config.width || EL.getAttribute('modal-width') || '500px';
    self.height = config.height || EL.getAttribute('modal-height') || 'auto';

    self.on('mount', function() {
        var container = self.root.querySelector('.modal-container');

        var foot = self.root.querySelector('.modal-submit');

        var foodHeight = foot ? parseInt(window.getComputedStyle(foot, null).height) : 0;
        if (self.height && self.height!== 'auto') {
            container.style.height = (parseInt(self.height) - foodHeight - 2) + 'px';
        }
        self.bindEvent();
    })

    self.root.open = self.open = function(params) {
        self.root.style.display = 'flex';
        self.onOpen && self.onOpen(params);
    }

    self.root.close = self.close = function(params) {
        self.root.style.display = 'none';
        self.onClose && self.onClose(params);
    }

    self.root.loadData = function(newData, colName){
        colName = colName || 'data';
        self[colName] = newData
        self.update();
    }

    self.confirm = self.root.confirm = function(params) {
        self.onSubmit && self.onSubmit(params);
    }

	 self.goonButton = self.root.goonButton = function(params) {
        self.onContinue && self.onContinue(params);
    }

    self.delete = self.root.delete = function(params) {
        self.onDelete && self.onDelete(params);
    }

    self.bindEvent = function() {

        $(EL).find('.modal-close-wrap').on('click', self.close);
        $(EL).find('.cancle').on('click', self.close);
        $(EL).find('.delete').on('click', self.delete);
        $(EL).find('.submit').on('click', self.confirm);
        $(EL).find('.continue').on('click', self.goonButton);

    }
});

riot.tag2('pop', '<div class="modal-dialog" riot-style="width:{width}; height:{height}"> <div class="pop-title" if="{title}"> <span>{title}</span> <div class="pop-help-wrap" if="{help}"> <a class="pop-help"></a> </div> <div class="pop-wclose-wrap" if="{popclose}" onclick="{wclose}"> </div> </div> <div class="modal-container pop-content"> <yield></yield> </div> <div class="pop-submit" if="{twoButton}"> <div class="button-wrap"> <a class="cancle">{cancleText || ⁗取消⁗}</a> <a class="sure">{sureText || ⁗确定⁗}</a> </div> <div class="clearfix"></div> </div> <div class="pop-submit" if="{oneButton}"> <div class="button-wrap"> <a class="konw">{konwText || \'知道了\'}</a> </div> </div> </div>', '', 'class="{popz-big:popzBig}{popzbigTwo:popzbigTwo}"', function(opts) {
        var self = this;
        var config = self.opts.opts || self.opts || {};
        var EL = self.root;
        self.title = EL.hasAttribute('title');
        self.twoButton = EL.hasAttribute('twobutton');
        self.oneButton = EL.hasAttribute('onebutton');
        self.popzBig = EL.hasAttribute('popzbig');
        self.popzbigTwo = EL.hasAttribute('popzbigtwo');
        self.sureText = EL.hasAttribute('suretext')? config.suretext : "确定";
        self.cancleText = EL.hasAttribute('cancletext') ? config.cancletext: "取消";
        self.konwText = EL.hasAttribute('konwtext') ? config.konwtext : "知道了";
        self.help = EL.hasAttribute('help');
        self.popclose = EL.hasAttribute('popclose');

        for (var i in config) {
          self[i] = config[i];
        }
        self.width = config.width || EL.getAttribute('modal-width') || '500px';
        self.height = config.height || EL.getAttribute('modal-height') || 'auto';

        self.on('mount', function () {
            var container = self.root.querySelector('.modal-container');

            var foot = self.root.querySelector('.pop-submit');

            var foodHeight = foot
                ? parseInt(window.getComputedStyle(foot, null).height)
                : 0;
            if (self.height && self.height !== 'auto') {
                container.style.height = (parseInt(self.height) - foodHeight - 2) + 'px';
            }
            self.bindEvent();
        })

        self.root.open = self.open = function (params) {
            self.root.style.display = 'flex';
            self.onOpen && self.onOpen(params);
        }

        self.root.close = self.close = function (params) {
            self.root.style.display = 'none';
            self.onClose && self.onClose(params);
        }

        self.root.loadData = function (newData, colName) {
            colName = colName || 'data';
            self[colName] = newData
            self.update();
        }

        self.confirm = self.root.confirm = function (params) {
            self.onSubmit && self.onSubmit(params);
        }

        self.helpbutton = self.root.helpbutton = function (params) {
            self.onHelp && self.onHelp(params);
        }

        self.konw = self.root.konw = function (params) {
            self.root.style.display = 'none';
            self.onClose && self.onClose(params);
        }

        self.wclose = self.root.wclose = function (params) {
            self.root.style.display = 'none';
            self.onClose && self.onClose(params);
        }

        self.bindEvent = function () {

            $(EL).find('.pop-help').on('click', self.helpbutton);
            $(EL).find('.cancle').on('click', self.close);
            $(EL).find('.konw').on('click', self.konw);
            $(EL).find('.sure').on('click', self.confirm);
            $(EL).find('.pop-wclose-wrap').on('click', self.wclose);
        }
});

riot.tag2('search', '<div class="search-wraper"> <div class="input-wraper {active: searchWord}"> <input type="text" class="search-input" oninput="{search}" onblur="{blur}"> <span class="cancel-input" onclick="{cancelSearch}"></span> <ul if="{searchResult.length}"> <li each="{item in searchResult}" onclick="{handleClick(item)}">{item.goodsName} <span>￥{item.price}</span></li> </ul> </div> </div>', '', '', function(opts) {
		var self = this;
		var config = self.opts.opts;
		var timer = 200;

		flux.bind.call(self, {
			name: 'searchResult',
			store: store.search,
			success: function(){
				self.update();
			}
		});
		self.search = function(e){
			var target = $(e.target);
			self.searchWord = target.val();
			clearTimeout(self.timer);
			self.timer = setTimeout(function(){
				if (self.searchWord){
					store.search.fetch({
						q: self.searchWord
					});
				}
			}, timer);

		};

		self.cancelSearch = function(){
			$(self.root).find('.search-input').val('');
			self.searchWord = null;
		};

		self.blur = function(){
			setTimeout(function(){
				store.search.clear();
				self.searchResult = null;
			},timer);
		};

		self.handleClick = function(item){
			return function(){
				console.log(item);
				config.clickHandle(item);
				self.cancelSearch();
			}
		};

});

riot.tag2('select-date', '<div class="select-date"> <a each="{list}" class="{active: value == selectType}" onclick="{selectDateType}">{name} <div class="input" if="{value==1}"> <input type="text" id="J-xl-2"> </div> </a> </div> <div class="date-ym"> <date-year if="{dateYear}" id="yearMonth"></date-year> <date-month if="{dateMonth}" id="dateMonth"></date-month> </div> <input type="hidden" name="" value="" id="selectdateChangeEnd"> <input type="hidden" name="" value="" id="selectdateChangeStart">', '', '', function(opts) {
        var self = this
        var config = self.opts.opts || self.opts || {};
        self.dateYear = false
        self.dateMonth = false
        self.selectType = 1

        self.list = [
            {
                'name': '按日选',
                'value': 1
            }, {
                'name': '按周选',
                'value': 2
            }, {
                'name': '按月选',
                'value': 3
            }, {
                'name': '按年选',
                'value': 4
            }
        ]

        self.root.open = self.open = function(params) {
            var e = {
              item: {
                value: params.selectType,
                startDate: params.startDate,
                endDate: params.endDate
              }
            }
            self.selectDateType(e)
        }

        self.selectDateType = function (e) {
          var em = window.event;
          em.preventDefault();
          if (em && em.stopPropagation) {
            em.stopPropagation();
          }
          var startDate = $("#selectdateChangeStart").val()
            if (e.item.value === 1) {
              self.selectType = 1
              self.confirmDate()
            } else if (e.item.value === 2) {
              self.selectType = 2
              self.confirmDate()
            } else if (e.item.value === 3) {
              self.selectType = 3
              self.dateYear = false
              self.dateMonth = true;
              self.update();
              $("#dateMonth")[0].openDateMonth(startDate);
            } else if (e.item.value === 4) {
              self.selectType = 4
              self.dateYear = true
              self.dateMonth = false;
              self.update();
              $("#yearMonth")[0].openDateYear(startDate);
            }
        }

        self.confirmDate = function () {
          self.update()
            laydate({
                elem: '#J-xl-2', format: 'YYYY-MM-DD',

                isclear: false,
                issure: false,
                istoday: false,
                choose: function (datas) {

                    var startDate = '';
                    var endDate = '';
                    var showDate = ""
                    if (self.selectType == 1) {
                      startDate = datas;
                      endDate = datas;
                      showDate = startDate;
                    } else if (self.selectType == 2) {
                      var dateYear = datas.substring(0,10);
                      var dd = dateYear.replace(/-/g,"/");
                      var d=utils.getMonDate(dd);
                      var arr=[];
                      for(var i=0; i<7; i++)
                      {
                      arr.push(d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate());
                      d.setDate(d.getDate()+1);
                      }
                      $("#shows").text(arr[0] + '~' + arr[6]);
                      startDate = arr[0];
                      endDate = arr[6];
                    }
                    triggerDate(startDate,endDate)
                }
            });
        }

        function triggerDate(startDate,endDate) {
          $("#selectdateChangeStart").val(startDate)
          $("#selectdateChangeEnd").val(endDate)
          var showDate = startDate + " ~ " + endDate;
          var date = startDate.split('-')
          if (self.selectType === 1) {
            showDate = startDate
          } else if (self.selectType === 3) {
            showDate =date[0] +"-" + date[1]
          } else if (self.selectType === 4) {
            showDate =date[0] +"年"
          }
          var date = {
            showDate: showDate,
            selectType:self.selectType
          }
          self.parent.trigger('selectdateChange', date);
          self.trigger('selectdateChange', date);
        }

        self.on('selectMonthdate', function (date) {
          date.month = date.month  < 10 ? '0' + date.month : date.month
          var startDate = date.year +"-" +date.month+ "-" +"01"
          var endDate = date.year +"-" +date.month +"-"+ utils.getLastDay(date.year, date.month)
          triggerDate(startDate, endDate)
        })

        self.on('selectYeardate', function (date) {
          var startDate = date +"-01-01"
          var endDate = date +"-12-31"
          triggerDate(startDate, endDate)
        })

        self.on('mount', function() {
          self.confirmDate();
        })
});

riot.tag2('side-bar', '<div id="side-bar"> <div class="header"> <div class="avator" onclick="{openTip}"></div> <div class="account-name" onclick="{openTip}">{accountName || \'用户名\'}</div> <div class="right-tip" style="display:none"> <div class="tri"></div> <a onclick="{openAbout}">关于我们</a> <a onclick="{logout}">退出账户</a> </div> </div> <div class="side-menu"> <ul> <li class="{active: type==\'casher\'||type==\'\'}"> <a href="#/casher/index"> <div class="menu-pic m-casher"></div> <div class="menu-title">收银</div> </a> </li> <li class="{active: type==\'order\'}" if="{!isBqCommercial}"> <a href="#/order/index"> <div class="menu-pic m-order"> <div class="order-untreated" style="display:none"></div> </div> <div class="menu-title">订单</div> </a> </li> <li class="{active: type==\'shop\'}"> <a href="#/shop/index"> <div class="menu-pic m-store"></div> <div class="menu-title">店铺</div> </a> </li> <li class="{active: type==\'app\'}"> <a href="#/app/index"> <div class="menu-pic m-app"></div> <div class="menu-title">应用</div> </a> </li> </ul> <div class="lock" onclick="{openLock}"></div> <div class="setting" onclick="{openSetting}"></div> </div> <modal id="about-layer" model-width="400px" model-height="512px" without-delete nofooter> <div class="about"> <div class="about-close" onclick="{close}"></div> <h2>关于</h2> <img class="logo" width="106" src="imgs/logo.png"> <p>版本： {parent.version} </p> <span class="red-box" onclick="{parent.checkAppUpdateState}">检测更新</span> </div> </modal> <modal modal-width="500px" modal-height="" id="confirm-exit" goexit> <confirm-exit></confirm-exit> </modal> </div>', '', '', function(opts) {
		var self = this;

		function active() {
					self.type = location.hash.substr(2).split('/')[0].replace(/\?\S+/, '');
					self.update();

				}
		flux.bind.call(self, {
			name: 'account',
			store: store.account,
			success: function () {
				self.accountName = self.account
					? self.account.personName
					: '用户名';
				self.update();
			}
		});

		self.checkAppUpdateState = function () {
			httpGet({url: api.checkAppUpdateState});
		}

		self.toBeConfirmed = function () {
			store.orderConfirmed.get(function (data) {
				if (data > 0) {
					$(".order-untreated").show().text(data);
				} else {
					$(".order-untreated").hide();
				}
			});
		}

		self.openTip = function () {
			var e = window.event;
			e.preventDefault();
			if (e && e.stopPropagation) {
				e.stopPropagation();
			}
			$('.right-tip').toggle();
			function closeTip() {
				$('.right-tip').hide();
				$(window).unbind('click', closeTip);
			}
			setTimeout(function () {
				$(window).bind('click', closeTip);
			}, 100);
		};

		self.openAbout = function () {
			$('#about-layer')[0].open();
		};

		self.closeAbout = function () {
			$('#about-layer')[0].close();
		}

		self.logout = function () {
			$('#confirm-exit')[0].open();

		}

		self.openLock = function () {
			utils.androidBridge(api.lockScreen)

		}
		self.openSetting = function () {
			utils.androidBridge(api.openSetting)

		}
		self.checkUserIsLogin = function () {
					var storeInfo = {}

					if (window.localStorage && localStorage.account) {
						storeInfo = JSON.parse(localStorage.account)
					}

					if (!storeInfo.storeId) {

						utils.androidBridge(api.goLogin)

					}
				}
		self.UserInfo = function () {
			store.account.lastLogin(function () {
				self.checkUserIsLogin();
			});
		}
		self.on('mount', function () {

			if (window.Iapps) {
				Iapps.getVersion(function (res) {
					if (res.version) {
						self.version = res.version;
						self.update();
					} else {
						self.version = "V1.0.0 Beta";
						self.update();
					}
				}, function (err) {}, {})
			} else {
				self.version = "V1.0.0 Beta"
			}
			setTimeout(self.toBeConfirmed, 500);

			window.addEventListener('orderNumChange', self.toBeConfirmed);
		});

		self.on('unmount', function () {
			window.removeEventListener('orderNumChange', self.toBeConfirmed);
		});

		riot.routeParams.on('changed', active);
		active();
});

riot.tag2('top-bar', '<div id="top-bar"> <div id="page-title"> <div class="title" if="{title}"> <a class="back" if="{back}" href="{back}">返回</a> {title}</div> <div id="top-search" if="{search}"> <search opts="{searchOpts}"></search> </div> <div id="type-list" if="{hasAdd}" onclick="{toggleProducts}"> <div class="tri" if="{showProducts}"> <div></div> </div> </div> </div> <div id="status"> <span if="{weather.city}">{weather.city}</span> <span if="{weather.weather}">{weather.weather}</span> <span if="{weather.temp}">{weather.temp}℃</span> <span>{nowDate}</span> <span class="icon i_wifi_full" if="{netState==\'wifi\'}"></span> <span class="icon i_wifi_weak" if="{netState==\'weak\'}"></span> <span class="icon i_wifi_no" if="{netState==\'no\'}"></span> </div> </div> <div id="product-layer" if="{hasAdd & showProducts}"> <div class="category top-category"> <h2>商品分类</h2> <ul> <li each="{category}" onclick="{changeCate}" class="{active: active}"> <a cateid="{cateId}">{cateName}</a> </li> </ul> </div> <div class="product-list"> <ul class="top-goods-list"> <li each="{item in goodList}" onclick="{addToCart(item)}"> <div class="item-pic" riot-style="background-image:url({item.imageUrl || \'imgs/default-product.png\'})"></div> <p>{item.goodsName || \'无码商品\'}</p> <strong>￥{item.price}</strong> </li> </ul> </div> </div>', '', '', function(opts) {
		var self = this;
		store.loadTopGoodsList = true;
		self.topGoodsListScroll = 0;

		self.scan = function () {

			window.dispatchEvent(new Event('inputNumber'));
		};
		self.scan1 = function () {
			window.Icommon = window.Icommon || {};
			window.Icommon.number = '690168054050';
			window.dispatchEvent(new Event('inputNumber'));
		};
		self.checkNet = function () {
			if (window.navigator.connection) {
				var type = window.navigator.connection.type;
				switch (type) {
					case 'Unknown connection':
						self.netState = 'unknown';
						break;
					case 'WiFi connection':
						self.netState = 'wifi';
						break;
					case 'Cell 2G connection':
						self.netState = '2G';
						break;
					case 'Cell 2G connection':
						self.netState = '3G';
						break;
					case 'Cell 2G connection':
						self.netState = '4G';
						break;
					case 'No network connection':
						self.netState = 'no';
						break;
					case 'wifi':
						self.netState = 'wifi';
						break;
					case 'none':
						self.netState = 'no';
						break;
					default:
						self.netState = 'no';
				}
			} else {
				self.netState = 'wifi';
			}

			flux.bind.call(self, {
				name: 'weather',
				store: store.weather,
				success: function () {
					self.update();
				},
				error: function () {
					self.update();
				}
			});
			self.update();
		}

		document.addEventListener("online", self.checkNet, false);
		document.addEventListener("offline", self.checkNet, false);

		riot.routeParams.on('changed', function () {
			var params = riot.routeParams.params;
			if (params) {
				self.title = params.title;
				self.back = params.back;
				self.search = params.search;
				self.hasAdd = params.hasAdd;
				if (params.hasAdd) {
					setTimeout(function () {
						$(".content-wrap").bind('click', hideProduct);
					}, 200);
				}
			} else {
				self.title = false;
				self.back = false;
				self.search = false;
				self.hasAdd = false;
			}
			self.update();
		});

		function scrollCart() {
			var scroll = $('#casherCartShopList');
			var scrollTop = scroll[0].scrollHeight;
			scroll[0].scrollTop = scrollTop;
		}
		function addToCart(item) {
			item.quantity = 1;

			var list = self.cartList.list;

			if (list.length) {
				for (var i = 0; i < list.length; i++) {
					if (list[i].goodsUuid == item.goodsUuid) {
						list[i].quantity++;
						break;
					}
					if (i == list.length - 1) {
						list.push(item);
						break;
					}
				}
			} else {
				list.push(item);
			}

			store.cart.add(item.goodsUuid);
			setTimeout(function () {
				scrollCart();
			}, 200);
		}

		self.searchOpts = {
			clickHandle: addToCart
		};

		self.addToCart = function (item) {
			return function () {
				addToCart(item);

				self.update();
			};
		};

		function hideProduct() {
			self.showProducts = false;
			self.update();
			if (self.listWrap && self.scrollDown) {
				self.listWrap.removeEventListener('scroll', self.scrollDown);
			}
			$(".content-wrap").unbind('click', hideProduct);
		}

		self.toggleProducts = function () {
			var e = window.event;
			e.preventDefault();
			if (e && e.stopPropagation) {
				e.stopPropagation();
			}
			self.showProducts = self.showProducts? false : true;

			if (self.showProducts) {
				setTimeout(function () {
					$(".content-wrap").bind('click', hideProduct);
				}, 100);
			} else {
				$(".content-wrap").unbind('click', hideProduct);
			}

			self.update();
			if (self.showProducts == true) {
				if(store.loadTopGoodsList){
					store.loadTopGoodsList = false;
					self.initCategory();
				}else{
					$('.top-goods-list').scrollTop(self.topGoodsListScroll);
				}
			} else {
				if (self.listWrap && self.scrollDown) {
					self.listWrap.removeEventListener('scroll', self.scrollDown);
				}
			}
		};

		self.initCategory = function () {
			store.category.get(function(data){
				self.category = data;
				self.topGoodsListScroll = 0;
				for (var i = 0; i < self.category.length; i++) {
					if (self.category[i].cateId == parseInt(self.cateId, 10)) {
						self.category[i].active = true;
					} else {
						self.category[i].active = false;
					}
					if (!self.cateId) {
						self.cateId = self.category[0].cateId;
						self.category[0].active = true;
					}
				}
				self.update();
				self.cateHeight = $("#product-layer").height() - $(".top-category").height() - 38;
				$(".product-list").css("height", self.cateHeight);
				self.initGoods(self.cateId);
			});
		}

		self.initGoods = function (cateId) {
			var params = {
				cateId: cateId,
				next: 0
			};
			store.topGoods.get(params,function(data){
				self.goods = data;
				self.goodList = self.goods.list;
				self.next = self.goods.next;
				self.update();
				self.listenDown();
			});
		}

		self.changeCate = function (e) {
			self.cateId = e.item.cateId;
			for (var i = 0; i < self.category.length; i++) {
				if (self.category[i].cateId == parseInt(self.cateId, 10)) {
					self.category[i].active = true;
				} else {
					self.category[i].active = false;
				}
				if (self.cateId === null) {
					self.category[0].active = true;
				}
			}
			self.topGoodsListScroll = 0;
			$('.top-goods-list').scrollTop(0);
			self.initGoods(self.cateId);
		}

		self.listenDown = function () {
			setTimeout(function () {
				self.listWrap = $('.top-goods-list')[0];
				self.scrollDown = function (event) {
					var clientHeight = self.listWrap.clientHeight;
					var scrollTop = self.listWrap.scrollTop;
					self.topGoodsListScroll = self.listWrap.scrollTop;
					if ((clientHeight + scrollTop) > self.listWrap.scrollHeight - 60) {
						if (self.next && !self.scrollLock) {
							self.scrollLock = true;
							store.topGoods.getMore({
								cateId: self.cateId,
								next: self.next
							}, function (data) {
								self.next = data.next;
								self.goodList = data.list;
								self.scrollLock = false;
								self.update();
							});
						}
					}
				};
				if (self.listWrap) {
					self.listWrap.addEventListener('scroll', self.scrollDown, false);
				}
			}, 50);
		}

		self.initDate = function () {
			var date = new Date();
			var months = date.getMonth() + 1;
			var hours = date.getHours();
			var minutes = date.getMinutes();
			if (months < 10) {
				months = "0" + months;
			}
			var days = date.getDate();
			if (days < 10) {
				days = "0" + days;
			}
			if (hours < 10) {
				hours = "0" + hours;
			}
			if (minutes < 10) {
				minutes = "0" + minutes;
			}
			var dateStr = date.getFullYear() + "年" + months + "月" + days + "日";
			var week = date.getDay();
			var time = hours + ":" + minutes;
			var weekarr = [
				'日',
				'一',
				'二',
				'三',
				'四',
				'五',
				'六'
			];
			self.nowDate = dateStr + " 周" + weekarr[week] + " " + time;
			self.update();
			setTimeout(self.initDate, 60000);
		}

		self.on('mount', function () {
			self.checkNet();
			self.initDate();
			flux.bind.call(self, {
				name: 'cartList',
				store: store.cart
			});
		})
});

riot.tag2('order-history', '<div class="order-index"> <div class="calendar-bar"> <span class="prev-day" onclick="{prevDay}">前一天</span> <date-picker></date-picker> <span class="next-day" onclick="{nextDay}">后一天</span> </div> <div class="order-tag"> <ul> <li onclick="{orderList}" status="{status}" each="{order}" class="{active:active}">{statusStr}</li> </ul> </div> <div class="order-content"> <div class="order-left {empty:!orderHistory.list.length}" id="hisorderList"> <div class="order-list {active:active}" each="{orderHistory.list}" onclick="{list}"> <div class="title">下单时间：<i class="f22-r">{createTime}</i></div> <div class="info"> <ul> <li>订单号：{code}</li> <li>收货人：{addrUserName}</li> <li>收货电话：{addrUserMobile}</li> <li>收货地址：{addrInfo}</li> <li>配送时间：{postTime}</li> </ul> </div> <div class="title">金额：<i class="f22-r">￥{payPrice}</i><i class="pad-tot">共计{totalCount}件</i></div> </div> </div> <div class="order-right"> <div class="order-list {order-no-button: (detail.status==4)}" style="display:none"> <div class="title text-c">在线订单(<i class="f22-r">{detail.code}</i>) <div class="order-print" onclick="{orderPrint}"></div> </div> <div class="o-d-con"> <div class="title">商品明细</div> <div class="info"> <ul> <li each="{detail.goods}">{goodsName}<div class="amount price">X{goodsCount}</div><div class="price">￥{buyTotalPrice}</div></li> </ul> </div> <div class="info"> <ul> <li>配送费：<div class="price">￥{detail.postPrice}</div></li> <li class="coupon" if="{detail.couponAmount}">优惠券：<div class="price">－¥{detail.couponAmount}</div></li> <li>总计：<div class="price">￥{detail.payPrice}</div></li> </ul> </div> <div class="title">配送明细</div> <div class="info border-none"> <ul> <li>订单状态：{detail.statusStr}</li> <li if="{detail.cancelUserName}">取消人：{detail.cancelUserName}</li> <li if="{detail.cancelReason}">取消原因：{detail.cancelReason}</li> <li>下单时间：{detail.createTime}</li> <li>收货人：{detail.addrUserName}</li> <li>收电话：{detail.addrUserMobile}</li> <li>收货地址：{detail.addrInfo}</li> <li>配送时间：{detail.postTime}</li> <li>买家留言：{detail.remark}</li> </ul> </div> </div> <div class="button"> <a class="cancel" onclick="{cancel}" if="{detail.status ==  3}">设为无效</a> <input type="hidden" id="orderId" value="{detail.orderId}"> </div> </div> </div> </div> </div>', '', '', function(opts) {
		var self = this;
		self.size = 5;
		self.status = 3;
		self.getDateStr = function(time) {
			return utils.getDateStr(time);
		}

     	this.orderPrint = function(){
     		store.printOrderDetail.get(self.detail);
     	}.bind(this)

		self.nextDay = function() {
			$(self.root).find('date-picker')[0].nextDay();
		}

		self.prevDay = function() {
			$(self.root).find('date-picker')[0].prevDay();
		}

        self.init = function(){
        	if(!self.targetTime){
	        	var date = self.getDateStr(new Date().getTime());
	        	self.targetTime = date;
        	}
        	self.page = 1;
        	if(!self.status){
        		self.status = 3;
        	}
    	    flux.bind.call(self, {
    	        name: 'orderHistory',
    	        store: store.orderHistory,
    	        refresh: true,
    	        params: {page:1,size:self.size,status:self.status,targetTime:self.targetTime},
    	        success: function () {
    	        	if(self.orderHistory.list && self.orderHistory.list.length>0){
    	        		self.orderHistory.list[0].active = true;
    		            self.detail = self.orderHistory.list[0];
    		            self.total = self.orderHistory.total;
    		            $(".order-list").show();
    	        	}else{
    	        		$(".order-list").hide();
    	        	}
    	            self.update();
    	        }
    	    });
        }

		this.cancel = function(e){
			var refuse = $("<order-invalid></order-invalid>");
            $("order-history").append(refuse);
			riot.mount("order-invalid");
		}.bind(this)

     	self.orderListAll = function(){
			var param = {page:1,size:self.size,status:self.status,targetTime:self.targetTime};
			store.orderHistory.get(param,function(data){
				self.total = data.total;
				self.page = data.page;
			});
			self.update();
     	}

		this.orderList = function(e){
			if(e.item.active == false){
				for(var i=0;i<self.order.length; i++){
					self.order[i].active = false;
				}
				e.item.active = true;
				var status = e.item.status;
				self.status = status;
				self.update();
				self.orderListAll();
			}
		}.bind(this)

		this.list = function(e){
			for(var i=0;i<self.orderHistory.list.length; i++){
				self.orderHistory.list[i].active = false;
			}
			e.item.active = true;
			self.detail = e.item;
			self.update();
		}.bind(this)

		self.on('mount', function() {
			self.order=[
			             {status:3,statusStr:"已完成",active:true},
			             {status:4,statusStr:"无效订单",active:false}

				]
			self.update();
        	self.init();
        	self.nextPage();
		});

     	self.on('dateChange', function() {
			var date = $(self.root).find('date-picker')[0].value;
			self.targetTime = date;
			self.init();
		});

		self.nextPage = function(){
		       var curPage = 1;
		 		$("#hisorderList").scroll(function () {
		 			if(curPage == 1){
		 				self.listWrap = $('#hisorderList')[0];

	                    var clientHeight = self.listWrap.clientHeight;
	                    var scrollTop = self.listWrap.scrollTop;

		 				if((clientHeight + scrollTop) > self.listWrap.scrollHeight - 20){
		 					if(!self.page){
		 						self.page = 1;
		 					}
		 					if(!self.status){
		 						self.status = 3;
		 					}
		 					if(self.page < (self.total/self.size)){
		 						curPage=2;
		 						var param ={ page:self.page+1,size:self.size,status:self.status,targetTime:self.targetTime};
		 						store.orderHistory.getMore(param,function(data){
		 							self.page = data.page;
		 							self.update();
		 							curPage=1;
		 						});
		 					}
		 				}
		 			}
		 		});
			}

});

riot.tag2('order-index', '<div class="order-index"> <div class="order-top"> <div class="order-status">接单状态:</div> <div class="order-status-img" if="{!storeOpen}"> <span id="orderStatusText">不接单</span> <div class="img" onclick="{orders}"></div> </div> <div class="order-status-img" if="{storeOpen}"> <span id="orderStatusText">接单</span> <div class="img active" onclick="{orders}"></div> </div> <div class="history icon" onclick="{histroyOrder}">历史订单</div> </div> <div class="order-tag" if="{storeOpen}"> <ul> <li onclick="{orderList}" status="{status}" each="{order}" class="{active:active}"> <div class="num" style="display:none" if="{num}" id="unconfirmedOrderNum"></div> {statusStr} </li> </ul> </div> <div class="order-content"> <div class="order-left {empty:!orderToday.list.length}" id="orderListLi" if="{storeOpen}"> <div class="order-list {active:active}" each="{orderToday.list}" onclick="{list}"> <div class="title">下单时间：<i class="f22-r">{createTime}</i> </div> <div class="info"> <ul> <li>订单号：{code}</li> <li>收货人：{addrUserName}</li> <li>收货电话：{addrUserMobile}</li> <li>收货地址：{addrInfo}</li> <li>配送时间：{postTime}</li> </ul> </div> <div class="title">金额：<i class="f22-r">￥{payPrice}</i> <i class="pad-tot">共计{totalCount}件</i> </div> </div> </div> <div class="order-right"> <div class="order-list {order-no-button: (detail.status==4)}" if="{storeOpen && orderToday.list.length>0}"> <div class="title text-c">在线订单(<i class="f22-r">{detail.code}</i>) <div class="order-print" onclick="{orderPrint}"></div> </div> <div class="o-d-con"> <div class="title">商品明细</div> <div class="info"> <ul> <li each="{detail.goods}">{goodsName}<div class="amount price">X{goodsCount}</div> <div class="price">￥{buyTotalPrice}</div> </li> </ul> </div> <div class="info"> <ul> <li>配送费：<div class="price">￥{detail.postPrice}</div> </li> <li class="coupon" if="{detail.couponAmount}">优惠券：<div class="price">－¥{detail.couponAmount}</div> </li> <li>总计：<div class="price">￥{detail.payPrice}</div> </li> </ul> </div> <div class="title">配送明细</div> <div class="info border-none"> <ul> <li>订单状态：{detail.statusStr}</li> <li if="{detail.cancelUserName}">取消人：{detail.cancelUserName}</li> <li if="{detail.cancelReason}">取消原因：{detail.cancelReason}</li> <li>下单时间：{detail.createTime}</li> <li>收货人：{detail.addrUserName}</li> <li>收电话：{detail.addrUserMobile}</li> <li>收货地址：{detail.addrInfo}</li> <li>配送时间：{detail.postTime}</li> <li>买家留言：{detail.remark}</li> </ul> </div> </div> <div class="button"> <a class="cancel" onclick="{cancel}" if="{detail.status==3}">设为无效</a> <div class="fl-left width-50" if="{detail.status==2}"> <a class="cancel" onclick="{cancel}">设为无效</a> </div> <div class="fl-right width-50" if="{detail.status==2}"> <a class="sure" onclick="{served}">已送达</a> </div> <div class="fl-left width-50" if="{detail.status==1}"> <a class="cancel" onclick="{denialOrders}">拒绝订单</a> </div> <div class="fl-right width-50" if="{detail.status==1}"> <a class="sure" onclick="{confirmOrder}">确认订单</a> </div> <div class="clear"></div> <input type="hidden" id="orderId" value="{detail.orderId}"> </div> </div> </div> </div> <modal id="order-warning" modal-width="200px" modal-height="80px" nofooter> <p class="warning-text">{parent.warningText}</p> </modal> </div>', '', '', function(opts) {
		var self = this;
		self.size = 5;
		self.status = 1;

		this.histroyOrder = function(e) {

			utils.setTitle("#/order/history", '历史订单')

		}.bind(this)

		self.orderPrint = function () {
			store.printOrderDetail.get(self.detail);
		}

		self.getOrderPrintState = function () {
			if (store.online) {
				httpGet({
					url: api.getOrderPrintState,
					complete: function (data) {
						self.orderPrintState = data.data.nameValuePairs.printOrderState;
						self.update();
					}
				});
			}
		}

		function warning(text) {
			var layer = $('#order-warning')[0];

			self.warningText = text;
			self.update();
			layer.open();
			setTimeout(function () {
				layer.close();
			}, 1000);
		}

		self.toBeConfirmed = function () {
			store.orderConfirmed.get(function (data) {
				if (data > 0) {
					$("#unconfirmedOrderNum").show().text(data);
					$(".order-untreated").show().text(data);
				} else {
					$("#unconfirmedOrderNum").hide();
					$(".order-untreated").hide();
				}
			});
		}

		this.orders = function(e) {
			var status = 2;
			if (!($(".img").is(".active"))) {
				status = 1;
			}
			var param = {
				status: status
			};
			store.upCanOrder.get(param, function () {
				if (status == 1) {
					self.storeOpen = true;
					self.orderListAll();
				} else {
					self.storeOpen = false;
				}
				self.update();
			});
		}.bind(this)

		this.confirmOrder = function(e) {
			var orderId = $("#orderId").val();
			var param = {
				orderId: orderId
			};

			store.orderConfirm.get(param, function (data) {
				warning("操作成功");
				if (self.orderPrintState) {
					self.orderPrint();
				}
				self.orderListAll();
				utils.androidBridge(api.updateNum,{},function() {
				})
				self.update();
			});

		}.bind(this)

		this.denialOrders = function(e) {
			var refuse = $("<order-refuse></order-refuse>");
			$("order-index").append(refuse);
			riot.mount("order-refuse");

		}.bind(this)

		this.served = function(e) {
			var orderId = $("#orderId").val();
			var param = {
				orderId: orderId
			};
			store.orderComplete.get(param, function (data) {
				warning("操作成功");
				self.orderListAll();
				httpGet({

						url: api.synTask,

						params: {name: "StoreOrder"},
						success: function(res) {
						},
				});

			});

		}.bind(this)

		this.cancel = function(e) {
			var refuse = $("<order-invalid></order-invalid>");
			$("order-index").append(refuse);
			riot.mount("order-invalid");
		}.bind(this)

		this.orderList = function(e) {
			var status = e.status;
			if (e.item.active == false) {
				for (var i = 0; i < self.order.length; i++) {
					self.order[i].active = false;
				}
				e.item.active = true;
				var status = e.item.status;
				self.status = status;
				self.update();
				self.orderListAll();
			}
		}.bind(this)

		self.orderListAll = function () {
			var params = {
				page: 1,
				size: self.size,
				status: self.status
			};
			store.orderToday.get(params, function (data) {
				self.total = data.total;
				self.page = data.page;
				self.orderToday = data;
				if (data.list && data.list.length > 0) {
					data.list[0].active = true;
					self.detail = data.list[0];
				}

				self.update();
				self.toBeConfirmed();
			});
		}

		this.list = function(e) {
			for (var i = 0; i < self.orderToday.list.length; i++) {
				self.orderToday.list[i].active = false;
			}
			e.item.active = true;
			self.detail = e.item;
			self.update();
		}.bind(this)

		self.on('mount', function () {
			self.order = [
				{
					status: 1,
					statusStr: "待确认",
					active: true,
					num: true
				}, {
					status: 2,
					statusStr: "待送达",
					active: false,
					num: false
				}, {
					status: 3,
					statusStr: "已完成",
					active: false,
					num: false
				}, {
					status: 4,
					statusStr: "无效订单",
					active: false,
					num: false
				}
			]
			self.update();
			self.init();
			self.toBeConfirmed();
			self.nextPage();

			window.addEventListener('orderNumChange', self.orderListAll);
		});

		self.on('unmount', function () {
			window.removeEventListener('orderNumChange', self.orderListAll);
		});

		self.nextPage = function () {
			var curPage = 1;
			$("#orderListLi").scroll(function () {
				if (curPage == 1) {
					self.listWrap = $('#orderListLi')[0];
					var clientHeight = self.listWrap.clientHeight;
					var scrollTop = self.listWrap.scrollTop;
					if ((clientHeight + scrollTop) > self.listWrap.scrollHeight - 20) {
						if (!self.page) {
							self.page = 1;
						}
						if (!self.status) {
							self.status = 1;
						}
						if (self.page < (self.total / self.size)) {
							curPage = 2;
							var param = {
								page: self.page + 1,
								size: self.size,
								status: self.status
							};
							store.orderToday.getMore(param, function (data) {
								self.page = data.page;
								self.orderToday = data;
								self.update();
								curPage = 1;
							});
						}
					}
				} else {
					return;
				}
			});
		}

		self.init = function () {
			self.getOrderPrintState();
			store.storeInfo.get({}, function (data) {
				if (data.state == 2) {
					self.storeOpen = false;
				} else {
					self.storeOpen = true;
					self.orderListAll();
				}
				self.update();
			});
		}
});

riot.tag2('order-remind', '<div style="display: none"> <audio id="music" src="file:///mnt/internal_sd/Android/data/cn.ipos100.pos/files/mp3/order.ogg"></audio> </div>', '', '', function(opts) {
		var self = this;
		self.play = function () {

					var audio = document.getElementById('music');
					audio.play();

					window.dispatchEvent(new Event('orderNumChange'));

		}

		function playAudio(audio) {
			var url = audio.currentSrc
			if (!url) {
				return;
			}
			if (url.search('http') != -1) {
				audio.play();
			} else {
				var myMedia = new Media(url, function () {

				}, function (err) {

				});
				myMedia.play();
			}
		}

		function getOrderMessage() {
			self.message = JSON.parse(Ipush.message);
			if (self.message.type == 2) {
				self.play();
			}
		}

		self.on('mount', function () {
			window.addEventListener('receiveMessage', getOrderMessage, false);

		});

		self.on('unmount', function () {
			window.removeEventListener('receiveMessage', getOrderMessage);

		});
});

riot.tag2('app-index', '<ul class="app-index"> <li each="{list}" onclick="{downorlook}" onmousedown="{deleteApp}"> <div class="app-list"> <div class="app-img"> <img riot-src="{icon}"> </div> <div class="no-down downloading" if="{status==3 || status==1}"> <div class="download-no" riot-style="height:{noDown}%"></div> <div class="download-yes" riot-style="height:{progress}%"></div> <div class="downloading-word">{progress || 0}%</div> </div> <div class="no-down" if="{status !=7}"></div> </div> <div class="app-name">{name}</div> </li> <div class="clearfix"></div> </ul>', '', '', function(opts) {
        var self = this;

        self.downorlook = function (e) {
            if (e.item.type == 0) {
                utils.toast("您还未解锁当前应用，完成相应成就即可解锁");
                return;
            }
            clearTimeout(timeoutDelete);
            var appInfo = JSON.stringify(e.item);
            if (e.item.status == 3) {
                utils.toast('正在下载');
                return;
            }
            store.downloadApp.get(appInfo, function () {});
        }

        function getAppInfo() {
            var appInfo = Idownload.appinfo;
            appInfo = JSON.parse(appInfo);
            if (appInfo.nativeUpdate) {
                self.init();
            } else {
                for (var i = 0; i < self.list.length; i++) {
                    if (self.list[i].packageName == appInfo.packageName) {
                        self.list[i] = appInfo;
                        self.list[i].noDown = 100 - appInfo.progress;
                        break;
                    }
                }
            }
            self.update();
        };

        self.init = function () {
            store.getappinfo.get(function (data) {
                if (window.Icommon) {
                    self.list = JSON.parse(data);
                } else {
                    self.list = data;
                }
                self.update();
                store.appList.get(function (data) {
                    if (self.list.length > 0) {
                        var newAppList = "";
                        if (data && data.length > 0) {
                            for (var j = 0; j < self.list.length; j++) {
                                newAppList += self.list[j].packageName + "  ";
                            }
                            for (var i = 0; i < data.length; i++) {
                                if (newAppList.indexOf(data[i].packageName) < 0) {
                                    self.list.push(data[i]);
                                } else {
                                    for (var k = 0; k < self.list.length; k++) {
                                        if (self.list[k].packageName == data[i].packageName) {
                                            self.list[k].type = data[i].type;
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        self.list = data;
                    }

                    self.update();
                });
            })
        }
        var timeoutDelete;
        self.on('mount', function () {
            self.init();
            window.addEventListener('sendappinfo', getAppInfo, false);
            self.deleteApp = function (e) {
                var appInfo = JSON.stringify(e.item);
                if (e.item.status == 7 && e.item.type != 0 ) {
                    timeoutDelete = setTimeout(function () {
                        if (confirm("是否删除?")) {
                            store.unInstall.get(appInfo, function () {});
                        }
                    }, 1500);
                }
            }

            $(".app-list").mouseup(function (e) {
                clearTimeout(timeoutDelete);
            });

            $(".app-list").mouseout(function (e) {
                clearTimeout(timeoutDelete);
            });

            self.update();
        });

        self.on('unmount', function () {
            clearTimeout(timeoutDelete);
            window.removeEventListener('sendappinfo', getAppInfo);
        });
});

riot.tag2('shop-index', '<ul> <li each="{list}" onclick="{noAuthTip}" if="{show || !isBqCommercial}"> <a> <img riot-src="{img}"> <div>{name}</div> </a> </li> <li onclick="{gonext}"> <a> <img src="imgs/life-service.png"> <div>生活服务</div> </a> </li> <div class="clearfix"></div> </ul>', '', '', function(opts) {
        var self = this;
        var isBqCommercial = window.isBqCommercial;

        self.list = [
            {  name: '结算单', img: 'imgs/sales-order.png', link: '#/shop/sales-order',  logName: '0301', authCode: '31',show:true },
            {  name: '商品', img: 'imgs/product.png', link: '#/shop/products', logName: '0302',authCode: '41',show:true },
            {  name: '库存', img: 'imgs/storage.png', link: '#/shop/storage', logName: '0303',authCode: ['51', '52', '53', '54'],isBqCommercial:isBqCommercial },

            {  name: '经营助手', img: 'imgs/chart.png', link: '#/shop/business-assistant' , logName: '0304',authCode: '61',show:true},

            {  name: '外接设备', img: 'imgs/device.png', link: '#/shop/device', logName: '0305',authCode: '71',show:true },
            {  name: '员工', img: 'imgs/employee.png', link: '#/shop/employee', logName: '0306',authCode: '81' ,show:true},

            {  name: '店铺资料', img: 'imgs/shop-message.png', link: '#/shop/message', logName: '0308',authCode: '91',isBqCommercial:isBqCommercial },

            {  name: '成就', img: 'imgs/achievement.png', link: '#/shop/attain', logName: '0309',authCode: '101',show:true },
            {  name: '奖励', img: 'imgs/reward.png', link: '#/shop/reward', logName: '0310',authCode: '111',show:true },
            {  name: '优惠券', img: 'imgs/coupon.png', link: '#/shop/coupon', logName: '0311',authCode: '121',show:true },

        ];

        self.noAuthTip = function(e) {
            self.log(e.item.logName);

            if (e.item.haveAuth) {
                location.href = e.item.link;
                return true;
            }
            else {
                alert('没有权限');
                return false;
            }
        }
        self.gonext = function () {
          window.location.href='#/shop/service';
        }

        self.log = function(name) {
          utils.androidBridge(api.logEvent,{eventId: name},function(){
            console.log('---shop-index----埋点－－－');
          })

        }

        self.on('mount', function() {
            httpGet({
                url: api.auth,
                success: function(res) {
                    self.auth = res.data.permissionCodes.split(',');
                    self.list.forEach(function(item) {
                        if (typeof item.authCode === 'string') {
                            if (self.auth.indexOf(item.authCode) > -1) {
                                item.haveAuth = true;
                            }
                        }
                        else if (Object.prototype.toString.call(item.authCode) === '[object Array]') {
                            item.authCode.forEach(function(code) {
                                if (self.auth.indexOf(code) > -1) {
                                    item.haveAuth = true;
                                }
                            });
                        }
                    });
                    self.update();
                }
            });

        });

});

riot.tag2('find-password', '<div id="login-wrap"> <a class="back" onclick="{goback}">返回</a> <div class="setting" onclick="{openSetting}"></div> <form class="register" onsubmit="{submit}"> <h4>找回密码</h4> <input class="{error: !verifyPhone}" value="{register.phoneMobile}" type="text" name="phone" id="register-phone" maxlength="11" placeholder="手机号"> <label> <input class="{error: !verifyCode}" value="{register.code}" type="text" name="phone" id="checkcode" placeholder="验证码"> <a if="{firstSend}" href="" onclick="{getCode}">获取</a> <a if="{!firstSend}" onclick="{getCode}"> 再次获取 <span if="{isCounting}" id="countDown">{countNum}</span> <b if="{isCounting}"> s </b> </a> </label> <input type="password" value="{register.password}" name="password" class="{error: !verifyPWD}" id="rg-pwd" placeholder="新密码"> <input type="password" value="{register.password}" class="{error: !verifyRePWD}" placeholder="再次确认密码" id="rg-repwd"> <button onclick="{submit}">修改密码</button> </form> </div>', '', '', function(opts) {
		var self = this;
		self.countNum = 60;
		self.firstSend = true;
		self.verifyCode = self.verifyPhone = self.verifyPWD = self.verifyRePWD = true;

		function countDown(){
			var count = $('#countDown');

			if (count[0]){
				count.text(self.countNum--);

				if (self.countNum > -1){
					setTimeout(countDown, 1000);
				} else {
					self.isCounting = false;
					self.update();
				}
			}
		}

		self.openSetting = function() {
			utils.androidBridge(api.openSetting)

		}

		self.getCode = function(e){
			e.preventDefault();

			var target = e.target;
			var phone = $('#register-phone').val();

			if (phone.match(/^1[0-9]{10}$/)){

				self.verifyPhone = true;

				if (self.isCounting) {
					return ;
				}

				self.firstSend = false;
				store.password.sendCode({
					phoneMobile: phone
				}, function(){
					self.isCounting = true;
					self.countNum = 60;
					self.update();
					countDown();
				});
			} else {
				self.verifyPhone = false;
			}
		}

		self.submit = function(e){
			e.preventDefault();

			self.verifyPhone = $('#register-phone').val().match(/^1[0-9]{10}$/) ? true : false;
			self.verifyPWD = $('#rg-pwd').val() ? true : false;
			self.verifyRePWD = $('#rg-pwd').val() == $('#rg-repwd').val() ? true : false;

			if (self.verifyPhone && self.verifyPWD && self.verifyRePWD) {
				store.password.commit({
					phoneMobile: $('#register-phone').val(),
					code: $('#checkcode').val(),
					password: $('#rg-pwd').val()
				}, function(res){
					if (res.code !== 1) {

						return;
					} else {

						utils.androidBridge(api.goLogin)

					}
				})
			}
		};
		self.goback = function() {
			utils.androidBridge(api.goLogin)
		}
});

riot.tag2('license-key', '<div id="login-wrap"> <a class="back" onclick="{goback}">返回</a> <div class="setting"></div> <form class="register license-code"> <h4>填写激活码</h4> <input type="text" id="license-code" name="phone" maxlength="8" placeholder="激活码"> <button onclick="{submit}">下一步</button> </form> </div>', '', '', function(opts) {
  var self = this;
  self.licenseCode = true;
  self.submit = function (e) {
    e.preventDefault();
    self.licenseCode = $('#license-code').val() ? true : false;
    if(!self.licenseCode){
      utils.toast("请填写正确的激活码");
      return;
    }else{
      var license = $('#license-code').val();
      httpGet({
        url: api.cdkey,
        params: {
					cdkey: license
				},
        success: function(res) {
            location.hash = '#/register?cdkey='+license;
        }
      });
    }
  }
  self.goback = function() {
    utils.androidBridge(api.goLogin)
  }
});

riot.tag2('register-final', '<div id="login-wrap"> <a class="back" href="#/register">上一步</a> <div class="setting" onclick="{openSetting}"></div> <form class="register" onsubmit="{submit}"> <h4>填写店铺信息</h4> <input type="text" name="storeName" class="{error: !verifyStoreName}" placeholder="店铺名称"> <input type="text" name="shopAddress" class="shopAddress {error: !verifyAddress}" onfocus="{openSelect}" value="{addressValue}" placeholder="店铺地址"> <input type="text" name="streetName" class="{error: !verifyStree}" placeholder="街道"> <input type="text" name="tel" class="{error: !verifytel}" placeholder="店铺电话" maxlength="20"> <label class="checkbox" onclick="{toggleLogin}"> <p id="autologin" class="on">打开收银机默认登陆此店铺</p> </label> <button>提交</button> </form> </div> <modal modal-width="" modal-height="" id="selectAddr"> <address-select></address-select> </modal>', '', '', function(opts) {
		var self = this;
		var q = riot.route.query();
		var cdkey = q.cdkey;

		var verifyList = ['verifyStoreName', 'verifyAddress', 'verifyStree', 'verifytel'];
		for (var i = 0; i < 4; i++ ) {
			self[verifyList[i]] = true;
		}

		self.openSetting = function() {
			utils.androidBridge(api.openSetting)

		}

		flux.bind.call(self,{
			name: 'register',
			store: store.register,
			success: function () {
				self.update();
			}
		});

		function verify(){
			var storeName = $('input[name=storeName]').val();
			var addressName = $('input[name=shopAddress]').val();
			var streetName = $('input[name=streetName]').val();
			var tel = $('input[name=tel]').val();

			if (!storeName) {
				self.verifyStoreName = false;
				utils.toast("请填写店铺名称");
				return false;
			} else {
				self.verifyStoreName = true;
				store.register.set('storeName', storeName);
			}

			if (!addressName) {
				self.verifyAddress = false;
				utils.toast("请填写店铺地址");
				return false;
			} else {
				self.verifyAddress = true;
			}

			if (!streetName) {
				self.verifyStree = false;
				utils.toast("请填写街道信息");
				return false;
			} else {
				self.verifyStree = true;
				store.register.set('streetName', streetName);
			}

			if (!tel.match(/[0-9]{6,}/)) {
				self.verifytel = false;
				utils.toast("请填写正确的店铺电话");
				return false;
			} else {
				self.verifytel = true;
				store.register.set('tel', tel);
			}

			return self.verifyStoreName && self.verifyAddress && self.verifyStree && self.verifytel;
		}

		function autoLogin(){
			store.account.login({
				username: self.register.phoneMobile,
				password: self.register.password,
				imeCode: '784372987'
			},function(data){

			});
		}

		self.submit = function(e){
			e.preventDefault();
			if (verify()) {
				utils.loadShow();
				if($('#autologin').hasClass('on')  && self.imeCode){
					self.register.bindDevice = true;
				}else{
					self.register.bindDevice = false;
				}
				if(self.imeCode){
					self.register.imeCode = self.imeCode;
				}
				self.register.cdkey = q.cdkey;
				httpPost({
					url: api.register,
					params: self.register,
					success: function(res){
						if ( $('#autologin').hasClass('on') ){
							autoLogin();
						} else {

							utils.androidBridge(api.goLogin)

						}
					},
					complete: function(res) {
							utils.loadHide();
					}
				});
			};
		};

		self.toggleLogin = function(e){
			$(e.target).toggleClass('on');
		}

		self.openSelect = function(){
			$('#selectAddr')[0].open();
		}

		self.on('mount', function(){
			utils.androidBridge(api.getImei,{},function(res){
				if (res.imei) {
								self.imeCode = res.imei;
								self.update();
							}
			})

			$(self.root).find('input').bind('input', function(e){
				$(this).removeClass('error');
			});
		})

});

riot.tag2('register', '<div id="login-wrap"> <a class="back" onclick="{goback}">返回</a> <div class="setting" onclick="{openSetting}"></div> <form class="register" onsubmit="{submit}"> <h4>填写店长信息</h4> <input class="{error: !verifyPhone}" value="{register.phoneMobile}" type="text" name="phone" id="register-phone" maxlength="11" placeholder="手机号"> <label> <input class="{error: !verifyCode}" value="{register.code}" type="text" name="phone" id="checkcode" placeholder="验证码"> <a if="{firstSend}" href="" onclick="{getCode}">获取</a> <a if="{!firstSend}" onclick="{getCode}"> 再次获取 <span if="{isCounting}" id="countDown">{countNum}</span> <b if="{isCounting}"> s </b> </a> </label> <input type="password" value="{register.password}" name="password" class="{error: !verifyPWD}" id="rg-pwd" placeholder="店长密码(6-12位)" maxlength="12"> <input type="password" value="{register.password}" class="{error: !verifyRePWD}" placeholder="再次店长密码" id="rg-repwd" maxlength="12"> <input type="text" name="owner" value="{register.personName}" class="{error: !verifyOwner}" id="owner-name" placeholder="店长姓名"> <button onclick="{submit}">下一步</button> </form> </div>', '', '', function(opts) {
		var self = this;
		var q = riot.route.query();

		var cdkey = q.cdkey;
		self.countNum = 60;
		self.firstSend = true;
		self.verifyCode = self.verifyPhone = self.verifyOwner = self.verifyPWD = self.verifyRePWD = true;

		self.openSetting = function() {
			utils.androidBridge(api.openSetting)

		}

		function countDown(){
			var count = $('#countDown');
			if (count[0]){
				count.text(self.countNum--);

				if (self.countNum > -1){
					setTimeout(countDown, 1000);
				} else {
					self.isCounting = false;
					self.update();
				}
			}
		}

		flux.bind.call(self, {
			name: 'register',
			store: store.register,
			success: function () {
				self.update();
			}
		});

		self.getCode = function(e){
			e.preventDefault();

			var target = e.target;
			var phone = $('#register-phone').val();

			if (phone.match(/^1[0-9]{10}$/)){
				self.verifyPhone = true;

				if (self.isCounting) {
					return ;
				}

				self.firstSend = false;
				store.register.sendCode({
					phoneMobile: phone
				}, function(){
					self.isCounting = true;
					self.countNum = 60;
					self.update();
					countDown();
				});
			} else {
				self.verifyPhone = false;
				utils.toast("请填写正确的手机号");
			}
		}

		self.submit = function(e){
			e.preventDefault();
			var registerStore = store.register;

			self.verifyPhone = $('#register-phone').val().match(/^1[0-9]{10}$/) ? true : false;
			self.verifyCode = $('#checkcode').val() ? true : false;
			self.verifyOwner = $('#owner-name').val() ? true : false;
			self.verifyPWD = /^[0-9a-zA-Z]{6,12}$/.test($('#rg-pwd').val());
			self.verifyRePWD = $('#rg-pwd').val() == $('#rg-repwd').val() ? true : false;
			if(!self.verifyPhone){
				utils.toast("请填写正确的手机号");
				return;
			}
			if(!self.verifyCode){
				utils.toast("请填写正确的验证码");
					return;
			}
			if(!self.verifyPWD){
				utils.toast("请填写正确的密码");
				return;
			}
			if(!self.verifyRePWD){
				utils.toast("密码不一致");
				return;
			}
			if(!self.verifyOwner){
				utils.toast("请填写店长姓名");
				return;
			}
			if (self.verifyPhone && self.verifyOwner && self.verifyPWD && self.verifyRePWD) {
				store.register.next({
					phoneMobile: $('#register-phone').val(),

					code: $('#checkcode').val()
				}, function(res){
					if (res.code !== 1) {
						self.verifyCode = false;
						self.update();

						return;
					} else {
						registerStore.set('phoneMobile', $('#register-phone').val());
						registerStore.set('code', $('#checkcode').val());
						registerStore.set('personName', $('#owner-name').val());
						registerStore.set('password', $('#rg-pwd').val());

						location.hash = '#/register-final?cdkey='+cdkey;

					}
				})
			}
		};
		self.goback = function() {
			utils.androidBridge(api.goLogin)
		}
});

riot.tag2('change-price', '<form onclick="{detail0}" id="change-price" name="update-product"> <label> 修改商品价格： <input value="{}" type="text" name="barcode" class="long-input" readonly="readonly"> </label> </form>', '', '', function(opts) {
    var self = this;
    var modal = self.parent;
		var cashDetail = self.parent.parent;

    self.detail0 = function () {
      console.log(cashDetail.detail);
    }
    modal.onSubmit = function () {
			var params = $('#changeCashPrice').serializeObject();//serializeObject()方法在tags-dep.js文件里定义的，取form表单里有name属性的数据.
			store.goods.update(params, function () {
				utils.toast('修改成功');
				store.loadTopGoodsList = true;
				modal.close();
				self.data = {
					purchasePrice: " "
				};
				self.update();
			});
		}
});

riot.tag2('bill-coupon-info', '<div class="bill-coupon-info"> <div class="title">使用优惠券 </div> <div class="info"> <div class="price"> <span>{coupon.price}</span> </div> <div class="text"> <h3>{coupon.title}</h3> <h4>{coupon.couponCode}</h4> <div> <span class="left">{rules}</span> <span class="right">有效日期至:{coupon.effectTime}</span> <span class="clearfix"></span> </div> </div> </div> </div>', '', '', function(opts) {

        var self = this;
        var modal = self.parent;
        var parent = self.parent.parent;

        modal.onOpen = function (params) {
            self.params = params;
            self.coupon = self.params.item.couponInfo;
            self.update();
        }

        modal.onClose = function () {
          self.coupon = {};
          self.update();
        }

        modal.onSubmit = function () {
            self.params.item.couponPrice = self.coupon.price;
            parent.couponCode = self.coupon.couponCode;
            modal.close();
            parent.couponAdd(self.params);
            self.update();
        }
});

riot.tag2('bill-coupon-num', '<div class="vip-login"> <div class="phone"> <input type="tel" value="" placeholder="优惠券码" id="vipCouponNum"> </div> </div>', '', '', function(opts) {

        var self = this;
        var modal = self.parent;
        var parent = self.parent.parent;

        modal.onOpen = function (params) {
            self.params = params;

            self.update();
        }

        modal.onClose = function () {
            $("#vipCouponNum").val("");

        }

        modal.onSubmit = function () {
            var vipCouponNum = $("#vipCouponNum").val();
            var params = {
              couponCode: vipCouponNum,
              baskets:parent.baskets
            }
            store.couponVerify.get(params,function(data){
              self.params.item = {};
              self.params.item.couponInfo = data;
              modal.close();

              $("#billCouponInfo")[0].open(self.params);
              self.update();
            });
        }
});

riot.tag2('bill-coupon', '<div class="bill-coupon"> <div class="img" onclick="{scan}"></div> <div class="info">请用扫码枪扫描手机上的优惠券码</div> <div class="input" onclick="{couponInput}">扫不到?手动输入</div> </div>', '', '', function(opts) {

    var self = this;
    var modal = self.parent;
    var parent = self.parent.parent;

    self.scan = function(){

    }

    self.couponInput = function(){
      modal.close();
      $("#billCouponNum")[0].open(self.params);

    }

    self.barcodeCoupon = function(){

      var vipCouponNum = scanNumber;
      var params = {
          couponCode: vipCouponNum,
          baskets:parent.baskets
      }
      store.couponVerify.get(params,function(data){
        self.params.item = {};
        self.params.item.couponInfo = data;
        modal.close();
        $("#billCouponInfo")[0].open(self.params);
        self.update();
      });
    }

    modal.onOpen = function (params) {
      self.params  = params;
      self.update();
      window.addEventListener('inputNumber', self.barcodeCoupon, false);
    }

    modal.onClose = function () {
      window.removeEventListener('inputNumber', self.barcodeCoupon);

    }

    modal.onSubmit = function () {
    }

});

riot.tag2('vip-login', '<div class="vip-login"> <div class="phone"> <input type="tel" value="" placeholder="会员手机号" id="vipPhone"> </div> </div>', '', '', function(opts) {

        var self = this;
        var modal = self.parent;
        var parent = self.parent.parent;

        modal.onOpen = function (params) {
            self.update();
        }

        modal.onClose = function () {
            $("#vipPhone").val("");
        }

        modal.onSubmit = function () {

            var _vipphone = $("#vipPhone").val();
            if (/^1[0-9]{10}$/.test(_vipphone)) {
                var params = {
                    phoneMobile: _vipphone
                }
                store.memberVerify.get(params, function (data) {
                    $("#vipPhone").val("");
                    utils.toast("登录成功");
                    modal.close();
                    parent.vipLogin = true;
                    parent.vipphone = _vipphone;
                    self.update();
                    parent.update();
                });
            } else {
                utils.toast("请填写正确的手机号");
            }
        }
});

riot.tag2('confirm-exit', '<div>退出账户</div> <p> 确定退出吗？ </p> <span class="printExit selected" onclick="{confirmPrint}"> 打印总计小票 </span>', '', '', function(opts) {
    var self = this;
    var modal = self.parent;
		var exit = self.parent.parent;
    // console.log(exit);
    if (window.localStorage && localStorage.account) {
      var storeInfo = JSON.parse(localStorage.account)
      self.storeId = storeInfo.storeId;
    }
    // var localData = JSON.parse(localStorage.getItem('account'));
    // console.log( localData.storeId );
    //选择是否打印
    self.confirmPrint = function () {
      if($('.printExit').is('.selected')){
        $('.printExit').removeClass('selected');
      }else{
        $('.printExit').addClass('selected');
      }
    }
    //账号退出时，如果选择打印，则打印此次登录后所有交易信息
    self.print = function(e) {
      //android打印此次登陆中的所有交易
      httpGet({
        url: "Iprinter.printLogout",
        params: { storeId: self.storeId },
        success: function(res) {
              }
          });
    }
    // 点击确定，退出账户
    modal.onSubmit = function () {
      self.root.style.display = 'none';
      $(self.root).parents('side-bar').find('#confirm-exit').hide();
      store.account.logout();
      if($('.printExit').is('.selected')){
        //调用后台数据，将流水记录获取到传给android
        self.print();
      }
      location.hash = "#login";
      // utils.androidBridge(api.goLogin)

		}
    modal.onOpen = function () {
      $('.printExit').addClass('selected');
    }

});

riot.tag2('order-invalid', '<div class="coverLayer"></div> <div class="popwin refuse"> <div class="refuse-t"> 请选择设为无效原因 </div> <div class="refuse-reason"> <ul> <li onclick="{selectReason}" class="active">收货人退货</li> <li onclick="{selectReason}">订单信息有误</li> <li onclick="{selectReason}" other="other">其他</li> <div class="input-reason"><input type="text" id="inputReason"></div> </ul> <div class="button"> <div class="fl-left reason"><a class="cancel" onclick="{closeWin}">取消</a></div> <div class="fl-right reason"><a class="sure" onclick="{determine}">确定</a></div> </div> </div> </div>', '', '', function(opts) {
    	var self = this;
    	this.closeWin = function(){
    		$("order-invalid").remove();
    	}.bind(this)
    	this.determine = function(){
    		var param = {};
    		param.reason = $(".refuse-reason ul li.active").text();
    		if($(".refuse-reason ul li.active").attr("other") == "other"){
    			param.reason = $("#inputReason").val();
    		}
    		param.orderId = $("#orderId").val();
    		param.userId = 6;
    		store.orderInvalid.get(param,function(){
    			window.dispatchEvent(new Event('orderNumChange'));

    			$("order-invalid").remove();
					httpGet({

							url: api.synTask,
							params: {name: "StoreOrder"},
							success: function(res) {

							},
					});
    		});

    	}.bind(this)
    	this.selectReason = function(e){
    		if(!$(e.target).is(".active")){
    			$(".refuse-reason ul li").removeClass("active");
    			$(e.target).addClass("active");
    		}
    	}.bind(this)
});

riot.tag2('order-refuse', '<div class="coverLayer"></div> <div class="popwin refuse"> <div class="refuse-t"> 请选择拒绝订单原因 </div> <div class="refuse-reason"> <ul> <li onclick="{selectReason}" class="active">没货</li> <li onclick="{selectReason}">地址太远，不送</li> <li onclick="{selectReason}">人员不够，送不了</li> <li onclick="{selectReason}">没时间，送不了</li> <li onclick="{selectReason}">收货人不要了</li> <li onclick="{selectReason}" other="other">其他</li> <div class="input-reason"><input type="text" id="inputReason"></div> </ul> <div class="button"> <div class="fl-left reason"><a class="cancel" onclick="{closeWin}">取消</a></div> <div class="fl-right reason"><a class="sure" onclick="{determine}">确定</a></div> </div> </div> </div>', '', '', function(opts) {
    	var self = this;
    	this.closeWin = function(){
    		$("order-refuse").remove();
    	}.bind(this)
    	this.determine = function(){
    		var param = {};
    		param.reason = $(".refuse-reason ul li.active").text();
    		if($(".active").attr("other") == "other"){
    			param.reason = $("#inputReason").val();
    		}
    		param.orderId = $("#orderId").val();
    		store.orderRefuse.get(param,function(){
    			window.dispatchEvent(new Event('orderNumChange'));

    			$("order-refuse").remove();
					utils.androidBridge(api.updateNum)
    		});
    	}.bind(this)
    	this.selectReason = function(e){
    		if(!$(e.target).is(".active")){
    			$(".refuse-reason ul li").removeClass("active");
    			$(e.target).addClass("active");
    		}
    	}.bind(this)
});

riot.tag2('attain-sart', '<div class="attain-sart" if="{attainReceive}"> <div class="cover"> </div> <div class="sart"> <div class="title">恭喜您</div> <div class="info">已达成{message.data.title}成就</div> <div class="button"> <a onclick="{goAttain}">去成就界面查看</a> </div> <div class="cancel"> <span onclick="{cancel}">稍后查看</span> </div> </div> </div>', '', '', function(opts) {
		var self = this;
		self.attainReceive = false;

		self.cancel = function(){
			self.attainReceive = false;
			self.message = {};
			self.update();
		}

		self.goAttain = function(){

			window.location.replace("#/shop/attain");
			window.dispatchEvent(new Event('receiveMessageReload'));
			self.attainReceive = false;
			self.message = {};
			self.update();
		}

		function getReceiveMessage(){
			self.message = JSON.parse(Ipush.message);
			if(self.message.type==1){
				self.attainReceive= true;
				self.update();
			}
		}

		self.on('mount', function() {
			window.addEventListener('receiveMessage', getReceiveMessage, false);
		});

		self.on('unmount', function() {
			window.removeEventListener('receiveMessage', getReceiveMessage);
		});

});


riot.tag2('attain', '<div class="attain"> <div class="attain-list"> <ul class="attain-list-ul"> <li class="list" each="{attain}" if="{attain.length > 0}"> <div class="attain_top"> <div class="left"> <h3>{name}</h3> <div class="img"> <img riot-src="{iconUrl}" alt=""> </div> <h5> {currentLevel}级/共{totalLevel}级</h5> </div> <div class="right"> <ul> <li each="{currentTask.behaviors}"> <div class="title"> {title} </div> <div class="num"> {currentNum}/{totalNum} </div> <div class="line"> <div class="co" riot-style="width:{currentNum/totalNum*100}%"></div> </div> </li> </ul> </div> </div> <div class="attain_bottom"> <div class="icon_bottom atta-coupon" if="{reward.type == 0 || reward.type == 3}"></div> <div class="icon_bottom atta-app" if="{reward.type == 1}"></div> <div class="icon_bottom atta-ad" if="{reward.type == 2}"></div> <div class="icon_bottom atta-global" if="{reward.type == 4}"></div> <h5 if="{reward.type == 0}">{reward.totalNum}张总价值</h5> <h5 if="{reward.type == 0}">{reward.totalPrice}元优惠券</h5> <h5 if="{reward.type == 1}" class="atta-app">{reward.name}</h5> <h5 if="{reward.type == 2}" class="atta-ad">{reward.name}</h5> <h5 if="{reward.type == 3}" class="atta-one-cou">{reward.name}</h5> <h5 if="{reward.type == 4}" class="atta-global">{reward.name}</h5> <a class="cancel" if="{status == 0}">领取</a> <a onclick="{getReceive}" if="{status == 1}">领取</a> <a class="cancel" if="{status == 2}">已领取</a> </div> </li> <div class="clear"> </div> <div class="none-list" if="{attain.length <= 0}"> <div class="none-list-text"> 暂无成就 </div> </div> </ul> </div> </div>', '', '', function(opts) {
        var self = this;
        self.next = 0;

        self.getReceive = function (e) {
            var param = {
                reachRecordId: e.item.recordId
            }
            store.attain.getReward(param, function (data) {
                utils.toast("领取成功");
                self.next = 0;
                self.init();
            });
        }

        self.init = function () {
            self.next = 0;
            var params = {
                next: self.next
            }
            store.attain.get(params, function (data) {
                self.next = data.next;
                self.attain = data.list;
                self.update();
            });
        }

        self.scrollLock = false;
        self.listenDown = function () {
            setTimeout(function () {
                self.listWrap = $('.attain-list-ul')[0];
                self.scrollDown = function (event) {
                    var clientHeight = self.listWrap.clientHeight;
                    var scrollTop = self.listWrap.scrollTop;
                    if ((clientHeight + scrollTop) > self.listWrap.scrollHeight - 60) {
                        if (self.next && !self.scrollLock) {
                            self.scrollLock = true;
                            store.attain.get({
                                next: self.next
                            }, function (data) {
                                self.next = data.next;
                                self.attain = self.attain.concat(data.list);
                                self.scrollLock = false;
                                self.update();
                            });
                        }
                    }
                };
                self.listWrap.addEventListener('scroll', self.scrollDown, false);
            }, 5000);
        }

        function getReceiveMessageReload(){
            self.init();
        }

        self.on('mount', function () {
            self.init();
            self.listenDown();
            window.addEventListener('receiveMessageReload', getReceiveMessageReload, false);
        });

        self.on('unmount', function () {
          window.removeEventListener('receiveMessageReload', getReceiveMessageReload);
            if (self.listWrap && self.scrollDown) {
                self.listWrap.removeEventListener('scroll', self.scrollDown);
            }
        })
});

riot.tag2('coupon', '<div class="coupon"> <div class="coupon-list"> <ul> <li class="cou-our" onclick="{addCoupon}"> <div class="add "></div> </li> <li each="{coupon}" class="{bacolor}" if="{coupon.length>0}"> <h4 onclick="{couponInfo}">{title} <div class="icon {public:source!=1}{our:source==1}"></div> <div class="info"></div> </h4> <h5>数量：{totalNumber}张</h5> <h5>面额：{denomination}</h5> <div class="stop-coupon" if="{bacolor==⁗cou-our⁗}" onclick="{couponStop}">停止发放</div> <div class="status {coupon-s-over:status==2}{coupon-s-invalid:status==3}{coupon-s-invalid:status==4}"></div> </li> <div class="clearfix"></div> </ul> </div> </div> <pop id="couponInfo" title="优惠券详情" onebutton> <coupon-info></coupon-info> </pop> <pop id="couponAdd" title="添加优惠券" twobutton suretext="发放" help="true"> <coupon-add></coupon-add> </pop> <pop width="650px" id="couponHelp" title="帮助" onebutton popzbig="true"> <coupon-help></coupon-help> </pop> <pop width="400px" id="couponPrice" title="发放面额、数量及总额" twobutton popzbig="true" suretext="下一步"> <coupon-price></coupon-price> </pop> <pop width="400px" id="couponPriceNext" title="发放面额、数量及总额" twobutton popzbigtwo="true" suretext="确定" cancletext="上一步"> <coupon-price-next></coupon-price-next> </pop> <pop width="400px" id="couponDate" title="有效期" twobutton popzbig="true"> <coupon-data></coupon-data> </pop> <pop id="couponCondition" title="获得条件" twobutton popzbig="true"> <coupon-con></coupon-con> </pop> <pop width="400px" id="couponWay" title="使用方式" twobutton popzbig="true"> <coupon-way></coupon-way> </pop> <pop width="400px" id="couponUse" title="使用条件" twobutton popzbig="true"> <coupon-use></coupon-use> </pop> <pop id="couponStop" title="提示" twobutton> <coupon-stop></coupon-stop> </pop>', '', '', function(opts) {
        var self = this;
        self.next = 0;

        self.addCoupon = function () {
            $("#couponAdd")[0].open();
        }

        self.couponInfo = function (e) {
            $("#couponInfo")[0].open(e.item);
        }

        self.couponHelp = function () {
            $("#couponHelp")[0].open();
        }

        self.couponStop = function (e) {
            $("#couponStop")[0].open(e.item.storeCouponId);
        }

        self.stopSure = function (id) {
            store.coupon.stop({
                couponId: id
            }, function (data) {
                self.next = 0;
                self.init();
            });
        }

        self.init = function () {
            var params = {
                next: self.next
            }
            store.coupon.get(params, function (data) {

                self.next = data.next;
                self.coupon = data.list;
                self.update();
            });
        }

        self.scrollLock = false;
        self.listenDown = function () {
            setTimeout(function () {
                self.listWrap = $('.coupon-list')[0];
                self.scrollDown = function (event) {
                    var clientHeight = self.listWrap.clientHeight;
                    var scrollTop = self.listWrap.scrollTop;
                    if ((clientHeight + scrollTop) > self.listWrap.scrollHeight - 60) {
                        if (self.next && !self.scrollLock) {
                            self.scrollLock = true;
                            store.coupon.get({
                                next: self.next
                            }, function (data) {
                                self.next = data.next;
                                self.coupon = self.coupon.concat(data.list);
                                self.scrollLock = false;
                                self.update();
                            });
                        }
                    }
                };
                self.listWrap.addEventListener('scroll', self.scrollDown, false);
            }, 50);
        }

        self.on('mount', function () {
            self.newCoupon = {};
            self.init();
            self.listenDown();
        });

        self.on('unmount', function () {
            if (self.listWrap && self.scrollDown) {
                self.listWrap.removeEventListener('scroll', self.scrollDown);
            }
        })
});

riot.tag2('business-assistant-c', '<div class="business-assistant"> <div class="b-s-top"> <div class="rank"> <span>本日{weekRank.countryName}第{weekRank.rank}名<span> <ul> <li>本门店总销售额:{weekRank.totalAmount}</li> <li>{weekRank.countryName}最高销售额:{weekRank.highestAmount}</li> </ul> </div> <div class="chose-date"> <div class="get-date" onclick="{selectDate}" id="selectdateShow"> {showDate} </div> <input id="getstartDate" type="hidden" name="name" value="{startDate}"> <input id="getendDate" type="hidden" name="name" value="{endDate}"> <div if="{selectDateStatus}" class="select-date-select"> <select-date id="selectDate"></select-date> </div> </div> <div class="sale-data"> <span id="totalAmount">销售额:{allSale.totalAmount}</span> <span>总单数:{allSale.totalBills}</span> <span>销量:{allSale.totalSales}</span> <span>毛利润:{allSale.totalProfit}</span> </div> </div> <div class="b-s-con"> <div class="l-report brief-report"> <p><i></i><b>销售简报</b><i></i></p> <div class="channel-sale-rank"> <div class="report sale-info"> <div class="reportInfo"> 分渠道销售情况 </div> <div class="disc"> <div class="wraps wrap-r" id="circleOne"> <div class="circle circle-r"> <div class="percent left"></div> <div class="percent right wth0"></div> </div> <div class="num"> <b if="{!perSale}">销售额对比</b> <b if="{perSale}">销量对比</b> </div> </div> </ul> <ul class="sale-per" if="{!perSale}"> <li>网店销售额{channelInfo.onlineAmountScale || 0}%</li> <li>门店销售额{channelInfo.offlineAmountScale || 0}%</li> </ul> <ul class="sale-per" if="{perSale}"> <li>网店销量{channelInfo.onlineSalesScale || 0}%</li> <li>门店销量{channelInfo.offlineSalesScale || 0}%</li> </ul> <p> <i class="nobor">销售额</i> <i class="shift nobor" onclick="{shift}"><b></b></i> <i class="nobor">销售量</i> </p> </div> <div class="line"> <div class="line1"> <p class="grad-l"><span class="line-item">门店</span><b>{channelInfo.offlineCustomerPrice}</b></p> </div> <div class="line2"> <p class="grad-r"><span class="line-item">网店</span><b>{channelInfo.onlineCustomerPrice}</b></p> </div> <i>客单价</i> </div> </div> <div class="report"> <div class="reportInfo"> 各分类销售额占比 </div> <div id="circleSale"></div> </div> </div> <div class="goods-sale-rank report"> <div class="reportInfo"> 商品销售排名 </div> <div class="accordTosale"> <div class="good-class"> <select id="categorySel" class="" name="" onchange="{categorySel}"> <option each="{categoryRank}" value="{cateId}">{cateName}</option> </select> </div> <div class="good-according"> <div class="{active: active}" onclick="{accordSale}" each="{according}"> {accord} </div> </div> </div> <li class="li-bor-top"> <span style="width: 8%">项</span> <span style="width: 23%">商品</span> <span style="width: 13%">分类</span> <span style="width: 10%">销量</span> <span style="width: 15%">销售额</span> <span style="width: 15%">周转天数</span> <span style="width: 16%">毛利率</span> </li> <ul class="top-goods-list"> <li each="{item in next_gooda}"> <span style="width: 8%" if="{next_gooda.indexOf(item)==0 || next_gooda.indexOf(item)==1 || next_gooda.indexOf(item)==2}"></span> <span style="width: 8%" if="{next_gooda.indexOf(item) !=0 && next_gooda.indexOf(item) !=1 && next_gooda.indexOf(item) !=2}">{next_gooda.indexOf(item) + 1}</span> <span style="width: 23%">{item.goodsName}</span> <span style="width: 13%">{item.cateName}</span> <span style="width: 10%">{item.sales}</span> <span style="width: 15%" class="saleNum">{item.salesAmount}</span> <span style="width: 15%" if="{item.turnoverDays>= 0 &&  item.turnoverDays <= 999}">999+</span> <span style="width: 15%" if="{item.turnoverDays>= 0}">{item.turnoverDays}</span> <span style="width: 15%" if="{item.turnoverDays < 0}">---</span> <span style="width: 16%">{item.grossMargin}%</span> <div class="" id="{item.activeStatus}" if="item.activeStatus"> </div> </li> <input id="getNext" type="hidden" name="name" value="{next}"> </ul> </div> </div> <div class="r-report brief-report"> <p><i></i><b>顾客简报</b><i></i></p> <div class="customer-sale-rank report week-sale"> <div class="reportInfo"> 分渠道顾客情况 </div> <div class="l-week-sale"> <ul> <li class="bor1"> <dl class=""> <dt></dt> <dd>门店</dd> </dl> <ul> <li>本周消费顾客</li> <li>{weekMembersInfo.offlineBuyerNum}</li> <li class="addbg" if="{weekMembersInfo.offlineBuyerAddNum> 0}">上周 +{weekMembersInfo.offlineBuyerAddNum}</li> <li class="decrebg" if="{weekMembersInfo.offlineBuyerAddNum < 0}">上周 {weekMembersInfo.offlineBuyerAddNum}</li> <li if="{weekMembersInfo.offlineBuyerAddNum==0}">上周 ={weekMembersInfo.offlineBuyerAddNum}</li> </ul> </li> <li> <dl class=""> <dt class="store-on-pic"></dt> <dd>网店</dd> </dl> <ul> <li>本周消费会员</li> <li>{weekMembersInfo.onlineBuyerNum}</li> <li class="addbg" if="{weekMembersInfo.onlineBuyerAddNum> 0}">上周 +{weekMembersInfo.onlineBuyerAddNum}</li> <li class="decrebg" if="{weekMembersInfo.onlineBuyerAddNum < 0}">上周 {weekMembersInfo.onlineBuyerAddNum}</li> <li if="{weekMembersInfo.onlineBuyerAddNum==0}">上周 ={weekMembersInfo.onlineBuyerAddNum}</li> </ul> </li> </ul> </div> <div class="c-week-sale"> <ul> <li>本周新增会员</li> <li>{weekMembersInfo.newMemberNum}</li> <li class="addbgNew" if="{weekMembersInfo.newMemberAddNum> 0}">上周 +{weekMembersInfo.newMemberAddNum}<span></span></li> <li class="decrebgNew" if="{weekMembersInfo.newMemberAddNum < 0}">上周 {weekMembersInfo.newMemberAddNum}<span></span></li> <li if="{weekMembersInfo.newMemberAddNum==0}">上周 ={weekMembersInfo.newMemberAddNum}</li> </ul> </div> <div class="r-week-sale" style="position:relative;"> <div class="wraps" id="circleTwo"> <div class="circle"> <div class="percent left"></div> <div class="percent right wth0"></div> </div> <div class="num"> <p> 流失会员{weekMembersInfo.loseMemberNum} </p> <p> (30天未购物) </p> </div> <div class="totalMem"> 总会员:{weekMembersInfo.totalMemberNum} </div> </div> </div> </div> <p><i></i><b>库存简报</b><i></i></p> <div class="customer-sale-rank warning-stock"> <div class="report"> <div class="reportInfo"> 库存预警 </div> </div> <h1></h1> <h2></h2> <a class="left-arrow" onclick="{leftBest}"></a> <div class="stock-con"> <div class="stock-scroll stock-scroll-best"> <ul> <li each="{bestStock}"> <div class="stock-pic"> <img riot-src="{imageUrl || \'imgs/default-product.png\'}" alt=""></div> <div class="stock-num stock-rotate" if="{stockNum <999}">库存{stockNum}</div> <div class="stock-num stock-rotate" if="{stockNum>= 999}">库存999+</div> <div class="stock-name">{goodsName}</div> </li> </ul> </div> </div> <a class="right-arrow" onclick="{rightBest}"></a> </div> <div class="customer-sale-rank warning-stock"> <div class="report"> <div class="reportInfo"> 滞销商品 </div> </div> <h1 class="h1"></h1> <h2 class="h2"></h2> <a class="left-arrow" onclick="{leftDull}"></a> <div class="stock-con"> <div class="stock-scroll stock-scroll-dull"> <ul> <li each="{dullStock}"> <div class="stock-pic"> <img riot-src="{imageUrl || \'imgs/default-product.png\'}" alt=""></div> <div class="stock-num stock-remain stock-rotate" if="{stockNum <999}">库存{stockNum}</div> <div class="stock-num stock-remain stock-rotate" if="{stockNum>= 999}">库存999+</div> <div class="stock-name">{goodsName}</div> </li> </ul> </div> </div> <a class="right-arrow" onclick="{rightDull}"></a> </div> </div> </div> </div>', '', '', function(opts) {
        var self = this;
        self.nextNum = 0;
        self.next = 0;
        self.nextBest = 0;
        self.nextDull = 0;
        self.nowAmount = 0;
        self.selectDateStatus = false; //
        self.selectType = 1; //

        self.selectDate = function() {
            self.selectDateStatus = !self.selectDateStatus
            self.update()
            if (self.selectDateStatus) {
                var date = {
                    selectType: self.selectType,
                    startDate: self.startDate,
                    endDate: self.endDate
                }
                $("#selectDate")[0].open(date);
            }
            var e = window.event;
            e.preventDefault();
            if (e && e.stopPropagation) {
                e.stopPropagation();
            }
            self.update()

            function closeSelectDate() {
                self.selectDateStatus = false;
                self.update()
                $(window).unbind('click', closeSelectDate);
            }
            setTimeout(function() {
                $(window).bind('click', closeSelectDate);
            }, 100);
        }

        self.type = 0;
        var storeInfo = {}
        if (window.localStorage && localStorage.account) {
            storeInfo = JSON.parse(localStorage.account);
        }
        var myDate = new Date();
        var todayDate = '2012-12-12';
        self.startDate = todayDate;
        self.endDate = todayDate;
        var params = {
            storeId: storeInfo.storeId,
            channel: 0, //channel	渠道 0.ipos 1.bpos
            startDate: self.startDate,
            endDate: self.endDate,
        }
        self.next_gooda = [];
        self.list = [{
            item: '按日选',
            active: true
        }, {
            item: '按周选',
            active: false
        }, {
            item: '按月选',
            active: false
        }, {
            item: '按年选',
            active: false
        }, ]
        self.cate = [{
            item: '全选',
            active: true
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }]
        self.according = [{
            accord: '按销售额',
            active: true
        }, {
            accord: '按销量',
            active: false
        }, {
            accord: '按周转',
            active: false
        }, {
            accord: '按毛利率',
            active: false
        }]
        self.goods = [{
                item: '1',
                active: true
            }, {
                item: '2',
                active: true
            }, {
                item: '3',
                active: true
            }, {
                item: '4',
                active: true
            }, {
                item: '5',
                active: true
            }, {
                item: '6',
                active: true
            }, {
                item: '7',
                active: true
            }, {
                item: '8',
                active: true
            }, {
                item: '9',
                active: true
            }, {
                item: '10',
                active: true
            }, {
                item: '11',
                active: true
            }, {
                item: '12',
                active: true
            }, {
                item: '13',
                active: true
            }, {
                item: '14',
                active: true
            }, {
                item: '15',
                active: true
            }, {
                item: '16',
                active: false
            }, {
                item: '17',
                active: false
            }, {
                item: '18',
                active: false
            }, {
                item: '19',
                active: false
            }, {
                item: '20',
                active: false
            }, {
                item: '21',
                active: false
            }, {
                item: '22',
                active: false
            }, {
                item: '23',
                active: false
            }, {
                item: '24',
                active: false
            }, {
                item: '25',
                active: false
            }, {
                item: '26',
                active: false
            }, {
                item: '27',
                active: false
            }, {
                item: '28',
                active: false
            }]
            //选择日期格式 accorDate
        self.accorDateChange = function() {
            $('.y-m').css({
                'display': 'block'
            });
        }

        self.confirmDate = function() {
            laydate({
                elem: '#J-xl-2',
                format: 'YYYY-MM-DD hh:mm:ss', // 分隔符可以任意定义，该例子表示只显示年月日 时分秒
                choose: function(datas) {
                    //  document.getElementById('laydate_box').style.display='block';
                    document.getElementById('laydate_ok').onclick = function() {
                        document.getElementById('laydate_box').style.display = 'none';
                    }
                    var dateYear = datas.substring(0, 10); //获取当前时间
                    // $("#shows").val(dateYear);
                    var storeInfo = {}
                    if (window.localStorage && localStorage.account) {
                        storeInfo = JSON.parse(localStorage.account);
                    }

                    var myDate = new Date();
                    var todayDate = utils.getFormatDate(myDate);
                    var startDate = todayDate;
                    var endDate = todayDate;
                    var type = $('.good-according div.active').index();
                    var cateId = $('#cateId').val();

                    var sel_date = $('#accorDate').find("option:selected").text(); //选中的值
                    var sel_dateIndex = $('#accorDate option').index($('#accorDate option:selected')) //选中的值
                    if (sel_dateIndex == 2) { //月
                        dateYear = datas.substring(0, 7); //获取当前年
                        var dateRe1 = datas.substring(0, 4); //获取当前年
                        var dateRe2 = datas.substring(5, 7); //获取当前年
                        startDate = dateYear + '-' + '01';
                        endDate = dateYear + '-' + getLastDay(dateRe1, parseInt(dateRe2, 10));
                        $("#shows").text(dateYear);
                    } else if (sel_dateIndex == 3) { //年
                        dateYear = datas.substring(0, 4); //获取当前年
                        startDate = dateYear + '-' + '01' + '-' + '01';
                        endDate = dateYear + '-' + '12' + '-' + getLastDay(dateYear, 12);
                        $("#shows").text(dateYear);
                    } else if (sel_dateIndex == 1) { //周
                        dateYear = datas.substring(0, 10); //获取当前年
                        var dd = dateYear.replace(/-/g, "/");
                        var d = getMonDate(dd);
                        var arr = [];
                        for (var i = 0; i < 7; i++) {
                            arr.push(d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate());
                            d.setDate(d.getDate() + 1);
                        }
                        $("#shows").text(arr[0] + '~' + arr[6]);
                        startDate = arr[0];
                        endDate = arr[6];
                    } else if (sel_dateIndex == 0) { //日
                        dateYear = datas.substring(0, 10); //获取当前年
                        startDate = dateYear;
                        endDate = dateYear;
                        $("#shows").text(dateYear);
                    }
                    self.startDate = startDate;
                    self.endDate = endDate;

                    //要传的参数
                    var params = {
                            storeId: storeInfo.storeId,
                            channel: 0, //channel	渠道 0.ipos 1.bpos
                            startDate: startDate,
                            endDate: endDate
                        }
                        //饼图  4、各分类销售占比
                    self.getCircle(params);
                    //3、分渠道销售情况 柱状图和环图
                    self.line(params);
                    //2、按日期查销售额  top栏
                    self.saleByDate(params);
                    //
                    params.type = type;
                    params.next = 0;
                    params.cateId = $('#categorySel').val();
                    //5、商品销售排名     商品列表
                    self.getRank(params);
                }
            });
        }

        //客单价
        self.line = function(opt) {
                httpGet({
                    url: api.channelSale,
                    params: opt,
                    success: function(res) {
                        self.channelInfo = res.data;
                        if (self.channelInfo.onlineCustomerPrice > self.channelInfo.offlineCustomerPrice) {
                          $(".grad-r").css({
                              'height': '50%'
                          });
                            var height = $(".grad-r").height();
                            var widthAnother = Math.floor((self.channelInfo.offlineCustomerPrice / self.channelInfo.onlineCustomerPrice) * 10) / 10 * height;

                            $(".grad-l").css({
                                'height': widthAnother
                            });

                        } else if (self.channelInfo.onlineCustomerPrice < self.channelInfo.offlineCustomerPrice) {
                          $(".grad-l").css({
                              'height': '50%'
                          });
                            var height = $(".grad-l").height();
                            var widthAnother = Math.floor((self.channelInfo.onlineCustomerPrice / self.channelInfo.offlineCustomerPrice) * 10) / 10 * height;

                            $(".grad-r").css({
                                'height': widthAnother
                            });
                        }else if(self.channelInfo.onlineCustomerPrice == self.channelInfo.offlineCustomerPrice) {
                          $(".grad-l").css({
                              'height': '0%'
                          });
                          $(".grad-r").css({
                              'height': '0%'
                          });
                        }
                        $(".grad-l").append("<b></b>");
                        $(".grad-r").append("<b></b>");

                        if ($('.shift b').is('.shift-sale')) {

                          self.scalePercent = res.data.offlineSalesScale;

                        } else {

                          self.scalePercent = res.data.offlineAmountScale;

                        }
                        console.log(self.scalePercent + '--self.scalePercent--');
                        self.lostMembersTwo(self.scalePercent);
                        self.update();

                    }
                })
            }
            //根据商品品类进行选择
        self.categorySel = function() {
                var params = {
                    storeId: storeInfo.storeId,
                    channel: 0 //channel	渠道 0.ipos 1.bpos
                }
                params.cateId = $('#categorySel').val();
                // params.startDate = $("#getstartDate").val();
                // params.endDate = $("#getendDate").val();
                params.startDate = self.startDate;
                params.endDate = self.endDate;
                params.type = $('.good-according div.active').index();
                params.next = 0;
                self.getRank(params);
            }
            //根据商品品类进行选择

        //根据分类获取商品
        self.accordSale = function(e) {
                var type = $(e.target).index();
                // var  cateId = $('#testSelect option:selected') .val();//选中的值
                var cateId = $('#cateId').val();
                self.cateId = cateId;
                var next = 0;
                var storeInfo = {}
                if (window.localStorage && localStorage.account) {
                    storeInfo = JSON.parse(localStorage.account);
                }
                var params = {
                    storeId: storeInfo.storeId,
                    channel: 0 //channel	渠道 0.ipos 1.bpos
                }
                params.startDate = $("#startDateId").val();
                params.endDate = $("#endDateId").val();

                // params.startDate = $("#getstartDate").val();
                // params.endDate = $("#getendDate").val();
                params.startDate = self.startDate;
                params.endDate = self.endDate;
                params.type = type;

                params.cateId = $('#categorySel').val();
                params.next = 0;
                for (var i = 0; i < self.according.length; i++) {
                    self.according[i].active = false;
                }
                e.item.active = true;
                self.getRank(params);
            }
            // 画环形比例图
            //饼图
        self.getCircle = function(opt) {
            httpGet({
                url: api.categoryScale,
                params: opt,
                success: function(data) {
                    if (data.data.length > 0) {
                        // $("#circleSale")[0].removeChild(p);
                        self.circle(data);
                    } else {
                        $("#circleSale")[0].innerHTML = "<p></p>";
                    }
                }
            })
        }

        self.circle = function(data) {
            var myChart = echarts.init($('#circleSale')[0]);
            var seriesData = [];
            self.data = data.data;
            var colorList = ['#16f0fe', '#35aaed', '#96d24b', '#fb6960', '#ffcd6c', '#6f6ac2', '#da70d6', '#32cd32', '#6495ed',
                '#ff69b4', '#ba55d3'
            ];
            for (var i = 0; i < self.data.length; i++) {
                var seriesList = {};
                var itemStyle = {
                    normal: {
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                fontSize: '12',
                                color: '#666'
                            }
                        }
                    }
                };
                var charts = self.data[i];
                seriesList.name = self.data[i].cateName;
                seriesList.value = self.data[i].salesAmount;
                seriesList.itemStyle = itemStyle;
                seriesList.itemStyle.normal.color = colorList[i];
                seriesData.push(seriesList);
            }
            var option = {
                tooltip: {
                    trigger: 'item',
                    // formatter: "{a} <br/>{b} : {c} ({d}%)"
                    formatter: "{a} <br/>{b} : {d}%"

                },
                series: [{
                    name: '',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    label: {
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '16',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    data: seriesData,
                }]
            };
            myChart.setOption(option);

        }

        //切换销售选项
        self.shift = function() {
            self.params.startDate = self.startDate;
            self.params.endDate = self.endDate;
            httpGet({
                url: api.channelSale,
                params: self.params,
                success: function(res) {
                    self.perSale = true;

                    if ($('.shift b').is('.shift-sale')) {
                        $('.shift b').removeClass('shift-sale')
                        self.scalePercent = res.data.offlineAmountScale;
                        self.perSale = false;

                    } else {
                        $('.shift b').addClass('shift-sale')
                        self.scalePercent = res.data.offlineSalesScale;
                        self.perSale = true;

                    }
                    self.lostMembersTwo(self.scalePercent);
                    self.update();
                }
            })
        }

        //1、本周排名
        self.getWeekSale = function(opt) {
                httpGet({
                    url: api.getWeekSale,
                    params: opt,
                    success: function(res) {
                        self.weekRank = res.data;
                        self.update();
                    },
                    complete: function(status) {
                        // if (status == "error") {
                        //     utils.toast("后台数据有误");
                        // }
                    }
                })
            }
            //6、会员、订单简报
        self.weekMembers = function(opt) {
                httpGet({
                    url: api.weekMembers,
                    params: opt,
                    success: function(res) {
                        self.weekMembersInfo = res.data;
                        if (res.data.totalMemberNum != 0) {
                            var lostM = Math.ceil(res.data.loseMemberNum / res.data.totalMemberNum * 100);
                        } else {
                            var lostM = 0;
                        }
                        self.lostMembers(lostM);
                        self.update();
                    }
                })
            }
            //9、排名商品分类
        self.categoryRank = function(opt) {
                httpGet({
                    url: api.categoryRank,
                    params: opt,
                    success: function(res) {
                        self.categoryRank = res.data;
                        self.categoryRank.unshift({
                            cateId: null,
                            cateName: '全部分类'
                        })
                        self.update();
                    }
                })
            }
            //2、按日期查销售额
        self.saleByDate = function(opt) {
                httpGet({
                    url: api.saleByDate,
                    params: opt,
                    success: function(res) {
                        self.allSale = res.data;
                        self.update();
                    }
                })
            }
            //5、商品销售排名
        self.initGoodsRank = function(opt) {
                opt.type = self.type;
                opt.next = self.next;
                self.getRank(opt);
            }
            //下拉获取更多
        var listen = true;
        self.listenDown = function() {
            setTimeout(function() {
                self.listWrap = $('.top-goods-list')[0];
                self.scrollDown = function(event) {
                    var params = {
                        storeId: storeInfo.storeId,
                        channel: 0, //channel	渠道 0.ipos 1.bpos
                        startDate: self.startDate,
                        endDate: self.endDate,
                    }
                    params.cateId = $('#categorySel').val();
                    params.type = $('.good-according div.active').index();
                    params.next = self.next;
                    var clientHeight = self.listWrap.clientHeight;
                    var scrollTop = self.listWrap.scrollTop;
                    self.topGoodsListScroll = self.listWrap.scrollTop;
                    if ((clientHeight + scrollTop) > self.listWrap.scrollHeight - 10) {
                        if (self.next && listen) {
                            listen = false;
                            params.next = self.next;
                            httpGet({
                                url: api.goodsRank,
                                params: params,
                                success: function(res) {
                                    self.next_gooda = self.next_gooda.concat(res.data.list);
                                    self.next = res.data.next;
                                    listen = true;
                                    self.update();
                                    if (self.totalAmount > 0) {
                                        // var total = Math.floor((self.nowAmount / self.totalAmount) * 100);
                                        var total =(self.nowAmount / self.totalAmount) * 100;

                                        if (total >= 80) {

                                            return;
                                        }
                                        for (var i = 0; i < res.data.list.length; i++) {
                                            self.nowAmount += res.data.list[i].salesAmount;
                                            var total = Math.floor((self.nowAmount / self.totalAmount) * 100);
                                            // var total =(self.nowAmount / self.totalAmount) * 100;

                                            if (total >= 80) {
                                              i = self.next -10 + i;
                                                self.next_gooda[i].activeStatus = "activeStatus"
                                                    // $('.top-goods-list li').eq(i).after(txt);
                                                break;
                                            }
                                        }
                                        self.update();
                                        var txt = $("<div></div>").text("以上商品占销售额的80%").addClass('txt');
                                        $("#activeStatus").parent("li").after(txt)
                                    }
                                }
                            })

                        }
                    }
                };
                // if (self.listWrap) {
                self.listWrap.addEventListener('scroll', self.scrollDown, false);
                // }
            }, 50);
        }

        //丢失会员数环状图
        self.lostMembers = function(percent) {
                $('#circleTwo .left').css("-webkit-transform", "rotate(" + (18 / 5) * percent + "deg)");
                $('#circleTwo .num>span').text(percent);
                if (percent > 50) {
                    $('#circleTwo .circle').addClass('clip-auto');
                    $('#circleTwo .right').removeClass('wth0');
                }
            }
            //销售额占比
        self.lostMembersTwo = function(percent) {
          console.log(percent + '---percent---');
            $('#circleOne .left').css("-webkit-transform", "rotate(" + (18 / 5) * percent + "deg)");
            $('#circleOne .num>span').text(percent);
            if (percent > 50) {
                $('#circleOne .circle').addClass('clip-auto');
                $('#circleOne .right').removeClass('wth0');
            }
        }
        self.init = function() {
                $('.rank').hover(function() {
                    $('.rank ul').css({
                        'display': 'block'
                    });
                }, function() {
                    $('.rank ul').css({
                        'display': 'none'
                    });
                });
            }
            //7、畅销商品库存预警
        self.bestStock = [];

        // 初始加载 库存预警分页
        self.bestWarning = function(opt) {
            getbestWarning(opt, function(res) {
                self.update();
            })
        }

        // 库存预警分页
        var bestscroll = true;

        function testBestScrllo() {
            var bestListWrap = $('.stock-scroll-best')[0];
            $(".stock-scroll-best").scroll(function() {
                var bestWidth = $(".stock-scroll-best ul").width()
                if ((bestWidth - bestListWrap.scrollLeft < 450) && self.nextbest) {
                    if (bestscroll) {
                        bestscroll = false
                        var params = self.params;
                        params.next = self.nextbest
                        getbestWarning(params, function(res) {
                            self.update();
                            bestscroll = true;
                        })
                    }
                }
            })
        }
        self.leftBest = function() {
            var bestListWrap = $('.stock-scroll-best')[0];
            var bestLiWidth = $(".stock-scroll-best ul li").width()
            bestListWrap.scrollLeft = bestListWrap.scrollLeft - bestLiWidth
        }

        self.rightBest = function() {
            var bestListWrap = $('.stock-scroll-best')[0];
            var bestLiWidth = $(".stock-scroll-best ul li").width()
            bestListWrap.scrollLeft = bestListWrap.scrollLeft + bestLiWidth
        }

        function getbestWarning(params, callback) {
            httpGet({
                url: api.bestWarning,
                params: params,
                success: function(res) {
                    if (params.next === 0) {
                        self.bestStock = res.data.list;
                    } else {
                        self.bestStock = self.bestStock.concat(res.data.list);
                    }
                    var scrollLi = parseInt($(".stock-scroll-best").width() / 3);
                    var scrollUl = self.bestStock.length * scrollLi;
                    self.nextbest = res.data.next;
                    self.update();
                    $('.stock-scroll-best ul li').css('width', scrollLi);
                    $('.stock-scroll-best ul').css('width', scrollUl);
                    bestscroll = true
                    callback(res);
                }
            })
        }

        function getdullWarning(params, callback) {
            httpGet({
                url: api.dullWarning,
                params: params,
                success: function(res) {
                    if (params.next === 0) {
                        self.dullStock = res.data.list;
                    } else {
                        self.dullStock = self.dullStock.concat(res.data.list);
                    }
                    var scrollLi = parseInt($(".stock-scroll-dull").width() / 3);
                    var scrollUl = self.dullStock.length * scrollLi;
                    self.nextDull = res.data.next;
                    self.update();
                    $('.stock-scroll-dull ul li').css('width', scrollLi);
                    $('.stock-scroll-dull ul').css('width', scrollUl);
                    dullscroll = true
                    callback(res);
                }
            })
        }

        //8、滞销商品提醒
        self.dullWarning = function(opt) {
            getdullWarning(opt, function(res) {
                self.update();
            })
        }

        //、滞销商品提醒  分页
        var dullscroll = true;

        function testDullScrllo() {
            var dullListWrap = $('.stock-scroll-dull')[0];
            $(".stock-scroll-dull").scroll(function() {
                var dullWidth = $(".stock-scroll-dull ul").width()
                if ((dullWidth - dullListWrap.scrollLeft < 450) && self.nextDull) {
                    if (dullscroll) {
                        dullscroll = false
                        var params = self.params;
                        params.next = self.nextDull
                        getdullWarning(params, function(res) {
                            self.update();
                            dullscroll = true;
                        })
                    }
                }
            })
        }
        self.leftDull = function() {
            var dullListWrap = $('.stock-scroll-dull')[0];
            var dullLiWidth = $(".stock-scroll-dull ul li").width()
            dullListWrap.scrollLeft = dullListWrap.scrollLeft - dullLiWidth
        }

        self.rightDull = function() {
            var dullListWrap = $('.stock-scroll-dull')[0];
            var dullLiWidth = $(".stock-scroll-dull ul li").width()
            dullListWrap.scrollLeft = dullListWrap.scrollLeft + dullLiWidth
        }

        self.getRank = function(param) {
            httpGet({
                url: api.goodsRank,
                params: param,
                success: function(res) {
                    self.nowAmount = 0;
                    self.next_gooda = res.data.list;
                    self.next = res.data.next;
                    self.totalAmount = res.data.totalAmount;
                    self.update();
                    $(".txt").remove();
                    if (res.data.totalAmount > 0) {

                        for (var i = 0; i < self.next_gooda.length; i++) {
                            self.nowAmount += self.next_gooda[i].salesAmount;
                            // var total = Math.floor((self.nowAmount / self.totalAmount) * 100);
                            var total = (self.nowAmount / self.totalAmount) * 100;

                            if (total >= 80) {
                                self.next_gooda[i].activeStatus = "activeStatus"
                                    // $('.top-goods-list li').eq(i).after(txt);
                                break;
                            }
                        }
                        self.update();
                        var txt = $("<div></div>").text("以上商品占销售额的80%").addClass('txt');
                        $("#activeStatus").parent("li").after(txt)
                    }
                }
            })
        }

        // 改变日期
        self.on('selectdateChange', function(date) {
            self.showDate = date.showDate
            self.selectType = date.selectType
            self.startDate = $(self.root).find('#selectdateChangeStart').val();
            self.endDate = $(self.root).find('#selectdateChangeEnd').val();
            self.selectDateStatus = false
            self.update();
            var storeInfo = {}
            if (window.localStorage && localStorage.account) {
                storeInfo = JSON.parse(localStorage.account);
            }
            var params = {
                    storeId: storeInfo.storeId,
                    channel: 0, //channel	渠道 0.ipos 1.bpos
                    startDate: self.startDate,
                    endDate: self.endDate
                }
                //饼图  4、各分类销售占比
            self.getCircle(params);
            //3、分渠道销售情况 柱状图和环图
            self.line(params);
            //2、按日期查销售额  top栏
            self.saleByDate(params);
            var type = $('.good-according div.active').index();
            //
            params.type = type;
            params.next = 0;
            params.cateId = $('#categorySel').val();
            //5、商品销售排名     商品列表
            self.getRank(params);
        });

        self.on('mount', function() {
            var storeInfo = {}
            if (window.localStorage && localStorage.account) {
                storeInfo = JSON.parse(localStorage.account);
            }
            var myDate = new Date();
            var todayDate = utils.getFormatDate(myDate);
            self.startDate = todayDate;
            self.endDate = todayDate;
            self.showDate = todayDate;
            self.params = {
                storeId: storeInfo.storeId,
                channel: 0, //channel	渠道 0.ipos 1.bpos
                startDate: self.startDate,
                endDate: self.endDate,
            }
            $("#shows").text(todayDate);

            // utils.getFormatDate(myDate);
            self.getWeekSale(self.params);
            self.weekMembers(self.params);
            self.saleByDate(self.params);
            self.initGoodsRank(self.params);
            self.getCircle(self.params); //4、各分类销售占比
            self.line(self.params); //3、分渠道销售情况
            self.bestWarning(self.params); //7、畅销商品库存预警
            self.dullWarning(self.params); //8、滞销商品库存预警
            self.categoryRank(self.params); //9、排名商品分类
            self.init();
            // self.circle();
            self.lostMembers();
            //分类销售情况 销售额和销售量切换
            self.listenDown();
            testBestScrllo();
            testDullScrllo();
            // self.listenLeft();
        });
        self.on('unmount', function() {
                if (self.listWrap && self.scrollDown) {
                    self.listWrap.removeEventListener('scroll', self.scrollDown);
                }
                // if (self.listWrapBest && self.scrollLeft) {
                //   self.listWrapBest.removeEventListener('scroll', self.scrollLeft);
                // }
            })
            //获取  各月的第一天和最后一天  周日和周日
        function getLastDay(year, month) {
            var new_year = year; //取当前的年份
            var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）
            if (month > 12) //如果当前大于12月，则年份转到下一年
            {
                new_month -= 12; //月份减
                new_year++; //年份增
            }
            var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天
            return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日期
        }
        // 获取某日所属周一和周二
        function getMonDate(obj) {
            var d = new Date(obj),
                // var d=new Date(2016-12-14),
                day = d.getDay(),
                date = d.getDate();
            if (day == 1)
                return d;
            if (day == 0)
                d.setDate(date - 6);
            else
                d.setDate(date - day + 1);
            return d;
        }
});

riot.tag2('business-assistant', '<div class="business-assistant"> <div class="b-s-top"> <div class="rank"> <span>本日{weekRank.countryName}第{weekRank.rank}名<span> <ul> <li>本门店总销售额:{weekRank.totalAmount}</li> <li>{weekRank.countryName}最高销售额:{weekRank.highestAmount}</li> </ul> </div> <div class="chose-date"> <div class="get-date" onclick="{selectDate}" id="selectdateShow"> {showDate} </div> <input id="getstartDate" type="hidden" name="name" value="{startDate}"> <input id="getendDate" type="hidden" name="name" value="{endDate}"> <div if="{selectDateStatus}" class="select-date-select"> <select-date id="selectDate"></select-date> </div> </div> <div class="sale-data"> <span id="totalAmount">销售额:{allSale.totalAmount}</span> <span>总单数:{allSale.totalBills}</span> <span>销量:{allSale.totalSales}</span> <span>毛利润:{allSale.totalProfit}</span> </div> </div> <div class="b-s-con"> <div class="l-report brief-report"> <p><i></i><b>销售简报</b><i></i></p> <div class="channel-sale-rank"> <div class="report sale-info"> <div class="reportInfo"> 分渠道销售情况 </div> <div class="disc"> <div class="wraps wrap-r" id="circleOne"> <div class="circle circle-r"> <div class="percent left"></div> <div class="percent right wth0"></div> </div> <div class="num"> <b if="{!perSale}">销售额对比</b> <b if="{perSale}">销量对比</b> </div> </div> </ul> <ul class="sale-per" if="{!perSale}"> <li>网店销售额{channelInfo.onlineAmountScale || 0}%</li> <li>门店销售额{channelInfo.offlineAmountScale || 0}%</li> </ul> <ul class="sale-per" if="{perSale}"> <li>网店销量{channelInfo.onlineSalesScale || 0}%</li> <li>门店销量{channelInfo.offlineSalesScale || 0}%</li> </ul> <p> <i class="nobor">销售额</i> <i class="shift nobor" onclick="{shift}"><b></b></i> <i class="nobor">销售量</i> </p> </div> <div class="line"> <div class="line1"> <p class="grad-l"><span class="line-item">门店</span><b>{channelInfo.offlineCustomerPrice}</b></p> </div> <div class="line2"> <p class="grad-r"><span class="line-item">网店</span><b>{channelInfo.onlineCustomerPrice}</b></p> </div> <i>客单价</i> </div> </div> <div class="report"> <div class="reportInfo"> 各分类销售额占比 </div> <div id="circleSale"></div> </div> </div> <div class="goods-sale-rank report"> <div class="reportInfo"> 商品销售排名 </div> <div class="accordTosale"> <div class="good-class"> <select id="categorySel" class="" name="" onchange="{categorySel}"> <option each="{categoryRank}" value="{cateId}">{cateName}</option> </select> </div> <div class="good-according"> <div class="{active: active}" onclick="{accordSale}" each="{according}"> {accord} </div> </div> </div> <li class="li-bor-top"> <span style="width: 8%">项</span> <span style="width: 23%">商品</span> <span style="width: 13%">分类</span> <span style="width: 10%">销量</span> <span style="width: 15%">销售额</span> <span style="width: 15%">周转天数</span> <span style="width: 16%">毛利率</span> </li> <ul class="top-goods-list"> <li each="{item in next_gooda}"> <span style="width: 8%" if="{next_gooda.indexOf(item)==0 || next_gooda.indexOf(item)==1 || next_gooda.indexOf(item)==2}"></span> <span style="width: 8%" if="{next_gooda.indexOf(item) !=0 && next_gooda.indexOf(item) !=1 && next_gooda.indexOf(item) !=2}">{next_gooda.indexOf(item) + 1}</span> <span style="width: 23%">{item.goodsName}</span> <span style="width: 13%">{item.cateName}</span> <span style="width: 10%">{item.sales}</span> <span style="width: 15%" class="saleNum">{item.salesAmount}</span> <span style="width: 15%" if="{item.turnoverDays>= 0 &&  item.turnoverDays <= 999}">{item.turnoverDays}</span> <span style="width: 15%" if="{item.turnoverDays> 999}">999+</span> <span style="width: 15%" if="{item.turnoverDays < 0}">---</span> <span style="width: 16%">{item.grossMargin}%</span> <div class="" id="{item.activeStatus}" if="item.activeStatus"> </div> </li> <input id="getNext" type="hidden" name="name" value="{next}"> </ul> </div> </div> <div class="r-report brief-report"> <p><i></i><b>顾客简报</b><i></i></p> <div class="customer-sale-rank report week-sale"> <div class="reportInfo"> 分渠道顾客情况 </div> <div class="l-week-sale"> <ul> <li class="bor1"> <dl class=""> <dt></dt> <dd>门店</dd> </dl> <ul> <li>本周消费顾客</li> <li>{weekMembersInfo.offlineBuyerNum}</li> <li class="addbg" if="{weekMembersInfo.offlineBuyerAddNum> 0}">上周 +{weekMembersInfo.offlineBuyerAddNum}</li> <li class="decrebg" if="{weekMembersInfo.offlineBuyerAddNum < 0}">上周 {weekMembersInfo.offlineBuyerAddNum}</li> <li if="{weekMembersInfo.offlineBuyerAddNum==0}">上周 ={weekMembersInfo.offlineBuyerAddNum}</li> </ul> </li> <li> <dl class=""> <dt class="store-on-pic"></dt> <dd>网店</dd> </dl> <ul> <li>本周消费会员</li> <li>{weekMembersInfo.onlineBuyerNum}</li> <li class="addbg" if="{weekMembersInfo.onlineBuyerAddNum> 0}">上周 +{weekMembersInfo.onlineBuyerAddNum}</li> <li class="decrebg" if="{weekMembersInfo.onlineBuyerAddNum < 0}">上周 {weekMembersInfo.onlineBuyerAddNum}</li> <li if="{weekMembersInfo.onlineBuyerAddNum==0}">上周 ={weekMembersInfo.onlineBuyerAddNum}</li> </ul> </li> </ul> </div> <div class="c-week-sale"> <ul> <li>本周新增会员</li> <li>{weekMembersInfo.newMemberNum}</li> <li class="addbgNew" if="{weekMembersInfo.newMemberAddNum> 0}">上周 +{weekMembersInfo.newMemberAddNum}<span></span></li> <li class="decrebgNew" if="{weekMembersInfo.newMemberAddNum < 0}">上周 {weekMembersInfo.newMemberAddNum}<span></span></li> <li if="{weekMembersInfo.newMemberAddNum==0}">上周 ={weekMembersInfo.newMemberAddNum}</li> </ul> </div> <div class="r-week-sale" style="position:relative;"> <div class="wraps" id="circleTwo"> <div class="circle"> <div class="percent left"></div> <div class="percent right wth0"></div> </div> <div class="num"> <p> 流失会员{weekMembersInfo.loseMemberNum} </p> <p> (30天未购物) </p> </div> <div class="totalMem"> 总会员:{weekMembersInfo.totalMemberNum} </div> </div> </div> </div> <p><i></i><b>库存简报</b><i></i></p> <div class="customer-sale-rank warning-stock"> <div class="report"> <div class="reportInfo"> 库存预警 </div> </div> <h1></h1> <h2></h2> <a class="left-arrow" onclick="{leftBest}"></a> <div class="stock-con"> <div class="stock-scroll stock-scroll-best"> <ul> <li each="{bestStock}"> <div class="stock-pic"> <img riot-src="{imageUrl || \'imgs/default-product.png\'}" alt=""></div> <div class="stock-num stock-rotate" if="{stockNum <999}">库存{stockNum}</div> <div class="stock-num stock-rotate" if="{stockNum>= 999}">库存999+</div> <div class="stock-name">{goodsName}</div> </li> </ul> </div> </div> <a class="right-arrow" onclick="{rightBest}"></a> </div> <div class="customer-sale-rank warning-stock"> <div class="report"> <div class="reportInfo"> 滞销商品 </div> </div> <h1 class="h1"></h1> <h2 class="h2"></h2> <a class="left-arrow" onclick="{leftDull}"></a> <div class="stock-con"> <div class="stock-scroll stock-scroll-dull"> <ul> <li each="{dullStock}"> <div class="stock-pic"> <img riot-src="{imageUrl || \'imgs/default-product.png\'}" alt=""></div> <div class="stock-num stock-remain stock-rotate" if="{stockNum <999}">库存{stockNum}</div> <div class="stock-num stock-remain stock-rotate" if="{stockNum>= 999}">库存999+</div> <div class="stock-name">{goodsName}</div> </li> </ul> </div> </div> <a class="right-arrow" onclick="{rightDull}"></a> </div> </div> </div> </div>', '', '', function(opts) {
        var self = this;
        self.nextNum = 0;
        self.next = 0;
        self.nextBest = 0;
        self.nextDull = 0;
        self.nowAmount = 0;
        self.selectDateStatus = false; //
        self.selectType = 1; //
        self.offlineAmountScale = 0;
        self.offlineSalesScale = 0;
        self.selectDate = function() {
            self.selectDateStatus = !self.selectDateStatus
            self.update()
            if (self.selectDateStatus) {
                var date = {
                    selectType: self.selectType,
                    startDate: self.startDate,
                    endDate: self.endDate
                }
                $("#selectDate")[0].open(date);
            }
            var e = window.event;
            e.preventDefault();
            if (e && e.stopPropagation) {
                e.stopPropagation();
            }
            self.update()

            function closeSelectDate() {
                self.selectDateStatus = false;
                self.update()
                $(window).unbind('click', closeSelectDate);
            }
            setTimeout(function() {
                $(window).bind('click', closeSelectDate);
            }, 100);
        }

        self.type = 0;
        var storeInfo = {}
        if (window.localStorage && localStorage.account) {
            storeInfo = JSON.parse(localStorage.account);
        }
        var myDate = new Date();
        var todayDate = '2012-12-12';
        self.startDate = todayDate;
        self.endDate = todayDate;
        var params = {
            storeId: storeInfo.storeId,
            channel: 0, //channel	渠道 0.ipos 1.bpos
            startDate: self.startDate,
            endDate: self.endDate,
        }
        self.next_gooda = [];
        self.list = [{
            item: '按日选',
            active: true
        }, {
            item: '按周选',
            active: false
        }, {
            item: '按月选',
            active: false
        }, {
            item: '按年选',
            active: false
        }, ]
        self.cate = [{
            item: '全选',
            active: true
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }]
        self.according = [{
            accord: '按销售额',
            active: true
        }, {
            accord: '按销量',
            active: false
        }, {
            accord: '按周转',
            active: false
        }, {
            accord: '按毛利率',
            active: false
        }]
        self.goods = [{
                item: '1',
                active: true
            }, {
                item: '2',
                active: true
            }, {
                item: '3',
                active: true
            }, {
                item: '4',
                active: true
            }, {
                item: '5',
                active: true
            }, {
                item: '6',
                active: true
            }, {
                item: '7',
                active: true
            }, {
                item: '8',
                active: true
            }, {
                item: '9',
                active: true
            }, {
                item: '10',
                active: true
            }, {
                item: '11',
                active: true
            }, {
                item: '12',
                active: true
            }, {
                item: '13',
                active: true
            }, {
                item: '14',
                active: true
            }, {
                item: '15',
                active: true
            }, {
                item: '16',
                active: false
            }, {
                item: '17',
                active: false
            }, {
                item: '18',
                active: false
            }, {
                item: '19',
                active: false
            }, {
                item: '20',
                active: false
            }, {
                item: '21',
                active: false
            }, {
                item: '22',
                active: false
            }, {
                item: '23',
                active: false
            }, {
                item: '24',
                active: false
            }, {
                item: '25',
                active: false
            }, {
                item: '26',
                active: false
            }, {
                item: '27',
                active: false
            }, {
                item: '28',
                active: false
            }]
            //选择日期格式 accorDate
        self.accorDateChange = function() {
            $('.y-m').css({
                'display': 'block'
            });
        }

        self.confirmDate = function() {
            laydate({
                elem: '#J-xl-2',
                format: 'YYYY-MM-DD hh:mm:ss', // 分隔符可以任意定义，该例子表示只显示年月日 时分秒
                choose: function(datas) {
                    //  document.getElementById('laydate_box').style.display='block';
                    document.getElementById('laydate_ok').onclick = function() {
                        document.getElementById('laydate_box').style.display = 'none';
                    }
                    var dateYear = datas.substring(0, 10); //获取当前时间
                    // $("#shows").val(dateYear);
                    var storeInfo = {}
                    if (window.localStorage && localStorage.account) {
                        storeInfo = JSON.parse(localStorage.account);
                    }

                    var myDate = new Date();
                    var todayDate = utils.getFormatDate(myDate);
                    var startDate = todayDate;
                    var endDate = todayDate;
                    var type = $('.good-according div.active').index();
                    var cateId = $('#cateId').val();

                    var sel_date = $('#accorDate').find("option:selected").text(); //选中的值
                    var sel_dateIndex = $('#accorDate option').index($('#accorDate option:selected')) //选中的值
                    if (sel_dateIndex == 2) { //月
                        dateYear = datas.substring(0, 7); //获取当前年
                        var dateRe1 = datas.substring(0, 4); //获取当前年
                        var dateRe2 = datas.substring(5, 7); //获取当前年
                        startDate = dateYear + '-' + '01';
                        endDate = dateYear + '-' + getLastDay(dateRe1, parseInt(dateRe2, 10));
                        $("#shows").text(dateYear);
                    } else if (sel_dateIndex == 3) { //年
                        dateYear = datas.substring(0, 4); //获取当前年
                        startDate = dateYear + '-' + '01' + '-' + '01';
                        endDate = dateYear + '-' + '12' + '-' + getLastDay(dateYear, 12);
                        $("#shows").text(dateYear);
                    } else if (sel_dateIndex == 1) { //周
                        dateYear = datas.substring(0, 10); //获取当前年
                        var dd = dateYear.replace(/-/g, "/");
                        var d = getMonDate(dd);
                        var arr = [];
                        for (var i = 0; i < 7; i++) {
                            arr.push(d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate());
                            d.setDate(d.getDate() + 1);
                        }
                        $("#shows").text(arr[0] + '~' + arr[6]);
                        startDate = arr[0];
                        endDate = arr[6];
                    } else if (sel_dateIndex == 0) { //日
                        dateYear = datas.substring(0, 10); //获取当前年
                        startDate = dateYear;
                        endDate = dateYear;
                        $("#shows").text(dateYear);
                    }
                    self.startDate = startDate;
                    self.endDate = endDate;

                    //要传的参数
                    var params = {
                            storeId: storeInfo.storeId,
                            channel: 0, //channel	渠道 0.ipos 1.bpos
                            startDate: startDate,
                            endDate: endDate
                        }
                        //饼图  4、各分类销售占比
                    self.getCircle(params);
                    //3、分渠道销售情况 柱状图和环图
                    self.line(params);
                    //2、按日期查销售额  top栏
                    self.saleByDate(params);
                    self.categoryGoodsRank(params);
                    //
                    params.type = type;
                    params.next = 0;
                    params.cateId = $('#categorySel').val();
                    //5、商品销售排名     商品列表
                    self.getRank(params);
                }
            });
        }

        //客单价
        self.line = function(opt) {
                httpGet({
                    url: api.channelSale,
                    params: opt,
                    success: function(res) {
                        self.channelInfo = res.data;
                        if (self.channelInfo.onlineCustomerPrice > self.channelInfo.offlineCustomerPrice) {
                          $(".grad-r").css({
                              'height': '50%'
                          });
                            var height = $(".grad-r").height();
                            var widthAnother = Math.floor((self.channelInfo.offlineCustomerPrice / self.channelInfo.onlineCustomerPrice) * 10) / 10 * height;

                            $(".grad-l").css({
                                'height': widthAnother
                            });

                        } else if (self.channelInfo.onlineCustomerPrice < self.channelInfo.offlineCustomerPrice) {
                          $(".grad-l").css({
                              'height': '50%'
                          });
                            var height = $(".grad-l").height();
                            var widthAnother = Math.floor((self.channelInfo.onlineCustomerPrice / self.channelInfo.offlineCustomerPrice) * 10) / 10 * height;

                            $(".grad-r").css({
                                'height': widthAnother
                            });
                        }else if(self.channelInfo.onlineCustomerPrice == self.channelInfo.offlineCustomerPrice) {
                          $(".grad-l").css({
                              'height': '0%'
                          });
                          $(".grad-r").css({
                              'height': '0%'
                          });
                        }
                        $(".grad-l").append("<b></b>");
                        $(".grad-r").append("<b></b>");
                        self.offlineSalesScale = res.data.offlineSalesScale;
                        self.offlineAmountScale = res.data.offlineAmountScale;

                        if ($('.shift b').is('.shift-sale')) {
                          self.lostMembersTwo(self.offlineSalesScale);
                        } else {
                          self.lostMembersTwo(self.offlineAmountScale);
                        }
                        self.update();
                    }
                })
            }
            //根据商品品类进行选择
        self.categorySel = function() {
                var params = {
                    storeId: storeInfo.storeId,
                    channel: 0 //channel	渠道 0.ipos 1.bpos
                }
                params.cateId = $('#categorySel').val();
                params.startDate = self.startDate;
                params.endDate = self.endDate;
                params.type = $('.good-according div.active').index();
                params.next = 0;
                self.getRank(params);
            }
            //根据商品品类进行选择

        //根据分类获取商品
        self.accordSale = function(e) {
                var type = $(e.target).index();
                // var  cateId = $('#testSelect option:selected') .val();//选中的值
                var cateId = $('#cateId').val();
                self.cateId = cateId;
                var next = 0;
                var storeInfo = {}
                if (window.localStorage && localStorage.account) {
                    storeInfo = JSON.parse(localStorage.account);
                }
                var params = {
                    storeId: storeInfo.storeId,
                    channel: 0 //channel	渠道 0.ipos 1.bpos
                }
                params.startDate = $("#startDateId").val();
                params.endDate = $("#endDateId").val();

                // params.startDate = $("#getstartDate").val();
                // params.endDate = $("#getendDate").val();
                params.startDate = self.startDate;
                params.endDate = self.endDate;
                params.type = type;

                params.cateId = $('#categorySel').val();
                params.next = 0;
                for (var i = 0; i < self.according.length; i++) {
                    self.according[i].active = false;
                }
                e.item.active = true;
                self.getRank(params);
            }
            // 画环形比例图
            //饼图
        self.getCircle = function(opt) {
            httpGet({
                url: api.categoryScale,
                params: opt,
                success: function(data) {
                    if (data.data.length > 0) {
                        // $("#circleSale")[0].removeChild(p);
                        self.circle(data);
                    } else {
                        $("#circleSale")[0].innerHTML = "<p></p>";
                    }
                }
            })
        }

        self.circle = function(data) {
            var myChart = echarts.init($('#circleSale')[0]);
            var seriesData = [];
            self.data = data.data;
            var colorList = ['#16f0fe', '#35aaed', '#96d24b', '#fb6960', '#ffcd6c', '#6f6ac2', '#da70d6', '#32cd32', '#6495ed',
                '#ff69b4', '#ba55d3'
            ];
            for (var i = 0; i < self.data.length; i++) {
                var seriesList = {};
                var itemStyle = {
                    normal: {
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                fontSize: '12',
                                color: '#666'
                            }
                        }
                    }
                };
                var charts = self.data[i];
                seriesList.name = self.data[i].cateName;
                seriesList.value = self.data[i].salesAmount;
                seriesList.itemStyle = itemStyle;
                seriesList.itemStyle.normal.color = colorList[i];
                seriesData.push(seriesList);
            }
            var option = {
                tooltip: {
                    trigger: 'item',
                    // formatter: "{a} <br/>{b} : {c} ({d}%)"
                    formatter: "{a} <br/>{b} : {d}%"

                },
                series: [{
                    name: '',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    label: {
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '16',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    data: seriesData,
                }]
            };
            myChart.setOption(option);

        }
        self.shift = function () {
          self.perSale = true;
          if ($('.shift b').is('.shift-sale')) {
              $('.shift b').removeClass('shift-sale')
              self.lostMembersTwo(self.offlineAmountScale);
              self.perSale = false;
          } else {
              $('.shift b').addClass('shift-sale')
              self.lostMembersTwo(self.offlineSalesScale);
              self.perSale = true;
          }
        }
        //1、本周排名
        self.getWeekSale = function(opt) {
                httpGet({
                    url: api.getWeekSale,
                    params: opt,
                    success: function(res) {
                        self.weekRank = res.data;
                        self.update();
                    },
                    complete: function(status) {
                        // if (status == "error") {
                        //     utils.toast("后台数据有误");
                        // }
                    }
                })
            }
            //6、会员、订单简报
        self.weekMembers = function(opt) {
                httpGet({
                    url: api.weekMembers,
                    params: opt,
                    success: function(res) {
                        self.weekMembersInfo = res.data;
                        if (res.data.totalMemberNum != 0) {
                            var lostM = Math.ceil(res.data.loseMemberNum / res.data.totalMemberNum * 100);
                        } else {
                            var lostM = 0;
                        }
                        self.lostMembers(lostM);
                        self.update();
                    }
                })
            }
            //9、排名商品分类
        self.categoryGoodsRank = function(opt) {
                httpGet({
                    url: api.categoryRank,
                    params: opt,
                    success: function(res) {
                        self.categoryRank = res.data;
                        self.categoryRank.unshift({
                            cateId: null,
                            cateName: '全部分类'
                        })
                        self.update();
                    }
                })
            }
            //2、按日期查销售额
        self.saleByDate = function(opt) {
                httpGet({
                    url: api.saleByDate,
                    params: opt,
                    success: function(res) {
                        self.allSale = res.data;
                        self.update();
                    }
                })
            }
            //5、商品销售排名
        self.initGoodsRank = function(opt) {
                opt.type = self.type;
                opt.next = self.next;
                self.getRank(opt);
            }
            //下拉获取更多
        var listen = true;
        self.listenDown = function() {
            setTimeout(function() {
                self.listWrap = $('.top-goods-list')[0];
                self.scrollDown = function(event) {
                    var params = {
                        storeId: storeInfo.storeId,
                        channel: 0, //channel	渠道 0.ipos 1.bpos
                        startDate: self.startDate,
                        endDate: self.endDate,
                    }
                    params.cateId = $('#categorySel').val();
                    params.type = $('.good-according div.active').index();
                    params.next = self.next;
                    var clientHeight = self.listWrap.clientHeight;
                    var scrollTop = self.listWrap.scrollTop;
                    self.topGoodsListScroll = self.listWrap.scrollTop;
                    if ((clientHeight + scrollTop) > self.listWrap.scrollHeight - 10) {
                        if (self.next && listen) {
                            listen = false;
                            params.next = self.next;
                            httpGet({
                                url: api.goodsRank,
                                params: params,
                                success: function(res) {
                                    self.next_gooda = self.next_gooda.concat(res.data.list);
                                    self.next = res.data.next;
                                    listen = true;
                                    self.update();
                                    if (self.totalAmount > 0) {
                                        // var total = Math.floor((self.nowAmount / self.totalAmount) * 100);
                                        var total =(self.nowAmount / self.totalAmount) * 100;

                                        if (total >= 80) {

                                            return;
                                        }
                                        for (var i = 0; i < res.data.list.length; i++) {
                                            self.nowAmount += res.data.list[i].salesAmount;
                                            var total = Math.floor((self.nowAmount / self.totalAmount) * 100);
                                            // var total =(self.nowAmount / self.totalAmount) * 100;

                                            if (total >= 80) {
                                              i = self.next -10 + i;
                                                self.next_gooda[i].activeStatus = "activeStatus"
                                                    // $('.top-goods-list li').eq(i).after(txt);
                                                break;
                                            }
                                        }
                                        self.update();
                                        var txt = $("<div></div>").text("以上商品占销售额的80%").addClass('txt');
                                        $("#activeStatus").parent("li").after(txt)
                                    }
                                }
                            })

                        }
                    }
                };
                // if (self.listWrap) {
                self.listWrap.addEventListener('scroll', self.scrollDown, false);
                // }
            }, 50);
        }

        //丢失会员数环状图
        self.lostMembers = function(percent) {
                $('#circleTwo .left').css("-webkit-transform", "rotate(" + (18 / 5) * percent + "deg)");
                $('#circleTwo .num>span').text(percent);
                if (percent > 50) {
                    $('#circleTwo .circle').addClass('clip-auto');
                    $('#circleTwo .right').removeClass('wth0');
                }
            }
            //销售额占比
        self.lostMembersTwo = function(percent) {
            $('#circleOne .left').css("-webkit-transform", "rotate(" + (18 / 5) * percent + "deg)");
            $('#circleOne .num>span').text(percent);
            if (percent > 50) {
                $('#circleOne .circle').addClass('clip-auto');
                $('#circleOne .right').removeClass('wth0');
            }
        }
        self.init = function() {
                $('.rank').hover(function() {
                    $('.rank ul').css({
                        'display': 'block'
                    });
                }, function() {
                    $('.rank ul').css({
                        'display': 'none'
                    });
                });
            }
            //7、畅销商品库存预警
        self.bestStock = [];

        // 初始加载 库存预警分页
        self.bestWarning = function(opt) {
            getbestWarning(opt, function(res) {
                self.update();
            })
        }

        // 库存预警分页
        var bestscroll = true;

        function testBestScrllo() {
            var bestListWrap = $('.stock-scroll-best')[0];
            $(".stock-scroll-best").scroll(function() {
                var bestWidth = $(".stock-scroll-best ul").width()
                if ((bestWidth - bestListWrap.scrollLeft < 450) && self.nextbest) {
                    if (bestscroll) {
                        bestscroll = false
                        var params = self.params;
                        params.next = self.nextbest
                        getbestWarning(params, function(res) {
                            self.update();
                            bestscroll = true;
                        })
                    }
                }
            })
        }
        self.leftBest = function() {
            var bestListWrap = $('.stock-scroll-best')[0];
            var bestLiWidth = $(".stock-scroll-best ul li").width()
            bestListWrap.scrollLeft = bestListWrap.scrollLeft - bestLiWidth
        }

        self.rightBest = function() {
            var bestListWrap = $('.stock-scroll-best')[0];
            var bestLiWidth = $(".stock-scroll-best ul li").width()
            bestListWrap.scrollLeft = bestListWrap.scrollLeft + bestLiWidth
        }

        function getbestWarning(params, callback) {
            httpGet({
                url: api.bestWarning,
                params: params,
                success: function(res) {
                    if (params.next === 0) {
                        self.bestStock = res.data.list;
                    } else {
                        self.bestStock = self.bestStock.concat(res.data.list);
                    }
                    var scrollLi = parseInt($(".stock-scroll-best").width() / 3);
                    var scrollUl = self.bestStock.length * scrollLi;
                    self.nextbest = res.data.next;
                    self.update();
                    $('.stock-scroll-best ul li').css('width', scrollLi);
                    $('.stock-scroll-best ul').css('width', scrollUl);
                    bestscroll = true
                    callback(res);
                }
            })
        }

        function getdullWarning(params, callback) {
            httpGet({
                url: api.dullWarning,
                params: params,
                success: function(res) {
                    if (params.next === 0) {
                        self.dullStock = res.data.list;
                    } else {
                        self.dullStock = self.dullStock.concat(res.data.list);
                    }
                    var scrollLi = parseInt($(".stock-scroll-dull").width() / 3);
                    var scrollUl = self.dullStock.length * scrollLi;
                    self.nextDull = res.data.next;
                    self.update();
                    $('.stock-scroll-dull ul li').css('width', scrollLi);
                    $('.stock-scroll-dull ul').css('width', scrollUl);
                    dullscroll = true
                    callback(res);
                }
            })
        }

        //8、滞销商品提醒
        self.dullWarning = function(opt) {
            getdullWarning(opt, function(res) {
                self.update();
            })
        }

        //、滞销商品提醒  分页
        var dullscroll = true;

        function testDullScrllo() {
            var dullListWrap = $('.stock-scroll-dull')[0];
            $(".stock-scroll-dull").scroll(function() {
                var dullWidth = $(".stock-scroll-dull ul").width()
                if ((dullWidth - dullListWrap.scrollLeft < 450) && self.nextDull) {
                    if (dullscroll) {
                        dullscroll = false
                        var params = self.params;
                        params.next = self.nextDull
                        getdullWarning(params, function(res) {
                            self.update();
                            dullscroll = true;
                        })
                    }
                }
            })
        }
        self.leftDull = function() {
            var dullListWrap = $('.stock-scroll-dull')[0];
            var dullLiWidth = $(".stock-scroll-dull ul li").width()
            dullListWrap.scrollLeft = dullListWrap.scrollLeft - dullLiWidth
        }

        self.rightDull = function() {
            var dullListWrap = $('.stock-scroll-dull')[0];
            var dullLiWidth = $(".stock-scroll-dull ul li").width()
            dullListWrap.scrollLeft = dullListWrap.scrollLeft + dullLiWidth
        }

        self.getRank = function(param) {
            httpGet({
                url: api.goodsRank,
                params: param,
                success: function(res) {
                    self.nowAmount = 0;
                    self.next_gooda = res.data.list;
                    self.next = res.data.next;
                    self.totalAmount = res.data.totalAmount;
                    self.update();
                    $(".txt").remove();
                    if (res.data.totalAmount > 0) {

                        for (var i = 0; i < self.next_gooda.length; i++) {
                            self.nowAmount += self.next_gooda[i].salesAmount;
                            // var total = Math.floor((self.nowAmount / self.totalAmount) * 100);
                            var total = (self.nowAmount / self.totalAmount) * 100;

                            if (total >= 80) {
                                self.next_gooda[i].activeStatus = "activeStatus"
                                    // $('.top-goods-list li').eq(i).after(txt);
                                break;
                            }
                        }
                        self.update();
                        var txt = $("<div></div>").text("以上商品占销售额的80%").addClass('txt');
                        $("#activeStatus").parent("li").after(txt)
                    }
                }
            })
        }

        // 改变日期
        self.on('selectdateChange', function(date) {
            self.showDate = date.showDate
            self.selectType = date.selectType
            self.startDate = $(self.root).find('#selectdateChangeStart').val();
            self.endDate = $(self.root).find('#selectdateChangeEnd').val();
            self.selectDateStatus = false
            self.update();
            var storeInfo = {}
            if (window.localStorage && localStorage.account) {
                storeInfo = JSON.parse(localStorage.account);
            }
            var params = {
                    storeId: storeInfo.storeId,
                    channel: 0, //channel	渠道 0.ipos 1.bpos
                    startDate: self.startDate,
                    endDate: self.endDate
                }
                //饼图  4、各分类销售占比
            self.getCircle(params);
            //3、分渠道销售情况 柱状图和环图
            self.line(params);
            //2、按日期查销售额  top栏
            self.saleByDate(params);
            self.categoryGoodsRank(params)
            var type = $('.good-according div.active').index();
            //
            params.type = type;
            params.next = 0;
            params.cateId = $('#categorySel').val();
            //5、商品销售排名     商品列表
            self.getRank(params);
        });

        self.on('mount', function() {
            var storeInfo = {}
            if (window.localStorage && localStorage.account) {
                storeInfo = JSON.parse(localStorage.account);
            }
            var myDate = new Date();
            var todayDate = utils.getFormatDate(myDate);
            self.startDate = todayDate;
            self.endDate = todayDate;
            self.showDate = todayDate;
            self.params = {
                storeId: storeInfo.storeId,
                channel: 0, //channel	渠道 0.ipos 1.bpos
                startDate: self.startDate,
                endDate: self.endDate,
            }
            $("#shows").text(todayDate);

            // utils.getFormatDate(myDate);
            self.getWeekSale(self.params);
            self.weekMembers(self.params);
            self.saleByDate(self.params);
            self.initGoodsRank(self.params);
            self.getCircle(self.params); //4、各分类销售占比
            self.line(self.params); //3、分渠道销售情况
            self.bestWarning(self.params); //7、畅销商品库存预警
            self.dullWarning(self.params); //8、滞销商品库存预警
            self.categoryGoodsRank(self.params); //9、排名商品分类
            self.init();
            // self.circle();
            // self.lostMembers();
            //分类销售情况 销售额和销售量切换
            self.listenDown();
            testBestScrllo();
            testDullScrllo();
            // self.listenLeft();
        });
        self.on('unmount', function() {
                if (self.listWrap && self.scrollDown) {
                    self.listWrap.removeEventListener('scroll', self.scrollDown);
                }
                // if (self.listWrapBest && self.scrollLeft) {
                //   self.listWrapBest.removeEventListener('scroll', self.scrollLeft);
                // }
            })
            //获取  各月的第一天和最后一天  周日和周日
        function getLastDay(year, month) {
            var new_year = year; //取当前的年份
            var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）
            if (month > 12) //如果当前大于12月，则年份转到下一年
            {
                new_month -= 12; //月份减
                new_year++; //年份增
            }
            var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天
            return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日期
        }
        // 获取某日所属周一和周二
        function getMonDate(obj) {
            var d = new Date(obj),
                // var d=new Date(2016-12-14),
                day = d.getDay(),
                date = d.getDate();
            if (day == 1)
                return d;
            if (day == 0)
                d.setDate(date - 6);
            else
                d.setDate(date - day + 1);
            return d;
        }
});

riot.tag2('circle', '<div class="wrap"> <div class="circle"> <div class="percent left"></div> <div class="percent right wth0"></div> </div> <div class="num"><span>0</span>%</div> </div>', '', '', function(opts) {
});

riot.tag2('shop-chart', '<div class="shop-chart"> <div class="dataTitle"> <p> <a class="{active: active}" each="{dataTitle}" onclick="{dataDetail}">{title}</a> </p> </div> <div class="data-item"> <div class="store-data data-con" if="{showData}"> <div class="chart-top"><div class="chart-dater"><daterangepicker></daterangepicker></div></div> <div class="chart-content"> <div style="width: 100%;height:100%;background: #fff;"> <div id="main" style="width: 100%;height:100%;"></div> </div> </div> </div> <div class="employee-data data-con" if="{!showData}"> <employee-data></employee-data> </div> </div> </div>', '', '', function(opts) {
		var self = this;
		self.showData = true;

		self.dataTitle = [{'title':'店铺数据','active':true},{'title':'员工数据','active':false}]
		self.dataDetail = function(e) {
    for (var i = 0; i < self.dataTitle.length; i++) {
      self.dataTitle[i].active = false;
    }
    e.item.active = true;
    var _index = $(e.target).index();
		if(_index == 0) {
			self.showData = true;
		}else if(_index == 1){
			self.showData = false;
		}
  }
		self.dateChart = function(data){
			var myChart = echarts.init($('#main')[0]);
    		self.data = data;
    		self.storeName = data.storeName;
    		var xdata = self.data.title;
            var maxHeight = self.data.maxHeight;
            var seriesData = [];
            var colorList = ['#aac6f8','#9d9d9d','#488fd1','#e96409','#ff7f50','#87cefa','#da70d6','#32cd32','#6495ed',
                             '#ff69b4','#ba55d3'];
			var legendData = [];
			for(var i=0;i<self.data.charts.length;i++){
   			    var seriesList={};
                var itemStyle = {normal: {
		                label: {
		                    show: true,
		                    position: 'top',
		                    textStyle : {
										fontSize : '12',
										color:'#666'
									}
		                }
		            }
	       	 	};
				var charts = self.data.charts[i];
				legendData.push(self.data.charts[i].name);
				seriesList.name = self.data.charts[i].name;
				seriesList.type = self.data.charts[i].type;
				seriesList.data = self.data.charts[i].data;
				seriesList.itemStyle = itemStyle;
				if(self.data.charts[i].type == "bar"){
					seriesList.barWidth = 30;
				}
				seriesList.itemStyle.normal.color = colorList[i];
				if(self.data.charts.length >5 ){
					seriesList.itemStyle.normal.label.show = false;
				}
				seriesData.push(seriesList);
			}

    		var option = {
    			title: {
    			    text: self.storeName,
    			    x: 'center',
    		        textStyle: {
    		            fontSize: 18,
    		            fontWeight: 'bolder',
    		            color: '#333'
    		        }
    			},
    			tooltip: {
    			    trigger: 'axis'
    			},
    			legend: {
    			    data:legendData,
    			    x: 'right'
    			},

    			grid: {
    			    borderWidth: 0,
    			    containLabel: true
    			},
    			xAxis: {
    			    boundaryGap: true,
    			    type : 'category',
    			    splitLine: {show:false},
    			    data: xdata,
    			    axisLabel:{
    			                 textStyle:{
    			                     color:"#666"
    			                 }
    			             }

    			},
    			yAxis: {
    			        type: 'value',
    			        scale: true,
    			        name: '金额',
    			        max: maxHeight,
    			        min: 0,
    			        boundaryGap: [0.2, 0.2],
	    			    axisLabel:{
			                 textStyle:{
			                     color:"#666"
			                 }
	             }

    			},
    			series: seriesData
    		};
        	myChart.setOption(option);
		}

     	self.on('dateChange', function() {
			var date = $(self.root).find('#daterange').val();
			var beginDate = date.split("~")[0];
			console.log(beginDate);
			var endDate = date.split("~")[1];
			var param = {beginDate:beginDate,endDate:endDate,storeId:8};
			store.dataDashboard.get(param,function(date){self.dateChart(date)});
		});

		self.on('mount', function() {
        	store.dataDashboard.get({},function(date){self.dateChart(date)});

		});
});

riot.tag2('device-index', '<ul> <li each="{list}"> <a onclick="{noAuthTip}"> <img riot-src="{img}"> <div>{name}</div> </a> </li> <div class="clearfix"></div> </ul>', '', '', function(opts) {
        var self = this;

        self.list = [
            {  name: '小票打印机', img: 'imgs/order-printer.png', link: '#/shop/order-printer' },

        ];
				self.noAuthTip = function() {
					utils.setTitle(self.list[0].link, self.list[0].name)
				}

});

riot.tag2('order-printer', '<div class="half"> <div class="card"> <form> <span> 打印机类型：USB打印机 </span> </form> <div> <div class="half"> <button onclick="{printTest}" class="pull-right">打印测试页</button> </div> <div class="clearfix"></div> </div> <div> <p>结算时是否打印小票 <span class="switch {close: !print}" onclick="{switchPrint}"></span></p> <p if="{!isBqCommercial}">确认订单时是否打印小票 <span class="switch {close: !orderPrint}" onclick="{switchOrderPrint}"></span></p> <p if="{!isBqCommercial}">是否打印店铺二维码 <span class="switch {close: !qrcode}" onclick="{switchQrcode}"></span></p> </div> </div> </div>', '', '', function(opts) {
		var self = this;

		self.connected = true;
		self.print = true;
		self.qrcode = true;
		self.qrcode = self.orderPrint
		self.init = function() {
			httpGet({
				url: api.printerInfo,
				success: function(res) {
					self.printerType = res.data.type;
					self.connected = res.data.print;
					self.print = res.data.printBill;
					self.qrcode = res.data.printQr;
					self.update();
				}
			})
		}

		self.getOrderPrintState = function(){
			httpGet({
				url: api.getOrderPrintState,
				success: function(data) {
					self.orderPrint = data.data.nameValuePairs.printOrderState;
					self.update();
				}
			});
		}

		self.connect = function(e) {
			httpGet({
				url: api.switchPrinter,
				params: {enable:true},
				success: function() {
					self.connected = true;
					self.update();
				}
			});
		}

		self.disconnect = function(e) {
			httpGet({
				url: api.switchPrinter,
				params: {enable:false},
				success: function() {
					self.connected = false;
					self.update();
				}
			});
		}

		self.printTest = function(e) {
			httpGet({
				url: api.printTest
			});
		}

		self.switchPrint = function(e) {
			httpGet({
				url: api.printBill,
				params: {enable: !self.print},
				success: function() {
					self.print = !self.print;
					self.update();
				}
			});
		}

		self.switchOrderPrint = function(e) {
			httpGet({
				url: api.setOrderPrintState,
				params: {printOrderState: !self.orderPrint},
				success: function() {
					self.orderPrint = !self.orderPrint;
					self.update();
				}
			});
		}
		self.switchQrcode = function(e) {

			httpGet({
				url: api.printQr,
				params: {enable: !self.qrcode},
				success: function() {
					self.qrcode = !self.qrcode;
					self.update();
				}
			});

		}

		self.on('mount', function() {
			var isBqCommercial = window.isBqCommercial;
			self.init();
			self.getOrderPrintState();
		});
});

riot.tag2('tag-printer', '', '', '', function(opts) {
});
riot.tag2('create-employee', '<form id="create-employee-form"> <label> 姓名： <input type="text" name="personName" maxlength="20"> </label> <label> 账号： <input type="text" name="username" placeholder="账户名必须大于6位" maxlength="12"> </label> <label> 密码： <input type="password" name="password" placeholder="密码必须大于6位" maxlength="12"> </label> <label> 电话： <input type="tel" name="mobile" maxlength="20"> </label> <input name="type" type="hidden" value="2"> </form>', '', '', function(opts) {
		var self = this;
		var modal = self.parent;
		modal.onOpen = function (params) {
			self.submitStatus = 1;
			utils.clearForm('create-employee-form');
		}

		modal.onSubmit = function () {
			var params = $('#create-employee-form').serializeObject();
			if (!(params.personName && params.personName.length > 1 && params.personName.length < 10)) {
				utils.toast("请输入正确的员工姓名");
				return;
			}
			if (!(params.username && /^[0-9a-zA-Z]{6,12}$/g.test(params.username))) {
				utils.toast("账号必须为6-12位字母或数字混合");
				return;
			}
			if (!(params.password && /^[0-9a-zA-Z]{6,12}$/g.test(params.password))) {
				utils.toast("密码格式不正确");
				return;
			}
			if (!(params.mobile == "") && !/^(\+86)?((([0-9]{3,4}-)?[0-9]{7,8})|(1[3578][0-9]{9})|([0-9]{11,20}))$/.test(params.mobile)) {
				utils.toast("电话格式不正确");
				return;
			}

			if (self.submitStatus === 2) {
				return;
			}
			self.submitStatus = 2;
			store.employee.create(params, function () {
				self.submitStatus = 1;
				modal.close();
			},function(){
				self.submitStatus = 1;
			});
		}

		self.on('mount', function () {
			if (store.online) {
				var gotimeout;
				$("#create-employee-form").find("input").focus(function () {
					clearTimeout(gotimeout);
					$(".modal-dialog").css("top", "220px");
				});

				$("#create-employee-form").find("input").blur(function () {
					gotimeout = setTimeout(function () {
						$(".modal-dialog").css("top", "50%");
					}, 200);
				});
			}
		});

});

riot.tag2('employee', '<div class="shop-chart"> <div class="dataTitle" style="height:50px;width:100%;background-color:#fff;"> <p style="display:flex;height:100%;width:260px;margin:0 auto;"> <a style="height:100%;flex:1;text-align:center;display:block;font-size:24px;line-height:50px;" class="{active-shift: active}" each="{dataTitle}" onclick="{dataDetail}">{title}</a> </p> </div> <div class="data-item"> <div class="store-data data-con data-con-l" if="{showData}"> <div class="employee"> <h3>店员账户管理</h3> <ul class="employee-list"> <li class="add-employee" onclick="{openModal(\'create-employee\')}"> <div> <img src="imgs/add.png"> <p>添加员工</p> </div> </li> <li class="employee-item" each="{slaves}"> <form> <input type="hidden" name="userId" value="{userId}"> <label> 姓名： <input type="text" name="personName" value="{personName}"> </label> <label> 账户： <input type="text" name="username" value="{username}" placeholder=""> </label> <label> 密码： <input type="passport" name="password" placeholder="**********"> </label> <label> 电话： <input type="tel" name="mobile" value="{mobile}"> </label> <input type="hidden" name="type" value="2"> <a class="delete" onclick="{delete}">删除</a> <a onclick="{save}">保存</a> </form> </li> <div class="clearfix"></div> </ul> </div> </div> <div class="employee-data data-con" if="{!showData}"> <employee-data></employee-data> </div> </div> </div> <modal modal-width="5rem" modal-height="" small id="create-employee" title="添加员工"> <create-employee></create-employee> </modal>', '', '', function(opts) {
		var self = this;
		self.showData = true;

		self.dataTitle = [{'title':'员工管理','active':true},{'title':'员工数据','active':false}]
		self.dataDetail = function(e) {
		for (var i = 0; i < self.dataTitle.length; i++) {
			self.dataTitle[i].active = false;
		}
		e.item.active = true;
		var _index = $(e.target).index();
		if(_index == 0) {
			self.showData = true;
		}else if(_index == 1){
			self.showData = false;
		}
		}

        self.personName = ''
        self.mobile = ''
        self.password = ''
        self.username = ''

		this.openModal = function(id) {
            return function(e) {
                var item = e.item;
                $('#' + id)[0].open(item);
								console.log($('#' + id)[0]);
            }
        }.bind(this)

        self.init = function() {
        	flux.bind.call(self, {
        		name: 'employees',
        		store: store.employee,
        		success: function() {
        			self.masters = [];
        			self.slaves = [];

        			self.employees.forEach(function(item) {
        				if (item.type === 1) {
        					self.masters.push(item);
        				}
        				else if (item.type === 2) {
        					self.slaves.push(item);
        				}
        			});
        			self.update();
        		}
        	});
        }

		self.countHeight = function() {
			var height = $('.employee .employee-item').css('height');
			$('.add-employee').css('height', height);
		}

		self.openSelect = function(e) {
			var evt = document.createEvent("MouseEvents");
            var dom = $(e.target.parentNode).find('select')[0];
            evt.initEvent("mousedown", true, true);
            if (dom) {
                dom.dispatchEvent(evt);
            }
		}

		self.save = function(e) {
			var form = e.target.parentNode;
			var params = $(form).serializeObject();
			if(!(params.personName && params.personName.length>1 && params.personName.length<10)){
				alert("请输入正确的员工姓名");
				return;
			}
			if(!(params.username && /^[0-9a-zA-Z]{6,12}$/g.test(params.username))){
				alert("账号必须为6-12位字母或数字混合");
				return;
			}
			if(!(params.mobile=="") && !/^(\+86)?((([0-9]{3,4}-)?[0-9]{7,8})|(1[3578][0-9]{9})|([0-9]{11,20}))$/.test(params.mobile)){
				alert("电话格式不正确");
				return;
			}
			store.employee.update(params);
		}

		self.delete = function(e) {
			console.log('---确认删除员工-----');
			var id = e.item.userId;
			var name = e.item.personName || e.item.username;
			if (confirm("确认删除员工" + name + "么？")) {
				store.employee.delete({userId: id});
			}
		}

		self.on('mount', function() {
			self.init();
			self.countHeight();
		})

});

riot.tag2('shop-message', '<form id="shop-message-form"> <div class="half"> <div class="card fit"> <label> 名称：<input type="text" name="storeName" value="{message.storeName}"> </label> <label onclick="{openModal(\'selectAddress\')}"> 地址：<span style="color: #333333">{addressValueWithoutSep || message.address}</span> </label> <input type="hidden" value="{addressValueWithoutSep || message.address}"> <input type="hidden" name="addressCode" value="{newAddressCode || message.addressCode}"> <label> 街道：<input type="text" name="streetName" value="{message.streetName}"> </label> <label> 店铺联系电话：<input type="tel" name="tel" value="{message.tel}"> </label> <label> <span class="notice">店铺公告：</span> <textarea name="notice" value="{message.notice}"></textarea> </label> </div> <div class="card fit"> <label> 配送范围：<input type="text" name="deliveryArea" value="{message.deliveryArea}"> </label> <label> 起送价（元）：<input type="tel" name="deliveryAmount" value="{message.deliveryAmount}"> </label> <label> 配送费（元）：<input type="tel" name="postPrice" value="{message.postPrice}"> </label> <label style="padding-top: 0;"> 接单时间：<date-picker name="startTime" id="dp-startTime" type="time"></date-picker> - <date-picker name="endTime" id="dp-endTime" type="time"></date-picker> </label> </div> </div> <div class="half"> <div class="card qrcode"> <h4>店铺推广二维码</h4> <div class="card-usre-de">该二维码会在客屏和打印票据处显示</div> <div class="change-qrcode" onclick="{changeQrcode}">更换或保存到手机</div> <img riot-src="{message.qrCodePromotion || message.qrCode}" class="shop-message-qrcode"> <div class="show-switch" if="{!message.showInfo}"> <span class="left">二维码客屏展示</span> <span class="right close" onclick="{showSwitch}"></span> </div> <div class="show-switch" if="{message.showInfo}"> <span class="left">二维码客屏展示</span> <span class="right open" onclick="{showSwitch}"></span> </div> </div> <div class="card"> 打开收银机默认登录此店铺 <input type="checkbox" name="bindDevice" value="true" __checked="{message.bindDevice}"> </div> <div class="card" onclick="{openupQrcode}"> <div class="up-qrcode"></div> <div class="up-text">支付二维码</div> </div> </div> </form> <div class="clearfix"></div> <div class="save-shop-message"> <button onclick="{save}">保 存</button> </div> <modal modal-width="" modal-height="" id="selectAddress"> <address-select></address-select> </modal>', '', '', function(opts) {
		var self = this;
		var hasTouch = !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch);
		var startEvt = hasTouch ? 'touchstart' : 'mousedown';
		var moveEvt = hasTouch ? 'touchmove' : 'mousemove';
		var endEvt = hasTouch ? 'touchend' : 'mouseup';

		self.relog = function(name) {
			utils.androidBridge(api.statisticalEvent,{eventId: 19})
		}

		this.openModal = function(id) {
			return function (e) {
				var item = e.item;
				$('#' + id)[0].open(item);
			}
		}.bind(this)

		self.openupQrcode = function () {
			utils.setTitle("#/shop/upqrcode", '支付二维码')
		}

		self.changeQrcode = function () {
			utils.setTitle("#/shop/userqrcode", '店铺推广二维码')
		}

		this.showSwitch = function(e) {
			if (self.message.showInfo) {
				var params = {
					show: false
				};
			} else {
				var params = {
					show: true
				};
			}

				httpGet({
					url: api.showAds,
					params: params,
					success: function (res) {
						console.log(res + '------');
						console.log(JSON.stringify(res) + '---------');
						console.log(res.data);
						store.storeMessage.get();
						setTimeout(function () {
							store.sys.sendMessage({updateStoreMessage: true});
						}, 500)
					}
				});

		}.bind(this)

		self.init = function () {
			flux.bind.call(self, {
				name: 'message',
				store: store.storeMessage,
				success: function () {
					self.historyMessageNotice = self.message.notice;
					$("#dp-startTime").get(0).setValue(self.message.startTime);
					$("#dp-endTime").get(0).setValue(self.message.endTime);
				}
			})
		}

		self.save = function () {
			var params = $('#shop-message-form').serializeObject();
			store.storeMessage.update(params);
			if(self.historyMessageNotice != params.notice){
				self.relog();
			}
		}

		self.on('mount', function () {
			self.init();

		});

});

riot.tag2('import-custom', '<div class="import-wraper"> <div class="step"> <p>插入U盘，下载Excel模板至U盘</p> <img src="imgs/udisk.png"> <button class="download-tpl"> <a onclick="{download}" target="_top">点击下载</a> </button> </div> <div class="step"> <p>在电脑端按照模板添加商品</p> <img src="imgs/computer.png"> <button class="add-goods">添加商品</button> </div> <div class="step"> <p>将制作好的Excel表导入</p> <img src="imgs/import-img.png"> <button class="import-excel">点击导入</button> </div> <div class="clearfix"></div> </div> <div class="import-text"> <span class="title">提示：</span> <span class="info">1.一次导入表格里的商品数量最多500条</span> <span class="info">2.表格中商品若和店铺现有商品冲突，会覆盖现有商品</span> <span class="info">3.商品条码不填则自动生成13位条码</span> <span class="info">4.表格中多个条码重复商品，取第一条数据</span> </div> <modal modal-width="" modal-height="" delete id="import-error" title="导入失败" nofooter buttonok> <import-error></import-error> </modal> <modal modal-width="" modal-height="" delete id="import-loading" title="导入进度" nofooter> <import-loading></import-loading> </modal>', '', '', function(opts) {
		var self = this;

		self.on('mount', function () {
			console.log("---------SimpleUpload-----------------");
			new uploader.SimpleUpload({
				button: $('.import-excel')[0],
				url: api.goodImport,
				name: 'uploadFile',
				responseType: 'json',
				debug: true,
				allowedExtensions:["xls","xlsx","xlsm"],
				maxSize:512,
				onChange: function (filename, extension, uploadBtn, fileSize, file) {
					console.log("-------------" + filename);
				},
				onSubmit: function (filename, extension) {
					console.log("---------import-loading-------------------");
					$("#import-loading")[0].open();
				},
				onComplete: function (filename, response) {
					if (parseInt(response.code, 10) === 1) {
						utils.toast('上传成功');
						$(".loading-text").text("正在同步商品");
						var param = {
							name: "Goods",
							noloadShow: true
						}
						store.synTask.get(param, function (success) {
							if (success) {
								console.log('------' + JSON.stringify(param));
								$("#import-loading")[0].close();
								utils.toast('同步成功');
								store.loadTopGoodsList = true;
							}
						});
					} else if (parseInt(response.code, 10) !== 1 && response.msg) {

						$("#import-loading")[0].close();
						$("#import-error")[0].open(response.msg);
					} else {
						$("#import-loading")[0].close();
						utils.toast('上传失败');
					}
				},
				onExtError:function(filename, extension){

					utils.toast('文件类型不正确');
				},
				onSizeError:function( filename, fileSize ){
					utils.toast('文件最大为512kb');
				},
				onError: function (filename, errorType, status, statusText, response, uploadBtn, fileSize) {
					$("#import-loading")[0].close();
					utils.toast('上传失败');
				}
			});
		});

		this.download = function(e) {
			store.importTemplate.get(function (data) {
				if (data && data.url) {
					store.downTemplateExcel.get({url: data.url});
				} else {
					utils.toast("暂无可用模版");
				}

			});
		}.bind(this)

		self.on('unmount', function () {});
});

riot.tag2('import-standard', '<div class="import-wraper"> <div class="step"> <h3>默认商品库</h3> <p style="text-align: center;">说明：常用商品库</p> <button>点击导入</button> </div> <div class="step"> <h3>小便利店商品库</h3> <p>说明：包含50万种商品。分为生 活用品、小吃零食、厨卫用品三 大类。</p> <button>点击导入</button> </div> <div class="step"> <h3>小商超商品库</h3> <p>说明：包含500万种商品。分为 香烟、酒水、副食、生鲜、水果、 粮油等二十大类。</p> <button>点击导入</button> </div> <div class="clearfix"></div> </div>', '', '', function(opts) {
});
riot.tag2('products', '<div class="products-new" id="productsNew"> <div class="products-top"> <div class="product-tool-bar"> <div class="sub-search"> <search opts="{searchOpts}"></search> </div> <div class="btn-group"> <button> <a onclick="{setTitle}">导入已有商品库</a> </button> </div> </div> <div class="category-content"> <ul class="product-class-wraper"> <li each="{category}" class="product-class {active: active}" onclick="{changeCate}"> <a>{cateName}</a> </li> <div class="clearfix"></div> </ul> </div> <div class="category-count"> <span class="line-left"></span> <span class="line-center">商品总数：{goodsCount}</span> <span class="line-right"></span> </div> </div> <ul class="product-item-wraper"> <li class="create-product" onclick="{openCreate}" if="{addproduct}"><img src="imgs/add-product.png"></li> <li class="product-item" each="{goodList}" onclick="{openDetail}"> <img riot-src="{imageUrl || \'imgs/default-product.png\'}"> <div class="product-summary"> <div class="product-name"> <span>{goodsName}</span> </div> <div class="product-attr"> <span>进价：</span> <span>{countPrice(purchasePrice)}</span> </div> <div class="product-attr"> <span>售价：</span> <span>{countPrice(price)}</span> </div> <div class="product-attr"> <span>库存：</span> <span>{stockNumber || 0}</span> </div> </div> </li> <div class="clearfix"></div> </ul> </div> <modal modal-width="" modal-height="" delete id="prodcut-detail" title="编辑商品"> <update-product></update-product> </modal> <modal modal-width="" modal-height="" id="create-product" title="添加商品" continue="继续添加"> <create-product></create-product> </modal> <modal modal-width="" modal-height="" id="input-barcode"> <input-barcode></input-barcode> </modal>', '', '', function(opts) {
		var self = this;
		self.next = 0;
		self.scrollLock = false;
		self.setTitle = function() {
			utils.setTitle("#/shop/import-custom", '导入已有商品库')
		}
		self.openDetail = function (e) {
			self.update()
			var item = e.item;
			$('#prodcut-detail')[0].open(item);
		}

		self.openModal = function (id) {
			return function (e) {
				var item = e.item;
				$('#' + id)[0].open(item);
			}
		}

		self.openCreate = function () {
			if (store.online) {
				$('#create-product')[0].open();
			} else {
				$('#input-barcode')[0].open();
			}
		}

		this.openModalwidthSearch = function(id) {
			return function (item) {
				$('#' + id)[0].open(item);
			}
		}.bind(this)

		self.createProductFromCode = function (number) {
			var curModal = $('#create-product');
			var cur = curModal[0];
			var styleInfo;
			if (cur.attributes && cur.attributes.getNamedItem) {
				styleInfo = cur.attributes.getNamedItem("style");
			}
			if (!styleInfo || (styleInfo.value && styleInfo.value.indexOf("display:flex;") < 0 && styleInfo.value.indexOf("display: flex;") < 0)) {
				$('#create-product')[0].open();
			}
			httpGet({
				url: api.goodBySpecBarcode,
				params: {
					barcode: number
				},
				success: function (res) {
					$('#create-product .barcode-input').val(number);
					$('#create-product [name="goodsName"]').val(res.data.goodsName);
					$('#create-product [name="cateId"]').val(res.data.cateId);
					if (res.data.imageUrl) {
						$('#create-product .img-area img').attr('src', res.data.imageUrl);
						$('#create-product-imgUrl').val(res.data.imageUrl);
					}
				},
				complete: function (status) {
					if (status == "error") {
						utils.toast("请检查网络");
					}
				}
			});
		}

		self.barcodeHandle = function () {
			var number = scanNumber;

console.log(number + "---------number--------");
			self.getGoodsInfo(number);
		}
		self.scan = function () {
			scanNumber = 132535
			window.dispatchEvent(new Event('inputNumber'));
		};

		self.getGoodsInfo = function (number) {
			if (!number) {
				$('#create-product')[0].open();
				return;
			}
			httpGet({
				url: api.goodByBarcode,
				params: {
					barcode: number
				},
				success: function (res) {
					if (res.data) {
						$('#prodcut-detail')[0].open(res.data);

					} else {
						self.createProductFromCode(number);
					}
				},
				error:function(err){
					if(err.code === 10007){
						utils.toast("请检查网络");
					}
				}
			});
		}

		self.initCategory = function () {
			flux.bind.call(self, {
				name: 'category',
				store: store.categoryAll,
				success: function () {
					self.addproduct = true;
					self.cateId = self.category[0].cateId;
					self.category[0].active = true;
					self.update();

					self.cateHeight = $(".products-new").height() - $(".products-top").height();
					$(".product-item-wraper").css("height", self.cateHeight);
					self.initGoods(self.cateId);
				}
			});
		}

		self.initGoods = function (cateId) {
			var params = {
				cateId: cateId,
				next: 0
			};
			self.getGoodsCount(cateId);
			flux.bind.call(self, {
				name: 'goods',
				store: store.goods,
				params: params,
				success: function () {
					var list = self.goods.list
					for (var i = 0; i < list.length; i++) {
						var stockNumber = list[i].stockNum
						list[i].stockNumber = stockNumber
						if(list[i].unit=='6' || list[i].unit=='9'){
							list[i].stockNumber = (list[i].stockNum / 1000).toFixed(3) * 1;
						}else if(list[i].unit=='7' || list[i].unit=='8'){
							list[i].stockNumber = (list[i].stockNum / 1000000).toFixed(3) * 1;
						}else if(list[i].unit=='5'){
							list[i].stockNumber = (list[i].stockNum / 1000000 * 2).toFixed(3) * 1;
						}
					}
					self.next = self.goods.next;
					self.goodList = list;
					self.update()
				}
			});
		}

		self.searchOpts = {
			clickHandle: self.openModalwidthSearch('prodcut-detail')
		};

		this.countPrice = function(price) {
			if (price) {
				return '￥' + price;
			}
		}.bind(this)

		self.on('mount', function () {
			self.initCategory();
			self.listenDown();
			window.addEventListener('inputNumber', self.barcodeHandle, false);
		});

		self.on('unmount', function () {
			window.removeEventListener('inputNumber', self.barcodeHandle);
			if (self.listWrap && self.scrollDown) {
				self.listWrap.removeEventListener('scroll', self.scrollDown);
			}
		})

		self.listenDown = function () {
			setTimeout(function () {
				self.listWrap = $('.product-item-wraper')[0];
				self.scrollDown = function (event) {
					var clientHeight = self.listWrap.clientHeight;
					var scrollTop = self.listWrap.scrollTop;
					if ((clientHeight + scrollTop) > self.listWrap.scrollHeight - 60) {

						if (self.next && !self.scrollLock) {
							self.scrollLock = true;
							store.goods.getMore({
								cateId: self.cateId,
								next: self.next
							}, function (next) {
								self.next = next;
								self.scrollLock = false;
							});
						}
					}
				};
				self.listWrap.addEventListener('scroll', self.scrollDown, false);
			}, 50);
		}

		self.getGoodsCount = function (cateId) {
			store.getGoodsCountByCateId.get({
				cateId: cateId
			}, function (data) {
				self.goodsCount = data;
				self.update();
			});
		}

		self.changeCate = function (e) {
			self.cateId = e.item.cateId;
			for (var i = 0; i < self.category.length; i++) {
				if (self.category[i].cateId == parseInt(self.cateId, 10)) {
					self.category[i].active = true;
				} else {
					self.category[i].active = false;
				}
				if (self.cateId === null) {
					self.category[0].active = true;
				}
			}
			self.getGoodsCount(self.cateId);

			store.goods.get({cateId: self.cateId, next: 0});
		}
});

riot.tag2('shop-qrcode', '<div class="qrcode-top"> <a onclick="{refresh}">刷新</a> </div> <div class="qrcode-wraper" id="container"> <div class="qrcode-item"> <h3>支付宝二维码</h3> <div class="exist-qrcode" tabindex="1"> <img riot-src="{qrCodeZfb || \'imgs/no-qrcode.png\'}" onerror="javascript:this.src=\'imgs/no-qrcode.png\'"> </div> </div> <div class="qrcode-item"> <h3>微信二维码</h3> <div class="exist-qrcode" tabindex="1"> <img riot-src="{qrCodeWx || \'imgs/no-qrcode.png\'}" onerror="javascript:this.src=\'imgs/no-qrcode.png\'"> </div> </div> <div class="clearfix"></div> </div> <div class="qrcode-wraper"> <div class="code"> <h3 class="title">上传支付二维码方法</h3> <h4>1.用手机扫描下方二维码进入上传页面</h4> <div class="img-code"> <img riot-src="{qrCodeDown}" onerror="javascript:this.src=\'imgs/no-qrcode.png\'"> </div> <h4>2.根据提示上传二维码</h4> <h4>3.上传成功后点击右上角"刷新"按钮刷新此页面</h4> </div> </div>', '', '', function(opts) {
		var self = this;
		if (window.Icommon) {

			self.qrCodeZfb = Icommon.fileRootPath + 'qrcode/zhifubao_' + Icommon.storeId + '.data?t=' + new Date().getTime();
			self.qrCodeWx = Icommon.fileRootPath + 'qrcode/weixin_' + Icommon.storeId + '.data?t=' + new Date().getTime();
			self.qrCodeDown = Icommon.fileRootPath + 'qrcode/scan_' + Icommon.storeId + '.data?t=' + new Date().getTime();
			self.update();
		}

		self.refresh = function(){
			self.init();
		}

		self.on('mount', function () {
			self.init();
		});
		self.init = function () {
			utils.androidBridge(api.payQrInfoGet,{},function(res){
				self.res = JSON.parse(res);
				self.qrCodeZfb = self.res.data.aliCode;
				self.qrCodeWx = self.res.data.weixinCode;
				self.qrCodeDown = self.res.data.scanCode;
				self.update();
			})
		}

});

riot.tag2('shop-userqrcode', '<div class="qrcode-top"> <a onclick="{refresh}">刷新</a> </div> <div class="qrcode-wraper"> <div class="qrcode-item"> <h3>店铺推广二维码</h3> <div class="exist-qrcode" tabindex="1"> <img riot-src="{message.qrCodePromotion || message.qrCode}"> </div> </div> </div> <div class="qrcode-wraper"> <div class="code"> <div class="title1">将店铺二维码更换或保存到手机的方法：</div> <div class="title2">用手机扫描下方二维码进入编辑页面</div> <div class="img-code"> <img riot-src="{message.qrCodePromotionUrl}"> </div> <div class="info active">更换二维码步骤：</div> <div class="info">根据提示在手机编辑页面更换二维码，然后点击"保存"</div> <div class="info">保存完毕之后， 在此页面点击"刷新"</div> <div class="info active">将网店二维码保存到手机步骤：</div> <div class="info">在手机编辑页面点击网店二维码，然后选择保存到相册</div> </div> </div>', '', '', function(opts) {
		var self = this;

		self.refresh = function(){
			store.synTask.get({name:"Store"},function(data){
				self.init();
			});
		}

		self.on('mount', function () {
			self.init();
		});

		self.init = function() {
			store.storeMessage.get({},function(data){
				self.message = data;
				self.update();
				setTimeout(function () {
					store.sys.sendMessage({updateStoreMessage: true});
				}, 500)
			});
		}
});

riot.tag2('income', '<div class="income-content"> <div class="income-top"> <a onclick="{goRecord}" class="{active: record}">发放记录</a> <a onclick="{goAccount}" class="{active:!record}">发放账户</a> </div> <div class="income-text"> <div class="left" id="incomeList"> <div class="income-record" if="{record}"> <h4>累计收入： <i>{totalPay}</i></h4> <h4>待支付收入：<i>{waitPay}</i></h4> <ul> <li each="{income}"> <div> <span>{title}</span> </div> <div> <span class="fl-left">{date}</span> <span class="fl-right">{income}</span> <span class="clear"></span> </div> </li> </ul> </div> <div class="income-account" if="{account}"> <ul> <li> <span class="fl-left">银行：</span> <span class="fl-right">{card.bankName}</span> <span class="clear"></span> </li> <li> <span class="fl-left">卡号：</span> <span class="fl-right">{card.cardCode}</span> <span class="clear"></span> </li> <li> <span class="fl-left">开户银行：</span> <span class="fl-right">{card.bankAddress}</span> <span class="clear"></span> </li> <li> <span class="fl-left">姓名：</span> <span class="fl-right">{card.name}</span> <span class="clear"></span> </li> </ul> <div class="button"> <a onclick="{editAccount}">修改</a> </div> </div> <div class="income-account-edit" if="{accountEdit}"> <ul> <li> <span class="fl-left">银行：</span> <span class="fl-right"> <input type="text" value="{card.bankName}" id="bankName"> </span> <span class="clear"></span> </li> <li> <span class="fl-left">卡号：</span> <span class="fl-right"> <input type="tel" value="{card.cardCode}" id="cardCode"> </span> <span class="clear"></span> </li> <li> <span class="fl-left">开户银行：</span> <span class="fl-right"> <input type="text" name="name" value="{card.bankAddress}" id="bankAddress"> </span> <span class="clear"></span> </li> <li> <span class="fl-left">姓名：</span> <span class="fl-right"> <input type="text" value="{card.name}" id="name"> </span> <span class="clear"></span> </li> </ul> <div class="button"> <a onclick="{saveAccount}">保存</a> </div> </div> </div> </div> </div> <pop id="popModifPhone" title="验证手机" twobutton suretext="下一步"> <pop-modify-phone></pop-modify-phone> </pop>', '', '', function(opts) {
  var self =this;
  self.record = true;
  self.account = false;
  self.accountEdit = false;
  self.update();
  self.page = 0;
  self.pageSize = 10;

  self.init = function(){
    var param = {
      next:0,
    }
    store.rewardIncomeList.get(param,function(data){
      self.income = data.list;
      self.next = data.next;
      self.totalPay = data.totalPay;
      self.waitPay = data.waitPay;
      self.update();
    });
  }

  self.scrollLock = false;
  self.listenDown = function () {
      setTimeout(function () {
          self.listWrap = $('#incomeList')[0];
          self.scrollDown = function (event) {
              var clientHeight = self.listWrap.clientHeight;
              var scrollTop = self.listWrap.scrollTop;
              if ((clientHeight + scrollTop) > self.listWrap.scrollHeight - 60) {
                  if (self.next && !self.scrollLock) {
                      self.scrollLock = true;
                      store.rewardIncomeList.get({
                          next: self.next
                      }, function (data) {
                          self.next = data.next;
                          self.income = self.income.concat(data.list);
                          self.scrollLock = false;
                          self.update();
                      });
                  }
              }
          };
          self.listWrap.addEventListener('scroll', self.scrollDown, false);
      }, 50);
  }

  self.editAccount = function(){
    store.changeCardCodeSend.get(function(data){
      var param = {
        incomePhone:data.phoneMobile,
        type:2
      }
      $("#popModifPhone")[0].open(param);
    });
  }

  self.saveAccount = function(){
    var param ={
      bankName:$("#bankName").val(),
      cardCode:$("#cardCode").val(),
      bankAddress:$("#bankAddress").val(),
      name:$("#name").val()
    };
    if (!param.bankName) {
      utils.toast("请填写银行");
      return;
    }
    if (!param.cardCode) {
      utils.toast("请填写卡号");
      return;
    }
    if (param.cardCode.length < 15 || param.cardCode.length > 19) {
      utils.toast("银行卡号长度必须在15到19之间");
      return;
    }
    var num = /^\d*$/;
    if (!num.exec(param.cardCode)) {
      utils.toast("银行卡号必须全为数字");
      return;
    }
    if (!param.bankAddress) {
      utils.toast("请填写开户银行地址");
      return;
    }
    if (!param.name) {
      utils.toast("请填写姓名");
      return;
    }
    param.cardId = self.card.cardId;
    store.bankCardUpdate.get(param,function(data){
      self.account = true;
      self.accountEdit = false;
      self.update();
      self.goAccount();
    });
  }

  self.goRecord = function(){
    self.record = true;
    self.account = false;
    self.accountEdit = false;
    self.update();
  }

  self.goAccount = function(){
    store.bankCard.get(function(data){
      if (data.status == 1) {
        self.record = false;
        self.account = true;
        self.card = data;
        self.accountEdit = false;
        self.update();
      }else {
        utils.toast("还未绑定银行卡");
      }
    });
  }

  self.on('mount', function() {
    self.init();
    self.listenDown();
  });
  self.on('unmount', function () {
      if (self.listWrap && self.scrollDown) {
          self.listWrap.removeEventListener('scroll', self.scrollDown);
      }
  })
});


riot.tag2('reward', '<div class="reward"> <div class="reward-top"> <a onclick="{shopIncome}">奖励收入</a> </div> <div class="reward-list"> <ul if="{reward.length > 0}"> <li class="{classli}" each="{reward}"> <div class="icon"></div> <h5>{title}{desc}</h5> <div class="look-div" onclick="{popReInfo}"> <a class="look-a">查看</a> </div> </li> <div class="clear"></div> </ul> <div class="none-list" if="{reward.length <= 0}"> <div class="none-list-text"> 暂无奖励 </div> </div> </div> </div> <pop id="popAppInfo" title="应用奖励详情" onebutton> <pop-app-reward-desc></pop-app-reward-desc> </pop> <pop id="popCouponInfo" title="优惠券奖励详情" onebutton> <pop-coupon-reward></pop-coupon-reward> </pop> <pop id="popAdInfo" title="广告奖励详情" onebutton> <pop-ad-reward></pop-ad-reward> </pop> <pop id="popGlobalInfo" title="全球购奖励详情" onebutton> <pop-global-reward></pop-global-reward> </pop> <pop id="popModifPhone" title="验证手机" twobutton suretext="下一步"> <pop-modify-phone></pop-modify-phone> </pop> <pop id="popAddCard" title="设置发放账户" twobutton suretext="完成"> <pop-add-card></pop-add-card> </pop>', '', '', function(opts) {
        var self = this;
        self.next = 0;

        self.popReInfo = function (e) {
            if (e.item.type == 0) {
                $("#popCouponInfo")[0].open(e.item);
            } else if (e.item.type == 1) {
                $("#popAppInfo")[0].open(e.item);

            } else if (e.item.type == 2){
                $("#popAdInfo")[0].open(e.item);

            }else if (e.item.type == 3){
                $("#popGlobalInfo")[0].open(e.item);
            }
        }

        self.init = function () {
            var params = {
                next: self.next
            }
            store.reward.get(params, function (data) {
                self.next = data.next;
                self.reward = data.list;
                self.update();
            });
        }

        self.shopIncome = function(){
          store.bankCard.get(function(data){

            if (data.status == 1) {
              location.href="#/shop/income";
            }else {
              self.incomePhone=data.phoneMobile;
              store.changeCardCodeSend.get(function(data){
                var param = {
                  incomePhone:data.phoneMobile,
                  type:1
                }
                $("#popModifPhone")[0].open(param);
              });
            }
          });
        }

        self.addCard = function(){
          $("#popAddCard")[0].open();
        }

        self.scrollLock = false;
        self.listenDown = function () {
            setTimeout(function () {
                self.listWrap = $('.reward-list')[0];
                self.scrollDown = function (event) {
                    var clientHeight = self.listWrap.clientHeight;
                    var scrollTop = self.listWrap.scrollTop;
                    if ((clientHeight + scrollTop) > self.listWrap.scrollHeight - 60) {
                        if (self.next && !self.scrollLock) {
                            self.scrollLock = true;
                            store.reward.get({
                                next: self.next
                            }, function (data) {
                                self.next = data.next;
                                self.reward = self.reward.concat(data.list);
                                self.scrollLock = false;
                                self.update();
                            });
                        }
                    }
                };
                self.listWrap.addEventListener('scroll', self.scrollDown, false);
            }, 50);
        }

        self.on('mount', function () {
            self.init();
            self.listenDown();
        });

        self.on('unmount', function () {
            if (self.listWrap && self.scrollDown) {
                self.listWrap.removeEventListener('scroll', self.scrollDown);
            }
        })
});

riot.tag2('return-order', '<div class="calendar-bar"> <span class="prev-day" onclick="{prevDay}">前一天</span> <date-picker></date-picker> <span class="next-day" onclick="{nextDay}">后一天</span> <a class="switch" onclick="{setTitle}" if="{type==2}">结算单</a> </div> <div class="half"> <div class="card"> <div class="order-overview"> <div> <dt>退款额：</dt><dd>￥{amount}</dd> </div> <div class="sum"> <span>共</span> <span class="number">{orderCount}</span> <span if="{type==2}">笔退货单</span> </div> </div> <div class="order-list-wraper"> <ul class="order-list"> <li each="{orderList}" class="{active: active}" onclick="{chooseOrder}"> <div> <span>{billSn}</span> <span style="float: right;">{getTimeStr(addTime)}</span> </div> <div> <span style="padding-right: 1.296296rem"> <span>退款：</span> ￥{amount} </span> <span if="{type==1}">利润：￥{profit}</span> </div> <div>{stockAddMap(stockAdd)}</div> </li> </ul> </div> </div> </div> <div class="half"> <div class="card order-detail-wraper" if="{currentOrder}"> <div class="order-base"> <h4 onclick="{print}"> {orderDetail.billSn} </h4> <div class="order-time"> 时间：{getDateTimeStr(orderDetail.addTime)} </div> <div class="order-handle"> <span>收银员：{orderDetail.personName || \'未知\'}</span> <span class="pull-right">{stockAddMap(orderDetail.stockAdd)}</span> </div> </div> <div class="order-detail-list"> <li> <span style="width: 11%">项</span> <span style="width: 42%">品名</span> <span style="width: 14%">数量</span> <span style="width: 14%">单价</span> <span style="width: 14%">小计</span> </li> <ul> <li each="{item in orderDetail.list}"> <span style="width: 11%">{orderDetail.list.indexOf(item) + 1}</span> <span style="width: 42%">{item.goodsName || \' \'}</span> <span style="width: 14%">{item.quantity || \' \'}</span> <span style="width: 14%">{item.price || \' \'}</span> <span style="width: 14%">{item.amount || \' \'}</span> </li> </ul> </div> <div class="return-order-summary"> <div> <span>总项：{orderDetail.list.length}</span> <span class="pull-right">总金额：<b>￥{orderDetail.amount}</b></span> </div> <div> <span>总数：{countNumber(orderDetail.list)}</span> </div> </div> </div> </div>', '', '', function(opts) {
        var self = this;
        self.getType = function() {
            if (location.hash.match(/\/shop\/sales-order/)) {
                self.type = 1;
            }
            else if ( location.hash.match(/\/shop\/return-order/) ){
                self.type = 2;
            }
        }

        self.getType();

        self.changeType = function() {
            var date = self.getDateStr(new Date().getTime());
            var oldType = self.type;
            self.getType();
            if (oldType !== self.type) {
                self.currentOrder = null;
                flux.update(store.salesOrder, { type: self.type, date: date });
            }
        }

        self.paymentTypeMap = function(type) {
            switch (type) {
                case 1:
                    return '现金';
                    break;
                case 2:
                    return '支付宝';
                    break;
                case 3:
                    return '微信支付';
                    break;
                case 4:
                    return '刷卡';
                    break;
                default:
                    return '现金';
            }
        }

        self.stockAddMap = function(type) {
            switch (type) {
                case 0:
                    return '未增加库存';
                    break;
                case 1:
                    return '已增加库存';
                    break;
                default:
                    return '未增加库存';
            }
        }

        self.getDateStr = function(time) {
            return utils.getDateStr(time);
        }

        self.getTimeStr = function(time) {
            return utils.getTimeStr(time);
        }

        self.getDateTimeStr = function(time) {
            return utils.getDateTimeStr(time);
        }

        self.countNumber = function(arr) {
            var number = 0;
            arr.forEach(function(item) {
                if (item.quantity) {
                    number = number + item.quantity;
                }
            });
            return number;
        }

        self.print = function(e) {

            httpGet({
                url: api.printBill,
                params: { billUuid: self.currentOrder.billUuid },
                success: function(res) {
                }
            });
        }

        self.init = function() {
            var date = self.getDateStr(new Date().getTime());
            flux.bind.call(self, {
                name: 'orders',
                store: store.salesOrder,
                params: { type: self.type, date: date },
                success: function() {

                    self.amount = self.orders.amount;
                    self.profit = self.orders.profit;
                    self.orderList =  self.orders.list;
                    self.orderCount = self.orders.list.length;
                    self.update();
                }
            });
        }

        self.getDetail = function(uuid) {
            httpGet({
                url: api.orderGoods,
                params: {billUuid: uuid, type: self.type},
                success: function(res) {
                    self.orderDetail = res.data;
                    self.update();
                }
            });
        }
        self.setTitle = function() {
          utils.setTitle("#/shop/sales-order", '结算单')
    		}
        self.chooseOrder = function(e) {
            self.orderList.forEach(function(item) {
                item.active = false;
            });
            e.item.active = true;
            self.currentOrder = e.item;
            var uuid = self.currentOrder.billUuid || self.currentOrder.refundBillUuid;
            self.getDetail(uuid);
            self.update();
        }

        self.nextDay = function() {
            self.currentOrder = null;
            $(self.root).find('date-picker')[0].nextDay();
        }

        self.prevDay = function() {
            self.currentOrder = null;
            $(self.root).find('date-picker')[0].prevDay();
        }

        self.on('dateChange', function() {
            var date = $(self.root).find('date-picker')[0].value;
            flux.update(store.salesOrder, { type: self.type, date: date });
        });

        self.on('mount', function() {
			self.init();

        });

});

riot.tag2('sales-order', '<div class="calendar-bar"> <span class="prev-day" onclick="{prevDay}">前一天</span> <date-picker></date-picker> <span class="next-day" onclick="{nextDay}">后一天</span> <a class="switch" onclick="{setTitle}" if="{type==1}">退货单</a> </div> <div class="half"> <div class="card"> <div class="order-overview"> <div> <dt>结算额：</dt><dd>￥{amount}</dd> </div> <div if="{type==1 && viewProfit}"> </div> <div class="sum"> <span>共</span> <span class="number">{orderCount}</span> <span>笔结算单</span> </div> </div> <div class="order-list-wraper"> <ul class="order-list"> <li each="{orderList}" class="{active: active}" onclick="{chooseOrder}"> <div> <span>{billSn}</span> <span style="float: right;">{getTimeStr(addTime)}</span> </div> <div> <span style="padding-right: 1.296296rem"> <span>收银：</span> ￥{amount} </span> <span if="{viewProfit}">利润：￥{profit}</span> </div> <div> 支付方式：{paymentTypeMap(paymentType)} </div> </li> </ul> </div> </div> </div> <div class="half"> <div class="card order-detail-wraper" if="{currentOrder}"> <div class="order-base"> <h4 onclick="{print}"> {orderDetail.billSn} </h4> <div class="order-time"> 时间：{getDateTimeStr(orderDetail.addTime)} </div> <div class="order-handle"> <span>收银员：{orderDetail.personName || \'未知\'}</span> <span class="pull-right">支付方式：{paymentTypeMap(orderDetail.paymentType)}</span> </div> </div> <div class="order-detail-list"> <li> <span style="width: 9%">项</span> <span style="width: 34%">品名</span> <span style="width: 13%">数量</span> <span style="width: 13%">单价</span> <span style="width: 13%">小计</span> <span style="width: 12%" if="{viewProfit}">利润</span> </li> <ul> <li each="{item in orderDetail.list}"> <span style="width: 9%">{orderDetail.list.indexOf(item) + 1}</span> <span style="width: 34%">{item.goodsName || \'无码商品\'}</span> <span style="width: 13%">{item.weight || \' \'}</span> <span style="width: 13%">{item.price || \' \'}</span> <span style="width: 13%">{item.amount || \' \'}</span> <span style="width: 12%" if="{viewProfit}">{item.profit || 0}</span> </li> </ul> </div> <div class="order-sales-detail"> <div class=""> <span>总项：{orderDetail.list.length} 总数：{countNumber(orderDetail.list)}</span> <span class="pull-right">总金额：￥{orderDetail.goodsAmount}</span> </div> <div class=""> <span>折扣：{(orderDetail.discountPct || 100) + \'%\'}</span> <span class="pull-right" if="{orderDetail.couponAmount}">优惠券：<b>-¥{orderDetail.couponAmount}</b></span> </div> </div> <span>实收：<b>￥{orderDetail.amount}</b></span> <span class="pull-right" if="{viewProfit}">总利润：<b>￥{orderDetail.profit}</b></span> </div> </div> </div> </div>', '', '', function(opts) {
		var self = this;

		self.viewProfit = true;
		self.getType = function() {
			if (location.hash.match(/\/shop\/sales-order/)) {
				self.type = 1;
			}
			else if ( location.hash.match(/\/shop\/return-order/) ){
				self.type = 2;
			}
		}

		self.getType();

		self.changeType = function() {
			var date = self.getDateStr(new Date().getTime());
			var oldType = self.type;
			self.getType();
			if (oldType !== self.type) {
				self.currentOrder = null;
				flux.update(store.salesOrder, { type: self.type, date: date });
			}
		}

		self.paymentTypeMap = function(type) {
			switch (type) {
				case 1:
					return '现金';
					break;
				case 2:
					return '支付宝';
					break;
				case 3:
					return '微信支付';
					break;
				case 4:
					return '刷卡';
					break;
				default:
					return '现金';
			}
		}

		self.stockAddMap = function(type) {
			switch (type) {
				case 0:
					return '未增加库存';
					break;
				case 1:
					return '已增加库存';
					break;
				default:
					return '未增加库存';
			}
		}

		self.getDateStr = function(time) {
			return utils.getDateStr(time);
		}

		self.getTimeStr = function(time) {
			return utils.getTimeStr(time);
		}

		self.getDateTimeStr = function(time) {
			return utils.getDateTimeStr(time);
		}

		self.countNumber = function(arr) {
			var number = 0;
			arr.forEach(function(item) {
				if (item.weight) {
					number = number + item.weight;

					number = number.toFixed(3) * 1;

				}
			});
			return number;
		}

		self.print = function(e) {

			httpGet({
				url: api.salePrintBill,
				params: { billUuid: self.currentOrder.billUuid },
				success: function(res) {
	            }
	        });
		}
		self.init = function() {
			var date = self.getDateStr(new Date().getTime());
			flux.bind.call(self, {
				name: 'orders',
				store: store.salesOrder,
				params: { type: self.type, date: date },
				success: function() {

					self.amount = self.orders.amount;
					self.profit = self.orders.profit;
					self.orderList =  self.orders.list;
					self.orderCount = self.orders.list.length;
					self.update();
				}
			});
		}

		self.getDetail = function(uuid) {
			store.orderGoods.getGoodsDetail({billUuid: uuid, type: self.type},function(data){
				self.orderDetail = data;
				self.update();
			})

		}
		self.setTitle = function() {
			utils.setTitle("#/shop/return-order", '退货单')
		}
		self.chooseOrder = function(e) {
			self.orderList.forEach(function(item) {
				item.active = false;
			});
			e.item.active = true;
			self.currentOrder = e.item;
			var uuid = self.currentOrder.billUuid || self.currentOrder.refundBillUuid;
			self.getDetail(uuid);

			self.update();
		}

		self.checkAuth = function() {
			httpGet({
                url: api.auth,
                success: function(res) {
                    self.auth = res.data.permissionCodes.split(',');
                   	if (self.auth.indexOf('32') < 0) {
                        self.viewProfit = false;
                    }
                    self.update();
                }
            });
		}

		self.nextDay = function() {
			self.currentOrder = null;
			$(self.root).find('date-picker')[0].nextDay();
		}

		self.prevDay = function() {
			self.currentOrder = null;
			$(self.root).find('date-picker')[0].prevDay();
		}

		self.on('dateChange', function() {
			var date = $(self.root).find('date-picker')[0].value;
			flux.update(store.salesOrder, { type: self.type, date: date });
		});

		self.on('mount', function() {
			self.init();
			self.checkAuth();

		});

});

riot.tag2('life-service', '<ul> <li class="serviceItem" each="{list}" onclick="{}" if="{show}"> <a> <img riot-src="{img}"> <div>{name}</div> </a> </li> <div class="clearfix"></div> </ul>', '', '', function(opts) {
  var self = this;
    self.list = [
      {  name: '洗衣', img: 'imgs/loundry-service.png', link: '#/shop/sales-order', show:true },
      {  name: '鲜花', img: 'imgs/flower.png', link: '#/shop/products', show:true },
      {  name: '蛋糕', img: 'imgs/cake.png', link: '#/shop/storage', show:true },
      {  name: '快递', img: 'imgs/post.png', link: '#/shop/chart' , show:true},
      {  name: '家政', img: 'imgs/house-service.png', link: '#/shop/device', show:true },

      {  name: '话费充值', img: 'imgs/phone-free.png', link: '#/shop/employee', show:true},
      {  name: '水费', img: 'imgs/water-free.png', link: '#/shop/message', show:true },
      {  name: '电费', img: 'imgs/elec-free.png', link: '#/shop/attain', show:true },
      {  name: '燃气费', img: 'imgs/gap.png', link: '#/shop/reward', show:true },
      {  name: '有线电视', img: 'imgs/line-TV.png', link: '#/shop/coupon', show:true },

      {  name: '固话宽带', img: 'imgs/bind-free.png', link: '#/shop/service', show:true },
      {  name: '物业费', img: 'imgs/property.png', link: '#/shop/coupon', show:true },
      {  name: '火车票', img: 'imgs/train-ticket.png', link: '#/shop/coupon', show:true },
      {  name: '汽车票', img: 'imgs/car-ticket.png', link: '#/shop/coupon', show:true },
      {  name: '租车', img: 'imgs/rent-car.png', link: '#/shop/coupon', show:true },

      {  name: '医院挂号', img: 'imgs/line-num.png', link: '#/shop/coupon', show:true }
  ];
  self.noAuthTip = function(e) {
      // self.log(e.item.logName);
          location.href = e.item.link;
          return true;
  }
  self.on('mount',function(){
    $('.serviceItem').each(function(){
      $(this).on('click',function(){
        utils.toast('该地区尚未开通');
      })
    })
  })
});

riot.tag2('storage-in', '<div class="storage-in"> <div class="storage-top"> <div class="search"> <search opts="{searchOpts}"></search> </div> <div class="supplier"> <div class="business">供货商:</div> <div class="select" onclick="{supplier}"> <span id="selectSupplierName">无</span> <input type="hidden" id="selectSupplierId"> <div class="icon-down"></div> <div class="drop-down display-none"> <span each="{supplierList}" onclick="{selectSupplier}">{supplierName}</span> </div> </div> <div class="clear"></div> </div> </div> <div class="storage-content"> <div class="storage-product"> <div class="product-li" if="{goods.length>0}"> <ul> <li each="{goods}" onclick="{forDetail}" class="{active:active}"> <div class="img"><img alt="" riot-src="{imageUrl  || \'imgs/default-product.png\'}"> </div> <div class="info"> <h3>{goodsName}</h3> <h2>￥{purchasePrice}</h2> </div> <div class="add-less"> <div class="less" onclick="{decrGoods}"></div> <div class="input">{weight}</div> <div class="add" onclick="{incrGoods}"></div> <div class="clear"></div> </div> <div class="total">小计：￥{amount}</div> </li> </ul> </div> <div class="billing pro-li" if="{goods.length>0}"> <ul> <li>品类：{categoryNum}</li> <li>总数：{quantity}</li> <li>合计进价：<i>￥{goodsAmount}</i> </li> </ul> </div> </div> <div class="storage-detail"> <div class="s-pro-d" style="display: none"> <div class="img"><img alt="" riot-src="{detail.imageUrl  || \'imgs/default-product.png\'}"> </div> <div class="name">{detail.goodsName}</div> <div class="billing"> <ul> <li>进价：<i>￥{detail.purchasePrice}</i> </li> <li if="{type==1}">入库数量：<input class="quantity-change" style="width:60%;" type="text" name="name" value="{detail.weight}" onclick="{modifyStorage}"></li> <li if="{type==2}">出库数量：<input class="quantity-change" style="width:60%;" type="text" name="name" value="{detail.weight}" onclick="{modifyStorage}"></li> <li style="display:none;">cateId:<i>￥{detail.cateId}</i> <li style="display:none;">goodsUuid:<i class="thisgoodsUuid">{detail.goodsUuid}</i> <li style="display:none;">type:<i>￥{type}</i> </ul> </div> </div> <div class="st-button"> <a class="{disable: (!quantity && quantity!=0)}" onclick="{commit}"> <i if="{type==1}">生成入库单</i> <i if="{type==2}">生成出库单</i> </a> </div> </div> <div class="clear"></div> </div> <modal if="{type==1}" id="modifyStorageInqu" modal-width="500px" opts="{modifyStorageInOpts}"> <div class="wrap"> <div class="content"> <label for="">入库数量：</label> <input id="" type="tel" maxlength="9"> </div> </div> </modal> <modal if="{type==2}" id="modifyStorageInqu" modal-width="500px" opts="{modifyStorageInOpts}"> <div class="wrap"> <div class="content"> <label for="">出库数量：</label> <input id="" type="tel" maxlength="9"> </div> </div> </modal> <modal id="storage-warning" modal-width="200px" modal-height="80px" nofooter> <p class="warning-text">{parent.warningText}</p> </modal> <modal id="storage-warning-han" modal-width="430px" modal-height="80px" nofooter> <p class="warning-text">{parent.warningText1}</p> </modal> <modal id="storageAddPurchasePrice" modal-width="" modal-height=""> <add-price></add-price> </modal> </div>', '', '', function(opts) {
		var self = this;
		var params = riot.routeParams.params;
		var type = params.type;
		self.type = type;
		var stockChangeApi = '';

		flux.bind.call(self, {
			name: 'stock',
			store: store.stock,
			success: function (data) {
				self.update();
			}
		});
		this.selectSupplier = function(e) {
			$("#selectSupplierName").text(e.item.supplierName);
			$("#selectSupplierId").val(e.item.supplierId);
		}.bind(this)

		self.scanCodeStorage = function () {

			var number = scanNumber;

			httpGet({
				url: api.gooduuidByBarcode,
				params: {
					barcode: number
				},
				success: function (res) {
					if (res && res.data && res.data.goodsUuid) {
						self.goodsAdd(res.data);
					} else {
						warningHan("商品未建档，请先在“店铺”-“商品”处添加该商品");
					}
				}
			});
		}
		self.modifyStorageInOpts = {
 				onOpen: function () {

 				},
 				onSubmit: function(){
 					self.submitModifyStorage();
 				},
 				onClose: function(){
 					$('#modifyStorageInqu').find('input').val('');
 				}
 		};
		self.submitModifyStorage = function () {
 			var quantity = $('#modifyStorageInqu').find('input').val() * 1;
 			var unit = self.detail.unit;
 			if (unit == 5 || unit == 6 || unit == 7 || unit == 8 ||unit == 9) {
 				if (!/^[0-9]+([.]{1}[0-9]{1,3})?$/.test(quantity)) {

 					utils.toast("请输入正确的数量")
 					return
 				}else if (quantity == 0) {
					for (var i = 0; i < self.goods.length; i++) {
						if (self.goods[i].goodsUuid == self.detail.goodsUuid) {
							self.goods.splice(i, 1);
							$(".s-pro-d").hide();

							if (self.goods && self.goods.length > 0) {

								self.update();

							} else {
								$(".s-pro-d").hide();
							}
						}
					}
				}
 			} else {
 				if (!/^(0|\+?[1-9][0-9]*)$/.test(quantity)) {

 					utils.toast("请输入正确的数量")
 					return
 				}else if (quantity == 0) {
					for (var i = 0; i < self.goods.length; i++) {
						if (self.goods[i].goodsUuid == self.detail.goodsUuid) {
							self.goods.splice(i, 1);
							$(".s-pro-d").hide();

							if (self.goods && self.goods.length > 0) {

								self.update();

							} else {
								$(".s-pro-d").hide();
							}
						}
					}
				}
 			}

 			var params = {
 				goodsUuid: self.detail.goodsUuid,
				weight: quantity,
				type: type
 			};
 			self.update();
 			$('#modifyStorageInqu')[0].close();
 			httpPost({
 					url: api.stockChangeNum,
 					params: params,
 					success: function(res) {
						self.categoryNum = res.data.categoryNum;
						self.detail.weight = res.data.weight;
						self.quantity = (res.data.quantity).toFixed(3);
						self.goodsAmount = res.data.goodsAmount;
						self.detail.amount = res.data.amount;

						self.update();

 					}
 			});

 			$('#modifyStorageInqu').find('input').val('');
 		}

		function warning(text) {
			var layer = $('#storage-warning')[0];

			self.warningText = text;
			self.update();

			layer.open();
			setTimeout(function () {
				layer.close();
			}, 1000);
		}

		function warningHan(text) {
			var layer = $('#storage-warning-han')[0];

			self.warningText1 = text;
			self.update();

			layer.open();
			setTimeout(function () {
				layer.close();
			}, 2000);
		}

		this.commit = function(e) {
			if (!self.quantity) {
				return;
			} else {
				var param = {
					type: type
				};
				param.supplierId = $("#selectSupplierId").val();
				store.stockCommit.get(param, function (data) {

					if (type == 1) {
						warning('入库单已生成');
					} else {
						warning('出库单已生成');
					}
					self.goods = [];
					self.detail = "";
					self.goodsAmount = '';
					self.quantity = '';
					self.weight = '';
					self.categoryNum = '';
					$(".s-pro-d").hide();
					self.update();
					httpGet({
							url: api.synTask,
							params: {name: "Goods"},
							success: function(res) {
							},
					});

				});
			}
		}.bind(this)

		this.supplier = function(e) {
			$(".drop-down").toggleClass("display-none");
		}.bind(this)

		this.incrGoods = function(e) {
			var param = {
				goodsUuid: e.item.goodsUuid,
				type: type
			};
			store.stockIncr.get(param, function (data) {
				self.goodsAmount = data.goodsAmount;
				self.quantity = (data.quantity).toFixed(3);
				self.categoryNum = data.categoryNum;
				e.item.weight = data.weight;
				e.item.amount = data.amount;
				e.item.subtotal = (e.item.weight * e.item.purchasePrice).toFixed(2);
				self.update();
			});
		}.bind(this)

		this.decrGoods = function(e) {
			var param = {
				goodsUuid: e.item.goodsUuid,
				type: type
			};
			store.stockDecr.get(param, function (data) {
				self.goodsAmount = data.goodsAmount;
				self.quantity = (data.quantity).toFixed(3);

				self.categoryNum = data.categoryNum;

				e.item.weight = data.weight;
				e.item.amount = data.amount;

				e.item.subtotal = (e.item.weight * e.item.purchasePrice).toFixed(2);
				if (e.item.weight == 0) {
					for (var i = 0; i < self.goods.length; i++) {
						if (self.goods[i].goodsUuid == e.item.goodsUuid) {
							self.goods.splice(i, 1);
							if (self.goods && self.goods.length > 0) {
								self.detail = self.goods[0];
								self.update();
								$(".product-li ul li").eq(0).addClass("active");
							} else {
								$(".s-pro-d").hide();
							}
						}
					}
				}
				self.update();
			});
		}.bind(this)

		this.forDetail = function(e) {
			$(".product-li ul li").removeClass("active");
			$(e.currentTarget).addClass("active");
			$(".s-pro-d").show();
			self.detail = e.item;
			if (self.detail.imageUrl) {
				if(self.detail.imageUrl.indexOf('bqmart') < 0){
					self.detail.imageUrl = e.item.imageUrl.replace('-min', '-normal');
				}
			}

		}.bind(this)

		flux.bind.call(self, {
			name: 'supplierList',
			store: store.supplierList,
			params: {},
			success: function () {
				self.update();
			}
		});
		this.getGoods = function() {
			return function (item) {
				self.goodsAdd(item);
			}
		}.bind(this)

		self.searchOpts = {
			clickHandle: self.getGoods()
		};
		self.modifyStorage = function () {
 			$('#modifyStorageInqu')[0].open();
 			$('#modifyStorageInqu').find('input').focus();
 		}

		self.on('mount', function () {
			store.stockCommit.clear({type: type});
			window.addEventListener('inputNumber', self.scanCodeStorage, false);
		});
		self.on('unmount', function () {
			store.stockCommit.clear({type: type});
			window.removeEventListener('inputNumber', self.scanCodeStorage);
		})

		self.updatePrice = function (data) {
			var params = {

			}

		}

		self.goodsAdd = function (e) {
			var param = {
				type: type
			};
			param.goodsUuid = e.goodsUuid;
			store.stockAdd.get(param, function (data) {

				if (data.goods.purchasePrice === null ) {
					var para = {
						goodsUuid: data.goods.goodsUuid,
						type: type
					};
						store.stockDecr.get(para,function() {
							$("#storageAddPurchasePrice")[0].open(data.goods);
							self.update();
						});
						return;
				}
				self.categoryNum = data.categoryNum;
				self.quantity = (data.quantity).toFixed(3);
				self.weight = data.weight;
				self.amount = data.amount;
				self.goodsAmount = data.goodsAmount;
				var goods = false;
				if (self.goods && self.goods.length > 0) {
					goods = true;
				} else {
					self.goods = [];
				}
				if (goods) {
					var hasSame = false;

					for (var i = 0; i < self.goods.length; i++) {
						if (self.goods[i].goodsUuid == data.goods.goodsUuid) {
							if (data.goods.imageUrl) {
								if(data.goods.imageUrl.indexOf('bqmart') < 0){
									data.goods.imageUrl = data.goods.imageUrl.split("?")[0] + "-min";
								}
							}
							data.goods.subtotal = (data.goods.weight * data.goods.purchasePrice).toFixed(2);
							self.goods[i] = data.goods;
							self.detail = self.goods[i]
							if(self.detail.goodsUuid = self.goods[i].goodsUuid){
								self.detail.weight = self.goods[i].weight;
								self.detail.amount = self.goods[i].amount;
								self.detail = self.goods[i];
							}

							$(".product-li ul li").removeClass("active");

							hasSame = true;
						}
					}
					if (!hasSame) {
						var newList = [];
						data.goods.subtotal = (data.goods.weight * data.goods.purchasePrice).toFixed(2);

						if (data.goods.imageUrl) {
							if(data.goods.imageUrl.indexOf('bqmart') < 0){
								data.goods.imageUrl = data.goods.imageUrl.split("?")[0] + "-min";
							}
						}
						newList.push(data.goods);
						self.goods = self.goods.concat(newList);
					}
				} else {
					data.goods.subtotal = (data.goods.weight * data.goods.purchasePrice).toFixed(2);
					if (data.goods.imageUrl) {
						if(data.goods.imageUrl.indexOf('bqmart') < 0){
							data.goods.imageUrl = data.goods.imageUrl.split("?")[0] + "-min";
						}
					}
					self.goods.push(data.goods);
					self.detail = self.goods[0];
					if (self.detail.imageUrl) {
						if(self.detail.imageUrl.indexOf('bqmart') < 0){

							self.detail.imageUrl = self.goods[0].imageUrl.replace('-min', '-normal');
						}
					}
					$(".s-pro-d").show();
					self.goods[0].active = true;
				}
				console.log(self.goods);
				self.update();
			});
		}

});

riot.tag2('storage-index', '<ul> <li each="{list}"> <a onclick="{linkUrl}"> <img riot-src="{img}"> <div>{name}</div> </a> </li> </ul>', '', '', function(opts) {
        var self = this;
        self.list = [
            {  name: '入库', img: 'imgs/import.png', link: '#/shop/storagein' ,loginName:'0401'},
            {  name: '出库', img: 'imgs/export.png', link: '#/shop/storageout',loginName:'0402' },
            {  name: '单据', img: 'imgs/shop-order.png', link: '#/shop/receipt' ,loginName:'0403'},
            {  name: '供货商', img: 'imgs/supplier.png', link: '#/shop/supplier' ,loginName:'0404'}
        ]

        this.linkUrl = function(e){
            self.log(e.item.loginName);
						location.href = e.item.link;
						utils.setTitle(e.item.link, e.item.name)
        }.bind(this)

        self.log = function(name) {
					utils.androidBridge(api.logEvent,{eventId: name})
        }

});

riot.tag2('storage-receipt', '<div class="storage-receipt"> <div class="calendar-bar"> <div class="chart-dater"><daterangepicker></daterangepicker></div> </div> <div class="receipt-content"> <div class="receipt-left"> <div class="re-top"> <a class="{active:active}" each="{tag}" onclick="{stockList}">{name}</a> </div> <div class="re-content" id="storReceipt"> <div class="re-pro" if="{stockListByDate.list.length>0}"> <div class="re-pro-list {active:active}" each="{stockListByDate.list}" onclick="{stockInfo}"> <div class="re-li"> <span class="fl-left supplier-name" if="{type==1}">入库单</span> <span class="fl-left supplier-name" if="{type==2}">出库单</span> <span class="fl-right">{stockSn}</span> <span class="clear"></span> </div> <div class="re-li"> <span class="fl-left">{supplierName}</span> <span class="fl-right">{creationDate}</span> <span class="clear"></span> </div> <div class="re-li"> <span class="fl-left">共<i>{categoryNum}</i>款 <i>{weight}</i>件</span> <span class="fl-right price">￥ {amount}</span> <span class="clear"></span> </div> </div> </div> </div> </div> <div class="receipt-right"> <div class="receipt-pro-d" if="{stockListByDate.list.length>0}"> <div class="rpro-c"> <div class="title" if="{goods.type == 1}">进货单</div> <div class="title" if="{goods.type == 2}">出货单</div> <div class="name"> <span class="fl-left">供应商：{goods.supplierName}</span> <span class="fl-right">{goods.creationDate}</span> <span class="clear"></span> </div> <div class="name">单号：{goods.stockSn}</div> <div class="table-div"> <table> <tr> <td style="width:10%">项</td> <td style="width:60%">品名</td> <td style="width:10%">数量</td> <td style="width:10%">单价</td> <td style="width:10%">小计</td> </tr> </table> </div> </div> <div class="table-div table-content"> <table> <tr each="{item in goods.list}"> <td style="width:10%">{goods.list.indexOf(item) + 1}</td> <td style="width:60%">{item.goodsName}</td> <td style="width:10%">{item.weight}</td> <td style="width:10%">{item.purchasePrice}</td> <td style="width:10%">{item.amount}</td> </tr> </table> </div> <div class="r-bottom"> <div class="b-d"> <span class="fl-left">总项：{goods.item}</span> <span class="fl-right">总金额：<i>￥{goods.amount}</i></span> <span class="clear"></span> </div> <div class="b-d"> <span class="fl-left">总数：{goods.weight}</span> <span class="clear"></span> </div> </div> </div> </div> <div class="clear"></div> </div>', '', '', function(opts) {
		var self = this;
		self.next = 0;
		self.type = 0;
		this.stockInfo = function(e){
			if($(e.currentTarget).is(".active")){
				return;
			}
			$(".re-pro-list").removeClass("active");
			$(e.currentTarget).addClass("active");
        	var p = {stockId:e.item.stockId,type:e.item.type};
        	store.stockGoodsList.get(p,function(data){
        		self.goods = data;
        		self.goods.item = e.item.categoryNum;
        		self.goods.amount = e.item.amount;
        		self.goods.quantity = e.item.quantity;
						self.goods.weight = e.item.weight;

        		self.update();
        	});
		}.bind(this)

	    this.stockList = function(e){
	    	if(e.item.active == true){
	    		return;
	    	}
	    	for(var i=0;i<self.tag.length;i++){
	    		self.tag[i].active = false;
	    	}
	    	self.type = e.item.type;
	    	e.item.active = true;
	    	var param = {type:e.item.type,next:0,startDate:self.startDate,endDate:self.endDate};
	    	store.stockListByDate.get(param);
	    }.bind(this)

	    self.on('mount', function() {
		    self.tag=[
		                  {"name":"全部","type":0,"active":true},
		                  {"name":"入库单","type":1,"active":false},
		                  {"name":"出库单","type":2,"active":false},
		                  ];
		    self.update();
		    self.init();
		    self.nextPage();
		});

		self.format = function(myDate){
			return myDate.getFullYear()+"-"+( ((myDate.getMonth()+1)<9)?("0"+(myDate.getMonth()+1)):(myDate.getMonth()+1))+"-"+((myDate.getDate()<9)?("0"+myDate.getDate()):myDate.getDate());
		}

		self.init = function(){
			var myDate = new Date();
			var endDate = self.format(myDate);
			myDate.setTime(myDate.getTime()-24*60*60*1000*7);
			var startDate = self.format(myDate);
			self.startDate = startDate;
			self.endDate = endDate;
		    flux.bind.call(self, {
		        name: 'stockListByDate',
		        store: store.stockListByDate,
		        refresh: true,
		        params: {type:self.type,next:self.next,startDate:startDate,endDate:endDate},
		        success: function () {
		            self.update();
		            if(self.stockListByDate.list && self.stockListByDate.list.length>0){
			        	self.stockListByDate.list[0].active = true;
		            	var stockId = self.stockListByDate.list[0].stockId;
		            	var type = self.stockListByDate.list[0].type;
		            	var p = {stockId:stockId,type:type};
		            	self.next = self.stockListByDate.next;
		            	store.stockGoodsList.get(p,function(data){
		            		self.goods = data;
		            		self.goods.item = self.stockListByDate.list[0].categoryNum;
		            		self.goods.amount = self.stockListByDate.list[0].amount;
		            		self.goods.quantity = self.stockListByDate.list[0].quantity;
										self.goods.weight = self.stockListByDate.list[0].weight;

		            		self.update();
		            	});
		            }else{
		            	self.goods = "";
		            	self.update();
		            }
		        }
		    });
		}

	 	self.on('dateChange', function() {
			var date = $(self.root).find('#daterange').val();
			var startDate = date.split("~")[0].replace(/(^\s*)|(\s*$)/g, "");
			var endDate = date.split("~")[1].replace(/(^\s*)|(\s*$)/g, "");
			self.startDate = startDate;
			self.endDate = endDate;
			var param = {type:self.type,next:0,startDate:startDate,endDate:endDate};
			store.stockListByDate.get(param);
		});

 		self.nextPage = function(){
		       var curPage = 1;
		 		$("#storReceipt").scroll(function () {
		 			if(curPage == 1){
		 				self.listWrap = $('#storReceipt')[0];
	                    var clientHeight = self.listWrap.clientHeight;
	                    var scrollTop = self.listWrap.scrollTop;
		 				if((clientHeight + scrollTop) > self.listWrap.scrollHeight - 20){
		 					if(self.next){
		 						curPage=2;
		 						var param = {next:self.next,type:self.type,startDate:self.startDate,endDate:self.endDate};
		 						store.stockListByDate.getMore(param,function(next){
		 							self.next = next;
		 							self.update();
		 							curPage=1;
		 						});
		 					}
		 				}
		 			}
		 		});
			};
});

riot.tag2('storage-supplier', '<div class="supplier"> <div class="supplier-list" each="{supplierList}"> <div class="input"> <label>名称:</label> <input type="text" value="{supplierName}" class="name" maxlength="20"> </div> <div class="input"> <label>电话:</label> <input type="text" value="{tel}" class="phone" maxlength="20"> </div> <div class="button"> <div class="fl-left "> <a class="cancel" onclick="{deleteSupplier}">删除</a> </div> <div class="fl-right"> <a class="sure" onclick="{saveSupplier}">保存</a> </div> <div class="clear"></div> </div> </div> <div class="supplier-list add addSupplier"> <div class="input"> <label>名称:</label> <input type="text" class="name" maxlength="20"> </div> <div class="input"> <label>电话:</label> <input type="text" class="phone" maxlength="20"> </div> <div class="button"> <div class="fl-left "> <a class="cancel" onclick="{cancel}">取消</a> </div> <div class="fl-right"> <a class="sure" onclick="{addSaveSupplier}">添加</a> </div> <div class="clear"></div> </div> </div> <div class="supplier-list addSupplier" onclick="{addSupplier}"> <div class="add"></div> <div class="info">添加供应商</div> </div> <modal id="supplier-warning" modal-width="200px" modal-height="80px" nofooter> <p class="warning-text">{parent.warningText}</p> </modal> </div>', '', '', function(opts) {
		var self = this;

		self.addSupplier = self.cancel = function(){
			$(".addSupplier").toggleClass("add");
		}

		function warning(text){
			var layer = $('#supplier-warning')[0];

			self.warningText = text;
			self.update();

			layer.open();
			setTimeout(function(){
				layer.close();
			}, 1000);
		}
		this.deleteSupplier = function(e){
			var param = { supplierId:e.item.supplierId };
		 	if(confirm("确定删除吗？")){
				store.supplierDel.get(param,function(data){
					$(e.target).parent().parent().parent().remove();
				});
		    }
		}.bind(this)
		this.addSaveSupplier = function(e){
			var param = {};
			if(e.item && e.item.supplierId){
				param.supplierId = e.item.supplierId;
			}
			param.name = $(e.target).parent().parent().parent().find(".name").val();
			param.tel = $(e.target).parent().parent().parent().find(".phone").val();
			if(!param.name){
				warning('请填写供货商名称');
				return;
			}
			if(!/^(\+86)?((([0-9]{3,4}-)?[0-9]{7,8})|(1[3578][0-9]{9})|([0-9]{11,20}))$/.test(param.tel)){
				warning('请填写正确供货商电话');
				return;
			}
			store.supplierAddOrUpdate.get(param,function(data){
				var suppList = [];
				suppList.push(data);
				self.supplierList = self.supplierList.concat(suppList);
				$(".addSupplier").toggleClass("add");
				$(e.target).parent().parent().parent().find(".name").val("");
				$(e.target).parent().parent().parent().find(".phone").val("");
				warning("添加成功");
				self.update();
			});
		}.bind(this)
		this.saveSupplier = function(e){
			var param = {};
			if(e.item && e.item.supplierId){
				param.supplierId = e.item.supplierId;
			}
			param.name = $(e.target).parent().parent().parent().find(".name").val();
			param.tel = $(e.target).parent().parent().parent().find(".phone").val();
			if(!param.name){
				warning('请填写供货商名称');
				return;
			}
			if(!/^(\+86)?((([0-9]{3,4}-)?[0-9]{7,8})|(1[3578][0-9]{9})|([0-9]{11,20}))$/.test(param.tel)){
				warning('请填写正确供货商电话');
				return;
			}
			store.supplierAddOrUpdate.get(param,function(data){
				warning("修改成功");
				self.update();
			});
		}.bind(this)
	    flux.bind.call(self, {
	        name: 'supplierList',
	        store: store.supplierList,
	        params: {},
	        success: function () {
	            self.update();
	        }
	    });
});
riot.tag2('coupon-add', '<div class="coupon-pop"> <div class="coupon-add"> <div class="add-list"> <ul> <li onclick="{fillIn(\'couponPrice\')}"> <span>发放面额、数量及总额：</span> <span id="fillCouponPrice" class="fill"></span> </li> <li onclick="{fillIn(\'couponDate\')}"> <span>有效期：</span> <span id="fillCouponDate" class="fill"></span> </li> <li onclick="{fillIn(\'couponCondition\')}"> <span>获得条件：</span> <span id="fillCouponCondition" class="fill"></span> </li> <li onclick="{fillIn(\'couponWay\')}"> <span>使用方式：</span> <span id="fillCouponWay" class="fill"></span> </li> <li onclick="{fillIn(\'couponUse\')}"> <span>使用条件：</span> <span id="fillCouponUse" class="fill"></span> </li> </ul> </div> </div> </div>', '', '', function(opts) {
        var self = this;
        var modal = self.parent;
        var parent = self.parent.parent;

        self.cou = {};
        self.update();

        self.fillIn = function (id) {
            return function (e) {
                var item = e.item;
                $('#' + id)[0].open(item);
            }
        }

        modal.onSubmit = function () {
            if (parent.newCoupon) {
                if (!parent.newCoupon.totalNumber) {
                    utils.toast("请填写优惠券数量");
                    return;
                }
                if (!parent.newCoupon.totalPrice) {
                    utils.toast("请填写优惠总金额");
                    return;
                }

                if (parent.newCoupon.priceType == 0) {
                    if (parent.newCoupon.fixedPrice) {
                        parent.newCoupon.minPrice = parent.newCoupon.fixedPrice;
                        parent.newCoupon.maxPrice = parent.newCoupon.fixedPrice;
                    }else {
                      utils.toast("请填写单个金额");
                      return;
                    }
                }else{
                  if (!parent.newCoupon.minPrice) {
                    utils.toast("请填写最小金额");
                    return;
                  }
                  if (!parent.newCoupon.maxPrice) {
                    utils.toast("请填写最大金额");
                    return;
                  }
                }
                if (!parent.newCoupon.effectDays) {
                    utils.toast("请填写有效期");
                    return;
                }
                if (!parent.newCoupon.preType) {
                    utils.toast("请选择获得条件");
                    return;
                }
                if (!parent.newCoupon.useWay && parent.newCoupon.useWay!=0) {
                    utils.toast("请选择使用方式");
                    return;
                }
                if (!parent.newCoupon.priceLimit) {
                    utils.toast("请填写使用条件");
                    return;
                }
                parent.newCoupon.ruleType = 0;
                parent.newCoupon.type = 0;
                parent.newCoupon.source = 1;

                store.coupon.create(parent.newCoupon, function (data) {
                    parent.newCoupon = {};
                    parent.next = 0;
                    parent.init();
                    parent.update();
                    modal.close();
                });
            }
        }

        modal.onClose = function () {
            $("coupon-add").find(".fill").text("");
            parent.newCoupon = {};
            parent.update();
            self.update();
        }

        modal.onHelp = function () {
            $("#couponHelp")[0].open();
        }
});

riot.tag2('coupon-con', '<div class="coupon-pop"> <div class="coupon-price" id="couponCon"> <div class="price-li" each="{conList}" onclick="{conselect}"> <div class="select con {selected:selected}"></div> <div class=" price-in"> <i class="blod">{title}：</i> {info} </div> </div> </div> </div>', '', '', function(opts) {

        var self = this;
        var modal = self.parent;
        var parent = self.parent.parent;

        modal.onOpen = function (params) {
          self.conList = [
              {
                  "title": "首次登录网店",
                  "info": "顾客首次通过店铺二维码或者链接登录本店铺就会获得优惠券。",
                  "selected":true,
                  "value": 1000
              }, {
                  "title": "首次在网店下单",
                  "info": "顾客首次在网店下单并且订单配送成功（订单状态为“已完成”）就会获得优惠券。",
                  "selected":false,
                  "value": 1001
              }, {
                  "title": "首次在实体店购物",
                  "info": "会员在实体店首次购物结算时，就会获得优惠券。",
                  "selected":false,
                  "value": 1002
              }, {
                  "title": "网店下单",
                  "info": "顾客在网店下单并且订单配送成功（订单状态为“已完成”）就会获得优惠券。",
                  "selected":false,
                  "value": 1003
              }, {
                  "title": "实体店购物",
                  "info": "会员在实体店购物结算时，就会获得优惠券。",
                  "selected":false,
                  "value": 1004
              }, {
                  "title": "全部本店会员",
                  "info": "全部本店已有会员。",
                  "selected":false,
                  "value": 1005
              }
          ]
            var selected = parent.newCoupon.preType;
            for(var i in self.conList){
              if (selected == self.conList[i].value) {
                self.conList[i].selected = true;
              }else {
                self.conList[i].selected = false;
              }
            }
            self.update();
        }

        self.conselect = function (e) {
          for(var i in self.conList){
              self.conList[i].selected = false;
            }
            e.item.selected = true;
            self.conCode = e.item;
        }

        modal.onClose = function () {}

        modal.onSubmit = function () {
          var couUseCon ="";
          for(var i in self.conList){
            if (self.conList[i].selected) {
               couUseCon = self.conList[i];
            }
          }
          if (couUseCon) {
            $("#fillCouponCondition").text(couUseCon.title);
            parent.newCoupon.preType = couUseCon.value;
            modal.close();
          }else {
            utils.toast("请选择获得条件");
          }

        }
});

riot.tag2('coupon-data', '<div class="coupon-pop"> <div class="coupon-data"> <div class="content"> <div class="use-text"> 有效天数 ： </div> <div class="use-input data"> <input type="tel" value="" maxlength="2" id="couData"> <span class="yuan">天</span> </div> <div class="clearfix"></div> </div> <div class="prompt"> *最多为90天 </div> </div> </div>', '', '', function(opts) {

    var self = this;
    var modal = self.parent;
    var parent = self.parent.parent;

    modal.onOpen = function (params) {

      $("coupon-data").find("#couData").val(parent.newCoupon.effectDays);
      self.update();
    }

    modal.onClose = function () {
      $("coupon-data").find("#couData").val("");
    }

    modal.onSubmit = function () {
      var _couData =parseInt($("coupon-data").find("#couData").val());
      if (/^[1-9]\d*$/.test(_couData) && (_couData<=90)) {
          $("#fillCouponDate").text(_couData+"天");
          parent.newCoupon.effectDays = _couData;
          modal.close();
      }else {
        utils.toast("请填写正确的日期");
        return;
      }
    }

});

riot.tag2('coupon-help', '<div class="coupon-pop"> <div class="coupon-help"> <div class="title"> 发放总数量： </div> <div class="info"> 为优惠券可使用的最大数量。如果使用完毕，优惠券会自动失效。 </div> <div class="title"> 发放总额： </div> <div class="info"> 为优惠券所发放的总额 </div> <div class="title"> 有效期： </div> <div class="info"> 为顾客领到优惠券的日期往后一直到所设置的天数。比如有效期为7天，顾客1月1日领到优惠券，1月7日24:00过期。 </div> <div class="title"> <span>获得条件：</span> <span class="normal">总共如下六种：</span> </div> <div class="info"> 首次登录网店：顾客首次通过店铺二维码或者链接登录本店铺就会获得优惠券。 </div> <div class="info"> 首次在网店下单：顾客首次在网店下单并且订单配送成功（订单状态为“已完成”）就会获得优惠券。 </div> <div class="info"> 首次在实体店购物：会员在实体店首次购物结算时，就会获得优惠券。 </div> <div class="info"> 网店下单：顾客在网店下单并且订单配送成功（订单状态为“已完成”）就会获得优惠券。 </div> <div class="info"> 实体店购物：会员在实体店购物结算时，就会获得优惠券。 </div> <div class="info"> 全部本店会员：全部本店已有会员 </div> <div class="title"> <span>使用方式：</span> <span class="normal">分为网店使用、实体店使用和通用三种。</span> </div> <div class="info"> 网店使用：顾客在线上网店购物时使用。 </div> <div class="info"> 实体店使用：会员在实体店购物时使用。 </div> <div class="info"> 通用：顾客既可以在线上购物使用也可以在实体店购物使用。 </div> <div class="title"> 使用条件： </div> <div class="info"> 可以设置优惠券所应用单据的最低总额，比如使用需满足购物金额为20元，那么只有该笔单据满20元才可用该优惠券。 </div> </div> </div>', '', '', function(opts) {
        var self = this;
        var modal = self.parent;
        var parent = self.parent.parent;

});

riot.tag2('coupon-info', '<div class="coupon-pop"> <div class="coupon-info"> <div class="title"> 优惠券来源： </div> <div class="info"> {info.sourceDesc} </div> <div class="title"> 优惠券详情 </div> <div class="info">金额：{info.denomination}</div> <div class="info" if="{info.beginTime}">领取时段：{info.beginTime}至{info.endTime}</div> <div class="info">有效期：{info.effectDays}天</div> <div class="info">获取条件：{info.getRules}</div> <div class="info">使用方式： <span if="{info.useWay===0}">通用</span> <span if="{info.useWay===1}">线上使用</span> <span if="{info.useWay===2}">店铺使用</span> </div> <div class="info">使用条件：{info.rules}</div> <div class="title"> 使用详情 </div> <div class="info">已使用：{info.useNumber}张，共{info.usePrice}元</div> <div class="info">已发放：{info.sendNumber}张，共{info.sendPrice}元</div> <div class="info">应发放总数：{info.totalNumber}张，共{info.totalPrice}元</div> </div> </div>', '', '', function(opts) {

        var self = this;
        var modal = self.parent;
        var product = self.parent.parent;

        modal.onOpen = function (params) {
          store.coupon.info({couponId:params.storeCouponId},function(data) {
              self.info = data;

              self.update();
          });
        }

        modal.onClose = function () {
          self.info = "";
          self.update();
        }

        modal.onSubmit = function () {
            modal.close();
        }
});

riot.tag2('coupon-price-next', '<div class="coupon-pop"> <div class="coupon-price"> <div class="price-li"> <div class="left price-in"> <span>发放总数：</span> <span class="price-fixed"> <input type="tel" value="" id="totalCoupon" oninput="{totalPrice}" maxlength="6"> </span> <span class="yuan">张</span> </div> <div class="clearfix"></div> </div> <div class="price-li"> <div class="left price-in"> <span>发放总额：</span> <span class="price-fixed"> <input type="tel" value="" id="totalPrice" maxlength="7"> </span> <span class="yuan">元</span> </div> <div class="clearfix"></div> </div> <div class="prompt"> *最小随机金额×总数≤总额≤最大随机金额×总数 </div> </div> </div>', '', '', function(opts) {

        var self = this;
        var modal = self.parent;
        var parent = self.parent.parent;

        self.totalPrice = function () {
            var totalCoupon = parseInt($("#totalCoupon").val());
            if (/^[1-9]\d*$/.test(totalCoupon) && self.params.type === 0) {
                $("#totalPrice").val(totalCoupon * parent.fixedPrice);
            }
        }

        modal.onOpen = function (params) {
            self.params = params;
            if (self.params.type === 0) {
                $("#totalPrice").attr("readonly", true);
            } else {
                $("#totalPrice").attr("readonly", false);
            }
            self.update();
        }

        modal.onClose = function () {
            $("#totalPrice").attr("readonly", false);
            $("coupon-price-next").find("input").val("");
        }

        modal.onSubmit = function () {
            var totalCoupon = parseInt($("#totalCoupon").val());
            var totalPrice = parseInt($("#totalPrice").val());
            if (!/^[1-9]\d*$/.test(totalCoupon)) {
                utils.toast("请填写正确的数量");
                return;
            }
            if (!/^[1-9]\d*$/.test(totalPrice)) {
                utils.toast("请填写正确的总额");
                return;
            }
            if (self.params.type === 0) {
                $("#fillCouponPrice").text(parent.fixedPrice + "元、" + totalCoupon + "张、" + totalPrice + "元");
                parent.newCoupon.totalNumber = totalCoupon;
                parent.newCoupon.totalPrice = totalPrice;
                parent.newCoupon.fixedPrice = parent.fixedPrice;
                parent.newCoupon.priceType = 0;
                $("#totalPrice").attr("readonly", false);
                $("#couponPrice")[0].close();
                modal.close();
            } else {
                if ((parent.minPrice * totalCoupon <= totalPrice) && (totalPrice <= parent.maxPrice * totalCoupon)) {
                    $("#fillCouponPrice").text(parent.minPrice + "-" + parent.maxPrice + "元、" + totalCoupon + "张、" + totalPrice + "元");
                    parent.newCoupon.minPrice = parent.minPrice;
                    parent.newCoupon.maxPrice = parent.maxPrice;
                    parent.newCoupon.totalNumber = totalCoupon;
                    parent.newCoupon.totalPrice = totalPrice;
                    parent.newCoupon.priceType = 1;
                    $("#totalPrice").attr("readonly", false);
                    $("#couponPrice")[0].close();
                    modal.close();
                } else {
                    utils.toast("请填写正确总额");
                    return;
                }
            }
        }
});

riot.tag2('coupon-price', '<div class="coupon-pop"> <div class="coupon-price"> <div class="price-li"> <div class="select left selected fixed" onclick="{select}"></div> <div class="left price-in"> <span>固定金额：</span> <span class="price-fixed"> <input type="tel" value="" id="fixedPrice" maxlength="7"> </span> <span class="yuan">元</span> </div> <div class="clearfix"></div> </div> <div class="price-li"> <div class="select left fixedno" onclick="{select}"></div> <div class="left price-in"> <span>随机金额：</span> <span class="price-random ran"> <input type="tel" value="" id="randomPriceLow" maxlength="7"> </span> <span class="price-m"></span> <span class="price-random"> <input type="tel" value="" id="randomPriceTall" maxlength="7"> </span> <span class="yuan">元</span> </div> <div class="clearfix"></div> </div> <div class="prompt"> *面额必须是整数,随机金额会取包含两端的整数 </div> </div> </div>', '', '', function(opts) {

        var self = this;
        var modal = self.parent;
        var parent = self.parent.parent;

        modal.onOpen = function (params) {
          parent.fixedPrice="";
          parent.minPrice="";
          parent.maxPrice="";
          if (parent.newCoupon.priceType==1) {
            $(".fixedno").addClass("selected");
            $(".fixed").removeClass("selected");
            $("#randomPriceLow").val(parent.newCoupon.minPrice);
            $("#randomPriceTall").val(parent.newCoupon.maxPrice);
          }else {
            $(".fixed").addClass("selected");
            $(".fixedno").removeClass("selected");
            $("#fixedPrice").val(parent.newCoupon.fixedPrice);
          }
          self.update();
        }

        modal.onClose = function () {
          $("coupon-price").find("input").val("");
          self.update();
        }

        modal.onSubmit = function () {
            if ($("#fixedPrice").parent().parent().prev(".select").is(".selected")) {
                var fixedPrice = parseInt($("#fixedPrice").val());
                if (/^[1-9]\d*$/.test(fixedPrice)) {
                  parent.fixedPrice = fixedPrice;
                  var params = {
                    type:0,
                    fixedPrice:fixedPrice
                  }
                  $("#couponPriceNext")[0].open(params);

                } else {
                    utils.toast("请填写正确的金额");
                    return;
                }
            } else {
                var minPrice = parseInt($("#randomPriceLow").val());
                var maxPrice = parseInt($("#randomPriceTall").val());
                if (/^[1-9]\d*$/.test(minPrice) && /^[1-9]\d*$/.test(maxPrice) && (minPrice < maxPrice)) {
                  parent.minPrice=minPrice;
                  parent.maxPrice=maxPrice;
                  var params = {
                    type:1,
                    minPrice:minPrice,
                    maxPrice:maxPrice
                  }
                  $("#couponPriceNext")[0].open(params);
                } else {
                    utils.toast("请填写正确的金额");
                    return;
                }
            }

        }

        self.select = function (e) {
            if (!$(e.target).is(".selected")) {
                $(".select").removeClass("selected");
                $(e.target).addClass("selected");
            }
        }
});

riot.tag2('coupon-stop', '<div class="coupon-pop"> <div class="coupon-stop"> 确定停止发放优惠券吗？已经停止发放的优惠券无法恢复发放。 </div> </div>', '', '', function(opts) {

        var self = this;
        var modal = self.parent;
        var parent = self.parent.parent;

        modal.onOpen = function(param){
          self.param = param;
          self.update();
        }

        modal.onSubmit = function() {
            parent.stopSure(self.param);
            modal.close();
        }
});

riot.tag2('coupon-use', '<div class="coupon-pop"> <div class="coupon-use"> <div class="content"> <div class="use-text"> 使用需满足购物金额 ： </div> <div class="use-input"> <input type="tel" value="" maxlength="7" id=""> <span class="yuan">元</span> </div> <div class="clearfix"></div> </div> </div> </div>', '', '', function(opts) {

        var self = this;
        var modal = self.parent;
        var parent = self.parent.parent;

        modal.onOpen = function (params) {
          $("coupon-use").find("input").val(parent.newCoupon.priceLimit);
            self.update();
        }

        modal.onClose = function () {
            $("coupon-use").find("input").val("");
        }

        modal.onSubmit = function () {
            var conUseCode = $("coupon-use").find("input").val();
            if (!/^[1-9]\d*$/.test(conUseCode)) {
                utils.toast("请填写正确的金额");
                return;
            }
            $("#fillCouponUse").text("购物满" + conUseCode + "元");
            parent.newCoupon.priceLimit = conUseCode;
            modal.close();
        }
});

riot.tag2('coupon-way', '<div class="coupon-pop"> <div class="coupon-price"> <div class="price-li" each="{couUseList}" onclick="{couUseSelect}"> <div class="select left {selected:selected}"></div> <div class="left price-in"> {title} </div> <div class="clearfix"></div> </div> </div> </div>', '', '', function(opts) {

        var self = this;
        var modal = self.parent;
        var parent = self.parent.parent;

        self.couUseList = [
            {
                "title": "网店使用",
                "selected":true,
                "value": 1
            }, {
                "title": "实体店使用",
                "selected":true,
                "value": 2
            }, {
                "title": "通用",
                "selected":true,
                "value": 0
            }
        ]

        modal.onOpen = function (params) {
          var selected = parent.newCoupon.useWay;

          for(var i in self.couUseList){
            if (selected === self.couUseList[i].value) {
              self.couUseList[i].selected = true;
            }else {
              self.couUseList[i].selected = false;
            }
          }
            self.update();
        }

        modal.onClose = function () {
        }

        modal.onSubmit = function () {
            var couUseCode ="";
            for(var i in self.couUseList){
              if (self.couUseList[i].selected) {
                 couUseCode = self.couUseList[i];
              }
            }
            if (couUseCode) {
              $("#fillCouponWay").text(couUseCode.title);
              parent.newCoupon.useWay = couUseCode.value;
              modal.close();
            }else {
              utils.toast("请选择使用方式");
            }
        }

        self.couUseSelect = function (e) {
          for(var i in self.couUseList){
              self.couUseList[i].selected = false;
            }
              e.item.selected = true;
        }
});

riot.tag2('address-select', '<div class="scroll-wrap"> <div class="scroll-content"> <div> <ul type="levelOne"> <li each="{region.levelOne}" code="{code}"> {name}</li> </ul> </div> <div> <ul type="levelTwo"> <li if="{!region.levelTwo.length}"> -- </li> <li if="{region.levelTwo.length}" each="{region.levelTwo}" code="{code}"> {name}</li> </ul> </div> <div> <ul type="levelThree"> <li if="{!region.levelThree.length}"> -- </li> <li if="{region.levelThree.length}" each="{region.levelThree}" code="{code}"> {name}</li> </ul> </div> <p></p> </div> </div>', '', '', function(opts) {
		var hasTouch = !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch);
		var startEvt = hasTouch ? 'touchstart' : 'mousedown';
		var moveEvt = hasTouch ? 'touchmove' : 'mousemove';
		var endEvt = hasTouch ? 'touchend' : 'mouseup';

		var self = this;
		var modal = self.parent;

		self.on('mount', function(){
		flux.bind.call(self,{
			name: 'region',
			store: store.region,
			success: function () {
				self.update();
			}
		});

		flux.bind.call(self,{
			name: 'register',
			store: store.register,
			success: function () {
				self.update();
			}
		});
		self.update();
		bind();

		});

		function bind(){
			self.scale = 40;
			$(self.root).find('ul').bind(startEvt, start);
		}

		function start(e){
			var e = window.event;

			self.target = $(e.target).parents('ul:first');
			self.startY = hasTouch && e.targetTouches ? e.targetTouches[0].pageY : e.pageY;
			self.top = parseInt(self.target.css('top'));
			self.max = self.target.height();

			if (self.max == self.scale){
				return;
			}

			$(window).bind(moveEvt, move);
			$(window).bind(endEvt, end);
		}

		function end(e){
			$(window).unbind(moveEvt);
			$(window).unbind(endEvt);
			self.top = parseInt(self.target.css('top'));

			var index = Math.round(Math.abs(self.top - self.scale)/self.scale);
			var left = Math.abs(self.scale * (1 - index) - self.top);

			self.top = self.scale * (1 - index);
			self.target.css('top', self.top);
			self.target.attr('idx', index);

			var key = self.target.attr('type');
			store.region.setCurrent(key, self.region[key][index]);
		}

		function move(e){
			var e = window.event;

			e.preventDefault();
			self.offsetY = hasTouch && e.targetTouches ? (e.targetTouches[0].pageY - self.startY) : (e.pageY - self.startY);

			var target = self.target;
			var topY = self.top + self.offsetY;

			if (topY <= self.scale && topY >= self.scale*2 - self.max) {
				target.css('top', topY);
			}
		}

		modal.onSubmit = function(){
			var current = self.region.current;
			var addressCode = [];
			var addressValue = [];

			addressCode.push(current['levelOne']['code']);
			addressCode.push(current['levelTwo']['code']);
			addressCode.push(current['levelThree']['code']);

			addressValue.push(current['levelOne']['name']);
			addressValue.push(current['levelTwo']['name']);
			addressValue.push(current['levelThree']['name']);

			store.register.set('addressCode', addressCode.join(','));
			modal.parent.addressCode = addressCode.join(',');
			modal.parent.newAddressCode = addressCode.join(',');
			modal.parent.addressValue = addressValue.join(',');
			modal.parent.addressValueWithoutSep = addressValue.join('');
			modal.parent.update();
			modal.root.close();
		}
});

riot.tag2('warning', '<div class="warning" id="login-warning" style="display:none"> <h2>提示</h2> <p>{opts.msg}</p> <a class="red-box" onclick="{close}">知道了</a> </div>', '', '', function(opts) {
		var self = this;

		self.root.open = function(){
			self.update();
			$('#login-warning').show();
		}

		self.close = self.root.close = function(){
			$('#login-warning').hide();
		}

		self.parent.on('update', function(){
			self.opts = self.opts ? self.opts.opts : {};
		});
});

riot.tag2('create-product', '<form id="create-product-form" name="create-product"> <label> 条码： <input type="text" name="barcode" oninput="{checkGood}" class="barcode-input long-input"> </label> <label> 商品名： <input type="text" name="goodsName" class="long-input" id="goodsName" maxlength="64"> </label> <div class="edit-area"> <label> 零售价（元）： <input type="tel" name="price" maxlength="8"> </label> <label> 进货价（元）： <input type="tel" name="purchasePrice" maxlength="8"> </label> <label> 分类： <select name="cateId"> <option each="{categorySelect}" value="{cateId}" __selected="{cateId==currentCateId}">{cateName}</option> </select> </label> <label> 单位： <select name="unit"> <option each="{i,index in unit}" value="{index}">{i}</option> </select> </label> <label> 库存： <input type="tel" name="stockNum" maxlength="10"> </label> <input type="hidden" name="imageUrl" id="create-product-imgUrl"> </div> <div class="img-area" id="create-product-img"> <img riot-src="{imageUrl || \'imgs/default-product.png\'}" onerror="javascript:this.src=\'imgs/default-product.png\' "> </div> </form>', '', '', function(opts) {
		var self = this;
		self.unit = [];
		self.type = 'update';
		var modal = self.parent;
		var cash = self.parent.parent;
		modal.onOpen = function (params) {
			utils.createUploader({
				idName: 'create-product-img',
				container: 'create-product-form',
				success: function (up, file, info) {
					var domain = up.getOption('domain');
					var res = $.parseJSON(info);
					var sourceLink = domain + res.key;
					$('#create-product-imgUrl').val(sourceLink);
					self.imageUrl = sourceLink + "?imageView2/1/w/200/q/50";
					self.update();
				}
			});

			if (params && params.casherCart) {
				self.casherCart = true;
			} else {
				self.casherCart = false;
			}
			self.currentCateId = self.parent.parent.cateId;
			self.update();

		}

		modal.onClose = function () {
			utils.clearForm('create-product-form');
			$('#create-product .img-area img').attr('src', '');
			$('#create-product-imgUrl').val('');
			$('.moxie-shim').remove();
		}

		modal.onSubmit = function () {
			var params = $('#create-product-form').serializeObject();
			params.parentCateId = cash.cateId;

			if(!params.goodsName){
				utils.toast('请输入商品名');
				return;
			}

			if (!/^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/.test(params.price)) {
				utils.toast('请输入正确的零售价');
				return;
			}

			if(params.purchasePrice !=""){
				if (!/^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/.test(params.purchasePrice)) {
					utils.toast('请输入正确的进货价');
					return;
				}
			}

			if(params.stockNum != ""){
				if (!/^[0-9]+([.]{1}[0-9]{1,3})?$/.test(params.stockNum)) {
						utils.toast('请输入正确库存');
						return;
				}
			}

			if(params.unit=='6' || params.unit=='9'){
				params.stockNum = params.stockNum * 1000;
			}else if(params.unit=='7' || params.unit=='8'){
				params.stockNum = params.stockNum * 1000000;
			}else if(params.unit=='5'){
				params.stockNum = params.stockNum * 1000000 / 2;
			}

			if (self.casherCart) {
				store.goods.cashCreate(params, function (res) {
					if (res && res.goodsUuid) {
						params.goodsUuid = res.goodsUuid;
						store.synTask.get({name: "Goods"},function (success) {
							if (success) {
								utils.toast('添加成功');
								store.loadTopGoodsList = true;
								cash.cashAddCart(params);
							}
							modal.close();
						});
					}
				});
			} else {
				store.goods.create(params, function () {
					utils.toast('添加成功');
					cash.getGoodsCount(cash.cateId);
					store.loadTopGoodsList = true;
					modal.close();
				});
			}
		}

		modal.onContinue = function () {
			var params = $('#create-product-form').serializeObject();
			params.parentCateId = cash.cateId;

			if(!params.goodsName){
				utils.toast('请输入商品名');
				return;
			}

			if (!/^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/.test(params.price)) {
				utils.toast('请输入正确的零售价');
				return;
			}

			if(params.purchasePrice !=""){
				if (!/^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/.test(params.purchasePrice)) {
					utils.toast('请输入正确的进货价');
					return;
				}
			}

			if(params.stockNum != ""){
				if (!/^[0-9]+([.]{1}[0-9]{1,3})?$/.test(params.stockNum)) {
						utils.toast('请输入正确库存');
						return;
				}
			}
			if(params.unit=='6' || params.unit=='9'){
				params.stockNum = params.stockNum * 1000;
			}else if(params.unit=='7' || params.unit=='8'){
				params.stockNum = params.stockNum * 1000000;
			}else if(params.unit=='5'){
				params.stockNum = params.stockNum * 1000000 / 2;
			}
			store.goods.create(params, function () {
				utils.toast('添加成功');
				store.loadTopGoodsList = true;
				cash.getGoodsCount(cash.cateId);
				utils.clearForm('create-product-form');
				$('#create-product .img-area img').attr('src', '');
				$('#create-product-imgUrl').val('');

				if(!store.online){
						modal.close();
						cash.openCreate();
				}
			});
		}

		flux.bind.call(self, {
			name: 'categorySelect',
			store: store.categorySelect
		});

		self.on('mount', function () {
			self.unit = CONSTANT.UNITS;
			self.update();
			if (store.online) {
				var gotimeout;
				$("#create-product-form").find("input").focus(function () {
					clearTimeout(gotimeout);
					$(".modal-dialog").css("top", "220px");
				});

				$("#create-product-form").find("input").blur(function () {
					gotimeout = setTimeout(function () {
						$(".modal-dialog").css("top", "50%");
					}, 200);
				});
			}
		});
});

riot.tag2('import-error', '<div class="import-error"> <div class="title">Excel表格数据有误，导入失败</div> <div class="info">详情</div> <ul class="error-ul"> <li each="{i in error}">{i}</li> </ul> </div>', '', '', function(opts) {
		var self = this;
		var modal = self.parent;

		modal.onOpen = function (params) {
			var mgs = params;
			if (mgs.indexOf(';') > -1) {
				var errormgs = mgs.split(';');
				self.error = errormgs;
			}else {
				self.error=[];
				self.error.push(params);
			}
			self.update();
		}

		modal.onClose = function () {
			self.error=[];
			self.update();
		}
		self.on('mount', function () {});
});

riot.tag2('import-loading', '<div class="import-loading"> <div class="loading-text">{text}</div> <div class="loaded"> <div class="loader"> <div class="loader-inner line-scale"> <div></div> <div></div> <div></div> <div></div> <div></div> </div> </div> </div> <div class="button"> <a class="{active:button}" onclick="{onClose}">取消导入</a> </div> </div>', '', '', function(opts) {
		var self = this;
		var modal = self.parent;
		var timeInterval;
		var baseTime = 600000;
		self.text = "正在导入商品";
		self.time = 0;

		modal.onOpen = function (params) {
			self.button = false;
			clearInterval(timeInterval);
			self.time = 0;
			$(".loading-text").text("正在导入商品");
			self.update();
			timeInterval = setInterval(function() {
				self.time = self.time +1;
				self.update();
			}, 1000);

			setTimeout(buttonOpen, baseTime);
			function buttonOpen() {
				self.button = true;
				clearInterval(timeInterval);
				self.update();
			}
		}

		self.onClose = function () {
			if (self.button) {
				clearInterval(timeInterval);
				self.time = 0;
				modal.close();
				self.button = false;
				self.update();
			} else {
				var lastTime = baseTime/1000-self.time;
				if(lastTime>60){
					var toastTime = parseInt(lastTime/60)+"分"+(lastTime%60)+"秒";

				}else{
					var toastTime = lastTime;
				}
				utils.toast("请在"+toastTime+"后取消");
			}
		}

		self.on('mount', function () {});
});

riot.tag2('input-barcode', '<div class="wrap"> <div class="content"> <label for="priceNoName">商品条码：</label> <input id="barcodeInput" name="price" type="tel" oninput="{checkInput}"> </div> </div>', '', '', function(opts) {


		var self = this;
		var modal = self.parent;
		var product = self.parent.parent;

		modal.onOpen = function (params) {
			$("#barcodeInput").focus();
			self.update();
		}

		modal.onClose = function () {
			$("#barcodeInput").val("");
		}

		modal.onSubmit = function () {
			var input = $("#barcodeInput").val().trim();
			product.getGoodsInfo(input);
			modal.close();
		}

		self.checkInput = function () {
			var input = $("#barcodeInput").val().trim();
			if (input.length == 13) {
				product.getGoodsInfo(input);
				modal.close();
			}
		}

		self.on('mount', function () {});
});

riot.tag2('update-product', '<form id="update-product-form" name="update-product"> <input type="hidden" value="{data.goodsUuid}" name="goodsUuid"> <label> 条码： <input value="{data.barcode}" name="barcode" class="long-input" readonly="readonly"> </label> <label> 商品名： <input type="text" value="{data.goodsName}" name="goodsName" class="long-input" maxlength="64"> </label> <div class="edit-area"> <label> 零售价（元）： <input type="tel" value="{data.price}" name="price" maxlength="8"> </label> <label> 进货价（元）： <input type="tel" value="{data.purchasePrice}" name="purchasePrice" maxlength="8"> </label> <label> 分类： <select name="cateId"> <option each="{categorySelect}" value="{cateId}" __selected="{cateId==data.cateId}">{cateName}</option> </select> </label> <label> 单位： <select name="unit"> <option each="{i,index in unit}" value="{index}" __selected="{index == data.unit}">{i}</option> </select> </label> <label> 库存： <input type="tel" value="{data.stockNumber || 0}" name="stockNum" maxlength="10"> </label> <input type="hidden" name="imageUrl" id="update-product-imgUrl"> </div> <div class="img-area" id="update-product-img"> <img riot-src="{data.imageUrl || \'imgs/default-product.png\'}"> </div> </form>', '', '', function(opts) {
		var self = this;
		self.type = 'update';
		self.cates = new Array();
		var modal = self.parent;
		var cash = self.parent.parent;
		modal.onOpen = function (res) {

			$('#update-product-imgUrl').val(res.imageUrl);

			var params = res;

			self.data = {
				purchasePrice: " "
			};
			self.update();

			var stockNumber = params.stockNum
			params.stockNumber = stockNumber
			if(params.unit=='6' || params.unit=='9'){
				params.stockNumber = (stockNumber / 1000).toFixed(3) * 1;
			}else if(params.unit=='7' || params.unit=='8'){
				params.stockNumber = (stockNumber / 1000000).toFixed(3) * 1;
			}else if(params.unit=='5'){
				params.stockNumber = (stockNumber / 1000000 * 2).toFixed(3) * 1;
			}
			self.data = params;

			self.update();

			self.currentCateId = self.data.cateId;
			self.currentStockNum = self.data.stockNumber;
			self.currentUnit = self.data.unit;

			self.update();

			utils.createUploader({
				idName: 'update-product-img',
				container: 'prodcut-detail',
				success: function (up, file, info) {
					var domain = up.getOption('domain');
					var res = $.parseJSON(info);
					var sourceLink = domain + res.key;
					$('#update-product-imgUrl').val(sourceLink);
					self.data.imageUrl = sourceLink + "?imageView2/1/w/200/q/50";

					self.update();

				}
			});

			self.update();
		}
		self.unit = [];

		modal.onClose = function () {
			$('.moxie-shim').remove();
			self.data = {
				purchasePrice: " "
			};
			self.update();
		}

		modal.onSubmit = function () {
			var params = $('#update-product-form').serializeObject();

			params.parentCateId = cash.cateId;
			if (!params.goodsName) {
				utils.toast('请输入商品名');
				return;
			}

			if (!/^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/.test(params.price)) {
				utils.toast('请输入正确的零售价');
				return;
			}
			params.purchasePrice = params.purchasePrice.trim();
			if (params.purchasePrice != "") {
				if (!/^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/.test(params.purchasePrice)) {
					utils.toast('请输入正确的进货价');
					return;
				}
			}

			if (params.stockNum != "") {
				if (!/^[0-9]+([.]{1}[0-9]{1,3})?$/.test(params.stockNum)) {
					utils.toast('请输入正确库存');
					return;
				}
			}
			if(params.unit=='6' || params.unit=='9'){
				params.stockNum = params.stockNum * 1000;
			}else if(params.unit=='7' || params.unit=='8'){
				params.stockNum = params.stockNum * 1000000;
			}else if(params.unit=='5'){
				params.stockNum = params.stockNum * 1000000 / 2;
			}

			store.goods.update(params, function (res) {
				console.log('--------params ---------' + JSON.stringify(params));
				console.log('-------update--------' + JSON.stringify(res));
				utils.toast('修改成功');
				store.loadTopGoodsList = true;
				modal.close();
				self.data = {
					purchasePrice: " "
				};
				self.update();
			});
		}

		modal.onDelete = function () {
			if (confirm('确认删除该商品么?')) {
				var params = {
					goodsUuid: self.data.goodsUuid,
					parentCateId: cash.cateId
				}
				store.goods.delete(params, function () {
					utils.toast('删除成功');
					store.loadTopGoodsList = true;
					cash.getGoodsCount(cash.cateId);
					modal.close();
					self.data = {
						purchasePrice: " "
					};
					self.update();
				});
			}
		}

		flux.bind.call(self, {
			name: 'categorySelect',
			store: store.categorySelect
		});

		self.on('mount', function () {
			self.unit = CONSTANT.UNITS
			self.update()
			if (store.online) {
				var gotimeout;
				$("#update-product-form").find("input").focus(function () {
					if ($(this).attr("readonly") != "readonly") {
						clearTimeout(gotimeout);
						$(".modal-dialog").css("top", "220px");
					}
				});
				$("#update-product-form").find("input").blur(function () {
					gotimeout = setTimeout(function () {
						$(".modal-dialog").css("top", "50%");
					}, 200);
				});
			}
		});
});

riot.tag2('pop-ad-reward', '<div class="reward-pop"> <h2>广告收入：</h2> <h5>该奖励将使您的iPos客屏播放广告，您将获得广告分成。分成根 据实际广告播放时长和广告费浮动变化。因此，请务必确保iPos 在线并且正常播放广告。广告分成每天24:00统计。每月奖励收 入会按时一并打入您的账户。请点击“奖励收入”查看。</h5> <h2>广告收入详情：</h2> <div class="reward-ad-tab" if="{icome.length >0}"> <ul> <li each="{icome}"> <span>{date}</span> <span>{income}</span> </li> </ul> </div> <div class="reward-in-em" if="{icome.length == 0}"> 暂无广告收益 </div> </div>', '', '', function(opts) {

        var self = this;
        var modal = self.parent;
        self.next = 0;

        modal.onOpen = function (params) {
            self.init();
            self.listenDown();
        }

        self.init = function(){
          self.next = 0;
          var param = {
            next:self.next
          }
          store.advIncomeList.get(param,function(data){
            self.next = data.next;
            self.icome = data.list;
            self.update();
          });
        }

        self.scrollLock = false;
        self.listenDown = function () {
            setTimeout(function () {
                self.listWrap = $('.reward-list')[0];
                self.scrollDown = function (event) {
                    var clientHeight = self.listWrap.clientHeight;
                    var scrollTop = self.listWrap.scrollTop;
                    if ((clientHeight + scrollTop) > self.listWrap.scrollHeight - 60) {
                        if (self.next && !self.scrollLock) {
                            self.scrollLock = true;
                            store.advIncomeList.get({
                                next: self.next
                            }, function (data) {
                                self.next = data.next;
                                self.icome = self.coupon.concat(data.list);
                                self.scrollLock = false;
                                self.update();
                            });
                        }
                    }
                };
                self.listWrap.addEventListener('scroll', self.scrollDown, false);
            }, 50);
        }

        modal.onClose = function () {
          self.next = 0;
          self.icome = [];
          if (self.listWrap && self.scrollDown) {
              self.listWrap.removeEventListener('scroll', self.scrollDown);
          }
        }

        modal.onSubmit = function () {
            modal.close();
        }
});

riot.tag2('pop-add-card', '<div class="add-card"> <h4>填写账户</h4> <div class="li"> <span>银行：</span> <input type="text" value="" id="bankName"> </div> <div class="li"> <span>卡号：</span> <input type="text" value="" id="cardCode"> </div> <div class="li"> <span>开户银行：</span> <input type="text" value="" class="long" id="bankAddress"> </div> <div class="li"> <span>姓名：</span> <input type="text" value="" id="name"> </div> </div>', '', '', function(opts) {

        var self = this;
        var modal = self.parent;
        var parent = self.parent.parent;
        modal.onOpen = function () {}

        modal.onClose = function () {
            $("pop-add-card").find("input").val("");
        }

        modal.onSubmit = function () {
            var param = {
                bankName: $("#bankName").val(),
                cardCode: $("#cardCode").val(),
                bankAddress: $("#bankAddress").val(),
                name: $("#name").val()
            };
            if (!param.bankName) {
                utils.toast("请填写银行");
                return;
            }
            if (!param.cardCode) {
                utils.toast("请填写卡号");
                return;
            }
            if (param.cardCode.length < 15 || param.cardCode.length > 19) {
              utils.toast("银行卡号长度必须在15到19之间");
              return;
            }
            var num = /^\d*$/;
            if (!num.exec(param.cardCode)) {
              utils.toast("银行卡号必须全为数字");
              return;
            }
            if (!param.bankAddress) {
                utils.toast("请填写开户银行地址");
                return;
            }

            if (!param.name) {
                utils.toast("请填写姓名");
                return;
            }
            store.bankCardAdd.get(param, function (data) {
                modal.close();
                location.href = "#/shop/income";
            });
        }
});

riot.tag2('pop-app-reward-desc', '<div class="reward-pop"> <h2>解锁应用:</h2> <h5>该奖励可以让您解锁 <i>{apps}</i> 应用,请到"应用"处下载并体验！</h5> <div style="height:30px"></div> </div>', '', '', function(opts) {

        var self = this;
        var modal = self.parent;
        modal.onOpen = function (params) {
            var param = {
                reachRecordId: params.rewardRecordId
            }
            store.reward.info(param, function (data) {
                self.app = data.apps;
                var apps = "";
                for (var i = 0; i < data.apps.length; i++) {
                  apps = data.apps[i].name+"、";
                }
                apps = apps.substring(0,apps.length-1);
                self.apps = apps;
                self.update();
            });
        }

        modal.onClose = function () {}

        modal.onSubmit = function () {

            modal.close();
        }
});

riot.tag2('pop-coupon-reward', '<div class="reward-pop"> <h2>优惠券：</h2> <h5>该奖励是系统自动发放优惠券给您的顾客。您依照优惠券使用方法核销即可。优惠券所产生的优惠金额由iPos承担。奖励收入为 优惠券实际使用金额。该金额会按时打入您的账户。请点击“奖励 收入”查看。</h5> <h2>优惠券详情:</h2> <h5> 金额：{info.totalPrice}元</h5> <h5> 有效时段：{info.beginTime} - {info.endTime}</h5> <h5> 获得条件：{info.getRules}</h5> <h5> 使用方式：{info.sourceDesc}</h5> <h5> 使用条件：{info.rules}</h5> <h2>奖励收入详情：</h2> <h5>已使用：{info.useNum?info.useNum:0} 张</h5> <h5>获得收入：￥{info.usePrice?info.usePrice:0}</h5> </div>', '', '', function(opts) {

        var self = this;
        var modal = self.parent;

        modal.onOpen = function (params) {
            var param = {
                reachRecordId: params.rewardRecordId
            }
            store.reward.info(param, function (data) {
                self.info = data;
                self.update();
            });
        }

        modal.onClose = function () {
          self.info={};
        }

        modal.onSubmit = function () {
            modal.close();
        }
});

riot.tag2('pop-global-reward', '<div class="reward-pop"> <h2>全球购收入：</h2> <h5>该奖励将使您的网店开通全球购的功能，顾客在访问您的网店时可以购买全球购商品。全球购的商品寄送及售后均有iPos全部负责。每笔订单所产生的交易额中的部分将按比例分成给您。每月奖励收入会按时一并打入您的账户。请点击“奖励收入”查看。</h5> <h2>全球购收入详情：</h2> <div class="reward-ad-tab" if="{icome.length >0}"> <ul> <li each="{icome}"> <span>{date}</span> <span>{income}</span> </li> </ul> </div> <div class="reward-in-em" if="{icome.length == 0}"> 暂无全球购收益 </div> </div>', '', '', function(opts) {

        var self = this;
        var modal = self.parent;
        self.next = 0;

        modal.onOpen = function (params) {
            self.init();
            self.listenDown();
        }

        self.init = function(){
          self.next = 0;
          var param = {
            next:self.next
          }
          store.globalIncomeList.get(param,function(data){
            self.next = data.next;
            self.icome = data.list;
            self.update();
          });
        }

        self.scrollLock = false;
        self.listenDown = function () {
            setTimeout(function () {
                self.listWrap = $('.reward-list')[0];
                self.scrollDown = function (event) {
                    var clientHeight = self.listWrap.clientHeight;
                    var scrollTop = self.listWrap.scrollTop;
                    if ((clientHeight + scrollTop) > self.listWrap.scrollHeight - 60) {
                        if (self.next && !self.scrollLock) {
                            self.scrollLock = true;
                            store.globalIncomeList.get({
                                next: self.next
                            }, function (data) {
                                self.next = data.next;
                                self.icome = self.coupon.concat(data.list);
                                self.scrollLock = false;
                                self.update();
                            });
                        }
                    }
                };
                self.listWrap.addEventListener('scroll', self.scrollDown, false);
            }, 50);
        }

        modal.onClose = function () {
          self.next = 0;
          self.icome = [];
          if (self.listWrap && self.scrollDown) {
              self.listWrap.removeEventListener('scroll', self.scrollDown);
          }
        }

        modal.onSubmit = function () {
            modal.close();
        }
});

riot.tag2('pop-modify-phone', '<div class="modify-pop"> <h4>验证手机号：</h4> <h5>已发送验证码到店铺手机号{phone}，请输入验证码</h5> <div class="modify-phone"> <span class="input"> <input type="tel" name="" value="" id="code"> </span> <span id="countDown" if="{isCounting}">{countNum}</span> <span if="{isCounting}">s</span> </div> </div>', '', '', function(opts) {

        var self = this;
        var modal = self.parent;
        var parent = self.parent.parent;
        self.isCounting = true;
        self.countNum = 60;
        var csetTime;
        modal.onOpen = function (params) {
          clearTimeout(csetTime);
          self.incomePhone = params.incomePhone;
          self.type = params.type;
          var phone = self.incomePhone.toString();
          self.phone = phone.substring(0,3)+"XXXX"+phone.substring(7,11);
          self.isCounting = true;
					self.countNum = 60;
					self.update();
					countDown();
        }

        function countDown(){
    			var count = $('#countDown');
    			if (count[0]){
    				count.text(self.countNum--);
    				if (self.countNum > -1){
				       csetTime = setTimeout(countDown, 1000);
    				} else {
    					self.isCounting = false;
    					self.update();
    				}
    			}
    		}

        modal.onClose = function () {
          $("pop-modify-phone").find("input").val("");
          clearTimeout(csetTime);
        }

        modal.onSubmit = function () {
          var param = {
            phoneMobile:self.incomePhone,
          }
          var code = $("#code").val();
          if(!code) {
            utils.toast("请填写验证码");
            return;
          }
          param.code = code;
          store.mobileVerify.get(param,function(data){
            if (self.type == 1) {
              parent.addCard();
            }else {
              parent.account = false;
              parent.accountEdit = true;
              parent.update();
            }
            modal.close();
          });
        }
});

riot.tag2('employee-data', '<div class="calendar-bar"> <div class="chart-top"> <div class="chart-dater"> <daterangepicker></daterangepicker> </div> </div> </div> <div class="half"> <div class="card employee-card"> <div class="order-list-wraper"> <ul class="order-list employee-data-list" if="{logoutRecordList == \'\'}"> 交接班在此次时间段没有交易纪录。 </ul> <ul class="order-list employee-data-list"> <li class="{active: active} employee-data-detail" each="{logoutRecordList}" onclick="{chooseOrder}"> <div class="employee-date"> <dt>{recordDate}</dt> </div> <div class="employee-date"> <span>收银员：{userName}</span> </div> <div> <span style="padding-right: 0.196296rem"> <span>店内收银:</span>¥{offLineAmount} </span> <span>登陆时间:{loginTime}</span> </div> <div> <span style="padding-right: 0.296296rem"> <span>网店外送:</span>¥{onLineAmount} </span> <span>退出时间:{logoutTime}</span> </div> </li> </ul> </div> </div> </div> <div class="half"> <div class="card employee-card order-detail-wraper" if="{currentOrder}"> <div class="order-base"> <h4 onclick="{print}"> 收银员：{currentOrder.userName} </h4> <div class="order-time"> 登陆时间:{currentOrder.loginTime} </div> <div class="order-time"> 退出时间:{currentOrder.logoutTime} </div> <div class="order-time employee-total"> 总计:¥{total} </div> </div> <div class="order-detail-list"> <li> <span style="width: 28%"></span> <span style="width: 35%">店内收银</span> <span style="width: 35%">网店外送</span> </li> <ul> <li> <span style="width: 28%">现金</span> <span style="width: 35%">{currentOrder.cashOffLine}</span> <span style="width: 35%">{currentOrder.cashOnLine}</span> </li> <li> <span style="width: 28%">支付宝</span> <span style="width: 35%">{currentOrder.aliOffLine}</span> <span style="width: 35%">{currentOrder.aliOnLine}</span> </li> <li> <span style="width: 28%">微信</span> <span style="width: 35%">{currentOrder.wechatOffLine}</span> <span style="width: 35%">{currentOrder.wechatOnLine}</span> </li> <li> <span style="width: 28%">银行卡</span> <span style="width: 35%">{currentOrder.unionOffLine}</span> <span style="width: 35%">{currentOrder.unionOnLine || \'---\'}</span> </li> <li> <span style="width: 28%">退货</span> <span style="width: 35%" if="{currentOrder.refundOffLine != 0}">{\'-\' + currentOrder.refundOffLine}</span> <span style="width: 35%" if="{currentOrder.refundOffLine == 0}">{currentOrder.refundOffLine}</span> <span style="width: 35%">{currentOrder.refundOnLine || \'---\'}</span> </li> <li> <span style="width: 28%">合计</span> <span style="width: 35%">{currentOrder.offLineAmount}</span> <span style="width: 35%">{currentOrder.onLineAmount}</span> </li> </ul> </div> </div> </div>', '', '', function(opts) {
    var self = this;
    self.orderList = [
        {
            "id": 10381,
            "billUuid": "158e348bc09-9d6940e9354f7c",
            "storeId": 1,
            "billSn": "14812819400000101006",
            "addTime": 1481281935000,
            "paymentType": 1,
            "goodsAmount": 13.10,
            "discount": 1.96,
            "wipe": null,
            "amount": 11.10,
            "paymentAmount": 13.10,
            "change": 1.96,
            "profit": -2.00,
            "creationDate": 1481281935000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281944586001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 85
        }, {
            "id": 10380,
            "billUuid": "158e3486e1b-9d3ed9a435b4b2",
            "storeId": 1,
            "billSn": "14812819200000101005",
            "addTime": 1481281921000,
            "paymentType": 1,
            "goodsAmount": 3.90,
            "discount": 1.36,
            "wipe": null,
            "amount": 2.50,
            "paymentAmount": 3.90,
            "change": 1.36,
            "profit": -1.40,
            "creationDate": 1481281921000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281924636001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 65
        }, {
            "id": 10379,
            "billUuid": "158e34840c7-9dc60f13ca6c7c",
            "storeId": 1,
            "billSn": "14812819100000101004",
            "addTime": 1481281906000,
            "paymentType": 1,
            "goodsAmount": 12.30,
            "discount": 0.61,
            "wipe": 0.09,
            "amount": 11.60,
            "paymentAmount": 12.30,
            "change": 0.70,
            "profit": 1.10,
            "creationDate": 1481281906000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281913032001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 95
        }, {
            "id": 10378,
            "billUuid": "158e3480791-9dd8e330e68bd8",
            "storeId": 1,
            "billSn": "14812818900000101003",
            "addTime": 1481281897000,
            "paymentType": 1,
            "goodsAmount": 16.50,
            "discount": 0.00,
            "wipe": null,
            "amount": 16.50,
            "paymentAmount": 16.50,
            "change": 0.00,
            "profit": 5.00,
            "creationDate": 1481281897000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281898386001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 100
        }, {
            "id": 10377,
            "billUuid": "158e347d797-9debbf8ceb16bd",
            "storeId": 1,
            "billSn": "14812818800000101002",
            "addTime": 1481281885000,
            "paymentType": 1,
            "goodsAmount": 22.50,
            "discount": 0.00,
            "wipe": null,
            "amount": 22.50,
            "paymentAmount": 22.50,
            "change": 0.00,
            "profit": 8.00,
            "creationDate": 1481281885000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281886106001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 100
        }, {
            "id": 10376,
            "billUuid": "158e347a996-9d53615ac8c13c",
            "storeId": 1,
            "billSn": "14812818700000101001",
            "addTime": 1481281872000,
            "paymentType": 1,
            "goodsAmount": 7.80,
            "discount": 0.00,
            "wipe": null,
            "amount": 7.80,
            "paymentAmount": 7.80,
            "change": 0.00,
            "profit": 1.00,
            "creationDate": 1481281872000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281874327001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 100
        }, {
            "id": 10381,
            "billUuid": "158e348bc09-9d6940e9354f7c",
            "storeId": 1,
            "billSn": "14812819400000101006",
            "addTime": 1481281935000,
            "paymentType": 1,
            "goodsAmount": 13.10,
            "discount": 1.96,
            "wipe": null,
            "amount": 11.10,
            "paymentAmount": 13.10,
            "change": 1.96,
            "profit": -2.00,
            "creationDate": 1481281935000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281944586001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 85
        }, {
            "id": 10380,
            "billUuid": "158e3486e1b-9d3ed9a435b4b2",
            "storeId": 1,
            "billSn": "14812819200000101005",
            "addTime": 1481281921000,
            "paymentType": 1,
            "goodsAmount": 3.90,
            "discount": 1.36,
            "wipe": null,
            "amount": 2.50,
            "paymentAmount": 3.90,
            "change": 1.36,
            "profit": -1.40,
            "creationDate": 1481281921000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281924636001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 65
        }, {
            "id": 10379,
            "billUuid": "158e34840c7-9dc60f13ca6c7c",
            "storeId": 1,
            "billSn": "14812819100000101004",
            "addTime": 1481281906000,
            "paymentType": 1,
            "goodsAmount": 12.30,
            "discount": 0.61,
            "wipe": 0.09,
            "amount": 11.60,
            "paymentAmount": 12.30,
            "change": 0.70,
            "profit": 1.10,
            "creationDate": 1481281906000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281913032001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 95
        }, {
            "id": 10378,
            "billUuid": "158e3480791-9dd8e330e68bd8",
            "storeId": 1,
            "billSn": "14812818900000101003",
            "addTime": 1481281897000,
            "paymentType": 1,
            "goodsAmount": 16.50,
            "discount": 0.00,
            "wipe": null,
            "amount": 16.50,
            "paymentAmount": 16.50,
            "change": 0.00,
            "profit": 5.00,
            "creationDate": 1481281897000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281898386001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 100
        }, {
            "id": 10377,
            "billUuid": "158e347d797-9debbf8ceb16bd",
            "storeId": 1,
            "billSn": "14812818800000101002",
            "addTime": 1481281885000,
            "paymentType": 1,
            "goodsAmount": 22.50,
            "discount": 0.00,
            "wipe": null,
            "amount": 22.50,
            "paymentAmount": 22.50,
            "change": 0.00,
            "profit": 8.00,
            "creationDate": 1481281885000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281886106001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 100
        }, {
            "id": 10376,
            "billUuid": "158e347a996-9d53615ac8c13c",
            "storeId": 1,
            "billSn": "14812818700000101001",
            "addTime": 1481281872000,
            "paymentType": 1,
            "goodsAmount": 7.80,
            "discount": 0.00,
            "wipe": null,
            "amount": 7.80,
            "paymentAmount": 7.80,
            "change": 0.00,
            "profit": 1.00,
            "creationDate": 1481281872000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281874327001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 100
        }, {
            "id": 10381,
            "billUuid": "158e348bc09-9d6940e9354f7c",
            "storeId": 1,
            "billSn": "14812819400000101006",
            "addTime": 1481281935000,
            "paymentType": 1,
            "goodsAmount": 13.10,
            "discount": 1.96,
            "wipe": null,
            "amount": 11.10,
            "paymentAmount": 13.10,
            "change": 1.96,
            "profit": -2.00,
            "creationDate": 1481281935000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281944586001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 85
        }, {
            "id": 10380,
            "billUuid": "158e3486e1b-9d3ed9a435b4b2",
            "storeId": 1,
            "billSn": "14812819200000101005",
            "addTime": 1481281921000,
            "paymentType": 1,
            "goodsAmount": 3.90,
            "discount": 1.36,
            "wipe": null,
            "amount": 2.50,
            "paymentAmount": 3.90,
            "change": 1.36,
            "profit": -1.40,
            "creationDate": 1481281921000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281924636001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 65
        }, {
            "id": 10379,
            "billUuid": "158e34840c7-9dc60f13ca6c7c",
            "storeId": 1,
            "billSn": "14812819100000101004",
            "addTime": 1481281906000,
            "paymentType": 1,
            "goodsAmount": 12.30,
            "discount": 0.61,
            "wipe": 0.09,
            "amount": 11.60,
            "paymentAmount": 12.30,
            "change": 0.70,
            "profit": 1.10,
            "creationDate": 1481281906000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281913032001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 95
        }, {
            "id": 10378,
            "billUuid": "158e3480791-9dd8e330e68bd8",
            "storeId": 1,
            "billSn": "14812818900000101003",
            "addTime": 1481281897000,
            "paymentType": 1,
            "goodsAmount": 16.50,
            "discount": 0.00,
            "wipe": null,
            "amount": 16.50,
            "paymentAmount": 16.50,
            "change": 0.00,
            "profit": 5.00,
            "creationDate": 1481281897000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281898386001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 100
        }, {
            "id": 10377,
            "billUuid": "158e347d797-9debbf8ceb16bd",
            "storeId": 1,
            "billSn": "14812818800000101002",
            "addTime": 1481281885000,
            "paymentType": 1,
            "goodsAmount": 22.50,
            "discount": 0.00,
            "wipe": null,
            "amount": 22.50,
            "paymentAmount": 22.50,
            "change": 0.00,
            "profit": 8.00,
            "creationDate": 1481281885000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281886106001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 100
        }, {
            "id": 10376,
            "billUuid": "158e347a996-9d53615ac8c13c",
            "storeId": 1,
            "billSn": "14812818700000101001",
            "addTime": 1481281872000,
            "paymentType": 1,
            "goodsAmount": 7.80,
            "discount": 0.00,
            "wipe": null,
            "amount": 7.80,
            "paymentAmount": 7.80,
            "change": 0.00,
            "profit": 1.00,
            "creationDate": 1481281872000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281874327001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 100
        }
    ];
    self.list = [
        {
            "id": "现金",
            "billUuid": "12345678.99",
            "storeId": "12345678.99"
        }, {
            "id": "支付宝",
            "billUuid": "12345.99",
            "storeId": "12345678.99"
        }, {
            "id": "微信",
            "billUuid": "12345678.99",
            "storeId": "12345678.99"
        }, {
            "id": "合计",
            "billUuid": "12345678.99",
            "storeId": "12345678.99"
        }
    ];

    self.print = function (e) {

        httpGet({
            url: api.printLogoutByUuid,
            params: {
                shiftUuid: self.shiftUuid
            },
            success: function (res) {}
        });
    }
    self.chooseOrder = function (e) {

        self.logoutRecordList.forEach(function (item) {
            item.active = false;
        });
        e.item.active = true;
        self.currentOrder = e.item;

        self.shiftUuid = self.currentOrder.shiftUuid;
        self.total = (self.currentOrder.offLineAmount + self.currentOrder.onLineAmount).toFixed(2) * 1;
        self.update();
    }

    self.on('dateChange', function () {
        var date = $(self.root).parents('employee').find('#daterange').val();
        console.log(date + '-----ccc---');
        var beginDate = date.split("~")[0];
        var endDate = date.split("~")[1];
        var param = {
            startDate: beginDate,
            endDate: endDate
        };
        store.shiftRecordByDate.get(param, function (data) {
            self.logoutRecordList = data;
            self.update();
        });
        self.currentOrder = null;
    });
    self.format = function (myDate) {
        return myDate.getFullYear() + "-" + (((myDate.getMonth() + 1) < 9)
            ? ("0" + (myDate.getMonth() + 1))
            : (myDate.getMonth() + 1)) + "-" + ((myDate.getDate() < 9)
            ? ("0" + myDate.getDate())
            : myDate.getDate());
    }
    self.on('mount', function () {
        var myDate = new Date();
        var todayDate = self.format(myDate);
        myDate.setTime(myDate.getTime() - 24 * 60 * 60 * 1000 * 7);
        var startDate = self.format(myDate);

        store.shiftRecordByDate.get({
            startDate: startDate,
            endDate: todayDate
        }, function (data) {
            self.logoutRecordList = data;
            self.update();

        });

    });
});

riot.tag2('add-price', '<div class="wrap"> <div class="content"> <label for="priceNoName">请填写商品进价：</label> <input id="addPriceInput" name="price" type="tel" maxlength="20"> </div> </div>', '', '', function(opts) {

		var self = this;
		var modal = self.parent;
		var product = self.parent.parent;

		modal.onOpen = function (params) {
			$("#addPriceInput").focus();
      self.params = params;
			self.update();
		}

		modal.onClose = function () {
			$("#addPriceInput").val("");
      self.params = "";
      self.update();
		}

		modal.onSubmit = function () {
			var input = $("#addPriceInput").val().trim();
      if(/^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/.test(input)){
        self.params.purchasePrice = input;
        store.goods.updateforstor(self.params, function () {
  				utils.toast('保存成功');
  				product.goodsAdd(self.params);
          modal.close();
          self.params = "";
          self.update();
  			});
      }else{
        utils.toast("请输入正确的价格");
      }
		}

});
