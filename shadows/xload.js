/**
 * xLoad (read as: "Cross-Load")
 *
 * Load pages with out going though a page load.
 *
 * @version 1.2
 * @author Ibidem Team
 * @copyright 2012, Ibidem Team
 * @license https://github.com/ibidem/ibidem/blob/master/LICENSE.md (BSD-2)
 */
;(function ($, undefined) {

	// enable stict mode
	"use strict";

	$.jshadow({

		'name': 'xload',

		'wrapper': '[data-xload-scope]',

		'defaults': {
			'api-target': 'a[href]',
			'api-canceler': '[data-xload-exclude]',
			'destination': 'page'
		},
		
		'init': function () {
			window.onpopstate = function (e) {
				if (e.state !== null) {
					window.location = e.state.href;
				}
			};
		},

		'binding': function (conf, wrapper, definition) {
			var elements;
			elements = $.jshadow.children(conf, wrapper, definition, conf['api-target'])
				.not(conf['api-canceler']+' *', wrapper);
				
			elements.on(definition.trigger+'.'+definition.name, function (event) {
				$.proxy(definition.action, this)(event, conf, wrapper, definition); 
			});

			// bind events on wrapper
			$.each(definition.routines, function (key, func) {
				wrapper.on(key+'.'+definition.name, func);
			});

			// execute initialization routine if present
			if (typeof definition.init !== 'undefined') {
				definition.init(conf, wrapper, definition);
			}
		},

		'action': function (event, conf, wrapper, self) {
			var $target, href, 
				$main_loading_plane = $('#main-loading-plane');
			
			if (mj === undefined || mj.browser.ie == true) {
				return;
			}
			
			$target = $(this);
			href = $target.attr('href');
			
			// ignore in-page urls
			if (href.match(/^#.*/gi)) {
				return;
			}
			
			if ($('#page').attr('data-xload') === 'off') {
				return;
			}
			
			event.preventDefault();
			
			// begin loading
			$.xhrPool.abortAll();
			if ($main_loading_plane.attr('data-loading') !== 'true') {
				$main_loading_plane.showLoading();
				$main_loading_plane.attr('data-loading', 'true');
			}
			
			$('#'+conf.destination).load(href + ' #' + conf.destination + ' > *', function (response, status, xhr) {
				if (status == 'error') {
					console.log('Error: ' + xhr.status + ' ' + xhr.statusText);
					return;
				}
				
				// check for error states
				if (xhr.status != 200) {
					// hard redirect
					window.location = href;
					return;
				}
				
				if (response.match(new RegExp('id=\"'+conf.destination+'\"')) === null) {
					window.location = href;
					return;
				}

				// hide loading
				$main_loading_plane.hideLoading();
				$main_loading_plane.attr('data-loading', 'false');
				
				$('#'+conf.destination).jshadow();
				
				// reatach events
				history.pushState({'href': href}, '', href);
				
				$(window).trigger('resize');
			});
		}

	});

}(window.jQuery));
