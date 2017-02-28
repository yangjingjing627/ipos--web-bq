<import-custom>
	<div class="import-wraper">
		<div class="step">
			<p>插入U盘，下载Excel模板至U盘</p>
			<img src="imgs/udisk.png">
			<button class="download-tpl">
				<a onclick={ download } target=_top>点击下载</a>
			</button>
		</div>

		<div class="step">
			<p>在电脑端按照模板添加商品</p>
			<img src="imgs/computer.png">
			<button class="add-goods">添加商品</button>
		</div>

		<div class="step">
			<p>将制作好的Excel表导入</p>
			<img src="imgs/import-img.png">
			<button class="import-excel">点击导入</button>
		</div>

		<div class="clearfix"></div>
	</div>
	<div class="import-text">
		<span class="title">提示：</span>
		<span class="info">1.一次导入表格里的商品数量最多500条</span>
		<span class="info">2.表格中商品若和店铺现有商品冲突，会覆盖现有商品</span>
		<span class="info">3.商品条码不填则自动生成13位条码</span>
		<span class="info">4.表格中多个条码重复商品，取第一条数据</span>

	</div>
	<modal modal-width="" modal-height="" delete id="import-error" title="导入失败" nofooter buttonOk>
		<import-error></import-error>
	</modal>
	<modal modal-width="" modal-height="" delete id="import-loading" title="导入进度" nofooter>
		<import-loading></import-loading>
	</modal>
	<script>
		var self = this;

		self.on('mount', function () {
			console.log("---------SimpleUpload-----------------");
			new uploader.SimpleUpload({
				button: $('.import-excel')[0], // file upload button
				url: api.goodImport, // server side handler
				name: 'uploadFile', // upload parameter name
				responseType: 'json',
				debug: true,
				allowedExtensions:["xls","xlsx","xlsm"],
				maxSize:512,
				onChange: function (filename, extension, uploadBtn, fileSize, file) {
					console.log("-------------" + filename);
				},
				onSubmit: function (filename, extension) {
					console.log("---------import-loading-------------------");
					$("#import-loading")[0].open();
				},
				onComplete: function (filename, response) {
					if (parseInt(response.code, 10) === 1) {
						utils.toast('上传成功');
						$(".loading-text").text("正在同步商品");
						var param = {
							name: "Goods",
							noloadShow: true
						}
						store.synTask.get(param, function (success) {
							if (success) {
								console.log('------' + JSON.stringify(param));
								$("#import-loading")[0].close();
								utils.toast('同步成功');
								store.loadTopGoodsList = true;
							}
						});
					} else if (parseInt(response.code, 10) !== 1 && response.msg) {
						// utils.toast(response.msg);
						$("#import-loading")[0].close();
						$("#import-error")[0].open(response.msg);
					} else {
						$("#import-loading")[0].close();
						utils.toast('上传失败');
					}
				},
				onExtError:function(filename, extension){
//					console.log(extension);
					utils.toast('文件类型不正确');
				},
				onSizeError:function( filename, fileSize ){
					utils.toast('文件最大为512kb');
				},
				onError: function (filename, errorType, status, statusText, response, uploadBtn, fileSize) {
					$("#import-loading")[0].close();
					utils.toast('上传失败');
				}
			});
		});

		download(e) {
			store.importTemplate.get(function (data) {
				if (data && data.url) {
					store.downTemplateExcel.get({url: data.url});
				} else {
					utils.toast("暂无可用模版");
				}

			});
		}

		self.on('unmount', function () {});
	</script>
</import-custom>
