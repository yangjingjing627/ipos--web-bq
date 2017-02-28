<business-assistant-c>
    <div class="business-assistant">
        <div class="b-s-top">
            <div class="rank">
                <!-- <span>本周海淀区第2名<span> -->
                <span>本日{ weekRank.countryName }第{ weekRank.rank }名<span>
        <ul>
          <!-- <li>本周门店总销售额:7878.78</li>
          <li>海淀区最高销售额:7878.78</li> -->
          <li>本门店总销售额:{ weekRank.totalAmount }</li>
          <li>{ weekRank.countryName }最高销售额:{ weekRank.highestAmount }</li>
        </ul>
      </div>

      <div class="chose-date">
        <div class="get-date" onclick="{ selectDate }" id="selectdateShow">
          { showDate }
        </div>
        <input id="getstartDate" type="hidden" name="name" value="{ startDate }">
        <input id="getendDate" type="hidden" name="name" value="{ endDate }">

        <div if={ selectDateStatus } class="select-date-select">
          <select-date id="selectDate"></select-date>
        </div>
      </div>

      <div class="sale-data">
        <span id="totalAmount">销售额:{ allSale.totalAmount }</span>
                <span>总单数:{ allSale.totalBills }</span>
                <span>销量:{ allSale.totalSales }</span>
                <span>毛利润:{ allSale.totalProfit }</span>
            </div>
        </div>
        <div class="b-s-con">
            <div class="l-report brief-report">
                <p><i></i><b>销售简报</b><i></i></p>
                <div class="channel-sale-rank">
                    <div class="report sale-info">
                        <div class="reportInfo">
                            分渠道销售情况
                        </div>
                        <div class="disc">

                            <div class="wraps wrap-r" id="circleOne">
                                <div class="circle circle-r">
                                    <div class="percent left"></div>
                                    <div class="percent right wth0"></div>
                                </div>
                                <div class="num">
                                    <b if={ !perSale }>销售额对比</b>
                                    <b if={ perSale }>销量对比</b>
                                </div>
                            </div>

                            </ul>
                            <ul class="sale-per" if={ !perSale }>
                                <li>网店销售额{ channelInfo.onlineAmountScale || 0 }%</li>
                                <li>门店销售额{ channelInfo.offlineAmountScale || 0 }%</li>
                            </ul>
                            <ul class="sale-per" if={ perSale }>
                                <li>网店销量{ channelInfo.onlineSalesScale || 0 }%</li>
                                <li>门店销量{ channelInfo.offlineSalesScale || 0 }%</li>
                            </ul>
                            <p>
                                <i class="nobor">销售额</i>
                                <i class="shift nobor" onclick="{ shift }"><b></b></i>
                                <i class="nobor">销售量</i>
                            </p>
                        </div>
                        <div class="line">
                            <div class="line1">
                                <p class="grad-l"><span class="line-item">门店</span><b>{ channelInfo.offlineCustomerPrice }</b></p>
                            </div>
                            <div class="line2">
                                <p class="grad-r"><span class="line-item">网店</span><b>{ channelInfo.onlineCustomerPrice }</b></p>
                            </div>
                            <i>客单价</i>
                        </div>
                    </div>

                    <div class="report">
                        <div class="reportInfo">
                            各分类销售额占比
                        </div>
                        <div id="circleSale"></div>
                    </div>
                </div>
                <div class="goods-sale-rank report">
                    <div class="reportInfo">
                        商品销售排名
                    </div>
                    <div class="accordTosale">
                        <div class="good-class">
                            <!-- 全部分类 -->
                            <select id='categorySel' class="" name="" onchange="{ categorySel }">
                  <option   each={ categoryRank } value="{ cateId }">{ cateName }</option>
                  <!-- <input class='cateId' each={ categoryRank } type="hidden" name="name" value="{ cateId }"> -->
                </select>
                        </div>
                        <div class="good-according">
                            <div class="{ active: active }" onclick={ accordSale } each={ according }>
                              { accord }
                            </div>
                        </div>

                    </div>

                    <li class="li-bor-top">
                        <span style="width: 8%">项</span>
                        <span style="width: 23%">商品</span>
                        <span style="width: 13%">分类</span>
                        <span style="width: 10%">销量</span>
                        <span style="width: 15%">销售额</span>
                        <span style="width: 15%">周转天数</span>
                        <span style="width: 16%">毛利率</span>
                    </li>
                    <ul class="top-goods-list">
                        <li each="{ item in next_gooda }">
                            <span style="width: 8%" if={ next_gooda.indexOf(item)==0 || next_gooda.indexOf(item)==1 || next_gooda.indexOf(item)==2 }></span>
                            <span style="width: 8%" if={ next_gooda.indexOf(item) !=0 && next_gooda.indexOf(item) !=1 && next_gooda.indexOf(item) !=2 }>{ next_gooda.indexOf(item) + 1}</span>
                            <span style="width: 23%">{ item.goodsName }</span>
                            <span style="width: 13%">{ item.cateName }</span>
                            <span style="width: 10%">{ item.sales }</span>
                            <span style="width: 15%" class="saleNum">{ item.salesAmount }</span>
                            <span style="width: 15%" if={ item.turnoverDays>= 0 &&  item.turnoverDays <= 999 }>999+</span>
                            <span style="width: 15%" if={ item.turnoverDays>= 0 }>{ item.turnoverDays }</span>
                            <span style="width: 15%" if={ item.turnoverDays < 0 }>---</span>

                            <span style="width: 16%">{ item.grossMargin }%</span>
                            <div class="" id="{item.activeStatus}" if="item.activeStatus">
                            </div>
                        </li>
                        <input id="getNext" type="hidden" name="name" value="{ next }">
                    </ul>
                </div>
            </div>
            <div class="r-report brief-report">
                <!-- 顾客 -->
                <p><i></i><b>顾客简报</b><i></i></p>
                <div class="customer-sale-rank report week-sale">
                    <!-- <div class="report"> -->
                    <div class="reportInfo">
                        分渠道顾客情况
                    </div>
                    <!-- </div> -->
                    <div class="l-week-sale">

                        <!-- weekMembersInfo -->
                        <ul>
                            <li class="bor1">
                                <dl class="">
                                    <dt></dt>
                                    <dd>门店</dd>
                                </dl>
                                <ul>
                                    <li>本周消费顾客</li>
                                    <li>{ weekMembersInfo.offlineBuyerNum }</li>
                                    <li class="addbg" if={ weekMembersInfo.offlineBuyerAddNum> 0 } >上周 +{ weekMembersInfo.offlineBuyerAddNum }</li>
                                    <li class="decrebg" if={ weekMembersInfo.offlineBuyerAddNum < 0 }>上周 { weekMembersInfo.offlineBuyerAddNum }</li>
                                    <li if={ weekMembersInfo.offlineBuyerAddNum==0 }>上周 ={ weekMembersInfo.offlineBuyerAddNum }</li>

                                </ul>
                            </li>
                            <li>
                                <dl class="">
                                    <dt class="store-on-pic"></dt>
                                    <dd>网店</dd>
                                </dl>
                                <ul>
                                    <li>本周消费会员</li>
                                    <li>{ weekMembersInfo.onlineBuyerNum }</li>
                                    <li class="addbg" if={ weekMembersInfo.onlineBuyerAddNum> 0 }>上周 +{ weekMembersInfo.onlineBuyerAddNum }</li>
                                    <li class="decrebg" if={ weekMembersInfo.onlineBuyerAddNum < 0 }>上周 { weekMembersInfo.onlineBuyerAddNum }</li>
                                    <li if={ weekMembersInfo.onlineBuyerAddNum==0 }>上周 ={ weekMembersInfo.onlineBuyerAddNum }</li>


                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div class="c-week-sale">
                        <ul>
                            <li>本周新增会员</li>
                            <li>{ weekMembersInfo.newMemberNum }</li>
                            <li class="addbgNew" if={ weekMembersInfo.newMemberAddNum> 0 }>上周 +{ weekMembersInfo.newMemberAddNum}<span></span></li>
                            <li class="decrebgNew" if={ weekMembersInfo.newMemberAddNum < 0 }>上周 { weekMembersInfo.newMemberAddNum}<span></span></li>
                            <li if={ weekMembersInfo.newMemberAddNum==0 }>上周 ={ weekMembersInfo.newMemberAddNum}</li>


                        </ul>
                    </div>
                    <!-- <div class="r-week-sale" id="lostMember"> -->
                    <div class="r-week-sale" style="position:relative;">
                        <div class="wraps" id="circleTwo">
                            <div class="circle">
                                <div class="percent left"></div>
                                <div class="percent right wth0"></div>
                            </div>
                            <div class="num">
                                <p>
                                    流失会员{ weekMembersInfo.loseMemberNum }
                                </p>
                                <p>
                                    (30天未购物)
                                </p>
                            </div>
                            <div class="totalMem">
                                总会员:{ weekMembersInfo.totalMemberNum }
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 库存 -->
                <p><i></i><b>库存简报</b><i></i></p>
                <div class="customer-sale-rank warning-stock">
                    <div class="report">
                        <div class="reportInfo">
                            库存预警
                        </div>
                    </div>
                    <h1></h1>
                    <h2></h2>
                    <a class="left-arrow" onclick="{ leftBest }"></a>
                    <div class="stock-con">

                    <div class="stock-scroll stock-scroll-best">
                      <ul>
                            <li each={ bestStock }>
                                <div class="stock-pic">
                                    <img src="{ imageUrl || 'imgs/default-product.png' }" alt="" /></div>
                                <div class="stock-num stock-rotate" if={ stockNum <999 }>库存{ stockNum }</div>
                                <div class="stock-num stock-rotate" if={ stockNum>= 999 }>库存999+</div>

                                <div class="stock-name">{ goodsName }</div>
                            </li>

                        </ul>
                    </div>
                  </div>

                    <a class="right-arrow" onclick="{ rightBest }"></a>

                </div>
                <div class="customer-sale-rank warning-stock">
                    <div class="report">
                        <div
                         class="reportInfo">
                            滞销商品
                        </div>
                    </div>
                    <h1 class="h1"></h1>
                    <h2 class="h2"></h2>
                    <a class="left-arrow" onclick="{ leftDull }"></a>
                    <div class="stock-con">

                    <div class="stock-scroll stock-scroll-dull">
                      <ul>
                            <li each={ dullStock }>
                                <div class="stock-pic">
                                    <img src="{ imageUrl || 'imgs/default-product.png' }" alt="" /></div>
                                <div class="stock-num stock-remain stock-rotate" if={ stockNum <999 }>库存{ stockNum }</div>
                                <div class="stock-num stock-remain stock-rotate" if={ stockNum>= 999 }>库存999+</div>

                                <div class="stock-name">{ goodsName }</div>
                            </li>

                        </ul>

                    </div>
                  </div>

                    <a class="right-arrow" onclick="{ rightDull }"></a>
                </div>

            </div>

        </div>
    </div>


    <!-- 右边  -->

    <script type="text/javascript">
        var self = this;
        self.nextNum = 0;
        self.next = 0;
        self.nextBest = 0;
        self.nextDull = 0;
        self.nowAmount = 0;
        self.selectDateStatus = false; //
        self.selectType = 1; //

        self.selectDate = function() {
            self.selectDateStatus = !self.selectDateStatus
            self.update()
            if (self.selectDateStatus) {
                var date = {
                    selectType: self.selectType,
                    startDate: self.startDate,
                    endDate: self.endDate
                }
                $("#selectDate")[0].open(date);
            }
            var e = window.event;
            e.preventDefault();
            if (e && e.stopPropagation) {
                e.stopPropagation();
            }
            self.update()

            function closeSelectDate() {
                self.selectDateStatus = false;
                self.update()
                $(window).unbind('click', closeSelectDate);
            }
            setTimeout(function() {
                $(window).bind('click', closeSelectDate);
            }, 100);
        }

        self.type = 0;
        var storeInfo = {}
        if (window.localStorage && localStorage.account) {
            storeInfo = JSON.parse(localStorage.account);
        }
        var myDate = new Date();
        var todayDate = '2012-12-12';
        self.startDate = todayDate;
        self.endDate = todayDate;
        var params = {
            storeId: storeInfo.storeId,
            channel: 0, //channel	渠道 0.ipos 1.bpos
            startDate: self.startDate,
            endDate: self.endDate,
        }
        self.next_gooda = [];
        self.list = [{
            item: '按日选',
            active: true
        }, {
            item: '按周选',
            active: false
        }, {
            item: '按月选',
            active: false
        }, {
            item: '按年选',
            active: false
        }, ]
        self.cate = [{
            item: '全选',
            active: true
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }, {
            item: '泉水饮料',
            active: false
        }]
        self.according = [{
            accord: '按销售额',
            active: true
        }, {
            accord: '按销量',
            active: false
        }, {
            accord: '按周转',
            active: false
        }, {
            accord: '按毛利率',
            active: false
        }]
        self.goods = [{
                item: '1',
                active: true
            }, {
                item: '2',
                active: true
            }, {
                item: '3',
                active: true
            }, {
                item: '4',
                active: true
            }, {
                item: '5',
                active: true
            }, {
                item: '6',
                active: true
            }, {
                item: '7',
                active: true
            }, {
                item: '8',
                active: true
            }, {
                item: '9',
                active: true
            }, {
                item: '10',
                active: true
            }, {
                item: '11',
                active: true
            }, {
                item: '12',
                active: true
            }, {
                item: '13',
                active: true
            }, {
                item: '14',
                active: true
            }, {
                item: '15',
                active: true
            }, {
                item: '16',
                active: false
            }, {
                item: '17',
                active: false
            }, {
                item: '18',
                active: false
            }, {
                item: '19',
                active: false
            }, {
                item: '20',
                active: false
            }, {
                item: '21',
                active: false
            }, {
                item: '22',
                active: false
            }, {
                item: '23',
                active: false
            }, {
                item: '24',
                active: false
            }, {
                item: '25',
                active: false
            }, {
                item: '26',
                active: false
            }, {
                item: '27',
                active: false
            }, {
                item: '28',
                active: false
            }]
            //选择日期格式 accorDate
        self.accorDateChange = function() {
            $('.y-m').css({
                'display': 'block'
            });
        }


        self.confirmDate = function() {
            laydate({
                elem: '#J-xl-2',
                format: 'YYYY-MM-DD hh:mm:ss', // 分隔符可以任意定义，该例子表示只显示年月日 时分秒
                choose: function(datas) {
                    //  document.getElementById('laydate_box').style.display='block';
                    document.getElementById('laydate_ok').onclick = function() {
                        document.getElementById('laydate_box').style.display = 'none';
                    }
                    var dateYear = datas.substring(0, 10); //获取当前时间
                    // $("#shows").val(dateYear);
                    var storeInfo = {}
                    if (window.localStorage && localStorage.account) {
                        storeInfo = JSON.parse(localStorage.account);
                    }

                    var myDate = new Date();
                    var todayDate = utils.getFormatDate(myDate);
                    var startDate = todayDate;
                    var endDate = todayDate;
                    var type = $('.good-according div.active').index();
                    var cateId = $('#cateId').val();

                    var sel_date = $('#accorDate').find("option:selected").text(); //选中的值
                    var sel_dateIndex = $('#accorDate option').index($('#accorDate option:selected')) //选中的值
                    if (sel_dateIndex == 2) { //月
                        dateYear = datas.substring(0, 7); //获取当前年
                        var dateRe1 = datas.substring(0, 4); //获取当前年
                        var dateRe2 = datas.substring(5, 7); //获取当前年
                        startDate = dateYear + '-' + '01';
                        endDate = dateYear + '-' + getLastDay(dateRe1, parseInt(dateRe2, 10));
                        $("#shows").text(dateYear);
                    } else if (sel_dateIndex == 3) { //年
                        dateYear = datas.substring(0, 4); //获取当前年
                        startDate = dateYear + '-' + '01' + '-' + '01';
                        endDate = dateYear + '-' + '12' + '-' + getLastDay(dateYear, 12);
                        $("#shows").text(dateYear);
                    } else if (sel_dateIndex == 1) { //周
                        dateYear = datas.substring(0, 10); //获取当前年
                        var dd = dateYear.replace(/-/g, "/");
                        var d = getMonDate(dd);
                        var arr = [];
                        for (var i = 0; i < 7; i++) {
                            arr.push(d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate());
                            d.setDate(d.getDate() + 1);
                        }
                        $("#shows").text(arr[0] + '~' + arr[6]);
                        startDate = arr[0];
                        endDate = arr[6];
                    } else if (sel_dateIndex == 0) { //日
                        dateYear = datas.substring(0, 10); //获取当前年
                        startDate = dateYear;
                        endDate = dateYear;
                        $("#shows").text(dateYear);
                    }
                    self.startDate = startDate;
                    self.endDate = endDate;

                    //要传的参数
                    var params = {
                            storeId: storeInfo.storeId,
                            channel: 0, //channel	渠道 0.ipos 1.bpos
                            startDate: startDate,
                            endDate: endDate
                        }
                        //饼图  4、各分类销售占比
                    self.getCircle(params);
                    //3、分渠道销售情况 柱状图和环图
                    self.line(params);
                    //2、按日期查销售额  top栏
                    self.saleByDate(params);
                    //
                    params.type = type;
                    params.next = 0;
                    params.cateId = $('#categorySel').val();
                    //5、商品销售排名     商品列表
                    self.getRank(params);
                }
            });
        }

        //客单价
        self.line = function(opt) {
                httpGet({
                    url: api.channelSale,
                    params: opt,
                    success: function(res) {
                        self.channelInfo = res.data;
                        if (self.channelInfo.onlineCustomerPrice > self.channelInfo.offlineCustomerPrice) {
                          $(".grad-r").css({
                              'height': '50%'
                          });
                            var height = $(".grad-r").height();
                            var widthAnother = Math.floor((self.channelInfo.offlineCustomerPrice / self.channelInfo.onlineCustomerPrice) * 10) / 10 * height;

                            $(".grad-l").css({
                                'height': widthAnother
                            });

                        } else if (self.channelInfo.onlineCustomerPrice < self.channelInfo.offlineCustomerPrice) {
                          $(".grad-l").css({
                              'height': '50%'
                          });
                            var height = $(".grad-l").height();
                            var widthAnother = Math.floor((self.channelInfo.onlineCustomerPrice / self.channelInfo.offlineCustomerPrice) * 10) / 10 * height;

                            $(".grad-r").css({
                                'height': widthAnother
                            });
                        }else if(self.channelInfo.onlineCustomerPrice == self.channelInfo.offlineCustomerPrice) {
                          $(".grad-l").css({
                              'height': '0%'
                          });
                          $(".grad-r").css({
                              'height': '0%'
                          });
                        }
                        $(".grad-l").append("<b></b>");
                        $(".grad-r").append("<b></b>");

                        if ($('.shift b').is('.shift-sale')) {

                          self.scalePercent = res.data.offlineSalesScale;

                        } else {

                          self.scalePercent = res.data.offlineAmountScale;

                        }
                        console.log(self.scalePercent + '--self.scalePercent--');
                        self.lostMembersTwo(self.scalePercent);
                        self.update();

                    }
                })
            }
            //根据商品品类进行选择
        self.categorySel = function() {
                var params = {
                    storeId: storeInfo.storeId,
                    channel: 0 //channel	渠道 0.ipos 1.bpos
                }
                params.cateId = $('#categorySel').val();
                // params.startDate = $("#getstartDate").val();
                // params.endDate = $("#getendDate").val();
                params.startDate = self.startDate;
                params.endDate = self.endDate;
                params.type = $('.good-according div.active').index();
                params.next = 0;
                self.getRank(params);
            }
            //根据商品品类进行选择

        //根据分类获取商品
        self.accordSale = function(e) {
                var type = $(e.target).index();
                // var  cateId = $('#testSelect option:selected') .val();//选中的值
                var cateId = $('#cateId').val();
                self.cateId = cateId;
                var next = 0;
                var storeInfo = {}
                if (window.localStorage && localStorage.account) {
                    storeInfo = JSON.parse(localStorage.account);
                }
                var params = {
                    storeId: storeInfo.storeId,
                    channel: 0 //channel	渠道 0.ipos 1.bpos
                }
                params.startDate = $("#startDateId").val();
                params.endDate = $("#endDateId").val();

                // params.startDate = $("#getstartDate").val();
                // params.endDate = $("#getendDate").val();
                params.startDate = self.startDate;
                params.endDate = self.endDate;
                params.type = type;

                params.cateId = $('#categorySel').val();
                params.next = 0;
                for (var i = 0; i < self.according.length; i++) {
                    self.according[i].active = false;
                }
                e.item.active = true;
                self.getRank(params);
            }
            // 画环形比例图
            //饼图
        self.getCircle = function(opt) {
            httpGet({
                url: api.categoryScale,
                params: opt,
                success: function(data) {
                    if (data.data.length > 0) {
                        // $("#circleSale")[0].removeChild(p);
                        self.circle(data);
                    } else {
                        $("#circleSale")[0].innerHTML = "<p></p>";
                    }
                }
            })
        }

        self.circle = function(data) {
            var myChart = echarts.init($('#circleSale')[0]);
            var seriesData = [];
            self.data = data.data;
            var colorList = ['#16f0fe', '#35aaed', '#96d24b', '#fb6960', '#ffcd6c', '#6f6ac2', '#da70d6', '#32cd32', '#6495ed',
                '#ff69b4', '#ba55d3'
            ];
            for (var i = 0; i < self.data.length; i++) {
                var seriesList = {};
                var itemStyle = {
                    normal: {
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                fontSize: '12',
                                color: '#666'
                            }
                        }
                    }
                };
                var charts = self.data[i];
                seriesList.name = self.data[i].cateName;
                seriesList.value = self.data[i].salesAmount;
                seriesList.itemStyle = itemStyle;
                seriesList.itemStyle.normal.color = colorList[i];
                seriesData.push(seriesList);
            }
            var option = {
                tooltip: {
                    trigger: 'item',
                    // formatter: "{a} <br/>{b} : {c} ({d}%)"
                    formatter: "{a} <br/>{b} : {d}%"

                },
                series: [{
                    name: '',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    label: {
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '16',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    data: seriesData,
                }]
            };
            myChart.setOption(option);

        }

        //切换销售选项
        self.shift = function() {
            self.params.startDate = self.startDate;
            self.params.endDate = self.endDate;
            httpGet({
                url: api.channelSale,
                params: self.params,
                success: function(res) {
                    self.perSale = true;

                    if ($('.shift b').is('.shift-sale')) {
                        $('.shift b').removeClass('shift-sale')
                        self.scalePercent = res.data.offlineAmountScale;
                        self.perSale = false;

                    } else {
                        $('.shift b').addClass('shift-sale')
                        self.scalePercent = res.data.offlineSalesScale;
                        self.perSale = true;

                    }
                    self.lostMembersTwo(self.scalePercent);
                    self.update();
                }
            })
        }

        //1、本周排名
        self.getWeekSale = function(opt) {
                httpGet({
                    url: api.getWeekSale,
                    params: opt,
                    success: function(res) {
                        self.weekRank = res.data;
                        self.update();
                    },
                    complete: function(status) {
                        // if (status == "error") {
                        //     utils.toast("后台数据有误");
                        // }
                    }
                })
            }
            //6、会员、订单简报
        self.weekMembers = function(opt) {
                httpGet({
                    url: api.weekMembers,
                    params: opt,
                    success: function(res) {
                        self.weekMembersInfo = res.data;
                        if (res.data.totalMemberNum != 0) {
                            var lostM = Math.ceil(res.data.loseMemberNum / res.data.totalMemberNum * 100);
                        } else {
                            var lostM = 0;
                        }
                        self.lostMembers(lostM);
                        self.update();
                    }
                })
            }
            //9、排名商品分类
        self.categoryRank = function(opt) {
                httpGet({
                    url: api.categoryRank,
                    params: opt,
                    success: function(res) {
                        self.categoryRank = res.data;
                        self.categoryRank.unshift({
                            cateId: null,
                            cateName: '全部分类'
                        })
                        self.update();
                    }
                })
            }
            //2、按日期查销售额
        self.saleByDate = function(opt) {
                httpGet({
                    url: api.saleByDate,
                    params: opt,
                    success: function(res) {
                        self.allSale = res.data;
                        self.update();
                    }
                })
            }
            //5、商品销售排名
        self.initGoodsRank = function(opt) {
                opt.type = self.type;
                opt.next = self.next;
                self.getRank(opt);
            }
            //下拉获取更多
        var listen = true;
        self.listenDown = function() {
            setTimeout(function() {
                self.listWrap = $('.top-goods-list')[0];
                self.scrollDown = function(event) {
                    var params = {
                        storeId: storeInfo.storeId,
                        channel: 0, //channel	渠道 0.ipos 1.bpos
                        startDate: self.startDate,
                        endDate: self.endDate,
                    }
                    params.cateId = $('#categorySel').val();
                    params.type = $('.good-according div.active').index();
                    params.next = self.next;
                    var clientHeight = self.listWrap.clientHeight;
                    var scrollTop = self.listWrap.scrollTop;
                    self.topGoodsListScroll = self.listWrap.scrollTop;
                    if ((clientHeight + scrollTop) > self.listWrap.scrollHeight - 10) {
                        if (self.next && listen) {
                            listen = false;
                            params.next = self.next;
                            httpGet({
                                url: api.goodsRank,
                                params: params,
                                success: function(res) {
                                    self.next_gooda = self.next_gooda.concat(res.data.list);
                                    self.next = res.data.next;
                                    listen = true;
                                    self.update();
                                    if (self.totalAmount > 0) {
                                        // var total = Math.floor((self.nowAmount / self.totalAmount) * 100);
                                        var total =(self.nowAmount / self.totalAmount) * 100;

                                        if (total >= 80) {

                                            return;
                                        }
                                        for (var i = 0; i < res.data.list.length; i++) {
                                            self.nowAmount += res.data.list[i].salesAmount;
                                            var total = Math.floor((self.nowAmount / self.totalAmount) * 100);
                                            // var total =(self.nowAmount / self.totalAmount) * 100;

                                            if (total >= 80) {
                                              i = self.next -10 + i;
                                                self.next_gooda[i].activeStatus = "activeStatus"
                                                    // $('.top-goods-list li').eq(i).after(txt);
                                                break;
                                            }
                                        }
                                        self.update();
                                        var txt = $("<div></div>").text("以上商品占销售额的80%").addClass('txt');
                                        $("#activeStatus").parent("li").after(txt)
                                    }
                                }
                            })

                        }
                    }
                };
                // if (self.listWrap) {
                self.listWrap.addEventListener('scroll', self.scrollDown, false);
                // }
            }, 50);
        }

        //丢失会员数环状图
        self.lostMembers = function(percent) {
                $('#circleTwo .left').css("-webkit-transform", "rotate(" + (18 / 5) * percent + "deg)");
                $('#circleTwo .num>span').text(percent);
                if (percent > 50) {
                    $('#circleTwo .circle').addClass('clip-auto');
                    $('#circleTwo .right').removeClass('wth0');
                }
            }
            //销售额占比
        self.lostMembersTwo = function(percent) {
          console.log(percent + '---percent---');
            $('#circleOne .left').css("-webkit-transform", "rotate(" + (18 / 5) * percent + "deg)");
            $('#circleOne .num>span').text(percent);
            if (percent > 50) {
                $('#circleOne .circle').addClass('clip-auto');
                $('#circleOne .right').removeClass('wth0');
            }
        }
        self.init = function() {
                $('.rank').hover(function() {
                    $('.rank ul').css({
                        'display': 'block'
                    });
                }, function() {
                    $('.rank ul').css({
                        'display': 'none'
                    });
                });
            }
            //7、畅销商品库存预警
        self.bestStock = [];

        // 初始加载 库存预警分页
        self.bestWarning = function(opt) {
            getbestWarning(opt, function(res) {
                self.update();
            })
        }

        // 库存预警分页
        var bestscroll = true;

        function testBestScrllo() {
            var bestListWrap = $('.stock-scroll-best')[0];
            $(".stock-scroll-best").scroll(function() {
                var bestWidth = $(".stock-scroll-best ul").width()
                if ((bestWidth - bestListWrap.scrollLeft < 450) && self.nextbest) {
                    if (bestscroll) {
                        bestscroll = false
                        var params = self.params;
                        params.next = self.nextbest
                        getbestWarning(params, function(res) {
                            self.update();
                            bestscroll = true;
                        })
                    }
                }
            })
        }
        self.leftBest = function() {
            var bestListWrap = $('.stock-scroll-best')[0];
            var bestLiWidth = $(".stock-scroll-best ul li").width()
            bestListWrap.scrollLeft = bestListWrap.scrollLeft - bestLiWidth
        }

        self.rightBest = function() {
            var bestListWrap = $('.stock-scroll-best')[0];
            var bestLiWidth = $(".stock-scroll-best ul li").width()
            bestListWrap.scrollLeft = bestListWrap.scrollLeft + bestLiWidth
        }

        function getbestWarning(params, callback) {
            httpGet({
                url: api.bestWarning,
                params: params,
                success: function(res) {
                    if (params.next === 0) {
                        self.bestStock = res.data.list;
                    } else {
                        self.bestStock = self.bestStock.concat(res.data.list);
                    }
                    var scrollLi = parseInt($(".stock-scroll-best").width() / 3);
                    var scrollUl = self.bestStock.length * scrollLi;
                    self.nextbest = res.data.next;
                    self.update();
                    $('.stock-scroll-best ul li').css('width', scrollLi);
                    $('.stock-scroll-best ul').css('width', scrollUl);
                    bestscroll = true
                    callback(res);
                }
            })
        }

        function getdullWarning(params, callback) {
            httpGet({
                url: api.dullWarning,
                params: params,
                success: function(res) {
                    if (params.next === 0) {
                        self.dullStock = res.data.list;
                    } else {
                        self.dullStock = self.dullStock.concat(res.data.list);
                    }
                    var scrollLi = parseInt($(".stock-scroll-dull").width() / 3);
                    var scrollUl = self.dullStock.length * scrollLi;
                    self.nextDull = res.data.next;
                    self.update();
                    $('.stock-scroll-dull ul li').css('width', scrollLi);
                    $('.stock-scroll-dull ul').css('width', scrollUl);
                    dullscroll = true
                    callback(res);
                }
            })
        }

        //8、滞销商品提醒
        self.dullWarning = function(opt) {
            getdullWarning(opt, function(res) {
                self.update();
            })
        }

        //、滞销商品提醒  分页
        var dullscroll = true;

        function testDullScrllo() {
            var dullListWrap = $('.stock-scroll-dull')[0];
            $(".stock-scroll-dull").scroll(function() {
                var dullWidth = $(".stock-scroll-dull ul").width()
                if ((dullWidth - dullListWrap.scrollLeft < 450) && self.nextDull) {
                    if (dullscroll) {
                        dullscroll = false
                        var params = self.params;
                        params.next = self.nextDull
                        getdullWarning(params, function(res) {
                            self.update();
                            dullscroll = true;
                        })
                    }
                }
            })
        }
        self.leftDull = function() {
            var dullListWrap = $('.stock-scroll-dull')[0];
            var dullLiWidth = $(".stock-scroll-dull ul li").width()
            dullListWrap.scrollLeft = dullListWrap.scrollLeft - dullLiWidth
        }

        self.rightDull = function() {
            var dullListWrap = $('.stock-scroll-dull')[0];
            var dullLiWidth = $(".stock-scroll-dull ul li").width()
            dullListWrap.scrollLeft = dullListWrap.scrollLeft + dullLiWidth
        }

        self.getRank = function(param) {
            httpGet({
                url: api.goodsRank,
                params: param,
                success: function(res) {
                    self.nowAmount = 0;
                    self.next_gooda = res.data.list;
                    self.next = res.data.next;
                    self.totalAmount = res.data.totalAmount;
                    self.update();
                    $(".txt").remove();
                    if (res.data.totalAmount > 0) {

                        for (var i = 0; i < self.next_gooda.length; i++) {
                            self.nowAmount += self.next_gooda[i].salesAmount;
                            // var total = Math.floor((self.nowAmount / self.totalAmount) * 100);
                            var total = (self.nowAmount / self.totalAmount) * 100;

                            if (total >= 80) {
                                self.next_gooda[i].activeStatus = "activeStatus"
                                    // $('.top-goods-list li').eq(i).after(txt);
                                break;
                            }
                        }
                        self.update();
                        var txt = $("<div></div>").text("以上商品占销售额的80%").addClass('txt');
                        $("#activeStatus").parent("li").after(txt)
                    }
                }
            })
        }

        // 改变日期
        self.on('selectdateChange', function(date) {
            self.showDate = date.showDate
            self.selectType = date.selectType
            self.startDate = $(self.root).find('#selectdateChangeStart').val();
            self.endDate = $(self.root).find('#selectdateChangeEnd').val();
            self.selectDateStatus = false
            self.update();
            var storeInfo = {}
            if (window.localStorage && localStorage.account) {
                storeInfo = JSON.parse(localStorage.account);
            }
            var params = {
                    storeId: storeInfo.storeId,
                    channel: 0, //channel	渠道 0.ipos 1.bpos
                    startDate: self.startDate,
                    endDate: self.endDate
                }
                //饼图  4、各分类销售占比
            self.getCircle(params);
            //3、分渠道销售情况 柱状图和环图
            self.line(params);
            //2、按日期查销售额  top栏
            self.saleByDate(params);
            var type = $('.good-according div.active').index();
            //
            params.type = type;
            params.next = 0;
            params.cateId = $('#categorySel').val();
            //5、商品销售排名     商品列表
            self.getRank(params);
        });

        self.on('mount', function() {
            var storeInfo = {}
            if (window.localStorage && localStorage.account) {
                storeInfo = JSON.parse(localStorage.account);
            }
            var myDate = new Date();
            var todayDate = utils.getFormatDate(myDate);
            self.startDate = todayDate;
            self.endDate = todayDate;
            self.showDate = todayDate;
            self.params = {
                storeId: storeInfo.storeId,
                channel: 0, //channel	渠道 0.ipos 1.bpos
                startDate: self.startDate,
                endDate: self.endDate,
            }
            $("#shows").text(todayDate);

            // utils.getFormatDate(myDate);
            self.getWeekSale(self.params);
            self.weekMembers(self.params);
            self.saleByDate(self.params);
            self.initGoodsRank(self.params);
            self.getCircle(self.params); //4、各分类销售占比
            self.line(self.params); //3、分渠道销售情况
            self.bestWarning(self.params); //7、畅销商品库存预警
            self.dullWarning(self.params); //8、滞销商品库存预警
            self.categoryRank(self.params); //9、排名商品分类
            self.init();
            // self.circle();
            self.lostMembers();
            //分类销售情况 销售额和销售量切换
            self.listenDown();
            testBestScrllo();
            testDullScrllo();
            // self.listenLeft();
        });
        self.on('unmount', function() {
                if (self.listWrap && self.scrollDown) {
                    self.listWrap.removeEventListener('scroll', self.scrollDown);
                }
                // if (self.listWrapBest && self.scrollLeft) {
                //   self.listWrapBest.removeEventListener('scroll', self.scrollLeft);
                // }
            })
            //获取  各月的第一天和最后一天  周日和周日
        function getLastDay(year, month) {
            var new_year = year; //取当前的年份
            var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）
            if (month > 12) //如果当前大于12月，则年份转到下一年
            {
                new_month -= 12; //月份减
                new_year++; //年份增
            }
            var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天
            return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日期
        }
        // 获取某日所属周一和周二
        function getMonDate(obj) {
            var d = new Date(obj),
                // var d=new Date(2016-12-14),
                day = d.getDay(),
                date = d.getDate();
            if (day == 1)
                return d;
            if (day == 0)
                d.setDate(date - 6);
            else
                d.setDate(date - day + 1);
            return d;
        }
    </script>
</business-assistant-c>
