<find-password>
	<div id="login-wrap">
		<a class="back" onclick="{ goback }">返回</a>
		<div class="setting" onclick="{ openSetting }"></div>
		<form class="register" onsubmit="{ submit }">
			<h4>找回密码</h4>
			<input class="{ error: !verifyPhone }" value={ register.phoneMobile } type="text" name="phone" id="register-phone" maxlength="11" placeholder="手机号" />
			<label>
				<input class="{ error: !verifyCode }" value={ register.code } type="text" name="phone" id="checkcode" placeholder="验证码" />
				<a if={ firstSend } href="" onclick={ getCode } >获取</a>
				<a if={ !firstSend } onclick={ getCode } >
					再次获取
					<span if={ isCounting } id="countDown">{ countNum }</span>
					<b if={ isCounting }> s </b>
				</a>
			</label>
			<input type="password" value={ register.password } name="password" class="{ error: !verifyPWD }" id="rg-pwd" placeholder="新密码">
			<input type="password" value={ register.password } class="{ error: !verifyRePWD }" placeholder="再次确认密码" id="rg-repwd">
			<button onclick={ submit }>修改密码</button>
		</form>
	</div>
	<script>
		var self = this;
		self.countNum = 60;
		self.firstSend = true;
		self.verifyCode = self.verifyPhone = self.verifyPWD = self.verifyRePWD = true;

		function countDown(){
			var count = $('#countDown');

			if (count[0]){
				count.text(self.countNum--);

				if (self.countNum > -1){
					setTimeout(countDown, 1000);
				} else {
					self.isCounting = false;
					self.update();
				}
			}
		}

		self.openSetting = function() {
			utils.androidBridge(api.openSetting)
			// if (window.Icommon) {
			// 	Icommon.openSetting();
			// }
		}

		self.getCode = function(e){
			e.preventDefault();

			var target = e.target;
			var phone = $('#register-phone').val();

			if (phone.match(/^1[0-9]{10}$/)){

				self.verifyPhone = true;

				if (self.isCounting) {
					return ;
				}

				self.firstSend = false;
				store.password.sendCode({
					phoneMobile: phone
				}, function(){
					self.isCounting = true;
					self.countNum = 60;
					self.update();
					countDown();
				});
			} else {
				self.verifyPhone = false;
			}
		}

		self.submit = function(e){
			e.preventDefault();

			self.verifyPhone = $('#register-phone').val().match(/^1[0-9]{10}$/) ? true : false;
			self.verifyPWD = $('#rg-pwd').val() ? true : false;
			self.verifyRePWD = $('#rg-pwd').val() == $('#rg-repwd').val() ? true : false;

			if (self.verifyPhone && self.verifyPWD && self.verifyRePWD) {
				store.password.commit({
					phoneMobile: $('#register-phone').val(),
					code: $('#checkcode').val(),
					password: $('#rg-pwd').val()
				}, function(res){
					if (res.code !== 1) {

						//to-do set warning
						return;
					} else {
						//to-do set warning
						// location.hash = '#login';
						utils.androidBridge(api.goLogin)

					}
				})
			}
		};
		self.goback = function() {
			utils.androidBridge(api.goLogin)
		}
	</script>
</find-password>
