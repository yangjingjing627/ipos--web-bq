<create-product>
	<form id="create-product-form" name="create-product">
		<label>
			条码：
			<input type="text" name="barcode" oninput="{ checkGood }" class="barcode-input long-input"/>
		</label>
		<label>
			商品名：
			<input type="text" name="goodsName" class="long-input" id="goodsName" maxlength="64"/>
		</label>

		<div class="edit-area">
			<label>
				零售价（元）：
				<input type="tel" name="price" maxlength="8">
			</label>
			<label>
				进货价（元）：
				<input type="tel" name="purchasePrice" maxlength="8">
			</label>

			<label>
				分类：
				<select name="cateId">
					<option each="{ categorySelect }" value="{ cateId }" selected="{ cateId==currentCateId }">{ cateName }</option>
				</select>
			</label>
			<label>
				单位：
				<select name="unit">
					  <option each="{ i,index in unit }" value="{ index }">{ i }</option>

				</select>
			</label>
			<label>
				库存：
				<input type="tel" name="stockNum" maxlength="10">
			</label>
			<input type="hidden" name="imageUrl" id="create-product-imgUrl">
			<!-- <input type="hidden" id="create-product-imgUrl"> -->

		</div>

		<div class="img-area" id="create-product-img">
			<img src="{ imageUrl || 'imgs/default-product.png' }" onerror="javascript:this.src='imgs/default-product.png' ">
		</div>
	</form>
	<script>
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
			var params = $('#create-product-form').serializeObject();//serializeObject()方法在store.js里，获取form表单里具有name属性的数据
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
			var params = $('#create-product-form').serializeObject();//serializeObject()方法在tags-dep.js文件里定义的，取form表单里有name属性的数据.
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
				//如果是pc端用，是pc扫码逻辑
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
	</script>
</create-product>
