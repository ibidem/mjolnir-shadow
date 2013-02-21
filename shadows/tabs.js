/**
 * Tabs plugin for managing simple tabs.
 *
 * @version 1.0
 * @license https://github.com/ibidem/ibidem/blob/master/LICENSE.md (BSD-2)
 */
;(function ($) {

	// enable stict mode
	"use strict";

	$.jshadow({

		'name': 'tabs',

		'wrapper': '.nav-tabs',

		'defaults': {
			'api-target': 'li > a[href]'
		},

		'routines': {
			'refresh': function (conf, wrapper, self) {
				var	children = $.jshadow.targets(conf, wrapper, self),
					active_state = wrapper.attr('data-tabs-state');
				
				// hide all tabs
				children.each(function () {
					var tab_state = $(this).attr('href');
					if (tab_state !== active_state) {
						$(this).closest('li').removeClass('active');
						$(tab_state).hide();
					}
					else { // active tab
						$(this).closest('li').addClass('active');
					}
				});

				$(active_state).show();			
			}
		},

		'init': function (conf, wrapper, self) {
			var anchor, hashcode, preset_active;

			// we define the initial state as being either the currently active,
			// or otherwise the first tab in the tab list; in the case where we
			// recieve an active tab via the hashcode we activate that tab

			anchor = window.location.hash;

			// turn into id
			anchor = '#'+anchor.replace(/^#!?/gi, '');

			preset_active = $.jshadow.children(conf, wrapper, self, 'li > a[href="'+anchor+'"]');

			// was there a anchor matching our tabs?
			if (preset_active.length === 0) { 

				// try to find predefined .active tab
				preset_active = $.jshadow.children(conf, wrapper, self, 'li.active > a[href]');

				if (preset_active.length !== 0) {
					anchor = preset_active.attr('href');
				}
				else { // there is no active node
					anchor = $.jshadow.children(conf, wrapper, self, 'li:first > a[href]').attr('href');
				}
			}

			// set the current sate to the active node
			wrapper.attr('data-tabs-state', anchor);

			self.api.refresh();
		},

		'action': function (event, conf, wrapper, self) {
			var node, hash, hashcode;

			// we prevent the page from changing window.location.hash since we
			// do it ourselves in a tab friendly way
			event.preventDefault();

			wrapper.attr('data-tabs-state', $(this).attr('href'));
			// change hash with out moving the page
//			hash = $(this).attr('href');
//			node = $(hash);
//			node.attr('id', '');
//			hashcode = '!'+hash.replace(/^#!?/gi, '');
//			window.location.hash = hashcode;
//			node.attr('id', hash.replace(/^#!?/gi, ''));

			
//			window.location.hash = hash;

			// ^^ hotfix to history issues; code will generate history state 
			// that's unprocessable in browsers
			
			self.api.refresh();
		}

	});

}(window.jQuery));
