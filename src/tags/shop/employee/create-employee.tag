<create-employee>
	<form id="create-employee-form">
		<label>
			姓名：
			<input type="text" name="personName" maxlength="20">
		</label>
		<label>
			账号：
			<input type="text" name="username" placeholder="账户名必须大于6位" maxlength="12">
		</label>
		<label>
			密码：
			<input type="password" name="password" placeholder="密码必须大于6位" maxlength="12">
		</label>
		<label>
			电话：
			<input type="tel" name="mobile" maxlength="20">
		</label>
		<input name="type" type="hidden" value="2">
		<!-- 本期没有角色管理功能  -->
		<!-- <label>
		角色：
			<select>
				<option>收银员</option>
				<option>经理</option>
			</select>
			<span class="select-btn" onclick="{ openSelect }"></span>
		</label> -->
	</form>

	<script>
		var self = this;
		var modal = self.parent;
		modal.onOpen = function (params) {
			self.submitStatus = 1;
			utils.clearForm('create-employee-form');
		}

		modal.onSubmit = function () {
			var params = $('#create-employee-form').serializeObject();
			if (!(params.personName && params.personName.length > 1 && params.personName.length < 10)) {
				utils.toast("请输入正确的员工姓名");
				return;
			}
			if (!(params.username && /^[0-9a-zA-Z]{6,12}$/g.test(params.username))) {
				utils.toast("账号必须为6-12位字母或数字混合");
				return;
			}
			if (!(params.password && /^[0-9a-zA-Z]{6,12}$/g.test(params.password))) {
				utils.toast("密码格式不正确");
				return;
			}
			if (!(params.mobile == "") && !/^(\+86)?((([0-9]{3,4}-)?[0-9]{7,8})|(1[3578][0-9]{9})|([0-9]{11,20}))$/.test(params.mobile)) {
				utils.toast("电话格式不正确");
				return;
			}

			if (self.submitStatus === 2) {
				return;
			}
			self.submitStatus = 2;
			store.employee.create(params, function () {
				self.submitStatus = 1;
				modal.close();
			},function(){
				self.submitStatus = 1;
			});
		}

		self.on('mount', function () {
			if (store.online) {
				var gotimeout;
				$("#create-employee-form").find("input").focus(function () {
					clearTimeout(gotimeout);
					$(".modal-dialog").css("top", "220px");
				});

				$("#create-employee-form").find("input").blur(function () {
					gotimeout = setTimeout(function () {
						$(".modal-dialog").css("top", "50%");
					}, 200);
				});
			}
		});
		// phoneMobile username password personName
	</script>
</create-employee>
