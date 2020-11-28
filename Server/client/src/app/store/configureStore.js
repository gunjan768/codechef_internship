import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/rootReducer';


export const configureStore = initialState => 
{
    const middlewareEnhancer = applyMiddleware(thunk);
    const storeEnhancers = [middlewareEnhancer];

    const composedEnhancer = composeWithDevTools(
        ...storeEnhancers,
    );

    const store = createStore(
        rootReducer,
        initialState,
        composedEnhancer,
    );

    if(process.env.NODE_ENV !== 'production') 
    {
        if(module.hot)
        {
            module.hot.accept('../reducers/rootReducer', () => 
            {
                const newRootReducer = require('../reducers/rootReducer').default;
                store.replaceReducer(newRootReducer);
            });
        }
    }

    return store;
}