import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import ScrollToTop from './app/util/ScrollToTop';
import ReduxToastr from 'react-redux-toastr';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import { Provider } from 'react-redux'
import Router from './app/layout/Router';
import { configureStore } from './app/store/configureStore';

const initialState = window && window.__INITIAL_STATE__;
const store = configureStore(initialState);

const App = props =>
{
	return (
		<Provider store = { store }>
			<BrowserRouter>
				<ScrollToTop>
					<ReduxToastr 
						position="bottom-right"
						transitionIn="fadeIn"
						preventDuplicates
						transitionOut="fadeOut"
						closeOnToastrClick
						progressBar
						timeOut = { 5000 }
						newestOnTop = { true }
					/>
					<Router />
				</ScrollToTop>
			</BrowserRouter>
		</Provider>
	);
}

export default App;