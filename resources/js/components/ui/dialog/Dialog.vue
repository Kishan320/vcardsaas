<template>
  <slot :open="open" />
</template>

<script setup lang="ts">
import { provide, toRef } from 'vue';

const props = defineProps<{
  open?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
}>();

const isOpen = toRef(props, 'open');

const onOpenChange = (value: boolean) => {
  emit('update:open', value);
};

provide('dialogContext', {
  isOpen,
  onOpenChange,
});
</script>
