<template>
  <td
    data-slot="table-cell"
    :class="[
      'p-4 align-middle [&:has([role=checkbox])]:pr-0 text-foreground',
      $attrs.class
    ]"
  >
    <slot />
  </td>
</template>

<script setup lang="ts">
// TableCell component
</script>
