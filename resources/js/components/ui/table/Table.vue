<template>
  <div class="relative w-full overflow-auto dark:bg-gray-900">
    <table
      data-slot="table"
      :class="['w-full caption-bottom text-sm text-foreground dark:bg-gray-900', $attrs.class]"
    >
      <slot />
    </table>
  </div>
</template>

<script setup lang="ts">
// Table base component
</script>
