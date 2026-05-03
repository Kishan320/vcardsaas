<template>
<button
  type="button"
  role="switch"
  :aria-checked="checked"
  @click="toggle"
  :class="[
    'relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    checked ? 'bg-primary' : 'bg-gray-300'
  ]"
>
  <span
    :class="[
      'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
      checked ? 'translate-x-4' : 'translate-x-1'
    ]"
  />
</button>
</template>

<script setup lang="ts">
const props = defineProps<{ checked?: boolean }>();
const emit = defineEmits<{ 'update:checked': [value: boolean] }>();

const toggle = () => {
  emit('update:checked', !props.checked);
};
</script>
