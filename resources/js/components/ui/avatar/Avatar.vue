<template>
  <div
    data-slot="avatar"
    :class="[
      'relative flex size-8 shrink-0 overflow-hidden rounded-full',
      $attrs.class
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
// Avatar component
</script>
