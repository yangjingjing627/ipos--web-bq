<pop-add-card>
    <div class="add-card">
        <h4>填写账户</h4>
        <div class="li">
            <span>银行：</span>
            <input type="text" value="" id="bankName">
        </div>
        <div class="li">
            <span>卡号：</span>
            <input type="text" value="" id="cardCode">
        </div>
        <div class="li">
            <span>开户银行：</span>
            <input type="text" value="" class="long" id="bankAddress">
        </div>
        <div class="li">
            <span>姓名：</span>
            <input type="text" value="" id="name">
        </div>
    </div>
    <script>

        var self = this;
        var modal = self.parent;
        var parent = self.parent.parent;
        modal.onOpen = function () {}

        modal.onClose = function () {
            $("pop-add-card").find("input").val("");
        }

        modal.onSubmit = function () {
            var param = {
                bankName: $("#bankName").val(),
                cardCode: $("#cardCode").val(),
                bankAddress: $("#bankAddress").val(),
                name: $("#name").val()
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
            store.bankCardAdd.get(param, function (data) {
                modal.close();
                location.href = "#/shop/income";
            });
        }
    </script>
</pop-add-card>
