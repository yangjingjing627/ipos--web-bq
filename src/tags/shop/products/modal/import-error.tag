<import-error>
	<div class="import-error">
		<div class="title">Excel表格数据有误，导入失败</div>
		<div class="info">详情</div>
		<ul class="error-ul">
			<li each={ i in error }>{ i }</li>
		</ul>
	</div>
	<script>
		var self = this;
		var modal = self.parent;

		modal.onOpen = function (params) {
			var mgs = params;
			if (mgs.indexOf(';') > -1) {
				var errormgs = mgs.split(';');
				self.error = errormgs;
			}else {
				self.error=[];
				self.error.push(params);
			}
			self.update();
		}

		modal.onClose = function () {
			self.error=[];
			self.update();
		}
		self.on('mount', function () {});
	</script>
</import-error>
