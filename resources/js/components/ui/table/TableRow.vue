<template>
  <tr
    data-slot="table-row"
    :class="[
      'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted text-foreground dark:border-gray-700 dark:bg-gray-900',
      $attrs.class
    ]"
  >
    <slot />
  </tr>
</template>

<script setup lang="ts">
// TableRow component
</script>
