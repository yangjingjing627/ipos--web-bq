<casher-index>
	<div class="content-wrap">
		<div class="cart">
			<casher-cart active="true"></casher-cart>
			<div class="actions">
				<span onclick={ openBox }>开钱箱</span>
				<span onclick={ clearCart }>清空商品</span>
				<span onclick={ openWithoutName }>无码收银</span>
				<span onclick={ moreAction }>更多</span>
				<span class="more back-action" onclick={ backAction }></span>
				<span class="more" onclick={ saveBill }>挂单</span>
				<span class="more" onclick={ openBill }>取单</span>
				<span class="more" onclick={ openRefund }>退货</span>
			</div>
		</div>
		<div class="borad">
			<div id="casher-view">
				<casher-view></casher-view>
			</div>
			<div class="vip-btn">
				<a onclick={ vipModify } if={ !vipLogin }>
					<span class="vip-icon"></span>
					<span class="text line vip-nologin">网店会员</span>
				</a>
				 <a onclick={ vipModify } if={ vipLogin }>
					<span class="vip-icon vip-login"></span>
					<span class="text vip-login">网店会员   <i>{ vipphone }</i></span>
					<span class="modify text line">修改</span>
				</a>
			</div>
			<div class="balance-btn">
				<a onclick={ goCheck } class={ disable: !cartList.goodsAmount }>收银
					<span if={ cartList.goodsAmount }>￥{ cartList.goodsAmount }</span>
				</a>
			</div>
		</div>
		<modal id="withoutName" modal-width="500px" opts={ modalOpts }>
			<div class="wrap">
<!-- 				<form onsubmit="{ parent.addNoName }"> -->
					<div class="content">
						<label for="priceNoName">商品价格：</label>
						<input pattern="[0-9]\{1,5\}\.?[0-9]\{0,2\}" id="priceNoName" name="price" type="tel" maxlength="9"/>
					</div>
<!-- 					<div class="close" onclick="{ close }"></div> -->
<!-- 				</form> -->
			</div>
		</modal>

		<modal id="cart-warning" modal-width="200px" modal-height="80px" nofooter>
			<p class="warning-text">{ parent.warningText }</p>
		</modal>
		<pop  id="vipLogin" title="会员购物" twobutton>
	    <vip-login></vip-login>
	  </pop>
	</div>
	<script>
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
		//埋点
		self.log = function (name) {
			utils.androidBridge(api.logEvent,{eventId: name})
			// if (window.Icommon) {
			// 	Icommon.logEvent(null, null, {eventId: name});
			// }
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
//  			e.preventDefault();
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
	</script>
</casher-index>
