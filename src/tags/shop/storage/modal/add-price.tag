<add-price>
  <div class="wrap">
    <div class="content">
      <label for="priceNoName">请填写商品进价：</label>
      <input id="addPriceInput" name="price" type="tel" maxlength="20"/>
    </div>
  </div>
  <script>

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

	</script>
</add-price>
