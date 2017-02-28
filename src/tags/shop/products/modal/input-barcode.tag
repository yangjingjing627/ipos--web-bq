<input-barcode>
	<div class="wrap">
		<div class="content">
			<label for="priceNoName">商品条码：</label>
			<input id="barcodeInput" name="price" type="tel" oninput="{ checkInput }"/>
		</div>
	</div>
	<script>

	// 此页面是给pc端扫码录商品用，跟ipos端无关。
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
	</script>
</input-barcode>
