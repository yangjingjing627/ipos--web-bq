<coupon>
    <div class="coupon">
        <div class="coupon-list">
            <ul>
                <li class="cou-our" onclick="{ addCoupon }">
                    <div class="add "></div>
                </li>
                <li each="{ coupon }" class="{ bacolor }" if={ coupon.length>0 }>
                    <h4 onclick="{ couponInfo }">{ title }
                        <div class="icon { public:source!=1 }{ our:source==1 }"></div>
                        <div class="info"></div>
                    </h4>
                    <h5>数量：{ totalNumber }张</h5>
                    <h5>面额：{ denomination }</h5>
                    <div class="stop-coupon" if={ bacolor=="cou-our" } onclick="{ couponStop }">停止发放</div>
                    <div class="status { coupon-s-over:status==2 }{coupon-s-invalid:status==3 }{coupon-s-invalid:status==4 }"></div>
                </li>
                <div class="clearfix"></div>
            </ul>
        </div>
    </div>
    <pop id="couponInfo" title="优惠券详情" onebutton>
        <coupon-info></coupon-info>
    </pop>
    <pop id="couponAdd" title="添加优惠券" twobutton suretext="发放" help=true>
        <coupon-add></coupon-add>
    </pop>

    <pop width="650px" id="couponHelp" title="帮助" onebutton popzbig=true>
        <coupon-help></coupon-help>
    </pop>

    <pop width="400px" id="couponPrice" title="发放面额、数量及总额" twobutton popzbig=true suretext="下一步">
        <coupon-price></coupon-price>
    </pop>
    <pop width="400px" id="couponPriceNext" title="发放面额、数量及总额" twobutton popzbigtwo=true suretext="确定" cancletext="上一步">
        <coupon-price-next></coupon-price-next>
    </pop>
    <pop width="400px" id="couponDate" title="有效期" twobutton popzbig=true>
        <coupon-data></coupon-data>
    </pop>
    <pop id="couponCondition" title="获得条件" twobutton popzbig=true>
        <coupon-con></coupon-con>
    </pop>
    <pop width="400px" id="couponWay" title="使用方式" twobutton popzbig=true>
        <coupon-way></coupon-way>
    </pop>
    <pop width="400px" id="couponUse" title="使用条件" twobutton popzbig=true>
        <coupon-use></coupon-use>
    </pop>
    <pop id="couponStop" title="提示" twobutton>
        <coupon-stop></coupon-stop>
    </pop>
    <script>
        var self = this;
        self.next = 0;

        self.addCoupon = function () {
            $("#couponAdd")[0].open();
        }

        self.couponInfo = function (e) {
            $("#couponInfo")[0].open(e.item);
        }

        self.couponHelp = function () {
            $("#couponHelp")[0].open();
        }

        self.couponStop = function (e) {
            $("#couponStop")[0].open(e.item.storeCouponId);
        }

        self.stopSure = function (id) {
            store.coupon.stop({
                couponId: id
            }, function (data) {
                self.next = 0;
                self.init();
            });
        }

        self.init = function () {
            var params = {
                next: self.next
            }
            store.coupon.get(params, function (data) {
            //  status未开始0    已开始1   已发完2   已过期3  失效4
                self.next = data.next;
                self.coupon = data.list;
                self.update();
            });
        }

        self.scrollLock = false;
        self.listenDown = function () {
            setTimeout(function () {
                self.listWrap = $('.coupon-list')[0];
                self.scrollDown = function (event) {
                    var clientHeight = self.listWrap.clientHeight;
                    var scrollTop = self.listWrap.scrollTop;
                    if ((clientHeight + scrollTop) > self.listWrap.scrollHeight - 60) {
                        if (self.next && !self.scrollLock) {
                            self.scrollLock = true;
                            store.coupon.get({
                                next: self.next
                            }, function (data) {
                                self.next = data.next;
                                self.coupon = self.coupon.concat(data.list);
                                self.scrollLock = false;
                                self.update();
                            });
                        }
                    }
                };
                self.listWrap.addEventListener('scroll', self.scrollDown, false);
            }, 50);
        }

        self.on('mount', function () {
            self.newCoupon = {};
            self.init();
            self.listenDown();
        });

        self.on('unmount', function () {
            if (self.listWrap && self.scrollDown) {
                self.listWrap.removeEventListener('scroll', self.scrollDown);
            }
        })
    </script>
</coupon>
