<order-history>
	<div class="order-index">
		<div class="calendar-bar">
			<span class="prev-day"  onclick="{ prevDay }">前一天</span>
			<date-picker></date-picker>
			<span class="next-day" onclick="{ nextDay }">后一天</span>
		</div>
		<div class="order-tag">
			<ul>
				<li onclick={ orderList } status={ status } each= { order } class={ active:active }>{ statusStr }</li>
			</ul>
		</div>
		<div class="order-content">
			<div class="order-left { empty:!orderHistory.list.length }" id="hisorderList">
				<div class="order-list  { active:active }" each={ orderHistory.list } onclick={ list } >
					<div class="title">下单时间：<i class="f22-r">{ createTime }</i></div>
					<div class="info">
						<ul>
							<li>订单号：{ code }</li>
							<li>收货人：{ addrUserName }</li>
							<li>收货电话：{ addrUserMobile }</li>
							<li>收货地址：{ addrInfo }</li>
							<li>配送时间：{ postTime }</li>
						</ul>
					</div>
					<div class="title">金额：<i class="f22-r">￥{ payPrice }</i><i class="pad-tot">共计{ totalCount }件</i></div>
				</div>
			</div>
			<div class="order-right">
				<div class="order-list  { order-no-button: (detail.status==4) }" style="display:none">
				<div class="title text-c">在线订单(<i class="f22-r">{ detail.code }</i>)
					<div class="order-print" onclick={ orderPrint }></div>
				</div>
				<div class="o-d-con">
					<div class="title">商品明细</div>
					<div class="info">
						<ul>
							<li each = { detail.goods }>{ goodsName }<div class="amount price">X{ goodsCount }</div><div class="price">￥{ buyTotalPrice }</div></li>
						</ul>
					</div>
					<div class="info">
						<ul>
							<li>配送费：<div class="price">￥{ detail.postPrice }</div></li>
							<li class="coupon" if={ detail.couponAmount }>优惠券：<div class="price">－¥{ detail.couponAmount }</div></li>
							<li>总计：<div class="price">￥{ detail.payPrice }</div></li>
						</ul>
					</div>
					<div class="title">配送明细</div>
					<div class="info border-none">
						<ul>
							<li>订单状态：{ detail.statusStr }</li>
							<li if={ detail.cancelUserName }>取消人：{ detail.cancelUserName }</li>
							<li if={ detail.cancelReason }>取消原因：{ detail.cancelReason }</li>
							<li>下单时间：{ detail.createTime }</li>
							<li>收货人：{ detail.addrUserName }</li>
							<li>收电话：{ detail.addrUserMobile }</li>
							<li>收货地址：{ detail.addrInfo }</li>
							<li>配送时间：{ detail.postTime }</li>
							<li>买家留言：{ detail.remark }</li>
						</ul>
					</div>
				</div>
				<div class="button">
					<a class="cancel" onclick={ cancel } if={ detail.status ==  3 }>设为无效</a>
					<input type="hidden" id = "orderId" value="{ detail.orderId }"/>
				</div>
				</div>
			</div>
		</div>
	</div>
	<script>
		var self = this;
		self.size = 5;
		self.status = 3;
		self.getDateStr = function(time) {
			return utils.getDateStr(time);
		}

     	orderPrint(){
     		store.printOrderDetail.get(self.detail);
     	}

		self.nextDay = function() {
			$(self.root).find('date-picker')[0].nextDay();
		}

		self.prevDay = function() {
			$(self.root).find('date-picker')[0].prevDay();
		}

        self.init = function(){
        	if(!self.targetTime){
	        	var date = self.getDateStr(new Date().getTime());
	        	self.targetTime = date;
        	}
        	self.page = 1;
        	if(!self.status){
        		self.status = 3;
        	}
    	    flux.bind.call(self, {
    	        name: 'orderHistory',
    	        store: store.orderHistory,
    	        refresh: true,
    	        params: {page:1,size:self.size,status:self.status,targetTime:self.targetTime},
    	        success: function () {
    	        	if(self.orderHistory.list && self.orderHistory.list.length>0){
    	        		self.orderHistory.list[0].active = true;
    		            self.detail = self.orderHistory.list[0];
    		            self.total = self.orderHistory.total;
    		            $(".order-list").show();
    	        	}else{
    	        		$(".order-list").hide();
    	        	}
    	            self.update();
    	        }
    	    });
        }

		cancel(e){   //无效
			var refuse = $("<order-invalid></order-invalid>");
            $("order-history").append(refuse);
			riot.mount("order-invalid");
		}

     	self.orderListAll = function(){
			var param = {page:1,size:self.size,status:self.status,targetTime:self.targetTime};
			store.orderHistory.get(param,function(data){
				self.total = data.total;
				self.page = data.page;
			});
			self.update();
     	}

		orderList(e){
			if(e.item.active == false){
				for(var i=0;i<self.order.length; i++){
					self.order[i].active = false;
				}
				e.item.active = true;
				var status = e.item.status;
				self.status = status;
				self.update();
				self.orderListAll();
			}
		}

		list(e){
			for(var i=0;i<self.orderHistory.list.length; i++){
				self.orderHistory.list[i].active = false;
			}
			e.item.active = true;
			self.detail = e.item;
			self.update();
		}

		self.on('mount', function() {
			self.order=[
			             {status:3,statusStr:"已完成",active:true},
			             {status:4,statusStr:"无效订单",active:false}

				]
			self.update();
        	self.init();
        	self.nextPage();
		});

        // 改变日期
     	self.on('dateChange', function() {
			var date = $(self.root).find('date-picker')[0].value;
			self.targetTime = date;
			self.init();
		});

		self.nextPage = function(){
		       var curPage = 1;
		 		$("#hisorderList").scroll(function () {
		 			if(curPage == 1){
		 				self.listWrap = $('#hisorderList')[0];

	                    var clientHeight = self.listWrap.clientHeight;
	                    var scrollTop = self.listWrap.scrollTop;

		 				if((clientHeight + scrollTop) > self.listWrap.scrollHeight - 20){
		 					if(!self.page){
		 						self.page = 1;
		 					}
		 					if(!self.status){
		 						self.status = 3;
		 					}
		 					if(self.page < (self.total/self.size)){
		 						curPage=2;
		 						var param ={ page:self.page+1,size:self.size,status:self.status,targetTime:self.targetTime};
		 						store.orderHistory.getMore(param,function(data){
		 							self.page = data.page;
		 							self.update();
		 							curPage=1;
		 						});
		 					}
		 				}
		 			}
		 		});
			}

	</script>
</order-history>
