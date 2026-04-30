// resources/js/i18n.ts
import { createI18n } from 'vue-i18n';
import axios from 'axios';

// Custom backend to handle the modified response format
const customBackend = {
  type: 'backend',
  init: function(services: any, backendOptions: any) {
    this.services = services;
    this.options = backendOptions;
  },
  read: function(language: string, namespace: string, callback: (error: any, data: any) => void) {
    const loadPath = (window as any).route ? (window as any).route('translations', language) : `/translations/${language}`;
    
    axios.get(loadPath)
      .then(response => {
        const data = response.data;
        // Extract translations from the structured response
        const translations = data.translations;
        
        // Set document direction based on layoutDirection
        if (data.layoutDirection) {
          // Force direction change regardless of previous state
          document.documentElement.dir = data.layoutDirection;
          document.documentElement.setAttribute('dir', data.layoutDirection);
          
          // Store direction in localStorage for persistence
          localStorage.setItem('layoutDirection', data.layoutDirection);
          
          // Force re-render of sidebar by adding and removing a class
          document.documentElement.classList.add('direction-changed');
          setTimeout(() => {
            document.documentElement.classList.remove('direction-changed');
          }, 50);
        }
        
        // Store the current locale
        if (data.locale) {
          localStorage.setItem('i18nextLng', data.locale);
          // Also store in a session cookie for server-side awareness
          document.cookie = `app_language=${data.locale}; path=/; max-age=${60 * 60 * 24}`;
        }
        
        callback(null, translations);
      })
      .catch(error => {
        console.error('Translation loading error:', error);
        callback(error, null);
      });
  }
};

// Function to get initial language
const getInitialLanguage = () => {
  // Try to get from server if available
  if ((window as any).initialLocale) {
    return (window as any).initialLocale;
  }
  
  // Otherwise use browser detection with fallback to 'en'
  return null; // null will trigger language detection
};

// Function to reset language cache when switching languages
const resetLanguageCache = (language: string) => {
  // Clear any cached translations for better switching
  if (window.localStorage) {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('i18next_res_')) {
        localStorage.removeItem(key);
      }
    });
  }
};

// Create i18n instance
const i18n = createI18n({
  legacy: false,
  locale: getInitialLanguage() || 'en',
  fallbackLocale: getInitialLanguage() || 'en',
  messages: {},
  
  // Custom backend will be handled manually
  missing: (locale, key) => {
    console.warn(`Missing translation: ${key} for locale: ${locale}`);
  },
});

// Load translations function
export async function loadTranslations(language: string) {
  const loadPath = (window as any).route ? (window as any).route('translations', language) : `/translations/${language}`;
  
  try {
    const response = await axios.get(loadPath);
    const data = response.data;
    
    // Extract translations from the structured response
    const translations = data.translations;
    
    // Set document direction based on layoutDirection
    if (data.layoutDirection) {
      document.documentElement.dir = data.layoutDirection;
      document.documentElement.setAttribute('dir', data.layoutDirection);
      localStorage.setItem('layoutDirection', data.layoutDirection);
      
      document.documentElement.classList.add('direction-changed');
      setTimeout(() => {
        document.documentElement.classList.remove('direction-changed');
      }, 50);
    }
    
    // Store the current locale
    if (data.locale) {
      localStorage.setItem('i18nextLng', data.locale);
      document.cookie = `app_language=${data.locale}; path=/; max-age=${60 * 60 * 24}`;
    }
    
    // Update i18n messages
    i18n.global.setLocaleMessage(language, translations);
    i18n.global.locale.value = language;
    
    return translations;
  } catch (error) {
    console.error('Translation loading error:', error);
    return null;
  }
}

// Change language function
export async function changeLanguage(language: string) {
  resetLanguageCache(language);
  await loadTranslations(language);
}

// Initialize translations on load
if (typeof window !== 'undefined') {
  const savedLanguage = localStorage.getItem('i18nextLng') || getInitialLanguage() || 'en';
  loadTranslations(savedLanguage);
}

export default i18n;
