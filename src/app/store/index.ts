const persistState = require('redux-localstorage');
const createLogger = require( 'redux-logger');
import { IAppState, rootReducer } from './store';
import { ISettings } from './settings.reducer';

export {
  IAppState,
  rootReducer,
  ISettings
};

export const middleware = [
  createLogger({
    level: 'info',
    collapsed: true
  })
];

export const enhancers = [
  persistState('', { key: 'proximate' })
];