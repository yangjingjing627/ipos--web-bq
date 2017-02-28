<casher-refund>
	<div class="content-wrap">
		<div class="cart">
			<casher-cart></casher-cart>
			<div class="actions">
				<span onclick={ cancelRefund }>取消退货</span>
			</div>
		</div>
		<div class="borad">
			<div id="casher-view"></div>
			<div class="balance-btn">
				<a onclick={ goCheck } class={ disable:!cart.list.length }>确认退货</a>
			</div>
		</div>
	</div>
	<script>
		var self = this;

		flux.bind.call(self, {
			name: 'cart',
			store: store.cart,
			success: function () {
			}
		});

		self.cancelRefund = function(){
			store.cart.clear();
			location.hash = '#/casher/index';
		};

		self.goCheck = function(){
			if (self.cart.list.length > 0) {
				location.hash = '#/casher/refund-balance';
			} else {
				return ;
			}
		}

		self.on('mount', function(){
			store.cart.setState('refunding');
		});
	</script>
</casher-refund>
