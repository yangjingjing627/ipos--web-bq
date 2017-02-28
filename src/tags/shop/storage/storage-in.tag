<storage-in>
	<div class="storage-in">
		<div class="storage-top">
			<div class="search">
				<search opts={ searchOpts }></search>
			</div>
			<div class="supplier">
				<div class="business">供货商:</div>
				<div class="select" onclick={ supplier }>
					<span id="selectSupplierName">无</span>
					<input type="hidden" id="selectSupplierId"/>
					<div class="icon-down"></div>
					<div class="drop-down display-none">
						<span each={ supplierList } onclick={ selectSupplier }>{ supplierName }</span>
					</div>
				</div>
				<div class="clear"></div>
			</div>
		</div>
		<div class="storage-content">
			<div class="storage-product">
				<div class="product-li" if={ goods.length>0 }>
					<ul>
						<li each={ goods } onclick={ forDetail } class={ active:active }>
							<div class="img"><img alt="" src="{ imageUrl  || 'imgs/default-product.png'}">
							</div>
							<div class="info">
								<h3>{ goodsName }</h3>
								<h2>￥{ purchasePrice }</h2>
							</div>
							<div class="add-less">
								<div class="less" onclick={ decrGoods }></div>
								<div class="input">{ weight }</div>
								<div class="add" onclick={ incrGoods }></div>
								<div class="clear"></div>
							</div>
							<!-- <div class="total">小计：￥{ subtotal }</div> -->
							<div class="total">小计：￥{ amount }</div>

						</li>
					</ul>
					<!-- <div class="scan">
						<input type="button" style="width:40px;height:20px;background-color:#f66;" onclick={ scan } name="name" value="">
					</div> -->
				</div>
				<div class="billing pro-li" if={ goods.length>0 }>

					<ul>
						<li>品类：{ categoryNum }</li>
						<li>总数：{ quantity }</li>
						<li>合计进价：<i>￥{ goodsAmount }</i>
						</li>
					</ul>
				</div>
			</div>
			<div class="storage-detail">
				<div class="s-pro-d" style="display: none">
					<div class="img"><img alt="" src="{ detail.imageUrl  || 'imgs/default-product.png'}">
					</div>
					<div class="name">{ detail.goodsName }</div>
					<div class="billing">
						<ul>
							<li>进价：<i>￥{detail.purchasePrice }</i>
							</li>
							<!-- 后期再加库存 -->
							<li if={ type==1 }>入库数量：<input class="quantity-change" style="width:60%;" type="text" name="name" value="{ detail.weight }" onclick={ modifyStorage }></li>
							<li if={ type==2 }>出库数量：<input class="quantity-change" style="width:60%;" type="text" name="name" value="{ detail.weight }" onclick={ modifyStorage }></li>

							<!-- <li>库存：<input type="text" name="name" value="{ detail.weight }"></li> -->

							<li style="display:none;">cateId:<i>￥{ detail.cateId }</i>
							<li style="display:none;">goodsUuid:<i class="thisgoodsUuid">{ detail.goodsUuid }</i>
							<li style="display:none;">type:<i>￥{ type }</i>
						</ul>
					</div>
				</div>
				<div class="st-button">
					<!-- <a class={ disable: !weight } onclick={ commit }> -->
					<a class={ disable: (!quantity && quantity!=0)} onclick={ commit }>

						<i if={ type==1 }>生成入库单</i>
						<i if={ type==2 }>生成出库单</i>
					</a>
				</div>
			</div>
			<div class="clear"></div>
		</div>
		<modal if={ type==1 } id="modifyStorageInqu" modal-width="500px" opts={ modifyStorageInOpts }>
 			<div class="wrap">
 					<div class="content">
 						<label for="">入库数量：</label>

 						<input id="" type="tel" maxlength="9"/>
 					</div>
 			</div>
 		</modal>
		<modal if={ type==2 } id="modifyStorageInqu" modal-width="500px" opts={ modifyStorageInOpts }>
 			<div class="wrap">
 					<div class="content">
 						<label for="">出库数量：</label>

 						<input id="" type="tel" maxlength="9"/>
 					</div>
 			</div>
 		</modal>
		<modal id="storage-warning" modal-width="200px" modal-height="80px" nofooter>
			<p class="warning-text">{ parent.warningText }</p>
		</modal>
		<modal id="storage-warning-han" modal-width="430px" modal-height="80px" nofooter>
			<p class="warning-text">{ parent.warningText1 }</p>
		</modal>
		<modal id="storageAddPurchasePrice" modal-width="" modal-height="">
			<add-price></add-price>
		</modal>
	</div>
	<script>
		var self = this;
		var params = riot.routeParams.params;
		var type = params.type;
		self.type = type;
		var stockChangeApi = '';
		// console.log(type);
		// if(type == 1){
		// 	stockChangeUrl = 'api.stockAdd';
		// }else if(type == 2){
		// 	stockChangeUrl = 'api.stockIncr';
		// }
		flux.bind.call(self, {
			name: 'stock',
			store: store.stock,
			success: function (data) {
				self.update();
			}
		});
		selectSupplier(e) {
			$("#selectSupplierName").text(e.item.supplierName);
			$("#selectSupplierId").val(e.item.supplierId);
		}

		self.scanCodeStorage = function () {
			// var number = Icommon.number;
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
 				// 	$('#modifyStorageInqu').find('input').val(self.detail.weight);
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
 				if (!/^[0-9]+([.]{1}[0-9]{1,3})?$/.test(quantity)) {//正数最多有三位小数的非
			// if (!/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,3})?$/.test(quantity)) {(		//0或正数最多有三位小数)的非

 					utils.toast("请输入正确的数量")
 					return
 				}else if (quantity == 0) {
					for (var i = 0; i < self.goods.length; i++) {
						if (self.goods[i].goodsUuid == self.detail.goodsUuid) {
							self.goods.splice(i, 1);
							$(".s-pro-d").hide();

							if (self.goods && self.goods.length > 0) {
								// self.detail = self.goods[0];
								self.update();
								// $(".product-li ul li").eq(0).addClass("active");
							} else {
								$(".s-pro-d").hide();
							}
						}
					}
				}
 			} else {
 				if (!/^(0|\+?[1-9][0-9]*)$/.test(quantity)) {
			// if (!/^(\+?[1-9][0-9]*)$/.test(quantity)) {
 					utils.toast("请输入正确的数量")
 					return
 				}else if (quantity == 0) {
					for (var i = 0; i < self.goods.length; i++) {
						if (self.goods[i].goodsUuid == self.detail.goodsUuid) {
							self.goods.splice(i, 1);
							$(".s-pro-d").hide();

							if (self.goods && self.goods.length > 0) {
								// self.detail = self.goods[0];
								self.update();
								// $(".product-li ul li").eq(0).addClass("active");
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
 					url: api.stockChangeNum,//修改入库出库数量
 					params: params,
 					success: function(res) {
						self.categoryNum = res.data.categoryNum;	//品类
						self.detail.weight = res.data.weight;		//单件商品数量
						self.quantity = (res.data.quantity).toFixed(3);			//添加或减少库存的总数量
						self.goodsAmount = res.data.goodsAmount;		//添加或减少库存的总价钱
						self.detail.amount = res.data.amount;		//单件商品数量

						self.update();
						// console.log(res.data);

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

		commit(e) {
			if (!self.quantity) {
				return;
			} else {
				var param = {
					type: type
				};
				param.supplierId = $("#selectSupplierId").val();
				store.stockCommit.get(param, function (data) {
					//toast 提示
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
					// store.synTask.get({
					// 	name: "Goods"
					// }, function () {});
				});
			}
		}

		supplier(e) {
			$(".drop-down").toggleClass("display-none");
		}

		incrGoods(e) { // 增加数量
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
		}

		decrGoods(e) { //减少数量
			var param = {
				goodsUuid: e.item.goodsUuid,
				type: type
			};
			store.stockDecr.get(param, function (data) {
				self.goodsAmount = data.goodsAmount;
				self.quantity = (data.quantity).toFixed(3);
				// self.weight = data.weight;
				self.categoryNum = data.categoryNum;
				// e.item.weight = data.qty;
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
		}

		forDetail(e) {
			$(".product-li ul li").removeClass("active");
			$(e.currentTarget).addClass("active");
			$(".s-pro-d").show();
			self.detail = e.item;
			if (self.detail.imageUrl) {
				if(self.detail.imageUrl.indexOf('bqmart') < 0){   //'bqmart'的imgUrl是倍全同步过来的图片，无法识别‘－min’ '－normal'
					self.detail.imageUrl = e.item.imageUrl.replace('-min', '-normal');
				}
			}

		}

		flux.bind.call(self, {
			name: 'supplierList',
			store: store.supplierList,
			params: {},
			success: function () {
				self.update();
			}
		});
		getGoods() {
			return function (item) {
				self.goodsAdd(item);
			}
		}

		self.searchOpts = {
			clickHandle: self.getGoods()
		};
		self.modifyStorage = function () {
 			$('#modifyStorageInqu')[0].open();
 			$('#modifyStorageInqu').find('input').focus();
 		}
		// self.scan = function () {
		// 	scanNumber = 132535
		// 	window.dispatchEvent(new Event('inputNumber'));
		// };
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
				// barcode,goodsName,price,purchasePrice,cateId,stockNum,goodsUuid
			}

		}

		self.goodsAdd = function (e) {
			var param = {
				type: type
			};
			param.goodsUuid = e.goodsUuid;
			store.stockAdd.get(param, function (data) {
				// if (!data.goods.purchasePrice) {
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
					// self.detail = '';
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
								self.detail.amount = self.goods[i].amount;		//每种商品小计
								self.detail = self.goods[i];
							}

							$(".product-li ul li").removeClass("active");
							// $(".s-pro-d").hide();
							// $(e.currentTarget).addClass("active");
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

	</script>
</storage-in>
