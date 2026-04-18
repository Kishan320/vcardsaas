<template>
  <PageTemplate 
    :title="title" 
    :url="url"
    :actions="filteredActions"
    :breadcrumbs="pageBreadcrumbs"
  >
    <div class="space-y-4">
      <slot />
    </div>
  </PageTemplate>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { hasPermission } from '@/utils/authorization';
import type { BreadcrumbItem, PageAction } from '@/types';
import PageTemplate from '@/components/page-template.vue';

export interface PageButton {
  label: string;
  icon?: any;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick?: () => void;
  permission?: string;
  className?: string;
}

interface PageWrapperProps {
  title: string;
  url: string;
  buttons?: PageButton[];
  breadcrumbs?: BreadcrumbItem[];
}

const props = withDefaults(defineProps<PageWrapperProps>(), {
  buttons: () => []
});

const { auth } = usePage().props as any;
const permissions = auth?.permissions || [];

// Generate default breadcrumbs if not provided
const defaultBreadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: route('dashboard') },
  { title: props.title }
];

const pageBreadcrumbs = computed(() => props.breadcrumbs || defaultBreadcrumbs);

// Filter buttons based on permissions
const filteredActions = computed((): PageAction[] => {
  return props.buttons
    .filter(button => !button.permission || hasPermission(permissions, button.permission))
    .map(button => ({
      label: button.label,
      icon: button.icon,
      variant: button.variant,
      onClick: button.onClick
    }));
});
</script>

<style scoped>
.page-wrapper {
  /* Component styles are handled by Tailwind classes */
}
</style>
