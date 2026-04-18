<template>
  <button
    type="button"
    data-slot="navigation-menu-trigger"
    :class="[
      'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1',
      $attrs.class
    ]"
    @click="toggle"
  >
    <slot />
    <ChevronDownIcon
      class="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </button>
</template>

<script setup lang="ts">
import { inject, type Ref } from 'vue';
import { ChevronDownIcon } from 'lucide-vue-next';

const { value, onValueChange } = inject('navigationMenuContext') as { value: Ref<string|null>, onValueChange: (v: string|null) => void };

const props = defineProps<{
  value?: string;
}>();

const toggle = () => {
  if (value.value === props.value) {
    onValueChange(null);
  } else {
    onValueChange(props.value || 'open');
  }
};
</script>
