<select-date>
    <div class="select-date">
        <a each={ list } class="{active: value == selectType}" onclick="{ selectDateType }">{ name }
            <div class="input" if={ value==1 }>
                <input type="text" id="J-xl-2">
            </div>
        </a>
    </div>
    <div class="date-ym">
        <date-year if={ dateYear } id="yearMonth"></date-year>
        <date-month if={ dateMonth } id="dateMonth"></date-month>
    </div>
    <input type="hidden" name="" value="" id="selectdateChangeEnd">
    <input type="hidden" name="" value="" id="selectdateChangeStart">
    <script>
        var self = this
        var config = self.opts.opts || self.opts || {};
        self.dateYear = false
        self.dateMonth = false
        self.selectType = 1
        // self.dateWeek = false self.dateDay = false
        self.list = [
            {
                'name': '按日选',
                'value': 1
            }, {
                'name': '按周选',
                'value': 2
            }, {
                'name': '按月选',
                'value': 3
            }, {
                'name': '按年选',
                'value': 4
            }
        ]

        self.root.open = self.open = function(params) {
            var e = {
              item: {
                value: params.selectType,
                startDate: params.startDate,
                endDate: params.endDate
              }
            }
            self.selectDateType(e)
        }

        self.selectDateType = function (e) {
          var em = window.event;
          em.preventDefault();
          if (em && em.stopPropagation) {
            em.stopPropagation();
          }
          var startDate = $("#selectdateChangeStart").val()
            if (e.item.value === 1) {
              self.selectType = 1
              self.confirmDate()
            } else if (e.item.value === 2) {
              self.selectType = 2
              self.confirmDate()
            } else if (e.item.value === 3) {
              self.selectType = 3
              self.dateYear = false
              self.dateMonth = true;
              self.update();
              $("#dateMonth")[0].openDateMonth(startDate);
            } else if (e.item.value === 4) {
              self.selectType = 4
              self.dateYear = true
              self.dateMonth = false;
              self.update();
              $("#yearMonth")[0].openDateYear(startDate);
            }
        }

        self.confirmDate = function () {
          self.update()
            laydate({
                elem: '#J-xl-2', format: 'YYYY-MM-DD', // 分隔符可以任意定义，该例子表示只显示年月日 时分秒
                // max: laydate.now(+1),
                isclear: false,
                issure: false,
                istoday: false,
                choose: function (datas) {
                    // document.getElementById('laydate_ok').onclick = function () {
                    //     document.getElementById('laydate_box').style.display = 'none';
                    // }
                    var startDate = '';
                    var endDate = '';
                    var showDate = ""
                    if (self.selectType == 1) {
                      startDate = datas;
                      endDate = datas;
                      showDate = startDate;
                    } else if (self.selectType == 2) {
                      var dateYear = datas.substring(0,10);//获取当前年
                      var dd = dateYear.replace(/-/g,"/");
                      var d=utils.getMonDate(dd);
                      var arr=[];
                      for(var i=0; i<7; i++)
                      {
                      arr.push(d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate());
                      d.setDate(d.getDate()+1);
                      }
                      $("#shows").text(arr[0] + '~' + arr[6]);
                      startDate = arr[0];
                      endDate = arr[6];
                    }
                    triggerDate(startDate,endDate)
                }
            });
        }

        function triggerDate(startDate,endDate) {
          $("#selectdateChangeStart").val(startDate)
          $("#selectdateChangeEnd").val(endDate)
          var showDate = startDate + " ~ " + endDate;
          var date = startDate.split('-')
          if (self.selectType === 1) {
            showDate = startDate
          } else if (self.selectType === 3) {
            showDate =date[0] +"-" + date[1]
          } else if (self.selectType === 4) {
            showDate =date[0] +"年"
          }
          var date = {
            showDate: showDate,
            selectType:self.selectType
          }
          self.parent.trigger('selectdateChange', date);
          self.trigger('selectdateChange', date);
        }

        self.on('selectMonthdate', function (date) {
          date.month = date.month  < 10 ? '0' + date.month : date.month
          var startDate = date.year +"-" +date.month+ "-" +"01"
          var endDate = date.year +"-" +date.month +"-"+ utils.getLastDay(date.year, date.month)
          triggerDate(startDate, endDate)
        })

        self.on('selectYeardate', function (date) {
          var startDate = date +"-01-01"
          var endDate = date +"-12-31"
          triggerDate(startDate, endDate)
        })

        self.on('mount', function() {
          self.confirmDate();
        })
    </script>
</select-date>
