<income>
  <div class="income-content">
    <div class="income-top">
        <a onclick="{ goRecord }" class="{ active: record}">发放记录</a>
        <a onclick="{ goAccount }" class="{ active:!record }">发放账户</a>
    </div>

    <div class="income-text">
      <div class="left" id="incomeList">
        <div class="income-record" if={ record }>
          <h4>累计收入： <i>{ totalPay }</i></h4>
          <h4>待支付收入：<i>{ waitPay }</i></h4>
          <ul>
            <!-- <li>
              <div class="">
                <span class="fl-left">6月</span>
                <span class="fl-right">＋3900.00</span>
              </div>
            </li> -->
            <li each = { income }>
              <div>
              <span>{ title }</span>
            </div>
            <div>
              <span class="fl-left">{ date }</span>
              <span class="fl-right">{ income }</span>
              <span class="clear"></span>
            </div>
            </li>
          </ul>
        </div>
        <div class="income-account" if={ account }>
          <ul>
            <li>
              <span class="fl-left">银行：</span>
              <span class="fl-right">{ card.bankName }</span>
              <span class="clear"></span>
            </li>
            <li>
              <span class="fl-left">卡号：</span>
              <span class="fl-right">{ card.cardCode }</span>
              <span class="clear"></span>
            </li>
            <li>
              <span class="fl-left">开户银行：</span>
              <span class="fl-right">{ card.bankAddress }</span>
              <span class="clear"></span>
            </li>
            <li>
              <span class="fl-left">姓名：</span>
              <span class="fl-right">{ card.name }</span>
              <span class="clear"></span>
            </li>
          </ul>
          <div class="button">
            <a onclick="{ editAccount }">修改</a>
          </div>
        </div>
        <div class="income-account-edit" if={ accountEdit }>
          <ul>
            <li>
              <span class="fl-left">银行：</span>
              <span class="fl-right">
                <input type="text" value="{ card.bankName }" id="bankName">
              </span>
              <span class="clear"></span>
            </li>
            <li>
              <span class="fl-left">卡号：</span>
              <span class="fl-right">
                <input type="tel" value="{ card.cardCode }" id="cardCode">
              </span>
              <span class="clear"></span>
            </li>
            <li>
              <span class="fl-left">开户银行：</span>
              <span class="fl-right">
                <input type="text" name="name" value="{ card.bankAddress }" id="bankAddress">
              </span>
              <span class="clear"></span>
            </li>
            <li>
              <span class="fl-left">姓名：</span>
              <span class="fl-right">
                <input type="text" value="{ card.name }" id="name">
              </span>
              <span class="clear"></span>
            </li>
          </ul>
          <div class="button">
            <a onclick="{ saveAccount }">保存</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <pop id="popModifPhone" title="验证手机" twobutton sureText="下一步">
      <pop-modify-phone></pop-modify-phone>
  </pop>
  <script>
  var self =this;
  self.record = true;
  self.account = false;
  self.accountEdit = false;
  self.update();
  self.page = 0;
  self.pageSize = 10;

  self.init = function(){
    var param = {
      next:0,
    }
    store.rewardIncomeList.get(param,function(data){
      self.income = data.list;
      self.next = data.next;
      self.totalPay = data.totalPay;
      self.waitPay = data.waitPay;
      self.update();
    });
  }

  self.scrollLock = false;
  self.listenDown = function () {
      setTimeout(function () {
          self.listWrap = $('#incomeList')[0];
          self.scrollDown = function (event) {
              var clientHeight = self.listWrap.clientHeight;
              var scrollTop = self.listWrap.scrollTop;
              if ((clientHeight + scrollTop) > self.listWrap.scrollHeight - 60) {
                  if (self.next && !self.scrollLock) {
                      self.scrollLock = true;
                      store.rewardIncomeList.get({
                          next: self.next
                      }, function (data) {
                          self.next = data.next;
                          self.income = self.income.concat(data.list);
                          self.scrollLock = false;
                          self.update();
                      });
                  }
              }
          };
          self.listWrap.addEventListener('scroll', self.scrollDown, false);
      }, 50);
  }

  self.editAccount = function(){
    store.changeCardCodeSend.get(function(data){
      var param = {
        incomePhone:data.phoneMobile,
        type:2
      }
      $("#popModifPhone")[0].open(param);
    });
  }

  self.saveAccount = function(){
    var param ={
      bankName:$("#bankName").val(),
      cardCode:$("#cardCode").val(),
      bankAddress:$("#bankAddress").val(),
      name:$("#name").val()
    };
    if (!param.bankName) {
      utils.toast("请填写银行");
      return;
    }
    if (!param.cardCode) {
      utils.toast("请填写卡号");
      return;
    }
    if (param.cardCode.length < 15 || param.cardCode.length > 19) {
      utils.toast("银行卡号长度必须在15到19之间");
      return;
    }
    var num = /^\d*$/;
    if (!num.exec(param.cardCode)) {
      utils.toast("银行卡号必须全为数字");
      return;
    }
    if (!param.bankAddress) {
      utils.toast("请填写开户银行地址");
      return;
    }
    if (!param.name) {
      utils.toast("请填写姓名");
      return;
    }
    param.cardId = self.card.cardId;
    store.bankCardUpdate.get(param,function(data){
      self.account = true;
      self.accountEdit = false;
      self.update();
      self.goAccount();
    });
  }

  self.goRecord = function(){
    self.record = true;
    self.account = false;
    self.accountEdit = false;
    self.update();
  }

  self.goAccount = function(){
    store.bankCard.get(function(data){
      if (data.status == 1) {
        self.record = false;
        self.account = true;
        self.card = data;
        self.accountEdit = false;
        self.update();
      }else {
        utils.toast("还未绑定银行卡");
      }
    });
  }

  self.on('mount', function() {
    self.init();
    self.listenDown();
  });
  self.on('unmount', function () {
      if (self.listWrap && self.scrollDown) {
          self.listWrap.removeEventListener('scroll', self.scrollDown);
      }
  })
  </script>
</income>
