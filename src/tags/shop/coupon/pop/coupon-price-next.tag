<coupon-price-next>
    <div class="coupon-pop">
        <div class="coupon-price">
            <div class="price-li">
                <div class="left price-in">
                    <span>发放总数：</span>
                    <span class="price-fixed">
                        <input type="tel" value="" id="totalCoupon" oninput="{ totalPrice }" maxlength="6">
                    </span>
                    <span class="yuan">张</span>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="price-li">
                <div class="left price-in">
                    <span>发放总额：</span>
                    <span class="price-fixed">
                        <input type="tel" value="" id="totalPrice" maxlength="7">
                    </span>
                    <span class="yuan">元</span>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="prompt">
                *最小随机金额×总数≤总额≤最大随机金额×总数
            </div>
        </div>
    </div>
    <script>

        var self = this;
        var modal = self.parent;
        var parent = self.parent.parent;

        self.totalPrice = function () {
            var totalCoupon = parseInt($("#totalCoupon").val());
            if (/^[1-9]\d*$/.test(totalCoupon) && self.params.type === 0) {
                $("#totalPrice").val(totalCoupon * parent.fixedPrice);
            }
        }

        modal.onOpen = function (params) {
            self.params = params;
            if (self.params.type === 0) {
                $("#totalPrice").attr("readonly", true);
            } else {
                $("#totalPrice").attr("readonly", false);
            }
            self.update();
        }

        modal.onClose = function () {
            $("#totalPrice").attr("readonly", false);
            $("coupon-price-next").find("input").val("");
        }

        modal.onSubmit = function () {
            var totalCoupon = parseInt($("#totalCoupon").val());
            var totalPrice = parseInt($("#totalPrice").val());
            if (!/^[1-9]\d*$/.test(totalCoupon)) {
                utils.toast("请填写正确的数量");
                return;
            }
            if (!/^[1-9]\d*$/.test(totalPrice)) {
                utils.toast("请填写正确的总额");
                return;
            }
            if (self.params.type === 0) {//
                $("#fillCouponPrice").text(parent.fixedPrice + "元、" + totalCoupon + "张、" + totalPrice + "元");
                parent.newCoupon.totalNumber = totalCoupon;
                parent.newCoupon.totalPrice = totalPrice;
                parent.newCoupon.fixedPrice = parent.fixedPrice;
                parent.newCoupon.priceType = 0;
                $("#totalPrice").attr("readonly", false);
                $("#couponPrice")[0].close();
                modal.close();
            } else {
                if ((parent.minPrice * totalCoupon <= totalPrice) && (totalPrice <= parent.maxPrice * totalCoupon)) {
                    $("#fillCouponPrice").text(parent.minPrice + "-" + parent.maxPrice + "元、" + totalCoupon + "张、" + totalPrice + "元");
                    parent.newCoupon.minPrice = parent.minPrice;
                    parent.newCoupon.maxPrice = parent.maxPrice;
                    parent.newCoupon.totalNumber = totalCoupon;
                    parent.newCoupon.totalPrice = totalPrice;
                    parent.newCoupon.priceType = 1;
                    $("#totalPrice").attr("readonly", false);
                    $("#couponPrice")[0].close();
                    modal.close();
                } else {
                    utils.toast("请填写正确总额");
                    return;
                }
            }
        }
    </script>
</coupon-price-next>
