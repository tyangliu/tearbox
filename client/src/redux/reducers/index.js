import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import {default as tears} from './tears';
import {default as box} from './box';
import {default as ui} from './ui';
import {default as forms} from './forms';

const rootReducer = combineReducers({
  tears,
  box,
  ui,
  forms,
  routing: routerReducer,
});

export default rootReducer;
