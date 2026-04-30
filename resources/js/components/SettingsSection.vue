<template>
  <Card class="mb-6">
    <CardHeader class="pb-3">
      <div class="flex items-center justify-between">
        <div>
          <CardTitle class="text-lg font-medium">{{ title }}</CardTitle>
          <CardDescription v-if="description" class="mt-1.5">
            {{ description }}
          </CardDescription>
        </div>
        <div v-if="action">
          <slot name="action">{{ action }}</slot>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <slot />
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

defineProps<{
  title: string;
  description?: string;
  action?: any;
}>();
</script>
