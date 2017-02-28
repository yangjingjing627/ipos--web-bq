<coupon-way>
    <div class="coupon-pop">
        <div class="coupon-price">
            <div class="price-li" each="{ couUseList }" onclick="{ couUseSelect }">
                <div class="select left { selected:selected }" ></div>
                <div class="left price-in">
                    { title }
                </div>
                <div class="clearfix"></div>
            </div>
        </div>
    </div>
    <script>

        var self = this;
        var modal = self.parent;
        var parent = self.parent.parent;

        self.couUseList = [
            {
                "title": "网店使用",
                "selected":true,
                "value": 1
            }, {
                "title": "实体店使用",
                "selected":true,
                "value": 2
            }, {
                "title": "通用",
                "selected":true,
                "value": 0
            }
        ]

        modal.onOpen = function (params) {
          var selected = parent.newCoupon.useWay;
          // console.log(selected);
          for(var i in self.couUseList){
            if (selected === self.couUseList[i].value) {
              self.couUseList[i].selected = true;
            }else {
              self.couUseList[i].selected = false;
            }
          }
            self.update();
        }

        modal.onClose = function () {
        }

        modal.onSubmit = function () {
            var couUseCode ="";
            for(var i in self.couUseList){
              if (self.couUseList[i].selected) {
                 couUseCode = self.couUseList[i];
              }
            }
            if (couUseCode) {
              $("#fillCouponWay").text(couUseCode.title);
              parent.newCoupon.useWay = couUseCode.value;
              modal.close();
            }else {
              utils.toast("请选择使用方式");
            }
        }

        self.couUseSelect = function (e) {
          for(var i in self.couUseList){
              self.couUseList[i].selected = false;
            }
              e.item.selected = true;
        }
    </script>
</coupon-way>
