<pop-coupon-reward>
    <div class="reward-pop">
        <h2>优惠券：</h2>
        <h5>该奖励是系统自动发放优惠券给您的顾客。您依照优惠券使用方法核销即可。优惠券所产生的优惠金额由iPos承担。奖励收入为 优惠券实际使用金额。该金额会按时打入您的账户。请点击“奖励 收入”查看。</h5>
        <h2>优惠券详情:</h2>
        <h5>
            金额：{ info.totalPrice }元</h5>
        <h5>
            有效时段：{ info.beginTime } - { info.endTime }</h5>
        <h5>
            获得条件：{ info.getRules }</h5>
        <h5>
            使用方式：{ info.sourceDesc }</h5>
        <h5>
            使用条件：{ info.rules }</h5>
        <h2>奖励收入详情：</h2>
        <h5>已使用：{ info.useNum?info.useNum:0 } 张</h5>
        <h5>获得收入：￥{ info.usePrice?info.usePrice:0 }</h5>
    </div>
    <script>

        var self = this;
        var modal = self.parent;

        modal.onOpen = function (params) {
            var param = {
                reachRecordId: params.rewardRecordId
            }
            store.reward.info(param, function (data) {
                self.info = data;
                self.update();
            });
        }

        modal.onClose = function () {
          self.info={};
        }

        modal.onSubmit = function () {
            modal.close();
        }
    </script>
</pop-coupon-reward>
