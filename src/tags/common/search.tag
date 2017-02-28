<search>
	<div class="search-wraper">
		<div class="input-wraper {active: searchWord}">
			<input type="text" class="search-input" oninput="{ search }" onblur="{ blur }">
			<span class="cancel-input" onclick="{ cancelSearch }"></span>
			<ul if={ searchResult.length }>
				<li each={ item in searchResult } onclick={ handleClick(item) }>{ item.goodsName } <span>￥{ item.price }</span></li>
			</ul>
		</div>
<!-- 		<span class="search-submit">搜索</span> -->
	</div>

	<script>
		var self = this;
		var config = self.opts.opts;
		var timer = 200;

		flux.bind.call(self, {
			name: 'searchResult',
			store: store.search,
			success: function(){
				self.update();
			}
		});
		self.search = function(e){
			var target = $(e.target);
			self.searchWord = target.val();
			clearTimeout(self.timer);
			self.timer = setTimeout(function(){
				if (self.searchWord){
					store.search.fetch({
						q: self.searchWord
					});
				}
			}, timer);

		};

		self.cancelSearch = function(){
			$(self.root).find('.search-input').val('');
			self.searchWord = null;
		};

		self.blur = function(){
			setTimeout(function(){
				store.search.clear();
				self.searchResult = null;
			},timer);
		};

		self.handleClick = function(item){
			return function(){
				console.log(item);
				config.clickHandle(item);
				self.cancelSearch();
			}
		};

	</script>
</search>
