<!-- create by wuxin -->
<reward>

    <div class="reward">

        <div class="reward-top">
            <a onclick={ shopIncome }>奖励收入</a>
        </div>

        <div class="reward-list">
            <ul if={ reward.length > 0 }>
                <li class="{ classli }" each="{ reward }">
                    <div class="icon"></div>
                    <h5>{ title }{ desc }</h5>
                    <div class="look-div" onclick="{ popReInfo }">
                        <a class="look-a">查看</a>
                    </div>
                </li>
                <div class="clear"></div>
            </ul>
            <div class="none-list" if={ reward.length <= 0}>
              <div class="none-list-text">
                暂无奖励
              </div>
            </div>
        </div>

    </div>

    <pop id="popAppInfo" title="应用奖励详情" onebutton>
        <pop-app-reward-desc></pop-app-reward-desc>
    </pop>

    <pop id="popCouponInfo" title="优惠券奖励详情" onebutton>
        <pop-coupon-reward></pop-coupon-reward>
    </pop>

    <pop id="popAdInfo" title="广告奖励详情" onebutton>
        <pop-ad-reward></pop-ad-reward>
    </pop>

    <pop id="popGlobalInfo" title="全球购奖励详情" onebutton>
        <pop-global-reward></pop-global-reward>
    </pop>

    <pop id="popModifPhone" title="验证手机" twobutton sureText="下一步">
        <pop-modify-phone></pop-modify-phone>
    </pop>
    <pop id="popAddCard" title="设置发放账户" twobutton sureText="完成">
        <pop-add-card></pop-add-card>
    </pop>

    <script>
        var self = this;
        self.next = 0;

        self.popReInfo = function (e) {
            if (e.item.type == 0) {
                $("#popCouponInfo")[0].open(e.item);
            } else if (e.item.type == 1) {
                $("#popAppInfo")[0].open(e.item);

            } else if (e.item.type == 2){
                $("#popAdInfo")[0].open(e.item);

            }else if (e.item.type == 3){
                $("#popGlobalInfo")[0].open(e.item);
            }
        }

        self.init = function () {
            var params = {
                next: self.next
            }
            store.reward.get(params, function (data) {
                self.next = data.next;
                self.reward = data.list;
                self.update();
            });
        }

        self.shopIncome = function(){
          store.bankCard.get(function(data){
            // console.log(data);
            //status==1   已绑定  status==0 未绑定
            if (data.status == 1) {
              location.href="#/shop/income";
            }else {
              self.incomePhone=data.phoneMobile;
              store.changeCardCodeSend.get(function(data){
                var param = {
                  incomePhone:data.phoneMobile,
                  type:1
                }
                $("#popModifPhone")[0].open(param);
              });
            }
          });
        }

        self.addCard = function(){
          $("#popAddCard")[0].open();
        }

        self.scrollLock = false;
        self.listenDown = function () {
            setTimeout(function () {
                self.listWrap = $('.reward-list')[0];
                self.scrollDown = function (event) {
                    var clientHeight = self.listWrap.clientHeight;
                    var scrollTop = self.listWrap.scrollTop;
                    if ((clientHeight + scrollTop) > self.listWrap.scrollHeight - 60) {
                        if (self.next && !self.scrollLock) {
                            self.scrollLock = true;
                            store.reward.get({
                                next: self.next
                            }, function (data) {
                                self.next = data.next;
                                self.reward = self.reward.concat(data.list);
                                self.scrollLock = false;
                                self.update();
                            });
                        }
                    }
                };
                self.listWrap.addEventListener('scroll', self.scrollDown, false);
            }, 50);
        }

        self.on('mount', function () {
            self.init();
            self.listenDown();
        });

        self.on('unmount', function () {
            if (self.listWrap && self.scrollDown) {
                self.listWrap.removeEventListener('scroll', self.scrollDown);
            }
        })
    </script>

</reward>
