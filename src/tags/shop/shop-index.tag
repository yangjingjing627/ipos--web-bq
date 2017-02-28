<shop-index>
    <ul>
        <li each="{ list }" onclick="{ noAuthTip }"  if={ show || !isBqCommercial }>
            <a>
                <img src="{ img }">
                <div>{ name }</div>
            </a>
        </li>
        <li onclick="{ gonext }">
            <a>
                <img src="imgs/life-service.png">
                <div>生活服务</div>
            </a>
        </li>
        <div class="clearfix"></div>
    </ul>

    <script>
        var self = this;
        var isBqCommercial = window.isBqCommercial;
//      var isBqCommercial =window.isAndroidBq?window.isBqCommercial:utils.judgeBqCommercial();
        self.list = [
            {  name: '结算单', img: 'imgs/sales-order.png', link: '#/shop/sales-order',  logName: '0301', authCode: '31',show:true },
            {  name: '商品', img: 'imgs/product.png', link: '#/shop/products', logName: '0302',authCode: '41',show:true },
            {  name: '库存', img: 'imgs/storage.png', link: '#/shop/storage', logName: '0303',authCode: ['51', '52', '53', '54'],isBqCommercial:isBqCommercial },
            // {  name: '我的数据', img: 'imgs/chart.png', link: '#/shop/chart' , logName: '0304',authCode: '61',show:true},
            {  name: '经营助手', img: 'imgs/chart.png', link: '#/shop/business-assistant' , logName: '0304',authCode: '61',show:true},
            // {  name: '我的数据', img: 'imgs/chart.png', link: '#/shop/business-assistant-bq' , logName: '0304',authCode: '61',show:true},


            {  name: '外接设备', img: 'imgs/device.png', link: '#/shop/device', logName: '0305',authCode: '71',show:true },
            {  name: '员工', img: 'imgs/employee.png', link: '#/shop/employee', logName: '0306',authCode: '81' ,show:true},
//          {  name: '支付二维码', img: 'imgs/qrcode.png', link: '#/shop/qrcode', logName: '0307',authCode: '72',show:true },
            {  name: '店铺资料', img: 'imgs/shop-message.png', link: '#/shop/message', logName: '0308',authCode: '91',isBqCommercial:isBqCommercial },

            {  name: '成就', img: 'imgs/achievement.png', link: '#/shop/attain', logName: '0309',authCode: '101',show:true },
            {  name: '奖励', img: 'imgs/reward.png', link: '#/shop/reward', logName: '0310',authCode: '111',show:true },
            {  name: '优惠券', img: 'imgs/coupon.png', link: '#/shop/coupon', logName: '0311',authCode: '121',show:true },
            // {  name: '生活服务', img: 'imgs/life-service.png', link: '#/shop/service', logName: '0312',authCode: '131',show:true }
            //logName,authCode?
        ];

        //暂不调用
        self.noAuthTip = function(e) {
            self.log(e.item.logName);
            // console.log(e.item);
            if (e.item.haveAuth) {
                location.href = e.item.link;
                return true;
            }
            else {
                alert('没有权限');
                return false;
            }
        }
        self.gonext = function () {
          window.location.href='#/shop/service';
        }
        //埋点
        self.log = function(name) {
          utils.androidBridge(api.logEvent,{eventId: name},function(){
            console.log('---shop-index----埋点－－－');
          })
            // if (window.Icommon) {
            //     Icommon.logEvent(null,null,{eventId: name});
            // }
        }

        self.on('mount', function() {
            httpGet({
                url: api.auth,
                success: function(res) {
                    self.auth = res.data.permissionCodes.split(',');
                    self.list.forEach(function(item) {
                        if (typeof item.authCode === 'string') {
                            if (self.auth.indexOf(item.authCode) > -1) {
                                item.haveAuth = true;
                            }
                        }
                        else if (Object.prototype.toString.call(item.authCode) === '[object Array]') {
                            item.authCode.forEach(function(code) {
                                if (self.auth.indexOf(code) > -1) {
                                    item.haveAuth = true;
                                }
                            });
                        }
                    });
                    self.update();
                }
            });
            // flux.bind.call(self, {
            //     name: 'auth',
            //     store: store.auth,
            //     success: function() {
            //         self.list.forEach(function(item) {
            //             if (typeof item.authCode === 'string') {
            //                 if (self.auth.indexOf(item.authCode) > -1) {
            //                     item.haveAuth = true;
            //                 }
            //             }
            //             else if (Object.prototype.toString.call(item.authCode) === '[object Array]') {
            //                 item.authCode.forEach(function(code) {
            //                     if (self.auth.indexOf(code) > -1) {
            //                         item.haveAuth = true;
            //                     }
            //                 });
            //             }
            //         });
            //         self.update();
            //     }
            // });
        });

    </script>
</shop-index>
