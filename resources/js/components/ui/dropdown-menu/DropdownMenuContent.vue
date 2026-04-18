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
      data-slot="dropdown-menu-content"
      :class="[
        'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md mt-2 origin-top-right right-0',
        $attrs.class
      ]"
    >
      <slot />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { inject, type Ref } from 'vue';

const { isOpen } = inject('dropdownContext') as { isOpen: Ref<boolean> };
</script>
