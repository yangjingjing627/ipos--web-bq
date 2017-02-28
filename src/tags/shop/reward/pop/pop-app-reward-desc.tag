<pop-app-reward-desc>
    <div class="reward-pop">
        <h2>解锁应用:</h2>
        <h5>该奖励可以让您解锁
          <i>{ apps }</i>
          应用,请到"应用"处下载并体验！</h5>
        <div style="height:30px"></div>
    </div>
    <script>

        var self = this;
        var modal = self.parent;
        modal.onOpen = function (params) {
            var param = {
                reachRecordId: params.rewardRecordId
            }
            store.reward.info(param, function (data) {
                self.app = data.apps;
                var apps = "";
                for (var i = 0; i < data.apps.length; i++) {
                  apps = data.apps[i].name+"、";
                }
                apps = apps.substring(0,apps.length-1);
                self.apps = apps;
                self.update();
            });
        }

        modal.onClose = function () {}

        modal.onSubmit = function () {

            modal.close();
        }
    </script>
</pop-app-reward-desc>
