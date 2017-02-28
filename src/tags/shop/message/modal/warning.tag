<warning>
	<div class="warning" id="login-warning" style="display:none">
		<h2>提示</h2>
		<p>{ opts.msg }</p>
		<a class="red-box" onclick="{ close }">知道了</a>
	</div>

	<script>
		var self = this;

		self.root.open = function(){
			self.update();
			$('#login-warning').show();
		}

		self.close = self.root.close = function(){
			$('#login-warning').hide();
		}

		self.parent.on('update', function(){
			self.opts = self.opts ? self.opts.opts : {};
		});
	</script>
</warning>
