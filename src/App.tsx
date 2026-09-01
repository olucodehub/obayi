import React from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { AuthProvider } from './contexts/AuthContext';
import Router from './router';

function App() {
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaSiteKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
      }}
    >
      <AuthProvider>
        <Router />
      </AuthProvider>
    </GoogleReCaptchaProvider>
  );
}

export default App;