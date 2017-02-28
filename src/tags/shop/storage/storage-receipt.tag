<storage-receipt>
	<div class="storage-receipt">
		<div class="calendar-bar">
			<div class="chart-dater"><daterangepicker></daterangepicker></div>
		</div>
		<div class="receipt-content">
			<div class="receipt-left">
				<div class="re-top">
					<a class={ active:active } each = { tag } onclick={ stockList }>{ name }</a>
				</div>
				<div class="re-content" id = "storReceipt">
					<div class="re-pro" if={ stockListByDate.list.length>0 }>
						<div class="re-pro-list { active:active }"  each = { stockListByDate.list } onclick = { stockInfo }>
							<div class="re-li">
								<span class="fl-left supplier-name" if={ type==1 } >入库单</span>
								<span class="fl-left supplier-name" if={ type==2 }>出库单</span>
								<span class="fl-right">{ stockSn }</span>
								<span class="clear"></span>
							</div>
							<div class="re-li">
								<span class="fl-left">{ supplierName }</span>
								<span class="fl-right">{ creationDate }</span>
								<span class="clear"></span>
							</div>
							<div class="re-li">
								<span class="fl-left">共<i>{ categoryNum }</i>款   <i>{weight}</i>件</span>
								<span class="fl-right price">￥ { amount }</span>
								<span class="clear"></span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="receipt-right">
			<div class="receipt-pro-d" if={ stockListByDate.list.length>0 }>
				<div class="rpro-c">
					<div class="title" if={ goods.type == 1 }>进货单</div>
					<div class="title" if={ goods.type == 2 }>出货单</div>
					<div class="name">
						<span class="fl-left">供应商：{ goods.supplierName }</span>
						<span class="fl-right">{ goods.creationDate }</span>
						<span class="clear"></span>
					</div>
					<div class="name">单号：{ goods.stockSn }</div>
					<div class="table-div">
						<table>
							<tr>
								<td style="width:10%">项</td>
								<td style="width:60%">品名</td>
								<td style="width:10%">数量</td>
								<td style="width:10%">单价</td>
								<td style="width:10%">小计</td>
							</tr>
						</table>
					</div>
				</div>
				<div class="table-div table-content">
					<table>
						<tr each = { item in goods.list }>
							<td style="width:10%">{ goods.list.indexOf(item) + 1}</td>
							<td style="width:60%">{ item.goodsName }</td>
							<td style="width:10%">{ item.weight }</td>
							<td style="width:10%">{ item.purchasePrice }</td>
							<td style="width:10%">{ item.amount }</td>
						</tr>
					</table>
				</div>
				<div class="r-bottom">
					<div class="b-d">
						<span class="fl-left">总项：{ goods.item }</span>
						<span class="fl-right">总金额：<i>￥{ goods.amount }</i></span>
						<span class="clear"></span>
					</div>
					<div class="b-d">
						<span class="fl-left">总数：{ goods.weight }</span>
						<span class="clear"></span>
					</div>
				</div>
			</div>
		</div>
		<div class="clear"></div>
	</div>

	<script>
		var self = this;
		self.next = 0;
		self.type = 0;
		stockInfo(e){
			if($(e.currentTarget).is(".active")){
				return;
			}
			$(".re-pro-list").removeClass("active");
			$(e.currentTarget).addClass("active");
        	var p = {stockId:e.item.stockId,type:e.item.type};
        	store.stockGoodsList.get(p,function(data){
        		self.goods = data;
        		self.goods.item = e.item.categoryNum;
        		self.goods.amount = e.item.amount;
        		self.goods.quantity = e.item.quantity;
						self.goods.weight = e.item.weight;

        		self.update();
        	});
		}

	    stockList(e){
	    	if(e.item.active == true){
	    		return;
	    	}
	    	for(var i=0;i<self.tag.length;i++){
	    		self.tag[i].active = false;
	    	}
	    	self.type = e.item.type;
	    	e.item.active = true;
	    	var param = {type:e.item.type,next:0,startDate:self.startDate,endDate:self.endDate};
	    	store.stockListByDate.get(param);
	    }

	    self.on('mount', function() {
		    self.tag=[
		                  {"name":"全部","type":0,"active":true},
		                  {"name":"入库单","type":1,"active":false},
		                  {"name":"出库单","type":2,"active":false},
		                  ];
		    self.update();
		    self.init();
		    self.nextPage();
		});

		self.format = function(myDate){
			return myDate.getFullYear()+"-"+( ((myDate.getMonth()+1)<9)?("0"+(myDate.getMonth()+1)):(myDate.getMonth()+1))+"-"+((myDate.getDate()<9)?("0"+myDate.getDate()):myDate.getDate());
		}

		self.init = function(){
			var myDate = new Date();
			var endDate = self.format(myDate);
			myDate.setTime(myDate.getTime()-24*60*60*1000*7);
			var startDate = self.format(myDate);
			self.startDate = startDate;
			self.endDate = endDate;
		    flux.bind.call(self, {
		        name: 'stockListByDate',
		        store: store.stockListByDate,
		        refresh: true,
		        params: {type:self.type,next:self.next,startDate:startDate,endDate:endDate},
		        success: function () {
		            self.update();
		            if(self.stockListByDate.list && self.stockListByDate.list.length>0){
			        	self.stockListByDate.list[0].active = true;
		            	var stockId = self.stockListByDate.list[0].stockId;
		            	var type = self.stockListByDate.list[0].type;
		            	var p = {stockId:stockId,type:type};
		            	self.next = self.stockListByDate.next;
		            	store.stockGoodsList.get(p,function(data){
		            		self.goods = data;
		            		self.goods.item = self.stockListByDate.list[0].categoryNum;
		            		self.goods.amount = self.stockListByDate.list[0].amount;
		            		self.goods.quantity = self.stockListByDate.list[0].quantity;
										self.goods.weight = self.stockListByDate.list[0].weight;

		            		self.update();
		            	});
		            }else{
		            	self.goods = "";
		            	self.update();
		            }
		        }
		    });
		}

	    // 改变日期
	 	self.on('dateChange', function() {
			var date = $(self.root).find('#daterange').val();
			var startDate = date.split("~")[0].replace(/(^\s*)|(\s*$)/g, "");
			var endDate = date.split("~")[1].replace(/(^\s*)|(\s*$)/g, "");
			self.startDate = startDate;
			self.endDate = endDate;
			var param = {type:self.type,next:0,startDate:startDate,endDate:endDate};
			store.stockListByDate.get(param);
		});

 		self.nextPage = function(){
		       var curPage = 1;
		 		$("#storReceipt").scroll(function () {
		 			if(curPage == 1){
		 				self.listWrap = $('#storReceipt')[0];
	                    var clientHeight = self.listWrap.clientHeight;
	                    var scrollTop = self.listWrap.scrollTop;
		 				if((clientHeight + scrollTop) > self.listWrap.scrollHeight - 20){
		 					if(self.next){
		 						curPage=2;
		 						var param = {next:self.next,type:self.type,startDate:self.startDate,endDate:self.endDate};
		 						store.stockListByDate.getMore(param,function(next){
		 							self.next = next;
		 							self.update();
		 							curPage=1;
		 						});
		 					}
		 				}
		 			}
		 		});
			};
	</script>
</storage-receipt>
