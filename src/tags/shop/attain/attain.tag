<!-- create by wuxin -->
<attain>
    <div class="attain">
        <div class="attain-list">
            <ul class="attain-list-ul"  >
                <li class="list" each="{ attain }" if={ attain.length > 0 }>
                    <div class="attain_top">
                        <div class="left">
                            <h3>{ name }</h3>
                            <div class="img">
                                <img src="{ iconUrl }" alt=""/>
                            </div>
                            <h5>
                                { currentLevel }级/共{ totalLevel }级</h5>
                        </div>
                        <div class="right">
                            <ul>
                                <li each={ currentTask.behaviors }>
                                    <div class="title">
                                        { title }
                                    </div>
                                    <div class="num">
                                        { currentNum }/{ totalNum }
                                    </div>
                                    <div class="line">
                                        <div class="co" style="width:{ currentNum/totalNum*100 }%"></div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="attain_bottom">
                        <div class="icon_bottom atta-coupon" if="{ reward.type == 0 || reward.type == 3}"></div>
                        <div class="icon_bottom atta-app" if="{ reward.type == 1 }"></div>
                        <div class="icon_bottom atta-ad" if="{ reward.type == 2 }"></div>
                        <div class="icon_bottom atta-global" if="{ reward.type == 4 }"></div>
                        <h5 if="{ reward.type == 0 }">{ reward.totalNum }张总价值</h5>
                        <h5 if="{ reward.type == 0 }">{ reward.totalPrice }元优惠券</h5>
                        <h5 if="{ reward.type == 1 }" class="atta-app">{ reward.name }</h5>
                        <h5 if="{ reward.type == 2 }" class="atta-ad">{ reward.name }</h5>
                        <h5 if="{ reward.type == 3 }" class="atta-one-cou">{ reward.name }</h5>
                        <h5 if="{ reward.type == 4 }" class="atta-global">{ reward.name }</h5>
                        <a class="cancel" if="{ status == 0}">领取</a>
                        <a onclick="{ getReceive }" if="{ status == 1}">领取</a>
                        <a class="cancel" if="{ status == 2}">已领取</a>
                    </div>
                </li>
                <div class="clear">
                </div>
                <div class="none-list" if={ attain.length <= 0}>
                  <div class="none-list-text">
                    暂无成就
                  </div>
                </div>
            </ul>
        </div>

    </div>

    <script>
        var self = this;
        self.next = 0;

        self.getReceive = function (e) {
            var param = {
                reachRecordId: e.item.recordId
            }
            store.attain.getReward(param, function (data) {
                utils.toast("领取成功");
                self.next = 0;
                self.init();
            });
        }

        self.init = function () {
            self.next = 0;
            var params = {
                next: self.next
            }
            store.attain.get(params, function (data) {
                self.next = data.next;
                self.attain = data.list;
                self.update();
            });
        }

        self.scrollLock = false;
        self.listenDown = function () {
            setTimeout(function () {
                self.listWrap = $('.attain-list-ul')[0];
                self.scrollDown = function (event) {
                    var clientHeight = self.listWrap.clientHeight;
                    var scrollTop = self.listWrap.scrollTop;
                    if ((clientHeight + scrollTop) > self.listWrap.scrollHeight - 60) {
                        if (self.next && !self.scrollLock) {
                            self.scrollLock = true;
                            store.attain.get({
                                next: self.next
                            }, function (data) {
                                self.next = data.next;
                                self.attain = self.attain.concat(data.list);
                                self.scrollLock = false;
                                self.update();
                            });
                        }
                    }
                };
                self.listWrap.addEventListener('scroll', self.scrollDown, false);
            }, 5000);
        }

        function getReceiveMessageReload(){
            self.init();
        }

        self.on('mount', function () {
            self.init();
            self.listenDown();
            window.addEventListener('receiveMessageReload', getReceiveMessageReload, false);
        });

        self.on('unmount', function () {
          window.removeEventListener('receiveMessageReload', getReceiveMessageReload);
            if (self.listWrap && self.scrollDown) {
                self.listWrap.removeEventListener('scroll', self.scrollDown);
            }
        })
    </script>

</attain>
