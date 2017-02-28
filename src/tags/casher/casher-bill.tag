<casher-bill>
	<div class="white-box bill">
		<div class="list" each={ bill } onclick={ reviewBill(tbId) }>
			<div class="time"><span>{ time }</span></div>
			<ul>
				<!-- <li each={ goods } class="bill-goods-list">{ goodsName || '无码商品' } <span class="bill-quantity">{ quantity }</span></li> -->
				<li each={ goods } class="bill-goods-list">{ goodsName || '无码商品' } <span class="bill-quantity">{ weight }</span></li>
				<li class="more" if={ goods.more }>......</li>
			</ul>
		</div>
	</div>
	<script>
		var self = this;

		flux.bind.call(self, {
			name: 'bill',
			store: store.bill,
			success: function () {
				for (var i in self.bill){
					var date = new Date(self.bill[i].creationDate);
					self.bill[i].time = date.getHours() + ':' + date.getMinutes();
					if ( self.bill[i].goods.length > 5){
						self.bill[i].goods.length = 5;
						self.bill[i].goods.more = true;
					}
				}
				self.update();
			}
		});

		self.reviewBill = function(id){
			return function(){
				store.bill.take({tbId: id});
			}
		};

	</script>
</casher-bill>
