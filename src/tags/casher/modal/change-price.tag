<change-price>
  <form onclick={ detail0 } id="change-price" name="update-product">
		<!-- <input type="hidden" value="{  }" name="goodsUuid"> -->
		<label>
			修改商品价格：
			<input value="{}" type="text" name="barcode" class="long-input" readonly="readonly"/>
		</label>
  </form>
  <script type="text/javascript">
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
  </script>
</change-price>
