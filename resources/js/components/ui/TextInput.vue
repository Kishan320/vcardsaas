<template>
    <input
        ref="inputRef"
        v-bind="$attrs"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        class="w-full rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2.5 text-sm text-[hsl(var(--foreground))] shadow-sm placeholder:text-[hsl(var(--muted-foreground))] transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        :class="{ 'border-red-500 focus:ring-red-200': hasError }"
    />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps<{
    modelValue?: string;
    hasError?: boolean;
}>();

defineEmits<{ 'update:modelValue': [value: string] }>();

const inputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
    if (inputRef.value?.hasAttribute('autofocus')) {
        inputRef.value.focus();
    }
});

defineExpose({ focus: () => inputRef.value?.focus() });
</script>
