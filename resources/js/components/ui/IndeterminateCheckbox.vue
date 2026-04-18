<template>
  <div
    data-slot="indeterminate-checkbox"
    :data-state="state"
    :class="[
      'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground flex items-center justify-center cursor-pointer transition-colors',
      $attrs.class
    ]"
    @click="toggle"
  >
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="scale-95 opacity-0"
      enter-to-class="scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="scale-100 opacity-100"
      leave-to-class="scale-95 opacity-0"
    >
      <Minus v-if="indeterminate" class="h-3 w-3 text-current" />
      <Check v-else-if="checked" class="h-4 w-4 text-current" />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Check, Minus } from 'lucide-vue-next';

const props = defineProps<{
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:checked', value: boolean): void;
  (e: 'change', value: boolean): void;
}>();

const state = computed(() => {
  if (props.indeterminate) return 'indeterminate';
  return props.checked ? 'checked' : 'unchecked';
});

const toggle = () => {
  if (props.disabled) return;
  const newValue = !props.checked;
  emit('update:checked', newValue);
  emit('change', newValue);
};
</script>
