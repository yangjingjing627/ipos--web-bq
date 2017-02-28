import flux from 'riot-seed-flux';
import $ from 'jquery';
import utils from './utils';


var store = {};
if (window.navigator.userAgent.match(/Cordova/)) {
  var api = require('./API-online');  // Cordova环境
  store.online = true;
} else {
  if (utils.isAndroid()) {   // Android 环境
    var api = require('./API-android');
    store.online = true;
  } else {    // pc 端
    var api = require('./API-server');
    store.online = false;
  }
}
flux.config.refresh = true;
var httpBasic = function(type) {
    return function(opts) {
        var url = opts.url;
        if (url.match(/\//)) {
            $[type]({
                url: url,
                data: opts.params,
                timeout: 25000,
                xhrFields: {    //非跨域请求中，可请求成功
                    withCredentials: true
                },
                crossDomain: true,
                success: function(res) {
                    if (res.code === 1) {
                        opts.success && opts.success(res);
                    } else if (res.code === 10005) {
                        // location.href = "#login";
                        utils.androidBridge(api.goLogin)

                    } else if (res.code === 10002) {
                        utils.toast('您没有该权限');
                    } else if (res.msg) {
                        utils.toast(res.msg);
                    }
                },
                error: function(err) {
	                	// if(err.responseJSON.code ===10005 ){
	                	// 	location.replace("#login");
	                	// }
	                    opts.error && opts.error(err);
                },
                complete: function(XMLHttpRequest, status) {
                    if (status == 'timeout' && !opts.noToast) {
                        utils.toast("请求超时");
                    } else if (status == "error") {
                        if (XMLHttpRequest && XMLHttpRequest.statusText == "error" && !opts.noToast) {
                            utils.toast("网络状况不佳，请检查网络");
                        }
                    }
                    opts.complete && opts.complete(status);
                }
            });
        } else {
            console.log(url +"----------http-get-------" + JSON.stringify(opts.params));
            utils.androidBridge(
              url,
              opts.params,
              function(res) {
                res = JSON.parse(res)
                console.log("----------------------res---" + JSON.stringify(res));
                if (opts.complete) {
                  opts.complete && opts.complete(res);
                  return;
                }
                if (res.code == 1) {
                    opts.success && opts.success(res);
                } else if (res.code === 10005) {
                    // location.href = "#login";
                    utils.androidBridge(api.goLogin)

                } else if (res.code === 10002) {
                    utils.toast('您没有该权限');
                } else if (res.msg) {
                    utils.toast(res.msg);
                }
            })
            // var parts = url.split('.')
            // window[parts[0]][parts[1]](    //window.Ishop.goodsList(fun(res){},fun(err){},params)
            //     function(res) {
            //         if (opts.complete) {
            //             opts.complete && opts.complete(res);
            //             return;
            //         }
            //         if (res.code == 1) {
            //             opts.success && opts.success(res);
            //         } else if (res.code === 10005) {
            //             location.href = "#login";
            //         } else if (res.code === 10002) {
            //             utils.toast('您没有该权限');
            //         } else if (res.msg) {
            //             utils.toast(res.msg);
            //         }
            //     },
            //     function(err) {
            //         opts.error && opts.error(err);
            //     },
            //     opts.params
            // );
        }
    }
}

var httpGet = httpBasic('get');
var httpPost = httpBasic('post');

//xieyu store area;

store.auth = flux.createStore({
    get: function() {
        var self = this;
        httpGet({
            url: api.auth,
            success: function(res) {
                self.data = res.data.permissionCodes.split(',');
                self.trigger('complete');
            }
        });
    }
});
store.stockChange = flux.createStore({

});
store.weather = flux.createStore({
    get: function() {
        var self = this;
        httpGet({
            url: api.weather,
            success: function(res) {
                if (res.data && res.data.weather) {
                    self.data = res.data;
                } else {
                    self.data = {};
                    self.data.city = "";
                    self.data.weather = "天气：无法获取";
                    self.data.temp = "";
                }
                self.trigger('complete');
            },
            error: function() {
                self.data = {};
                self.data.city = "";
                self.data.weather = "天气：无法获取";
                self.data.temp = "";
                self.trigger('complete');
            },
            noToast: true
        });
    }
});
// {
//     "code": 1, //1 正常
//     "data": {
//           "city": "北京",
//           "weather": "多云",
//           "temp": "30"
//     }
// }



store.region = flux.createStore({
    get: function() {
        this.data = this.data || {
            levelOne: [],
            levelTwo: [],
            levelThree: [],
            current: {}
        };
        this.fetch('levelOne');
        this.trigger('complete');
    },

    setCurrent: function(key, levelData) {
        var current = this.data.current[key];

        if (current && current.code == levelData.code) {
            return;
        } else {
            this.data.current[key] = levelData;
            switch (key) {
                case 'levelOne':
                    this.data.levelTwo = [];
                    this.fetch('levelTwo', levelData.code);
                    break;
                case 'levelTwo':
                    this.data.levelThree = [];
                    this.fetch('levelThree', levelData.code);
                    break;
                default:
                    break;
            }
        }
        this.trigger('complete');
    },

    fetch: function(key, code) {
        var self = this;
        var keylist = {
            levelOne: 1,
            levelTwo: 2,
            levelThree: 3
        };
        httpGet({
            url: api.region,
            params: {
                type: keylist[key],
                pCode: code
            },
            success: function(res) {
                self.data[key] = res.data;
                self.setCurrent(key, res.data[0]);
                self.trigger('complete');
            }
        });
    }
});
store.orderGoods = flux.createStore({
  getGoodsDetail: function(params, callback) {
      var self = this;
      httpGet({
        url: api.orderGoods,
        params: params,
        success: function(res) {
          // self.data = res.data;
          callback && callback(res.data);
          self.trigger('complete');
        }
      });
  },
  print: function(params,callback) {
      var self = this;
      if (store.online) {
        httpGet({
            url: api.salePrintBill,
            params: params,
            success: function(res) {
                callback && callback(res.data);
                self.trigger('complete');
            }
        });
      }
  }

})

store.password = flux.createStore({
    sendCode: function(params, success) {
        var self = this;
        httpPost({
            url: api.pwdCode,
            params: params,
            success: function(res) {
                if (success) {
                    success(res);
                }
                self.trigger('complete');
            }
        });
    },

    commit: function(params, success) {
        var self = this;
        httpPost({
            url: api.pwdSet,
            params: params,
            success: function(res) {
                if (success) {
                    success(res);
                }
                self.trigger('complete');
            }
        });
    }
});

store.register = flux.createStore({
    get: function() {
        this.data = this.data || {};
        this.trigger('complete');
    },

    set: function(key, value) {
        this.data[key] = value;
        this.trigger('complete');
    },

    sendCode: function(params, success) {
        var self = this;
        httpPost({
            url: api.sendCode,
            params: params,
            success: function(res) {
                if (success) {
                    success(res);
                }
                self.trigger('complete');
            }
        });
    },

    next: function(params, success) {
        var self = this;
        utils.loadShow();
        httpPost({
            url: api.registerNext,
            params: params,
            success: function(res) {
                if (success) {
                    success(res);
                }
                self.trigger('complete');
            },
            complete: function(res) {
                utils.loadHide();
            }
        });
    },

    commit: function(params, success) {
        var self = this;
        utils.loadShow();
        httpPost({
            url: api.register,
            params: params,
            success: function(res) {
                if (success) {
                    success(res);
                }
                self.trigger('complete');
            },
            complete: function(res) {
                utils.loadHide();
            }
        });
    }
});

store.account = flux.createStore({
    get: function() {
        var localData;

        if (window.localStorage && ('setItem' in localStorage) && localStorage.getItem('account')) {
            localData = JSON.parse(localStorage.getItem('account'));
        }

        this.data = this.data || localData;
        this.trigger('complete');
    },

    login: function(params, success) {
        var self = this;
        httpPost({
            url: api.login,
            params: params,
            success: function(res) {
                success && success(res);

                self.data = res.data;
                self.trigger('complete');

                if (window.localStorage && 'setItem' in localStorage) {
                    localStorage.setItem('account', JSON.stringify(res.data));
                }
            }
        });
    },
    cdkey: function () {
      var self = this;
      httpPost({
          url: api.cdkey,
          success: function(res) {
              self.data = res.data;
              self.trigger('complete');

          }
      });
    },
    lastLogin: function(callback) {
        var self = this;
        if(store.online){
          httpPost({
              url: api.lastLogin,
              success: function(res) {
                  self.data = res.data;

                  self.trigger('complete');
                  if (window.localStorage && 'setItem' in localStorage) {
                    localStorage.setItem('account', JSON.stringify(res.data));
                  }
                  if(callback){
                    callback(res.data);
                  }
              }
          });
        } else{
          callback('未调到');
        }

    },
    logout: function() {
        var self = this;
        httpPost({
            url: api.logout,
            success: function(res) {
                self.data = res.data;
                self.trigger('complete');

                if (window.localStorage && 'setItem' in localStorage) {
                    localStorage.setItem('account', "");
                }

                store.sys.sendMessage({
                    isLoginOut: true
                })
            }
        });
    }
});
/*
 *  商品分类
 */
store.category = flux.createStore({
    get: function(callback) {
        var self = this;
        httpGet({
            url: api.category,
            success: function(res) {
                self.data = res.data;
                self.data.unshift({
                    cateId: null,
                    cateName: '全部商品'
                });
                self.data.push({
                    cateId: 0,
                    cateName: '未分类'
                });
                callback && callback(self.data);
                self.trigger('complete');
            }
        });
    }
});

store.categoryAll = flux.createStore({
    get: function() {
        var self = this;
        httpGet({
            url: api.categoryAll,
            success: function(res) {
                self.data = res.data;
                self.data.unshift({
                    cateId: null,
                    cateName: '全部商品'
                });
                self.data.push({
                    cateId: 0,
                    cateName: '未分类'
                });
                self.trigger('complete');
            }
        });
    }
});

//选择分类
store.categorySelect = flux.createStore({
    get: function() {
        var self = this;
        httpGet({
            url: api.categoryAll,
            success: function(res) {
                self.data = res.data;
                self.data.unshift({
                    cateId: 0,
                    cateName: '未分类'
                });
                self.trigger('complete');
            }
        });
    }
});
/*
 *  分类下的商品列表(顶栏使用，避免和分类串数据)
 */
store.topGoods = flux.createStore({
    get: function(params,cb) {
        var self = this;
        httpGet({
            url: api.goodsTop,
            params: params,
            success: function(res) {
                self.data = res.data;
                cb && cb(self.data);
                self.trigger('complete');
            }
        });
    },
    getMore: function(params, cb) {
        var self = this;
        httpGet({
            url: api.goodsTop,
            params: params,
            success: function(res) {
                if (!self.data.list) {
                    self.data.list = []
                };
                self.data.list = self.data.list.concat(res.data.list);
                self.data.next = res.data.next;
                cb && cb(self.data);
                self.trigger('complete');
            }
        });
    }
});
/*
 *  分类下的商品列表
 */
store.goods = flux.createStore({
    get: function(params) {
        var self = this;
        httpGet({
            url: api.goods,
            params: params,
            success: function(res) {
                self.data = res.data;
                self.trigger('complete');
            }
        });
    },

    create: function(params, cb) {
        var self = this;
        utils.loadShow();
        httpPost({
            url: api.createGood,
            params: params,
            success: function(res) {
                cb && cb();
                self.get({
                    cateId: params.parentCateId,
                    next: 0
                });
                utils.sync('Goods');
            },
            complete: function(res) {
                utils.loadHide();
            }
        })
    },

    cashCreate: function(params, cb) {
        var self = this;
        utils.loadShow();
        httpPost({
            url: api.createGood,
            params: params,
            success: function(res) {
                cb && cb(res.data);
            },
            complete: function(res) {
                utils.loadHide();
            }

        })
    },

    update: function(params, cb) {
        var self = this;
        utils.loadShow();
        httpPost({
            url: api.updateGood,
            params: params,
            success: function(res) {
                cb && cb();
                self.get({
                    cateId: params.parentCateId,
                    next: 0
                });
                utils.sync('Goods');
            },
            complete: function(res) {
                utils.loadHide();
            }
        })
    },
    updateforstor: function(params, cb) {
        var self = this;
        utils.loadShow();
        httpPost({
            url: api.updateGood,
            params: params,
            success: function(res) {
                cb && cb();
                utils.sync('Goods');
            },
            complete: function(res) {
                utils.loadHide();
            }
        })
    },

    delete: function(params, cb) {
        var self = this;
        utils.loadShow();
        httpPost({
            url: api.deleteGood,
            params: params,
            success: function(res) {
                cb && cb();
                self.get({
                    cateId: params.parentCateId,
                    next: 0
                });
                utils.sync('Goods');
            },
            complete: function(res) {
                utils.loadHide();
            }
        })
    },

    getMore: function(params, cb) {
        var self = this;
        httpGet({
            url: api.goods,
            params: params,
            success: function(res) {
                if (!self.data.list) {
                    self.data.list = []
                };
                self.data.list = self.data.list.concat(res.data.list);
                self.data.next = res.data.next;
                cb && cb(res.data.next);
                self.trigger('complete');
            }
        });
    }
});

/*
 * 员工信息
 */
store.employee = flux.createStore({
    get: function(params) {
        var self = this;
        httpGet({
            url: api.employees,
            params: params,
            success: function(res) {
                self.data = res.data;
                self.trigger('complete');
            }
        });
    },

    create: function(params, cb,comb) {
        var self = this;
        httpPost({
            url: api.updateEmployee,
            params: params,
            success: function(res) {
                cb && cb();

                self.get();
                utils.toast('创建成功');
                utils.sync('User');
            },
            complete:function(status){
              comb();
            }
        })
    },

    update: function(params) {
        var self = this;
        httpPost({
            url: api.updateEmployee,
            params: params,
            success: function(res) {
                self.get();
                utils.toast('保存成功');
                utils.sync('User');
            }
        })
    },

    delete: function(params, cateId) {
        var self = this;
        httpPost({
            url: api.delEmployee,
            params: params,
            success: function(res) {
                self.get();
                utils.toast('删除成功');
                utils.sync('User');
            }
        })
    }
});
store.business = flux.createStore({
    get: function(params) {
        var self = this;
        httpGet({
            url: api.goodsRank,
            params: params,
            success: function(res) {
                self.data = res.data;
                self.trigger('complete');
            }
        });
    }
});


store.search = flux.createStore({
    get: function() {
        this.data = this.data || null;
        this.trigger('complete');
    },

    clear: function() {
        this.data = null;
        this.trigger('complete');
    },

    fetch: function(params) {
        var self = this;
        httpGet({
            url: api.searchGoods,
            params: params,
            success: function(res) {
              // if(res && res.data){
              //   for (var i = 0; i < res.data.length; i++) {
              //     if(res.data[i].unit=='6' || res.data[i].unit=='9'){
              //       res.data[i].stockNum = (res.data[i].stockNum / 1000).toFixed(3) * 1;
              //     }else if(res.data[i].unit=='7' || res.data[i].unit=='8'){
              //       res.data[i].stockNum = (res.data[i].stockNum / 1000000).toFixed(3) * 1;
              //     }else if(res.data[i].unit=='5'){
              //       res.data[i].stockNum = (res.data[i].stockNum / 1000000 * 2).toFixed(3) * 1;
              //     }
              //   }
              // }
                self.data = res.data;
                self.trigger('complete');
            }
        });
    }
});

/*
 *  销售单列表
 */
store.salesOrder = flux.createStore({
    get: function(params) {
        var self = this;
        httpGet({
            url: api.salesOrder,
            params: params,
            success: function(res) {
                self.data = res.data;
                self.trigger('complete');
            }
        });
    }

});

/*
 *  店铺信息
 */
store.storeMessage = flux.createStore({
    get: function(params, callback) {
        var self = this;
        utils.loadShow();
        httpGet({
            url: api.storeMessage,
            params: params,
            success: function(res) {
                self.data = res.data;
                callback && callback(res.data);
                self.trigger('complete');
            }
        });
    },
    update: function(params) {
        var self = this;
        utils.loadShow();
        httpPost({
            url: api.updateMessage,
            params: params,
            success: function(res) {
                self.get();
                utils.toast('保存成功');
                utils.sync('Store');

                store.sys.sendMessage({
                    updateStoreMessage: true
                })
            },
            complete: function(res) {
                utils.loadHide();
            }
        });
    }

});


/*
 * 挂单
 */
store.bill = flux.createStore({
    get: function() {
        this.data = this.data || null;
        this.trigger('complete');
        store.sys.sync();
    },

    add: function() {
        var self = this;
        httpPost({
            url: api.addBill,
            success: function(res) {
                self.open();
                store.cart.get();
                utils.sync('Bill');
            }
        });
    },

    open: function() {
        var self = this;
        httpGet({
            url: api.listBill,
            success: function(res) {
                self.data = res.data;
                self.trigger('complete');
            }
        });
    },

    take: function(params) {
        var self = this;
        httpPost({
            url: api.reviewBill,
            params: params,
            success: function(res) {
                store.cart.get();
                self.open();
            }
        });
    },

    close: function() {
        this.data = null;
        this.trigger('complete');
    }

});

/*
 * 购物车
 */

store.cart = flux.createStore({
    get: function(callback) {
        var self = this;
        httpGet({
            url: api.listCart,
            success: function(res) {
                self.data = res.data;
                if(callback){
                  callback(res.data);
                }
                self.trigger('complete');
                store.sys.sync();
            }
        });
    },

    update: function(goodsUuid, data) {
        var list = this.data.list;
        var target = data.goods;
        var added = false;

        this.data.goodsAmount = data.goodsAmount;

        if (!list.length) {
            list.push(target);
        } else if (target) {
            list.forEach(function(item, index) {
                if (item.goodsUuid == target.goodsUuid) {
                    list[index] = target;
                    added = true;
                }
            });

            if (!added) {
                list.push(target);
            }

        } else {
            this.data.list = list.filter(function(item) {
                return item.goodsUuid != goodsUuid;
            });
        }
        store.detail.set(data.goods);

        this.trigger('complete');
        store.sys.sync();
    },

    setState: function(state) {
        if (state == this.state) {
            return;
        } else {
            this.state = state;
            this.clear();
        }
    },

    set: function() {
        this.trigger('complete');
    },

    add: function(goodsUuid) {
        var self = this;
        httpPost({
            url: api.addCart,
            params: {
                goodsUuid: goodsUuid
            },
            success: function(res) {
                self.update(goodsUuid, res.data);
            }
        });
    },

    reduce: function(goodsUuid) {
        var self = this;
        httpPost({
            url: api.reduceCart,
            params: {
                goodsUuid: goodsUuid
            },
            success: function(res) {
                self.update(goodsUuid, res.data);
            }
        });
    },

    addNoName: function(params) {
        var self = this;
        httpPost({
            url: api.addNoName,
            params: {
                price: params.price,
                goodsUuid: params.goodsUuid
            },
            success: function(res) {
                self.update(params.goodsUuid, res.data);
            }
        });
    },

    change: function(type, params) {
        var self = this;
        httpPost({
            url: api.changeCart,
            params: {
                type: type,
                cart: JSON.stringify(params.cart),
                goodsUuid: params.goodsUuid
            },
            success: function(res) {
                self.get();
            }
        });
    },

    clear: function() {
        var self = this;
        httpPost({
            url: api.clearCart,
            success: function(res) {
                self.data = {
                    goodsAmount: 0,
                    list: []
                };

                self.trigger('complete');
                store.sys.sync();
            }
        });
    }
});


/*
 * 结算
 */
store.pay = flux.createStore({
    get: function() {
        this.data = {};
        store.pay.open();
        store.sys.sync();
    },

    open: function(callback) {
        var self = this;
        httpPost({
            url: api.setPay,
            params: {
                action: 'open'
            },
            success: function(res) {
                self.data = res.data;
                if(callback){
                  callback(res.data);
                }
                self.trigger('complete');
            }
        });
    },

    close: function() {
        var self = this;
        httpPost({
            url: api.setPay,
            params: {
                action: 'close'
            },
            success: function(res) {
                self.data = res.data;
                self.trigger('complete');
            }
        });
    },

    commit: function(params, success) {
        var self = this;
        httpPost({
            url: api.commitPayNew,
            params: params,
            success: function(res) {
                self.data = res.data;
                success && success(res);
                store.cart.get();
                self.trigger('complete');
                store.sys.sync();
            }
        });
    }

});


store.balance = flux.createStore({
  change: function(params) {
      var self = this;
      if (store.online) {
        httpPost({
          url: api.changePay,
          params: params,
          success: function(res) {
            self.data = res.data;
            self.trigger('complete');

            store.sys.sync();
          }
        });
      }
  },
  payCoupon: function(params) {
      var self = this;
      if (store.online) {
        httpPost({
          url: api.payCoupon,
          params:params,
          success: function(res) {
            self.data = res.data;
            self.trigger('complete');
            store.sys.sync();
          }
        });
      }
  },
  wipe: function(params) {
      var self = this;
      if (store.online) {
        httpPost({
          url: api.wipePay,
          params:params,
          success: function(res) {
            self.data = res.data;
            self.trigger('complete');
            store.sys.sync();
          }
        });
      }
  },
  payVip: function(params) {
      var self = this;
      if (store.online) {
        httpPost({
          url: api.payVip,
          params:params,
          success: function(res) {
            self.data = res.data;
            self.trigger('complete');
            store.sys.sync();
          }
        });
      }
  },
  discount: function(params, success) {
      var self = this;
      if(store.online){
        httpPost({
          url: api.discountPay,
          params: params,
          success: function(res) {
            success && success(res);
            self.data = res.data;
            self.trigger('complete');

            store.sys.sync();
          }
        });
      }
  }
})
store.sys = flux.createStore({
    get: function() {
        this.timer = null;
        this.data = {};
    },

    sendMessage: function(data) {
        var self = this;
        clearTimeout(self.timer);
        self.timer = setTimeout(function() {
            httpPost({
                url: api.sysSet,
                params: {
                    value: JSON.stringify(data)
                },
                success: function(res) {
                    self.trigger('complete');
                }
            });
        }, 500);
    },

    sync: function() {
        store.sys.sendMessage({
            isShopping: store.cart.state === 'shopping',
            cartUpdate: true
        })
    }
});
/*
 * 商品详情
 */
store.detail = flux.createStore({
    get: function() {
        this.data = this.data || null;
        this.trigger('complete');
    },

    set: function(data) {
        this.data = data;
        this.trigger('complete');
    }
});

//--订单列表-历史订单
store.orderHistory = flux.createStore({
    get: function(params, callback) {
        var self = this;
        utils.loadShow();
        httpGet({
            url: api.orderHistory,
            params: params,
            success: function(res) {
                self.data = res.data;
                callback && callback(res.data);
                self.trigger('complete');
            },
            complete: function(res) {
                utils.loadHide();
            }
        });
    },
    getMore: function(params, callback) {
        var self = this;
        utils.loadShow();
        httpGet({
            url: api.orderHistory,
            params: params,
            success: function(res) {
                if (!self.data.list) {
                    self.data.list = []
                };
                self.data.list = self.data.list.concat(res.data.list);
                callback && callback(res.data);
                self.trigger('complete');
            },
            complete: function(res) {
                utils.loadHide();
            }
        });
    }
});
//--订单列表-今日订单
store.orderToday = flux.createStore({
    get: function(params, callback) {
        var self = this;
        utils.loadShow();
        httpGet({
            url: api.orderToday,
            params: params,
            success: function(res) {
                self.data = res.data;
                callback && callback(res.data);
                self.trigger('complete');
            },
            complete: function(res) {
                utils.loadHide();
            }
        });
    },
    getOther: function(params, callback) {
        var self = this;
        utils.loadShow();
        httpGet({
            url: api.orderToday,
            params: params,
            success: function(res) {
                self.data = res.data;
                callback && callback(res.data);
                self.trigger('complete');
            },
            complete: function(res) {
                utils.loadHide();
            }
        });
    },
    getMore: function(params, callback) {
        var self = this;
        utils.loadShow();
        httpGet({
            url: api.orderToday,
            params: params,
            success: function(res) {
                if (!self.data.list) {
                    self.data.list = []
                };
                self.data.list = self.data.list.concat(res.data.list);
                self.data.page = res.data.page;
                callback && callback(self.data);
                self.trigger('complete');
            },
            complete: function(res) {
                utils.loadHide();
            }
        });
    }
});

//--订单--待处理订单数量
store.orderConfirmed = flux.createStore({
    get: function(callback) {
        var self = this;
        httpGet({
            url: api.orderConfirmed,
            success: function(res) {
                self.data = res.data;
                callback && callback(self.data);
                self.trigger('complete');
            }
        });
    }
});

//--订单--拒绝订单
store.orderRefuse = flux.createStore({
    get: function(params, callback) {
        var self = this;
        utils.loadShow();
        httpGet({
            url: api.orderRefuse,
            params: params,
            success: function(res) {
                self.data = res.data;
                callback && callback(self);
                self.trigger('complete');
            },
            complete: function(res) {
                utils.loadHide();
            }
        });
    }
});

//--订单--订单无效
store.orderInvalid = flux.createStore({
    get: function(params, callback) {
        var self = this;
        utils.loadShow();
        httpGet({
            url: api.orderInvalid,
            params: params,
            success: function(res) {
                self.data = res.data;
                callback && callback(self);
                self.trigger('complete');
            },
            complete: function(res) {
                utils.loadHide();
            }
        });
    }
});

//--订单--确认订单
store.orderConfirm = flux.createStore({
    get: function(params, callback) {
        var self = this;
        utils.loadShow();
        httpGet({
            url: api.orderConfirm,
            params: params,
            success: function(res) {
                self.data = res.data;
                callback && callback(self);
                self.trigger('complete');
            },
            complete: function(res) {
                utils.loadHide();
            }
        });
    }
});

//--订单--完成订单
store.orderComplete = flux.createStore({
    get: function(params, callback) {
        var self = this;
        utils.loadShow();
        httpGet({
            url: api.orderComplete,
            params: params,
            success: function(res) {
                self.data = res.data;
                callback && callback(self);
                self.trigger('complete');

                // store.sys.sendMessage({
                //     StoreOrder: true
                // })
            },
            complete: function(res) {
                utils.loadHide();
            }
        });

    }
});
//--订单--改变店铺接单状态
store.upCanOrder = flux.createStore({
    get: function(params, callback) {
        var self = this;
        utils.loadShow();
        httpGet({
            url: api.upCanOrder,
            params: params,
            success: function(res) {
                self.data = res.data;
                callback && callback(self);
                self.trigger('complete');
            },
            complete: function(res) {
                utils.loadHide();
            }
        });
    }
});
//--订单--店铺详情
store.storeInfo = flux.createStore({
    get: function(params, callback) {
        var self = this;
        httpGet({
            url: api.storeInfo,
            params: params,
            success: function(res) {
                self.data = res.data;
                callback && callback(res.data);
                self.trigger('complete');
            }
        });
    }
});

//--订单--请求新订单状态
store.newOrderHint = flux.createStore({
    get: function(callback) {
        var self = this;
        httpGet({
            url: api.newOrderHint,
            success: function(res) {
                self.data = res.data;
                callback && callback(self.data);
                self.trigger('complete');
            },
            noToast: true
        });
    }
});

//订单--打印订单
store.printOrderDetail = flux.createStore({
    get: function(params) {
        var self = this;
        httpGet({
            url: api.printOrderDetail,
            params: params,
            success: function(res) {
                self.trigger('complete');
            }
        });
    },
    print: function(params,callback) {
        var self = this;
        if (store.online) {
          httpGet({
              url: api.printerInfo,
              params: params,
              success: function(res) {
                  callback && callback(res.data);
                  self.trigger('complete');
              }
          });
        }
    }
});
store.stock = flux.createStore({
  get: function() {
      this.data = this.data || null;
      this.trigger('complete');
  },
  set: function(data) {
    this.data = data;
    this.trigger('complete');
  }
})
//库存--入库添加商品
store.stockAdd = flux.createStore({
    get: function(params, callback) {
        var self = this;
        httpGet({
            url: api.stockAdd,
            params: params,
            success: function(res) {
                self.data = res.data;
                callback && callback(self.data);
                self.trigger('complete');
            }
        });
    },
    update: function(goodsUuid, data) {
        var list = this.data.list;
        var target = data.goods;
        var added = false;

        this.data.goodsAmount = data.goodsAmount;

        if (!list.length) {
            list.push(target);
        } else if (target) {
            list.forEach(function(item, index) {
                if (item.goodsUuid == target.goodsUuid) {
                    list[index] = target;
                    added = true;
                }
            });

            if (!added) {
                list.push(target);
            }

        } else {
            this.data.list = list.filter(function(item) {
                return item.goodsUuid != goodsUuid;
            });
        }
        store.stock.set(data);
        this.trigger('complete');
        store.sys.sync();
    },
    set: function(data) {
      this.data = data;
      this.trigger('complete');
    }
});
//库存--增加商品数量
store.stockIncr = flux.createStore({
    get: function(params, callback) {
        var self = this;
        httpGet({
            url: api.stockIncr,
            params: params,
            success: function(res) {
                self.data = res.data;
                callback(self.data);
                self.trigger('complete');
            }
        });
    }
});
//库存--减少商品数量
store.stockDecr = flux.createStore({
    get: function(params, callback) {
        var self = this;
        httpGet({
            url: api.stockDecr,
            params: params,
            success: function(res) {
                self.data = res.data;
                callback(self.data);
                self.trigger('complete');
            }
        });
    }
});

//库存--生成库存单据
store.stockCommit = flux.createStore({
    get: function(params, callback) {
        var self = this;
        utils.loadShow();
        httpGet({
            url: api.stockCommit,
            params: params,
            success: function(res) {
                self.data = res.data;
                callback(self);
                self.trigger('complete');
            },
            complete: function(res) {
                utils.loadHide();
            }
        });
    },
    clear: function(params) {
        var self = this;
        httpGet({
            url: api.stockClear,
            params: params,
            success: function(res) {
                self.data = res.data;
                self.trigger('complete');
            }
        });
    }
});

//库存--查询库存单据
store.stockListByDate = flux.createStore({
    get: function(params) {
        var self = this;
        utils.loadShow();
        httpGet({
            url: api.stockListByDate,
            params: params,
            success: function(res) {
                self.data = res.data;
                self.trigger('complete');
            },
            complete: function(res) {
                utils.loadHide();
            }
        });
    },
    getMore: function(params, cb) {
        var self = this;
        utils.loadShow();
        httpGet({
            url: api.stockListByDate,
            params: params,
            success: function(res) {
                if (!self.data.list) {
                    self.data.list = []
                };
                self.data.list = self.data.list.concat(res.data.list);
                self.data.next = res.data.next;
                cb && cb(res.data.next);
                self.trigger('complete');
            },
            complete: function(res) {
                utils.loadHide();
            }
        });
    }
});

//库存--库存单据商品列表
store.stockGoodsList = flux.createStore({
    get: function(params, callback) {
        var self = this;
        utils.loadShow();
        httpGet({
            url: api.stockGoodsList,
            params: params,
            success: function(res) {
                self.data = res.data;
                callback(self.data);
                self.trigger('complete');
            },
            complete: function(res) {
                utils.loadHide();
            }
        });
    }
});

//库存--供应商添加或更新
store.supplierAddOrUpdate = flux.createStore({
    get: function(params, callback) {
        var self = this;
        utils.loadShow();
        httpPost({
            url: api.supplierAddOrUpdate,
            params: params,
            success: function(res) {
                self.data = res.data;
                callback(self.data);
                self.trigger('complete');
            },
            complete: function(res) {
                utils.loadHide();
            }
        });
    }
});
//库存--删除供应商
store.supplierDel = flux.createStore({
    get: function(params, callback) {
        var self = this;
        utils.loadShow();
        httpPost({
            url: api.supplierDel,
            params: params,
            success: function(res) {
                self.data = res.data;
                callback(self);
                self.trigger('complete');
            },
            complete: function(res) {
                utils.loadHide();
            }
        });
    }
});
//库存--供应商列表
store.supplierList = flux.createStore({
    get: function(params) {
        var self = this;
        utils.loadShow();
        httpGet({
            url: api.supplierList,
            params: params,
            success: function(res) {
                self.data = res.data;
                self.trigger('complete');
            },
            complete: function(res) {
                utils.loadHide();
            }
        });
    }
});

//我的数据
store.dataDashboard = flux.createStore({
    get: function(params, callback) {
        var self = this;
        utils.loadShow();
        httpGet({
            url: api.dataDashboard,
            params: params,
            success: function(res) {
                self.data = res.data;
                callback && callback(self.data);
                self.trigger('complete');
            },
            complete: function(res) {
                utils.loadHide();
            }
        });
    }
});
store.shiftRecordByDate = flux.createStore({
    get: function(params, callback) {
        var self = this;
        // if(store.online) {
          httpGet({
            url: api.shiftRecordByDate,
            params: params,
            success: function(res) {
              console.log(typeof(res) + '------交接班-------');
              self.data = res.data;
              callback && callback(self.data);
              self.trigger('complete');
            },
          });
        // }
    }
});

store.downTemplateExcel = flux.createStore({
    get: function(params) {
        var self = this;
        httpGet({
            url: api.downTemplateExcel,
            params: params,
            success: function(res) {
                self.data = res.data;
                self.trigger('complete');
            }
        });
    }
});

store.importTemplate = flux.createStore({
    get: function(callback) {
        var self = this;
        httpGet({
            url: api.importTemplate,
            success: function(res) {
                self.data = res.data;
                callback && callback(self.data);
                self.trigger('complete');
            }
        });
    }
});

store.synTask = flux.createStore({
    get: function(params, callback) {
        var self = this;
        if(!params.noloadShow){
            utils.loadShow();
        }
        if (window.Icommon) {
            httpGet({
                url: api.synTask,
                params: params,
                success: function() {
                    //        			utils.toast("商品同步成功");
                    callback && callback({
                        success: true
                    });
                    utils.loadHide();
                    self.trigger('complete');
                },
                error: function() {
                    callback && callback({
                        success: false
                    });
                    utils.loadHide();
                    utils.toast("同步失败");
                }

            });
        } else {
            //        	utils.toast("商品同步成功");
            utils.loadHide();
            setTimeout(function() {
                callback && callback({
                    success: true
                });
            }, 3000);

        }
    }
});
store.downloadApp = flux.createStore({
    get: function(appInfo, callback) {
        var self = this;
        httpGet({
            url: api.downloadApp,
            params: {
                appInfo: appInfo
            },
            success: function(res) {
                self.data = res.data;
                callback && callback(self.data);
                self.trigger('complete');
            }
        });
    }
});

store.unInstall = flux.createStore({
    get: function(appInfo, callback) {
        var self = this;
        httpGet({
            url: api.unInstall,
            params: {
                appInfo: appInfo
            },
            success: function(res) {
                self.data = res.data;
                callback && callback(self.data);
                self.trigger('complete');
            }
        });
    }
});
store.downRegister = flux.createStore({
    get: function() {
        var self = this;
        httpGet({
            url: api.downRegister,
            success: function() {
                self.trigger('complete');
            }
        });
    }
});

store.appList = flux.createStore({
    get: function(callback) {
        var self = this;
        httpGet({
            url: api.appList,
            success: function(res) {
                self.data = res.data;
                callback && callback(self.data);
                self.trigger('complete');
            },
            noToast: true
        });
    }
});

store.getappinfo = flux.createStore({
    get: function(callback) {
        var self = this;
        httpGet({
            url: api.getappinfo,
            success: function(res) {
                self.data = res.data;
                callback && callback(self.data);
                self.trigger('complete');
            }
        });
    }
});

store.showPayQrCode = flux.createStore({
    get: function(params, callback) {
        var self = this;
        httpGet({
            url: api.showPayQrCode,
            params: params,
            success: function(res) {
                self.data = res.data;
                callback && callback(self.data);
                self.trigger('complete');
            }
        });
    }
});

store.judgeBqCommercial = flux.createStore({
    get: function(callback) {
        var self = this;
        httpGet({
            url: api.judgeBqCommercial,
            complete: function(res) {
                //			success: function(res) {
                self.data = res.isBqCommercial;
                window.isBqCommercial = res.isBqCommercial;
                callback && callback(res.isBqCommercial);
                self.trigger('complete');
            }
        });
    }
});

store.initPush = flux.createStore({
    get: function() {
        var self = this;
        httpGet({
            url: api.initPush,
            complete: function(res) {
            }
        });
    }
});

store.closeStore = flux.createStore({
    get: function() {
        var self = this;
        httpGet({
            url: api.showAds,
            params: {
                show: false
            },
            success: function(res) {}
        });
    }
});

store.getGoodsCountByCateId = flux.createStore({
    get: function(params, callback) {
        var self = this;
        httpGet({
            url: api.getGoodsCountByCateId,
            params: params,
            success: function(res) {
                callback && callback(res.data);
            }
        });
    }
});

export {
    store,
    httpGet,
    httpPost
};
