<employee>
    <!-- 暂时不显示 -->
	<!-- <div class="leader">
		<h3>店长账户管理</h3>
		<ul class="employee-list">
			<li class="employee-item" if="{!masters || !master.length}">
				<form>
					<label>
					手机号：
						<input type="number">
					</label>
					<label>
					密码：
						<input type="passport" placeholder="密码必须大于6位">
					</label>
					<input name="type" type="hidden" value="1">
					<button onclick="{ save }">保存</button>
				</form>
			</li>

			<li class="employee-item" each="{ masters }">
				<form>
					<label>
					手机号：
						<input type="number" value="{ mobile }">
					</label>
					<label>
					密码：
						<input type="passport" placeholder="密码必须大于6位">
					</label>
					<input name="type" type="hidden" value="1">
					<button onclick="{ save }">保存</button>
				</form>
			</li>
			<div class="clearfix"></div>
		</ul>
	</div> -->
	<div class="shop-chart">
	<div class="dataTitle" style="height:50px;width:100%;background-color:#fff;">
		<p style="display:flex;height:100%;width:260px;margin:0 auto;">
			<a style="height:100%;flex:1;text-align:center;display:block;font-size:24px;line-height:50px;" class="{ active-shift: active}" each={ dataTitle } onclick={ dataDetail }>{ title }</a>
		</p>
	</div>
	<div class="data-item">

	<div class="store-data data-con data-con-l" if="{ showData }">
		<div class="employee">
			<h3>店员账户管理</h3>

			<ul class="employee-list">
				<li class="add-employee" onclick="{ openModal('create-employee') }">
					<div>
						<img src="imgs/add.png">
						<p>添加员工</p>
					</div>
				</li>
				<li class="employee-item" each="{ slaves }">
					<form>
						<input type="hidden" name="userId" value="{ userId }">
						<label>
							姓名：
							<input type="text" name="personName" value="{ personName }">
						</label>
						<label>
						账户：
							<input type="text" name="username" value="{ username }" placeholder="">
						</label>
						<label>
						密码：
							<input type="passport" name="password" placeholder="**********">
						</label>
						<label>
						电话：
							<input type="tel" name="mobile" value="{ mobile }">
						</label>
						<input type="hidden" name="type" value="2">
						<!-- 本期没有角色管理功能  -->
						<!-- <label>
						角色：
							<select>
								<option>收银员</option>
								<option>经理</option>
							</select>
							<span class="select-btn" onclick="{ openSelect }"></span>
						</label> -->
						<a class="delete" onclick="{ delete }">删除</a>
						<a onclick="{ save }">保存</a>
					</form>
				</li>

				<div class="clearfix"></div>
			</ul>
		</div>

	</div>
	<div class="employee-data data-con" if="{ !showData }">
		<!-- 员工数据 -->
		<employee-data></employee-data>
	</div>
	</div>

	</div>
<!--  -->


	<modal modal-width="5rem" modal-height="" small id="create-employee" title="添加员工">
        <create-employee></create-employee>
    </modal>

	<script>
		var self = this;
		self.showData = true;
		// self.showEmployee = false;
		self.dataTitle = [{'title':'员工管理','active':true},{'title':'员工数据','active':false}]
		self.dataDetail = function(e) {
		for (var i = 0; i < self.dataTitle.length; i++) {
			self.dataTitle[i].active = false;
		}
		e.item.active = true;
		var _index = $(e.target).index(); //object对象转换为dom;
		if(_index == 0) {
			self.showData = true;
		}else if(_index == 1){
			self.showData = false;
		}
		}
        //防止值为空的时候出现[object HTMLInputElement]
        self.personName = ''
        self.mobile = ''
        self.password = ''
        self.username = ''


		openModal(id) {
            return function(e) {
                var item = e.item;
                $('#' + id)[0].open(item);
								console.log($('#' + id)[0]);
            }
        }

        self.init = function() {
        	flux.bind.call(self, {
        		name: 'employees',
        		store: store.employee,
        		success: function() {
        			self.masters = [];
        			self.slaves = [];

        			self.employees.forEach(function(item) {
        				if (item.type === 1) {
        					self.masters.push(item);
        				}
        				else if (item.type === 2) {
        					self.slaves.push(item);
        				}
        			});
        			self.update();
        		}
        	});
        }

		self.countHeight = function() {
			var height = $('.employee .employee-item').css('height');
			$('.add-employee').css('height', height);
		}

		self.openSelect = function(e) {
			var evt = document.createEvent("MouseEvents");
            var dom = $(e.target.parentNode).find('select')[0];
            evt.initEvent("mousedown", true, true);
            if (dom) {
                dom.dispatchEvent(evt);
            }
		}

		self.save = function(e) {
			var form = e.target.parentNode;
			var params = $(form).serializeObject();
			if(!(params.personName && params.personName.length>1 && params.personName.length<10)){
				alert("请输入正确的员工姓名");
				return;
			}
			if(!(params.username && /^[0-9a-zA-Z]{6,12}$/g.test(params.username))){
				alert("账号必须为6-12位字母或数字混合");
				return;
			}
			if(!(params.mobile=="") && !/^(\+86)?((([0-9]{3,4}-)?[0-9]{7,8})|(1[3578][0-9]{9})|([0-9]{11,20}))$/.test(params.mobile)){
				alert("电话格式不正确");
				return;
			}
			store.employee.update(params);
		}

		self.delete = function(e) {
			console.log('---确认删除员工-----');
			var id = e.item.userId;
			var name = e.item.personName || e.item.username;
			if (confirm("确认删除员工" + name + "么？")) {
				store.employee.delete({userId: id});
			}
		}

		self.on('mount', function() {
			self.init();
			self.countHeight();
		})

	</script>

</employee>
