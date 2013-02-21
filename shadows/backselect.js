/**
 * Shows an extra option when select field is blank.
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

		'name': 'backeselect',

		'wrapper': '[data-backselect-context]',

		'defaults': {
			'api-source': '[data-backselect-source]',
			'api-backup': '[data-backselect]',
			'fadein': 'slow',
			'fadeout': 'slow'
		},

		'init': function (conf, wrapper, self) {
			var $sources = $.jshadow.children(conf, wrapper, self, conf['api-source']),
				$backups = $.jshadow.children(conf, wrapper, self, conf['api-backup']);
				
			var source_attr = conf['api-source'].replace(/(^\[|\]$)/gi, '');
			
			$sources.on('change.mjolnir_backselect', function (event) {
				// determine current state
				var blankstate = true;
				$sources.each(function () {
					var $source = $(this);
					
					if ($source.is('[type="checkbox"]'))
					{
						if (Boolean($source.attr(source_attr)) !== $source.is(':checked'))
						{
							blankstate = false;
							return false; // break loop
						}
					}
					else if ($source.attr(source_attr) !== $source.val()) {
						blankstate = false;
						return false; // break loop
					}
				});
				
				if (blankstate) {
					$backups.fadeIn(conf.fadein)
						.closest('.composite').find('.control-label .off').fadeIn(conf.fadein);
					$backups
						.filter('select').each(function() {
							var select2 = $(this).siblings('.select2-container');
							if (typeof select2 !== 'undefined') {
								$(this).hide();
								select2.fadeIn(conf.fadein);
							}
						});
				}
				else { // non-blank state
					$backups.each(function () {
						var $context = $(this),
							$inputs = $('input, textarea, select', $context).not('[type="submit"]');
							
						$inputs.each(function () {
							var $input = $(this),
								blank = $input.attr('data-backselect-blank');
							
							if (typeof blank !== 'undefined') {
								$input.val(blank);
							}
							else { // no blank defined
								$input.val('');
							}
						});
					});
					
					$backups.fadeOut(conf.fadeout)
						.closest('.composite').find('.control-label .off').fadeOut(conf.fadeout)
					$backups
						.siblings('.select2-container').fadeOut(conf.fadeout);
				}
			});
			
			if ($sources.length > 0) {
				// force change to capture initial value
				$($sources[0]).trigger('change');
			}
		}
		
	});

}(window.jQuery));
