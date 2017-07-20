import Ember from 'ember';

export default Ember.Route.extend({
    mCssLoader: Ember.inject.service('m-css-loader'),
    beforeModel() {
        return Ember.RSVP.hash({
            bootstrap: this.get('mCssLoader').load({
                href: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
                integrity: 'sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u',
                crossorigin: 'anonymous'
            }),
            bootstrapTheme: this.get('mCssLoader').load({
                href: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css',
                integrity: 'sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp',
                crossorigin: 'anonymous'
            })
        });
    }
});
