<attain-sart>
	<div class="attain-sart" if={ attainReceive }>
		<div class="cover">
		</div>
		<div class="sart">
			<div class="title">恭喜您</div>
			<div class="info">已达成{ message.data.title }成就</div>
			<div class="button">
				<a onclick="{ goAttain }">去成就界面查看</a>
			</div>
			<div class="cancel">
				<span onclick={ cancel }>稍后查看</span>
			</div>
		</div>
	</div>
	<script>
		var self = this;
		self.attainReceive = false;

		self.cancel = function(){
			self.attainReceive = false;
			self.message = {};
			self.update();
		}

		self.goAttain = function(){
			// window.location.href = "#/shop/attain";
			window.location.replace("#/shop/attain");
			window.dispatchEvent(new Event('receiveMessageReload'));
			self.attainReceive = false;
			self.message = {};
			self.update();
		}

		function getReceiveMessage(){
			self.message = JSON.parse(Ipush.message);
			if(self.message.type==1){
				self.attainReceive= true;
				self.update();
			}
		}

		// riot.routeParams.on('changed', function () {
		// 	// self.attainReceive = false;
		// 	self.attainReceive = false;
		// 	self.message = {};
		// 	self.update();
		// });

		self.on('mount', function() {
			window.addEventListener('receiveMessage', getReceiveMessage, false);
		});

		self.on('unmount', function() {
			window.removeEventListener('receiveMessage', getReceiveMessage);
		});

	</script>
</attain-sart>
