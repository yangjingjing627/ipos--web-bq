<modal>
    <div class="modal-dialog" style="width:{ width }; height:{ height }">
        <!-- <div class="modal-title">
            <span>{ title }</span>
            <div class="modal-close-wrap">
                <div class="modal-close"></div>
            </div>
        </div> -->
        <div class="modal-container">
	    	<div class="modal-title" if={ title }>{ title }</div>
           <yield/>
        </div>

        <div class="modal-submit" if="{ !noFooter }">
            <div class="button-wrap">

                <a class="btn btn-default cancle { small: needDelete || samllBtn } { three:continue }">{ cancleText || "取消"}</a>
                <a class="btn btn-default delete { small: needDelete || samllBtn } " if="{ needDelete }">{ deleteText || "删除"}</a>
                <a class="btn btn-primary continue { small: samllBtn } { three:continue }" if="{ continue }">{ continue || "继续添加"}</a>
                <a class="btn btn-primary submit { small: samllBtn } { three:continue }">{ submitText || "确定"}</a>
            </div>
            <div class="clearfix"></div>
        </div>
        <div class="modal-submit" if="{ buttonOk }">
            <div class="button-wrap">
                <a class="btn btn-primary cancle">{ submitText || "知道了"}</a>
            </div>
            <div class="clearfix"></div>
        </div>
        <!-- <div class="modal-submit" if="{ nocancel }">
          <div class="button-wrap">
              <a class="btn btn-primary submit { small: samllBtn } { three:continue }">{ submitText || "确定"}</a>
          </div>
          <div class="clearfix"></div>
        </div> -->
    </div>
<script>
    var self = this;
    var config = self.opts.opts || self.opts || {};
    var EL = self.root;
    self.needDelete = EL.hasAttribute('delete');
    self.noFooter = EL.hasAttribute('nofooter');
    self.samllBtn = EL.hasAttribute('small');
    self.continue = EL.hasAttribute('continue');
    self.title = EL.hasAttribute('title');
    self.buttonOk = EL.hasAttribute('buttonOk');
    // self.nocancel = EL.hasAttribute('nocancel');


    for (var i in config) {
        self[i] = config[i];
    }
    self.width = config.width || EL.getAttribute('modal-width') || '500px';
    self.height = config.height || EL.getAttribute('modal-height') || 'auto';

    self.on('mount', function() {
        var container = self.root.querySelector('.modal-container');
        // var head = self.root.querySelector('.modal-title');
        var foot = self.root.querySelector('.modal-submit');
        // var headHeight = parseInt(window.getComputedStyle(head, null).height);
        var foodHeight = foot ? parseInt(window.getComputedStyle(foot, null).height) : 0;
        if (self.height && self.height!== 'auto') {
            container.style.height = (parseInt(self.height) - foodHeight - 2) + 'px';
        }
        self.bindEvent();
    })


    self.root.open = self.open = function(params) {
        self.root.style.display = 'flex';
        self.onOpen && self.onOpen(params);
    }

    self.root.close = self.close = function(params) {
        self.root.style.display = 'none';
        self.onClose && self.onClose(params);
    }

    self.root.loadData = function(newData, colName){
        colName = colName || 'data';
        self[colName] = newData
        self.update();
    }

    self.confirm = self.root.confirm = function(params) {
        self.onSubmit && self.onSubmit(params);
    }

	 self.goonButton = self.root.goonButton = function(params) {
        self.onContinue && self.onContinue(params);
    }

    self.delete = self.root.delete = function(params) {
        self.onDelete && self.onDelete(params);
    }

    self.bindEvent = function() {
        //防止关闭/提交时触发整体的update,手动绑定事件，提升性能
        $(EL).find('.modal-close-wrap').on('click', self.close);
        $(EL).find('.cancle').on('click', self.close);
        $(EL).find('.delete').on('click', self.delete);
        $(EL).find('.submit').on('click', self.confirm);
        $(EL).find('.continue').on('click', self.goonButton);
        // $(EL).find('.paysubmit').on('click', self.confirm);

    }
    </script>
</modal>
