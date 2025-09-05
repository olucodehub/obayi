// Application configuration
export const APP_CONFIG = {
  // Set to 'localStorage' for demo mode or 'api' for production
  AUTH_MODE: (import.meta.env.VITE_AUTH_MODE || 'localStorage') as 'localStorage' | 'api',
  
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  
  // Frontend Configuration
  APP_NAME: 'Obayi',
  APP_VERSION: '1.0.0',
  
  // File Upload Configuration
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png'
  ],
  
  // UI Configuration
  ITEMS_PER_PAGE: 10,
  PAGINATION_RANGE: 5,
  
  // Feature Flags
  FEATURES: {
    PROFILE_PICTURES: true,
    DOCUMENT_UPLOAD: true,
    ACHIEVEMENT_SYSTEM: true,
    NOTIFICATIONS: false, // Future feature
    MESSAGING: false, // Future feature
  },
  
  // Development flags
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
  ENABLE_DEBUG_LOGS: import.meta.env.VITE_DEBUG === 'true',
};

export default APP_CONFIG;