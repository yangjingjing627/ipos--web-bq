<coupon-stop>
    <div class="coupon-pop">
        <div class="coupon-stop">
            确定停止发放优惠券吗？已经停止发放的优惠券无法恢复发放。
        </div>
    </div>
    <script>

        var self = this;
        var modal = self.parent;
        var parent = self.parent.parent;

        modal.onOpen = function(param){
          self.param = param;
          self.update();
        }

        modal.onSubmit = function() {
            parent.stopSure(self.param);
            modal.close();
        }
    </script>
</coupon-stop>
