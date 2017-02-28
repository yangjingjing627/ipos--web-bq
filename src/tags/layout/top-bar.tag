<top-bar>
	<div id="top-bar">
		<div id="page-title">
			<div class="title" if="{ title }">
				<a class="back" if="{ back }" href="{ back }">返回</a>
				{ title }</div>
			<div id="top-search" if="{ search }">
				<search opts={ searchOpts }></search>
			</div>
			<div id="type-list" if="{ hasAdd }" onclick={ toggleProducts }>
				<div class="tri" if={ showProducts }>
					<div></div>
				</div>
			</div>
		</div>
		<div id="status">
			<span if={ weather.city }>{ weather.city }</span>
			<!-- <span class="icon i_sunny"></span> -->
			<span if={ weather.weather }>{ weather.weather }</span>
			<span if={ weather.temp }>{ weather.temp }℃</span>
			<span>{ nowDate }</span>
			<span class="icon i_wifi_full" if={ netState=='wifi' }></span>
			<span class="icon i_wifi_weak" if={ netState=='weak' }></span>
			<span class="icon i_wifi_no" if={ netState=='no' }></span>
			<!-- <span if={ netState!=='wifi' }>{ netState }</span> -->
		</div>
		<!-- 		<div id="test-code" onclick={ scan }>扫码</div> -->
		<!-- 		<div id="test-code" onclick={ scan1 } style="left:240px">扫码2</div> -->
	</div>
	<div id='product-layer' if={ hasAdd & showProducts }>
		<div class="category top-category">
			<h2>商品分类</h2>
			<ul>
				<li each="{ category }" onclick="{ changeCate }" class="{ active: active }">
					<a cateid="{ cateId }">{ cateName }</a>
				</li>
			</ul>
		</div>
		<div class="product-list">
			<!-- 			<h2>精选商品</h2> -->
			<ul class="top-goods-list">
				<li each={ item in goodList } onclick="{ addToCart(item) }">
					<div class="item-pic" style="background-image:url({ item.imageUrl || 'imgs/default-product.png' })"></div>
					<p>{item.goodsName || '无码商品' }</p>
					<strong>￥{ item.price }</strong>
				</li>
			</ul>
		</div>
	</div>

	<script>
		var self = this;
		store.loadTopGoodsList = true;
		self.topGoodsListScroll = 0;

		self.scan = function () {
			// 			window.Icommon = window.Icommon || {}; 			window.Icommon.number = '6920912342002';
			window.dispatchEvent(new Event('inputNumber'));
		};
		self.scan1 = function () {
			window.Icommon = window.Icommon || {};
			window.Icommon.number = '690168054050';
			window.dispatchEvent(new Event('inputNumber'));
		};
		self.checkNet = function () {
			if (window.navigator.connection) {
				var type = window.navigator.connection.type;
				switch (type) {
					case 'Unknown connection':
						self.netState = 'unknown'; //unknown
						break;
					case 'WiFi connection':
						self.netState = 'wifi'; //wifi
						break;
					case 'Cell 2G connection':
						self.netState = '2G'; //2G
						break;
					case 'Cell 2G connection':
						self.netState = '3G'; //3G
						break;
					case 'Cell 2G connection':
						self.netState = '4G'; //4G
						break;
					case 'No network connection':
						self.netState = 'no'; //no
						break;
					case 'wifi':
						self.netState = 'wifi';
						break;
					case 'none':
						self.netState = 'no';
						break;
					default:
						self.netState = 'no';
				}
			} else {
				self.netState = 'wifi';
			}
			//每当触发网络变更,就更新天气状态
			flux.bind.call(self, {
				name: 'weather',
				store: store.weather,
				success: function () {
					self.update();
				},
				error: function () {
					self.update();
				}
			});
			self.update();
		}

		document.addEventListener("online", self.checkNet, false);
		document.addEventListener("offline", self.checkNet, false);

		riot.routeParams.on('changed', function () {
			var params = riot.routeParams.params;
			if (params) {
				self.title = params.title;
				self.back = params.back;
				self.search = params.search;
				self.hasAdd = params.hasAdd;
				if (params.hasAdd) {
					setTimeout(function () {
						$(".content-wrap").bind('click', hideProduct);
					}, 200);
				}
			} else {
				self.title = false;
				self.back = false;
				self.search = false;
				self.hasAdd = false;
			}
			self.update();
		});

		function scrollCart() {
			var scroll = $('#casherCartShopList');
			var scrollTop = scroll[0].scrollHeight;
			scroll[0].scrollTop = scrollTop;
		}
		function addToCart(item) {
			item.quantity = 1;

			var list = self.cartList.list;

			if (list.length) {
				for (var i = 0; i < list.length; i++) {
					if (list[i].goodsUuid == item.goodsUuid) {
						list[i].quantity++;
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

		self.searchOpts = {
			clickHandle: addToCart
		};

		self.addToCart = function (item) {
			return function () {
				addToCart(item);
				// 				self.showProducts = false;
				self.update();
			};
		};

		function hideProduct() {
			self.showProducts = false;
			self.update();
			if (self.listWrap && self.scrollDown) {
				self.listWrap.removeEventListener('scroll', self.scrollDown);
			}
			$(".content-wrap").unbind('click', hideProduct);
		}

		self.toggleProducts = function () {
			var e = window.event;
			e.preventDefault();
			if (e && e.stopPropagation) {
				e.stopPropagation();
			}
			self.showProducts = self.showProducts? false : true;

			if (self.showProducts) {
				setTimeout(function () {
					$(".content-wrap").bind('click', hideProduct);
				}, 100);
			} else {
				$(".content-wrap").unbind('click', hideProduct);
			}

			self.update();
			if (self.showProducts == true) {
				if(store.loadTopGoodsList){
					store.loadTopGoodsList = false;
					self.initCategory();
				}else{
					$('.top-goods-list').scrollTop(self.topGoodsListScroll);
				}
			} else {
				if (self.listWrap && self.scrollDown) {
					self.listWrap.removeEventListener('scroll', self.scrollDown);
				}
			}
		};

		self.initCategory = function () {
			store.category.get(function(data){
				self.category = data;
				self.topGoodsListScroll = 0;
				for (var i = 0; i < self.category.length; i++) {
					if (self.category[i].cateId == parseInt(self.cateId, 10)) {
						self.category[i].active = true;
					} else {
						self.category[i].active = false;
					}
					if (!self.cateId) {
						self.cateId = self.category[0].cateId;
						self.category[0].active = true;
					}
				}
				self.update();
				self.cateHeight = $("#product-layer").height() - $(".top-category").height() - 38;
				$(".product-list").css("height", self.cateHeight);
				self.initGoods(self.cateId);
			});
		}

		self.initGoods = function (cateId) {
			var params = {
				cateId: cateId,
				next: 0
			};
			store.topGoods.get(params,function(data){
				self.goods = data;
				self.goodList = self.goods.list;
				self.next = self.goods.next;
				self.update();
				self.listenDown();
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
			self.topGoodsListScroll = 0;
			$('.top-goods-list').scrollTop(0);
			self.initGoods(self.cateId);
		}

		/*
         *  下拉获取更多
         */
		self.listenDown = function () {
			setTimeout(function () {
				self.listWrap = $('.top-goods-list')[0];
				self.scrollDown = function (event) {
					var clientHeight = self.listWrap.clientHeight;
					var scrollTop = self.listWrap.scrollTop;
					self.topGoodsListScroll = self.listWrap.scrollTop;
					if ((clientHeight + scrollTop) > self.listWrap.scrollHeight - 60) {
						if (self.next && !self.scrollLock) {
							self.scrollLock = true;
							store.topGoods.getMore({
								cateId: self.cateId,
								next: self.next
							}, function (data) {
								self.next = data.next;
								self.goodList = data.list;
								self.scrollLock = false;
								self.update();
							});
						}
					}
				};
				if (self.listWrap) {
					self.listWrap.addEventListener('scroll', self.scrollDown, false);
				}
			}, 50);
		}

		self.initDate = function () {
			var date = new Date();
			var months = date.getMonth() + 1;
			var hours = date.getHours();
			var minutes = date.getMinutes();
			if (months < 10) {
				months = "0" + months;
			}
			var days = date.getDate();
			if (days < 10) {
				days = "0" + days;
			}
			if (hours < 10) {
				hours = "0" + hours;
			}
			if (minutes < 10) {
				minutes = "0" + minutes;
			}
			var dateStr = date.getFullYear() + "年" + months + "月" + days + "日";
			var week = date.getDay();
			var time = hours + ":" + minutes;
			var weekarr = [
				'日',
				'一',
				'二',
				'三',
				'四',
				'五',
				'六'
			];
			self.nowDate = dateStr + " 周" + weekarr[week] + " " + time;
			self.update();
			setTimeout(self.initDate, 60000);
		}

		self.on('mount', function () {
			self.checkNet();
			self.initDate();
			flux.bind.call(self, {
				name: 'cartList',
				store: store.cart
			});
		})
	</script>
</top-bar>
