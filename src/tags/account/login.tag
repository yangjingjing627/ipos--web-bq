<login>
	<div id="login-wrap">
		<form class="login" onsubmit="{ submit }">
			<div class="logo"></div>
			<div class="setting" onclick="{ openSetting }"></div>
			<input id="username" type="text" name="username" placeholder="账号/手机号" maxlength="12">
			<input id="password" type="password" name="account" placeholder="密码" maxlength="12">
			<button class="login-btn">登录</button>
			<div class="tips">
				<!-- <a class="left" href="#/register">开店</a> -->
				<a class="left" href="#/license-key">开店</a>

				<a class="right" href="#/find-password">找回店主密码</a>
			</div>
		</form>

		<div class="warning" id="login-warning" style="display:none">
			<h2>提示</h2>
			<p>账号或密码错误。如果使用员工账号登录，请确保该收银机已绑 定至账号所属店铺。修改绑定请用店主账号登录并在“店铺资料” 处绑定。</p>
			<a class="red-box" onclick="{ closeWarning }">知道了</a>
		</div>
	</div>
	<script>
		var self = this;

		self.openSetting = function () {
			utils.androidBridge(api.openSetting)
			// if (window.Icommon) {
			// 	Icommon.openSetting();
			// }
		}

		self.submit = function (e) {
			e.preventDefault();
			var username = $('#username').val();
			var password = $('#password').val();
			if(!username){
				utils.toast("请填写用户名");
				return;
			}

			if(!password){
				utils.toast("请填写密码");
				return;
			}

			store.account.login({
				username: $('#username').val(),
				password: $('#password').val(),
				imeCode: '2021414914044598'
			}, function (data) {
				if (data.code == 1) {
					self.login = true;

					location.replace("#/casher/index");
					location.reload();
					// flux.update(store.auth);
				} else if (data.code == 20101) {
					self.login = false;
					$('#login-warning').show();
				} else if (data.msg) {
					alert(data.msg);
				}
			});
		};

		self.closeWarning = function () {
			$('#login-warning').hide();
		}
	</script>
</login>
