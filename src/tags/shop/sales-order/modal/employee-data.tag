<employee-data>
    <div class="calendar-bar">
        <!-- <span class="prev-day" onclick="{ prevDay }">前一天</span>
  		<date-picker></date-picker>
  		<span class="next-day" onclick="{ nextDay }">后一天</span> -->
        <div class="chart-top">
            <div class="chart-dater">
                <daterangepicker></daterangepicker>
            </div>
        </div>

        <!-- <a class="switch" href="#/shop/return-order" if="{ type==1 }">退货单</a> -->
    </div>
    <div class="half">
        <div class="card employee-card">
            <div class="order-list-wraper">
                <ul class="order-list employee-data-list" if="{ logoutRecordList == '' }">
                    交接班在此次时间段没有交易纪录。
                </ul>
                <ul class="order-list employee-data-list">
                    <li class="{ active: active } employee-data-detail" each="{ logoutRecordList }" onclick="{ chooseOrder }">
                        <div class="employee-date">
                            <dt>{ recordDate }</dt>

                        </div>
                        <div class="employee-date">
                            <span>收银员：{ userName }</span>

                        </div>
                        <div>
                            <span style="padding-right: 0.196296rem">
                                <span>店内收银:</span>¥{ offLineAmount }
                            </span>
                            <span>登陆时间:{ loginTime }</span>
                        </div>
                        <div>
                            <span style="padding-right: 0.296296rem">
                                <span>网店外送:</span>¥{ onLineAmount }
                            </span>
                            <span>退出时间:{ logoutTime }</span>
                        </div>

                    </li>
                    <!-- <li class="{ active: active } employee-data-detail" each="{ list }" onclick="{ chooseOrder }">
               <div class="employee-date">
                 <dt>2012-12-12</dt>

       				</div>
   						<div  class="employee-date">
               <span>收银员：王大行</span>

   						</div>
   						<div>
   							<span style="padding-right: 0.196296rem">
   								<span>店内收银:</span>¥23434.45{ offLineAmount }
   							</span>
 							<span>登陆时间:2012-12-12 12:12:12</span>
   						</div>
   						<div>
                 <span style="padding-right: 0.296296rem">
   								<span>网店外送:</span>¥123894843{ onLineAmount }
   							</span>
   							<span>退出时间:2012-12-12 12:12:12{ logoutTime }</span>
   						</div>

   					</li> -->

                </ul>
            </div>
        </div>
    </div>

    <div class="half">
        <div class="card employee-card order-detail-wraper" if="{ currentOrder }">
            <div class="order-base">
                <h4 onclick="{ print }">
                    收银员：{ currentOrder.userName }
                </h4>
                <div class="order-time">
                    登陆时间:{ currentOrder.loginTime }
                </div>
                <div class="order-time">
                    退出时间:{ currentOrder.logoutTime }
                </div>
                <div class="order-time employee-total">
                    总计:¥{ total }
                </div>
            </div>
            <div class="order-detail-list">
            <li>
                <span style="width: 28%"></span>
                <span style="width: 35%">店内收银</span>
                <span style="width: 35%">网店外送</span>
            </li>
            <ul>
                <li>
                    <span style="width: 28%">现金</span>
                    <span style="width: 35%">{ currentOrder.cashOffLine }</span>
                    <span style="width: 35%">{ currentOrder.cashOnLine }</span>
                </li>
                <li>
                    <span style="width: 28%">支付宝</span>
                    <span style="width: 35%">{ currentOrder.aliOffLine }</span>
                    <span style="width: 35%">{ currentOrder.aliOnLine }</span>
                </li>
                <li>
                    <span style="width: 28%">微信</span>
                    <span style="width: 35%">{ currentOrder.wechatOffLine }</span>
                    <span style="width: 35%">{ currentOrder.wechatOnLine }</span>
                </li>
                <li>
                    <span style="width: 28%">银行卡</span>
                    <span style="width: 35%">{ currentOrder.unionOffLine }</span>
                    <span style="width: 35%">{ currentOrder.unionOnLine || '---' }</span>
                </li>
                <li>
                    <span style="width: 28%">退货</span>
                    <span style="width: 35%" if="{ currentOrder.refundOffLine != 0}">{ '-' + currentOrder.refundOffLine }</span>
                    <span style="width: 35%" if="{ currentOrder.refundOffLine == 0}">{ currentOrder.refundOffLine }</span>
                    <span style="width: 35%">{ currentOrder.refundOnLine || '---' }</span>
                </li>
                <li>
                    <span style="width: 28%">合计</span>
                    <span style="width: 35%">{ currentOrder.offLineAmount }</span>
                    <span style="width: 35%">{ currentOrder.onLineAmount }</span>
                </li>
            </ul>
        </div>
    </div>
