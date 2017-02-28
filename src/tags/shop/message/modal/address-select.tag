<address-select>

	<div class="scroll-wrap">
		<div class="scroll-content">
			<div>
				<ul type="levelOne">
					<li each={ region.levelOne } code={ code }> { name }</li>
				</ul>
			</div>
			<div>
				<ul type="levelTwo">
					<li if={ !region.levelTwo.length }> -- </li>
					<li if={ region.levelTwo.length } each={ region.levelTwo } code={ code }> { name }</li>
				</ul>
			</div>
			<div>
				<ul type="levelThree">
					<li if={ !region.levelThree.length }> -- </li>
					<li if={ region.levelThree.length } each={ region.levelThree } code={ code }> { name }</li>
				</ul>
			</div>
			<p></p>
		</div>
	</div>

	<script>
		var hasTouch = !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch);
		var startEvt = hasTouch ? 'touchstart' : 'mousedown';
		var moveEvt = hasTouch ? 'touchmove' : 'mousemove';
		var endEvt = hasTouch ? 'touchend' : 'mouseup';

		var self = this;
		var modal = self.parent;
	// modal.onOpen = function(){
		self.on('mount', function(){
		flux.bind.call(self,{
			name: 'region',
			store: store.region,
			success: function () {
				self.update();
			}
		});

		flux.bind.call(self,{
			name: 'register',
			store: store.register,
			success: function () {
				self.update();
			}
		});
		self.update();
		bind();
	// }
		});

		function bind(){
			self.scale = 40;
			$(self.root).find('ul').bind(startEvt, start);
		}

		function start(e){
			var e = window.event;

			self.target = $(e.target).parents('ul:first');
			self.startY = hasTouch && e.targetTouches ? e.targetTouches[0].pageY : e.pageY;
			self.top = parseInt(self.target.css('top'));
			self.max = self.target.height();

			if (self.max == self.scale){
				return;
			}

			$(window).bind(moveEvt, move);
			$(window).bind(endEvt, end);
		}

		function end(e){
			$(window).unbind(moveEvt);
			$(window).unbind(endEvt);
			self.top = parseInt(self.target.css('top'));

			var index = Math.round(Math.abs(self.top - self.scale)/self.scale);
			var left = Math.abs(self.scale * (1 - index) - self.top);

			self.top = self.scale * (1 - index);
			self.target.css('top', self.top);
			self.target.attr('idx', index);

			var key = self.target.attr('type');
			store.region.setCurrent(key, self.region[key][index]);
		}

		function move(e){
			var e = window.event;

			e.preventDefault();
			self.offsetY = hasTouch && e.targetTouches ? (e.targetTouches[0].pageY - self.startY) : (e.pageY - self.startY);

			var target = self.target;
			var topY = self.top + self.offsetY;

			if (topY <= self.scale && topY >= self.scale*2 - self.max) {
				target.css('top', topY);
			}
		}

		modal.onSubmit = function(){
			var current = self.region.current;
			var addressCode = [];
			var addressValue = [];

			addressCode.push(current['levelOne']['code']);
			addressCode.push(current['levelTwo']['code']);
			addressCode.push(current['levelThree']['code']);

			addressValue.push(current['levelOne']['name']);
			addressValue.push(current['levelTwo']['name']);
			addressValue.push(current['levelThree']['name']);

			store.register.set('addressCode', addressCode.join(','));
			modal.parent.addressCode = addressCode.join(',');
			modal.parent.newAddressCode = addressCode.join(',');
			modal.parent.addressValue = addressValue.join(',');
			modal.parent.addressValueWithoutSep = addressValue.join('');
			modal.parent.update();
			modal.root.close();
		}
	</script>
</address-select>
