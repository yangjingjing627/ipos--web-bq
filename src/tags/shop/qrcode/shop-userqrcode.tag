<shop-userqrcode>
	<div class="qrcode-top">
		<a onclick="{ refresh }">刷新</a>
	</div>
	<div class="qrcode-wraper">
		<div class="qrcode-item">
			<h3>店铺推广二维码</h3>
			<div class="exist-qrcode" tabindex="1">
				<img src="{ message.qrCodePromotion || message.qrCode }" >
			</div>
		</div>
	</div>
	<div class="qrcode-wraper">
		<div class="code">
			<div class="title1">将店铺二维码更换或保存到手机的方法：</div>
			<div class="title2">用手机扫描下方二维码进入编辑页面</div>
			<div class="img-code">
				<img src="{ message.qrCodePromotionUrl }" />
			</div>
			<div class="info active">更换二维码步骤：</div>
			<div class="info">根据提示在手机编辑页面更换二维码，然后点击"保存"</div>
			<div class="info">保存完毕之后，	在此页面点击"刷新"</div>
			<div class="info active">将网店二维码保存到手机步骤：</div>
			<div class="info">在手机编辑页面点击网店二维码，然后选择保存到相册</div>
		</div>
	</div>
	<script>
		var self = this;

		self.refresh = function(){
			store.synTask.get({name:"Store"},function(data){
				self.init();
			});
		}

		self.on('mount', function () {
			self.init();
		});

		self.init = function() {
			store.storeMessage.get({},function(data){
				self.message = data;
				self.update();
				setTimeout(function () {
					store.sys.sendMessage({updateStoreMessage: true});
				}, 500)
			});
		}
	</script>
</shop-userqrcode>
