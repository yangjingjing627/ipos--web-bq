import router from './router';
import tags from './tags';
//安卓native环境需要使用deviceready
var readyEvent;
if (window.navigator.userAgent.match(/Cordova/)) {
	readyEvent = 'deviceready'
}
else {
	readyEvent = 'DOMContentLoaded'
}

//$('body').on('inputNumber', 'input, textarea', )
// 注意下面的data没有传递参数，使用Icommon.number获取

document.addEventListener(readyEvent, function() {
	riot.mount("*");
}, false);
