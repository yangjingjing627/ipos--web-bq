<app-index>
    <ul class="app-index">
        <li each="{ list }" onclick="{ downorlook }" onmousedown="{ deleteApp }">
            <div class="app-list">
                <div class="app-img">
                    <img src="{ icon }">
                </div>
                <div class="no-down downloading" if={ status==3 || status==1 }>
                    <div class="download-no" style="height:{ noDown }%"></div>
                    <div class="download-yes" style="height:{ progress }%"></div>
                    <div class="downloading-word">{ progress || 0 }%</div>
                </div>
                <div class="no-down" if={ status !=7 }></div>
            </div>
            <div class="app-name">{ name }</div>
        </li>
        <!--         <a onclick="{ scan }">getAppInfo</a> -->
        <div class="clearfix"></div>
    </ul>

    <script>
        var self = this;
        //  状态处理  status＝＝1 下载已连接 status＝＝3  下载中 status＝＝7 已安装 status＝＝6 下载完成
        //type==0 未解锁  type==1有权限   type==2奖励获得权限
        self.downorlook = function (e) {
            if (e.item.type == 0) {
                utils.toast("您还未解锁当前应用，完成相应成就即可解锁");
                return;
            }
            clearTimeout(timeoutDelete);
            var appInfo = JSON.stringify(e.item);
            if (e.item.status == 3) {
                utils.toast('正在下载');
                return;
            }
            store.downloadApp.get(appInfo, function () {});
        }

        function getAppInfo() {
            var appInfo = Idownload.appinfo;
            appInfo = JSON.parse(appInfo);
            if (appInfo.nativeUpdate) {
                self.init();
            } else {
                for (var i = 0; i < self.list.length; i++) {
                    if (self.list[i].packageName == appInfo.packageName) {
                        self.list[i] = appInfo;
                        self.list[i].noDown = 100 - appInfo.progress;
                        break;
                    }
                }
            }
            self.update();
        };

        self.init = function () {
            store.getappinfo.get(function (data) {
                if (window.Icommon) {
                    self.list = JSON.parse(data);
                } else {
                    self.list = data;
                }
                self.update();
                store.appList.get(function (data) {
                    if (self.list.length > 0) {
                        var newAppList = "";
                        if (data && data.length > 0) {
                            for (var j = 0; j < self.list.length; j++) {
                                newAppList += self.list[j].packageName + "  ";
                            }
                            for (var i = 0; i < data.length; i++) {
                                if (newAppList.indexOf(data[i].packageName) < 0) {
                                    self.list.push(data[i]);
                                } else {
                                    for (var k = 0; k < self.list.length; k++) {
                                        if (self.list[k].packageName == data[i].packageName) {
                                            self.list[k].type = data[i].type;
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        self.list = data;
                    }
                    //获取服务器列表；
                    self.update();
                });
            })
        }
        var timeoutDelete;
        self.on('mount', function () {
            self.init();
            window.addEventListener('sendappinfo', getAppInfo, false);
            self.deleteApp = function (e) {
                var appInfo = JSON.stringify(e.item);
                if (e.item.status == 7 && e.item.type != 0 ) {
                    timeoutDelete = setTimeout(function () {
                        if (confirm("是否删除?")) {
                            store.unInstall.get(appInfo, function () {});
                        }
                    }, 1500);
                }
            }
            //         	//取消
            $(".app-list").mouseup(function (e) {
                clearTimeout(timeoutDelete);
            });

            $(".app-list").mouseout(function (e) {
                clearTimeout(timeoutDelete);
            });

            self.update();
        });

        self.on('unmount', function () {
            clearTimeout(timeoutDelete);
            window.removeEventListener('sendappinfo', getAppInfo);
        });
    </script>
</app-index>
