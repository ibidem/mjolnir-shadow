/**
 * Plugin for managing toggle states.
 *
 * @version 1.0
 * @license https://github.com/ibidem/ibidem/blob/master/LICENSE.md (BSD-2)
 */
;(function ($) {

	// enable stict mode
	"use strict";

	$.jshadow({

		'name': 'xtoggle',

		'wrapper': '[data-xtoggle-scope]',

		'defaults': {
			'api-target': '[data-xtoggle]'
		},

		'routines': {
			'refresh': function (conf, wrapper, self) {
				// empty
			}
		},

		'init': function (conf, wrapper, self) {

			var $targets = $.jshadow.children(conf, wrapper, self, conf['api-target']);

			$targets.each(function () {
				var $target = $(this);
				$target.on('change.mjolnir_xtoggle', function () {
					$($target.attr('data-xtoggle')).toggle();
				});
			});

			self.api.refresh();
		},

		'action': function (event, conf, wrapper, self) {
			self.api.refresh();
		}

	});

}(window.jQuery));
