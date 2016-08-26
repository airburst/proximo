import { combineReducers } from 'redux';
import { settingsReducer, ISettings } from './settings.reducer';

export interface IAppState {
    settings?: ISettings
};

export const rootReducer = combineReducers<IAppState>({
  settings: settingsReducer
});
