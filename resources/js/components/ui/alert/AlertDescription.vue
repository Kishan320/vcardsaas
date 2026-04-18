<template>
  <div
    data-slot="alert-description"
    :class="[
      'text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed',
      $attrs.class
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
// AlertDescription component
</script>
