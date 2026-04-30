<script setup lang="ts">
import { inject, computed } from 'vue';
import { Circle } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

const props = defineProps<{
  value: string;
  id?: string;
  class?: string;
}>();

const context = inject<{ value: ReturnType<typeof computed<string>> }>('radio-group-context');
const isChecked = computed(() => context?.value.value === props.value);

const handleChange = () => {
  if (context) {
    context.value.value = props.value;
  }
};
</script>

<template>
  <div class="relative">
    <input
      type="radio"
      :id="id"
      :value="value"
      :checked="isChecked"
      @change="handleChange"
      class="peer sr-only"
    />
    <div
      :class="cn(
        'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 peer-checked:bg-primary peer-checked:border-primary',
        props.class
      )"
    >
      <div v-if="isChecked" class="flex items-center justify-center h-full">
        <Circle class="h-2.5 w-2.5 fill-white text-white" />
      </div>
    </div>
  </div>
</template>
