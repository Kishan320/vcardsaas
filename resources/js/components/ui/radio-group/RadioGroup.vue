<script setup lang="ts">
import { provide, computed } from 'vue';

const props = defineProps<{
  modelValue?: string;
  class?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

provide('radio-group-context', {
  value: localValue
});
</script>

<template>
  <div :class="`grid gap-2 ${props.class || ''}`">
    <slot />
  </div>
</template>
