import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter } from 'react-router-dom';
import { clerkTheme } from './styles/clerkTheme';

const clerkPubKey = 'pk_test_dGlkeS10cmVlZnJvZy0yOS5jbGVyay5hY2NvdW50cy5kZXYk'; // Remplace avec ta vraie clé Clerk

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={clerkPubKey}
      appearance={clerkTheme}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);