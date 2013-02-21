/**
 * xLinker (read as: "Cross-Linker")
 *
 * Sometimes it's useful to cross link a click so when you (for example:) click
 * "New" on something it's also interpreted as clicking cancel on other box'es
 * you had opened. You could do this by hand... and waste your life, or you
 * could xlink (lt. "cross-link") them togheter. :)
 *
 * The xlinks will only trigger if they are not in the current scope. For in
 * scope magic see the ui plugin. The purpose of the xlink plugin is to trigger
 * the right click events BLIND. This is why they trigger out of scope; scope
 * being that which you know and control, or more often "that which you care
 * to think about at that moment".
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

		'name': 'xlinker',

		'wrapper': '[data-xlink-scope]',

		'defaults': {
			'api-target': '[data-xlink]',
			'api-trigger': '[data-xlink-click]'
		},

		'routines': {
			// empty
		},

		'action': function (event, conf, wrapper, self) {
			var xlinks = $.jshadow.children(conf, wrapper, self, conf['api-trigger']),
				value = $(this).attr('data-xlink');

			// we select all exterior cleanup actions and trigger them
			($('[data-xlink-click="'+value+'"]:visible').not(xlinks)).each(function () {
				$(this).trigger('click');
			});
		}

	});

}(window.jQuery));
