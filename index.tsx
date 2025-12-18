import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import { UserProvider } from './contexts/UserContext';
import { GalleryProvider } from './contexts/GalleryContext';
import { initGA } from './utils/analytics';

// Initialize Google Analytics
initGA();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <GalleryProvider>
          <Routes>
            <Route path="/privacy-policy" element={<PrivacyPage />} />
            <Route path="/terms-of-service" element={<TermsPage />} />
            <Route path="/*" element={<App />} />
          </Routes>
        </GalleryProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);