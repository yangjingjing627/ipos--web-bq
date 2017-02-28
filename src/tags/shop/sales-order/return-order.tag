<return-order>
    <div class="calendar-bar">
        <span class="prev-day" onclick="{ prevDay }">前一天</span>
        <date-picker></date-picker>
        <span class="next-day" onclick="{ nextDay }">后一天</span>
        <a class="switch" onclick="{ setTitle }" if="{ type==2 }">结算单</a>
    </div>
    <div class="half">
        <div class="card">
            <div class="order-overview">
                <div>
                    <dt>退款额：</dt><dd>￥{ amount }</dd>
                </div>
                <div class="sum">
                    <span>共</span>
                    <span class="number">{ orderCount }</span>
                    <span if="{ type==2 }">笔退货单</span>
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
                                <span>退款：</span>
                                ￥{ amount }
                            </span>
                            <span if="{ type==1 }">利润：￥{ profit }</span>
                        </div>
                        <div>{ stockAddMap(stockAdd) }</div>
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
                    <span class="pull-right">{ stockAddMap(orderDetail.stockAdd) }</span>
                </div>
            </div>
            <div class="order-detail-list"} >
                <li>
                    <span style="width: 11%">项</span>
                    <span style="width: 42%">品名</span>
                    <span style="width: 14%">数量</span>
                    <span style="width: 14%">单价</span>
                    <span style="width: 14%">小计</span>
                </li>
                <ul>
                    <li each="{ item in orderDetail.list }">
                        <span style="width: 11%">{ orderDetail.list.indexOf(item) + 1}</span>
                        <span style="width: 42%">{ item.goodsName || ' ' }</span>
                        <span style="width: 14%">{ item.quantity || ' '}</span>
                        <span style="width: 14%">{ item.price || ' ' }</span>
                        <span style="width: 14%">{ item.amount || ' ' }</span>
                    </li>
                </ul>
            </div>

            <div class="return-order-summary">
                <div>
                    <span>总项：{ orderDetail.list.length }</span>
                    <span class="pull-right">总金额：<b>￥{ orderDetail.amount }</b></span>
                </div>
                <div>
                    <span>总数：{ countNumber(orderDetail.list) }</span>

                </div>
            </div>
        </div>
    </div>
    <script>
        var self = this;
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
                if (item.quantity) {
                    number = number + item.quantity;
                }
            });
            return number;
        }

        self.print = function(e) {
            //打印本地逻辑
            httpGet({
                url: api.printBill,
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
            httpGet({
                url: api.orderGoods,
                params: {billUuid: uuid, type: self.type},
                success: function(res) {
                    self.orderDetail = res.data;
                    self.update();
                }
            });
        }
        self.setTitle = function() {
          utils.setTitle("#/shop/sales-order", '结算单')
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
//             riot.routeParams.one('changed', self.changeType);
        });

    </script>
</return-order>
