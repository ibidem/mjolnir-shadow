/**
 * Pattern for managing save alert on forms.
 *
 * @version 1.0
 * @author Ibidem Team
 * @copyright 2012, Ibidem Team
 * @license https://github.com/ibidem/ibidem/blob/master/LICENSE.md (BSD-2)
 */
;(function ($) {

	// enable stict mode
	"use strict";

	$.jshadow({

		'name': 'saveme',

		'wrapper': '[data-saveme]',

		'defaults': {
			'api-target': 'input, select, textarea',
			'api-msg': '[data-saveme-msg]'
		},

		'routines': {
			'refresh': function (conf, wrapper, self) {
				// empty
			}
		},

		'init': function (conf, wrapper, self) {
			
			var $msg_blocks = $.jshadow.children(conf, wrapper, self, conf['api-msg']),
				$inputs = $.jshadow.children(conf, wrapper, self, conf['api-target']);

			$msg_blocks.hide();

			$inputs.each(function () {

				var $input = $(this);
				var original_val = $input.val();
				
				$input.on('change', function () {
					if (original_val !== $(this).val()) {
						$msg_blocks.fadeIn();
					}
				});

			});
				
			self.api.refresh();
		},
		
		'action': function (event, conf, wrapper, self) {
			self.api.refresh();
		}

	});

}(window.jQuery));
