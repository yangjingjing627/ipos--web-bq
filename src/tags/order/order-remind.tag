<order-remind>
	<div style="display: none">
		<audio id="music" src="file:///mnt/internal_sd/Android/data/cn.ipos100.pos/files/mp3/order.ogg"></audio>
	</div>
	<script>
		var self = this;
		self.play = function () {
			// store.newOrderHint.get(function (date) {
			// 	if (date) {
					var audio = document.getElementById('music');
					audio.play();
					// 					self.orderAmount();
					window.dispatchEvent(new Event('orderNumChange'));
					// 					globleEvents.trigger('orderNumChange');
				// }
			// });

		}

		function playAudio(audio) {
			var url = audio.currentSrc
			if (!url) {
				return;
			}
			if (url.search('http') != -1) {
				audio.play();
			} else {
				var myMedia = new Media(url, function () {
					//	                    console.log("playAudio():Audio Success");
				}, function (err) {
					//	                    console.log("playAudio():Audio Error: " + err);
				});
				myMedia.play();
			}
		}

		// self.receiveMessage = function(){ 	utils.toast("receiveMessageInAndroidCallback"); }

		function getOrderMessage() {
			self.message = JSON.parse(Ipush.message);
			if (self.message.type == 2) {
				self.play();
			}
		}

		self.on('mount', function () {
			window.addEventListener('receiveMessage', getOrderMessage, false);
			//			self.initPush(); window.addEventListener('receiveNotificationInAndroidCallback', getPush, false); setInterval(self.play,10000);
		});

		self.on('unmount', function () {
			window.removeEventListener('receiveMessage', getOrderMessage);
			// window.addEventListener('receiveNotificationInAndroidCallback', getPush, false); clearInterval(self.play);
		});
	</script>
</order-remind>
