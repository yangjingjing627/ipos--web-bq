<pop class="{ popz-big:popzBig }{ popzbigTwo:popzbigTwo }">
    <div class="modal-dialog" style="width:{ width }; height:{ height }">
        <div class="pop-title" if={ title }>
            <span>{ title }</span>
            <div class="pop-help-wrap" if={ help }>
                <a class="pop-help"></a>
            </div>
            <div class="pop-wclose-wrap" if={ popclose } onclick="{ wclose }">
            </div>
        </div>
        <div class="modal-container pop-content">
            <yield/>
        </div>
        <div class="pop-submit" if="{ twoButton }">
            <div class="button-wrap">
                <a class="cancle">{ cancleText || "取消" }</a>
                <a class="sure">{ sureText || "确定" }</a>
            </div>
            <div class="clearfix"></div>
        </div>
        <div class="pop-submit" if="{ oneButton }">
            <div class="button-wrap">
                <a class="konw">{ konwText || '知道了' }</a>
            </div>
        </div>
    </div>
    <script>
        var self = this;
        var config = self.opts.opts || self.opts || {};
        var EL = self.root;
        self.title = EL.hasAttribute('title');
        self.twoButton = EL.hasAttribute('twobutton');
        self.oneButton = EL.hasAttribute('onebutton');
        self.popzBig = EL.hasAttribute('popzbig');
        self.popzbigTwo = EL.hasAttribute('popzbigtwo');
        self.sureText = EL.hasAttribute('suretext')? config.suretext : "确定";
        self.cancleText = EL.hasAttribute('cancletext') ? config.cancletext: "取消";
        self.konwText = EL.hasAttribute('konwtext') ? config.konwtext : "知道了";
        self.help = EL.hasAttribute('help');
        self.popclose = EL.hasAttribute('popclose');

        for (var i in config) {
          self[i] = config[i];
        }
        self.width = config.width || EL.getAttribute('modal-width') || '500px';
        self.height = config.height || EL.getAttribute('modal-height') || 'auto';

        self.on('mount', function () {
            var container = self.root.querySelector('.modal-container');
            // var head = self.root.querySelector('.modal-title');
            var foot = self.root.querySelector('.pop-submit');
            // var headHeight = parseInt(window.getComputedStyle(head, null).height);
            var foodHeight = foot
                ? parseInt(window.getComputedStyle(foot, null).height)
                : 0;
            if (self.height && self.height !== 'auto') {
                container.style.height = (parseInt(self.height) - foodHeight - 2) + 'px';
            }
            self.bindEvent();
        })

        self.root.open = self.open = function (params) {
            self.root.style.display = 'flex';
            self.onOpen && self.onOpen(params);
        }

        self.root.close = self.close = function (params) {
            self.root.style.display = 'none';
            self.onClose && self.onClose(params);
        }

        self.root.loadData = function (newData, colName) {
            colName = colName || 'data';
            self[colName] = newData
            self.update();
        }

        self.confirm = self.root.confirm = function (params) {
            self.onSubmit && self.onSubmit(params);
        }

        self.helpbutton = self.root.helpbutton = function (params) {
            self.onHelp && self.onHelp(params);
        }

        self.konw = self.root.konw = function (params) {
            self.root.style.display = 'none';
            self.onClose && self.onClose(params);
        }

        self.wclose = self.root.wclose = function (params) {
            self.root.style.display = 'none';
            self.onClose && self.onClose(params);
        }

        self.bindEvent = function () {
            //防止关闭/提交时触发整体的update,手动绑定事件，提升性能
            $(EL).find('.pop-help').on('click', self.helpbutton);
            $(EL).find('.cancle').on('click', self.close);
            $(EL).find('.konw').on('click', self.konw);
            $(EL).find('.sure').on('click', self.confirm);
            $(EL).find('.pop-wclose-wrap').on('click', self.wclose);
        }
    </script>
</pop>
