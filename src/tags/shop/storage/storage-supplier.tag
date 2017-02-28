<storage-supplier>
	<div class="supplier">
		<div class="supplier-list" each = { supplierList }>
			<div class="input">
				<label>名称:</label>
				<input type="text" value="{ supplierName }"  class="name" maxlength="20"/>
			</div>
			<div class="input">
				<label>电话:</label>
				<input type="text" value="{ tel }"  class="phone" maxlength="20"/>
			</div>
			<div class="button">
				<div class="fl-left ">
					<a class="cancel" onclick= { deleteSupplier }>删除</a>
				</div>
				<div class="fl-right">
					<a class="sure" onclick={ saveSupplier }>保存</a>
				</div>
				<div class="clear"></div>
			</div>
		</div>
		<div class="supplier-list add addSupplier">
			<div class="input">
				<label>名称:</label>
				<input type="text" class="name" maxlength="20"/>
			</div>
			<div class="input">
				<label>电话:</label>
				<input type="text" class="phone" maxlength="20"/>
			</div>
			<div class="button">
				<div class="fl-left ">
					<a class="cancel" onclick= { cancel }>取消</a>
				</div>
				<div class="fl-right">
					<a class="sure" onclick={ addSaveSupplier }>添加</a>
				</div>
				<div class="clear"></div>
			</div>
		</div>
		<div class="supplier-list addSupplier" onclick = { addSupplier } >
			<div class="add"></div>
			<div class="info">添加供应商</div>
		</div>
		<modal id="supplier-warning" modal-width="200px" modal-height="80px" nofooter>
			<p class="warning-text">{ parent.warningText }</p>
		</modal>
	</div>
	<script>
		var self = this;

		self.addSupplier = self.cancel = function(){
			$(".addSupplier").toggleClass("add");
		}

		function warning(text){
			var layer = $('#supplier-warning')[0];

			self.warningText = text;
			self.update();

			layer.open();
			setTimeout(function(){
				layer.close();
			}, 1000);
		}
		deleteSupplier(e){
			var param = { supplierId:e.item.supplierId };
		 	if(confirm("确定删除吗？")){
				store.supplierDel.get(param,function(data){
					$(e.target).parent().parent().parent().remove();
				});
		    }
		}
		addSaveSupplier(e){
			var param = {};
			if(e.item && e.item.supplierId){
				param.supplierId = e.item.supplierId;
			}
			param.name = $(e.target).parent().parent().parent().find(".name").val();
			param.tel = $(e.target).parent().parent().parent().find(".phone").val();
			if(!param.name){
				warning('请填写供货商名称');
				return;
			}
			if(!/^(\+86)?((([0-9]{3,4}-)?[0-9]{7,8})|(1[3578][0-9]{9})|([0-9]{11,20}))$/.test(param.tel)){
				warning('请填写正确供货商电话');
				return;
			}
			store.supplierAddOrUpdate.get(param,function(data){
				var suppList = [];
				suppList.push(data);
				self.supplierList = self.supplierList.concat(suppList);
				$(".addSupplier").toggleClass("add");
				$(e.target).parent().parent().parent().find(".name").val("");
				$(e.target).parent().parent().parent().find(".phone").val("");
				warning("添加成功");
				self.update();
			});
		}
		saveSupplier(e){
			var param = {};
			if(e.item && e.item.supplierId){
				param.supplierId = e.item.supplierId;
			}
			param.name = $(e.target).parent().parent().parent().find(".name").val();
			param.tel = $(e.target).parent().parent().parent().find(".phone").val();
			if(!param.name){
				warning('请填写供货商名称');
				return;
			}
			if(!/^(\+86)?((([0-9]{3,4}-)?[0-9]{7,8})|(1[3578][0-9]{9})|([0-9]{11,20}))$/.test(param.tel)){
				warning('请填写正确供货商电话');
				return;
			}
			store.supplierAddOrUpdate.get(param,function(data){
				warning("修改成功");
				self.update();
			});
		}
	    flux.bind.call(self, {
	        name: 'supplierList',
	        store: store.supplierList,
	        params: {},
	        success: function () {
	            self.update();
	        }
	    });
	</script>
</storage-supplier>