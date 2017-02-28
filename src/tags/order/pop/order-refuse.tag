<order-refuse>
	<div class="coverLayer"></div>
	<div class="popwin refuse">
		<div class="refuse-t">
			请选择拒绝订单原因
		</div>
		<div class="refuse-reason">
			<ul>
				<li onclick = { selectReason }  class="active">没货</li>
				<li onclick = { selectReason }>地址太远，不送</li>
				<li onclick = { selectReason }>人员不够，送不了</li>
				<li onclick = { selectReason }>没时间，送不了</li>
				<li onclick = { selectReason }>收货人不要了</li>
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
    		$("order-refuse").remove();
    	}
    	determine(){
    		var param = {};
    		param.reason = $(".refuse-reason ul li.active").text();
    		if($(".active").attr("other") == "other"){
    			param.reason = $("#inputReason").val();
    		}
    		param.orderId = $("#orderId").val();
    		store.orderRefuse.get(param,function(){
    			window.dispatchEvent(new Event('orderNumChange'));
//     			globleEvents.trigger('orderNumChange');
    			$("order-refuse").remove();
					utils.androidBridge(api.updateNum)
    		});
    	}
    	selectReason(e){
    		if(!$(e.target).is(".active")){
    			$(".refuse-reason ul li").removeClass("active");
    			$(e.target).addClass("active");
    		}
    	}
    </script>
</order-refuse>
