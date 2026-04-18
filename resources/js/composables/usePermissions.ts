import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';

export function usePermissions() {
    const page = usePage();

    const permissions = computed<string[]>(() => (page.props as any).auth?.permissions ?? []);
    const roles = computed<string[]>(() => (page.props as any).auth?.roles ?? []);
    const user = computed(() => (page.props as any).auth?.user);
    const isSuperAdmin = computed(() => user.value?.is_super_admin || user.value?.type === 'superadmin');

    const hasPermission = (perms: string | string[]): boolean => {
        if (isSuperAdmin.value) return true;
        const list = Array.isArray(perms) ? perms : [perms];
        return list.some(p => permissions.value.includes(p));
    };

    const hasRole = (r: string | string[]): boolean => {
        const list = Array.isArray(r) ? r : [r];
        return list.some(role => roles.value.includes(role));
    };

    return { permissions, roles, user, isSuperAdmin, hasPermission, hasRole };
}
