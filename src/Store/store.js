import { createStore } from 'redux';
import { combineReducers } from 'redux';
import cartReducer from './Reducers/cartReducer';

const rootReducer = combineReducers({
    cartReducer
});

const store = createStore(rootReducer);


export default store;