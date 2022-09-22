(function($) {
	"use strict";
	var tooltip_init = {
		init: function() {
			$("button").tooltip({
				trigger : 'hover'
			});
			$("a").tooltip({
				trigger : 'hover'
			});
			$("input").tooltip();
			$("img").tooltip();
		}
	};
    tooltip_init.init()
})(jQuery);