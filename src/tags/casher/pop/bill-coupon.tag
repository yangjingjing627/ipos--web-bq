<bill-coupon>
  <div class="bill-coupon">
    <div class="img" onclick="{ scan }"></div>
    <div class="info">请用扫码枪扫描手机上的优惠券码</div>
    <div class="input" onclick="{ couponInput }">扫不到?手动输入</div>
  </div>
  <script>

    var self = this;
    var modal = self.parent;
    var parent = self.parent.parent;


    //test
    self.scan = function(){
      // modal.close();
      // self.params = {
      //   item:{
      //     couponInfo:{
      //       price: 299,
      //       title:' 测测试测试测试测试测试测试测试测试测试测试测试测试测试测试试测试',
      //       couponCode: 2353657586813,
      //       effectTime:'2016-12-11'
      //     }
      //   }
      // }
      // $("#billCouponInfo")[0].open(self.params);
      // parent.couponAdd(self.params);
    }

    self.couponInput = function(){
      modal.close();
      $("#billCouponNum")[0].open(self.params);
      // console.log(self.params);
      // parent.couponAdd(self.params);
    }

    self.barcodeCoupon = function(){
      // var vipCouponNum = Icommon.number;
      var vipCouponNum = scanNumber;
      var params = {
          couponCode: vipCouponNum,
          baskets:parent.baskets
      }
      store.couponVerify.get(params,function(data){
        self.params.item = {};
        self.params.item.couponInfo = data;
        modal.close();
        $("#billCouponInfo")[0].open(self.params);
        self.update();
      });
    }

    modal.onOpen = function (params) {
      self.params  = params;
      self.update();
      window.addEventListener('inputNumber', self.barcodeCoupon, false);
    }

    modal.onClose = function () {
      window.removeEventListener('inputNumber', self.barcodeCoupon);
      // parent.couponRemove(self.params);
    }

    modal.onSubmit = function () {
    }

  </script>
</bill-coupon>
