<template>
  <Separator
    data-slot="sidebar-separator"
    data-sidebar="separator"
    :class="['bg-sidebar-border mx-2 w-auto', $attrs.class]"
  />
</template>

<script setup lang="ts">
import { Separator } from '@/components/ui/separator';
</script>
