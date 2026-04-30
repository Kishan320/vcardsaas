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

// Additional types from React project
import type { Component } from 'vue';

export interface NavItem {
    title: string;
    href?: string;
    icon?: Component;
    permission?: string;
    children?: NavItem[];
    target?: string;
    external?: boolean;
    defaultOpen?: boolean;
    order?: number;
    badge?: {
        label: string;
        variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
    };
}

export interface BreadcrumbItem {
    title: string;
    href?: string;
}

export interface PageAction {
    label: string;
    icon: Component;
    variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    onClick: () => void;
}

// CRUD types
export interface EntityConfig {
    name: string;
    endpoint: string;
    permissions: {
      view: string;
      create: string;
      edit: string;
      delete: string;
    };
    breadcrumbs: {
      title: string;
      href?: string;
    }[];
}
  
export interface TableColumn {
    key: string;
    label: string;
    sortable?: boolean;
    type?: 'text' | 'badge' | 'image' | 'date' | 'currency' | 'boolean' | 'link' | 'custom';
    className?: string;
    linkClassName?: string;
    href?: string | ((row: any) => string);
    openInNewTab?: boolean;
    render?: (value: any, row: any) => Component;
}
  
export interface TableAction {
    label: string;
    icon: string;
    action?: string;
    href?: string | ((row: any) => string);
    openInNewTab?: boolean;
    permission?: string;
    className?: string;
    requiredPermission?: string;
    condition?: (row: any, context?: any) => boolean;
}
  
export interface TableConfig {
    columns: TableColumn[];
    actions: TableAction[];
    statusColors?: Record<string, string>;
}
  
export interface FilterOption {
    value: string;
    label: string;
}
  
export interface FilterField {
    key: string;
    label: string;
    type: 'select' | 'date' | 'daterange' | 'text' | 'number' | 'boolean';
    options?: FilterOption[];
    relation?: {
      endpoint: string;
      valueField: string;
      labelField: string;
    };
}
  
export interface FileValidation {
    accept?: string;
    maxSize?: number;
    mimeTypes?: string[];
    extensions?: string[];
}
  
export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'radio' | 'checkbox' | 'switch' | 'file' | 'date' | 'number' | 'multi-select' | 'media-picker' | 'custom';
    placeholder?: string;
    required?: boolean;
    multiple?: boolean;
    options?: FilterOption[];
    relation?: {
      endpoint: string;
      valueField: string;
      labelField: string;
    };
    validation?: {
      pattern?: string;
      min?: number;
      max?: number;
      minLength?: number;
      maxLength?: number;
    };
    fileValidation?: FileValidation;
    description?: string;
    colSpan?: number;
    width?: string;
    row?: number;
    render?: (field: FormField, formData: any, onChange: (name: string, value: any) => void) => Component;
    conditional?: (mode: string, formData: any) => boolean;
}
  
export interface FormConfig {
    fields: FormField[];
    modalSize?: string;
    columns?: number;
    layout?: 'grid' | 'flex' | 'default';
}
  
export interface CrudHooks {
    afterCreate?: (data: any, response: any) => void;
    afterUpdate?: (data: any, response: any) => void;
    afterDelete?: (id: any) => void;
}
  
export interface CrudConfig {
    entity: EntityConfig;
    table: TableConfig;
    filters: FilterField[];
    form: FormConfig;
    hooks?: CrudHooks;
    modalSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
    description?: string;
}
