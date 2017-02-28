<coupon-con>
    <div class="coupon-pop">
        <div class="coupon-price" id="couponCon">
            <div class="price-li" each="{ conList }" onclick="{ conselect }">
                <div class="select con { selected:selected }"></div>
                <div class=" price-in">
                    <i class="blod">{ title }：</i>
                    { info }
                </div>
            </div>
        </div>
    </div>
    <script>

        var self = this;
        var modal = self.parent;
        var parent = self.parent.parent;


        modal.onOpen = function (params) {
          self.conList = [
              {
                  "title": "首次登录网店",
                  "info": "顾客首次通过店铺二维码或者链接登录本店铺就会获得优惠券。",
                  "selected":true,
                  "value": 1000
              }, {
                  "title": "首次在网店下单",
                  "info": "顾客首次在网店下单并且订单配送成功（订单状态为“已完成”）就会获得优惠券。",
                  "selected":false,
                  "value": 1001
              }, {
                  "title": "首次在实体店购物",
                  "info": "会员在实体店首次购物结算时，就会获得优惠券。",
                  "selected":false,
                  "value": 1002
              }, {
                  "title": "网店下单",
                  "info": "顾客在网店下单并且订单配送成功（订单状态为“已完成”）就会获得优惠券。",
                  "selected":false,
                  "value": 1003
              }, {
                  "title": "实体店购物",
                  "info": "会员在实体店购物结算时，就会获得优惠券。",
                  "selected":false,
                  "value": 1004
              }, {
                  "title": "全部本店会员",
                  "info": "全部本店已有会员。",
                  "selected":false,
                  "value": 1005
              }
          ]
            var selected = parent.newCoupon.preType;
            for(var i in self.conList){
              if (selected == self.conList[i].value) {
                self.conList[i].selected = true;
              }else {
                self.conList[i].selected = false;
              }
            }
            self.update();
        }

        self.conselect = function (e) {
          for(var i in self.conList){
              self.conList[i].selected = false;
            }
            e.item.selected = true;
            self.conCode = e.item;
        }

        modal.onClose = function () {}

        modal.onSubmit = function () {
          var couUseCon ="";
          for(var i in self.conList){
            if (self.conList[i].selected) {
               couUseCon = self.conList[i];
            }
          }
          if (couUseCon) {
            $("#fillCouponCondition").text(couUseCon.title);
            parent.newCoupon.preType = couUseCon.value;
            modal.close();
          }else {
            utils.toast("请选择获得条件");
          }

        }
    </script>
</coupon-con>
