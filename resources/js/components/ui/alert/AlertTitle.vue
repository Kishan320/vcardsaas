<template>
  <div
    data-slot="alert-title"
    :class="[
      'col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight',
      $attrs.class
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
// AlertTitle component
</script>
