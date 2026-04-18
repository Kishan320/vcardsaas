<template>
  <div
    data-slot="avatar-fallback"
    :class="[
      'bg-muted flex size-full items-center justify-center rounded-full',
      $attrs.class
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
// AvatarFallback component
</script>
