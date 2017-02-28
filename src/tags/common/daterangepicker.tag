<daterangepicker>
			<div class="daterange">
				<input id="daterange" value=""  readonly="readonly" type="text">
			</div>
	<style>
	.daterangepicker.dropdown-menu {
		max-width:none;
		z-index:30;
		padding-bottom:100px;
		border-left:1px solid #f1f1f1;
		border-right:1px solid #f1f1f1;
		border-bottom:1px solid #f1f1f1;
		border-radius:5px;
		display: none;
	}
	.daterangepicker .applyBtn{
		position: absolute;
		bottom:26px;
		width:250px;
		height: 50px;
		line-height: 50px;
		text-align: center;
		color: #fff;
		font-size: 18px;
		background: #fe5f5f;
		border:0;
		left:50%;
		margin-left: -125px;
		border-radius:5px;
	}
	.table-condensed thead tr:first-child{
		border-bottom:1px solid #ccc;
	}
	.daterangepicker .left .table-condensed tr td:last-child{
	    padding-right: 10px;
	    min-width: 60px;
	    border-right: 1px solid #ccc;
	}
	.daterangepicker .left .table-condensed tr:last-child th:last-child{
	    padding-right: 10px;
	    min-width: 60px;
	    border-right: 1px solid #ccc;
	}
	.daterangepicker .right .table-condensed tr:last-child th:first-child{
	    padding-left: 10px;
	    min-width: 60px;
	}
	.daterangepicker .right .table-condensed tr td:first-child{
	    padding-left: 10px;
	    min-width: 60px;
	}
	.daterangepicker .left .table-condensed thead  tr:first-child th:first-child{
	    background: url(../imgs/nextno.png) no-repeat center;
	    background-size:13px;
	}
	.daterangepicker .left .table-condensed thead  tr:first-child th.available:first-child{
	    background: url(../imgs/back.png) no-repeat center;
	    background-size:13px;
	}
	.daterangepicker .right .table-condensed thead  tr:first-child th:last-child{
	    background: url(../imgs/nextno.png) no-repeat center;
	    background-size:13px;
	    transform: rotate(180deg);
		-o-transform: rotate(180deg);
		-webkit-transform: rotate(180deg);
		-moz-transform: rotate(180deg);
	}
	.daterangepicker .right .table-condensed thead  tr:first-child th.available:last-child{
	    background: url(../imgs/back.png) no-repeat center;
	    background-size:13px;
	    transform: rotate(180deg);
		-o-transform: rotate(180deg);
		-webkit-transform: rotate(180deg);
		-moz-transform: rotate(180deg);
	}

	.daterangepicker .calendar.left{
		float: left;
	}
	.daterangepicker .calendar.right{
		float:right;
	}

	.daterangepicker .calendar{
		display:none;
	}
	.daterangepicker.show-calendar .calendar{
		display:block;
	}
	.daterangepicker .calendar.single .calendar-date{
		border:0;
	}
	.daterangepicker .calendar th,.daterangepicker .calendar td{
		font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
		white-space:nowrap;
		text-align:center;
		min-width:50px;
	    font-size: 16px;
	    color: #666;
	    line-height: 40px;
	}
	.daterangepicker .daterangepicker_start_input,.daterangepicker .daterangepicker_end_input,.daterangepicker .cancelBtn{
		display: none;
	}
	.daterangepicker .calendar-time{
		text-align:center;
		line-height:30px;
		margin:8px auto 0;
	}

	.daterangepicker{
		position:absolute;
		background:#fff;
		top:100px;
		left:20px;
		margin-top:1px;
		-webkit-border-radius:4px;
		-moz-border-radius:4px;
		border-radius:4px;
		padding:4px;
	}

	.daterangepicker table{
		width:100%;
		margin:0;
	}

	.daterangepicker td,.daterangepicker th{
		text-align:center;
		width:20px;
		height:20px;
		cursor:pointer;
		white-space:nowrap;
	}

	.daterangepicker td.available:hover,.daterangepicker th.available:hover{
		background:#eee;
	}

	.daterangepicker td.in-range{
		background:#ebf4f8;
		-webkit-border-radius:0;
		-moz-border-radius:0;
		border-radius:0;
	}

	.daterangepicker td.available+td.start-date{
		-webkit-border-radius:30px;
		-moz-border-radius:30px;
		border-radius:30px;
	}

	.daterangepicker td.in-range+td.end-date{
		-webkit-border-radius:30px;
		-moz-border-radius:30px;
		border-radius:30px;
	}

	.daterangepicker td.start-date.end-date{
		-webkit-border-radius:30px;
		-moz-border-radius:30px;
		border-radius:30px;
	}

	.daterangepicker td.active,.daterangepicker td.active:hover{
		background: #fed9d9;
	    color: #666;
	    border-radius: 30px;
	    width: 50px;
	    height: 40px;
	}

	.daterangepicker th.month{
		width:auto;
	    height: 60px;
	    font-size: 20px;
	    color: #505050;
	}
	.daterangepicker td.off{
		color:#999;
	}
	.daterangepicker td.disabled{
		color:#ccc;
		text-decoration:line-through
	}
	</style>

	<script>
		var self = this;
		var root = self.root;

		self.format = function(myDate){
			return myDate.getFullYear()+"-"+( ((myDate.getMonth()+1)<9)?("0"+(myDate.getMonth()+1)):(myDate.getMonth()+1))+"-"+((myDate.getDate()<9)?("0"+myDate.getDate()):myDate.getDate());
		}
		self.on('mount', function() {
			var myDate = new Date();
			var todayDate = self.format(myDate);
			myDate.setTime(myDate.getTime()-24*60*60*1000*7);
			var startDate = self.format(myDate);
			$("#daterange").val(startDate+"~"+todayDate);
      $('#daterange').daterangepicker({
      	format: 'YYYY-MM-DD',
          maxDate:todayDate,
          startDate: startDate,
  		endDate: todayDate,
          dateLimit:{days:30},
       	 	separator: ' ~ ',
          locale:{
          	 applyLabel: '确定',
          	 customRangeLabel: 'Custom',
                 daysOfWeek: ['周日', '周一', '周二', '周三', '周四', '周五','周六'],
                 monthNames: ['1-', '2-', '3-', '4-', '5-', '6-', '7-', '8-', '9-', '10-', '11-', '12-'],
                 firstDay: 1
          },
  		}, function(start,end,label) {
// 	    			var startTime =  start.substring(0,10);
// 	    			var endTime =  end.substring(0,10);
// 					var startTime = new Date(start);
// 					var sedTime = new Date(end);
// 					startTime = self.format(startTime);
// 					endTime = self.format(endTime);
// 					var param= {startTime:startTime,endTime:endTime};
			self.parent.trigger('dateChange');
			self.trigger('dateChange');
  		});
		})
	</script>
</daterangepicker>
