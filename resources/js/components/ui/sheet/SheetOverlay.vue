<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      data-slot="sheet-overlay"
      :class="['fixed inset-0 z-50 bg-black/80', $attrs.class]"
      @click="onOpenChange(false)"
    />
  </Transition>
</template>

<script setup lang="ts">
import { inject, type Ref } from 'vue';

const { isOpen, onOpenChange } = inject('sheetContext') as { isOpen: Ref<boolean>, onOpenChange: (v: boolean) => void };
</script>
