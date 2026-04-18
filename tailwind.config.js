import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.vue',
        './resources/js/**/*.ts',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['DM Sans', ...defaultTheme.fontFamily.sans],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                primary: {
                    DEFAULT: '#7C3AED',
                    50: '#F5F0FF',
                    100: '#EDE0FF',
                    200: '#D9BFFF',
                    300: '#C49DFF',
                    400: '#A97CFF',
                    500: '#8B5CF6',
                    600: '#7C3AED',
                    700: '#6D28D9',
                    800: '#5B21B6',
                    900: '#4C1D95',
                },
            },
            borderRadius: {
                DEFAULT: '0.625rem',
                sm: '0.375rem',
                md: '0.625rem',
                lg: '0.875rem',
                xl: '1.125rem',
                '2xl': '1.5rem',
            },
            boxShadow: {
                card: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
                'card-hover': '0 8px 32px rgba(124, 58, 237, 0.12)',
                modal: '0 20px 60px rgba(0,0,0,0.15)',
            },
        },
    },
    plugins: [forms],
};
