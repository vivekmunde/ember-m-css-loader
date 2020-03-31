import { A } from '@ember/array';
import { Promise } from 'rsvp';
import Service from '@ember/service';
import { isEmpty, isBlank } from '@ember/utils';

// @public
export default Service.extend({

    // @private
    _cache: A(),

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
        return new Promise((resolve, reject) => {
            const link = document.createElement("link");

            document.body.appendChild(link);

            link.addEventListener('load', () => {
                resolve();
            });

            link.addEventListener('error', () => {
                reject();
            });

            const scriptAttrs = this._getLinkAttr(attr);
            Object.keys(scriptAttrs)
                .forEach(key => {
                    link.setAttribute(key, scriptAttrs[key]);
                });
        });
    },

    // @private
    _isValidAttr(attr) {
        return !isEmpty(attr) && !isEmpty(attr.href) && !isBlank(attr.href);
    },

    // @public
    load(attr) {
        return new Promise((resolve, reject) => {
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
