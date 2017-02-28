<coupon-data>
  <div class="coupon-pop">
    <div class="coupon-data">
        <div class="content">
            <div class="use-text">
                有效天数 ：
            </div>
            <div class="use-input data">
                <input type="tel" value="" maxlength="2" id="couData">
                  <span class="yuan">天</span>
            </div>
            <div class="clearfix"></div>
        </div>
        <div class="prompt">
          *最多为90天
        </div>
    </div>
  </div>
  <script>

    var self = this;
    var modal = self.parent;
    var parent = self.parent.parent;

    modal.onOpen = function (params) {
      // console.log(parent.newCoupon.effectDays);
      $("coupon-data").find("#couData").val(parent.newCoupon.effectDays);
      self.update();
    }

    modal.onClose = function () {
      $("coupon-data").find("#couData").val("");
    }

    modal.onSubmit = function () {
      var _couData =parseInt($("coupon-data").find("#couData").val());
      if (/^[1-9]\d*$/.test(_couData) && (_couData<=90)) {
          $("#fillCouponDate").text(_couData+"天");
          parent.newCoupon.effectDays = _couData;
          modal.close();
      }else {
        utils.toast("请填写正确的日期");
        return;
      }
    }

  </script>
</coupon-data>
