import '../css/app.css';
import '../css/dark-mode.css';
import './bootstrap';
import { createInertiaApp, router } from '@inertiajs/vue3';
import { createApp, h, type DefineComponent, Suspense } from 'vue';
import { ZiggyVue } from '../../vendor/tightenco/ziggy';
import { createI18n } from 'vue-i18n';
import { initializeGlobalSettings } from './utils/globalSettings';
import { initializeTheme } from './composables/useAppearance';
import { initPerformanceMonitoring, lazyLoadImages } from './utils/performance';
import { useBrand } from './contexts/BrandContext';
import pinia from './stores';
import { useGlobalStore } from './stores/globalStore';
import './i18n';
import './utils/axios-config';

// Initialize performance monitoring
initPerformanceMonitoring();

// Initialize lazy loading of images when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    lazyLoadImages();
});

// Add event listener for theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const savedTheme = localStorage.getItem('themeSettings');
    if (savedTheme) {
        const themeSettings = JSON.parse(savedTheme);
        if (themeSettings.appearance === 'system') {
            initializeTheme();
        }
    }
});

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {},
});

// Case-insensitive page resolver: tries exact match first, then tries
// common casing variants so controller render names always resolve.
const pages = import.meta.glob<DefineComponent>('./pages/**/*.vue');

function resolvePage(name: string) {
    // Build candidate paths from most-specific to least-specific
    const lastSegment = name.split('/').pop()!;
    const pascalLast = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
    const pascalFull = name.split('/').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join('/');
    const camelCase = name.replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase());
    const pascalCamel = camelCase.charAt(0).toUpperCase() + camelCase.slice(1);

    const candidates = [
        `./pages/${name}.vue`,
        // PascalCase last segment: "contacts/index" → "contacts/Index.vue"
        `./pages/${name.replace(/\/([a-z])/g, (_: string, c: string) => '/' + c.toUpperCase())}.vue`,
        // directory/PascalName: "dashboard" → "dashboard/Dashboard.vue"
        `./pages/${name}/${pascalLast}.vue`,
        // PascalCase all segments: "dashboard" → "Dashboard.vue"
        `./pages/${pascalFull}.vue`,
        // kebab-to-PascalCase: "manage-language" → "ManageLanguage.vue"
        `./pages/${pascalCamel}.vue`,
        // kebab-to-PascalCase in subdir: "link-bio-builder/index" → "link-bio-builder/Index.vue"
        `./pages/${name.replace(/\/([a-z])/g, (_: string, c: string) => '/' + c.toUpperCase()).replace(/^([a-z])/, (c: string) => c.toUpperCase())}.vue`,
    ];

    for (const path of candidates) {
        if (pages[path]) return pages[path]();
    }

    // Last resort: case-insensitive search on the full path
    const lowerName = name.toLowerCase();
    for (const [path, loader] of Object.entries(pages)) {
        const normalized = path.replace('./pages/', '').replace('.vue', '').toLowerCase();
        if (normalized === lowerName) return loader();
    }

    // Final fallback: match just the last segment case-insensitively
    for (const [path, loader] of Object.entries(pages)) {
        const normalized = path.replace('./pages/', '').replace('.vue', '').toLowerCase();
        const nameLower = name.toLowerCase();
        // e.g. "dashboard" matches "dashboard/dashboard"
        if (normalized === `${nameLower}/${nameLower}` || normalized.endsWith(`/${nameLower}`)) {
            return loader();
        }
    }

    throw new Error(`Page not found: ${name}. Tried: ${candidates.join(', ')}`);
}

createInertiaApp({
    title: (title) => {
        const globalSettings = (window as any).page?.props?.globalSettings;
        const customTitle = globalSettings?.titleText || appName;
        return title ? `${title} - ${customTitle}` : customTitle;
    },
    resolve: resolvePage,
    setup({ el, App, props, plugin }) {
        // Make page data globally available for axios interceptor
        try {
            (window as any).page = props.initialPage;
        } catch (e) {
            console.warn('Could not set global page data:', e);
        }
        
        // Set demo mode globally
        try {
            (window as any).isDemo = props.initialPage.props?.is_demo || false;
        } catch (e) {
            // Ignore errors
        }
        
        // Initialize global settings from shared data
        const globalSettings = props.initialPage.props.globalSettings || {};
        if (Object.keys(globalSettings).length > 0) {
            initializeGlobalSettings(globalSettings);
            
            // Set initial document title
            if (globalSettings.titleText) {
                document.title = globalSettings.titleText;
            }
        }
        
        // Always initialize theme from DB settings — skip on landing page (has its own theme)
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('themeSettings');
        }
        const isLandingPage = window.location.pathname === '/' || window.location.pathname.startsWith('/home');
        if (!isLandingPage) {
            initializeTheme(globalSettings);
        }

        // Initialize brand settings
        const user = props.initialPage.props.auth?.user;
        const { initializeBrandSettings } = useBrand();
        initializeBrandSettings(globalSettings, user);

        // Apply direction immediately before Vue mounts
        const initialDir = (globalSettings as any)?.layoutDirection;
        if (initialDir) {
            document.documentElement.dir = initialDir === 'rtl' ? 'rtl' : 'ltr';
        }

        const vueApp = createApp({
            render: () => h(Suspense, {}, {
                default: () => h(App, props),
                fallback: () => h('div', { class: 'flex h-screen w-full items-center justify-center' }, 'Loading...')
            })
        });

        vueApp
            .use(plugin)
            .use(ZiggyVue)
            .use(i18n)
            .use(pinia)
            .mount(el);

        // Initialize Pinia store after Pinia is installed
        const globalStore = useGlobalStore();
        globalStore.setGlobalSettings(globalSettings);
        globalStore.setUser(user);
        globalStore.setDemoMode(props.initialPage.props?.is_demo || false);

        // Update global page data on navigation and re-render with new settings
        router.on('navigate', (event) => {
            try {
                (window as any).page = event.detail.page;
                
                // Re-initialize global settings with updated data
                const updatedGlobalSettings = event.detail.page.props.globalSettings || {};
                if (Object.keys(updatedGlobalSettings).length > 0) {
                    initializeGlobalSettings(updatedGlobalSettings);
                    
                    // Update document title if titleText changed
                    if (updatedGlobalSettings.titleText) {
                        document.title = updatedGlobalSettings.titleText;
                    }
                }
                
                // Re-initialize brand settings (skip on landing page)
                const updatedUser = event.detail.page.props.auth?.user;
                const isLandingRoute = event.detail.page.url === '/' || event.detail.page.url?.startsWith('/home');
                if (!isLandingRoute) {
                    initializeBrandSettings(updatedGlobalSettings, updatedUser);
                }
                
                // Update Pinia store
                const globalStore = useGlobalStore();
                globalStore.setGlobalSettings(updatedGlobalSettings);
                globalStore.setUser(updatedUser);
                globalStore.setDemoMode(event.detail.page.props?.is_demo || false);
            } catch (e) {
                console.error('Navigation error:', e);
            }
        });
    },
    progress: {
        color: '#4B5563',
    },
});

// Fallback theme initialization if no global settings are available
if (typeof window !== 'undefined') {
    const hasGlobalSettings = window.appSettings || document.querySelector('meta[name="global-settings"]');
    if (!hasGlobalSettings) {
        initializeTheme();
    }
}
// Direction is applied by initializeBrandSettings on every page load/navigation via BrandContext
