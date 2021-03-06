/**
 * @version 1.2
 * @author Ibidem Team
 * @copyright 2012, Ibidem Team
 * @license https://github.com/ibidem/ibidem/blob/master/LICENSE.md (BSD-2)
 */

// define console
if (typeof console === 'undefined') {
	// define an empty console if not present; to avoid errors
	window.console = { log: function () { } };
}

;(function ($) {

	// enable stict mode
	'use strict';

	$.extend({

		// general purpose plugin template
		'jshadow': function (definition) {

			// if not provided we default to click
			if (typeof definition.trigger === 'undefined' || definition.trigger === null) {
				definition.trigger = 'click';
			}

			definition = $.extend(true, {}, {
				'trigger' : 'click',
				'binding' : $.jshadow.default_binding,
				'routines' : { }
			}, definition);

			// create plugin
			$.fn[definition.name] = function (options) {
			
				var settings = $.extend(true, {}, definition.defaults, options);
				$(this).each(function () {

					// create a copy of the settings
					var conf = $.extend(true, {}, { 'ns': '' }, settings),
						def = $.extend(true, {}, definition),
						wrapper = $(this),
						data_value;

					// now overwrite with markup flags
					$.each(conf, function (key, value) {
						data_value = wrapper.data(def.name+'-'+key);
						if (typeof data_value !== 'undefined') {
							conf[key] = data_value;
						}
					});

					// proxy all routines to the wrapper object
					def.api = { };
					$.each(def.routines, function (key, func) {
						def.api[key] = function () {
							$.proxy(func, wrapper)(conf, wrapper, def);
						};
					});

					definition.binding(conf, wrapper, def);
				});

			};
		
			// auto initialize plugin
			$(function () {
				$.jshadow.register(definition);
				$(definition.wrapper).not('[data-api="off"], [data-api-'+definition.name+'="off"]')[definition.name]();
			});

		}

	});

	var register = [];

	/**
	 * Register
	 *
	 * The register keeps a list of all plugins defined with shadow.
	 */
	$.jshadow.register = function (def) {
		register.push(def);
	};

	/**
	 * Re-Register
	 *
	 * Reads the register and attempts to re-attach all plugins to the context provided.
	 */
	$.fn.jshadow = function () {
		$(this).each(function () {
			var self = $(this);
			$.each(register, function (i, def) {
				self.find(def.wrapper).not('[data-api="off"], [data-api-'+def.name+'="off"]')[def.name]();
			});
		});
	};

	/**
	 * Selection helper.
	 * 
	 * Select all children from the wrapper, not part of another wrapper, but 
	 * select everything within the current namespace.
	 */
	$.jshadow.children = function (conf, wrapper, def, selector) {
		var selection = wrapper.find(selector)
			.not(wrapper.find(def.wrapper+' '+selector))
			.not('[data-'+def.name+'-ns]');

		if (conf.ns !== '') {
			selection = selection.add(wrapper.find('[data-'+def.name+'-ns="'+conf.ns+'"]'));
		}

		return selection;
	};

	/**
	 * Similar to the selection helper; this is merely a shorthand for 
	 * api-targets as value
	 * 
	 * Select all children from the wrapper, not part of another wrapper, but 
	 * select everything within the current namespace.
	 */
	$.jshadow.targets = function (conf, wrapper, def) {
		var selection = wrapper.find(def.defaults['api-target'])
			.not(wrapper.find(def.wrapper+' '+def.defaults['api-target']))
			.not('[data-'+def.name+'-ns]');

		if (conf.ns !== '') {
			selection = selection.add(wrapper.find('[data-'+def.name+'-ns="'+conf.ns+'"]'));
		}

		return selection;
	};

	/**
	 * Default binding.
	 */
	$.jshadow.default_binding = function (conf, wrapper, definition) {
		var elements;
		
		if (typeof definition.action !== 'undefined') {
			elements = $.jshadow.children(conf, wrapper, definition, conf['api-target']);
			elements.on(definition.trigger+'.'+definition.name, function (event) {
				$.proxy(definition.action, this)(event, conf, wrapper, definition); 
			});
		}

		// bind events on wrapper
		$.each(definition.routines, function (key, func) {
			wrapper.on(key+'.'+definition.name, func);
		});

		// execute initialization routine if present
		if (typeof definition.init !== 'undefined') {
			definition.init(conf, wrapper, definition);
		}
	};

}(window.jQuery));