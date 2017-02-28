<casher-detail>
	 <div class="detail white-box" if={ detail }>
		<div class="pic" style={ detail.imageUrl ? 'background-image:url('+ detail.imageUrl +')' : 'background-image:url(imgs/default-product.png)'}></div>
		<p class="detail-goodsName">{ detail.goodsName || '无码商品' }
			<i class="change-price" if="{ viewProfit }" onclick={ changePrice }>修改单价</i>

		</p>
		<div class="modify-cart">
 			<label>数量：</label>
 			<span onclick="{ modifyCart }">{ detail.weight }</span>
 		</div>
		<strong>￥{ detail.price }</strong>
		<i class="line" style="display:none"></i>
		<div class="more"  style="display:none">
			<span>13811468801</span>
		</div>
		<modal id="modifyCartqu" modal-width="500px" opts={ modalCartOpts }>
 			<div class="wrap">
 					<div class="content">
 						<label for="">商品数量：</label>
 						<input id="" type="tel" maxlength="9"/>
 					</div>
 			</div>
 		</modal>
		<modal id="modifyCartPrice" modal-width="500px" opts={ modalCartPriceOpts }>
 			<div class="wrap">
 					<div class="content">
 						<label for="">商品价格：</label>
 						<input id="" type="tel" maxlength="9"/>
 					</div>
 			</div>
 		</modal>
	</div>


	<script>
		var self = this;
		var modal = self.parent;
		var cashDetail = self.parent.parent;
		self.viewProfit = true;

		// console.log(cashDetail);
		flux.bind.call(self, {
			name: 'detail',
			store: store.detail,
			success: function (data) {
				self.update();
			}
		});

		self.modalCartOpts = {
 				onOpen: function () {
 				// 	$('#modifyCartqu').find('input').val(self.detail.weight);
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
 					self.submitModifyCartPr();		//商品价格
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


			// if(!/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/.test(price)) {
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
						// console.log(res + "-------res价格--------");
 					}
 			});
			$('#modifyCartPrice')[0].close();
			$('#modifyCartPrice').find('input').val('');
		}

		//修改商品数量浮层
 		self.modifyCart = function () {
 			$('#modifyCartqu')[0].open();
 			$('#modifyCartqu').find('input').focus();
 		}
		//修改商品价格浮层
		self.changePrice = function () {
			if(self.viewProfit){
				$('#modifyCartPrice')[0].open();
				$('#modifyCartPrice').find('input').focus();
			}else if(!self.viewProfit){
				utils.toast('您还没有该权限....');
			}
 		}
		//埋点
		self.log = function(name) {
			utils.androidBridge(api.logEvent,{eventId: name})
				// if (window.Icommon) {
				// 		Icommon.logEvent(null,null,{eventId: name});
				// }
		}
		self.checkAuth = function() {
			httpGet({
								url: api.auth,
								success: function(res) {
										self.auth = res.data.permissionCodes.split(',');

										if (self.auth.indexOf('131') < 0) {
											// console.log(self.auth.indexOf('131') + '-----111');
												self.viewProfit = false;
										}else{
											// console.log(self.auth.indexOf('131') + '-----222');

										}
										self.update();
								}
						});
		}
		self.on('mount', function() {
			self.checkAuth();
		});

	</script>
</casher-detail>
