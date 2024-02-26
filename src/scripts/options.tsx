import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { OptionsApp } from './components/OptionsApp';

const rootDiv = document.getElementById('app');
if (rootDiv !== null) {
  const root = createRoot(rootDiv);
  root.render(
    <React.StrictMode>
      <OptionsApp />
    </React.StrictMode>
  );
}
