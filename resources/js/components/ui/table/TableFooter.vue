<template>
  <tfoot
    data-slot="table-footer"
    :class="[
      'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
      $attrs.class
    ]"
  >
    <slot />
  </tfoot>
</template>

<script setup lang="ts">
// TableFooter component
</script>
