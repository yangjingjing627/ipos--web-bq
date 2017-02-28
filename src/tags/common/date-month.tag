<date-month>
<div class="month-data">
  <h4>
    <span class="el-icon-before" onclick="{ beforeYear }"></span>
    <span class="year">{ year }年</span>
    <span class="el-icon-after" onclick="{ afterYear }"></span>
  </h4>
  <div class="content">
    <ul>
      <li each={ monthList } onclick="{ selectDate }" class="{ active: (value == month) && (selectyear == year) }">
        <span>{ name }</span>
      </li>
    </ul>
  </div>
</div>
<script>
  var self = this
  self.monthList = [
    {name: '1月', value: '01', active: false},
    {name: '2月', value: '02', active: false},
    {name: '3月', value: '03', active: false},
    {name: '4月', value: '04', active: false},
    {name: '5月', value: '05', active: false},
    {name: '6月', value: '06', active: false},
    {name: '7月', value: '07', active: false},
    {name: '8月', value: '08', active: false},
    {name: '9月', value: '09', active: false},
    {name: '10月', value: '10', active: false},
    {name: '11月', value: '11', active: false},
    {name: '12月', value: '12', active: false}
  ];
  self.year = '';

  self.update();
  self.selectDate = function (e) {
    self.month = e.item.value;
    self.selectyear = self.year;
    var showDate = {
      year: parseInt(self.year),
      month: parseInt(e.item.value)
    }
    self.parent.trigger('selectMonthdate', showDate);
    self.trigger('selectMonthdate', showDate);
  }

  self.beforeYear = function () {
    var em = window.event;
    em.preventDefault();
    if (em && em.stopPropagation) {
      em.stopPropagation();
    }
    self.year = parseInt(this.year) - 1
  }
  self.afterYear = function () {
    var em = window.event;
    em.preventDefault();
    if (em && em.stopPropagation) {
      em.stopPropagation();
    }
    self.year = parseInt(this.year) + 1
  }

  self.root.openDateMonth = self.openDateMonth = function(params) {
    var _date
    if (params) {
      _date = params
    } else {
      var myDate = new Date()
      _date = myDate.getFullYear() + '-' + (myDate.getMonth() + 1 < 10 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1)
    }
    var date = _date.split('-')
    self.year = date[0];
    self.month = date[1];
    self.selectyear = date[0];
    self.update();
  }

</script>
</date-month>
