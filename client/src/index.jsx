import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import Root from './root.jsx';

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component/>
    </AppContainer>,
    document.getElementById('root'),
  );
};

render(Root);

if (module && module.hot) {
  module.hot.accept('./root.jsx', () => {
    const Root = require('./root.jsx').default;
    render(Root);
  });
}
