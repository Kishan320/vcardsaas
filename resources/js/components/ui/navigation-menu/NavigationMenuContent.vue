<template>
  <div
    v-if="isOpen"
    data-slot="navigation-menu-content"
    :class="[
      'top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto bg-popover text-popover-foreground border rounded-md shadow duration-200 mt-1.5',
      $attrs.class
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject, computed, type Ref } from 'vue';

const { value } = inject('navigationMenuContext') as { value: Ref<string|null> };

const props = defineProps<{
  value?: string;
}>();

const isOpen = computed(() => {
  if (props.value) return value.value === props.value;
  return value.value !== null;
});
</script>
