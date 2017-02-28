<bill-coupon-info>
    <div class="bill-coupon-info">
        <div class="title">使用优惠券
        </div>
        <div class="info">
            <div class="price">
                <span>{ coupon.price }</span>
            </div>
            <div class="text">
                <h3>{ coupon.title }</h3>
                <h4>{ coupon.couponCode }</h4>
                <div>
                    <span class="left">{ rules }</span>
                    <span class="right">有效日期至:{ coupon.effectTime }</span>
                    <span class="clearfix"></span>
                </div>
            </div>
        </div>
    </div>
    <script>

        var self = this;
        var modal = self.parent;
        var parent = self.parent.parent;

        modal.onOpen = function (params) {
            self.params = params;
            self.coupon = self.params.item.couponInfo;
            self.update();
        }

        modal.onClose = function () {
          self.coupon = {};
          self.update();
        }

        modal.onSubmit = function () {
            self.params.item.couponPrice = self.coupon.price;
            parent.couponCode = self.coupon.couponCode;
            modal.close();
            parent.couponAdd(self.params);
            self.update();
        }
    </script>
</bill-coupon-info>
