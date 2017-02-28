<device-index>
	<ul>
        <li each="{ list }">
            <a  onclick="{ noAuthTip }">
                <img src="{ img }">
                <div>{ name }</div>
            </a>
        </li>
        <div class="clearfix"></div>
    </ul>

    <script>
        var self = this;

        self.list = [
            {  name: '小票打印机', img: 'imgs/order-printer.png', link: '#/shop/order-printer' },
            // {  name: '标签打印机', img: 'imgs/tag-printer.png', link: '#/shop/tag-printer' }
        ];
				self.noAuthTip = function() {
					utils.setTitle(self.list[0].link, self.list[0].name)
				}

    </script>
</device-index>
