<template>
  <th
    data-slot="table-head"
    :class="[
      'h-12 px-4 text-left align-middle font-medium text-muted-foreground dark:text-gray-300 [&:has([role=checkbox])]:pr-0',
      $attrs.class
    ]"
  >
    <slot />
  </th>
</template>

<script setup lang="ts">
// TableHead component
</script>