</div>
<script>
    var self = this;
    self.orderList = [
        {
            "id": 10381,
            "billUuid": "158e348bc09-9d6940e9354f7c",
            "storeId": 1,
            "billSn": "14812819400000101006",
            "addTime": 1481281935000,
            "paymentType": 1,
            "goodsAmount": 13.10,
            "discount": 1.96,
            "wipe": null,
            "amount": 11.10,
            "paymentAmount": 13.10,
            "change": 1.96,
            "profit": -2.00,
            "creationDate": 1481281935000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281944586001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 85
        }, {
            "id": 10380,
            "billUuid": "158e3486e1b-9d3ed9a435b4b2",
            "storeId": 1,
            "billSn": "14812819200000101005",
            "addTime": 1481281921000,
            "paymentType": 1,
            "goodsAmount": 3.90,
            "discount": 1.36,
            "wipe": null,
            "amount": 2.50,
            "paymentAmount": 3.90,
            "change": 1.36,
            "profit": -1.40,
            "creationDate": 1481281921000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281924636001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 65
        }, {
            "id": 10379,
            "billUuid": "158e34840c7-9dc60f13ca6c7c",
            "storeId": 1,
            "billSn": "14812819100000101004",
            "addTime": 1481281906000,
            "paymentType": 1,
            "goodsAmount": 12.30,
            "discount": 0.61,
            "wipe": 0.09,
            "amount": 11.60,
            "paymentAmount": 12.30,
            "change": 0.70,
            "profit": 1.10,
            "creationDate": 1481281906000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281913032001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 95
        }, {
            "id": 10378,
            "billUuid": "158e3480791-9dd8e330e68bd8",
            "storeId": 1,
            "billSn": "14812818900000101003",
            "addTime": 1481281897000,
            "paymentType": 1,
            "goodsAmount": 16.50,
            "discount": 0.00,
            "wipe": null,
            "amount": 16.50,
            "paymentAmount": 16.50,
            "change": 0.00,
            "profit": 5.00,
            "creationDate": 1481281897000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281898386001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 100
        }, {
            "id": 10377,
            "billUuid": "158e347d797-9debbf8ceb16bd",
            "storeId": 1,
            "billSn": "14812818800000101002",
            "addTime": 1481281885000,
            "paymentType": 1,
            "goodsAmount": 22.50,
            "discount": 0.00,
            "wipe": null,
            "amount": 22.50,
            "paymentAmount": 22.50,
            "change": 0.00,
            "profit": 8.00,
            "creationDate": 1481281885000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281886106001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 100
        }, {
            "id": 10376,
            "billUuid": "158e347a996-9d53615ac8c13c",
            "storeId": 1,
            "billSn": "14812818700000101001",
            "addTime": 1481281872000,
            "paymentType": 1,
            "goodsAmount": 7.80,
            "discount": 0.00,
            "wipe": null,
            "amount": 7.80,
            "paymentAmount": 7.80,
            "change": 0.00,
            "profit": 1.00,
            "creationDate": 1481281872000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281874327001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 100
        }, {
            "id": 10381,
            "billUuid": "158e348bc09-9d6940e9354f7c",
            "storeId": 1,
            "billSn": "14812819400000101006",
            "addTime": 1481281935000,
            "paymentType": 1,
            "goodsAmount": 13.10,
            "discount": 1.96,
            "wipe": null,
            "amount": 11.10,
            "paymentAmount": 13.10,
            "change": 1.96,
            "profit": -2.00,
            "creationDate": 1481281935000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281944586001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 85
        }, {
            "id": 10380,
            "billUuid": "158e3486e1b-9d3ed9a435b4b2",
            "storeId": 1,
            "billSn": "14812819200000101005",
            "addTime": 1481281921000,
            "paymentType": 1,
            "goodsAmount": 3.90,
            "discount": 1.36,
            "wipe": null,
            "amount": 2.50,
            "paymentAmount": 3.90,
            "change": 1.36,
            "profit": -1.40,
            "creationDate": 1481281921000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281924636001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 65
        }, {
            "id": 10379,
            "billUuid": "158e34840c7-9dc60f13ca6c7c",
            "storeId": 1,
            "billSn": "14812819100000101004",
            "addTime": 1481281906000,
            "paymentType": 1,
            "goodsAmount": 12.30,
            "discount": 0.61,
            "wipe": 0.09,
            "amount": 11.60,
            "paymentAmount": 12.30,
            "change": 0.70,
            "profit": 1.10,
            "creationDate": 1481281906000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281913032001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 95
        }, {
            "id": 10378,
            "billUuid": "158e3480791-9dd8e330e68bd8",
            "storeId": 1,
            "billSn": "14812818900000101003",
            "addTime": 1481281897000,
            "paymentType": 1,
            "goodsAmount": 16.50,
            "discount": 0.00,
            "wipe": null,
            "amount": 16.50,
            "paymentAmount": 16.50,
            "change": 0.00,
            "profit": 5.00,
            "creationDate": 1481281897000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281898386001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 100
        }, {
            "id": 10377,
            "billUuid": "158e347d797-9debbf8ceb16bd",
            "storeId": 1,
            "billSn": "14812818800000101002",
            "addTime": 1481281885000,
            "paymentType": 1,
            "goodsAmount": 22.50,
            "discount": 0.00,
            "wipe": null,
            "amount": 22.50,
            "paymentAmount": 22.50,
            "change": 0.00,
            "profit": 8.00,
            "creationDate": 1481281885000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281886106001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 100
        }, {
            "id": 10376,
            "billUuid": "158e347a996-9d53615ac8c13c",
            "storeId": 1,
            "billSn": "14812818700000101001",
            "addTime": 1481281872000,
            "paymentType": 1,
            "goodsAmount": 7.80,
            "discount": 0.00,
            "wipe": null,
            "amount": 7.80,
            "paymentAmount": 7.80,
            "change": 0.00,
            "profit": 1.00,
            "creationDate": 1481281872000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281874327001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 100
        }, {
            "id": 10381,
            "billUuid": "158e348bc09-9d6940e9354f7c",
            "storeId": 1,
            "billSn": "14812819400000101006",
            "addTime": 1481281935000,
            "paymentType": 1,
            "goodsAmount": 13.10,
            "discount": 1.96,
            "wipe": null,
            "amount": 11.10,
            "paymentAmount": 13.10,
            "change": 1.96,
            "profit": -2.00,
            "creationDate": 1481281935000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281944586001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 85
        }, {
            "id": 10380,
            "billUuid": "158e3486e1b-9d3ed9a435b4b2",
            "storeId": 1,
            "billSn": "14812819200000101005",
            "addTime": 1481281921000,
            "paymentType": 1,
            "goodsAmount": 3.90,
            "discount": 1.36,
            "wipe": null,
            "amount": 2.50,
            "paymentAmount": 3.90,
            "change": 1.36,
            "profit": -1.40,
            "creationDate": 1481281921000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281924636001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 65
        }, {
            "id": 10379,
            "billUuid": "158e34840c7-9dc60f13ca6c7c",
            "storeId": 1,
            "billSn": "14812819100000101004",
            "addTime": 1481281906000,
            "paymentType": 1,
            "goodsAmount": 12.30,
            "discount": 0.61,
            "wipe": 0.09,
            "amount": 11.60,
            "paymentAmount": 12.30,
            "change": 0.70,
            "profit": 1.10,
            "creationDate": 1481281906000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281913032001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 95
        }, {
            "id": 10378,
            "billUuid": "158e3480791-9dd8e330e68bd8",
            "storeId": 1,
            "billSn": "14812818900000101003",
            "addTime": 1481281897000,
            "paymentType": 1,
            "goodsAmount": 16.50,
            "discount": 0.00,
            "wipe": null,
            "amount": 16.50,
            "paymentAmount": 16.50,
            "change": 0.00,
            "profit": 5.00,
            "creationDate": 1481281897000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281898386001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 100
        }, {
            "id": 10377,
            "billUuid": "158e347d797-9debbf8ceb16bd",
            "storeId": 1,
            "billSn": "14812818800000101002",
            "addTime": 1481281885000,
            "paymentType": 1,
            "goodsAmount": 22.50,
            "discount": 0.00,
            "wipe": null,
            "amount": 22.50,
            "paymentAmount": 22.50,
            "change": 0.00,
            "profit": 8.00,
            "creationDate": 1481281885000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281886106001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 100
        }, {
            "id": 10376,
            "billUuid": "158e347a996-9d53615ac8c13c",
            "storeId": 1,
            "billSn": "14812818700000101001",
            "addTime": 1481281872000,
            "paymentType": 1,
            "goodsAmount": 7.80,
            "discount": 0.00,
            "wipe": null,
            "amount": 7.80,
            "paymentAmount": 7.80,
            "change": 0.00,
            "profit": 1.00,
            "creationDate": 1481281872000,
            "userId": 1,
            "personName": "wuxin",
            "synTime": 1481281874327001,
            "couponAmount": null,
            "couponId": null,
            "vipNumber": null,
            "paymentUrl": null,
            "discountPct": 100
        }
    ];
    self.list = [
        {
            "id": "现金",
            "billUuid": "12345678.99",
            "storeId": "12345678.99"
        }, {
            "id": "支付宝",
            "billUuid": "12345.99",
            "storeId": "12345678.99"
        }, {
            "id": "微信",
            "billUuid": "12345678.99",
            "storeId": "12345678.99"
        }, {
            "id": "合计",
            "billUuid": "12345678.99",
            "storeId": "12345678.99"
        }
    ];

    self.print = function (e) {
        //打印本地逻辑
        // utils.androidBridge(api.printLogoutByUuid,{shiftUuid: self.shiftUuid})

        httpGet({
            url: api.printLogoutByUuid,
            params: {
                shiftUuid: self.shiftUuid
            },
            success: function (res) {}
        });
    }
    self.chooseOrder = function (e) {
        // logoutRecordList  list
        self.logoutRecordList.forEach(function (item) {
            item.active = false;
        });
        e.item.active = true;
        self.currentOrder = e.item; //如果currentOrder，则右侧显示具体信息
        // self.currentOrder.refundOffLine = '-' + self.currentOrder.refundOffLine;
        self.shiftUuid = self.currentOrder.shiftUuid;
        self.total = (self.currentOrder.offLineAmount + self.currentOrder.onLineAmount).toFixed(2) * 1;
        self.update();
    }

    // 改变日期
    self.on('dateChange', function () {
        var date = $(self.root).parents('employee').find('#daterange').val();
        console.log(date + '-----ccc---');
        var beginDate = date.split("~")[0];
        var endDate = date.split("~")[1];
        var param = {
            startDate: beginDate,
            endDate: endDate
        };
        store.shiftRecordByDate.get(param, function (data) {
            self.logoutRecordList = data;
            self.update();
        });
        self.currentOrder = null;
    });
    self.format = function (myDate) {
        return myDate.getFullYear() + "-" + (((myDate.getMonth() + 1) < 9)
            ? ("0" + (myDate.getMonth() + 1))
            : (myDate.getMonth() + 1)) + "-" + ((myDate.getDate() < 9)
            ? ("0" + myDate.getDate())
            : myDate.getDate());
    }
    self.on('mount', function () {
        var myDate = new Date();
        var todayDate = self.format(myDate);
        myDate.setTime(myDate.getTime() - 24 * 60 * 60 * 1000 * 7);
        var startDate = self.format(myDate);
        // console.log(todayDate + "------todayDate---" + startDate + '=========startDate=========');
        store.shiftRecordByDate.get({
            startDate: startDate,
            endDate: todayDate
        }, function (data) {
            self.logoutRecordList = data;
            self.update();
            // console.log(self.logoutRecordList + '－－－－－－－－－后台获取到的logoutRecord－－－－－－－－－－');
        });

    });
</script>

</employee-data>
