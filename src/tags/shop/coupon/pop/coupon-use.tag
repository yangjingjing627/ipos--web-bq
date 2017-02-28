<coupon-use>
    <div class="coupon-pop">
        <div class="coupon-use">
            <div class="content">
                <div class="use-text">
                    使用需满足购物金额 ：
                </div>
                <div class="use-input">
                    <input type="tel" value="" maxlength="7" id="">
                    <span class="yuan">元</span>
                </div>
                <div class="clearfix"></div>
            </div>
        </div>
    </div>
    <script>

        var self = this;
        var modal = self.parent;
        var parent = self.parent.parent;

        modal.onOpen = function (params) {
          $("coupon-use").find("input").val(parent.newCoupon.priceLimit);
            self.update();
        }

        modal.onClose = function () {
            $("coupon-use").find("input").val("");
        }

        modal.onSubmit = function () {
            var conUseCode = $("coupon-use").find("input").val();
            if (!/^[1-9]\d*$/.test(conUseCode)) {
                utils.toast("请填写正确的金额");
                return;
            }
            $("#fillCouponUse").text("购物满" + conUseCode + "元");
            parent.newCoupon.priceLimit = conUseCode;
            modal.close();
        }
    </script>
</coupon-use>
