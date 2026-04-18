<template>
    <input
        type="checkbox"
        :checked="checked"
        @change="$emit('update:checked', ($event.target as HTMLInputElement).checked)"
        class="rounded border-gray-300 text-primary-600 shadow-sm focus:ring-primary-500"
    />
</template>

<script setup lang="ts">
defineProps<{ checked?: boolean }>();
defineEmits<{ 'update:checked': [value: boolean] }>();
</script>
