<template>
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="isOpen"
      data-slot="popover-content"
      :class="[
        'absolute z-50 w-72 rounded-md border bg-white p-4 shadow-md mt-2 origin-top-right right-0',
        $attrs.class
      ]"
    >
      <slot />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { inject, type Ref } from 'vue';

const { isOpen } = inject('popoverContext') as { isOpen: Ref<boolean> };
</script>
