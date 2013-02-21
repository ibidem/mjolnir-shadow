/**
 * Plugin for managing modal to button inter-connection.
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

		'name': 'xref',

		'wrapper': '[data-xref-scope]',

		'defaults': {
			'api-target': '[data-xref-target]',
			'api-ref': '[data-xref]'
		},

		'routines': {
			'refresh': function (conf, wrapper, self) {
				// empty
			}
		},

		'init': function (conf, wrapper, self) {

			var $targets = $.jshadow.children(conf, wrapper, self, conf['api-target']),
				$references = $(conf['api-ref']);

			$targets.each(function () {
				var $target = $(this);
				$target.on('click.mjolnir_xref', function (event) {
					$references.off('click.mjolnir_xref_activate');
					$references.on('click.mjolnir_xref_activate', function () {
						$target.closest('form').submit();
					});
				});
			});

			self.api.refresh();
		},

		'action': function (event, conf, wrapper, self) {
			self.api.refresh();
		}

	});

}(window.jQuery));
