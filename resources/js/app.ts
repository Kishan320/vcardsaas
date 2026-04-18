import '../css/app.css';
import './bootstrap';
import { createInertiaApp, router } from '@inertiajs/vue3';
import { createApp, h, type DefineComponent } from 'vue';
import { ZiggyVue } from '../../vendor/tightenco/ziggy';
import { createI18n } from 'vue-i18n';
import { initializeGlobalSettings } from './utils/globalSettings';

const appName = import.meta.env.VITE_APP_NAME || 'VCard SaaS';

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
        const globalSettings = (window as any).appSettings;
        const customTitle = globalSettings?.get?.('titleText') || appName;
        return title ? `${title} - ${customTitle}` : customTitle;
    },
    resolve: resolvePage,
    setup({ el, App, props, plugin }) {
        // Initialize global settings from shared Inertia props
        const globalSettings = (props.initialPage.props as any).globalSettings || {};
        if (Object.keys(globalSettings).length > 0) {
            initializeGlobalSettings(globalSettings);
        }

        // Set demo mode globally (mirrors React project)
        (window as any).isDemo = (props.initialPage.props as any).is_demo || false;

        createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue)
            .use(i18n)
            .mount(el);

        // Re-initialize global settings on every navigation (mirrors React project)
        router.on('navigate', (event) => {
            const updatedSettings = (event.detail.page.props as any).globalSettings || {};
            if (Object.keys(updatedSettings).length > 0) {
                initializeGlobalSettings(updatedSettings);
            }
            (window as any).isDemo = (event.detail.page.props as any).is_demo || false;
        });
    },
    progress: {
        color: '#7C3AED',
    },
});
