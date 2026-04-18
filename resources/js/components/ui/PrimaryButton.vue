<template>
    <button
        v-bind="$attrs"
        :disabled="disabled"
        class="inline-flex items-center justify-center rounded-xl border border-transparent gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:opacity-90 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
    >
        <slot />
    </button>
</template>

<script setup lang="ts">
defineProps<{ disabled?: boolean }>();
</script>
