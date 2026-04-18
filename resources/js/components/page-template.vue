<template>
    <AppLayout>
        <Head :title="title" />
        <div class="flex h-full flex-1 flex-col gap-4 p-4">
            <!-- Header with action buttons -->
            <div class="flex items-center justify-between">
                <h1 class="text-xl font-semibold">{{ title }}</h1>
                <div v-if="actions && actions.length" class="flex items-center gap-2">
                    <button
                        v-for="(action, index) in actions"
                        :key="index"
                        @click="action.onClick && action.onClick()"
                        :class="buttonClass(action.variant)"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer"
                    >
                        <component v-if="action.icon" :is="action.icon" class="h-4 w-4" />
                        {{ action.label }}
                    </button>
                </div>
            </div>
            <!-- Content -->
            <div :class="noPadding ? '' : 'rounded-xl border p-6'">
                <slot />
            </div>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { Head } from '@inertiajs/vue3';

interface PageAction {
    label: string;
    icon?: any;
    variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
    onClick?: () => void;
}

defineProps<{
    title: string;
    url?: string;
    actions?: PageAction[];
    noPadding?: boolean;
}>();

function buttonClass(variant?: string) {
    const map: Record<string, string> = {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 border border-transparent',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 border border-transparent',
        ghost: 'hover:bg-accent hover:text-accent-foreground border border-transparent',
        link: 'text-primary underline-offset-4 hover:underline border border-transparent',
    };
    return map[variant || 'outline'];
}
</script>
