define(['backbone', './AssetView', './AdvertView', './FileUploader', 'text!./../template/assetsAdvert.html'],
	function (Backbone, AssetView, AdvertView, FileUploader, assetsTemplate) {
	return Backbone.View.extend({

		template: _.template(assetsTemplate),

		initialize: function(o) {
			this.options = o;
			this.config = o.config;
			this.pfx = this.config.stylePrefix || '';
			this.ppfx = this.config.pStylePrefix || '';
			this.listenTo( this.collection, 'add', this.addToAsset );
			this.listenTo( this.collection, 'deselectAll', this.deselectAll );
			this.className	= this.pfx + 'assets';
			this.events = {};
			this.events.submit = 'addFromStr';
			this.delegateEvents();
		},

		/**
		 * Add new asset to the collection via string
		 * @param {Event} e Event object
		 * @return {this}
		 * @private
		 */
		addFromStr: function(e){
			console.log("add button event");
			e.preventDefault();

			var input = this.getInputUrl();

			var url = input.value.trim();

			if(!url)
				return;

			this.collection.addImg(url, {at: 0});
			this.getAssetsEl().scrollTop = 0;
			input.value = '';
			/*this.updateTarget(this.model.get('src'));
			var f				=  this.model.collection.onSelect;
			if(f && typeof f == 'function'){
				f(this.model);
			}*/
			return this;
		},

		/**
		 * Update target if exists
		 * @param	{String}	v 	Value
		 * @private
		 * */
		updateTarget: function(v){
			console.log("update  select");
			var target			= this.model.collection.target;
			if(target && target.set){
				var attr		= _.clone( target.get('attributes') );
				target.set('attributes', attr );
				target.set('src', v );
			}
		},

		/**
		 * Returns assets element
		 * @return {HTMLElement}
		 * @private
		 */
		getAssetsEl: function(){
			//if(!this.assets) // Not able to cache as after the rerender it losses the ref
			this.assets = this.el.querySelector('.' + this.pfx + 'assets');
			return this.assets;
		},

		/**
		 * Returns input url element
		 * @return {HTMLElement}
		 * @private
		 */
		getInputUrl: function(){
			if(!this.inputUrl || !this.inputUrl.value)
				this.inputUrl = this.el.querySelector('.'+this.pfx+'add-asset input');
			return this.inputUrl;
		},

		/**
		 * Add asset to collection
		 * @private
		 * */
		addToAsset: function(model){
			this.addAsset(model);
		},

		/**
		 * Add new asset to collection
		 * @param Object Model
		 * @param Object Fragment collection
		 * @return Object Object created
		 * @private
		 * */
		addAsset: function(model, fragmentEl){
			console.log("add imgge");
			var fragment	= fragmentEl || null;
			var viewObject	= AssetView;

			if(model.get('type').indexOf("image") > -1)
				viewObject	= AdvertView;

			var view 		= new viewObject({
				model	: model,
				config	: this.config,
			});
			var rendered	= view.render().el;

			if(fragment){
				fragment.appendChild( rendered );
			}else{
				var assetsEl = this.getAssetsEl();
				if(assetsEl)
					assetsEl.insertBefore(rendered, assetsEl.firstChild);
			}

			return rendered;
		},

		/**
		 * Deselect all assets
		 * @private
		 * */
		deselectAll: function(){
			this.$el.find('.' + this.pfx + 'highlight').removeClass(this.pfx + 'highlight');
		},

		render: function() {
			console.log("render advert added");
			var fragment = document.createDocumentFragment();
			this.$el.empty();

			this.collection.each(function(model){
				this.addAsset(model, fragment);
			},this);

			this.$el.html(this.template({
				pfx:	this.pfx,
				ppfx: this.ppfx,
			}));

			this.$el.find('.'+this.pfx + 'assets').append(fragment);
			return this;
		}
	});
});
