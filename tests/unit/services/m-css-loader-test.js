import { moduleFor, test } from 'ember-qunit';
import sinonTest from 'ember-sinon-qunit/test-support/test';
import Ember from 'ember';

moduleFor('service:m-css-loader', 'Unit | Service | m css loader', {
  unit: true,

  beforeEach() {
    let service = this.subject();
    service.set('_cache', Ember.A());
  }
});

// ------------------------------------------------------------------------------------------------------

test('should have cache initialized', function (assert) {
  assert.expect(1);

  let service = this.subject();

  assert.deepEqual(service.get('_cache'), [], 'cache was initialized to []');
});

// ------------------------------------------------------------------------------------------------------

test('should check if the href already cached', function (assert) {
  assert.expect(2);

  let service = this.subject();

  const href = '../style.css';
  service.get('_cache').push(href);

  assert.deepEqual(service._isCached(href), true, 'href was cached');
  assert.deepEqual(service._isCached('http://non-cached-style.css'), false, 'href was not cached');
});

// --------------------------------------------------------------------------------------------------

test('should update cache', function (assert) {
  assert.expect(1);

  let service = this.subject();

  const href = '../style.css';

  service._updateCache(href);
  assert.deepEqual(
    service.get('_cache'),
    [
      href
    ]
  );
});

// --------------------------------------------------------------------------------------------------

test('should check validity of attr', function (assert) {
  assert.expect(6);

  let service = this.subject();

  let attr = null;
  assert.equal(service._isValidAttr(attr), false, 'attr = null');

  attr = {};
  assert.equal(service._isValidAttr(attr), false, 'attr = {}');

  attr = {
    crossorigin: 'anonymous'
  };
  assert.equal(service._isValidAttr(attr), false, 'attr = undefined');

  attr = {
    href: null
  };
  assert.equal(service._isValidAttr(attr), false, 'attr = {href: null}');

  attr = {
    href: ''
  };
  assert.equal(service._isValidAttr(attr), false, 'attr = {href: ""}');

  attr = {
    href: '../style.css'
  };
  assert.equal(service._isValidAttr(attr), true, 'attr = {href: "../style.css"}');
});

// --------------------------------------------------------------------------------------------------

test('should compute link attr', function (assert) {
  assert.expect(1);

  let service = this.subject();

  const attr = {
    href: '../style.css',
    crossorigin: 'anonymous'
  };

  assert.deepEqual(
    service._getLinkAttr(attr),
    {
      type: 'text/css',
      rel: 'stylesheet',
      href: '../style.css',
      crossorigin: 'anonymous'
    }
  );
});

// --------------------------------------------------------------------------------------------------

sinonTest('should load css in a <link> tag in document <head>', function (assert) {
  assert.expect(5);

  let service = this.subject();

  const attr = {
    href: '../style.css',
    crossorigin: 'anonymous'
  };

  const getLinkAttrStub = this.stub(service, '_getLinkAttr').returns({
    type: 'text/css',
    rel: 'stylesheet',
    href: '../style.css',
    crossorigin: 'anonymous'
  });

  return service._loadCss(attr).then(() => {
    assert.ok(getLinkAttrStub.calledWith(attr), '_getLinkAttr was called');
    const $link = Ember.$('head link').last();
    assert.equal($link.attr('type'), 'text/css', '<link> had type');
    assert.equal($link.attr('rel'), 'stylesheet', '<link> had rel');
    assert.equal($link.attr('href'), '../style.css', '<link> had href');
    assert.equal($link.attr('crossorigin'), 'anonymous', '<link> had crossorigin');
  });
});

// --------------------------------------------------------------------------------------------------

sinonTest('should handle error during css loading in a <link> tag in document <head>', function (assert) {
  assert.expect(1);

  let service = this.subject();

  const attr = {
    href: '/assets/404-style.css',
    crossorigin: 'anonymous'
  };

  this.stub(service, '_getLinkAttr').returns({
    type: 'text/css',
    rel: 'stylesheet',
    href: '/assets/404-style.css',
    crossorigin: 'anonymous'
  });

  return service._loadCss(attr).then(() => { }, () => {
    !assert.equal(Ember.$('head link').last().attr('href'), '/assets/404-style.css');
  });
});

// --------------------------------------------------------------------------------------------------

sinonTest('should not load css for missing attr', function (assert) {
  assert.expect(2);

  let service = this.subject();

  const attr = { crossorigin: 'anonymous' },
    _isValidAttrStub = this.stub(service, '_isValidAttr').returns(false),
    _isCachedSpy = this.spy(service, '_isCached');

  return service.load(attr).then(() => {
    assert.ok(_isValidAttrStub.calledWith(attr), 'attr validity was checked');
    assert.ok(_isCachedSpy.notCalled, 'css was not laoded');
  });
});

// --------------------------------------------------------------------------------------------------

sinonTest('should not load already loaded css', function (assert) {
  assert.expect(3);

  let service = this.subject();

  const attr = {
    href: '../style.css',
    crossorigin: 'anonymous'
  },
    _isValidAttrStub = this.stub(service, '_isValidAttr').returns(true),
    _isCachedStub = this.stub(service, '_isCached').returns(true),
    _loadCssSpy = this.spy(service, '_loadCss');

  return service.load(attr).then(() => {
    assert.ok(_isValidAttrStub.calledOnce, 'attr validity was checked');
    assert.ok(_isCachedStub.calledWith(attr.href), 'href caching was checked');
    assert.ok(_loadCssSpy.notCalled, 'css was not loaded');
  });
});

// --------------------------------------------------------------------------------------------------

sinonTest('should load css', function (assert) {
  assert.expect(4);

  let service = this.subject();

  const attr = {
    href: '../style.css',
    crossorigin: 'anonymous'
  },
    _isValidAttrStub = this.stub(service, '_isValidAttr').returns(true),
    _isCachedStub = this.stub(service, '_isCached').returns(false),
    _loadCssStub = this.stub(service, '_loadCss').returns(
      new Ember.RSVP.Promise((resolve) => {
        resolve();
      })
    ),
    _updateCacheStub = this.stub(service, '_updateCache').returns();

  return service.load(attr).then(() => {
    assert.ok(_isValidAttrStub.calledOnce, 'attr validity was checked');
    assert.ok(_isCachedStub.calledOnce, 'href caching was checked');
    assert.ok(_loadCssStub.calledWith(attr), 'css was loaded');
    assert.ok(_updateCacheStub.calledWith(attr.href), 'href was updated in cache');
  });
});

// --------------------------------------------------------------------------------------------------

sinonTest('should handle error dusing css load', function (assert) {
  assert.expect(4);

  let service = this.subject();

  const attr = {
    href: '../style.css',
    crossorigin: 'anonymous'
  },
    _isValidAttrStub = this.stub(service, '_isValidAttr').returns(true),
    _isCachedStub = this.stub(service, '_isCached').returns(false),
    _loadCssStub = this.stub(service, '_loadCss').returns(
      new Ember.RSVP.Promise((resolve, reject) => {
        reject();
      })
    ),
    _updateCacheStub = this.stub(service, '_updateCache').returns();

  return service.load(attr).catch(() => {
    assert.ok(_isValidAttrStub.calledOnce, 'attr validity was checked');
    assert.ok(_isCachedStub.calledOnce, 'href caching was checked');
    assert.ok(_loadCssStub.calledWith(attr), 'css load was initiated');
    assert.ok(_updateCacheStub.notCalled, 'href was not updated in cache');
  });
});
