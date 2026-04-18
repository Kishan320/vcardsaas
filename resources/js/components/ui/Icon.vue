<template>
  <component :is="iconNode" v-if="iconNode" :class="className" />
</template>

<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  iconNode?: Component | null;
  className?: string;
}>();
</script>
