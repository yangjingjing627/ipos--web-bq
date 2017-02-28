<order-printer>
	<div class="half">
		<div class="card">
			<form>
				<span>
					打印机类型：USB打印机
<!-- 					<select> -->
<!-- 						<option>USB打印机</option> -->
<!-- 					</select> -->
				</span>
			</form>
			<div>
<!-- 				<div class="half"> -->
<!-- 					<button if="{ !connected }" onclick="{ connect }">连接打印机</button> -->
<!-- 					<button if="{ connected }" onclick="{ disconnect }">断开打印机</button> -->
<!-- 				</div> -->
				<div class="half">
					<button onclick="{ printTest }" class="pull-right">打印测试页</button>
				</div>
				<div class="clearfix"></div>
			</div>

			<div>
				<p>结算时是否打印小票 <span class="switch { close: !print}" onclick="{ switchPrint }"></span></p>
				<p if={ !isBqCommercial }>确认订单时是否打印小票 <span class="switch { close: !orderPrint}" onclick="{ switchOrderPrint }"></span></p>
				<p if={ !isBqCommercial }>是否打印店铺二维码 <span class="switch { close: !qrcode}" onclick="{ switchQrcode }"></span></p>
			</div>
		</div>
	</div>

	<script>
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
			//调用native接口
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
	</script>
</order-printer>
