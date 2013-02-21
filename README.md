*Some more concrete docs comming soon.*

Javascript Shadow (jshadow)
===========================

The idea of jshadow is to facilitate easy modularization of basic GUI 
functionality that requires javascript. Simple examples include tabs, various 
"show this, hide that, when X condition happens", or "turn this into that" etc.

Example
-------

eg.

The following is a simple definition:

	;(function ($) {

		// enable strict mode
		'use strict';

		// the following is the definition of our shadow
		$.jshadow({

			'name': 'demo',
			'wrapper': '.j-demo',

			'defaults': {
				'api-target': '.j-demo-action',
				'name': 'Anonymous' // example property
			},

			'action': function (event, conf, wrapper, definition) {
				// we do something
				alert('Hi'+conf['name']+'!');
			}

		});

	}(window.jQuery || window.Zapto));

And here's the markup it would affect:

	<div class="j-demo" data-demo-name="Alice">
		<button class="j-demo-action">Test</button>
	</div>

Clicking the "Test" button will perform our action.

Technical details
-----------------

The definition is initialized automatically by jshadow.  You can prevent it
by blocking the api like this:

	<div class="j-demo" data-api="off">

or, for just demo, like this...

	<div class="j-demo" data-api-demo="off">

You can provide your own binding function, `$.jshadow.default_binding` is 
assumed by default if none is mentioned in your definition.
