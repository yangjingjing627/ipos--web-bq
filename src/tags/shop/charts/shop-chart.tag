<shop-chart>
	<div class="shop-chart">
	<div class="dataTitle">
		<p>
			<a class="{ active: active}" each={ dataTitle } onclick={ dataDetail }>{ title }</a>
		</p>
	</div>
	<div class="data-item">

	<div class="store-data data-con" if="{ showData }">
		<div class="chart-top"><div class="chart-dater"><daterangepicker></daterangepicker></div></div>
			<div class="chart-content">
				<div style="width: 100%;height:100%;background: #fff;">
					<div id="main" style="width: 100%;height:100%;"></div>
				</div>
			</div>
	</div>
	<div class="employee-data data-con" if="{ !showData }">
		<!-- 员工数据 -->
		<employee-data></employee-data>
	</div>
</div>

	</div>
	<script>
		var self = this;
		self.showData = true;
		// self.showEmployee = false;
		self.dataTitle = [{'title':'店铺数据','active':true},{'title':'员工数据','active':false}]
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
		self.dateChart = function(data){
			var myChart = echarts.init($('#main')[0]);
    		self.data = data;
    		self.storeName = data.storeName;
    		var xdata = self.data.title;
            var maxHeight = self.data.maxHeight;
            var seriesData = [];//c6d4ee,dae3f3
            var colorList = ['#aac6f8','#9d9d9d','#488fd1','#e96409','#ff7f50','#87cefa','#da70d6','#32cd32','#6495ed',
                             '#ff69b4','#ba55d3'];
			var legendData = [];
			for(var i=0;i<self.data.charts.length;i++){
   			    var seriesList={};
                var itemStyle = {normal: {
		                label: {
		                    show: true,
		                    position: 'top',
		                    textStyle : {
										fontSize : '12',
										color:'#666'
									}
		                }
		            }
	       	 	};
				var charts = self.data.charts[i];
				legendData.push(self.data.charts[i].name);
				seriesList.name = self.data.charts[i].name;
				seriesList.type = self.data.charts[i].type;
				seriesList.data = self.data.charts[i].data;
				seriesList.itemStyle = itemStyle;
				if(self.data.charts[i].type == "bar"){
					seriesList.barWidth = 30;
				}
				seriesList.itemStyle.normal.color = colorList[i];
				if(self.data.charts.length >5 ){
					seriesList.itemStyle.normal.label.show = false;
				}
				seriesData.push(seriesList);
			}
            // 指定图表的配置项和数据#488fd1

    		var option = {
    			title: {
    			    text: self.storeName,
    			    x: 'center',
    		        textStyle: {
    		            fontSize: 18,
    		            fontWeight: 'bolder',
    		            color: '#333'
    		        }
    			},
    			tooltip: {
    			    trigger: 'axis'
    			},
    			legend: {
    			    data:legendData,
    			    x: 'right'
    			},

    			grid: {
    			    borderWidth: 0,
    			    containLabel: true
    			},
    			xAxis: {
    			    boundaryGap: true,
    			    type : 'category',
    			    splitLine: {show:false},
    			    data: xdata,
    			    axisLabel:{
    			                 textStyle:{
    			                     color:"#666"
    			                 }
    			             }

    			},
    			yAxis: {
    			        type: 'value',
    			        scale: true,
    			        name: '金额',
    			        max: maxHeight,
    			        min: 0,
    			        boundaryGap: [0.2, 0.2],
	    			    axisLabel:{
			                 textStyle:{
			                     color:"#666"
			                 }
	             }

    			},
    			series: seriesData
    		};
        	myChart.setOption(option);
		}
        // 改变日期
     	self.on('dateChange', function() {
			var date = $(self.root).find('#daterange').val();
			var beginDate = date.split("~")[0];
			console.log(beginDate);
			var endDate = date.split("~")[1];
			var param = {beginDate:beginDate,endDate:endDate,storeId:8};
			store.dataDashboard.get(param,function(date){self.dateChart(date)});
		});

        // 使用刚指定的配置项和数据显示图表。
		self.on('mount', function() {
        	store.dataDashboard.get({},function(date){self.dateChart(date)});

		});
	</script>
</shop-chart>
