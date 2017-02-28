<life-service>
  <ul>
      <li class="serviceItem" each="{ list }" onclick="{  }" if={ show }>
          <a>
              <img src="{ img }">
              <div>{ name }</div>
          </a>
      </li>
      <div class="clearfix"></div>
  </ul>
  <script type="text/javascript">
  var self = this;
    self.list = [
      {  name: '洗衣', img: 'imgs/loundry-service.png', link: '#/shop/sales-order', show:true },
      {  name: '鲜花', img: 'imgs/flower.png', link: '#/shop/products', show:true },
      {  name: '蛋糕', img: 'imgs/cake.png', link: '#/shop/storage', show:true },
      {  name: '快递', img: 'imgs/post.png', link: '#/shop/chart' , show:true},
      {  name: '家政', img: 'imgs/house-service.png', link: '#/shop/device', show:true },

      {  name: '话费充值', img: 'imgs/phone-free.png', link: '#/shop/employee', show:true},
      {  name: '水费', img: 'imgs/water-free.png', link: '#/shop/message', show:true },
      {  name: '电费', img: 'imgs/elec-free.png', link: '#/shop/attain', show:true },
      {  name: '燃气费', img: 'imgs/gap.png', link: '#/shop/reward', show:true },
      {  name: '有线电视', img: 'imgs/line-TV.png', link: '#/shop/coupon', show:true },

      {  name: '固话宽带', img: 'imgs/bind-free.png', link: '#/shop/service', show:true },
      {  name: '物业费', img: 'imgs/property.png', link: '#/shop/coupon', show:true },
      {  name: '火车票', img: 'imgs/train-ticket.png', link: '#/shop/coupon', show:true },
      {  name: '汽车票', img: 'imgs/car-ticket.png', link: '#/shop/coupon', show:true },
      {  name: '租车', img: 'imgs/rent-car.png', link: '#/shop/coupon', show:true },

      {  name: '医院挂号', img: 'imgs/line-num.png', link: '#/shop/coupon', show:true }
  ];
  self.noAuthTip = function(e) {
      // self.log(e.item.logName);
          location.href = e.item.link;
          return true;
  }
  self.on('mount',function(){
    $('.serviceItem').each(function(){
      $(this).on('click',function(){
        utils.toast('该地区尚未开通');
      })
    })
  })
  </script>
</life-service>
