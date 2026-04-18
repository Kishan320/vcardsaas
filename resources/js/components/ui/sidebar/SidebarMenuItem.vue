<template>
  <li
    data-slot="sidebar-menu-item"
    data-sidebar="menu-item"
    :class="['group/menu-item relative', $attrs.class]"
  >
    <slot />
  </li>
</template>

<script setup lang="ts">
// SidebarMenuItem component
</script>
