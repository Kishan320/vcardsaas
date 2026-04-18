<template>
  <svg :class="$attrs.class" fill="none">
    <defs>
      <pattern :id="patternId" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3" stroke="currentColor" stroke-width="1" stroke-linecap="round"></path>
      </pattern>
    </defs>
    <rect stroke="none" :fill="`url(#${patternId})`" width="100%" height="100%"></rect>
  </svg>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const patternId = ref(`pattern-${Math.random().toString(36).slice(2, 11)}`);
</script>
