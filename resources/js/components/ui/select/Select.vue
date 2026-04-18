<template>
  <div class="relative w-full">
    <slot />
    <Teleport to="body">
      <div v-if="isOpen" class="fixed inset-0 z-[90]" @click="close" />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, toRef, watch } from 'vue';

const props = defineProps<{
  modelValue?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'onValueChange', value: string): void;
}>();

const isOpen = ref(false);
const selectedValue = toRef(props, 'modelValue');

const toggle = () => isOpen.value = !isOpen.value;
const close = () => isOpen.value = false;
const select = (val: string) => {
  emit('update:modelValue', val);
  emit('onValueChange', val);
  close();
};

provide('selectContext', { isOpen, selectedValue, toggle, close, select });
</script>
