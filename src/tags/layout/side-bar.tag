<side-bar>
	<div id="side-bar">
		<div class="header">
			<div class="avator" onclick={ openTip }></div>
			<div class="account-name" onclick={ openTip }>{ accountName || '用户名'}</div>
			<div class="right-tip" style="display:none">
				<div class="tri"></div>
				<a onclick={ openAbout }>关于我们</a>
				<a onclick={ logout }>退出账户</a>
			</div>
		</div>
		<div class="side-menu">
			<ul>
				<li class="{ active: type=='casher'||type==''}">
					<a href="#/casher/index">
						<div class="menu-pic m-casher"></div>
						<div class="menu-title">收银</div>
					</a>
				</li>

			  <li class="{ active: type=='order'}" if={ !isBqCommercial }>
					<a href="#/order/index">
						<div class="menu-pic m-order">
							<div class="order-untreated" style="display:none"></div>
						</div>
						<div class="menu-title">订单</div>
					</a>
				</li>

				<li class="{ active: type=='shop'}">
					<a href="#/shop/index">
						<div class="menu-pic m-store"></div>
						<div class="menu-title">店铺</div>
					</a>
				</li>
				<li class="{ active: type=='app'}">
					<a href="#/app/index">
						<div class="menu-pic m-app"></div>
						<div class="menu-title">应用</div>
					</a>
				</li>
			</ul>
			<div class="lock" onclick="{ openLock }"></div>
			<div class="setting" onclick="{ openSetting }"></div>
		</div>
		<modal id="about-layer" model-width="400px" model-height="512px" without-delete noFooter>
			<div class="about">
				<div class="about-close" onclick="{ close }"></div>
				<h2>关于</h2>
				<img class="logo" width="106" src="imgs/logo.png"/>
				<!-- 	<p>开店宝云POS</p> -->
				<p>版本： { parent.version }
				</p>
				<!-- 				<img class="wechat" width="150" src="imgs/pay-code.png" /> -->
				<!-- 				<p>微信公众号：开店宝</p> -->
				<span class="red-box" onclick={ parent.checkAppUpdateState }>检测更新</span>
			</div>
		</modal>
		<modal modal-width="500px" modal-height="" id="confirm-exit" goExit>
			<confirm-exit></confirm-exit>
		</modal>
	</div>

	<script>
		var self = this;

		function active() {
					self.type = location.hash.substr(2).split('/')[0].replace(/\?\S+/, '');
					self.update();
					// if ((self.type == 'casher') || (self.type == 'shop') || (self.type == 'app')) {
					// 	self.checkUserIsLogin();
					// }
				}
		flux.bind.call(self, {
			name: 'account',
			store: store.account,
			success: function () {
				self.accountName = self.account
					? self.account.personName
					: '用户名';
				self.update();
			}
		});

		self.checkAppUpdateState = function () {
			httpGet({url: api.checkAppUpdateState});
		}

		self.toBeConfirmed = function () {
			store.orderConfirmed.get(function (data) {
				if (data > 0) {
					$(".order-untreated").show().text(data);
				} else {
					$(".order-untreated").hide();
				}
			});
		}

		self.openTip = function () {
			var e = window.event;
			e.preventDefault();
			if (e && e.stopPropagation) {
				e.stopPropagation();
			}
			$('.right-tip').toggle();
			function closeTip() {
				$('.right-tip').hide();
				$(window).unbind('click', closeTip);
			}
			setTimeout(function () {
				$(window).bind('click', closeTip);
			}, 100);
		};

		self.openAbout = function () {
			$('#about-layer')[0].open();
		};

		self.closeAbout = function () {
			$('#about-layer')[0].close();
		}

		self.logout = function () {
			$('#confirm-exit')[0].open();			//退出账号前，打印小票
			// store.account.logout();
			// location.hash = "#login";

		}
		// 点击锁屏按钮，锁定屏幕
		self.openLock = function () {
			utils.androidBridge(api.lockScreen)
			// if (window.Icommon) {
			// 	Icommon.lockScreen();
			// }
		}
		self.openSetting = function () {
			utils.androidBridge(api.openSetting)
			// if (window.Icommon) {
			// 	Icommon.openSetting();		//调用android插件，对前端来说就是接口，将本地的设置打开。
			// }
		}
		self.checkUserIsLogin = function () {
					var storeInfo = {}
					// console.log(localStorage.account+'----------checkUserIsLogin----确认是否获得user----------------------------');
					if (window.localStorage && localStorage.account) {
						storeInfo = JSON.parse(localStorage.account)
					}
					// console.log(storeInfo+'-----------------storeInfo--是否得到---------------');
					if (!storeInfo.storeId) {
						// location.href = "#login";
						utils.androidBridge(api.goLogin)

					}
				}
		self.UserInfo = function () {
			store.account.lastLogin(function () {
				self.checkUserIsLogin();
			});
		}
		self.on('mount', function () {
			// self.UserInfo();
			// store.judgeBqCommercial.get(function (data) {
			// 	self.isBqCommercial = data;
			// 	if (self.isBqCommercial) {
			// 		store.closeStore.get();
			// 	}
			// 	self.update();
			// });
			if (window.Iapps) {
				Iapps.getVersion(function (res) {
					if (res.version) {
						self.version = res.version;
						self.update();
					} else {
						self.version = "V1.0.0 Beta";
						self.update();
					}
				}, function (err) {}, {})
			} else {
				self.version = "V1.0.0 Beta"
			}
			setTimeout(self.toBeConfirmed, 500);
			//订单数量变化
			window.addEventListener('orderNumChange', self.toBeConfirmed);
		});

		self.on('unmount', function () {
			window.removeEventListener('orderNumChange', self.toBeConfirmed);
		});

		riot.routeParams.on('changed', active);
		active();
	</script>
</side-bar>
