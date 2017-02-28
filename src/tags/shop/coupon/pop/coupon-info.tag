<coupon-info>
    <div class="coupon-pop">
        <div class="coupon-info">
            <div class="title">
                优惠券来源：
            </div>
            <div class="info">
                { info.sourceDesc }
            </div>
            <div class="title">
              优惠券详情
            </div>
            <div class="info">金额：{ info.denomination }</div>
            <div class="info" if={ info.beginTime }>领取时段：{ info.beginTime }至{ info.endTime }</div>
            <div class="info">有效期：{ info.effectDays }天</div>
            <div class="info">获取条件：{ info.getRules }</div>
            <div class="info">使用方式：
              <span if={ info.useWay===0 }>通用</span>
              <span if={ info.useWay===1 }>线上使用</span>
              <span if={ info.useWay===2 }>店铺使用</span>
            </div>
            <div class="info">使用条件：{ info.rules }</div>
            <div class="title">
              使用详情
            </div>
            <div class="info">已使用：{ info.useNumber }张，共{ info.usePrice }元</div>
            <div class="info">已发放：{ info.sendNumber }张，共{ info.sendPrice }元</div>
             <div class="info">应发放总数：{ info.totalNumber }张，共{ info.totalPrice }元</div>
        </div>
    </div>
    <script>

        var self = this;
        var modal = self.parent;
        var product = self.parent.parent;
        //source==1 店铺优惠券  source== 3 奖励优惠券
        modal.onOpen = function (params) {
          store.coupon.info({couponId:params.storeCouponId},function(data) {
              self.info = data;
              // console.log(data.data);
              // console.log(self.info);
              self.update();
          });
        }

        modal.onClose = function () {
          self.info = "";
          self.update();
        }

        modal.onSubmit = function () {
            modal.close();
        }
    </script>
</coupon-info>
