define(['./AssetView','text!./../template/assetAdvert.html'],
	function (AssetView, assetTemplate) {
	return AssetView.extend({

		events:{
			'click' 			: 'selected',
			'dblclick' 		: 'chosen',
		},

		template: _.template(assetTemplate),

		initialize: function(o) {
			AssetView.prototype.initialize.apply(this, arguments);
			this.className	+= ' ' + this.pfx + 'asset-image';
			this.events['click #' + this.pfx + 'close']	= 'removeItem';
			this.delegateEvents();
		},

		/**
		 * Trigger when asset is been selected
		 * @private
		 * */
		selected: function(){
			console.log("get select event");
			this.model.collection.trigger('deselectAll');
			this.$el.addClass(this.pfx + 'highlight');

			this.updateTarget(this.model.get('src'));
		},

		/**
		 * Trigger when asset is been chosen (double clicked)
		 * @private
		 * */
		chosen: function(){
			console.log(this.model.get('src'));
			this.updateTarget(this.model.get('src'));
			var f =  this.model.collection.onSelect;
			if(f && typeof f == 'function'){
				f(this.model);
			}
		},

		/**
		 * Update target if exists
		 * @param	{String}	v 	Value
		 * @private
		 * */
		updateTarget: function(v){
			var target			= this.model.collection.target;
			console.log(target);
			if(target && target.set){
				var attr		= _.clone( target.get('attributes'));
				target.set('attributes', attr );
				target.set('src', v );
			}
		},

		/**
		 * Remove asset from collection
		 * @private
		 * */
		removeItem: function(e){
			console.log("remove item");
			e.stopPropagation();
			this.model.collection.remove(this.model);
		},

		render : function(){
			console.log("render advert img");
			var name 	= this.model.get('name'),
				dim  	= this.model.get('width') && this.model.get('height') ?
							this.model.get('width')+' x '+this.model.get('height') : '';
			name		= name ? name : this.model.get('src').split("/").pop();
			name 		= name && name.length > 30 ? name.substring(0, 30)+'...' : name;
			dim		 	= dim ? dim + (this.model.get('unitDim') ? this.model.get('unitDim') : ' px' ) : '';
			this.$el.html( this.template({
				name: 	name,
				src: 	this.model.get('src'),
				dim:	dim,
				pfx:	this.pfx,
				ppfx:	this.ppfx
			}));
			this.$el.attr('class', this.className);
			return this;
		},
	});
});
