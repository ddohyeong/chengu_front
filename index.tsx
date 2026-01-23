import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/features/inventory/pages/App';
import { QueryClientProvider } from './src/shared/lib/QueryClientProvider';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);