/**
 * Plugin for merging selects into optgroup'ed select.
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

		'name': 'xselect',

		'wrapper': '[data-xselect-scope]',

		'defaults': {
			'api-source': '[data-xselect-source]',
			'api-master': '[data-xselect-master]'
		},

		'init': function (conf, wrapper, self) {

			var $slaves = $.jshadow.children(conf, wrapper, self, conf['api-source']),
				$master = $.jshadow.children(conf, wrapper, self, conf['api-master']);

			var groups = {},
				slavecache = {};

			var source_attr = conf['api-source'].replace(/(^\[|\]$)/gi, '');

			$slaves.each(function () {
				var $slave = $(this),
					grouptitle = $slave.attr(source_attr),
					groupname = $slave.attr('name');
					
				// save for quick reference
				slavecache[groupname] = $slave;
					
				// hide slave
				$slave.hide();
					
				groups[groupname] = { title: grouptitle, options: [] };
				$('option', $slave).each(function () {
					var $option = $(this);
					groups[groupname].options.push({
						key: $option.attr('value'), 
						title: $option.text() 
					});
				});
				
				// remove first option since that's a blank
				groups[groupname].options.shift();
			});
			
			// form master select values
			var markup = '',
				blank = wrapper.attr('data-xselect-blank');
				
			if (blank !== null && typeof blank !== 'undefined') {
				markup += '<option value="'+blank+'">&nbsp;</option>';
			}
			else { // no blank
				// standardize value
				blank = null;
			}
			
			// inject groups
			$.each(groups, function (groupname, group) {
				if (group.options.length > 0) {
					markup += '<optgroup label="'+group.title+'">';
					$.each(group.options, function (idx, option) {
						markup += '<option value="'+groupname+'--'+option.key+'">'+option.title+'</option>';
					});
					markup += '</optgroup>';
				}
			});
			
			$master.html(markup);
			$master.trigger('change');
			
			$master.on('change.mjolnir_xselect', function (event) {
				var key = $master.val(),
					value = key.replace(/[a-zA-Z0-9-_]+\-\-/gi, ''),
					group = key.replace(new RegExp('--'+value), '')

				$slaves.each(function () {
					var $slave = $(this);
					$slave.val(null);
				});

				slavecache[group].val(value);
				
				// trigger change
				$slaves.trigger('change');
			});
			
			// check for pre-selected values
			$slaves.each(function () {
				var $slave = $(this),
					value = null;
					
				if ((value = $slave.val()) !== blank) {
					$('[selected]', $master).removeAttr('selected');
					$('[value="'+$slave.attr('name')+'--'+value+'"]', $master).attr('selected', 'selected');
					return false;
				}
			});
			
			// show master
			$master.show();
		}

	});

}(window.jQuery));
