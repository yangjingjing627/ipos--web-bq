<pop-global-reward>
    <div class="reward-pop">
        <h2>全球购收入：</h2>
        <h5>该奖励将使您的网店开通全球购的功能，顾客在访问您的网店时可以购买全球购商品。全球购的商品寄送及售后均有iPos全部负责。每笔订单所产生的交易额中的部分将按比例分成给您。每月奖励收入会按时一并打入您的账户。请点击“奖励收入”查看。</h5>
        <h2>全球购收入详情：</h2>
        <div class="reward-ad-tab" if={ icome.length >0 } >
            <ul>
                <li each={ icome }>
                    <span>{ date }</span> <span>{ income }</span>
                </li>
            </ul>
        </div>
        <div class="reward-in-em" if={ icome.length == 0  } >
          暂无全球购收益
        </div>
    </div>
    <script>

        var self = this;
        var modal = self.parent;
        self.next = 0;

        modal.onOpen = function (params) {
            self.init();
            self.listenDown();
        }

        self.init = function(){
          self.next = 0;
          var param = {
            next:self.next
          }
          store.globalIncomeList.get(param,function(data){
            self.next = data.next;
            self.icome = data.list;
            self.update();
          });
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
                            store.globalIncomeList.get({
                                next: self.next
                            }, function (data) {
                                self.next = data.next;
                                self.icome = self.coupon.concat(data.list);
                                self.scrollLock = false;
                                self.update();
                            });
                        }
                    }
                };
                self.listWrap.addEventListener('scroll', self.scrollDown, false);
            }, 50);
        }

        modal.onClose = function () {
          self.next = 0;
          self.icome = [];
          if (self.listWrap && self.scrollDown) {
              self.listWrap.removeEventListener('scroll', self.scrollDown);
          }
        }

        modal.onSubmit = function () {
            modal.close();
        }
    </script>
</pop-global-reward>
