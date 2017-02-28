<order-invalid>
	<div class="coverLayer"></div>
	<div class="popwin refuse">
		<div class="refuse-t">
			请选择设为无效原因
		</div>
		<div class="refuse-reason">
			<ul>
				<li onclick = { selectReason }  class="active">收货人退货</li>
				<li onclick = { selectReason }>订单信息有误</li>
				<li onclick = { selectReason } other = "other">其他</li>
				<div class="input-reason"><input type="text" id="inputReason"/></div>
			</ul>
			<div class="button">
				<div class="fl-left reason"><a class="cancel" onclick = { closeWin }>取消</a></div>
				<div class="fl-right reason"><a class="sure" onclick = { determine }>确定</a></div>
			</div>
		</div>
	</div>
    <script>
    	var self = this;
    	closeWin(){
    		$("order-invalid").remove();
    	}
    	determine(){
    		var param = {};
    		param.reason = $(".refuse-reason ul li.active").text();
    		if($(".refuse-reason ul li.active").attr("other") == "other"){
    			param.reason = $("#inputReason").val();
    		}
    		param.orderId = $("#orderId").val();
    		param.userId = 6;
    		store.orderInvalid.get(param,function(){
    			window.dispatchEvent(new Event('orderNumChange'));
//     			globleEvents.trigger('orderNumChange');
    			$("order-invalid").remove();
					httpGet({
							// url: Icommon.syn,
							url: api.synTask,
							params: {name: "StoreOrder"},
							success: function(res) {

							},
					});
    		});


    	}
    	selectReason(e){
    		if(!$(e.target).is(".active")){
    			$(".refuse-reason ul li").removeClass("active");
    			$(e.target).addClass("active");
    		}
    	}
    </script>
</order-invalid>
