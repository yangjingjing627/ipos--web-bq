<date-picker>
	<div class="date-picker">{ value }</div>
	<input type="{ type }" name="{ name }" onchange="{ changeValue }" max="{ max }" min="{ min }" defaultValue="{ defaultValue }">

	<script>
		var self = this;
		var root = self.root;
		// console.log(root);
		self.getDateStr = function(time) {
			return utils.getDateStr(time);
		}

		self.init = function() {
			self.type = root.getAttribute('type') || 'date';
			self.name = root.getAttribute('name');
			self.defaultValue = root.getAttribute('defaultValue');
			self.max = root.getAttribute('max');
			self.min = root.getAttribute('min');
			if (self.type === 'date') {
				self.root.value = self.value = root.getAttribute('value') || self.getDateStr(new Date().getTime());
			}
			else if (self.type === 'time') {
				self.root.value = self.value = root.getAttribute('value') || '00:00';
			}
			self.update();
			self.trigger('gotDate');
			self.parent.trigger('gotDate');
		}

		self.on('mount', function() {
			self.init();
		});

		self.changeValue = function() {
			self.root.value = self.value = root.getElementsByTagName('input')[0].value;
			if (self.type === 'date' && !self.value) {
				self.root.value = self.value = self.getDateStr(new Date().getTime());
			}
			else if (self.type === 'time' && !self.value) {
				self.root.value = self.value = '00:00';
			}
			self.parent.trigger('dateChange');
			self.trigger('dateChange');
		}

		self.root.setValue = function(value) {
			root.getElementsByTagName('input')[0].value = value;
			self.changeValue();
		}

		self.root.setTime = function(time) {
			var value = self.getDateStr(time);
			root.getElementsByTagName('input')[0].value = value;
			self.changeValue();
		}

		self.dateString = function(date) {
			var Y = date.getFullYear();
			var M = date.getMonth() + 1;
			M = M < 10 ? ('0' + M)  : M;
			var D = date.getDate();
			D = D < 10 ? ('0' + D) : D;
			return Y + "-" + M + "-" + D;
		}

		self.root.nextDay = function(cb) {
			var str = self.value.replace(/-/g,"/");
			var timestamp = new Date(str).getTime() + 1000 * 60 * 60 *24;
			var date = new Date(timestamp);
			var newStr = self.dateString(date);
			root.getElementsByTagName('input')[0].value = newStr;
			self.changeValue();
			cb && cb(newStr);
		}

		self.root.prevDay = function(cb) {
			var str = self.value.replace(/-/g,"/");
			// console.log(str);
			var timestamp = new Date(str).getTime() - 1000 * 60 * 60 *24;
			// console.log(timestamp);
			var date = new Date(timestamp);
			var newStr = self.dateString(date);
			root.getElementsByTagName('input')[0].value = newStr;
			self.changeValue();
			cb && cb(newStr);
		}

		self.root.get = function() {
			return root.getElementsByTagName('input')[0].value;
		}

	</script>

</date-picker>
