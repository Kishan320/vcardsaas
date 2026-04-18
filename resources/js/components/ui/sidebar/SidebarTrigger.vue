<template>
  <Button
    data-sidebar="trigger"
    data-slot="sidebar-trigger"
    variant="ghost"
    size="icon"
    :class="['h-7 w-7', $attrs.class]"
    @click="toggleSidebar"
  >
    <PanelLeftIcon />
    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { PanelLeftIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

const { toggleSidebar } = inject('sidebarContext') as { toggleSidebar: () => void };
</script>
