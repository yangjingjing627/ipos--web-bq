<vip-login>
    <div class="vip-login">
        <div class="phone">
            <input type="tel" value="" placeholder="会员手机号" id="vipPhone">
        </div>
    </div>
    <script>

        var self = this;
        var modal = self.parent;
        var parent = self.parent.parent;

        modal.onOpen = function (params) {
            self.update();
        }

        modal.onClose = function () {
            $("#vipPhone").val("");
        }

        modal.onSubmit = function () {
            //请求查询会员手机号接口
            var _vipphone = $("#vipPhone").val();
            if (/^1[0-9]{10}$/.test(_vipphone)) {
                var params = {
                    phoneMobile: _vipphone
                }
                store.memberVerify.get(params, function (data) {
                    $("#vipPhone").val("");
                    utils.toast("登录成功");
                    modal.close();
                    parent.vipLogin = true;
                    parent.vipphone = _vipphone;
                    self.update();
                    parent.update();
                });
            } else {
                utils.toast("请填写正确的手机号");
            }
        }
    </script>
</vip-login>
