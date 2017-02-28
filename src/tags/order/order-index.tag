<order-index>
	<div class="order-index">
		<div class="order-top">
			<div class="order-status">接单状态:</div>
			<div class="order-status-img" if={ !storeOpen }>
				<span id="orderStatusText">不接单</span>
				<div class="img" onclick={ orders }></div>
			</div>
			<div class="order-status-img" if={ storeOpen }>
				<span id="orderStatusText">接单</span>
				<div class="img active" onclick={ orders }></div>
			</div>
			<div class="history icon" onclick={ histroyOrder }>历史订单</div>
		</div>
		<div class="order-tag" if={ storeOpen }>
			<ul>
				<li onclick={ orderList } status={ status } each={ order } class={ active:active }>
					<div class="num" style="display:none" if={ num } id="unconfirmedOrderNum"></div>
					{ statusStr }
				</li>
			</ul>
		</div>
		<div class="order-content">
			<div class="order-left { empty:!orderToday.list.length }" id="orderListLi" if={ storeOpen }>
				<div class="order-list { active:active }" each={ orderToday.list } onclick={ list }>
					<div class="title">下单时间：<i class="f22-r">{ createTime }</i>
					</div>
					<div class="info">
						<ul>
							<li>订单号：{ code }</li>
							<li>收货人：{ addrUserName }</li>
							<li>收货电话：{ addrUserMobile }</li>
							<li>收货地址：{ addrInfo }</li>
							<li>配送时间：{ postTime }</li>
						</ul>
					</div>
					<div class="title">金额：<i class="f22-r">￥{ payPrice }</i>
						<i class="pad-tot">共计{ totalCount }件</i>
					</div>
				</div>
			</div>
			<div class="order-right">
				<div class="order-list { order-no-button: (detail.status==4) }" if={ storeOpen && orderToday.list.length>0 }>
					<div class="title text-c">在线订单(<i class="f22-r">{ detail.code }</i>)
						<div class="order-print" onclick={ orderPrint }></div>
					</div>
					<div class="o-d-con">
						<div class="title">商品明细</div>
						<div class="info">
							<ul>
								<li each={ detail.goods }>{ goodsName }<div class="amount price">X{ goodsCount }</div>
									<div class="price">￥{ buyTotalPrice }</div>
								</li>
							</ul>
						</div>
						<div class="info">
							<ul>
								<li>配送费：<div class="price">￥{ detail.postPrice }</div>
								</li>
								<li class="coupon" if={ detail.couponAmount }>优惠券：<div class="price">－¥{ detail.couponAmount }</div>
								</li>
								<li>总计：<div class="price">￥{ detail.payPrice }</div>
								</li>
							</ul>
						</div>
						<div class="title">配送明细</div>
						<div class="info border-none">
							<ul>
								<li>订单状态：{ detail.statusStr }</li>
								<li if={ detail.cancelUserName }>取消人：{ detail.cancelUserName }</li>
								<li if={ detail.cancelReason }>取消原因：{ detail.cancelReason }</li>
								<li>下单时间：{ detail.createTime }</li>
								<li>收货人：{ detail.addrUserName }</li>
								<li>收电话：{ detail.addrUserMobile }</li>
								<li>收货地址：{ detail.addrInfo }</li>
								<li>配送时间：{ detail.postTime }</li>
								<li>买家留言：{ detail.remark }</li>
							</ul>
						</div>
					</div>
					<div class="button">
						<a class="cancel" onclick={ cancel } if={ detail.status==3 }>设为无效</a>
						<div class="fl-left width-50" if={ detail.status==2 }>
							<a class="cancel" onclick={ cancel }>设为无效</a>
						</div>
						<div class="fl-right width-50" if={ detail.status==2 }>
							<a class="sure" onclick={ served }>已送达</a>
						</div>
						<div class="fl-left width-50" if={ detail.status==1 }>
							<a class="cancel" onclick={ denialOrders }>拒绝订单</a>
						</div>
						<div class="fl-right width-50" if={ detail.status==1 }>
							<a class="sure" onclick={ confirmOrder }>确认订单</a>
						</div>
						<div class="clear"></div>
						<input type="hidden" id="orderId" value="{ detail.orderId }"/>
					</div>
				</div>
			</div>
		</div>
		<modal id="order-warning" modal-width="200px" modal-height="80px" nofooter>
			<p class="warning-text">{ parent.warningText }</p>
		</modal>
	</div>
	<script>
		var self = this;
		self.size = 5;
		self.status = 1;

		histroyOrder(e) {
			// window.location.href = "#/order/history";
			utils.setTitle("#/order/history", '历史订单')

		}

		self.orderPrint = function () {
			store.printOrderDetail.get(self.detail);
		}

		self.getOrderPrintState = function () {
			if (store.online) {
				httpGet({
					url: api.getOrderPrintState,
					complete: function (data) {
						self.orderPrintState = data.data.nameValuePairs.printOrderState;
						self.update();
					}
				});
			}
		}

		function warning(text) {
			var layer = $('#order-warning')[0];

			self.warningText = text;
			self.update();
			layer.open();
			setTimeout(function () {
				layer.close();
			}, 1000);
		}

		self.toBeConfirmed = function () {
			store.orderConfirmed.get(function (data) {
				if (data > 0) {
					$("#unconfirmedOrderNum").show().text(data);
					$(".order-untreated").show().text(data);
				} else {
					$("#unconfirmedOrderNum").hide();
					$(".order-untreated").hide();
				}
			});
		}

		orders(e) {
			var status = 2;
			if (!($(".img").is(".active"))) {
				status = 1;
			}
			var param = {
				status: status
			};
			store.upCanOrder.get(param, function () {
				if (status == 1) {
					self.storeOpen = true;
					self.orderListAll();
				} else {
					self.storeOpen = false;
				}
				self.update();
			});
		}

		confirmOrder(e) { //确认订单
			var orderId = $("#orderId").val();
			var param = {
				orderId: orderId
			};


			store.orderConfirm.get(param, function (data) {
				warning("操作成功");
				if (self.orderPrintState) {
					self.orderPrint();
				}
				self.orderListAll();
				utils.androidBridge(api.updateNum,{},function() {
				})
				self.update();
			});

		}

		denialOrders(e) { //拒绝订单
			var refuse = $("<order-refuse></order-refuse>");
			$("order-index").append(refuse);
			riot.mount("order-refuse");

		}

		served(e) { //已送达
			var orderId = $("#orderId").val();
			var param = {
				orderId: orderId
			};
			store.orderComplete.get(param, function (data) {
				warning("操作成功");
				self.orderListAll();
				httpGet({
						// url: Icommon.syn,
						url: api.synTask,

						params: {name: "StoreOrder"},
						success: function(res) {
						},
				});

			});

		}

		cancel(e) { //无效
			var refuse = $("<order-invalid></order-invalid>");
			$("order-index").append(refuse);
			riot.mount("order-invalid");
		}

		orderList(e) {
			var status = e.status;
			if (e.item.active == false) {
				for (var i = 0; i < self.order.length; i++) {
					self.order[i].active = false;
				}
				e.item.active = true;
				var status = e.item.status;
				self.status = status;
				self.update();
				self.orderListAll();
			}
		}

		self.orderListAll = function () {
			var params = {
				page: 1,
				size: self.size,
				status: self.status
			};
			store.orderToday.get(params, function (data) {
				self.total = data.total;
				self.page = data.page;
				self.orderToday = data;
				if (data.list && data.list.length > 0) {
					data.list[0].active = true;
					self.detail = data.list[0];
				}

				self.update();
				self.toBeConfirmed();
			});
		}

		list(e) {
			for (var i = 0; i < self.orderToday.list.length; i++) {
				self.orderToday.list[i].active = false;
			}
			e.item.active = true;
			self.detail = e.item;
			self.update();
		}

		self.on('mount', function () {
			self.order = [
				{
					status: 1,
					statusStr: "待确认",
					active: true,
					num: true
				}, {
					status: 2,
					statusStr: "待送达",
					active: false,
					num: false
				}, {
					status: 3,
					statusStr: "已完成",
					active: false,
					num: false
				}, {
					status: 4,
					statusStr: "无效订单",
					active: false,
					num: false
				}
			]
			self.update();
			self.init();
			self.toBeConfirmed();
			self.nextPage();

			window.addEventListener('orderNumChange', self.orderListAll);
		});

		self.on('unmount', function () {
			window.removeEventListener('orderNumChange', self.orderListAll);
		});

		self.nextPage = function () {
			var curPage = 1;
			$("#orderListLi").scroll(function () {
				if (curPage == 1) {
					self.listWrap = $('#orderListLi')[0];
					var clientHeight = self.listWrap.clientHeight;
					var scrollTop = self.listWrap.scrollTop;
					if ((clientHeight + scrollTop) > self.listWrap.scrollHeight - 20) {
						if (!self.page) {
							self.page = 1;
						}
						if (!self.status) {
							self.status = 1;
						}
						if (self.page < (self.total / self.size)) {
							curPage = 2;
							var param = {
								page: self.page + 1,
								size: self.size,
								status: self.status
							};
							store.orderToday.getMore(param, function (data) {
								self.page = data.page;
								self.orderToday = data;
								self.update();
								curPage = 1;
							});
						}
					}
				} else {
					return;
				}
			});
		}

		self.init = function () {
			self.getOrderPrintState();
			store.storeInfo.get({}, function (data) {
				if (data.state == 2) {
					self.storeOpen = false;
				} else {
					self.storeOpen = true;
					self.orderListAll();
				}
				self.update();
			});
		}
	</script>
</order-index>
