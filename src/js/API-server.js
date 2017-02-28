//var iposHeader = "http://192.168.1.50:8081/admin";
//var iposHeader= "http://192.168.1.50:8081/pos";
// window.iposHeader= "http://zhangman.ipos100.cn/pos";
// var iposHeader = "http://jingjing.ipos.com/pos";

// var iposHeader = "/posc";
// if (location.host.match(/localhost/)) {
// 	window.iposHeader = "http://" + location.host + "/pos";
// }
// // else {
	// window.iposHeader = "http://192.168.1.154:8080/pos";
// window.iposHeader = "https://pos.ipos100.cn/pos";		//正式环境
window.iposHeader = "http://dev.hsy.pos.ipos100.cn/pos";		//测试环境
// window.iposHeader = "http://dev.hsy.pos.ipos100.cn/pos";		//测试环境重构,后台还没配置，只有前端配置了

// window.iposHeader = "http://60.205.106.238:8080/pos";
// }
///data/shift/list
var serverApi = {
	//qiniu token
	qiniuToken: 'qiniu/uptoken',    //获取七牛云token
	searchGoods: 'goods/search',      //查询商品
	weather: 'store/weather',          //获取天气
	login: 'store/login',              //登录
	cdkey: 'store/cdkey/verify',	//注册激活码

	lastLogin: 'Icommon.lastLogin',
	logout: 'store/logout',             //退出登录
	register: 'store/register/commit',    //注册提交
	registerNext: 'store/register/next',    //注册下一步
	sendCode: 'store/checkcode/send',       //发送验证码

	region: 'store/region/list',

	pwdCode: 'store/pwdfind/sendcode',      //找回密码验证码
	pwdSet: 'store/pwdfind/commit',         //找回密码提交

	auth: 'user/permissionCodes',            //权限

	//goods
	goods: 'goods/list',             //商品列表
	goodsTop: 'goods/list',
	goodDetail: 'goods/get',           //商品详情
	goodSearch: 'goods/search',        //商品查询
	category: 'goods/category/list',    //分类列表
	categoryAll:'goods/category/list',
	deleteGood: 'goods/del',            //删除商品
	createGood: 'goods/addOrUpdate',     //添加或修改商品
	updateGood: 'goods/addOrUpdate',
	goodByBarcode: 'goods/getByBarcode',  //根据barcode查询本店商品详情
	goodBySpecBarcode: 'goods/spec/getByBarcode',    //根据barcode查询云端商品详情
	goodImport: 'goods/import',                      //商品导入

	//销售单/退货单
	salesOrder: 'bill/listByDate',    //销售单
	orderGoods: 'bill/goods/list',     //退货单

	//employee
	employees: 'user/list',              //员工列表
	updateEmployee: 'user/addOrUpdate',    //添加或修改员工
	delEmployee: 'user/del',                 //删除员工

	//store message
	storeMessage: 'store/get',                //获取店铺信息
	updateMessage: 'store/update',             //修改店铺信息

	//shoppingcart
	listCart: 'shoppingcart/list',
	changeCart: 'shoppingcart/change',
	clearCart: 'shoppingcart/clear',

	addCart: 'shoppingcart/goods/incr',
	reduceCart: 'shoppingcart/goods/decr',
	addNoName: 'shoppingcart/addmoney',

	cartByScan: 'shoppingcart/enterAndAdd',
	openBox: 'cashbox/open',
	addBill: 'tmpbill/add',
	reviewBill: 'tmpbill/takeAndDel',
	listBill: 'tmpbill/list',
	shoppingcartGoodsPriceModify: 'shoppingcart/goods/change/price',		//结算时临时修改商品价格

	//balance
	closeRefund: 'refund/close',
	startRefund: 'refund/billopen',
	setPay: 'bill/change',
	changePay: 'pay/changePayment',     //改变支付方式 --现在不用了
	discountPay: 'pay/discount',       //折扣--现在不用了
	wipePay: 'pay/wipe',                 //抹零--现在不用了
	commitPay: 'pay/commit',            //结算 --现在不用了（）
	commitPayNew: 'pay/pos/commit',    //现在的结算接口
	modifyCartQuantity: 'shoppingcart/goods/update', // 修改购物车

	//通道
	sysSet: 'sys/set',
	sysGet: 'sys/get',

	//订单
	orderHistory: 'order/history',             //历史订单
	orderToday: 'order/today',                 //今日订单
	orderRefuse: 'order/refuse',               //拒绝订单
	orderCancel: 'order/cancel',               //取消订单
	orderInvalid: 'order/invalid',             //订单无效
	orderConfirm: 'order/confirm',             //确认订单
	orderComplete: 'order/complete',           //完成订单
	upCanOrder: 'order/upCanOrder',           //改变接单状态
	storeInfo: 'order/storeInfo',             //店铺信息
	orderConfirmed: 'order/toBeConfirmed',     //待处理订单数量
	newOrderHint: 'order/newOrderHint',   //新订单通知
	gooduuidByBarcode: 'goods/getByBarcode',  //获取店铺数据
	//库存

	stockAdd : "stock/goods/add",                // 入库添加商品
	stockIncr : "stock/goods/incr",              // 增加商品数量
	stockDecr : "stock/goods/decr",              //减少商品数量
	stockCommit :"stock/commit",                 //生成库存单据
	stockClear :"stock/clear",                 //清空购物车
	stockChangeNum : 'stock/goods/update',			//修改出库入库商品数量

	stockListByDate:"stock/listByDate",          //查询库存单据
	stockGoodsList:"stock/goods/list",           //库存单据商品列表

	supplierAddOrUpdate:"supplier/addOrUpdate",   //供应商添加或更新
	supplierDel:"supplier/del",                   //删除供应商
	supplierList :"supplier/list",                //供应商列表

	// 我的数据
	dataDashboard :"data/dashboard",
	// shiftRecordByDate: 'Iorder.shiftRecordByDate',		//交接班的订单
	shiftRecordByDate: 'data/shift/list',		//交接班的订单

	importTemplate : "goods/importTemplate",    //模板链接
	appList:"app/list",                              //app列表
	getappinfo:"app/list",
	showPayQrCode:"store/showPayQrCode",             //获取店铺支付二维码

	judgeBqCommercial:"data/judgeBqCommercial.json",     //获取是否是倍全店
	getServiceHost:"data/getServiceHost.json",                //获取服务器地址
	checkAppUpdateState:"checkAppUpdateState/1",
	getGoodsCountByCateId : "goods/category/amount",              //商品分类数量
	//2.4 经营助手
	getWeekSale: "data/sales/rank/date",												//1.本周排名
	saleByDate: "data/sales/simple/info",									//2.按日期查销售额
	weekMembers: "data/member/simple/info",								//6.会员、订单简报
	goodsRank: "data/sales/goods/rank",										//5、商品销售排名
	channelSale: "data/sales/channel/info",								//3、分渠道销售情况
	categoryScale: "data/sales/category/scale",						//4.各分类销售占比
	bestWarning: "data/sales/best/warning",								//7、畅销商品库存预警
	dullWarning: "data/sales/dull/warning",								//8、滞销商品提醒
	categoryRank: "data/sales/goods/rank/category",						//9、排名商品分类

	//2.0
	couponVerify:"pay/coupon/verify",    //优惠券接口

	couponList:"store/coupon/list",        //优惠券列表
	couponInfo:"store/coupon/info",        //优惠券详情
	couponStop:"store/coupon/grant/stop",    //停止发放优惠券
	couponCreate:"store/coupon/grant/create",   //创建优惠券
	memberVerify:"store/member/verify",            //结算单会员登录

	attainList:"store/attain/list",   //成就列表
	attainReward:"store/attain/task/reach",   //领取奖励
	rewardList:"store/reach/reward/list",     //奖励列表
	rewardInfo:"store/reach/reward/info",      //奖励详情
	record:"store/entity/record",     // 打点

	mobileVerify:"store/mobile/verify",   //验证店老板修改奖励发放账户验证码
	rewardIncomeList:"store/reward/income/list",   //奖励收入记录
	bankCardAdd:"store/bank/card/add",     //绑定银行卡
	bankCardUpdate:"store/bank/card/update",     //修改绑定银行卡
	bankCard:"store/bank/card",      //查询银行卡绑定信息
	changeCardCodeSend:"store/changeCardCode/send",    //发送验证码
	advIncomeList:"store/adv/income/list",  //广告收入
	globalIncomeList:"store/global/income/list",  //全球购收入
 };

for (var i in serverApi) {
	//如果匹配到/，则认为是远程接口
	if(i!="judgeBqCommercial" && i!="getServiceHost"){
		serverApi[i] = iposHeader + '/' + serverApi[i];
	}

}

module.exports = serverApi;
