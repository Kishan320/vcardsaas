<template>
  <div
    data-slot="select-item"
    :class="[
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      $attrs.class
    ]"
    @click="select(value)"
  >
    <span v-if="selectedValue === value" class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <Check class="h-4 w-4" />
    </span>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject, type Ref } from 'vue';
import { Check } from 'lucide-vue-next';

const props = defineProps<{
  value: string;
}>();

const { select, selectedValue } = inject('selectContext') as { select: (v: string) => void, selectedValue: Ref<string|undefined> };
</script>
