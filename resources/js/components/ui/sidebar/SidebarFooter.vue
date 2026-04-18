<template>
  <div
    data-slot="sidebar-footer"
    data-sidebar="footer"
    :class="['flex flex-col gap-2 p-2', $attrs.class]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
// SidebarFooter component
</script>
