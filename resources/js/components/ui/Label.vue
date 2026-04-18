<template>
  <label
    data-slot="label"
    :class="[
      'text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
      $attrs.class
    ]"
  >
    <slot />
  </label>
</template>

<script setup lang="ts">
// Label component
</script>
