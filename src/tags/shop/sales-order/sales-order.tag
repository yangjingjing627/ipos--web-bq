<sales-order>
	<div class="calendar-bar">
		<span class="prev-day" onclick="{ prevDay }">前一天</span>
		<date-picker></date-picker>
		<span class="next-day" onclick="{ nextDay }">后一天</span>
		<a class="switch" onclick="{ setTitle }" if="{ type==1 }">退货单</a>
	</div>
	<div class="half">
		<div class="card">
			<div class="order-overview">
				<div>
					<dt>结算额：</dt><dd>￥{ amount }</dd>
				</div>
				<div if="{ type==1 && viewProfit }">
					<!-- <dt>利润：</dt><dd>￥{ profit }</dd> -->
				</div>
				<div class="sum">
					<span>共</span>
					<span class="number">{ orderCount }</span>
					<span>笔结算单</span>
				</div>
			</div>
			<div class="order-list-wraper">
				<ul class="order-list">
					<li each="{ orderList }" class="{ active: active }" onclick="{ chooseOrder }">
						<div>
							<span>{ billSn }</span>
							<span style="float: right;">{ getTimeStr(addTime) }</span>
						</div>
						<div>
							<span style="padding-right: 1.296296rem">
								<span>收银：</span>
								￥{ amount }
							</span>
							<span if="{viewProfit}">利润：￥{ profit }</span>
						</div>
						<div>
							支付方式：{ paymentTypeMap(paymentType) }
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>

	<div class="half">
		<div class="card order-detail-wraper" if="{ currentOrder }">
			<div class="order-base">
				<h4 onclick="{ print }">
					{ orderDetail.billSn }
				</h4>
				<div class="order-time">
					时间：{ getDateTimeStr(orderDetail.addTime)}
				</div>
				<div class="order-handle">
					<span>收银员：{ orderDetail.personName || '未知'}</span>
					<span class="pull-right">支付方式：{ paymentTypeMap(orderDetail.paymentType) }</span>
				</div>
			</div>
			<div class="order-detail-list">
				<li>
					<span style="width: 9%">项</span>
					<span style="width: 34%">品名</span>
					<span style="width: 13%">数量</span>
					<span style="width: 13%">单价</span>
					<span style="width: 13%">小计</span>
					<span style="width: 12%" if="{viewProfit}">利润</span>
				</li>
				<ul>
					<li each="{ item in orderDetail.list }">
						<span style="width: 9%">{ orderDetail.list.indexOf(item) + 1}</span>
						<span style="width: 34%">{ item.goodsName || '无码商品' }</span>
						<span style="width: 13%">{ item.weight || ' '}</span>
						<span style="width: 13%">{ item.price || ' ' }</span>
						<span style="width: 13%">{ item.amount || ' ' }</span>
						<span style="width: 12%" if="{viewProfit}">{ item.profit || 0 }</span>
					</li>
				</ul>
			</div>
			<div class="order-sales-detail">
				<div class="">
					<span>总项：{ orderDetail.list.length } 总数：{ countNumber(orderDetail.list) }</span>
					<span class="pull-right">总金额：￥{ orderDetail.goodsAmount }</span>
				</div>
				<div class="">
					<span>折扣：{ (orderDetail.discountPct || 100) + '%' }</span>
					<span class="pull-right" if={ orderDetail.couponAmount }>优惠券：<b>-¥{ orderDetail.couponAmount }</b></span>
				</div>
			</div>
					<span>实收：<b>￥{ orderDetail.amount }</b></span>
					<span class="pull-right" if="{ viewProfit }">总利润：<b>￥{ orderDetail.profit }</b></span>
				</div>
			</div>
		</div>
	</div>

	<script>
		var self = this;

		self.viewProfit = true;
		self.getType = function() {
			if (location.hash.match(/\/shop\/sales-order/)) {
				self.type = 1; //1为结算单，2为退货单
			}
			else if ( location.hash.match(/\/shop\/return-order/) ){
				self.type = 2; //1为结算单，2为退货单
			}
		}

		self.getType();
		// riot.routeParams.off('changed', self.changeType);
		self.changeType = function() {
			var date = self.getDateStr(new Date().getTime());
			var oldType = self.type;
			self.getType();
			if (oldType !== self.type) {
				self.currentOrder = null;
				flux.update(store.salesOrder, { type: self.type, date: date });
			}
		}

		self.paymentTypeMap = function(type) {
			switch (type) {
				case 1:
					return '现金';
					break;
				case 2:
					return '支付宝';
					break;
				case 3:
					return '微信支付';
					break;
				case 4:
					return '刷卡';
					break;
				default:
					return '现金';
			}
		}

		self.stockAddMap = function(type) {
			switch (type) {
				case 0:
					return '未增加库存';
					break;
				case 1:
					return '已增加库存';
					break;
				default:
					return '未增加库存';
			}
		}

		self.getDateStr = function(time) {
			return utils.getDateStr(time);
		}

		self.getTimeStr = function(time) {
			return utils.getTimeStr(time);
		}

		self.getDateTimeStr = function(time) {
			return utils.getDateTimeStr(time);
		}

		self.countNumber = function(arr) {
			var number = 0;
			arr.forEach(function(item) {
				if (item.weight) {
					number = number + item.weight;					//1
					// number = Math.round(number*1000)/1000;	//方法存在问题,12
					number = number.toFixed(3) * 1;				//此方法可以,13
					// number = (number*1000 + item.weight*1000)/1000;//4
				}
			});
			return number;
		}

		self.print = function(e) {
			//打印本地逻辑
			httpGet({
				url: api.salePrintBill,
				params: { billUuid: self.currentOrder.billUuid },
				success: function(res) {
	            }
	        });
		}
		self.init = function() {
			var date = self.getDateStr(new Date().getTime());
			flux.bind.call(self, {
				name: 'orders',
				store: store.salesOrder,
				params: { type: self.type, date: date },
				success: function() {
					// self.orders[1].active = true;
					self.amount = self.orders.amount;
					self.profit = self.orders.profit;
					self.orderList =  self.orders.list;
					self.orderCount = self.orders.list.length;
					self.update();
				}
			});
		}

		self.getDetail = function(uuid) {
			store.orderGoods.getGoodsDetail({billUuid: uuid, type: self.type},function(data){
				self.orderDetail = data;
				self.update();
			})

		}
		self.setTitle = function() {
			utils.setTitle("#/shop/return-order", '退货单')
		}
		self.chooseOrder = function(e) {
			self.orderList.forEach(function(item) {
				item.active = false;
			});
			e.item.active = true;
			self.currentOrder = e.item;
			var uuid = self.currentOrder.billUuid || self.currentOrder.refundBillUuid;
			self.getDetail(uuid);

			self.update();
		}

		self.checkAuth = function() {
			httpGet({
                url: api.auth,
                success: function(res) {
                    self.auth = res.data.permissionCodes.split(',');
                   	if (self.auth.indexOf('32') < 0) {
                        self.viewProfit = false;
                    }
                    self.update();
                }
            });
		}

		self.nextDay = function() {
			self.currentOrder = null;
			$(self.root).find('date-picker')[0].nextDay();
		}

		self.prevDay = function() {
			self.currentOrder = null;
			$(self.root).find('date-picker')[0].prevDay();
		}

		self.on('dateChange', function() {
			var date = $(self.root).find('date-picker')[0].value;
			flux.update(store.salesOrder, { type: self.type, date: date });
		});

		self.on('mount', function() {
			self.init();
			self.checkAuth();
// 			riot.routeParams.one('changed', self.changeType);
		});

	</script>
</sales-order>
