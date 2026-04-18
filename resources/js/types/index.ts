/// <reference types="vite/client" />

import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import type { route as routeFn } from 'ziggy-js';

declare global {
    const route: typeof routeFn;
}

declare module 'vue' {
    interface ComponentCustomProperties {
        route: typeof routeFn;
    }
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    avatar?: string;
    role?: string;
    type?: string;
    lang?: string;
    permissions?: string[];
    current_business?: number;
    current_business_id?: number;
    plan?: Plan | null;
    businesses?: Business[];
    storage_limit?: number;
    is_super_admin?: boolean;
    creator?: User;
}

export interface Plan {
    id: number;
    name: string;
    price: number;
    features: Record<string, boolean | number | string>;
    is_active: boolean;
    storage_limit?: number;
}

export interface Business {
    id: number;
    name: string;
    slug: string;
    logo?: string;
    template?: string;
    business_type?: string;
    data?: Record<string, unknown>;
    config_sections?: Record<string, unknown>;
    user_id: number;
    is_active: boolean;
    custom_domain?: string;
    url_prefix?: string;
    view_count?: number;
    created_at: string;
}

export interface Contact {
    id: number;
    name: string;
    email: string;
    phone?: string;
    message?: string;
    business_id?: number;
    created_at: string;
}

export interface Appointment {
    id: number;
    name: string;
    email: string;
    phone?: string;
    date: string;
    time: string;
    message?: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    business_id?: number;
    created_at: string;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export interface FlashMessages {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}

export interface GlobalSettings {
    titleText?: string;
    base_url?: string;
    image_url?: string;
    currencySymbol?: string;
    defaultCurrency?: string;
    [key: string]: unknown;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T &
    InertiaPageProps & {
        auth: {
            user: User;
            roles: string[];
            permissions: string[];
            enabledAddons: { name: string; package_name: string }[];
            lang: string;
        };
        flash: FlashMessages;
        ziggy: { url: string; port: number | null; defaults: Record<string, unknown>; routes: Record<string, unknown> };
        globalSettings: GlobalSettings;
        referralSettings: { is_enabled: boolean };
        is_demo: boolean;
        isImpersonating: boolean;
        csrf_token: string;
        name: string;
        base_url: string;
        image_url: string;
    };
