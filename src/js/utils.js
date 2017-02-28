var utils = {

    getDateTimeStrObj: function(time) {
        var time = new Date(time);
        var Y = (time.getFullYear() + '-');
        var M = (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-';
        var D = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
        var h = time.getHours() + ':';
        var m = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
        return {
            Y: Y,
            M: M,
            D: D,
            h: h,
            m: m
        }
    },

    getDateStr: function(time) {
        var o = this.getDateTimeStrObj(time);
        return o.Y + o.M + o.D;
    },

    getTimeStr: function(time) {
        var o = this.getDateTimeStrObj(time);
        return o.h + o.m;
    },

    getDateTimeStr: function(time) {
        var o = this.getDateTimeStrObj(time);
        return o.Y + o.M + o.D + ' ' + o.h + o.m;
    },

    getFormatDate: function(myDate) {
        return myDate.getFullYear() + "-" + (((myDate.getMonth() + 1) < 9) ?
            ("0" + (myDate.getMonth() + 1)) :
            (myDate.getMonth() + 1)) + "-" + ((myDate.getDate() < 9) ?
            ("0" + myDate.getDate()) :
            myDate.getDate());
    },

    getMonDate: function(obj) {
        var d = new Date(obj),
            day = d.getDay(),
            date = d.getDate();
        if (day == 1)
            return d;
        if (day == 0)
            d.setDate(date - 6);
        else
            d.setDate(date - day + 1);
        return d;
    },
    getLastDay: function(year, month) {
        var new_year = year;
        var new_month = month++;
        if (month > 12) {
            new_month -= 12;
            new_year++;
        }
        var new_date = new Date(new_year, new_month, 1);
        return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate();
    },
    clearForm: function(root) {
        if (typeof root === 'string') {
            var root = document.getElementById(root);
        }
        root.reset();
    },

    toast: function(msg) {
        if (window.Icommon) {
            Icommon.toast(msg);
        } else {
            var htoast = document.getElementById("divToast");
            if (htoast) {
                htoast.remove();
            }
            var divToast = document.createElement("div");
            divToast.id = "divToast";
            divToast.innerHTML = msg;
            document.body.appendChild(divToast);
            setTimeout(function() {
                if (divToast) {
                    divToast.remove();
                }
            }, 3000);
        }
    },

    //用于向服务端同步数据
    sync: function(type) {
      var api = require('./API-android');
      getWebViewJavascriptBridge(api.syn,{name: type})

    },

    loadShow: function() {
      var api = require('./API-android');
      getWebViewJavascriptBridge(api.show)

        // if (window.Iprogress) {
        //     Iprogress.show();
        // }
    },
    loadHide: function() {
      var api = require('./API-android');
      getWebViewJavascriptBridge(api.dismiss)
        // if (window.Iprogress) {
        //     Iprogress.dismiss();
        // }
    },
    androidBridge: function(url, params, callback) {
        if (window.WebViewJavascriptBridge) {
            window.WebViewJavascriptBridge.callHandler(
                url,
                params,
                function(res) {
                    callback(res)
                }
            );
        } else {
            document.addEventListener(
                'WebViewJavascriptBridgeReady',
                function() {
                  setTimeout(function() {
                    window.WebViewJavascriptBridge.callHandler(
                      url,
                      params,
                      function(res) {
                        callback(res)
                      }
                    );
                  }, 20)
                },
                false
            );
        }
    },
    setTitle: function(link, name) {
      var api = require('./API-android');
      getWebViewJavascriptBridge(api.setTitle,{title: name})
      location.href = link;

    },
    isAndroid: function() {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
        return isAndroid
    }
}
function getWebViewJavascriptBridge(url, params, callback) {
    if (window.WebViewJavascriptBridge) {
        window.WebViewJavascriptBridge.callHandler(
            url,
            params,
            function(res) {
                callback(res)
            }
        );
    } else {
        document.addEventListener(
            'WebViewJavascriptBridgeReady',
            function() {
              setTimeout(function() {
                window.WebViewJavascriptBridge.callHandler(
                  url,
                  params,
                  function(res) {
                    callback(res)
                  }
                );
              }, 20)
            },
            false
        );
    }
}
export default utils;
