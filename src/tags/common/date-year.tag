<date-year>
  <div class="year-data">
    <h4>
      <span class="el-icon-before" onclick="{ beforeYear }"></span>
      <span class="year"></span>
      <span class="el-icon-after" onclick="{ afterYear }"></span>
    </h4>
    <div class="content">
      <ul>
        <li each={ yearList } onclick="{ selectDate }" class="{ active: value == year }">
          <span>{ name }</span>
        </li>
      </ul>
    </div>
  </div>
  <script>
    var self = this

    self.selectDate = function (e) {
      self.year = e.item.value;
      var showDate = e.item.value;
      self.parent.trigger('selectYeardate', showDate);
      self.trigger('selectYeardate', showDate);
    }

    function get12year (last) {
      var list = []
      for (var i = 0; i < 12; i++) {
        var lastyear = last-i;
        self.lastyear = lastyear
        list.unshift({'name': lastyear, 'value': lastyear})
      }
      self.yearList = list
      self.update();
    }

    self.beforeYear = function () {
      var em = window.event;
      em.preventDefault();
      if (em && em.stopPropagation) {
        em.stopPropagation();
      }
      get12year(self.lastyear-1);
    }
    self.afterYear = function () {
      var em = window.event;
      em.preventDefault();
      if (em && em.stopPropagation) {
        em.stopPropagation();
      }
      get12year(self.lastyear+23);
    }
    self.root.openDateYear = self.openDateYear = function(params) {
      var _date
      if (params) {
        _date = params
      } else {
        var myDate = new Date()
        _date = myDate.getFullYear() + '-' + (myDate.getMonth() + 1 < 10 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1)
      }
      var date = _date.split('-')
      self.year = parseInt(date[0]);
      var lastyear = self.year
      var _index = lastyear%12
      if (_index != 1) {
        for (var i = 0; i < 12; i++) {
          lastyear = lastyear + 1
          if (lastyear%12 == 1) {
            break;
          }
        }
      }
      get12year(parseInt(lastyear));
      self.update();
    }
  </script>
</date-year>
