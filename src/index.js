import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AuthProvider } from './context/auth.context';
import WalletProvider from './context/wallet.context';
require('dotenv').config()

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <WalletProvider>
        <App />
      </WalletProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

