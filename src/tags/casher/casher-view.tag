<casher-view>
	<casher-bill if={ bill }></casher-bill>
	<casher-detail if={ detail }></casher-detail>
	<script>
		var self = this;
		flux.bind.call(self, {
			name: 'detail',
			store: store.detail,
			success: function () {
				self.update();
			}
		});

		flux.bind.call(self, {
			name: 'bill',
			store: store.bill,
			success: function () {
				self.update();
			}
		});
	</script>
</casher-view>
