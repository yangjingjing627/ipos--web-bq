<storage-index>
	<ul>
        <li each="{ list }">
            <a onclick="{ linkUrl }">
                <img src="{ img }">
                <div>{ name }</div>
            </a>
        </li>
    </ul>
    <script>
        var self = this;
        self.list = [
            {  name: '入库', img: 'imgs/import.png', link: '#/shop/storagein' ,loginName:'0401'},
            {  name: '出库', img: 'imgs/export.png', link: '#/shop/storageout',loginName:'0402' },
            {  name: '单据', img: 'imgs/shop-order.png', link: '#/shop/receipt' ,loginName:'0403'},
            {  name: '供货商', img: 'imgs/supplier.png', link: '#/shop/supplier' ,loginName:'0404'}
        ]

        linkUrl(e){
            self.log(e.item.loginName);
						location.href = e.item.link;
						utils.setTitle(e.item.link, e.item.name)
        }
				
        //埋点
        self.log = function(name) {
					utils.androidBridge(api.logEvent,{eventId: name})
        }


    </script>

</storage-index>
