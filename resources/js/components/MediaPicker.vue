<template>
  <div class="media-picker space-y-2">
    <Label v-if="label">{{ label }}</Label>
    
    <div class="flex items-center gap-2">
      <div class="flex-1" @click="isModalOpen = true">
        <Input
          :modelValue="displayValue"
          :placeholder="placeholder"
          readonly
          class="cursor-pointer"
        />
      </div>
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        @click="isModalOpen = true"
      >
        <ImageIcon class="w-4 h-4" />
      </Button>
      
      <Button
        v-if="safeValue"
        type="button"
        variant="outline"
        size="sm"
        @click="handleClear"
      >
        <X class="w-4 h-4" />
      </Button>
    </div>

    <!-- Preview -->
    <div v-if="showPreview && (props.multiple ? (Array.isArray(safeValue) && safeValue.length > 0) : safeValue)" class="mt-2">
      <div v-if="props.multiple && Array.isArray(safeValue) && safeValue.length > 1" class="grid grid-cols-3 gap-2">
        <img
          v-for="(url, index) in safeValue.slice(0, 3)"
          :key="index"
          :src="getFullUrl(url)"
          :alt="`${label || 'Preview'} ${index + 1}`"
          class="w-full h-auto rounded border"
          style="max-height: 100px;"
        />
        <div v-if="safeValue.length > 3" class="flex items-center justify-center border rounded bg-gray-100 text-gray-600 text-sm">
          +{{ safeValue.length - 3 }} more
        </div>
      </div>
      <img
        v-else
        :src="displayUrl"
        :alt="label || 'Preview'"
        class="max-w-full h-auto rounded border"
        style="max-height: 200px;"
      />
    </div>

    <!-- Media Library Modal -->
    <MediaLibraryModal
      :isOpen="isModalOpen"
      :multiple="multiple"
      @close="isModalOpen = false"
      @select="handleSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MediaLibraryModal from '@/components/MediaLibraryModal.vue';
import { Image as ImageIcon, X } from 'lucide-vue-next';

interface MediaPickerProps {
  label?: string;
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  placeholder?: string;
  showPreview?: boolean;
}

const props = withDefaults(defineProps<MediaPickerProps>(), {
  value: '',
  multiple: false,
  placeholder: 'Select image...',
  showPreview: true
});

const isModalOpen = ref(false);

const safeValue = computed(() => {
  if (!props.value) return props.multiple ? [] : '';
  return props.value;
});

const displayValue = computed(() => {
  if (props.multiple) {
    const values = Array.isArray(safeValue.value) ? safeValue.value : [];
    return values.length > 0 ? `${values.length} image(s) selected` : '';
  } else {
    return safeValue.value || '';
  }
});

const displayUrl = computed(() => {
  if (props.multiple) {
    // For multiple selection, show the first image for preview
    const values = Array.isArray(safeValue.value) ? safeValue.value : [];
    const url = values[0] || '';
    return getFullUrl(url);
  } else {
    const url = safeValue.value as string || '';
    return getFullUrl(url);
  }
});

const getFullUrl = (url: string) => {
  if (!url) return '';
  
  // If it's already a full URL, use it as is
  if (url.startsWith('http')) {
    return url;
  }
  
  // If it starts with /, add the base URL
  if (url.startsWith('/')) {
    return `${(window as any).appSettings?.imageUrl || ''}${url}`;
  }
  
  // Otherwise, assume it's a relative path
  return `${(window as any).appSettings?.imageUrl || ''}/${url}`;
};

const handleSelect = (selectedUrl: string | string[]) => {
  props.onChange(selectedUrl);
  isModalOpen.value = false;
};

const handleClear = () => {
  if (props.multiple) {
    props.onChange([]);
  } else {
    props.onChange('');
  }
};
</script>

<style scoped>
.media-picker {
  max-width: 100%;
}
</style>
