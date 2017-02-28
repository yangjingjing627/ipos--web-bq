<coupon-price>
    <div class="coupon-pop">
        <div class="coupon-price">
            <div class="price-li">
                <div class="select left selected fixed" onclick="{ select }"></div>
                <div class="left price-in">
                    <span>固定金额：</span>
                    <span class="price-fixed">
                        <input type="tel" value="" id="fixedPrice" maxlength="7">
                    </span>
                    <span class="yuan">元</span>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="price-li">
                <div class="select left fixedno" onclick="{ select }"></div>
                <div class="left price-in">
                    <span>随机金额：</span>
                    <span class="price-random ran">
                        <input type="tel" value="" id="randomPriceLow" maxlength="7">
                    </span>
                    <span class="price-m"></span>
                    <span class="price-random">
                        <input type="tel" value="" id="randomPriceTall" maxlength="7">
                    </span>
                    <span class="yuan">元</span>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="prompt">
                *面额必须是整数,随机金额会取包含两端的整数
            </div>
        </div>

    </div>
    <script>

        var self = this;
        var modal = self.parent;
        var parent = self.parent.parent;

        modal.onOpen = function (params) {
          parent.fixedPrice="";
          parent.minPrice="";
          parent.maxPrice="";
          if (parent.newCoupon.priceType==1) {//随机金额
            $(".fixedno").addClass("selected");
            $(".fixed").removeClass("selected");
            $("#randomPriceLow").val(parent.newCoupon.minPrice);
            $("#randomPriceTall").val(parent.newCoupon.maxPrice);
          }else {//固定金额
            $(".fixed").addClass("selected");
            $(".fixedno").removeClass("selected");
            $("#fixedPrice").val(parent.newCoupon.fixedPrice);
          }
          self.update();
        }

        modal.onClose = function () {
          $("coupon-price").find("input").val("");
          self.update();
        }

        modal.onSubmit = function () {
            if ($("#fixedPrice").parent().parent().prev(".select").is(".selected")) {
                var fixedPrice = parseInt($("#fixedPrice").val());
                if (/^[1-9]\d*$/.test(fixedPrice)) {
                  parent.fixedPrice = fixedPrice;
                  var params = {
                    type:0,
                    fixedPrice:fixedPrice
                  }
                  $("#couponPriceNext")[0].open(params);

                } else {
                    utils.toast("请填写正确的金额");
                    return;
                }
            } else {
                var minPrice = parseInt($("#randomPriceLow").val());
                var maxPrice = parseInt($("#randomPriceTall").val());
                if (/^[1-9]\d*$/.test(minPrice) && /^[1-9]\d*$/.test(maxPrice) && (minPrice < maxPrice)) {
                  parent.minPrice=minPrice;
                  parent.maxPrice=maxPrice;
                  var params = {
                    type:1,
                    minPrice:minPrice,
                    maxPrice:maxPrice
                  }
                  $("#couponPriceNext")[0].open(params);
                } else {
                    utils.toast("请填写正确的金额");
                    return;
                }
            }

        }

        self.select = function (e) {
            if (!$(e.target).is(".selected")) {
                $(".select").removeClass("selected");
                $(e.target).addClass("selected");
            }
        }
    </script>
</coupon-price>
