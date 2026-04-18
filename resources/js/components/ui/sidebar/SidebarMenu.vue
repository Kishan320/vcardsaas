<template>
  <ul
    data-slot="sidebar-menu"
    data-sidebar="menu"
    :class="['flex w-full min-w-0 flex-col gap-1 pb-2', $attrs.class]"
  >
    <slot />
  </ul>
</template>

<script setup lang="ts">
// SidebarMenu component
</script>
