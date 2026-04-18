<template>
  <!-- Status Badge Component -->
  <StatusBadge v-if="type === 'status'" :value="value" :color-map="colorMap" :default-color="defaultColor" />
  
  <!-- Image Column Component -->
  <ImageColumn v-else-if="type === 'image'" :src="value" :alt="alt" :class-name="className" :fallback-src="fallbackSrc" />
  
  <!-- Price Column Component -->
  <PriceColumn v-else-if="type === 'price'" :value="value" :currency="currency" :locale="locale" />
  
  <!-- Date Column Component -->
  <DateColumn v-else-if="type === 'date'" :value="value" :format="format" :locale="locale" />
  
  <!-- Default Text -->
  <span v-else>{{ value || '-' }}</span>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  value: any;
  colorMap?: Record<string, string>;
  defaultColor?: string;
}

const StatusBadge = ({ 
  value, 
  colorMap = {}, 
  defaultColor = 'bg-gray-100 text-gray-800' 
}: StatusBadgeProps) => {
  if (!value) return <span>-</span>;
  
  const color = colorMap[value] || defaultColor;
  
  return (
    <Badge :class="cn('capitalize', color)">
      {{ value }}
    </Badge>
  );
};

interface ImageColumnProps {
  src: any;
  alt?: string;
  className?: string;
  fallbackSrc?: string;
}

const ImageColumn = ({ 
  src, 
  alt = 'Image', 
  className = 'h-16 w-20 rounded-md object-cover shadow-sm',
  fallbackSrc = 'https://placehold.co/200x150?text=Image+Not+Found'
}: ImageColumnProps) => {
  if (!src) {
    return <div class="text-center text-gray-400">No image</div>;
  }
  
  const imageSrc = typeof src === 'string' && src.startsWith('http') ? src : `/storage/${src}`;
  
  return (
    <div class="flex justify-center">
      <img 
        :src="imageSrc" 
        :alt="alt" 
        :class="className" 
        @error="(e: any) => { e.currentTarget.src = fallbackSrc; }"
      />
    </div>
  );
};

interface PriceColumnProps {
  value: any;
  currency?: string;
  locale?: string;
}

const PriceColumn = ({ 
  value, 
  currency = 'USD', 
  locale = 'en-US' 
}: PriceColumnProps) => {
  if (!value && value !== 0) return <span>-</span>;
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return (
    <span class="text-sm font-medium">
      {{ numValue.toLocaleString(locale, { style: 'currency', currency }) }}
    </span>
  );
};

interface DateColumnProps {
  value: any;
  format?: Intl.DateTimeFormatOptions;
  locale?: string;
}

const DateColumn = ({ 
  value, 
  format = { dateStyle: 'medium' },
  locale = 'en-US'
}: DateColumnProps) => {
  if (!value) return <span>-</span>;
  
  try {
    const date = new Date(value);
    return <span class="text-sm">{{ date.toLocaleDateString(locale, format) }}</span>;
  } catch (e) {
    return <span class="text-sm">{{ value }}</span>;
  }
};

// Component props
interface CrudColumnRenderersProps {
  type: 'status' | 'image' | 'price' | 'date' | 'text';
  value: any;
  colorMap?: Record<string, string>;
  defaultColor?: string;
  alt?: string;
  className?: string;
  fallbackSrc?: string;
  currency?: string;
  locale?: string;
  format?: Intl.DateTimeFormatOptions;
}

defineProps<CrudColumnRenderersProps>();
</script>

<style scoped>
.crud-column-renderers {
  /* Component styles are handled by Tailwind classes */
}
</style>
