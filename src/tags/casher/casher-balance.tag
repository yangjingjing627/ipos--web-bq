<casher-balance>
	<div class="balance-wrap">
		<div class="balance-select">
			<ul class="pay-info">
				<li>
					<p if={ !refund }>应收<strong>￥<b>{ pay.amount || 0 }</b>
						</strong>
					</p>
					<p class="red" if={ refund }>应退<strong>￥<b>{ payCashStr }</b>
						</strong>
					</p>
				</li>
				<li>
					<p class="red" if={ !refund && type=='1' }>现金<strong>￥<b>{ payCashStr }</b>
						</strong>
					</p>
				</li>
				<li>
					<p if={ !refund && type=='1' }>找零<strong>￥<b>{ payback }</b>
						</strong>
					</p>
				</li>

			</ul>
			<ul class="pay-type">
				<li class="cash { active: type == '1' }" onclick={ changeType('1') }></li>
				<li if={ !refund } class="alipay { active: type == '2' }" onclick={ changeType('2') }></li>
				<li if={ !refund } class="wechat { active: type == '3' }" onclick={ changeType('3') }></li>
				<li if={ !refund } class="bank { active: type == '4' }" onclick={ changeType('4') }></li>
			</ul>
		</div>
		<div class="keyboard">
			<table>
				<tbody>
					<tr>
						<td colspan="1" rowspan="4" style="width:56.8%" show={ type !='1' }>
							<div class="pic-pay">
								<img show={ type=='2' } class="alipay-code" src="{ alipayUrl }"/>
								<img show={ type=='3' } class="wechat-code" src="{ wechatUrl }">
								<div show={ type=='4' } class="bank-code code-pic"></div>
								<p show={ type=='2' || type=='3' }>{ codeTips }</p>
							</div>
						</td>
						<td onclick={ addString('7') } if={ type=='1' }>7</td>
						<td onclick={ addString('8') } if={ type=='1' }>8</td>
						<td onclick={ addString('9') } if={ type=='1' }>9</td>
						<td onclick={ backspace } class="backspace" if={ type=='1' }></td>
						<td colspan="2" if={ refund && type=='1' } class="payback-option">
							<p class="on" onclick={ setStorage }>退回时增加库存</p>
						</td>
						<td class="red" if={ !refund } onclick="{ wipe }">抹零</td>
						<td class="red discount-td" if={ !refund } onclick="{ openDiscount }">折扣</td>
						<td class="red" if={ !refund } onclick="{ openCoupon }">优惠券</td>
						<td class="red" if={ refund && type=='1' } onclick="{ openBox }">开钱箱</td>
					</tr>
					<tr if={ type !='1' }>
						<td class="big" rowspan="3" colspan="3" onclick="{ check }">结算</td>
					</tr>
					<tr if={ type=='1' }>
						<td onclick={ addString('4') }>4</td>
						<td onclick={ addString('5') }>5</td>
						<td onclick={ addString('6') }>6</td>
						<td onclick={ addString('100') }>100</td>
						<td class="big" rowspan="3" colspan="3" onclick="{ check }">结算</td>
					</tr>
					<tr if={ type=='1' }>
						<td onclick={ addString('1') }>1</td>
						<td onclick={ addString('2') }>2</td>
						<td onclick={ addString('3') }>3</td>
						<td onclick={ addString('50') }>50</td>
					</tr>
					<tr if={ type=='1' }>
						<td onclick={ addString('0') }>0</td>
						<td onclick={ addString('00') }>00</td>
						<td onclick={ addString('.') }>.</td>
						<td onclick={ addString('20') }>20</td>
					</tr>
				</tbody>
			</div>
		</div>

		<modal id="discount-layer" modal-height="280px" opts={ discountOpts }>
			<div class="discount">
				<div class="top">
					<label>请输入折扣百分比:
						<input id="discountInput" maxlength="3" type="tel" pattern="[0-9]*" value="{ parent.discount }" name="discount"/></label>
						<!-- <input id="discountInput" maxlength="3" type="tel" value="{ parent.discount }" name="discount"/></label> -->

				</div>
				<div class="label">快捷输入：</div>
				<ul>
					<li onclick={ parent.getDiscount(95) }>95%</li>
					<li onclick={ parent.getDiscount(90) }>90%</li>
					<li onclick={ parent.getDiscount(85) }>85%</li>
					<li onclick={ parent.getDiscount(80) }>80%</li>
					<li onclick={ parent.getDiscount(75) }>75%</li>
					<li onclick={ parent.getDiscount(70) }>70%</li>
					<li onclick={ parent.getDiscount(65) }>65%</li>
					<li onclick={ parent.getDiscount(60) }>60%</li>
				</ul>
			</div>
		</modal>
		<modal id="pay-change" modal-width="500px" nocancel='nocancel' buttonOk nofooter opts={ payChangeOpts }>
			<div class="modal-paychange">
				<div class="">找零</div>
				<p>{ parent.payback }</p>
			</div>
		</modal>
		<modal id="pay-warning" modal-width="200px" modal-height="80px" nofooter>
			<p class="warning-text">{ parent.warningText }</p>
		</modal>

		<pop id="billCouponInfo" title="优惠券" twobutton popzbig=true popclose=true>
			<bill-coupon-info></bill-coupon-info>
		</pop>
		<pop id="billCouponNum" title="优惠券" twobutton popzbig=true cancletext="返回">
			<bill-coupon-num></bill-coupon-num>
		</pop>
		<pop id="billCoupon" title="优惠券" popclose=true>
			<bill-coupon></bill-coupon>
		</pop>
	</div>

	<script>
		var self = this;
		// console.log($(this));
		var params = riot.routeParams.params;
		// var modal = self;
		//1现金 2支付宝 3微信 4银行卡
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
					// var pay_amount = self.pay.amount.toFixed(3);
					// self.pay.amount = parseFloat(pay_amount.substring(0,pay_amount.length-1)).toFixed(2);
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

		//埋点
		self.log = function (name) {
			utils.androidBridge(api.logEvent,{eventId: name})
			// if (window.Icommon) {
			// 	Icommon.logEvent(null, null, {eventId: name});
			// }
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
		//点击结算，弹出找零后，在弹出的结算提示
		self.payChangeOpts = {
				onClose: function(){
					self.payChange();
				}
		};
		self.payChange = function () {
			// store.pay.commit(param, function () {
				warning('结算完成');
				self.bill={};
				setTimeout(function () {
					location.hash = '#/casher/index';
				}, 1000);
			// });
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
 		// 	var pay_amount = (self.hisPayPrice * self.discountNum / 100 - self.coupon).toFixed(3);		//抹分处理
			var pay_amount = (self.hisPayPrice * self.discountNum / 100 - self.coupon).toFixed(1);			//保留一位小数，抹分已经没意义
			if (self.wipeButton) {
				var cash = self.payCashStr;
				var needPay = self.pay.amount;
				var pay_amount = (self.hisPayPrice * self.discountNum / 100 - self.coupon).toFixed(3);
				// self.pay.amount = pay_amount.substring(0,pay_amount.length-2) + 0.00;
				self.pay.amount = pay_amount.substring(0,pay_amount.length-2);

			} else {
				// self.pay.amount = (self.hisPayPrice * self.discountNum / 100 - self.coupon).toFixed(2);
				// self.pay.amount = pay_amount.substring(0,pay_amount.length-1);
 				var pay_amount = (self.hisPayPrice * self.discountNum / 100 - self.coupon).toFixed(1);
				self.pay.amount = pay_amount;
			}
			caculate(self.pay.amount, self.payCashStr);
			self.update();
		}

		self.openCoupon = function (e) {
			// $(e.target).toggleClass('button-on');
			if ($(e.target).is(".button-on")) {
				// self.couponPrice = 0; self.coupon = 5; self.couponNumber = 132444333;
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
			// console.log(typeof discount);
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
		// 点击结算弹出应找零钱的浮层
		self.check = function () {
			var param = {
			//1结算 2退货
			type: self.refund ? 2 : 1,
			cash: self.payCashStr,
			stockAdd: $('.payback-option p').hasClass('on') ? 1	: 0,
			discountNum: self.discountNum,
			// coupon: self.coupon, couponNumber: self.couponNumber,
			wipe: self.wipeButton,
			baskets: self.baskets,
			payType: self.type
		}
			if (!self.refund && (self.payCashStr - self.pay.amount < 0) && self.type == 1) {
				warning('现金不得小于应收');
				return;
			}
			// if (self.type == 1) {
			// 	self.openBox();
			// }
			if (self.vipNumber && self.vipNumber != 0) {
				param.vipNumber = self.vipNumber;
			}

			if (self.couponCode && self.couponCode != 0) {
				param.couponCode = self.couponCode;
				param.couponNumber = self.couponCode;
				param.coupon = self.coupon;
			}
			//弹出钱箱
			store.pay.commit(param, function (res) {
				if (res && res.data) {
					self.bill = res.data;
				}
				if (!self.refund) { // 结算
					if (self.type == 1) { // 现金结算的时候打开 开钱箱
						self.openBox();
						$("#pay-change")[0].open()
						return;
					}
					if ((self.type == 2 || self.type == 3 || self.type == 5)) {
						// 支付方式为2支付宝，3微信，5面对面时，用户扫码支付，需等待支付成功推送
						self.paySuccess();

					} else {
						self.paySuccess();
					}

				} else { // 退货
					self.paySuccess();
				}
			});
			// $('#pay-change')[0].open();
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
				// var realZhifubaoUrl =utils.androidBridge(api.fileRootPath) + 'qrcode/zhifubao_' + utils.androidBridge(api.storeId) + '.data?t=' + new Date().getTime();
				// var realWeixinUrl =utils.androidBridge(api.fileRootPath) + 'qrcode/zhifubao_' + utils.androidBridge(api.storeId) + '.data?t=' + new Date().getTime();

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
	</script>
</casher-balance>
