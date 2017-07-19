import Ember from 'ember';

// @public
export default Ember.Service.extend({

    // @private
    _cache: Ember.A(),

    // @private
    _isCached(href) {
        return this.get('_cache').includes(href);
    },

    // @private
    _updateCache(href) {
        this.get('_cache').pushObject(href);
    },

    // @private
    _getLinkAttr(attr) {
        return Object.assign(
            {
                type: 'text/css',
                rel: 'stylesheet'
            },
            attr
        );
    },

    // @private
    _loadCss(attr) {
        return new Ember.RSVP.Promise((resolve, reject) => {
            Ember.$("<link>")
                .appendTo("head")
                .on('load', () => {
                    resolve();
                })
                .on('error', () => {
                    reject();
                })
                .attr(this._getLinkAttr(attr));
        });
    },

    // @private
    _isValidAttr(attr) {
        return !Ember.isEmpty(attr) && !Ember.isEmpty(attr.href) && !Ember.isBlank(attr.href);
    },

    // @public
    load(attr) {
        return new Ember.RSVP.Promise((resolve, reject) => {
            if (!this._isValidAttr(attr)) {
                resolve();
                return;
            }
            if (this._isCached(attr.href)) {
                resolve();
                return;
            }
            this._loadCss(attr).then(() => {
                this._updateCache(attr.href);
                resolve();
            }, () => {
                reject();
            });
        });
    }

});
