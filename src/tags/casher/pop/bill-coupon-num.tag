<bill-coupon-num>
    <div class="vip-login">
        <div class="phone">
            <input type="tel" value="" placeholder="优惠券码" id="vipCouponNum">
        </div>
    </div>
    <script>

        var self = this;
        var modal = self.parent;
        var parent = self.parent.parent;

        modal.onOpen = function (params) {
            self.params = params;
            // console.log(self.params);
            // parent.couponAdd(self.params);
            self.update();
        }

        modal.onClose = function () {
            $("#vipCouponNum").val("");
            // parent.couponRemove(self.params);
            // $("#billCoupon")[0].open(self.params);
        }

        modal.onSubmit = function () {
            var vipCouponNum = $("#vipCouponNum").val();
            var params = {
              couponCode: vipCouponNum,
              baskets:parent.baskets
            }
            store.couponVerify.get(params,function(data){
              self.params.item = {};
              self.params.item.couponInfo = data;
              modal.close();
              // self.params.item.couponPrice = data.price;
              $("#billCouponInfo")[0].open(self.params);
              self.update();
            });
        }
    </script>
</bill-coupon-num>
