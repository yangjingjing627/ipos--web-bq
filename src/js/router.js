import riotRouter from 'riot-seed-router';

riotRouter({
    '#content': [
		//登陆
		{ route: '/login', tag: 'login'},
		{ route: '/register', tag: 'register'},
		{ route: '/register-final', tag: 'register-final'},
		{ route: '/find-password', tag: 'find-password'},
    { route: '/license-key', tag: 'license-key'},


		//收银
		{ route: '/casher/index', tag: 'casher-index', default: true, params: { search: true, hasAdd: true}},
		{ route: '/casher/refund', tag: 'casher-refund',  params: { search: true, hasAdd: true}},
		{ route: '/casher/balance', tag: 'casher-balance', params: { back: '#/casher/index', title: '结算'}},
		{ route: '/casher/refund-balance', tag: 'casher-balance',  params: { back: '#/casher/refund', title: '退货结算', refund: true}},

		//商铺部分
    // { route: '/shop/chart', tag: 'shop-chart', params: { back: '#/shop/index', title: '我的数据' } },
    { route: '/shop/business-assistant', tag: 'business-assistant', params: { back: '#/shop/index', title: '经营助手' } },
    // { route: '/shop/business-assistant-bq', tag: 'business-assistant-bq', params: { back: '#/shop/index', title: '经营助手' } },


    { route: '/shop/employee', tag: 'employee', params: { back: '#/shop/index', title: '员工' }  },
    { route: '/shop/message', tag: 'shop-message', params: { back: '#/shop/index', title: '店铺资料' } },
    { route: '/shop/products', tag: 'products', params: { back: '#/shop/index', title: '商品' }},
    { route: '/shop/device', tag: 'device-index',params: { back: '#/shop/index', title: '外接设备' } },
    { route: '/shop/order-printer', tag: 'order-printer',params: { back: '#/shop/device', title: '小票打印机' } },
    { route: '/shop/tag-printer', tag: 'tag-printer',params: { back: '#/shop/device', title: '标签打印机' } },
    { route: '/shop/sales-order', tag: 'sales-order', params: { back: '#/shop/index', title: '结算单' } },
    { route: '/shop/return-order', tag: 'return-order', params: { back: '#/shop/sales-order', title: '退货单' } },
    { route: '/shop/qrcode', tag: 'shop-qrcode', params: { back: '#/shop/index', title: '支付二维码' } },
    { route: '/shop/userqrcode', tag: 'shop-userqrcode', params: { back: '#/shop/message', title: '店铺推广二维码' } },
    { route: '/shop/upqrcode', tag: 'shop-qrcode', params: { back: '#/shop/message', title: '支付二维码' } },
    { route: '/shop/import-custom', tag: 'import-custom', params: { back: '#/shop/products', title: '导入已有商品库' } },
    { route: '/shop/import-standard', tag: 'import-standard', params: { back: '#/shop/products', title: '导入标准商品库' } },
    { route: '/shop/index', tag: 'shop-index'},

		//订单部分
		{ route: '/order/index', tag: 'order-index',params: { title: '今日订单' } },
		{ route: '/order/history', tag: 'order-history', params: { back: '#/order/index', title: '历史订单' } },

		//库存
		{ route: '/shop/storage', tag: 'storage-index', params: { back: '#/shop/index', title: '库存' } },
		{ route: '/shop/supplier', tag: 'storage-supplier', params: { back: '#/shop/storage', title: '供应商' } },
		{ route: '/shop/storagein', tag: 'storage-in', params: { back: '#/shop/storage', title: '入库',type:1 } },
		{ route: '/shop/storageout', tag: 'storage-in', params: { back: '#/shop/storage', title: '出库',type:2  } },
		{ route: '/shop/receipt', tag: 'storage-receipt', params: { back: '#/shop/storage', title: '单据' } },

		//应用部分
		{ route: '/app/index', tag: 'app-index' ,params: { title: '应用' }},


    //奖励
    { route: '/shop/reward', tag: 'reward', params: { back: '#/shop/index', title: '奖励' } },
    { route: '/shop/income', tag: 'income', params: { back: '#/shop/reward', title: '奖励收入' } },

    //成就
    { route: '/shop/attain', tag: 'attain', params: { back: '#/shop/index', title: '成就' } },
    //优惠券
    { route: '/shop/coupon', tag: 'coupon', params: { back: '#/shop/index', title: '优惠券' } },

    //生活服务
    { route: '/shop/service', tag: 'life-service', params: { back: '#/shop/index', title: '生活服务' } },
    { route: '/shop/emplo/data', tag: 'employee-data', params: { back: '#/shop/index', title: '生活服务' } },


    // 测试弹框部分
    { route: '/pop/text', tag: 'coupon'},

    ]
});
