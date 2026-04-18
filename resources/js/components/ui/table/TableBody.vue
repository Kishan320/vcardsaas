<template>
  <tbody
    data-slot="table-body"
    :class="['[&_tr:last-child]:border-0', $attrs.class]"
  >
    <slot />
  </tbody>
</template>

<script setup lang="ts">
// TableBody component
</script>
