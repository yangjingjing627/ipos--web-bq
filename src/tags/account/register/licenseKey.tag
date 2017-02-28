<license-key>
  <div id="login-wrap">
		<a class="back" onclick="{ goback }">返回</a>
		<div class="setting"></div>
		<form class="register license-code">
			<h4>填写激活码</h4>
			<input  type="text" id="license-code" name="phone" maxlength="8" placeholder="激活码" />
			<button onclick={ submit }>下一步</button>
		</form>
	</div>
  <script type="text/javascript">
  var self = this;
  self.licenseCode = true;
  self.submit = function (e) {
    e.preventDefault();
    self.licenseCode = $('#license-code').val() ? true : false;
    if(!self.licenseCode){
      utils.toast("请填写正确的激活码");
      return;
    }else{
      var license = $('#license-code').val();
      httpGet({
        url: api.cdkey,
        params: {
					cdkey: license
				},
        success: function(res) {
            location.hash = '#/register?cdkey='+license;
        }
      });
    }
  }
  self.goback = function() {
    utils.androidBridge(api.goLogin)
  }
  </script>
</license-key>
