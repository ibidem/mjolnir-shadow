/**
 * UI plugin for managing (simple) views.
 *
 * @version 1.0
 * @license https://github.com/ibidem/ibidem/blob/master/LICENSE.md (BSD-2)
 */
;(function ($) {

	// enable stict mode
	"use strict";

	$.jshadow({

		'name': 'ui',

		'wrapper': '[data-ui]',

		'defaults': {
			'api-target': '[data-ui-show]',
			'api-view': '[data-ui-view]'
		},

		'routines': {
			'refresh': function (conf, wrapper, self) {
				var current_state = this.attr('data-ui'),
					children = $.jshadow.children(conf, wrapper, self, conf['api-view']);

				children.each(function () {
					var states = $(this).attr('data-ui-view');
					states = states.trim().split(' ');
					if ($.inArray(current_state, states) === -1) {
						$(this).hide();
					}
					else { // current state in states
						$(this).show();
					}
				});
			}
		},

		'init': function (conf, wrapper, self) {
			self.api.refresh();
		},

		'action': function (event, conf, wrapper, self) {
			wrapper.attr('data-ui', $(this).attr('data-ui-show'));
			self.api.refresh();
		}

	});

}(window.jQuery));
