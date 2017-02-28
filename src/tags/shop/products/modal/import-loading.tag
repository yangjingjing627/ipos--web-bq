<import-loading>
	<div class="import-loading">
		<div class="loading-text">{ text }</div>
		<!--loading  Animation start -->
		<div class="loaded">
			<div class="loader">
        <div class="loader-inner line-scale">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
		</div>
		<!--loading  Animation end -->
		<div class="button">
			<a class={active:button} onclick="{ onClose }">取消导入</a>
		</div>
	</div>
	<script>
		var self = this;
		var modal = self.parent;
		var timeInterval;
		var baseTime = 600000;
		self.text = "正在导入商品";
		self.time = 0;

		modal.onOpen = function (params) {
			self.button = false;
			clearInterval(timeInterval);
			self.time = 0;
			$(".loading-text").text("正在导入商品");
			self.update();
			timeInterval = setInterval(function() {
				self.time = self.time +1;
				self.update();
			}, 1000);

			setTimeout(buttonOpen, baseTime);
			function buttonOpen() {
				self.button = true;
				clearInterval(timeInterval);
				self.update();
			}
		}

		self.onClose = function () {
			if (self.button) {
				clearInterval(timeInterval);
				self.time = 0;
				modal.close();
				self.button = false;
				self.update();
			} else {
				var lastTime = baseTime/1000-self.time;
				if(lastTime>60){
					var toastTime = parseInt(lastTime/60)+"分"+(lastTime%60)+"秒";

				}else{
					var toastTime = lastTime;
				}
				utils.toast("请在"+toastTime+"后取消");
			}
		}

		self.on('mount', function () {});
	</script>
</import-loading>
