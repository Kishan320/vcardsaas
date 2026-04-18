<template>
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      data-slot="dialog-overlay"
      :class="[
        'fixed inset-0 bg-black/50 backdrop-blur-sm',
        $attrs.class
      ]"
      :style="{ zIndex }"
      @click="onOpenChange(false)"
    />
  </Transition>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue';
import { useModalStack } from '@/composables/useModalStack';

interface DialogContext {
  isOpen: { value: boolean };
  onOpenChange: (value: boolean) => void;
}

const { isOpen, onOpenChange } = inject('dialogContext') as DialogContext;
const { getZIndex } = useModalStack();

const props = defineProps<{
  modalId?: string;
}>();

const zIndex = computed(() => props.modalId ? getZIndex(props.modalId) : 50);
</script>
