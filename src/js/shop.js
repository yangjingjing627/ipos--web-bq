//riot tags需要的依赖
import flux from 'riot-seed-flux';
import {
    store,
    httpGet,
    httpPost
} from './store';
import $ from 'jquery';
import utils from './utils';

if (window.navigator.userAgent.match(/Cordova/)) {
    var api = require('./API-online');
} else {
    var api = require('./API-server');
}
flux.config.refresh = true;
//2.0版本需求接口

store.coupon = flux.createStore({
    get: function(params,callback) {
        var self = this;
        utils.loadShow();
        httpGet({
            url: api.couponList,
            params:params,
            success: function(res) {
                self.data = res.data;
                for (var i in res.data.list) {
                    if (res.data.list[i].source === 1 && res.data.list[i].status == 1) {
                        res.data.list[i].bacolor = "cou-our";
                    } else if ((res.data.list[i].source === 0 || res.data.list[i].source === 3 || res.data.list[i].source === 2) && res.data.list[i].status == 1) {
                        res.data.list[i].bacolor = "cou-public";
                    } else {
                        res.data.list[i].bacolor = "cou-over";
                    }
                }
                callback && callback(res.data);
                self.trigger('complete');
            },
            complete:function(){
              utils.loadHide();
            }
        });
    },
    info: function(params, callback) {
        var self = this;
        utils.loadShow();
        httpGet({
            url: api.couponInfo,
            params: params,
            success: function(res) {
                self.data = res.data;
                callback && callback(res.data);
                self.trigger('complete');
            },
            complete: function(data) {
              utils.loadHide();
            }
        });
    },
    create: function(params, callback) {
        var self = this;
        utils.loadShow();
        httpPost({
            url: api.couponCreate,
            params: params,
            success: function(res) {
                self.data = res.data;
                callback && callback(res.data);
                self.trigger('complete');
            },
            complete: function(data) {
              utils.loadHide();
            }
        });
    },

    stop: function(params, callback) {
        var self = this;
        utils.loadShow();
        httpPost({
            url: api.couponStop,
            params: params,
            success: function(res) {
                self.data = res.data;
                callback && callback(res.data);
                self.trigger('complete');
            },
            complete: function(data) {
              utils.loadHide();
            }
        });
    }

});

store.memberVerify = flux.createStore({
    get: function(params,callback) {
        var self = this;
        utils.loadShow();
        httpGet({
            url: api.memberVerify,
            params:params,
            success: function(res) {
              self.data = res.data;
              callback(res.data);
              self.trigger('complete');
            },
            complete: function(data) {
              utils.loadHide();
            }
        });
    }
});
store.couponVerify = flux.createStore({
    get: function(params,callback) {
        var self = this;
        utils.loadShow();
        httpPost({
            url: api.couponVerify,
            params:params,
            success: function(res) {
              self.data = res.data;
              callback(res.data);
              self.trigger('complete');
            },
            complete: function(data) {
              utils.loadHide();
            }
        });
    }
});

//成就
store.attain = flux.createStore({
    get: function(params,callback) {
        var self = this;
        utils.loadShow();
        httpGet({
            url: api.attainList,
            params:params,
            success: function(res) {
              self.data = res.data;
              callback(res.data);
              self.trigger('complete');
            },
            complete: function(data) {
              utils.loadHide();
            }
        });
    },
    getReward:function(params,callback){
      var self = this;
      utils.loadShow();
      httpGet({
          url: api.attainReward,
          params:params,
          success: function(res) {
            self.data = res.data;
            callback(res.data);
            self.trigger('complete');
          },
          complete: function(data) {
            utils.loadHide();
          }
      });
    }

});

//奖励
store.reward = flux.createStore({
    get: function(params,callback) {
        var self = this;
        utils.loadShow();
        httpGet({
            url: api.rewardList,
            params:params,
            success: function(res) {
              self.data = res.data;
              for (var i in res.data.list) {
                  if (res.data.list[i].type === 0) {
                      res.data.list[i].classli = "re-cp";
                  } else if (res.data.list[i].type === 1 ) {
                      res.data.list[i].classli = "re-app";
                  } else if (res.data.list[i].type === 2){
                    res.data.list[i].classli = "re-ad";
                  } else {
                    res.data.list[i].classli = "re-global";
                  }
              }
              callback(res.data);
              self.trigger('complete');
            },
            complete: function(data) {
              utils.loadHide();
            }
        });
    },
    info:function(params,callback){
      var self = this;
      utils.loadShow();
      httpGet({
          url: api.rewardInfo,
          params:params,
          success: function(res) {
            self.data = res.data;
            callback(res.data);
            self.trigger('complete');
          },
          complete: function(data) {
            utils.loadHide();
          }
      });
    }
});

//查询银行卡绑定信息
store.bankCard = flux.createStore({
    get: function(callback) {
        var self = this;
        utils.loadShow();
        httpGet({
            url: api.bankCard,
            success: function(res) {
              self.data = res.data;
              callback(res.data);
              self.trigger('complete');
            },
            complete: function(data) {
              utils.loadHide();
            }
        });
    }
});

store.bankCardAdd = flux.createStore({
    get: function(params,callback) {
        var self = this;
        utils.loadShow();
        httpPost({
            url: api.bankCardAdd,
            params:params,
            success: function(res) {
              self.data = res.data;
              callback(res.data);
              self.trigger('complete');
            },
            complete: function(data) {
              utils.loadHide();
            }
        });
    }
});
store.bankCardUpdate = flux.createStore({
    get: function(params,callback) {
        var self = this;
        utils.loadShow();
        httpPost({
            url: api.bankCardUpdate,
            params:params,
            success: function(res) {
              self.data = res.data;
              callback(res.data);
              self.trigger('complete');
            },
            complete: function(data) {
              utils.loadHide();
            }
        });
    }
});

store.rewardIncomeList = flux.createStore({
    get: function(params,callback) {
        var self = this;
        utils.loadShow();
        httpGet({
            url: api.rewardIncomeList,
            params:params,
            success: function(res) {
              self.data = res.data;
              callback(res.data);
              self.trigger('complete');
            },
            complete: function(data) {
              utils.loadHide();
            }
        });
    }
});
store.mobileVerify = flux.createStore({
    get: function(params,callback) {
        var self = this;
        utils.loadShow();
        httpGet({
            url: api.mobileVerify,
            params:params,
            success: function(res) {
              self.data = res.data;
              callback(res.data);
              self.trigger('complete');
            },
            complete: function(data) {
              utils.loadHide();
            }
        });
    }
});

store.changeCardCodeSend = flux.createStore({
    get: function(callback) {
        var self = this;
        utils.loadShow();
        httpGet({
            url: api.changeCardCodeSend,
            success: function(res) {
              self.data = res.data;
              callback(res.data);
              self.trigger('complete');
            },
            complete: function(data) {
              utils.loadHide();
            }
        });
    }
});
store.advIncomeList = flux.createStore({
    get: function(params,callback) {
        var self = this;
        utils.loadShow();
        httpGet({
            url: api.advIncomeList,
            params:params,
            success: function(res) {
              self.data = res.data;
              callback(res.data);
              self.trigger('complete');
            },
            complete: function(data) {
              utils.loadHide();
            }
        });
    }
});
store.globalIncomeList = flux.createStore({
    get: function(params,callback) {
        var self = this;
        utils.loadShow();
        httpGet({
            url: api.globalIncomeList,
            params:params,
            success: function(res) {
              self.data = res.data;
              callback(res.data);
              self.trigger('complete');
            },
            complete: function(data) {
              utils.loadHide();
            }
        });
    }
});
