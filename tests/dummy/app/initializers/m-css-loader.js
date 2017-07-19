export function initialize() {
  const application = arguments[1] || arguments[0];
  [
    'component',
    'controller',
    'route'
  ].forEach(type => {
    application.inject(type, 'mCssLoader', 'service:m-css-loader');
  });
}

export default {
  name: 'm-css-loader',
  initialize
};
