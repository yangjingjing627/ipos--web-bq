<products>
	<div class="products-new" id="productsNew">
		<div class="products-top">
			<div class="product-tool-bar">
				<div class="sub-search">
					<search opts={ searchOpts }></search>
				</div>
				<!-- <div class="">
					<input type="button" style="width:40px;height:20px;background-color:#f66;" onclick={ scan } name="name" value="">
				</div> -->
				<div class="btn-group">
					<button>
						<a onclick="{ setTitle }">导入已有商品库</a>
					</button>
				</div>
			</div>
			<div class="category-content">
				<ul class="product-class-wraper">
					<li each="{ category }" class="product-class { active: active }" onclick="{ changeCate }">
						<a>{ cateName }</a>
					</li>
					<div class="clearfix"></div>
				</ul>
			</div>
		  <div class="category-count">
				<span class="line-left"></span>
				<span class="line-center">商品总数：{ goodsCount }</span>
				<span class="line-right"></span>
			</div>
		</div>

		<ul class="product-item-wraper">
			<li class="create-product" onclick="{ openCreate }" if={ addproduct }><img src="imgs/add-product.png"></li>
			<li class="product-item" each="{ goodList }" onclick="{ openDetail }">
				<img src="{ imageUrl || 'imgs/default-product.png'}">
				<div class="product-summary">
					<div class="product-name">
						<span>{ goodsName }</span>
					</div>
					<div class="product-attr">
						<span>进价：</span>
						<span>{ countPrice(purchasePrice) }</span>
					</div>
					<div class="product-attr">
						<span>售价：</span>
						<span>{ countPrice(price) }</span>
					</div>
					<div class="product-attr">
						<span>库存：</span>
						<span>{ stockNumber || 0}</span>
					</div>
				</div>
			</li>
			<div class="clearfix"></div>
		</ul>
	</div>
	<modal modal-width="" modal-height="" delete id="prodcut-detail" title="编辑商品">
		<update-product></update-product>
	</modal>

	<modal modal-width="" modal-height="" id="create-product" title="添加商品" continue="继续添加">
		<create-product></create-product>
	</modal>

	<modal modal-width="" modal-height="" id="input-barcode">
		<input-barcode></input-barcode>
	</modal>
	<script>
		var self = this;
		self.next = 0;
		self.scrollLock = false;
		self.setTitle = function() {
			utils.setTitle("#/shop/import-custom", '导入已有商品库')
		}
		self.openDetail = function (e) {
			self.update()
			var item = e.item;
			$('#prodcut-detail')[0].open(item);
		}

		self.openModal = function (id) {
			return function (e) {
				var item = e.item;
				$('#' + id)[0].open(item);
			}
		}

		self.openCreate = function () {
			if (store.online) {
				$('#create-product')[0].open();
			} else {
				$('#input-barcode')[0].open();
			}
		}

		openModalwidthSearch(id) {
			return function (item) {
				$('#' + id)[0].open(item);
			}
		}

		self.createProductFromCode = function (number) {
			var curModal = $('#create-product');
			var cur = curModal[0];
			var styleInfo;
			if (cur.attributes && cur.attributes.getNamedItem) {
				styleInfo = cur.attributes.getNamedItem("style");
			}
			if (!styleInfo || (styleInfo.value && styleInfo.value.indexOf("display:flex;") < 0 && styleInfo.value.indexOf("display: flex;") < 0)) {
				$('#create-product')[0].open();
			}
			httpGet({
				url: api.goodBySpecBarcode,
				params: {
					barcode: number
				},
				success: function (res) {
					$('#create-product .barcode-input').val(number);
					$('#create-product [name="goodsName"]').val(res.data.goodsName);
					$('#create-product [name="cateId"]').val(res.data.cateId);
					if (res.data.imageUrl) {
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

		self.barcodeHandle = function () {
			var number = scanNumber;
			// var number = '6920912342002';
console.log(number + "---------number--------");
			self.getGoodsInfo(number);
		}
		self.scan = function () {
			scanNumber = 132535
			window.dispatchEvent(new Event('inputNumber'));
		};
		// self.testNumber = function(){ 	self.getGoodsInfo("2434453545663"); }
		self.getGoodsInfo = function (number) {
			if (!number) {
				$('#create-product')[0].open();
				return;
			}
			httpGet({
				url: api.goodByBarcode,
				params: {
					barcode: number
				},
				success: function (res) {
					if (res.data) {
						$('#prodcut-detail')[0].open(res.data);
						// console.log(JSON.stringify(res.data) + '---------product img--------');
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
		}

		self.initCategory = function () {
			flux.bind.call(self, {
				name: 'category',
				store: store.categoryAll,
				success: function () {
					self.addproduct = true;
					self.cateId = self.category[0].cateId;
					self.category[0].active = true;
					self.update();
					// self.cateHeight = $(".products-top").height();
					// $(".products-new").css("padding-top", self.cateHeight);
					// document.getElementById("productsNew").style.paddingTop= self.cateHeight+"px"
					self.cateHeight = $(".products-new").height() - $(".products-top").height();
					$(".product-item-wraper").css("height", self.cateHeight);
					self.initGoods(self.cateId);
				}
			});
		}

		self.initGoods = function (cateId) {
			var params = {
				cateId: cateId,
				next: 0
			};
			self.getGoodsCount(cateId);
			flux.bind.call(self, {
				name: 'goods',
				store: store.goods,
				params: params,
				success: function () {
					var list = self.goods.list
					for (var i = 0; i < list.length; i++) {
						var stockNumber = list[i].stockNum
						list[i].stockNumber = stockNumber
						if(list[i].unit=='6' || list[i].unit=='9'){
							list[i].stockNumber = (list[i].stockNum / 1000).toFixed(3) * 1;
						}else if(list[i].unit=='7' || list[i].unit=='8'){
							list[i].stockNumber = (list[i].stockNum / 1000000).toFixed(3) * 1;
						}else if(list[i].unit=='5'){
							list[i].stockNumber = (list[i].stockNum / 1000000 * 2).toFixed(3) * 1;
						}
					}
					self.next = self.goods.next;
					self.goodList = list;
					self.update()
				}
			});
		}

		self.searchOpts = {
			clickHandle: self.openModalwidthSearch('prodcut-detail')
		};

		countPrice(price) {
			if (price) {
				return '￥' + price;
			}
		}

		self.on('mount', function () {
			self.initCategory();
			self.listenDown();
			window.addEventListener('inputNumber', self.barcodeHandle, false);
		});

		self.on('unmount', function () {
			window.removeEventListener('inputNumber', self.barcodeHandle);
			if (self.listWrap && self.scrollDown) {
				self.listWrap.removeEventListener('scroll', self.scrollDown);
			}
		})

		/*
   	 *  下拉获取更多
     */
		self.listenDown = function () {
			setTimeout(function () {
				self.listWrap = $('.product-item-wraper')[0];
				self.scrollDown = function (event) {
					var clientHeight = self.listWrap.clientHeight;
					var scrollTop = self.listWrap.scrollTop;
					if ((clientHeight + scrollTop) > self.listWrap.scrollHeight - 60) {
					// if ((clientHeight + scrollTop) > 0) {
						// console.log((clientHeight + scrollTop) + '---scrollTop----');
						if (self.next && !self.scrollLock) {
							self.scrollLock = true;
							store.goods.getMore({
								cateId: self.cateId,
								next: self.next
							}, function (next) {
								self.next = next;
								self.scrollLock = false;
							});
						}
					}
				};
				self.listWrap.addEventListener('scroll', self.scrollDown, false);
			}, 50);
		}

		self.getGoodsCount = function (cateId) {
			store.getGoodsCountByCateId.get({
				cateId: cateId
			}, function (data) {
				self.goodsCount = data;
				self.update();
			});
		}

		self.changeCate = function (e) {
			self.cateId = e.item.cateId;
			for (var i = 0; i < self.category.length; i++) {
				if (self.category[i].cateId == parseInt(self.cateId, 10)) {
					self.category[i].active = true;
				} else {
					self.category[i].active = false;
				}
				if (self.cateId === null) {
					self.category[0].active = true;
				}
			}
			self.getGoodsCount(self.cateId);

			store.goods.get({cateId: self.cateId, next: 0});
		}
	</script>
</products>
