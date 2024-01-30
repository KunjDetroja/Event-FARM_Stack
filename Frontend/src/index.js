import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import store from './ReduxStore/Store';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <>
        <Provider store={store}>
          <App />
        </Provider>
      </>
);

reportWebVitals();
