<casher-cart>
	<div class="shopping-list { empty:!cartList.list.length }" id="casherCartShopList">
		<ul>
			<li each={ i in cartList.list } buyid={ i.goodsUuid } onclick={ setDetail(i) } class="{active : (i.goodsUuid == activeId && active)}">
				<div class="li-wrap">
					<div class="item-pic" style="background-image:url({ i.imageUrl || 'imgs/default-product.png' })"></div>
					<div class="item-info">
						<p>{ i.goodsName || '无码商品' }</p>
						<p class="item-unit">￥{ i.price }</p>
					</div>
					<div class="item-price">
						<div>
							<i class="minus" onclick={ minus(i) }></i>
							 <span class="count">{ i.weight }</span>
							<i class="add" onclick={ add(i) }></i>
						</div>
						<strong>小计：￥<b>{ i.amount }</b>
						</strong>
					</div>
				</div>
			</li>
		</ul>
		<!-- <div class="">
			<input type="button" style="width:40px;height:20px;background-color:#f66;" onclick={ scan } name="name" value="">
		</div> -->
	</div>
	<modal modal-width="" modal-height="" id="create-product">
		<create-product></create-product>
	</modal>
	<script>
		var self = this;
		var timer = 50;
		var scrollTimer;

		self.active = self.opts.active;

		function getMulti(a, b) {
			return Math.round(a * 1000) * b / 1000;
		};

		function getPlus(a, b) {
			return (Math.round(a * 1000) + Math.round(b * 1000)) / 1000;
		}

		function scrollCart() {
			var scroll = $('#casherCartShopList');
			var scrollTop = scroll[0].scrollHeight;
			scroll[0].scrollTop = scrollTop;
		}

		function scrollHandler(e) {
			clearTimeout(scrollTimer);

			var scroll = e.target;
			var rate = scroll.scrollTop / (scroll.scrollHeight - scroll.clientHeight);

			scrollTimer = setTimeout(function () {
				store.sys.sendMessage({
					'scrollMessage': {
						scrollRate: rate
					}
				});
			}, 500);
		}

		function addToCart(item) {
			item.quantity = 1;

			var list = self.cartList.list;
			var onOff = false;
			if (list.length) {
				for (var i = 0; i < list.length; i++) {
					if (list[i].goodsUuid == item.goodsUuid) {
						onOff = true;
						list[i].quantity++;
						if(onOff){
							item.price = list[i].price;
							item.weight = list[i].weight;
						}
						break;
					}
					if (i == list.length - 1) {
						list.push(item);
						break;
					}
				}
			} else {
				list.push(item);
			}

			// setTimeout(function () {
			// 	store.detail.set(item);
			// }, 100);

			store.cart.add(item.goodsUuid);

			setTimeout(function () {
				scrollCart();
			}, 200);

		}

		function barcodeHandle() {
			// var number = Icommon.number;
			var number = scanNumber
			// var number = '6920912342002';

			self.barCode = number;

			httpGet({
				url: api.goodByBarcode,
				params: {
					barcode: number
				},
				success: function (res) {
					var list = self.cartList.list;
					if (res.data) {
						addToCart(res.data);
					} else {
						self.createProductFromCode(number);
					}
				},
				error:function(err){
					if(err.code === 10007){
						utils.toast("请检查网络");
					}
				}
			});
			self.update();
		}

		self.createProductFromCode = function (number) {
			var curModal = $('#create-product');
			var cur = curModal[0];
			var styleInfo;
			if (cur.attributes && cur.attributes.getNamedItem) {
				styleInfo = cur.attributes.getNamedItem("style");
			}
			if (!styleInfo || (styleInfo.value && styleInfo.value.indexOf("display:flex;") < 0 && styleInfo.value.indexOf("display: flex;") < 0)) {
				$('#create-product')[0].open({casherCart: true}); //打开创建商品页，传参数casherCart=true  确定create－product确定方法
			}
			httpGet({
				url: api.goodBySpecBarcode,
				params: {
					barcode: number
				},
				success: function (res) {
					$('#create-product .barcode-input').val(number);
					if (res.data) {
						$('#create-product [name="goodsName"]').val(res.data.goodsName);
						$('#create-product [name="cateId"]').val(res.data.cateId);
					}
					if (res.data && res.data.imageUrl) {
						$('#create-product .img-area img').attr('src', res.data.imageUrl);
						$('#create-product-imgUrl').val(res.data.imageUrl);
					}
				},
				complete: function (status) {
					if (status == "error") {
						utils.toast("请检查网络");
					}
				}
			});
		}

		flux.bind.call(self, {
			name: 'cartList',
			store: store.cart,
			success: function () {
				var data = self.cartList;
				if (data) {
					data.goodsAmount = 0;
					data.list.forEach(function (i) {
						data.goodsAmount = getPlus(data.goodsAmount, getMulti(i.price, i.quantity));
					});
				}
				self.update();
			}
		});
		flux.bind.call(self, {
			name: 'detail',
			store: store.detail,
			success: function () {
				if (self.detail) {
					self.activeId = self.detail.goodsUuid;
				} else {
					self.activeId = '';
				}
			}
		});

		self.getMulti = getMulti;

		self.cashAddCart = function (params) {
			addToCart(params);
		}
		self.add = function (data) {
			return function () {
				store.cart.add(data.goodsUuid);
			}
		}

		self.minus = function (data) {
			return function () {
				// clearTimeout(self.timer); self.timer = setTimeout(function(){
				if (data.quantity == 1) {
					setTimeout(function () {
						store.detail.set(null);
					}, 0)
				}

				store.cart.reduce(data.goodsUuid);
				// }, timer);
			}
		}

		self.setDetail = function (data) {
			return function () {
				store.detail.set(data);
			}
		};

		self.scan = function () {
			window.dispatchEvent(new Event('inputNumber'));
		};

		self.modalOpts = {
			onSubmit: function () {
				httpPost({
					url: api.cartByScan,
					params: $('#add-product-form').serializeObject(),
					success: function (res) {
						store.cart.get();
						self.addModal.close();
					},
					error: function (res) {}
				});
			},
			onClose: function () {
				self.addModal.find('input').val('');
			}
		};

		self.on('mount', function () {
			var scroll = $(self.root).find('.shopping-list');
			self.addModal = $('#add-product')[0];
			window.addEventListener('inputNumber', barcodeHandle);
			scroll.bind('scroll', scrollHandler);
		});

		self.on('unmount', function () {
			var scroll = $(self.root).find('.shopping-list');
			window.removeEventListener('inputNumber', barcodeHandle);
			scroll.unbind('scroll', scrollHandler);
		});
	</script>
</casher-cart>
