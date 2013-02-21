/**
 * equation shadow
 *
 * Produce calculated fields in form (or form-like structure).
 *
 * @version 1.2
 * @license https://github.com/ibidem/ibidem/blob/master/LICENSE.md (BSD-2)
 */
;(function ($, undefined) {

	// enable stict mode
	"use strict";

	$.jshadow({

		'name': 'equation',

		'wrapper': '[data-equation-context]',

		'defaults': {
			'api-target': '[data-equation]'
		},

		'init': function (conf, $wrapper, self) {
			var $equations = $.jshadow.children(conf, $wrapper, self, conf['api-target']);

			var addslashes = function (str) {
				return (str+'').replace(/([\\"'])/g, "\\$1").replace(/\0/g, "\\0");
			};

			$equations.each(function () {
				var $equation = $(this),
					formula = $equation.attr('data-equation'),
					context_variables = null;

				// detect all form field variables
				context_variables = formula.match(new RegExp('\\$[a-zA-Z0-9_]+', 'gi'));

				// create update function
				var update = function () {
					var field_value, __return;
					
					// populate variables in context
					for (var i = 0; i < context_variables.length; ++i) {

						var $field = $('[name="'+context_variables[i].replace('$', '')+'"]', $wrapper);

						field_value = $field.val();
						
						if (field_value === undefined) {
							console.log('equation.shadow -- unable to locate '+context_variables[i])
							return '';
						}
						
						if ($field.attr('data-equation-type') == 'literal') {
							field_value = '"'+addslashes(field_value)+'"';
						}
						else { // non-special type
							// assume numeric
							if ( ! field_value.match('[0-9\.]+')) {
								field_value = 0.0;
							}
						}

						eval('var '+context_variables[i]+'='+field_value+';');
					}

					try {
						eval('__return = '+formula+';');
						
						if (isNaN(__return)) {
							return '';
						}
						
						return __return;
					}
					catch (e) {
						console.log('equation.shadow -- failed to compute [ ' + formula + ' ]');
						console.log('equation.shadow -- '+e);
						return '';
					}
				};
				
				for (var i = 0; i < context_variables.length; ++i) {
					$('[name="'+context_variables[i].replace('$', '')+'"]', $wrapper).on('input change', function (event, source) {
						var passthrough = $(this).attr('data-equation-passthrough');
						if (source == 'equation.event' && passthrough !== 'true') {
							return;
						}
						
						var result = update();
						if (result === '' && $equation.val() != '' && $equation.attr('data-equation-computed') !== 'true') {
							// don't update to void if there was already a value
							return;
						}
						else { // update
							$equation.attr('data-equation-computed', 'true');
							$equation.val(result);
						}
						
						$equation.trigger('change', 'equation.event');
						$equation.trigger('input', 'equation.event');
					});
				}
			});

			$('input, select, textarea', $wrapper).one().trigger('input');
		}

	});

}(window.jQuery));
