<shop-qrcode>
	<div class="qrcode-top">
		<a onclick="{ refresh }">刷新</a>
	</div>
	<div class="qrcode-wraper" id="container">
		<div class="qrcode-item">
			<h3>支付宝二维码</h3>
			<div class="exist-qrcode" tabindex="1">
				<img src="{ qrCodeZfb || 'imgs/no-qrcode.png'}" onerror="javascript:this.src='imgs/no-qrcode.png'">
			</div>
		</div>

		<div class="qrcode-item">
			<h3>微信二维码</h3>
			<div class="exist-qrcode" tabindex="1">
				<img src="{ qrCodeWx || 'imgs/no-qrcode.png'}" onerror="javascript:this.src='imgs/no-qrcode.png'">
			</div>
		</div>

		<div class="clearfix"></div>
	</div>
	<div class="qrcode-wraper">
		<div class="code">
			<h3 class="title">上传支付二维码方法</h3>

			<h4>1.用手机扫描下方二维码进入上传页面</h4>
			<div class="img-code">
				<img src="{ qrCodeDown }" onerror="javascript:this.src='imgs/no-qrcode.png'"/>
			</div>
			<h4>2.根据提示上传二维码</h4>
			<h4>3.上传成功后点击右上角"刷新"按钮刷新此页面</h4>

		</div>

	</div>
	<script>
		var self = this;
		if (window.Icommon) {
		//	self.zhifubaoUrl = Icommon.rootPath + 'qrcode/zhifubao_' + Icommon.storeId + '.data';
		//	self.weixinUrl = Icommon.rootPath + 'qrcode/weixin_' + Icommon.storeId + '.data';
		//
			self.qrCodeZfb = Icommon.fileRootPath + 'qrcode/zhifubao_' + Icommon.storeId + '.data?t=' + new Date().getTime();
			self.qrCodeWx = Icommon.fileRootPath + 'qrcode/weixin_' + Icommon.storeId + '.data?t=' + new Date().getTime();
			self.qrCodeDown = Icommon.fileRootPath + 'qrcode/scan_' + Icommon.storeId + '.data?t=' + new Date().getTime();
			self.update();
		}

		self.refresh = function(){
			self.init();
		}

		self.on('mount', function () {
			self.init();
		});
		self.init = function () {
			utils.androidBridge(api.payQrInfoGet,{},function(res){
				self.res = JSON.parse(res);
				self.qrCodeZfb = self.res.data.aliCode;
				self.qrCodeWx = self.res.data.weixinCode;
				self.qrCodeDown = self.res.data.scanCode;
				self.update();
			})
		}
		// self.init = function () {
		// 	if (window.localStorage && ('setItem' in localStorage) && localStorage.getItem('account')) {
		// 			var localData = JSON.parse(localStorage.getItem('account'));
		// 			if (localData && localData.storeId) {
		// 				store.showPayQrCode.get({
		// 					storeId: localData.storeId
		// 				}, function (data) {
		// 					console.log(JSON.stringify(data) + '--------qrcode data-------');
		// 					console.log('---------qrcode---------------');
		// 						if (window.Icommon) {
		// 							self.qrCodeZfb = Icommon.fileRootPath + 'qrcode/zhifubao_' + Icommon.storeId + '.data?t=' + new Date().getTime();
		// 							self.qrCodeWx = Icommon.fileRootPath + 'qrcode/weixin_' + Icommon.storeId + '.data?t=' + new Date().getTime();
		// 							self.qrCodeDown = Icommon.fileRootPath + 'qrcode/scan_' + Icommon.storeId + '.data?t=' + new Date().getTime();
		// 							self.update();
		// 						}else {
		// 							self.qrCodeZfb = data.qrCodeZfb;
		// 							self.qrCodeWx = data.qrCodeWx;
		// 							self.qrCodeDown = data.qrCodeDown;
		// 							self.update();
		// 						}
		// 				});
		// 			}
		// 	}
		// }

//本地
//if (window.Icommon) {
//	self.zhifubaoUrl = Icommon.rootPath + 'qrcode/zhifubao_' + Icommon.storeId + '.data';
//	self.weixinUrl = Icommon.rootPath + 'qrcode/weixin_' + Icommon.storeId + '.data';
//
//	self.realZhifubaoUrl = Icommon.fileRootPath + 'qrcode/zhifubao_' + Icommon.storeId + '.data';
//	self.realWeixinUrl = Icommon.fileRootPath + 'qrcode/weixin_' + Icommon.storeId + '.data';
//}
//self.chooseFile = function(type) {
//	return function() {
//		if (window.Ifile) {
//			Ifile.chooseFile(function(res) {
//				self.copyFile(res.data, type);
//			},
//			function(err) {},
//			{});
//		}
//	}
//}
//
//self.copyFile = function(path, type) {
//	if (window.Ifile) {
//		Ifile.copyFile(function(res) {
//			if (res.code) {
//				window.Icommon && Icommon.toast('设置成功');
//				setTimeout(function() {
//					self.init();
//				},
//				150);
//			}
//		},
//		function(err) {
//			window.Icommon && Icommon.toast('设置失败');
//		},
//		{
//			source: path,
//			dest: self[(type + 'Url')]
//		});
//	}
//}
//
//self.deleteFile = function(filePath) {
//	return function() {
//		if (window.Ifile) {
//			Ifile.deleteFile(function(res) {
//				setTimeout(function() {
//					self.init();
//				},
//				150);
//			},
//			function(err) {
//				setTimeout(function() {
//					self.init();
//				},
//				150);
//			},
//			{
//				filePath: filePath
//			});
//		}
//	}
//}
//
//self.init = function() {
//	if (window.Ifile) {
//		Ifile.isFileExist(function(res) {
//			if (res.code) {
//				self.zhifubao = true;
//				if (window.Icommon) {
//					self.realZhifubaoUrl = Icommon.fileRootPath + 'qrcode/zhifubao_' + Icommon.storeId + '.data?t=' + new Date().getTime();
//				}
//				self.update();
//			} else {
//				self.zhifubao = false;
//				self.update();
//			}
//		},
//		function(err) {},
//		{
//			filePath: self.zhifubaoUrl
//		})
//
//		Ifile.isFileExist(function(res) {
//			if (res.code) {
//				self.weixin = true;
//				if (window.Icommon) {
//					self.realWeixinUrl = Icommon.fileRootPath + 'qrcode/weixin_' + Icommon.storeId + '.data?t=' + new Date().getTime();
//				}
//				self.update();
//			} else {
//				self.weixin = false;
//				self.update();
//			}
//		},
//		function(err) {},
//		{
//			filePath: self.weixinUrl
//		})
//	}
//}

//self.on('unmount',
//function() {
//	$('.moxie-shim').remove();
//})
	</script>
</shop-qrcode>
