<pop-modify-phone>
    <div class="modify-pop">
      <h4>验证手机号：</h4>
      <h5>已发送验证码到店铺手机号{ phone }，请输入验证码</h5>
      <div class="modify-phone">
        <span class="input">
          <input type="tel" name="" value="" id="code">
        </span>
        <span id="countDown" if={ isCounting }>{ countNum }</span>
        <span if={ isCounting }>s</span>
      </div>
    </div>
    <script>

        var self = this;
        var modal = self.parent;
        var parent = self.parent.parent;
        self.isCounting = true;
        self.countNum = 60;
        var csetTime;
        modal.onOpen = function (params) {
          clearTimeout(csetTime);
          self.incomePhone = params.incomePhone;
          self.type = params.type;
          var phone = self.incomePhone.toString();
          self.phone = phone.substring(0,3)+"XXXX"+phone.substring(7,11);
          self.isCounting = true;
					self.countNum = 60;
					self.update();
					countDown();
        }

        function countDown(){
    			var count = $('#countDown');
    			if (count[0]){
    				count.text(self.countNum--);
    				if (self.countNum > -1){
				       csetTime = setTimeout(countDown, 1000);
    				} else {
    					self.isCounting = false;
    					self.update();
    				}
    			}
    		}

        modal.onClose = function () {
          $("pop-modify-phone").find("input").val("");
          clearTimeout(csetTime);
        }

        modal.onSubmit = function () {
          var param = {
            phoneMobile:self.incomePhone,
          }
          var code = $("#code").val();
          if(!code) {
            utils.toast("请填写验证码");
            return;
          }
          param.code = code;
          store.mobileVerify.get(param,function(data){
            if (self.type == 1) {//首次绑定账号验证码
              parent.addCard();
            }else {//修改验证码
              parent.account = false;
              parent.accountEdit = true;
              parent.update();
            }
            modal.close();
          });
        }
    </script>
</pop-modify-phone>
