<pop-ad-reward>
    <div class="reward-pop">
        <h2>广告收入：</h2>
        <h5>该奖励将使您的iPos客屏播放广告，您将获得广告分成。分成根 据实际广告播放时长和广告费浮动变化。因此，请务必确保iPos 在线并且正常播放广告。广告分成每天24:00统计。每月奖励收 入会按时一并打入您的账户。请点击“奖励收入”查看。</h5>
        <h2>广告收入详情：</h2>
        <div class="reward-ad-tab" if={ icome.length >0 } >
            <ul>
                <li each={ icome }>
                    <span>{ date }</span> <span>{ income }</span>
                </li>
            </ul>
        </div>
        <div class="reward-in-em" if={ icome.length == 0  } >
          暂无广告收益
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
          store.advIncomeList.get(param,function(data){
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
                            store.advIncomeList.get({
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
</pop-ad-reward>
