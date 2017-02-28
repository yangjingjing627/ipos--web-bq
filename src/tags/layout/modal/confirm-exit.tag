<confirm-exit>
  <div>退出账户</div>
  <p>
    确定退出吗？
  </p>
  <span class="printExit selected" onclick={ confirmPrint }>
    打印总计小票
  </span>
  <script type="text/javascript">
    var self = this;
    var modal = self.parent;
		var exit = self.parent.parent;
    // console.log(exit);
    if (window.localStorage && localStorage.account) {
      var storeInfo = JSON.parse(localStorage.account)
      self.storeId = storeInfo.storeId;
    }
    // var localData = JSON.parse(localStorage.getItem('account'));
    // console.log( localData.storeId );
    //选择是否打印
    self.confirmPrint = function () {
      if($('.printExit').is('.selected')){
        $('.printExit').removeClass('selected');
      }else{
        $('.printExit').addClass('selected');
      }
    }
    //账号退出时，如果选择打印，则打印此次登录后所有交易信息
    self.print = function(e) {
      //android打印此次登陆中的所有交易
      httpGet({
        url: "Iprinter.printLogout",
        params: { storeId: self.storeId },
        success: function(res) {
              }
          });
    }
    // 点击确定，退出账户
    modal.onSubmit = function () {
      self.root.style.display = 'none';
      $(self.root).parents('side-bar').find('#confirm-exit').hide();
      store.account.logout();
      if($('.printExit').is('.selected')){
        //调用后台数据，将流水记录获取到传给android
        self.print();
      }
      location.hash = "#login";
      // utils.androidBridge(api.goLogin)

		}
    modal.onOpen = function () {
      $('.printExit').addClass('selected');
    }

  </script>
</confirm-exit>
