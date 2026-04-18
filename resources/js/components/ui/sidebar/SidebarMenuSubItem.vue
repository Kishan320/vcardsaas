<template>
  <li
    data-slot="sidebar-menu-sub-item"
    data-sidebar="menu-sub-item"
    :class="['group/menu-sub-item relative', $attrs.class]"
  >
    <slot />
  </li>
</template>

<script setup lang="ts">
// SidebarMenuSubItem component
</script>
