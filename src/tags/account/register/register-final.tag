<register-final>
	<div id="login-wrap">
		<a class="back" href="#/register">上一步</a>
		<div class="setting" onclick="{ openSetting }"></div>
		<form class="register" onsubmit="{ submit }">
			<h4>填写店铺信息</h4>
			<input type="text" name="storeName" class="{ error: !verifyStoreName }" placeholder="店铺名称" />
			<input type="text" name="shopAddress"  class="shopAddress { error: !verifyAddress }"  onfocus={ openSelect } value={ addressValue } placeholder="店铺地址" />
			<input type="text" name="streetName" class="{ error: !verifyStree }"  placeholder="街道" />
			<input type="text" name="tel" class="{ error: !verifytel }"  placeholder="店铺电话" maxlength="20" />
			<label class="checkbox" onclick={ toggleLogin } >
				<p id="autologin" class="on">打开收银机默认登陆此店铺</p>
			</label>
			<button>提交</button>
		</form>
	</div>
	<modal modal-width="" modal-height="" id="selectAddr">
		<address-select></address-select>
	</modal>
	<script>
		var self = this;
		var q = riot.route.query();
		var cdkey = q.cdkey;

		var verifyList = ['verifyStoreName', 'verifyAddress', 'verifyStree', 'verifytel'];
		for (var i = 0; i < 4; i++ ) {
			self[verifyList[i]] = true;
		}

		self.openSetting = function() {
			utils.androidBridge(api.openSetting)
			// if (window.Icommon) {
			// 	Icommon.openSetting();
			// }
		}

		flux.bind.call(self,{
			name: 'register',
			store: store.register,
			success: function () {
				self.update();
			}
		});

		function verify(){
			var storeName = $('input[name=storeName]').val();
			var addressName = $('input[name=shopAddress]').val();
			var streetName = $('input[name=streetName]').val();
			var tel = $('input[name=tel]').val();

			if (!storeName) {
				self.verifyStoreName = false;
				utils.toast("请填写店铺名称");
				return false;
			} else {
				self.verifyStoreName = true;
				store.register.set('storeName', storeName);
			}

			if (!addressName) {
				self.verifyAddress = false;
				utils.toast("请填写店铺地址");
				return false;
			} else {
				self.verifyAddress = true;
			}

			if (!streetName) {
				self.verifyStree = false;
				utils.toast("请填写街道信息");
				return false;
			} else {
				self.verifyStree = true;
				store.register.set('streetName', streetName);
			}

			if (!tel.match(/[0-9]{6,}/)) {
				self.verifytel = false;
				utils.toast("请填写正确的店铺电话");
				return false;
			} else {
				self.verifytel = true;
				store.register.set('tel', tel);
			}

			return self.verifyStoreName && self.verifyAddress && self.verifyStree && self.verifytel;
		}

		function autoLogin(){
			store.account.login({
				username: self.register.phoneMobile,
				password: self.register.password,
				imeCode: '784372987'
			},function(data){
				// location.hash = '#/casher/index';
				// location.replace("#/casher/index");
				// location.reload();
			});
		}

		self.submit = function(e){
			e.preventDefault();
			if (verify()) {
				utils.loadShow();
				if($('#autologin').hasClass('on')  && self.imeCode){
					self.register.bindDevice = true;
				}else{
					self.register.bindDevice = false;
				}
				if(self.imeCode){
					self.register.imeCode = self.imeCode;
				}
				self.register.cdkey = q.cdkey;
				httpPost({
					url: api.register,
					params: self.register,
					success: function(res){
						if ( $('#autologin').hasClass('on') ){
							autoLogin();
						} else {
							// location.hash = '#login';
							utils.androidBridge(api.goLogin)

						}
					},
					complete: function(res) {
							utils.loadHide();
					}
				});
			};
		};

		self.toggleLogin = function(e){
			$(e.target).toggleClass('on');
		}

		self.openSelect = function(){
			$('#selectAddr')[0].open();
		}

		self.on('mount', function(){
			utils.androidBridge(api.getImei,{},function(res){
				if (res.imei) {
								self.imeCode = res.imei;
								self.update();
							}
			})
			// if(window.Iapps){
			// 	Iapps.getImei(
			// 		function(res) {
			// 			if (res.imei) {
			// 				self.imeCode = res.imei;
			// 				self.update();
			// 			}
			// 		},
			// 		function(err) {},
			// 		{}
			// 	)
			// }

// 			else{
// 				self.imeCode = "784372987";
// 			}

			$(self.root).find('input').bind('input', function(e){
				$(this).removeClass('error');
			});
		})

	</script>
</register-final>
