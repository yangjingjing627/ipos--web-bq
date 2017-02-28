//riot tags需要的依赖
import flux from 'riot-seed-flux';
import {
    store,
    httpGet,
    httpPost
} from './store';
import $ from 'jquery';
import uploader from 'simple-ajax-uploader';
import echarts from 'echarts/index.common';
import daterangepicker from 'daterangepicker';
import utils from './utils';
import shop from './shop';
import CONSTANT from './constant';
require('../static/laydate.js')

if (window.navigator.userAgent.match(/Cordova/)) {
    var api = require('./API-online');
    var tokenPath = window.iposHeader + '/qiniu/uptoken';

} else {
  if (utils.isAndroid()) {   // Android 环境
    var tokenPath = window.iposHeader + '/qiniu/uptoken';
    var api = require('./API-android');
  } else {    // pc 端
    var tokenPath = window.iposHeader + '/qiniu/uptoken';
    var api = require('./API-server');
  }
}
var qiniuOpts = {
    runtimes: 'html5,flash,html4', //上传模式,依次退化
    browse_button: '', //上传选择的点选按钮，**必需**
    uptoken_url: tokenPath, //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
    unique_names: true,
    save_key: true,
    domain: 'https://o93qmsoro.qnssl.com/', //bucket 域名，下载资源时用到，**必需**
    get_new_uptoken: false, //设置上传文件的时候是否每次都重新获取新的token
    container: 'content', //上传区域DOM ID，默认是browser_button的父元素，
    max_file_size: '2mb', //最大文件体积限制
    flash_swf_url: '//libs.cdnjs.net/plupload/2.1.8/Moxie.swf', //引入flash,相对路径
    max_retries: 2, //上传失败最大重试次数
    chunk_size: '4mb', //分块上传时，每片的体积
    auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
    init: {
        'FilesAdded': function(up, files) {
            plupload.each(files, function(file) {});
        },
        'BeforeUpload': function(up, file) {
          console.log("------------------");
        },
        'UploadProgress': function(up, file) {
          console.log("--------------");
        },
        'FileUploaded': function(up, file, info) {
            var domain = up.getOption('domain');
            var res = $.parseJSON(info);
            var sourceLink = domain + res.key;
            console.log("u: " + sourceLink);
            console.log("v: " + sourceLink + "?imageView2/1/w/200/q/50");

        },
        'Error': function(up, err, errTip) {
            alert(errTip);
        },
        'UploadComplete': function() {},
        'Key': function(up, file) {
            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
            // 该配置必须要在 unique_names: false , save_key: false 时才生效

            var key = "img/" + file.name;
            return "";
        }
    }
}

var checkToken = function(tokenPath, callback) {
    $.ajax({
        url: tokenPath,
        type: 'get',
        timeout: 3000,
        dataType: 'json',
        success: function() {
            callback(true);
        },
        error: function() {
            callback(false);
        }
    });
};

utils.createUploader = function(opts) {
    var container = opts.container || 'content';
    checkToken(tokenPath, function(tag) {
        if (tag) {
            var options = $.extend(qiniuOpts, {
                browse_button: opts.idName,
                container: container,
                init: {
                    'FileUploaded': function(up, file, info) {
                        opts.success && opts.success(up, file, info);
                    },
                    'Error': function(up, err, errTip) {
                        utils.toast(errTip);
                    },
                }
            });
            return Qiniu.uploader(options);
        }
    });
};

$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

var insertPage = function(target, src) {
    var iframe = document.createElement('iframe');
    iframe.src = src || "http://www.baidu.com";
    iframe.style.height = '100%';
    iframe.style.width = '100%';
    target.appendChild(iframe);
}

var globleEvents = riot.observable();


function connectWebViewJavascriptBridge(callback) {
    //如果桥接对象已存在，则直接调用callback函数
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
    }
    //否则添加一个监听器来执行callback函数
    else {
        document.addEventListener('WebViewJavascriptBridgeReady', function() {
            callback(WebViewJavascriptBridge)
        }, false)
    }
}

var scanNumber = ''  // 全局 扫码 数据
//页面加载后，立刻调用创建桥接对象的函数
connectWebViewJavascriptBridge(function(bridge) {
    //这个方法用于js接收oc发来的send，并使用responseCallback方法给OC回发消息
    bridge.init(function(message, responseCallback) {
        var data = {};
        responseCallback(data);
    });

    //这个方法用于js接收oc的callHandler，handler用一个key标记，可以注册多个handler
    bridge.registerHandler('scanInputNumber', function(data, responseCallback) {
        scanNumber = data;
  			window.dispatchEvent(new Event('inputNumber'));
        responseCallback();
    })
})

// 检测url变化，，修改title  安卓头部标题
riot.routeParams.on('changed', function () {
  var params = riot.routeParams.params;
  if (params) {
      document.title = params.title
  }
});
