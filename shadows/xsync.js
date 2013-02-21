/**
 * Shadow for managing modal to button cross-reference; among other things.
 *
 * @version 1.1
 * @author Ibidem Team
 * @copyright 2012, Ibidem Team
 * @license https://github.com/ibidem/ibidem/blob/master/LICENSE.md (BSD-2)
 */
;(function ($) {

	// enable stict mode
	"use strict";

	$.jshadow({

		'name': 'xsync',

		'wrapper': '[data-xsync-scope]',

		'defaults': {
			'api-target': '[data-xsync]'
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
				$target.on('change.mjolnir_xsync', function () {
					var caller, blank, noblank, list, html, $slaves;
					
					caller = $target.attr('data-xsync-call');
					blank = $target.attr('data-xsync-blank');
					noblank = $target.attr('data-xsync-noblank');
					$slaves = $($target.attr('data-xsync'));
					
					caller = eval(caller);
					list = caller($target.val());
					
					if (typeof noblank !== 'undefined' && noblank == 'true') {
						html = '';
					} 
					else { // noblank == false
						if (typeof blank === 'undefined') {
							blank = '&nbsp;';
						}

						html = '<option value="">'+blank+'</option>';
					}
					
					if (list !== null && typeof list !== 'undefined')
					{
						if (list.length === 0) {
							$slaves.html(html);
							$slaves.attr('disabled', 'disabled');
							$slaves.trigger('change');
						}
						else { // we got a result
							$.each(list, function (i, item) {
								html += '<option value="'+item['id']+'">'+item['title']+'</option>';
							});
							$slaves.html(html);
							$slaves.removeAttr('disabled');
							$slaves.trigger('change');
						}
					}
					else { // error
						console.log('xsync: invalid list recieved');
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
