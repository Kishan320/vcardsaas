import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';
import type { PageProps, GlobalSettings } from '@/types';

export function useGlobalSettings() {
    const page = usePage<PageProps>();
    const globalSettings = computed<GlobalSettings>(() => (page.props as any).globalSettings ?? {});

    const get = (key: string, defaultValue: unknown = null) =>
        globalSettings.value[key] ?? defaultValue;

    const currencySymbol = computed(() =>
        (globalSettings.value.currencySymbol as string) ?? '$',
    );

    const formatCurrency = (amount: number | string) => {
        if (window.appSettings?.formatCurrency) {
            return window.appSettings.formatCurrency(amount);
        }
        const symbol = currencySymbol.value;
        return `${symbol}${Number(amount).toLocaleString()}`;
    };

    const formatDateTime = (date: string | Date, includeTime = true) => {
        if (window.appSettings?.formatDateTime) {
            return window.appSettings.formatDateTime(date, includeTime);
        }
        if (!date) return '';
        return new Date(date).toLocaleDateString();
    };

    return { globalSettings, get, currencySymbol, formatCurrency, formatDateTime };
}
