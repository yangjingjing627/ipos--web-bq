<shop-message>
	<form id="shop-message-form">
		<div class="half">
			<div class="card fit">
				<label>
					名称：<input type="text" name="storeName" value="{ message.storeName }">
				</label>
				<label onclick="{ openModal('selectAddress') }">
					地址：<span style="color: #333333">{ addressValueWithoutSep || message.address }</span>
				</label>
				<input type="hidden" value="{ addressValueWithoutSep || message.address }">
				<input type="hidden" name="addressCode" value="{ newAddressCode || message.addressCode }">
				<label>
					街道：<input type="text" name="streetName" value="{ message.streetName }">
				</label>
				<label>
					店铺联系电话：<input type="tel" name="tel" value="{ message.tel }">
				</label>
				<label>
					<span class="notice">店铺公告：</span>
					<textarea name="notice" value="{ message.notice }"></textarea>
				</label>
			</div>

			<div class="card fit">
				<label>
					配送范围：<input type="text" name="deliveryArea" value="{ message.deliveryArea }">
				</label>
				<label>
					起送价（元）：<input type="tel" name="deliveryAmount" value="{ message.deliveryAmount }">
				</label>
				<label>
					配送费（元）：<input type="tel" name="postPrice" value="{ message.postPrice }">
				</label>
				<label style="padding-top: 0;">
					接单时间：<date-picker type="time" name="startTime" id="dp-startTime"></date-picker>
					-
					<date-picker type="time" name="endTime" id="dp-endTime"></date-picker>
				</label>
			</div>
		</div>
		<div class="half">
		<div class="card qrcode">
				<h4>店铺推广二维码</h4>
				<div class="card-usre-de">该二维码会在客屏和打印票据处显示</div>
				<div class="change-qrcode" onclick="{ changeQrcode }">更换或保存到手机</div>
				<img src="{ message.qrCodePromotion || message.qrCode }" class="shop-message-qrcode">
				<div class="show-switch" if="{ !message.showInfo }">
					<span class="left">二维码客屏展示</span>
					<span class="right close" onclick="{ showSwitch }"></span>
				</div>
				<div class="show-switch" if="{ message.showInfo }">
					<span class="left">二维码客屏展示</span>
					<span class="right open" onclick="{ showSwitch }"></span>
				</div>
			</div>
			<div class="card">
				打开收银机默认登录此店铺
				<input type="checkbox" name="bindDevice" value="true" checked="{ message.bindDevice }">
			</div>
			<div class="card" onclick="{ openupQrcode }">
				<div class="up-qrcode"></div>
				<div class="up-text">支付二维码</div>
			</div>
		</div>
	</form>
	<div class="clearfix"></div>
	<div class="save-shop-message">
		<button onclick="{ save }">保 存</button>
	</div>
	<modal modal-width="" modal-height="" id="selectAddress">
		<address-select></address-select>
	</modal>
	<script>
		var self = this;
		var hasTouch = !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch);
		var startEvt = hasTouch ? 'touchstart' : 'mousedown';
		var moveEvt = hasTouch ? 'touchmove' : 'mousemove';
		var endEvt = hasTouch ? 'touchend' : 'mouseup';

		//埋点
		self.relog = function(name) {
			utils.androidBridge(api.statisticalEvent,{eventId: 19})
		}

		openModal(id) {
			return function (e) {
				var item = e.item;
				$('#' + id)[0].open(item);
			}
		}

		self.openupQrcode = function () {
			utils.setTitle("#/shop/upqrcode", '支付二维码')
		}

		self.changeQrcode = function () {
			utils.setTitle("#/shop/userqrcode", '店铺推广二维码')
		}

		showSwitch(e) {
			if (self.message.showInfo) {
				var params = {
					show: false
				};
			} else {
				var params = {
					show: true
				};
			}

			// if (window.Ishop) {
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
			// }
		}

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

	</script>
</shop-message>
