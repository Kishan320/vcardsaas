<template>
  <div
    data-slot="sheet-header"
    :class="['flex flex-col gap-1.5 p-4', $attrs.class]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
// SheetHeader component
</script>
