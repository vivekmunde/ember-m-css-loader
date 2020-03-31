ember-m-css-loader
==============================================================================

This [Ember.js](https://emberjs.com/) addon helps load the css file(s) on demand, i.e. lazy loading, inside the `<link>` tag in the `document` `<head>` using the service `m-css-loader` .

### Lazy Loading of CSS

[CSS are render blocking resources.](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css) The ambitious SPAs need more than one CSS resources (external libraries) and some of these CSS resources can be more functionality centric and may not be required to get loaded on the Home screen or may be required only for few of screens. 

Suppose a web app uses Maps Library (like [leaflet](https://leafletjs.com)) for displaying maps, which comes with its own CSS. The maps are displayed only on couple of routes other than home screen. So the home screen is not needed to load the CSS for maps. The maps CSS should be loaded when the routes displaying maps are requested. In this scenario, its always preferable to load the CSS dynamically.

## `.load(attr)`

The method to load a CSS file on demand.

`attr` is a JSON object which holds the attribute values for the `<link>` tag to load CSS. It should at least have `href` property set to the source of the CSS. 

	mCssLoader: Ember.inject.service('m-css-loader'), 
	beforeModel() {
        this.get('mCssLoader').load({
                href: 'http://cdn-assets/maps.css',
                integrity: 'sha384-shfssiufhnof7348f738f7bw8g+Pmsjshdinwe98',
                crossorigin: 'anonymous'
            });
    }

#### Promise Based Load

The service `m-css-loader` returns a promise. The service listens to the events `onload` and `onerror` on the `<link>` tag in which the CSS is loaded. It resolves the promise inside `onload` event and rejects it if `onerror` event is raised. 

Use of this promise is completely optional and upto the requirement of the app. If a route needs to wait until the CSS gets loaded then the service can be used inside the `beforeModel` hook.
	
	mCssLoader: Ember.inject.service('m-css-loader'), 
	beforeModel() {
		return this.get('mCssLoader').load({
			href: '/assets/maps.css'
		});
	}

#### Caching

The service `m-css-loader` caches the `href`s loaded to avoid injecting the same CSS more than once.

#### CORS

The service inserts a `<link>` tag which as good as having it hardcoded at the time of html load. So no [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) issue.

Installation
------------------------------------------------------------------------------

```
ember install ember-m-css-loader
```


Usage
------------------------------------------------------------------------------

[Longer description of how to use the addon in apps.]


Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd ember-m-css-loader`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `npm test` – Runs `ember try:each` to test your addon against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
