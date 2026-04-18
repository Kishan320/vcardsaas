<template>
  <div data-slot="collapsible" :class="$attrs.class">
    <slot :open="isOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, watch } from 'vue';

const props = defineProps({
  open: { type: Boolean, default: undefined },
  defaultOpen: { type: Boolean, default: false },
});

const emit = defineEmits(['update:open']);

const isOpen = ref(props.open !== undefined ? props.open : props.defaultOpen);

watch(() => props.open, (val) => {
  if (val !== undefined) isOpen.value = val;
});

const toggle = () => {
  isOpen.value = !isOpen.value;
  emit('update:open', isOpen.value);
};

provide('collapsibleContext', {
  isOpen,
  toggle,
});
</script>
