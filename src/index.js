import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './config/i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from './config/i18n';
import { Provider } from 'react-redux';
import { store, persistor } from './app/store';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ConfigProvider } from 'antd';
import { customTheme } from './theme/theme';
import './theme/typography.css'; // thêm dòng này

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ConfigProvider theme={customTheme}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <I18nextProvider i18n={i18n}>
            <App />
            <ToastContainer position="top-right" autoClose={1500} closeOnClick />
          </I18nextProvider>
        </PersistGate>
      </Provider>
    </ConfigProvider>
  </React.StrictMode>
);
