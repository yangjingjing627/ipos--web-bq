<coupon-add>
    <div class="coupon-pop">
        <div class="coupon-add">
            <div class="add-list">
                <ul>
                    <li onclick="{ fillIn('couponPrice') }">
                        <span>发放面额、数量及总额：</span>
                        <span id="fillCouponPrice" class="fill"></span>
                    </li>
                    <li onclick="{ fillIn('couponDate') }">
                        <span>有效期：</span>
                        <span id="fillCouponDate" class="fill"></span>
                    </li>
                    <li onclick="{ fillIn('couponCondition') }">
                        <span>获得条件：</span>
                        <span id="fillCouponCondition" class="fill"></span>
                    </li>
                    <li onclick="{ fillIn('couponWay') }">
                        <span>使用方式：</span>
                        <span id="fillCouponWay" class="fill"></span>
                    </li>
                    <li onclick="{ fillIn('couponUse') }">
                        <span>使用条件：</span>
                        <span id="fillCouponUse" class="fill"></span>
                    </li>
                </ul>
            </div>

        </div>
    </div>

    <script>
        var self = this;
        var modal = self.parent;
        var parent = self.parent.parent;

        self.cou = {};
        self.update();

        self.fillIn = function (id) {
            return function (e) {
                var item = e.item;
                $('#' + id)[0].open(item);
            }
        }

        modal.onSubmit = function () {
            if (parent.newCoupon) {
                if (!parent.newCoupon.totalNumber) {
                    utils.toast("请填写优惠券数量");
                    return;
                }
                if (!parent.newCoupon.totalPrice) {
                    utils.toast("请填写优惠总金额");
                    return;
                }

                if (parent.newCoupon.priceType == 0) { //fixde
                    if (parent.newCoupon.fixedPrice) {
                        parent.newCoupon.minPrice = parent.newCoupon.fixedPrice;
                        parent.newCoupon.maxPrice = parent.newCoupon.fixedPrice;
                    }else {
                      utils.toast("请填写单个金额");
                      return;
                    }
                }else{
                  if (!parent.newCoupon.minPrice) {
                    utils.toast("请填写最小金额");
                    return;
                  }
                  if (!parent.newCoupon.maxPrice) {
                    utils.toast("请填写最大金额");
                    return;
                  }
                }
                if (!parent.newCoupon.effectDays) {
                    utils.toast("请填写有效期");
                    return;
                }
                if (!parent.newCoupon.preType) {
                    utils.toast("请选择获得条件");
                    return;
                }
                if (!parent.newCoupon.useWay && parent.newCoupon.useWay!=0) {
                    utils.toast("请选择使用方式");
                    return;
                }
                if (!parent.newCoupon.priceLimit) {
                    utils.toast("请填写使用条件");
                    return;
                }
                parent.newCoupon.ruleType = 0;
                parent.newCoupon.type = 0;
                parent.newCoupon.source = 1;

                store.coupon.create(parent.newCoupon, function (data) {
                    parent.newCoupon = {};
                    parent.next = 0;
                    parent.init();
                    parent.update();
                    modal.close();
                });
            }
        }

        modal.onClose = function () {
            $("coupon-add").find(".fill").text("");
            parent.newCoupon = {};
            parent.update();
            self.update();
        }

        modal.onHelp = function () {
            $("#couponHelp")[0].open();
        }
    </script>
</coupon-add>
