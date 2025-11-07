import React from 'react';
import ReactDOM from 'react-dom/client';
import GitProfile from './components/gitprofile.tsx';

// import CONFIG from '../gitprofile.config.js'; // Import CONFIG
import { getSanitizedConfig } from './utils/index.tsx';
import { SanitizedConfig } from './interfaces/sanitized-config'; // Import SanitizedConfig type

const sanitizedConfig = getSanitizedConfig(CONFIG);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Render GitProfile only if the config is valid */}
    {Object.keys(sanitizedConfig).length > 0 ? (
      <GitProfile config={sanitizedConfig as SanitizedConfig} />
    ) : (
      <div>Error: Invalid configuration. Please check gitprofile.config.js</div> // Hoặc một component lỗi chi tiết hơn
    )}
  </React.StrictMode>,
);
