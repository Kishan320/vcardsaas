<script setup lang="ts">
import { ref, computed } from 'vue';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-vue-next';

declare global {
  interface Window {
    isDemo?: boolean;
  }
}

defineProps<{
  id: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'password';
  isSecret?: boolean;
  error?: string;
  className?: string;
}>();

const modelValue = defineModel<string>();

const showSecret = ref(false);

const isDemoMode = computed(() => {
  return typeof window !== 'undefined' && window.isDemo;
});

const inputType = computed(() => {
  return props.isSecret ? (showSecret.value ? 'text' : 'password') : (props.type || 'text');
});

const displayValue = computed(() => {
  if (isDemoMode.value && props.isSecret && modelValue.value) {
    return '************';
  }
  return modelValue.value;
});
</script>

<template>
  <div class="space-y-2">
    <Label :for="id">{{ label }}</Label>
    <div class="relative">
      <Input
        :id="id"
        :type="inputType"
        :value="displayValue"
        @input="modelValue = ($event.target as HTMLInputElement).value"
        :placeholder="placeholder"
        :class="`font-mono text-sm ${isSecret ? 'pr-10' : ''} ${className || ''}`"
        :readonly="isDemoMode && isSecret && modelValue"
      />
      <Button
        v-if="isSecret"
        type="button"
        variant="ghost"
        size="icon"
        class="absolute right-0 top-0 h-full px-3 text-muted-foreground"
        @click="showSecret = !showSecret"
        :disabled="isDemoMode"
      >
        <EyeOff v-if="showSecret" :size="16" />
        <Eye v-else :size="16" />
      </Button>
    </div>
    <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
  </div>
</template>
